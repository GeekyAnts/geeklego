# Drawer

An off-canvas panel that slides in from any edge of the viewport — left, right, top, or bottom. Renders in a React portal on `document.body`, traps keyboard focus, dismisses on Escape or backdrop click, and is announced by screen readers as a dialog.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | required | Whether the drawer is visible. |
| `onClose` | `() => void` | required | Called when the drawer should close. |
| `placement` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | Edge of the viewport the panel slides in from. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Panel size. Left/right: width. Top/bottom: height. |
| `title` | `string` | — | Title text in the header; wires `aria-labelledby`. |
| `loading` | `boolean` | `false` | When true, replaces body with a skeleton. |
| `closeOnBackdropClick` | `boolean` | `true` | When false, clicking the backdrop does not close. |
| `className` | `string` | — | Additional className on the panel element. |
| `children` | `ReactNode` | — | Compose `Drawer.Body` and `Drawer.Footer` inside. |
| `i18nStrings` | `DrawerI18nStrings` | — | Per-instance string overrides. |

### `DrawerI18nStrings`

| Key | Default | Description |
|---|---|---|
| `closeLabel` | `"Close"` | `aria-label` for the close (×) button. |
| `drawerLabel` | `"Drawer"` | Fallback `aria-label` when no `title` is provided. |

---

## Compound Slots

Compose these static slot components inside `<Drawer>`:

### `Drawer.Body`

Scrollable content region. Grows to fill available panel height. Accepts any `HTMLAttributes<HTMLDivElement>`.

### `Drawer.Footer`

Action bar with a top border. Renders at the bottom of the panel. Accepts any `HTMLAttributes<HTMLDivElement>`.

---

## Placements

| Value | Panel edge | Inner radius |
|---|---|---|
| `'right'` (default) | Anchored to the right viewport edge | Start (left) corners rounded |
| `'left'` | Anchored to the left viewport edge | End (right) corners rounded |
| `'top'` | Anchored to the top viewport edge | Bottom corners rounded |
| `'bottom'` | Anchored to the bottom viewport edge | Top corners rounded |

---

## Sizes

### Left / Right placement (controls width)

| Size | Width |
|---|---|
| `sm` | `--size-overlay-sm` (24 rem) |
| `md` | `--size-overlay-md` (32 rem) |
| `lg` | `--size-overlay-lg` (40 rem) |
| `xl` | `--size-overlay-xl` (48 rem) |
| `full` | 100% viewport width, full height, no radius |

### Top / Bottom placement (controls height)

| Size | Height |
|---|---|
| `sm` | `--size-overlay-height-sm` (12 rem) |
| `md` | `--size-overlay-height-md` (20 rem) |
| `lg` | `--size-overlay-height-lg` (28 rem) |
| `xl` | `--size-overlay-height-xl` (40 rem) |
| `full` | 100% viewport height, full width, no radius |

---

## States

| State | Behaviour |
|---|---|
| `loading={true}` | Body is replaced with a skeleton placeholder; dimensions preserved. |
| `closeOnBackdropClick={false}` | Backdrop click is suppressed; only close button or Escape dismisses. |
| No `title` | `aria-label` falls back to `i18nStrings.drawerLabel` ("Drawer"). |

---

## Usage

```tsx
import { Drawer } from './Drawer';
import { Button } from '../atoms/Button/Button';

function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Settings"
        placement="right"
        size="md"
      >
        <Drawer.Body>
          <p>Panel content goes here.</p>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => setOpen(false)}>Save</Button>
        </Drawer.Footer>
      </Drawer>
    </>
  );
}
```

### With i18n overrides

```tsx
<Drawer
  isOpen={open}
  onClose={close}
  title="Configuración"
  i18nStrings={{ closeLabel: 'Cerrar', drawerLabel: 'Panel lateral' }}
>
  ...
</Drawer>
```

### Loading state

