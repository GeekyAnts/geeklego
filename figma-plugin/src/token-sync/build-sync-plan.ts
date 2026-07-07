/**
 * build-sync-plan — the PURE token mapper: geeklego IR (dist/ir/tokens.json,
 * W3C DTCG) → a SyncPlan the plugin sandbox executes against figma.variables.
 *
 * Pure data-in/data-out (no figma.* globals) so it's unit-testable in Vitest.
 *
 * Mapping (mirrors the 2-tier model 1:1). Figma groups variables into folders
 * by "/" in the name, so names are foldered to match the Token Editor's IA:
 *   Tier 1 primitives → collection "01 · Primitives", single mode "Value".
 *     Names keep the IR dot-path as slashes ("color/brand/600", "radius/lg"),
 *     with numeric steps zero-padded in the SORT only so 50 precedes 500.
 *   Tier 2 semantics  → collection "02 · Semantics", modes Light/Dark. Names
 *     are foldered by the editor's bucket (surface/interactive/layout/status),
 *     e.g. "interactive/primary", "surface/background". Values are ALIASES
 *     into Primitives (the `var()` chain, preserved). Dark comes from
 *     $extensions["com.geeklego.modes"].dark.
 *   --ext-* variants  → collection "03 · Ext", modes Light/Dark, foldered by
 *     component ("button/gamified-bg" from "ext-button-gamified-bg").
 *
 * $type → Figma variable type: color→COLOR, dimension→FLOAT(px),
 * fontWeight/number→FLOAT, duration→FLOAT(ms), fontFamily→STRING.
 * cubicBezier/shadow have no Figma variable type → skipped + reported.
 *
 * Typography → collection "04 · Typography" as VARIABLES (not Text Styles):
 * fontSize/<step> (px), lineHeight/<step> (px), fontFamily/<key> (string).
 * The Plugin API can't bind Text Style properties to variables, so we ship the
 * type scale as referenceable variables instead.
 */

import {
  type IrDocument,
  type IrGroup,
  type IrToken,
  isIrGroup,
  isIrToken,
  parseRef,
} from "./ir-types";
import { parseColor, type Rgba } from "./color";
import { firstFontFamily, toMs, toPx } from "./dimension";

export const COLLECTION_PRIMITIVES = "01 · Primitives";
export const COLLECTION_SEMANTICS = "02 · Semantics";
export const COLLECTION_EXT = "03 · Ext";
export const COLLECTION_TYPOGRAPHY = "04 · Typography";
export const MODE_VALUE = "Value";
export const MODE_LIGHT = "Light";
export const MODE_DARK = "Dark";

export type FigmaVariableType = "COLOR" | "FLOAT" | "STRING";

export type PlannedValue =
  | { kind: "color"; value: Rgba }
  | { kind: "float"; value: number }
  | { kind: "string"; value: string }
  | { kind: "alias"; collection: string; variable: string };

export interface PlannedVariable {
  name: string;
  resolvedType: FigmaVariableType;
  valuesByMode: Record<string, PlannedValue>;
}

export interface PlannedCollection {
  name: string;
  modes: string[];
  variables: PlannedVariable[];
}

export interface SkippedToken {
  path: string;
  reason: string;
}

