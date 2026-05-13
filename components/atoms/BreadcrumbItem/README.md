# BreadcrumbItem

**Level:** Atom (L1)
**Dependencies:** None

## Description

A single item in a breadcrumb navigation trail. Renders as an `<li>` containing either an `<a>` (link state) or `<span>` (current/disabled state). The visual treatment is determined by the `href`, `current`, and `disabled` props — no variant enum needed. Supports an optional icon prefix and three typographic sizes.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | — | URL this item links to. Renders as `<a>` when provided and not current/disabled. |
| `current` | `boolean` | `false` | Marks as the current page. Renders non-interactive with `aria-current="page"`. |
| `disabled` | `boolean` | `false` | Disabled state. Non-interactive, visually muted. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Text size. |
| `leftIcon` | `ReactNode` | — | Optional icon before the label. Use lucide-react icons. |
| `children` | `ReactNode` | — | The visible label. |

## Tokens Used

| Token | Resolves to | Used for |
|---|---|---|
| `--breadcrumb-item-text` | `--color-text-secondary` | Link text color |
| `--breadcrumb-item-text-hover` | `--color-text-primary` | Link text color on hover |
| `--breadcrumb-item-text-current` | `--color-action-primary` | Current page text (primary/brand) |
| `--breadcrumb-item-text-disabled` | `--color-text-disabled` | Disabled item text |
| `--breadcrumb-item-bg-hover` | `--color-action-secondary` | Link background on hover |
| `--breadcrumb-item-icon` | `--color-text-secondary` | Icon color |
| `--breadcrumb-item-radius` | `--radius-component-sm` | Hover background corner radius |
| `--breadcrumb-item-px` | `--spacing-component-sm` | Horizontal padding (8px) |
| `--breadcrumb-item-py` | `--spacing-component-xs` | Vertical padding (4px) |
| `--breadcrumb-item-gap` | `--spacing-component-xs` | Gap between icon and label |

## Sizes

| Size | Typography class | Font size |
|---|---|---|
| `sm` | `.text-label-sm` | 12px medium |
| `md` | `.text-label-md` | 14px medium |
| `lg` | `.text-body-md` | 16px regular |

## States

Handled: link (default), hover (bg + text color change), focus-visible (focus ring), current (non-interactive, primary text), disabled (non-interactive, muted text).

## Accessibility

- Renders as `<li>` — must be placed inside an `<ol>` (provided by the Breadcrumb molecule)
- Links use native `<a href>` — no custom role required
- Current item gets `aria-current="page"` on the `<li>`
- Disabled item gets `aria-disabled="true"` on the inner `<span>`
- Icons use `aria-hidden="true"` — decorative only
- Focus ring on all link states via `focus-visible:focus-ring`
- Touch target min 44×44px ensured by padding tokens

### Keyboard Interaction

| Key | Action |
|---|---|
| Tab | Moves focus to the next link item (skips non-link current item) |
| Enter | Navigates to the linked page |

## Schema.org

When `schema={true}` (passed from the parent Breadcrumb), emits [ListItem](https://schema.org/ListItem) Microdata:

| Element | Attribute | Value |
|---|---|---|
| `<li>` | `itemScope`, `itemProp`, `itemType` | `itemListElement`, `https://schema.org/ListItem` |
| `<a>` or `<span>` | `itemProp` | `item` |
| Label `<span>` | `itemProp` | `name` |
| Hidden `<meta>` | `itemProp`, `content` | `position`, e.g. `"1"` |

Props `schema` and `schemaPosition` are automatically provided by the parent Breadcrumb molecule.

## Usage

```tsx
import { BreadcrumbItem } from './BreadcrumbItem';

// Link item
<ol>
  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
</ol>

// Current page
<ol>
  <BreadcrumbItem current>Dashboard</BreadcrumbItem>
</ol>

// With icon
<ol>
  <BreadcrumbItem href="/" leftIcon={<Home size="var(--size-icon-sm)" />}>
    Home
  </BreadcrumbItem>
</ol>
```