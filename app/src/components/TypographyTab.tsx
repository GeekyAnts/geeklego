import type { GeeklegoTokens } from '../types.ts'

interface Props {
  tokens: GeeklegoTokens
  onChange: (updated: GeeklegoTokens) => void
  showDeprecated?: boolean
}

// ─── Derived option builders ─────────────────────────────────────────────────
// These replace the old hardcoded static arrays so newly added primitives
// automatically appear in the typography semantics dropdowns.

function getFontSizeOptions(fontSize: Record<string, string>): string[] {
  return Object.keys(fontSize)
    .sort((a, b) => Number(a) - Number(b))
    .map(k => `var(--font-size-${k})`)
}
function getFontWeightOptions(fontWeight: Record<string, number>): string[] {
  return Object.keys(fontWeight).map(k => `var(--font-weight-${k})`)
}
function getLineHeightOptions(lineHeight: Record<string, string>): string[] {
  return Object.keys(lineHeight).map(k => `var(--line-height-${k})`)
}
function getLetterSpacingOptions(letterSpacing: Record<string, string>): string[] {
  return Object.keys(letterSpacing).map(k => `var(--letter-spacing-${k})`)
}

interface PrimitiveOptions {
  fontSizes: string[]
  fontWeights: string[]
  lineHeights: string[]
  letterSpacings: string[]
}

function shortToken(v: string): string {
  return v.replace(/var\(--[\w-]+-/, '').replace(')', '')
}

// Group semantic styles by prefix (display, heading, body, etc.)
function groupTypographyStyles(styles: Record<string, any>): Record<string, string[]> {
  const groups: Record<string, string[]> = {}
  for (const styleKey of Object.keys(styles)) {
    const parts = styleKey.split('-')
    const group = parts[0]
    if (!groups[group]) groups[group] = []
    groups[group].push(styleKey)
  }
  return groups
}

function TypeRow({
  styleKey,
  styleData,
  onUpdate,
  onDelete,
  primitiveOptions,
}: {
  styleKey: string
  styleData: {
    size: string
    weight: string
    leading: string
    tracking: string
  }
  onUpdate: (updated: { size: string; weight: string; leading: string; tracking: string }) => void
  onDelete: () => void
  primitiveOptions: PrimitiveOptions
}) {
  // Resolve numeric weight for preview
  const weightLabel = shortToken(styleData.weight)
  const weightNum =
    weightLabel === 'extrabold' ? 800
    : weightLabel === 'bold' ? 700
    : weightLabel === 'semibold' ? 600
    : weightLabel === 'medium' ? 500
    : weightLabel === 'light' ? 300
    : weightLabel === 'thin' ? 100
    : 400

  const sizeNum = parseInt(styleData.size.replace('var(--font-size-', '').replace(')', ''), 10) || 16

  // Determine if this is a code style based on the key
  const isCode = styleKey.includes('code')

  return (
    <div
      className="overflow-hidden mb-3 group"
      style={{
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'var(--surface-1)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.35)',
      }}
    >
      {/* Preview area */}
      <div
        className="px-6 flex items-center"
        style={{
          minHeight: 72,
          background: 'linear-gradient(to bottom, #0f0f0f, #0a0a0a)',
          fontFamily: isCode ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
          fontSize: `clamp(11px, ${sizeNum}px, 52px)`,
          fontWeight: weightNum,
          color: '#d4d4d4',
          letterSpacing: 'normal',
        }}
      >
        The quick brown fox — {styleKey}
      </div>

      {/* Controls bar */}
      <div
        className="flex flex-wrap gap-3 items-center px-5 py-3"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(255,255,255,0.015)',
        }}
      >
        {/* Style name badge */}
        <span
          className="font-mono flex-shrink-0"
          style={{
            fontSize: 11,
            padding: '3px 8px',
            borderRadius: 6,
            background: 'rgba(99,102,241,0.12)',
            color: '#818cf8',
            border: '1px solid rgba(99,102,241,0.2)',
            minWidth: 140,
          }}
        >.text-{styleKey}</span>

        {/* Controls */}
        {[
          { label: 'Size', key: 'size' as const, tokens: primitiveOptions.fontSizes },
          { label: 'Weight', key: 'weight' as const, tokens: primitiveOptions.fontWeights },
          { label: 'Leading', key: 'leading' as const, tokens: primitiveOptions.lineHeights },
          { label: 'Tracking', key: 'tracking' as const, tokens: primitiveOptions.letterSpacings },
        ].map(({ label, key, tokens }) => (
          <div key={key} className="flex items-center gap-1.5">
            <label style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#525252', fontWeight: 500 }}>{label}</label>
            <select
              value={styleData[key]}
              onChange={e => onUpdate({ ...styleData, [key]: e.target.value })}
              className="gl-select"
              style={{ fontSize: 11, padding: '3px 8px' }}
            >
              {tokens.map(t => <option key={t} value={t}>{shortToken(t)}</option>)}
            </select>
          </div>
        ))}

        <button
          onClick={onDelete}
          className="ml-auto opacity-0 group-hover:opacity-100 transition-all text-xs"
          style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', borderRadius: 6 }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = '#f87171'
            ;(e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.08)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = '#6b7280'
            ;(e.currentTarget as HTMLElement).style.background = 'none'
          }}
        >✕ remove</button>
      </div>
    </div>
  )
}

