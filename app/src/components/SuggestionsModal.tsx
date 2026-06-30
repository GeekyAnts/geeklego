import { useEffect, useCallback, useMemo, useState } from 'react'
import { X, ArrowRight, Check } from 'lucide-react'
import { stage, getStagedValue, subscribeToPendingChanges } from '../state/staging'
import { subscribeToLockChanges } from '../state/semanticLocks'
import { withPxAnnotation } from '../utils/colorUtils'
import { computeAvailableSuggestions, type AvailableSuggestion } from '../state/suggestions'
import type { GeeklegoTokensV2 } from '../types'

interface SuggestionsModalProps {
  open: boolean
  onClose: () => void
  tokens: GeeklegoTokensV2 | null
  /** Notified after each apply so the host can surface an undo toast.
   *  prevValue = the staging value before this apply (undefined if it wasn't staged). */
  onApplied?: (s: AvailableSuggestion, prevValue: string | undefined) => void
}

export function SuggestionsModal({ open, onClose, tokens, onApplied }: SuggestionsModalProps) {
  const [version, setVersion] = useState(0)

  // Re-render when staging or locks change (both affect which suggestions remain available).
  useEffect(() => {
    const unsubP = subscribeToPendingChanges(() => setVersion(n => n + 1))
    const unsubL = subscribeToLockChanges(() => setVersion(n => n + 1))
    return () => { unsubP(); unsubL() }
  }, [])

  const suggestions = useMemo(
    () => computeAvailableSuggestions(tokens),
    // version is the invalidation signal for the external staged/lock stores.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tokens, version],
  )

  const applyOne = useCallback((s: AvailableSuggestion) => {
    const prev = getStagedValue(s.stagingKey)
    stage(s.stagingKey, s.to)
    onApplied?.(s, prev)
  }, [onApplied])

  const applyAll = useCallback(() => {
    for (const s of suggestions) {
      const prev = getStagedValue(s.stagingKey)
      stage(s.stagingKey, s.to)
      onApplied?.(s, prev)
    }
  }, [suggestions, onApplied])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <div className="ed-pending-modal__backdrop" onClick={onClose} aria-hidden="true" />

      <div
        className="ed-pending-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Available suggestions"
      >
        <div className="ed-pending-modal__header">
          <div className="ed-pending-modal__title-row">
            <span className="ed-pending-modal__title">Suggestions</span>
            <span className="ed-pending-modal__count">{suggestions.length}</span>
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

        <div className="ed-pending-modal__body">
          {suggestions.length === 0 ? (
            <div className="ed-pending-modal__empty">
              No suggestions available — every semantic already matches its auto-pick (or is locked).
            </div>
          ) : (
            <div className="ed-pending-modal__list">
              {suggestions.map((s) => (
                <div key={`${s.theme}:${s.cssName}`} className="ed-pending-modal__item">
                  <div className="ed-pending-modal__item-info">
                    <span className="ed-pending-modal__token-name">
                      <span className={`ed-suggest-theme-tag ed-suggest-theme-tag--${s.theme}`}>
                        {s.theme}
                      </span>
                      {s.cssName}
                    </span>
                    <div className="ed-pending-modal__value-row">
                      <span className="ed-pending-modal__old">{withPxAnnotation(s.from)}</span>
                      <span className="ed-pending-modal__arrow"><ArrowRight size={11} aria-hidden="true" /></span>
                      <span className="ed-pending-modal__new">{withPxAnnotation(s.to)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="ed-pending-modal__undo-btn ed-suggest-apply-btn"
                    onClick={() => applyOne(s)}
                    aria-label={`Apply suggestion for ${s.cssName} (${s.theme})`}
                  >
                    <Check size={11} aria-hidden="true" /> Apply
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="ed-pending-modal__footer">
            <button
              type="button"
              className="ed-pending-modal__undo-all ed-suggest-apply-all"
              onClick={applyAll}
            >
              Apply all suggestions
            </button>
          </div>
        )}
      </div>
    </>
  )
}
