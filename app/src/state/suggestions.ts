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
  makeColorRef,
  pickStepForSurface,
  WCAG_AA_NORMAL,
  WCAG_UI_COMPONENT,
} from '../utils/colorUtils.ts'
import { getAllStaged, getStagedValue, DARK_EDIT_PREFIX } from './staging.ts'
import { isLocked } from './semanticLocks.ts'

const BRAND_DRIVEN_KEYS = ['primary', 'primary-foreground', 'ring'] as const
const NEUTRAL_ROLES = ['accent', 'secondary', 'muted'] as const

/**
 * Brand-driven UI elements whose visibility we check AGAINST their surface
 * (not against their own foreground). A near-black --primary on a near-black
 * dark --background is legible-for-text-on-top yet invisible as a control.
 */
const SURFACE_CONTRAST_KEYS = ['primary', 'ring'] as const
/** Surfaces a brand element can sit on. --card catches in-card controls (charts, etc.). */
const SURFACE_KEYS = ['background', 'card'] as const

export interface AvailableSuggestion {
  /**
   * 'suggest' = an applicable auto-pick (has a `to`; renders an Apply button).
   * 'warn'    = a legibility problem with no safe auto-pick (no `to`; renders a
   *             message, no Apply). Both count toward the badge.
   */
  kind: 'suggest' | 'warn'
  /** Semantic key without leading `--`, e.g. "primary", "muted-foreground". */
  key: string
  /** CSS token name, e.g. "--primary". */
  cssName: string
  theme: 'light' | 'dark'
  /** Current (staged-or-model) alias for this token+theme. */
  from: string
  /** Suggested alias. Empty string for a warn-only entry. */
  to: string
  /** The staging key the apply would write to (theme-scoped). '' for warn-only. */
  stagingKey: string
  /** Human-readable explanation, present on warn entries. */
  message?: string
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
 * True when `alias` clears the non-text-UI contrast threshold against at least one
 * of the theme's page surfaces (--background / --card). Used to stop the brand loop
 * from proposing a text-optimal step that would be invisible on the surface.
 */
function visibleOnAnySurface(
  alias: string,
  tokens: GeeklegoTokensV2,
  colors: Record<string, Record<string, string>>,
  theme: 'light' | 'dark',
): boolean {
  const elHex = aliasToHex(alias, colors)
  if (!elHex) return true // can't prove it's invisible → don't suppress
  let sawSurface = false
  for (const surfaceKey of SURFACE_KEYS) {
    const surfaceHex = aliasToHex(currentSemanticValue(surfaceKey, tokens, theme), colors)
    if (!surfaceHex) continue
    sawSurface = true
    if (contrastRatio(elHex, surfaceHex) >= WCAG_UI_COMPONENT) return true
  }
  // No resolvable surface → can't prove it's invisible, so don't suppress.
  return !sawSurface
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
    // Run the surface-visibility pass FIRST and record which brand keys it claims.
    // Its concern (is the element visible on the page?) takes precedence over the
    // brand loop's concern (is text legible on the element?) for the same key —
    // otherwise the two engines fight: surface wants a light step on a dark bg,
    // brand wants to yank it back to the vivid text-safe step. Surface wins.
    const surfaceClaimed = collectSurfaceVisibilityFixes(tokens, colors, theme, out)

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
        if (surfaceClaimed.has(key)) continue // surface pass owns this key+theme
        const to = brandValueFor[key]
        const from = currentSemanticValue(key, tokens, theme)
        if (!to || from === to) continue
        // Don't revert a surface-visible element back to a step that would be
        // invisible on the current background. This stops the tug-of-war after the
        // user applies a surface fix (e.g. primary=brand-50 on a dark bg): the brand
        // loop's text-optimal pick (brand-600) is invisible there, so we suppress it.
        if ((key === 'primary' || key === 'ring') && !visibleOnAnySurface(to, tokens, colors, theme)) {
          continue
        }
        // Suppress a primary-foreground change when the current fg already reads
        // fine on the (current) primary surface — don't nag about legible choices.
        if (key === 'primary-foreground'
          && foregroundAlreadyFine(from, currentPrimary || brand.primary, colors)) {
          continue
        }
        out.push({
          kind: 'suggest',
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
          kind: 'suggest',
          key, cssName: `--${key}`, theme, from, to,
          stagingKey: theme === 'dark' ? `${DARK_EDIT_PREFIX}--${key}` : `--${key}`,
        })
      }
    }

  }

  return out
}