export interface SyncPlan {
  irSource: string;
  collections: PlannedCollection[];
  skipped: SkippedToken[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Folder naming — replicate the Token Editor's information architecture so the
// Figma variable panel groups the way designers already see it in the cockpit.
// (Ported from app/src/ia/semanticBuckets.ts — kept inline to keep the mapper
// dependency-free / bundleable into the plugin sandbox.)
// ─────────────────────────────────────────────────────────────────────────────

const SURFACE_RE =
  /^(background|foreground|card|card-foreground|popover|popover-foreground)$/;
const INTERACTIVE_RE =
  /^(primary|primary-foreground|secondary|secondary-foreground|accent|accent-foreground|muted|muted-foreground|ring)$/;
const LAYOUT_RE = /^(border|input|radius)$/;

/** surface | interactive | layout | status — the editor's four semantic buckets. */
export function semanticBucket(name: string): string {
  if (SURFACE_RE.test(name)) return "surface";
  if (INTERACTIVE_RE.test(name)) return "interactive";
  if (LAYOUT_RE.test(name)) return "layout";
  return "status"; // destructive*, chart-*, and any future extension
}

/**
 * Semantic → foldered Figma name. Bucket prefix + the token, with `chart-N`
 * nested under a `chart/` sub-folder and `*-foreground` paired under its base
 * (primary-foreground → interactive/primary/foreground) so a role's fill and
 * its text colour sit together.
 */
export function semanticFigmaName(name: string): string {
  const bucket = semanticBucket(name);
  const chart = /^chart-(\d+)$/.exec(name);
  if (chart) return `${bucket}/chart/${chart[1]}`;
  const fg = /^(.*)-foreground$/.exec(name);
  if (fg) return `${bucket}/${fg[1]}/foreground`;
  return `${bucket}/${name}`;
}

/** ext-button-gamified-bg → button/gamified-bg (folder by component). */
export function extFigmaName(name: string): string {
  const m = /^ext-([a-z0-9]+)-(.+)$/.exec(name);
  return m ? `${m[1]}/${m[2]}` : name;
}

/** Sort key that zero-pads trailing numeric segments so 50 < 500 in folders. */
export function paddedSortKey(name: string): string {
  return name
    .split("/")
    .map((seg) => (/^\d+$/.test(seg) ? seg.padStart(6, "0") : seg))
    .join("/");
}

// ─────────────────────────────────────────────────────────────────────────────

/** Map a token's literal $value by $type. Null = unsupported/unparseable. */
function literalValue(token: IrToken): PlannedValue | null {
  const { $type, $value } = token;
  switch ($type) {
    case "color": {
      const rgba = typeof $value === "string" ? parseColor($value) : null;
      return rgba ? { kind: "color", value: rgba } : null;
    }
    case "dimension": {
      const px = typeof $value === "string" ? toPx($value) : null;
      return px !== null ? { kind: "float", value: px } : null;
    }
    case "fontWeight":
    case "number": {
      const n = typeof $value === "number" ? $value : parseFloat(String($value));
      return Number.isNaN(n) ? null : { kind: "float", value: n };
    }
    case "duration": {
      const ms = typeof $value === "string" ? toMs($value) : null;
      return ms !== null ? { kind: "float", value: ms } : null;
    }
    case "fontFamily":
      return typeof $value === "string"
        ? { kind: "string", value: firstFontFamily($value) }
        : null;
    default:
      return null; // cubicBezier, shadow, unknown
  }
}

function typeOf(value: PlannedValue): FigmaVariableType {
  if (value.kind === "color") return "COLOR";
  if (value.kind === "string") return "STRING";
  if (value.kind === "float") return "FLOAT";
  throw new Error("alias has no intrinsic type");
}

/** Depth-first walk of a primitive group, collecting slash-named tokens. */
function walkGroup(
  group: IrGroup,
  path: string[],
  out: Array<{ path: string[]; token: IrToken }>,
): void {
  for (const key of Object.keys(group).sort()) {
    if (key.startsWith("$")) continue;
    const node = group[key];
    if (isIrToken(node)) out.push({ path: [...path, key], token: node });
    else if (isIrGroup(node)) walkGroup(node, [...path, key], out);
  }
}

/**
 * Resolve one mode's value for a semantic/ext token: prefer the alias ref
 * (→ Primitives variable), fall back to the resolved literal, else null.
 */
function refOrLiteral(
  ref: string[] | null,
  resolved: string | undefined,
  token: IrToken,
  primitiveNames: Set<string>,
): PlannedValue | null {
  if (ref) {
    const name = ref.join("/");
    if (primitiveNames.has(name))
      return { kind: "alias", collection: COLLECTION_PRIMITIVES, variable: name };
  }
  if (resolved !== undefined)
    return literalValue({ ...token, $value: resolved });
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────

export function buildSyncPlan(ir: IrDocument): SyncPlan {
  const skipped: SkippedToken[] = [];

  const ext = ir.$extensions as
    | { "com.geeklego.ir"?: { source?: string; version?: string } }
    | undefined;
  const irMeta = ext?.["com.geeklego.ir"];
  const irSource = irMeta ? `${irMeta.source}@${irMeta.version}` : "unknown";

  // ── Tier 1: primitives ────────────────────────────────────────────────────
  const primitiveTokens: Array<{ path: string[]; token: IrToken }> = [];
  for (const groupName of Object.keys(ir).sort()) {
    if (groupName.startsWith("$") || groupName === "semantic" || groupName === "ext")
      continue;
    const node = ir[groupName];
    if (isIrGroup(node)) walkGroup(node, [groupName], primitiveTokens);
  }

  // Zero-pad numeric steps in the sort so color/brand/50 precedes /500 etc.
  primitiveTokens.sort((a, b) =>
    paddedSortKey(a.path.join("/")).localeCompare(paddedSortKey(b.path.join("/"))),
  );

  const primitives: PlannedVariable[] = [];
  const primitiveNames = new Set<string>();
  for (const { path, token } of primitiveTokens) {
    const name = path.join("/");
    const value = literalValue(token);
    if (!value) {
      skipped.push({
        path: path.join("."),
        reason: `unsupported $type "${token.$type}" or unparseable value "${String(token.$value)}"`,
      });
      continue;
    }
    primitives.push({
      name,
      resolvedType: typeOf(value),
      valuesByMode: { [MODE_VALUE]: value },
    });
    primitiveNames.add(name);
  }

  // ── Tier 2: semantics + ext (same shape, different collection) ───────────
  const aliasCollection = (
    groupName: "semantic" | "ext",
    figmaName: (key: string) => string,
  ): PlannedVariable[] => {
    const group = ir[groupName];
    const variables: PlannedVariable[] = [];
    if (!isIrGroup(group)) return variables;

    const keys = Object.keys(group).sort((a, b) =>
      paddedSortKey(figmaName(a)).localeCompare(paddedSortKey(figmaName(b))),
    );
    for (const key of keys) {
      const token = group[key];
      if (!isIrToken(token)) continue;

      const light = refOrLiteral(
        parseRef(token.$value),
        token.$extensions?.["com.geeklego.resolved"],
        token,
        primitiveNames,
      );
      if (!light) {
        skipped.push({
          path: `${groupName}.${key}`,
          reason: `unsupported $type "${token.$type}" or unresolvable value "${String(token.$value)}"`,
        });
        continue;
      }

      // Dark: explicit override, else same as light (mode must have a value).
      const darkOverride = token.$extensions?.["com.geeklego.modes"]?.dark;
      const dark = darkOverride
        ? (refOrLiteral(
            parseRef(darkOverride.$value),
            darkOverride["com.geeklego.resolved"],
            token,
            primitiveNames,
          ) ?? light)
        : light;

      const resolvedType =
        light.kind === "alias"
          ? primitives.find((p) => p.name === (light as { variable: string }).variable)!
              .resolvedType
          : typeOf(light);

      variables.push({
        name: figmaName(key),
        resolvedType,
        valuesByMode: { [MODE_LIGHT]: light, [MODE_DARK]: dark },
      });
    }
    return variables;
  };

  const semantics = aliasCollection("semantic", semanticFigmaName);
  const extVariables = aliasCollection("ext", extFigmaName);

  // ── Typography: a focused collection ALIASING the type-scale primitives ──
  // The Plugin API can't bind Text Style props to variables, so instead of
  // Text Styles we ship fontSize/lineHeight/fontFamily/fontWeight/letterSpacing
  // as their own foldered, referenceable variables (aliases into Primitives so
  // the single source of truth stays Tier 1).
  const typography: PlannedVariable[] = [];
  const TYPO_GROUPS: Array<{ group: string; folder: string }> = [
    { group: "fontSize", folder: "fontSize" },
    { group: "lineHeight", folder: "lineHeight" },
    { group: "fontFamily", folder: "fontFamily" },
    { group: "fontWeight", folder: "fontWeight" },
    { group: "letterSpacing", folder: "letterSpacing" },
  ];
  for (const { group, folder } of TYPO_GROUPS) {
    const node = ir[group];
    if (!isIrGroup(node)) continue;
    const steps = Object.keys(node).sort((a, b) =>
      paddedSortKey(a).localeCompare(paddedSortKey(b)),
    );
    for (const step of steps) {
      const token = node[step];
      if (!isIrToken(token)) continue;
      const primitiveName = `${group}/${step}`;
      if (!primitiveNames.has(primitiveName)) continue; // skipped at Tier 1
      const prim = primitives.find((p) => p.name === primitiveName)!;
      typography.push({
        name: `${folder}/${step}`,
        resolvedType: prim.resolvedType,
        valuesByMode: {
          [MODE_VALUE]: {
            kind: "alias",
            collection: COLLECTION_PRIMITIVES,
            variable: primitiveName,
          },
        },
      });
    }
  }

  const collections: PlannedCollection[] = [
    { name: COLLECTION_PRIMITIVES, modes: [MODE_VALUE], variables: primitives },
    { name: COLLECTION_SEMANTICS, modes: [MODE_LIGHT, MODE_DARK], variables: semantics },
    { name: COLLECTION_EXT, modes: [MODE_LIGHT, MODE_DARK], variables: extVariables },
    { name: COLLECTION_TYPOGRAPHY, modes: [MODE_VALUE], variables: typography },
  ];

  return { irSource, collections, skipped };
}
