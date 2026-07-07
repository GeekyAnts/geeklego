import type { GeeklegoTokensV2, TokenEntry } from '../types'

// ─── Canonical primitive prefix map ────────────────────────────────────────────
// Maps a primitives top-level model key to the CSS variable prefix used in the v2
// design system. Mirrors the emission rules in utils/cssGenerator.ts. This is the
// SINGLE source of truth — EditorShell, ContextPane, Inspector, AddTokenDialog and
// PendingModal all import it, so adding a new primitive scale is a one-line change
// here (not five scattered copies).
export const PRIMITIVE_PREFIX: Record<string, string> = {
  colors: 'color',
  fontFamily: 'font',
  fontSize: 'text',
  fontWeight: 'font-weight',
  lineHeight: 'leading',
  letterSpacing: 'tracking',
  spacing: 'spacing',
  radius: 'radius',
  borderWidth: 'border-width',
  duration: 'duration',
  easing: 'ease',
  breakpoints: 'breakpoint',
}

/**
 * Walk the v2 token model into a flat list. Shared shape:
 *   - flat scales (spacing, radius, …) → `--<prefix>-<key>`
 *   - one level of nesting (colors.neutral.500) → `--<prefix>-<key>-<key2>`
 *   - flat v2 semantics (`semantics.light`) → `--<key>` verbatim
 *
 * fontWeight is numeric in the model; it's coerced to string so
 * it isn't silently dropped from the UI / command palette.
 *
 * @param withDashes  true → names carry the leading `--` (UI/token lists);
 *                    false → names without `--` (the IA classifier input).
 */
function walk(tokens: GeeklegoTokensV2, withDashes: boolean): TokenEntry[] {
  const entries: TokenEntry[] = []
  const pfx = withDashes ? '--' : ''

  const prims = tokens.primitives as unknown as Record<string, unknown>
  for (const category of Object.keys(prims)) {
    const prefix = PRIMITIVE_PREFIX[category]
    if (!prefix) continue
    const values = prims[category]
    if (!values || typeof values !== 'object') continue
    for (const [k, v] of Object.entries(values as Record<string, unknown>)) {
      if (typeof v === 'string' || typeof v === 'number') {
        entries.push({ name: `${pfx}${prefix}-${k}`, value: String(v) })
      } else if (v && typeof v === 'object') {
        // Nested (e.g. colors.neutral.500 → --color-neutral-500)
        for (const [k2, v2] of Object.entries(v as Record<string, unknown>)) {
          if (typeof v2 === 'string' || typeof v2 === 'number') {
            entries.push({ name: `${pfx}${prefix}-${k}-${k2}`, value: String(v2) })
          }
        }
      }
    }
  }

  // Scalar primitives — top-level string values that aren't a Record scale and so
  // aren't covered by PRIMITIVE_PREFIX (which maps Record-shaped scales only).
  // `colorShadowNeutral` is the sole one today: a single --color-shadow-neutral var
  // (see cssParser/cssGenerator special-case). Emit it explicitly so it appears in
  // the command palette / classifier / graph like every other primitive.
  const shadowNeutral = (prims as { colorShadowNeutral?: unknown }).colorShadowNeutral
  if (typeof shadowNeutral === 'string' && shadowNeutral !== '') {
    entries.push({ name: `${pfx}color-shadow-neutral`, value: shadowNeutral })
  }

  // v2 semantics are a FLAT map: { primary: 'var(--color-brand-900)', … }.
  // The CSS var name is the key verbatim (e.g. --primary, --border).
  const semantics = tokens.semantics?.light
  if (semantics) {
    for (const [k, v] of Object.entries(semantics)) {
      entries.push({ name: `${pfx}${k}`, value: v })
    }
  }

  return entries
}

/** Flatten the model to `{ name: '--foo', value }` entries (names carry `--`). */
export function flattenTokens(tokens: GeeklegoTokensV2): TokenEntry[] {
  return walk(tokens, true)
}

/**
 * Classifier names: the same walk, but names WITHOUT the leading `--` (the IA
 * classifier strips `--`, so it consumes bare names). Returns names only.
 */
export function collectTokenNames(tokens: GeeklegoTokensV2): string[] {
  return walk(tokens, false).map((e) => e.name)
}
