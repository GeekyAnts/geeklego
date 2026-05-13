import type { HTMLAttributes, ReactNode } from 'react';

export type ItemVariant = 'default' | 'outlined' | 'elevated' | 'ghost';
export type ItemSize = 'sm' | 'md' | 'lg';

export interface ItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Visual treatment. Defaults to 'default'. */
  variant?: ItemVariant;
  /** Height, padding, and typography size. Defaults to 'md'. */
  size?: ItemSize;
  /** Primary text content. */
  title: ReactNode;
  /** Secondary text content below title. */
  description?: ReactNode;
  /** Slot for left-side media (Avatar, icon, thumbnail). */
  media?: ReactNode;
  /** Slot for right-side actions (Button, Badge, Switch). */
  actions?: ReactNode;
  /** Whether this item is in a selected state. */
  selected?: boolean;
  /** Whether interaction is disabled. */
  disabled?: boolean;
  /** Shows a loading skeleton. */
  loading?: boolean;
  /** Makes the item clickable (adds hover/focus/active styles). Auto-true when onClick or href is provided. */
  interactive?: boolean;
  /** Link target. Renders as <a> instead of <div>. */
  href?: string;
  /** When rendering as <a>: anchor target attribute (e.g. '_blank'). */
  target?: string;
  /** When rendering as <a>: anchor rel attribute. 'noopener noreferrer' is auto-added when target='_blank'. */
  rel?: string;
}
