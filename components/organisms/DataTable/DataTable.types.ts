import type { ReactNode } from 'react';

// ── Column definition ──────────────────────────────────────────────────────

export interface DataTableColumn {
  /** Unique key matching a property on each data row */
  key: string;
  /** Column header text */
  header: string;
  /** Enable ascending/descending sort toggling on this column */
  sortable?: boolean;
  /**
   * Fixed column width — any CSS value (e.g. '120px', '20%', '8rem').
   * Applied via inline style since it is consumer-supplied at runtime.
   */
  width?: string;
  /** Cell content alignment. Defaults to 'start'. */
  align?: 'start' | 'center' | 'end';
  /**
   * Custom cell renderer. Receives the raw cell value, the full row, and the
   * zero-based row index. Return any React node.
   */
  render?: (value: unknown, row: Record<string, unknown>, rowIndex: number) => ReactNode;
}

// ── Sort state ─────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc' | 'none';

export interface DataTableSortState {
  /** Key of the column currently being sorted */
  key: string;
  /** Current sort direction */
  direction: SortDirection;
}

// ── Pagination config ──────────────────────────────────────────────────────

export interface DataTablePaginationConfig {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Pagination control size. Defaults to 'sm'. */
  size?: 'sm' | 'md' | 'lg';
  /** Show first/last jump buttons */
  showFirstLast?: boolean;
}

// ── Visual dimensions ──────────────────────────────────────────────────────

export type DataTableVariant = 'default' | 'striped' | 'bordered';
export type DataTableSize = 'sm' | 'md' | 'lg';

// ── i18n strings ───────────────────────────────────────────────────────────

export interface DataTableI18nStrings {
  /**
   * aria-label for a sort button when the column is currently sorted ascending.
   * Default: (header) => `Sort ${header} descending`
   */
  sortAscLabel?: (header: string) => string;
  /**
   * aria-label for a sort button when the column is currently sorted descending.
   * Default: (header) => `Clear sort for ${header}`
   */
  sortDescLabel?: (header: string) => string;
  /**
   * aria-label for a sort button when the column has no active sort.
   * Default: (header) => `Sort ${header} ascending`
   */
  sortNoneLabel?: (header: string) => string;
  /** sr-only label for the spinner during data load. Default: "Loading data" */
  loadingLabel?: string;
  /** Message shown in empty state when data is empty. Default: "No results found" */
  emptyMessage?: string;
  /** aria-label for the select-all header checkbox. Default: "Select all rows" */
  selectAllLabel?: string;
  /**
   * aria-label for individual row checkboxes (1-based).
   * Default: (n) => `Select row ${n}`
   */
  selectRowLabel?: (rowIndex: number) => string;
}

// ── Main props ─────────────────────────────────────────────────────────────

export interface DataTableProps {
  /** Column definitions — order determines display order */
  columns: DataTableColumn[];
  /** Row data — each object maps column keys to cell values */
  data: Record<string, unknown>[];
  /**
   * Stable row key. Either a key name on the row object, or a function.
   * Defaults to row index (not recommended for dynamic data).
   */
  rowKey?: string | ((row: Record<string, unknown>, index: number) => string);
  /** Visual table style. Defaults to 'default'. */
  variant?: DataTableVariant;
  /** Row height / cell padding tier. Defaults to 'md'. */
  size?: DataTableSize;
  /** Replace table body with skeleton rows while data loads */
  loading?: boolean;
  /** Number of skeleton placeholder rows. Defaults to 5. */
  loadingRowCount?: number;
  /** Controlled sort state */
  sortState?: DataTableSortState;
  /** Called when a sortable column header button is clicked */
  onSortChange?: (sort: DataTableSortState) => void;
  /**
   * Set of row keys that are currently selected.
   * Omit both `selectedKeys` and `onSelectionChange` to disable row selection.
   */
  selectedKeys?: Set<string>;
  /** Called when the selection changes. Providing this enables row selection. */
  onSelectionChange?: (keys: Set<string>) => void;
  /**
   * Accessible table caption — rendered as `<caption class="sr-only">` and used
   * as the aria-label for the scroll container.
   */
  caption?: string;
  /** Explicit aria-label for the scroll region. Takes precedence over `caption`. */
  'aria-label'?: string;
  /** Stick the `<thead>` row while the table body scrolls */
  stickyHeader?: boolean;
  /**
   * Optional pagination config. When provided, renders a `<Pagination>` bar
   * beneath the table. Page state is fully controlled by the consumer.
   */
  pagination?: DataTablePaginationConfig;
  /** Per-instance i18n string overrides */
  i18nStrings?: DataTableI18nStrings;
  className?: string;
}
