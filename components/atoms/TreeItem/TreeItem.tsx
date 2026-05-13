"use client"
import { forwardRef, memo, useMemo } from 'react';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import { ChevronRight, Loader2 } from 'lucide-react';
import type { TreeItemProps, TreeItemSize } from './TreeItem.types';

// Static maps — hoisted to module scope to avoid reallocation
const heightClass: Record<TreeItemSize, string> = {
  sm: 'h-[var(--tree-item-height-sm)]',
  md: 'h-[var(--tree-item-height-md)]',
  lg: 'h-[var(--tree-item-height-lg)]',
};

const pxClass: Record<TreeItemSize, string> = {
  sm: 'px-[var(--tree-item-px-sm)]',
  md: 'px-[var(--tree-item-px-md)]',
  lg: 'px-[var(--tree-item-px-lg)]',
};

const textClass: Record<TreeItemSize, string> = {
  sm: 'text-body-sm',
  md: 'text-body-sm',
  lg: 'text-body-md',
};

const iconSizeMap: Record<TreeItemSize, string> = {
  sm: 'var(--size-icon-sm)',
  md: 'var(--size-icon-sm)',
  lg: 'var(--size-icon-md)',
};

export const TreeItem = memo(
  forwardRef<HTMLLIElement, TreeItemProps>(
    (
      {
        id,
        label,
        icon,
        level = 1,
        setsize = 1,
        posinset = 1,
        isExpanded = false,
        isSelected = false,
        isDisabled = false,
        isLoading = false,
        hasChildren = false,
        badge,
        tabIndex = -1,
        onToggle,
        onSelect,
        size = 'md',
        i18nStrings,
        children,
        className,
        ...rest
      },
      ref,
    ) => {
      const i18n = useComponentI18n('treeItem', i18nStrings);
      const iconSize = iconSizeMap[size];

      // Row container — visual background only, no click handler
      const rowDivClasses = useMemo(
        () =>
          [
            'flex items-center justify-start gap-[var(--tree-item-gap)] w-full select-none',
            'rounded-[var(--tree-item-radius)]',
            heightClass[size],
            pxClass[size],
            'transition-default',
            isDisabled
              ? 'bg-[var(--tree-item-bg-disabled)] cursor-not-allowed'
              : isSelected
              ? 'bg-[var(--tree-item-bg-selected)]'
              : 'bg-[var(--tree-item-bg)] hover:bg-[var(--tree-item-bg-hover)] active:bg-[var(--tree-item-bg-active)]',
          ]
            .filter(Boolean)
            .join(' '),
        [size, isDisabled, isSelected],
      );

      // Selection button — fills remaining width, is the actual focus/tab target
      const selectBtnClasses = useMemo(
        () =>
          [
            'flex-1 flex items-center justify-start gap-[var(--tree-item-gap)]',
            'min-w-0 bg-transparent outline-none',
            textClass[size],
            'transition-default',
            'focus-visible:focus-ring rounded-[var(--tree-item-radius)]',
            isDisabled
              ? 'text-[var(--tree-item-text-disabled)] cursor-not-allowed pointer-events-none'
              : isSelected
              ? 'text-[var(--tree-item-text-selected)] cursor-pointer'
              : 'text-[var(--tree-item-text)] cursor-pointer',
          ]
            .filter(Boolean)
            .join(' '),
        [size, isDisabled, isSelected],
      );

      // Expand button — fixed icon width, always tabIndex={-1}
      const expandBtnClasses = useMemo(
        () =>
          [
            'flex-none flex items-center justify-center',
            'w-[var(--size-icon-md)] h-[var(--size-icon-md)]',
            'rounded-[var(--tree-item-radius)] touch-target bg-transparent outline-none',
            'transition-default',
            hasChildren && !isDisabled
              ? 'text-[var(--tree-item-expand-color)] hover:text-[var(--tree-item-expand-color-hover)] cursor-pointer'
              : 'invisible pointer-events-none',
          ]
            .filter(Boolean)
            .join(' '),
        [hasChildren, isDisabled],
      );

      // Per-level indent via inline style (dynamic value — no static Tailwind class possible)
      // paddingInlineStart mirrors correctly in RTL without any extra logic
      const indentStyle = { paddingInlineStart: `calc(${level - 1} * var(--tree-item-indent))` };

      return (
        <li
          ref={ref}
          role="treeitem"
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={isSelected}
          aria-level={level}
          aria-setsize={setsize}
          aria-posinset={posinset}
          aria-disabled={isDisabled || undefined}
          className={['list-none perf-contain-content', className].filter(Boolean).join(' ')}
          {...rest}
        >
          {/* ── Row ────────────────────────────────────────────────────────
              Visual background lives here (CSS :hover, no onClick).
              Two sibling <button>s handle the two distinct actions.
          ──────────────────────────────────────────────────────────────── */}
          <div className={rowDivClasses} style={indentStyle}>
            {/* Expand / collapse button — tabIndex always -1 */}
            <button
              type="button"
              tabIndex={-1}
              aria-label={
                hasChildren
                  ? isExpanded
                    ? i18n.collapseLabel?.(label)
                    : i18n.expandLabel?.(label)
                  : undefined
              }
              aria-hidden={!hasChildren || undefined}
              disabled={isDisabled || !hasChildren}
              className={expandBtnClasses}
              onClick={(e) => {
                e.stopPropagation();
                onToggle?.();
              }}
            >
              <ChevronRight
                size={iconSize}
                aria-hidden="true"
                className={[
                  'transition-default',
                  isExpanded ? 'rotate-90' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            </button>

            {/* Selection button — the roving tabindex target */}
            <button
              type="button"
              tabIndex={isDisabled ? -1 : tabIndex}
              data-tree-item-id={id}
              disabled={isDisabled}
              className={selectBtnClasses}
              onClick={onSelect}
            >
              {/* Node icon */}
              {icon && (
                <span
                  aria-hidden="true"
                  className={[
                    'flex-none flex items-center justify-center',
                  isSelected
                        ? 'text-[var(--tree-item-icon-color-selected)]'
                        : isDisabled
                        ? 'text-[var(--tree-item-icon-color-disabled)]'
                        : 'text-[var(--tree-item-icon-color)]',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {icon}
                </span>
              )}

              {/* Label */}
              <span className="content-flex truncate-label text-left">{label}</span>

              {/* Loading spinner */}
              {isLoading && (
                <span
                  aria-hidden="true"
                  className="flex-none me-auto text-[var(--tree-item-expand-color)]"
                >
                  <Loader2 size={iconSize} className="animate-spin" />
                </span>
              )}

              {/* Badge */}
              {badge !== undefined && !isLoading && (
                <span
                  className={[
                    'flex-none ms-auto content-nowrap text-label-xs',
                    'bg-[var(--tree-item-badge-bg)] text-[var(--tree-item-badge-text)]',
                    'px-[var(--spacing-component-xs)] rounded-[var(--radius-component-full)]',
                  ].join(' ')}
                >
                  {badge}
                </span>
              )}
            </button>
          </div>

          {/* ── Expanded subtree ─────────────────────────────────────────── */}
          {hasChildren && isExpanded && (
            <ul role="group" className="list-none p-0 m-0">
              {children}
            </ul>
          )}
        </li>
      );
    },
  ),
);

TreeItem.displayName = 'TreeItem';
