import { useState } from 'react'
import type { GeeklegoTokens, ThemeMode, SemanticBlock } from '../types.ts'
import { resolveColorRef, parseColorRef, makeColorRef } from '../utils/colorUtils.ts'

interface Props {
  tokens: GeeklegoTokens
  onChange: (updated: GeeklegoTokens) => void
  mode: ThemeMode
  showDeprecated?: boolean
}

// Build list of all available color options from primitives
function getColorOptions(colors: Record<string, Record<string, string>>) {
  const options: { label: string; value: string; hex: string }[] = []
  for (const [family, shades] of Object.entries(colors)) {
    for (const [shade, hex] of Object.entries(shades)) {
      options.push({ label: `${family}-${shade}`, value: makeColorRef(family, shade), hex })
    }
  }
  return options
}

// Build list of spacing options
function getSpacingOptions(spacing: Record<string, string>) {
  return Object.keys(spacing).map(k => ({ label: `spacing-${k}`, value: `var(--spacing-${k})` }))
}

function getRadiusOptions(radius: Record<string, string>) {
  return Object.keys(radius).map(k => ({ label: `radius-${k}`, value: `var(--radius-${k})` }))
}

function getZIndexOptions(zIndex: Record<string, number>) {
  return Object.keys(zIndex).map(k => ({ label: `z-index-${k}`, value: `var(--z-index-${k})` }))
}

function getDurationOptions(duration: Record<string, string>) {
  return Object.keys(duration).map(k => ({ label: `duration-${k}`, value: `var(--duration-${k})` }))
}

function getEasingOptions(easing: Record<string, string>) {
  return Object.keys(easing).map(k => ({ label: `ease-${k}`, value: `var(--ease-${k})` }))
}

// ─── Color token row ──────────────────────────────────────────────────────────

