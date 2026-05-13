# DataTable

An L3 organism for displaying tabular data with support for sorting, row selection, loading skeletons, empty states, and optional pagination.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `DataTableColumn[]` | — | Column definitions (required) |
| `data` | `Record<string, unknown>[]` | — | Row data (required) |
| `rowKey` | `string \| (row, index) => string` | index | Stable key per row |
| `variant` | `'default' \| 'striped' \| 'bordered'` | `'default'` | Visual table style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Row height / padding tier |
| `loading` | `boolean` | `false` | Show skeleton rows |
| `loadingRowCount` | `number` | `5` | Skeleton row count |
| `sortState` | `DataTableSortState` | — | Controlled sort state |
| `onSortChange` | `(sort) => void` | — | Sort change handler |
| `selectedKeys` | `Set<string>` | — | Controlled selected row keys |
| `onSelectionChange` | `(keys) => void` | — | Selection change handler; providing this enables row selection |
| `caption` | `string` | — | Accessible table caption (sr-only) and scroll region label |
| `aria-label` | `string` | — | Explicit aria-label for the scroll region |
| `stickyHeader` | `boolean` | `false` | Stick the header row on scroll |
| `pagination` | `DataTablePaginationConfig` | — | Pagination config; renders `<Pagination>` below the table |
| `i18nStrings` | `DataTableI18nStrings` | — | i18n string overrides |
| `className` | `string` | — | Additional class on the wrapper |

### `DataTableColumn` shape

| Field | Type | Default | Description |
|---|---|---|---|
| `key` | `string` | — | Data property key (required) |
| `header` | `string` | — | Column header text (required) |
| `sortable` | `boolean` | `false` | Enable sort button on this column |
| `width` | `string` | — | CSS column width, e.g. `'120px'`, `'20%'` |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Cell content alignment |
| `render` | `(value, row, rowIndex) => ReactNode` | — | Custom cell renderer |

### `DataTableSortState` shape

| Field | Type | Description |
|---|---|---|
| `key` | `string` | Column key being sorted |
| `direction` | `'asc' \| 'desc' \| 'none'` | Sort direction |

### `DataTablePaginationConfig` shape

| Field | Type | Default | Description |
|---|---|---|---|
| `currentPage` | `number` | — | Current page (1-based) |
| `totalPages` | `number` | — | Total page count |
| `onPageChange` | `(page: number) => void` | — | Page change handler |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | Pagination control size |
| `showFirstLast` | `boolean` | `false` | Show first/last jump buttons |

---

## Tokens Used

| Token | Purpose |
|---|---|
| `--data-table-min-width` | Minimum table width before horizontal scroll |
| `--data-table-radius` | Container border radius |
| `--data-table-border-color` | Outer border and bordered-variant cell border |
| `--data-table-head-bg` | Header row background |
| `--data-table-head-text` | Header cell text color |
| `--data-table-head-border` | Header bottom border |
| `--data-table-head-text-sorted` | Header text color when column is sorted |
| `--data-table-row-bg` | Default row background |
| `--data-table-row-bg-hover` | Row background on hover |
| `--data-table-row-bg-selected` | Row background when selected |
| `--data-table-row-bg-striped` | Even-row background in striped variant |
| `--data-table-row-border` | Row separator border |
| `--data-table-row-text` | Row cell text color |
| `--data-table-cell-px-{sm\|md\|lg}` | Cell horizontal padding per size |
| `--data-table-cell-py-{sm\|md\|lg}` | Cell vertical padding per size |
| `--data-table-sort-gap` | Gap between sort button label and icon |
| `--data-table-sort-icon-color` | Sort icon color (inactive column) |
| `--data-table-sort-icon-color-active` | Sort icon color (active sorted column) |
| `--data-table-footer-bg` | Pagination footer background |
| `--data-table-footer-border` | Pagination footer top border |
| `--data-table-footer-px` | Pagination footer horizontal padding |
| `--data-table-footer-py` | Pagination footer vertical padding |

---

## Variants

### `default`

Clean table with bottom-only borders on rows. Rows highlight on hover.

### `striped`

Alternating row backgrounds (`--data-table-row-bg` and `--data-table-row-bg-striped`) for easier row scanning. Maintains hover state on all rows.

### `bordered`

Full borders on every cell (header and body). Removes single-side border style. Useful for dense data where clear cell delineation aids readability.

---

## Sizes

| Size | Cell padding | Typography |
|---|---|---|
| `sm` | px: 12px, py: 8px | `text-body-xs` |
| `md` | px: 16px, py: 12px | `text-body-sm` |
| `lg` | px: 24px, py: 16px | `text-body-md` |

---

## States

