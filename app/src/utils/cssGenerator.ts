import type {
  Primitives,
  GeeklegoTokensV2,
  V2Semantics,
} from '../types.ts'
import { V2_SEMANTIC_KEYS } from '../types.ts'

function pad(name: string, width = 32): string {
  return name.padEnd(width)
}

// ─── Block 1: @theme (Primitives) ────────────────────────────────────────────

function generateThemeBlock(tokens: { primitives: Primitives }): string {
  const { primitives: p } = tokens
  const lines: string[] = []

  lines.push(`@import "tailwindcss";`)
  lines.push(``)
  lines.push(`/* =============================================================================`)
  lines.push(`   @theme — CSS-first design token registration (Tailwind v4 syntax)`)
  lines.push(`   All tokens are registered as CSS custom properties under @theme so Tailwind`)
  lines.push(`   can generate utility classes automatically.`)
  lines.push(`   ============================================================================= */`)
  lines.push(``)
  lines.push(`@theme {`)
  lines.push(``)
  lines.push(`  /* ===========================================================================`)
  lines.push(`     FONTS`)
  lines.push(`     =========================================================================== */`)
  lines.push(``)
  for (const [k, v] of Object.entries(p.fontFamily)) {
    lines.push(`  ${pad(`--font-${k}:`, 28)} ${v};`)
  }
  lines.push(``)
  lines.push(`  /* Font sizes */`)
  for (const [k, v] of Object.entries(p.fontSize)) {
    lines.push(`  ${pad(`--text-${k}:`, 24)} ${v};`)
  }
  lines.push(``)
  lines.push(`  /* Font weights */`)
  for (const [k, v] of Object.entries(p.fontWeight)) {
    lines.push(`  ${pad(`--font-weight-${k}:`, 28)} ${v};`)
  }
  lines.push(``)
  lines.push(`  /* Line heights */`)
  for (const [k, v] of Object.entries(p.lineHeight)) {
    lines.push(`  ${pad(`--leading-${k}:`, 28)} ${v};`)
  }
  lines.push(``)
  lines.push(`  /* Letter spacing */`)
  for (const [k, v] of Object.entries(p.letterSpacing)) {
    lines.push(`  ${pad(`--tracking-${k}:`, 32)} ${v};`)
  }

  lines.push(``)
  lines.push(`  /* ===========================================================================`)
  lines.push(`     SPACING (all values in rem, base 16px)`)
  lines.push(`     =========================================================================== */`)
  lines.push(``)
  for (const [k, v] of Object.entries(p.spacing)) {
    lines.push(`  ${pad(`--spacing-${k}:`, 20)} ${v};`)
  }

  lines.push(``)
  lines.push(`  /* ===========================================================================`)
  lines.push(`     BORDER RADIUS`)
  lines.push(`     =========================================================================== */`)
  lines.push(``)
  for (const [k, v] of Object.entries(p.radius)) {
    lines.push(`  ${pad(`--radius-${k}:`, 20)} ${v};`)
  }

  lines.push(``)
  lines.push(`  /* ===========================================================================`)
  lines.push(`     BORDER WIDTH`)
  lines.push(`     =========================================================================== */`)
  lines.push(``)
  for (const [k, v] of Object.entries(p.borderWidth)) {
    lines.push(`  ${pad(`--border-width-${k}:`, 28)} ${v};`)
  }

  lines.push(``)
  lines.push(`  /* ===========================================================================`)
  lines.push(`     OPACITY — intentionally absent (stock Tailwind/ShadCN defines no opacity`)
  lines.push(`     theme scale). An opacity scale here would hijack the slash modifier into an`)
  lines.push(`     invalid unitless color-mix() and break hover tints; the built-in opacity`)
  lines.push(`     utility needs no scale. See scripts/validate-tokens.ts (opacity guard).`)
  lines.push(`     =========================================================================== */`)

  lines.push(``)
  lines.push(`  /* ===========================================================================`)
  lines.push(`     MOTION / ANIMATION`)
  lines.push(`     =========================================================================== */`)
  lines.push(``)
  for (const [k, v] of Object.entries(p.duration)) {
    lines.push(`  ${pad(`--duration-${k}:`, 24)} ${v};`)
  }
  lines.push(``)
  for (const [k, v] of Object.entries(p.easing)) {
    lines.push(`  ${pad(`--ease-${k}:`, 20)} ${v};`)
  }

  if (p.breakpoints && Object.keys(p.breakpoints).length > 0) {
    lines.push(``)
    lines.push(`  /* ===========================================================================`)
    lines.push(`     BREAKPOINTS`)
    lines.push(`     =========================================================================== */`)
    lines.push(``)
    for (const [k, v] of Object.entries(p.breakpoints)) {
      lines.push(`  ${pad(`--breakpoint-${k}:`, 24)} ${v};`)
    }
  }

  lines.push(``)
  lines.push(`  /* ===========================================================================`)
  lines.push(`     PRIMITIVE COLORS — 01 · Primitives`)
  lines.push(`     =========================================================================== */`)
  lines.push(``)
  for (const [family, shades] of Object.entries(p.colors)) {
    const label = family.charAt(0).toUpperCase() + family.slice(1)
    lines.push(`  /* ${label} */`)
    for (const [shade, hex] of Object.entries(shades)) {
      lines.push(`  ${pad(`--color-${family}-${shade}:`, 28)} ${hex};`)
    }
    lines.push(``)
  }

  lines.push(``)
  lines.push(`  /* ===========================================================================`)
  lines.push(`     SHADOW COLORS`)
  lines.push(`     =========================================================================== */`)
  lines.push(``)
  lines.push(`  ${pad(`--color-shadow-neutral:`, 24)} ${p.colorShadowNeutral};`)
  lines.push(``)

  lines.push(``)
  lines.push(`} /* end @theme */`)

  // ── :root mirror of @theme primitives ──────────────────────────────────────
  // Tailwind v4's @theme at-rule is not natively understood by browsers, so
  // the browser cannot read CSS custom properties declared inside it.
  // We duplicate all primitive token declarations inside :root so that the
  // browser can resolve var(--color-neutral-0), var(--spacing-4), etc. directly.
  // The @theme block above is still needed for Tailwind to generate utility classes.
  lines.push(``)
  lines.push(`/* =============================================================================`)
  lines.push(`   :root primitive mirror — browser-accessible copy of @theme tokens`)
  lines.push(`   Browsers cannot read CSS custom properties inside @theme (an unknown at-rule)`)
  lines.push(`   so these values are duplicated here so var() references resolve correctly.`)
  lines.push(`   ============================================================================= */`)
  lines.push(``)
  lines.push(`:root {`)
  lines.push(``)
  lines.push(`  /* Fonts */`)
  for (const [k, v] of Object.entries(p.fontFamily)) {
    lines.push(`  ${pad(`--font-${k}:`, 28)} ${v};`)
  }
  lines.push(``)
  for (const [k, v] of Object.entries(p.fontSize)) {
    lines.push(`  ${pad(`--text-${k}:`, 24)} ${v};`)
  }
  lines.push(``)
  for (const [k, v] of Object.entries(p.fontWeight)) {
    lines.push(`  ${pad(`--font-weight-${k}:`, 28)} ${v};`)
  }
  lines.push(``)
  for (const [k, v] of Object.entries(p.lineHeight)) {
    lines.push(`  ${pad(`--leading-${k}:`, 28)} ${v};`)
  }
  lines.push(``)
  for (const [k, v] of Object.entries(p.letterSpacing)) {
    lines.push(`  ${pad(`--tracking-${k}:`, 32)} ${v};`)
  }
  lines.push(``)
  lines.push(`  /* Spacing */`)
  for (const [k, v] of Object.entries(p.spacing)) {
    lines.push(`  ${pad(`--spacing-${k}:`, 20)} ${v};`)
  }
  lines.push(``)
  lines.push(`  /* Radius */`)
  for (const [k, v] of Object.entries(p.radius)) {
    lines.push(`  ${pad(`--radius-${k}:`, 20)} ${v};`)
  }
  lines.push(``)
  lines.push(`  /* Border width */`)
  for (const [k, v] of Object.entries(p.borderWidth)) {
    lines.push(`  ${pad(`--border-width-${k}:`, 28)} ${v};`)
  }
  // Opacity: intentionally not emitted — stock Tailwind/ShadCN has no opacity
  // theme scale; the built-in opacity-NN utility needs none. (See @theme note.)
  lines.push(``)
  lines.push(`  /* Motion */`)
  for (const [k, v] of Object.entries(p.duration)) {
    lines.push(`  ${pad(`--duration-${k}:`, 24)} ${v};`)
  }
  lines.push(``)
  for (const [k, v] of Object.entries(p.easing)) {
    lines.push(`  ${pad(`--ease-${k}:`, 20)} ${v};`)
  }
  if (p.breakpoints && Object.keys(p.breakpoints).length > 0) {
    lines.push(``)
    lines.push(`  /* Breakpoints */`)
    for (const [k, v] of Object.entries(p.breakpoints)) {
      lines.push(`  ${pad(`--breakpoint-${k}:`, 24)} ${v};`)
    }
  }
  lines.push(``)
  lines.push(`  /* Primitive colors */`)
  for (const [family, shades] of Object.entries(p.colors)) {
    const label = family.charAt(0).toUpperCase() + family.slice(1)
    lines.push(`  /* ${label} */`)
    for (const [shade, hex] of Object.entries(shades)) {
      lines.push(`  ${pad(`--color-${family}-${shade}:`, 28)} ${hex};`)
    }
    lines.push(``)
  }
  lines.push(`  /* Shadow colors */`)
  lines.push(`  ${pad(`--color-shadow-neutral:`, 24)} ${p.colorShadowNeutral};`)
  lines.push(``)
  lines.push(`} /* end :root primitive mirror */`)

  return lines.join('\n')
}

