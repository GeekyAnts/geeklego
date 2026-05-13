"use client";

import { useCallback } from 'react';
import type {
  UseRovingTabindexOptions,
  UseRovingTabindexReturn,
  RovingItemProps,
} from './useRovingTabindex.types';

/**
 * Implements the WAI-ARIA roving tabindex pattern.
 *
 * Only one item in the group has `tabIndex={0}` (the active item).
 * All other items have `tabIndex={-1}`. Arrow keys move focus within
 * the group; Tab leaves the group entirely.
 *
 * Use for: tab lists, sidebar nav, radio groups, menus, toolbars.
 */
export function useRovingTabindex({
  itemCount,
  activeIndex = 0,
  orientation = 'vertical',
  loop = true,
  isItemDisabled,
  onActiveIndexChange,
}: UseRovingTabindexOptions): UseRovingTabindexReturn {
  const findNext = useCallback(
    (from: number, direction: 1 | -1): number => {
      if (itemCount === 0) return -1;

      let candidate = from + direction;
      const visited = new Set<number>();

      while (!visited.has(candidate)) {
        visited.add(candidate);

        // Wrap or clamp
        if (candidate < 0) {
          if (loop) {
            candidate = itemCount - 1;
          } else {
            return from; // stay put
          }
        } else if (candidate >= itemCount) {
          if (loop) {
            candidate = 0;
          } else {
            return from; // stay put
          }
        }

        // Skip disabled items
        if (!isItemDisabled?.(candidate)) {
          return candidate;
        }

        candidate += direction;
      }

      return from; // all items disabled — stay put
    },
    [itemCount, loop, isItemDisabled],
  );

  const findFirst = useCallback((): number => {
    for (let i = 0; i < itemCount; i++) {
      if (!isItemDisabled?.(i)) return i;
    }
    return -1;
  }, [itemCount, isItemDisabled]);

  const findLast = useCallback((): number => {
    for (let i = itemCount - 1; i >= 0; i--) {
      if (!isItemDisabled?.(i)) return i;
    }
    return -1;
  }, [itemCount, isItemDisabled]);

  const isNextKey = (key: string): boolean => {
    if (orientation === 'vertical') return key === 'ArrowDown';
    if (orientation === 'horizontal') return key === 'ArrowRight';
    return key === 'ArrowDown' || key === 'ArrowRight';
  };

  const isPrevKey = (key: string): boolean => {
    if (orientation === 'vertical') return key === 'ArrowUp';
    if (orientation === 'horizontal') return key === 'ArrowLeft';
    return key === 'ArrowUp' || key === 'ArrowLeft';
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let nextIndex: number | null = null;

      if (isNextKey(e.key)) {
        e.preventDefault();
        nextIndex = findNext(activeIndex, 1);
      } else if (isPrevKey(e.key)) {
        e.preventDefault();
        nextIndex = findNext(activeIndex, -1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = findFirst();
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = findLast();
      }

      if (nextIndex !== null && nextIndex !== activeIndex && nextIndex >= 0) {
        onActiveIndexChange(nextIndex);
      }
    },
    [activeIndex, findNext, findFirst, findLast, onActiveIndexChange],
  );

  const getItemProps = useCallback(
    (index: number): RovingItemProps => ({
      tabIndex: index === activeIndex ? 0 : -1,
    }),
    [activeIndex],
  );

  return { handleKeyDown, getItemProps };
}
