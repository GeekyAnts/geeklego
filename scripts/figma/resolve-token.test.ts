import { describe, expect, it } from "vitest";
import { resolveTokens } from "./resolve-token";

describe("resolveTokens", () => {
  it("resolves the default Button classes", () => {
    // from button-variants.ts: default variant + md size + base
    const r = resolveTokens([
      "inline-flex",
      "rounded-md",
      "bg-primary",
      "text-primary-foreground",
      "h-10",
      "px-4",
    ]);
    expect(r.fill).toBe("semantic.primary");
    expect(r.text).toBe("semantic.primary-foreground");
    expect(r.radius).toBe("semantic.radius");
    expect(r.border).toBeNull();
  });

  it("resolves the outline variant (border + muted hover ignored, base fill/text)", () => {
    const r = resolveTokens([
      "border",
      "border-input",
      "bg-background",
      "text-foreground",
      "rounded-md",
    ]);
    expect(r.border).toBe("semantic.input");
    expect(r.fill).toBe("semantic.background");
    expect(r.text).toBe("semantic.foreground");
  });

  it("last class wins for a role (cn/tailwind-merge semantics)", () => {
    const r = resolveTokens(["bg-primary", "bg-secondary"]);
    expect(r.fill).toBe("semantic.secondary");
  });

  it("ignores opacity-suffixed and unknown utilities", () => {
    const r = resolveTokens(["bg-primary/90", "hover:bg-primary/80", "shadow-lg"]);
    // bg-primary/90 → strips /90 → primary; hover: prefix is a different util
    expect(r.fill).toBe("semantic.primary");
  });

  it("returns all-null for a class list with no recognized tokens", () => {
    const r = resolveTokens(["flex", "items-center", "gap-2", "font-medium"]);
    expect(r).toEqual({
      fill: null,
      text: null,
      border: null,
      ring: null,
      radius: null,
    });
  });

  it("resolves ring-ring", () => {
    expect(resolveTokens(["ring-ring"]).ring).toBe("semantic.ring");
  });

  it("resolves the gamified --ext-* utilities to ext.<key> paths", () => {
    const r = resolveTokens([
      "bg-ext-button-gamified-bg",
      "text-ext-button-gamified-foreground",
      "focus-visible:ring-ext-button-gamified-ring",
      "hover:bg-ext-button-gamified-bg-hover",
      "active:bg-ext-button-gamified-bg-active",
      "rounded-md",
    ]);
    expect(r.fill).toBe("ext.ext-button-gamified-bg");
    expect(r.text).toBe("ext.ext-button-gamified-foreground");
    expect(r.radius).toBe("semantic.radius");
    // pseudo-prefixed utilities (hover:/active:/focus-visible:) don't start with
    // a bare bg-/ring-, so they're naturally excluded — only base fills bind.
    expect(r.ring).toBeNull();
  });
});
