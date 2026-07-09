import { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import type { TokenEntry, GeeklegoTokensV2 } from '../types'
import { EdCard } from '../editor-ds/primitives/EdCard'
import { getCategoryById, getArchitectureForCategory, type CategoryMeta } from '../ia/categoryCopy'
import { CategoryArchitecturePanel } from './CategoryArchitecturePanel'
import { isStatusSemantic, semanticBucketOfVar } from '../ia/semanticBuckets'
import CategoryGroup from './CategoryGroup'
import FilterBar from '../components/FilterBar'
import { getAllStaged, getStagedValue, getDraft, subscribeToPendingChanges, subscribeToDraftChanges, getStagedNewTokens, stage } from '../state/staging'
import { AddTokenDialog } from '../components/AddTokenDialog'
import { EdColorPicker } from '../editor-ds/primitives/EdColorPicker'
import { generateOklchScale } from '../utils/colorUtils'
import { FONT_LOADER_EDIT_PREFIX } from '../utils/exportFormatter'
import { EdDialog } from '../editor-ds/primitives/EdDialog'
import './CategoryPage.css'

interface CategoryPageProps {
  category: string
  tokens: TokenEntry[]
  geeklegoTokens?: GeeklegoTokensV2
  onTokenClick?: (token: TokenEntry) => void
  onAddToken?: (groupName: string, namePrefix: string) => void
}

const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
  'typography-semantic': 'Typography',
}

function getDisplayCategory(category: string): string {
  if (DISPLAY_NAME_OVERRIDES[category]) return DISPLAY_NAME_OVERRIDES[category]
  const id = `foundations-${category}`
  return getCategoryById(id) || category.charAt(0).toUpperCase() + category.slice(1)
}

function getCategoryMeta(category: string): CategoryMeta | undefined {
  const id = `foundations-${category}`
  return getCategoryById(id) ? undefined : { id, name: getDisplayCategory(category), statement: '', pattern: [], appliesToScale: false }
}

function shouldUseScaleView(category: string): boolean {
  return category === 'color'
}

