import { describe, expect, it } from "vitest";
import { parseColor } from "./color";
import { toMs, toPx, firstFontFamily } from "./dimension";

describe("parseColor · oklch", () => {
  it("white: oklch(100% 0 0) → 1,1,1", () => {
    const c = parseColor("oklch(100% 0 0)")!;
    expect(c.r).toBeCloseTo(1, 3);
    expect(c.g).toBeCloseTo(1, 3);
    expect(c.b).toBeCloseTo(1, 3);
    expect(c.a).toBe(1);
  });

  it("black: oklch(0% 0 0) → 0,0,0", () => {
    const c = parseColor("oklch(0% 0 0)")!;
    expect(c.r).toBeCloseTo(0, 3);
    expect(c.g).toBeCloseTo(0, 3);
    expect(c.b).toBeCloseTo(0, 3);
  });

  it("accent orange (oklch(70.487% 0.187 47.604)) is warm: r > g > b", () => {
    const c = parseColor("oklch(70.487% 0.187 47.604)")!;
    expect(c.r).toBeGreaterThan(c.g);
    expect(c.g).toBeGreaterThan(c.b);
  });

  it("all channels stay clamped to [0,1] even out of gamut", () => {
    const c = parseColor("oklch(80% 0.4 145)")!; // hyper-saturated green
    for (const ch of [c.r, c.g, c.b]) {
      expect(ch).toBeGreaterThanOrEqual(0);
      expect(ch).toBeLessThanOrEqual(1);
    }
  });

  it("parses slash alpha", () => {
    expect(parseColor("oklch(50% 0.1 200 / 0.5)")!.a).toBeCloseTo(0.5);
  });
});

describe("parseColor · hex & keywords", () => {
  it("#fff and #ffffff", () => {
    expect(parseColor("#fff")).toEqual({ r: 1, g: 1, b: 1, a: 1 });
    expect(parseColor("#ffffff")).toEqual({ r: 1, g: 1, b: 1, a: 1 });
  });
  it("#18181b (zinc-900)", () => {
    const c = parseColor("#18181b")!;
    expect(c.r).toBeCloseTo(0x18 / 255, 5);
    expect(c.b).toBeCloseTo(0x1b / 255, 5);
  });
  it("8-digit hex alpha", () => {
    expect(parseColor("#ff000080")!.a).toBeCloseTo(0x80 / 255, 5);
  });
  it("transparent", () => {
    expect(parseColor("transparent")).toEqual({ r: 0, g: 0, b: 0, a: 0 });
  });
  it("garbage → null", () => {
    expect(parseColor("var(--nope)")).toBeNull();
    expect(parseColor("cubic-bezier(0.4, 0, 1, 1)")).toBeNull();
  });
});

describe("dimension helpers", () => {
  it("toPx: rem×16, px passthrough, bare zero", () => {
    expect(toPx("1rem")).toBe(16);
    expect(toPx("0.5rem")).toBe(8);
    expect(toPx("2px")).toBe(2);
    expect(toPx("9999px")).toBe(9999);
    expect(toPx("0")).toBe(0);
    expect(toPx("-0.025rem")).toBeCloseTo(-0.4);
  });
  it("toPx: unmappable units → null", () => {
    expect(toPx("65ch")).toBeNull();
    expect(toPx("100%")).toBeNull();
  });
  it("toMs", () => {
    expect(toMs("100ms")).toBe(100);
    expect(toMs("0.2s")).toBe(200);
    expect(toMs("fast")).toBeNull();
  });
  it("firstFontFamily strips quotes and takes the first family", () => {
    expect(firstFontFamily('"Inter", ui-sans-serif, system-ui, sans-serif')).toBe(
      "Inter",
    );
    expect(firstFontFamily("'JetBrains Mono', monospace")).toBe("JetBrains Mono");
  });
});
