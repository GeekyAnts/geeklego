#!/usr/bin/env node
/**
 * Geeklego IR Exporter (v2 — 2-tier → W3C DTCG JSON)
 *
 * Reads the v2 design system (design-system/v2/{primitives,semantics,themes/dark}.css),
 * parses it via the editor's `parseGeeklegoV2()` (the SAME parser the cockpit uses, so the
 * IR can never drift from the editor's model), and emits a deterministic, versioned
 * W3C DTCG-format JSON Intermediate Representation to dist/ir/tokens.json.
 *
 * The IR is the "IR-as-contract" from MULTI-TARGET-ARCHITECTURE.md: one small, standard,
 * versioned token tree that every downstream target (RN, Flutter, Figma, design.md)
 * consumes. They do not import a shared runtime — they read this file.
 *
 * Usage:
 *   npm run export-ir       →  writes dist/ir/tokens.json
 *
 * ─── DTCG representation choices (documented per the brief) ────────────────────────────
 *
 *  • Standard DTCG shape: nested GROUPS of tokens; each token is an object with `$type`
 *    and `$value`. Group names use DTCG dot-path segments (color.brand.900, spacing.4, …).
 *
 *  • Tier 1 — PRIMITIVES: live under top-level groups (color, fontFamily, fontSize,
 *    fontWeight, lineHeight, letterSpacing, spacing, radius, borderWidth,
 *    duration, easing, size, breakpoint,
 *    shadowColor). Their `$value` is the resolved literal (primitives are
 *    leaves — they don't alias anything).
 *
 *  • Tier 2 — SEMANTICS: live under the `semantic` group. Each semantic aliases a
 *    primitive, so we emit BOTH forms, per the brief ("each token emits both its alias
 *    reference and a resolved value"):
 *      - `$value`        = the DTCG alias reference, e.g. "{color.brand.900}", computed by
 *                          reverse-looking-up the var(--…) target in the primitive tree.
 *      - `$extensions["com.geeklego.resolved"]` = the resolved literal (e.g. "#18181b").
 *    LIGHT is the canonical `$value`; DARK is carried in
 *    `$extensions["com.geeklego.modes"].dark` as { ref, resolved } so a consumer takes the
 *    mode it needs. (Chosen over a duplicate top-level `dark` group: keeps one token = one
 *    object, the DTCG-idiomatic place for mode variants.)
 *
 *  • --ext-* CUSTOM VARIANTS: parsed out of the opaque ext.rawBlock / darkOverride into the
 *    `ext` group (same alias+resolved shape as semantics; dark override carried the same
 *    way). The one non-aliasing ext token (--ext-button-gamified-shadow, a composite shadow
 *    value) is emitted with its literal `$value` and `$type: "shadow"`.
 *
 *  • $type mapping: color | dimension (spacing/radius/size/fontSize/width/
 *    breakpoint/letterSpacing/lineHeight-with-unit) | fontWeight | number (
 *    unitless lineHeight) | duration | cubicBezier (easing) | fontFamily | shadow.
 *
 *  • Versioning (MULTI-TARGET §6.5): a STATIC semver + source id are stamped in `$extensions`
 *    at the document root. This repo has NO git, so we do NOT shell out for a SHA, and we
 *    emit NO timestamp — determinism is a hard requirement (running twice = byte-identical).
 *
 *  • Determinism: every object's keys are emitted in a stable order (root keys in an explicit
 *    order; all token/group keys sorted with a numeric-aware comparator so spacing.2 < spacing.10).
 *    Serialized with 2-space indent + a trailing newline.
 */

