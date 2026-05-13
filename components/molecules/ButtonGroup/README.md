# ButtonGroup

Groups two or more `Button` atoms into a single visually cohesive control — either **attached** (fused, shared borders) or **spaced** (separate with a gap). Both horizontal and vertical orientations are supported.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'attached' \| 'spaced'` | `'attached'` | `attached` — buttons share borders and joined radii. `spaced` — buttons keep individual radii and are separated by a gap. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout axis of the group. |
| `aria-label` | `string` | — | Accessible label for the `role="group"` container. Provide when no visible heading already identifies the group. |
| `className` | `string` | — | Additional classes on the container. |
| `children` | `ReactNode` | — | `Button` components to render inside the group. |

All other `HTMLDivElement` attributes (`id`, `data-*`, `aria-labelledby`, etc.) are forwarded to the container.

---

## Tokens Used

| Token | Value chain | Purpose |
|---|---|---|
| `--button-group-gap` | `→ --spacing-component-xs` (4 px) | Gap between buttons in `spaced` variant |
| `--button-group-divider-offset` | `calc(-1 × --border-hairline)` = −1 px | Collapses adjacent button borders in `attached` variant |
| `--button-group-radius` | `→ --radius-component-md` (6 px) | Outer radius applied to first/last button in an attached group |

---

## Variants

### `attached` (default)

Buttons are rendered with zero gap. Border radii are stripped from shared sides via injected `className` overrides so the group appears as one unified control.

- First button: keeps its inline-start radius (`rounded-e-none` removes the end)
- Middle buttons: `rounded-none` strips all radius
- Last button: keeps its inline-end radius (`rounded-s-none` removes the start)
- Overlapping borders collapse via a negative inline margin (`--button-group-divider-offset`). The focused/hovered button rises above its neighbour with `z-10` so its full ring is always visible.

> Works with any Button `variant`. `outline` and `secondary` variants produce the most visually distinct dividers. `primary` buttons fuse seamlessly with no visible internal divider (desired for unified CTA groups).

### `spaced`

Buttons retain their individual radii. A `--button-group-gap` gap separates them. Use for action pairs like "Cancel / Submit" where the buttons should feel related but independent.

---

## Orientations

| Orientation | Direction | Notes |
|---|---|---|
| `horizontal` (default) | Left — right | Logical properties used throughout — correct in both LTR and RTL layouts |
| `vertical` | Top — bottom | Block axis; `items-stretch` ensures buttons fill the full container width |

---

## Usage

```tsx
import { ButtonGroup } from '../molecules/ButtonGroup/ButtonGroup';
import { Button } from '../atoms/Button/Button';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

// Attached icon group — text alignment toolbar
<ButtonGroup aria-label="Text alignment">
  <Button variant="outline" leftIcon={<AlignLeft />} iconOnly>Align left</Button>
  <Button variant="outline" leftIcon={<AlignCenter />} iconOnly>Align centre</Button>
  <Button variant="outline" leftIcon={<AlignRight />} iconOnly>Align right</Button>
</ButtonGroup>

// Spaced action pair — dialog footer
<ButtonGroup variant="spaced" aria-label="Dialog actions">
  <Button variant="ghost">Cancel</Button>
  <Button variant="primary">Save changes</Button>
</ButtonGroup>

// Vertical attached group — sidebar actions
<ButtonGroup orientation="vertical" aria-label="View modes">
  <Button variant="secondary">List</Button>
  <Button variant="secondary">Grid</Button>
  <Button variant="secondary">Board</Button>
</ButtonGroup>
```

---

## Accessibility

**Semantic element:** `<div role="group">`

A `role="group"` container provides a named grouping landmark. Screen readers announce the group label when focus enters the container, giving users context for the set of buttons within.

### ARIA attributes

| Attribute | Value | Element | Notes |
|---|---|---|---|
| `role` | `"group"` | container `<div>` | Groups the buttons semantically |
| `aria-label` | consumer-supplied string | container `<div>` | Describes the purpose of the group — always provide |
| `aria-labelledby` | id reference | container `<div>` | Alternative to `aria-label` when a visible heading labels the group |

### Keyboard interaction

ButtonGroup does **not** implement roving tabindex or arrow-key navigation — that is appropriate for `role="toolbar"` composites. A `role="group"` is a simpler grouping; each button is individually focusable via `Tab`.

| Key | Behaviour |
|---|---|
| `Tab` | Moves focus to the next interactive button in the group (skips disabled buttons) |
| `Shift + Tab` | Moves focus to the previous interactive button |
| `Enter` / `Space` | Activates the focused button |

### Screen reader announcements

| State | VoiceOver / NVDA announcement |
|---|---|
| Entering group | "[aria-label] group" |
| Button focused | "[button label], button" |
| Disabled button | "[button label], dimmed, button" |
| Loading button | "[button label], busy, button" |

### Notes

- Icon-only buttons inside the group **must** use `iconOnly` + provide a string `children` to serve as the accessible `aria-label` on the `<button>`.
- Disabled buttons in the group remain in the DOM and are announced as "dimmed" — they are **not** removed from the accessibility tree.
- The `attached` radius injection uses CSS `rounded-*` logical and physical utilities; it does not affect the underlying `<button>` element's semantics or ARIA state.