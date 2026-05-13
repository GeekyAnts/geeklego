import type { GeeklegoTokens, SemanticBlock, TypographyClass, ResponsiveOverride } from '../types.ts'

function pad(name: string, width = 32): string {
  return name.padEnd(width)
}

// ─── Cross-browser: color-mix() → rgba() fallback ────────────────────────────
// Converts color-mix(in srgb, <hex> N%, transparent) to rgba(r, g, b, N/100).
// Used to generate @supports fallbacks for browsers without color-mix() support.

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`
}

function colorMixToRgba(value: string): string {
  // Match color-mix with either a raw #hex or a var(--name, #hex) as the color argument
  return value.replace(
    /color-mix\(in srgb,\s*(?:var\(--[\w-]+,\s*(#[0-9A-Fa-f]{6})\)|(#[0-9A-Fa-f]{6}))\s+(\d+)%,\s*transparent\)/g,
    (_, varFallbackHex, rawHex, pct) => {
      const hex = varFallbackHex || rawHex
      return hexToRgba(hex, parseInt(pct) / 100)
    }
  )
}

function resolveVarRefsForFallback(
  value: string,
  colors: Record<string, Record<string, string>>
): string {
  // Replace var(--color-<family>-<shade>) and var(--color-<family>-<shade>, #fallback)
  // with the resolved hex from primitives (or the inline fallback hex)
  return value.replace(
    /var\(--color-([\w-]+)(?:,\s*(#[0-9A-Fa-f]{6}))?\)/g,
    (original, tokenName, inlineFallback) => {
      const lastDash = tokenName.lastIndexOf('-')
      if (lastDash <= 0) return inlineFallback ?? original
      const family = tokenName.slice(0, lastDash)
      const shade = tokenName.slice(lastDash + 1)
      return colors[family]?.[shade] ?? inlineFallback ?? original
    }
  )
}

function hasColorMix(value: string): boolean {
  return value.includes('color-mix(')
}

/** Resolve var() refs and convert color-mix() to rgba() for a shadow value */
function shadowFallbackValue(
  value: string,
  colors: Record<string, Record<string, string>>
): string {
  return colorMixToRgba(resolveVarRefsForFallback(value, colors))
}

// Accumulator for color-mix shadow tokens that need @supports overrides
interface ColorMixShadowEntry {
  selector: string // ':root, [data-theme="light"]' or '[data-theme="dark"]'
  tokens: Array<{ key: string; value: string }>
}

// ─── Block 1: @theme (Primitives) ────────────────────────────────────────────

function generateThemeBlock(tokens: GeeklegoTokens): string {
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
    lines.push(`  ${pad(`--font-family-${k}:`, 28)} ${v};`)
  }
  lines.push(``)
  lines.push(`  /* Font sizes */`)
  for (const [k, v] of Object.entries(p.fontSize)) {
    lines.push(`  ${pad(`--font-size-${k}:`, 24)} ${v};`)
  }
  lines.push(``)
  lines.push(`  /* Font weights */`)
  for (const [k, v] of Object.entries(p.fontWeight)) {
    lines.push(`  ${pad(`--font-weight-${k}:`, 28)} ${v};`)
  }
  lines.push(``)
  lines.push(`  /* Line heights */`)
  for (const [k, v] of Object.entries(p.lineHeight)) {
    lines.push(`  ${pad(`--line-height-${k}:`, 28)} ${v};`)
  }
  lines.push(``)
  lines.push(`  /* Letter spacing */`)
  for (const [k, v] of Object.entries(p.letterSpacing)) {
    lines.push(`  ${pad(`--letter-spacing-${k}:`, 32)} ${v};`)
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
  lines.push(`     OPACITY`)
  lines.push(`     =========================================================================== */`)
  lines.push(``)
  for (const [k, v] of Object.entries(p.opacity)) {
    lines.push(`  ${pad(`--opacity-${k}:`, 20)} ${v};`)
  }

  lines.push(``)
  lines.push(`  /* ===========================================================================`)
  lines.push(`     Z-INDEX`)
  lines.push(`     =========================================================================== */`)
  lines.push(``)
  for (const [k, v] of Object.entries(p.zIndex)) {
    lines.push(`  ${pad(`--z-index-${k}:`, 24)} ${v};`)
  }

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

  lines.push(`  /* ===========================================================================`)
  lines.push(`     ICON SIZES (xs, sm, md, lg, xl, 2xl)`)
  lines.push(`     =========================================================================== */`)
  lines.push(``)
  for (const [k, v] of Object.entries(p.iconSize)) {
    lines.push(`  ${pad(`--icon-size-${k}:`, 20)} ${v};`)
  }

  lines.push(``)
  lines.push(`  /* ===========================================================================`)
  lines.push(`     SHADOW COLORS`)
  lines.push(`     =========================================================================== */`)
  lines.push(``)
  lines.push(`  ${pad(`--color-shadow-neutral:`, 24)} ${p.colorShadowNeutral};`)
  lines.push(``)

  lines.push(``)
  lines.push(`  /* ===========================================================================`)
  lines.push(`     DURATIONS (stagger animations)`)
  lines.push(`     =========================================================================== */`)
  lines.push(``)
  for (const [k, v] of Object.entries(p.duration)) {
    if (k.includes('stagger')) {
      lines.push(`  ${pad(`--duration-${k}:`, 24)} ${v};`)
    }
  }

  // ── Content flexibility primitives ──
  if (p.contentFlexibility) {
    lines.push(``)
    lines.push(`  /* ===========================================================================`)
    lines.push(`     CONTENT FLEXIBILITY`)
    lines.push(`     =========================================================================== */`)
    lines.push(``)
    lines.push(`  /* Line clamp values */`)
    for (const [k, v] of Object.entries(p.contentFlexibility.lineClamp)) {
      lines.push(`  ${pad(`--line-clamp-${k}:`, 28)} ${v};`)
    }
    lines.push(``)
    lines.push(`  /* Content max-width */`)
    for (const [k, v] of Object.entries(p.contentFlexibility.maxWidth)) {
      lines.push(`  ${pad(`--content-max-width-${k}:`, 32)} ${v};`)
    }
    lines.push(``)
    lines.push(`  /* Content min-width */`)
    for (const [k, v] of Object.entries(p.contentFlexibility.minWidth)) {
      lines.push(`  ${pad(`--content-min-width-${k}:`, 32)} ${v};`)
    }
  }

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
    lines.push(`  ${pad(`--font-family-${k}:`, 28)} ${v};`)
  }
  lines.push(``)
  for (const [k, v] of Object.entries(p.fontSize)) {
    lines.push(`  ${pad(`--font-size-${k}:`, 24)} ${v};`)
  }
  lines.push(``)
  for (const [k, v] of Object.entries(p.fontWeight)) {
    lines.push(`  ${pad(`--font-weight-${k}:`, 28)} ${v};`)
  }
  lines.push(``)
  for (const [k, v] of Object.entries(p.lineHeight)) {
    lines.push(`  ${pad(`--line-height-${k}:`, 28)} ${v};`)
  }
  lines.push(``)
  for (const [k, v] of Object.entries(p.letterSpacing)) {
    lines.push(`  ${pad(`--letter-spacing-${k}:`, 32)} ${v};`)
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
  lines.push(``)
  lines.push(`  /* Opacity */`)
  for (const [k, v] of Object.entries(p.opacity)) {
    lines.push(`  ${pad(`--opacity-${k}:`, 20)} ${v};`)
  }
  lines.push(``)
  lines.push(`  /* Z-index */`)
  for (const [k, v] of Object.entries(p.zIndex)) {
    lines.push(`  ${pad(`--z-index-${k}:`, 24)} ${v};`)
  }
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
  lines.push(`  /* Icon sizes */`)
  for (const [k, v] of Object.entries(p.iconSize)) {
    lines.push(`  ${pad(`--icon-size-${k}:`, 20)} ${v};`)
  }
  lines.push(``)
  lines.push(`  /* Shadow colors */`)
  lines.push(`  ${pad(`--color-shadow-neutral:`, 24)} ${p.colorShadowNeutral};`)
  if (p.contentFlexibility) {
    lines.push(``)
    lines.push(`  /* Content flexibility */`)
    for (const [k, v] of Object.entries(p.contentFlexibility.lineClamp)) {
      lines.push(`  ${pad(`--line-clamp-${k}:`, 28)} ${v};`)
    }
    lines.push(``)
    for (const [k, v] of Object.entries(p.contentFlexibility.maxWidth)) {
      lines.push(`  ${pad(`--content-max-width-${k}:`, 32)} ${v};`)
    }
    lines.push(``)
    for (const [k, v] of Object.entries(p.contentFlexibility.minWidth)) {
      lines.push(`  ${pad(`--content-min-width-${k}:`, 32)} ${v};`)
    }
  }
  lines.push(``)
  lines.push(`} /* end :root primitive mirror */`)

  return lines.join('\n')
}

// ─── Block 2: :root / light ───────────────────────────────────────────────────

function generateSemanticColorGroup(
  prefix: string,
  group: Record<string, string>,
  indent = '  '
): string[] {
  return Object.entries(group).map(([k, v]) =>
    `${indent}${pad(`--color-${prefix}-${k}:`, 36)} ${v};`
  )
}

function generateLightBlock(
  sem: SemanticBlock,
  colors: Record<string, Record<string, string>>,
  colorMixCollector: ColorMixShadowEntry[]
): string {
  const lines: string[] = []

  lines.push(`:root,`)
  lines.push(`[data-theme="light"] {`)
  lines.push(``)
  lines.push(`  /* ── Background ─────────────────────────────────────────────────────────── */`)
  lines.push(...generateSemanticColorGroup('bg', sem.bg))
  lines.push(``)
  lines.push(`  /* ── Surface ─────────────────────────────────────────────────────────────── */`)
  lines.push(...generateSemanticColorGroup('surface', sem.surface))
  lines.push(``)
  lines.push(`  /* ── Text ────────────────────────────────────────────────────────────────── */`)
  lines.push(...generateSemanticColorGroup('text', sem.text))
  lines.push(``)
  lines.push(`  /* ── Border ──────────────────────────────────────────────────────────────── */`)
  lines.push(...generateSemanticColorGroup('border', sem.border))
  lines.push(``)
  lines.push(`  /* ── Action ──────────────────────────────────────────────────────────────── */`)
  lines.push(...generateSemanticColorGroup('action', sem.action))
  lines.push(``)
  lines.push(`  /* ── Status ──────────────────────────────────────────────────────────────── */`)
  lines.push(...generateSemanticColorGroup('status', sem.status))
  lines.push(``)
  lines.push(`  /* ── State ───────────────────────────────────────────────────────────────── */`)
  lines.push(...generateSemanticColorGroup('state', sem.state))
  if (sem.colorControlThumb) {
    lines.push(``)
    lines.push(`  /* ── Control ────────────────────────────────────────────────────────────── */`)
    lines.push(`  ${pad('--color-control-thumb:', 36)} ${sem.colorControlThumb};`)
  }
  if (sem.colorRing) {
    lines.push(``)
    lines.push(`  /* ── Focus ring ────────────────────────────────────────────────────────── */`)
    lines.push(`  ${pad('--color-ring:', 36)} ${sem.colorRing};`)
  }
  if (sem.dataSeries && Object.keys(sem.dataSeries).length > 0) {
    lines.push(``)
    lines.push(`  /* ── Data series ──────────────────────────────────────────────────────────── */`)
    lines.push(...generateSemanticColorGroup('data-series', sem.dataSeries))
  }

  lines.push(``)
  lines.push(`  /* ── Shadow (resolved for Light) ─────────────────────────────────────────── */`)
  if (sem.shadows) {
    const lightColorMixTokens: Array<{ key: string; value: string }> = []
    for (const [k, v] of Object.entries(sem.shadows)) {
      if (hasColorMix(v)) {
        // Write rgba() fallback in base block
        const fallback = shadowFallbackValue(v, colors)
        if (k === 'default-color') {
          lines.push(`  ${pad(`--shadow-${k}:`, 28)} ${fallback};`)
        } else {
          lines.push(`  --shadow-${k}:`)
          lines.push(`    ${fallback};`)
        }
        // Collect original color-mix() value for @supports block
        lightColorMixTokens.push({ key: k, value: v })
      } else {
        // No color-mix — write as-is
        if (k === 'default-color') {
          lines.push(`  ${pad(`--shadow-${k}:`, 28)} ${v};`)
        } else {
          lines.push(`  --shadow-${k}:`)
          lines.push(`    ${v};`)
        }
      }
    }
    if (lightColorMixTokens.length > 0) {
      colorMixCollector.push({
        selector: ':root,\n[data-theme="light"]',
        tokens: lightColorMixTokens,
      })
    }
  }

  lines.push(``)
  lines.push(`  /* ── Elevation opacity ───────────────────────────────────────────────────── */`)
  if (sem.elevationOpacity) {
    for (const [k, v] of Object.entries(sem.elevationOpacity)) {
      lines.push(`  ${pad(`--elevation-${k}-opacity:`, 28)} ${v};`)
    }
  }

  lines.push(``)
  lines.push(`  /* ── Spacing / component ─────────────────────────────────────────────────── */`)
  for (const [k, v] of Object.entries(sem.spacingComponent)) {
    lines.push(`  ${pad(`--spacing-component-${k}:`, 32)} ${v};`)
  }

  lines.push(``)
  lines.push(`  /* ── Spacing / layout ────────────────────────────────────────────────────── */`)
  for (const [k, v] of Object.entries(sem.spacingLayout)) {
    lines.push(`  ${pad(`--spacing-layout-${k}:`, 28)} ${v};`)
  }

  lines.push(``)
  lines.push(`  /* ── Size / component ─────────────────────────────────────────────────── */`)
  for (const [k, v] of Object.entries(sem.sizeComponent)) {
    lines.push(`  ${pad(`--size-component-${k}:`, 28)} ${v};`)
  }

  lines.push(``)
  lines.push(`  /* ── Radius / component ──────────────────────────────────────────────────── */`)
  for (const [k, v] of Object.entries(sem.radiusComponent)) {
    lines.push(`  ${pad(`--radius-component-${k}:`, 32)} ${v};`)
  }

  lines.push(``)
  lines.push(`  /* ── Motion / component ──────────────────────────────────────────────────── */`)
  const motionDuration: Record<string, string> = sem.motion?.duration ?? {}
  const motionEasing: Record<string, string> = sem.motion?.easing ?? {}
  for (const [k, v] of Object.entries(motionDuration)) {
    lines.push(`  ${pad(`--duration-${k}:`, 28)} ${v};`)
  }
  for (const [k, v] of Object.entries(motionEasing)) {
    lines.push(`  ${pad(`--ease-${k}:`, 28)} ${v};`)
  }

  lines.push(``)
  lines.push(`  /* ── Z / layer ───────────────────────────────────────────────────────────── */`)
  for (const [k, v] of Object.entries(sem.layer)) {
    lines.push(`  ${pad(`--layer-${k}:`, 28)} ${v};`)
  }

  lines.push(``)
  lines.push(`  /* ── Border widths ───────────────────────────────────────────────────────── */`)
  for (const [k, v] of Object.entries(sem.borders)) {
    lines.push(`  ${pad(`--border-${k}:`, 32)} ${v};`)
  }

  if (sem.contentFlexibility) {
    lines.push(``)
    lines.push(`  /* ── Content flexibility ───────────────────────────────────────────────── */`)
    for (const [k, v] of Object.entries(sem.contentFlexibility)) {
      lines.push(`  ${pad(`--content-${k}:`, 40)} ${v};`)
    }
  }
  // Note: --card-shell-min-width is defined in the component tokens section (preserved below the
  // GENERATED COMPONENT TOKENS marker) — do not duplicate it in the :root block.

  // --color-overlay-backdrop is defined per-theme in the component tokens section (below the
  // GENERATED COMPONENT TOKENS marker) — do not duplicate it here.

  lines.push(``)
  lines.push(`  /* ── Icon semantic aliases ───────────────────────────────────────────────── */`)
  lines.push(`  ${pad('--icon-semantic-xs:', 36)} var(--icon-size-xs);`)
  lines.push(`  ${pad('--icon-semantic-sm:', 36)} var(--icon-size-sm);`)
  lines.push(`  ${pad('--icon-semantic-md:', 36)} var(--icon-size-md);`)
  lines.push(`  ${pad('--icon-semantic-lg:', 36)} var(--icon-size-lg);`)
  lines.push(`  ${pad('--icon-semantic-xl:', 36)} var(--icon-size-xl);`)
  lines.push(`  ${pad('--icon-semantic-2xl:', 36)} var(--icon-size-2xl);`)
  lines.push(``)
  lines.push(`  /* ── Size icon bridge aliases (components use --size-icon-* convention) ─── */`)
  lines.push(`  ${pad('--size-icon-xs:', 36)} var(--icon-semantic-xs);`)
  lines.push(`  ${pad('--size-icon-sm:', 36)} var(--icon-semantic-sm);`)
  lines.push(`  ${pad('--size-icon-md:', 36)} var(--icon-semantic-md);`)
  lines.push(`  ${pad('--size-icon-lg:', 36)} var(--icon-semantic-lg);`)
  lines.push(`  ${pad('--size-icon-xl:', 36)} var(--icon-semantic-xl);`)
  lines.push(`  ${pad('--size-icon-2xl:', 36)} var(--icon-semantic-2xl);`)

  lines.push(``)
  lines.push(`  /* ── Size fixed references ────────────────────────────────────────────────── */`)
  if (sem.sizeFixed && Object.keys(sem.sizeFixed).length > 0) {
    for (const [k, v] of Object.entries(sem.sizeFixed)) {
      lines.push(`  ${pad(`--size-fixed-${k}:`, 36)} ${v};`)
    }
  }

  lines.push(``)
  lines.push(`  /* ── Typography semantics tokens ─────────────────────────────────────────── */`)
  if (sem.typographySemantics && Object.keys(sem.typographySemantics).length > 0) {
    for (const [style, tokens] of Object.entries(sem.typographySemantics)) {
      if (!tokens?.size) continue
      lines.push(`  ${pad(`--typography-${style}-size:`, 36)} ${tokens.size};`)
      lines.push(`  ${pad(`--typography-${style}-weight:`, 36)} ${tokens.weight};`)
      lines.push(`  ${pad(`--typography-${style}-leading:`, 36)} ${tokens.leading};`)
      lines.push(`  ${pad(`--typography-${style}-tracking:`, 36)} ${tokens.tracking};`)
    }
  }

  lines.push(`}`)
  return lines.join('\n')
}

// ─── Block 3: dark mode ───────────────────────────────────────────────────────

function generateDarkBlock(
  dark: Partial<SemanticBlock>,
  colors: Record<string, Record<string, string>>,
  colorMixCollector: ColorMixShadowEntry[]
): string {
  const lines: string[] = []
  lines.push(`/* ── DARK MODE ─────────────────────────────────────────────────────────────── */`)
  lines.push(`[data-theme="dark"] {`)
  lines.push(``)

  if (dark.bg) { lines.push(...generateSemanticColorGroup('bg', dark.bg)); lines.push(``) }
  if (dark.surface) { lines.push(...generateSemanticColorGroup('surface', dark.surface)); lines.push(``) }
  if (dark.text) { lines.push(...generateSemanticColorGroup('text', dark.text)); lines.push(``) }
  if (dark.border) { lines.push(...generateSemanticColorGroup('border', dark.border)); lines.push(``) }
  if (dark.action) { lines.push(...generateSemanticColorGroup('action', dark.action)); lines.push(``) }
  if (dark.status) { lines.push(...generateSemanticColorGroup('status', dark.status)); lines.push(``) }
  if (dark.state) { lines.push(...generateSemanticColorGroup('state', dark.state)); lines.push(``) }
  if (dark.colorControlThumb) {
    lines.push(`  /* ── Control ────────────────────────────────────────────────────────────── */`)
    lines.push(`  ${pad('--color-control-thumb:', 36)} ${dark.colorControlThumb};`)
    lines.push(``)
  }
  if (dark.colorRing) {
    lines.push(`  /* ── Focus ring ────────────────────────────────────────────────────────── */`)
    lines.push(`  ${pad('--color-ring:', 36)} ${dark.colorRing};`)
    lines.push(``)
  }
  if (dark.dataSeries && Object.keys(dark.dataSeries).length > 0) {
    lines.push(`  /* ── Data series (brighter for dark backgrounds) ──────────────────────────── */`)
    lines.push(...generateSemanticColorGroup('data-series', dark.dataSeries))
    lines.push(``)
  }

  if (dark.elevationOpacity) {
    lines.push(`  /* Elevated shadows are deeper in dark mode */`)
    for (const [k, v] of Object.entries(dark.elevationOpacity)) {
      lines.push(`  ${pad(`--elevation-${k}-opacity:`, 28)} ${v};`)
    }
    lines.push(``)
  }

  if (dark.shadows) {
    const darkColorMixTokens: Array<{ key: string; value: string }> = []
    for (const [k, v] of Object.entries(dark.shadows)) {
      if (hasColorMix(v)) {
        const fallback = shadowFallbackValue(v, colors)
        lines.push(`  --shadow-${k}:`)
        lines.push(`    ${fallback};`)
        darkColorMixTokens.push({ key: k, value: v })
      } else {
        lines.push(`  --shadow-${k}:`)
        lines.push(`    ${v};`)
      }
    }
    if (darkColorMixTokens.length > 0) {
      colorMixCollector.push({
        selector: '[data-theme="dark"]',
        tokens: darkColorMixTokens,
      })
    }
  }

  lines.push(`}`)
  return lines.join('\n')
}

// ─── Cross-browser @supports block for color-mix() shadows ───────────────────

function generateColorMixSupportsBlock(entries: ColorMixShadowEntry[]): string {
  if (entries.length === 0) return ''
  const lines: string[] = []
  lines.push(`/* =============================================================================`)
  lines.push(`   CROSS-BROWSER: color-mix() shadow overrides`)
  lines.push(`   Browsers that support color-mix() get the dynamic shadow values below.`)
  lines.push(`   Older browsers use the static rgba() fallbacks declared in the base blocks.`)
  lines.push(`   ============================================================================= */`)
  lines.push(``)
  lines.push(`@supports (color: color-mix(in srgb, red 50%, blue)) {`)
  for (const entry of entries) {
    lines.push(`  ${entry.selector} {`)
    for (const { key, value } of entry.tokens) {
      if (key === 'default-color') {
        lines.push(`    ${pad(`--shadow-${key}:`, 28)} ${value};`)
      } else {
        lines.push(`    --shadow-${key}:`)
        lines.push(`      ${value};`)
      }
    }
    lines.push(`  }`)
  }
  lines.push(`}`)
  return lines.join('\n')
}

// ─── Generic @supports block framework ───────────────────────────────────────
// A generalized system for generating @supports blocks. Each SupportsEntry
// represents one feature-detection block with its condition and CSS output.

interface SupportsEntry {
  /** Human-readable label for the block comment */
  label: string
  /** CSS @supports condition, e.g. '(text-wrap: balance)' */
  condition: string
  /** Raw CSS lines to output inside the @supports block */
  cssLines: string[]
}

/** Build a text-wrap: balance @supports entry for heading typography classes */
function buildTextWrapSupportsEntry(classes: TypographyClass[]): SupportsEntry | null {
  const headingNames = classes
    .filter(cls => cls.name.startsWith('text-heading-'))
    .map(cls => `.${cls.name}`)
  if (headingNames.length === 0) return null
  return {
    label: 'text-wrap: balance for headings',
    condition: '(text-wrap: balance)',
    cssLines: [
      `  ${headingNames.join(',\n  ')} {`,
      `    text-wrap: balance;`,
      `  }`,
    ],
  }
}

/** Build a View Transitions @supports entry for smooth theme switching */
function buildViewTransitionsSupportsEntry(): SupportsEntry {
  return {
    label: 'View Transitions for smooth theme switching',
    condition: '(view-transition-name: none)',
    cssLines: [
      `  ::view-transition-old(root),`,
      `  ::view-transition-new(root) {`,
      `    animation-duration: var(--duration-transition);`,
      `    animation-timing-function: var(--ease-default);`,
      `  }`,
    ],
  }
}

/** Generate all generic @supports blocks from SupportsEntry array */
function generateSupportsBlocks(entries: SupportsEntry[]): string {
  const validEntries = entries.filter((e): e is SupportsEntry => e !== null)
  if (validEntries.length === 0) return ''
  const lines: string[] = []
  for (const entry of validEntries) {
    lines.push(`/* ── Progressive enhancement: ${entry.label} ──${'─'.repeat(Math.max(0, 50 - entry.label.length))} */`)
    lines.push(`@supports ${entry.condition} {`)
    lines.push(...entry.cssLines)
    lines.push(`}`)
    lines.push(``)
  }
  return lines.join('\n')
}

// ─── Block 5: Typography classes ─────────────────────────────────────────────

function generateTypographyBlock(classes: TypographyClass[]): string {
  const lines: string[] = []

  lines.push(`/* =============================================================================`)
  lines.push(`   TYPOGRAPHY — Text style utility classes`)
  lines.push(`   Each class maps to the semantic typography token (font-family, size, weight,`)
  lines.push(`   line-height, letter-spacing). Use these classes directly on HTML elements.`)
  lines.push(`   ============================================================================= */`)
  lines.push(``)

  const groups: Record<string, TypographyClass[]> = {}
  for (const cls of classes) {
    const group = cls.name.replace('text-', '').split('-')[0]
    if (!groups[group]) groups[group] = []
    groups[group].push(cls)
  }

  for (const [groupName, items] of Object.entries(groups)) {
    const label = groupName.charAt(0).toUpperCase() + groupName.slice(1)
    lines.push(`/* ── ${label} ${'─'.repeat(Math.max(0, 72 - label.length - 6))} */`)
    for (const cls of items) {
      // Extract semantic token name from class name (e.g., "display-hero" from "text-display-hero")
      const cssName = cls.name.replace('text-', '')
      lines.push(`.${cls.name} {`)
      lines.push(`  font-family: ${cls.fontFamily};`)
      lines.push(`  font-size:    var(--typography-${cssName}-size);`)
      lines.push(`  font-weight:  var(--typography-${cssName}-weight);`)
      lines.push(`  line-height:  var(--typography-${cssName}-leading);`)
      lines.push(`  letter-spacing: var(--typography-${cssName}-tracking);`)
      if (cls.textTransform) lines.push(`  text-transform: ${cls.textTransform};`)
      lines.push(`}`)
    }
    lines.push(``)
  }

  return lines.join('\n')
}

// ─── Block 6: Semantic utility classes (static) ───────────────────────────────

const SEMANTIC_UTILITIES = `/* =============================================================================
   SEMANTIC UTILITY CLASSES
   Convenience classes that consume the semantic CSS custom properties above.
   These work with light/dark theme switching automatically.
   ============================================================================= */

