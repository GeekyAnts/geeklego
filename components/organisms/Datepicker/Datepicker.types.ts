import type { HTMLAttributes } from 'react';
import type { InputVariant, InputSize } from '../../atoms/Input/Input.types';
import type { DatepickerI18nStrings } from '../../utils/i18n/GeeklegoI18nProvider.types';

export type { InputVariant, InputSize, DatepickerI18nStrings };

export interface DatepickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Currently selected date (controlled). */
  value?: Date | null;
  /** Initial selected date (uncontrolled). */
  defaultValue?: Date;
  /** Fired when the user selects or clears a date. */
  onChange?: (date: Date | null) => void;
  /** Earliest selectable date. Days before this are disabled. */
  min?: Date;
  /** Latest selectable date. Days after this are disabled. */
  max?: Date;
  /** Field label text. Required for accessibility. */
  label: string;
  /** Hint/helper text shown below the input when no error is present. */
  hint?: string;
  /**
   * Validation error message. When set, switches the input to its error state
   * and replaces the hint text. Announced immediately via `role="alert"`.
   */
  errorMessage?: string;
  /** Height and typography scale. Defaults to 'md'. */
  size?: InputSize;
  /** Input visual style variant. Defaults to 'default'. */
  variant?: InputVariant;
  /** Disables all interaction. */
  disabled?: boolean;
  /** Shows loading spinner and disables interaction. */
  isLoading?: boolean;
  /** Placeholder text for the input. Defaults to 'YYYY-MM-DD'. */
  placeholder?: string;
  /** First day of week: 0 = Sunday, 1 = Monday. Defaults to 1. */
  firstDayOfWeek?: 0 | 1;
  /** Internationalisation strings for system-generated text. */
  i18nStrings?: DatepickerI18nStrings;
  /**
   * Additional class names applied to the outer wrapper `<div>`.
   * Use this to control width or layout placement of the entire field group.
   */
  wrapperClassName?: string;
  /**
   * `id` for the underlying `<input>`. Auto-generated when omitted.
   * The generated label is linked via `htmlFor` automatically.
   */
  id?: string;
}
