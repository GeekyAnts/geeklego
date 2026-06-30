import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { ChevronUp, ChevronDown, Check, ArrowDown } from 'lucide-react'
import type { TokenGraph } from '../../graph/build'
import type { TokenMetadata, MetadataStagedChanges } from '../../state/metadata.types'
import { useMetadata } from '../../state/metadata'
import { EdButton, EdScrollArea, EdEmptyState, EdColorPicker, EdInput } from '../../editor-ds/primitives'
import { isPinned, togglePin } from '../../state/pinning'
import { subscribeToPendingChanges, getAllStaged, getStagedValue, setDraft, unstage, getStagedNewTokens, stage, DARK_EDIT_PREFIX, themedStagingKey } from '../../state/staging'
import { isLocked, lockSemantic, toggleLock, subscribeToLockChanges } from '../../state/semanticLocks'
import { pushEditToast, pushToast } from '../../state/toasts'
import { usePreviewTheme, setPreviewTheme } from '../../state/previewTheme'
import { withPxAnnotation, suggestBrandSemantics, suggestNeutralSemantics, parseColorRef } from '../../utils/colorUtils'
import type { GeeklegoTokensV2, TokenUsageMap } from '../../types'
import { V2_SEMANTIC_KEYS } from '../../types'
import { UsedBy } from './UsedBy'
import { UsedInComponents } from './UsedInComponents'
import { GoogleFontPicker } from './GoogleFontPicker'
import './Inspector.css'
import './UsedBy.css'
import './GoogleFontPicker.css'

/**
 * A font-FAMILY token (--font-sans/mono/display) — gets the Google Font picker. Matches the
 * three family slots exactly so --font-weight-* (a weight, parsed differently) never qualifies.
 * Returns the slot ('sans'|'mono'|'display') or null.
 */
function fontFamilySlot(tokenName: string): string | null {
  const m = tokenName.match(/^--font-(sans|mono|display)$/)
  return m ? m[1] : null
}

// In v2's 2-tier model, only PRIMITIVES are aliased by other tokens (a primitive →
// a semantic, e.g. --color-brand-900 → --primary). Semantics are the top token layer —
// nothing aliases them (they're consumed by components, shown in "Used in components").
// So the token→token "Used by" graph block is only meaningful for primitives; for
// semantics/ext it would always say "not used by any other tokens" — misleading noise.
const PRIMITIVE_TOKEN_PREFIXES = [
  '--color-', '--spacing-', '--radius-', '--font-', '--text-', '--leading-', '--tracking-',
  '--border-', '--shadow-', '--motion-', '--duration-', '--ease-', '--z-', '--z-index-',
  '--icon-size-', '--size-', '--opacity-', '--breakpoint-',
]
function isPrimitiveToken(tokenName: string): boolean {
  return PRIMITIVE_TOKEN_PREFIXES.some(p => tokenName.startsWith(p))
}

function deriveBreadcrumb(tokenName: string): string {
  if (tokenName.startsWith('--color-')) return 'Foundations / Color'
  if (tokenName.startsWith('--spacing-')) return 'Foundations / Spacing'
  if (tokenName.startsWith('--radius-')) return 'Foundations / Radius'
  if (tokenName.startsWith('--font-')) return 'Foundations / Fonts'
  if (tokenName.startsWith('--typography-')) return 'Semantic / Typography'
  if (tokenName.startsWith('--border-')) return 'Foundations / Borders'
  if (tokenName.startsWith('--opacity-')) return 'Foundations / Opacity'
  if (tokenName.startsWith('--z-')) return 'Foundations / Z-Index'
  if (tokenName.startsWith('--motion-')) return 'Foundations / Motion'
  if (tokenName.startsWith('--shadow-')) return 'Foundations / Shadows'
  return 'Tokens'
}

const SEMANTIC_PREFIXES = ['bg', 'text', 'border', 'action', 'status', 'state', 'data-series', 'surface', 'hue', 'alpha']

function isFoundationColorToken(tokenName: string): boolean {
  if (!tokenName.startsWith('--color-')) return false
  const rest = tokenName.slice('--color-'.length)
  return !SEMANTIC_PREFIXES.some(p => rest.startsWith(p + '-') || rest === p)
}

/** Extract the colour family name from a foundation token, e.g. "brand" from "--color-brand-50" */
// Mirrors PRIMITIVE_PREFIX in EditorShell.tsx and ContextPane.tsx —
// maps the JS primitive-object key to the CSS variable prefix.
const PRIMITIVE_PREFIX: Record<string, string> = {
  colors: 'color',
  fontFamily: 'font',
  fontSize: 'text',
  fontWeight: 'font-weight',
  lineHeight: 'leading',
  letterSpacing: 'tracking',
  spacing: 'spacing',
  radius: 'radius',
  borderWidth: 'border-width',
  opacity: 'opacity',
  zIndex: 'z-index',
  duration: 'duration',
  easing: 'ease',
  sizeScale: 'size',
  iconSize: 'icon-size',
  breakpoints: 'breakpoint',
}

function resolveTokenValue(
  tokenName: string,
  tokens: GeeklegoTokensV2,
  theme: 'light' | 'dark' = 'light',
): string | null {
  // Dark resolution: a dark edit is staged under `dark:--<key>` and lives in
  // semantics.dark. Primitives are SHARED (no dark tier), so for a primitive token
  // we fall through to the shared lookup below regardless of theme.
  if (theme === 'dark') {
    const semanticKey = tokenName.replace(/^--/, '')
    const stagedDark = getStagedValue(`${DARK_EDIT_PREFIX}${tokenName}`)
    if (stagedDark !== undefined) return stagedDark
    const darkVal = tokens.semantics.dark[semanticKey]
    if (typeof darkVal === 'string') return darkVal
    // Not overridden in dark → semantic inherits its light value at runtime.
    // Fall through to the shared/light lookup so the editor shows the effective value.
  } else {
    const staged = getStagedValue(tokenName)
    if (staged !== undefined) return staged
  }

  const prims = tokens.primitives as unknown as Record<string, unknown>
  for (const category of Object.keys(prims)) {
    const prefix = PRIMITIVE_PREFIX[category]
    if (!prefix) continue
    const vals = prims[category]
    if (!vals || typeof vals !== 'object') continue
    for (const [k, v] of Object.entries(vals as Record<string, unknown>)) {
      if (typeof v === 'string') {
        if (`--${prefix}-${k}` === tokenName) return v
      } else if (v && typeof v === 'object') {
        for (const [k2, v2] of Object.entries(v as Record<string, unknown>)) {
          if (typeof v2 === 'string' && `--${prefix}-${k}-${k2}` === tokenName) {
            return v2
          }
        }
      }
    }
  }

  // Flat v2 semantics — CSS var for a key is `--<key>`
  const semanticKey = tokenName.replace(/^--/, '')
  const semanticVal = tokens.semantics.light[semanticKey]
  if (typeof semanticVal === 'string') return semanticVal

  // Fall back to tokens added via stageNewToken() (stored separately from getStagedValue)
  const stagedNew = getStagedNewTokens().get(tokenName)
  if (stagedNew) return stagedNew.value

  return null
}