// ═══════════════════════════════════════════════════════════════════════════════
//  v2 — the flat ShadCN/2-tier cockpit generators (TOKEN-EDITOR-V2-REBUILD Phase 3)
//
//  Generates the three design-system/v2 files from GeeklegoTokensV2. Inverse of the
//  Phase-2 parser; the polarity rule is mirrored:
//    - primitives.css: regenerate @theme (canonical) AND its :root mirror.
//    - semantics.css:  emit :root aliases (canonical) AND regenerate @theme inline
//                      (derived mirror); append ext.rawBlock VERBATIM (opaque).
//    - themes/dark.css: emit the [data-theme="dark"], .dark block + ext.darkOverride.
//
//  ⚠ ext is an opaque passthrough — rawBlock/darkOverride are NOT regenerated
//    token-by-token (they mix color + non-color tokens; see the parser).
// ═══════════════════════════════════════════════════════════════════════════════

/** Pad a `--name:` to a fixed column so the `:root` aliases line up like the source file. */
function padV2(name: string): string {
  return `--${name}:`.padEnd(24)
}

/**
 * Generate semantics.css from the model.
 *  1. header
 *  2. :root { …aliases } — CANONICAL, emitted in fixed V2_SEMANTIC_KEYS order
 *  3. @theme inline { …--color-X: var(--X) per non-radius key + fixed radius calc scale }
 *  4. ext.rawBlock appended verbatim (its own :root + @theme inline)
 */
