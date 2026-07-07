import { useEffect, useRef, useState } from 'react'
import { X, RotateCcw } from 'lucide-react'
import { subscribeToToasts, getToasts, dismissToast, type Toast } from '../state/toasts'
import './ToastHost.css'

const AUTO_DISMISS_MS = 6000

export function ToastHost() {
  const [, force] = useState(0)
  useEffect(() => subscribeToToasts(() => force(n => n + 1)), [])

  const toasts = getToasts()

  return (
    <div className="ed-toast-host" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}

function ToastItem({ toast }: { toast: Toast }) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timer.current = setTimeout(() => dismissToast(toast.id), AUTO_DISMISS_MS)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [toast.id])

  const handleUndo = () => {
    toast.undo?.()
    dismissToast(toast.id)
  }

  return (
    <div className="ed-toast">
      <div className="ed-toast__body">
        <span className="ed-toast__message">{toast.message}</span>
        {toast.detail && <span className="ed-toast__detail">{toast.detail}</span>}
      </div>
      <div className="ed-toast__actions">
        {toast.undo && (
          <button type="button" className="ed-toast__undo" onClick={handleUndo}>
            <RotateCcw size={12} aria-hidden="true" /> Undo
          </button>
        )}
        <button
          type="button"
          className="ed-toast__close"
          onClick={() => dismissToast(toast.id)}
          aria-label="Dismiss notification"
        >
          <X size={13} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
