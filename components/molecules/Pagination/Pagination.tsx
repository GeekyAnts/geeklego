"use client"
import { forwardRef, memo, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';
import type { PaginationProps, PaginationSize } from './Pagination.types';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import { Button } from '../../atoms/Button/Button';

// ── Static class fragments (hoisted — never recreated per render) ─────────────
const LIST_BASE = 'flex items-center list-none p-0 m-0';
const ELLIPSIS_BASE = 'inline-flex items-center justify-center';

// ── Size config ───────────────────────────────────────────────────────────────
const sizeMap: Record<PaginationSize, {
  item: string;
  text: string;
  gap: string;
  iconSize: string;
}> = {
  sm: {
    item: 'w-[var(--pagination-item-size-sm)] h-[var(--pagination-item-size-sm)]',
    text: 'text-button-sm',
    gap:  'gap-[var(--pagination-gap-sm)]',
    iconSize: 'var(--size-icon-sm)',
  },
  md: {
    item: 'w-[var(--pagination-item-size-md)] h-[var(--pagination-item-size-md)]',
    text: 'text-button-md',
    gap:  'gap-[var(--pagination-gap-md)]',
    iconSize: 'var(--size-icon-md)',
  },
  lg: {
    item: 'w-[var(--pagination-item-size-lg)] h-[var(--pagination-item-size-lg)]',
    text: 'text-button-lg',
    gap:  'gap-[var(--pagination-gap-lg)]',
    iconSize: 'var(--size-icon-lg)',
  },
};

// Pagination size → Button size (1:1 mapping, same semantic scale)
const buttonSizeMap: Record<PaginationSize, 'sm' | 'md' | 'lg'> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

// ── Page range algorithm ──────────────────────────────────────────────────────
// 'dots-left' appears between page 1 and left sibling range.
// 'dots-right' appears between right sibling range and last page.
// String literals ensure stable, unique React keys — no index-only keys.
type PageItem = number | 'dots-left' | 'dots-right';

function buildPageRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): PageItem[] {
  // Show all pages when the full range fits without ellipsis
  const totalPageNumbers = siblingCount * 2 + 5;
  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex  = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
  const showLeftDots  = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const count = 3 + 2 * siblingCount;
    const pages = Array.from({ length: count }, (_, i) => i + 1) as PageItem[];
    return [...pages, 'dots-right', totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const count = 3 + 2 * siblingCount;
    const pages = Array.from({ length: count }, (_, i) => totalPages - count + i + 1) as PageItem[];
    return [1, 'dots-left', ...pages];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i,
  ) as PageItem[];
  return [1, 'dots-left', ...middleRange, 'dots-right', totalPages];
}

