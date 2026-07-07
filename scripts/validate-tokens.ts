#!/usr/bin/env node
/**
 * Geeklego Token Validator (v2 — 2-tier)
 *
 * Reads the v2 design system (design-system/v2/{primitives,semantics,themes/dark}.css),
 * concatenated, and checks that every var(--name) reference resolves to a --name:
 * declaration somewhere in the chain (primitive → semantic → utility). It also scans
 * the v2 component files for broken var() refs and hardcoded values.
 *
 * 2-tier note: there is NO component-token tier in v2. The old component-tier passes
 * (cross-block component duplicates, the --{component}-{property}-{scale} naming rule,
 * and the "no primitives in TSX" rule) have been removed. v2 components style with
 * standard semantic Tailwind utilities (bg-primary, …) rather than var() refs in TSX,
 * so the only var() refs expected in components are the namespaced --ext-* tokens.
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

// The v2 design system is split across three files; validate them as one chain.
const V2_CSS_FILES = [
  '../design-system/v2/primitives.css',
  '../design-system/v2/semantics.css',
  '../design-system/v2/themes/dark.css',
].map((rel) => resolve(__dirname, rel))

function readV2Css(): string {
  return V2_CSS_FILES.map((p) => readFileSync(p, 'utf-8')).join('\n')
}

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
      // Skip framework-injected runtime vars (Tailwind tw-*, Radix radix-*) —
      // e.g. --radix-accordion-content-height is set on the element at runtime
      // and is never a token that chains primitive → semantic.
      if (FRAMEWORK_INTERNAL_PREFIXES.some((prefix) => name.startsWith(prefix)))
        continue
      if (!defined.has(name) && !reported.has(name)) {
        broken.push({ name, line: i + 1 })
        reported.add(name)
      }
    }
  })

  return { definedCount: defined.size, broken }
}

/**
 * GUARD 1 (source) — fail if an `--opacity-*` declaration appears inside an
 * `@theme { … }` block. Tailwind v4's slash-opacity modifier (e.g. bg-primary/90)
 * resolves a registered --opacity-90 into `color-mix(... var(--opacity-90) ...)`,
 * and the unitless decimal is invalid inside color-mix() (a % is required) — the
 * rule is silently discarded and the color falls back to transparent. Stock
 * Tailwind/ShadCN does not register an --opacity-* theme namespace. The opacity
 * scale may live in :root (cockpit-editable) but must NEVER be inside @theme.
 * Brace-depth tracked so only declarations literally inside @theme are flagged.
 */
