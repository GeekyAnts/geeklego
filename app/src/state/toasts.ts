// Lightweight toast store for edit feedback. A toast describes a single token
// change ("what was done") and carries an undo() that reverts exactly that change.
// Same external-store pattern as staging.ts / semanticLocks.ts.

export interface Toast {
  id: number
  /** Human-readable summary, e.g. "--primary → brand-600 (light)". */
  message: string
  /** Optional detail line, e.g. the from→to values. */
  detail?: string
  /** Reverts this specific change. Omit for non-undoable info toasts. */
  undo?: () => void
}

let toasts: Toast[] = []
let nextId = 1
let callbacks: (() => void)[] = []

function notify(): void {
  for (const cb of callbacks) cb()
}

export function subscribeToToasts(cb: () => void): () => void {
  callbacks.push(cb)
  return () => { callbacks = callbacks.filter(c => c !== cb) }
}

export function getToasts(): readonly Toast[] {
  return toasts
}

export function pushToast(t: Omit<Toast, 'id'>): number {
  const id = nextId++
  toasts = [...toasts, { ...t, id }]
  notify()
  return id
}

export function dismissToast(id: number): void {
  toasts = toasts.filter(t => t.id !== id)
  notify()
}

import { stage, unstage } from './staging.ts'

/** Short label for a value alias, e.g. "var(--color-brand-600)" → "brand-600". */
function shortValue(v: string): string {
  return v.replace(/^var\(--color-|^var\(--|\)$/g, '')
}

/**
 * Fire an "edit applied" toast whose Undo reverts EXACTLY this staging key to
 * whatever it held before. Captures the prior value at call time, so call this
 * AFTER reading the old value but the function reads it itself for convenience —
 * pass the value that was there before staging via `prevValue`.
 */
export function pushEditToast(opts: {
  stagingKey: string
  label: string          // human label for the token, e.g. "--primary (dark)"
  prevValue: string | undefined  // staged value before this edit (undefined = wasn't staged)
  newValue: string
  verb?: string          // "Updated" | "Applied suggestion to" | …
}): void {
  const { stagingKey, label, prevValue, newValue, verb = 'Updated' } = opts
  pushToast({
    message: `${verb} ${label}`,
    detail: `${prevValue !== undefined ? shortValue(prevValue) : '—'} → ${shortValue(newValue)}`,
    undo: () => {
      if (prevValue === undefined) unstage(stagingKey)
      else stage(stagingKey, prevValue)
    },
  })
}
