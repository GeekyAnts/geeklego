import type {
  FontLoader,
  GeeklegoTokensV2,
  V2Semantics,
} from '../types.ts'

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

function applyThemeToken(
  name: string,
  value: string,
  primitives: GeeklegoTokensV2['primitives'],
): void {
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

  // Font weight: --font-weight-{name}  (MUST precede the bare --font-{id} family match)
  const fontWeightMatch = name.match(/^font-weight-(.+)$/)
  if (fontWeightMatch) {
    primitives.fontWeight[fontWeightMatch[1]] = parseNumeric(value)
    return
  }

  // Font family: Tailwind --font-{sans|mono|display|...} namespace.
  // Anchored to known family keys so it never swallows --font-weight-* (handled above).
  const fontFamilyMatch = name.match(/^font-(sans|mono|display|serif|[a-z]+)$/)
  if (fontFamilyMatch) {
    primitives.fontFamily[fontFamilyMatch[1]] = value
    return
  }

  // Font size: Tailwind --text-{name} namespace
  const fontSizeMatch = name.match(/^text-(.+)$/)
  if (fontSizeMatch) {
    primitives.fontSize[fontSizeMatch[1]] = value
    return
  }

  // Line height: Tailwind --leading-{name} namespace
  const lineHeightMatch = name.match(/^leading-(.+)$/)
  if (lineHeightMatch) {
    primitives.lineHeight[lineHeightMatch[1]] = value
    return
  }

  // Letter spacing: Tailwind --tracking-{name} namespace
  const letterSpacingMatch = name.match(/^tracking-(.+)$/)
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



}

// ═══════════════════════════════════════════════════════════════════════════════
//  v2 — the flat ShadCN/2-tier cockpit parser (TOKEN-EDITOR-V2-REBUILD-PLAN Phase 2)
//
//  Parses the three design-system/v2 files into GeeklegoTokensV2:
//    primitives.css → primitives (reuse the @theme machine + applyThemeToken)
//    semantics.css  → semantics.light (canonical :root) + ext.rawBlock (opaque)
//    themes/dark.css → semantics.dark + ext.darkOverride (opaque)
//
//  ⚠ Two OPPOSITE canonical polarities (the central trap):
//    - primitives.css: @theme is canonical, the :root mirror is IGNORED here.
//    - semantics.css:  :root is canonical, @theme inline is IGNORED (it's regenerated).
//  semantics.css is the SINGLE SOURCE OF TRUTH for core semantics: applyV2SemanticToken
//  absorbs every alias it finds in the core :root (denylist, not allowlist) so a brand-new
//  semantic added to the CSS (e.g. --info) round-trips instead of being silently dropped.
//  It is safe to absorb everything here because the only non-semantic names that could
//  appear are pre-filtered out before this runs (see applyV2SemanticToken).
// ═══════════════════════════════════════════════════════════════════════════════

/** Marker text on the section-3 header comment that begins the --ext-* block in semantics.css. */
const V2_EXT_HEADER_MARKER = 'CUSTOM VARIANTS'

/**
 * Build a fresh, empty primitives accumulator — same shape applyThemeToken expects.
 */
function emptyV2Primitives(): GeeklegoTokensV2['primitives'] {
  return {
    // Color families are added during parse (applyThemeToken seeds each
    // family on first sight via the PrimitiveColors index signature), so the
    // accumulator legitimately starts with none of the required families.
    colors: {} as GeeklegoTokensV2['primitives']['colors'],
    fontFamily: {},
    fontSize: {},
    fontWeight: {},
    lineHeight: {},
    letterSpacing: {},
    spacing: {},
    radius: {},
    borderWidth: {},
    duration: {},
    easing: {},
    colorShadowNeutral: '',
    breakpoints: {},
  }
}

