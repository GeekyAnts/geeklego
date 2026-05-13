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

export function getContrastColor(hex: string): 'black' | 'white' {
  const rgb = hexToRgb(hex)
  if (!rgb) return 'white'
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
    const c = v / 255
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return lum > 0.179 ? 'black' : 'white'
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

function oklchToHex(L: number, C: number, H: number): string {
  // Gamut-map by reducing chroma via binary search
  let lo = 0, hi = C, mapped = C
  for (let i = 0; i < 25; i++) {
    const mid = (lo + hi) / 2
    const [r, g, b] = oklchToLinearRgb(L, mid, H)
    if (isInGamut(r, g, b)) { lo = mid; mapped = mid } else hi = mid
  }
  const [r, g, b] = oklchToLinearRgb(L, mapped, H)
  return rgbToHex(
    Math.round(Math.max(0, Math.min(1, linearToSrgb(r))) * 255),
    Math.round(Math.max(0, Math.min(1, linearToSrgb(g))) * 255),
    Math.round(Math.max(0, Math.min(1, linearToSrgb(b))) * 255),
  )
}

// ─── Scale generation ─────────────────────────────────────────────────────────

// L targets for each shade (Tailwind-compatible perceptual scale)
const SHADE_L: Record<number, number> = {
  50: 0.970, 100: 0.940, 200: 0.880,
  300: 0.800, 400: 0.680, 500: 0.570,
  600: 0.480, 700: 0.400, 800: 0.320,
  900: 0.240, 950: 0.175,
}

export function generateOklchScale(baseHex: string, includeZero = false): Record<string, string> {
  const lin = hexToLinearRgb(baseHex)
  if (!lin) return {}
  const { l: baseL, c: baseC, h } = linearRgbToOklch(...lin)

  // Scale L values so the base color lands at shade 500
  const nominalL = SHADE_L[500]
  const scale = baseL / nominalL

  const result: Record<string, string> = {}

  if (includeZero) result['0'] = '#ffffff'

  for (const [shadeStr, targetL] of Object.entries(SHADE_L)) {
    const shade = Number(shadeStr)
    // Remap lightness proportionally to base color
    const l = Math.max(0.05, Math.min(0.99, targetL * scale))

    // Taper chroma at light and dark extremes for natural look
    let chromaFactor = 1.0
    if (shade <= 100) chromaFactor = 0.25
    else if (shade <= 200) chromaFactor = 0.50
    else if (shade <= 300) chromaFactor = 0.75
    else if (shade >= 900) chromaFactor = 0.60
    else if (shade >= 800) chromaFactor = 0.80

    const c = baseC * chromaFactor
    result[String(shade)] = oklchToHex(l, c, h)
  }

  return result
}

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