/* ── Background ────────────────────────────────────────────────────────────── */
.bg-primary   { background-color: var(--color-bg-primary); }
.bg-secondary { background-color: var(--color-bg-secondary); }
.bg-tertiary  { background-color: var(--color-bg-tertiary); }
.bg-inverse   { background-color: var(--color-bg-inverse); }

/* ── Surface ───────────────────────────────────────────────────────────────── */
.surface-default { background-color: var(--color-surface-default); }
.surface-raised  { background-color: var(--color-surface-raised); }
.surface-overlay { background-color: var(--color-surface-overlay); }

/* ── Text ──────────────────────────────────────────────────────────────────── */
.text-primary   { color: var(--color-text-primary); }
.text-secondary { color: var(--color-text-secondary); }
.text-tertiary  { color: var(--color-text-tertiary); }
.text-disabled  { color: var(--color-text-disabled); }
.text-inverse   { color: var(--color-text-inverse); }
.text-accent    { color: var(--color-text-accent); }

/* ── Border ────────────────────────────────────────────────────────────────── */
.border-default { border-color: var(--color-border-default); }
.border-subtle  { border-color: var(--color-border-subtle); }
.border-strong  { border-color: var(--color-border-strong); }
.border-focus   { border-color: var(--color-border-focus); }
.border-error   { border-color: var(--color-border-error); }
.border-success { border-color: var(--color-border-success); }
.border-warning { border-color: var(--color-border-warning); }

