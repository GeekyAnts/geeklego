/**
 * Geeklego → Figma sync — MANIFEST CONTRACTS (Phase 0)
 *
 * These types are the contract between the three build/runtime surfaces:
 *
 *   1. `components/v2/<Name>/<Name>.figma.ts`  — hand-authored ComponentDescriptor
 *      (the metadata cva/Storybook can't express: Radix states, slots, pruning).
 *   2. `scripts/figma/build-component-manifest.ts` — the generator. Merges the
 *      descriptor with the cva variant matrix and a Playwright computed-style
 *      scrape of built Storybook, and emits `component-manifest.json`
 *      (a ComponentManifest).
 *   3. `figma-plugin/` — the deterministic Figma plugin. Fetches the manifest and
 *      builds native components (Auto Layout + variant sets + variable bindings).
 *      It never reads Storybook, cva, or this repo directly.
 *
 * The TOKEN manifest has no schema here on purpose: it is `dist/ir/tokens.json`,
 * the W3C-DTCG IR emitted by `scripts/export-ir.ts` ("IR-as-contract", see
 * docs/MULTI-TARGET-ARCHITECTURE.md). The plugin consumes it as-is.
 *
 * Two component archetypes are modeled (discovered in the MVP-5 audit):
 *   - cva-driven   (Button, Badge, Input): variant matrix machine-readable from
 *     `*-variants.ts` / Storybook argTypes (they agree).
 *   - Radix-native (Checkbox, Switch): no cva; states live in `data-state`, so
 *     the descriptor DECLARES them (`declaredProps`) — nothing else can.
 *
 * Deliberately excluded from the contract (MVP guardrails):
 *   - hover/active/focus pseudo-states — not statically representable in Figma.
 *   - compound/nested components and instance-swap slots.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Descriptor — hand-authored per component (`<Name>.figma.ts`)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * One axis of a Figma variant property, e.g. `Variant` or `Size`.
 * For cva components the generator CROSS-CHECKS `values` against the cva keys
 * and fails the build on drift — the descriptor is the pruned, ordered, Figma-
 * facing view; cva stays the source of truth for what exists.
 */
export interface VariantAxis {
  /** Figma property name (PascalCase by convention, e.g. "Variant", "Size"). */
  name: string;
  /** The cva prop this axis maps to (e.g. "variant", "size", "inputSize").
   *  Radix-native axes (declared states) set this to null. */
  cvaProp: string | null;
  /** Ordered option values as they should appear in Figma (cva keys verbatim). */
  values: string[];
  /** Default option (must be in `values`; mirrors cva defaultVariants). */
  defaultValue: string;
}

/**
 * A boolean Figma property (e.g. Disabled) plus how to RENDER its "true" state
 * so the scraper can capture it. `storyProps` are the React props the harness
 * applies; `dataState` covers Radix-native state that isn't a plain prop.
 */
export interface BooleanProp {
  /** Figma property name, e.g. "Disabled". */
  name: string;
  /** React props to apply to render the true-state (e.g. { disabled: true }). */
  storyProps: Record<string, unknown>;
  defaultValue: boolean;
}

/**
 * A declared (non-cva) variant axis for Radix-native components — e.g.
 * Checkbox `State: unchecked | checked | indeterminate`. Each value carries the
 * React props that put the component into that state for the scrape render.
 */
export interface DeclaredAxis {
  /** Figma property name, e.g. "State". */
  name: string;
  values: Array<{
    /** Figma option value, e.g. "Checked". */
    value: string;
    /** React props that render this state (e.g. { checked: true }). */
    storyProps: Record<string, unknown>;
  }>;
  defaultValue: string;
}

/** A text slot the plugin should turn into a Figma TEXT node + text property. */
export interface TextSlot {
  /** Figma text-property name, e.g. "Label". */
  name: string;
  /** How the text reaches the component when rendering: React children, or a
   *  string prop (e.g. Input's `placeholder`). */
  via: { kind: "children" } | { kind: "prop"; prop: string };
  /** Sample content used for the scrape render and the Figma default. */
  sample: string;
}

