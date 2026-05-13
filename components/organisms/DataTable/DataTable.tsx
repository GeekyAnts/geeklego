"use client"
import { memo, useMemo, useCallback, useId } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, InboxIcon } from 'lucide-react';
import type {
  DataTableProps,
  DataTableSize,
  DataTableVariant,
  SortDirection,
} from './DataTable.types';
import { Checkbox } from '../../atoms/Checkbox/Checkbox';
import { Skeleton } from '../../atoms/Skeleton/Skeleton';
import { EmptyState } from '../../atoms/EmptyState/EmptyState';
import { Pagination } from '../../molecules/Pagination/Pagination';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';

// ── Static constants ───────────────────────────────────────────────────────

const SORT_ICON_SIZE = 'var(--size-icon-sm)';

// ── Lookup tables (module-scope — never recreated per render) ──────────────

const sizeCellClasses: Record<DataTableSize, string> = {
  sm: 'px-[var(--data-table-cell-px-sm)] py-[var(--data-table-cell-py-sm)]',
  md: 'px-[var(--data-table-cell-px-md)] py-[var(--data-table-cell-py-md)]',
  lg: 'px-[var(--data-table-cell-px-lg)] py-[var(--data-table-cell-py-lg)]',
};

const sizeTextClasses: Record<DataTableSize, string> = {
  sm: 'text-body-xs',
  md: 'text-body-sm',
  lg: 'text-body-md',
};

const alignClasses: Record<'start' | 'center' | 'end', string> = {
  start: 'text-start',
  center: 'text-center',
  end: 'text-end',
};

// ── Helpers ────────────────────────────────────────────────────────────────

function resolveRowKey(
  row: Record<string, unknown>,
  index: number,
  rowKey?: DataTableProps['rowKey'],
): string {
  if (!rowKey) return String(index);
  if (typeof rowKey === 'function') return rowKey(row, index);
  const val = row[rowKey];
  return val !== undefined && val !== null ? String(val) : String(index);
}

function nextSortDirection(current: SortDirection): SortDirection {
  if (current === 'none') return 'asc';
  if (current === 'asc') return 'desc';
  return 'none';
}

// ── Component ──────────────────────────────────────────────────────────────