import { readFileSync, mkdirSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { parseGeeklegoV2 } from '../app/src/utils/cssParser.ts'
import type { GeeklegoTokensV2, Primitives } from '../app/src/types.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ─── Static version stamp (no git in this repo; no timestamp → determinism) ────────────
const IR_VERSION = '1.0.0'
const IR_SOURCE = 'geeklego-v2'
const EXT_RESOLVED = 'com.geeklego.resolved'
const EXT_MODES = 'com.geeklego.modes'

// ─── File locations ────────────────────────────────────────────────────────────────────
const PRIMITIVES_CSS = resolve(__dirname, '../design-system/v2/primitives.css')
const SEMANTICS_CSS = resolve(__dirname, '../design-system/v2/semantics.css')
const DARK_CSS = resolve(__dirname, '../design-system/v2/themes/dark.css')
const OUT_DIR = resolve(__dirname, '../dist/ir')
const OUT_FILE = resolve(OUT_DIR, 'tokens.json')

// ═══════════════════════════════════════════════════════════════════════════════════════
//  DTCG token typing
// ═══════════════════════════════════════════════════════════════════════════════════════

type DtcgType =
  | 'color' | 'dimension' | 'fontFamily' | 'fontWeight'
  | 'number' | 'duration' | 'cubicBezier' | 'shadow'

interface DtcgToken {
  $type: DtcgType
  $value: string | number
  $extensions?: Record<string, unknown>
}

// A group is a nested map of segment → group | token. Tokens are detected by the `$value` key.
type DtcgNode = DtcgToken | DtcgGroup
interface DtcgGroup {
  [segment: string]: DtcgNode
}

// ═══════════════════════════════════════════════════════════════════════════════════════
//  Primitive → DTCG path index (for alias reverse-lookup + resolution)
// ═══════════════════════════════════════════════════════════════════════════════════════

interface PrimitiveRecord {
  cssVar: string        // e.g. "color-brand-900"  (the var(--…) name, sans leading --)
  dtcgPath: string[]    // e.g. ["color", "brand", "900"]
  value: string         // resolved literal, e.g. "#18181b"
  $type: DtcgType
}

/** Build the flat list of all primitive records, keyed for both tree-build and alias lookup. */
function buildPrimitiveIndex(p: Primitives): {
  records: PrimitiveRecord[]
  byCssVar: Map<string, PrimitiveRecord>
} {
  const records: PrimitiveRecord[] = []

  const push = (cssVar: string, dtcgPath: string[], value: string, $type: DtcgType) => {
    records.push({ cssVar, dtcgPath, value, $type })
  }

  // Colors: --color-{family}-{shade}  →  color.{family}.{shade}
  for (const family of Object.keys(p.colors)) {
    for (const shade of Object.keys(p.colors[family])) {
      push(`color-${family}-${shade}`, ['color', family, shade], p.colors[family][shade], 'color')
    }
  }
  // Single shadow color: --color-shadow-neutral
  if (p.colorShadowNeutral) {
    push('color-shadow-neutral', ['shadowColor', 'neutral'], p.colorShadowNeutral, 'color')
  }

  // Font family: --font-{id}  (Tailwind --font-* namespace)
  for (const id of Object.keys(p.fontFamily)) {
    push(`font-${id}`, ['fontFamily', id], p.fontFamily[id], 'fontFamily')
  }
  // Font size: --text-{n} (dimension)  (Tailwind --text-* namespace)
  for (const n of Object.keys(p.fontSize)) {
    push(`text-${n}`, ['fontSize', n], p.fontSize[n], 'dimension')
  }
  // Font weight: --font-weight-{name} (number → fontWeight)
  for (const name of Object.keys(p.fontWeight)) {
    push(`font-weight-${name}`, ['fontWeight', name], String(p.fontWeight[name]), 'fontWeight')
  }
  // Line height: --leading-{name} (unitless → number, else dimension)  (Tailwind --leading-*)
  for (const name of Object.keys(p.lineHeight)) {
    const v = p.lineHeight[name]
    push(`leading-${name}`, ['lineHeight', name], v, hasUnit(v) ? 'dimension' : 'number')
  }
  // Letter spacing: --tracking-{name} (dimension)  (Tailwind --tracking-* namespace)
  for (const name of Object.keys(p.letterSpacing)) {
    push(`tracking-${name}`, ['letterSpacing', name], p.letterSpacing[name], 'dimension')
  }
  // Spacing: --spacing-{n} and --spacing-raw-{n} (dimension)
  for (const n of Object.keys(p.spacing)) {
    push(`spacing-${n}`, ['spacing', n], p.spacing[n], 'dimension')
  }
  // Radius: --radius-{name} (dimension)
  for (const name of Object.keys(p.radius)) {
    push(`radius-${name}`, ['radius', name], p.radius[name], 'dimension')
  }
  // Border width: --border-width-{name} (dimension)
  for (const name of Object.keys(p.borderWidth)) {
    push(`border-width-${name}`, ['borderWidth', name], p.borderWidth[name], 'dimension')
  }
  // Duration: --duration-{name} (duration)
  for (const name of Object.keys(p.duration)) {
    push(`duration-${name}`, ['duration', name], p.duration[name], 'duration')
  }
  // Easing: --ease-{name} (cubicBezier)
  for (const name of Object.keys(p.easing)) {
    push(`ease-${name}`, ['easing', name], p.easing[name], 'cubicBezier')
  }
  // Breakpoints: --breakpoint-{name} (dimension)
  for (const name of Object.keys(p.breakpoints)) {
    push(`breakpoint-${name}`, ['breakpoint', name], p.breakpoints[name], 'dimension')
  }

  const byCssVar = new Map<string, PrimitiveRecord>()
  for (const r of records) byCssVar.set(r.cssVar, r)
  return { records, byCssVar }
}

function hasUnit(v: string): boolean {
  return /(px|rem|em|%|vh|vw|ch|ex)\s*$/.test(v.trim())
}

// ═══════════════════════════════════════════════════════════════════════════════════════
//  Alias resolution
// ═══════════════════════════════════════════════════════════════════════════════════════

const VAR_RE = /^var\(--([\w-]+)\)$/

/**
 * Resolve a semantic/ext value into { ref, resolved }.
 *  - If the value is exactly `var(--name)`, look the primitive up in the index:
 *      ref = DTCG alias reference "{color.brand.900}", resolved = the literal "#18181b".
 *    Throws if the var() target is not a known primitive (a dangling alias — must never ship).
 *  - If the value is a literal (e.g. a composite shadow, or a calc()), ref is null and the
 *    resolved value is the literal itself.
 */
function resolveValue(
  raw: string,
  index: Map<string, PrimitiveRecord>,
): { ref: string | null; resolved: string; baseType: DtcgType | null } {
  const trimmed = raw.trim()
  const m = trimmed.match(VAR_RE)
  if (m) {
    const rec = index.get(m[1])
    if (!rec) {
      throw new Error(
        `Dangling alias: var(--${m[1]}) does not resolve to a known primitive. ` +
        `Fix the chain in design-system/v2/.`,
      )
    }
    return { ref: `{${rec.dtcgPath.join('.')}}`, resolved: rec.value, baseType: rec.$type }
  }
  return { ref: null, resolved: trimmed, baseType: null }
}

// ═══════════════════════════════════════════════════════════════════════════════════════
//  Tree builders
// ═══════════════════════════════════════════════════════════════════════════════════════

/** Insert a token at a dot-path into a group tree, creating intermediate groups. */
function setAtPath(root: DtcgGroup, path: string[], token: DtcgToken): void {
  let node = root
  for (let i = 0; i < path.length - 1; i++) {
    const seg = path[i]
    if (!(seg in node)) node[seg] = {} as DtcgGroup
    node = node[seg] as DtcgGroup
  }
  node[path[path.length - 1]] = token
}

/** Build the primitives subtree from the index records. */
function buildPrimitivesTree(records: PrimitiveRecord[]): DtcgGroup {
  const root: DtcgGroup = {}
  for (const r of records) {
    setAtPath(root, r.dtcgPath, { $type: r.$type, $value: typeColumnValue(r.$type, r.value) })
  }
  return root
}

/** Coerce a primitive's stored string into the DTCG-correct JS type for numeric kinds. */
function typeColumnValue($type: DtcgType, value: string): string | number {
  if ($type === 'number' || $type === 'fontWeight') {
    const n = Number(value)
    return Number.isFinite(n) ? n : value
  }
  return value
}

/** A semantic key → its DTCG path under the `semantic` group. */
function semanticPath(key: string): string[] {
  // Flat keys (primary-foreground, card, radius, …). Keep them flat under `semantic`
  // so the alias reference {semantic.primary-foreground} is unambiguous and stable.
  return ['semantic', key]
}

/**
 * Build the `semantic` subtree: light is canonical `$value` (alias ref), dark is carried in
 * $extensions modes. Resolved literals go in com.geeklego.resolved.
 */
function buildSemanticTree(
  tokens: GeeklegoTokensV2,
  index: Map<string, PrimitiveRecord>,
): DtcgGroup {
  const root: DtcgGroup = {}
  const { light, dark } = tokens.semantics

  for (const key of Object.keys(light)) {
    const lightR = resolveValue(light[key], index)
    const token: DtcgToken = {
      $type: lightR.baseType ?? 'color',
      $value: lightR.ref ?? lightR.resolved,
      $extensions: { [EXT_RESOLVED]: lightR.resolved },
    }

    if (key in dark) {
      const darkR = resolveValue(dark[key], index)
      token.$extensions![EXT_MODES] = {
        dark: {
          $value: darkR.ref ?? darkR.resolved,
          [EXT_RESOLVED]: darkR.resolved,
        },
      }
    }

    setAtPath(root, semanticPath(key), token)
  }
  return (root.semantic ?? {}) as DtcgGroup
}

// ─── --ext-* parsing (the opaque blob → structured tokens) ─────────────────────────────

interface ExtDecl { name: string; value: string }

/**
 * Pull `--ext-*: value;` declarations out of the FIRST `:root { … }` block of the ext
 * rawBlock (the @theme inline registration mirror is intentionally skipped — same polarity
 * rule as the parser: :root is canonical for ext too).
 */
function parseExtRoot(rawBlock: string): ExtDecl[] {
  const decls: ExtDecl[] = []
  // Find the first :root { … } and read only its body.
  const start = rawBlock.indexOf(':root')
  if (start === -1) return decls
  const braceOpen = rawBlock.indexOf('{', start)
  if (braceOpen === -1) return decls
  // Walk to the matching close brace.
  let depth = 0
  let end = braceOpen
  for (let i = braceOpen; i < rawBlock.length; i++) {
    if (rawBlock[i] === '{') depth++
    else if (rawBlock[i] === '}') {
      depth--
      if (depth === 0) { end = i; break }
    }
  }
  const body = rawBlock.slice(braceOpen + 1, end)
  const re = /--(ext-[\w-]+)\s*:\s*([^;]+);/g
  let m: RegExpExecArray | null
  while ((m = re.exec(body)) !== null) {
    decls.push({ name: m[1], value: m[2].trim() })
  }
  return decls
}

/** Parse the dark-override --ext-* lines (each already `  --ext-…: …;`). */
function parseExtDark(darkOverride: string): Map<string, string> {
  const map = new Map<string, string>()
  const re = /--(ext-[\w-]+)\s*:\s*([^;]+);/g
  let m: RegExpExecArray | null
  while ((m = re.exec(darkOverride)) !== null) {
    map.set(m[1], m[2].trim())
  }
  return map
}

/** Choose a $type for an ext token from its value + name. */
function extType(value: string): DtcgType {
  if (VAR_RE.test(value.trim())) return 'color' // ext aliases are all colors today
  // composite shadow value like "0 2px 0 0 var(--color-accent-700)"
  return 'shadow'
}

/**
 * Build the `ext` subtree. Each ext token: alias→{ref,resolved} when it's a clean var(),
 * otherwise the literal value (shadow). A dark override is carried in modes, same as
 * semantics.
 */
function buildExtTree(
  tokens: GeeklegoTokensV2,
  index: Map<string, PrimitiveRecord>,
): DtcgGroup {
  const root: DtcgGroup = {}
  const lightDecls = parseExtRoot(tokens.ext.rawBlock)
  const darkMap = parseExtDark(tokens.ext.darkOverride)

  for (const { name, value } of lightDecls) {
    const $type = extType(value)
    let token: DtcgToken

    if ($type === 'shadow') {
      // Literal composite value — keep verbatim; not a clean primitive alias.
      token = { $type, $value: value, $extensions: { [EXT_RESOLVED]: value } }
    } else {
      const r = resolveValue(value, index)
      token = {
        $type,
        $value: r.ref ?? r.resolved,
        $extensions: { [EXT_RESOLVED]: r.resolved },
      }
    }

    if (darkMap.has(name)) {
      const dv = darkMap.get(name)!
      if (VAR_RE.test(dv.trim())) {
        const dr = resolveValue(dv, index)
        token.$extensions![EXT_MODES] = { dark: { $value: dr.ref ?? dr.resolved, [EXT_RESOLVED]: dr.resolved } }
      } else {
        token.$extensions![EXT_MODES] = { dark: { $value: dv, [EXT_RESOLVED]: dv } }
      }
    }

    // ext tokens stay flat under `ext` (name already carries the component-variant-property path)
    root[name] = token
  }
  return root
}

// ═══════════════════════════════════════════════════════════════════════════════════════
//  Deterministic serialization
// ═══════════════════════════════════════════════════════════════════════════════════════

/** Numeric-aware key comparator: spacing.2 < spacing.10, brand.50 < brand.900. */
function compareKeys(a: string, b: string): number {
  const an = Number(a)
  const bn = Number(b)
  const aNum = a !== '' && Number.isFinite(an)
  const bNum = b !== '' && Number.isFinite(bn)
  if (aNum && bNum) return an - bn
  if (aNum) return -1
  if (bNum) return 1
  return a < b ? -1 : a > b ? 1 : 0
}

/**
 * Recursively sort all object keys. Inside a TOKEN object, keep DTCG order ($type, $value,
 * $extensions) rather than alphabetical, so the canonical shape reads naturally; everything
 * else (groups, extension maps) is key-sorted with the numeric-aware comparator.
 */
function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortDeep)
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const isToken = '$value' in obj && '$type' in obj
    if (isToken) {
      const out: Record<string, unknown> = {}
      out.$type = obj.$type
      out.$value = obj.$value
      for (const k of Object.keys(obj)) {
        if (k === '$type' || k === '$value') continue
        out[k] = sortDeep(obj[k])
      }
      return out
    }
    const out: Record<string, unknown> = {}
    for (const k of Object.keys(obj).sort(compareKeys)) {
      out[k] = sortDeep(obj[k])
    }
    return out
  }
  return value
}

