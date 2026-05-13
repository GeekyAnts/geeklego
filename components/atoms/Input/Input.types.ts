import type { InputHTMLAttributes, ReactNode } from 'react';

export type InputVariant = 'default' | 'filled' | 'flushed' | 'unstyled';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visual style variant. Defaults to 'default'. */
  variant?: InputVariant;
  /** Height and typography scale. Defaults to 'md'. */
  size?: InputSize;
  /** Error state — shows error border and sets aria-invalid. */
  error?: boolean;
  /** Loading state — shows spinner and disables interaction. */
  isLoading?: boolean;
  /** Icon node displayed on the left side of the input. Decorative; aria-hidden. */
  leftIcon?: ReactNode;
  /** Icon node displayed on the right side of the input. Decorative; aria-hidden. Replaced by spinner when isLoading. */
  rightIcon?: ReactNode;
  /** Additional class names for the outer wrapper element. */
  wrapperClassName?: string;
}
