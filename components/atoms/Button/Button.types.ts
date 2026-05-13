import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Each variant uses a fundamentally different visual strategy. Defaults to 'primary'. */
  variant?: ButtonVariant;
  /** Component height and typography scale. Defaults to 'md'. */
  size?: ButtonSize;
  /** Replaces content with a centered spinner and disables interaction. Preserves button dimensions. */
  isLoading?: boolean;
  /** Icon node rendered before the label. Omitted during loading. */
  leftIcon?: ReactNode;
  /** Icon node rendered after the label. Omitted during loading. */
  rightIcon?: ReactNode;
  /**
   * Renders a perfectly square icon-only button.
   * When true, `children` is visually hidden but used as the accessible `aria-label`.
   * Combine with `leftIcon` to supply the visible icon.
   */
  iconOnly?: boolean;
  /** Button label. Required — serves as `aria-label` when `iconOnly` is true. */
  children: ReactNode;
}
