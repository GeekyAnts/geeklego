/**
 * Geeklego token-usage scanner (v2)
 *
 * Scans component source files (components/v2/**\/*.{tsx,ts}) for where each design token is
 * actually used, so the Token Editor's References panel can be "true to the source" — showing
 * the real files + lines that consume a token, not just token→token aliasing.
 *
 * Two usage forms are detected:
 *   1. var() refs        — `shadow-[var(--ext-button-gamified-shadow)]`            → high confidence
 *   2. Tailwind utilities — `bg-primary`, `ring-ring`, `rounded-md`, `bg-ext-…`     → inferred
 *
 * The utility→token map is DERIVED from the known token set (the names actually defined in the
 * CSS), so it's driven by the real design system, not guesswork. The exact-containment guard
 * (a utility counts only if its stripped remainder is EXACTLY a known token) keeps the noisy
 * spacing/size primitive surface from producing false positives.
 */

import { readFileSync } from 'fs'
import { relative } from 'path'
import { glob } from 'tinyglobby'

// Framework-injected runtime vars that are never design tokens (Tailwind internal, Radix runtime).
const FRAMEWORK_INTERNAL_PREFIXES = ['tw-', 'radix-']

// Tailwind color/visual property prefixes whose suffix is a registered semantic/ext color token.
// Ordered LONGEST-FIRST so `ring-offset-background` resolves under `ring-offset-` (→ background)
// rather than `ring-` (→ offset-background, which isn't a token).
const COLOR_PREFIXES = [
  'ring-offset-',
  'placeholder-',
  'decoration-',
  'divide-',
  'outline-',
  'border-',
  'accent-',
  'caret-',
  'shadow-',
  'stroke-',
  'fill-',
  'from-',
  'via-',
  'text-',
  'ring-',
  'bg-',
  'to-',
]

// Tailwind spacing/sizing prefixes whose suffix is a `--spacing-<n>` primitive (user wants
// primitives tracked). Kept conservative + exact-match-guarded to contain false positives.
const SPACING_PREFIXES = [
  'space-x-',
  'space-y-',
  'translate-x-',
  'translate-y-',
  'inset-x-',
  'inset-y-',
  'scroll-m-',
  'scroll-p-',
  'gap-x-',
  'gap-y-',
  'min-w-',
  'min-h-',
  'max-w-',
  'max-h-',
  'px-',
  'py-',
  'pt-',
  'pr-',
  'pb-',
  'pl-',
  'mx-',
  'my-',
  'mt-',
  'mr-',
  'mb-',
  'ml-',
  'gap-',
  'inset-',
  'size-',
  'top-',
  'right-',
  'bottom-',
  'left-',
  'p-',
  'm-',
  'w-',
  'h-',
]

const RADIUS_RE = /^rounded(?:-(?:sm|md|lg|xl|2xl|3xl|full|none))?$/

/**
 * Extract the set of defined token names (without leading `--`) from the concatenated v2 CSS.
 * Same define-regex the validator uses, so it matches exactly what's declared.
 */
export function collectKnownTokenNames(css: string): Set<string> {
  const known = new Set<string>()
  const re = /--([\w-]+?)\s*?(?::|;)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(css)) !== null) known.add(m[1])
  return known
}

/**
 * Build a pure resolver: a Tailwind utility class → the token name (with leading `--`) it uses,
 * or null if it doesn't map to a known token. Strips variant prefixes (hover:, data-[…]:),
 * trailing opacity (/90), and a leading negative sign, then matches a property prefix whose
 * remainder is EXACTLY a known token.
 */