/* ── Action ────────────────────────────────────────────────────────────────── */
.bg-action-primary        { background-color: var(--color-action-primary); }
.bg-action-primary-hover  { background-color: var(--color-action-primary-hover); }
.bg-action-primary-active { background-color: var(--color-action-primary-active); }
.bg-action-secondary      { background-color: var(--color-action-secondary); }
.bg-action-disabled       { background-color: var(--color-action-disabled); }
.bg-action-accent         { background-color: var(--color-action-accent); }

/* ── Status ────────────────────────────────────────────────────────────────── */
.bg-status-success        { background-color: var(--color-status-success); }
.bg-status-success-subtle { background-color: var(--color-status-success-subtle); }
.bg-status-warning        { background-color: var(--color-status-warning); }
.bg-status-warning-subtle { background-color: var(--color-status-warning-subtle); }
.bg-status-error          { background-color: var(--color-status-error); }
.bg-status-error-subtle   { background-color: var(--color-status-error-subtle); }
.bg-status-info           { background-color: var(--color-status-info); }
.bg-status-info-subtle    { background-color: var(--color-status-info-subtle); }

/* ── Component sizes ───────────────────────────────────────────────────────── */
.size-component-xs  { width: var(--size-component-xs);  height: var(--size-component-xs); }
.size-component-sm  { width: var(--size-component-sm);  height: var(--size-component-sm); }
.size-component-md  { width: var(--size-component-md);  height: var(--size-component-md); }
.size-component-lg  { width: var(--size-component-lg);  height: var(--size-component-lg); }
.size-component-xl  { width: var(--size-component-xl);  height: var(--size-component-xl); }
.size-component-2xl { width: var(--size-component-2xl); height: var(--size-component-2xl); }

