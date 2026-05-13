import type { GeeklegoTokens, TypographyClass } from '../types.ts'

// ─── Parser state ─────────────────────────────────────────────────────────────

type ParseState =
  | 'OUTSIDE'
  | 'IN_THEME'
  | 'IN_ROOT'
  | 'IN_DARK'
  | 'IN_SUPPORTS'
  | 'IN_TYPO_CLASS'
  | 'IN_MEDIA'
  | 'IN_MEDIA_RESPONSIVE'
  | 'DONE'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseNumeric(value: string): number {
  const n = parseFloat(value)
  return isNaN(n) ? 0 : n
}

function stripSemicolon(value: string): string {
  return value.replace(/;\s*$/, '').trim()
}

// ─── Token line collector with multi-line value support ───────────────────────

interface TokenEntry {
  name: string
  value: string
}

/**
 * Given an array of lines from a CSS block, extract all `--token: value;`
 * declarations. Handles multi-line values (value continues until `;` found).
 */
function stripInlineComment(s: string): string {
  // Remove /* ... */ inline comments (single-line only)
  return s.replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '').trim()
}

function collectTokens(lines: string[]): TokenEntry[] {
  const entries: TokenEntry[] = []
  let pendingName: string | null = null
  let pendingValue = ''

  for (const line of lines) {
    const trimmed = line.trim()

    if (pendingName !== null) {
      // Collecting continuation of a multi-line value
      // Strip inline comment before appending so the accumulated value stays clean
      const cleaned = stripInlineComment(trimmed)
      pendingValue += ' ' + cleaned
      // Check the comment-stripped line for the terminating semicolon
      if (cleaned.endsWith(';') || trimmed.endsWith(';')) {
        entries.push({ name: pendingName, value: stripSemicolon(pendingValue.trim()) })
        pendingName = null
        pendingValue = ''
      }
      continue
    }

    // Match `--token-name: value` optionally ending with `;`
    const match = trimmed.match(/^--([\w-]+):\s*(.*)$/)
    if (!match) continue

    const [, name, rest] = match
    // Strip inline comment from the rest before semicolon detection
    const cleanedRest = stripInlineComment(rest.trim())

    if (cleanedRest === '') {
      // value is on the next line(s)
      pendingName = name
      pendingValue = ''
    } else if (cleanedRest.endsWith(';')) {
      entries.push({ name, value: stripSemicolon(cleanedRest) })
    } else {
      // value may continue on next lines
      pendingName = name
      pendingValue = cleanedRest
    }
  }

  // Flush any trailing pending (shouldn't happen in valid CSS, but be safe)
  if (pendingName !== null && pendingValue !== '') {
    entries.push({ name: pendingName, value: stripSemicolon(pendingValue.trim()) })
  }

  return entries
}

// ─── @theme → Primitives ──────────────────────────────────────────────────────

