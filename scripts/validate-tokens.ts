#!/usr/bin/env node
/**
 * Geeklego Token Validator
 *
 * Reads design-system/geeklego.css and checks that every var(--name)
 * reference has a corresponding --name: declaration somewhere in the file.
 *
 * Usage:
 *   npm run validate-tokens
 *
 * Exits 0 if all references are valid, 1 if broken refs are found.
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { glob } from 'node:fs'
import { promisify } from 'node:util'
const globAsync = promisify(glob)

const __dirname = dirname(fileURLToPath(import.meta.url))
const cssPath = resolve(__dirname, '../design-system/geeklego.css')

export function validateCssTokens(css: string): {
  definedCount: number
  broken: Array<{ name: string; line: number }>
} {
  // Collect all defined token names (--name: declarations)
  const defined = new Set<string>()
  const defineRegex = /--([\w-]+)\s*:/g
  let match: RegExpExecArray | null
  while ((match = defineRegex.exec(css)) !== null) {
    defined.add(match[1])
  }

  // Collect all var(--name) references, report first occurrence of each broken one
  const broken: Array<{ name: string; line: number }> = []
  const reported = new Set<string>()
  const lines = css.split('\n')
  lines.forEach((line, i) => {
    const varRegex = /var\(--([\w-]+)\)/g
    let m: RegExpExecArray | null
    while ((m = varRegex.exec(line)) !== null) {
      const name = m[1]
      if (!defined.has(name) && !reported.has(name)) {
        broken.push({ name, line: i + 1 })
        reported.add(name)
      }
    }
  })

  return { definedCount: defined.size, broken }
}

export interface ComponentRef { filePath: string; content: string }
export interface BrokenComponentRef { name: string; file: string; line: number }

// Tokens that start with these prefixes are Tailwind internals, not design system tokens.
// They should not be validated against geeklego.css.
const TAILWIND_INTERNAL_PREFIXES = ['tw-', 'spacing-', 'font-', 'text-', 'color-']

// Known property prefixes that should NOT appear at the start of a component token name.
// Component tokens must start with the component name: --{component}-{property}-{scale}.
const MISPLACED_PREFIXES = ['size-', 'color-', 'spacing-', 'icon-', 'radius-', 'border-', 'shadow-', 'text-']

// Dynamic CSS custom props set via inline styles (e.g., style={{ '--var': value }})
// These should not appear in geeklego.css as they're computed at runtime
const INLINE_STYLE_VARS = new Set([
  'spectrum-hue-color',
  'track-bg',
])

export function validateTokenNamingConvention(css: string): string[] {
  const warnings: string[] = []

  // Regex to extract component blocks with their contents
  // Matches: /* ComponentName — generated YYYY-MM-DD */ followed by tokens up to the next /* or end of file
  const componentBlockRegex = /\/\*\s+[\w\s]+ — generated \d{4}-\d{2}-\d{2}\s*\*\/([\s\S]*?)(?=\/\*|$)/g

  let componentMatch: RegExpExecArray | null
  while ((componentMatch = componentBlockRegex.exec(css)) !== null) {
    const blockContent = componentMatch[1]

    // Now scan tokens ONLY within this component block
    const defineRegex = /--([\w-]+)\s*:/g
    let tokenMatch: RegExpExecArray | null
    while ((tokenMatch = defineRegex.exec(blockContent)) !== null) {
      const name = tokenMatch[1]

      // Skip inline style vars - they don't appear in CSS component blocks
      if (INLINE_STYLE_VARS.has(name)) continue

      // Check naming convention - skip legitimate patterns like --size-icon-sm, --radius-component-xs
      const isLegitimateComponentToken = /[a-z]+-(icon|component|layer)$/.test(name)
      if (isLegitimateComponentToken) continue

      // Flag tokens that have a property prefix at the start and a size scale at the end
      for (const prefix of MISPLACED_PREFIXES) {
        if (name.startsWith(prefix) && /-(xs|sm|md|lg|xl|2xl|3xl)$/.test(name)) {
          warnings.push(`  Possible naming violation: --${name} (property prefix '${prefix}' before component name?)`)
          break
        }
      }
    }
  }

  return warnings
}

export function validateComponentTokenRefs(
  css: string,
  componentFiles: ComponentRef[]
): { broken: BrokenComponentRef[] } {
  // Build the set of all defined token names from geeklego.css
  const defined = new Set<string>()
  const defineRegex = /--([\w-]+?)\s*?(?::|;)/g
  let m: RegExpExecArray | null
  while ((m = defineRegex.exec(css)) !== null) {
    defined.add(m[1])
  }

  const broken: BrokenComponentRef[] = []

  for (const { filePath, content } of componentFiles) {
    const lines = content.split('\n')
    // Track if we're inside a style={{ ... }} block
    let inStyleBlock = false
    
    lines.forEach((line, i) => {
      // Check if entering or inside a style block
      if (line.includes('style={{') || inStyleBlock) {
        inStyleBlock = true
        // Check if leaving style block
        if (line.includes('} as') || (line.includes('}') && line.trim().endsWith('}'))) {
          // Only end style block if this is closing the style prop, not just any }
          if (line.includes('} as') || line.match(/\}\s*(?=\s*[}>])/)) {
            inStyleBlock = false
          }
        }
      }
      
      const varRegex = /var\(--([\w-]+)\)/g
      let match: RegExpExecArray | null
      while ((match = varRegex.exec(line)) !== null) {
        const name = match[1]
        // Skip Tailwind internals
        if (TAILWIND_INTERNAL_PREFIXES.some(prefix => name.startsWith(prefix))) continue
        // Skip icon component tokens (e.g., --size-icon-sm) - used as react props to lucide-react
        if (/[a-z]+-(icon|component|layer)-(xs|sm|md|lg|xl|2xl|3xl)$/.test(name)) continue
        // Skip inline style CSS custom properties set dynamically via React inline styles
        if (INLINE_STYLE_VARS.has(name)) continue
        if (!defined.has(name)) {
          broken.push({ name, file: filePath, line: i + 1 })
        }
      }
    })
  }

  return { broken }
}

// Run when executed directly (ESM check for main module)
if (import.meta.url === `file://${process.argv[1]}`) {
async function main() {
  try {
    const css = readFileSync(cssPath, 'utf-8')
    const { definedCount, broken } = validateCssTokens(css)

    console.log('\nGeeklego Token Validator')
    console.log('─────────────────────────')
    console.log(`Defined tokens : ${definedCount}`)

    if (broken.length === 0) {
      console.log('✓  All token references are valid.\n')
    } else {
      console.log(`\n✕  ${broken.length} broken reference(s) found:\n`)
      broken.forEach(({ name, line }) => {
        console.log(`   var(--${name})   (first seen: line ${line})`)
      })
      console.log(
        '\nFix: update the component token block in design-system/geeklego.css\n' +
        'to reference the correct semantic token names.\n'
      )
      process.exit(1)
    }

    // Cross-file validation: scan all component .tsx files for var() references
    const componentGlob = resolve(__dirname, '../components/**/*.tsx')
    const componentFilePaths = (await globAsync(componentGlob)) as string[]

    const refs: ComponentRef[] = await Promise.all(
      componentFilePaths.map(async (fp: string) => ({
        filePath: fp.replace(resolve(__dirname, '..') + '/', ''),
        content: await readFileSync(fp, 'utf-8'),
      }))
    )

    const { broken: componentBroken } = validateComponentTokenRefs(css, refs)

    if (componentBroken.length > 0) {
      console.log(`\n✕  ${componentBroken.length} broken token reference(s) in component files:\n`)
      componentBroken.forEach(({ name, file, line }) => {
        console.log(`   var(--${name})   in ${file}:${line}`)
      })
      process.exit(1)
    } else {
      console.log('✓  All component var() references are valid.\n')
    }

    // Naming convention check (hard failure if violations found)
    const namingWarnings = validateTokenNamingConvention(css)
    if (namingWarnings.length > 0) {
      console.log(`\n✕  ${namingWarnings.length} naming convention violation(s) found:\n`)
      console.log('Component tokens must use --{component}-{property}-{scale} format.')
      console.log('Example correct:   --avatar-size-md')
      console.log('Example wrong:     --size-avatar-md\n')
      namingWarnings.forEach(w => console.log(w))
      process.exit(1)
    } else {
      console.log('\n✓  Naming convention check passed.\n')
    }
  } catch (err) {
    console.error('Error:', err)
    process.exit(1)
  }
}

main()
}
