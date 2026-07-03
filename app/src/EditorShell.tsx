import { useState, useEffect, useMemo, useCallback } from 'react'
import { RouterProvider, useRouter } from './routing'
import { Header } from './shell/Header'
import { NavRail } from './shell/NavRail'
import { ContextPane } from './shell/ContextPane'
import { Inspector } from './shell/Inspector'
import { PendingDrawer } from './shell/PendingDrawer'
import { CommandPalette } from './components/CommandPalette'
import ExportModal from './components/ExportModal'
import { PendingModal } from './components/PendingModal'
import './components/PendingModal.css'
import { SuggestionsModal } from './components/SuggestionsModal'
import { countAvailableSuggestions } from './state/suggestions'
import { ToastHost } from './components/ToastHost'
import { pushEditToast } from './state/toasts'
import { KeyboardShortcuts } from './components/KeyboardShortcuts'
import { OnboardingTour } from './components/OnboardingTour'
import { EdSkeleton } from './editor-ds/primitives'
import { getPendingCount, subscribeToPendingChanges, stage, getStagedValue, getAllStaged, discardAll, getStagedNewTokens } from './state/staging'
import { subscribeToLockChanges } from './state/semanticLocks'
import { generateMergedTokens } from './utils/exportFormatter'
import { buildTokenGraph, type TokenGraph } from './graph/build'
import { classifyTokens } from './ia'
import type { GeeklegoTokensV2, TokenUsageMap } from './types'
import './EditorShell.css'

interface TokenEntry {
  name: string
  value: string
}

// Maps a primitives top-level key to the CSS variable prefix used in the v2 design system.
// Mirrors emission rules in utils/cssGenerator.ts.
const PRIMITIVE_PREFIX: Record<string, string> = {
  colors: 'color',
  fontFamily: 'font',
  fontSize: 'text',
  fontWeight: 'font-weight',
  lineHeight: 'leading',
  letterSpacing: 'tracking',
  spacing: 'spacing',
  radius: 'radius',
  borderWidth: 'border-width',
  duration: 'duration',
  easing: 'ease',
  breakpoints: 'breakpoint',
  lineClamp: 'line-clamp',
}

function flattenTokens(tokens: GeeklegoTokensV2): TokenEntry[] {
  const entries: TokenEntry[] = []

  const prims = tokens.primitives as unknown as Record<string, unknown>
  for (const category of Object.keys(prims)) {
    const prefix = PRIMITIVE_PREFIX[category]
    if (!prefix) continue
    const values = prims[category]
    if (!values || typeof values !== 'object') continue
    for (const [k, v] of Object.entries(values as Record<string, unknown>)) {
      // fontWeight / lineClamp are numeric in the model — coerce so they
      // remain searchable in the command palette.
      if (typeof v === 'string' || typeof v === 'number') {
        entries.push({ name: `--${prefix}-${k}`, value: String(v) })
      } else if (v && typeof v === 'object') {
        // Nested (e.g. colors.neutral.500 → --color-neutral-500)
        for (const [k2, v2] of Object.entries(v as Record<string, unknown>)) {
          if (typeof v2 === 'string' || typeof v2 === 'number') {
            entries.push({ name: `--${prefix}-${k}-${k2}`, value: String(v2) })
          }
        }
      }
    }
  }

  // v2 semantics are a FLAT map: { primary: 'var(--color-brand-900)', border: '…' }.
  // The CSS var name is the key verbatim (e.g. --primary, --border).
  const semantics = tokens.semantics?.light
  if (semantics) {
    for (const [k, v] of Object.entries(semantics)) {
      entries.push({ name: `--${k}`, value: v })
    }
  }

  return entries
}

