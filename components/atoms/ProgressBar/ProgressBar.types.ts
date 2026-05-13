import type { HTMLAttributes } from 'react';

export type ProgressBarVariant = 'default' | 'success' | 'warning' | 'error' | 'neutral';
export type ProgressBarSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Current progress value (0–max). Omit or pass `undefined` for the
   * indeterminate / loading state where progress is unknown.
   */
  value?: number;

  /** Maximum value the progress can reach. Defaults to `100`. */
  max?: number;

  /** Visual color variant signalling the semantic meaning of the progress. Defaults to `'default'`. */
  variant?: ProgressBarVariant;

  /** Track height. Controls the visual weight of the bar. Defaults to `'md'`. */
  size?: ProgressBarSize;

  /**
   * Render pill-shaped (fully rounded) track and fill ends.
   * Set to `false` for a flush/squared bar (e.g. a full-width page loader).
   * Defaults to `true`.
   */
  rounded?: boolean;

  /**
   * Human-readable label for the progress bar.
   * - Always used as `aria-label` for screen-reader accessibility.
   * - Also rendered visually when `showLabel` is `true`.
   */
  label?: string;

  /** Render the `label` string as visible text above the bar. Defaults to `false`. */
  showLabel?: boolean;

  /**
   * Render the computed percentage (e.g. "60%") to the right of the label row.
   * Hidden automatically in the indeterminate state.
   * Defaults to `false`.
   */
  showValue?: boolean;
}
