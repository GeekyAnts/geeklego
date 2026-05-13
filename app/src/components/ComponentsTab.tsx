import { memo, useState } from 'react'
import type { ComponentTokenGroup, ComponentTokenSection, TypographyMapping, TypographyClass } from '../types.ts'
import { detectTokenCategory, getSemanticOptions, detectColorScope } from '../utils/componentTokenParser.ts'

interface Props {
  groups: ComponentTokenGroup[]
  selectedComponent: string | null
  loading: boolean
  typographyClasses: TypographyClass[]
  onChange: (groups: ComponentTokenGroup[]) => void
  onSave: () => void
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
}

// Category badge colors
const CATEGORY_COLORS: Record<string, string> = {
  color: '#6366f1',
  spacing: '#06b6d4',
  size: '#8b5cf6',
  radius: '#f59e0b',
  shadow: '#64748b',
  motion: '#10b981',
  layer: '#f43f5e',
  border: '#64748b',
  'aspect-ratio': '#ec4899',
  unit: '#0ea5e9',
  content: '#14b8a6',
  other: '#4b5675',
}

// Short uppercase label shown in the badge — keeps the 48px chip readable.
const CATEGORY_LABELS: Record<string, string> = {
  'aspect-ratio': 'RATIO',
  content: 'CONTENT',
}

// Sub-scope badge colors for color tokens
const SCOPE_COLORS: Record<string, string> = {
  fill: '#6366f1',
  text: '#06b6d4',
  stroke: '#f59e0b',
  status: '#10b981',
}

// Section header accent colors
const SECTION_ACCENT_COLORS: Record<string, string> = {
  Shared: '#64748b',
  Primary: '#6366f1',
  Secondary: '#8b5cf6',
  Outline: '#06b6d4',
  Ghost: '#a78bfa',
  Destructive: '#ef4444',
  Link: '#3b82f6',
  Disabled: '#6b7280',
  Sizing: '#f59e0b',
  General: '#64748b',
}

const TokenRow = memo(function TokenRow({
  token,
  onChange,
}: {
  token: { name: string; value: string }
  onChange: (value: string) => void
}) {
  const category = detectTokenCategory(token.value)
  const options = getSemanticOptions(category, token.name, token.value)
  const hasOptions = options.length > 0
  const isColor = category === 'color'
  const colorScope = isColor ? detectColorScope(token.name, token.value) : null
  // Datalist (input + suggestions, freeform) is used only for:
  //   • aspect-ratio — user may want a custom ratio like "5/2"
  //   • size/unit with a raw length value (e.g. "1.25rem", "85vh") — user may
  //     want to keep or tweak the raw value while still seeing semantic options
  // Everything else that has options uses a <select> — calc(), rgba(), and
  // var(--…) values all have a well-defined category and a curated dropdown.
  const valueIsRawLength = /^-?\d+(\.\d+)?(rem|px|em|%|vh|vw|vmin|vmax)$/.test(token.value)
  const useDatalist = hasOptions && (category === 'aspect-ratio' || ((category === 'size' || category === 'unit') && valueIsRawLength))
  const useSelect = hasOptions && !useDatalist
  const datalistId = useDatalist ? `dl-${token.name}` : undefined
  const placeholder = category === 'other'
    ? 'raw value (rem, calc(), ratio, color…)'
    : undefined
  const badgeColor = isColor && colorScope ? SCOPE_COLORS[colorScope] : (CATEGORY_COLORS[category] || '#4b5675')
  const badgeLabel = isColor && colorScope ? colorScope : (CATEGORY_LABELS[category] || category)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '5px 16px 5px 28px',
        minHeight: 34,
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Category / scope badge */}
      <span style={{
        fontSize: 9,
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        color: badgeColor,
        background: `${badgeColor}15`,
        padding: '1px 6px',
        borderRadius: 3,
        flexShrink: 0,
        width: 48,
        textAlign: 'center',
      }}>
        {badgeLabel}
      </span>

      {/* Token name */}
      <span style={{
        fontSize: 11,
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
        color: '#c7d2fe',
        whiteSpace: 'nowrap',
        minWidth: 220,
        flexShrink: 0,
      }}>
        {token.name}
      </span>

      {/* Value editor */}
      {useSelect ? (
        <select
          value={token.value}
          onChange={e => onChange(e.target.value)}
          className="gl-select"
          style={{
            flex: 1,
            fontSize: 11,
            minWidth: 0,
          }}
        >
          {/* Show current value first if not in options */}
          {!options.some(o => o.value === token.value) && (
            <option value={token.value}>
              {token.value.replace(/^var\(--[\w]+-/, '').replace(/\)$/, '') || token.value}
            </option>
          )}
          {/* Group options by group label if available */}
          {(() => {
            const hasGroups = options.some(o => o.group)
            if (!hasGroups) {
              return options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))
            }
            const optGroups: Record<string, typeof options> = {}
            for (const o of options) {
              const g = o.group || 'Other'
              if (!optGroups[g]) optGroups[g] = []
              optGroups[g].push(o)
            }
            return Object.entries(optGroups).map(([groupName, items]) => (
              <optgroup key={groupName} label={groupName}>
                {items.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </optgroup>
            ))
          })()}
        </select>
      ) : (
        <>
          <input
            value={token.value}
            onChange={e => onChange(e.target.value)}
            className="gl-input"
            list={datalistId}
            placeholder={placeholder}
            style={{
              flex: 1,
              fontSize: 11,
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
              minWidth: 0,
            }}
          />
          {useDatalist && (
            <datalist id={datalistId}>
              {options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </datalist>
          )}
        </>
      )}
    </div>
  )
})

