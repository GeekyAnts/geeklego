import { useMemo, useState, useEffect } from 'react'

interface TokenEntry {
  name: string
  value: string
}

interface FilterState {
  search: string
  type: string | null
  subcategory: string | null
  usedBy: string | null
  modified: string | null
  drift: string | null
}

interface FacetValue {
  label: string
  count: number
}

interface Facets {
  type: FacetValue[]
  subcategory: FacetValue[]
  usedBy: FacetValue[]
  modified: FacetValue[]
  drift: FacetValue[]
}

interface FilterBarProps {
  allTokens: TokenEntry[]
  onFilterChange: (filtered: TokenEntry[]) => void
  category?: string
}

function getTokenType(tokenName: string): string {
  const match = tokenName.match(/^--(\w+)-/)
  if (!match) return 'other'
  const type = match[1]
  const typeMap: Record<string, string> = {
    color: 'color',
    spacing: 'spacing',
    radius: 'radius',
    text: 'font-size',
    leading: 'font-size',
    tracking: 'font-size',
    font: 'font-size',
    shadow: 'shadow',
    motion: 'motion',
    border: 'border',
    surface: 'surface',
    content: 'text',
    interactive: 'interactive',
    status: 'status',
    layout: 'layout',
  }
  return typeMap[type] || 'other'
}

function getSubcategory(tokenName: string): string {
  if (tokenName.startsWith('--color-')) {
    const match = tokenName.match(/^--color-([\w-]+)-/)
    return match ? match[1] : 'other'
  }
  if (tokenName.startsWith('--spacing-')) {
    const match = tokenName.match(/^--spacing-([\w-]+)-/)
    return match ? match[1] : 'other'
  }
  if (tokenName.startsWith('--radius-')) {
    const match = tokenName.match(/^--radius-([\w-]+)-/)
    return match ? match[1] : 'other'
  }
  return 'other'
}

function extractNumericValue(tokenName: string, tokenValue: string): string | null {
  const numericMatch = tokenName.match(/--[\w-]+-(\d+(?:\.\d+)?)$/)
  if (numericMatch) return numericMatch[1]

  const varMatch = tokenValue.match(/var\(--([\w-]+)\)/)
  if (varMatch) {
    const varName = varMatch[1]
    const varNumericMatch = varName.match(/--[\w-]+-(\d+(?:\.\d+)?)$/)
    if (varNumericMatch) return varNumericMatch[1]
  }

  const pxMatch = tokenValue.match(/([\d.]+)px/)
  if (pxMatch) return pxMatch[1]

  const remMatch = tokenValue.match(/([\d.]+)rem/)
  if (remMatch) return remMatch[1]

  const msMatch = tokenValue.match(/([\d.]+)ms/)
  if (msMatch) return msMatch[1]

  return null
}

function extractHexValue(tokenValue: string): string | null {
  if (tokenValue.startsWith('#')) return tokenValue
  if (tokenValue.includes('rgb')) return tokenValue
  return null
}

function computeFacets(tokens: TokenEntry[]): Facets {
  const typeCounts = new Map<string, number>()
  const subcategoryCounts = new Map<string, number>()
  const usedByCounts = new Map<string, number>()

  tokens.forEach((token) => {
    const type = getTokenType(token.name)
    typeCounts.set(type, (typeCounts.get(type) || 0) + 1)

    const subcategory = getSubcategory(token.name)
    subcategoryCounts.set(subcategory, (subcategoryCounts.get(subcategory) || 0) + 1)

    const usedByMatch = token.name.match(/--([\w-]+)-/)
    if (usedByMatch) {
      const component = usedByMatch[1].charAt(0).toUpperCase() + usedByMatch[1].slice(1)
      usedByCounts.set(component, (usedByCounts.get(component) || 0) + 1)
    }
  })

  return {
    type: Array.from(typeCounts.entries()).map(([label, count]) => ({ label, count })),
    subcategory: Array.from(subcategoryCounts.entries()).map(([label, count]) => ({
      label,
      count,
    })),
    usedBy: Array.from(usedByCounts.entries()).map(([label, count]) => ({ label, count })),
    modified: [{ label: 'In current session', count: 0 }],
    drift: [{ label: 'No drift', count: tokens.length }],
  }
}

