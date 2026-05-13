import type { HTMLAttributes } from 'react';
import type { SpinnerI18nStrings } from '../../utils/i18n/GeeklegoI18nProvider.types';

export type { SpinnerI18nStrings };

export type SpinnerVariant = 'default' | 'inverse';
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Visual style variant.
   * - `default` — Arc on a faint ring track. Standard loading indicator.
   * - `inverse` — White arc on a faint ring track. For use on dark or colored backgrounds.
   * Defaults to `'default'`.
   */
  variant?: SpinnerVariant;
  /**
   * Diameter of the spinner. Maps to the icon size scale.
   * Defaults to `'md'` (24px).
   */
  size?: SpinnerSize;
  /**
   * Accessible label announced to screen readers via a visually-hidden `<span>`.
   * Defaults to `'Loading…'`. Overridden by `i18nStrings.label` when provided.
   */
  label?: string;
  /** Per-instance i18n string overrides. */
  i18nStrings?: SpinnerI18nStrings;
}
