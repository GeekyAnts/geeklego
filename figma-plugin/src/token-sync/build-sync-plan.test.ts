/**
 * Unit tests for the pure token mapper, run against the REAL IR
 * (dist/ir/tokens.json — regenerate with `pnpm run export-ir`).
 * Expectations are derived from the IR itself wherever the concrete token
 * values could legitimately drift (brand edits in the Token Editor).
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  COLLECTION_EXT,
  COLLECTION_PRIMITIVES,
  COLLECTION_SEMANTICS,
  COLLECTION_TYPOGRAPHY,
  MODE_DARK,
  MODE_LIGHT,
  MODE_VALUE,
  buildSyncPlan,
  paddedSortKey,
  semanticFigmaName,
  type PlannedValue,
} from "./build-sync-plan";
import { parseRef, type IrDocument, type IrGroup, type IrToken } from "./ir-types";
import { parseColor } from "./color";

const IR_PATH = resolve(__dirname, "../../../dist/ir/tokens.json");

function loadIr(): IrDocument {
  if (!existsSync(IR_PATH))
    throw new Error(`IR not found at ${IR_PATH} — run \`pnpm run export-ir\` first.`);
  return JSON.parse(readFileSync(IR_PATH, "utf8")) as IrDocument;
}

const ir = loadIr();
const plan = buildSyncPlan(ir);

const byName = (collectionName: string) => {
  const col = plan.collections.find((c) => c.name === collectionName);
  if (!col) throw new Error(`collection missing: ${collectionName}`);
  return col;
};

describe("buildSyncPlan · collections & modes", () => {
  it("plans the four collections with the right modes", () => {
    expect(plan.collections.map((c) => c.name)).toEqual([
      COLLECTION_PRIMITIVES,
      COLLECTION_SEMANTICS,
      COLLECTION_EXT,
      COLLECTION_TYPOGRAPHY,
    ]);
    expect(byName(COLLECTION_PRIMITIVES).modes).toEqual([MODE_VALUE]);
    expect(byName(COLLECTION_SEMANTICS).modes).toEqual([MODE_LIGHT, MODE_DARK]);
    expect(byName(COLLECTION_EXT).modes).toEqual([MODE_LIGHT, MODE_DARK]);
    expect(byName(COLLECTION_TYPOGRAPHY).modes).toEqual([MODE_VALUE]);
  });

  it("stamps the IR source", () => {
    expect(plan.irSource).toMatch(/geeklego-v2@/);
  });
});

describe("buildSyncPlan · primitives", () => {
  const primitives = byName(COLLECTION_PRIMITIVES);

  it("emits color primitives as COLOR with slash names", () => {
    const v = primitives.variables.find((x) => x.name === "color/brand/600");
    expect(v).toBeDefined();
    expect(v!.resolvedType).toBe("COLOR");
    const val = v!.valuesByMode[MODE_VALUE];
    expect(val.kind).toBe("color");
  });

  it("converts dimension primitives to px FLOATs (radius/lg = 0.5rem → 8)", () => {
    const v = primitives.variables.find((x) => x.name === "radius/lg");
    expect(v).toBeDefined();
    expect(v!.resolvedType).toBe("FLOAT");
    expect(v!.valuesByMode[MODE_VALUE]).toEqual({ kind: "float", value: 8 });
  });

  it("maps fontFamily to STRING with the first family only", () => {
    const v = primitives.variables.find((x) => x.name === "fontFamily/sans");
    expect(v).toBeDefined();
    expect(v!.resolvedType).toBe("STRING");
    const val = v!.valuesByMode[MODE_VALUE];
    expect(val.kind).toBe("string");
    // first family of the stack, quotes stripped — no commas left
    expect((val as { value: string }).value).not.toContain(",");
  });

  it("skips unsupported types (easing cubicBezier) and reports them", () => {
    expect(primitives.variables.some((x) => x.name.startsWith("easing/"))).toBe(false);
    expect(plan.skipped.some((s) => s.path.startsWith("easing."))).toBe(true);
  });
});

describe("buildSyncPlan · semantics (the alias chain)", () => {
  const semantics = byName(COLLECTION_SEMANTICS);
  const semanticGroup = ir.semantic as IrGroup;

  it("plans every supported semantic token", () => {
    const expected = Object.entries(semanticGroup).filter(
      ([, t]) => (t as IrToken).$type !== "shadow",
    ).length;
    expect(semantics.variables.length).toBe(expected);
  });

  it("folders --primary under interactive/ and aliases the IR's primitive", () => {
    const irRef = parseRef((semanticGroup.primary as IrToken).$value);
    expect(irRef).not.toBeNull();
    const v = semantics.variables.find((x) => x.name === "interactive/primary");
    expect(v).toBeDefined();
    expect(v!.valuesByMode[MODE_LIGHT]).toEqual({
      kind: "alias",
      collection: COLLECTION_PRIMITIVES,
      variable: irRef!.join("/"),
    });
  });

  it("resolves the Dark mode from com.geeklego.modes.dark (surface/background)", () => {
    const bg = semanticGroup.background as IrToken;
    const darkRef = parseRef(bg.$extensions?.["com.geeklego.modes"]?.dark?.$value);
    expect(darkRef).not.toBeNull();
    const v = semantics.variables.find((x) => x.name === "surface/background");
    expect(v!.valuesByMode[MODE_DARK]).toEqual({
      kind: "alias",
      collection: COLLECTION_PRIMITIVES,
      variable: darkRef!.join("/"),
    });
  });

  it("folders the four semantic buckets the way the Token Editor does", () => {
    expect(semanticFigmaName("primary")).toBe("interactive/primary");
    expect(semanticFigmaName("primary-foreground")).toBe(
      "interactive/primary/foreground",
    );
    expect(semanticFigmaName("background")).toBe("surface/background");
    expect(semanticFigmaName("border")).toBe("layout/border");
    expect(semanticFigmaName("radius")).toBe("layout/radius");
    expect(semanticFigmaName("destructive")).toBe("status/destructive");
    expect(semanticFigmaName("chart-1")).toBe("status/chart/1");
    // every planned semantic name carries a bucket folder
    for (const v of semantics.variables) expect(v.name).toContain("/");
  });

  it("falls back to Light for semantics without a dark override", () => {
    for (const v of semantics.variables) {
      expect(v.valuesByMode[MODE_DARK]).toBeDefined();
    }
  });

  it("aliases the FLOAT semantic --radius into the radius primitives", () => {
    const v = semantics.variables.find((x) => x.name === "layout/radius");
    expect(v).toBeDefined();
    expect(v!.resolvedType).toBe("FLOAT");
    const light = v!.valuesByMode[MODE_LIGHT] as Extract<
      PlannedValue,
      { kind: "alias" }
    >;
    expect(light.kind).toBe("alias");
    expect(light.variable.startsWith("radius/")).toBe(true);
  });
});

describe("buildSyncPlan · ext (custom variants stay contained)", () => {
  const extCol = byName(COLLECTION_EXT);

  it("plans the gamified color tokens as aliases, foldered by component", () => {
    const v = extCol.variables.find((x) => x.name === "button/gamified-bg");
    expect(v).toBeDefined();
    expect(v!.valuesByMode[MODE_LIGHT].kind).toBe("alias");
  });

  it("skips the composite shadow token with a report", () => {
    expect(
      extCol.variables.some((x) => x.name === "ext-button-gamified-shadow"),
    ).toBe(false);
    expect(plan.skipped.some((s) => s.path === "ext.ext-button-gamified-shadow")).toBe(
      true,
    );
  });
});

describe("buildSyncPlan · typography collection", () => {
  const typo = byName(COLLECTION_TYPOGRAPHY);

  it("ships the type scale as aliased variables (not Text Styles)", () => {
    const fontSize = ir.fontSize as IrGroup;
    // one fontSize/<step> variable per IR fontSize step
    const sizes = typo.variables.filter((v) => v.name.startsWith("fontSize/"));
    expect(sizes.length).toBe(Object.keys(fontSize).length);
    const base = typo.variables.find((v) => v.name === "fontSize/base");
    expect(base).toBeDefined();
    expect(base!.resolvedType).toBe("FLOAT");
    expect(base!.valuesByMode[MODE_VALUE]).toEqual({
      kind: "alias",
      collection: COLLECTION_PRIMITIVES,
      variable: "fontSize/base",
    });
  });

  it("folders fontFamily / lineHeight / letterSpacing too", () => {
    expect(typo.variables.some((v) => v.name.startsWith("fontFamily/"))).toBe(true);
    expect(typo.variables.some((v) => v.name.startsWith("lineHeight/"))).toBe(true);
    expect(typo.variables.some((v) => v.name.startsWith("letterSpacing/"))).toBe(
      true,
    );
  });
});

describe("paddedSortKey", () => {
  it("orders numeric steps numerically (50 before 500)", () => {
    const names = ["color/brand/500", "color/brand/50", "color/brand/100"];
    const sorted = [...names].sort((a, b) =>
      paddedSortKey(a).localeCompare(paddedSortKey(b)),
    );
    expect(sorted).toEqual([
      "color/brand/50",
      "color/brand/100",
      "color/brand/500",
    ]);
  });
});

describe("buildSyncPlan · alias integrity", () => {
  it("every planned alias points at a planned primitive", () => {
    const primitiveNames = new Set(
      byName(COLLECTION_PRIMITIVES).variables.map((v) => v.name),
    );
    for (const col of plan.collections) {
      for (const v of col.variables) {
        for (const val of Object.values(v.valuesByMode)) {
          if (val.kind === "alias") {
            expect(val.collection).toBe(COLLECTION_PRIMITIVES);
            expect(primitiveNames.has(val.variable)).toBe(true);
          }
        }
      }
    }
  });

  it("spot-checks one alias against the IR's own resolved literal", () => {
    // semantic.primary resolved literal should equal the aliased primitive's value
    const primary = (ir.semantic as IrGroup).primary as IrToken;
    const resolved = parseColor(primary.$extensions!["com.geeklego.resolved"]!);
    const ref = parseRef(primary.$value)!.join("/");
    const prim = byName(COLLECTION_PRIMITIVES).variables.find((v) => v.name === ref)!;
    const primVal = prim.valuesByMode[MODE_VALUE] as Extract<
      PlannedValue,
      { kind: "color" }
    >;
    expect(resolved).not.toBeNull();
    expect(primVal.value.r).toBeCloseTo(resolved!.r, 5);
    expect(primVal.value.g).toBeCloseTo(resolved!.g, 5);
    expect(primVal.value.b).toBeCloseTo(resolved!.b, 5);
  });
});
