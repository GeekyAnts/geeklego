# Slider

A range input component that lets users select a numeric value by dragging a thumb along a track. Built on the native `<input type="range">` element for full keyboard support and semantic accessibility with no JavaScript keyboard hooks required.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `min` | `number` | `0` | Minimum selectable value. |
| `max` | `number` | `100` | Maximum selectable value. |
| `step` | `number` | `1` | Increment between values. Supports decimals (e.g. `0.5`). |
| `value` | `number` | — | Controlled current value. Pair with `onChange`. |
| `defaultValue` | `number` | `min` | Initial value for uncontrolled usage. |
| `onChange` | `(value: number) => void` | — | Called with the new value on every change. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Track height and thumb size scale. |
| `disabled` | `boolean` | `false` | Disables interaction and mutes visual appearance. |
| `label` | `string` | — | Visible label rendered above the track. Provides the accessible name via `aria-labelledby`. |
| `showValue` | `boolean` | `false` | Renders the current numeric value to the right of the label row. |
| `className` | `string` | — | Additional class names on the outermost wrapper `<div>`. |

Any additional props (e.g. `aria-label`, `id`, `name`) are forwarded to the underlying `<input type="range">` element.

---

## Sizes

| Size | Track height | Thumb size | Use when |
|---|---|---|---|
| `sm` | 2px | 14px | Dense UIs, secondary controls, small panels |
| `md` | 4px | 16px | Default — most contexts |
| `lg` | 8px | 20px | Featured controls, large touch targets, emphasis |

---

## States

| State | How to trigger | Visual treatment |
|---|---|---|
| Default | Render normally | Primary-colored fill + muted track |
| Hover | Mouse over | Fill + track both shift one step darker; thumb shadow lifts |
| Focus-visible | Tab to focus | Wrapper ring via `focus-within:focus-ring` |
| Disabled | `disabled` prop | Fill and track both muted to disabled color; `cursor: not-allowed` |

---

## Tokens Used

| Token | Role |
|---|---|
| `--slider-track-bg` | Track unfilled portion (default) |
| `--slider-track-bg-hover` | Track unfilled portion (hover) |
| `--slider-track-bg-disabled` | Track (disabled) |
| `--slider-track-radius` | Track and thumb border-radius |
| `--slider-track-height-{sm\|md\|lg}` | Visual track height per size |
| `--slider-fill-color` | Filled track portion (default) |
| `--slider-fill-color-hover` | Filled track portion (hover) |
| `--slider-fill-color-disabled` | Filled track portion (disabled) |
| `--slider-thumb-size-{sm\|md\|lg}` | Thumb diameter per size |
| `--slider-thumb-bg` | Thumb surface color |
| `--slider-thumb-border` | Thumb border color |
| `--slider-thumb-border-disabled` | Thumb border (disabled) |
| `--slider-thumb-border-width` | Thumb border thickness |
| `--slider-thumb-shadow` | Thumb shadow (resting) |
| `--slider-thumb-shadow-hover` | Thumb shadow (hover) |
| `--slider-label-color` | Label text color |
| `--slider-label-color-disabled` | Label text color (disabled) |
| `--slider-value-color` | Value display text color |
| `--slider-value-color-disabled` | Value display text color (disabled) |
| `--slider-gap` | Gap between label row and track |

**Shadow tokens:** `--slider-thumb-shadow` — `--shadow-sm`; `--slider-thumb-shadow-hover` — `--shadow-md` (elevation at rest, lifts on hover).

---

## Usage

### Basic

```tsx
import { Slider } from '../components/atoms/Slider/Slider';

<Slider label="Volume" defaultValue={40} />
```

### With value display

```tsx
<Slider label="Brightness" defaultValue={65} showValue />
```

### Controlled

```tsx
const [volume, setVolume] = useState(50);

<Slider
  label="Volume"
  value={volume}
  onChange={setVolume}
  showValue
/>
```

### Custom range and step

```tsx
<Slider
  label="Temperature (°C)"
  min={16}
  max={30}
  step={0.5}
  defaultValue={22}
  showValue
/>
```

### Disabled

```tsx
<Slider label="Locked" defaultValue={50} disabled />
```

### All sizes

```tsx
<Slider size="sm" label="Small" defaultValue={60} />
<Slider size="md" label="Medium" defaultValue={60} />
<Slider size="lg" label="Large" defaultValue={60} />
```

---

## Accessibility

**Semantic element:** `<input type="range">` — has implicit `role="slider"` with all required ARIA semantics (min, max, step, value, disabled) handled natively by the browser.

| ARIA attribute | Value | Why |
|---|---|---|
| `aria-labelledby` | `{labelId}` | Points to visible `<span>` when `label` prop is provided |
| `aria-label` | caller-provided | Required when no `label` prop is used |
| `aria-valuemin` | `min` | Explicit announcement of minimum |
| `aria-valuemax` | `max` | Explicit announcement of maximum |
| `aria-valuenow` | `currentValue` | Current numeric value (announced on change) |
| `aria-valuetext` | `String(currentValue)` | Human-readable value text (extensible for named steps) |
| `aria-disabled` | `true` when disabled | Communicates disabled state to AT alongside native `disabled` |

**Focus ring:** A `focus-within:focus-ring` class on the wrapper `<div>` provides a consistent cross-browser focus indicator. The `<input>` itself has `outline: none` in the CSS rules block; the wrapper shows the design system ring instead.

**Touch target:** The wrapper `<div>` has `min-h-[var(--size-component-xs)]` (24px) to ensure the WCAG 2.5.8 minimum touch target is met even for the `sm` size (14px thumb), since the thumb is a CSS pseudo-element and cannot directly receive a touch-target class.

**Value display:** The `showValue` span carries `aria-hidden="true"` — the real value is communicated to assistive technology via `aria-valuenow` and `aria-valuetext`, not the visible display.

### Keyboard interaction

| Key | Action |
|---|---|
| `Tab` | Move focus to slider |
| `Shift+Tab` | Move focus away from slider |
| `ArrowRight` / `ArrowUp` | Increase value by `step` |
| `ArrowLeft` / `ArrowDown` | Decrease value by `step` |
| `Home` | Set to `min` |
| `End` | Set to `max` |
| `PageUp` | Increase by 10× `step` (browser default) |
| `PageDown` | Decrease by 10× `step` (browser default) |

All keyboard interactions are handled natively by the browser for `<input type="range">` — no custom keyboard hooks are used.

**Screen reader announcement on focus:**
> "[label], slider, [value], [min] to [max]"

**On value change:**
> "[new value]"