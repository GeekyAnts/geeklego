import type { HTMLAttributes, ReactNode } from 'react';
import type { StatCardI18nStrings } from '../../utils/i18n/GeeklegoI18nProvider.types';

export type StatCardVariant = 'elevated' | 'outlined' | 'filled' | 'ghost';
export type StatCardSize = 'sm' | 'md' | 'lg';
export type StatCardTrend = 'up' | 'down' | 'neutral';

export interface StatCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The metric label (e.g. "Total Revenue"). */
  label: string;
  /** The primary metric value (e.g. "$12,450" or a ReactNode). */
  value: ReactNode;
  /**
   * Percentage change as a number (e.g. `12.5` for +12.5%, `-4.2` for −4.2%).
   * Determines trend colour and direction icon automatically unless `trend` is provided.
   */
  delta?: number;
  /** Context label shown after the delta (e.g. "vs last month"). */
  deltaLabel?: string;
  /**
   * Override trend direction. Defaults to `'up'` when delta > 0,
   * `'down'` when delta < 0, and `'neutral'` when delta is 0 or undefined.
   */
  trend?: StatCardTrend;
  /** Optional icon node displayed in the top-right corner. Pass a Lucide icon. */
  icon?: ReactNode;
  /** Visual container style. Defaults to 'elevated'. */
  variant?: StatCardVariant;
  /** Typography and spacing scale. Defaults to 'md'. */
  size?: StatCardSize;
  /** Replaces the card content with a skeleton/spinner loading state. */
  isLoading?: boolean;
  /** Per-instance string overrides for i18n (SR trend labels, loading label). */
  i18nStrings?: StatCardI18nStrings;
}
