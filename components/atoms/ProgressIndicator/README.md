# ProgressIndicator

A circular ring progress indicator that displays determinate progress (value / max) or an animated indeterminate state when progress is unknown. Complements the linear `ProgressBar` atom.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | `undefined` | Current value (0–max). Omit for indeterminate / spinning state. |
| `max` | `number` | `100` | Maximum value the progress can reach. |
| `variant` | `ProgressIndicatorVariant` | `'default'` | Color variant conveying semantic meaning. |
| `size` | `ProgressIndicatorSize` | `'md'` | Overall diameter of the ring. |
| `showValue` | `boolean` | `false` | Show computed percentage at the center. Only visible on `md`, `lg`, `xl`. |
| `label` | `string` | — | Accessible label (`aria-label`). Required for standalone usage. |
| `disabled` | `boolean` | `false` | Muted appearance + no animation. |
| `className` | `string` | — | Additional CSS classes merged onto the container. |

Accepts all standard `HTMLDivElement` attributes except `children`.

---

## Variants

| Variant | Fill color | Semantic use |
|---|---|---|
| `default` | `--color-action-primary` | Generic progress, uploads, loads |
| `success` | `--color-status-success` | Completed, healthy |
| `warning` | `--color-status-warning` | Approaching limit, degraded |
| `error` | `--color-status-error` | Failed, critical |

---

## Sizes

| Size | Diameter | Center label | Stroke (visual) |
|---|---|---|---|
| `xs` | 16px (1rem) | — | ~1.8px |
| `sm` | 24px (1.5rem) | — | ~2.3px |
| `md` | 40px (2.5rem) | ✓ (`text-label-xs`) | ~3.3px |
| `lg` | 64px (4rem) | ✓ (`text-label-sm`) | ~5.0px |
| `xl` | 80px (5rem) | ✓ (`text-label-md`) | ~5.6px |

---

## States

| State | Appearance | Notes |
|---|---|---|
| **Determinate** | Arc fills clockwise from 12 o'clock | Transitions smoothly when `value` changes |
| **Indeterminate** | 25% arc rotates continuously | `value` is `undefined` / `null` |
| **Complete** | Full ring (100%) | Pair with `variant="success"` for clear completion signal |
| **Disabled** | Muted track + fill, no animation | Use `disabled` prop |

---

## Tokens Used

```css
/* Size */
--progress-indicator-size-xs/sm/md/lg/xl

/* Track ring */
--progress-indicator-track-color          → --color-bg-tertiary
--progress-indicator-track-disabled       → --color-border-subtle

/* Fill arc */
--progress-indicator-fill-default         → --color-action-primary
--progress-indicator-fill-success         → --color-status-success
--progress-indicator-fill-warning         → --color-status-warning
--progress-indicator-fill-error           → --color-status-error
--progress-indicator-fill-disabled        → --color-text-disabled

/* Center label */
--progress-indicator-label-color          → --color-text-primary
--progress-indicator-label-color-disabled → --color-text-disabled

/* Animation */
--progress-indicator-spin-duration        → --duration-spin (700ms)

/* Content flexibility */
--progress-indicator-label-overflow
--progress-indicator-label-whitespace
--progress-indicator-label-text-overflow
```

---

## SVG Geometry

- Fixed `viewBox="0 0 36 36"` — scales proportionally to any CSS diameter.
- `r = 15.9155` → circumference ≈ 100 (simplifies dash-offset: `offset = 100 × (1 − pct/100)`).
- Stroke width in viewBox units (4.0 → 2.5, xs → xl) scales with the rendered size.
- Determinate arc rotated −90° so 0% starts at 12 o'clock.
- Indeterminate: 25% visible arc + CSS spin animation (`.progress-indicator-spin`) on the SVG.

---

## Accessibility

### Semantic element

`<div role="progressbar">` — no native circular progress element exists; `role="progressbar"` is the ARIA equivalent.

### ARIA attributes

| Attribute | Value | Notes |
|---|---|---|
| `role` | `"progressbar"` | Always present |
| `aria-valuenow` | `0–100` | Omitted in indeterminate state |
| `aria-valuemin` | `0` | Always `0` |
| `aria-valuemax` | `100` | Omitted in indeterminate state |
| `aria-valuetext` | `"65%"` | Human-readable percentage string |
| `aria-label` | Consumer-supplied | Required for standalone usage |
| `aria-busy` | `true` | Set when indeterminate (active loading) |
| `aria-disabled` | `true` | Set when `disabled` prop is true |

### Keyboard interaction

The progress indicator is not keyboard-interactive — it is a read-only status widget. No keyboard interaction is defined.

### Screen reader announcement

- **Determinate**: `"Upload progress, 65%, progressbar"` (label + valuetext + role)
- **Indeterminate**: `"Loading files, busy, progressbar"` (label + aria-busy + role)
- **Disabled**: `"Paused upload, dimmed, 40%, progressbar"` (label + aria-disabled + valuetext + role)

### Additional notes

- The `<svg>` carries `aria-hidden="true"` and `focusable="false"` — screen readers narrate the outer `<div>` container only.
- Provide a meaningful `label` whenever the indicator is used without a visible heading or caption.
- Use `variant="success"` to supplement `value={100}` — provides a second, non-color signal for completion.

---

## Usage

### Basic determinate

```tsx
import { ProgressIndicator } from '@geeklego/ui/components/atoms/ProgressIndicator';

<ProgressIndicator
  value={65}
  label="Upload progress"
/>
```

### With center percentage (md+)

```tsx
<ProgressIndicator
  value={72}
  size="lg"
  showValue
  label="Sync progress"
/>
```

### Indeterminate / loading state

```tsx
<ProgressIndicator
  size="md"
  label="Loading dashboard data"
/>
```

### Variants for semantic context

```tsx
<ProgressIndicator value={100} variant="success" label="Build complete" />
<ProgressIndicator value={90}  variant="warning" label="Storage almost full" />
<ProgressIndicator value={10}  variant="error"   label="Connection failing" />
```

### Disabled / paused state

```tsx
<ProgressIndicator value={45} disabled label="Upload paused" />
```

### All sizes

```tsx
<ProgressIndicator value={50} size="xs" label="xs" />
<ProgressIndicator value={50} size="sm" label="sm" />
<ProgressIndicator value={50} size="md" label="md" showValue />
<ProgressIndicator value={50} size="lg" label="lg" showValue />
<ProgressIndicator value={50} size="xl" label="xl" showValue />
```
