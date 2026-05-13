"use client"
import { createContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type {
  GeeklegoI18nContextValue,
  GeeklegoI18nStrings,
  GeeklegoFormatters,
} from './GeeklegoI18nProvider.types';

// ── Context ────────────────────────────────────────────────────────────────
// null = "no provider present" — the hook falls back to DEFAULT_STRINGS.
// Exported so useGeeklegoI18n.ts can consume it without going through the barrel.

export const GeeklegoI18nContext =
  createContext<GeeklegoI18nContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

export interface GeeklegoI18nProviderProps {
  children: ReactNode;
  /**
   * Partial string overrides applied library-wide.
   * Components merge these with their own defaults; per-instance `i18nStrings`
   * props override these.
   *
   * @example
   * <GeeklegoI18nProvider
   *   strings={{ label: { required: '(obligatoire)' }, sidebar: { navLabel: 'Navigation' } }}
   * >
   *   <App />
   * </GeeklegoI18nProvider>
   */
  strings?: GeeklegoI18nStrings;
  /**
   * Locale-aware formatters for number, percentage, and date display.
   * Affects AreaChart Y-axis and BarChart percentage values when provided.
   */
  formatters?: GeeklegoFormatters;
  /**
   * BCP 47 locale tag passed through to formatters that accept it.
   * Does not affect Geeklego itself — available for consumer formatter logic.
   */
  locale?: string;
}

/**
 * Optional library-wide i18n provider for Geeklego.
 *
 * Wrap your application (or a subtree) with this provider to apply
 * locale-specific strings and formatters to all Geeklego components.
 * Per-instance `i18nStrings` props on individual components override
 * anything set here.
 *
 * Geeklego is library-agnostic — wire your own i18n tool here:
 *
 * @example
 * // With react-intl
 * <GeeklegoI18nProvider
 *   strings={{ barChart: { deltaLabel: intl.formatMessage({ id: 'chart.delta' }) } }}
 * >
 *   <App />
 * </GeeklegoI18nProvider>
 */
export function GeeklegoI18nProvider({
  children,
  strings = {},
  formatters = {},
  locale,
}: GeeklegoI18nProviderProps) {
  // Memoised — prevents re-rendering all consumers when an unrelated ancestor
  // re-renders. Only changes when strings/formatters/locale references change.
  const value = useMemo<GeeklegoI18nContextValue>(
    () => ({ strings, formatters, locale }),
    [strings, formatters, locale],
  );

  return (
    <GeeklegoI18nContext.Provider value={value}>
      {children}
    </GeeklegoI18nContext.Provider>
  );
}
