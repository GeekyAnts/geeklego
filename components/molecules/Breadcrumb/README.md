# Breadcrumb

**Level:** Molecule (L2)
**Dependencies:** `../../atoms/BreadcrumbItem/BreadcrumbItem`

## Description

A navigation trail that shows the user's location within the app hierarchy. Composes `BreadcrumbItem` atoms into an accessible `<nav>` + `<ol>` structure with automatic separator rendering between items. The last item in the `items` array is always treated as the current page — no explicit `current` marking required.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `BreadcrumbItemData[]` | — | Required. Ordered list of breadcrumb items. Last item auto-marked as current. |
| `separator` | `ReactNode` | `<ChevronRight />` | Custom separator rendered between items. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Text size applied uniformly to all items. |

## BreadcrumbItemData

| Key | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Visible label text. |
| `href` | `string` | — | URL for the link. Omit for non-navigable items. |
| `current` | `boolean` | auto | Marks as current page. Auto-applied to the last item. |
| `disabled` | `boolean` | `false` | Disabled state. |
| `icon` | `ReactNode` | — | Optional icon before the label. |

## Tokens Used

| Token | Resolves to | Used for |
|---|---|---|
| `--breadcrumb-separator-color` | `--color-text-tertiary` | Separator icon/text color |
| `--breadcrumb-gap` | `--spacing-component-xs` | Gap between items and separators |
| `--breadcrumb-item-text` | `--color-text-secondary` | Link text color |
| `--breadcrumb-item-text-hover` | `--color-text-primary` | Link hover text |
| `--breadcrumb-item-text-current` | `--color-action-primary` | Current page text (primary/brand) |
| `--breadcrumb-item-text-disabled` | `--color-text-disabled` | Disabled item text |
| `--breadcrumb-item-bg-hover` | `--color-action-secondary` | Link hover background |
| `--breadcrumb-item-icon` | `--color-text-secondary` | Icon color |

## Sizes

| Size | Typography | Font size |
|---|---|---|
| `sm` | `.text-label-sm` | 12px medium |
| `md` | `.text-label-md` | 14px medium |
| `lg` | `.text-body-md` | 16px regular |

## States

Handled (via BreadcrumbItem): link default, hover (bg + text shift), focus-visible (focus ring), current (non-interactive), disabled (muted, no interaction).

## Accessibility

- `<nav aria-label="Breadcrumb">` wraps the entire component
- Items render inside `<ol>` — ordered list conveys path hierarchy
- Current item has `aria-current="page"` on its `<li>`
- Separator `<li>` elements have `aria-hidden="true"` — not announced
- Icons have `aria-hidden="true"` — decorative only
- All links are keyboard-navigable with visible focus ring

### Keyboard Interaction

| Key | Action |
|---|---|
| Tab | Moves focus through breadcrumb link items in order |
| Enter | Navigates to the linked page |

## Schema.org

When `schema={true}`, the Breadcrumb emits [BreadcrumbList](https://schema.org/BreadcrumbList) Microdata:

| Element | Attribute | Value |
|---|---|---|
| `<nav>` | `itemScope`, `itemType` | `https://schema.org/BreadcrumbList` |
| Each `<li>` | `itemScope`, `itemProp`, `itemType` | `itemListElement`, `https://schema.org/ListItem` |
| Each `<a>` or `<span>` | `itemProp` | `item` |
| Label text | `itemProp` | `name` |
| Hidden `<meta>` | `itemProp`, `content` | `position`, `"1"`, `"2"`, etc. |

```tsx
<Breadcrumb
  schema
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Widget' },
  ]}
/>
```

## Usage

```tsx
import { Breadcrumb } from './Breadcrumb';

// Basic trail — last item is auto-current
<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Widget' },
  ]}
/>

// With icons
<Breadcrumb
  items={[
    { label: 'Home', href: '/', icon: <Home size="var(--size-icon-sm)" /> },
    { label: 'Dashboard' },
  ]}
/>

// Custom separator
<Breadcrumb
  items={[...]}
  separator={<span className="text-secondary">/</span>}
/>

// Small size for compact layouts
<Breadcrumb items={[...]} size="sm" />
```