/* ── Shadows ───────────────────────────────────────────────────────────────── */
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
.shadow-xl { box-shadow: var(--shadow-xl); }

/* ── Focus ring ────────────────────────────────────────────────────────────── */
.focus-ring {
  outline: var(--border-focus-ring) solid var(--color-border-focus-visible);
  outline-offset: 2px;
}
.focus-ring-inset {
  box-shadow: inset 0 0 0 var(--border-focus-ring) var(--color-border-focus-visible);
}

/* ── Skeleton / loading shimmer ────────────────────────────────────────────── */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-state-loading) 25%,
    var(--color-state-loading-shine) 50%,
    var(--color-state-loading) 75%
  );
  background-size: 200% 100%;
  animation: shimmer var(--duration-slower) var(--ease-in-out) infinite;
  border-radius: var(--radius-component-sm);
}

/* ── Transitions (semantic shortcuts) ─────────────────────────────────────── */
.transition-default {
  transition-duration:        var(--duration-transition);
  transition-timing-function: var(--ease-default);
}
.transition-enter {
  transition-duration:        var(--duration-enter);
  transition-timing-function: var(--ease-default);
}
.transition-emphasis {
  transition-duration:        var(--duration-transition);
  transition-timing-function: var(--ease-emphasis);
}
.transition-spring {
  transition-duration:        var(--duration-slow);
  transition-timing-function: var(--ease-spring);
}