export function generateV2Semantics(t: GeeklegoTokensV2): string {
  const sem: V2Semantics = t.semantics.light
  const lines: string[] = []

  lines.push(`/* =============================================================================`)
  lines.push(`   geeklego v2 — SEMANTICS (Tier 2)`)
  lines.push(`   ShadCN / Tailwind standard vocabulary, aliased to geeklego PRIMITIVES.`)
  lines.push(`   This is the INTERFACE components consume: bg-primary, text-primary-foreground,`)
  lines.push(`   border-border, ring-ring, etc. — zero custom vocabulary.`)
  lines.push(`   Generated by the Geeklego v2 Token Editor.`)
  lines.push(`   ============================================================================= */`)
  lines.push(``)
  lines.push(`/* ---------------------------------------------------------------------------`)
  lines.push(`   1 · Semantic tokens — light (default). Each aliases a primitive.`)
  lines.push(`   --------------------------------------------------------------------------- */`)
  lines.push(`:root {`)
  // Emit core keys in canonical order so output is stable regardless of parse order.
  // --radius is grouped last (it's special — drives the calc() scale below).
  for (const key of V2_SEMANTIC_KEYS) {
    if (key === 'radius') continue
    const value = sem[key]
    if (value === undefined) continue
    lines.push(`  ${padV2(key)} ${value};`)
  }
  if (sem['radius'] !== undefined) {
    lines.push(``)
    lines.push(`  /* ShadCN expects a single --radius; component utilities derive sm/md/lg from it. */`)
    lines.push(`  ${padV2('radius')} ${sem['radius']};`)
  }
  // Any forward-compat extra semantic keys (not in the canonical set) — preserve them.
  const known = new Set<string>(V2_SEMANTIC_KEYS)
  const extras = Object.keys(sem).filter((k) => !known.has(k))
  for (const key of extras) {
    lines.push(`  ${padV2(key)} ${sem[key]};`)
  }
  lines.push(`}`)
  lines.push(``)

  lines.push(`/* ---------------------------------------------------------------------------`)
  lines.push(`   2 · Register semantics as Tailwind v4 utilities.`)
  lines.push(`       \`inline\` => utilities resolve var() at runtime, so .dark overrides work.`)
  lines.push(`   --------------------------------------------------------------------------- */`)
  lines.push(`@theme inline {`)
  for (const key of V2_SEMANTIC_KEYS) {
    if (key === 'radius') continue
    if (sem[key] === undefined) continue
    lines.push(`  ${`--color-${key}:`.padEnd(30)} var(--${key});`)
  }
  for (const key of extras) {
    lines.push(`  ${`--color-${key}:`.padEnd(30)} var(--${key});`)
  }
  // --radius expands to the fixed calc() scale (NOT --color-radius).
  if (sem['radius'] !== undefined) {
    lines.push(``)
    lines.push(`  ${`--radius-sm:`.padEnd(30)} calc(var(--radius) - 4px);`)
    lines.push(`  ${`--radius-md:`.padEnd(30)} calc(var(--radius) - 2px);`)
    lines.push(`  ${`--radius-lg:`.padEnd(30)} var(--radius);`)
    lines.push(`  ${`--radius-xl:`.padEnd(30)} calc(var(--radius) + 4px);`)
  }
  lines.push(`}`)

  // 2b · @source inline safelist — FORCE-generate the semantic color utilities.
  //
  //   Tailwind v4 only emits a utility when it detects the literal class string in scanned
  //   content. In components, `accent`/`muted` appear almost only as variant/opacity/-foreground
  //   forms (focus:bg-accent, text-muted-foreground, bg-muted/50), so the bare `bg-accent` /
  //   `bg-muted` / `text-accent-foreground` utilities — and their --color-* registrations — get
  //   tree-shaken out of the built dist/geeklego.css. Editing --accent then has no rule to apply to.
  //   This safelist guarantees every semantic's bg/text (+ border/ring for the structural ones)
  //   utility is always built, regardless of usage. Emitted by the generator so it survives export.
  // bg/text keys: every semantic EXCEPT the structural ones consumed as border/ring
  // (radius/border/input/ring, plus sidebar-border/sidebar-ring which are the sidebar
  // group's structural members — they need border-/ring- utilities, not bg-/text-).
  const structural = new Set(['radius', 'border', 'input', 'ring', 'sidebar-border', 'sidebar-ring'])
  // Derive the safelist from the FULL semantic set (every canonical key + any parsed extras),
  // not the type list alone — so both canonical status semantics (success/warning/info) AND
  // forward-compat extras always get their utilities force-built or they'd be tree-shaken from
  // dist (see C1). All canonical keys are always listed (the safelist is a static guarantee,
  // independent of what a given parse happened to see); extras append after.
  const allSemanticKeys = [...V2_SEMANTIC_KEYS, ...extras]
  // bg/text safelist covers every semantic EXCEPT the structural ones consumed as border/ring.
  const bgText = allSemanticKeys.filter((k) => !structural.has(k))
  // border- safelist: the structural border members PLUS the feedback/status color semantics
  // (destructive + success/warning/info) — the ones actually consumed as border-* utilities
  // (e.g. Input/Alert borders), plus any extra color semantic that has a matching -foreground.
  // ALSO any semantic whose NAME implies a border role: a `border-*` ramp member
  // (border-strong/border-muted) or a `*-border` token (brand-border) — these are consumed
  // as border-* utilities but have no -foreground pair, so the pair-gated rule would miss
  // them and Tailwind would tree-shake border-brand-border / border-border-strong from dist.
  const BORDER_STATUS = ['destructive', 'success', 'warning', 'info']
  const borderExtras = extras.filter(
    (k) =>
      !k.endsWith('-foreground') &&
      (sem[`${k}-foreground`] !== undefined || k.endsWith('-border') || /^border-/.test(k)),
  )
  const borderKeys = [...new Set(['border', 'input', 'sidebar-border', ...BORDER_STATUS, ...borderExtras])]
  // ring- safelist: the structural ring members PLUS any semantic whose name implies a ring
  // role (`*-ring`, e.g. brand-ring). Name-derived, not hardcoded, so new *-ring semantics
  // don't get their ring-* utility tree-shaken.
  const ringExtras = extras.filter((k) => k.endsWith('-ring'))
  const ringKeys = [...new Set(['ring', 'sidebar-ring', ...ringExtras])]
  lines.push(``)
  lines.push(`/* ---------------------------------------------------------------------------`)
  lines.push(`   2b · Safelist — always generate the semantic color utilities (see note above).`)
  lines.push(`   --------------------------------------------------------------------------- */`)
  lines.push(`@source inline("{hover:,focus:,}{bg,text}-{${bgText.join(',')}}");`)
  lines.push(`@source inline("border-{${borderKeys.join(',')}}");`)
  lines.push(`@source inline("ring-{${ringKeys.join(',')}}");`)

  // 3 · ext.rawBlock — opaque, appended verbatim.
  let out = lines.join('\n')
  if (t.ext.rawBlock && t.ext.rawBlock.trim().length > 0) {
    out += '\n\n' + t.ext.rawBlock.replace(/\s+$/, '') + '\n'
  } else {
    out += '\n'
  }
  return out
}

