import type { FieldsetHTMLAttributes, ReactNode } from 'react';
import type { FieldsetI18nStrings } from '../../utils/i18n';

export type FieldsetVariant = 'default' | 'boxed';
export type FieldsetLayout = 'column' | 'row';
export type FieldsetGap = 'sm' | 'md' | 'lg';

export interface FieldsetProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'disabled'> {
  /**
   * Accessible group label rendered as `<legend>`. Required for WCAG 1.3.1
   * — assistive technologies announce this text before each control in the group.
   */
  legend: string;
  /**
   * Visual frame style.
   * `'default'` — no visible border, controls stack inline.
   * `'boxed'` — bordered container with padding; ideal for grouping conceptually related fields.
   * Defaults to `'default'`.
   */
  variant?: FieldsetVariant;
  /** Direction child controls are stacked. Defaults to `'column'`. */
  layout?: FieldsetLayout;
  /** Gap between child controls. Defaults to `'md'`. */
  gap?: FieldsetGap;
  /** Helper text displayed directly beneath the legend. */
  hint?: string;
  /**
   * Group-level validation error message. Rendered with `role="alert"` for
   * immediate screen-reader announcement when it appears.
   */
  error?: string;
  /**
   * Shows a red asterisk (decorative, `aria-hidden`) followed by a sr-only
   * `(required)` string for screen readers.
   */
  required?: boolean;
  /**
   * Disables the `<fieldset>`. All descendant form controls inherit the
   * disabled state natively — no prop threading required.
   */
  disabled?: boolean;
  /** Form controls to group. */
  children: ReactNode;
  /** Override localised strings for this instance. */
  i18nStrings?: FieldsetI18nStrings;
}
