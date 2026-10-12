/**
 * Geeklego v2 component-catalog generator
 *
 * Crawls every v2 Storybook story file and emits a machine-readable catalog the
 * Token Editor's "Components" gallery consumes. This replaces the deleted 3-tier
 * `catalog.ts` (the old `COMPONENT_LEVEL_MAP`) — the source of truth is now the
 * stories themselves, so new components appear in the gallery automatically.
 *
 * For each `components/v2/<Name>/<Name>.stories.tsx` we extract:
 *   • the CSF3 `meta.title` (`"v2/<Name>"`)            → component name + story-id prefix
 *   • the named story exports (`Default`, `Variants`, …) → the per-card story list
 *
 * Storybook derives a story id by lowercasing the title and replacing the `/`
 * with `-` (no separators inserted at word boundaries), then appending
 * `--<kebab-story-name>`. So `v2/Button` + `DarkMode` → `v2-button--dark-mode`.
 *
 * Output: `app/src/generated/catalog.json`
 *   [{ name, storyIdPrefix, defaultStory, stories: [...] }]
 *
 * Run:  npx tsx scripts/generate-catalog.ts
 * Or import { buildCatalog } and call it from the dev-server plugin.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { relative, dirname, resolve } from 'path'
import { glob } from 'tinyglobby'

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..')
const STORIES_GLOB = 'components/v2/**/*.stories.tsx'
const OUTPUT_PATH = 'app/src/generated/catalog.json'

export interface CatalogEntry {
  /** Component name as it appears in the title, e.g. "Button", "InputOTP". */
  name: string
  /** Storybook story-id prefix, e.g. "v2-button" (title lowercased, "/" → "-"). */
  storyIdPrefix: string
  /** The story rendered in the gallery card by default (prefers "Default"). */
  defaultStory: string
  /** All named story exports found in the file, in source order. */
  stories: string[]
}

/**
 * `v2/Button` → `v2-button`, `preview/Data & Tables` → `preview-data-tables`.
 * Mirrors @storybook/csf's `sanitize`: lowercase, collapse every run of
 * non-alphanumerics to a single "-", and trim leading/trailing "-". This is how
 * Storybook itself derives the story-id prefix from the title, so the iframe URL
 * (`/iframe.html?id=<prefix>--<story>`) resolves.
 */
function titleToStoryIdPrefix(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Pull `meta.title` out of a CSF3 story source. Returns null if absent. */
function extractTitle(source: string): string | null {
  const match = source.match(/title:\s*["'`]([^"'`]+)["'`]/)
  return match ? match[1] : null
}

/**
 * Pull the named story exports (`export const Default`, `export const DarkMode`)
 * in source order. Excludes the default export (`meta`) and type-only exports.
 */
function extractStoryExports(source: string): string[] {
  const names: string[] = []
  const re = /export\s+const\s+([A-Z][A-Za-z0-9]*)\s*[:=]/g
  let m: RegExpExecArray | null
  while ((m = re.exec(source)) !== null) {
    names.push(m[1])
  }
  return names
}

/** Build the catalog by scanning the story files. Pure — returns the entries. */
export async function buildCatalog(root: string = REPO_ROOT): Promise<CatalogEntry[]> {
  const files = await glob(STORIES_GLOB, { cwd: root, absolute: true })
  const entries: CatalogEntry[] = []

  for (const file of files.sort()) {
    const source = readFileSync(file, 'utf8')
    const title = extractTitle(source)
    if (!title) continue // not a CSF3 story with a title — skip

    const name = title.split('/').pop() ?? title
    const stories = extractStoryExports(source)
    if (stories.length === 0) continue

    // Prefer the canonical "Default" story for the gallery card; else the first.
    const defaultStory = stories.includes('Default') ? 'Default' : stories[0]

    entries.push({
      name,
      storyIdPrefix: titleToStoryIdPrefix(title),
      defaultStory,
      stories,
    })
  }

  return entries.sort((a, b) => a.name.localeCompare(b.name))
}

/** Write the catalog to `app/src/generated/catalog.json`. Returns the entries. */
export async function writeCatalog(root: string = REPO_ROOT): Promise<CatalogEntry[]> {
  const entries = await buildCatalog(root)
  const outPath = resolve(root, OUTPUT_PATH)
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, JSON.stringify(entries, null, 2) + '\n', 'utf8')
  return entries
}

// CLI entrypoint — only runs when invoked directly, not when imported.
const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)

if (invokedDirectly) {
  writeCatalog()
    .then(entries => {
      console.log(`✓ catalog: ${entries.length} components → ${relative(process.cwd(), resolve(REPO_ROOT, OUTPUT_PATH))}`)
    })
    .catch(err => {
      console.error('✗ catalog generation failed:', err)
      process.exit(1)
    })
}
