import { useState, useEffect, useRef } from 'react'
import type { GeeklegoTokens } from '../types.ts'
import type { ValidationResult } from '../utils/tokenValidator.ts'
import { generateCss } from '../utils/cssGenerator.ts'

interface Props {
  tokens: GeeklegoTokens
  validation?: ValidationResult
  onCheckpoint?: (label: string, tokenSnapshot?: GeeklegoTokens) => void
  showDeprecated?: boolean
  setShowDeprecated?: React.Dispatch<React.SetStateAction<boolean>>
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function ExportTab({ tokens, validation, onCheckpoint }: Props) {
  const [css, setCss] = useState('')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [autoSave, setAutoSave] = useState(false)
  const [copied, setCopied] = useState(false)
  const [restoreStatus, setRestoreStatus] = useState<'idle' | 'done' | 'error'>('idle')
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setCss(generateCss(tokens))
  }, [tokens])

  // Auto-save with debounce
  useEffect(() => {
    if (!autoSave) return
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => {
      saveToFile()
    }, 500)
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }
  }, [tokens, autoSave])

  const [showValidation, setShowValidation] = useState(false)
  const hasBlockers = (validation?.blockers.length ?? 0) > 0
  const hasIssues = hasBlockers || (validation?.errors.length ?? 0) > 0 || (validation?.warnings.length ?? 0) > 0

  async function saveToFile() {
    if (hasBlockers) return // Block save when blockers exist
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/save-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tokens),
      })
      const data = await res.json()
      setSaveStatus(data.success ? 'saved' : 'error')
      if (data.success && onCheckpoint) onCheckpoint('Saved to disk')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2500)
    }
  }

  async function restoreDefault() {
    setRestoreStatus('idle')
    try {
      const res = await fetch('/api/restore-default', { method: 'POST' })
      const data = await res.json()
      setRestoreStatus(data.success ? 'done' : 'error')
      setTimeout(() => setRestoreStatus('idle'), 2500)
    } catch {
      setRestoreStatus('error')
      setTimeout(() => setRestoreStatus('idle'), 2500)
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(css).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function downloadFile() {
    const blob = new Blob([css], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'geeklego.css'
    a.click()
    URL.revokeObjectURL(url)
  }

  const lineCount = css.split('\n').length

  return (
    <div className="flex flex-col h-full">

      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div
        className="flex items-center px-6 flex-shrink-0"
        style={{
          minHeight: 56,
          padding: '10px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: 'linear-gradient(to bottom, #111, #0e0e0e)',
          boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.03)',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        {/* Stats — left side */}
        <div style={{ fontSize: 12, color: '#525252' }}>
          <span style={{ color: '#a0a0a0', fontWeight: 500 }}>{lineCount.toLocaleString()}</span>
          <span style={{ margin: '0 4px' }}>lines</span>
          <span style={{ color: '#3f3f3f', margin: '0 4px' }}>·</span>
          <span style={{ color: '#a0a0a0', fontWeight: 500 }}>{(css.length / 1024).toFixed(1)}</span>
          <span style={{ marginLeft: 4 }}>KB</span>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Auto-save toggle — tertiary */}
        <label
          className="flex items-center gap-2 cursor-pointer select-none"
          style={{ paddingRight: 4 }}
        >
          <div
            style={{
              width: 32,
              height: 18,
              borderRadius: 9,
              background: autoSave ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.08)',
              border: `1px solid ${autoSave ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)'}`,
              position: 'relative',
              transition: 'all 0.2s',
              cursor: 'pointer',
              boxShadow: autoSave ? 'inset 0 1px 3px rgba(0,0,0,0.3)' : 'inset 0 1px 3px rgba(0,0,0,0.4)',
            }}
            onClick={() => setAutoSave(v => !v)}
          >
            <div style={{
              position: 'absolute',
              top: 2,
              left: autoSave ? 16 : 2,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: 'white',
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
            }} />
          </div>
          <span style={{ fontSize: 11, color: '#6b7280' }}>Auto-save</span>
        </label>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.06)' }} />

        
        {/* Divider */}
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.06)' }} />

        {/* Copy — secondary */}
        <button
          onClick={copyToClipboard}
          className="gl-btn-ghost flex items-center gap-1.5"
          style={{ fontSize: 12 }}
        >
          {copied ? (
            <>
              <span style={{ color: '#4ade80' }}>✓</span>
              Copied
            </>
          ) : (
            <>⎘ Copy</>
          )}
        </button>

        {/* Download — secondary */}
        <button
          onClick={downloadFile}
          className="gl-btn-ghost flex items-center gap-1.5"
          style={{ fontSize: 12 }}
        >
          ↓ Download
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.06)' }} />

        {/* Save to file — PRIMARY CTA */}
        <button
          onClick={() => saveToFile()}
          disabled={saveStatus === 'saving' || hasBlockers}
          className="gl-btn-primary flex items-center gap-1.5"
          style={{
            fontSize: 12,
            padding: '6px 18px',
            ...(saveStatus === 'saved' ? {
              background: 'linear-gradient(to bottom, #22c55e, #16a34a)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(34,197,94,0.3)',
            } : saveStatus === 'error' ? {
              background: 'linear-gradient(to bottom, #ef4444, #dc2626)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(239,68,68,0.3)',
            } : saveStatus === 'saving' ? {
              opacity: 0.7,
            } : {}),
          }}
        >
          {saveStatus === 'saving' ? '⟳ Saving…'
            : saveStatus === 'saved' ? '✓ Saved'
            : saveStatus === 'error' ? '✕ Error'
            : '↑ Save to geeklego.css'}
        </button>

        {/* Restore — tertiary */}
        <button
          onClick={restoreDefault}
          title="Restore original design system CSS from backup"
          style={{
            fontSize: 11,
            padding: '5px 10px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.07)',
            cursor: 'pointer',
            transition: 'all 0.15s',
            background: restoreStatus === 'done'
              ? 'rgba(34,197,94,0.1)'
              : restoreStatus === 'error'
              ? 'rgba(239,68,68,0.1)'
              : 'transparent',
            color: restoreStatus === 'done' ? '#4ade80'
              : restoreStatus === 'error' ? '#f87171'
              : '#525252',
          }}
          onMouseEnter={e => {
            if (restoreStatus === 'idle') {
              (e.currentTarget as HTMLElement).style.color = '#a0a0a0'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
            }
          }}
          onMouseLeave={e => {
            if (restoreStatus === 'idle') {
              (e.currentTarget as HTMLElement).style.color = '#525252'
              ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            }
          }}
        >
          {restoreStatus === 'done' ? '✓ Restored' : restoreStatus === 'error' ? '✕ No backup' : '↺ Restore'}
        </button>
      </div>

      {/* ── Info banner ─────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 px-6 py-2.5 flex-shrink-0"
        style={{
          borderBottom: '1px solid rgba(99,102,241,0.12)',
          background: 'rgba(99,102,241,0.05)',
        }}
      >
        <span style={{ fontSize: 11, color: '#6366f1', opacity: 0.6 }}>↑</span>
        <span style={{ fontSize: 11, color: '#4f5580' }}>
          "Save to geeklego.css" writes directly to{' '}
          <code style={{ fontFamily: 'monospace', color: '#6366f1', opacity: 0.8 }}>design-system/geeklego.css</code>
          {' '}and creates a backup at{' '}
          <code style={{ fontFamily: 'monospace', color: '#6366f1', opacity: 0.8 }}>design-system/geeklego.default.css</code>
          {' '}on first save.
        </span>
      </div>


      {/* ── Validation panel ─────────────────────────────────────────── */}
      {hasIssues && (
        <div style={{
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          background: hasBlockers ? 'rgba(239,68,68,0.05)' : (validation?.errors.length ?? 0) > 0 ? 'rgba(239,68,68,0.03)' : 'rgba(234,179,8,0.03)',
        }}>
          <button
            onClick={() => setShowValidation(v => !v)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 24px',
              fontSize: 11,
              color: hasBlockers ? '#f87171' : (validation?.errors.length ?? 0) > 0 ? '#f87171' : '#eab308',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span>{showValidation ? '▾' : '▸'}</span>
            <span>
              {(validation?.blockers.length ?? 0) > 0 && `${validation!.blockers.length} blocker${validation!.blockers.length > 1 ? 's' : ''}`}
              {(validation?.blockers.length ?? 0) > 0 && (validation!.errors.length > 0 || validation!.warnings.length > 0) && ' · '}
              {(validation?.errors.length ?? 0) > 0 && `${validation!.errors.length} error${validation!.errors.length > 1 ? 's' : ''}`}
              {(validation?.errors.length ?? 0) > 0 && (validation?.warnings.length ?? 0) > 0 && ' · '}
              {(validation?.warnings.length ?? 0) > 0 && `${validation!.warnings.length} warning${validation!.warnings.length > 1 ? 's' : ''}`}
            </span>
            {hasBlockers && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#ef4444' }}>Save blocked</span>}
          </button>
          {showValidation && validation && (
            <div style={{ padding: '0 24px 12px', maxHeight: 200, overflowY: 'auto' }}>
              {validation.blockers.map((b, i) => (
                <div key={`b-${i}`} style={{ fontSize: 11, color: '#f87171', padding: '3px 0', display: 'flex', gap: 6 }}>
                  <span>⊘</span>
                  <span><strong>{b.path}:</strong> {b.message}</span>
                </div>
              ))}
              {validation.errors.map((e, i) => (
                <div key={`e-${i}`} style={{ fontSize: 11, color: '#fb923c', padding: '3px 0', display: 'flex', gap: 6 }}>
                  <span>✕</span>
                  <span><strong>{e.path}:</strong> {e.message}</span>
                </div>
              ))}
              {validation.warnings.map((w, i) => (
                <div key={`w-${i}`} style={{ fontSize: 11, color: '#a3a3a3', padding: '3px 0', display: 'flex', gap: 6 }}>
                  <span>⚠</span>
                  <span><strong>{w.path}:</strong> {w.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Code preview ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        <pre
          style={{
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            color: '#6b7280',
            padding: '24px',
            lineHeight: 1.7,
            tabSize: 2,
            whiteSpace: 'pre',
            minHeight: '100%',
            background: 'transparent',
            margin: 0,
          }}
        >
          {css}
        </pre>
      </div>
    </div>
  )
}
