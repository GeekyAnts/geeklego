import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import type { TagI18nStrings } from '../../utils/i18n/GeeklegoI18nProvider.types';

export type TagVariant = 'solid' | 'soft' | 'outline';
export type TagColor = 'default' | 'brand' | 'success' | 'warning' | 'error' | 'info';
export type TagSize = 'sm' | 'md';

export type { TagI18nStrings };

export interface TagProps extends HTMLAttributes<HTMLElement> {
  /** Visual treatment. Defaults to 'soft'. */
  variant?: TagVariant;
  /** Category colour intent. Defaults to 'default'. */
  color?: TagColor;
  /** Height and typography scale. Defaults to 'md'. */
  size?: TagSize;
  /**
   * When provided, renders as `<a>` linking to a filtered/category view.
   * Mutually exclusive with `onRemove`.
   */
  href?: string;
  /** Optional leading icon node. Use a lucide-react icon at `var(--size-icon-xs)`. */
  leftIcon?: ReactNode;
  /**
   * Callback fired when the remove button is clicked.
   * When provided, a remove (×) button appears inside the tag.
   * Mutually exclusive with `href`.
   */
  onRemove?: (e: MouseEvent<HTMLButtonElement>) => void;
  /** Internationalisation strings for system-generated text (e.g. remove button aria-label). */
  i18nStrings?: TagI18nStrings;
  /** Tag label text or content. */
  children: ReactNode;
}
