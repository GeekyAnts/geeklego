import type { HTMLAttributes, ReactNode } from 'react';

export type CardVariant = 'elevated' | 'outlined' | 'filled' | 'ghost';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual style of the card surface. Defaults to 'elevated'. */
  variant?: CardVariant;
  /**
   * Makes the card respond to pointer interaction — hover shadow/background
   * shift, focus ring, cursor pointer. Use when the entire card is clickable.
   */
  interactive?: boolean;
  children: ReactNode;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Primary title rendered as a heading. Required unless using `children`. */
  title?: string;
  /** Supporting description rendered below the title. */
  description?: string;
  /** Right-aligned action slot — pass a Button or icon button atom. */
  action?: ReactNode;
  children?: ReactNode;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLElement> {
  /** Renders a top border divider between body and footer. Defaults to true. */
  border?: boolean;
  children: ReactNode;
}