function collectTokenNames(tokens: GeeklegoTokensV2): string[] {
  const names: string[] = []
  const prims = tokens.primitives as unknown as Record<string, unknown>
  for (const category of Object.keys(prims)) {
    const prefix = PRIMITIVE_PREFIX[category]
    if (!prefix) continue
    const values = prims[category]
    if (!values || typeof values !== 'object') continue
    for (const [k, v] of Object.entries(values as Record<string, unknown>)) {
      // fontWeight / lineClamp are numeric in the model — include them so
      // the NavRail counts match the rendered token lists.
      if (typeof v === 'string' || typeof v === 'number') {
        names.push(`${prefix}-${k}`)
      } else if (v && typeof v === 'object') {
        for (const k2 of Object.keys(v as Record<string, unknown>)) {
          const v2 = (v as Record<string, unknown>)[k2]
          if (typeof v2 === 'string' || typeof v2 === 'number') {
            names.push(`${prefix}-${k}-${k2}`)
          }
        }
      }
    }
  }

  // v2 semantics: classifier names are the flat ShadCN keys, sans leading "--".
  const semantics = tokens.semantics?.light
  if (semantics) {
    for (const k of Object.keys(semantics)) {
      names.push(k)
    }
  }
  return names
}

function EditorShellContent() {
  const { route, navigate } = useRouter()

  const [tokens, setTokens] = useState<GeeklegoTokensV2 | null>(null)
  const [usage, setUsage] = useState<TokenUsageMap>({})
  const [selectedTokenName, setSelectedTokenName] = useState<string | null>(null)
  const [commandOpen, setCommandOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [pendingDrawerOpen, setPendingDrawerOpen] = useState(false)
  const [pendingModalOpen, setPendingModalOpen] = useState(false)
  const [suggestionsModalOpen, setSuggestionsModalOpen] = useState(false)
  const [pendingCount, setPendingCount] = useState(() => getPendingCount())
  const [suggestionCount, setSuggestionCount] = useState(0)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('geeklego.editor.onboarding.completed')
  })

  // Scan component sources for real token usage (References panel). Cheap (~24 files),
  // so we refetch whenever the token set could have changed (load / Update DS / save) and
  // on demand via "Rescan usage".
  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch('/api/token-usage')
      const json = await res.json()
      if (json.success) setUsage(json.usage as TokenUsageMap)
    } catch {
      // non-fatal — the panel just shows no component usage
    }
  }, [])

  // Load tokens from disk
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const tokenRes = await fetch('/api/load-tokens')
        const tokenData = await tokenRes.json()
        if (!cancelled && tokenData.success && tokenData.tokens) {
          setTokens(tokenData.tokens)
        }
      } catch {
        if (!cancelled) setTokens(null)
      }
    }
    load()
    fetchUsage()
    return () => { cancelled = true }
  }, [fetchUsage])

  // HMR listener for token updates
  useEffect(() => {
    const hot = import.meta.hot
    if (hot) {
      const handler = () => {
        fetch('/api/load-tokens')
          .then(r => r.json())
          .then((tokenData) => {
            if (tokenData.success && tokenData.tokens) setTokens(tokenData.tokens)
          })
        fetchUsage()
      }
      hot.on('geeklego:tokens-updated', handler)
      return () => { hot.off('geeklego:tokens-updated', handler) }
    }
  }, [fetchUsage])

  // Subscribe to pending changes
  useEffect(() => {
    return subscribeToPendingChanges(() => setPendingCount(getPendingCount()))
  }, [])

  // Recompute the available-suggestions count whenever the model, staged edits,
  // or locks change (all three feed computeAvailableSuggestions).
  useEffect(() => {
    const recompute = () => setSuggestionCount(countAvailableSuggestions(tokens))
    recompute()
    const unsubP = subscribeToPendingChanges(recompute)
    const unsubL = subscribeToLockChanges(recompute)
    return () => { unsubP(); unsubL() }
  }, [tokens])

  // Keyboard shortcuts — ⌘K, ⌘E, ?
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault()
        setCommandOpen(o => !o)
        return
      }
      if (e.metaKey && e.key === 'e') {
        e.preventDefault()
        setExportOpen(o => !o)
        return
      }
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement)?.tagName
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
          e.preventDefault()
          setShowKeyboardShortcuts(prev => !prev)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Derived data
  const graph: TokenGraph | null = useMemo(() => {
    if (!tokens) return null
    return buildTokenGraph(tokens)
  }, [tokens])

  const classification = useMemo(() => {
    if (!tokens) return null
    const tokenNames = collectTokenNames(tokens)
    return classifyTokens(tokenNames)
  }, [tokens])

  const allTokenEntries = useMemo(() => {
    if (!tokens) return []
    const base = flattenTokens(tokens)
    for (const [, newToken] of getStagedNewTokens()) {
      base.push({ name: newToken.cssName, value: newToken.value })
    }
    return base
  }, [tokens])

  const handleStageEdit = useCallback((tokenName: string, newValue: string) => {
    const prev = getStagedValue(tokenName)
    stage(tokenName, newValue)
    pushEditToast({
      stagingKey: tokenName,
      label: tokenName.replace(/^dark:/, '') + (tokenName.startsWith('dark:') ? ' (dark)' : ''),
      prevValue: prev,
      newValue,
      verb: 'Updated',
    })
  }, [])

  const handleRestoreDefault = useCallback(async () => {
    const res = await fetch('/api/restore-default', { method: 'POST' })
    const json = await res.json()
    if (!json.success) throw new Error(json.error ?? 'Restore failed')

    discardAll()

    const loadRes = await fetch('/api/load-tokens')
    const loadJson = await loadRes.json()
    if (loadJson.success) setTokens(loadJson.tokens)

    // Rebuild dist CSS for consuming packages
    fetch('/api/sync-build', { method: 'POST' }).catch(err => {
      console.warn('Post-restore CSS build failed:', err)
    })
  }, [])

  // Update DS — re-scan design-system/v2 from disk and absorb any new tokens (e.g. a core
  // semantic a component just introduced) into the model. Unlike Restore Default this is
  // NON-destructive: it does NOT discardAll(), so in-flight staged edits survive (they live
  // in the separate staging store and are overlaid onto `tokens` at render time).
  const handleUpdateDs = useCallback(async () => {
    const res = await fetch('/api/load-tokens')
    const json = await res.json()
    if (!json.success) throw new Error(json.error ?? 'Update DS failed')
    setTokens(json.tokens)
    fetchUsage()
  }, [fetchUsage])

  // Re-scan component sources for token usage on demand (e.g. after editing a .tsx while
  // the cockpit is open). The References panel reflects the fresh scan.
  const handleRescanUsage = useCallback(() => fetchUsage(), [fetchUsage])

  const handleExport = useCallback(async () => {
    if (!tokens) return
    const staged = getAllStaged()

    // Apply staged edits + new tokens to the flat v2 token model
    const mergedTokens = generateMergedTokens(tokens, staged, getStagedNewTokens())

    try {
      // Save the three v2 files (primitives + semantics + dark)
      const primRes = await fetch('/api/save-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mergedTokens),
      })
      const primJson = await primRes.json()
      if (!primJson.success) throw new Error(primJson.error ?? 'Save tokens failed')

      discardAll()

      // Commit any staged metadata changes to tokens.metadata.json
      try {
        const stored = localStorage.getItem('geeklego.editor.metadata.v1')
        if (stored) {
          const stagedChanges = JSON.parse(stored)
          if (Object.keys(stagedChanges).length > 0) {
            const metaRes = await fetch('/api/merge-metadata', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ stagedChanges }),
            })
            if (metaRes.ok) {
              localStorage.removeItem('geeklego.editor.metadata.v1')
            }
          }
        }
      } catch (metaErr) {
        console.error('Metadata commit failed:', metaErr)
      }

      // Reload tokens from the freshly written CSS
      const loadRes = await fetch('/api/load-tokens')
      const loadJson = await loadRes.json()
      if (loadJson.success) setTokens(loadJson.tokens)
      fetchUsage()

      // Rebuild dist CSS for consuming packages
      fetch('/api/sync-build', { method: 'POST' }).catch(err => {
        console.warn('Post-export CSS build failed:', err)
      })
    } catch (err) {
      console.error('Export failed:', err)
      throw err
    }
  }, [tokens, fetchUsage])

  // Multi-target export: trigger the IR / design.md generators (Node scripts behind the
  // dev API) and return the generated file's contents + on-disk path so the modal can offer
  // a download. These scripts read the on-disk design-system/v2/*.css — they reflect the
  // last SAVED state, not unsaved staged edits. The modal's UI copy says so; if the user
  // wants staged edits reflected, they export CSS first (which saves the v2 files).
  const handleExportTarget = useCallback(
    async (target: 'ir' | 'design-md'): Promise<{ content: string; path: string }> => {
      const endpoint = target === 'ir' ? '/api/export-ir' : '/api/export-design-md'
      const res = await fetch(endpoint, { method: 'POST' })
      const json = await res.json()
      if (!json.success) throw new Error(json.error ?? `${target} export failed`)
      return { content: json.content as string, path: json.path as string }
    },
    [],
  )

  const handleSelectToken = useCallback((tokenName: string) => {
    setSelectedTokenName(tokenName)
  }, [])

  if (!tokens) {
    return (
      <div className="ed-shell ed-shell--loading">
        <EdSkeleton width="100%" height="100vh" />
      </div>
    )
  }

  return (
    <div className="ed-shell">
      <Header
        pendingCount={pendingCount}
        suggestionCount={suggestionCount}
        onOpenCommandPalette={() => setCommandOpen(true)}
        onOpenExport={() => setExportOpen(true)}
        onOpenPending={() => setPendingModalOpen(true)}
        onOpenSuggestions={() => setSuggestionsModalOpen(true)}
      />

      {classification && (
        <NavRail
          classification={classification}
          currentRoute={route}
          onNavigate={navigate}
          onOpenCommandPalette={() => setCommandOpen(true)}
        />
      )}

      <ContextPane
        tokens={tokens}
        onSelectToken={handleSelectToken}
      />

      <Inspector
        selectedTokenName={selectedTokenName}
        tokens={tokens}
        graph={graph}
        usage={usage}
        onRescanUsage={handleRescanUsage}
        onStageEdit={handleStageEdit}
        onClose={() => setSelectedTokenName(null)}
      />

      <PendingDrawer
        visible={pendingDrawerOpen}
        onToggle={() => setPendingDrawerOpen(o => !o)}
        pendingCount={pendingCount}
        tokens={tokens}
        onOpenExport={() => setExportOpen(true)}
      />

      {commandOpen && (
        <CommandPalette
          allTokens={allTokenEntries}
          onSelectToken={handleSelectToken}
          onClose={() => setCommandOpen(false)}
        />
      )}

      <PendingModal
        open={pendingModalOpen}
        onClose={() => setPendingModalOpen(false)}
        tokens={tokens}
      />

      <SuggestionsModal
        open={suggestionsModalOpen}
        onClose={() => setSuggestionsModalOpen(false)}
        tokens={tokens}
        onApplied={(s, prev) => pushEditToast({
          stagingKey: s.stagingKey,
          label: `${s.cssName} (${s.theme})`,
          prevValue: prev,
          newValue: s.to,
          verb: 'Applied suggestion to',
        })}
      />

      <ToastHost />

      {exportOpen && (
        <ExportModal
          isOpen={exportOpen}
          onClose={() => setExportOpen(false)}
          onExport={handleExport}
          onExportTarget={handleExportTarget}
          onRestoreDefault={handleRestoreDefault}
          onUpdateDs={handleUpdateDs}
          tokens={tokens}
          hasBlockers={false}
        />
      )}

      {showKeyboardShortcuts && (
        <KeyboardShortcuts onClose={() => setShowKeyboardShortcuts(false)} />
      )}

      {showOnboarding && (
        <OnboardingTour
          isOpen={showOnboarding}
          onClose={() => {
            setShowOnboarding(false)
            localStorage.setItem('geeklego.editor.onboarding.completed', 'true')
          }}
          onComplete={() => {
            setShowOnboarding(false)
            localStorage.setItem('geeklego.editor.onboarding.completed', 'true')
          }}
        />
      )}
    </div>
  )
}

export default function EditorShell() {
  return (
    <RouterProvider>
      <EditorShellContent />
    </RouterProvider>
  )
}
