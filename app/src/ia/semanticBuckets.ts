// ─── Semantic Bucket Classification — single source of truth ──────────────────
//
// The Token Editor groups the flat v2 (2-tier) semantic vocabulary into four UI
// buckets: surface / interactive / layout / status. Two consumers need this same
// membership:
//   1. ia/classify.ts          → drives the NavRail badge counts
//   2. views/CategoryPage.tsx   → drives the token list rendered on each page
//
// Historically each maintained its OWN copy of these regexes, and the exclusion
// lists drifted: CategoryPage's status filter forgot to exclude the Tailwind
// typography prefixes (text-/leading-/tracking-), so 34 font primitives leaked
// onto the Status page. This module is now the ONLY place these rules live —
// both consumers import from here, so they can never disagree again.
//
// All predicates take a BARE token name (no leading `--`). The semantic CSS var
// for a key is just `--<key>` (e.g. `--primary`), so callers holding a `--name`
// strip the prefix first (see `semanticBucketOfVar`).

export type SemanticBucket = 'surface' | 'interactive' | 'layout' | 'status'

/** Page/elevated surfaces + their foreground content. */
export const SURFACE_RE =
  /^(background|foreground|card|card-foreground|popover|popover-foreground)$/

/** Brand / interactive fills + the focus ring. */
export const INTERACTIVE_RE =
  /^(primary|primary-foreground|secondary|secondary-foreground|accent|accent-foreground|muted|muted-foreground|ring)$/

/** Structural semantics (border, input, radius) + the sidebar navigation-chrome
 *  group. The `sidebar-*` group is a dedicated navigation surface promoted to core;
 *  it's bucketed under layout (structural chrome) so it doesn't fall into the status
 *  catch-all alongside destructive/success/warning. The whole group is kept together
 *  here rather than split across surface/interactive so the cockpit renders it as one
 *  coherent navigation block. */
export const LAYOUT_RE =
  /^(border|input|radius|sidebar-bg|sidebar-foreground|sidebar-border|sidebar-accent|sidebar-accent-foreground|sidebar-ring)$/

// The canonical "this is a primitive / foundation prefix" exclusion. A bare name
// matching this is a Tier-1 primitive (or a registered foundation scale), NOT a
// Tier-2 semantic, so it must never fall into the status catch-all. This list
// INCLUDES the Tailwind typography prefixes `text|leading|tracking` — their
// omission from CategoryPage's copy was the original leak.
export const FOUNDATION_PREFIX_RE =
  /^(color|spacing|radius|font|text|leading|tracking|shadow|duration|ease|motion|z-index|z-|border-width|border-|icon-size|size|breakpoint|opacity)\b/

/**
 * Is this bare name a status/feedback semantic? True for the standard ShadCN
 * `destructive` pair AND, as the catch-all, any semantic geeklego authors beyond
 * the standard set (e.g. `--chart-*`, or a future `--info`/`--success`). False
 * for primitives and for the surface/interactive/layout buckets.
 */
export function isStatusSemantic(name: string): boolean {
  // The explicit buckets are exact-name matches and take precedence — but they
  // are NOT status, so a hit there means "not status".
  if (SURFACE_RE.test(name) || INTERACTIVE_RE.test(name) || LAYOUT_RE.test(name)) {
    return false
  }
  // Anything matching a foundation/primitive PREFIX (color-*, text-*, radius-*,
  // …) is a primitive, not a semantic. Note bare `--radius` is already claimed by
  // LAYOUT_RE above; `radius-lg` (with a trailing segment) is the primitive.
  if (FOUNDATION_PREFIX_RE.test(name)) return false
  // Must still look like a plain semantic identifier (lowercase, kebab) — guards
  // against stray non-token strings being scooped into status.
  return /^[a-z][a-z0-9-]*$/.test(name)
}

/**
 * Classify a bare semantic name into its UI bucket, or null if it isn't a
 * semantic (i.e. it's a primitive/foundation). First-match order:
 * surface → interactive → layout → status. The explicit exact-name buckets are
 * checked BEFORE the foundation-prefix exclusion so bare semantics whose name
 * collides with a foundation prefix (e.g. `--radius`, `--border`) are not
 * mistaken for primitives (`radius-lg`, `border-width-2`).
 */
export function semanticBucketOf(name: string): SemanticBucket | null {
  if (SURFACE_RE.test(name)) return 'surface'
  if (INTERACTIVE_RE.test(name)) return 'interactive'
  if (LAYOUT_RE.test(name)) return 'layout'
  if (isStatusSemantic(name)) return 'status'
  return null
}

/** Convenience for callers holding a CSS variable name (`--primary`). */
export function semanticBucketOfVar(varName: string): SemanticBucket | null {
  return semanticBucketOf(varName.replace(/^--/, ''))
}
