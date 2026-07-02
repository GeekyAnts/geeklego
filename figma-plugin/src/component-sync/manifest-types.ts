/**
 * Component-manifest types as consumed by the plugin sandbox.
 *
 * This is a structural copy of the generator's output contract
 * (scripts/figma/contracts.ts → ComponentManifest). The plugin can't import
 * from scripts/ (different tsconfig / bundle), so the shape is redeclared here
 * and kept in sync. Only the fields the plugin reads are included.
 */

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface BindableValue<T> {
  value: T;
  /** IR token path (e.g. "semantic.primary") or null when it's a raw literal. */
  token: string | null;
}

export interface ScrapedTypography {
  fontFamily: BindableValue<string>;
  fontSizePx: BindableValue<number>;
  fontWeight: BindableValue<number>;
  lineHeightPx: BindableValue<number>;
  letterSpacingPx: BindableValue<number>;
  textColor: BindableValue<Rgba>;
}

export interface ScrapedGeometry {
  widthPx: number;
  heightPx: number;
  paddingPx: {
    top: BindableValue<number>;
    right: BindableValue<number>;
    bottom: BindableValue<number>;
    left: BindableValue<number>;
  };
  gapPx: BindableValue<number>;
  cornerRadiusPx: BindableValue<number>;
  fill: BindableValue<Rgba> | null;
  stroke: { color: BindableValue<Rgba>; weightPx: number } | null;
  opacity: number;
  classList: string[];
  typography: ScrapedTypography | null;
}

export interface VariantCombination {
  properties: Record<string, string>;
  geometry: ScrapedGeometry;
}

export interface ComponentManifestEntry {
  name: string;
  axes: Array<{ name: string; values: string[]; defaultValue: string }>;
  booleanProps: Array<{ name: string; defaultValue: boolean }>;
  text: { name: string; sample: string } | null;
  combinations: VariantCombination[];
}

export interface ComponentManifest {
  $schema: "geeklego-figma-component-manifest";
  version: 1;
  irSource: string;
  components: ComponentManifestEntry[];
}
