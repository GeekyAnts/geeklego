import type { InputHTMLAttributes, ReactNode } from 'react';
import type { InputVariant, InputSize } from '../../atoms/Input/Input.types';
import type { InputGroupI18nStrings } from '../../utils/i18n';

export type { InputVariant, InputSize };

export interface InputGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Node shown in the start addon slot (icon, text label, or any ReactNode). */
  prefix?: ReactNode;
  /** Node shown in the end addon slot (icon, text label, Button, or any ReactNode). */
  suffix?: ReactNode;
  /** Visual style variant — applied to the group container. Defaults to 'default'. */
  variant?: InputVariant;
  /** Height and typography scale. Defaults to 'md'. */
  size?: InputSize;
  /** Error state — shows error border. Passed through to inner Input. */
  error?: boolean;
  /** Loading state — shows spinner and disables interaction. Passed through to inner Input. */
  isLoading?: boolean;
  /** Additional class names for the outer group wrapper element. */
  wrapperClassName?: string;
  /** Accessible label for the group element. Recommended when the input has no visible label. */
  'aria-label'?: string;
  /** i18n strings for localizable content */
  i18nStrings?: InputGroupI18nStrings;
}
