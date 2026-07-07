// ─── Primitives ──────────────────────────────────────────────────────────────

export interface ColorScale {
  [shade: string]: string
}

export interface PrimitiveColors {
  neutral: ColorScale
  accent: ColorScale
  success: ColorScale
  warning: ColorScale
  error: ColorScale
  [name: string]: ColorScale
}

export interface Primitives {
  colors: PrimitiveColors
  fontFamily: Record<string, string>
  fontSize: Record<string, string>
  fontWeight: Record<string, number>
  lineHeight: Record<string, string>
  letterSpacing: Record<string, string>
  spacing: Record<string, string>
  radius: Record<string, string>
  borderWidth: Record<string, string>
  duration: Record<string, string>
  easing: Record<string, string>
  colorShadowNeutral: string
  breakpoints: Record<string, string>
}

// ─── v2 flat ShadCN semantic model ─────────────────────────────────────────────
// The 2-tier cockpit model. Tier 2 is the flat ShadCN/Tailwind standard vocabulary
// (primitive → semantic). The editor reads/writes
// design-system/v2/{primitives,semantics,themes/dark}.css against this shape.
//
// NOTE (Phase 5 done): the old 3-tier model (GeeklegoTokens, SemanticBlock,
// ComponentToken*, TypographyMapping, ResponsiveOverride, TypographyClass) has been
// removed now that no consumer references it. Only the v2 flat model below remains.

/** The standard ShadCN/Tailwind core semantic keys (excludes the namespaced --ext-* set). */
export type V2SemanticKey =
  | 'background' | 'foreground'
  | 'primary' | 'primary-foreground'
  | 'secondary' | 'secondary-foreground'
  | 'muted' | 'muted-foreground'
  | 'accent' | 'accent-foreground'
  | 'destructive' | 'destructive-foreground'
  // Status semantics — geeklego extends the ShadCN set with success/warning/info
  // (each with a -foreground pair), hand-authored in semantics.css after destructive.
  | 'success' | 'success-foreground'
  | 'warning' | 'warning-foreground'
  | 'info' | 'info-foreground'
  | 'border' | 'input' | 'ring'
  | 'card' | 'card-foreground'
  | 'popover' | 'popover-foreground'
  // Sidebar — standard ShadCN core vocab (ShadCN ships a dedicated --sidebar-*
  // group), promoted out of the --ext-* block. Its own navigation surface.
  | 'sidebar-bg' | 'sidebar-foreground' | 'sidebar-border'
  | 'sidebar-accent' | 'sidebar-accent-foreground' | 'sidebar-ring'
  | 'radius'

/** The canonical ordered list of v2 core semantic keys — drives the generator's
 *  emission order and the @source safelist. NOTE: this is NOT a parse gate;
 *  applyV2SemanticToken is a denylist (skips only ext-/color-), so forward-compat
 *  extra semantics still round-trip via the generator's `extras` loop. Keys are
 *  listed here so they emit in canonical order AND get safelisted. */
export const V2_SEMANTIC_KEYS: readonly V2SemanticKey[] = [
  'background', 'foreground',
  'primary', 'primary-foreground',
  'secondary', 'secondary-foreground',
  'muted', 'muted-foreground',
  'accent', 'accent-foreground',
  'destructive', 'destructive-foreground',
  'success', 'success-foreground',
  'warning', 'warning-foreground',
  'info', 'info-foreground',
  'border', 'input', 'ring',
  'card', 'card-foreground',
  'popover', 'popover-foreground',
  'sidebar-bg', 'sidebar-foreground', 'sidebar-border',
  'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-ring',
  'radius',
] as const

/**
 * A flat semantic alias map: semantic key → value (typically `var(--color-…)` chaining a primitive).
 * Keyed by string (not V2SemanticKey) so a forward-compatible extra semantic round-trips;
 * the allowlist is enforced at the parser/apply layer, not the type.
 */
export interface V2Semantics {
  [key: string]: string
}

/**
 * The opaque --ext-* custom-variant block. v2 treats this as a passthrough blob
 * (not regenerated token-by-token) because it mixes color and non-color tokens
 * (e.g. --ext-button-gamified-shadow is in :root/dark but NOT in @theme inline).
 *  - rawBlock: the full --ext-* section from semantics.css (its own :root + @theme inline).
 *  - darkOverride: the interleaved --ext-* override(s) inside themes/dark.css.
 */
export interface V2ExtBlock {
  rawBlock: string
  darkOverride: string
}

/**
 * A Google Fonts loader entry — one webfont the design system pulls in at runtime.
 * Generated into design-system/v2/fonts.css as an `@import url("…googleapis.com/css2?…")`,
 * which the Token Editor's font picker writes alongside the matching --font-* family token.
 * Structured (not raw CSS) so the URL is generated deterministically and the picker can
 * read back the current selection.
 *  - family: the font family name as it appears in the token, e.g. "Figtree".
 *  - axes:   the css2 axis spec, e.g. "wght@300..900" (omitted → no `:axes` segment).
 *  - source: only 'google' today; reserved for future delivery mechanisms.
 */
export interface FontLoader {
  family: string
  axes?: string
  source: 'google'
}

/** The v2 cockpit's root token model: primitives (reused shape) + flat light/dark semantics + opaque ext blob + font loaders. */
export interface GeeklegoTokensV2 {
  primitives: Primitives
  semantics: {
    light: V2Semantics
    dark: V2Semantics
  }
  ext: V2ExtBlock
  /** Google Fonts loaders → design-system/v2/fonts.css. Empty when none are configured. */
  fontLoaders: FontLoader[]
}

/**
 * One place a token is used inside a component source file. Produced by the
 * scan-token-usage scanner (Node-side) and surfaced in the Inspector's References panel.
 *  - kind 'var'     → a direct `var(--token)` reference (high confidence).
 *  - kind 'utility' → a Tailwind utility class inferred to map to the token (e.g. bg-primary).
 */
export interface UsageHit {
  /** Repo-relative path, e.g. "components/v2/Button/button-variants.ts". */
  file: string
  /** 1-based line number. */
  line: number
  /** Trimmed source line (truncated) for display. */
  snippet: string
  kind: 'var' | 'utility'
}

/** token CSS name (e.g. "--primary") → the component-source places it's used. */
export type TokenUsageMap = Record<string, UsageHit[]>

// ─── UI state ─────────────────────────────────────────────────────────────────

export type TabId = 'primitives' | 'semantics' | 'responsive' | 'export'
export type ThemeMode = 'light' | 'dark'
export type PrimitiveSection =
  | 'colors' | 'typography' | 'spacing' | 'sizing'
  | 'radius' | 'borders' | 'zindex' | 'motion'

export interface ColorOption {
  label: string
  value: string
  hex: string
}

// ─── Token entry ──────────────────────────────────────────────────────────────

export interface TokenEntry {
  name: string
  value: string
}
