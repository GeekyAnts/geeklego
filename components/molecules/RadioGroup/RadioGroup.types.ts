import type { ReactNode, FieldsetHTMLAttributes } from 'react';
import type { RadioSize } from '../../atoms/Radio/Radio.types';
import type { RadioGroupI18nStrings } from '../../utils/i18n/GeeklegoI18nProvider.types';

export type RadioGroupOrientation = 'vertical' | 'horizontal';
export type RadioGroupVariant = 'default' | 'boxed';
export type { RadioSize as RadioGroupSize };

export interface RadioGroupOption {
  /** Unique value for this radio option. */
  value: string;
  /** Label text or element shown next to the indicator. */
  label: ReactNode;
  /** Disables this individual option while the rest remain interactive. */
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
  /** Radio options to render. */
  options: RadioGroupOption[];
  /** Controlled selected value. Omit for uncontrolled use with defaultValue. */
  value?: string;
  /** Initial value for uncontrolled mode. */
  defaultValue?: string;
  /** Called with the selected value when selection changes. */
  onChange?: (value: string) => void;
  /** Shared name attribute for all radios. Auto-generated when omitted. */
  name?: string;
  /** Direction the options are laid out. Defaults to 'vertical'. */
  orientation?: RadioGroupOrientation;
  /** Size of each Radio indicator and label. Defaults to 'md'. */
  size?: RadioSize;
  /** Visual container style. 'boxed' draws a bordered container around the group. Defaults to 'default'. */
  variant?: RadioGroupVariant;
  /** Error state — shifts Radio indicators to error colour. */
  error?: boolean;
  /** Marks all options as required. Appends SR-only "(required)" to the legend. */
  required?: boolean;
  /** Group label rendered inside a <legend>. Strongly recommended for accessibility. */
  legend?: ReactNode;
  /** Helper text shown below the options. Hidden when errorMessage is visible. */
  hint?: string;
  /** Error message shown below the options when error=true. */
  errorMessage?: string;
  /** Per-instance string overrides for i18n. */
  i18nStrings?: RadioGroupI18nStrings;
}