function applyFilters(tokens: TokenEntry[], filterState: FilterState): TokenEntry[] {
  return tokens.filter((token) => {
    if (filterState.search) {
      const searchLower = filterState.search.toLowerCase()
      const nameMatches = token.name.toLowerCase().includes(searchLower)
      const valueMatches = token.value.toLowerCase().includes(searchLower)
      const numericMatches = extractNumericValue(token.name, token.value)?.includes(searchLower)
      const hexMatches = extractHexValue(token.value)?.toLowerCase().includes(searchLower)
      if (!nameMatches && !valueMatches && !numericMatches && !hexMatches) return false
    }

    if (filterState.type) {
      if (getTokenType(token.name) !== filterState.type) return false
    }

    if (filterState.subcategory) {
      if (getSubcategory(token.name) !== filterState.subcategory) return false
    }

    if (filterState.usedBy) {
      const extracted = token.name.match(/--([\w-]+)-/)
      if (!extracted || extracted[1] !== filterState.usedBy.toLowerCase()) return false
    }

    return true
  })
}

function ClearButton({ onClick, count }: { onClick: () => void; count: number }) {
  if (count === 0) return null
  return (
    <button
      className="ed-filter-clear-btn"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        background: 'transparent',
        border: '1px solid var(--ed-border)',
        color: 'var(--ed-text-secondary)',
        borderRadius: 'var(--ed-radius-button)',
        fontSize: 'var(--ed-text-xs)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      Clear all ({count})
    </button>
  )
}

function FacetDropdown({
  title,
  values,
  selected,
  onSelect,
}: {
  title: string
  values: FacetValue[]
  selected: string | null
  onSelect: (key: string) => void
}) {
  if (values.length === 0) return null

  return (
    <div className="ed-filter-facet" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: 'var(--ed-text-xs)', color: 'var(--ed-text-muted)' }}>{title}</label>
      <select
        value={selected || ''}
        onChange={(e) => onSelect(e.target.value)}
        style={{
          padding: '4px 8px',
          background: 'var(--ed-surface)',
          border: '1px solid var(--ed-border)',
          borderRadius: 'var(--ed-radius-button)',
          fontSize: 'var(--ed-text-xs)',
          color: 'var(--ed-text-secondary)',
          cursor: 'pointer',
        }}
      >
        <option value="">All</option>
        {values.sort((a, b) => a.label.localeCompare(b.label)).map((v) => (
          <option key={v.label} value={v.label}>
            {v.label} ({v.count})
          </option>
        ))}
      </select>
    </div>
  )
}

function FilterBar({ allTokens, onFilterChange, category: _category }: FilterBarProps) {
  const [filterState, setFilterState] = useState<FilterState>({
    search: '',
    type: null,
    subcategory: null,
    usedBy: null,
    modified: null,
    drift: null,
  })

  const facets = useMemo(() => computeFacets(allTokens), [allTokens])

  const activeCount = useMemo(() => {
    let count = 0
    if (filterState.search) count++
    if (filterState.type) count++
    if (filterState.subcategory) count++
    if (filterState.usedBy) count++
    if (filterState.modified) count++
    if (filterState.drift) count++
    return count
  }, [filterState])

  const filteredTokens = useMemo(() => applyFilters(allTokens, filterState), [allTokens, filterState])

  useEffect(() => {
    onFilterChange(filteredTokens)
  }, [filteredTokens, onFilterChange])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterState((prev) => ({ ...prev, search: e.target.value }))
  }

  const handleTypeSelect = (key: string) => {
    setFilterState((prev) => ({ ...prev, type: key || null, subcategory: null }))
  }

  const handleSubcategorySelect = (key: string) => {
    setFilterState((prev) => ({ ...prev, subcategory: key || null }))
  }

  const handleUsedBySelect = (key: string) => {
    setFilterState((prev) => ({ ...prev, usedBy: key || null }))
  }

  const handleClearFilters = () => {
    setFilterState({
      search: '',
      type: null,
      subcategory: null,
      usedBy: null,
      modified: null,
      drift: null,
    })
  }

  return (
    <div className="ed-filter-bar">
      <input
        type="text"
        placeholder="Search tokens by name, value, or hex..."
        value={filterState.search}
        onChange={handleSearchChange}
        style={{
          flex: 1,
          padding: '8px 12px',
          background: 'var(--ed-surface)',
          border: '1px solid var(--ed-border)',
          borderRadius: 'var(--ed-radius-button)',
          fontSize: 'var(--ed-text-sm)',
          color: 'var(--ed-text-primary)',
        }}
      />

      <FacetDropdown
        title="Type"
        values={facets.type}
        selected={filterState.type}
        onSelect={handleTypeSelect}
      />

      <FacetDropdown
        title="Sub-category"
        values={facets.subcategory}
        selected={filterState.subcategory}
        onSelect={handleSubcategorySelect}
      />

      <FacetDropdown
        title="Used by"
        values={facets.usedBy}
        selected={filterState.usedBy}
        onSelect={handleUsedBySelect}
      />

      {activeCount > 0 && <ClearButton onClick={handleClearFilters} count={activeCount} />}
    </div>
  )
}

export default FilterBar