const SectionGroup = memo(function SectionGroup({
  section,
  defaultOpen,
  onTokenChange,
  filter,
}: {
  section: ComponentTokenSection
  defaultOpen: boolean
  onTokenChange: (tokenIndex: number, value: string) => void
  filter: string
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const accentColor = SECTION_ACCENT_COLORS[section.label] || '#64748b'

  const filteredTokens = filter
    ? section.tokens.filter(t =>
        t.name.toLowerCase().includes(filter.toLowerCase()) ||
        t.value.toLowerCase().includes(filter.toLowerCase())
      )
    : section.tokens

  // Hide entire section if filter produces no matches
  if (filter && filteredTokens.length === 0) return null

  return (
    <div style={{ marginBottom: 2 }}>
      {/* Section header */}
      <button
        onClick={() => setIsOpen(v => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          background: 'rgba(255,255,255,0.015)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          cursor: 'pointer',
          transition: 'background 0.1s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.035)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
      >
        {/* Collapse indicator */}
        <span style={{
          fontSize: 10,
          color: '#3d4660',
          transition: 'transform 0.15s',
          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
          flexShrink: 0,
          width: 12,
          textAlign: 'center',
        }}>
          ▶
        </span>

        {/* Accent dot */}
        <div style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: accentColor,
          flexShrink: 0,
          boxShadow: `0 0 6px ${accentColor}60`,
        }} />

        {/* Section name */}
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.08em',
          color: '#6b7280',
        }}>
          {section.label}
        </span>

        {/* Token count */}
        <span style={{
          fontSize: 10,
          color: '#3f3f3f',
        }}>
          {section.tokens.length}
        </span>
      </button>

      {/* Tokens */}
      {isOpen && (
        <div>
          {filteredTokens.map((token, idx) => {
            const realIdx = section.tokens.indexOf(token)
            return (
              <TokenRow
                key={`${section.label}-${token.name}-${realIdx}`}
                token={token}
                onChange={value => onTokenChange(realIdx, value)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
})

// ─── Typography class grouping ────────────────────────────────────────────────

const TYPO_FAMILY_ORDER = ['Button', 'Label', 'Body', 'Heading', 'Caption', 'Code', 'Display', 'Overline']

function groupTypographyClasses(classes: TypographyClass[]): Record<string, TypographyClass[]> {
  const groups: Record<string, TypographyClass[]> = {}
  for (const cls of classes) {
    const family = TYPO_FAMILY_ORDER.find(f => cls.name.includes(f.toLowerCase())) ?? 'Other'
    if (!groups[family]) groups[family] = []
    groups[family].push(cls)
  }
  return groups
}

function resolveDisplayValue(className: string, prop: keyof TypographyClass, classes: TypographyClass[]): string {
  const cls = classes.find(c => c.name === className)
  if (!cls) return '—'
  const val = cls[prop] as string
  const sizeMatch = val.match(/--font-size-(\d+)/)
  if (sizeMatch) return `${sizeMatch[1]}px`
  const weightMatch = val.match(/--font-weight-(\w+)/)
  if (weightMatch) return weightMatch[1]
  const lineMatch = val.match(/--line-height-(\w+)/)
  if (lineMatch) return lineMatch[1]
  return val
}

const TypographySection = memo(function TypographySection({
  mappings,
  typographyClasses,
  onChange,
}: {
  mappings: TypographyMapping[]
  typographyClasses: TypographyClass[]
  onChange: (updated: TypographyMapping[]) => void
}) {
  const [isOpen, setIsOpen] = useState(true)
  const grouped = groupTypographyClasses(typographyClasses)

  return (
    <div style={{ marginBottom: 2 }}>
      {/* Section header */}
      <button
        onClick={() => setIsOpen(v => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          background: 'rgba(255,255,255,0.015)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          cursor: 'pointer',
          transition: 'background 0.1s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.035)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
      >
        <span style={{
          fontSize: 10,
          color: '#3d4660',
          transition: 'transform 0.15s',
          transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
          flexShrink: 0,
          width: 12,
          textAlign: 'center',
        }}>▶</span>
        <div style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#f97316',
          flexShrink: 0,
          boxShadow: '0 0 6px #f9731660',
        }} />
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.08em',
          color: '#6b7280',
        }}>Typography</span>
        <span style={{ fontSize: 10, color: '#3f3f3f' }}>{mappings.length}</span>
      </button>

      {/* Table */}
      {isOpen && (
        <div>
          {/* Column headers */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '4px 16px 4px 28px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}>
            <span style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#2d3442', width: 48, flexShrink: 0 }}>Size</span>
            <span style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#2d3442', flex: 1 }}>Class</span>
            <span style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#2d3442', width: 72, flexShrink: 0 }}>font-size</span>
            <span style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#2d3442', width: 80, flexShrink: 0 }}>weight</span>
            <span style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#2d3442', width: 72, flexShrink: 0 }}>line-height</span>
          </div>

          {mappings.map((mapping, idx) => (
            <div
              key={mapping.size}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '5px 16px 5px 28px',
                minHeight: 34,
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Size badge */}
              <span style={{
                fontSize: 9,
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
                color: '#f97316',
                background: '#f9731615',
                padding: '1px 6px',
                borderRadius: 3,
                flexShrink: 0,
                width: 48,
                textAlign: 'center',
              }}>{mapping.size}</span>

              {/* Class dropdown */}
              <select
                value={mapping.className}
                onChange={e => {
                  const updated = mappings.map((m, i) =>
                    i === idx ? { ...m, className: e.target.value } : m
                  )
                  onChange(updated)
                }}
                className="gl-select"
                style={{ flex: 1, fontSize: 11, minWidth: 0 }}
              >
                {!typographyClasses.some(c => c.name === mapping.className) && (
                  <option value={mapping.className}>{mapping.className}</option>
                )}
                {Object.entries(grouped).map(([family, items]) => (
                  <optgroup key={family} label={family}>
                    {items.map(cls => (
                      <option key={cls.name} value={cls.name}>{cls.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>

              {/* Resolved read-only columns */}
              <span style={{ fontSize: 10, color: '#6b7280', width: 72, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                {resolveDisplayValue(mapping.className, 'fontSize', typographyClasses)}
              </span>
              <span style={{ fontSize: 10, color: '#6b7280', width: 80, flexShrink: 0 }}>
                {resolveDisplayValue(mapping.className, 'fontWeight', typographyClasses)}
              </span>
              <span style={{ fontSize: 10, color: '#6b7280', width: 72, flexShrink: 0 }}>
                {resolveDisplayValue(mapping.className, 'lineHeight', typographyClasses)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

export default function ComponentsTab({ groups, selectedComponent, loading, typographyClasses, onChange, onSave, saveStatus }: Props) {
  const [filter, setFilter] = useState('')

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#4b5675',
        fontSize: 13,
      }}>
        Loading component tokens...
      </div>
    )
  }

  if (groups.length === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#2d3442',
        fontSize: 13,
        fontStyle: 'italic',
        padding: 40,
        textAlign: 'center',
      }}>
        No component tokens found. Component tokens are generated when components are created using the component builder skill.
      </div>
    )
  }

  const group = groups.find(g => g.componentName === selectedComponent)
  if (!group) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#4b5675',
        fontSize: 13,
      }}>
        Select a component from the sidebar
      </div>
    )
  }

  const totalTokens = group.sections.reduce((sum, s) => sum + s.tokens.length, 0)

  function handleSectionTokenChange(sectionIndex: number, tokenIndex: number, newValue: string) {
    const updatedGroups = groups.map(g => {
      if (g.componentName !== selectedComponent) return g
      return {
        ...g,
        sections: g.sections.map((s, si) => {
          if (si !== sectionIndex) return s
          return {
            ...s,
            tokens: s.tokens.map((t, ti) =>
              ti === tokenIndex ? { ...t, value: newValue } : t
            ),
          }
        }),
      }
    })
    onChange(updatedGroups)
  }

  function handleTypographyChange(componentName: string, updated: TypographyMapping[]) {
    const updatedGroups = groups.map(g =>
      g.componentName === componentName ? { ...g, typography: updated } : g
    )
    onChange(updatedGroups)
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        flexShrink: 0,
        padding: '12px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>
          {group.componentName}
        </span>
        <span style={{
          fontSize: 10,
          color: '#4b5675',
          background: 'rgba(255,255,255,0.05)',
          padding: '2px 8px',
          borderRadius: 4,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {totalTokens} tokens · {group.sections.length} sections
        </span>
        <span style={{ fontSize: 10, color: '#2d3442' }}>
          generated {group.generatedDate}
        </span>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Filter */}
        <input
          placeholder="Filter tokens..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="gl-input"
          style={{ width: 160, fontSize: 11 }}
        />

        {/* Save button */}
        <button
          onClick={onSave}
          disabled={saveStatus === 'saving'}
          className="gl-btn-primary"
          style={{
            fontSize: 11,
            padding: '5px 14px',
            ...(saveStatus === 'saved' ? {
              background: 'linear-gradient(to bottom, #22c55e, #16a34a)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(34,197,94,0.3)',
            } : saveStatus === 'error' ? {
              background: 'linear-gradient(to bottom, #ef4444, #dc2626)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(239,68,68,0.3)',
            } : saveStatus === 'saving' ? {
              opacity: 0.7,
            } : {}),
          }}
        >
          {saveStatus === 'saving' ? 'Saving...'
            : saveStatus === 'saved' ? 'Saved'
            : saveStatus === 'error' ? 'Error'
            : 'Save to CSS'}
        </button>
      </div>

      {/* Sections */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
        {group.sections.map((section, sectionIdx) => (
          <SectionGroup
            key={section.label}
            section={section}
            defaultOpen={group.sections.length <= 3 || sectionIdx === 0}
            onTokenChange={(tokenIdx, value) => handleSectionTokenChange(sectionIdx, tokenIdx, value)}
            filter={filter}
          />
        ))}

        {/* Typography section — shown when component has size→class mappings */}
        {group.typography && group.typography.length > 0 && !filter && (
          <TypographySection
            mappings={group.typography}
            typographyClasses={typographyClasses}
            onChange={updated => handleTypographyChange(group.componentName, updated)}
          />
        )}
      </div>
    </div>
  )
}
