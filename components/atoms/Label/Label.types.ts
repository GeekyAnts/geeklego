import type { LabelHTMLAttributes, ReactNode } from 'react';
import type { LabelI18nStrings } from '../../utils/i18n';

export type LabelSize = 'sm' | 'md';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Associates this label with a form control by its `id`. */
  htmlFor?: string;
  /** Typography scale. 'md' = 14px medium (default), 'sm' = 12px medium. */
  size?: LabelSize;
  /** Shows red asterisk (aria-hidden) + sr-only "(required)" text for screen readers. */
  required?: boolean;
  /** Shows "(Optional)" in secondary color. Readable directly by screen readers. */
  optional?: boolean;
  /** Applies disabled text color. Mirror the associated control's disabled state. */
  disabled?: boolean;
  /** Applies error text color when the associated form field has a validation error. */
  hasError?: boolean;
  /** Label text. Truncates to one line with ellipsis via .truncate-label. */
  children: ReactNode;
  /** Override localised strings for this instance. Context strings apply when omitted. */
  i18nStrings?: LabelI18nStrings;
}