function applyThemeToken(name: string, value: string, primitives: any): void {
  // Colors: --color-{family}-{shade}
  const colorMatch = name.match(/^color-([\w-]+)-(\w+)$/)
  if (colorMatch) {
    const [, family, shade] = colorMatch
    // Special case: --color-shadow-neutral is a single value, not a scale
    if (family === 'shadow' && shade === 'neutral') {
      primitives.colorShadowNeutral = value
      return
    }
    if (!primitives.colors[family]) primitives.colors[family] = {}
    primitives.colors[family][shade] = value
    return
  }

  // Font family: --font-family-{id}
  const fontFamilyMatch = name.match(/^font-family-(.+)$/)
  if (fontFamilyMatch) {
    primitives.fontFamily[fontFamilyMatch[1]] = value
    return
  }

  // Font size: --font-size-{n}
  const fontSizeMatch = name.match(/^font-size-(.+)$/)
  if (fontSizeMatch) {
    primitives.fontSize[fontSizeMatch[1]] = value
    return
  }

  // Font weight: --font-weight-{name}
  const fontWeightMatch = name.match(/^font-weight-(.+)$/)
  if (fontWeightMatch) {
    primitives.fontWeight[fontWeightMatch[1]] = parseNumeric(value)
    return
  }

  // Line height: --line-height-{name}
  const lineHeightMatch = name.match(/^line-height-(.+)$/)
  if (lineHeightMatch) {
    primitives.lineHeight[lineHeightMatch[1]] = value
    return
  }

  // Letter spacing: --letter-spacing-{name}
  const letterSpacingMatch = name.match(/^letter-spacing-(.+)$/)
  if (letterSpacingMatch) {
    primitives.letterSpacing[letterSpacingMatch[1]] = value
    return
  }

  // Spacing raw: --spacing-raw-{n} (must come before plain --spacing-{n})
  const spacingRawMatch = name.match(/^spacing-raw-(.+)$/)
  if (spacingRawMatch) {
    primitives.spacing[`raw-${spacingRawMatch[1]}`] = value
    return
  }

  // Spacing: --spacing-{n}
  const spacingMatch = name.match(/^spacing-(.+)$/)
  if (spacingMatch) {
    primitives.spacing[spacingMatch[1]] = value
    return
  }

  // Radius: --radius-{name}
  const radiusMatch = name.match(/^radius-(.+)$/)
  if (radiusMatch) {
    primitives.radius[radiusMatch[1]] = value
    return
  }

  // Border width: --border-width-{name}
  const borderWidthMatch = name.match(/^border-width-(.+)$/)
  if (borderWidthMatch) {
    primitives.borderWidth[borderWidthMatch[1]] = value
    return
  }

  // Opacity: --opacity-{n}
  const opacityMatch = name.match(/^opacity-(.+)$/)
  if (opacityMatch) {
    primitives.opacity[opacityMatch[1]] = parseNumeric(value)
    return
  }

  // Z-index: --z-index-{name}
  const zIndexMatch = name.match(/^z-index-(.+)$/)
  if (zIndexMatch) {
    primitives.zIndex[zIndexMatch[1]] = parseNumeric(value)
    return
  }

  // Duration: --duration-{name}
  const durationMatch = name.match(/^duration-(.+)$/)
  if (durationMatch) {
    primitives.duration[durationMatch[1]] = value
    return
  }

  // Easing: --ease-{name}
  const easeMatch = name.match(/^ease-(.+)$/)
  if (easeMatch) {
    primitives.easing[easeMatch[1]] = value
    return
  }

  // Breakpoints: --breakpoint-{name}
  const breakpointMatch = name.match(/^breakpoint-(.+)$/)
  if (breakpointMatch) {
    primitives.breakpoints[breakpointMatch[1]] = value
    return
  }

  // Icon size: --icon-size-{name}
  const iconSizeMatch = name.match(/^icon-size-(.+)$/)
  if (iconSizeMatch) {
    primitives.iconSize[iconSizeMatch[1]] = value
    return
  }

  // Line clamp: --line-clamp-{n}
  const lineClampMatch = name.match(/^line-clamp-(.+)$/)
  if (lineClampMatch) {
    primitives.contentFlexibility.lineClamp[lineClampMatch[1]] = parseNumeric(value)
    return
  }

  // Content max-width (in @theme): --content-max-width-{name}
  const contentMaxWidthMatch = name.match(/^content-max-width-(.+)$/)
  if (contentMaxWidthMatch) {
    primitives.contentFlexibility.maxWidth[contentMaxWidthMatch[1]] = value
    return
  }

  // Content min-width (in @theme): --content-min-width-{name}
  const contentMinWidthMatch = name.match(/^content-min-width-(.+)$/)
  if (contentMinWidthMatch) {
    primitives.contentFlexibility.minWidth[contentMinWidthMatch[1]] = value
    return
  }
}

// ─── :root/:dark → Semantics ──────────────────────────────────────────────────

