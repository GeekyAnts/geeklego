import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react'
import type { GeeklegoTokens, TabId, PrimitiveSection, ThemeMode, ComponentTokenGroup, HistoryEntry } from './types.ts'
import { validateTokens, type ValidationResult } from './utils/tokenValidator.ts'
import { DEFAULT_TOKENS } from './data/tokens.ts'
import { parseComponentTokens, generateComponentTokensCss } from './utils/componentTokenParser.ts'

// ─── Lazy-loaded tab components (progressive loading) ────────────────────────
const PrimitivesTab = lazy(() => import('./components/PrimitivesTab.tsx'))
const SemanticsTab = lazy(() => import('./components/SemanticsTab.tsx'))
const ComponentsTab = lazy(() => import('./components/ComponentsTab.tsx'))
const TypographyTab = lazy(() => import('./components/TypographyTab.tsx'))
const ExportTab = lazy(() => import('./components/ExportTab.tsx'))
const ResponsiveTab = lazy(() => import('./components/ResponsiveTab.tsx'))

// ─── Design system components ─────────────────────────────────────────────────
import { NavItem } from '../../components/atoms/NavItem/NavItem'
import { Divider } from '../../components/atoms/Divider/Divider'
import { Button } from '../../components/atoms/Button/Button'
import { ThemeSwitcher } from '../../components/atoms/ThemeSwitcher/ThemeSwitcher'
import { ComponentGroupList } from './components/ComponentGroupGrid.tsx'

// ─── Lucide icons ─────────────────────────────────────────────────────────────
import {
  Palette,
  Type,
  Ruler,
  Maximize2,
  Box,
  Frame,
  Eye,
  Layers,
  Zap,
  Sun,
  Moon,
  Puzzle,
  AlignLeft,
  Monitor,
  Upload,
  RotateCcw,
} from 'lucide-react'

const STORAGE_KEY = 'geeklego-tokens'
const MAX_HISTORY = 50

async function fetchTokensFromDisk(): Promise<GeeklegoTokens | null> {
  try {
    const res = await fetch('/api/load-tokens')
    const data = await res.json()
    return data.success && data.tokens ? (data.tokens as GeeklegoTokens) : null
  } catch {
    return null
  }
}

async function fetchComponentGroupsFromDisk() {
  try {
    const res = await fetch('/api/component-tokens')
    const data = await res.json()
    if (data.success && data.css) return parseComponentTokens(data.css)
  } catch {}
  return null
}

const PRIMITIVE_SECTIONS: { id: PrimitiveSection; label: string }[] = [
  { id: 'colors',     label: 'Colors'     },
  { id: 'typography', label: 'Type Scale' },
  { id: 'spacing',    label: 'Spacing'    },
  { id: 'sizing',     label: 'Sizing'     },
  { id: 'radius',     label: 'Radius'     },
  { id: 'borders',    label: 'Borders'    },
  { id: 'opacity',    label: 'Opacity'    },
  { id: 'zindex',     label: 'Z-Index'    },
  { id: 'motion',     label: 'Motion'     },
]

const SEMANTIC_MODES: { id: ThemeMode; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark',  label: 'Dark'  },
]

// ─── Icon maps for nav items ───────────────────────────────────────────────────
const PRIMITIVE_ICON_MAP: Record<string, React.ReactNode> = {
  colors:     <Palette size={14} />,
  typography: <Type size={14} />,
  spacing:    <Ruler size={14} />,
  sizing:     <Maximize2 size={14} />,
  radius:     <Box size={14} />,
  borders:    <Frame size={14} />,
  opacity:    <Eye size={14} />,
  zindex:     <Layers size={14} />,
  motion:     <Zap size={14} />,
}

const SEMANTIC_ICON_MAP: Record<string, React.ReactNode> = {
  light: <Sun size={14} />,
  dark:  <Moon size={14} />,
}

// ─── Skeleton fallback for lazy-loaded tabs ──────────────────────────────────

