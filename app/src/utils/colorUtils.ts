// ─── rem → px annotation ──────────────────────────────────────────────────────

/** Returns "1rem · 16px" for rem values, or the original string unchanged. */
export function withPxAnnotation(value: string): string {
  const match = value.match(/^([\d.]+)rem$/)
  if (!match) return value
  const px = Math.round(parseFloat(match[1]) * 16)
  return `${value} · ${px}px`
}

// ─── Hex / RGB ────────────────────────────────────────────────────────────────

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  const n = parseInt(clean, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')
}

// ─── HSV ─────────────────────────────────────────────────────────────────────

export function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const rgb = hexToRgb(hex)
  if (!rgb) return { h: 0, s: 0, v: 0 }
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h = (h * 60 + 360) % 360
  }
  return { h, s: max === 0 ? 0 : d / max, v: max }
}

export function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
  }
  return rgbToHex(f(5) * 255, f(3) * 255, f(1) * 255)
}

// ─── Contrast ─────────────────────────────────────────────────────────────────

/**
 * WCAG 2.x relative luminance of a hex color (0 = black, 1 = white).
 * Linearizes each sRGB channel, then applies the Rec.709 luma weights.
 * Returns 0 for non-hex input.
 */
export function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
    const c = v / 255
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * WCAG 2.x contrast ratio between two hex colors: (Llighter + 0.05) / (Ldarker + 0.05).
 * Ranges 1 (identical) → 21 (black vs white). Order-independent.
 */
export function contrastRatio(hexA: string, hexB: string): number {
  const la = relativeLuminance(hexA)
  const lb = relativeLuminance(hexB)
  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return (lighter + 0.05) / (darker + 0.05)
}

export function getContrastColor(hex: string): 'black' | 'white' {
  if (!hexToRgb(hex)) return 'white'
  return relativeLuminance(hex) > 0.179 ? 'black' : 'white'
}

// ─── OKLCH ────────────────────────────────────────────────────────────────────

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
}

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function hexToLinearRgb(hex: string): [number, number, number] | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  return [srgbToLinear(rgb.r / 255), srgbToLinear(rgb.g / 255), srgbToLinear(rgb.b / 255)]
}

function linearRgbToOklch(r: number, g: number, b: number): { l: number; c: number; h: number } {
  // Linear sRGB → LMS (Oklab matrix)
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

  const lp = Math.cbrt(l), mp = Math.cbrt(m), sp = Math.cbrt(s)

  // LMS → OKLab
  const L =  0.2104542553 * lp + 0.7936177850 * mp - 0.0040720468 * sp
  const a =  1.9779984951 * lp - 2.4285922050 * mp + 0.4505937099 * sp
  const bk = 0.0259040371 * lp + 0.7827717662 * mp - 0.8086757660 * sp

  const C = Math.sqrt(a * a + bk * bk)
  const H = (Math.atan2(bk, a) * 180) / Math.PI

  return { l: L, c: C, h: (H + 360) % 360 }
}

function oklchToLinearRgb(L: number, C: number, H: number): [number, number, number] {
  const hRad = (H * Math.PI) / 180
  const a = C * Math.cos(hRad)
  const b = C * Math.sin(hRad)

  const lp = L + 0.3963377774 * a + 0.2158037573 * b
  const mp = L - 0.1055613458 * a - 0.0638541728 * b
  const sp = L - 0.0894841775 * a - 1.2914855480 * b

  const l = lp * lp * lp
  const m = mp * mp * mp
  const s = sp * sp * sp

  const r =  4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const bk = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s

  return [r, g, bk]
}

function isInGamut(r: number, g: number, b: number): boolean {
  const eps = 0.0001
  return r >= -eps && r <= 1 + eps && g >= -eps && g <= 1 + eps && b >= -eps && b <= 1 + eps
}

/**
 * Reduce chroma via binary search until (L, C, H) is inside the sRGB gamut.
 * Returns the in-gamut OKLCH triple (L and H unchanged; C clamped down as needed).
 */
function gamutMapOklch(L: number, C: number, H: number): { l: number; c: number; h: number } {
  let lo = 0, hi = C, mapped = C
  for (let i = 0; i < 25; i++) {
    const mid = (lo + hi) / 2
    const [r, g, b] = oklchToLinearRgb(L, mid, H)
    if (isInGamut(r, g, b)) { lo = mid; mapped = mid } else hi = mid
  }
  return { l: L, c: mapped, h: H }
}

