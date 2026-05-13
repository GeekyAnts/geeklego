# ProgressBar

An L1 Atom that communicates task completion or loading state. Supports determinate progress (value-based) and indeterminate progress (animated, value unknown).

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number \| undefined` | `undefined` | Current progress (0–`max`). Omit for indeterminate state. |
| `max` | `number` | `100` | Maximum value the progress can reach. |
| `variant` | `'default' \| 'success' \| 'warning' \| 'error' \| 'neutral'` | `'default'` | Fill color signalling semantic meaning. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Track height (2px / 4px / 8px / 16px). |
| `rounded` | `boolean` | `true` | Pill-shaped (fully rounded) track and fill ends. |
| `label` | `string` | — | Accessible name (always used as `aria-label`; optionally rendered visually). |
| `showLabel` | `boolean` | `false` | Render the `label` string as visible text above the bar. |
| `showValue` | `boolean` | `false` | Render the computed percentage to the right of the label row. Hidden in indeterminate state. |
| `className` | `string` | — | Additional classes for the outer wrapper. |

All other `HTMLDivElement` attributes are forwarded to the outer wrapper div.

---

## Tokens Used

| Token | Value |
|---|---|
| `--progress-track-bg` | `var(--color-bg-tertiary)` |
| `--progress-track-radius` | `var(--radius-component-full)` |
| `--progress-fill-default` | `var(--color-action-primary)` |
| `--progress-fill-success` | `var(--color-status-success)` |
| `--progress-fill-warning` | `var(--color-status-warning)` |
| `--progress-fill-error` | `var(--color-status-error)` |
| `--progress-fill-neutral` | `var(--color-text-tertiary)` |
| `--progress-label-color` | `var(--color-text-secondary)` |
| `--progress-value-color` | `var(--color-text-secondary)` |
| `--progress-height-xs` | `var(--spacing-raw-2)` — 2px |
| `--progress-height-sm` | `var(--spacing-1)` — 4px |
| `--progress-height-md` | `var(--spacing-2)` — 8px |
| `--progress-height-lg` | `var(--spacing-4)` — 16px |

---

## Variants

| Variant | Fill color | When to use |
|---|---|---|
| `default` | Action primary | General-purpose loading, uploads, neutral tasks |
| `success` | Status success (green) | Completed tasks, verified processes |
| `warning` | Status warning (amber) | Near-full storage, expiring resources |
| `error` | Status error (red) | Failed operations, validation thresholds exceeded |
| `neutral` | Text tertiary (grey) | Background tasks without semantic urgency |

---

## Sizes

| Size | Track height | When to use |
|---|---|---|
| `xs` | 2px | Extremely subtle progress indicator, page load bars |
| `sm` | 4px | Compact contexts, table rows, dense UI |
| `md` | 8px | Default — standard form and card usage |
| `lg` | 16px | High-visibility progress, onboarding flows |

---

## States

| State | How to trigger |
|---|---|
| **0%** | `value={0}` |
| **Partial** | `value={1–99}` |
| **Complete** | `value={100}` (pair with `variant="success"`) |
| **Indeterminate** | Omit `value` or pass `undefined` |
| **With label** | `showLabel={true}` + `label="..."` |
| **With value** | `showValue={true}` (hidden in indeterminate mode) |
| **Squared ends** | `rounded={false}` |

---

## Accessibility

**Semantic element:** `<div role="progressbar">`

There is no native HTML element for a progress indicator that supports both determinate and indeterminate states with custom styling. `<div role="progressbar">` is the correct ARIA pattern.

**ARIA attributes:**

| Attribute | Value |
|---|---|
| `role` | `"progressbar"` |
| `aria-valuenow` | Rounded percentage (e.g. `60`). Omitted in indeterminate state. |
| `aria-valuemin` | `0` |
| `aria-valuemax` | `100` (or omitted in indeterminate state) |
| `aria-valuetext` | Human-readable string e.g. `"60%"`. Omitted in indeterminate state. |
| `aria-label` | The `label` prop value — provides an accessible name for the progress bar. |
| `aria-busy` | `true` when indeterminate (signals ongoing work to assistive technology). Omitted otherwise. |

**Visual label and value text:**
When `showLabel` and/or `showValue` are true, the rendered text elements carry `aria-hidden="true"` — the semantic information is already conveyed via the ARIA attributes on the `role="progressbar"` element. This prevents double-announcement by screen readers.

**Keyboard interaction:**
ProgressBar is a non-interactive indicator. It does not receive keyboard focus and has no keyboard interaction.

**Screen reader announcement:**
- Determinate: *"Loading progress, 60%"* (combines `aria-label` + `aria-valuetext`)
- Indeterminate: *"Processing, please wait"* + busy signal (combines `aria-label` + `aria-busy="true"`)

**Reduced motion:**
The indeterminate sliding animation is automatically suppressed for users who have `prefers-reduced-motion: reduce` enabled, via the global `animation-duration: 0.01ms !important` rule in `geeklego.css`.

---

## Usage

```tsx
import { ProgressBar } from '@/components/atoms/ProgressBar/ProgressBar';

// Determinate
<ProgressBar value={72} label="File upload" />

// Determinate with visible label and value
<ProgressBar
  value={72}
  label="Uploading files"
  showLabel
  showValue
  variant="default"
  size="md"
/>

// Success at completion
<ProgressBar value={100} variant="success" label="Upload complete" showLabel showValue />

// Indeterminate (value unknown)
<ProgressBar label="Processing, please wait…" showLabel />

// Warning — storage filling up
<ProgressBar value={88} variant="warning" label="Storage 88% full" showLabel showValue />

// Error
<ProgressBar value={42} variant="error" label="Upload failed" showLabel showValue />

// Squared ends (e.g. full-width page loader)
<ProgressBar value={60} rounded={false} label="Page loading" size="xs" />
```