/* ── Container queries ────────────────────────────────────────────────────── */
.container-inline { container-type: inline-size; }

/* ── Content flexibility ──────────────────────────────────────────────────── */

/* Truncate single line — labels, nav items, tags, breadcrumb items */
.truncate-label {
  overflow: var(--content-overflow-label);
  white-space: var(--content-whitespace-label);
  text-overflow: var(--content-text-overflow-label);
  min-width: var(--content-min-width-label);
}

/* Line-clamped multi-line — descriptions, body previews (2 lines) */
.clamp-description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--content-lines-description);
  overflow: var(--content-overflow-body);
  word-break: var(--content-word-break-body);
}

/* Line-clamped multi-line — body text (3 lines) */
.clamp-body {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--content-lines-body);
  overflow: var(--content-overflow-body);
  word-break: var(--content-word-break-body);
}

/* Force single-line clamp */
.clamp-single {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--content-lines-single);
  overflow: var(--content-overflow-label);
}

/* Parametric clamp — pair with component token for -webkit-line-clamp */
.clamp-lines {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Flex-child content container — prevents flex blowout */
.content-flex {
  min-width: var(--content-min-width-label);
  flex: 1 1 0%;
}

/* Nowrap for button/chip/badge text that must never wrap */
.content-nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Empty state placeholder */
.empty-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: var(--spacing-component-sm);
  min-height: var(--content-empty-min-height);
  color: var(--content-empty-color);
  background-color: var(--content-empty-bg);
  border-radius: var(--content-empty-radius);
}

