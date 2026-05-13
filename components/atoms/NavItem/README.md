# NavItem

**Level:** Atom (L1)
**Dependencies:** None (no atom imports required)

## Description

A sidebar navigation item with optional leading icon, text label, expandable sub-items, and active/hover/disabled states. Renders as an anchor when `href` is provided, or a button otherwise. Expandable items reveal nested children with a smooth CSS grid animation, indented with a left border. Fully token-driven with automatic light and dark theme support.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `ReactNode` | — | Icon element displayed before the label |
| `label` | `string` | — | Text label for the nav item |
| `isActive` | `boolean` | `false` | Whether this item is currently active/selected |
| `isExpandable` | `boolean` | `false` | Whether this item has expandable children |
| `isExpanded` | `boolean` | `false` | Whether this expandable item is currently expanded (controlled) |
| `onToggle` | `() => void` | — | Callback when the item is clicked |
| `children` | `ReactNode` | — | Sub-items rendered when expanded |
| `disabled` | `boolean` | `false` | Disables interaction |
| `href` | `string` | — | Href for navigation — renders as anchor if provided |
| `className` | `string` | — | Additional CSS classes on the `<li>` wrapper |

## Tokens Used

| Token | Resolves to | Used for |
|---|---|---|
| `--navitem-bg` | `transparent` | Default background |
| `--navitem-bg-hover` | `--color-action-secondary` | Hover background |
| `--navitem-bg-active` | `--color-state-selected` | Active/selected background |
| `--navitem-text` | `--color-text-primary` | Default text color |
| `--navitem-text-active` | `--color-action-primary` | Active text color |
| `--navitem-icon-color` | `--color-text-secondary` | Default icon color |
| `--navitem-icon-color-active` | `--color-action-primary` | Active icon color |
| `--navitem-indicator-color` | `--color-text-tertiary` | Expand/collapse chevron color |
| `--navitem-radius` | `--radius-component-md` | Border radius |
| `--navitem-height` | `--size-component-md` | Item height |
| `--navitem-padding-x` | `--spacing-component-md` | Horizontal padding |
| `--navitem-gap` | `--spacing-component-sm` | Gap between icon and label |
| `--navitem-subitem-indent` | `--spacing-component-xl` | Left indent for sub-items |
| `--navitem-subitem-border` | `--color-border-subtle` | Left border color on sub-item group |

## Variants

| Variant | Description |
|---|---|
| Default | Standard nav item with label only |
| With icon | Icon displayed before the label |
| As link | Renders as `<a>` when `href` is provided |
| Expandable | Shows chevron indicator, reveals children on toggle |

## States

| State | Description |
|---|---|
| Default | Transparent background, primary text |
| Hover | Subtle secondary background |
| Active | Selected background, primary-colored text and icon |
| Disabled | Reduced opacity, no pointer events |
| Expanded | Chevron rotates down, children visible with slide animation |

## Accessibility

- Semantic `<li>` wrapper
- Renders `<a>` for navigation links, `<button>` for expandable/clickable items
- `aria-expanded` on expandable items
- `aria-controls` on expandable button pointing to submenu `id`
- `aria-current="page"` on active items
- `aria-disabled` on disabled link items
- `focus-visible:focus-ring` for keyboard navigation
- Icons include `aria-hidden="true"`
- Accepts `innerTabIndex` prop for parent containers using `useRovingTabindex`

### Keyboard Interaction

| Key | Action |
|---|---|
| Tab | Moves focus to the item (standalone). When inside a roving tabindex container (Sidebar), only the active item receives Tab focus. |
| Enter | Navigates (link items) or toggles expansion (expandable items) |
| Space | Same as Enter |
| ArrowDown / ArrowUp | Managed by parent container via `useRovingTabindex` when `innerTabIndex` is provided |

## Schema.org

When `schema={true}` and the item renders as a link (`href` provided, not expandable), emits [SiteNavigationElement](https://schema.org/SiteNavigationElement) Microdata:

| Element | Attribute | Value |
|---|---|---|
| `<li>` | `itemScope`, `itemType` | `https://schema.org/SiteNavigationElement` |
| `<a>` | `itemProp` | `url` |
| Label `<span>` | `itemProp` | `name` |

Only applies to link items — expandable button items do not emit Microdata.

```tsx
<NavItem label="Dashboard" href="/dashboard" schema />
```

## Usage

```tsx
import { NavItem } from '../../atoms/NavItem/NavItem';
import { LayoutGrid, Box, BookOpen } from 'lucide-react';

{/* Simple nav item */}
<NavItem label="Dashboard" icon={<LayoutGrid size="var(--size-icon-sm)" />} />

{/* Active item */}
<NavItem label="Components" icon={<Box size="var(--size-icon-sm)" />} isActive />

{/* Link item */}
<NavItem label="Docs" icon={<BookOpen size="var(--size-icon-sm)" />} href="/docs" />

{/* Expandable item with sub-items */}
<NavItem
  label="Components"
  icon={<Box size="var(--size-icon-sm)" />}
  isExpandable
  isExpanded={expanded}
  onToggle={() => setExpanded(!expanded)}
>
  <NavItem label="Button" />
  <NavItem label="Input" isActive />
</NavItem>
```