// Maps a NavRail subCategory id to a filter function that identifies matching tokens.
// Primitives are raw values (--color-primary-*, --color-neutral-*, etc.)
// Semantics are aliases that reference primitives (--color-bg-*, --color-text-*, etc.)
const categoryFilters: Record<string, (name: string) => boolean> = {
  // Foundations — only primitive color swatches, not semantic aliases
  // Match any --color-{family}-{shade} where shade is digits — catches new custom palettes too
  color: (name) => /^--color-[a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*-\d+$/.test(name),
  spacing: (name) => /^--spacing-/.test(name),
  radius: (name) => /^--radius-/.test(name),
  typography: (name) => /^--(?:font-|text-|leading-|tracking-)/.test(name),
  shadow: (name) => /^--shadow-/.test(name),
  motion: (name) => /^--(?:motion-|duration-|ease-)/.test(name),
  // border-WIDTH primitives only — the semantic border ramp (--border-strong /
  // --border-muted) starts with --border- too but belongs to the Layout semantic page.
  border: (name) => /^--border-width-/.test(name),
  breakpoint: (name) => /^--breakpoint-/.test(name),
  // Semantic — v2 (2-tier) uses the flat standard ShadCN/Tailwind vocabulary.
  // Membership for surface/interactive/layout/status comes from the shared
  // `semanticBuckets` module (the single source of truth NavRail also uses), so
  // the two systems can never drift. Each predicate strips the leading `--` and
  // delegates. In particular `status` now correctly EXCLUDES the typography
  // primitives (--text-/--leading-/--tracking-) that previously leaked in.
  surface: (name) => semanticBucketOfVar(name) === 'surface',
  interactive: (name) => semanticBucketOfVar(name) === 'interactive',
  status: (name) => isStatusSemantic(name.replace(/^--/, '')),
  layout: (name) => semanticBucketOfVar(name) === 'layout',
}

function filterTokensForCategory(tokens: TokenEntry[], category: string): TokenEntry[] {
  const filter = categoryFilters[category]
  if (!filter) return tokens
  return tokens.filter((t) => filter(t.name))
}

function splitIntoGroups(tokens: TokenEntry[], category: string): Record<string, TokenEntry[]> {
  const groups: Record<string, TokenEntry[]> = {}

  if (category === 'color') {
    // Extract family from --color-{family}-{shade} and group dynamically
    const KNOWN_ORDER = ['primary', 'brand', 'accent', 'neutral', 'success', 'warning', 'danger', 'info']
    const familyMap = new Map<string, typeof tokens>()
    for (const t of tokens) {
      const m = t.name.match(/^--color-([a-z][a-z0-9]*(?:-[a-z][a-z0-9]*)*)-\d+$/)
      if (m) {
        const family = m[1]
        if (!familyMap.has(family)) familyMap.set(family, [])
        familyMap.get(family)!.push(t)
      }
    }
    // Emit known families first, then any custom ones alphabetically
    const knownFamilies = KNOWN_ORDER.filter(f => familyMap.has(f))
    const customFamilies = [...familyMap.keys()].filter(f => !KNOWN_ORDER.includes(f)).sort()
    for (const family of [...knownFamilies, ...customFamilies]) {
      const label = family.charAt(0).toUpperCase() + family.slice(1)
      groups[label] = familyMap.get(family)!
    }
    if (Object.keys(groups).length === 0) groups['All Colors'] = tokens
    return groups
  }

  if (category === 'spacing') {
    const layout = tokens.filter((t) => t.name.startsWith('--spacing-layout-'))
    const component = tokens.filter((t) => t.name.startsWith('--spacing-component-'))
    const matched = new Set([...layout, ...component].map((t) => t.name))
    const scale = tokens.filter((t) => !matched.has(t.name))

    if (scale.length > 0) groups['Scale'] = scale
    if (layout.length > 0) groups['Layout'] = layout
    if (component.length > 0) groups['Component'] = component

    if (Object.keys(groups).length === 0) groups['All Spacing'] = tokens
    return groups
  }

  if (category === 'radius') {
    const button = tokens.filter((t) => t.name.startsWith('--radius-button-'))
    const card = tokens.filter((t) => t.name.startsWith('--radius-card-'))
    const component = tokens.filter((t) => t.name.startsWith('--radius-component-'))
    const matched = new Set([...button, ...card, ...component].map((t) => t.name))
    const scale = tokens.filter((t) => !matched.has(t.name))

    if (scale.length > 0) groups['Scale'] = scale
    if (button.length > 0) groups['Button'] = button
    if (card.length > 0) groups['Card & Containers'] = card
    if (component.length > 0) groups['Component'] = component

    if (Object.keys(groups).length === 0) groups['All Radius'] = tokens
    return groups
  }

  if (category === 'typography') {
    const fontWeight = tokens.filter((t) => t.name.startsWith('--font-weight-'))
    const fontFamily = tokens.filter(
      (t) => t.name.startsWith('--font-') && !t.name.startsWith('--font-weight-'),
    )
    const fontSize = tokens.filter((t) => t.name.startsWith('--text-'))
    const lineHeight = tokens.filter((t) => t.name.startsWith('--leading-'))
    const letterSpacing = tokens.filter((t) => t.name.startsWith('--tracking-'))

    if (fontFamily.length > 0) groups['Font Family'] = fontFamily
    if (fontSize.length > 0) groups['Font Size'] = fontSize
    if (fontWeight.length > 0) groups['Font Weight'] = fontWeight
    if (lineHeight.length > 0) groups['Line Height'] = lineHeight
    if (letterSpacing.length > 0) groups['Letter Spacing'] = letterSpacing

    if (Object.keys(groups).length === 0) groups['All Typography'] = tokens
    return groups
  }

  if (category === 'shadow') {
    groups['Shadows'] = tokens
    return groups
  }

  if (category === 'motion') {
    const duration = tokens.filter((t) => t.name.startsWith('--duration-') || t.name.startsWith('--motion-duration-'))
    const easing = tokens.filter((t) => t.name.startsWith('--ease-') || t.name.startsWith('--motion-easing-'))
    const matched = new Set([...duration, ...easing].map((t) => t.name))
    const other = tokens.filter((t) => !matched.has(t.name))

    if (duration.length > 0) groups['Duration'] = duration
    if (easing.length > 0) groups['Easing'] = easing
    if (other.length > 0) groups['Other'] = other

    if (Object.keys(groups).length === 0) groups['All Motion'] = tokens
    return groups
  }

  if (category === 'border') {
    groups['Borders'] = tokens
    return groups
  }

  // Semantic categories — each has a single flat group by default
  if (category === 'surface') { groups['Surfaces'] = tokens; return groups }
  if (category === 'content') { groups['Content'] = tokens; return groups }
  if (category === 'interactive') { groups['Interactive'] = tokens; return groups }
  if (category === 'status') { groups['Status'] = tokens; return groups }
  if (category === 'layout') { groups['Layout'] = tokens; return groups }

  if (category === 'typography-semantic') {
    // Group --typography-{style}-{prop} by style family (display, heading, body, label, caption, code)
    const display = tokens.filter((t) => t.name.startsWith('--typography-display-'))
    const heading = tokens.filter((t) => t.name.startsWith('--typography-heading-'))
    const body = tokens.filter((t) => t.name.startsWith('--typography-body-'))
    const label = tokens.filter((t) => t.name.startsWith('--typography-label-'))
    const caption = tokens.filter((t) => t.name.startsWith('--typography-caption-'))
    const code = tokens.filter((t) => t.name.startsWith('--typography-code-'))
    const matched = new Set([...display, ...heading, ...body, ...label, ...caption, ...code].map((t) => t.name))
    const other = tokens.filter((t) => !matched.has(t.name))

    if (display.length > 0) groups['Display'] = display
    if (heading.length > 0) groups['Heading'] = heading
    if (body.length > 0) groups['Body'] = body
    if (label.length > 0) groups['Label'] = label
    if (caption.length > 0) groups['Caption'] = caption
    if (code.length > 0) groups['Code'] = code
    if (other.length > 0) groups['Other'] = other

    if (Object.keys(groups).length === 0) groups['Typography Semantics'] = tokens
    return groups
  }

  groups['All'] = tokens
  return groups
}

// ─── Typography Scale View ────────────────────────────────────────────────────

// Style order for display — top to bottom as in design spec
const TYPO_STYLE_ORDER = [
  'display-hero', 'display-3xl', 'display-2xl', 'display-xl', 'display-lg', 'display-md', 'display-sm',
  'heading-h1', 'heading-h2', 'heading-h3', 'heading-h4', 'heading-h5', 'heading-h6',
  'body-2xl', 'body-xl', 'body-lg', 'body-md', 'body-sm', 'body-xs', 'body-2xs',
  'label-xl', 'label-lg', 'label-md', 'label-sm', 'label-xs',
  'caption-lg', 'caption-md', 'caption-sm',
  'code-lg', 'code-md', 'code-sm',
]

function resolveVar(value: string): string {
  if (!value.startsWith('var(')) return value
  const m = value.match(/var\((--[\w-]+)\)/)
  if (!m) return value
  const staged = getStagedValue(m[1])
  if (staged) return staged
  return getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim() || value
}

interface TypographyScaleViewProps {
  geeklegoTokens: GeeklegoTokensV2
  onTokenClick?: (token: TokenEntry) => void
}

function TypographyScaleView({ onTokenClick }: TypographyScaleViewProps) {
  const [, setTick] = useState(0)
  useEffect(() => subscribeToPendingChanges(() => setTick(n => n + 1)), [])
  useEffect(() => subscribeToDraftChanges(() => setTick(n => n + 1)), [])

  // The flat v2 model has no nested typography semantic styles — there are no
  // extra typography styles to render here.
  const sem: Record<string, { size: string; weight: string; leading: string; tracking: string }> = {}

  const styles = useMemo(() => {
    const known = TYPO_STYLE_ORDER.filter(s => sem[s])
    const extras = Object.keys(sem).filter(s => !TYPO_STYLE_ORDER.includes(s))
    return [...known, ...extras]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="ed-typo-scale">
      <div className="ed-typo-scale__header-row">
        <span className="ed-typo-scale__col-meta">Size</span>
        <span className="ed-typo-scale__col-meta">Weight</span>
        <span className="ed-typo-scale__col-meta">Line Height</span>
        <span className="ed-typo-scale__col-meta">Tracking</span>
        <span className="ed-typo-scale__col-class">Class</span>
      </div>
      {styles.map(style => {
        const s = sem[style]
        if (!s) return null
        const sizeToken = `--typography-${style}-size`
        const weightToken = `--typography-${style}-weight`
        const leadingToken = `--typography-${style}-leading`
        const trackingToken = `--typography-${style}-tracking`
        // Draft takes priority, then staged, then original parsed value
        const size = getDraft(sizeToken) ?? getStagedValue(sizeToken) ?? s.size
        const weight = getDraft(weightToken) ?? getStagedValue(weightToken) ?? s.weight
        const leading = getDraft(leadingToken) ?? getStagedValue(leadingToken) ?? s.leading
        const tracking = getDraft(trackingToken) ?? getStagedValue(trackingToken) ?? s.tracking

        // Resolve var() references for CSS preview styles
        const resolveForStyle = (val: string) => {
          if (!val.startsWith('var(')) return val
          const m = val.match(/var\((--[\w-]+)\)/)
          if (!m) return val
          return getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim() || val
        }

        const previewStyle: React.CSSProperties = {
          fontSize: resolveForStyle(size),
          fontWeight: resolveForStyle(weight),
          lineHeight: resolveForStyle(leading),
          letterSpacing: resolveForStyle(tracking),
        }

        return (
          <div
            key={style}
            className="ed-typo-scale__row"
            onClick={() => onTokenClick?.({ name: sizeToken, value: size })}
          >
            <div className="ed-typo-scale__row-preview">
              <span style={previewStyle} className="ed-typo-scale__preview-text">
                The quick brown fox jumps over the lazy dog
              </span>
            </div>
            <div className="ed-typo-scale__row-meta">
              <span className="ed-typo-scale__style-name">{style}</span>
              <span className="ed-typo-scale__val">{resolveVar(size)}</span>
              <span className="ed-typo-scale__val">{resolveVar(weight)}</span>
              <span className="ed-typo-scale__val">{resolveVar(leading)}</span>
              <span className="ed-typo-scale__val">{resolveVar(tracking)}</span>
              <span className="ed-typo-scale__class-chip">.text-{style}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function groupNameToPrefix(category: string, groupName: string): string {
  if (category === 'color') {
    const family = groupName.toLowerCase().replace(/\s+/g, '-')
    if (family === 'other' || family === 'all-colors') return '--color-'
    return `--color-${family}-`
  }
  if (category === 'spacing') {
    if (groupName === 'Component') return '--spacing-component-'
    if (groupName === 'Layout') return '--spacing-layout-'
    return '--spacing-'
  }
  if (category === 'radius') {
    if (groupName === 'Component') return '--radius-component-'
    return '--radius-'
  }
  if (category === 'typography') {
    if (groupName === 'Font Size') return '--text-'
    if (groupName === 'Font Weight') return '--font-weight-'
    if (groupName === 'Font Family') return '--font-'
    if (groupName === 'Line Height') return '--leading-'
    if (groupName === 'Letter Spacing') return '--tracking-'
    return '--font-'
  }
  if (category === 'shadow') return '--shadow-'
  if (category === 'motion') {
    if (groupName === 'Easing') return '--ease-'
    return '--duration-'
  }
  if (category === 'border') return '--border-width-'
  if (category === 'breakpoint') return '--breakpoint-'
  // v2 semantics are flat standard names with no shared prefix (e.g. --primary,
  // --background) — a new semantic is just `--<name>`, so start the add-token
  // dialog with a bare `--` for all semantic categories.
  if (category === 'surface' || category === 'interactive' ||
      category === 'status' || category === 'layout') return '--'
  return '--'
}

const defaultMeta: CategoryMeta = {
  id: '',
  name: '',
  statement: '',
  pattern: [],
  appliesToScale: false,
}

// ─── New Palette Dialog ───────────────────────────────────────────────────────

interface NewPaletteDialogProps {
  isOpen: boolean
  onClose: () => void
  existingFamilies: string[]
}

function NewPaletteDialog({ isOpen, onClose, existingFamilies }: NewPaletteDialogProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [familyName, setFamilyName] = useState('')
  const [baseColor, setBaseColor] = useState('#6366f1')
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setFamilyName('')
      setBaseColor('#6366f1')
      setTimeout(() => nameInputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const nameError = useMemo(() => {
    const slug = familyName.trim().toLowerCase().replace(/\s+/g, '-')
    if (!slug) return null
    if (!/^[a-z][a-z0-9-]*$/.test(slug)) return 'Use only letters, numbers, and hyphens'
    if (existingFamilies.includes(slug)) return 'A palette with this name already exists'
    return null
  }, [familyName, existingFamilies])

  const slug = familyName.trim().toLowerCase().replace(/\s+/g, '-')
  const canProceed = slug.length >= 2 && nameError === null

  function handleCreate() {
    if (!canProceed) return
    const shades = generateOklchScale(baseColor)
    for (const [shade, hex] of Object.entries(shades)) {
      stage(`--color-${slug}-${shade}`, hex)
    }
    onClose()
  }

  return (
    <EdDialog
      isOpen={isOpen}
      onClose={onClose}
      title="New Color Palette"
      description={step === 1 ? 'Name your new palette family' : 'Pick a base color — all 11 shades will be generated'}
      size="md"
      footer={
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          {step === 2 && <button className="ed-btn ed-btn--secondary" onClick={() => setStep(1)}>Back</button>}
          <button className="ed-btn ed-btn--secondary" onClick={onClose}>Cancel</button>
          {step === 1 ? (
            <button className="ed-btn ed-btn--primary" disabled={!canProceed} onClick={() => setStep(2)}>
              Next
            </button>
          ) : (
            <button className="ed-btn ed-btn--primary" onClick={handleCreate}>
              Generate Palette
            </button>
          )}
        </div>
      }
    >
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--ed-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Palette name
            </label>
            <input
              ref={nameInputRef}
              className="ed-input"
              style={{ width: '100%' }}
              value={familyName}
              onChange={e => setFamilyName(e.target.value)}
              placeholder="e.g. teal, coral, violet"
              spellCheck={false}
            />
            {nameError && <p style={{ marginTop: '6px', fontSize: '12px', color: '#e74c3c' }}>{nameError}</p>}
            {!nameError && slug.length >= 2 && (
              <p style={{ marginTop: '6px', fontSize: '12px', color: 'var(--ed-text-muted)' }}>
                Tokens will be created as <code style={{ fontFamily: 'monospace' }}>--color-{slug}-50</code> → <code style={{ fontFamily: 'monospace' }}>--color-{slug}-950</code>
              </p>
            )}
          </div>
        </div>
      )}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '8px 12px', background: 'var(--ed-bg-subtle)', borderRadius: '6px', fontSize: '12px', color: 'var(--ed-text-muted)', fontFamily: 'monospace' }}>
            --color-{slug}-* · 11 shades (50–950)
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <EdColorPicker value={baseColor} onChange={setBaseColor} />
            </div>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: baseColor, border: '1px solid var(--ed-border)' }} />
              <p style={{ marginTop: '4px', fontSize: '11px', fontFamily: 'monospace', color: 'var(--ed-text-muted)', textAlign: 'center' }}>{baseColor}</p>
              <p style={{ marginTop: '4px', fontSize: '11px', color: 'var(--ed-text-muted)', textAlign: 'center' }}>500 base</p>
            </div>
          </div>
        </div>
      )}
    </EdDialog>
  )
}

function CategoryPage({ category, tokens, geeklegoTokens, onTokenClick }: CategoryPageProps) {
  const [displayTokens, setDisplayTokens] = useState<TokenEntry[]>([])
  const [tick, setTick] = useState(0)
  const [addTokenDialog, setAddTokenDialog] = useState<{ namePrefix: string; defaultCategory: string } | null>(null)
  const [newPaletteOpen, setNewPaletteOpen] = useState(false)
  const displayCategory = getDisplayCategory(category)
  const meta = getCategoryMeta(category) || defaultMeta
  const architecture = getArchitectureForCategory(category)
  const useScaleView = meta.appliesToScale || shouldUseScaleView(category)

  // Re-render when any staged edit changes so the list reflects live edits
  useEffect(() => {
    return subscribeToPendingChanges(() => setTick(n => n + 1))
  }, [])

  const categoryFilteredTokens = useMemo(() => filterTokensForCategory(tokens, category), [tokens, category])

  useEffect(() => {
    setDisplayTokens(categoryFilteredTokens)
  }, [categoryFilteredTokens])

  // Overlay staged values on top of the original token values, and append new staged tokens
  const stagedTokens = useMemo(() => {
    const staged = getAllStaged()
    const withEdits = displayTokens.map(t => {
      const sv = staged.get(t.name)
      return sv !== undefined ? { ...t, value: sv } : t
    })
    const existingNames = new Set(withEdits.map(t => t.name))
    const filter = categoryFilters[category]
    // Append brand-new tokens staged via stage() that don't exist in the original list.
    // Skip --font-loader-* keys: they're internal staging entries (a JSON {family,axes} that
    // drives fonts.css), NOT user-facing tokens — they must never render as rows.
    for (const [cssName, value] of staged) {
      if (cssName.startsWith(FONT_LOADER_EDIT_PREFIX)) continue
      if (!existingNames.has(cssName) && (!filter || filter(cssName))) {
        withEdits.push({ name: cssName, value })
        existingNames.add(cssName)
      }
    }
    // Append tokens staged via stageNewToken()
    for (const [, newToken] of getStagedNewTokens()) {
      if (!existingNames.has(newToken.cssName) && (!filter || filter(newToken.cssName))) {
        withEdits.push({ name: newToken.cssName, value: newToken.value })
        existingNames.add(newToken.cssName)
      }
    }
    return withEdits
    // tick is a version counter bumped by subscribeToPendingChanges; it re-reads the
    // non-reactive staged store (getAllStaged/getStagedNewTokens). Keep it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayTokens, tick, category])

  const groups = useMemo(() => splitIntoGroups(stagedTokens, category), [stagedTokens, category])

  // Flat name→value map for color resolution — avoids getComputedStyle reading
  // dark-theme overrides from the editor's <html data-theme="dark">
  const tokenMap = useMemo(() => {
    const m = new Map<string, string>()
    for (const t of tokens) m.set(t.name, t.value)
    return m
    // tick forces this map to rebuild when the staged store mutates. Keep it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, tick])

  const handleFilterChange = useCallback((filtered: TokenEntry[]) => {
    setDisplayTokens(filtered)
  }, [])

  return (
    <div className="ed-category-page">
      <EdCard className="ed-category-header">
        <h1 className="ed-category-title">{displayCategory}</h1>
        <p className="ed-category-statement">{meta.statement || 'Category tokens for consistent design.'}</p>
      </EdCard>

      {architecture && <CategoryArchitecturePanel architecture={architecture} />}

      {category !== 'typography-semantic' && categoryFilteredTokens.length > 0 && (
        <FilterBar allTokens={categoryFilteredTokens} onFilterChange={handleFilterChange} category={category} />
      )}

      {category === 'color' && (
        <button
          onClick={() => setNewPaletteOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 16px', width: '100%',
            background: 'transparent', border: '1px dashed var(--ed-border)',
            borderRadius: '8px', color: 'var(--ed-text-muted)',
            fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.color = 'var(--ed-accent)'
            el.style.borderColor = 'var(--ed-accent)'
            el.style.background = 'var(--ed-accent-tint)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.color = 'var(--ed-text-muted)'
            el.style.borderColor = 'var(--ed-border)'
            el.style.background = 'transparent'
          }}
        >
          <span style={{ fontSize: '18px', lineHeight: 1, fontWeight: 300 }}>+</span>
          New color palette
        </button>
      )}

      <EdCard className="ed-category-content" style={{ '--ed-card-padding': '0' } as React.CSSProperties}>
        {category === 'typography-semantic' && geeklegoTokens ? (
          <TypographyScaleView geeklegoTokens={geeklegoTokens} onTokenClick={onTokenClick} />
        ) : Object.keys(groups).length === 0 ? (
          <div className="ed-category-empty">No tokens found in this category</div>
        ) : (
          <div className="ed-category-groups">
            {Object.entries(groups).map(([groupName, groupTokens]) => {
              if (groupTokens.length === 0) return null
              const colorFamily = category === 'color'
                ? groupName.toLowerCase().replace(/\s+/g, '-')
                : undefined
              return (
                <CategoryGroup
                  key={groupName}
                  groupName={groupName}
                  tokens={groupTokens}
                  scaleView={useScaleView}
                  category={category}
                  onTokenClick={onTokenClick}
                  colorFamily={colorFamily}
                  tokenMap={tokenMap}
                  onAddToken={colorFamily ? undefined : () => setAddTokenDialog({
                    namePrefix: groupNameToPrefix(category, groupName),
                    defaultCategory: category,
                  })}
                />
              )
            })}
          </div>
        )}
      </EdCard>
      {geeklegoTokens && addTokenDialog && (
        <AddTokenDialog
          isOpen={addTokenDialog !== null}
          onClose={() => setAddTokenDialog(null)}
          geeklegoTokens={geeklegoTokens}
          defaultNamePrefix={addTokenDialog.namePrefix}
          defaultCategory={addTokenDialog.defaultCategory}
        />
      )}
      <NewPaletteDialog
        isOpen={newPaletteOpen}
        onClose={() => setNewPaletteOpen(false)}
        existingFamilies={Object.keys(groups).map(g => g.toLowerCase().replace(/\s+/g, '-'))}
      />
    </div>
  )
}

export default CategoryPage