/**
 * Generate themes/dark.css from the model. Emits the dual `[data-theme="dark"], .dark`
 * selector (v2 convention), core dark overrides in canonical order, then ext.darkOverride
 * verbatim inside the same block.
 */
export function generateV2Dark(t: GeeklegoTokensV2): string {
  const dark: V2Semantics = t.semantics.dark
  const lines: string[] = []

  lines.push(`/* =============================================================================`)
  lines.push(`   geeklego v2 — DARK THEME`)
  lines.push(`   A theme is just a set of Tier-2 (semantic) overrides re-pointed at different`)
  lines.push(`   primitives. Nothing here touches primitives or components.`)
  lines.push(``)
  lines.push(`   Supports BOTH selectors:`)
  lines.push(`     [data-theme="dark"]  — the existing Token Editor / Storybook theme switch`)
  lines.push(`     .dark                — the ShadCN standard convention`)
  lines.push(`   --------------------------------------------------------------------------- */`)
  lines.push(`[data-theme="dark"],`)
  lines.push(`.dark {`)
  for (const key of V2_SEMANTIC_KEYS) {
    if (key === 'radius') continue
    if (dark[key] === undefined) continue
    lines.push(`  ${padV2(key)} ${dark[key]};`)
  }
  if (dark['radius'] !== undefined) {
    lines.push(`  ${padV2('radius')} ${dark['radius']};`)
  }
  const known = new Set<string>(V2_SEMANTIC_KEYS)
  for (const key of Object.keys(dark).filter((k) => !known.has(k))) {
    lines.push(`  ${padV2(key)} ${dark[key]};`)
  }
  // ext.darkOverride — opaque, interleaved verbatim before the close brace.
  if (t.ext.darkOverride && t.ext.darkOverride.trim().length > 0) {
    lines.push(``)
    lines.push(`  /* --ext-* overrides for dark (opaque passthrough). */`)
    lines.push(t.ext.darkOverride.replace(/\n+$/, ''))
  }
  lines.push(`}`)
  return lines.join('\n') + '\n'
}

