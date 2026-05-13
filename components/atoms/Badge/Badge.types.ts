import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeVariant = 'solid' | 'soft' | 'outline' | 'dot';
export type BadgeColor = 'default' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md';
export type BadgeShape = 'pill' | 'rounded';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual treatment. `dot` renders a circle with no text. Defaults to 'solid'. */
  variant?: BadgeVariant;
  /** Semantic color intent. Defaults to 'default'. */
  color?: BadgeColor;
  /** Height and typography scale. Defaults to 'md'. */
  size?: BadgeSize;
  /** Border-radius style. Defaults to 'pill'. */
  shape?: BadgeShape;
  /**
   * Accessible label for dot badges (no visible text).
   * Required when `variant="dot"` — screen readers need a description.
   */
  dotLabel?: string;
  /** Badge text or inner content. Ignored when `variant="dot"`. */
  children?: ReactNode;
}