function ColorTokenRow({
  name,
  value,
  colors,
  onChange,
  onDelete,
  tokenPath,
}: {
  name: string
  value: string
  colors: Record<string, Record<string, string>>
  onChange: (v: string) => void
  onDelete: () => void
  tokenPath: string
}) {
  const options = getColorOptions(colors)
  const hex = resolveColorRef(value, colors)
  const parsed = parseColorRef(value)

  // Check if this is a color-mix token that needs special handling
  const isColorMix = name === '--color-surface-overlay-backdrop'

  return (
    <div
      className="flex items-center gap-3 px-5 group transition-colors"
      style={{ minHeight: 38 }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      
      {/* Swatch */}
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          background: hex || '#222',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)',
          flexShrink: 0,
        }}
        title={hex || 'unresolved'}
      />

      {/* Token name */}
      <span
        className="font-mono flex-shrink-0"
        style={{ width: 172, fontSize: 11, color: '#6b7280' }}
      >{name}</span>

      {/* Dropdown */}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="gl-select flex-1"
        style={{ fontSize: 11 }}
      >
        <option value={value}>{parsed ? `${parsed.family}-${parsed.shade}` : value}</option>
        {options
          .filter(o => o.value !== value)
          .map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
      </select>

      {/* Hex value or color-mix display */}
      {isColorMix ? (
        <span
          className="font-mono flex-shrink-0"
          style={{ width: 76, fontSize: 10, color: '#3f3f3f' }}
        >color-mix()</span>
      ) : (
        <span
          className="font-mono flex-shrink-0"
          style={{ width: 76, fontSize: 10, color: '#3f3f3f' }}
        >{hex?.toUpperCase() || '—'}</span>
      )}

      <button
        onClick={onDelete}
        aria-label="Remove token"
        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-1 flex-shrink-0"
        style={{ color: '#6b7280', cursor: 'pointer', background: 'none', border: 'none' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
        onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
      >✕</button>
    </div>
  )
}

// ─── Ref token row (for non-color tokens) ─────────────────────────────────────

function RefTokenRow({
  name,
  value,
  options,
  onChange,
  onDelete,
}: {
  name: string
  value: string
  options: { label: string; value: string }[]
  onChange: (v: string) => void
  onDelete: () => void
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-1.5 group transition-colors"
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <span
        className="font-mono flex-shrink-0"
        style={{ width: 140, fontSize: 11, color: '#6b7280' }}
      >{name}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="gl-select flex-1"
        style={{ fontSize: 11 }}
      >
        <option value={value}>{value}</option>
        {options.filter(o => o.value !== value).map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <button
        onClick={onDelete}
        aria-label="Remove token"
        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-1 flex-shrink-0"
        style={{ color: '#6b7280', cursor: 'pointer', background: 'none', border: 'none' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
        onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
      >✕</button>
    </div>
  )
}

// ─── Color group section ──────────────────────────────────────────────────────

const GROUP_COLORS: Record<string, string> = {
  Background:    '#6366f1',
  Surface:       '#8b5cf6',
  Text:          '#06b6d4',
  Border:        '#64748b',
  Action:        '#f59e0b',
  Status:        '#10b981',
  State:         '#f43f5e',
  'Data Series': '#22d3ee',
}

function ColorGroup({
  title,
  prefix,
  group,
  colors,
  onGroup,
}: {
  title: string
  prefix: string
  group: Record<string, string>
  colors: Record<string, Record<string, string>>
  onGroup: (g: Record<string, string>) => void
}) {
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState(() => {
    const firstFamily = Object.keys(colors)[0]
    const firstShade = Object.keys(colors[firstFamily] ?? {})[0]
    return makeColorRef(firstFamily, firstShade)
  })
  const colorOptions = getColorOptions(colors)
  const accentColor = GROUP_COLORS[title] || '#6366f1'

  return (
    <div className="mb-1">
      {/* Group header */}
      <div
        className="flex items-center gap-3 px-5 py-2.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.015)' }}
      >
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: accentColor, flexShrink: 0, boxShadow: `0 0 6px ${accentColor}80` }} />
        <h3 style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280' }}>{title}</h3>
        <span style={{ fontSize: 10, color: '#3f3f3f' }}>{Object.keys(group).length} tokens</span>
      </div>

      {Object.entries(group).map(([k, v]) => (
        <ColorTokenRow
          key={k}
          name={`--color-${prefix}-${k}`}
          value={v}
          colors={colors}
          onChange={nv => onGroup({ ...group, [k]: nv })}
          onDelete={() => { const { [k]: _, ...rest } = group; onGroup(rest) }}
          tokenPath={`semantics.color.${prefix}.${k}`}
        />
      ))}

      {/* Add token */}
      <div
        className="flex items-center gap-2 px-5 py-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <input
          placeholder="e.g. primary"
          value={newKey}
          onChange={e => setNewKey(e.target.value)}
          className="gl-input"
          style={{ width: 120, fontSize: 11 }}
        />
        <select
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          className="gl-select flex-1"
          style={{ fontSize: 11 }}
        >
          {colorOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button
          onClick={() => {
            if (newKey) { onGroup({ ...group, [newKey]: newValue }); setNewKey('') }
          }}
          style={{
            fontSize: 12,
            color: '#818cf8',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            padding: '2px 4px',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#a5b4fc')}
          onMouseLeave={e => (e.currentTarget.style.color = '#818cf8')}
        >+ add</button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SemanticsTab({ tokens, onChange, mode }: Props) {
  const sem = tokens.semantics
  const colors = tokens.primitives.colors

  function updateLight(patch: Partial<SemanticBlock>) {
    onChange({ ...tokens, semantics: { ...sem, light: { ...sem.light, ...patch } } })
  }

  function updateDark(patch: Partial<SemanticBlock>) {
    onChange({ ...tokens, semantics: { ...sem, dark: { ...sem.dark, ...patch } } })
  }

  const spacingOpts = getSpacingOptions(tokens.primitives.spacing)
  const radiusOpts = getRadiusOptions(tokens.primitives.radius)
  const zIndexOpts = getZIndexOptions(tokens.primitives.zIndex)
  const durationOpts = getDurationOptions(tokens.primitives.duration)
  const easingOpts = getEasingOptions(tokens.primitives.easing)
  const durationKeys = new Set(Object.keys(tokens.primitives.duration))
  const easingKeys = new Set(Object.keys(tokens.primitives.easing))

  const isLight = mode === 'light'

  const update = isLight ? updateLight : updateDark

  // Ensure on-status-solid and info are included by mapping groups to include them
  function addDefaultTokens() {
    const updatedSem = { ...sem.light }

    // Add on-status-solid to Text group
    if (!updatedSem.text?.['on-status-solid']) {
      updatedSem.text = {
        ...updatedSem.text,
        'on-status-solid': 'var(--color-neutral-100)'
      }
    }

    // Add info to Border group
    if (!updatedSem.border?.info) {
      updatedSem.border = {
        ...updatedSem.border,
        info: 'var(--color-info-500)'
      }
    }

    // Ensure colorOverlayBackdrop exists in Surface group
    if (!updatedSem.surface?.['colorOverlayBackdrop']) {
      updatedSem.surface = {
        ...updatedSem.surface,
        colorOverlayBackdrop: 'color-mix(srgb, var(--color-neutral-900) 24%, transparent)'
      }
    }

    return updatedSem
  }

  const activeColors = isLight ? addDefaultTokens() : (sem.dark ?? addDefaultTokens())

  const groups: { title: string; prefix: string; key: keyof SemanticBlock }[] = [
    { title: 'Background',   prefix: 'bg',          key: 'bg' },
    { title: 'Surface',      prefix: 'surface',     key: 'surface' },
    { title: 'Text',         prefix: 'text',        key: 'text' },
    { title: 'Border',       prefix: 'border',      key: 'border' },
    { title: 'Action',       prefix: 'action',      key: 'action' },
    { title: 'Status',       prefix: 'status',      key: 'status' },
    { title: 'State',        prefix: 'state',       key: 'state' },
    { title: 'Data Series',  prefix: 'data-series', key: 'dataSeries' },
  ]

  return (
    <div className="h-full overflow-y-auto">

      {/* ── Color groups ─────────────────────────────────────────────── */}
      <div className="mx-5 my-4 gl-card overflow-hidden">
        {groups.map(g => {
          const groupData = (activeColors as Record<string, Record<string, string>>)[g.key] ?? {}
          if (Object.keys(groupData).length === 0 && mode !== 'light') {
            return (
              <div
                key={g.key}
                className="px-5 py-2"
                style={{ fontSize: 11, color: '#3f3f3f', fontStyle: 'italic', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                {g.title}: inherits from light mode
              </div>
            )
          }
          return (
            <ColorGroup
              key={g.key}
              title={g.title}
              prefix={g.prefix}
              group={groupData}
              colors={colors}
              onGroup={nv => update({ [g.key]: nv } as Partial<SemanticBlock>)}
            />
          )
        })}

      </div>

      {/* ── Non-color semantics (light only) ─────────────────────────── */}
      {mode === 'light' && (
        <div className="mx-5 mb-6">
          {/* Section divider */}
          <div className="flex items-center gap-3 mb-3">
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#3f3f3f', whiteSpace: 'nowrap' as const }}>
              Non-Color Semantics
            </p>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
          </div>

          {/* 2-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <div className="gl-card overflow-hidden">
              <SemRefGroup
                title="Spacing / Component"
                prefix="spacing-component"
                data={sem.light.spacingComponent}
                options={spacingOpts}
                onData={d => updateLight({ spacingComponent: d })}
              />
            </div>
            <div className="gl-card overflow-hidden">
              <SemRefGroup
                title="Spacing / Layout"
                prefix="spacing-layout"
                data={sem.light.spacingLayout}
                options={spacingOpts}
                onData={d => updateLight({ spacingLayout: d })}
              />
            </div>
            <div className="gl-card overflow-hidden">
              <SemRefGroup
                title="Size / Component"
                prefix="size-component"
                data={sem.light.sizeComponent}
                options={spacingOpts}
                onData={d => updateLight({ sizeComponent: d })}
              />
            </div>
            <div className="gl-card overflow-hidden">
              <SemRefGroup
                title="Radius / Component"
                prefix="radius-component"
                data={sem.light.radiusComponent}
                options={radiusOpts}
                onData={d => updateLight({ radiusComponent: d })}
              />
            </div>
            <div className="gl-card overflow-hidden">
              <SemRefGroup
                title="Motion"
                prefix=""
                data={{ ...sem.light.motion.duration, ...sem.light.motion.easing }}
                options={[...durationOpts, ...easingOpts]}
                onData={d => {
                  const duration: Record<string, string> = {}
                  const easing: Record<string, string> = {}
                  for (const [k, v] of Object.entries(d)) {
                    if (durationKeys.has(k)) {
                      duration[k] = v
                    } else if (easingKeys.has(k)) {
                      easing[k] = v
                    }
                  }
                  updateLight({ motion: { duration, easing } })
                }}
              />
            </div>
            <div className="gl-card overflow-hidden">
              <SemRefGroup
                title="Layer"
                prefix="layer"
                data={sem.light.layer}
                options={zIndexOpts}
                onData={d => updateLight({ layer: d })}
              />
            </div>
          </div>

          {/* Borders — full width below grid */}
          <div className="gl-card overflow-hidden mt-3 px-4 py-3">
            <h4
              className="pb-2"
              style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#4b5563' }}
            >Borders</h4>
            {Object.entries(sem.light.borders).map(([k, v]) => (
              <div
                key={k}
                className="flex items-center gap-2 py-1.5 group transition-colors"
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span className="font-mono flex-shrink-0" style={{ width: 180, fontSize: 10, color: '#6b7280' }}>{k}</span>
                <input
                  value={v}
                  onChange={e => updateLight({ borders: { ...sem.light.borders, [k]: e.target.value } })}
                  className="gl-input flex-1"
                  style={{ fontSize: 11 }}
                />
              </div>
            ))}
          </div>

          {/* Icon Semantic — read-only display */}
          <div className="mt-3">
            <SemReadOnlyGroup title="Icon Semantic">
              {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map(size => (
                <IconSemanticRow
                  key={size}
                  name={`--icon-size-${size}`}
                  value="var(--icon-size-*)"
                />
              ))}
            </SemReadOnlyGroup>
          </div>

          {/* Size Fixed — read-only display with resolved values */}
          <div className="mt-3">
            <SemReadOnlyGroup title="Size Fixed">
              {Object.entries(tokens.primitives.spacing).map(([key, value]) => (
                <SizeFixedRow
                  key={key}
                  name={`--spacing-component-${key}`}
                  value={`var(--spacing-${key})`}
                  resolved={parseFloat(value).toFixed(2)}
                />
              ))}
            </SemReadOnlyGroup>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Read-only display row for icon semantics ───────────────────────────────

function IconSemanticRow({ name, value }: { name: string; value: string }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-1.5 group transition-colors"
      style={{ minHeight: 38 }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Token name */}
      <span
        className="font-mono flex-shrink-0"
        style={{ width: 140, fontSize: 11, color: '#6b7280' }}
      >{name}</span>

      {/* Value */}
      <span
        className="font-mono flex-1"
        style={{ fontSize: 11, color: '#3f3f3f' }}
      >{value}</span>

      {/* Link annotation */}
      <span
        className="text-xs px-1 flex-shrink-0"
        style={{ color: '#818cf8' }}
        title="Wrapped from primitive"
      >
        ↗
      </span>
    </div>
  )
}

// ─── Read-only display row for size fixed ─────────────────────────────────────

function SizeFixedRow({ name, value, resolved }: { name: string; value: string; resolved: string }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-1.5 group transition-colors"
      style={{ minHeight: 38 }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent') }
    >
      {/* Token name */}
      <span
        className="font-mono flex-shrink-0"
        style={{ width: 140, fontSize: 11, color: '#6b7280' }}
      >{name}</span>

      {/* Value */}
      <span
        className="font-mono flex-1"
        style={{ fontSize: 11, color: '#3f3f3f' }}
      >{value}</span>

      {/* Resolved value */}
      <span
        className="font-mono flex-shrink-0"
        style={{ width: 80, fontSize: 10, color: '#6b7280' }}
      >{resolved}</span>
    </div>
  )
}

// ─── Shared group component for both icon and size sections ─────────────────

 function SemReadOnlyGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="gl-card overflow-hidden">
      <h4
        className="py-2 px-5"
        style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4b5563', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >{title}</h4>
      {children}
    </div>
  )
}

function SemRefGroup({
  title,
  prefix,
  data,
  options,
  onData,
}: {
  title: string
  prefix: string
  data: Record<string, string>
  options: { label: string; value: string }[]
  onData: (d: Record<string, string>) => void
}) {
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState(options[0]?.value ?? '')

  return (
    <div className="py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <h4
        className="px-5 pb-1.5"
        style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4b5563' }}
      >{title}</h4>
      {Object.entries(data).map(([k, v]) => (
        <RefTokenRow
          key={k}
          name={prefix ? `${prefix}-${k}` : k}
          value={v}
          options={options}
          onChange={nv => onData({ ...data, [k]: nv })}
          onDelete={() => { const { [k]: _, ...rest } = data; onData(rest) }}
        />
      ))}
      <div className="flex items-center gap-2 px-4 py-1.5 mt-0.5">
        <input
          placeholder="e.g. xs"
          value={newKey}
          onChange={e => setNewKey(e.target.value)}
          className="gl-input"
          style={{ width: 80, fontSize: 11 }}
        />
        <select
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          className="gl-select flex-1"
          style={{ fontSize: 11 }}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button
          onClick={() => {
            if (newKey) { onData({ ...data, [newKey]: newValue }); setNewKey('') }
          }}
          style={{
            fontSize: 12,
            color: '#818cf8',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            padding: '2px 4px',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#a5b4fc')}
          onMouseLeave={e => (e.currentTarget.style.color = '#818cf8')}
        >+ add</button>
      </div>
    </div>
  )
}
