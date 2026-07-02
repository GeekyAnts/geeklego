import { describe, expect, it } from "vitest";
import { tokenToVariableRef } from "./token-to-variable";
import {
  COLLECTION_EXT,
  COLLECTION_SEMANTICS,
} from "../token-sync/build-sync-plan";

describe("tokenToVariableRef", () => {
  it("maps a semantic token to its foldered variable name", () => {
    expect(tokenToVariableRef("semantic.primary")).toEqual({
      collection: COLLECTION_SEMANTICS,
      name: "interactive/primary",
    });
    expect(tokenToVariableRef("semantic.primary-foreground")).toEqual({
      collection: COLLECTION_SEMANTICS,
      name: "interactive/primary/foreground",
    });
    expect(tokenToVariableRef("semantic.input")).toEqual({
      collection: COLLECTION_SEMANTICS,
      name: "layout/input",
    });
    expect(tokenToVariableRef("semantic.radius")).toEqual({
      collection: COLLECTION_SEMANTICS,
      name: "layout/radius",
    });
  });

  it("maps ext tokens to the 03 · Ext collection, foldered by component", () => {
    expect(tokenToVariableRef("ext.ext-button-gamified-bg")).toEqual({
      collection: COLLECTION_EXT,
      name: "button/gamified-bg",
    });
    expect(tokenToVariableRef("ext.ext-button-gamified-foreground")).toEqual({
      collection: COLLECTION_EXT,
      name: "button/gamified-foreground",
    });
  });

  it("returns null for null / primitive tokens", () => {
    expect(tokenToVariableRef(null)).toBeNull();
    expect(tokenToVariableRef("color.brand.600")).toBeNull();
  });
});