function TabSkeleton() {
  return (
    <div className="p-8 flex flex-col gap-4">
      <div className="skeleton h-6 w-2/5 rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-48 w-full rounded-lg" />
      <div className="skeleton h-4 w-1/2 rounded" />
    </div>
  )
}

// ─── App-level logo header for Sidebar ────────────────────────────────────────

function AppLogoHeader({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-[var(--spacing-component-sm)] min-w-0">
      <img
        src="/geeklego-logo.svg"
        alt="Geeklego"
        className="shrink-0 w-7 h-7"
        aria-hidden="true"
      />
      {!collapsed && (
        <div className="content-flex min-w-0">
          <div className="text-label-sm text-[var(--color-text-primary)] truncate-label">Geeklego</div>
          <div className="text-caption-sm text-[var(--color-text-tertiary)] truncate-label">Token Editor</div>
        </div>
      )}
    </div>
  )
}

// ─── App-level footer for Sidebar ─────────────────────────────────────────────

function AppSidebarFooter({
  undo,
  canUndo,
  historyCount,
  checkpoints,
  onRestore,
  onReset,
}: {
  undo: () => void
  canUndo: boolean
  historyCount: number
  checkpoints: HistoryEntry[]
  onRestore: (entry: HistoryEntry) => void
  onReset: () => void
}) {
  return (
    <div className="flex flex-col gap-[var(--spacing-component-xs)]">
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<RotateCcw />}
        disabled={!canUndo}
        onClick={undo}
        title="Undo (Cmd+Z)"
        className="w-full justify-start"
      >
        Undo
        {canUndo && (
          <span className="ml-auto text-caption-sm text-[var(--color-text-tertiary)] tabular-nums">
            {historyCount}
          </span>
        )}
      </Button>

      {checkpoints.length > 0 && (
        <select
          aria-label="Restore checkpoint"
          value=""
          onChange={e => {
            const idx = parseInt(e.target.value)
            if (!isNaN(idx) && checkpoints[idx]) onRestore(checkpoints[idx])
          }}
          className="w-full px-[var(--spacing-component-sm)] py-[var(--spacing-component-xs)] rounded-[var(--radius-component-md)] text-caption-md text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] appearance-none cursor-pointer transition-default"
        >
          <option value="" disabled>Checkpoints ({checkpoints.length})</option>
          {[...checkpoints].reverse().map((cp, i) => {
            const realIdx = checkpoints.length - 1 - i
            const time = new Date(cp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            return (
              <option key={cp.timestamp} value={realIdx}>
                {cp.label || 'Checkpoint'} — {time}
              </option>
            )
          })}
        </select>
      )}

      <button
        type="button"
        onClick={() => {
          if (confirm('Reset all tokens to defaults? This cannot be undone (unless you undo).')) onReset()
        }}
        className="w-full px-[var(--spacing-component-sm)] py-[var(--spacing-component-xs)] rounded-[var(--radius-component-md)] text-caption-md text-[var(--color-text-tertiary)] bg-transparent border-none cursor-pointer text-left transition-default hover:text-[var(--color-status-error)] hover:bg-[var(--color-status-error-subtle)]"
      >
        Reset defaults
      </button>
    </div>
  )
}

// ─── View Transitions helper ─────────────────────────────────────────────────

