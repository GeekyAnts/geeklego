/// <reference types="@figma/plugin-typings" />
/**
 * build-component — sandbox executor for Phase 3.
 *
 * Turns a ComponentManifestEntry into a native Figma COMPONENT SET:
 *   - one COMPONENT per scraped combination, each an Auto-Layout frame sized,
 *     padded, filled, stroked, radiused and text-styled from the scrape
 *   - combined via figma.combineAsVariants → Variant/Size/Disabled become
 *     native variant properties (Figma derives them from the child names)
 *   - a TEXT layer per component becomes the shared "Label" text property
 *   - fills / stroke / corner radius / text color BIND to the "02 · Semantics"
 *     variables the token sync created (looked up by foldered name), falling
 *     back to the raw scraped literal when a token isn't bound (e.g. gamified).
 *
 * Fonts are preflighted once; a missing family degrades to whatever Figma has
 * (reported), never a crash.
 */
import type {
  BindableValue,
  ComponentManifestEntry,
  Rgba,
  VariantCombination,
} from "./manifest-types";
import { tokenToVariableRef } from "./token-to-variable";

export interface ComponentBuildReport {
  name: string;
  componentsCreated: number;
  bindingsApplied: number;
  unboundValues: number;
  warnings: string[];
}

/** Look up a Figma variable by (collection name, foldered variable name). */
async function buildVariableIndex(): Promise<Map<string, Variable>> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const byId = new Map(collections.map((c) => [c.id, c.name]));
  const vars = await figma.variables.getLocalVariablesAsync();
  const index = new Map<string, Variable>();
  for (const v of vars) {
    const colName = byId.get(v.variableCollectionId);
    if (colName) index.set(`${colName}:${v.name}`, v);
  }
  return index;
}

const solid = (c: Rgba): SolidPaint => ({
  type: "SOLID",
  color: { r: c.r, g: c.g, b: c.b },
  opacity: c.a,
});

export async function buildComponent(
  entry: ComponentManifestEntry,
): Promise<ComponentBuildReport> {
  const report: ComponentBuildReport = {
    name: entry.name,
    componentsCreated: 0,
    bindingsApplied: 0,
    unboundValues: 0,
    warnings: [],
  };

  const varIndex = await buildVariableIndex();
  if (varIndex.size === 0)
    report.warnings.push(
      "No local variables found — run Sync Tokens first so bindings resolve.",
    );

  // Font preflight: load the family the scrape recorded (fallback Inter).
  const sampleTypo = entry.combinations.find((c) => c.geometry.typography)
    ?.geometry.typography;
  const family = sampleTypo?.fontFamily.value ?? "Inter";
  const fontName: FontName = { family, style: "Medium" };
  let fontLoaded = true;
  try {
    await figma.loadFontAsync(fontName);
  } catch {
    fontLoaded = false;
    report.warnings.push(
      `Font "${family} Medium" unavailable — text uses Figma default.`,
    );
    try {
      await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    } catch {
      /* Inter also missing — createText will use whatever loads */
    }
  }

  // Bind a variable to a paint slot, or fall back to the literal.
  const bindPaint = (
    node: SceneNode & { fills: readonly Paint[] | typeof figma.mixed },
    slot: "fills",
    bindable: BindableValue<Rgba>,
  ) => {
    const ref = tokenToVariableRef(bindable.token);
    const variable = ref ? varIndex.get(`${ref.collection}:${ref.name}`) : null;
    const paint = solid(bindable.value);
    if (variable) {
      const bound = figma.variables.setBoundVariableForPaint(
        paint,
        "color",
        variable,
      );
      (node as GeometryMixin).fills = [bound];
      report.bindingsApplied++;
    } else {
      (node as GeometryMixin).fills = [paint];
      if (bindable.token) report.unboundValues++;
    }
  };

  const bindFloat = (
    node: SceneNode,
    field: VariableBindableNodeField,
    bindable: BindableValue<number>,
  ) => {
    const ref = tokenToVariableRef(bindable.token);
    const variable = ref ? varIndex.get(`${ref.collection}:${ref.name}`) : null;
    if (variable) {
      node.setBoundVariable(field, variable);
      report.bindingsApplied++;
    } else if (bindable.token) {
      report.unboundValues++;
    }
  };

  const components: ComponentNode[] = [];
  for (const combo of entry.combinations) {
    const comp = buildOneComponent(
      entry,
      combo,
      fontLoaded ? fontName : { family: "Inter", style: "Medium" },
      { bindPaint, bindFloat, varIndex, report },
    );
    components.push(comp);
    report.componentsCreated++;
  }

  // Combine into a variant set; lay the children out in a tidy grid first.
  layoutGrid(components);
  const set = figma.combineAsVariants(components, figma.currentPage);
  set.name = entry.name;
  set.layoutMode = "NONE";

  // Rename the boolean-valued axis so Figma treats it as a real boolean prop
  // (values already "true"/"false" from the manifest → auto-detected).

  figma.currentPage.selection = [set];
  figma.viewport.scrollAndZoomIntoView([set]);
  return report;
}