function DataTableComponent({
  columns,
  data,
  rowKey,
  variant = 'default',
  size = 'md',
  loading = false,
  loadingRowCount = 5,
  sortState,
  onSortChange,
  selectedKeys,
  onSelectionChange,
  caption,
  'aria-label': ariaLabel,
  stickyHeader = false,
  pagination,
  i18nStrings,
  className,
}: DataTableProps): React.JSX.Element {
  const i18n = useComponentI18n('dataTable', i18nStrings);
  const captionId = useId();

  const selectable = !!onSelectionChange;
  const totalCols = selectable ? columns.length + 1 : columns.length;

  // ── Row keys ─────────────────────────────────────────────────────────────
  const rowKeys = useMemo(
    () => data.map((row, i) => resolveRowKey(row, i, rowKey)),
    [data, rowKey],
  );

  // ── Selection state ───────────────────────────────────────────────────────
  const allSelected = useMemo(
    () => rowKeys.length > 0 && rowKeys.every((k) => selectedKeys?.has(k)),
    [rowKeys, selectedKeys],
  );
  const someSelected = useMemo(
    () => !allSelected && rowKeys.some((k) => selectedKeys?.has(k)),
    [allSelected, rowKeys, selectedKeys],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return;
    onSelectionChange(allSelected ? new Set() : new Set(rowKeys));
  }, [onSelectionChange, allSelected, rowKeys]);

  const handleSelectRow = useCallback(
    (key: string) => {
      if (!onSelectionChange) return;
      const next = new Set(selectedKeys);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      onSelectionChange(next);
    },
    [onSelectionChange, selectedKeys],
  );

  const handleSort = useCallback(
    (colKey: string) => {
      if (!onSortChange) return;
      const currentDir: SortDirection =
        sortState?.key === colKey ? sortState.direction : 'none';
      onSortChange({ key: colKey, direction: nextSortDirection(currentDir) });
    },
    [onSortChange, sortState],
  );

  // ── Derived class strings ─────────────────────────────────────────────────
  const cellPad = sizeCellClasses[size];
  const cellText = sizeTextClasses[size];

  const containerClass = useMemo(
    () =>
      [
        'card-shell overflow-hidden',
        'border border-[var(--data-table-border-color)]',
        'rounded-[var(--data-table-radius)]',
        'shadow-[var(--data-table-shadow)]',
        className,
      ]
        .filter(Boolean)
        .join(' '),
    [className],
  );

  const tableClass = useMemo(
    () => ['w-full border-collapse', cellText, 'text-[var(--data-table-row-text)]'].join(' '),
    [cellText],
  );

  // bordered variant adds borders on all sides; default/striped use bottom-only borders
  const thBorderClass =
    variant === 'bordered'
      ? 'border border-[var(--data-table-border-color)]'
      : 'border-b border-[var(--data-table-head-border)]';

  const tdBorderClass =
    variant === 'bordered'
      ? 'border border-[var(--data-table-border-color)]'
      : 'border-b border-[var(--data-table-row-border)]';

  const thBaseClass = useMemo(
    () =>
      [
        'bg-[var(--data-table-head-bg)]',
        'text-[var(--data-table-head-text)]',
        'text-label-sm font-semibold',
        cellPad,
        thBorderClass,
        stickyHeader
          ? 'sticky top-0 z-[var(--layer-sticky)] bg-[var(--data-table-head-bg)]'
          : '',
      ]
        .filter(Boolean)
        .join(' '),
    [cellPad, thBorderClass, stickyHeader],
  );

  const tdBaseClass = useMemo(
    () => [cellPad, tdBorderClass].join(' '),
    [cellPad, tdBorderClass],
  );

  const regionLabel = ariaLabel ?? caption;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      role="region"
      aria-label={regionLabel}
      aria-busy={loading || undefined}
      className={containerClass}
    >
      {/* Horizontal scroll container */}
      <div className="overflow-x-auto w-full">
        <table
          className={tableClass}
          aria-labelledby={caption ? captionId : undefined}
          aria-label={!caption ? ariaLabel : undefined}
          style={{ minWidth: 'var(--data-table-min-width)' }}
        >
          {/* Accessible caption — always sr-only; region label handles visual labelling */}
          {caption && (
            <caption id={captionId} className="sr-only">
              {caption}
            </caption>
          )}

          {/* ── Head ───────────────────────────────────────────────────── */}
          <thead>
            <tr>
              {/* Select-all checkbox column */}
              {selectable && (
                <th
                  scope="col"
                  className={[thBaseClass, 'w-[var(--size-component-md)]'].join(' ')}
                >
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={handleSelectAll}
                    aria-label={i18n.selectAllLabel ?? 'Select all rows'}
                    size="sm"
                  />
                </th>
              )}

              {columns.map((col) => {
                const isSorted = sortState?.key === col.key;
                const sortDir: SortDirection = isSorted ? (sortState?.direction ?? 'none') : 'none';
                const align = col.align ?? 'start';

                const ariaSortAttr: React.AriaAttributes['aria-sort'] = col.sortable
                  ? sortDir === 'asc'
                    ? 'ascending'
                    : sortDir === 'desc'
                      ? 'descending'
                      : 'none'
                  : undefined;

                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={ariaSortAttr}
                    // column width is consumer-supplied at runtime — cannot be a Tailwind class
                    style={col.width ? { width: col.width } : undefined}
                    className={[
                      thBaseClass,
                      alignClasses[align],
                      isSorted && sortDir !== 'none'
                        ? 'text-[var(--data-table-head-text-sorted)]'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        aria-label={
                          sortDir === 'asc'
                            ? (i18n.sortAscLabel?.(col.header) ??
                                `Sort ${col.header} descending`)
                            : sortDir === 'desc'
                              ? (i18n.sortDescLabel?.(col.header) ??
                                  `Clear sort for ${col.header}`)
                              : (i18n.sortNoneLabel?.(col.header) ??
                                  `Sort ${col.header} ascending`)
                        }
                        className={[
                          'inline-flex items-center gap-[var(--data-table-sort-gap)]',
                          'w-full bg-transparent cursor-pointer',
                          'font-[inherit] text-[inherit] leading-[inherit]',
                          'rounded-[var(--radius-component-sm)]',
                          'focus-visible:outline-none focus-visible:focus-ring',
                          'transition-default',
                          align === 'end' ? 'flex-row-reverse justify-end' : '',
                          align === 'center' ? 'justify-center' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <span className="truncate-label">{col.header}</span>
                        <span
                          className={[
                            'flex-shrink-0 transition-default',
                            isSorted && sortDir !== 'none'
                              ? 'text-[var(--data-table-sort-icon-color-active)]'
                              : 'text-[var(--data-table-sort-icon-color)]',
                          ].join(' ')}
                          aria-hidden="true"
                        >
                          {sortDir === 'asc' ? (
                            <ChevronUp size={SORT_ICON_SIZE} />
                          ) : sortDir === 'desc' ? (
                            <ChevronDown size={SORT_ICON_SIZE} />
                          ) : (
                            <ChevronsUpDown size={SORT_ICON_SIZE} />
                          )}
                        </span>
                      </button>
                    ) : (
                      <span className="truncate-label">{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* ── Body ───────────────────────────────────────────────────── */}
          <tbody>
            {loading ? (
              // Skeleton rows — preserve column structure during load
              Array.from({ length: loadingRowCount }, (_, i) => (
                <tr key={`skeleton-${i}`} aria-hidden="true">
                  {selectable && (
                    <td className={tdBaseClass}>
                      <Skeleton size="sm" width="var(--size-component-sm)" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className={tdBaseClass}>
                      <Skeleton size="sm" width="75%" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={totalCols} className="p-0">
                  <EmptyState
                    title={i18n.emptyMessage ?? 'No results found'}
                    icon={<InboxIcon />}
                    variant="ghost"
                    size="md"
                    className="py-[var(--spacing-layout-md)]"
                  />
                </td>
              </tr>
            ) : (
              // Data rows
              data.map((row, rowIndex) => {
                const key = rowKeys[rowIndex];
                const isSelected = selectedKeys?.has(key) ?? false;

                const rowBgClass = isSelected
                  ? 'bg-[var(--data-table-row-bg-selected)]'
                  : variant === 'striped' && rowIndex % 2 === 1
                    ? 'bg-[var(--data-table-row-bg-striped)]'
                    : 'bg-[var(--data-table-row-bg)]';

                const rowClass = [
                  'transition-default hover:bg-[var(--data-table-row-bg-hover)]',
                  rowBgClass,
                  selectable ? 'cursor-pointer' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <tr
                    key={key}
                    className={rowClass}
                    aria-selected={selectable ? isSelected : undefined}
                  >
                    {selectable && (
                      <td className={tdBaseClass}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelectRow(key)}
                          aria-label={
                            i18n.selectRowLabel?.(rowIndex + 1) ?? `Select row ${rowIndex + 1}`
                          }
                          size="sm"
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const value = row[col.key];
                      const align = col.align ?? 'start';
                      return (
                        <td
                          key={col.key}
                          className={[tdBaseClass, alignClasses[align]].join(' ')}
                        >
                          {col.render ? (
                            col.render(value, row, rowIndex)
                          ) : (
                            <span className="truncate-label block">
                              {value !== undefined && value !== null ? String(value) : '—'}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination footer ─────────────────────────────────────────── */}
      {pagination && !loading && (
        <div
          className={[
            'flex items-center justify-center',
            'bg-[var(--data-table-footer-bg)]',
            'border-t border-[var(--data-table-footer-border)]',
            'px-[var(--data-table-footer-px)] py-[var(--data-table-footer-py)]',
          ].join(' ')}
        >
          <Pagination
            totalPages={pagination.totalPages}
            currentPage={pagination.currentPage}
            onPageChange={pagination.onPageChange}
            size={pagination.size ?? 'sm'}
            showFirstLast={pagination.showFirstLast}
          />
        </div>
      )}
    </div>
  );
}

export const DataTable = memo(DataTableComponent);
DataTable.displayName = 'DataTable';
