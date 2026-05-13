import type { GeeklegoTokens, SemanticBlock } from '../types.ts'

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

const VAR_REF = /^var\(--[\w-]+(?:,\s*[^)]+)?\)$/
const HARDCODED_HEX = /^#[0-9A-Fa-f]{3,8}$/
const HARDCODED_PX = /^\d+(?:\.\d+)?px$/
const HARDCODED_REM = /^\d+(?:\.\d+)?rem$/

function isHardcoded(value: string): boolean {
  return HARDCODED_HEX.test(value) || HARDCODED_PX.test(value) || HARDCODED_REM.test(value)
}

function isVarRef(value: string): boolean {
  return VAR_REF.test(value.trim())
}

/** Extract the token name from a var() reference */
function extractVarName(value: string): string | null {
  const match = value.match(/^var\(--([\w-]+)/)
  return match ? `--${match[1]}` : null
}

/** Collect all defined primitive token names from the primitives object */
function collectPrimitiveNames(primitives: GeeklegoTokens['primitives']): Set<string> {
  const names = new Set<string>()
  for (const [family, shades] of Object.entries(primitives.colors)) {
    for (const shade of Object.keys(shades)) {
      names.add(`--color-${family}-${shade}`)
    }
  }
  for (const k of Object.keys(primitives.fontSize)) names.add(`--font-size-${k}`)
  for (const k of Object.keys(primitives.fontWeight)) names.add(`--font-weight-${k}`)
  for (const k of Object.keys(primitives.fontFamily)) names.add(`--font-family-${k}`)
  for (const k of Object.keys(primitives.lineHeight)) names.add(`--line-height-${k}`)
  for (const k of Object.keys(primitives.letterSpacing)) names.add(`--letter-spacing-${k}`)
  for (const k of Object.keys(primitives.spacing)) names.add(`--spacing-${k}`)
  for (const k of Object.keys(primitives.radius)) names.add(`--radius-${k}`)
  for (const k of Object.keys(primitives.borderWidth)) names.add(`--border-width-${k}`)
  for (const k of Object.keys(primitives.opacity)) names.add(`--opacity-${k}`)
  for (const k of Object.keys(primitives.zIndex)) names.add(`--z-index-${k}`)
  for (const k of Object.keys(primitives.duration)) names.add(`--duration-${k}`)
  for (const k of Object.keys(primitives.easing)) names.add(`--ease-${k}`)
  // New primitives - iconSize
  if (primitives.iconSize) {
    for (const k of Object.keys(primitives.iconSize)) names.add(`--icon-size-${k}`)
  }
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

/** Collect all semantic token names from a SemanticBlock */
function collectSemanticNames(sem: SemanticBlock): Set<string> {
  const names = new Set<string>()
  const colorGroups = ['bg', 'surface', 'text', 'border', 'action', 'status', 'state'] as const
  for (const group of colorGroups) {
    if (sem[group]) {
      for (const k of Object.keys(sem[group])) {
        names.add(`--color-${group}-${k}`)
      }
    }
  }
  if (sem.dataSeries) {
    for (const k of Object.keys(sem.dataSeries)) names.add(`--color-data-series-${k}`)
  }
  if (sem.shadows) {
    for (const k of Object.keys(sem.shadows)) names.add(`--shadow-${k}`)
  }
  for (const k of Object.keys(sem.spacingComponent)) names.add(`--spacing-component-${k}`)
  for (const k of Object.keys(sem.spacingLayout)) names.add(`--spacing-layout-${k}`)
  for (const k of Object.keys(sem.sizeComponent)) names.add(`--size-component-${k}`)
  for (const k of Object.keys(sem.radiusComponent)) names.add(`--radius-component-${k}`)
  for (const k of Object.keys(sem.motion)) names.add(`--${k}`)
  for (const k of Object.keys(sem.layer)) names.add(`--layer-${k}`)
  for (const k of Object.keys(sem.borders)) names.add(`--border-${k}`)
  if (sem.contentFlexibility) {
    for (const k of Object.keys(sem.contentFlexibility)) names.add(`--content-${k}`)
  }

  // Additional semantic groups
  if (sem.colorOverlayBackdrop) {
    names.add(`--color-overlay-backdrop`)
  }
  if (sem.text?.['on-status-solid']) {
    names.add(`--color-text-on-status-solid`)
  }
  if (sem.border?.info) {
    names.add(`--color-border-info`)
  }
  if (sem.iconSemantic) {
    for (const k of Object.keys(sem.iconSemantic)) names.add(`--icon-semantic-${k}`)
  }
  if (sem.sizeFixed) {
    for (const k of Object.keys(sem.sizeFixed)) names.add(`--size-fixed-${k}`)
  }
  if (sem.typographySemantics) {
    for (const [style, properties] of Object.entries(sem.typographySemantics)) {
      if (properties.size) names.add(`--typography-${style}-size`)
      if (properties.weight) names.add(`--typography-${style}-weight`)
      if (properties.leading) names.add(`--typography-${style}-leading`)
      if (properties.tracking) names.add(`--typography-${style}-tracking`)
    }
  }

  return names
}

// ─── Validation checks ──────────────────────────────────────────────────────

function validateSemanticValues(
  sem: SemanticBlock,
  mode: string,
  primitiveNames: Set<string>,
  warnings: ValidationEntry[],
  errors: ValidationEntry[],
): void {
  const colorGroups = ['bg', 'surface', 'text', 'border', 'action', 'status', 'state'] as const
  for (const group of colorGroups) {
    const g = sem[group]
    if (!g) continue
    for (const [k, v] of Object.entries(g)) {
      const path = `semantics.${mode}.${group}.${k}`
      if (isHardcoded(v)) {
        warnings.push({ message: `Hardcoded value "${v}" — should reference a primitive via var()`, path })
      }
    }
  }

  // Check shadows for hardcoded values (skip complex multi-value shadows)
  if (sem.shadows) {
    for (const [k, v] of Object.entries(sem.shadows)) {
      if (HARDCODED_HEX.test(v)) {
        warnings.push({ message: `Shadow "${k}" uses hardcoded hex`, path: `semantics.${mode}.shadows.${k}` })
      }
    }
  }

  // Check non-color semantic groups for hardcoded values
  const refGroups: Array<[string, Record<string, string> | undefined]> = [
    ['motion', sem.motion
      ? { ...sem.motion.duration, ...sem.motion.easing }
      : undefined],
    ['layer', sem.layer as Record<string, string> | undefined],
    ['borders', sem.borders as Record<string, string> | undefined],
    ['spacingComponent', sem.spacingComponent as Record<string, string> | undefined],
    ['spacingLayout', sem.spacingLayout as Record<string, string> | undefined],
    ['radiusComponent', sem.radiusComponent as Record<string, string> | undefined],
    ['sizeComponent', sem.sizeComponent as Record<string, string> | undefined],
  ]
  for (const [groupName, group] of refGroups) {
    if (!group) continue
    for (const [k, v] of Object.entries(group)) {
      if (isHardcoded(v)) {
        warnings.push({
          message: `Hardcoded value "${v}" in ${groupName}.${k} — should reference a primitive via var()`,
          path: `semantics.${mode}.${groupName}.${k}`,
        })
      }
    }
  }
}

function validateDarkOverrides(
  light: SemanticBlock,
  dark: Partial<SemanticBlock>,
  warnings: ValidationEntry[],
): void {
  // Check that color semantics with light-mode values have dark overrides
  const colorGroups = ['bg', 'text', 'action'] as const
  for (const group of colorGroups) {
    const lightGroup = light[group]
    const darkGroup = dark[group]
    if (!lightGroup) continue
    for (const k of Object.keys(lightGroup)) {
      if (!darkGroup || !(k in darkGroup)) {
        // Only warn for primary tokens, not every single one
        if (k === 'primary' || k === 'secondary' || k === 'inverse') {
          warnings.push({
            message: `Missing dark mode override for --color-${group}-${k}`,
            path: `semantics.dark.${group}.${k}`,
          })
        }
      }
    }
  }

  // Check for specific tokens that should have dark overrides
  // Check text["on-status-solid"]
  if (light.text && light.text['on-status-solid']) {
    const darkText = dark.text
    if (!darkText || !darkText['on-status-solid']) {
      warnings.push({
        message: `Missing dark mode override for --color-text-on-status-solid`,
        path: 'semantics.dark.text.on-status-solid',
      })
    }
  }

  // Check border["info"]
  if (light.border && light.border['info']) {
    const darkBorder = dark.border
    if (!darkBorder || !darkBorder['info']) {
      warnings.push({
        message: `Missing dark mode override for --color-border-info`,
        path: 'semantics.dark.border.info',
      })
    }
  }

  // Check colorOverlayBackdrop
  if (light.layer && light.layer.colorOverlayBackdrop) {
    const darkLayer = dark.layer
    if (!darkLayer || !darkLayer.colorOverlayBackdrop) {
      warnings.push({
        message: `Missing dark mode override for --layer-color-overlay-backdrop`,
        path: 'semantics.dark.layer.colorOverlayBackdrop',
      })
    }
  }
}

function detectCircularRefs(
  sem: SemanticBlock,
  mode: string,
  blockers: ValidationEntry[],
): void {
  // Build a simple ref graph from the semantic block
  const refs = new Map<string, string>()
  const colorGroups = ['bg', 'surface', 'text', 'border', 'action', 'status', 'state'] as const
  for (const group of colorGroups) {
    const g = sem[group]
    if (!g) continue
    for (const [k, v] of Object.entries(g)) {
      const name = `--color-${group}-${k}`
      const target = extractVarName(v)
      if (target) refs.set(name, target)
    }
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

export function validateTokens(tokens: GeeklegoTokens): ValidationResult {
  const warnings: ValidationEntry[] = []
  const errors: ValidationEntry[] = []
  const blockers: ValidationEntry[] = []

  const primitiveNames = collectPrimitiveNames(tokens.primitives)
  const semanticNames = collectSemanticNames(tokens.semantics.light)

  // Validate semantic values per mode
  validateSemanticValues(tokens.semantics.light, 'light', primitiveNames, warnings, errors)

  // Check dark mode has overrides for key tokens
  validateDarkOverrides(tokens.semantics.light, tokens.semantics.dark, warnings)

  // Check for circular references
  detectCircularRefs(tokens.semantics.light, 'light', blockers)

  // Check spacing values for unusually large values
  for (const [k, v] of Object.entries(tokens.semantics.light.spacingComponent)) {
    if (isVarRef(v)) {
      const numMatch = v.match(/spacing-(\d+)/)
      if (numMatch && parseInt(numMatch[1]) > 32) {
        warnings.push({
          message: `Unusually large component spacing: ${v}`,
          path: `semantics.light.spacingComponent.${k}`,
        })
      }
    }
  }

  // Check typography classes for missing required fields
  for (const cls of tokens.typographyClasses) {
    if (cls.name.endsWith('-responsive')) continue; // system-generated, not validated here
    if (!cls.fontFamily || !cls.fontSize || !cls.fontWeight || !cls.lineHeight) {
      errors.push({
        message: `Typography class "${cls.name}" is missing required fields`,
        path: `typographyClasses.${cls.name}`,
      })
    }
  }

  return { warnings, errors, blockers }
}
