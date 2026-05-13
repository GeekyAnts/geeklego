import type { InputHTMLAttributes, ReactNode } from 'react';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Whether the checkbox is checked. Control via onChange. */
  checked?: boolean;
  /** Tri-state — partially selected. Visually overrides checked display with a dash. */
  indeterminate?: boolean;
  /** Visual size of the indicator box. Defaults to 'md'. */
  size?: CheckboxSize;
  /** Marks the field as invalid — shifts border to error color. */
  error?: boolean;
  /** Label text or elements rendered alongside the indicator. Without children, supply aria-label. */
  children?: ReactNode;
}
