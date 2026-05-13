/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import autoprefixer from 'autoprefixer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const DESIGN_SYSTEM_DIR = path.join(dirname, 'design-system');
const GEEKLEGO_CSS = path.join(DESIGN_SYSTEM_DIR, 'geeklego.css');
const GEEKLEGO_DEFAULT_CSS = path.join(DESIGN_SYSTEM_DIR, 'geeklego.default.css');
const COMPONENT_TOKENS_MARKER = '/* ─── GENERATED COMPONENT TOKENS ──────────────────────────────────────────';

function tokenApiPlugin(): Plugin {
  return {
    name: 'geeklego-token-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        if (url === '/api/load-tokens' && req.method === 'GET') {
          try {
            const { parseGeeklegoCss } = await import('./app/src/utils/cssParser');
            const cssText = await fs.readFile(GEEKLEGO_CSS, 'utf-8');
            const tokens = parseGeeklegoCss(cssText);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, tokens }));
          } catch (e: any) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
          return;
        }

        if (url === '/api/component-tokens' && req.method === 'GET') {
          try {
            const css = await fs.readFile(GEEKLEGO_CSS, 'utf-8');
            const markerIndex = css.indexOf(COMPONENT_TOKENS_MARKER);
            if (markerIndex === -1) throw new Error('Component tokens marker not found');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, css: css.slice(markerIndex) }));
          } catch (e: any) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
          return;
        }

        if (url === '/api/save-tokens' && req.method === 'POST') {
          try {
            const { generateCss } = await import('./app/src/utils/cssGenerator');
            const body: string = await new Promise((resolve, reject) => {
              let d = ''; req.on('data', c => d += c); req.on('end', () => resolve(d)); req.on('error', reject);
            });
            const tokens = JSON.parse(body);
            const currentCss = await fs.readFile(GEEKLEGO_CSS, 'utf-8');
            const markerIndex = currentCss.indexOf(COMPONENT_TOKENS_MARKER);
            if (markerIndex === -1) throw new Error('Marker not found');
            const newTopCss = generateCss(tokens);
            const newFullCss = newTopCss + '\n\n' + currentCss.slice(markerIndex);
            // Strip date line before comparing so a no-op save never writes to disk
            const stripDate = (s: string) => s.replace(/^   Date: .+$/m, '   Date: __NORMALIZED__');
            if (stripDate(newFullCss) === stripDate(currentCss)) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, unchanged: true }));
              return;
            }
            try { await fs.access(GEEKLEGO_DEFAULT_CSS); } catch { await fs.copyFile(GEEKLEGO_CSS, GEEKLEGO_DEFAULT_CSS); }
            await fs.writeFile(GEEKLEGO_CSS, newFullCss, 'utf-8');
            if (server.hot) server.hot.send('geeklego:tokens-updated', {});
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (e: any) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
          return;
        }

        if (url === '/api/save-component-tokens' && req.method === 'POST') {
          try {
            const body: string = await new Promise((resolve, reject) => {
              let d = ''; req.on('data', c => d += c); req.on('end', () => resolve(d)); req.on('error', reject);
            });
            const currentCss = await fs.readFile(GEEKLEGO_CSS, 'utf-8');
            const markerIndex = currentCss.indexOf(COMPONENT_TOKENS_MARKER);
            if (markerIndex === -1) throw new Error('Marker not found');
            await fs.writeFile(GEEKLEGO_CSS, currentCss.slice(0, markerIndex) + body, 'utf-8');
            if (server.hot) server.hot.send('geeklego:component-tokens-updated', {});
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (e: any) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
          return;
        }

        if (url === '/api/restore-default' && req.method === 'POST') {
          try {
            const defaultCss = await fs.readFile(GEEKLEGO_DEFAULT_CSS, 'utf-8');
            await fs.writeFile(GEEKLEGO_CSS, defaultCss, 'utf-8');
            if (server.hot) server.hot.send('geeklego:tokens-restored', {});
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (e: any) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = e.code === 'ENOENT' ? 404 : 500;
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
          return;
        }

        next();
      });
    }
  };
}

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tokenApiPlugin(),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer()]
    }
  },
  server: {
    port: 5176
  },
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: ['app/src/**/*.test.ts'],
        }
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook')
          })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{
              browser: 'chromium'
            }]
          },
          setupFiles: [path.join(dirname, '.storybook/vitest.setup.ts')]
        }
      }
    ]
  }
});
