// ─── Pending Drawer Component ─────────────────────────────────────────────────
// Collapsible drawer at bottom for pending changes

import { useEffect, useMemo, useCallback, useState } from 'react'
import { X, ArrowLeft, ArrowRight } from 'lucide-react'
import './PendingDrawer.css'
import { getAllStaged, unstage, discardAll, subscribeToPendingChanges, getStagedNewTokens, unstageNewToken, DARK_EDIT_PREFIX } from '../../state/staging'
import { FONT_LOADER_EDIT_PREFIX } from '../../utils/exportFormatter'
import { withPxAnnotation } from '../../utils/colorUtils'
import { buildTokenGraph, type TokenGraph } from '../../graph/build'
import { ImpactSummary } from './ImpactSummary'
import { EdButton, EdChip, EdScrollArea } from '../../editor-ds/primitives'
import type { GeeklegoTokensV2 } from '../../types'

function buildTokenMap(tokens: GeeklegoTokensV2): Map<string, string> {
  const map = new Map<string, string>()

  for (const [key, value] of Object.entries(tokens.primitives.colors)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      for (const [shade, shadeValue] of Object.entries(value)) {
        map.set(`color-${key}-${shade}`, shadeValue)
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const [k, v] of Object.entries(value)) {
        map.set(`color-${key}-${k}`, v as string)
      }
    }
  }

  const primitiveKeys = ['spacing', 'radius', 'fontSize', 'fontFamily', 'lineHeight', 'letterSpacing', 'fontWeight', 'borderWidth', 'duration', 'easing']
  for (const key of primitiveKeys) {
    const data = tokens.primitives[key as keyof typeof tokens.primitives]
    if (data && typeof data === 'object') {
      for (const [k, v] of Object.entries(data as Record<string, string | number | object>)) {
        if (typeof v === 'string') {
          map.set(`-${key}-${k}`, v)
        }
      }
    }
  }

  // Flat v2 semantics — CSS var for a key is `--<key>`
  for (const [k, v] of Object.entries(tokens.semantics.light)) {
    map.set(`--${k}`, v)
  }

  return map
}

interface PendingDrawerProps {
  visible: boolean
  onToggle: () => void
  pendingCount: number
  tokens: GeeklegoTokensV2
  onOpenExport?: () => void
}