// ═══════════════════════════════════════════════════════════════════════════════════════
//  Main
// ═══════════════════════════════════════════════════════════════════════════════════════

function buildIr(tokens: GeeklegoTokensV2): Record<string, unknown> {
  const { records, byCssVar } = buildPrimitiveIndex(tokens.primitives)
  const primitivesTree = buildPrimitivesTree(records)
  const semanticTree = buildSemanticTree(tokens, byCssVar)
  const extTree = buildExtTree(tokens, byCssVar)

  // Document root: explicit, stable key order; $extensions carries the version stamp.
  const doc: Record<string, unknown> = {
    $extensions: {
      'com.geeklego.ir': {
        version: IR_VERSION,
        source: IR_SOURCE,
        format: 'w3c-dtcg',
        modes: ['light', 'dark'],
      },
    },
    // Tier 1 primitives are spread at the document root as their own top-level groups.
    ...sortDeep(primitivesTree) as Record<string, unknown>,
    // Tier 2 semantics + ext under their own groups.
    semantic: sortDeep(semanticTree),
    ext: sortDeep(extTree),
  }
  return doc
}

function main(): void {
  const primCss = readFileSync(PRIMITIVES_CSS, 'utf-8')
  const semCss = readFileSync(SEMANTICS_CSS, 'utf-8')
  const darkCss = readFileSync(DARK_CSS, 'utf-8')

  const tokens = parseGeeklegoV2(primCss, semCss, darkCss)
  const doc = buildIr(tokens)

  mkdirSync(OUT_DIR, { recursive: true })
  // 2-space indent + trailing newline. Key order is already deterministic via sortDeep
  // and the explicit root assembly above.
  writeFileSync(OUT_FILE, JSON.stringify(doc, null, 2) + '\n', 'utf-8')

  // Count tokens for the console summary (anything with a $value).
  let tokenCount = 0
  const walk = (v: unknown): void => {
    if (v && typeof v === 'object') {
      const o = v as Record<string, unknown>
      if ('$value' in o && '$type' in o) { tokenCount++; return }
      for (const k of Object.keys(o)) walk(o[k])
    }
  }
  walk(doc)

  console.log('\nGeeklego IR Exporter (v2 — DTCG JSON)')
  console.log('──────────────────────────────────────')
  console.log(`Version        : ${IR_VERSION}  (source: ${IR_SOURCE})`)
  console.log(`Tokens emitted : ${tokenCount}`)
  console.log(`Output         : ${OUT_FILE.replace(resolve(__dirname, '..') + '/', '')}`)
  console.log('✓  IR written.\n')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    main()
  } catch (err) {
    console.error('Error:', err instanceof Error ? err.message : err)
    process.exit(1)
  }
}
