import { structuredPatch } from 'diff'
import type { GeeklegoTokensV2 } from '../types'
import { generateGeeklegoV2 } from './cssGenerator'
import { FONT_LOADER_EDIT_PREFIX, DARK_EDIT_PREFIX, type StagedNewToken } from '../state/staging'

// Re-export so existing importers (the picker, display filters) keep their import site.
export { FONT_LOADER_EDIT_PREFIX }

/** Concatenate the v2 file strings into one combined CSS string for diffing/export. */
function combineV2Css(tokens: GeeklegoTokensV2): string {
  const { primitives, semantics, dark, fonts } = generateGeeklegoV2(tokens)
  return [fonts, primitives, semantics, dark].join('\n\n')
}

/** Apply a single staged font-loader edit onto modifiedTokens.fontLoaders (replace-by-slot). */
function applyFontLoaderEdit(
  modifiedTokens: GeeklegoTokensV2,
  slot: string,
  rawValue: string,
): void {
  if (!Array.isArray(modifiedTokens.fontLoaders)) modifiedTokens.fontLoaders = []
  const loaders = modifiedTokens.fontLoaders
  // Parse the staged JSON; empty/invalid → treat as "remove this slot's loader".
  let parsed: { family?: string; axes?: string } | null = null
  if (rawValue && rawValue.trim()) {
    try { parsed = JSON.parse(rawValue) } catch { parsed = null }
  }
  // De-dupe: a loader is identified by its family. Re-picking for a slot may change the
  // family, so drop any existing loader whose family matches EITHER the old or new value,
  // then add the new one. To keep it simple and slot-stable we de-dupe purely by family.
  if (!parsed || !parsed.family || !parsed.family.trim()) return // nothing to add (removal handled below)
  const family = parsed.family.trim()
  const axes = parsed.axes && parsed.axes.trim() ? parsed.axes.trim() : undefined
  const next = loaders.filter((l) => l.family !== family)
  next.push(axes ? { family, axes, source: 'google' } : { family, source: 'google' })
  modifiedTokens.fontLoaders = next
  void slot
}

/**
 * Generate the original CSS from the base tokens (v2: primitives + flat semantics + dark).
 */
export function generateOriginalCss(tokens: GeeklegoTokensV2): string {
  return combineV2Css(tokens)
}

function applyNewTokenToTree(modifiedTokens: GeeklegoTokensV2, newToken: StagedNewToken): void {
  const { treePath, value } = newToken
  const sem = modifiedTokens.semantics.light
  const prims = modifiedTokens.primitives as unknown as Record<string, Record<string, unknown>>

  switch (treePath.kind) {
    case 'primitiveColor':
      if (!modifiedTokens.primitives.colors[treePath.family]) {
        modifiedTokens.primitives.colors[treePath.family] = {}
      }
      modifiedTokens.primitives.colors[treePath.family][treePath.shade] = value
      break
    case 'primitiveFlat': {
      const cat = treePath.category
      if (!prims[cat]) break
      const numericCats = ['fontWeight']
      if (numericCats.includes(cat)) {
        const num = parseInt(value, 10)
        prims[cat][treePath.key] = isNaN(num) ? value : num
      } else {
        prims[cat][treePath.key] = value
      }
      break
    }
    case 'semanticColorGroup':
    case 'semanticFlat':
      // v2 flat semantics: the staged new semantic is keyed directly by its bare key.
      sem[treePath.key] = value
      break
  }
}

/**
 * Apply staged edits onto a cloned tokens object and return it.
 * Used both for generating merged CSS and for POSTing to /api/save-tokens.
 */
