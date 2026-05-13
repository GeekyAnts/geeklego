import type { HTMLAttributes } from 'react';

export type ProgressIndicatorVariant = 'default' | 'success' | 'warning' | 'error';
export type ProgressIndicatorSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ProgressIndicatorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Current progress value (0–max). Omit or pass `undefined` for the
   * indeterminate / loading state where progress is unknown.
   */
  value?: number;

  /** Maximum value the progress can reach. Defaults to `100`. */
  max?: number;

  /** Visual color variant signalling the semantic meaning of the progress. Defaults to `'default'`. */
  variant?: ProgressIndicatorVariant;

  /** Overall diameter of the ring. Defaults to `'md'`. */
  size?: ProgressIndicatorSize;

  /**
   * Show the computed percentage at the center of the ring.
   * Only visible on sizes `md`, `lg`, `xl` (smaller sizes lack space).
   * Automatically hidden in the indeterminate state.
   * Defaults to `false`.
   */
  showValue?: boolean;

  /**
   * Accessible label for the progress indicator.
   * Always used as `aria-label` for screen-reader accessibility.
   * Required for standalone usage without a visible heading.
   */
  label?: string;

  /**
   * Muted appearance with no animation.
   * Use when the action the indicator tracks is paused or blocked.
   * Defaults to `false`.
   */
  disabled?: boolean;
}