.empty-placeholder-icon {
  width: var(--content-empty-icon-size);
  height: var(--content-empty-icon-size);
  color: var(--content-empty-icon-color);
}

/* ── Responsive component protection ─────────────────────────────────── */

/* Card-shell layout — organisms and molecules with header + body pattern.
   Provides min-width floor and overflow guard so extreme container shrinking
   triggers horizontal scroll rather than content overlap. Apply to the
   outermost container of card-like components (charts, cards, panels).
   Override --card-shell-min-width per-component via component tokens. */
.card-shell {
  min-width: var(--card-shell-min-width, var(--content-min-width-md));
  overflow: hidden;
}

/* Header row — title + action (e.g. select, button) side by side.
   Wraps gracefully when container is too narrow for both inline. */
.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-component-md);
  flex-wrap: wrap;
}

/* Header title area — shrinks to make room for trailing actions. */
.card-header-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-component-sm);
  flex: 1 1 0%;
  min-width: var(--content-min-width-xs);
}

/* Metric row — large number + delta/label side by side. Wraps at narrow widths. */
.card-metric-row {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-component-md);
  flex-wrap: wrap;
}
`

// ─── Accessibility Utility Classes ────────────────────────────────────────────
// These classes are generated as part of the CSS output so they survive every
// app save. They implement WCAG 2.2 AA requirements for screen readers,
// reduced motion, forced colors, and enhanced contrast.

const ACCESSIBILITY_UTILITIES = `/* =============================================================================
   ACCESSIBILITY UTILITIES
   WCAG 2.2 AA utility classes for screen readers, reduced motion, forced
   colors, enhanced contrast, skip links, and touch target expansion.
   ============================================================================= */

/* ── Screen-reader only (visually hidden, announced by assistive tech) ──── */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* ── Screen-reader only but visible on focus (for skip links) ──────────── */
.sr-only-focusable:not(:focus):not(:focus-within) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* ── Skip link (skip to main content) ──────────────────────────────────── */
.skip-link {
  position: absolute;
  top: var(--skip-link-offset, 0.5rem);
  left: var(--skip-link-offset, 0.5rem);
  z-index: var(--layer-popover, 60);
  padding: var(--spacing-component-sm) var(--spacing-component-lg);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: var(--border-focus-ring) solid var(--color-border-focus-visible);
  border-radius: var(--radius-component-md);
  font-weight: 600;
  text-decoration: none;
  transform: translateY(calc(-100% - var(--skip-link-offset, 0.5rem)));
  transition: transform var(--duration-interaction) var(--ease-default);
}
.skip-link:focus-visible {
  transform: translateY(0);
  outline: none;
}
/* Force the skip link to be visible regardless of focus state */
.skip-link--force-visible {
  transform: translateY(0);
}

