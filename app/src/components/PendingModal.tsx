import { useEffect, useCallback, useMemo } from 'react'
import { X, ArrowRight, RotateCcw } from 'lucide-react'
import { getAllStaged, unstage, discardAll, subscribeToPendingChanges, getStagedNewTokens, unstageNewToken } from '../state/staging'
import { withPxAnnotation } from '../utils/colorUtils'
import type { GeeklegoTokensV2 } from '../types'
import { useState } from 'react'

function buildOriginalMap(
  tokens: GeeklegoTokensV2
): Map<string, string> {
  const map = new Map<string, string>()

  // Flatten primitives
  const PRIMITIVE_PREFIX: Record<string, string> = {
    colors: 'color', fontFamily: 'font', fontSize: 'text',
    fontWeight: 'font-weight', lineHeight: 'leading', letterSpacing: 'tracking',
    spacing: 'spacing', radius: 'radius', borderWidth: 'border-width',
    duration: 'duration',
    easing: 'ease',
  }
  const prims = tokens.primitives as unknown as Record<string, unknown>
  for (const [cat, prefix] of Object.entries(PRIMITIVE_PREFIX)) {
    const data = prims[cat]
    if (!data || typeof data !== 'object') continue
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      if (typeof v === 'string') {
        map.set(`--${prefix}-${k}`, v)
      } else if (v && typeof v === 'object') {
        for (const [k2, v2] of Object.entries(v as Record<string, string>)) {
          map.set(`--${prefix}-${k}-${k2}`, v2)
        }
      }
    }
  }

  // Flatten flat v2 semantics — CSS var for a key is `--<key>`
  for (const [k, v] of Object.entries(tokens.semantics.light)) {
    map.set(`--${k}`, v)
  }

  return map
}

interface PendingModalProps {
  open: boolean
  onClose: () => void
  tokens: GeeklegoTokensV2
}

export function PendingModal({ open, onClose, tokens }: PendingModalProps) {
  const [pendingVersion, setPendingVersion] = useState(0)

  // Re-render when staging changes
  useEffect(() => {
    const unsub = subscribeToPendingChanges(() => setPendingVersion(n => n + 1))
    return unsub
  }, [])

  const originalMap = useMemo(
    () => buildOriginalMap(tokens),
    [tokens]
  )

  const changes = useMemo(() => {
    const staged = getAllStaged()
    const edits = [...staged.entries()].map(([name, newVal]) => ({
      name,
      original: originalMap.get(name) ?? '—',
      newVal,
      isNew: false,
    }))
    const newTokens = [...getStagedNewTokens().values()].map(t => ({
      name: t.cssName,
      original: '—',
      newVal: t.value,
      isNew: true,
    }))
    return [...newTokens, ...edits]
    // pendingVersion is a version counter bumped by subscribeToPendingChanges;
    // it's the invalidation signal that re-reads the external staged store
    // (getAllStaged/getStagedNewTokens aren't reactive values ESLint can track).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalMap, pendingVersion])

  const handleUndoOne = useCallback((name: string, isNew: boolean) => {
    if (isNew) unstageNewToken(name)
    else unstage(name)
  }, [])

  const handleUndoAll = useCallback(() => {
    discardAll()
    onClose()
  }, [onClose])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="ed-pending-modal__backdrop" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div
        className="ed-pending-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Pending token changes"
      >
        {/* Header */}
        <div className="ed-pending-modal__header">
          <div className="ed-pending-modal__title-row">
            <span className="ed-pending-modal__title">Pending Changes</span>
            <span className="ed-pending-modal__count">{changes.length}</span>
          </div>
          <button
            type="button"
            className="ed-pending-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="ed-pending-modal__body">
          {changes.length === 0 ? (
            <div className="ed-pending-modal__empty">No pending changes.</div>
          ) : (
            <div className="ed-pending-modal__list">
              {changes.map(({ name, original, newVal, isNew }) => (
                <div key={name} className="ed-pending-modal__item">
                  <div className="ed-pending-modal__item-info">
                    <span className="ed-pending-modal__token-name">
                      {isNew && (
                        <span className="ed-pending-modal__new-badge">NEW</span>
                      )}
                      {name}
                    </span>
                    <div className="ed-pending-modal__value-row">
                      <span className="ed-pending-modal__old">{withPxAnnotation(original)}</span>
                      <span className="ed-pending-modal__arrow"><ArrowRight size={11} aria-hidden="true" /></span>
                      <span className="ed-pending-modal__new">{withPxAnnotation(newVal)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ed-pending-modal__undo-btn"
                    onClick={() => handleUndoOne(name, isNew)}
                    aria-label={`Undo change to ${name}`}
                  >
                    <RotateCcw size={11} aria-hidden="true" /> Undo
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {changes.length > 0 && (
          <div className="ed-pending-modal__footer">
            <button
              type="button"
              className="ed-pending-modal__undo-all"
              onClick={handleUndoAll}
            >
              Undo all changes
            </button>
          </div>
        )}
      </div>
    </>
  )
}
