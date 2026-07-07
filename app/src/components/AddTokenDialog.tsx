import { useState, useEffect, useRef, useMemo } from 'react'
import { EdDialog } from '../editor-ds/primitives/EdDialog'
import { EdColorPicker } from '../editor-ds/primitives/EdColorPicker'
import type { GeeklegoTokensV2 } from '../types'
import { stageNewToken, getStagedNewTokens, getAllStaged, getStagedValue, type TokenTreePath } from '../state/staging'
import { withPxAnnotation } from '../utils/colorUtils'
import { PRIMITIVE_PREFIX } from '../utils/flattenTokens'

interface AddTokenDialogProps {
  isOpen: boolean
  onClose: () => void
  geeklegoTokens: GeeklegoTokensV2
  defaultNamePrefix?: string
  defaultCategory?: string
}

// ─── Primitive prefix table (derived, never hand-maintained) ────────────────────
// [cssPrefix, primitives-model-category] for every flat primitive scale, built
// from the canonical PRIMITIVE_PREFIX map. `colors` is dropped — primitive colors
// carry a numeric shade and are matched separately in deriveTreePath. Sorted by
// descending prefix length so a longer prefix (`--font-weight-`) is tested before a
// shorter one it contains (`--font-`), matching the old hand-ordered list.
const PRIMITIVE_PREFIXES: Array<[string, string]> = Object.entries(PRIMITIVE_PREFIX)
  .filter(([category]) => category !== 'colors')
  .map(([category, prefix]) => [`--${prefix}-`, category] as [string, string])
  .sort((a, b) => b[0].length - a[0].length)

// ─── deriveTreePath ────────────────────────────────────────────────────────────