/**
 * The hand-authored per-component descriptor. Lives at
 * `components/v2/<Name>/<Name>.figma.ts` as `export default descriptor`.
 * Type-only imports from this file keep descriptors out of the lib bundle
 * (they are not re-exported from `components/index.ts`).
 */
export interface ComponentDescriptor {
  /** Component name — must match the `components/v2/<name>/` folder. */
  name: string;
  /** Story id prefix in built Storybook (title `v2/<Name>` → `v2-<name>`). */
  storyIdPrefix: string;
  /** cva-backed axes (empty for Radix-native components). */
  cvaAxes: VariantAxis[];
  /** Declared axes for Radix-native state (empty for cva components). */
  declaredAxes: DeclaredAxis[];
  /** Boolean properties (Disabled etc.). */
  booleanProps: BooleanProp[];
  /** Text slot, if the component renders text. */
  text: TextSlot | null;
  /**
   * Combinations to EXCLUDE from the cartesian product, as partial matches —
   * e.g. { Variant: "link", Size: "icon" } prunes every combo where both hold.
   */
  prune: Array<Record<string, string>>;
  /**
   * CSS selector for the element to scrape inside the story root, when the
   * story wraps the component (default: first element child of the root).
   */
  scrapeSelector?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Manifest — generator output (`component-manifest.json`), plugin input
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A scraped value that the plugin can BIND to a Figma variable: the resolved
 * literal (for pixel-perfect fallback) plus the originating token name (for
 * `boundVariables`). `token` is the canonical IR dot-path (e.g. "semantic.primary",
 * "radius.md") or null when the value doesn't trace to a token (then it stays raw).
 */
export interface BindableValue<T> {
  value: T;
  token: string | null;
}

/** Solid RGBA in sRGB 0–1 (post oklch→sRGB conversion, gamut-clamped). */
export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Scraped text style for the component's text node. */
export interface ScrapedTypography {
  fontFamily: BindableValue<string>;
  fontSizePx: BindableValue<number>;
  fontWeight: BindableValue<number>;
  lineHeightPx: BindableValue<number>;
  letterSpacingPx: BindableValue<number>;
  textColor: BindableValue<Rgba>;
}

/**
 * The computed-style scrape of ONE rendered variant combination — everything
 * the plugin needs to reproduce the box pixel-perfectly with Auto Layout.
 * All lengths are px (Playwright getComputedStyle, 1rem = 16px root).
 */
export interface ScrapedGeometry {
  widthPx: number;
  heightPx: number;
  paddingPx: {
    top: BindableValue<number>;
    right: BindableValue<number>;
    bottom: BindableValue<number>;
    left: BindableValue<number>;
  };
  /** flex gap (Auto Layout itemSpacing). */
  gapPx: BindableValue<number>;
  cornerRadiusPx: BindableValue<number>;
  fill: BindableValue<Rgba> | null;
  stroke: { color: BindableValue<Rgba>; weightPx: number } | null;
  opacity: number;
  /** Raw class list of the scraped element — audit trail for token resolution. */
  classList: string[];
  typography: ScrapedTypography | null;
}

/** One concrete variant combination = one Figma component inside the set. */
export interface VariantCombination {
  /** Figma variant-name segments, e.g. { Variant: "default", Size: "md", Disabled: "false" }. */
  properties: Record<string, string>;
  geometry: ScrapedGeometry;
}

/** One component's full manifest entry. */
export interface ComponentManifestEntry {
  name: string;
  /** Axes in display order (cva + declared), for Figma property creation. */
  axes: Array<Pick<VariantAxis, "name" | "values" | "defaultValue">>;
  booleanProps: Array<Pick<BooleanProp, "name" | "defaultValue">>;
  text: { name: string; sample: string } | null;
  combinations: VariantCombination[];
}

/** The full generator output the plugin fetches. */
export interface ComponentManifest {
  $schema: "geeklego-figma-component-manifest";
  version: 1;
  /** IR version stamp (from tokens.json $extensions) the scrape ran against —
   *  the plugin warns if it differs from the token manifest it synced. */
  irSource: string;
  components: ComponentManifestEntry[];
}