export function buildUtilityResolver(known: Set<string>): (cls: string) => string | null {
  const radiusKnown = known.has('radius')

  return function resolveUtilityClass(rawCls: string): string | null {
    let cls = rawCls

    // 1. Strip leading variant prefixes repeatedly (hover:, focus-visible:, dark:,
    //    group-hover:, and bracketed arbitrary variants like data-[state=open]: ).
    //    The bracket-aware pattern avoids splitting inside `[...]`.
    for (;;) {
      const next = cls.replace(/^[a-z0-9-]+(?:\[[^\]]*\])?:/, '')
      if (next === cls) break
      cls = next
    }

    // 2. Strip trailing opacity modifier (bg-primary/90 → bg-primary) and a leading `-`.
    cls = cls.replace(/\/[0-9.]+$/, '')
    if (cls.startsWith('-')) cls = cls.slice(1)
    if (!cls) return null

    // 3. Radius special case — all rounded-* derive from the single --radius token.
    if (radiusKnown && RADIUS_RE.test(cls)) return '--radius'

    // 4. Color/visual prefixes, longest-first; accept only on exact-containment.
    for (const prefix of COLOR_PREFIXES) {
      if (cls.startsWith(prefix)) {
        const remainder = cls.slice(prefix.length)
        if (known.has(remainder)) return `--${remainder}`
        // keep scanning: a longer prefix may still match (handled by order), but a shorter
        // prefix whose remainder isn't a token must not short-circuit — so continue.
      }
    }

    // 5. Spacing/sizing prefixes → --spacing-<n>, exact-match-guarded.
    for (const prefix of SPACING_PREFIXES) {
      if (cls.startsWith(prefix)) {
        const remainder = cls.slice(prefix.length)
        const token = `spacing-${remainder}`
        if (known.has(token)) return `--${token}`
      }
    }

    // 6. Typography utilities — Tailwind's --text-* / --leading-* / --tracking-* / --font-*
    //    namespaces are named such that the UTILITY CLASS IS the token name (text-sm →
    //    --text-sm, leading-tight → --leading-tight, font-sans → --font-sans). So match the
    //    full class against the known-token set, exact-containment-guarded. This runs AFTER
    //    the color pass so `text-primary` (→ --primary, a color) still wins; `text-sm` is not
    //    a color token, so it falls through to here and resolves to --text-sm.
    if (/^(text|leading|tracking|font)-/.test(cls) && known.has(cls)) {
      return `--${cls}`
    }
    // Font weights: Tailwind `font-<name>` (e.g. font-medium) → --font-weight-<name>.
    // (Family utilities font-sans/font-mono are handled above by the direct known(cls) check.)
    if (cls.startsWith('font-')) {
      const weightToken = `font-weight-${cls.slice('font-'.length)}`
      if (known.has(weightToken)) return `--${weightToken}`
    }

    return null
  }
}

export interface UsageHit {
  file: string
  line: number
  snippet: string
  kind: 'var' | 'utility'
}

export type TokenUsageMap = Record<string, UsageHit[]>

interface ScanArgs {
  /** Concatenated v2 CSS (primitives + semantics + dark) — used to derive known token names. */
  css: string
  /** Absolute glob base for component files (e.g. <repo>/components/v2). */
  componentsDir: string
  /** Repo root, used to make hit paths repo-relative for display. */
  repoRoot: string
}

const SNIPPET_MAX = 120

/**
 * Scan all component files and return a map of token name → places it's used.
 */
export async function scanTokenUsage({ css, componentsDir, repoRoot }: ScanArgs): Promise<TokenUsageMap> {
  const known = collectKnownTokenNames(css)
  const resolveUtility = buildUtilityResolver(known)

  const files = await glob('**/*.{tsx,ts}', { cwd: componentsDir, absolute: true })

  const usage: TokenUsageMap = {}
  // Dedup by token|file|line|kind so repeated hits on one line collapse.
  const seen = new Set<string>()

  const record = (token: string, file: string, line: number, snippet: string, kind: UsageHit['kind']) => {
    const dedupKey = `${token}|${file}|${line}|${kind}`
    if (seen.has(dedupKey)) return
    seen.add(dedupKey)
    ;(usage[token] ??= []).push({ file, line, snippet, kind })
  }

  const varRe = /var\(--([\w-]+)\)/g
  const splitRe = /[\s"'`(),[\]{}]+/

  for (const absPath of files) {
    const content = readFileSync(absPath, 'utf-8')
    const relPath = relative(repoRoot, absPath)
    const lines = content.split('\n')

    lines.forEach((line, i) => {
      const lineNo = i + 1
      const snippet = line.trim().slice(0, SNIPPET_MAX)

      // Detector 1 — direct var(--token) refs.
      varRe.lastIndex = 0
      let vm: RegExpExecArray | null
      while ((vm = varRe.exec(line)) !== null) {
        const name = vm[1]
        if (FRAMEWORK_INTERNAL_PREFIXES.some((p) => name.startsWith(p))) continue
        if (known.has(name)) record(`--${name}`, relPath, lineNo, snippet, 'var')
      }

      // Detector 2 — Tailwind utility classes.
      for (const candidate of line.split(splitRe)) {
        if (!candidate) continue
        const token = resolveUtility(candidate)
        if (token) record(token, relPath, lineNo, snippet, 'utility')
      }
    })
  }

  return usage
}