function deriveTreePath(name: string): TokenTreePath | null {
  const colorPrimMatch = name.match(/^--color-([a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*)-(\d+)$/)
  if (colorPrimMatch) {
    return { kind: 'primitiveColor', family: colorPrimMatch[1], shade: colorPrimMatch[2] }
  }
  // Primitive scales — checked BEFORE the semantic fall-through so prefixed names
  // (--spacing-4, --radius-lg, --breakpoint-md, …) route to their primitive
  // category, not to semantics. Derived from the canonical PRIMITIVE_PREFIX map so
  // this list can never drift out of sync with the rest of the editor (the bug that
  // sent --breakpoint-* down the semantic-color path). `colors` is excluded here —
  // primitive colors are handled by the numeric-shade match above. Sorted
  // longest-prefix-first so `--font-weight-` wins over `--font-`.
  for (const [prefix, category] of PRIMITIVE_PREFIXES) {
    if (name.startsWith(prefix)) {
      const key = name.slice(prefix.length)
      if (key) return { kind: 'primitiveFlat', category, key }
    }
  }
  // Flat v2 semantics — CSS var for a key is `--<key>`. semantics.css is canonical, so
  // ANY bare name that isn't a primitive scale (handled above) and isn't an --ext-* token
  // is treated as a core semantic — including brand-new ones beyond the standard ShadCN set
  // (V2_SEMANTIC_KEYS is now a default/ordering set, not a gate). The editor absorbs these
  // under the standard "Status" category. `--color-…` / `--ext-…` are excluded so they never
  // mis-route to a semantic alias.
  const bareKey = name.replace(/^--/, '')
  if (
    bareKey &&
    /^[a-z][a-z0-9-]*$/.test(bareKey) &&
    !bareKey.startsWith('ext-') &&
    !bareKey.startsWith('color-')
  ) {
    return { kind: 'semanticFlat', group: 'semantic', key: bareKey }
  }
  return null
}

// A flat v2 semantic key whose alias resolves to a non-color primitive.
function isNonColorSemanticKey(key: string): boolean {
  return key === 'radius'
}

function isColorTreePath(path: TokenTreePath | null): boolean {
  if (!path) return false
  if (path.kind === 'primitiveColor') return true
  // Flat v2 semantics: color unless the key aliases a non-color primitive (e.g. radius)
  if (path.kind === 'semanticFlat') return !isNonColorSemanticKey(path.key)
  return false
}

// Returns true for tokens that must alias a parent primitive (no raw values allowed)
function isAliasOnlyTreePath(path: TokenTreePath | null): boolean {
  if (!path) return false
  if (path.kind === 'semanticFlat') return true
  return false
}

// Maps a treePath to the CSS name prefix of the primitives it should alias
function getPrimitiveScopePrefix(path: TokenTreePath): string | null {
  if (path.kind === 'semanticFlat') {
    // Flat v2 semantics alias a primitive: radius → --radius-, everything else → --color-
    return isNonColorSemanticKey(path.key) ? '--radius-' : '--color-'
  }
  return null
}

// ─── Flatten all known token names for duplicate detection ─────────────────────

function getAllTokenNames(geeklegoTokens: GeeklegoTokensV2): Set<string> {
  const names = new Set<string>()
  const prims = geeklegoTokens.primitives as unknown as Record<string, unknown>
  for (const [cat, vals] of Object.entries(prims)) {
    const prefix = PRIMITIVE_PREFIX[cat]
    if (!prefix || !vals || typeof vals !== 'object') continue
    for (const [k, v] of Object.entries(vals as Record<string, unknown>)) {
      if (typeof v === 'string' || typeof v === 'number') {
        names.add(`--${prefix}-${k}`)
      } else if (v && typeof v === 'object') {
        for (const k2 of Object.keys(v as Record<string, unknown>)) {
          names.add(`--${prefix}-${k}-${k2}`)
        }
      }
    }
  }
  // Scalar primitive: colorShadowNeutral is a single string, not a Record scale, so
  // the PRIMITIVE_PREFIX loop skips it. Add --color-shadow-neutral so it's counted
  // for duplicate detection.
  if (typeof geeklegoTokens.primitives.colorShadowNeutral === 'string' && geeklegoTokens.primitives.colorShadowNeutral !== '') {
    names.add('--color-shadow-neutral')
  }
  // Flat v2 semantics — CSS var for a key is `--<key>`
  for (const k of Object.keys(geeklegoTokens.semantics.light)) {
    names.add(`--${k}`)
  }
  return names
}

function validateName(name: string, existingNames: Set<string>): string | null {
  if (!name.startsWith('--')) return 'Name must start with --'
  if (!/^--[a-z][a-z0-9-]*$/.test(name)) return 'Only lowercase letters, numbers, and hyphens allowed'
  if (name.length < 5) return 'Name too short'
  if (name.length > 80) return 'Name too long (max 80 characters)'
  if (existingNames.has(name)) return 'A token with this name already exists'
  if (getStagedNewTokens().has(name)) return 'Already staged as a new token'
  return null
}

// ─── Build a flat candidate list for the alias picker ─────────────────────────

interface Candidate { name: string; value: string }

function buildCandidates(geeklegoTokens: GeeklegoTokensV2, scopePrefix: string): Candidate[] {
  const result: Candidate[] = []
  const prims = geeklegoTokens.primitives as unknown as Record<string, unknown>
  for (const [cat, vals] of Object.entries(prims)) {
    const prefix = PRIMITIVE_PREFIX[cat]
    if (!prefix || !vals || typeof vals !== 'object') continue
    for (const [k, v] of Object.entries(vals as Record<string, unknown>)) {
      if (typeof v === 'string' || typeof v === 'number') {
        const cssName = `--${prefix}-${k}`
        if (cssName.startsWith(scopePrefix)) {
          result.push({ name: cssName, value: getStagedValue(cssName) ?? String(v) })
        }
      } else if (v && typeof v === 'object') {
        for (const [k2, v2] of Object.entries(v as Record<string, unknown>)) {
          if (typeof v2 === 'string' || typeof v2 === 'number') {
            const cssName = `--${prefix}-${k}-${k2}`
            if (cssName.startsWith(scopePrefix)) {
              result.push({ name: cssName, value: getStagedValue(cssName) ?? String(v2) })
            }
          }
        }
      }
    }
  }
  // Scalar primitive: --color-shadow-neutral (single string, skipped by the loop above).
  const shadowNeutral = geeklegoTokens.primitives.colorShadowNeutral
  if (typeof shadowNeutral === 'string' && shadowNeutral !== '' && '--color-shadow-neutral'.startsWith(scopePrefix)) {
    result.push({ name: '--color-shadow-neutral', value: getStagedValue('--color-shadow-neutral') ?? shadowNeutral })
  }
  // Include brand-new staged primitives (e.g. new color palettes)
  for (const [cssName, value] of getAllStaged()) {
    if (cssName.startsWith(scopePrefix) && !result.some(c => c.name === cssName)) {
      result.push({ name: cssName, value })
    }
  }
  return result
}

// ─── Alias Picker (scoped dropdown) ───────────────────────────────────────────

interface AliasScopePickerProps {
  candidates: Candidate[]
  value: string
  onChange: (val: string) => void
  scopePrefix: string
}

function resolveSwatchColor(value: string, candidates: Candidate[], depth = 0): string | null {
  if (depth > 4) return null
  if (/^#[0-9a-fA-F]{3,8}$/.test(value)) return value
  if (value.startsWith('oklch(') || value.startsWith('rgb')) return value
  if (value.startsWith('var(')) {
    const m = value.match(/var\((--[\w-]+)\)/)
    if (m) {
      const staged = getStagedValue(m[1])
      const candidate = candidates.find(c => c.name === m[1])
      return resolveSwatchColor(staged ?? candidate?.value ?? '', candidates, depth + 1)
    }
  }
  return null
}

function AliasScopePicker({ candidates, value, onChange, scopePrefix }: AliasScopePickerProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const isColor = scopePrefix.startsWith('--color-')

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return q ? candidates.filter(c => c.name.includes(q) || c.value.toLowerCase().includes(q)) : candidates
  }, [candidates, query])

  // Close on outside click — must check both container and floating dropdown
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      const inContainer = containerRef.current?.contains(target)
      const inDropdown = dropdownRef.current?.contains(target)
      if (!inContainer && !inDropdown) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (!open) return
    // Re-compute position after layout to ensure ref is measured correctly
    const frame = requestAnimationFrame(() => {
      const r = containerRef.current?.getBoundingClientRect()
      if (r) setDropdownPos({ top: r.bottom + 4, left: r.left, width: r.width })
      setTimeout(() => searchRef.current?.focus(), 30)
    })
    return () => cancelAnimationFrame(frame)
  }, [open])

  const selectedCandidate = candidates.find(c => `var(${c.name})` === value)

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px', background: 'var(--ed-surface)', border: '1px solid var(--ed-border)',
          borderRadius: 'var(--ed-radius-input)', cursor: 'pointer', fontFamily: 'monospace',
          fontSize: '13px', color: value ? 'var(--ed-text)' : 'var(--ed-text-faint)',
          transition: 'border-color 0.15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--ed-accent)' }}
        onMouseLeave={e => { if (!open) (e.currentTarget as HTMLElement).style.borderColor = 'var(--ed-border)' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          {isColor && selectedCandidate && (() => {
            const color = resolveSwatchColor(selectedCandidate.value, candidates)
            return color ? <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: color, border: '1px solid var(--ed-border)', flexShrink: 0 }} /> : null
          })()}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedCandidate ? selectedCandidate.name : 'Pick a token…'}
          </span>
        </span>
        <span style={{ color: 'var(--ed-text-muted)', fontSize: '10px', marginLeft: '6px' }}>▾</span>
      </button>

      {open && dropdownPos && (
        <div ref={dropdownRef} style={{
          position: 'fixed',
          top: dropdownPos.top,
          left: dropdownPos.left,
          width: dropdownPos.width,
          zIndex: 20000,
          background: 'var(--ed-surface-elevated)', border: '1px solid var(--ed-border)',
          borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          display: 'flex', flexDirection: 'column', maxHeight: '280px',
        }}>
          <div style={{ padding: '8px', borderBottom: '1px solid var(--ed-border)' }}>
            <input
              ref={searchRef}
              className="ed-input"
              style={{ width: '100%', fontSize: '12px' }}
              placeholder={`Search ${candidates.length} tokens…`}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '12px', fontSize: '12px', color: 'var(--ed-text-muted)', textAlign: 'center' }}>No matches</div>
            ) : filtered.map(c => {
              const varValue = `var(${c.name})`
              const isSelected = value === varValue
              const swatchColor = isColor ? resolveSwatchColor(c.value, candidates) : null
              const displayValue = withPxAnnotation(c.value)
              return (
                <div
                  key={c.name}
                  onClick={() => { onChange(varValue); setOpen(false); setQuery('') }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '7px 12px', cursor: 'pointer', gap: '8px',
                    background: isSelected ? 'var(--ed-accent-tint)' : 'transparent',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--ed-surface)' }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  {swatchColor && (
                    <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: swatchColor, border: '1px solid var(--ed-border)', flexShrink: 0 }} />
                  )}
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', color: isSelected ? 'var(--ed-accent)' : 'var(--ed-text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.name}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--ed-text-muted)', flexShrink: 0 }}>
                    {displayValue}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddTokenDialog({ isOpen, onClose, geeklegoTokens, defaultNamePrefix, defaultCategory: _defaultCategory }: AddTokenDialogProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState(defaultNamePrefix ?? '--')
  const [value, setValue] = useState('')
  const [colorHex, setColorHex] = useState('#6366f1')
  const [nameError, setNameError] = useState<string | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const existingNames = getAllTokenNames(geeklegoTokens)
  const treePath = deriveTreePath(name)
  const isColor = isColorTreePath(treePath)
  const isAliasOnly = isAliasOnlyTreePath(treePath)
  const scopePrefix = treePath ? getPrimitiveScopePrefix(treePath) : null

  const candidates = useMemo(() => {
    if (!scopePrefix) return []
    return buildCandidates(geeklegoTokens, scopePrefix)
  }, [geeklegoTokens, scopePrefix])

  const pxHint = useMemo(() => {
    if (isColor || isAliasOnly) return null
    const v = value.trim()
    if (!v) return null
    const remMatch = v.match(/^([\d.]+)rem$/)
    if (remMatch) {
      const px = Math.round(parseFloat(remMatch[1]) * 16)
      return { text: `= ${v} · ${px}px`, warn: false }
    }
    const pxMatch = v.match(/^([\d.]+)px$/)
    if (pxMatch) {
      const rem = parseFloat((parseFloat(pxMatch[1]) / 16).toFixed(4)).toString()
      return { text: `→ will be saved as ${rem}rem`, warn: false }
    }
    if (/^[\d.]+$/.test(v)) return { text: `no unit — did you mean ${v}px or ${parseFloat(v) / 16}rem?`, warn: true }
    return null
  }, [value, isColor, isAliasOnly])

  useEffect(() => {
    if (name === (defaultNamePrefix ?? '--')) {
      setNameError(null)
      return
    }
    setNameError(validateName(name, existingNames))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setName(defaultNamePrefix ?? '--')
      setValue('')
      setColorHex('#6366f1')
      setNameError(null)
      setTimeout(() => nameInputRef.current?.focus(), 50)
    }
  }, [isOpen, defaultNamePrefix])

  // Reset value when treePath changes to avoid stale values across categories
  useEffect(() => { setValue('') }, [isAliasOnly, isColor])

  function handleAdd() {
    if (!treePath) return
    let finalValue = isColor && !isAliasOnly && !value.trim().startsWith('var(') ? colorHex : value.trim()
    if (!finalValue) return
    const pxMatch = finalValue.match(/^([\d.]+)px$/)
    if (pxMatch) {
      const rem = parseFloat((parseFloat(pxMatch[1]) / 16).toFixed(4))
      finalValue = `${rem}rem`
    }
    stageNewToken({ cssName: name, value: finalValue, treePath, addedAt: Date.now() })
    onClose()
  }

  const canProceedStep1 = name.length >= 5 && nameError === null && treePath !== null
  const canAdd = canProceedStep1 && (
    isAliasOnly ? value.trim().length > 0
    : isColor ? (value.trim().startsWith('var(') ? value.trim().length > 0 : true)
    : value.trim().length > 0
  )

  const treePathLabel = treePath
    ? treePath.kind === 'primitiveColor' ? `Primitive color — ${treePath.family} / ${treePath.shade}`
    : treePath.kind === 'primitiveFlat' ? `Primitive — ${treePath.category}`
    : `Semantic — ${treePath.key}`
    : null

  return (
    <EdDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add Token"
      description={step === 1 ? 'Choose a name for the new token' : 'Set the value for the token'}
      size="md"
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          {step === 2 && <button className="ed-btn ed-btn--secondary" onClick={() => setStep(1)}>Back</button>}
          <button className="ed-btn ed-btn--secondary" onClick={onClose}>Cancel</button>
          {step === 1 ? (
            <button className="ed-btn ed-btn--primary" disabled={!canProceedStep1} onClick={() => setStep(2)}>
              Next
            </button>
          ) : (
            <button className="ed-btn ed-btn--primary" disabled={!canAdd} onClick={handleAdd}>
              Add Token
            </button>
          )}
        </div>
      }
    >
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--ed-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              CSS Variable Name
            </label>
            <input
              ref={nameInputRef}
              className="ed-input"
              style={{ width: '100%', fontFamily: 'var(--ed-font-mono, monospace)', fontSize: '13px' }}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="--color-brand-950"
              spellCheck={false}
            />
            {nameError && <p style={{ marginTop: '6px', fontSize: '12px', color: '#e74c3c' }}>{nameError}</p>}
            {!nameError && treePath && (
              <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--ed-text-muted)' }}>
                Category: <strong style={{ color: 'var(--ed-text)' }}>{treePathLabel}</strong>
                {isAliasOnly && <span style={{ marginLeft: '6px', color: 'var(--ed-accent)', fontStyle: 'italic' }}>· alias required</span>}
              </p>
            )}
            {!nameError && !treePath && name.length >= 5 && (
              <p style={{ marginTop: '6px', fontSize: '12px', color: '#e67e22' }}>
                Could not determine category — try a more specific name (e.g. <code>--color-brand-950</code>, <code>--spacing-8</code>, <code>--color-bg-custom</code>)
              </p>
            )}
          </div>

          <div style={{ padding: '12px', background: 'var(--ed-bg-subtle)', borderRadius: '8px', fontSize: '12px', color: 'var(--ed-text-muted)', lineHeight: '1.6' }}>
            <strong style={{ color: 'var(--ed-text)', display: 'block', marginBottom: '4px' }}>Naming guide</strong>
            <code style={{ display: 'block' }}>--color-brand-950</code> → primitive color
            <code style={{ display: 'block' }}>--spacing-10</code> → primitive spacing
            <code style={{ display: 'block' }}>--color-bg-custom</code> → semantic (alias only)
            <code style={{ display: 'block' }}>--spacing-layout-xl</code> → semantic (alias only)
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '8px 12px', background: 'var(--ed-bg-subtle)', borderRadius: '6px', fontFamily: 'var(--ed-font-mono, monospace)', fontSize: '12px', color: 'var(--ed-text-muted)' }}>
            {name}
            {treePathLabel && <span style={{ marginLeft: '8px', color: 'var(--ed-text-faint)' }}>· {treePathLabel}</span>}
          </div>

          {/* Semantic tokens — alias picker only, scoped to relevant primitive family */}
          {isAliasOnly && scopePrefix ? (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--ed-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Alias
              </label>
              <AliasScopePicker
                candidates={candidates}
                value={value}
                onChange={setValue}
                scopePrefix={scopePrefix}
              />
              <p style={{ marginTop: '8px', fontSize: '11px', color: 'var(--ed-text-muted)' }}>
                Semantic tokens must reference a primitive — no raw values allowed.
              </p>
            </div>

          /* Primitive color — color picker + optional alias override */
          ) : isColor ? (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--ed-text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Color Value
              </label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <EdColorPicker value={value.startsWith('var(') ? '#6366f1' : (colorHex)} onChange={setColorHex} />
                </div>
                <div style={{ paddingTop: '8px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: colorHex, border: '1px solid var(--ed-border)' }} />
                  <p style={{ marginTop: '4px', fontSize: '11px', fontFamily: 'monospace', color: 'var(--ed-text-muted)', textAlign: 'center' }}>{colorHex}</p>
                </div>
              </div>
              <p style={{ marginTop: '8px', fontSize: '11px', color: 'var(--ed-text-muted)' }}>
                Or type a <code>var(--token)</code> alias to reference an existing token:
              </p>
              <input
                className="ed-input"
                style={{ width: '100%', marginTop: '4px', fontFamily: 'monospace', fontSize: '12px' }}
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="var(--color-brand-500)"
              />
            </div>

          /* Primitive flat — raw value input with rem/px conversion */
          ) : (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--ed-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Value
              </label>
              <input
                className="ed-input"
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '13px' }}
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="1rem, 16px, 400, var(--token)…"
                autoFocus
              />
              {pxHint && (
                <p style={{ marginTop: '6px', fontSize: '12px', color: pxHint.warn ? '#e67e22' : 'var(--ed-text-muted)', fontFamily: 'monospace' }}>
                  {pxHint.warn ? '⚠ ' : ''}{pxHint.text}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </EdDialog>
  )
}