| State | Behaviour |
|---|---|
| **Default** | Static rows with hover highlight |
| **Loading** | `loading={true}` replaces tbody with `loadingRowCount` skeleton rows; `aria-busy` set on scroll region |
| **Empty** | `data.length === 0` and not loading renders `<EmptyState>` in a full-width cell |
| **Sorted** | Sorted column header changes colour; sort icon reflects direction (`ChevronUp` / `ChevronDown` / `ChevronsUpDown`) |
| **Selected** | Selected rows use `--data-table-row-bg-selected` background; `aria-selected="true"` on row |
| **Select-all indeterminate** | Header checkbox shows indeterminate state when some (not all) rows are selected |

---

## Sorting

Sorting is fully controlled:

```tsx
const [sort, setSort] = useState<DataTableSortState>({ key: '', direction: 'none' });

<DataTable
  columns={columns}
  data={sortedData}  // consumer is responsible for sorting the data array
  sortState={sort}
  onSortChange={setSort}
/>
```

Clicking a sortable column cycles: `none → asc → desc → none`.

---

## Row Selection

Pass `selectedKeys` (a `Set<string>`) and `onSelectionChange` to enable selection. `rowKey` is required for stable keys.

```tsx
const [selected, setSelected] = useState(new Set<string>());

<DataTable
  columns={columns}
  data={data}
  rowKey="id"
  selectedKeys={selected}
  onSelectionChange={setSelected}
/>
```

When selection is enabled:
- A checkbox column is prepended automatically
- The header checkbox selects/deselects all
- The header checkbox shows indeterminate state when a subset is selected
- Selected rows receive `aria-selected="true"`

---

## Pagination

```tsx
const [page, setPage] = useState(1);

<DataTable
  columns={columns}
  data={pagedData}   // consumer slices data to the current page
  pagination={{
    currentPage: page,
    totalPages: 10,
    onPageChange: setPage,
    size: 'sm',
    showFirstLast: true,
  }}
/>
```

The pagination bar is hidden while `loading={true}`.

---

## Accessibility

### Semantic structure

| Element | Semantics |
|---|---|
| `<div role="region">` | Named scroll container; `aria-busy` during load |
| `<table>` | Native table semantics |
| `<caption class="sr-only">` | Table title for screen readers |
| `<th scope="col">` | Column header; SR announces column on every cell |
| `aria-sort="ascending\|descending\|none"` | Communicated on sortable `<th>` |
| `<tr aria-selected>` | Row selection state for SR |

### Keyboard interaction

| Key | Behaviour |
|---|---|
| `Tab` | Move focus to sort buttons and row checkboxes in document order |
| `Enter` / `Space` | Activate a focused sort button or toggle a checkbox |

### Screen reader announcements

- Table is identified by the `<caption>` (sr-only) which is referenced via `aria-labelledby`
- Sort button `aria-label` describes the *next* action: "Sort Name ascending", "Sort Name descending", "Clear sort for Name"
- `aria-sort` on `<th>` communicates *current* sort state independently of the button label
- Loading state: `aria-busy="true"` on the region wrapper; skeleton rows are `aria-hidden="true"`
- Row selection: `aria-selected` on each `<tr>`; select-all/row checkbox labels announce the action

### Touch targets

All sort buttons and checkboxes meet the 24×24 px minimum (WCAG 2.5.8). The `.touch-target` helper is applied via the `Checkbox` atom.

---

## i18n

Override default English strings via `i18nStrings`:

```tsx
<DataTable
  i18nStrings={{
    sortNoneLabel:  (header) => `Trier ${header} croissant`,
    sortAscLabel:   (header) => `Trier ${header} décroissant`,
    sortDescLabel:  (header) => `Effacer le tri pour ${header}`,
    loadingLabel:   'Chargement des données',
    emptyMessage:   'Aucun résultat',
    selectAllLabel: 'Sélectionner toutes les lignes',
    selectRowLabel: (n) => `Sélectionner la ligne ${n}`,
  }}
  ...
/>
```

Global defaults can be set via `<GeeklegoI18nProvider strings={{ dataTable: { ... } }}>`.

---

## Usage

```tsx
import { DataTable } from './components/organisms/DataTable/DataTable';
import type { DataTableColumn, DataTableSortState } from './components/organisms/DataTable/DataTable.types';

const columns: DataTableColumn[] = [
  { key: 'name',  header: 'Name',  sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role',  header: 'Role' },
];

function MyPage() {
  const [sort, setSort] = useState<DataTableSortState>({ key: 'name', direction: 'asc' });

  return (
    <DataTable
      caption="Users"
      columns={columns}
      data={users}
      rowKey="id"
      sortState={sort}
      onSortChange={setSort}
      variant="striped"
      size="md"
    />
  );
}
```