function oklchToHex(L: number, C: number, H: number): string {
  const { l, c, h } = gamutMapOklch(L, C, H)
  const [r, g, b] = oklchToLinearRgb(l, c, h)
  return rgbToHex(
    Math.round(Math.max(0, Math.min(1, linearToSrgb(r))) * 255),
    Math.round(Math.max(0, Math.min(1, linearToSrgb(g))) * 255),
    Math.round(Math.max(0, Math.min(1, linearToSrgb(b))) * 255),
  )
}

/**
 * Format an OKLCH triple as a Tailwind-v4-style `oklch(L% C H)` string.
 * L is emitted as a percentage (Tailwind's form, e.g. `oklch(62.3% 0.214 259.815)`);
 * C to 3 decimals; H to 3 decimals (omitted as 0 for achromatic colors). The triple
 * is gamut-mapped first so the emitted color is always sRGB-displayable.
 */
function formatOklch(L: number, C: number, H: number): string {
  const { l, c, h } = gamutMapOklch(L, C, H)
  const lPct = +(l * 100).toFixed(3)
  const cVal = +c.toFixed(3)
  const hVal = cVal === 0 ? 0 : +h.toFixed(3)
  return `oklch(${lPct}% ${cVal} ${hVal})`
}

/**
 * Convert a hex color to its exact Tailwind-v4-style `oklch(L% C H)` equivalent,
 * using the same Oklab math as the palette generator. Returns null for non-hex
 * input (e.g. an already-`oklch(...)` value), so callers can pass through verbatim.
 * Use this to migrate hex tokens to the OKLCH standard or to normalize a hand-edited
 * shade on commit.
 */
export function hexToOklchString(hex: string): string | null {
  const lin = hexToLinearRgb(hex)
  if (!lin) return null
  const { l, c, h } = linearRgbToOklch(...lin)
  return formatOklch(l, c, h)
}

/**
 * Parse an `oklch(L C H)` string and convert it to a hex color, so the (hex-based)
 * color picker and any hex-only consumer can display an OKLCH-valued token.
 * Accepts L as a percentage (`62.3%`) or 0–1 number; C and H as numbers. Returns
 * null if the string is not a parseable oklch() value.
 */
export function oklchStringToHex(value: string): string | null {
  const m = value.trim().match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*\)$/i)
  if (!m) return null
  const lRaw = m[1]
  const L = lRaw.endsWith('%') ? parseFloat(lRaw) / 100 : parseFloat(lRaw)
  const C = parseFloat(m[2])
  const H = parseFloat(m[3])
  if (Number.isNaN(L) || Number.isNaN(C) || Number.isNaN(H)) return null
  return oklchToHex(L, C, H)
}

// ─── Scale generation ─────────────────────────────────────────────────────────

// Shade keys that define the palette structure
const SHADE_L: Record<number, number> = {
  50: 0.970, 100: 0.940, 200: 0.880,
  300: 0.800, 400: 0.680, 500: 0.570,
  600: 0.480, 700: 0.400, 800: 0.320,
  900: 0.240, 950: 0.175,
}

// Perceptual lightness anchors for the scale extremes
const OKLCH_L_MAX = 0.970
const OKLCH_L_MIN = 0.175

export function generateOklchScale(baseHex: string, includeZero = false): Record<string, string> {
  const lin = hexToLinearRgb(baseHex)
  if (!lin) return {}
  const { l: baseL, c: baseC, h } = linearRgbToOklch(...lin)

  const result: Record<string, string> = {}
  // Pure white as OKLCH (Tailwind-standard form), keeping the scale uniformly oklch().
  if (includeZero) result['0'] = 'oklch(100% 0 0)'

  for (const [shadeStr] of Object.entries(SHADE_L)) {
    const shade = Number(shadeStr)

    // Lightness: use baseL at shade 500, interpolate smoothly to endpoints
    const l = shade === 500
      ? baseL
      : shade < 500
        ? baseL + (OKLCH_L_MAX - baseL) * easeOut((500 - shade) / 450)
        : baseL + (OKLCH_L_MIN - baseL) * easeIn((shade - 500) / 450)

    // Chroma: smooth Gaussian falloff from peak at shade 500
    const distance = Math.abs(shade - 500) / 450
    const chromaFactor = Math.exp(-1.7 * distance * distance)
    const c = Math.max(0, baseC * chromaFactor)

    // Emit a Tailwind-v4-standard oklch() string (gamut-mapped inside formatOklch).
    result[String(shade)] = formatOklch(
      Math.max(0.05, Math.min(0.99, l)), c, h,
    )
  }

  return result
}

function easeOut(t: number): number { return 1 - Math.pow(1 - t, 1.5) }
function easeIn(t: number): number { return Math.pow(t, 1.5) }

