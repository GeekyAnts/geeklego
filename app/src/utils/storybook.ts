// ─── Storybook Story URL Mapping (v2) ────────────────────────────────────────
// Maps Token Editor component names to v2 Storybook story URLs.
//
// v2 stories are all titled `v2/<Name>` → Storybook lowercases the title and
// swaps "/" for "-" with NO separators inserted at word boundaries, giving ids
// like `v2-button--default` and `v2-inputotp--dark-mode`. (The old 3-tier
// `atoms-/molecules-/organisms-` tier scheme and `COMPONENT_LEVEL_MAP` are gone
// along with the deleted catalog.)
//
// The component/story inventory now comes from the generated catalog
// (`scripts/generate-catalog.ts` → `app/src/generated/catalog.json`), so the set
// stays in sync with the actual story files — no hand-maintained map.

import catalog from '../generated/catalog.json'
import type { CatalogEntry } from './catalog.types'

const CATALOG = catalog as CatalogEntry[]
const BY_NAME = new Map(CATALOG.map(entry => [entry.name.toLowerCase(), entry]))

function lookup(componentName: string): CatalogEntry | undefined {
  return BY_NAME.get(componentName.toLowerCase())
}

/**
 * Converts componentName + storyName to a v2 Storybook story id.
 *
 *   'Button'   + 'Default'  → 'v2-button--default'
 *   'InputOTP' + 'DarkMode' → 'v2-inputotp--dark-mode'
 *
 * The `level` parameter is vestigial (3-tier holdover) and ignored — kept so the
 * existing ComponentPreviewFrame call site doesn't have to change.
 */
export function componentToStoryId(
  componentName: string,
  _level: string,
  storyName: string,
): string {
  const entry = lookup(componentName)
  // Prefer the catalog's real prefix; fall back to Storybook's own sanitize over
  // `v2/<name>` (collapse non-alphanumerics → "-") for components not in catalog.
  const prefix =
    entry?.storyIdPrefix ??
    `v2-${componentName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return `${prefix}--${toStorySegment(storyName)}`
}

/** 'DarkMode' → 'dark-mode', 'Default' → 'default', 'Sizes' → 'sizes' */
function toStorySegment(storyName: string): string {
  return storyName
    .replace(/([A-Z])/g, (_m, l, offset) => (offset > 0 ? '-' : '') + l.toLowerCase())
    .toLowerCase()
}

/**
 * The port Storybook is served on. Defaults to 6006 (Storybook's default), but is
 * overridable via `VITE_STORYBOOK_PORT` so the Token Editor can point at a
 * non-default instance (e.g. launch.json runs Storybook on 6008 to avoid clashes).
 */
export const STORYBOOK_PORT: number = Number(import.meta.env.VITE_STORYBOOK_PORT) || 6006

/** Storybook origin, derived from {@link STORYBOOK_PORT}. */
export const STORYBOOK_ORIGIN = `http://localhost:${STORYBOOK_PORT}`

/** Full Storybook iframe URL for a given story id. */
export function getStoryUrl(storyId: string, port = STORYBOOK_PORT): string {
  return `http://localhost:${port}/iframe.html?id=${storyId}&viewMode=story`
}

/**
 * Story names available in the picker for a component. Returns an empty array
 * for unknown components (triggers the no-preview state). Driven by the catalog.
 */
export function getAvailableStories(componentName: string): readonly string[] {
  return lookup(componentName)?.stories ?? []
}

/** True if the component has v2 Storybook stories in the catalog. */
export function hasStorybookStory(componentName: string): boolean {
  return BY_NAME.has(componentName.toLowerCase())
}

/** The full catalog, sorted by name. */
export function getComponentCatalog(): CatalogEntry[] {
  return CATALOG
}

/**
 * The composed "preview set" stories (title `preview/<Set>` → id `preview-*`) —
 * the dense collages the docked preview band renders, as opposed to the 50
 * individual per-component stories. These are authored in `components/v2/_preview/`.
 */
export function getPreviewSets(): CatalogEntry[] {
  return CATALOG.filter(e => e.storyIdPrefix.startsWith('preview-'))
}