/* ── Touch target expansion (WCAG 2.5.8 — 24×24px minimum) ────────────── */
.touch-target {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.touch-target::after {
  content: '';
  position: absolute;
  inset: 50% auto auto 50%;
  min-width: var(--size-touch-target-min, 1.5rem);
  min-height: var(--size-touch-target-min, 1.5rem);
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
}

/* ── Landmark label (visually hidden label for aria-labelledby) ─────────── */
.landmark-label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* ── Reduced motion (WCAG 2.3.3) ───────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ── Forced colors / Windows High Contrast (WCAG 1.4.11) ──────────────── */
@media (forced-colors: active) {
  .focus-ring {
    outline-color: Highlight;
  }
  .focus-ring-inset {
    box-shadow: inset 0 0 0 var(--border-focus-ring) Highlight;
  }
  .skeleton {
    background: GrayText;
    animation: none;
  }
  .border-default,
  .border-subtle {
    border-color: CanvasText;
  }
}

/* ── Enhanced contrast (WCAG 1.4.6 AAA / prefers-contrast) ────────────── */
@media (prefers-contrast: more) {
  :root {
    --border-interactive: 2px;
    --border-focus-ring: 3px;
  }
  .focus-ring {
    outline-width: 3px;
  }
  .border-subtle {
    border-color: var(--color-border-strong);
  }
}
`

// ─── Block 6b: Performance utilities ──────────────────────────────────────────

const PERFORMANCE_UTILITIES = `/* =============================================================================
   PERFORMANCE UTILITIES
   Opt-in CSS performance hints for containment, GPU promotion, and content
   visibility. Apply via className — never applied by default.
   ============================================================================= */

/* ── CSS Containment ───────────────────────────────────────────────────── */
/* Use on repeated list items, cards, sidebar groups — any element whose
   layout/paint is independent of its siblings. */
.perf-contain-layout  { contain: layout; }
.perf-contain-paint   { contain: layout paint; }
.perf-contain-strict  { contain: layout style paint; }
.perf-contain-content { contain: content; }

/* ── GPU Layer Promotion (for elements that transition transform/opacity) ─ */
/* Apply to elements with .transition-default that animate transform or opacity.
   Use sparingly — each promoted layer consumes GPU memory. */
.perf-gpu-layer { will-change: transform; }

/* ── Will-change on hover only (preferred pattern) ─────────────────────── */
/* Add .perf-will-change-transform to a parent; the will-change activates only
   on :hover/:focus-within, then auto-reverts after interaction. */
.perf-will-change-transform:hover,
.perf-will-change-transform:focus-within {
  will-change: transform;
}
.perf-will-change-opacity:hover,
.perf-will-change-opacity:focus-within {
  will-change: opacity;
}

/* ── Content Visibility (off-screen optimization) ──────────────────────── */
/* Skips rendering of off-screen content. Use on long lists, accordion panels,
   sidebar sections below the fold. Must set contain-intrinsic-size for correct
   scrollbar behavior. */
.perf-content-auto {
  content-visibility: auto;
  contain-intrinsic-size: auto 300px;
}
.perf-content-auto-sm {
  content-visibility: auto;
  contain-intrinsic-size: auto 100px;
}
.perf-content-auto-lg {
  content-visibility: auto;
  contain-intrinsic-size: auto 600px;
}
`

// ─── Block 7: Responsive overrides ───────────────────────────────────────────

function generateResponsiveBlock(tokens: GeeklegoTokens): string {
  const overrides = tokens.responsiveOverrides
  if (!overrides || overrides.length === 0) return ''

  const lines: string[] = []
  lines.push(`/* =============================================================================`)
  lines.push(`   RESPONSIVE TOKEN OVERRIDES`)
  lines.push(`   Layout spacing scales down on smaller viewports. Component spacing stays fixed.`)
  lines.push(`   ============================================================================= */`)
  lines.push(``)

  for (const override of overrides) {
    if (!override.spacingLayout || Object.keys(override.spacingLayout).length === 0) continue
    lines.push(`@media (max-width: ${override.maxWidth}) {`)
    lines.push(`  :root,`)
    lines.push(`  [data-theme="light"],`)
    lines.push(`  [data-theme="dark"] {`)
    for (const [k, v] of Object.entries(override.spacingLayout)) {
      lines.push(`    ${pad(`--spacing-layout-${k}:`, 28)} ${v};`)
    }
    lines.push(`  }`)
    lines.push(`}`)
    lines.push(``)
  }

  return lines.join('\n')
}

// ─── Block 8: Responsive typography (opt-in -responsive classes) ─────────────

const RESPONSIVE_TYPO_MAP: {
  name: string
  desktop: { fontSize: string; lineHeight: string }
  tablet:  { fontSize: string; lineHeight?: string }
  mobile:  { fontSize: string; lineHeight?: string }
}[] = [
  { name: 'text-display-hero-responsive', desktop: { fontSize: 'var(--font-size-96)', lineHeight: 'var(--line-height-5xl)' }, tablet: { fontSize: 'var(--font-size-72)' }, mobile: { fontSize: 'var(--font-size-48)', lineHeight: 'var(--line-height-3xl)' } },
  { name: 'text-display-3xl-responsive',  desktop: { fontSize: 'var(--font-size-80)', lineHeight: 'var(--line-height-5xl)' }, tablet: { fontSize: 'var(--font-size-64)' }, mobile: { fontSize: 'var(--font-size-40)', lineHeight: 'var(--line-height-2xl)' } },
  { name: 'text-display-2xl-responsive',  desktop: { fontSize: 'var(--font-size-72)', lineHeight: 'var(--line-height-5xl)' }, tablet: { fontSize: 'var(--font-size-56)' }, mobile: { fontSize: 'var(--font-size-36)', lineHeight: 'var(--line-height-2xl)' } },
  { name: 'text-display-xl-responsive',   desktop: { fontSize: 'var(--font-size-64)', lineHeight: 'var(--line-height-5xl)' }, tablet: { fontSize: 'var(--font-size-48)' }, mobile: { fontSize: 'var(--font-size-32)', lineHeight: 'var(--line-height-xl)' } },
  { name: 'text-display-lg-responsive',   desktop: { fontSize: 'var(--font-size-56)', lineHeight: 'var(--line-height-4xl)' }, tablet: { fontSize: 'var(--font-size-40)' }, mobile: { fontSize: 'var(--font-size-28)', lineHeight: 'var(--line-height-xl)' } },
  { name: 'text-display-md-responsive',   desktop: { fontSize: 'var(--font-size-48)', lineHeight: 'var(--line-height-3xl)' }, tablet: { fontSize: 'var(--font-size-36)' }, mobile: { fontSize: 'var(--font-size-24)', lineHeight: 'var(--line-height-tight)' } },
  { name: 'text-display-sm-responsive',   desktop: { fontSize: 'var(--font-size-40)', lineHeight: 'var(--line-height-2xl)' }, tablet: { fontSize: 'var(--font-size-32)' }, mobile: { fontSize: 'var(--font-size-24)', lineHeight: 'var(--line-height-tight)' } },
  { name: 'text-heading-h1-responsive',   desktop: { fontSize: 'var(--font-size-36)', lineHeight: 'var(--line-height-tight)' }, tablet: { fontSize: 'var(--font-size-32)' }, mobile: { fontSize: 'var(--font-size-28)' } },
  { name: 'text-heading-h2-responsive',   desktop: { fontSize: 'var(--font-size-32)', lineHeight: 'var(--line-height-tight)' }, tablet: { fontSize: 'var(--font-size-28)' }, mobile: { fontSize: 'var(--font-size-24)' } },
  { name: 'text-heading-h3-responsive',   desktop: { fontSize: 'var(--font-size-28)', lineHeight: 'var(--line-height-tight)' }, tablet: { fontSize: 'var(--font-size-24)' }, mobile: { fontSize: 'var(--font-size-20)' } },
  { name: 'text-heading-h4-responsive',   desktop: { fontSize: 'var(--font-size-24)', lineHeight: 'var(--line-height-tight)' }, tablet: { fontSize: 'var(--font-size-20)' }, mobile: { fontSize: 'var(--font-size-20)' } },
]

function generateResponsiveTypography(): string {
  const lines: string[] = []
  lines.push(`/* =============================================================================`)
  lines.push(`   RESPONSIVE TYPOGRAPHY — opt-in classes that scale down on smaller viewports`)
  lines.push(`   Use .text-display-hero-responsive instead of .text-display-hero when you want`)
  lines.push(`   viewport-aware font scaling. Original classes remain unchanged (desktop sizes).`)
  lines.push(`   ============================================================================= */`)
  lines.push(``)

  const tabletOverrides: string[] = []
  const mobileOverrides: string[] = []

  for (const entry of RESPONSIVE_TYPO_MAP) {
    const isHeading = entry.name.includes('heading')
    lines.push(`.${entry.name} {`)
    lines.push(`  font-family: var(--font-family-sans);`)
    lines.push(`  font-size:    ${entry.desktop.fontSize};`)
    lines.push(`  font-weight:  ${isHeading ? (entry.name.includes('h1') || entry.name.includes('h2') ? 'var(--font-weight-bold)' : 'var(--font-weight-semibold)') : 'var(--font-weight-bold)'};`)
    lines.push(`  line-height:  ${entry.desktop.lineHeight};`)
    lines.push(`  letter-spacing: ${isHeading ? 'var(--letter-spacing-tight)' : 'var(--letter-spacing-tightest)'};`)
    lines.push(`}`)

    // Collect tablet overrides
    let tabletLine = `  .${entry.name} { font-size: ${entry.tablet.fontSize};`
    if (entry.tablet.lineHeight) tabletLine += ` line-height: ${entry.tablet.lineHeight};`
    tabletLine += ` }`
    tabletOverrides.push(tabletLine)

    // Collect mobile overrides
    let mobileLine = `  .${entry.name} { font-size: ${entry.mobile.fontSize};`
    if (entry.mobile.lineHeight) mobileLine += ` line-height: ${entry.mobile.lineHeight};`
    mobileLine += ` }`
    mobileOverrides.push(mobileLine)
  }

  lines.push(``)
  lines.push(`/* ── Tablet (<1024px) ─────────────────────────────────────────────────────── */`)
  lines.push(`@media (max-width: 1023px) {`)
  lines.push(...tabletOverrides)
  lines.push(`}`)
  lines.push(``)
  lines.push(`/* ── Mobile (<768px) ──────────────────────────────────────────────────────── */`)
  lines.push(`@media (max-width: 767px) {`)
  lines.push(...mobileOverrides)
  lines.push(`}`)
  lines.push(``)

  return lines.join('\n')
}

// ─── Main generator ───────────────────────────────────────────────────────────

export function generateCss(tokens: GeeklegoTokens): string {
  const now = new Date().toISOString().split('T')[0]
  const header = `/* =============================================================================
   geeklego — Tailwind CSS v4 Design System
   Generated by Geeklego Token Editor
   Date: ${now}
   ============================================================================= */
`
  // Collect color-mix() shadow tokens across light/dark blocks for @supports override
  const colorMixCollector: ColorMixShadowEntry[] = []
  const colors = tokens.primitives.colors

  const parts = [
    header,
    generateThemeBlock(tokens),
    '',
    '',
    generateLightBlock(tokens.semantics.light, colors, colorMixCollector),
    '',
    '',
    generateDarkBlock(tokens.semantics.dark, colors, colorMixCollector),
    '',
    '',
  ]

  // Insert @supports block for color-mix() shadows (existing pattern)
  const colorMixBlock = generateColorMixSupportsBlock(colorMixCollector)
  if (colorMixBlock) {
    parts.push(colorMixBlock, '', '')
  }

  // Collect generic @supports entries for progressive enhancement
  const supportsEntries: (SupportsEntry | null)[] = [
    buildTextWrapSupportsEntry(tokens.typographyClasses),
    buildViewTransitionsSupportsEntry(),
  ]
  const supportsOutput = generateSupportsBlocks(supportsEntries.filter(Boolean) as SupportsEntry[])
  if (supportsOutput) {
    parts.push(supportsOutput, '')
  }

  parts.push(
    generateTypographyBlock(tokens.typographyClasses),
    SEMANTIC_UTILITIES,
    ACCESSIBILITY_UTILITIES,
    PERFORMANCE_UTILITIES,
    generateResponsiveBlock(tokens),
    generateResponsiveTypography(),
  )

  return parts.join('\n')
}
