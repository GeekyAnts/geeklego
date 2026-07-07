/**
 * Color parsing for the Figma sync — the IR emits `oklch(...)` (plus the odd
 * hex), Figma variables want sRGB `{r,g,b,a}` in 0–1.
 *
 * oklch → sRGB follows Björn Ottosson's reference OKLab math
 * (https://bottosson.github.io/posts/oklab/). Out-of-gamut results are
 * channel-clamped to [0,1] — adequate for a design-token sync (the resolved
 * literals in the IR are authored on-screen in sRGB-ish space anyway).
 */

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** linear → gamma-encoded sRGB channel. */
function gamma(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/** oklch components (L 0–1, C, H degrees) → gamut-clamped sRGB. */
export function oklchToSrgb(l: number, c: number, h: number, alpha = 1): Rgba {
  const hr = (h * Math.PI) / 180;
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);

  // OKLab → LMS (cube roots), then cube
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const lc = l_ * l_ * l_;
  const mc = m_ * m_ * m_;
  const sc = s_ * s_ * s_;

  // LMS → linear sRGB
  const rl = +4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc;
  const gl = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc;
  const bl = -0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc;

  return {
    r: clamp01(gamma(rl)),
    g: clamp01(gamma(gl)),
    b: clamp01(gamma(bl)),
    a: clamp01(alpha),
  };
}

/**
 * Parse a CSS color literal as emitted by the IR: `oklch(L% C H [/ A])`,
 * `#rgb/#rrggbb/#rrggbbaa`, or `transparent`. Returns null when unparseable.
 */
export function parseColor(css: string): Rgba | null {
  const s = css.trim();

  if (s === "transparent") return { r: 0, g: 0, b: 0, a: 0 };

  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(s);
  if (hex) {
    let h = hex[1];
    if (h.length === 3)
      h = h
        .split("")
        .map((ch) => ch + ch)
        .join("");
    const n = (i: number) => parseInt(h.slice(i, i + 2), 16) / 255;
    return {
      r: n(0),
      g: n(2),
      b: n(4),
      a: h.length === 8 ? n(6) : 1,
    };
  }

  const ok = /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.-]+)\s*(?:\/\s*([\d.]+)(%?)\s*)?\)$/i.exec(
    s,
  );
  if (ok) {
    const l = parseFloat(ok[1]) / (ok[2] === "%" ? 100 : 1);
    const c = parseFloat(ok[3]);
    const h = parseFloat(ok[4]);
    let alpha = 1;
    if (ok[5] !== undefined)
      alpha = parseFloat(ok[5]) / (ok[6] === "%" ? 100 : 1);
    return oklchToSrgb(l, c, h, alpha);
  }

  return null;
}