export function validateNoOpacityInTheme(css: string): Array<{ name: string; line: number }> {
  const offenders: Array<{ name: string; line: number }> = []
  const lines = css.split('\n')
  let inTheme = false
  let depth = 0 // brace depth *within* the current @theme block
  lines.forEach((line, i) => {
    if (!inTheme) {
      // `@theme {` opens a block (handle `@theme inline {` too).
      if (/@theme\b[^{]*\{/.test(line)) {
        inTheme = true
        depth = (line.match(/\{/g)?.length ?? 0) - (line.match(/\}/g)?.length ?? 0)
      }
      return
    }
    // Inside @theme: flag any --opacity-* define before tracking braces on this line.
    const m = line.match(/--(opacity-[\w-]+)\s*:/)
    if (m) offenders.push({ name: m[1], line: i + 1 })
    depth += (line.match(/\{/g)?.length ?? 0) - (line.match(/\}/g)?.length ?? 0)
    if (depth <= 0) inTheme = false
  })
  return offenders
}

/**
 * GUARD 2 (output, belt-and-suspenders) — scan the compiled dist CSS for the
 * invalid pattern `color-mix(… var(--opacity-…)` which is the symptom of Guard 1's
 * cause leaking through (or any future mechanism that produces a unitless value
 * inside color-mix). Returns the offending line numbers. No-op if dist is absent.
 */
export function validateNoUnitlessColorMix(distCss: string): number[] {
  const offenders: number[] = []
  distCss.split('\n').forEach((line, i) => {
    if (/color-mix\([^)]*var\(--opacity-/.test(line)) offenders.push(i + 1)
  })
  return offenders
}

export interface ComponentRef { filePath: string; content: string }
export interface BrokenComponentRef { name: string; file: string; line: number }

// Framework-injected runtime CSS variables — NOT design tokens, so they are
// intentionally absent from the design-system CSS and must not be flagged as
// broken refs. `tw-*` is Tailwind's internal set; `radix-*` are set at runtime
// by Radix primitives (e.g. --radix-popover-content-transform-origin).
const FRAMEWORK_INTERNAL_PREFIXES = ['tw-', 'radix-']

// Dynamic CSS custom props injected at runtime via inline styles
// (e.g. style={{ '--x': value }} consumed by a className). These are computed
// per-render and so are intentionally absent from the design-system CSS.
// Add a v2 component's runtime-injected var name here if it consumes one.
const INLINE_STYLE_VARS = new Set<string>([])

// Chart: ChartContainer injects one `--color-<seriesKey>` var per config series
// from `config[key].color` (which itself chains to a --chart-N semantic). The
// series keys are CONSUMER-defined (desktop/mobile/value/… — whatever the demo's
// data uses), so these are runtime vars, not static tokens — recharts reads them
// in SVG fill/stroke. We can't enumerate every possible key, so recognise them
// structurally: a `--color-<key>` var, consumed in a Chart/PieChart/_preview file,
// whose `<key>` is NOT a defined token. Real chart tokens (`--color-chart-1`,
// `--color-background`, …) ARE defined and so still validate normally — the
// `!defined` guard is what keeps this from masking genuine broken refs.
// Anchor to a real path SEGMENT (a `<Name>/` directory, not a substring) so a
// non-chart dir like `ChartUtils/` can't accidentally match, and additionally
// require the file to actually pull in the injector (`ChartContainer`) — that is
// the component that emits the runtime `--color-<seriesKey>` vars. Both must hold
// before we mask an undefined --color-* ref, so a genuinely-broken ref in a
// chart-named file that doesn't use ChartContainer is still caught.
const CHART_INJECT_DIR = /(?:^|\/)(?:Chart|PieChart|_preview)\//
function isChartInjectedColorVar(name: string, filePath: string, content: string, defined: Set<string>): boolean {
  if (!name.startsWith('color-')) return false
  if (defined.has(name)) return false // a real, defined --color-* token
  if (!CHART_INJECT_DIR.test(filePath)) return false
  // Content signal: the file must reference ChartContainer, the injector of these vars.
  return content.includes('ChartContainer')
}

export function validateNoDuplicateDeclarations(css: string): Array<{ prop: string; firstLine: number; dupLine: number; firstValue: string; dupValue: string; selector: string }> {
  const duplicates: Array<{ prop: string; firstLine: number; dupLine: number; firstValue: string; dupValue: string; selector: string }> = []
  const lines = css.split('\n')

  let depth = 0
  let currentBlockProps: Record<string, { line: number; value: string }> = {}
  let currentSelector = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const opens = (line.match(/\{/g) || []).length
    const closes = (line.match(/\}/g) || []).length

    if (opens > 0 && depth === 0) {
      currentBlockProps = {}
      const trimmed = line.trim()
      const braceIndex = trimmed.indexOf('{')
      currentSelector = braceIndex > 0 ? trimmed.slice(0, braceIndex).trim() : trimmed
    }
    depth += opens

    if (depth >= 1) {
      const match = line.match(/^\s*(--[\w-]+)\s*:\s*(.*?)\s*;/)
      if (match) {
        const prop = match[1]
        const value = match[2]
        if (currentBlockProps[prop] !== undefined) {
          duplicates.push({
            prop,
            firstLine: currentBlockProps[prop].line + 1,
            dupLine: i + 1,
            firstValue: currentBlockProps[prop].value,
            dupValue: value,
            selector: currentSelector,
          })
        }
        currentBlockProps[prop] = { line: i, value }
      }
    }

    depth -= closes
    if (closes > 0 && depth === 0) {
      currentBlockProps = {}
    }
  }

  return duplicates
}

export function validateComponentTokenRefs(
  css: string,
  componentFiles: ComponentRef[]
): { broken: BrokenComponentRef[] } {
  // Build the set of all defined token names from the v2 design system
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
        // Skip framework-injected runtime vars (Tailwind tw-*, Radix radix-*)
        if (FRAMEWORK_INTERNAL_PREFIXES.some(prefix => name.startsWith(prefix))) continue
        // Skip CSS custom properties injected dynamically via React inline styles
        if (INLINE_STYLE_VARS.has(name)) continue
        // Skip ChartContainer-injected --color-<seriesKey> runtime vars
        if (isChartInjectedColorVar(name, filePath, content, defined)) continue
        if (!defined.has(name)) {
          broken.push({ name, file: filePath, line: i + 1 })
        }
      }
    })
  }

  return { broken }
}