/**
 * Apply a single semantic alias into a flat V2Semantics map.
 *
 * semantics.css's core :root is canonical, so we ABSORB EVERY alias found there — this is
 * what lets a newly-authored core semantic (e.g. --info / --info-foreground) survive the
 * load→save round-trip instead of being dropped by a hardcoded allowlist. A blanket absorb
 * is safe because the core :root only ever contains semantic aliases:
 *   - the --ext-* block is sliced off (splitV2SemanticsExt) BEFORE this runs;
 *   - primitives (--color-*, --spacing-*, …) live in primitives.css, a separate file/arg;
 *   - @theme inline (which holds --color-* registrations) is a separate at-rule never entered.
 * We still defensively skip the only two name shapes that could leak in if the wrong block
 * were ever fed here: --ext-* (opaque variant tokens) and --color-* (@theme inline regs).
 */
function applyV2SemanticToken(name: string, value: string, sem: V2Semantics): void {
  if (name.startsWith('ext-')) return    // belongs to the opaque --ext-* block
  if (name.startsWith('color-')) return  // an @theme inline registration, not a semantic
  sem[name] = value
}

/**
 * Extract the body lines of the FIRST top-level block whose selector matches `predicate`.
 * The selector may span multiple lines before its `{` (e.g. `[data-theme="dark"],\n.dark {`):
 * once `predicate` matches an opening line we wait for the `{` (consuming any intervening
 * selector lines), then collect brace-depth-aware body lines strictly between `{` and its
 * matching `}` (not including either). Returns null if no matching block is found.
 */
function extractBlockBody(
  cssText: string,
  predicate: (openingLine: string) => boolean,
): string[] | null {
  const lines = cssText.split('\n')
  let matchedSelector = false
  let inBody = false
  let depth = 0
  const body: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!matchedSelector) {
      if (predicate(trimmed)) matchedSelector = true
      else continue
    }
    if (!inBody) {
      // Selector matched; wait for the `{` (it may be on this or a later selector line).
      if (!line.includes('{')) continue
      inBody = true
      depth = (line.match(/\{/g) ?? []).length - (line.match(/\}/g) ?? []).length
      if (depth <= 0) return body // single-line empty block
      continue
    }
    const open = (line.match(/\{/g) ?? []).length
    const close = (line.match(/\}/g) ?? []).length
    depth += open - close
    if (depth <= 0) return body // matching close reached
    body.push(line)
  }
  return inBody ? body : null
}

/**
 * Parse primitives.css → primitives. Runs the existing @theme machine via the main
 * parser shape, keeping ONLY the @theme result (the :root mirror is intentionally
 * ignored — @theme is canonical for primitives).
 */
export function parseV2Primitives(css: string): GeeklegoTokensV2['primitives'] {
  const primitives = emptyV2Primitives()
  const themeBody = extractBlockBody(css, (l) => l === '@theme {' || l.startsWith('@theme {'))
  if (themeBody) {
    for (const { name, value } of collectTokens(themeBody)) {
      applyThemeToken(name, value, primitives)
    }
  }
  return primitives
}

/**
 * Split semantics.css into [coreCss, extBlock]. The --ext-* block starts at the
 * section-3 header comment (the `CUSTOM VARIANTS` marker line); everything from that
 * line to EOF is captured verbatim as the opaque ext.rawBlock. If no marker is present,
 * extBlock is '' and the whole file is treated as core.
 */
function splitV2SemanticsExt(css: string): { coreCss: string; extBlock: string } {
  const lines = css.split('\n')
  // Prefer the header comment marker; fall back to the first `--ext-` declaration.
  let extStart = lines.findIndex((l) => l.includes(V2_EXT_HEADER_MARKER))
  if (extStart === -1) {
    extStart = lines.findIndex((l) => l.trim().startsWith('--ext-'))
  }
  if (extStart === -1) return { coreCss: css, extBlock: '' }
  // The marker often sits on the MIDDLE line of a multi-line comment whose `/*` opener is
  // on a preceding line (and is not itself closed before the marker). Rewind to that
  // opener so the captured block carries a well-formed comment — otherwise the generated
  // file would emit a dangling comment body with no `/*`.
  let blockStart = extStart
  for (let i = extStart - 1; i >= 0; i--) {
    const t = lines[i].trim()
    if (t === '') continue // skip blank separator lines, keep looking
    if (t.startsWith('/*') && !t.includes('*/')) {
      blockStart = i // an OPEN (unterminated-on-this-line) comment — the header opener
    }
    break // first non-blank line above: either we found the opener, or it's unrelated
  }
  return {
    coreCss: lines.slice(0, blockStart).join('\n'),
    extBlock: lines.slice(blockStart).join('\n').replace(/\s+$/, '') + '\n',
  }
}