export default function TypographyTab({ tokens, onChange }: Props) {
  const typographySemantics = tokens.semantics.light.typographySemantics
  const groups = groupTypographyStyles(typographySemantics)

  // Derive options from live primitives so newly added tokens appear immediately
  const primitiveOptions: PrimitiveOptions = {
    fontSizes: getFontSizeOptions(tokens.primitives.fontSize),
    fontWeights: getFontWeightOptions(tokens.primitives.fontWeight),
    lineHeights: getLineHeightOptions(tokens.primitives.lineHeight),
    letterSpacings: getLetterSpacingOptions(tokens.primitives.letterSpacing),
  }

  const updateStyle = (styleKey: string, updated: { size: string; weight: string; leading: string; tracking: string }) => {
    onChange({
      ...tokens,
      semantics: {
        ...tokens.semantics,
        light: {
          ...tokens.semantics.light,
          typographySemantics: {
            ...tokens.semantics.light.typographySemantics,
            [styleKey]: updated,
          },
        },
      },
    })
  }

  const deleteStyle = (styleKey: string) => {
    const updated = { ...tokens.semantics.light.typographySemantics }
    delete updated[styleKey]
    onChange({
      ...tokens,
      semantics: {
        ...tokens.semantics,
        light: {
          ...tokens.semantics.light,
          typographySemantics: updated,
        },
      },
    })
  }

  const addNewStyle = (group: string) => {
    const newStyleKey = `${group}-new`
    onChange({
      ...tokens,
      semantics: {
        ...tokens.semantics,
        light: {
          ...tokens.semantics.light,
          typographySemantics: {
            ...tokens.semantics.light.typographySemantics,
            [newStyleKey]: {
              size: 'var(--font-size-14)',
              weight: 'var(--font-weight-regular)',
              leading: 'var(--line-height-normal)',
              tracking: 'var(--letter-spacing-normal)',
            },
          },
        },
      },
    })
  }

  return (
    <div className="overflow-y-auto h-full">
      <div className="px-6 py-6 max-w-4xl">
        {/* Page header */}
        <div className="mb-7">
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f0f0f0', margin: 0, letterSpacing: '-0.01em' }}>
            Typography Semantics
          </h2>
          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            {Object.keys(typographySemantics).length} semantic styles · Edit individual properties via dropdowns
          </p>
        </div>

        {Object.entries(groups).map(([groupName, items]) => (
          <div key={groupName} className="mb-8">
            {/* Group heading */}
            <div className="flex items-center gap-3 mb-4">
              <h3 style={{ fontSize: 12, fontWeight: 600, color: '#c0c0c0', textTransform: 'capitalize', margin: 0 }}>
                {groupName}
              </h3>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }} />
              <span style={{ fontSize: 11, color: '#3f3f3f' }}>{items.length} styles</span>
              <button
                onClick={() => addNewStyle(groupName)}
                style={{
                  fontSize: 12,
                  color: '#818cf8',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px 6px',
                  borderRadius: 6,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = '#a5b4fc'
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.08)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = '#818cf8'
                  ;(e.currentTarget as HTMLElement).style.background = 'none'
                }}
              >+ add</button>
            </div>

            {items.map(styleKey => (
              <TypeRow
                key={styleKey}
                styleKey={styleKey}
                styleData={typographySemantics[styleKey]}
                onUpdate={updated => updateStyle(styleKey, updated)}
                onDelete={() => deleteStyle(styleKey)}
                primitiveOptions={primitiveOptions}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
