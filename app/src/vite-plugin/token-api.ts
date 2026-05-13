import type { Plugin } from 'vite'
import fs from 'fs/promises'
import path from 'path'
import { parseGeeklegoCss } from '../utils/cssParser'
import { generateCss } from '../utils/cssGenerator'
import type { GeeklegoTokens } from '../types'
import type { CategorizationResult } from '../utils/componentTokenParser'

const DESIGN_SYSTEM_DIR = path.resolve(process.cwd(), 'design-system')
const GEEKLEGO_CSS = path.join(DESIGN_SYSTEM_DIR, 'geeklego.css')
const GEEKLEGO_DEFAULT_CSS = path.join(DESIGN_SYSTEM_DIR, 'geeklego.default.css')
const COMPONENT_TOKENS_MARKER = '/* ─── GENERATED COMPONENT TOKENS ──────────────────────────────────────────'

export function tokenApiPlugin(): Plugin {
  return {
    name: 'geeklego-token-api',
    configureServer(server) {
      // Handle GET /api/load-tokens
      server.middlewares.use('/api/load-tokens', async (req, res, next) => {
        if (req.method !== 'GET') return next()

        try {
          const cssText = await fs.readFile(GEEKLEGO_CSS, 'utf-8')
          const tokens = parseGeeklegoCss(cssText)

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            success: true,
            tokens
          }))
        } catch (error) {
          console.error('Error loading tokens:', error)
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 500; res.end(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to load tokens'
          }))
        }
      })

      // Handle POST /api/save-tokens
      server.middlewares.use('/api/save-tokens', async (req, res, next) => {
        if (req.method !== 'POST') return next()

        try {
          const body = await new Promise<string>((resolve, reject) => {
            let data = ''
            req.on('data', chunk => data += chunk)
            req.on('end', () => resolve(data))
            req.on('error', reject)
          })

          const tokens = JSON.parse(body) as GeeklegoTokens

          // Generate the top CSS (covers lines 1-1719, up to component tokens marker)
          const topCss = generateCss(tokens)

          // Read current file to find component tokens section
          const currentCss = await fs.readFile(GEEKLEGO_CSS, 'utf-8')
          const markerIndex = currentCss.indexOf(COMPONENT_TOKENS_MARKER)

          if (markerIndex === -1) {
            throw new Error('Component tokens marker not found in geeklego.css')
          }

          // Extract component tokens section
          const componentTokensSection = currentCss.slice(markerIndex)

          // Combine top CSS + component tokens
          const newCss = topCss + '\n\n' + componentTokensSection

          // Backup on first save
          try {
            await fs.access(GEEKLEGO_DEFAULT_CSS)
            // File exists, don't backup
          } catch {
            // File doesn't exist, backup it
            await fs.copyFile(GEEKLEGO_CSS, GEEKLEGO_DEFAULT_CSS)
          }

          // Write back to geeklego.css
          await fs.writeFile(GEEKLEGO_CSS, newCss, 'utf-8')

          // Trigger HMR
          if (server.hot) {
            server.hot.send('geeklego:tokens-updated', {})
          }

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            success: true
          }))
        } catch (error) {
          console.error('Error saving tokens:', error)
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 500; res.end(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to save tokens'
          }))
        }
      })

      // Handle GET /api/component-tokens
      server.middlewares.use('/api/component-tokens', async (req, res, next) => {
        if (req.method !== 'GET') return next()

        try {
          const css = await fs.readFile(GEEKLEGO_CSS, 'utf-8')

          // Find and extract component tokens section
          const markerIndex = css.indexOf(COMPONENT_TOKENS_MARKER)
          if (markerIndex === -1) {
            throw new Error('Component tokens marker not found')
          }

          // Extract from marker to end of file
          const componentTokensCss = css.slice(markerIndex)

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            success: true,
            css: componentTokensCss
          }))
        } catch (error) {
          console.error('Error loading component tokens:', error)
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 500; res.end(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to load component tokens'
          }))
        }
      })

      // Handle POST /api/save-component-tokens
      server.middlewares.use('/api/save-component-tokens', async (req, res, next) => {
        if (req.method !== 'POST') return next()

        try {
          const body = await new Promise<string>((resolve, reject) => {
            let data = ''
            req.on('data', chunk => data += chunk)
            req.on('end', () => resolve(data))
            req.on('error', reject)
          })

          const newComponentCss = body

          // Read current file
          const currentCss = await fs.readFile(GEEKLEGO_CSS, 'utf-8')
          const markerIndex = currentCss.indexOf(COMPONENT_TOKENS_MARKER)

          if (markerIndex === -1) {
            throw new Error('Component tokens marker not found')
          }

          // Split into top part + old component tokens
          const topPart = currentCss.slice(0, markerIndex)

          // Combine: top part + new component tokens
          const newCss = topPart + newComponentCss

          // Write back
          await fs.writeFile(GEEKLEGO_CSS, newCss, 'utf-8')

          // Trigger HMR
          if (server.hot) {
            server.hot.send('geeklego:component-tokens-updated', {})
          }

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            success: true
          }))
        } catch (error) {
          console.error('Error saving component tokens:', error)
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 500; res.end(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to save component tokens'
          }))
        }
      })

      // Handle GET /api/categorize/:componentName
      server.middlewares.use('/api/categorize', async (req, res, next) => {
        if (req.method !== 'GET') return next()

        const url = new URL(req.url!, `http://localhost`)
        const componentName = url.pathname.split('/').pop()

        if (!componentName) {
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 400
          res.end(JSON.stringify({ success: false, error: 'Missing component name' }))
          return
        }

        // Scan components directory to find which tier folder the component lives in
        const fsMod = await import('fs/promises')
        const tiers = [
          { name: 'atoms', level: 'atom' as const },
          { name: 'molecules', level: 'molecule' as const },
          { name: 'organisms', level: 'organism' as const },
        ]

        let foundLevel: CategorizationResult['level'] = 'unknown'
        let confidence = 0
        let reason = 'Could not determine level'

        for (const { name, level } of tiers) {
          const folder = path.resolve(
            process.cwd(),
            'components',
            name,
            componentName,
          )
          try {
            await fsMod.access(folder)
            foundLevel = level
            confidence = 90
            reason = `Found in ${name} folder`
            break
          } catch {
            continue
          }
        }

        // Fallback: scan TSX file for component import depth
        if (foundLevel === 'unknown' && componentName) {
          const candidates = ['atoms', 'molecules', 'organisms']
          for (const tier of candidates) {
            try {
              const tsxPath = path.resolve(
                process.cwd(),
                'components',
                tier,
                componentName,
                `${componentName}.tsx`,
              )
              const content = await fsMod.readFile(tsxPath, 'utf-8')
              // Count imported components (exclude utils/icons/lucide/tailwind)
              const imports = content.match(/import\s+\{[^}]+\}\s+from\s+['"](\.\.?\/[^'"]+)['"]/g) || []
              let componentImportCount = 0
              for (const imp of imports) {
                if (imp.match(/from\s+['"]\.\..*\/atoms\//)) componentImportCount++
                if (imp.match(/from\s+['"]\.\..*\/molecules\//)) componentImportCount++
                if (imp.match(/from\s+['"]\.\..*\/organisms\//)) componentImportCount++
              }
              if (componentImportCount === 0) {
                foundLevel = 'atom'
                confidence = 80
                reason = 'No component imports detected'
              } else if (componentImportCount <= 2) {
                foundLevel = 'molecule'
                confidence = 70
                reason = `${componentImportCount} component import(s) detected`
              } else {
                foundLevel = 'organism'
                confidence = 60
                reason = `${componentImportCount} component imports detected`
              }
              break
            } catch {
              continue
            }
          }
        }

        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({
          success: true,
          level: foundLevel,
          confidence,
          reason,
        }))
      })

      // Handle POST /api/restore-default
      server.middlewares.use('/api/restore-default', async (req, res, next) => {
        if (req.method !== 'POST') return next()

        try {
          // Check if backup exists
          try {
            await fs.access(GEEKLEGO_DEFAULT_CSS)
            // Read backup
            const defaultCss = await fs.readFile(GEEKLEGO_DEFAULT_CSS, 'utf-8')

            // Write to main file
            await fs.writeFile(GEEKLEGO_CSS, defaultCss, 'utf-8')

            // Trigger HMR
            if (server.hot) {
              server.hot.send('geeklego:tokens-restored', {})
            }

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              success: true
            }))
          } catch (backupError) {
            // Backup file doesn't exist
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 404; res.end(JSON.stringify({
              success: false,
              error: 'Default backup file not found'
            }))
          }
        } catch (error) {
          console.error('Error restoring default:', error)
          res.setHeader('Content-Type', 'application/json')
          res.statusCode = 500; res.end(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to restore default'
          }))
        }
      })
    }
  }
}