function applySemanticToken(name: string, value: string, sem: any): void {
  // Background colors: --color-bg-{suffix}
  if (name.startsWith('color-bg-')) {
    sem.bg[name.slice('color-bg-'.length)] = value
    return
  }

  // Surface colors: --color-surface-{suffix}
  if (name.startsWith('color-surface-')) {
    sem.surface[name.slice('color-surface-'.length)] = value
    return
  }

  // Text colors: --color-text-{suffix}
  if (name.startsWith('color-text-')) {
    sem.text[name.slice('color-text-'.length)] = value
    return
  }

  // Border colors: --color-border-{suffix}
  if (name.startsWith('color-border-')) {
    sem.border[name.slice('color-border-'.length)] = value
    return
  }

  // Action colors: --color-action-{suffix}
  if (name.startsWith('color-action-')) {
    sem.action[name.slice('color-action-'.length)] = value
    return
  }

  // Status colors: --color-status-{suffix}
  if (name.startsWith('color-status-')) {
    sem.status[name.slice('color-status-'.length)] = value
    return
  }

  // State colors: --color-state-{suffix}
  if (name.startsWith('color-state-')) {
    sem.state[name.slice('color-state-'.length)] = value
    return
  }

  // Control thumb: --color-control-thumb (not prefixed with color-state-)
  if (name === 'color-control-thumb') {
    sem.colorControlThumb = value
    return
  }

  // Ring color: --color-ring (not prefixed with color-state-)
  if (name === 'color-ring') {
    sem.colorRing = value
    return
  }

  // Overlay backdrop: --color-overlay-backdrop
  if (name === 'color-overlay-backdrop') {
    sem.colorOverlayBackdrop = value
    return
  }

  // Data series: --color-data-series-{n}
  const dataSeriesMatch = name.match(/^color-data-series-(.+)$/)
  if (dataSeriesMatch) {
    sem.dataSeries[dataSeriesMatch[1]] = value
    return
  }

  // Shadows: --shadow-{name}
  if (name.startsWith('shadow-')) {
    sem.shadows[name.slice('shadow-'.length)] = value
    return
  }

  // Elevation opacity: --elevation-{name}-opacity → store just the name (e.g. "sm")
  const elevationMatch = name.match(/^elevation-(.+)-opacity$/)
  if (elevationMatch) {
    sem.elevationOpacity[elevationMatch[1]] = parseNumeric(value)
    return
  }

  // Spacing component: --spacing-component-{suffix}
  if (name.startsWith('spacing-component-')) {
    sem.spacingComponent[name.slice('spacing-component-'.length)] = value
    return
  }

  // Spacing layout: --spacing-layout-{suffix}
  if (name.startsWith('spacing-layout-')) {
    sem.spacingLayout[name.slice('spacing-layout-'.length)] = value
    return
  }

  // Size component: --size-component-{suffix}
  if (name.startsWith('size-component-')) {
    sem.sizeComponent[name.slice('size-component-'.length)] = value
    return
  }

  // Icon semantic: --icon-semantic-{name}
  if (name.startsWith('icon-semantic-')) {
    sem.iconSemantic[name.slice('icon-semantic-'.length)] = value
    return
  }

  // Size fixed: --size-fixed-{n}
  if (name.startsWith('size-fixed-')) {
    sem.sizeFixed[name.slice('size-fixed-'.length)] = value
    return
  }

  // Radius component: --radius-component-{suffix}
  if (name.startsWith('radius-component-')) {
    sem.radiusComponent[name.slice('radius-component-'.length)] = value
    return
  }

  // Duration (semantic — in :root): --duration-{suffix}
  if (name.startsWith('duration-')) {
    if (!sem.motion.duration) sem.motion.duration = {}
    sem.motion.duration[name.slice('duration-'.length)] = value
    return
  }

  // Ease (semantic — in :root): --ease-{suffix}
  if (name.startsWith('ease-')) {
    if (!sem.motion.easing) sem.motion.easing = {}
    sem.motion.easing[name.slice('ease-'.length)] = value
    return
  }

  // Layer: --layer-{name}
  if (name.startsWith('layer-')) {
    sem.layer[name.slice('layer-'.length)] = value
    return
  }

  // Borders: --border-{name} (semantic border shorthands)
  if (name.startsWith('border-')) {
    sem.borders[name.slice('border-'.length)] = value
    return
  }

  // Content flexibility: --content-{suffix}
  if (name.startsWith('content-')) {
    sem.contentFlexibility[name.slice('content-'.length)] = value
    return
  }

  // Typography semantics: --typography-{style}-{property}
  // style may contain hyphens (e.g. "display-hero", "heading-h1", "body-lg")
  // property is always the last segment: "size", "weight", "leading", "tracking"
  if (name.startsWith('typography-')) {
    const rest = name.slice('typography-'.length)
    // The property is the last hyphen-delimited segment
    const lastDash = rest.lastIndexOf('-')
    if (lastDash > 0) {
      const style = rest.slice(0, lastDash)
      const prop = rest.slice(lastDash + 1)
      if (!sem.typographySemantics[style]) sem.typographySemantics[style] = {}
      sem.typographySemantics[style][prop] = value
    }
    return
  }
}