interface Binders {
  bindPaint: (
    node: SceneNode & { fills: readonly Paint[] | typeof figma.mixed },
    slot: "fills",
    b: BindableValue<Rgba>,
  ) => void;
  bindFloat: (
    node: SceneNode,
    field: VariableBindableNodeField,
    b: BindableValue<number>,
  ) => void;
  varIndex: Map<string, Variable>;
  report: ComponentBuildReport;
}

function buildOneComponent(
  entry: ComponentManifestEntry,
  combo: VariantCombination,
  font: FontName,
  b: Binders,
): ComponentNode {
  const g = combo.geometry;
  const comp = figma.createComponent();
  comp.name = entry.axes
    .map((a) => `${a.name}=${combo.properties[a.name]}`)
    .join(", ");

  // Auto Layout mirrors the flex row (button base is inline-flex, gap-2).
  comp.layoutMode = "HORIZONTAL";
  comp.primaryAxisAlignItems = "CENTER";
  comp.counterAxisAlignItems = "CENTER";
  comp.paddingTop = g.paddingPx.top.value;
  comp.paddingRight = g.paddingPx.right.value;
  comp.paddingBottom = g.paddingPx.bottom.value;
  comp.paddingLeft = g.paddingPx.left.value;
  comp.itemSpacing = g.gapPx.value;
  comp.primaryAxisSizingMode = "AUTO"; // width hugs content
  comp.counterAxisSizingMode = "FIXED";
  comp.resize(Math.max(g.widthPx, 1), g.heightPx);
  comp.cornerRadius = g.cornerRadiusPx.value;
  comp.opacity = g.opacity;

  // Fill
  if (g.fill) b.bindPaint(comp, "fills", g.fill);
  else comp.fills = [];

  // Stroke
  if (g.stroke) {
    const ref = tokenToVariableRef(g.stroke.color.token);
    const variable = ref
      ? b.varIndex.get(`${ref.collection}:${ref.name}`)
      : null;
    const paint = solid(g.stroke.color.value);
    if (variable) {
      comp.strokes = [
        figma.variables.setBoundVariableForPaint(paint, "color", variable),
      ];
      b.report.bindingsApplied++;
    } else {
      comp.strokes = [paint];
      if (g.stroke.color.token) b.report.unboundValues++;
    }
    comp.strokeWeight = g.stroke.weightPx;
  }

  // Corner radius binding (semantic.radius → layout/radius)
  b.bindFloat(comp, "topLeftRadius", g.cornerRadiusPx);
  b.bindFloat(comp, "topRightRadius", g.cornerRadiusPx);
  b.bindFloat(comp, "bottomLeftRadius", g.cornerRadiusPx);
  b.bindFloat(comp, "bottomRightRadius", g.cornerRadiusPx);

  // Label text
  if (entry.text && g.typography) {
    const text = figma.createText();
    text.fontName = font;
    text.characters = entry.text.sample;
    text.fontSize = g.typography.fontSizePx.value;
    if (g.typography.letterSpacingPx.value)
      text.letterSpacing = {
        value: g.typography.letterSpacingPx.value,
        unit: "PIXELS",
      };
    const tRef = tokenToVariableRef(g.typography.textColor.token);
    const tVar = tRef ? b.varIndex.get(`${tRef.collection}:${tRef.name}`) : null;
    const tPaint = solid(g.typography.textColor.value);
    if (tVar) {
      text.fills = [figma.variables.setBoundVariableForPaint(tPaint, "color", tVar)];
      b.report.bindingsApplied++;
    } else {
      text.fills = [tPaint];
      if (g.typography.textColor.token) b.report.unboundValues++;
    }
    comp.appendChild(text);
  }

  return comp;
}

/** Arrange components in a grid so the pre-combine layout isn't a pile. */
function layoutGrid(components: ComponentNode[]): void {
  const COLS = 8;
  const GAP = 24;
  let rowH = 0;
  let x = 0;
  let y = 0;
  components.forEach((c, i) => {
    if (i % COLS === 0 && i > 0) {
      y += rowH + GAP;
      x = 0;
      rowH = 0;
    }
    c.x = x;
    c.y = y;
    x += c.width + GAP;
    rowH = Math.max(rowH, c.height);
  });
}
