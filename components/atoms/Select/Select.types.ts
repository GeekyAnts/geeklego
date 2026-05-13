import type { HTMLAttributes } from 'react';

export type SelectVariant = 'default' | 'filled' | 'ghost';
export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  /** The value submitted to onChange when this option is chosen */
  value: string;
  /** The label displayed in the trigger and dropdown panel */
  label: string;
  /** When true the option is visible but not selectable */
  disabled?: boolean;
}

export interface SelectI18nStrings {
  /** Placeholder text shown when no option is selected. Defaults to 'Select…' */
  placeholder?: string;
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Available options shown in the dropdown panel */
  options: SelectOption[];
  /** Controlled selected value. Pair with `onChange`. */
  value?: string;
  /** Initial selected value for uncontrolled usage */
  defaultValue?: string;
  /** Called with the new value when the user makes a selection */
  onChange?: (value: string) => void;
  /** Placeholder text shown when no option is selected */
  placeholder?: string;
  /** Internationalization strings for system labels. Overrides defaults via `useComponentI18n()`. */
  i18nStrings?: SelectI18nStrings;
  /** Visual style of the trigger. Defaults to 'default'. */
  variant?: SelectVariant;
  /** Height and font size tier. Defaults to 'md'. */
  size?: SelectSize;
  /** Disables the trigger and all options */
  disabled?: boolean;
  /** Applies error border to the trigger */
  error?: boolean;
  /** Optional visible label rendered above the trigger */
  label?: string;
  /** id forwarded to the trigger button — required when using an external label */
  id?: string;
}
