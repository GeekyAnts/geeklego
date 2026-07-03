import type { GeeklegoTokensV2, V2Semantics } from '../types.ts'

// ─── Validation types ────────────────────────────────────────────────────────

export interface ValidationEntry {
  message: string
  path: string
}

export interface ValidationResult {
  warnings: ValidationEntry[]
  errors: ValidationEntry[]
  blockers: ValidationEntry[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const HARDCODED_HEX = /^#[0-9A-Fa-f]{3,8}$/
const HARDCODED_PX = /^\d+(?:\.\d+)?px$/
const HARDCODED_REM = /^\d+(?:\.\d+)?rem$/

function isHardcoded(value: string): boolean {
  return HARDCODED_HEX.test(value) || HARDCODED_PX.test(value) || HARDCODED_REM.test(value)
}

/** Extract the token name from a var() reference */
function extractVarName(value: string): string | null {
  const match = value.match(/^var\(--([\w-]+)/)
  return match ? `--${match[1]}` : null
}

/** Collect all defined primitive token names from the primitives object */
function collectPrimitiveNames(primitives: GeeklegoTokensV2['primitives']): Set<string> {
  const names = new Set<string>()
  for (const [family, shades] of Object.entries(primitives.colors)) {
    for (const shade of Object.keys(shades)) {
      names.add(`--color-${family}-${shade}`)
    }
  }
  for (const k of Object.keys(primitives.fontSize)) names.add(`--text-${k}`)
  for (const k of Object.keys(primitives.fontWeight)) names.add(`--font-weight-${k}`)
  for (const k of Object.keys(primitives.fontFamily)) names.add(`--font-${k}`)
  for (const k of Object.keys(primitives.lineHeight)) names.add(`--leading-${k}`)
  for (const k of Object.keys(primitives.letterSpacing)) names.add(`--tracking-${k}`)
  for (const k of Object.keys(primitives.spacing)) names.add(`--spacing-${k}`)
  for (const k of Object.keys(primitives.radius)) names.add(`--radius-${k}`)
  for (const k of Object.keys(primitives.borderWidth)) names.add(`--border-width-${k}`)
  for (const k of Object.keys(primitives.duration)) names.add(`--duration-${k}`)
  for (const k of Object.keys(primitives.easing)) names.add(`--ease-${k}`)
  // New primitive - colorShadowNeutral
  if (primitives.colorShadowNeutral) {
    names.add(`--color-shadow-neutral`)
  }
  // New duration tokens for stagger values
  if (primitives.duration) {
    if ('stagger-sm' in primitives.duration) names.add(`--duration-stagger-sm`)
    if ('stagger-md' in primitives.duration) names.add(`--duration-stagger-md`)
  }
  if (primitives.breakpoints) {
    for (const k of Object.keys(primitives.breakpoints)) names.add(`--breakpoint-${k}`)
  }
  return names
}

// ─── Validation checks ──────────────────────────────────────────────────────

function validateSemanticValues(
  sem: V2Semantics,
  mode: string,
  primitiveNames: Set<string>,
  warnings: ValidationEntry[],
  _errors: ValidationEntry[],
): void {
  // Flat v2 semantics: each entry should chain to a primitive via var(), not a raw value.
  for (const [k, v] of Object.entries(sem)) {
    const path = `semantics.${mode}.${k}`
    if (isHardcoded(v)) {
      warnings.push({ message: `Hardcoded value "${v}" — should reference a primitive via var()`, path })
    }
  }
}

function validateDarkOverrides(
  light: V2Semantics,
  dark: V2Semantics,
  warnings: ValidationEntry[],
): void {
  // Flat v2: warn when a key-surface semantic defined in light has no dark override.
  const KEY_SEMANTICS = ['background', 'foreground', 'primary', 'secondary', 'accent', 'card', 'popover']
  for (const k of Object.keys(light)) {
    if (!KEY_SEMANTICS.includes(k)) continue
    if (!(k in dark)) {
      warnings.push({
        message: `Missing dark mode override for --${k}`,
        path: `semantics.dark.${k}`,
      })
    }
  }
}

function detectCircularRefs(
  sem: V2Semantics,
  mode: string,
  blockers: ValidationEntry[],
): void {
  // Build a simple ref graph from the flat semantic map (each key → `--<key>`).
  const refs = new Map<string, string>()
  for (const [k, v] of Object.entries(sem)) {
    const name = `--${k}`
    const target = extractVarName(v)
    if (target) refs.set(name, target)
  }

  // Walk each ref chain looking for cycles (max depth 10)
  for (const [start] of refs) {
    const visited = new Set<string>()
    let current: string | undefined = start
    let depth = 0
    while (current && depth < 10) {
      if (visited.has(current)) {
        blockers.push({
          message: `Circular var() reference detected: ${start} → ... → ${current}`,
          path: `semantics.${mode}`,
        })
        break
      }
      visited.add(current)
      current = refs.get(current)
      depth++
    }
  }
}

// ─── Main validator ──────────────────────────────────────────────────────────

export function validateTokens(tokens: GeeklegoTokensV2): ValidationResult {
  const warnings: ValidationEntry[] = []
  const errors: ValidationEntry[] = []
  const blockers: ValidationEntry[] = []

  const primitiveNames = collectPrimitiveNames(tokens.primitives)

  // Validate semantic values per mode
  validateSemanticValues(tokens.semantics.light, 'light', primitiveNames, warnings, errors)

  // Check dark mode has overrides for key tokens
  validateDarkOverrides(tokens.semantics.light, tokens.semantics.dark, warnings)

  // Check for circular references
  detectCircularRefs(tokens.semantics.light, 'light', blockers)

  return { warnings, errors, blockers }
}