/**
 * Surface-visibility pass: a brand element (primary/ring) can be perfectly legible
 * for text-on-top yet invisible AGAINST the page surface it sits on (e.g. a
 * near-black --primary on a near-black dark --background). The brand/neutral
 * auto-pick engines never check this pairing. When the same brand family has a step
 * that IS visible on the surface, emit an applicable suggestion re-pointing to it;
 * when the ramp is too flat (no step clears the threshold), emit a warn-only entry.
 *
 * Returns the set of brand keys this pass produced an entry for in `theme`, so the
 * caller can stop the brand loop from emitting a competing suggestion for the same
 * key (surface-visibility takes precedence over text-legibility for that value).
 *
 * NOT gated on isLocked: a lock means "don't auto-pick over my choice" — it must
 * not silence the fact that the chosen value is invisible. The user opts in via Apply.
 */
function collectSurfaceVisibilityFixes(
  tokens: GeeklegoTokensV2,
  colors: Record<string, Record<string, string>>,
  theme: 'light' | 'dark',
  out: AvailableSuggestion[],
): Set<string> {
  const claimed = new Set<string>()
  for (const key of SURFACE_CONTRAST_KEYS) {
    const from = currentSemanticValue(key, tokens, theme)
    const fromRef = parseColorRef(from)
    const elHex = aliasToHex(from, colors)
    if (!fromRef || !elHex) continue
    for (const surfaceKey of SURFACE_KEYS) {
      const surfaceAlias = currentSemanticValue(surfaceKey, tokens, theme)
      const surfaceHex = aliasToHex(surfaceAlias, colors)
      if (!surfaceHex) continue
      const ratio = contrastRatio(elHex, surfaceHex)
      if (ratio >= WCAG_UI_COMPONENT) continue

      const stagingKey = theme === 'dark' ? `${DARK_EDIT_PREFIX}--${key}` : `--${key}`
      // Look for a visible step within the SAME brand family the token already uses.
      const pick = pickStepForSurface(colors[fromRef.family] ?? {}, surfaceHex)
      if (pick && pick.step !== fromRef.shade) {
        out.push({
          kind: 'suggest',
          key, cssName: `--${key}`, theme, from, to: makeColorRef(fromRef.family, pick.step), stagingKey,
          message: `--${key} is nearly invisible on --${surfaceKey} `
            + `(contrast ${ratio.toFixed(2)}:1, needs ≥${WCAG_UI_COMPONENT}:1). `
            + `Apply to re-point it to ${fromRef.family}-${pick.step} `
            + `(${pick.contrast.toFixed(2)}:1 on --${surfaceKey}).`,
        })
      } else {
        out.push({
          kind: 'warn',
          key, cssName: `--${key}`, theme, from, to: '', stagingKey: '',
          message: `--${key} is nearly invisible on --${surfaceKey} `
            + `(contrast ${ratio.toFixed(2)}:1, needs ≥${WCAG_UI_COMPONENT}:1). `
            + `No ${fromRef.family} step stands out on this surface — widen the ramp.`,
        })
      }
      claimed.add(key)
      break // one entry per element+theme is enough; don't repeat per surface.
    }
  }
  return claimed
}

export function countAvailableSuggestions(tokens: GeeklegoTokensV2 | null): number {
  return computeAvailableSuggestions(tokens).length
}
