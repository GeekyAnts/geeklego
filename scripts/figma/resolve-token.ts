/**
 * class → token resolver.
 *
 * The scrape gives us an element's class list (e.g. "bg-primary",
 * "text-primary-foreground", "rounded-md", "h-10", "px-4"). To BIND a scraped
 * value to a Figma variable, we need the token it came from. This maps the
 * Tailwind utility to the IR semantic/primitive path, which the plugin then
 * resolves to the foldered Figma variable name.
 *
 * Only the utilities the MVP-5 components actually use are handled; anything
 * unrecognized returns null (the value ships as a raw literal, still
 * pixel-correct, just not bound). Keep this list honest — a silent miss means
 * an unbound property, not a wrong one.
 */

/** A resolved binding: the IR token path (dot notation), by property role. */
export interface ResolvedTokens {
  fill: string | null;
  text: string | null;
  border: string | null;
  ring: string | null;
  radius: string | null;
}

const EMPTY: ResolvedTokens = {
  fill: null,
  text: null,
  border: null,
  ring: null,
  radius: null,
};

/** Semantic color utilities → IR `semantic.<name>` path. */
function semanticColor(util: string): string | null {
  // bg-primary, text-primary-foreground, border-input, ring-ring, bg-muted…
  const m = /^(bg|text|border|ring)-([a-z-]+?)(?:\/\d+)?$/.exec(util);
  if (!m) return null;
  const name = m[2];
  // Standard semantic vocabulary (kept in sync with semantics.css).
  const SEMANTICS = new Set([
    "background",
    "foreground",
    "primary",
    "primary-foreground",
    "secondary",
    "secondary-foreground",
    "muted",
    "muted-foreground",
    "accent",
    "accent-foreground",
    "destructive",
    "destructive-foreground",
    "border",
    "input",
    "ring",
    "card",
    "card-foreground",
    "popover",
    "popover-foreground",
  ]);
  return SEMANTICS.has(name) ? `semantic.${name}` : null;
}

/** rounded / rounded-md / rounded-lg → semantic.radius (the scale derives from --radius). */
function radiusToken(util: string): string | null {
  return /^rounded(-(sm|md|lg|xl|none|full))?$/.test(util) ? "semantic.radius" : null;
}

/**
 * Custom-variant utilities → IR `ext.<key>` path. The `--ext-*` tokens live in
 * the IR `ext` group keyed by their full flat name (e.g. `ext-button-gamified-bg`),
 * and the classes are `bg-ext-button-gamified-bg`, `text-ext-button-gamified-foreground`,
 * `ring-ext-button-gamified-ring`. We map the base (non-state) utilities; hover/
 * active variants are pseudo-states and excluded from the static component.
 */
function extColor(util: string): string | null {
  const m = /^(bg|text|border|ring)-(ext-[a-z0-9-]+?)(?:\/\d+)?$/.exec(util);
  if (!m) return null;
  const key = m[2];
  // Skip state variants — they aren't part of the static Default/Disabled set.
  if (/-(hover|active|focus)$/.test(key)) return null;
  return `ext.${key}`;
}

/**
 * Resolve an element's class list into per-role token paths. When multiple
 * classes target the same role, the LAST wins (mirrors tailwind-merge / cn()).
 */
export function resolveTokens(classList: string[]): ResolvedTokens {
  const out: ResolvedTokens = { ...EMPTY };
  for (const util of classList) {
    const rad = radiusToken(util);
    if (rad) out.radius = rad;

    // ext-* takes precedence over the core-semantic matcher (its names begin
    // with `ext-`, which the core matcher would otherwise treat as a semantic).
    const token = extColor(util) ?? semanticColor(util);
    if (token) {
      if (util.startsWith("bg-")) out.fill = token;
      else if (util.startsWith("text-")) out.text = token;
      else if (util.startsWith("border-")) out.border = token;
      else if (util.startsWith("ring-")) out.ring = token;
    }
  }
  return out;
}