// ── Component ─────────────────────────────────────────────────────────────────
export const Pagination = memo(
  forwardRef<HTMLElement, PaginationProps>(
    (
      {
        totalPages,
        currentPage,
        onPageChange,
        variant = 'default',
        size = 'md',
        siblingCount = 1,
        showFirstLast = false,
        i18nStrings,
        className,
        ...rest
      },
      ref,
    ) => {
      const i18n = useComponentI18n('pagination', i18nStrings);

      // Resolve strings — DEFAULT_STRINGS ensures these are always defined
      const prevLabel  = i18n.prevLabel  ?? 'Previous page';
      const nextLabel  = i18n.nextLabel  ?? 'Next page';
      const firstLabel = i18n.firstLabel ?? 'First page';
      const lastLabel  = i18n.lastLabel  ?? 'Last page';
      const navLabel   = i18n.navLabel   ?? 'Pagination';
      const pageLabel  = i18n.pageLabel  ?? (({ page, total }: { page: number; total: number }) => `Page ${page} of ${total}`);

      const isPrevDisabled = currentPage <= 1;
      const isNextDisabled = currentPage >= totalPages;

      const pageRange = useMemo(
        () => buildPageRange(currentPage, totalPages, siblingCount),
        [currentPage, totalPages, siblingCount],
      );

      const handlePage = useCallback(
        (page: number) => {
          if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange?.(page);
          }
        },
        [onPageChange, totalPages, currentPage],
      );

      const sz    = sizeMap[size];
      const bSize = buttonSizeMap[size];

      // ── Computed class strings ──────────────────────────────────────────────

      const navClass = useMemo(
        () => ['flex items-center', sz.gap, className].filter(Boolean).join(' '),
        [sz.gap, className],
      );

      const listClass = useMemo(
        () => [LIST_BASE, sz.gap].join(' '),
        [sz.gap],
      );

      const ellipsisClass = useMemo(
        () => [
          ELLIPSIS_BASE,
          sz.item,
          sz.text,
          'text-[var(--pagination-ellipsis-color)]',
        ].join(' '),
        [sz.item, sz.text],
      );

      // Shared base for page item buttons (both default and current)
      const itemBase = useMemo(
        () => [
          'inline-flex items-center justify-center shrink-0 select-none content-nowrap',
          'rounded-[var(--pagination-item-radius)] border transition-default',
          'focus-visible:outline-none focus-visible:focus-ring',
          sz.item,
          sz.text,
        ].join(' '),
        [sz.item, sz.text],
      );

      // Default (non-current) page item — ghost treatment with border on hover
      const pageItemDefaultClass = useMemo(
        () => [
          itemBase,
          'bg-[var(--pagination-item-bg)] text-[var(--pagination-item-text)] border-[var(--pagination-item-border)]',
          'hover:bg-[var(--pagination-item-bg-hover)] hover:text-[var(--pagination-item-text-hover)] hover:border-[var(--pagination-item-border-hover)]',
          'active:bg-[var(--pagination-item-bg-active)]',
          'cursor-pointer',
        ].join(' '),
        [itemBase],
      );

      // Current page item — filled treatment, cursor-default
      const pageItemCurrentClass = useMemo(
        () => [
          itemBase,
          'bg-[var(--pagination-current-bg)] text-[var(--pagination-current-text)] border-[var(--pagination-current-border)]',
          'shadow-[var(--pagination-current-shadow)]',
          'hover:bg-[var(--pagination-current-bg-hover)] hover:shadow-[var(--pagination-current-shadow-hover)]',
          'cursor-default',
        ].join(' '),
        [itemBase],
      );

      return (
        <nav
          ref={ref}
          aria-label={navLabel}
          className={navClass}
          {...rest}
        >
          {/*
            SR-only live region — announces the current page to screen readers
            whenever currentPage or totalPages changes. aria-hidden on visible
            simple-variant label prevents double announcement.
          */}
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            {pageLabel({ page: currentPage, total: totalPages })}
          </span>

          {/* ── First page jump (optional) ─────────────────────────────────── */}
          {showFirstLast && (
            <Button
              variant="ghost"
              size={bSize}
              iconOnly
              disabled={isPrevDisabled}
              onClick={() => handlePage(1)}
              leftIcon={<ChevronsLeft size={sz.iconSize} />}
            >
              {firstLabel}
            </Button>
          )}

          {/* ── Previous page ─────────────────────────────────────────────── */}
          <Button
            variant="ghost"
            size={bSize}
            iconOnly
            disabled={isPrevDisabled}
            onClick={() => handlePage(currentPage - 1)}
            leftIcon={<ChevronLeft size={sz.iconSize} />}
          >
            {prevLabel}
          </Button>

          {/* ── Page list (default variant) ────────────────────────────────── */}
          {variant === 'default' && (
            <ul className={listClass}>
              {pageRange.map((item) =>
                item === 'dots-left' || item === 'dots-right' ? (
                  <li key={item} aria-hidden="true">
                    <span className={ellipsisClass}>
                      <MoreHorizontal size={sz.iconSize} />
                    </span>
                  </li>
                ) : (
                  <li key={item} className="perf-contain-content">
                    <button
                      type="button"
                      aria-current={item === currentPage ? 'page' : undefined}
                      aria-label={pageLabel({ page: item, total: totalPages })}
                      onClick={() => handlePage(item)}
                      className={item === currentPage ? pageItemCurrentClass : pageItemDefaultClass}
                    >
                      {item}
                    </button>
                  </li>
                ),
              )}
            </ul>
          )}

          {/* ── Page info (simple variant) ─────────────────────────────────── */}
          {variant === 'simple' && (
            <span
              className={[
                sz.text,
                'text-[var(--pagination-info-text)]',
                'px-[var(--pagination-info-px)]',
                'content-nowrap',
              ].join(' ')}
              aria-hidden="true"
            >
              {pageLabel({ page: currentPage, total: totalPages })}
            </span>
          )}

          {/* ── Next page ─────────────────────────────────────────────────── */}
          <Button
            variant="ghost"
            size={bSize}
            iconOnly
            disabled={isNextDisabled}
            onClick={() => handlePage(currentPage + 1)}
            leftIcon={<ChevronRight size={sz.iconSize} />}
          >
            {nextLabel}
          </Button>

          {/* ── Last page jump (optional) ──────────────────────────────────── */}
          {showFirstLast && (
            <Button
              variant="ghost"
              size={bSize}
              iconOnly
              disabled={isNextDisabled}
              onClick={() => handlePage(totalPages)}
              leftIcon={<ChevronsRight size={sz.iconSize} />}
            >
              {lastLabel}
            </Button>
          )}
        </nav>
      );
    },
  ),
);
Pagination.displayName = 'Pagination';
