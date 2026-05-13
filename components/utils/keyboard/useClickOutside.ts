"use client";

import { useEffect } from 'react';
import type { UseClickOutsideOptions } from './useClickOutside.types';

/**
 * Calls `onClickOutside` when a pointer event lands outside the container.
 *
 * Listens on `mousedown` and `touchstart` so the dismissal fires before
 * the click event reaches other handlers.
 */
export function useClickOutside({
  active,
  containerRef,
  onClickOutside,
}: UseClickOutsideOptions): void {
  useEffect(() => {
    if (!active) return;

    const handler = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [active, containerRef, onClickOutside]);
}
