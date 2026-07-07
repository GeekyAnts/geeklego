/**
 * Dimension/duration parsing — the IR emits `rem`/`px` lengths and
 * `ms`/`s` durations; Figma variables are unitless FLOATs, so lengths become
 * px (1rem = 16px root, the browser/Storybook default this system renders at)
 * and durations become ms.
 */

const REM_BASE = 16;

/** "1rem" → 16, "2px" → 2, "0" → 0. Returns null for units we can't map (ch, %, …). */
export function toPx(value: string): number | null {
  const m = /^(-?[\d.]+)(px|rem|em)?$/.exec(value.trim());
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (Number.isNaN(n)) return null;
  const unit = m[2] ?? (n === 0 ? "px" : null);
  if (unit === "px") return n;
  if (unit === "rem" || unit === "em") return n * REM_BASE;
  return null;
}

/** "100ms" → 100, "0.2s" → 200. */
export function toMs(value: string): number | null {
  const m = /^(-?[\d.]+)(ms|s)$/.exec(value.trim());
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (Number.isNaN(n)) return null;
  return m[2] === "s" ? n * 1000 : n;
}

/** '"Inter", ui-sans-serif, …' → "Inter" (first family, quotes stripped). */
export function firstFontFamily(value: string): string {
  const first = value.split(",")[0]?.trim() ?? value.trim();
  return first.replace(/^["']|["']$/g, "");
}
