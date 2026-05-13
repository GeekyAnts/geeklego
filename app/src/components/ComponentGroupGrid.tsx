import { memo, useMemo } from 'react'
import type { ComponentTokenGroup } from '../types.ts'
import { ChevronDown, Box, Layers, Puzzle } from 'lucide-react'

interface ComponentGroupListProps {
  groups: ComponentTokenGroup[]
  selectedComponent: string | null
  activeTab: string
  onSelectComponent: (name: string) => void
  sidebarCollapsed: boolean
  isExpanded: boolean
  level: string
  label: string
  icon: React.ReactNode
}

// Get appropriate icon for component level
function getLevelIcon(level: string) {
  switch (level) {
    case 'atom':
      return <Box size={12} />
    case 'molecule':
      return <Layers size={12} />
    case 'organism':
      return <Puzzle size={12} />
    default:
      return <Puzzle size={12} />
  }
}

export const ComponentGroupList = memo(function ComponentGroupList({
  groups,
  selectedComponent,
  activeTab,
  onSelectComponent,
  sidebarCollapsed,
  isExpanded,
  level,
  label,
  icon,
}: ComponentGroupListProps) {
  const sortedGroups = useMemo(
    () => [...groups].sort((a, b) => a.componentName.localeCompare(b.componentName)),
    [groups],
  )

  if (sortedGroups.length === 0) return null

  if (sidebarCollapsed) {
    return (
      <div
        className="flex items-center justify-center py-[var(--spacing-quarter-sm)] text-[var(--color-text-tertiary)]"
        title={`${label} (${sortedGroups.length})`}
        aria-hidden="true"
      >
        {getLevelIcon(level)}
      </div>
    )
  }

  const containerId = `component-group-${level}`
  const expanded = isExpanded ? 'true' : 'false'
  const isSelected = activeTab === 'components' && selectedComponent && sortedGroups.some(g => g.componentName === selectedComponent)

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => onSelectComponent(`_toggle_${level}`)}
        className={[
          'flex items-center gap-[var(--sidebar-component-group-gap)]',
          'h-[var(--sidebar-component-group-height)]',
          'px-[var(--navitem-padding-x)]',
          'rounded-[var(--sidebar-component-group-radius)]',
          'text-[var(--sidebar-component-group-text-size)] font-[var(--sidebar-component-group-weight)]',
          'text-[var(--sidebar-component-group-text)]',
          'transition-default',
          'hover:bg-[var(--sidebar-component-group-hover-bg)] hover:text-[var(--sidebar-component-group-hover-text)]',
          isSelected && 'bg-[var(--sidebar-component-group-active-bg)] text-[var(--sidebar-component-group-active-text)]',
        ].join(' ')}
        aria-expanded={expanded}
        aria-controls={containerId}
      >
        <span className="shrink-0 text-[var(--sidebar-component-group-icon-color)]">
          {getLevelIcon(level)}
        </span>
        <span className="content-flex min-w-0">{label}</span>
        <span className="shrink-0 text-[var(--color-text-tertiary)] tabular-nums">
          {sortedGroups.length}
        </span>
        <span
          className="shrink-0 text-[var(--sidebar-component-group-icon-color)] transition-default"
          style={{
            transition: 'transform var(--duration-interaction) ease-[var(--ease-default)]',
            transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
          }}
          aria-hidden="true"
        >
          <ChevronDown className="w-[var(--sidebar-component-item-icon-size)] h-[var(--sidebar-component-item-icon-size)]" />
        </span>
      </button>

      <div
        id={containerId}
        className={[
          'grid transition-[grid-template-rows] duration-[var(--duration-enter)] ease-[var(--ease-default)]',
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        ].join(' ')}
      >
        <div className="overflow-hidden">
          {isExpanded && (
            <ul className={[
              'list-none m-0 p-0 flex flex-col pt-[var(--spacing-2xs)]',
              'border-s border-[var(--color-border-subtle)] ms-[var(--navitem-subitem-indent)] ps-[var(--navitem-gap)]',
            ].join(' ')}>
              {sortedGroups.map((g) => {
                const isActive = activeTab === 'components' && selectedComponent === g.componentName
                return (
                  <li key={g.componentName} className="list-none">
                    <button
                      type="button"
                      aria-current={isActive ? 'true' : undefined}
                      className={[
                        'flex items-center gap-[var(--sidebar-component-item-gap)]',
                        'w-full text-start',
                        'h-[var(--sidebar-component-item-height)]',
                        'px-[var(--navitem-padding-x)]',
                        'rounded-[var(--sidebar-component-item-radius)]',
                        'text-[var(--sidebar-component-item-text-size)]',
                        'transition-default',
                        isActive
                          ? 'bg-[var(--sidebar-component-item-active-bg)] text-[var(--sidebar-component-item-active-text)] font-medium'
                          : 'text-[var(--sidebar-component-item-text)] hover:bg-[var(--sidebar-component-item-hover-bg)] hover:text-[var(--sidebar-component-item-hover-text)]',
                      ].join(' ')}
                      onClick={() => onSelectComponent(g.componentName)}
                    >
                      <span className="shrink-0 text-[var(--sidebar-component-item-icon-color)]">
                        {getLevelIcon(level)}
                      </span>
                      <span className="truncate content-flex min-w-0">{g.componentName}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
})
ComponentGroupList.displayName = 'ComponentGroupList'