// ─── rem ↔ px display conversion ─────────────────────────────────────────────

/** Convert a rem string to a px string for UI display. Leaves non-rem values unchanged. */
export function remToPxDisplay(val: string): string {
  const match = val.match(/^(-?[\d.]+)rem$/)
  if (!match) return val
  const px = parseFloat(match[1]) * 16
  return `${parseFloat(px.toFixed(4))}px`
}

/** Convert a px input back to rem for storage.
 *  Only acts when the original stored value is rem — non-rem values pass through unchanged. */
export function pxInputToRem(input: string, originalVal: string): string {
  if (!originalVal.endsWith('rem')) return input
  const match = input.trim().match(/^(-?[\d.]+)(px)?$/)
  if (!match) return input
  const px = parseFloat(match[1])
  if (isNaN(px)) return input
  return `${parseFloat((px / 16).toFixed(6))}rem`
}

// ─── Color reference resolver ─────────────────────────────────────────────────

export function resolveColorRef(
  ref: string,
  colors: Record<string, Record<string, string>>
): string | null {
  const match = ref.match(/var\(--color-(\w+)-(\w+)\)/)
  if (!match) return null
  const [, family, shade] = match
  return colors[family]?.[shade] ?? null
}

export function parseColorRef(ref: string): { family: string; shade: string } | null {
  const match = ref.match(/var\(--color-(\w+)-(\w+)\)/)
  if (!match) return null
  return { family: match[1], shade: match[2] }
}

export function makeColorRef(family: string, shade: string): string {
  return `var(--color-${family}-${shade})`
}

// ─── Brand-aware semantic auto-pick ─────────────────────────────────────────────
// Given a brand ramp, pick the --primary step + matching foreground so the result
// reads as the hue AND meets WCAG 2 AA (4.5:1). Mirrors what ShadCN hand-tunes per
// preset. Pure + headless: reads resolved color values, returns alias strings.

/** AA threshold for normal text (WCAG 2.x). */
export const WCAG_AA_NORMAL = 4.5

/** Order we try --primary steps in: vivid-but-text-safe first, then fall outward. */
const PRIMARY_STEP_CANDIDATES = ['600', '700', '500', '800'] as const

/**
 * Resolve a step's stored value (hex OR `oklch(...)`) to a hex string for contrast
 * math. Returns null if neither form parses.
 */
