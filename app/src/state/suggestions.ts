// Available-suggestion engine — the single source of truth for "what auto-pick
// changes are currently available" across BOTH themes. Powers the navbar
// "Suggestions" badge + modal, and mirrors the per-token logic in Inspector.tsx.
//
// A suggestion is "available" when, for a suggestible semantic in a given theme:
//   - the engine produces a value (brand ramp / neutral ramp present),
//   - that value differs from the token's current (staged-or-model) value, and
//   - the token is NOT locked in that theme.

import type { GeeklegoTokensV2 } from '../types.ts'
import {
  suggestBrandSemantics,
  suggestNeutralSemantics,
  stepValueToHex,
  contrastRatio,
  parseColorRef,
  WCAG_AA_NORMAL,
} from '../utils/colorUtils.ts'
import { getAllStaged, getStagedValue, DARK_EDIT_PREFIX } from './staging.ts'
import { isLocked } from './semanticLocks.ts'

const BRAND_DRIVEN_KEYS = ['primary', 'primary-foreground', 'ring'] as const
const NEUTRAL_ROLES = ['accent', 'secondary', 'muted'] as const

export interface AvailableSuggestion {
  /** Semantic key without leading `--`, e.g. "primary", "muted-foreground". */
  key: string
  /** CSS token name, e.g. "--primary". */
  cssName: string
  theme: 'light' | 'dark'
  /** Current (staged-or-model) alias for this token+theme. */
  from: string
  /** Suggested alias. */
  to: string
  /** The staging key the apply would write to (theme-scoped). */
  stagingKey: string
}

/**
 * Build the brand/neutral color map for the suggestion engines, overlaying any
 * staged primitive-color edits onto the model (mirrors Inspector.resolvedColorsWithStaged).
 */
function resolvedColorsWithStaged(
  tokens: GeeklegoTokensV2,
  staged: Map<string, string>,
): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = {}
  for (const [family, scale] of Object.entries(tokens.primitives.colors)) {
    out[family] = { ...scale }
  }
  for (const [name, value] of staged) {
    const m = name.match(/^--color-([a-z0-9]+)-([a-z0-9]+)$/i)
    if (!m) continue
    const [, family, shade] = m
    ;(out[family] ??= {})[shade] = value
  }
  return out
}

/** Current committed value of a semantic key in a theme (staged wins, else model). */
function currentSemanticValue(
  key: string,
  tokens: GeeklegoTokensV2,
  theme: 'light' | 'dark',
): string {
  if (theme === 'dark') {
    const stagedDark = getStagedValue(`${DARK_EDIT_PREFIX}--${key}`)
    if (stagedDark !== undefined) return stagedDark
    const darkVal = tokens.semantics.dark[key]
    if (typeof darkVal === 'string') return darkVal
    // Dark inherits light when not overridden.
  } else {
    const staged = getStagedValue(`--${key}`)
    if (staged !== undefined) return staged
  }
  const lightVal = tokens.semantics.light[key]
  return typeof lightVal === 'string' ? lightVal : ''
}

function lockKey(key: string, theme: 'light' | 'dark'): string {
  return theme === 'dark' ? `${DARK_EDIT_PREFIX}${key}` : key
}

/** Resolve a `var(--color-family-shade)` alias to a hex string via the colors map. */
function aliasToHex(
  alias: string,
  colors: Record<string, Record<string, string>>,
): string | null {
  const ref = parseColorRef(alias)
  if (!ref) return null
  return stepValueToHex(colors[ref.family]?.[ref.shade])
}

/**
 * A foreground suggestion is only worth surfacing when the CURRENT foreground
 * actually fails AA against its surface. A deliberate quieter-but-still-legible
 * foreground (e.g. dark muted-foreground = neutral-400) should NOT be flagged.
 * Returns true when the suggestion should be SUPPRESSED.
 */
function foregroundAlreadyFine(
  currentFg: string,
  surfaceAlias: string,
  colors: Record<string, Record<string, string>>,
): boolean {
  const fgHex = aliasToHex(currentFg, colors)
  const surfaceHex = aliasToHex(surfaceAlias, colors)
  if (!fgHex || !surfaceHex) return false // can't prove it's fine → let it surface
  return contrastRatio(fgHex, surfaceHex) >= WCAG_AA_NORMAL
}

/**
 * Compute every available auto-pick suggestion across both themes. Deterministic
 * order: brand keys then neutral roles, light theme then dark.
 */
export function computeAvailableSuggestions(
  tokens: GeeklegoTokensV2 | null,
): AvailableSuggestion[] {
  if (!tokens) return []
  const staged = getAllStaged()
  const colors = resolvedColorsWithStaged(tokens, staged)
  const out: AvailableSuggestion[] = []

  for (const theme of ['light', 'dark'] as const) {
    const brand = suggestBrandSemantics(colors, 'brand')
    if (brand) {
      const brandValueFor: Record<string, string> = {
        primary: brand.primary,
        'primary-foreground': brand['primary-foreground'],
        ring: brand.ring,
      }
      const currentPrimary = currentSemanticValue('primary', tokens, theme)
      for (const key of BRAND_DRIVEN_KEYS) {
        if (isLocked(lockKey(key, theme))) continue
        const to = brandValueFor[key]
        const from = currentSemanticValue(key, tokens, theme)
        if (!to || from === to) continue
        // Suppress a primary-foreground change when the current fg already reads
        // fine on the (current) primary surface — don't nag about legible choices.
        if (key === 'primary-foreground'
          && foregroundAlreadyFine(from, currentPrimary || brand.primary, colors)) {
          continue
        }
        out.push({
          key, cssName: `--${key}`, theme, from, to,
          stagingKey: theme === 'dark' ? `${DARK_EDIT_PREFIX}--${key}` : `--${key}`,
        })
      }
    }

    for (const role of NEUTRAL_ROLES) {
      const neutral = suggestNeutralSemantics(colors, role, undefined, theme)
      if (!neutral) continue
      const fgKey = `${role}-foreground`
      const currentSurface = currentSemanticValue(role, tokens, theme)
      const pairs: Array<[string, string]> = [
        [role, neutral.surface],
        [fgKey, neutral.foreground],
      ]
      for (const [key, to] of pairs) {
        if (isLocked(lockKey(key, theme))) continue
        const from = currentSemanticValue(key, tokens, theme)
        if (!to || from === to) continue
        // Don't nag about a foreground that already reads fine on its surface —
        // that's a deliberate quiet choice, not a defect.
        if (key === fgKey && foregroundAlreadyFine(from, currentSurface || neutral.surface, colors)) {
          continue
        }
        out.push({
          key, cssName: `--${key}`, theme, from, to,
          stagingKey: theme === 'dark' ? `${DARK_EDIT_PREFIX}--${key}` : `--${key}`,
        })
      }
    }
  }

  return out
}

export function countAvailableSuggestions(tokens: GeeklegoTokensV2 | null): number {
  return computeAvailableSuggestions(tokens).length
}