function withViewTransition(fn: () => void) {
  if ('startViewTransition' in document) {
    (document as any).startViewTransition(fn)
  } else {
    fn()
  }
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [tokens, setTokensRaw] = useState<GeeklegoTokens>(() => {
    // Start with localStorage (instant), then disk overwrites on mount
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : DEFAULT_TOKENS
    } catch { return DEFAULT_TOKENS }
  })
  const [activeTab, setActiveTab] = useState<TabId>('primitives')
  const [primitiveSection, setPrimitiveSection] = useState<PrimitiveSection>('colors')
  const [semanticsMode, setSemanticsMode] = useState<ThemeMode>('light')
  const historyRef = useRef<HistoryEntry[]>([])
  const [canUndo, setCanUndo] = useState(false)
  const [checkpoints, setCheckpoints] = useState<HistoryEntry[]>([])
  const [componentGroups, setComponentGroups] = useState<ComponentTokenGroup[]>([])
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set(['atom', 'molecule', 'organism']))
  const [componentsLoading, setComponentsLoading] = useState(false)
  const [componentSaveStatus, setComponentSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [diskSyncBadge, setDiskSyncBadge] = useState<'idle' | 'syncing' | 'synced'>('idle')
  const [validation, setValidation] = useState<ValidationResult>({ warnings: [], errors: [], blockers: [] })
  const validationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [uiTheme, setUiTheme] = useState<'system' | 'light' | 'dark'>('dark')
  const [showDeprecated, setShowDeprecated] = useState(true)

  useEffect(() => {
    const root = document.documentElement
    if (uiTheme === 'system') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', uiTheme)
    }
  }, [uiTheme])

  const saveComponentTokens = useCallback(async () => {
    setComponentSaveStatus('saving')
    try {
      const css = generateComponentTokensCss(componentGroups)
      const res = await fetch('/api/save-component-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'text/css' },
        body: css,
      })
      const data = await res.json()
      setComponentSaveStatus(data.success ? 'saved' : 'error')
      setTimeout(() => setComponentSaveStatus('idle'), 2500)
    } catch {
      setComponentSaveStatus('error')
      setTimeout(() => setComponentSaveStatus('idle'), 2500)
    }
  }, [componentGroups])

  // Load all tokens from disk — used on mount and on external file change
  const reloadFromDisk = useCallback(async (silent = false) => {
    if (!silent) setDiskSyncBadge('syncing')
    setComponentsLoading(true)
    const [diskTokens, diskGroups] = await Promise.all([
      fetchTokensFromDisk(),
      fetchComponentGroupsFromDisk(),
    ])
    if (diskTokens) {
      setTokensRaw(diskTokens)
      createCheckpoint('Loaded from disk', diskTokens)
    }
    if (diskGroups) {
      setComponentGroups(diskGroups)
      setSelectedComponent(prev => {
        if (prev && diskGroups.some(g => g.componentName === prev)) return prev
        return diskGroups[0]?.componentName ?? null
      })
    }
    setComponentsLoading(false)
    if (!silent) {
      setDiskSyncBadge('synced')
      setTimeout(() => setDiskSyncBadge('idle'), 2000)
    }
  }, [])

  // On mount: load from disk (overwrites localStorage initial state)
  useEffect(() => { reloadFromDisk(true) }, [reloadFromDisk])

  // HMR: when geeklego.css changes externally, sync to app
  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.on('geeklego:tokens-updated', () => reloadFromDisk(false))
    }
  }, [reloadFromDisk])

  useEffect(() => {
    const id = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens)) } catch {}
    }, 300)
    return () => clearTimeout(id)
  }, [tokens])

  // ─── Checkpoint management ──────────────────────────────────────────────────

  const createCheckpoint = useCallback((label: string, tokenSnapshot?: GeeklegoTokens) => {
    const entry: HistoryEntry = { tokens: tokenSnapshot ?? tokens, label, timestamp: Date.now() }
    setCheckpoints(prev => [...prev.slice(-19), entry]) // Keep last 20 checkpoints
  }, [tokens])

  const restoreCheckpoint = useCallback((entry: HistoryEntry) => {
    historyRef.current = [...historyRef.current.slice(-MAX_HISTORY + 1), { tokens, timestamp: Date.now() }]
    setTokensRaw(entry.tokens)
    setCanUndo(true)
  }, [tokens])

  const setTokens = useCallback((updated: GeeklegoTokens) => {
    setTokensRaw(prev => {
      historyRef.current = [...historyRef.current.slice(-MAX_HISTORY + 1), { tokens: prev, timestamp: Date.now() }]
      setCanUndo(true)
      return updated
    })
  }, [])

  const undo = useCallback(() => {
    if (historyRef.current.length === 0) return
    const prev = historyRef.current[historyRef.current.length - 1]
    historyRef.current = historyRef.current.slice(0, -1)
    setTokensRaw(prev.tokens)
    setCanUndo(historyRef.current.length > 0)
  }, [])

  const resetToDefaults = () => {
    createCheckpoint('Before reset')
    historyRef.current = [...historyRef.current.slice(-MAX_HISTORY + 1), { tokens, timestamp: Date.now() }]
    setTokensRaw(DEFAULT_TOKENS)
    setCanUndo(true)
    createCheckpoint('Defaults restored', DEFAULT_TOKENS)
  }

  // ─── Debounced validation ─────────────────────────────────────────────────

  useEffect(() => {
    if (validationTimerRef.current) clearTimeout(validationTimerRef.current)
    validationTimerRef.current = setTimeout(() => {
      setValidation(validateTokens(tokens))
    }, 300)
    return () => { if (validationTimerRef.current) clearTimeout(validationTimerRef.current) }
  }, [tokens])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo])

  // Breadcrumb labels
  const crumbSection =
    activeTab === 'primitives' ? 'Primitives'
    : activeTab === 'semantics' ? 'Semantics'
    : activeTab === 'components' ? 'Components'
    : activeTab === 'typography' ? 'Typography'
    : activeTab === 'responsive' ? 'Responsive'
    : 'Export'

  const crumbPage =
    activeTab === 'primitives' ? PRIMITIVE_SECTIONS.find(s => s.id === primitiveSection)?.label ?? ''
    : activeTab === 'semantics' ? (semanticsMode === 'light' ? 'Light' : 'Dark')
    : activeTab === 'components' ? (selectedComponent ?? '')
    : ''

  return (
    <div
      className="flex h-screen overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] font-sans"
    >

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside className={[
        'flex flex-col h-svh shrink-0 bg-[var(--sidebar-bg)] overflow-hidden',
        'border-e border-[var(--sidebar-border-color)]',
        'transition-[width] ease-[var(--ease-default)] duration-[var(--sidebar-transition-width)]',
        sidebarCollapsed ? 'w-[var(--sidebar-width-icon)]' : 'w-[var(--sidebar-width)]',
      ].join(' ')}>
        <div className="flex shrink-0 flex-col gap-[var(--sidebar-header-gap)] p-[var(--sidebar-header-padding-x)]">
          <div className="flex items-center gap-[var(--sidebar-header-gap)] h-[var(--sidebar-header-height)] px-[var(--sidebar-header-padding-x)]">
            <img
              src="/geeklego-logo.svg"
              alt="Geeklego"
              className="shrink-0 w-[var(--sidebar-logo-size)] h-[var(--sidebar-logo-size)]"
              aria-hidden="true"
            />
            {!sidebarCollapsed && (
              <span className="grid flex-1 text-start leading-tight min-w-0">
                <span className="truncate-label text-body-sm font-semibold text-[var(--sidebar-workspace-name-color)]">Geeklego</span>
                <span className="truncate-label text-overline-sm text-[var(--sidebar-workspace-tier-color)]">Token Editor</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-[var(--sidebar-content-gap)] overflow-auto px-[var(--sidebar-content-padding-x)] py-[var(--sidebar-content-padding-y)]">

          {/* ── Primitives ───────────────────────────────────────────── */}
          <div className="relative flex w-full min-w-0 flex-col py-[var(--sidebar-group-padding-y)] px-[var(--sidebar-group-padding-x)]">
            {!sidebarCollapsed && <div className="flex h-[var(--size-component-sm)] shrink-0 items-center px-[var(--sidebar-group-label-padding-x)] text-overline-md text-[var(--sidebar-group-label-color)] truncate-label">Primitives</div>}
            <div className="w-full text-sm">
              <ul className="flex flex-col gap-[var(--spacing-component-xs)] list-none m-0 p-0">
                {PRIMITIVE_SECTIONS.map(s => (
                  <NavItem
                    key={s.id}
                    icon={PRIMITIVE_ICON_MAP[s.id]}
                    label={sidebarCollapsed ? undefined : s.label}
                    isActive={activeTab === 'primitives' && primitiveSection === s.id}
                    onToggle={() => withViewTransition(() => { setActiveTab('primitives'); setPrimitiveSection(s.id) })}
                    aria-label={sidebarCollapsed ? s.label : undefined}
                    title={sidebarCollapsed ? s.label : undefined}
                  />
                ))}
              </ul>
            </div>
          </div>

          <Divider />

          {/* ── Semantics ─────────────────────────────────────────────── */}
          <div className="relative flex w-full min-w-0 flex-col py-[var(--sidebar-group-padding-y)] px-[var(--sidebar-group-padding-x)]">
            {!sidebarCollapsed && <div className="flex h-[var(--size-component-sm)] shrink-0 items-center px-[var(--sidebar-group-label-padding-x)] text-overline-md text-[var(--sidebar-group-label-color)] truncate-label">Semantics</div>}
            <div className="w-full text-sm">
              <ul className="flex flex-col gap-[var(--spacing-component-xs)] list-none m-0 p-0">
                {SEMANTIC_MODES.map(m => (
                  <NavItem
                    key={m.id}
                    icon={SEMANTIC_ICON_MAP[m.id]}
                    label={sidebarCollapsed ? undefined : m.label}
                    isActive={activeTab === 'semantics' && semanticsMode === m.id}
                    onToggle={() => withViewTransition(() => { setActiveTab('semantics'); setSemanticsMode(m.id) })}
                    aria-label={sidebarCollapsed ? m.label : undefined}
                    title={sidebarCollapsed ? m.label : undefined}
                  />
                ))}
              </ul>
            </div>
          </div>

          <Divider />

          {/* ── Components ───────────────────────────────────────────── */}
          <div className="relative flex w-full min-w-0 flex-col py-[var(--sidebar-group-padding-y)] px-[var(--sidebar-group-padding-x)]">
            {!sidebarCollapsed && <div className="flex h-[var(--size-component-sm)] shrink-0 items-center px-[var(--sidebar-group-label-padding-x)] text-overline-md text-[var(--sidebar-group-label-color)] truncate-label">Components</div>}
            <div className="w-full text-sm">
              {componentGroups.length === 0 && !componentsLoading && !sidebarCollapsed ? (
                <p className="px-[var(--spacing-component-sm)] text-caption-md text-[var(--color-text-tertiary)] italic">
                  No components
                </p>
              ) : (
                <div className="flex flex-col gap-[var(--spacing-component-xs)]">
                  {(
                    [
                      { level: 'atom',     label: 'Atoms',     icon: <Box size={14} />    },
                      { level: 'molecule', label: 'Molecules', icon: <Layers size={14} /> },
                      { level: 'organism', label: 'Organisms', icon: <Puzzle size={14} /> },
                    ] as const
                  ).map(({ level, label, icon }) => {
                    const levelGroups = componentGroups.filter(g => g.level === level)
                    const isExpanded = expandedLevels.has(level)
                    const toggleLevel = () =>
                      setExpandedLevels(prev => {
                        const next = new Set(prev)
                        if (next.has(level)) next.delete(level)
                        else next.add(level)
                        return next
                      })
                    return (
                      <ComponentGroupList
                        key={level}
                        groups={levelGroups}
                        activeTab={activeTab}
                        selectedComponent={selectedComponent}
                        onSelectComponent={(name) => {
                          if (name.startsWith('_toggle_')) {
                            toggleLevel()
                          } else {
                            withViewTransition(() => { setActiveTab('components'); setSelectedComponent(name) })
                          }
                        }}
                        sidebarCollapsed={sidebarCollapsed}
                        isExpanded={isExpanded}
                        level={level}
                        label={label}
                        icon={icon}
                      />
                    )
                  })}

                  {/* ── Unknown / Unclassified components ──────────────────── */}
                  {(() => {
                    const unknownGroups = componentGroups.filter(g => g.level === 'unknown')
                    if (unknownGroups.length === 0) return null
                    return (
                      <div className="flex flex-col">
                        <div className="flex h-[var(--size-component-sm)] shrink-0 items-center px-[var(--sidebar-group-label-padding-x)] text-overline-md text-[var(--sidebar-group-label-color)] truncate-label">
                          Other
                        </div>
                        <ul className="list-none m-0 p-0 flex flex-col">
                          {unknownGroups.map(g => {
                            const isUnclassifiedActive = activeTab === 'components' && selectedComponent === g.componentName
                            return (
                              <li key={g.componentName} className="list-none">
                                <button
                                  type="button"
                                  aria-current={isUnclassifiedActive ? 'true' : undefined}
                                  className={[
                                    'flex items-center gap-[var(--sidebar-component-group-gap)]',
                                    'w-full text-start',
                                    'h-[var(--sidebar-component-group-height)]',
                                    'px-[var(--navitem-padding-x)]',
                                    'rounded-[var(--sidebar-component-group-radius)]',
                                    'text-[var(--sidebar-component-group-text-size)]',
                                    'transition-default',
                                    isUnclassifiedActive
                                      ? 'bg-[var(--sidebar-component-group-active-bg)] text-[var(--sidebar-component-group-active-text)] font-semibold'
                                      : 'text-[var(--sidebar-component-group-text)] hover:bg-[var(--sidebar-component-group-hover-bg)] hover:text-[var(--sidebar-component-group-hover-text)]',
                                  ].join(' ')}
                                  onClick={() => withViewTransition(() => { setActiveTab('components'); setSelectedComponent(g.componentName) })}
                                >
                                  <span className="shrink-0 text-[var(--sidebar-component-group-icon-color)]">
                                    <Puzzle size={12} />
                                  </span>
                                  <span className="truncate content-flex min-w-0">{g.componentName}</span>
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          </div>

          <Divider />

          {/* ── Top-level pages ───────────────────────────────────────── */}
          <ul className="flex flex-col gap-[var(--spacing-component-xs)] list-none m-0 p-0">
            <NavItem
              icon={<AlignLeft size={14} />}
              label={sidebarCollapsed ? undefined : 'Typography'}
              isActive={activeTab === 'typography'}
              onToggle={() => withViewTransition(() => setActiveTab('typography'))}
              aria-label={sidebarCollapsed ? 'Typography' : undefined}
              title={sidebarCollapsed ? 'Typography' : undefined}
            />
            <NavItem
              icon={<Monitor size={14} />}
              label={sidebarCollapsed ? undefined : 'Responsive'}
              isActive={activeTab === 'responsive'}
              onToggle={() => withViewTransition(() => setActiveTab('responsive'))}
              aria-label={sidebarCollapsed ? 'Responsive' : undefined}
              title={sidebarCollapsed ? 'Responsive' : undefined}
            />
          {/* Export with validation badge — wrapper div provides positioning context */}
            <div className="relative">
              <NavItem
                icon={<Upload size={14} />}
                label={sidebarCollapsed ? undefined : 'Export'}
                isActive={activeTab === 'export'}
                onToggle={() => withViewTransition(() => setActiveTab('export'))}
                aria-label={sidebarCollapsed ? 'Export' : undefined}
                title={sidebarCollapsed ? 'Export' : undefined}
              />
              {(validation.blockers.length > 0 || validation.errors.length > 0 || validation.warnings.length > 0) && (
                <span
                  aria-hidden="true"
                  title={`${validation.blockers.length} blockers, ${validation.errors.length} errors, ${validation.warnings.length} warnings`}
                  className={[
                    'absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none',
                    'w-2 h-2 rounded-full shrink-0',
                    validation.blockers.length > 0 || validation.errors.length > 0
                      ? 'bg-[var(--color-status-error)]'
                      : 'bg-[var(--color-status-warning)]',
                  ].join(' ')}
                />
              )}
            </div>
          </ul>

        </div>

        {/* App-specific footer — custom undo/redo controls */}
        <div className="flex shrink-0 flex-col gap-[var(--sidebar-footer-gap)] p-[var(--sidebar-footer-padding-x)] border-t border-[var(--sidebar-divider-color)]">
          {!sidebarCollapsed && (
            <AppSidebarFooter
              undo={undo}
              canUndo={canUndo}
              historyCount={historyRef.current.length}
              checkpoints={checkpoints}
              onRestore={restoreCheckpoint}
              onReset={resetToDefaults}
            />
          )}
        </div>
      </aside>

      {/* ── Content area ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Breadcrumb strip */}
        <div className="h-11 shrink-0 flex items-center px-5 gap-2 border-b border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]">
          <span className="text-label-sm text-[var(--color-text-tertiary)]">{crumbSection}</span>
          {crumbPage && (
            <>
              <span className="text-caption-sm text-[var(--color-text-tertiary)]" aria-hidden="true">/</span>
              <span className="text-label-sm text-[var(--color-text-secondary)]">{crumbPage}</span>
            </>
          )}
          <div className="ml-auto flex items-center gap-3">
                        {diskSyncBadge !== 'idle' && (
              <span
                role="status"
                aria-live="polite"
                className={[
                  'flex items-center gap-1 text-caption-md transition-default',
                  diskSyncBadge === 'synced'
                    ? 'text-[var(--color-status-success)]'
                    : 'text-[var(--color-action-primary)] opacity-65',
                ].join(' ')}
              >
                <span
                  aria-hidden="true"
                  className={[
                    'w-1.5 h-1.5 rounded-full shrink-0',
                    diskSyncBadge === 'synced'
                      ? 'bg-[var(--color-status-success)]'
                      : 'bg-[var(--color-action-primary)] animate-pulse',
                  ].join(' ')}
                />
                {diskSyncBadge === 'syncing' ? 'Syncing…' : 'Synced from disk'}
              </span>
            )}
            <ThemeSwitcher size="sm" value={uiTheme} onChange={setUiTheme} />
          </div>
        </div>

        {/* Tab content — lazy-loaded with Suspense skeleton */}
        <main id="main-content" className="flex-1 overflow-hidden">
          <Suspense fallback={<TabSkeleton />}>
            {activeTab === 'primitives' && (
              <PrimitivesTab
                primitives={tokens.primitives}
                onChange={updated => setTokens({ ...tokens, primitives: updated })}
                section={primitiveSection}
                showDeprecated={showDeprecated}
              />
            )}
            {activeTab === 'semantics' && (
              <SemanticsTab
                tokens={tokens}
                onChange={setTokens}
                mode={semanticsMode}
                showDeprecated={showDeprecated}
              />
            )}
            {activeTab === 'components' && (
              <ComponentsTab
                groups={componentGroups}
                selectedComponent={selectedComponent}
                loading={componentsLoading}
                typographyClasses={tokens.typographyClasses}
                onChange={setComponentGroups}
                onSave={saveComponentTokens}
                saveStatus={componentSaveStatus}
              />
            )}
            {activeTab === 'typography' && (
              <TypographyTab
                tokens={tokens}
                onChange={setTokens}
                showDeprecated={showDeprecated}
              />
            )}
            {activeTab === 'responsive' && (
              <ResponsiveTab
                breakpoints={tokens.primitives.breakpoints || {}}
                responsiveOverrides={tokens.responsiveOverrides || []}
                onBreakpointsChange={updated => setTokens({ ...tokens, primitives: { ...tokens.primitives, breakpoints: updated } })}
                onOverridesChange={updated => setTokens({ ...tokens, responsiveOverrides: updated })}
              />
            )}
            {activeTab === 'export' && (
              <ExportTab
                tokens={tokens}
                validation={validation}
                onCheckpoint={createCheckpoint}
                showDeprecated={showDeprecated}
                setShowDeprecated={setShowDeprecated}
              />
            )}
          </Suspense>
        </main>

      </div>
    </div>
  )
}
