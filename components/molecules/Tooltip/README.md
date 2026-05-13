# Tooltip

An accessible, floating text panel that appears on hover and focus of a trigger element. Dismisses on mouse leave, blur, or Escape key.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `content` | `ReactNode` | **required** | Tooltip panel content. Strings are most common; ReactNode allows icon + text. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position of the panel relative to the trigger. |
| `delayMs` | `number` | `300` | Delay (ms) before showing on mouse hover. Focus-triggered tooltips appear immediately. |
| `disabled` | `boolean` | `false` | When `true`, suppresses the tooltip entirely. |
| `children` | `ReactNode` | **required** | Trigger element. Should be a single focusable element. |
| `i18nStrings` | `TooltipI18nStrings` | — | Override system-generated strings for i18n. |
| `className` | `string` | — | Additional class applied to the outer `<span>` wrapper. |

---

## Tokens Used

| Token | References | Description |
|---|---|---|
| `--tooltip-bg` | `--color-surface-overlay` | Panel background — inverted across themes |
| `--tooltip-text` | `--color-text-inverse` | Panel text — inverted across themes |
| `--tooltip-shadow` | `--shadow-lg` | Elevation shadow (overlays always float) |
| `--tooltip-radius` | `--radius-component-sm` | Panel corner radius |
| `--tooltip-z` | `--z-index-tooltip` | Stacking context (600) |
| `--tooltip-px` | `--spacing-component-md` | Horizontal panel padding |
| `--tooltip-py` | `--spacing-component-xs` | Vertical panel padding |
| `--tooltip-offset` | `--spacing-component-xs` | Gap between trigger and panel |
| `--tooltip-max-width` | `--content-max-width-overlay-sm` | Maximum panel width (16rem / 256px) |

---

## Variants

The Tooltip has a single visual style — an inverted panel that floats above the page. The visual treatment adapts per theme:

| Theme | Background | Text | Shadow |
|---|---|---|---|
| Light | `neutral-900` (dark) | `neutral-0` (white) | `--shadow-lg` |
| Dark | `neutral-0` (light) | `neutral-900` (dark) | `--shadow-lg` |

The inversion ensures the tooltip panel always reads as a distinct floating layer regardless of the page theme.

---

## Placements

Four placement options position the panel relative to the trigger's bounding box, with a `--tooltip-offset` gap:

| Placement | Position |
|---|---|
| `top` (default) | Above the trigger, centred horizontally |
| `bottom` | Below the trigger, centred horizontally |
| `left` | Left of the trigger, centred vertically |
| `right` | Right of the trigger, centred vertically |

Placement is purely visual — there is no automatic flip or collision detection. Choose a placement that fits the UI layout.

---

## States

| State | Behaviour |
|---|---|
| Hidden | `opacity: 0`, `pointer-events: none`, `aria-hidden="true"` on panel |
| Hover-visible | Shows after `delayMs` (default 300ms). Hides on mouse leave. |
| Focus-visible | Shows immediately (no delay) on `focus` event. Hides on `blur`. |
| Escape-dismissed | Hides immediately when Escape key is pressed (via `useEscapeDismiss`). |
| Disabled | `disabled={true}` suppresses all tooltip behaviour. |

---

## Accessibility

### Semantic element
- Wrapper: `<span role="" class="relative inline-flex">` — layout only
- Panel: `<div role="tooltip" id="…">` — no native element; requires explicit role

### ARIA attributes

| Attribute | Element | Value |
|---|---|---|
| `aria-describedby` | Trigger (child) | Points to tooltip panel `id` — injected via `React.cloneElement` |
| `role="tooltip"` | Panel `<div>` | Declares the element as a tooltip |
| `id` | Panel `<div>` | Unique value generated with `useId()` |
| `aria-label` | Panel `<div>` | Falls back to `"Tooltip"` when content is non-textual |
| `aria-hidden` | Panel `<div>` | `"true"` when not visible — removes from a11y tree |

### Keyboard interaction

| Key | Action |
|---|---|
| `Tab` | Moves focus to the trigger; tooltip appears immediately |
| `Escape` | Dismisses the visible tooltip (via `useEscapeDismiss`) |
| `Shift+Tab` | Moves focus away from trigger; tooltip hides on `blur` |

### Screen reader behaviour
- When the trigger receives focus, the tooltip text is announced via `aria-describedby` after the trigger's own accessible name.
- If the trigger is an icon-only button, add `aria-label` directly to the button element. The tooltip then adds supplementary context via `aria-describedby`.
- The Tooltip does **not** trap focus — it is a non-interactive overlay.

### Minimum touch target
The Tooltip wrapper itself is not interactive. Touch targets are the responsibility of the trigger element (`children`). Ensure the trigger meets the 24×24px minimum.

---

## i18n

| Key | Default | Usage |
|---|---|---|
| `panelLabel` | `"Tooltip"` | `aria-label` on the panel `<div>` — read when content is non-textual (icons, custom nodes) |

```tsx
<Tooltip
  content={<StarIcon />}
  i18nStrings={{ panelLabel: 'Étoile — fonctionnalité Pro' }}
>
  <button aria-label="Pro feature">…</button>
</Tooltip>
```

---

## Usage

```tsx
import { Tooltip } from './Tooltip';

// Basic usage
<Tooltip content="Save your progress before leaving.">
  <button type="button">Save</button>
</Tooltip>

// Different placement
<Tooltip content="Opens in a new tab" placement="right">
  <a href="/docs" target="_blank" rel="noopener noreferrer">Documentation</a>
</Tooltip>

// Icon-only trigger
<Tooltip content="Filter results by date range">
  <button type="button" aria-label="Filter">
    <FilterIcon aria-hidden="true" />
  </button>
</Tooltip>

// No delay (e.g. secondary toolbars)
<Tooltip content="Bold text" delayMs={0}>
  <button type="button" aria-label="Bold">B</button>
</Tooltip>

// Disabled — suppresses tooltip when element is already self-describing
<Tooltip content="Submit form" disabled>
  <button type="submit">Submit</button>
</Tooltip>
```

---

## Design notes

- **Inverted palette** — the tooltip panel deliberately uses an inverted colour scheme (`--color-surface-overlay` / `--color-text-inverse`) so it reads as a distinct floating layer against any page background.
- **No arrows** — the offset gap between trigger and panel is sufficient orientation cue. Arrows add complexity for minimal clarity gain.
- **No auto-flip** — choose the placement that fits your layout. Collision detection (Floating UI) can be layered on top if needed.
- **Hover delay** — the default 300ms delay prevents tooltips from firing on accidental mouseovers. Focus-triggered tooltips have no delay (keyboard users require immediate feedback).