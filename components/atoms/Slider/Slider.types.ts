import type { InputHTMLAttributes } from 'react';

export type SliderSize = 'sm' | 'md' | 'lg';

export interface SliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'onChange' | 'size' | 'value' | 'defaultValue'
  > {
  /** Minimum value. Defaults to `0`. */
  min?: number;
  /** Maximum value. Defaults to `100`. */
  max?: number;
  /** Step increment between values. Defaults to `1`. */
  step?: number;
  /** Controlled current value. Pair with `onChange` for a controlled component. */
  value?: number;
  /** Initial value for uncontrolled usage. Defaults to `min` (or `0`) when omitted. */
  defaultValue?: number;
  /** Called with the new numeric value on every input change. */
  onChange?: (value: number) => void;
  /** Track height and thumb size scale. Defaults to `'md'`. */
  size?: SliderSize;
  /** Whether the slider is non-interactive. Mutes all visual states. */
  disabled?: boolean;
  /** Optional visible label rendered above the track. Used as the accessible name via `aria-labelledby` when provided. */
  label?: string;
  /** Render the current numeric value to the right of the label row. Defaults to `false`. */
  showValue?: boolean;
  /** Additional class names applied to the outermost wrapper `<div>`. */
  className?: string;
}
