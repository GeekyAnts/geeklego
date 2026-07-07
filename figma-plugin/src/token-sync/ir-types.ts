/**
 * Minimal typings for the geeklego W3C-DTCG IR (`dist/ir/tokens.json`,
 * emitted by scripts/export-ir.ts — the "IR-as-contract").
 *
 * A node is a TOKEN when it has `$type`; otherwise it's a GROUP of nodes.
 * Semantics/ext tokens carry their dark-mode override + resolved literals in
 * `$extensions["com.geeklego.modes"] / ["com.geeklego.resolved"]`.
 */

export interface IrDarkOverride {
  $value?: string;
  "com.geeklego.resolved"?: string;
}

export interface IrTokenExtensions {
  "com.geeklego.resolved"?: string;
  "com.geeklego.modes"?: {
    dark?: IrDarkOverride;
  };
}

export interface IrToken {
  $type: string;
  $value: string | number;
  $extensions?: IrTokenExtensions;
}

/** A group maps keys to tokens or nested groups. */
export type IrNode = IrToken | IrGroup;
export interface IrGroup {
  [key: string]: IrNode;
}

/** The document root: top-level groups plus the `$extensions` stamp. */
export type IrDocument = Record<string, unknown>;

export function isIrToken(node: unknown): node is IrToken {
  return (
    typeof node === "object" &&
    node !== null &&
    "$type" in node &&
    "$value" in node
  );
}

export function isIrGroup(node: unknown): node is IrGroup {
  return typeof node === "object" && node !== null && !isIrToken(node);
}

/** DTCG alias reference: "{color.brand.600}" → ["color","brand","600"]. */
export function parseRef(value: unknown): string[] | null {
  if (typeof value !== "string") return null;
  const m = /^\{([^{}]+)\}$/.exec(value.trim());
  return m ? m[1].split(".") : null;
}

/** Look a dot-path up in the IR tree; returns the token or null. */
export function getTokenAtPath(ir: IrDocument, path: string[]): IrToken | null {
  let node: unknown = ir;
  for (const seg of path) {
    if (!isIrGroup(node)) return null;
    node = (node as IrGroup)[seg];
  }
  return isIrToken(node) ? node : null;
}