// ─── Typography class parser ──────────────────────────────────────────────────

interface TypoClassAccumulator {
  name: string
  lines: string[]
}

function parseTypoClass(acc: TypoClassAccumulator): TypographyClass | null {
  const props: Record<string, string> = {}
  for (const line of acc.lines) {
    const trimmed = line.trim()
    const m = trimmed.match(/^([\w-]+):\s*(.+?);?\s*$/)
    if (!m) continue
    const [, prop, val] = m
    props[prop] = val.trim().replace(/;$/, '')
  }
  if (!props['font-size'] || !props['font-weight'] || !props['line-height'] || !props['letter-spacing']) {
    return null
  }
  return {
    name: acc.name,
    fontFamily: props['font-family'] ?? '',
    fontSize: props['font-size'],
    fontWeight: props['font-weight'],
    lineHeight: props['line-height'],
    letterSpacing: props['letter-spacing'],
    ...(props['text-transform'] ? { textTransform: props['text-transform'] } : {}),
  }
}

// ─── Main parser ──────────────────────────────────────────────────────────────

export function parseGeeklegoCss(cssText: string): GeeklegoTokens {
  // ── Initialize output structure ──────────────────────────────────────────────
  const primitives: any = {
    colors: {},
    fontFamily: {},
    fontSize: {},
    fontWeight: {},
    lineHeight: {},
    letterSpacing: {},
    spacing: {},
    radius: {},
    borderWidth: {},
    opacity: {},
    zIndex: {},
    duration: {},
    easing: {},
    iconSize: {},
    colorShadowNeutral: '',
    breakpoints: {},
    contentFlexibility: { lineClamp: {}, maxWidth: {}, minWidth: {} },
  }

  const semLight: any = {
    bg: {},
    surface: {},
    text: {},
    border: {},
    action: {},
    status: {},
    state: {},
    dataSeries: {},
    shadows: {},
    elevationOpacity: {},
    spacingComponent: {},
    spacingLayout: {},
    sizeComponent: {},
    iconSemantic: {},
    sizeFixed: {},
    radiusComponent: {},
    motion: { duration: {}, easing: {} },
    layer: {},
    borders: {},
    colorControlThumb: '',
    colorRing: '',
    contentFlexibility: {},
    colorOverlayBackdrop: '',
    typographySemantics: {},
  }

  const semDark: any = {
    bg: {},
    surface: {},
    text: {},
    border: {},
    action: {},
    status: {},
    state: {},
    dataSeries: {},
    shadows: {},
    elevationOpacity: {},
    spacingComponent: {},
    spacingLayout: {},
    sizeComponent: {},
    iconSemantic: {},
    sizeFixed: {},
    radiusComponent: {},
    motion: { duration: {}, easing: {} },
    layer: {},
    borders: {},
    colorControlThumb: '',
    colorRing: '',
    contentFlexibility: {},
    colorOverlayBackdrop: '',
    typographySemantics: {},
  }

  const typographyClasses: TypographyClass[] = []

  // ── State machine ────────────────────────────────────────────────────────────
  let state: ParseState = 'OUTSIDE'

  // Lines accumulated for current block
  let blockLines: string[] = []

  // Brace depth tracking (relative to block entry)
  let braceDepth = 0

  // For IN_TYPO_CLASS — name of current class
  let currentTypoName = ''
  let typoClassLines: string[] = []

  // For IN_MEDIA_RESPONSIVE — responsive spacing override accumulation
  let currentMediaMaxWidth = ''
  let mediaTokenLines: string[] = []
  const responsiveOverrides: Array<{ maxWidth: string; spacingLayout: Record<string, string> }> = []

  // For detecting :root block that spans two lines (`:root,` then `[data-theme="light"] {`)
  let sawRootComma = false

  const lines = cssText.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // ── Stop at generated component tokens marker ──────────────────────────────
    if (trimmed.includes('GENERATED COMPONENT TOKENS')) {
      state = 'DONE'
      break
    }

    if ((state as string) === 'DONE') break

    // ── Count braces in this line ──────────────────────────────────────────────
    const openCount = (line.match(/\{/g) ?? []).length
    const closeCount = (line.match(/\}/g) ?? []).length

    // ── OUTSIDE: look for block starters ──────────────────────────────────────
    if (state === 'OUTSIDE') {
      // Check for :root (possible two-line form)
      if (trimmed === ':root,' || trimmed === ':root, [data-theme="light"] {' || trimmed.startsWith(':root,')) {
        sawRootComma = true
        if (trimmed.includes('{')) {
          // Single-line form
          state = 'IN_ROOT'
          braceDepth = 1
          sawRootComma = false
          blockLines = []
        }
        continue
      }

      if (sawRootComma) {
        if (trimmed.startsWith('[data-theme="light"]') && trimmed.includes('{')) {
          state = 'IN_ROOT'
          braceDepth = 1
          sawRootComma = false
          blockLines = []
          continue
        }
        // Some other line — reset
        sawRootComma = false
      }

      // @theme {
      if (trimmed === '@theme {' || trimmed.startsWith('@theme {')) {
        state = 'IN_THEME'
        braceDepth = openCount - closeCount
        blockLines = []
        continue
      }

      // [data-theme="dark"] {
      if (trimmed.startsWith('[data-theme="dark"]') && trimmed.includes('{')) {
        state = 'IN_DARK'
        braceDepth = 1
        blockLines = []
        continue
      }

      // @supports { } — skip
      if (trimmed.startsWith('@supports')) {
        state = 'IN_SUPPORTS'
        braceDepth = openCount - closeCount
        if (braceDepth <= 0) state = 'OUTSIDE'
        continue
      }

      // @media — capture max-width blocks for responsive overrides; skip everything else
      if (trimmed.startsWith('@media')) {
        const mwMatch = trimmed.match(/@media\s*\(\s*max-width:\s*([^)]+)\s*\)/)
        if (mwMatch) {
          state = 'IN_MEDIA_RESPONSIVE'
          currentMediaMaxWidth = mwMatch[1].trim()
          mediaTokenLines = []
        } else {
          state = 'IN_MEDIA'
        }
        braceDepth = openCount - closeCount
        if (braceDepth <= 0) state = 'OUTSIDE'
        continue
      }

      // Typography class: .text-{name} { — but NOT -responsive
      const typoMatch = trimmed.match(/^\.(text-[\w-]+)\s*\{/)
      if (typoMatch) {
        const className = typoMatch[1]
        if (!className.endsWith('-responsive')) {
          state = 'IN_TYPO_CLASS'
          currentTypoName = className  // keep full name e.g. "text-display-hero"
          typoClassLines = []
          braceDepth = 1
          // Capture any inline content on the same line after `{`
          const afterBrace = trimmed.slice(trimmed.indexOf('{') + 1).trim()
          if (afterBrace && afterBrace !== '}') typoClassLines.push(afterBrace)
          if (afterBrace === '}' || trimmed.endsWith('}')) {
            // Single-line class — parse immediately
            const cls = parseTypoClass({ name: currentTypoName, lines: typoClassLines })
            if (cls) typographyClasses.push(cls)
            state = 'OUTSIDE'
          }
        }
        continue
      }

      continue
    }

    // ── IN_THEME ──────────────────────────────────────────────────────────────
    if (state === 'IN_THEME') {
      braceDepth += openCount - closeCount
      if (braceDepth <= 0) {
        // End of @theme block — process accumulated lines
        const tokens = collectTokens(blockLines)
        for (const { name, value } of tokens) {
          applyThemeToken(name, value, primitives)
        }
        state = 'OUTSIDE'
        blockLines = []
        continue
      }
      blockLines.push(line)
      continue
    }

    // ── IN_ROOT ───────────────────────────────────────────────────────────────
    if (state === 'IN_ROOT') {
      braceDepth += openCount - closeCount
      if (braceDepth <= 0) {
        const tokens = collectTokens(blockLines)
        for (const { name, value } of tokens) {
          applySemanticToken(name, value, semLight)
        }
        state = 'OUTSIDE'
        blockLines = []
        continue
      }
      blockLines.push(line)
      continue
    }

    // ── IN_DARK ───────────────────────────────────────────────────────────────
    if (state === 'IN_DARK') {
      braceDepth += openCount - closeCount
      if (braceDepth <= 0) {
        const tokens = collectTokens(blockLines)
        for (const { name, value } of tokens) {
          applySemanticToken(name, value, semDark)
        }
        state = 'OUTSIDE'
        blockLines = []
        continue
      }
      blockLines.push(line)
      continue
    }

    // ── IN_SUPPORTS ───────────────────────────────────────────────────────────
    if (state === 'IN_SUPPORTS') {
      braceDepth += openCount - closeCount
      if (braceDepth <= 0) state = 'OUTSIDE'
      continue
    }

    // ── IN_MEDIA ──────────────────────────────────────────────────────────────
    if (state === 'IN_MEDIA') {
      braceDepth += openCount - closeCount
      if (braceDepth <= 0) state = 'OUTSIDE'
      continue
    }

    // ── IN_MEDIA_RESPONSIVE ───────────────────────────────────────────────────
    if (state === 'IN_MEDIA_RESPONSIVE') {
      braceDepth += openCount - closeCount
      if (braceDepth <= 0) {
        // Extract --spacing-layout-* tokens from the accumulated lines
        const entries = collectTokens(mediaTokenLines)
        const spacingLayout: Record<string, string> = {}
        for (const { name, value } of entries) {
          if (name.startsWith('spacing-layout-')) {
            spacingLayout[name.slice('spacing-layout-'.length)] = value
          }
        }
        if (Object.keys(spacingLayout).length > 0) {
          responsiveOverrides.push({ maxWidth: currentMediaMaxWidth, spacingLayout })
        }
        state = 'OUTSIDE'
        mediaTokenLines = []
        currentMediaMaxWidth = ''
      } else {
        mediaTokenLines.push(line)
      }
      continue
    }

    // ── IN_TYPO_CLASS ─────────────────────────────────────────────────────────
    if (state === 'IN_TYPO_CLASS') {
      braceDepth += openCount - closeCount
      if (braceDepth <= 0) {
        // End of class body
        const cls = parseTypoClass({ name: currentTypoName, lines: typoClassLines })
        if (cls) typographyClasses.push(cls)
        state = 'OUTSIDE'
        typoClassLines = []
        currentTypoName = ''
        continue
      }
      typoClassLines.push(line)
      continue
    }
  }

  // ── Trim empty dark semantics groups ─────────────────────────────────────────
  // Only keep groups that actually have values
  const darkCleaned: any = {}
  for (const [key, val] of Object.entries(semDark)) {
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      if (Object.keys(val as object).length > 0) {
        darkCleaned[key] = val
      }
    } else if (typeof val === 'string' && (val as string).length > 0) {
      darkCleaned[key] = val
    } else if (typeof val === 'number') {
      darkCleaned[key] = val
    }
  }

  return {
    primitives: primitives as any,
    semantics: {
      light: semLight as any,
      dark: darkCleaned as any,
    },
    typographyClasses,
    responsiveOverrides,
  } as GeeklegoTokens
}
