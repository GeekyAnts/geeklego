import type { HTMLAttributes, ReactNode } from 'react';

export type ListVariant = 'bullet' | 'ordered' | 'none' | 'check' | 'dot' | 'description';
export type ListSize = 'sm' | 'md' | 'lg';
export type ListOrientation = 'vertical' | 'horizontal';

/** Internal context value passed from List to List.Item */
export interface ListContextValue {
  variant: ListVariant;
  size: ListSize;
}

export interface ListProps extends HTMLAttributes<HTMLElement> {
  /**
   * Visual style of the list markers.
   * - `bullet`      → disc markers (default)
   * - `ordered`     → numbered markers
   * - `none`        → no markers; pure layout list
   * - `check`       → green check icon per item
   * - `dot`         → small brand-coloured dot per item
   * - `description` → term + definition rows (`<dl>`)
   */
  variant?: ListVariant;
  /** Spacing and typography scale. Defaults to `'md'`. */
  size?: ListSize;
  /** Layout direction. Defaults to `'vertical'`. */
  orientation?: ListOrientation;
  children: ReactNode;
}

export interface ListItemProps extends HTMLAttributes<HTMLElement> {
  /** Renders the item in a muted, non-interactive disabled state. */
  disabled?: boolean;
  /**
   * Term label for `description` variant — renders as `<dt>`.
   * Ignored in all other variants.
   */
  term?: ReactNode;
  children: ReactNode;
}