export interface HardcodedViolation {
  file: string
  line: number
  value: string
}

export function validateNoHardcodedValuesInComponents(
  componentFiles: ComponentRef[]
): { violations: HardcodedViolation[] } {
  const violations: HardcodedViolation[] = []

  // After stripping var(), detect:
  // 1. Tailwind arbitrary values with hardcoded units: w-[40px], gap-[8rem]
  //    Note: [a-zA-Z] prefix avoids consuming digits that (\d+) should capture
  const BRACKET_PX = /\[[a-zA-Z\s\-/]*(\d+)(px)[a-zA-Z\s\-/]*\]/
  const BRACKET_REM = /\[[a-zA-Z\s\-/]*(\d+(?:\.\d+)?)(rem)[a-zA-Z\s\-/]*\]/
  const BRACKET_HEX = /\[[^\]]*#([0-9a-fA-F]{3,8})[^\]]*\]/

  // 2. Inline style string values: 'calc(TOKEN + 8px)', '2rem', '#6366f1'
  //    Catches hardcoded values not in a bracket context (e.g. inline style props)
  const INLINE_PX = /['"][^'"]*(\d+)(px)[^'"]*['"]/
  const INLINE_REM = /['"][^'"]*(\d+(?:\.\d+)?)(rem)[^'"]*['"]/
  const INLINE_HEX = /['"][^'"]*#([0-9a-fA-F]{3,8})[^'"]*['"]/

  for (const { filePath, content } of componentFiles) {
    const lines = content.split('\n')
    lines.forEach((line, i) => {
      const trimmed = line.trim()
      // Skip comment-only lines
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return

      // Strip var() refs to avoid false positives on legitimate token usage
      const stripped = line.replace(/var\(--[\w-]+\)/g, 'TOKEN')
      const seen = new Set<string>()

      // Check bracket-based patterns (Tailwind arbitrary values)
      const pxB = stripped.match(BRACKET_PX)
      if (pxB && pxB[1] !== '0') seen.add(pxB[1] + pxB[2])
      const remB = stripped.match(BRACKET_REM)
      if (remB) seen.add(remB[1] + remB[2])
      const hexB = stripped.match(BRACKET_HEX)
      if (hexB) seen.add('#' + hexB[1])

      // Check inline string values (may overlap with brackets in className)
      const pxS = stripped.match(INLINE_PX)
      if (pxS && pxS[1] !== '0') seen.add(pxS[1] + pxS[2])
      const remS = stripped.match(INLINE_REM)
      if (remS) seen.add(remS[1] + remS[2])
      const hexS = stripped.match(INLINE_HEX)
      if (hexS) seen.add('#' + hexS[1])

      for (const v of seen) {
        violations.push({ file: filePath, line: i + 1, value: v })
      }
    })
  }

  return { violations }
}

// Run when executed directly (ESM check for main module)
if (import.meta.url === `file://${process.argv[1]}`) {
async function main() {
  try {
    const css = readV2Css()
    const { definedCount, broken } = validateCssTokens(css)

    console.log('\nGeeklego Token Validator (v2 — 2-tier)')
    console.log('──────────────────────────────────────')
    console.log(`Defined tokens : ${definedCount}`)

    if (broken.length === 0) {
      console.log('✓  All token references are valid.\n')
    } else {
      console.log(`\n✕  ${broken.length} broken reference(s) found:\n`)
      broken.forEach(({ name, line }) => {
        console.log(`   var(--${name})   (first seen: concatenated line ${line})`)
      })
      console.log(
        '\nFix: every var(--name) must chain primitive → semantic in\n' +
        'design-system/v2/{primitives,semantics,themes/dark}.css.\n'
      )
      process.exit(1)
    }

    // Cross-file validation: scan v2 component files for var() references.
    // v2 components style with semantic Tailwind utilities, so the only var()
    // refs expected here are the namespaced --ext-* custom-variant tokens.
    const componentGlob = resolve(__dirname, '../components/v2/**/*.{tsx,ts}')
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

    // Within-block duplicate detection
    const duplicates = validateNoDuplicateDeclarations(css)
    if (duplicates.length > 0) {
      console.log(`\n✕  ${duplicates.length} duplicate declaration(s) found within a CSS block:\n`)
      console.log('Each token must be defined exactly once per CSS block.')
      console.log('The first (earlier) definition is dead code — only the last one is used.\n')
      for (const d of duplicates) {
        console.log(`   ${d.prop}`)
        console.log(`     Line ${d.firstLine}: "${d.firstValue}"`)
        console.log(`     Line ${d.dupLine}:  "${d.dupValue}"  ← wins (keep this)`)
      }
      process.exit(1)
    } else {
      console.log('✓  No duplicate declarations found within blocks.\n')
    }

    // Hardcoded value detection
    const { violations: hardcodedViolations } = validateNoHardcodedValuesInComponents(refs)
    if (hardcodedViolations.length > 0) {
      console.log(`\n\u2715  ${hardcodedViolations.length} hardcoded value(s) in component files (must use tokens):`)
      console.log('   Every value must come from a token \u2014 never hardcode px, rem, or hex.\n')
      hardcodedViolations.forEach(({ file, line, value }) => {
        console.log(`   "${value}"   in ${file}:${line}`)
      })
      process.exit(1)
    } else {
      console.log('\u2713  No hardcoded px/rem/hex values in component files.\n')
    }

    // GUARD 1 \u2014 no --opacity-* inside @theme (the root cause of the invalid
    // color-mix slash-opacity bug). Scans the concatenated v2 CSS.
    const opacityInTheme = validateNoOpacityInTheme(css)
    if (opacityInTheme.length > 0) {
      console.log(`\n\u2715  ${opacityInTheme.length} --opacity-* token(s) registered inside @theme:`)
      console.log('   Tailwind v4 turns bg-*/NN into color-mix(... var(--opacity-NN) ...), which is')
      console.log('   INVALID (unitless decimal where a % is required) \u2014 hovers fall back to transparent.')
      console.log('   Move the opacity scale OUT of @theme (keep it in :root only).\n')
      opacityInTheme.forEach(({ name, line }) => {
        console.log(`   --${name}   (concatenated line ${line})`)
      })
      process.exit(1)
    } else {
      console.log('\u2713  No --opacity-* registered inside @theme.\n')
    }

    // GUARD 1b \u2014 the same check on the Token Editor's restore baseline
    // (design-system/v2-defaults/primitives.css). "Restore to Default" copies this
    // snapshot over the live files, so if the snapshot is stale/broken the bug comes
    // back on restore even when the live files are fixed. Skipped if no snapshot yet.
    const defaultsPrimPath = resolve(__dirname, '../design-system/v2-defaults/primitives.css')
    let defaultsPrim: string | null = null
    try { defaultsPrim = readFileSync(defaultsPrimPath, 'utf-8') } catch { defaultsPrim = null }
    if (defaultsPrim !== null) {
      const offenders = validateNoOpacityInTheme(defaultsPrim)
      if (offenders.length > 0) {
        console.log(`\n\u2715  ${offenders.length} --opacity-* inside @theme in the RESTORE BASELINE (design-system/v2-defaults/primitives.css):`)
        console.log('   "Restore to Default" would re-introduce the broken color-mix bug.')
        console.log('   Refresh the snapshot from the corrected live files:')
        console.log('     cp design-system/v2/primitives.css design-system/v2-defaults/primitives.css (+ semantics.css, themes/dark.css \u2192 dark.css)\n')
        process.exit(1)
      } else {
        console.log('\u2713  Restore baseline (v2-defaults) has no --opacity-* inside @theme.\n')
      }
    }

    // GUARD 2 \u2014 scan the compiled dist CSS (if built) for the invalid
    // color-mix(... var(--opacity-...)) symptom. Skipped if dist is absent.
    const distPath = resolve(__dirname, '../dist/geeklego.css')
    let distCss: string | null = null
    try { distCss = readFileSync(distPath, 'utf-8') } catch { distCss = null }
    if (distCss !== null) {
      const badMix = validateNoUnitlessColorMix(distCss)
      if (badMix.length > 0) {
        console.log(`\n\u2715  ${badMix.length} invalid color-mix(... var(--opacity-...)) in dist/geeklego.css:`)
        console.log('   These compile to transparent. Rebuild after removing --opacity-* from @theme.\n')
        badMix.slice(0, 10).forEach((line) => console.log(`   dist/geeklego.css:${line}`))
        process.exit(1)
      } else {
        console.log('\u2713  No invalid color-mix(... var(--opacity-...)) in dist/geeklego.css.\n')
      }
    } else {
      console.log('\u2139  dist/geeklego.css not built \u2014 skipping output color-mix guard.\n')
    }
  } catch (err) {
    console.error('Error:', err)
    process.exit(1)
  }
}

main()
}
