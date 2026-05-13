import type { HTMLAttributes } from 'react';
import type { PaginationI18nStrings } from '../../utils/i18n';

export type { PaginationI18nStrings };

export type PaginationVariant = 'default' | 'simple';
export type PaginationSize = 'sm' | 'md' | 'lg';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Total number of pages. Must be ≥ 1. */
  totalPages: number;
  /** Currently active page (1-indexed). */
  currentPage: number;
  /** Callback fired when a page change is requested. Receives the new page number (1-indexed). */
  onPageChange?: (page: number) => void;
  /**
   * Visual layout variant.
   * - `default` — numbered page buttons with ellipsis for large ranges.
   * - `simple` — prev/next arrows with a "Page X of Y" centre label.
   * Defaults to `'default'`.
   */
  variant?: PaginationVariant;
  /** Height and typography size of page item buttons. Defaults to `'md'`. */
  size?: PaginationSize;
  /**
   * Number of page buttons shown on each side of the current page in the default variant.
   * Defaults to `1`.
   */
  siblingCount?: number;
  /**
   * Show jump-to-first (⟨⟨) and jump-to-last (⟩⟩) buttons flanking prev/next.
   * Defaults to `false`.
   */
  showFirstLast?: boolean;
  /** Per-instance i18n string overrides. */
  i18nStrings?: PaginationI18nStrings;
}
