# DropdownMenu

A floating menu panel that opens when the trigger is clicked. Follows the [WAI-ARIA Menu Button pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) with full keyboard navigation via roving tabindex.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `trigger` | `ReactNode` | — | The element that opens/closes the menu. ARIA props are injected automatically via `React.cloneElement`. |
| `items` | `DropdownMenuItemType[]` | — | Array of items, separators, and groups to render. |
| `placement` | `DropdownMenuPlacement` | `'bottom-start'` | Where the panel opens relative to the trigger. |
| `open` | `boolean` | — | Controlled open state. |
| `onOpenChange` | `(open: boolean) => void` | — | Called when the menu requests an open-state change. |
| `menuLabel` | `string` | — | Accessible label for the `role="menu"` panel. Defaults to the trigger's label via `aria-labelledby`. |
| `i18nStrings` | `DropdownMenuI18nStrings` | — | Per-instance overrides for system strings (see i18n section below). |
| `className` | `string` | — | Extra class for the root wrapper `<div>`. |

### Item shape (`DropdownMenuItemDef`)

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | — | Stable unique identifier (React key + index map). |
| `label` | `string` | — | Visible text label. |
| `icon` | `ReactNode` | — | Leading icon (lucide-react element recommended). |
| `shortcut` | `string` | — | Keyboard shortcut hint (decorative only, `aria-hidden`). |
| `href` | `string` | — | When set, renders `<a role="menuitem">` instead of `<button>`. |
| `target` | `string` | — | Anchor `target` attribute. Triggers `rel` guard for `_blank`. |
| `rel` | `string` | — | Merged with safety directives by `getSafeExternalLinkProps`. |
| `onClick` | `() => void` | — | Called when the item is activated. Menu closes automatically. |
| `disabled` | `boolean` | — | Non-interactive and visually muted. |
| `destructive` | `boolean` | — | Error colour + filled-error hover background. |

### Separator (`DropdownMenuSeparatorDef`)

```ts
{ type: 'separator', id: string }
```

### Group (`DropdownMenuGroupDef`)

```ts
{ type: 'group', id: string, label: string, items: DropdownMenuItemDef[] }
```

---

## i18n Strings (`DropdownMenuI18nStrings`)

| Key | Default | Description |
|---|---|---|
| `defaultMenuLabel` | `"Menu"` | Accessible label for the menu panel when `menuLabel` prop is not provided. Used as the `aria-label` on `role="menu"`. |

---

## Tokens Used

| Token | Description |
|---|---|
| `--dropdown-panel-bg` | Panel background (`--color-surface-raised`) |
| `--dropdown-panel-border` | Panel border (`--color-border-default`) |
| `--dropdown-panel-shadow` | Panel elevation (`--shadow-lg`) |
| `--dropdown-panel-radius` | Panel corner radius (`--radius-component-lg`) |
| `--dropdown-panel-min-width` | Minimum panel width (`--content-min-width-md`) |
| `--dropdown-panel-padding-y` | Vertical padding inside panel (`--spacing-component-xs`) |
| `--dropdown-panel-z` | Z-index layer (`--layer-raised`) |
| `--dropdown-panel-offset` | Gap between trigger and panel (`--spacing-component-xs`) |
| `--dropdown-item-bg` | Item resting background (transparent) |
| `--dropdown-item-bg-hover` | Item hover background (`--color-action-secondary`) |
| `--dropdown-item-bg-active` | Item pressed background (`--color-state-selected`) |
| `--dropdown-item-text` | Item label colour (`--color-text-primary`) |
| `--dropdown-item-text-disabled` | Disabled label colour (`--color-text-disabled`) |
| `--dropdown-item-text-destructive` | Destructive label colour (`--color-text-error`) |
| `--dropdown-item-bg-destructive-hover` | Destructive hover fill (`--color-status-error`) |
| `--dropdown-item-text-destructive-hover` | Destructive hover text (`--color-text-inverse`) |
| `--dropdown-item-icon-color` | Icon colour (`--color-text-secondary`) |
| `--dropdown-item-icon-color-destructive` | Destructive icon colour (`--color-text-error`) |
| `--dropdown-item-shortcut-text` | Shortcut hint colour (`--color-text-tertiary`) |
| `--dropdown-group-label-text` | Group header colour (`--color-text-tertiary`) |
| `--dropdown-separator-color` | Separator line colour (`--color-border-subtle`) |

---

## Placement

```
bottom-start (default)   bottom-end
top-start                top-end
```

All position values use logical CSS (`start-0` / `end-0`) for full RTL support.

---

## Variants

