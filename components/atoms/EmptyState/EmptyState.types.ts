import type { HTMLAttributes, ReactNode } from 'react';

export type EmptyStateVariant = 'default' | 'ghost';
export type EmptyStateSize = 'sm' | 'md' | 'lg';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Main empty state message. Rendered as a visible paragraph — not a heading. */
  title: string;
  /** Secondary explanatory text. */
  description?: string;
  /**
   * Icon or illustration slot. Wrapped in an `aria-hidden` container — purely decorative.
   * Pass a lucide-react icon or any ReactNode.
   */
  icon?: ReactNode;
  /**
   * Call-to-action slot.
   * Pass a `<Button>` or any ReactNode. Rendered below the text content.
   */
  action?: ReactNode;
  /**
   * Visual style.
   * - `'default'` — subtle border + muted background (use inside cards or panels).
   * - `'ghost'` — borderless and transparent (use on plain page backgrounds).
   * Default: `'default'`.
   */
  variant?: EmptyStateVariant;
  /**
   * Controls padding, icon size, and typography scale.
   * Default: `'md'`.
   */
  size?: EmptyStateSize;
}
