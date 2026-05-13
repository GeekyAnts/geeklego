"use client";

import { useEffect, useRef } from 'react';
import type { UseFocusTrapOptions } from './useFocusTrap.types';

const FOCUSABLE_SELECTOR = [
  'a[href]:not([disabled]):not([inert])',
  'button:not([disabled]):not([inert])',
  'input:not([disabled]):not([inert])',
  'select:not([disabled]):not([inert])',
  'textarea:not([disabled]):not([inert])',
  '[tabindex]:not([tabindex="-1"]):not([disabled]):not([inert])',
].join(', ');

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.closest('[inert]'),
  );
}

/**
 * Traps focus within a container element.
 *
 * On activation: records the previously focused element, then focuses the
 * first focusable child. Tab at the last element wraps to the first;
 * Shift+Tab at the first wraps to the last.
 *
 * On deactivation: returns focus to the previously focused element.
 *
 * Use for: Modal, Dialog, responsive Sidebar overlay, Popover.
 */
export function useFocusTrap({
  active,
  containerRef,
  returnFocusTo,
  autoFocus = true,
}: UseFocusTrapOptions): void {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Auto-focus on activation
  useEffect(() => {
    if (!active || !containerRef.current) return;

    // Record the element that had focus before the trap activated
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    if (autoFocus) {
      const focusable = getFocusableElements(containerRef.current);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        // Fallback: focus the container itself if it's focusable
        containerRef.current.focus();
      }
    }

    return () => {
      // Restore focus if the component unmounts while the trap is still active
      // (e.g. route change while a Modal is open)
      const target = returnFocusTo?.current ?? previouslyFocusedRef.current;
      target?.focus();
      previouslyFocusedRef.current = null;
    };
  }, [active, containerRef, autoFocus]);

  // Return focus on deactivation
  useEffect(() => {
    if (active) return;

    const target = returnFocusTo?.current ?? previouslyFocusedRef.current;
    if (target && typeof target.focus === 'function') {
      target.focus();
    }
    previouslyFocusedRef.current = null;
  }, [active, returnFocusTo]);

  // Tab wrapping
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;

    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // Shift+Tab on first element → wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab on last element → wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener('keydown', handler);
    return () => container.removeEventListener('keydown', handler);
  }, [active, containerRef]);
}