```tsx
<Drawer isOpen={open} onClose={close} title="Loading…" loading={true}>
  {/* children ignored while loading=true */}
</Drawer>
```

---

## Accessibility

**Semantic element:** `<div role="dialog" aria-modal="true">` rendered in a portal.

**ARIA attributes:**

| Attribute | Value | Condition |
|---|---|---|
| `role` | `"dialog"` | Always |
| `aria-modal` | `"true"` | Always |
| `aria-labelledby` | Points to `<h2>` title `id` | When `title` is provided |
| `aria-label` | `i18nStrings.drawerLabel` | When `title` is omitted |
| `aria-busy` | `"true"` | When `loading={true}` |

**Keyboard interaction:**

| Key | Behaviour |
|---|---|
| `Tab` | Moves focus to the next focusable element within the panel (trapped). |
| `Shift + Tab` | Moves focus to the previous focusable element within the panel. |
| `Escape` | Closes the drawer and returns focus to the trigger element. |

**Focus management:**
- Focus is trapped inside the panel while the drawer is open via `useFocusTrap`.
- Escape dismissal is handled by `useEscapeDismiss`.
- On close, focus returns to the element that triggered the drawer (browser default).

**Screen reader announcement:**
- The drawer is announced as "dialog" with its title when opened.
- When no title is present, the fallback `drawerLabel` string is used as `aria-label`.
- The close button has an explicit `aria-label` ("Close" by default, overrideable).

**Backdrop:**
- The backdrop element carries `aria-hidden="true"` — it is a visual affordance, not a semantic region.
- Clicking the backdrop calls `onClose` by default (`closeOnBackdropClick` prop).

---

## Tokens Used

| Token | Value | Purpose |
|---|---|---|
| `--drawer-backdrop-bg` | `var(--color-overlay-backdrop)` | Backdrop overlay colour |
| `--drawer-z-index` | `var(--layer-dialog)` | Stacking context |
| `--drawer-bg` | `var(--color-surface-raised)` | Panel background |
| `--drawer-border-color` | `var(--color-border-default)` | Panel border |
| `--drawer-border-width` | `var(--border-container)` | Panel border width |
| `--drawer-radius` | `var(--radius-component-lg)` | Inner corner radius |
| `--drawer-width-sm/md/lg/xl` | `var(--size-overlay-sm/md/lg/xl)` | Left/right widths |
| `--drawer-height-sm/md/lg/xl` | `var(--size-overlay-height-sm/md/lg/xl)` | Top/bottom heights |
| `--drawer-header-px` | `var(--spacing-component-xl)` | Header horizontal padding |
| `--drawer-header-py` | `var(--spacing-component-lg)` | Header vertical padding |
| `--drawer-header-gap` | `var(--spacing-component-sm)` | Header title-to-button gap |
| `--drawer-header-border` | `var(--color-border-default)` | Header bottom border |
| `--drawer-title-color` | `var(--color-text-primary)` | Header title colour |
| `--drawer-body-px` | `var(--spacing-component-xl)` | Body horizontal padding |
| `--drawer-body-py` | `var(--spacing-component-lg)` | Body vertical padding |
| `--drawer-body-text-color` | `var(--color-text-secondary)` | Body text colour |
| `--drawer-footer-px` | `var(--spacing-component-xl)` | Footer horizontal padding |
| `--drawer-footer-py` | `var(--spacing-component-md)` | Footer vertical padding |
| `--drawer-footer-gap` | `var(--spacing-component-sm)` | Footer button gap |
| `--drawer-footer-border` | `var(--color-border-default)` | Footer top border |
| `--drawer-min-width` | `var(--content-min-width-md)` | Minimum panel width |
| `--drawer-title-overflow` | `var(--content-overflow-label)` | Title overflow mode |
| `--drawer-title-whitespace` | `var(--content-whitespace-label)` | Title whitespace mode |
| `--drawer-title-text-overflow` | `var(--content-text-overflow-label)` | Title text-overflow mode |
