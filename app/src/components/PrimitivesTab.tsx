import { useState } from 'react'
import type { Primitives, PrimitiveSection } from '../types.ts'
import { getContrastColor, generateOklchScale, remToPxDisplay, pxInputToRem } from '../utils/colorUtils.ts'
import ColorPicker from './ColorPicker.tsx'

interface Props {
  primitives: Primitives
  onChange: (updated: Primitives) => void
  section?: PrimitiveSection
  showDeprecated?: boolean
}

type EditingColor = { family: string; shade: string; x: number; y: number }

// ─── Shared row component ─────────────────────────────────────────────────────

function TokenRow({
  label,
  value,
  onValue,
  onDelete,
  preview,
  displayAsPx,
  displayAsColor,
  tokenPath,
  shouldShow,
}: {
  label: string
  value: string
  onValue: (v: string) => void
  onDelete: () => void
  preview?: React.ReactNode
  displayAsPx?: boolean
  displayAsColor?: boolean
  tokenPath: string
  shouldShow: boolean
}) {
  const displayValue = displayAsPx ? remToPxDisplay(value) : value

  // Skip rendering if token is deprecated and showDeprecated is false
  if (!shouldShow) {
    return null
  }

  return (
    <div
      className="flex items-center gap-3 px-4 group transition-colors"
      style={{ minHeight: 40, borderRadius: 8 }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
            {preview}
      {displayAsColor ? (
        <div
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: value,
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
            }}
          />
        </div>
      ) : (
        <span
          className="font-mono flex-shrink-0"
          style={{ width: 144, fontSize: 11, color: '#6b7280' }}
        >{label}</span>
      )}
      <input
        value={displayValue}
        onChange={e => onValue(displayAsPx ? pxInputToRem(e.target.value, value) : e.target.value)}
        className="gl-input flex-1"
        style={{ fontSize: 12, padding: '4px 10px' }}
      />
      {displayAsColor && (
        <span className="font-mono flex-shrink-0" style={{ fontSize: 10, color: '#3f3f3f', width: 100 }}>{value}</span>
      )}
      {displayAsPx && value.endsWith('rem') && (
        <span className="font-mono flex-shrink-0" style={{ fontSize: 10, color: '#3f3f3f', width: 60 }}>{value}</span>
      )}
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

// ─── Add row ──────────────────────────────────────────────────────────────────

function AddRow({
  onAdd,
  displayAsColor,
  keyPlaceholder = 'name',
  valuePlaceholder = 'value',
}: {
  onAdd: (key: string, value: string) => void
  displayAsColor?: boolean
  keyPlaceholder?: string
  valuePlaceholder?: string
}) {
  const [k, setK] = useState('')
  const [v, setV] = useState('#6366f1')  // Default color value
  const [showColorPicker, setShowColorPicker] = useState(false)

  if (displayAsColor) {
    return (
      <div
        className="flex items-center gap-2 px-4 py-2.5 mt-1"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <input
          placeholder={keyPlaceholder}
          value={k}
          onChange={e => setK(e.target.value)}
          className="gl-input"
          style={{ width: 112 }}
        />
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <input
            type="color"
            value={v}
            onChange={e => setV(e.target.value)}
            onClick={() => setShowColorPicker(!showColorPicker)}
            style={{
              width: 40,
              height: 32,
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          />
          {showColorPicker && (
            <div className="fixed" style={{
              left: 300,
              top: 250,
              zIndex: 100,
              background: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: 12,
            }}>
              <input
                type="color"
                value={v}
                onChange={e => setV(e.target.value)}
                style={{ marginBottom: 8 }}
              />
              <input
                value={v}
                onChange={e => setV(e.target.value)}
                className="gl-input"
                style={{ width: 200 }}
              />
            </div>
          )}
        </div>
        <span className="font-mono" style={{ fontSize: 11, color: '#6b7280', width: 100 }}>{v}</span>
        <button
          onClick={() => { if (k && v) { onAdd(k, v); setK(''); setV('#6366f1'); setShowColorPicker(false) } }}
          className="gl-btn-primary flex-shrink-0"
          style={{ padding: '5px 14px' }}
        >Add</button>
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 mt-1"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
    >
      <input
        placeholder={keyPlaceholder}
        value={k}
        onChange={e => setK(e.target.value)}
        className="gl-input"
        style={{ width: 112 }}
      />
      <input
        placeholder={valuePlaceholder}
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

// ─── Section: Colors ──────────────────────────────────────────────────────────

function ColorsSection({ primitives, onChange }: Props) {
  const [editing, setEditing] = useState<EditingColor | null>(null)
  const [editingBase, setEditingBase] = useState<{ family: string; x: number; y: number } | null>(null)
  const [renamingFamily, setRenamingFamily] = useState<string | null>(null)
  const [newFamilyName, setNewFamilyName] = useState('')

  const handleShadeChange = (family: string, shade: string, hex: string) => {
    onChange({ ...primitives, colors: { ...primitives.colors, [family]: { ...primitives.colors[family], [shade]: hex } } })
  }

  const regenerateScale = (family: string) => {
    const shades = primitives.colors[family]
    const baseHex = shades['500'] || shades[Object.keys(shades)[Math.floor(Object.keys(shades).length / 2)]]
    if (!baseHex) return
    const includeZero = '0' in shades
    const newScale = generateOklchScale(baseHex, includeZero)
    onChange({ ...primitives, colors: { ...primitives.colors, [family]: newScale } })
  }

  const deleteFamily = (family: string) => {
    const { [family]: _, ...rest } = primitives.colors
    onChange({ ...primitives, colors: rest as typeof primitives.colors })
  }

  const renameFamily = (oldName: string, newName: string) => {
    if (!newName || newName === oldName) { setRenamingFamily(null); return }
    const entries = Object.entries(primitives.colors)
    const idx = entries.findIndex(([k]) => k === oldName)
    entries[idx] = [newName, entries[idx][1]]
    onChange({ ...primitives, colors: Object.fromEntries(entries) as typeof primitives.colors })
    setRenamingFamily(null)
  }

  const addFamily = (name: string, baseHex: string) => {
    const scale = generateOklchScale(baseHex)
    onChange({ ...primitives, colors: { ...primitives.colors, [name]: scale } as typeof primitives.colors })
  }

  return (
    <div className="space-y-4">
      {Object.entries(primitives.colors).map(([family, shades]) => (
        <div key={family} className="gl-card overflow-hidden">
          {/* Family header — three zones */}
          <div
            className="flex items-center px-5 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', gap: 12, minWidth: 0 }}
          >
            {/* ── LEFT: Identity ───────────────────────────────── */}
            {renamingFamily === family ? (
              <input
                autoFocus
                defaultValue={family}
                onChange={e => setNewFamilyName(e.target.value)}
                onBlur={() => renameFamily(family, newFamilyName || family)}
                onKeyDown={e => { if (e.key === 'Enter') renameFamily(family, newFamilyName || family) }}
                className="bg-transparent text-sm font-semibold text-white focus:outline-none"
                style={{ borderBottom: '1px solid #6366f1', minWidth: 80 }}
              />
            ) : (
              <button
                title="Click to rename"
                className="text-sm font-semibold capitalize transition-colors flex-shrink-0"
                style={{ minWidth: 0, color: '#e5e7eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onClick={() => { setRenamingFamily(family); setNewFamilyName(family) }}
                onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
                onMouseLeave={e => (e.currentTarget.style.color = '#e5e7eb')}
              >{family}</button>
            )}

            {/* ── CENTER: Base color + Regen (primary workflow) ── */}
            {(() => {
              const baseKey = '500' in shades ? '500' : Object.keys(shades)[Math.floor(Object.keys(shades).length / 2)]
              const baseHex = shades[baseKey]
              return baseHex ? (
                <div
                  className="flex items-center"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 10,
                    padding: '4px 6px 4px 6px',
                    gap: 7,
                    flexShrink: 0,
                  }}
                >
                  {/* Swatch — opens custom color picker */}
                  <div
                    style={{ position: 'relative', width: 22, height: 22, flexShrink: 0, cursor: 'pointer' }}
                    onClick={e => {
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                      setEditingBase({ family, x: rect.left, y: rect.bottom + 8 })
                    }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: 5,
                      background: baseHex,
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
                    }} />
                    {editingBase?.family === family && (
                      <div className="fixed" style={{ left: Math.min(editingBase.x, window.innerWidth - 280), top: editingBase.y, zIndex: 100 }}>
                        <ColorPicker
                          hex={baseHex}
                          onChange={newHex => handleShadeChange(family, baseKey, newHex)}
                          onClose={() => setEditingBase(null)}
                        />
                      </div>
                    )}
                  </div>
                  {/* Hex */}
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#6b7280', userSelect: 'none', letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
                    {baseHex.toUpperCase()}
                  </span>
                  {/* Regen — primary CTA */}
                  <button
                    onClick={() => regenerateScale(family)}
                    title="Regenerate full scale from this base color"
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      padding: '3px 9px',
                      borderRadius: 7,
                      cursor: 'pointer',
                      background: 'linear-gradient(to bottom, #6466f3, #4f51d9)',
                      color: 'white',
                      border: 'none',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 6px rgba(99,102,241,0.3)',
                      transition: 'opacity 0.15s',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >↻ Regen</button>
                </div>
              ) : null
            })()}

            {/* ── RIGHT: Metadata + destructive ────────────────── */}
            <div className="ml-auto flex items-center gap-2" style={{ flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: '#3a3a3a', whiteSpace: 'nowrap' }}>{Object.keys(shades).length} shades</span>
              <button
                onClick={() => deleteFamily(family)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  fontSize: 11, padding: '2px 8px', borderRadius: 6,
                  color: '#4b5563', cursor: 'pointer', background: 'none', border: 'none',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = '#f87171'
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.08)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = '#4b5563'
                  ;(e.currentTarget as HTMLElement).style.background = 'none'
                }}
              >✕ remove</button>
            </div>
          </div>

          {/* Shade swatches */}
          <div className="flex p-4 gap-2 flex-wrap">
            {Object.entries(shades).map(([shade, hex]) => {
              const text = getContrastColor(hex)
              return (
                <div key={shade} className="flex flex-col items-center gap-1.5">
                  <div
                    className="relative cursor-pointer transition-all"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: hex,
                      border: '2px solid transparent',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                    }}
                    onClick={e => {
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                      setEditing({ family, shade, x: rect.left, y: rect.bottom + 8 })
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
                  >
                    {editing?.family === family && editing.shade === shade && (
                      <div
                        className="fixed"
                        style={{ left: Math.min(editing.x, window.innerWidth - 280), top: editing.y, zIndex: 100 }}
                      >
                        <ColorPicker
                          hex={hex}
                          onChange={newHex => handleShadeChange(family, shade, newHex)}
                          onClose={() => setEditing(null)}
                        />
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 10, color: '#525252', fontFamily: 'monospace' }}>{shade}</span>
                  <span style={{ fontSize: 9, color: '#3f3f3f', fontFamily: 'monospace' }}>{hex.toUpperCase()}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Add new family */}
      <div
        className="rounded-2xl p-5 transition-all"
        style={{
          border: '1px dashed rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.01)',
        }}
      >
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12, fontWeight: 500 }}>Add color family</p>
        <AddColorFamily onAdd={addFamily} />
      </div>
    </div>
  )
}

function AddColorFamily({ onAdd }: { onAdd: (name: string, baseHex: string) => void }) {
  const [name, setName] = useState('')
  const [baseHex, setBaseHex] = useState('#6366f1')
  const [showPicker, setShowPicker] = useState(false)
  const [pickerPos, setPickerPos] = useState({ x: 0, y: 0 })
  return (
    <div className="flex items-center gap-2">
      <input
        placeholder="family name (e.g. purple)"
        value={name}
        onChange={e => setName(e.target.value)}
        className="gl-input flex-1"
      />
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div
          style={{
            width: 38, height: 38, borderRadius: 8, background: baseHex,
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)',
            cursor: 'pointer',
          }}
          onClick={e => {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
            setPickerPos({ x: rect.left, y: rect.bottom + 8 })
            setShowPicker(v => !v)
          }}
        />
        {showPicker && (
          <div className="fixed" style={{ left: Math.min(pickerPos.x, window.innerWidth - 280), top: pickerPos.y, zIndex: 100 }}>
            <ColorPicker
              hex={baseHex}
              onChange={setBaseHex}
              onClose={() => setShowPicker(false)}
            />
          </div>
        )}
      </div>
      <span className="font-mono" style={{ fontSize: 11, color: '#6b7280', width: 70 }}>{baseHex}</span>
      <button
        onClick={() => { if (name) { onAdd(name, baseHex); setName('') } }}
        className="gl-btn-primary flex-shrink-0"
        style={{ whiteSpace: 'nowrap' }}
      >Generate scale</button>
    </div>
  )
}

// ─── Section: Typography ──────────────────────────────────────────────────────

function TypographySection({ primitives, onChange, showDeprecated = true }: Props) {
  const sub = (
    label: string,
    description: string,
    data: Record<string, string | number>,
    onData: (d: Record<string, string | number>) => void,
    displayAsPx?: boolean,
    keyPlaceholder?: string,
    valuePlaceholder?: string,
  ) => (
    <div className="mb-7">
      <h3
        className="px-4 mb-1"
        style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4b5563' }}
      >{label}</h3>
      <p className="px-4 mb-3" style={{ fontSize: 11, color: '#52525b', lineHeight: 1.5, marginTop: 2 }}>
        {description}
      </p>
      <div>
        {Object.entries(data).map(([k, v]) => (
          <TokenRow
            key={k}
            label={k}
            value={String(v)}
            onValue={nv => onData({ ...data, [k]: nv })}
            onDelete={() => { const { [k]: _, ...rest } = data; onData(rest) }}
            displayAsPx={displayAsPx}
            tokenPath={`${label}.${k}`}
            shouldShow={showDeprecated}
          />
        ))}
        <AddRow onAdd={(k, v) => onData({ ...data, [k]: v })} keyPlaceholder={keyPlaceholder} valuePlaceholder={valuePlaceholder} />
      </div>
    </div>
  )

  return (
    <div>
      {sub('Font Family', 'The typefaces used for body text, headings, and code.', primitives.fontFamily as Record<string, string | number>, d => onChange({ ...primitives, fontFamily: d as Record<string, string> }), undefined, 'e.g. serif', 'e.g. Georgia, serif')}
      {sub('Font Size', 'The type size scale. Values are in rem (e.g. 1rem = 16px).', primitives.fontSize as Record<string, string | number>, d => onChange({ ...primitives, fontSize: d as Record<string, string> }), true, 'e.g. 18', 'e.g. 1.125rem')}
      {sub('Font Weight', 'Numeric weight values for thin, regular, bold, and other text weights.', primitives.fontWeight as Record<string, string | number>, d => onChange({ ...primitives, fontWeight: d as Record<string, number> }), undefined, 'e.g. black', 'e.g. 900')}
      {sub('Line Height', 'Vertical spacing between lines of text.', primitives.lineHeight as Record<string, string | number>, d => onChange({ ...primitives, lineHeight: d as Record<string, string> }), true, 'e.g. ultra', 'e.g. 1.1')}
      {sub('Letter Spacing', 'Horizontal spacing between individual characters.', primitives.letterSpacing as Record<string, string | number>, d => onChange({ ...primitives, letterSpacing: d as Record<string, string> }), true, 'e.g. ultra-wide', 'e.g. 0.15em')}
    </div>
  )
}

// ─── Section: Simple token group ─────────────────────────────────────────────

function SimpleSection({
  label,
  description,
  data,
  onChange,
  preview,
  displayAsPx,
  displayAsColor,
  onlyValues,
  showDeprecated = true,
  keyPlaceholder,
  valuePlaceholder,
}: {
  label: string
  description?: string
  data: Record<string, string | number>
  onChange: (d: Record<string, string | number>) => void
  preview?: (k: string, v: string | number) => React.ReactNode
  displayAsPx?: boolean
  displayAsColor?: boolean
  onlyValues?: boolean
  showDeprecated?: boolean
  keyPlaceholder?: string
  valuePlaceholder?: string
}) {
  return (
    <div>
      <h3
        className="px-4 mb-1"
        style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4b5563' }}
      >{label}</h3>
      {description && (
        <p className="px-4 mb-3" style={{ fontSize: 11, color: '#52525b', lineHeight: 1.5, marginTop: 2 }}>
          {description}
        </p>
      )}
      <div>
        {Object.entries(data).map(([k, v]) => {
          if (onlyValues && !k.startsWith('stagger')) return null;
          return (
            <TokenRow
              key={k}
              label={k}
              value={String(v)}
              onValue={nv => onChange({ ...data, [k]: nv })}
              onDelete={() => { const { [k]: _, ...rest } = data; onChange(rest) }}
              preview={preview?.(k, v)}
              displayAsPx={displayAsPx}
              displayAsColor={displayAsColor}
              tokenPath={`${label}.${k}`}
            shouldShow={showDeprecated}
            />
          );
        })}
        {!onlyValues && <AddRow onAdd={(k, v) => onChange({ ...data, [k]: v })} displayAsColor={displayAsColor} keyPlaceholder={keyPlaceholder} valuePlaceholder={valuePlaceholder} />}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PrimitivesTab({ primitives, onChange, section = 'colors', showDeprecated = true }: Props) {
  return (
    <div className="flex h-full">
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {section === 'colors' && (
          <div className="space-y-7">
            <ColorsSection primitives={primitives} onChange={onChange} />
            <SimpleSection
              label="Shadow Color"
              description="The base color used to tint all box shadows."
              data={primitives.colorShadowNeutral ? { default: primitives.colorShadowNeutral } : {}}
              onChange={d => onChange({ ...primitives, colorShadowNeutral: String(d.default ?? '') })}
              displayAsColor
              showDeprecated={showDeprecated}
            />
          </div>
        )}
        {section === 'typography' && (
          <TypographySection primitives={primitives} onChange={onChange} showDeprecated={showDeprecated} />
        )}
        {section === 'spacing' && (
          <SimpleSection
            label="Spacing"
            description="Base spacing values used throughout the layout and components."
            data={primitives.spacing as Record<string, string | number>}
            onChange={d => onChange({ ...primitives, spacing: d as Record<string, string> })}
            displayAsPx
            showDeprecated={showDeprecated}
            keyPlaceholder="e.g. 5"
            valuePlaceholder="e.g. 1.25rem"
            preview={(k, v) => (
              <div
                className="flex-shrink-0 rounded-sm"
                style={{
                  height: 10,
                  width: Math.min(80, parseFloat(String(v)) * 64 + 4),
                  background: 'rgba(99,102,241,0.35)',
                }}
              />
            )}
          />
        )}
        {section === 'sizing' && (
          <SimpleSection label="Icon Scale" description="Sizes for icons across the interface." data={primitives.iconSize as Record<string, string | number>} onChange={d => onChange({ ...primitives, iconSize: d as Record<string, string> })} displayAsPx showDeprecated={showDeprecated} keyPlaceholder="e.g. 3xl" valuePlaceholder="e.g. 2rem" />
        )}
        {section === 'radius' && (
          <SimpleSection
            label="Border Radius"
            description="Corner rounding values used by buttons, cards, and inputs."
            data={primitives.radius as Record<string, string | number>}
            onChange={d => onChange({ ...primitives, radius: d as Record<string, string> })}
            displayAsPx
            showDeprecated={showDeprecated}
            keyPlaceholder="e.g. xl"
            valuePlaceholder="e.g. 1rem"
            preview={(k, v) => (
              <div
                className="flex-shrink-0"
                style={{
                  width: 28,
                  height: 28,
                  border: '1.5px solid rgba(99,102,241,0.5)',
                  borderRadius: String(v) === '9999px' ? '50%' : String(v),
                  background: 'rgba(99,102,241,0.06)',
                }}
              />
            )}
          />
        )}
        {section === 'borders' && (
          <SimpleSection
            label="Border Widths"
            description="Stroke widths for borders and focus rings."
            data={primitives.borderWidth as Record<string, string | number>}
            onChange={d => onChange({ ...primitives, borderWidth: d as Record<string, string> })}
            showDeprecated={showDeprecated}
            preview={(k, v) => (
              <div
                className="flex-shrink-0"
                style={{ width: 28, height: 28, borderStyle: 'solid', borderColor: 'rgba(99,102,241,0.5)', borderWidth: String(v) }}
              />
            )}
          />
        )}
        {section === 'opacity' && (
          <SimpleSection
            label="Opacity"
            description="Transparency levels for overlays, disabled states, and fills."
            data={primitives.opacity as Record<string, string | number>}
            onChange={d => onChange({ ...primitives, opacity: d as Record<string, number> })}
            showDeprecated={showDeprecated}
            preview={(k, v) => (
              <div
                className="flex-shrink-0 rounded"
                style={{ width: 28, height: 20, background: '#6366f1', opacity: Number(v) }}
              />
            )}
          />
        )}
        {section === 'zindex' && (
          <SimpleSection
            label="Z-Index"
            description="Stacking order values controlling which elements appear on top."
            data={primitives.zIndex as Record<string, string | number>}
            onChange={d => onChange({ ...primitives, zIndex: d as Record<string, number> })}
            showDeprecated={showDeprecated}
          />
        )}
        {section === 'motion' && (
          <div className="space-y-7">
            <SimpleSection label="Duration" description="Animation and transition timing values." data={primitives.duration as Record<string, string | number>} onChange={d => onChange({ ...primitives, duration: d as Record<string, string> })} showDeprecated={showDeprecated} />
            <SimpleSection label="Easing" description="Easing curves that control how animations accelerate and decelerate." data={primitives.easing as Record<string, string | number>} onChange={d => onChange({ ...primitives, easing: d as Record<string, string> })} showDeprecated={showDeprecated} />
            <div>
              <h3
                className="px-4 mb-1"
                style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4b5563' }}
              >Animation Stagger</h3>
              <p className="px-4 mb-3" style={{ fontSize: 11, color: '#52525b', lineHeight: 1.5, marginTop: 2 }}>
                Delay offsets used to stagger animations in lists and sequences.
              </p>
              <div>
                {Object.entries((primitives.duration || {}) as Record<string, string | number>).map(([k, v]) => (
                  k.startsWith('stagger') && (
                    <TokenRow
                      key={k}
                      label={k}
                      value={String(v)}
                      onValue={nv => {
                        const updated = { ...primitives.duration, [k]: nv };
                        onChange({ ...primitives, duration: updated as Record<string, string> });
                      }}
                      onDelete={() => {
                        const { [k]: _, ...rest } = primitives.duration || {};
                        onChange({ ...primitives, duration: rest as Record<string, string> });
                      }}
                      displayAsPx
                      tokenPath={`motion.duration.${k}`}
                      shouldShow={showDeprecated}
                    />
                  )
                ))}
                <AddRow
                  onAdd={(k, v) => {
                    if (k.startsWith('stagger')) {
                      const updated = { ...(primitives.duration || {}), [k]: v };
                      onChange({ ...primitives, duration: updated as Record<string, string> });
                    }
                  }}
                  keyPlaceholder="stagger-lg"
                  valuePlaceholder="e.g. 75ms"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