function walkAliasChain(
  tokenName: string,
  graph: TokenGraph | null,
  tokens: GeeklegoTokensV2
): { name: string; value: string | null }[] {
  if (!graph) return [{ name: tokenName, value: resolveTokenValue(tokenName, tokens) }]

  const chain: { name: string; value: string | null }[] = []
  let current = tokenName
  const visited = new Set<string>()

  while (current && !visited.has(current)) {
    visited.add(current)
    const value = resolveTokenValue(current, tokens)
    chain.push({ name: current, value })
    
    const node = graph.nodes.get(current)
    if (node && node.dependsOn.length > 0) {
      current = node.dependsOn[0]
    } else {
      break
    }
  }

  return chain
}

// ─── Token alias picker ────────────────────────────────────────────────────────

/** Detect the broad "family" of a CSS var name so we can filter candidates */
function getTokenFamily(tokenName: string): string {
  if (tokenName.startsWith('--color-')) return 'color'
  if (tokenName.startsWith('--spacing-')) return 'spacing'
  if (tokenName.startsWith('--radius-')) return 'radius'
  if (tokenName.startsWith('--text-')) return 'font-size'
  if (tokenName.startsWith('--font-weight-')) return 'font-weight'
  if (tokenName.startsWith('--font-')) return 'font-family'
  if (tokenName.startsWith('--leading-')) return 'line-height'
  if (tokenName.startsWith('--tracking-')) return 'letter-spacing'
  if (tokenName.startsWith('--border-width-')) return 'border-width'
  if (tokenName.startsWith('--opacity-')) return 'opacity'
  if (tokenName.startsWith('--size-')) return 'size'
  if (tokenName.startsWith('--icon-size-')) return 'icon-size'
  if (tokenName.startsWith('--duration-')) return 'duration'
  if (tokenName.startsWith('--ease-')) return 'ease'
  if (tokenName.startsWith('--shadow-')) return 'shadow'
  return ''
}

/**
 * For a semantic token (already in the semantic tier), return the colour-family
 * of its current alias so we can scope the primitive pool.
 * e.g. "--color-action-primary" aliases "--color-brand-*" → return "brand"
 * Returns null when the alias isn't a primitive colour token.
 */
