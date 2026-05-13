"use client";

/**
 * Internal hook — NOT exported from the public barrel (index.ts).
 *
 * Components import this directly with a relative path:
 *   import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
 *
 * This keeps the public surface clean. Consumers only need GeeklegoI18nProvider.
 */

import { useContext, useMemo } from 'react';
import { GeeklegoI18nContext } from './GeeklegoI18nProvider';
import { DEFAULT_STRINGS, DEFAULT_FORMATTERS } from './GeeklegoI18nProvider.types';
import type { GeeklegoI18nStrings, GeeklegoFormatters } from './GeeklegoI18nProvider.types';

type ComponentKey = keyof GeeklegoI18nStrings;

/**
 * Resolves i18n strings for a component.
 *
 * Merge order (most specific wins):
 *   DEFAULT_STRINGS[key]  ←  context.strings[key]  ←  propOverride
 *
 * @param componentKey  The camelCase key in GeeklegoI18nStrings
 * @param propOverride  Per-instance i18nStrings prop (beats context)
 *
 * @returns Merged strings for the component + formatters from context
 */
export function useComponentI18n<K extends ComponentKey>(
  componentKey: K,
  propOverride?: GeeklegoI18nStrings[K],
): NonNullable<GeeklegoI18nStrings[K]> & { formatters: GeeklegoFormatters } {
  const ctx = useContext(GeeklegoI18nContext);

  return useMemo(
    () =>
      ({
        // Layer 1 — hardcoded English defaults (always present)
        ...DEFAULT_STRINGS[componentKey],
        // Layer 2 — consumer's i18n provider (partial overrides)
        ...ctx?.strings[componentKey],
        // Layer 3 — per-instance prop override (most specific — always wins)
        ...propOverride,
        // Formatters travel with the resolved strings (defaults if no context)
        formatters: {
          ...DEFAULT_FORMATTERS,
          ...ctx?.formatters,
        },
      }) as NonNullable<GeeklegoI18nStrings[K]> & { formatters: GeeklegoFormatters },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [componentKey, ctx, propOverride],
  );
}