export function stepValueToHex(value: string | undefined): string | null {
  if (!value) return null
  const v = value.trim()
  if (/^#[0-9a-f]{6}$/i.test(v)) return v
  if (/^#[0-9a-f]{3}$/i.test(v)) {
    // expand shorthand
    const c = v.slice(1)
    return `#${c[0]}${c[0]}${c[1]}${c[1]}${c[2]}${c[2]}`
  }
  return oklchStringToHex(v)
}

export interface PrimaryPick {
  /** Chosen brand-ramp step, e.g. "600". */
  step: string
  /** Which neutral foreground clears AA against the chosen step. */
  foreground: 'neutral-0' | 'neutral-900'
  /** The achieved contrast ratio of step vs the chosen foreground. */
  contrast: number
  /** True when no candidate reached AA in-gamut — caller must warn, not hide. */
  belowAA: boolean
}

/**
 * Pick the best --primary step for a brand ramp against the given neutral extremes.
 * Tries PRIMARY_STEP_CANDIDATES in order; returns the first whose better foreground
 * (white = neutral-0 vs near-black = neutral-900) clears 4.5:1. If none do, returns
 * the candidate with the highest achievable contrast and flags belowAA.
 *
 *  - scale:        the brand ColorScale ({ "500": "<hex|oklch>", … }).
 *  - neutral0Hex:  resolved --color-neutral-0  (the light/white foreground).
 *  - neutral900Hex:resolved --color-neutral-900 (the dark foreground).
 */
export function pickPrimaryStep(
  scale: Record<string, string>,
  neutral0Hex: string,
  neutral900Hex: string,
): PrimaryPick {
  let best: PrimaryPick | null = null

  for (const step of PRIMARY_STEP_CANDIDATES) {
    const stepHex = stepValueToHex(scale[step])
    if (!stepHex) continue

    const cWhite = contrastRatio(stepHex, neutral0Hex)
    const cDark = contrastRatio(stepHex, neutral900Hex)
    const useWhite = cWhite >= cDark
    const contrast = useWhite ? cWhite : cDark
    const foreground: PrimaryPick['foreground'] = useWhite ? 'neutral-0' : 'neutral-900'

    if (contrast >= WCAG_AA_NORMAL) {
      return { step, foreground, contrast, belowAA: false }
    }
    if (!best || contrast > best.contrast) {
      best = { step, foreground, contrast, belowAA: true }
    }
  }

  // Fallback: nothing parsed at all → safe default (darkest step, white text, flagged).
  return best ?? { step: '900', foreground: 'neutral-0', contrast: 0, belowAA: true }
}

// ─── Neutral-structure semantics (accent / secondary / muted) ───────────────────
// These are NOT brand-driven: the surface is a quiet neutral step, the foreground
// is whichever neutral extreme reads on it. Reuses the same contrast logic so the
// foreground is AA-safe even if someone points the surface at a dark neutral step.

/** The neutral surface step each role defaults to in LIGHT (matches the shipped semantics). */
const NEUTRAL_SURFACE_DEFAULTS: Record<string, string> = {
  accent: '100',
  secondary: '100',
  muted: '100',
}

/** The neutral surface step each role defaults to in DARK (matches themes/dark.css). */
const NEUTRAL_SURFACE_DEFAULTS_DARK: Record<string, string> = {
  accent: '800',
  secondary: '800',
  muted: '800',
}

export interface NeutralPairSuggestion {
  /** Alias for the surface, e.g. "var(--color-neutral-100)". */
  surface: string
  /** Alias for the foreground (neutral-0 or neutral-900). */
  foreground: string
  /** Achieved contrast of surface vs chosen foreground. */
  contrast: number
  /** True when neither neutral foreground clears AA (a mid-gray surface). */
  belowAA: boolean
  /** The surface step chosen, e.g. "100". */
  step: string
}

/**
 * Suggest a neutral surface + AA-safe foreground for a neutral-structure semantic
 * (accent / secondary / muted). The surface step comes from NEUTRAL_SURFACE_DEFAULTS
 * (override via `step`); the foreground is the higher-contrast of neutral-0 / -900.
 * Returns null if the neutral ramp or chosen step is missing.
 */
export function suggestNeutralSemantics(
  colors: Record<string, Record<string, string>>,
  role: string,
  step?: string,
  theme: 'light' | 'dark' = 'light',
): NeutralPairSuggestion | null {
  const neutral = colors.neutral
  if (!neutral) return null
  const defaults = theme === 'dark' ? NEUTRAL_SURFACE_DEFAULTS_DARK : NEUTRAL_SURFACE_DEFAULTS
  const surfaceStep = step ?? defaults[role] ?? (theme === 'dark' ? '800' : '100')

  const surfaceHex = stepValueToHex(neutral[surfaceStep])
  const n0 = stepValueToHex(neutral['0'])
  const n900 = stepValueToHex(neutral['900'])
  if (!surfaceHex || !n0 || !n900) return null

  const cWhite = contrastRatio(surfaceHex, n0)
  const cDark = contrastRatio(surfaceHex, n900)
  const useWhite = cWhite >= cDark
  const contrast = useWhite ? cWhite : cDark

  return {
    surface: makeColorRef('neutral', surfaceStep),
    foreground: makeColorRef('neutral', useWhite ? '0' : '900'),
    contrast,
    belowAA: contrast < WCAG_AA_NORMAL,
    step: surfaceStep,
  }
}

export interface BrandSuggestion {
  /** Alias for --primary, e.g. "var(--color-brand-600)". */
  primary: string
  /** Alias for --primary-foreground (neutral-0 or neutral-900). */
  'primary-foreground': string
  /** Alias for --ring — same step as primary. */
  ring: string
  /** The underlying pick (step, contrast, belowAA) for UI badges/warnings. */
  meta: PrimaryPick
}

/**
 * Compute suggested brand-driven semantics for the given ramp family (default
 * "brand"). Returns alias strings ready to stage. v1 = light-mode primary +
 * primary-foreground + ring. Returns null if the family/neutrals are missing.
 */
export function suggestBrandSemantics(
  colors: Record<string, Record<string, string>>,
  family = 'brand',
): BrandSuggestion | null {
  const scale = colors[family]
  const neutral0 = stepValueToHex(colors.neutral?.['0'])
  const neutral900 = stepValueToHex(colors.neutral?.['900'])
  if (!scale || !neutral0 || !neutral900) return null

  const pick = pickPrimaryStep(scale, neutral0, neutral900)
  const fgFamilyShade = pick.foreground.split('-') as [string, string]

  return {
    primary: makeColorRef(family, pick.step),
    'primary-foreground': makeColorRef(fgFamilyShade[0], fgFamilyShade[1]),
    ring: makeColorRef(family, pick.step),
    meta: pick,
  }
}
