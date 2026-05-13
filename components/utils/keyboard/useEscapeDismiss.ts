"use client";

import { useEffect } from 'react';
import type { UseEscapeDismissOptions } from './useEscapeDismiss.types';

/**
 * Dismisses an overlay when the Escape key is pressed.
 *
 * Adds a `keydown` listener on `document` when `active` is true.
 * Uses `stopPropagation` so the innermost overlay wins when nested.
 */
export function useEscapeDismiss({ active, onDismiss }: UseEscapeDismissOptions): void {
  useEffect(() => {
    if (!active) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onDismiss();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [active, onDismiss]);
}
