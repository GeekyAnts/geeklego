import { useState } from 'react'
import type { ResponsiveOverride } from '../types.ts'

interface Props {
  breakpoints: Record<string, string>
  responsiveOverrides: ResponsiveOverride[]
  onBreakpointsChange: (updated: Record<string, string>) => void
  onOverridesChange: (updated: ResponsiveOverride[]) => void
}

// ─── Shared row ──────────────────────────────────────────────────────────────

function TokenRow({
  label,
  value,
  onValue,
  onDelete,
}: {
  label: string
  value: string
  onValue: (v: string) => void
  onDelete: () => void
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 group transition-colors"
      style={{ minHeight: 40, borderRadius: 8 }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <span
        className="font-mono flex-shrink-0"
        style={{ width: 144, fontSize: 11, color: '#6b7280' }}
      >{label}</span>
      <input
        value={value}
        onChange={e => onValue(e.target.value)}
        className="gl-input flex-1"
        style={{ fontSize: 12, padding: '4px 10px' }}
      />
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-xs px-1 rounded"
        style={{ color: '#6b7280', fontSize: 12, cursor: 'pointer' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
        onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
      >✕</button>
    </div>
  )
}

function AddRow({ onAdd }: { onAdd: (key: string, value: string) => void }) {
  const [k, setK] = useState('')
  const [v, setV] = useState('')
  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 mt-1"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <input
        placeholder="name"
        value={k}
        onChange={e => setK(e.target.value)}
        className="gl-input"
        style={{ width: 112 }}
      />
      <input
        placeholder="value (e.g. 768px)"
        value={v}
        onChange={e => setV(e.target.value)}
        className="gl-input flex-1"
      />
      <button
        onClick={() => { if (k && v) { onAdd(k, v); setK(''); setV('') } }}
        className="gl-btn-primary flex-shrink-0"
        style={{ padding: '5px 14px' }}
      >Add</button>
    </div>
  )
}

// ─── Breakpoints section ─────────────────────────────────────────────────────

function BreakpointsSection({ breakpoints, onChange }: { breakpoints: Record<string, string>; onChange: (b: Record<string, string>) => void }) {
  return (
    <div className="gl-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="font-semibold" style={{ fontSize: 13, color: '#e5e7eb' }}>Breakpoints</span>
        <span style={{ fontSize: 10, color: '#6b7280' }}>Tailwind v4 generates sm: md: lg: xl: 2xl: prefixes</span>
      </div>
      {Object.entries(breakpoints).map(([k, v]) => (
        <TokenRow
          key={k}
          label={`--breakpoint-${k}`}
          value={v}
          onValue={val => onChange({ ...breakpoints, [k]: val })}
          onDelete={() => {
            const { [k]: _, ...rest } = breakpoints
            onChange(rest)
          }}
        />
      ))}
      <AddRow onAdd={(k, v) => onChange({ ...breakpoints, [k]: v })} />
    </div>
  )
}

// ─── Responsive override section ─────────────────────────────────────────────

function OverrideSection({
  override,
  index,
  onChange,
  onDelete,
}: {
  override: ResponsiveOverride
  index: number
  onChange: (updated: ResponsiveOverride) => void
  onDelete: () => void
}) {
  const spacingLayout = override.spacingLayout || {}

  return (
    <div className="gl-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <span className="font-semibold" style={{ fontSize: 13, color: '#e5e7eb' }}>Layout Spacing Override</span>
          <span style={{ fontSize: 10, color: '#6b7280' }}>@media (max-width:</span>
          <input
            value={override.maxWidth}
            onChange={e => onChange({ ...override, maxWidth: e.target.value })}
            className="gl-input"
            style={{ width: 80, fontSize: 11, padding: '2px 6px' }}
          />
          <span style={{ fontSize: 10, color: '#6b7280' }}>)</span>
        </div>
        <button
          onClick={onDelete}
          className="text-xs px-2 py-1 rounded"
          style={{ color: '#6b7280', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
        >Delete override</button>
      </div>

      {Object.entries(spacingLayout).map(([k, v]) => (
        <TokenRow
          key={k}
          label={`--spacing-layout-${k}`}
          value={v}
          onValue={val => onChange({ ...override, spacingLayout: { ...spacingLayout, [k]: val } })}
          onDelete={() => {
            const { [k]: _, ...rest } = spacingLayout
            onChange({ ...override, spacingLayout: rest })
          }}
        />
      ))}
      <AddRow onAdd={(k, v) => onChange({ ...override, spacingLayout: { ...spacingLayout, [k]: v } })} />
    </div>
  )
}

// ─── Main tab ────────────────────────────────────────────────────────────────

export default function ResponsiveTab({ breakpoints, responsiveOverrides, onBreakpointsChange, onOverridesChange }: Props) {
  const addOverride = () => {
    onOverridesChange([...responsiveOverrides, { maxWidth: '767px', spacingLayout: {} }])
  }

  return (
    <div className="space-y-6">
      <div style={{ padding: '0 4px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f3f4f6', marginBottom: 4 }}>Responsive Design</h2>
        <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>
          Configure breakpoints and responsive token overrides. Breakpoints enable Tailwind responsive prefixes (sm:, md:, lg:, etc.).
          Layout spacing overrides scale token values at different viewport widths.
        </p>
      </div>

      <BreakpointsSection breakpoints={breakpoints} onChange={onBreakpointsChange} />

      <div style={{ padding: '0 4px' }}>
        <div className="flex items-center justify-between">
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#e5e7eb' }}>Layout Spacing Overrides</h3>
          <button
            onClick={addOverride}
            className="gl-btn-primary"
            style={{ padding: '5px 14px', fontSize: 12 }}
          >+ Add override</button>
        </div>
        <p style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
          Override --spacing-layout-* tokens at specific max-width breakpoints. Values must be var(--spacing-*) references.
        </p>
      </div>

      {responsiveOverrides.map((override, i) => (
        <OverrideSection
          key={i}
          override={override}
          index={i}
          onChange={updated => {
            const next = [...responsiveOverrides]
            next[i] = updated
            onOverridesChange(next)
          }}
          onDelete={() => onOverridesChange(responsiveOverrides.filter((_, j) => j !== i))}
        />
      ))}

      {responsiveOverrides.length === 0 && (
        <div className="gl-card" style={{ padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#6b7280' }}>No responsive overrides configured. Click "+ Add override" to create one.</p>
        </div>
      )}

      <div className="gl-card" style={{ padding: '16px' }}>
        <h4 style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', marginBottom: 8 }}>Responsive Typography</h4>
        <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.5 }}>
          11 responsive typography classes are auto-generated: .text-display-hero-responsive through .text-heading-h4-responsive.
          These scale down from desktop → tablet ({"<"}1024px) → mobile ({"<"}768px). Original .text-display-* classes remain unchanged.
        </p>
      </div>
    </div>
  )
}
