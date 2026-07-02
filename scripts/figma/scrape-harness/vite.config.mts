/**
 * Vite config for the scrape harness. React + the Tailwind v4 plugin so the
 * v2 design-system CSS compiles exactly as it does in Storybook/the app —
 * the scraped computed styles are then ground truth.
 *
 * The generator (`build-component-manifest.ts`) starts this in preview/dev mode
 * on a fixed port and drives it with Playwright.
 */
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root,
  plugins: [react(), tailwindcss()],
  server: { port: 5199, strictPort: true },
  preview: { port: 5199, strictPort: true },
  build: {
    outDir: fileURLToPath(new URL("./dist", import.meta.url)),
    emptyOutDir: true,
  },
});
