# Pagination

A navigation molecule for traversing paged content. Renders a `<nav>` landmark containing previous/next controls and — in the `default` variant — an intelligently trimmed list of numbered page buttons with ellipsis. The `simple` variant provides a minimal prev/next layout with a centred "Page X of Y" label.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `totalPages` | `number` | — | **Required.** Total number of pages. Must be ≥ 1. |
| `currentPage` | `number` | — | **Required.** Active page (1-indexed). Controlled — pair with `onPageChange`. |
| `onPageChange` | `(page: number) => void` | — | **Required.** Callback fired with the requested page number. |
| `variant` | `'default' \| 'simple'` | `'default'` | Layout strategy. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button height and typography scale. |
| `siblingCount` | `number` | `1` | Page buttons shown on each side of the current page before showing ellipsis. |
| `showFirstLast` | `boolean` | `false` | Show jump-to-first (⏮) and jump-to-last (⏭) buttons. |
| `i18nStrings` | `PaginationI18nStrings` | — | Per-instance label overrides. See i18n section. |
| `className` | `string` | — | Additional classes applied to the `<nav>` element. |

All additional props are forwarded to the `<nav>` element.

---

## Tokens Used

```
--pagination-item-bg / -bg-hover / -bg-active   Page item resting, hover, active backgrounds
--pagination-item-text / -text-hover             Page item text colours
--pagination-item-border / -border-hover         Page item border (transparent at rest, visible on hover)
--pagination-item-radius                         Corner radius (radius-component-md)
--pagination-item-text-disabled                  Muted text for disabled nav controls
--pagination-current-bg / -bg-hover              Current page fill (action-primary)
--pagination-current-text                        Current page text (text-inverse)
--pagination-current-border                      Current page border (transparent)
--pagination-current-shadow / -shadow-hover      Flat at rest; subtle lift on hover (--shadow-sm/--shadow-md)
--pagination-ellipsis-color                      Ellipsis icon colour
--pagination-info-text                           Simple variant "Page X of Y" text colour
--pagination-info-px                             Simple variant info text horizontal padding
--pagination-item-size-sm/md/lg                  Square button dimensions per size
--pagination-gap-sm/md/lg                        Gap between items per size
--pagination-label-overflow/whitespace/text-overflow  Content flexibility (page label slot)
```

---

## Variants

| Variant | Description |
|---|---|
| `default` | Numbered page buttons with ellipsis trimming for large ranges. Current page is filled (action-primary colour); others are ghost-style (transparent with border on hover). |
| `simple` | Prev/Next arrows only, with a centred "Page X of Y" info label. Ideal for mobile-first or space-constrained layouts. |

---

## Sizes

| Size | Height token | Typography |
|---|---|---|
| `sm` | `--size-component-sm` (32px) | `text-button-sm` |
| `md` | `--size-component-md` (40px) | `text-button-md` |
| `lg` | `--size-component-lg` (48px) | `text-button-lg` |

---

## States

| State | Description |
|---|---|
| **Default** | Page items are ghost-style; current page is filled with action-primary colour |
| **Hover** | Ghost items gain muted bg + visible border; current page lifts shadow |
| **Focus-visible** | Focus ring on all interactive elements via `focus-visible:focus-ring` |
| **Active/Pressed** | Deeper background on page items |
| **Prev disabled** | When `currentPage === 1` — prev (and first) buttons are disabled via Button atom |
| **Next disabled** | When `currentPage === totalPages` — next (and last) buttons are disabled via Button atom |
| **Current** | `aria-current="page"`, filled action-primary bg, cursor-default, no pointer interaction |

---

## Page Range Algorithm

Pagination computes a trimmed page list using sibling windows around the current page:

```
totalPages ≤ (siblingCount × 2 + 5)  →  show all pages
otherwise:
  [1] [dots-left?] [left siblings] [current] [right siblings] [dots-right?] [N]
```

**Examples with `siblingCount=1`, `totalPages=20`:**

| currentPage | Range |
|---|---|
| 1 | 1 2 3 … 20 |
| 5 | 1 … 4 **5** 6 … 20 |
| 19 | 1 … 18 **19** 20 |
| 20 | 1 … 18 19 **20** |

---

## Accessibility

**Semantic structure:**
- Root element is `<nav aria-label="Pagination">` — announces as a navigation landmark.
- Page list uses `<ul>` + `<li>` — screen readers announce item count.
- All interactive controls are native `<button>` elements (keyboard-accessible by default).
- Ellipsis spans carry `aria-hidden="true"` on their `<li>` — screen readers skip them.

**State communication:**
- `aria-current="page"` on the current page button — screen readers announce "current" or equivalent.
- Each page button has `aria-label="Page X of Y"` for full context beyond just the number.
- A `sr-only` `aria-live="polite"` span re-announces the current page whenever it changes.
- In the `simple` variant, the visible label is `aria-hidden="true"` to prevent double announcement.

**Prev/Next buttons:**
- Implemented with the Button atom (`variant="ghost"`, `iconOnly`).
- Disabled via Button's `disabled` prop when at first/last page — removed from tab order automatically.
- Accessible names via `i18nStrings.prevLabel` / `nextLabel` (default: "Previous page" / "Next page").

**Keyboard interaction:**

| Key | Behaviour |
|---|---|
| `Tab` | Move focus forward through prev → page items → next (standard tab order) |
| `Shift + Tab` | Move focus backward |
| `Enter` / `Space` | Activate the focused page button or nav button |
| (no arrow key navigation) | Pages are individually focusable — no roving tabindex needed |

**Touch targets:**
- All buttons meet the 24×24px minimum (minimum size is `--size-component-sm` = 32px).

---

## i18n

Pagination has system-generated strings that must be externalisable. Pass `i18nStrings` for per-instance overrides, or wrap the app in `GeeklegoI18nProvider` for global overrides.

| Key | Default | Description |
|---|---|---|
| `navLabel` | `"Pagination"` | `aria-label` on the `<nav>` landmark |
| `prevLabel` | `"Previous page"` | `aria-label` on the previous button |
| `nextLabel` | `"Next page"` | `aria-label` on the next button |
| `firstLabel` | `"First page"` | `aria-label` on the first-page jump button (showFirstLast) |
| `lastLabel` | `"Last page"` | `aria-label` on the last-page jump button (showFirstLast) |
| `pageLabel` | `({ page, total }) => "Page ${page} of ${total}"` | SR-only live text + simple variant label + each page button aria-label |

---

## Usage

```tsx
import { useState } from 'react';
import { Pagination } from './components/molecules/Pagination/Pagination';

// Controlled usage
function ProductListing() {
  const [page, setPage] = useState(1);

  return (
    <>
      <ProductGrid page={page} />
      <Pagination
        totalPages={24}
        currentPage={page}
        onPageChange={setPage}
        size="md"
        showFirstLast
      />
    </>
  );
}

// Simple variant for mobile-first layouts
<Pagination
  variant="simple"
  totalPages={10}
  currentPage={currentPage}
  onPageChange={setCurrentPage}
  size="sm"
/>

// Custom i18n labels (e.g. German)
<Pagination
  totalPages={10}
  currentPage={5}
  onPageChange={handlePageChange}
  i18nStrings={{
    navLabel:  'Seitennavigation',
    prevLabel: 'Vorherige Seite',
    nextLabel: 'Nächste Seite',
    pageLabel: ({ page, total }) => `Seite ${page} von ${total}`,
  }}
/>
```
