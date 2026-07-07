/**
 * Map an IR token path (as recorded in the component manifest, e.g.
 * "semantic.primary", "semantic.input", "semantic.radius") to the FOLDERED
 * Figma variable name the token sync produced ("interactive/primary",
 * "layout/input", "layout/radius"), plus the collection it lives in.
 *
 * This is the seam that lets component binding find the variable created by
 * the token sync. It reuses the exact same folder logic (semanticFigmaName)
 * so the two halves can never drift.
 */
import {
  COLLECTION_EXT,
  COLLECTION_SEMANTICS,
  extFigmaName,
  semanticFigmaName,
} from "../token-sync/build-sync-plan";

export interface VariableRef {
  collection: string;
  name: string;
}

/**
 * IR token path → the collection + foldered variable name the token sync made.
 *   "semantic.primary"            → 02 · Semantics : interactive/primary
 *   "ext.ext-button-gamified-bg"  → 03 · Ext       : button/gamified-bg
 * Reuses the same folder logic as the sync so the two halves never drift.
 */
export function tokenToVariableRef(tokenPath: string | null): VariableRef | null {
  if (!tokenPath) return null;

  const sem = /^semantic\.(.+)$/.exec(tokenPath);
  if (sem) return { collection: COLLECTION_SEMANTICS, name: semanticFigmaName(sem[1]) };

  const ext = /^ext\.(.+)$/.exec(tokenPath);
  if (ext) return { collection: COLLECTION_EXT, name: extFigmaName(ext[1]) };

  return null; // primitives aren't bound directly by components
}