/**
 * Generate primitives.css from the model. Reuses generateThemeBlock (which already
 * emits @theme + the :root mirror), then swaps in the v2 header and the `@source`
 * directive. Primitives are Tier 1 / rarely edited; this regenerates the file from the
 * parsed values — comment layout is normalized, token values preserved.
 */
export function generateV2Primitives(t: GeeklegoTokensV2): string {
  // generateThemeBlock only reads tokens.primitives — wrap the v2 model to reuse it.
  const themeAndMirror = generateThemeBlock({ primitives: t.primitives })
  // generateThemeBlock emits `@import "tailwindcss";` as its first line; insert the v2
  // header above it and the @source directive right after, to match the source file.
  const header = `/* =============================================================================
   geeklego v2 — PRIMITIVES (Tier 1)
   geeklego's brand identity + the fork seam. Do not edit per-brand here;
   re-point the SEMANTIC layer (semantics.css) instead.
   Generated by the Geeklego v2 Token Editor.
   ============================================================================= */
`
  const withSource = themeAndMirror.replace(
    `@import "tailwindcss";`,
    `@import "tailwindcss";\n@source not "../../.claude";`,
  )
  return header + '\n' + withSource + '\n'
}

/**
 * Build a Google Fonts css2 URL from a loader entry. Family name → URL slug (spaces → `+`);
 * the optional `axes` spec is appended as `:wght@…`; `&display=swap` avoids invisible text
 * while the font loads.
 *   { family: "Figtree", axes: "wght@300..900" }
 *     → https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&display=swap
 */