export function generateMergedTokens(
  tokens: GeeklegoTokensV2,
  stagedEdits: Map<string, string>,
  stagedNewTokens?: ReadonlyMap<string, StagedNewToken>
): GeeklegoTokensV2 {
  if (stagedEdits.size === 0 && (!stagedNewTokens || stagedNewTokens.size === 0)) return structuredClone(tokens)

  const modifiedTokens = structuredClone(tokens)

  for (const [tokenName, stagedValue] of stagedEdits) {
    // Font-loader edits (--font-loader-<slot>) are handled first: they carry a JSON value
    // into fontLoaders, NOT a primitive string. Must precede the --font-* family matcher
    // below, which would otherwise mis-read this key as a family token.
    if (tokenName.startsWith(FONT_LOADER_EDIT_PREFIX)) {
      const slot = tokenName.slice(FONT_LOADER_EDIT_PREFIX.length)
      applyFontLoaderEdit(modifiedTokens, slot, stagedValue)
      continue
    }

    // DARK-theme semantic edit (`dark:--<key>`): strip the prefix and route to
    // semantics.dark. Must precede the light/primitive matchers below, which assume
    // a key starting with `--`. A dark edit only ever targets a core semantic.
    if (tokenName.startsWith(DARK_EDIT_PREFIX)) {
      const darkSemanticKey = tokenName.slice(DARK_EDIT_PREFIX.length).replace(/^--/, '')
      modifiedTokens.semantics.dark[darkSemanticKey] = stagedValue
      continue
    }

    // v2 flat semantics: a staged edit keyed by the CSS name `--<semanticKey>` maps
    // directly onto modifiedTokens.semantics.light[semanticKey]. Match these FIRST —
    // before the `parts.length < 2` primitive-name guard below, which would otherwise
    // drop single-word semantics (--primary, --accent, --ring, --border, …) that split
    // into one part and never reach this handler.
    const semanticKey = tokenName.replace(/^--/, '')
    if (semanticKey in modifiedTokens.semantics.light) {
      modifiedTokens.semantics.light[semanticKey] = stagedValue
      continue
    }

    const parts = tokenName.replace(/^--/, '').split('-')
    if (parts.length < 2) continue

    if (tokenName.startsWith('--color-')) {
      const colorName = parts.slice(1).join('-')
      // Primitive color: --color-brand-500 → primitives.colors.brand['500']
      for (const [family, shades] of Object.entries(modifiedTokens.primitives.colors)) {
        if (colorName.startsWith(family + '-')) {
          const shade = colorName.slice(family.length + 1)
          if (shade in shades) {
            modifiedTokens.primitives.colors[family][shade] = stagedValue
          }
          break
        }
      }
    } else if (tokenName.startsWith('--text-') || tokenName.startsWith('--font-weight-') ||
               tokenName.startsWith('--font-') ||
               tokenName.startsWith('--leading-') || tokenName.startsWith('--tracking-')) {
      // Tailwind typography namespaces. --font-weight-* checked BEFORE bare --font-* (family).
      if (tokenName.startsWith('--text-')) {
        const key = parts.slice(1).join('-')
        if (key in modifiedTokens.primitives.fontSize) {
          modifiedTokens.primitives.fontSize[key] = stagedValue
        }
      } else if (tokenName.startsWith('--font-weight-')) {
        const key = parts.slice(2).join('-')
        if (key in modifiedTokens.primitives.fontWeight) {
          modifiedTokens.primitives.fontWeight[key] = parseInt(stagedValue, 10) || 0
        }
      } else if (tokenName.startsWith('--font-')) {
        const key = parts.slice(1).join('-')
        if (key in modifiedTokens.primitives.fontFamily) {
          modifiedTokens.primitives.fontFamily[key] = stagedValue
        }
      } else if (tokenName.startsWith('--leading-')) {
        const key = parts.slice(1).join('-')
        if (key in modifiedTokens.primitives.lineHeight) {
          modifiedTokens.primitives.lineHeight[key] = stagedValue
        }
      } else if (tokenName.startsWith('--tracking-')) {
        const key = parts.slice(1).join('-')
        if (key in modifiedTokens.primitives.letterSpacing) {
          modifiedTokens.primitives.letterSpacing[key] = stagedValue
        }
      }
    } else if (tokenName.startsWith('--duration-')) {
      const key = parts.slice(1).join('-')
      if (key in modifiedTokens.primitives.duration) {
        modifiedTokens.primitives.duration[key] = stagedValue
      }
    } else if (tokenName.startsWith('--ease-')) {
      const key = parts.slice(1).join('-')
      if (key in modifiedTokens.primitives.easing) {
        modifiedTokens.primitives.easing[key] = stagedValue
      }
    } else if (tokenName.startsWith('--spacing-')) {
      const key = parts.slice(1).join('-')
      if (key in modifiedTokens.primitives.spacing) {
        modifiedTokens.primitives.spacing[key] = stagedValue
      }
    } else if (tokenName.startsWith('--radius-')) {
      const key = parts.slice(1).join('-')
      if (key in modifiedTokens.primitives.radius) {
        modifiedTokens.primitives.radius[key] = stagedValue
      }
    }
  }

  if (stagedNewTokens) {
    for (const [, newToken] of stagedNewTokens) {
      applyNewTokenToTree(modifiedTokens, newToken)
    }
  }

  return modifiedTokens
}

/**
 * Generate the merged CSS by applying staged edits on top of the original tokens.
 */
export function generateMergedCss(
  tokens: GeeklegoTokensV2,
  stagedEdits: Map<string, string>,
  stagedNewTokens?: ReadonlyMap<string, StagedNewToken>
): string {
  return combineV2Css(generateMergedTokens(tokens, stagedEdits, stagedNewTokens))
}

/**
 * Generate a unified diff string between original and merged CSS.
 */
export function generateCssDiff(
  original: string,
  merged: string,
  fileName: string = 'geeklego.css'
) {
  return structuredPatch(fileName, fileName, original, merged, undefined, undefined, {
    context: 3,
  })
}

/**
 * Format a structured patch into a human-readable diff string.
 */
export function formatDiff(patch: ReturnType<typeof generateCssDiff>): string {
  if (patch.hunks.length === 0) return ''

  const lines: string[] = []
  for (const hunk of patch.hunks) {
    lines.push(`@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`)
    for (const line of hunk.lines) {
      if (line.startsWith('-')) {
        lines.push(`< ${line.slice(1)}`)
      } else if (line.startsWith('+')) {
        lines.push(`> ${line.slice(1)}`)
      } else {
        lines.push(`  ${line.slice(1)}`)
      }
    }
    lines.push('')
  }
  return lines.join('\n')
}

/**
 * Generate a unified diff with structured hunks for rendering.
 */
export function getDiffHunks(
  original: string,
  merged: string
): Array<{
  oldStart: number
  oldLines: number
  newStart: number
  newLines: number
  lines: Array<{ type: 'added' | 'removed' | 'context'; content: string }>
}> {
  const patch = generateCssDiff(original, merged)
  return patch.hunks.map((hunk) => ({
    oldStart: hunk.oldStart,
    oldLines: hunk.oldLines,
    newStart: hunk.newStart,
    newLines: hunk.newLines,
    lines: hunk.lines.map((line) => {
      if (line.startsWith('-')) {
        return { type: 'removed' as const, content: line.slice(1) }
      } else if (line.startsWith('+')) {
        return { type: 'added' as const, content: line.slice(1) }
      } else {
        return { type: 'context' as const, content: line.slice(1) }
      }
    }),
  }))
}