export function PendingDrawer({
  visible,
  onToggle,
  pendingCount,
  tokens,
  onOpenExport,
}: PendingDrawerProps) {
  const [expanded, setExpanded] = useState(pendingCount > 0)
  const [pendingVersion, setPendingVersion] = useState(0)
  const [tokenMap] = useState(() => buildTokenMap(tokens))
  const [graph, setGraph] = useState<TokenGraph | null>(null)
  const [selectedToken, setSelectedToken] = useState<string | null>(null)

  useEffect(() => {
    if (pendingCount > 0 && !expanded) {
      setExpanded(true)
    }
  }, [pendingCount, expanded])

  const pendingChanges = useMemo(() => {
    const staged = getAllStaged()
    const changes = []
    for (const [stagedKey, stagedValue] of staged) {
      // --font-loader-* are internal staging entries paired with their --font-* family edit
      // (which shows below as a normal change). Hide the raw loader JSON from the drawer.
      if (stagedKey.startsWith(FONT_LOADER_EDIT_PREFIX)) continue
      // Dark-theme edits are staged under `dark:--<key>`. Strip the prefix for display,
      // flag them with a "Dark" badge, and resolve their original from semantics.dark.
      const isDark = stagedKey.startsWith(DARK_EDIT_PREFIX)
      const tokenName = isDark ? stagedKey.slice(DARK_EDIT_PREFIX.length) : stagedKey
      const originalValue = isDark
        ? (tokens.semantics.dark[tokenName.replace(/^--/, '')] ?? '(inherits light)')
        : (tokenMap.get(tokenName) ?? '(unknown)')
      changes.push({ stagedKey, tokenName, originalValue, stagedValue, isDark })
    }
    return changes
    // pendingVersion is a version counter bumped on staged-store changes; it's the
    // invalidation signal to re-read the non-reactive staged store. Keep it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenMap, pendingVersion])

  const newTokens = useMemo(() => {
    return Array.from(getStagedNewTokens().values()).sort((a, b) => a.addedAt - b.addedAt)
    // pendingVersion re-reads getStagedNewTokens() (non-reactive) when staged changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingVersion])

  const handleReset = useCallback((tokenName: string) => {
    unstage(tokenName)
  }, [])

  const handleDiscardAll = useCallback(() => {
    discardAll()
    setExpanded(false)
    onToggle()
  }, [onToggle])

  const handleExport = useCallback(() => {
    onToggle()
    onOpenExport?.()
  }, [onToggle, onOpenExport])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && visible) {
      onToggle()
    }
  }, [visible, onToggle])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleBackToList = useCallback(() => {
    setSelectedToken(null)
  }, [])

  useEffect(() => {
    if (graph === null) {
      const builtGraph = buildTokenGraph(tokens)
      setGraph(builtGraph)
    }
  }, [tokens, graph])

  useEffect(() => {
    const unsubscribe = subscribeToPendingChanges(() => {
      setPendingVersion(n => n + 1)
      if (graph) {
        const rebuiltGraph = buildTokenGraph(tokens)
        setGraph(rebuiltGraph)
      }
    })
    return unsubscribe
  }, [tokens, graph])

  return (
    <div
      className={`ed-pending-drawer ${visible ? 'ed-pending-drawer--visible' : ''} ${expanded ? 'ed-pending-drawer--expanded' : ''}`}
      role="region"
      aria-label="Pending changes drawer"
      aria-hidden={!visible}
    >
      <div className="ed-pending-drawer__content">
        <div className="ed-pending-drawer__header">
          <div className="ed-pending-drawer__title" onClick={() => setExpanded(e => !e)} style={{ cursor: 'pointer' }}>
            <span className="ed-pending-drawer__count-badge">
              {pendingCount}
            </span>
            <span>{selectedToken ? 'Impact Analysis' : 'Pending Changes'}</span>
          </div>
          <button
            type="button"
            className="ed-pending-drawer__close-btn"
            onClick={onToggle}
            aria-label="Close pending drawer"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>

        {expanded && (
          <>
            <div className="ed-pending-drawer__body">
              {selectedToken && selectedToken !== '(global)' && graph && (
                <div className="ed-pending-drawer__back-section">
                  <button
                    type="button"
                    className="ed-pending-drawer__back-btn"
                    onClick={handleBackToList}
                  >
                    <ArrowLeft size={13} aria-hidden="true" /> Back to all changes
                  </button>
                </div>
              )}
              {selectedToken && selectedToken !== '(global)' && graph && (
                <div className="ed-pending-drawer__impact-section">
                  <ImpactSummary
                    tokenName={selectedToken}
                    currentValue={getAllStaged().get(selectedToken) || ''}
                    graph={graph}
                    tokens={tokens}
                    stagedValues={getAllStaged()}
                  />
                </div>
              )}
              {!selectedToken && (
                <>
                  {pendingCount > 0 ? (
                    <EdScrollArea orientation="vertical" className="ed-pending-drawer__scroll">
                      <div className="ed-pending-drawer__changes-list">
                        {newTokens.map((newToken) => (
                          <div key={newToken.cssName} className="ed-pending-drawer__change-item">
                            <div className="ed-pending-drawer__change-content">
                              <div className="ed-pending-drawer__token-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{
                                  fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em',
                                  padding: '1px 5px', borderRadius: '3px',
                                  background: 'rgba(39,174,96,0.15)', color: '#27ae60',
                                  textTransform: 'uppercase', flexShrink: 0,
                                }}>NEW</span>
                                {newToken.cssName}
                              </div>
                              <div className="ed-pending-drawer__value-change">
                                <EdChip variant="accent" className="ed-pending-drawer__new-value">
                                  {withPxAnnotation(newToken.value)}
                                </EdChip>
                              </div>
                            </div>
                            <div className="ed-pending-drawer__change-actions">
                              <EdButton variant="secondary" size="sm" onClick={() => unstageNewToken(newToken.cssName)}>
                                Remove
                              </EdButton>
                            </div>
                          </div>
                        ))}
                        {pendingChanges.map(({ stagedKey, tokenName, originalValue, stagedValue, isDark }) => (
                          <div key={stagedKey} className="ed-pending-drawer__change-item">
                            <div
                              className="ed-pending-drawer__change-content"
                              onClick={() => setSelectedToken(stagedKey)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="ed-pending-drawer__token-name">
                                {tokenName}
                                {isDark && <span className="ed-pending-drawer__theme-badge">Dark</span>}
                              </div>
                              <div className="ed-pending-drawer__value-change">
                                <EdChip variant="default" className="ed-pending-drawer__old-value">
                                  {withPxAnnotation(originalValue)}
                                </EdChip>
                                <span className="ed-pending-drawer__arrow"><ArrowRight size={12} aria-hidden="true" /></span>
                                <EdChip variant="accent" className="ed-pending-drawer__new-value">
                                  {withPxAnnotation(stagedValue)}
                                </EdChip>
                              </div>
                            </div>
                            <div className="ed-pending-drawer__change-actions">
                              <EdButton variant="secondary" size="sm" onClick={() => handleReset(stagedKey)}>
                                Reset
                              </EdButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    </EdScrollArea>
                  ) : (
                    <div className="ed-pending-drawer__empty">
                      <p className="ed-pending-drawer__empty-message">
                        All changes exported. No pending items.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="ed-pending-drawer__footer">
              <EdButton
                variant="secondary"
                size="md"
                onClick={handleDiscardAll}
                disabled={pendingCount === 0}
              >
                Discard All
              </EdButton>
              <EdButton
                variant="primary"
                size="md"
                onClick={handleExport}
                disabled={pendingCount === 0}
              >
                Export {pendingCount > 0 && `(${pendingCount})`}
              </EdButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