function googleFontUrl(loader: { family: string; axes?: string }): string {
  const familySlug = loader.family.trim().replace(/\s+/g, '+')
  const axisSeg = loader.axes && loader.axes.trim() ? `:${loader.axes.trim()}` : ''
  return `https://fonts.googleapis.com/css2?family=${familySlug}${axisSeg}&display=swap`
}

/**
 * Generate design-system/v2/fonts.css — the runtime font-delivery layer.
 *
 * Emits one `@import url("…googleapis.com/css2?…")` per fontLoaders entry. This file is
 * imported FIRST in index.css (before primitives.css → before `@import "tailwindcss"`),
 * because a remote `@import` is only preserved by the Tailwind v4 build into
 * dist/geeklego.css when it precedes all other rules (CSS spec: @import must come first).
 *
 * With no loaders the file is a header-only comment (valid CSS, no imports) — which keeps
 * today's behavior (fonts come from the system / the token name's fallback stack).
 */
export function generateV2Fonts(t: GeeklegoTokensV2): string {
  const loaders = t.fontLoaders ?? []
  const lines: string[] = []
  lines.push(`/* =============================================================================`)
  lines.push(`   geeklego v2 — FONT LOADERS`)
  lines.push(`   Runtime @import of the webfonts named by the --font-* family tokens.`)
  lines.push(`   MUST be imported FIRST in index.css (before primitives.css / @import "tailwindcss")`)
  lines.push(`   or the Tailwind v4 build strips these @imports from dist/geeklego.css.`)
  lines.push(`   Generated by the Geeklego v2 Token Editor.`)
  lines.push(`   ============================================================================= */`)
  lines.push(``)
  if (loaders.length === 0) {
    lines.push(`/* No webfonts configured — families resolve via their fallback stack / the system. */`)
  } else {
    for (const loader of loaders) {
      lines.push(`@import url("${googleFontUrl(loader)}");`)
    }
  }
  return lines.join('\n') + '\n'
}

/**
 * Orchestrator — generate all four v2 files. Returns the content keyed by the file
 * the Phase-4 token-api writes each to.
 */
export function generateGeeklegoV2(t: GeeklegoTokensV2): {
  primitives: string
  semantics: string
  dark: string
  fonts: string
} {
  return {
    primitives: generateV2Primitives(t),
    semantics: generateV2Semantics(t),
    dark: generateV2Dark(t),
    fonts: generateV2Fonts(t),
  }
}
