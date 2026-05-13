import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type SwitchVariant = 'default' | 'success';
export type SwitchSize = 'sm' | 'md' | 'lg';
export type SwitchLabelPosition = 'left' | 'right';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'children'> {
  /** Whether the switch is on. Use with `onChange` for controlled behaviour. */
  checked?: boolean;
  /** Initial checked state for uncontrolled usage. Ignored when `checked` is provided. */
  defaultChecked?: boolean;
  /** Called when the switch is toggled. Receives the new `checked` value. */
  onChange?: (checked: boolean) => void;
  /** Visual colour variant. `default` uses the primary action colour; `success` uses the success status colour. Defaults to `'default'`. */
  variant?: SwitchVariant;
  /** Track and thumb size. Defaults to `'md'`. */
  size?: SwitchSize;
  /** Where the label text renders relative to the switch track. Defaults to `'right'`. */
  labelPosition?: SwitchLabelPosition;
  /** Optional label text rendered beside the track and used as the accessible name via `aria-labelledby`. */
  children?: ReactNode;
  /** Optional secondary description rendered below the label. */
  description?: string;
  /** Whether the switch is disabled. */
  disabled?: boolean;
  /** Additional class names applied to the outermost wrapper `<div>`. */
  className?: string;
}
