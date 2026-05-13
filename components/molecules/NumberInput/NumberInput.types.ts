import type { InputHTMLAttributes } from 'react';
import type { InputVariant, InputSize } from '../../atoms/Input/Input.types';
import type { NumberInputI18nStrings } from '../../utils/i18n/GeeklegoI18nProvider.types';

export type { InputVariant as NumberInputVariant, InputSize as NumberInputSize };

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Visual style variant. Defaults to 'default'. */
  variant?: InputVariant;
  /** Height and typography scale. Defaults to 'md'. */
  size?: InputSize;
  /** Error state — shows error border and sets aria-invalid. */
  error?: boolean;
  /** Current numeric value (controlled). */
  value?: number | string;
  /** Minimum allowed value. */
  min?: number;
  /** Maximum allowed value. */
  max?: number;
  /** Amount to increment or decrement per step. Defaults to 1. */
  step?: number;
  /** Disables both the input and stepper buttons. */
  disabled?: boolean;
  /** Per-instance string overrides for i18n (button labels). */
  i18nStrings?: NumberInputI18nStrings;
  /** Additional class name for the outer wrapper element. */
  wrapperClassName?: string;
}