| Variant | Visual treatment |
|---|---|
| **Default item** | Transparent background; secondary hover fill |
| **Destructive item** | Error text colour; fills with error colour on hover (unmistakable danger signal) |
| **Disabled item** | Muted text; no hover response; `cursor-not-allowed` |
| **Link item** | Same visual as button item; renders `<a>` with sanitized href |
| **Group** | Items under a muted uppercase label; wrapped in `role="group"` |
| **Separator** | Full-width hairline rule |

---

## States

| State | Visual |
|---|---|
| Default | Transparent background |
| Hover | `--dropdown-item-bg-hover` fill |
| Active | `--dropdown-item-bg-active` fill |
| Disabled | `--dropdown-item-text-disabled`; `cursor-not-allowed`; `pointer-events-none` |
| Destructive hover | Error-filled background + inverse text |

---

## Accessibility

**Semantic structure:** Root is `<div>`, trigger is the consumer's element (usually `<button>`), panel is `<ul role="menu">`, each item is `<li role="presentation">` containing `<button role="menuitem">` or `<a role="menuitem">`.

**Roles and attributes:**

| Element | Role / attribute | Value |
|---|---|---|
| Trigger | `aria-haspopup` | `"menu"` |
| Trigger | `aria-expanded` | `true` / `false` |
| Trigger | `aria-controls` | panel `id` |
| Panel | `role` | `"menu"` |
| Panel | `aria-labelledby` | trigger `id` (default) |
| Panel | `aria-orientation` | `"vertical"` |
| Panel | `aria-hidden` | `true` when closed |
| Item wrapper | `role` | `"presentation"` |
| Item button/link | `role` | `"menuitem"` |
| Item (disabled) | `aria-disabled` | `true` |
| Group sub-list | `role` | `"group"` |
| Group sub-list | `aria-label` | group label |
| Separator | `role` | `"separator"` |
| Icons | `aria-hidden` | `"true"` |
| Shortcuts | `aria-hidden` | `"true"` |

**Keyboard interaction:**

| Key | Action |
|---|---|
| `Enter` / `Space` | Open menu (on trigger); activate focused item |
| `↓` | Move focus to next item (wraps) |
| `↑` | Move focus to previous item (wraps) |
| `Home` | Move focus to first item |
| `End` | Move focus to last item |
| `Escape` | Close menu; return focus to trigger |
| `Tab` | Close menu; advance focus to next element |

**Focus management:** When the menu opens, focus is programmatically placed on the first non-disabled item. When the menu closes (by any means), focus returns to the trigger element.

**Screen reader announcement (closed):**
> "Account, button, has popup, collapsed"

**Screen reader announcement (open, first item):**
> "Account menu, list — View profile, 1 of 4"

---

## Usage

### Uncontrolled (default)

```tsx
import { DropdownMenu } from './DropdownMenu';
import { Button } from '../atoms/Button/Button';
import { ChevronDown, User, Settings, LogOut } from 'lucide-react';

<DropdownMenu
  trigger={
    <Button rightIcon={<ChevronDown size="var(--size-icon-sm)" />}>
      Account
    </Button>
  }
  items={[
    { id: 'profile',  label: 'Profile',   icon: <User size="var(--size-icon-sm)" />, onClick: () => {} },
    { id: 'settings', label: 'Settings',  icon: <Settings size="var(--size-icon-sm)" /> },
    { type: 'separator', id: 'sep' },
    { id: 'logout',   label: 'Sign out',  icon: <LogOut size="var(--size-icon-sm)" />, destructive: true },
  ]}
/>
```

### Controlled

```tsx
const [open, setOpen] = useState(false);

<DropdownMenu
  open={open}
  onOpenChange={setOpen}
  trigger={<Button>Actions</Button>}
  items={items}
/>
```

### Link item (opens URL)

```tsx
items={[
  {
    id: 'docs',
    label: 'Open documentation',
    href: 'https://geeklego.dev/docs',
    target: '_blank',   // rel="noopener noreferrer" added automatically
  },
]}
```

### Grouped items

```tsx
items={[
  {
    type: 'group',
    id: 'account',
    label: 'Account',
    items: [
      { id: 'profile',  label: 'Profile'  },
      { id: 'settings', label: 'Settings' },
    ],
  },
  { type: 'separator', id: 'sep' },
  { id: 'logout', label: 'Sign out', destructive: true },
]}
```

---

## Security

- All `href` values on link items are passed through `getSafeExternalLinkProps()` from `components/utils/security/sanitize`.
- `javascript:`, `vbscript:`, and `data:text/html` protocols are stripped and replaced with `#`.
- `target="_blank"` triggers automatic `rel="noopener noreferrer"`. Consumer-supplied `rel` values are merged and de-duplicated.