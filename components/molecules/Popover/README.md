# Popover

A floating panel anchored to a trigger element that displays rich content — text, form fields, action buttons, or any arbitrary React nodes. Positioned at one of 8 placements relative to the trigger.

Sits between **Tooltip** (hover-only, text-only description) and **Modal** (full backdrop, page-blocking) in the overlay hierarchy.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `trigger` | `ReactElement` | — | **Required.** The element that opens/closes the popover. ARIA props are injected automatically via `cloneElement`. |
| `children` | `ReactNode` | — | **Required.** Content rendered in the popover body. |
| `title` | `string` | — | Optional heading rendered in a header section above the body. Enables `aria-labelledby` on the panel. |
| `headingLevel` | `'h2'–'h6'` | `'h3'` | HTML heading element for the title. Override when nesting inside a section with a different heading hierarchy. |
| `showCloseButton` | `boolean` | `true` | Show a close (×) button in the header. Has no effect when `title` is omitted. |
| `footerContent` | `ReactNode` | — | Optional content rendered in a footer section below the body, separated by a divider. |
| `placement` | `PopoverPlacement` | `'bottom-start'` | Panel placement relative to the trigger. See Placements section. |
| `open` | `boolean` | — | Controlled open state. Omit for uncontrolled behaviour. |
| `onOpenChange` | `(open: boolean) => void` | — | Callback fired when the panel opens or closes. |
| `className` | `string` | — | Additional className on the root wrapper `<div>`. |
| `i18nStrings` | `PopoverI18nStrings` | — | Override system-generated string defaults. |

---

## Placements

8 placement values, using CSS logical properties for RTL support:

| Value | Panel position |
|---|---|
| `bottom-start` | Below trigger, left-aligned (default) |
| `bottom-end` | Below trigger, right-aligned |
| `top-start` | Above trigger, left-aligned |
| `top-end` | Above trigger, right-aligned |
| `left-start` | Left of trigger, top-aligned |
| `left-end` | Left of trigger, bottom-aligned |
| `right-start` | Right of trigger, top-aligned |
| `right-end` | Right of trigger, bottom-aligned |

---

## Tokens Used

| Token | Value | Purpose |
|---|---|---|
| `--popover-panel-bg` | `--color-surface-raised` | Panel background |
| `--popover-panel-border` | `--color-border-default` | Panel border |
| `--popover-panel-radius` | `--radius-component-lg` | Panel corner radius |
| `--popover-panel-shadow` | `--shadow-lg` | Panel elevation |
| `--popover-panel-z` | `--layer-popover` (600) | Z-index layer |
| `--popover-panel-offset` | `--spacing-component-xs` | Gap between trigger and panel |
| `--popover-panel-min-width` | `--content-min-width-md` | Minimum panel width |
| `--popover-panel-max-width` | `--content-max-width-overlay-sm` | Maximum panel width |
| `--popover-section-px` | `--spacing-component-xl` | Horizontal padding for all sections |
| `--popover-section-py` | `--spacing-component-lg` | Vertical padding for all sections |
| `--popover-divider` | `--color-border-subtle` | Header/footer separator colour |
| `--popover-title-text` | `--color-text-primary` | Title text colour |
| `--popover-body-text` | `--color-text-secondary` | Body text colour |
| `--popover-close-gap` | `--spacing-component-md` | Gap between title and close button |

---

## Usage

### Uncontrolled (default)

```tsx
import { Popover } from './Popover';
import { Button } from '../Button/Button';

<Popover
  trigger={<Button variant="secondary">Options</Button>}
>
  <p>Popover content goes here.</p>
</Popover>
```

### With title and close button

```tsx
<Popover
  trigger={<Button variant="primary">Settings</Button>}
  title="Display settings"
>
  <p>Adjust your display preferences below.</p>
</Popover>
```

### With footer actions

```tsx
<Popover
  trigger={<Button variant="outline">Confirm</Button>}
  title="Delete item?"
  footerContent={
    <div className="flex justify-end gap-2">
      <Button variant="ghost" size="sm">Cancel</Button>
      <Button variant="destructive" size="sm">Delete</Button>
    </div>
  }
>
  <p>This action cannot be undone.</p>
</Popover>
```

### Controlled state

```tsx
const [open, setOpen] = useState(false);

<Popover
  open={open}
  onOpenChange={setOpen}
  trigger={<Button variant="secondary">Filter</Button>}
  title="Filter results"
>
  <p>Filter controls here.</p>
</Popover>
```

### Custom placement

```tsx
<Popover
  placement="right-start"
  trigger={<Button variant="ghost" size="sm">Info</Button>}
>
  <p>Details panel anchored to the right.</p>
</Popover>
```

---

## Accessibility

### Semantic structure

| Element | Semantics |
|---|---|
| Root wrapper | `<div>` (layout only) |
| Panel | `<div role="dialog" aria-modal="true">` |
| Panel (with title) | `aria-labelledby` — heading `id` |
| Header | `<header>` (scoped to panel — not page-level landmark) |
| Title | Configurable heading element (`h2`–`h6`, default `h3`) |
| Footer | `<footer>` (scoped to panel) |
| Close button | `<button>` via `Button` atom, `aria-label="Close"` |

### Trigger ARIA (injected automatically)

| Attribute | Value | Purpose |
|---|---|---|
| `aria-haspopup` | `"dialog"` | Announces popover type to screen readers |
| `aria-expanded` | `true/false` | Reflects open state |
| `aria-controls` | `{panelId}` | Links trigger to panel |

### Keyboard interaction

| Key | Action |
|---|---|
| `Enter` / `Space` | Toggle popover (on the trigger) |
| `Tab` | Move forward through focusable elements inside panel (wraps to first) |
| `Shift + Tab` | Move backward through focusable elements inside panel (wraps to last) |
| `Escape` | Close popover and return focus to the trigger |

### Focus management

- **On open:** focus is moved to the first focusable element inside the panel (`useFocusTrap`)
- **On close:** focus returns to the element that was focused before the popover opened
- Focus is **trapped** inside the panel while open — Tab/Shift+Tab cannot escape

### Screen reader announcement

When opened, screen readers announce: the dialog role, the accessible name from the title heading (when provided), and begin reading from the first focusable element.

---

## i18n Strings

| Key | Default | Description |
|---|---|---|
| `closeLabel` | `"Close"` | `aria-label` for the close (×) button in the header |

```tsx
<Popover
  title="Settings"
  i18nStrings={{ closeLabel: 'Fermer' }}
  trigger={<Button>Open</Button>}
>
  ...
</Popover>
```

---

## Schema.org

No Schema.org mapping — Popover has no semantic entity mapping. The `schema` prop is not implemented.