/**
 * Parse semantics.css → { light, extBlock }.
 *  - light: the FIRST `:root {}` (canonical light semantics), allowlisted.
 *  - extBlock: the opaque --ext-* section, captured verbatim.
 * The `@theme inline {}` registration is ignored (it's a derived mirror, regenerated).
 */
export function parseV2Semantics(css: string): { light: V2Semantics; extBlock: string } {
  const { coreCss, extBlock } = splitV2SemanticsExt(css)
  const light: V2Semantics = {}
  // Only the core region's first :root is canonical. (extBlock also has a :root, but it
  // lives past the split boundary, so it's never seen here — and would no-op anyway.)
  const rootBody = extractBlockBody(coreCss, (l) => l === ':root {' || l.startsWith(':root {'))
  if (rootBody) {
    for (const { name, value } of collectTokens(rootBody)) {
      applyV2SemanticToken(name, value, light)
    }
  }
  return { light, extBlock }
}

/**
 * Parse themes/dark.css → { dark, darkOverride }.
 *  - dark: core semantic overrides from the `[data-theme="dark"], .dark {}` block.
 *  - darkOverride: any --ext-* override lines interleaved in that same block, captured
 *    verbatim (each on its own line) for opaque passthrough.
 */
export function parseV2Dark(css: string): { dark: V2Semantics; darkOverride: string } {
  const dark: V2Semantics = {}
  const extLines: string[] = []
  // The dark block opens with `[data-theme="dark"],` then `.dark {` — match either the
  // combined single-line form or the first selector line; brace-tracking handles the rest.
  const body = extractBlockBody(css, (l) => l.startsWith('[data-theme="dark"]'))
  if (body) {
    for (const { name, value } of collectTokens(body)) {
      if (name.startsWith('ext-')) {
        extLines.push(`  --${name}: ${value};`)
      } else {
        applyV2SemanticToken(name, value, dark)
      }
    }
  }
  return { dark, darkOverride: extLines.join('\n') }
}

/**
 * Parse design-system/v2/fonts.css → FontLoader[]. Reads the `@import url("…googleapis.com
 * /css2?family=<Family>:<axes>&display=swap")` lines back into structured loaders (inverse of
 * generateV2Fonts). The family slug's `+` is restored to spaces; the `:axes` segment is
 * optional. A header-only / empty file yields []. Non-Google `@import`s are ignored (the
 * picker only writes Google loaders today).
 */
export function parseV2Fonts(css: string): FontLoader[] {
  const loaders: FontLoader[] = []
  // Match the css2 family query: family=<slug>[:<axes>] up to `&` or the closing quote.
  const re = /@import\s+url\(\s*["']?https:\/\/fonts\.googleapis\.com\/css2\?family=([^"'&)]+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(css)) !== null) {
    const raw = m[1]
    const [familyPart, axesPart] = raw.split(':')
    const family = decodeURIComponent(familyPart).replace(/\+/g, ' ').trim()
    if (!family) continue
    const axes = axesPart ? axesPart.trim() : undefined
    loaders.push(axes ? { family, axes, source: 'google' } : { family, source: 'google' })
  }
  return loaders
}

/**
 * Orchestrator — parse the v2 files into one GeeklegoTokensV2. `fontsCss` is optional so
 * 3-arg callers (export-ir, older tests) still work — they get an empty fontLoaders list.
 */
export function parseGeeklegoV2(
  primCss: string,
  semCss: string,
  darkCss: string,
  fontsCss = '',
): GeeklegoTokensV2 {
  const primitives = parseV2Primitives(primCss)
  const { light, extBlock } = parseV2Semantics(semCss)
  const { dark, darkOverride } = parseV2Dark(darkCss)
  const fontLoaders = parseV2Fonts(fontsCss)
  return {
    primitives,
    semantics: { light, dark },
    ext: { rawBlock: extBlock, darkOverride },
    fontLoaders,
  }
}