function getAliasedColorFamily(currentAlias: string | null): string | null {
  if (!currentAlias) return null
  // primitive colours follow --color-{family}-{shade}
  const m = currentAlias.match(/^--color-([a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*?)-\d+$/)
  return m ? m[1] : null
}

function flattenPrimitiveTokens(tokens: GeeklegoTokensV2): { name: string; value: string }[] {
  const result: { name: string; value: string }[] = []
  const prims = tokens.primitives as unknown as Record<string, unknown>
  for (const category of Object.keys(prims)) {
    const prefix = PRIMITIVE_PREFIX[category]
    if (!prefix) continue
    const vals = prims[category]
    if (!vals || typeof vals !== 'object') continue
    for (const [k, v] of Object.entries(vals as Record<string, unknown>)) {
      if (typeof v === 'string') {
        const name = `--${prefix}-${k}`
        result.push({ name, value: getStagedValue(name) ?? v })
      } else if (typeof v === 'number') {
        const name = `--${prefix}-${k}`
        result.push({ name, value: getStagedValue(name) ?? String(v) })
      } else if (v && typeof v === 'object') {
        for (const [k2, v2] of Object.entries(v as Record<string, unknown>)) {
          if (typeof v2 === 'string') {
            const name = `--${prefix}-${k}-${k2}`
            result.push({ name, value: getStagedValue(name) ?? v2 })
          } else if (typeof v2 === 'number') {
            const name = `--${prefix}-${k}-${k2}`
            result.push({ name, value: getStagedValue(name) ?? String(v2) })
          }
        }
      }
    }
  }
  // Include tokens added via stageNewToken()
  for (const [, newToken] of getStagedNewTokens()) {
    const { kind } = newToken.treePath
    if (kind === 'primitiveColor' || kind === 'primitiveFlat') {
      result.push({ name: newToken.cssName, value: newToken.value })
    }
  }
  // Include brand-new primitive color tokens staged via stage() (e.g. new palettes from NewPaletteDialog)
  const existingNames = new Set(result.map(t => t.name))
  for (const [name, value] of getAllStaged()) {
    if (!existingNames.has(name) && /^--color-[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*-\d+$/.test(name)) {
      result.push({ name, value })
    }
  }
  return result
}

function flattenSemanticTokens(tokens: GeeklegoTokensV2): { name: string; value: string }[] {
  const result: { name: string; value: string }[] = []
  // Flat v2 semantics — CSS var for a key is `--<key>`
  for (const [k, v] of Object.entries(tokens.semantics.light)) {
    const name = `--${k}`
    result.push({ name, value: getStagedValue(name) ?? v })
  }
  // Include newly staged semantic tokens
  for (const [, newToken] of getStagedNewTokens()) {
    if (newToken.treePath.kind === 'semanticFlat') {
      result.push({ name: newToken.cssName, value: newToken.value })
    }
  }
  return result
}

function resolveDisplayColor(
  value: string,
  tokenMap: Map<string, string>,
  depth = 0
): string {
  if (depth > 5) return value
  if (value.startsWith('var(')) {
    const m = value.match(/var\((--[\w-]+)\)/)
    if (m) {
      const varName = m[1]
      // Staged edit takes priority (already reflects user changes)
      const staged = getStagedValue(varName)
      if (staged) return resolveDisplayColor(staged, tokenMap, depth + 1)
      // Then our in-memory token data (uses light-mode values, unaffected by data-theme="dark" on <html>)
      const inMemory = tokenMap.get(varName)
      if (inMemory) return resolveDisplayColor(inMemory, tokenMap, depth + 1)
    }
  }
  return value
}

interface TokenAliasPickerProps {
  currentValue: string           // e.g. "var(--color-neutral-0)"
  tokenName: string              // the token being edited
  tokens: GeeklegoTokensV2
  onChange: (newValue: string) => void
}

function TokenAliasPicker({ currentValue, tokenName, tokens, onChange }: TokenAliasPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [stagedVersion, setStagedVersion] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Re-flatten whenever staged changes are committed so the dropdown reflects new values
  useEffect(() => subscribeToPendingChanges(() => setStagedVersion(v => v + 1)), [])

  // The var name currently aliased, e.g. "--color-neutral-0"
  const currentAlias = currentValue.match(/^var\((--[\w-]+)\)$/)?.[1] ?? null

  // Broad family — used to detect color vs non-color for swatch rendering and
  // to scope primitive candidates for semantic (non-component) tokens.
  const family = getTokenFamily(currentAlias ?? tokenName)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allPrimitives = useMemo(() => flattenPrimitiveTokens(tokens), [tokens, stagedVersion])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allSemantics = useMemo(() => flattenSemanticTokens(tokens), [tokens, stagedVersion])

  // Flat name→value lookup used by resolveDisplayColor — avoids getComputedStyle
  // which reads dark-theme overrides from the editor's <html data-theme="dark">
  const tokenMap = useMemo(() => {
    const m = new Map<string, string>()
    for (const t of allPrimitives) m.set(t.name, t.value)
    for (const t of allSemantics) m.set(t.name, t.value)
    return m
  }, [allPrimitives, allSemantics])

  // ── Candidate pool (before search filter) ───────────────────────────────────
  // Rules:
  //  • Semantic token   → primitives in same family; if colour, same palette family
  //  • Unknown token    → all primitives
  // When the user is actively typing a search query we always search the full
  // pool so they can escape the scope and find any token they want.
  const scopedPool = useMemo(() => {
    // Semantic → primitives
    if (family === 'color') {
      // Scope to the same palette family as the current alias.
      // e.g. "--color-action-primary" currently aliases "--color-brand-500"
      // → show brand palette by default. Falls back to all color primitives.
      const aliasedFamily = getAliasedColorFamily(currentAlias)
      if (aliasedFamily) {
        return allPrimitives.filter(t => t.name.startsWith(`--color-${aliasedFamily}-`))
      }
      return allPrimitives.filter(t => getTokenFamily(t.name) === 'color')
    }
    if (family) {
      return allPrimitives.filter(t => getTokenFamily(t.name) === family)
    }
    return allPrimitives
  }, [allPrimitives, family, currentAlias])

  // Full pool for search escape-hatch
  const fullPool = useMemo(
    () => allPrimitives,
    [allPrimitives]
  )

  const candidates = useMemo(() => {
    if (!search.trim()) return scopedPool
    // Non-empty search: search across the full pool so users can escape the scope
    const q = search.toLowerCase()
    return fullPool.filter(t => t.name.includes(q) || t.value.toLowerCase().includes(q))
  }, [scopedPool, fullPool, search])

  const isColor = family === 'color'

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Focus search when opened
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 30)
  }, [open])

  const handleSelect = (token: { name: string; value: string }) => {
    onChange(`var(${token.name})`)
    setOpen(false)
    setSearch('')
  }

  return (
    <div className="ed-alias-picker" ref={containerRef}>
      {/* Trigger button — shows current alias */}
      <button
        type="button"
        className="ed-alias-picker__trigger"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="ed-alias-picker__trigger-left">
          {isColor && currentAlias && (
            <span
              className="ed-alias-picker__swatch"
              style={{ background: resolveDisplayColor(currentValue, tokenMap) }}
            />
          )}
          <span className="ed-alias-picker__trigger-value">{currentAlias ?? currentValue}</span>
        </span>
        <span className="ed-alias-picker__trigger-icon" aria-hidden="true">
          {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </span>
      </button>

      {open && (
        <div className="ed-alias-picker__dropdown" role="listbox">
          {/* Search */}
          <div className="ed-alias-picker__search-wrap">
            <input
              ref={searchRef}
              className="ed-alias-picker__search"
              placeholder={
                search.trim()
                  ? `${candidates.length} of ${fullPool.length} tokens`
                  : scopedPool.length < fullPool.length
                    ? `${scopedPool.length} relevant tokens — type to search all`
                    : `Search ${scopedPool.length} tokens…`
              }
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search tokens"
            />
          </div>

          {/* Token list */}
          <div className="ed-alias-picker__list">
            {candidates.length === 0 && (
              <div className="ed-alias-picker__empty">No matching tokens</div>
            )}
            {candidates.map(token => {
              const isSelected = currentAlias === token.name
              const displayVal = isColor ? resolveDisplayColor(token.value, tokenMap) : withPxAnnotation(token.value)
              return (
                <button
                  key={token.name}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`ed-alias-picker__option${isSelected ? ' ed-alias-picker__option--selected' : ''}`}
                  onClick={() => handleSelect(token)}
                >
                  <span className="ed-alias-picker__option-left">
                    {isColor && (
                      <span
                        className="ed-alias-picker__swatch"
                        style={{ background: displayVal }}
                      />
                    )}
                    <span className="ed-alias-picker__option-name">{token.name}</span>
                  </span>
                  <span className="ed-alias-picker__option-value">
                    {isColor ? token.value : displayVal}
                  </span>
                  {isSelected && <span className="ed-alias-picker__check" aria-hidden="true"><Check size={11} /></span>}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

interface InspectorTokenDescriptionProps {
  tokenName: string
  tokenMetadata?: TokenMetadata
  stagedChanges: MetadataStagedChanges
  onDescriptionChange: (tokenName: string, description: string) => void
  onDescriptionClear: (tokenName: string) => void
}

function InspectorTokenDescription({
  tokenName,
  tokenMetadata,
  stagedChanges,
  onDescriptionChange,
  onDescriptionClear: _onDescriptionClear,
}: InspectorTokenDescriptionProps) {
  const description = tokenMetadata?.description ?? ''
  const [isOpen, setIsOpen] = useState(false)
  const [tempValue, setTempValue] = useState(description)

  const effectiveDescription = (stagedChanges[tokenName]?.description ?? description) || ''

  const handleSave = () => {
    if (tempValue.trim() !== description) {
      onDescriptionChange(tokenName, tempValue.trim())
    }
    setIsOpen(false)
  }

  const handleCancel = () => {
    setTempValue(effectiveDescription)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <div className="ed-inspector__description-preview">
        {effectiveDescription ? (
          <p className="ed-inspector__description-text">{effectiveDescription}</p>
        ) : (
          <div className="ed-inspector__edit-desc-btn" onClick={() => setIsOpen(true)}>
            <span className="ed-inspector__edit-desc-text">Add description</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="ed-inspector__description-editor">
      <EdInput
        value={tempValue}
        onChange={e => setTempValue(e.target.value)}
        placeholder="Describe this token's purpose and usage..."
        className="ed-inspector__description-input"
        autoFocus
      />
      <div className="ed-inspector__description-actions">
        <EdButton variant="primary" size="sm" onClick={handleSave}>
          Save
        </EdButton>
        <EdButton variant="secondary" size="sm" onClick={handleCancel}>
          Cancel
        </EdButton>
      </div>
    </div>
  )
}

export function PinButton({ tokenName }: { tokenName: string }) {
  const pinned = isPinned(tokenName)
  return (
    <button
      type="button"
      onClick={() => togglePin(tokenName)}
      aria-label={pinned ? 'Unpin from sidebar' : 'Pin to sidebar'}
      title={pinned ? 'Unpin from sidebar' : 'Pin to sidebar'}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 6px',
        borderRadius: '4px',
        color: pinned ? 'var(--ed-accent)' : 'var(--ed-text-muted)',
        fontSize: '13px',
        lineHeight: 1,
        transition: 'color 0.15s ease',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {pinned ? '⦿' : '○'}
    </button>
  )
}

// ─── Typography Style Inspector ───────────────────────────────────────────────

const TYPO_PROPS = [
  { key: 'size',     label: 'Size',        prop: 'font-size' },
  { key: 'weight',   label: 'Weight',      prop: 'font-weight' },
  { key: 'leading',  label: 'Line Height', prop: 'line-height' },
  { key: 'tracking', label: 'Tracking',    prop: 'letter-spacing' },
] as const

/** Extract typography style name from any --typography-{style}-{prop} token */
function extractTypoStyle(tokenName: string): string | null {
  const m = tokenName.match(/^--typography-(.+)-(size|weight|leading|tracking)$/)
  return m ? m[1] : null
}

interface TypoPropertyRowProps {
  tokenName: string
  label: string
  prop: string
  tokens: GeeklegoTokensV2
  onStageEdit: (name: string, value: string) => void
}

function TypoPropertyRow({ tokenName, label, prop, tokens, onStageEdit }: TypoPropertyRowProps) {
  const [localDraft, setLocalDraft] = useState<string | null>(null)
  const [, forceUpdate] = useState(0)

  useEffect(() => subscribeToPendingChanges(() => forceUpdate(n => n + 1)), [])
  useEffect(() => {
    setLocalDraft(null)
    setDraft(tokenName, null)
  }, [tokenName])

  const stagedValue = getStagedValue(tokenName)
  const resolvedValue = resolveTokenValue(tokenName, tokens)
  const committed = stagedValue ?? resolvedValue ?? ''
  const display = localDraft ?? committed
  const isDirty = localDraft !== null && localDraft !== committed
  const isStaged = stagedValue !== undefined

  const remHint = (() => {
    const m = display.trim().match(/^([\d.]+)rem$/)
    return m ? `= ${Math.round(parseFloat(m[1]) * 16)}px` : undefined
  })()

  const updateDraft = (v: string | null) => {
    setLocalDraft(v)
    setDraft(tokenName, v)
  }

  const handleSave = () => {
    if (localDraft !== null) { onStageEdit(tokenName, localDraft); updateDraft(null) }
  }
  const handleCancel = () => updateDraft(null)
  const handleUndo = () => { unstage(tokenName); updateDraft(null) }

  return (
    <div className="ed-typo-prop-row">
      <div className="ed-typo-prop-row__header">
        <span className="ed-typo-prop-row__label">{label}</span>
        <span className="ed-typo-prop-row__css-prop">{prop}</span>
        {isStaged && !isDirty && (
          <span className="ed-typo-prop-row__staged-dot" title="Staged" />
        )}
      </div>
      <div className="ed-typo-prop-row__token-name">{tokenName}</div>
      <div className="ed-typo-prop-row__editor">
        {display.trim().startsWith('var(') ? (
          <TokenAliasPicker
            currentValue={display}
            tokenName={tokenName}
            tokens={tokens}
            onChange={v => updateDraft(v)}
          />
        ) : (
          <div className="ed-inspector__value-input-wrap">
            <input
              value={display}
              onChange={e => updateDraft(e.target.value)}
              className={`ed-input ed-inspector__value-input${remHint ? ' ed-inspector__value-input--has-badge' : ''}`}
              spellCheck={false}
            />
            {remHint && <span className="ed-inspector__px-badge">{remHint}</span>}
          </div>
        )}
      </div>
      {isDirty && (
        <div className="ed-typo-prop-row__actions">
          <EdButton variant="primary" size="sm" onClick={handleSave}>Save</EdButton>
          <EdButton variant="secondary" size="sm" onClick={handleCancel}>Cancel</EdButton>
        </div>
      )}
      {isStaged && !isDirty && (
        <div className="ed-typo-prop-row__actions">
          <EdButton variant="secondary" size="sm" onClick={handleUndo}>Undo</EdButton>
        </div>
      )}
    </div>
  )
}

interface TypographyStyleInspectorProps {
  styleName: string
  tokens: GeeklegoTokensV2
  onStageEdit: (name: string, value: string) => void
}

function TypographyStyleInspector({ styleName, tokens, onStageEdit }: TypographyStyleInspectorProps) {
  return (
    <EdScrollArea className="ed-inspector">
      <div className="ed-inspector__body">
        <div className="ed-inspector__editor-header">
          <h1 className="ed-inspector__editor-title">Editor</h1>
          <p className="ed-inspector__editor-subtitle">Edit your tokens</p>
        </div>

        <div className="ed-inspector__header">
          <h2 className="ed-inspector__name">.text-{styleName}</h2>
          <span className="ed-inspector__breadcrumb">Semantic / Typography</span>
        </div>

        <div className="ed-inspector__section">
          <h3 className="ed-inspector__section-title">Semantic Tokens</h3>
          <div className="ed-typo-props">
            {TYPO_PROPS.map(({ key, label, prop }) => (
              <TypoPropertyRow
                key={key}
                tokenName={`--typography-${styleName}-${key}`}
                label={label}
                prop={prop}
                tokens={tokens}
                onStageEdit={onStageEdit}
              />
            ))}
          </div>
        </div>
      </div>
    </EdScrollArea>
  )
}

// ─── Brand-aware auto-pick (Suggest from brand) ─────────────────────────────────

/** Core semantic keys (no leading `--`). Used to auto-lock on manual edit. */
const CORE_SEMANTIC_KEYS = new Set<string>(V2_SEMANTIC_KEYS)

/** The brand-driven semantics the auto-pick engine sets (vivid step + contrast fg). */
const BRAND_DRIVEN_KEYS = new Set(['primary', 'primary-foreground', 'ring'])

/** Neutral-structure roles (surface + foreground) the engine sets to quiet neutrals. */
const NEUTRAL_ROLES = ['accent', 'secondary', 'muted'] as const
/** Map any neutral key (surface or its -foreground) → its role. */
function neutralRoleOf(key: string): (typeof NEUTRAL_ROLES)[number] | null {
  for (const role of NEUTRAL_ROLES) {
    if (key === role || key === `${role}-foreground`) return role
  }
  return null
}

/** "--primary" → "primary"; passes through bare keys. */
function semanticKeyOf(tokenName: string): string {
  return tokenName.replace(/^--/, '')
}

/** "var(--color-neutral-100)" → "neutral-100" for compact toast detail. */
function shortAlias(v: string): string {
  return v.replace(/^var\(--color-|^var\(--|\)$/g, '')
}

/**
 * Build the brand/neutral color map for suggestBrandSemantics, overlaying any
 * staged primitive-color edits (e.g. `--color-brand-600`) onto the model so the
 * suggestion reflects the user's in-flight ramp change, not just disk state.
 */
function resolvedColorsWithStaged(
  tokens: GeeklegoTokensV2,
  staged: Map<string, string>,
): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = {}
  for (const [family, scale] of Object.entries(tokens.primitives.colors)) {
    out[family] = { ...scale }
  }
  for (const [name, value] of staged) {
    const m = name.match(/^--color-([a-z0-9]+)-([a-z0-9]+)$/i)
    if (!m) continue
    const [, family, shade] = m
    ;(out[family] ??= {})[shade] = value
  }
  return out
}

interface InspectorProps {
  selectedTokenName: string | null
  tokens: GeeklegoTokensV2
  graph: TokenGraph | null
  usage: TokenUsageMap
  onRescanUsage: () => void
  onStageEdit: (tokenName: string, newValue: string) => void
  onClose?: () => void
}

export function Inspector({
  selectedTokenName,
  tokens,
  graph,
  usage,
  onRescanUsage,
  onStageEdit,
  onClose: _onClose,
}: InspectorProps) {
  const { metadata, stagedChanges: metadataStagedChanges, setMetadataDescription, clearDescription } = useMetadata()
  const [, forceUpdate] = useState(0)
  // Per-theme drafts: light edit vs dark edit are independent in-flight values.
  const [draftValue, setDraftValue] = useState<string | null>(null)
  const [darkDraftValue, setDarkDraftValue] = useState<string | null>(null)
  // Which theme the Value section is currently editing (the Light|Dark tab).
  // Shared with the docked preview band via the previewTheme store, so switching
  // to the Dark tab auto-flips the live component preview to dark (and back).
  const editTheme = usePreviewTheme()
  const setEditTheme = setPreviewTheme

  useEffect(() => {
    const unsubPending = subscribeToPendingChanges(() => forceUpdate(n => n + 1))
    const unsubLocks = subscribeToLockChanges(() => forceUpdate(n => n + 1))
    return () => { unsubPending(); unsubLocks() }
  }, [])

  // Reset both drafts whenever the selected token changes. The active theme is
  // intentionally NOT reset here — it's shared with the preview band, so forcing
  // it back to light on every selection would fight the user's band toggle.
  useEffect(() => {
    setDraftValue(null)
    setDarkDraftValue(null)
  }, [selectedTokenName])

  // Per-theme draft accessors so the handlers below stay theme-agnostic.
  const activeDraft = editTheme === 'dark' ? darkDraftValue : draftValue
  const setActiveDraft = editTheme === 'dark' ? setDarkDraftValue : setDraftValue
  // The staging key for the active theme: light = `--primary`, dark = `dark:--primary`.
  const activeStagingKey = selectedTokenName !== null
    ? themedStagingKey(selectedTokenName, editTheme)
    : null
  // The lock key for the active theme (per-theme locks): `primary` vs `dark:primary`.
  const activeLockKey = (key: string) => editTheme === 'dark' ? `${DARK_EDIT_PREFIX}${key}` : key

  // All useCallbacks must be unconditional — before any early return
  const handleSave = useCallback(() => {
    if (activeDraft !== null && activeStagingKey !== null && selectedTokenName !== null) {
      const prev = getStagedValue(activeStagingKey)
      stage(activeStagingKey, activeDraft)
      // Auto-lock on manual edit (per-theme): the saved theme's value is pinned so
      // the auto-pick engine won't overwrite it. User can unlock later.
      const key = selectedTokenName.replace(/^--/, '')
      if (CORE_SEMANTIC_KEYS.has(key)) lockSemantic(activeLockKey(key))
      pushEditToast({
        stagingKey: activeStagingKey,
        label: `${selectedTokenName}${editTheme === 'dark' ? ' (dark)' : ''}`,
        prevValue: prev,
        newValue: activeDraft,
        verb: 'Updated',
      })
      setActiveDraft(null)
    }
  }, [activeDraft, activeStagingKey, selectedTokenName, editTheme]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCancel = useCallback(() => {
    setActiveDraft(null)
  }, [editTheme]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleUndo = useCallback(() => {
    if (activeStagingKey !== null) {
      unstage(activeStagingKey)
      setActiveDraft(null)
    }
  }, [activeStagingKey, editTheme]) // eslint-disable-line react-hooks/exhaustive-deps

  // Apply the brand suggestion into the ACTIVE theme: stage primary/primary-foreground/
  // ring under the theme-scoped key, skipping any per-theme-locked key (suggest-only).
  // Apply the brand suggestion for the SELECTED token only — writes a single key
  // (primary, primary-foreground, or ring) under the active theme, honoring its lock.
  const handleApplyBrandSuggestion = useCallback(
    (key: string, value: string) => {
      if (isLocked(activeLockKey(key))) return
      const sk = themedStagingKey(`--${key}`, editTheme)
      const prev = getStagedValue(sk)
      stage(sk, value)
      pushEditToast({
        stagingKey: sk,
        label: `--${key}${editTheme === 'dark' ? ' (dark)' : ''}`,
        prevValue: prev,
        newValue: value,
        verb: 'Applied suggestion to',
      })
    },
    [editTheme], // eslint-disable-line react-hooks/exhaustive-deps
  )

  // Apply a neutral-role suggestion into the ACTIVE theme. Stages the pair and
  // fires a single toast whose Undo reverts BOTH the surface and the foreground.
  const handleApplyNeutralSuggestion = useCallback(
    (role: string, s: { surface: string; foreground: string }) => {
      const skSurface = themedStagingKey(`--${role}`, editTheme)
      const skFg = themedStagingKey(`--${role}-foreground`, editTheme)
      const surfaceLocked = isLocked(activeLockKey(role))
      const fgLocked = isLocked(activeLockKey(`${role}-foreground`))
      const prevSurface = getStagedValue(skSurface)
      const prevFg = getStagedValue(skFg)
      if (!surfaceLocked) stage(skSurface, s.surface)
      if (!fgLocked) stage(skFg, s.foreground)
      const themeTag = editTheme === 'dark' ? ' (dark)' : ''
      pushToast({
        message: `Applied suggestion to ${role} + ${role}-foreground${themeTag}`,
        detail: `${shortAlias(s.surface)} · ${shortAlias(s.foreground)}`,
        undo: () => {
          if (!surfaceLocked) {
            if (prevSurface === undefined) unstage(skSurface)
            else stage(skSurface, prevSurface)
          }
          if (!fgLocked) {
            if (prevFg === undefined) unstage(skFg)
            else stage(skFg, prevFg)
          }
        },
      })
    },
    [editTheme], // eslint-disable-line react-hooks/exhaustive-deps
  )

  if (selectedTokenName === null) {
    return (
      <div className="ed-inspector ed-inspector--empty">
        <div className="ed-inspector__empty-state">
          <EdEmptyState
            title="Select a token to inspect"
            description="Click on any token in the editor to view its details, edit its value, and see where it's used."
          />
        </div>
      </div>
    )
  }

  // Typography semantic tokens → dedicated multi-property inspector
  const typoStyle = extractTypoStyle(selectedTokenName)
  if (typoStyle) {
    return (
      <TypographyStyleInspector
        styleName={typoStyle}
        tokens={tokens}
        onStageEdit={onStageEdit}
      />
    )
  }

  const tokenMetadata = metadata.tokens[selectedTokenName]
  const breadcrumb = deriveBreadcrumb(selectedTokenName)
  const staged = getAllStaged()

  // A semantic token can be edited per-theme via the Light|Dark tab. Primitives and
  // non-semantic tokens have no dark tier, so they ignore editTheme (always light).
  const isSemanticToken = CORE_SEMANTIC_KEYS.has(semanticKeyOf(selectedTokenName))
  const effectiveTheme: 'light' | 'dark' = isSemanticToken ? editTheme : 'light'

  // Active-theme staged value + resolved value (theme-aware).
  const stagedValue = effectiveTheme === 'dark'
    ? getStagedValue(`${DARK_EDIT_PREFIX}${selectedTokenName}`)
    : getStagedValue(selectedTokenName)
  const resolvedValue = resolveTokenValue(selectedTokenName, tokens, effectiveTheme)

  const aliasChain = walkAliasChain(selectedTokenName, graph, tokens)

  // What's currently persisted (staged or original) for the active theme
  const committedValue = stagedValue ?? resolvedValue ?? ''
  // What's shown in the editor (active-theme draft takes priority)
  const displayValue = activeDraft ?? committedValue

  const isDirty = activeDraft !== null && activeDraft !== committedValue
  const isStaged = stagedValue !== undefined

  // ── Auto-pick: brand-driven (vivid) OR neutral-structure (quiet) semantics ──
  const semKey = semanticKeyOf(selectedTokenName)
  const isBrandDrivenSemantic = BRAND_DRIVEN_KEYS.has(semKey)
  const neutralRole = neutralRoleOf(semKey)
  const keyLocked = isLocked(activeLockKey(semKey))
  // Suggestion is theme-agnostic: it reads the SHARED primitive ramps. Only which
  // semantic value we compare against / write to depends on the active theme.
  const resolvedColors = resolvedColorsWithStaged(tokens, staged)

  const brandSuggestion = isBrandDrivenSemantic
    ? suggestBrandSemantics(resolvedColors, 'brand')
    : null
  const neutralSuggestion = neutralRole
    ? suggestNeutralSemantics(resolvedColors, neutralRole, undefined, effectiveTheme)
    : null

  // Selected brand key → the one alias the suggestion would write for it.
  const brandValueFor = (key: string): string | null => {
    if (!brandSuggestion) return null
    if (key === 'primary') return brandSuggestion.primary
    if (key === 'primary-foreground') return brandSuggestion['primary-foreground']
    if (key === 'ring') return brandSuggestion.ring
    return null
  }

  // The current alias's step vs the suggested step, for the hint.
  const currentStep = parseColorRef(committedValue)?.shade ?? null

  // Is the SELECTED neutral token the surface (e.g. `muted`) or its foreground
  // (`muted-foreground`)? The card leads with whichever the user is actually editing.
  const isNeutralForeground = neutralRole != null && semKey === `${neutralRole}-foreground`
  // The single value the suggestion proposes for the SELECTED neutral token.
  const selectedNeutralValue = neutralSuggestion
    ? (isNeutralForeground ? neutralSuggestion.foreground : neutralSuggestion.surface)
    : null
  // Suggested step shown in the hint — for a foreground token that's the fg step (0/900),
  // for a surface token it's the surface step.
  const suggestedStep = brandSuggestion
    ? parseColorRef(brandSuggestion.primary)?.shade ?? null
    : (selectedNeutralValue ? parseColorRef(selectedNeutralValue)?.shade ?? null : null)

  // Current committed value of a semantic key in the ACTIVE theme (staged wins, else model).
  const currentSemanticValue = (key: string): string =>
    (effectiveTheme === 'dark'
      ? getStagedValue(`${DARK_EDIT_PREFIX}--${key}`)
      : getStagedValue(`--${key}`))
    ?? resolveTokenValue(`--${key}`, tokens, effectiveTheme) ?? ''
  // A suggestion is a no-op when every key it would write already equals its target.
  const writesAreNoop = (writes: Array<[string, string]>): boolean =>
    writes.every(([key, value]) => currentSemanticValue(key) === value)

  // Scoped to the selected brand key — the suggestion is a no-op only when THAT
  // token already matches, not when the whole triad does.
  const selectedBrandValue = brandValueFor(semKey)
  const brandWrites: Array<[string, string]> =
    brandSuggestion && selectedBrandValue != null
      ? [[semKey, selectedBrandValue]]
      : []
  const neutralWrites: Array<[string, string]> = (neutralRole && neutralSuggestion)
    ? [
        [neutralRole, neutralSuggestion.surface],
        [`${neutralRole}-foreground`, neutralSuggestion.foreground],
      ]
    : []
  const brandNoChange = brandSuggestion ? writesAreNoop(brandWrites) : false
  const neutralNoChange = neutralSuggestion ? writesAreNoop(neutralWrites) : false

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActiveDraft(e.target.value)
  }

  const remToPxHint = (() => {
    const val = displayValue.trim()
    const match = val.match(/^([\d.]+)rem$/)
    if (!match) return undefined
    const px = Math.round(parseFloat(match[1]) * 16)
    return `= ${px}px`
  })()

  // Auto-pick suggestion panel — rendered inline under the value picker (so it sits
  // with the alias dropdown, not down by Save/Cancel). Brand-driven OR neutral role.
  const suggestionPanel = (isBrandDrivenSemantic || neutralRole) ? (
    <div className="ed-brand-suggest">
      <div className="ed-brand-suggest__lock-row">
        <span className="ed-brand-suggest__lock-label">
          {keyLocked
            ? 'Locked — auto-pick will not change this token.'
            : neutralRole
              ? `${neutralRole} is a neutral surface — kept off the brand ramp so it never bleeds.`
              : 'Auto-pick may set this token when the brand changes.'}
        </span>
        <EdButton variant="secondary" size="sm" onClick={() => toggleLock(activeLockKey(semKey))}>
          {keyLocked ? 'Unlock' : 'Lock'}
        </EdButton>
      </div>

      {isBrandDrivenSemantic && (
        brandSuggestion ? (
          <div className="ed-brand-suggest__card">
            {semKey !== 'primary-foreground' && (
              <div className="ed-brand-suggest__line">
                Suggested {semKey === 'ring' ? 'ring' : 'primary'}:{' '}
                <strong>brand-{suggestedStep ?? '?'}</strong>
                {currentStep && suggestedStep && currentStep !== suggestedStep && (
                  <span className="ed-brand-suggest__from"> (currently brand-{currentStep})</span>
                )}
              </div>
            )}
            <div className="ed-brand-suggest__line">
              Foreground:{' '}
              <strong>{brandSuggestion.meta.foreground}</strong>
              {' · '}
              <span
                className={
                  brandSuggestion.meta.belowAA
                    ? 'ed-brand-suggest__badge ed-brand-suggest__badge--fail'
                    : 'ed-brand-suggest__badge ed-brand-suggest__badge--pass'
                }
              >
                {brandSuggestion.meta.belowAA ? 'Below AA' : 'AA'}{' '}
                {brandSuggestion.meta.contrast.toFixed(2)}:1
              </span>
            </div>
            {brandSuggestion.meta.belowAA && (
              <div className="ed-brand-suggest__warn">
                No brand step reaches 4.5:1 with either foreground. Applying anyway
                may fail contrast — consider a deeper or more saturated brand color.
              </div>
            )}
            <EdButton
              variant="primary"
              size="sm"
              onClick={() => handleApplyBrandSuggestion(semKey, selectedBrandValue!)}
              disabled={keyLocked || brandNoChange || selectedBrandValue == null}
            >
              {keyLocked
                ? 'Locked — unlock to apply'
                : brandNoChange
                  ? 'Already matches suggestion'
                  : 'Suggest from brand'}
            </EdButton>
          </div>
        ) : (
          <div className="ed-brand-suggest__line">
            No brand ramp found — define a `brand` color scale to enable auto-pick.
          </div>
        )
      )}

      {neutralRole && (
        neutralSuggestion ? (
          <div className="ed-brand-suggest__card">
            {/* Lead with the SELECTED token's own suggested value so the card
                matches what the value picker above is editing. */}
            <div className="ed-brand-suggest__line">
              Suggested {semKey}:{' '}
              <strong>{(selectedNeutralValue ?? '').replace(/^var\(--color-|\)$/g, '')}</strong>
              {currentStep && suggestedStep && currentStep !== suggestedStep && (
                <span className="ed-brand-suggest__from"> (currently {parseColorRef(committedValue)?.family ?? '?'}-{currentStep})</span>
              )}
            </div>
            {/* The paired value (the other half of the surface/foreground pair) for context. */}
            <div className="ed-brand-suggest__line">
              {isNeutralForeground ? 'Surface' : 'Foreground'}:{' '}
              <strong>
                {(isNeutralForeground ? neutralSuggestion.surface : neutralSuggestion.foreground)
                  .replace(/^var\(--color-|\)$/g, '')}
              </strong>
              {' · '}
              <span
                className={
                  neutralSuggestion.belowAA
                    ? 'ed-brand-suggest__badge ed-brand-suggest__badge--fail'
                    : 'ed-brand-suggest__badge ed-brand-suggest__badge--pass'
                }
              >
                {neutralSuggestion.belowAA ? 'Below AA' : 'AA'}{' '}
                {neutralSuggestion.contrast.toFixed(2)}:1
              </span>
            </div>
            {neutralSuggestion.belowAA && (
              <div className="ed-brand-suggest__warn">
                This neutral surface sits in the mid-gray contrast dead zone — neither
                light nor dark text clears 4.5:1. Pick a lighter or darker step.
              </div>
            )}
            <EdButton
              variant="primary"
              size="sm"
              onClick={() => handleApplyNeutralSuggestion(neutralRole, neutralSuggestion)}
              disabled={keyLocked || neutralNoChange}
            >
              {keyLocked
                ? 'Locked — unlock to apply'
                : neutralNoChange
                  ? 'Already matches suggestion'
                  : `Apply ${neutralRole} + ${neutralRole}-foreground`}
            </EdButton>
          </div>
        ) : (
          <div className="ed-brand-suggest__line">
            No neutral ramp found — define a `neutral` color scale to enable auto-pick.
          </div>
        )
      )}
    </div>
  ) : null

  return (
    <EdScrollArea className="ed-inspector">
      <div className="ed-inspector__body">
        <div className="ed-inspector__editor-header">
          <h1 className="ed-inspector__editor-title">Editor</h1>
          <p className="ed-inspector__editor-subtitle">Edit your tokens</p>
        </div>

        <div className="ed-inspector__header">
          <h2 className="ed-inspector__name">{selectedTokenName}</h2>
          <span className="ed-inspector__breadcrumb">{breadcrumb}</span>
        </div>

        <div className="ed-inspector__section">
          <h3 className="ed-inspector__section-title">Value</h3>

          {isSemanticToken && (
            <div className="ed-theme-tabs" role="tablist" aria-label="Edit theme">
              {(['light', 'dark'] as const).map((t) => {
                const hasEdit = getStagedValue(themedStagingKey(selectedTokenName, t)) !== undefined
                return (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={editTheme === t}
                    className={`ed-theme-tabs__tab${editTheme === t ? ' ed-theme-tabs__tab--active' : ''}`}
                    onClick={() => setEditTheme(t)}
                  >
                    {t === 'light' ? 'Light' : 'Dark'}
                    {hasEdit && <span className="ed-theme-tabs__dot" aria-label="has staged edit" />}
                  </button>
                )
              })}
            </div>
          )}

          <div className="ed-inspector__value-editor">
            {fontFamilySlot(selectedTokenName) ? (
              <>
                <GoogleFontPicker
                  slot={fontFamilySlot(selectedTokenName)!}
                  currentValue={displayValue}
                  onStageEdit={onStageEdit}
                />
                {/* Free-text fallback — advanced/non-Google or system fonts. Editing here
                    sets only the family token (no loader); Save commits it as usual. */}
                <input
                  value={displayValue}
                  onChange={handleValueChange}
                  className="ed-input ed-inspector__value-input ed-font-picker__freetext"
                  spellCheck={false}
                  aria-label="Font family value (advanced)"
                />
              </>
            ) : isFoundationColorToken(selectedTokenName) ? (
              <EdColorPicker
                value={displayValue || '#000000'}
                onChange={(color) => setActiveDraft(color)}
              />
            ) : displayValue.trim().startsWith('var(') ? (
              <TokenAliasPicker
                currentValue={displayValue}
                tokenName={selectedTokenName}
                tokens={tokens}
                onChange={(v) => setActiveDraft(v)}
              />
            ) : (
              <div className="ed-inspector__value-input-wrap">
                <input
                  value={displayValue}
                  onChange={handleValueChange}
                  className={`ed-input ed-inspector__value-input${remToPxHint ? ' ed-inspector__value-input--has-badge' : ''}`}
                  spellCheck={false}
                />
                {remToPxHint && (
                  <span className="ed-inspector__px-badge">{remToPxHint}</span>
                )}
              </div>
            )}
          </div>

          {suggestionPanel}

          <div className="ed-inspector__value-actions">
            <EdButton
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={!isDirty}
            >
              Save
            </EdButton>
            <EdButton
              variant="secondary"
              size="sm"
              onClick={handleCancel}
              disabled={!isDirty}
            >
              Cancel
            </EdButton>
            {isStaged && !isDirty && (
              <EdButton
                variant="secondary"
                size="sm"
                onClick={handleUndo}
              >
                Undo
              </EdButton>
            )}
          </div>
        </div>

        {aliasChain.length > 1 && (
          <div className="ed-inspector__section">
            <h3 className="ed-inspector__section-title">Alias Chain</h3>
            <div className="ed-inspector__alias-chain">
              {aliasChain.map((link, i) => (
                <div key={link.name}>
                  {i > 0 && <div className="ed-inspector__alias-arrow"><ArrowDown size={12} /></div>}
                  <div className="ed-inspector__alias-item">
                    <span>{link.name}</span>
                    {link.value != null && <span>{withPxAnnotation(link.value)}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <InspectorTokenDescription
          tokenName={selectedTokenName}
          tokenMetadata={tokenMetadata}
          stagedChanges={metadataStagedChanges}
          onDescriptionChange={setMetadataDescription}
          onDescriptionClear={clearDescription}
        />

        <div className="ed-inspector__section">
          <h3 className="ed-inspector__section-title">References</h3>
          {/* Token→token "Used by" only applies to primitives (semantics are the top token
              layer — nothing aliases them). Show it just for primitives; everything gets the
              component-usage block below. */}
          {graph && isPrimitiveToken(selectedTokenName) && (
            <UsedBy
              tokenName={selectedTokenName}
              graph={graph}
              stagedValues={staged}
            />
          )}
          <UsedInComponents
            tokenName={selectedTokenName}
            usage={usage}
            onRescan={onRescanUsage}
          />
        </div>
      </div>
    </EdScrollArea>
  )
}
