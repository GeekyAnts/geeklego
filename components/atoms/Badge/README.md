# Badge

A non-interactive inline label used to communicate status, count, or categorical context. Badges are purely decorative — they convey supplementary information and must never be the sole mechanism for conveying critical state.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'solid' \| 'soft' \| 'outline' \| 'dot'` | `'solid'` | Visual treatment. `dot` renders a circle with no text. |
| `color` | `'default' \|| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Semantic color intent. |
| `size` | `'sm' \| 'md'` | `'md'` | Height and typography scale. sm = 16px, md = 24px. |
| `shape` | `'pill' \| 'rounded'` | `'pill'` | Border-radius style. |
| `dotLabel` | `string` | — | Required accessible label when `variant="dot"` (no visible text). |
| `children` | `ReactNode` | — | Badge text or content. Ignored when `variant="dot"`. |
| `...rest` | `HTMLAttributes<HTMLSpanElement>` | — | All native `<span>` attributes forwarded. |

---

## Tokens Used

| Token | Value |
|---|---|
| `--badge-height-sm` | `var(--spacing-4)` — 16px |
| `--badge-height-md` | `var(--spacing-6)` — 24px |
| `--badge-px-sm` | `var(--spacing-component-sm)` |
| `--badge-px-md` | `var(--spacing-component-md)` |
| `--badge-radius-pill` | `var(--radius-component-full)` |
| `--badge-radius-rounded` | `var(--radius-component-sm)` |
| `--badge-gap` | `var(--spacing-component-xs)` |
| `--badge-dot-size-sm` | `var(--spacing-raw-6)` — 6px |
| `--badge-dot-size-md` | `var(--spacing-raw-10)` — 10px |
| `--badge-solid-{color}-bg/text/border` | Per-color solid variant tokens |
| `--badge-soft-{color}-bg/text/border` | Per-color soft variant tokens |
| `--badge-outline-{color}-bg/text/border` | Per-color outline variant tokens |
| `--badge-dot-{color}-color` | Per-color dot fill |
| `--badge-label-overflow/whitespace/text-overflow` | Content flexibility |

**New semantic tokens introduced by Badge:**

| Token | Light | Dark | Brand |
|---|---|---|---|
| `--color-text-success` | `success-700` | `success-300` | `success-700` |
| `--color-text-warning` | `warning-700` | `warning-300` | `warning-700` |
| `--color-text-error` | `error-700` | `error-300` | `error-700` |
| `--color-text-info` | `brand-700` | `brand-300` | `brand-600` |
| `--color-status-success-subtle` dark override | — | `success-900` | — |
| `--color-status-warning-subtle` dark override | — | `warning-900` | — |
| `--color-status-error-subtle` dark override | — | `error-900` | — |
| `--color-status-info-subtle` dark override | — | `brand-900` | — |

---

## Variants

Each variant uses a fundamentally different visual strategy to communicate emphasis level:

| Variant | Strategy | When to use |
|---|---|---|
| `solid` | Filled colored background + inverse text | High-emphasis status, counts, notifications |
| `soft` | Tinted subtle background + darker status text | Medium-emphasis labels, categories, filters |
| `outline` | Transparent + colored border + status text | Low-emphasis, inline in text, tags |
| `dot` | Small filled circle, no text | Online indicators, notification presence |

---

## Colors

| Color | Semantic meaning |
|---|---|
| `default` | Neutral — no semantic intent |
| `success` | Positive outcome, active state |
| `warning` | Needs attention, degraded state |
| `error` | Critical issue, failed state |
| `info` | Informational, in-progress |

---

## Sizes

| Size | Height | Typography | Use |
|---|---|---|---|
| `sm` | 16px | `text-button-xs` | Compact lists, inline with small text |
| `md` | 24px | `text-button-sm` | Default use, inline with body text |

---

## Accessibility

**Semantic element:** `<span>` — inline, non-interactive. Badges are presentational and do not receive keyboard focus.

**Role:** No explicit role for text badges — content is read inline. Dot badges get `role="status"` + `aria-label` when a `dotLabel` is provided.

**Screen reader behaviour:**

| Scenario | What to do |
|---|---|
| Text badge ("Active", "12") | No extra ARIA needed — text is read inline |
| Count badge used alongside a label | Add `aria-label="12 unread messages"` to provide context |
| Dot badge (no visible text) | Always provide `dotLabel` — this becomes `aria-label` on the element |
| Badge showing critical state | Never rely on color alone — pair with text label or icon |

**Keyboard interaction:**

Badge is non-interactive and not focusable. It has no keyboard interaction.

| Key | Action |
|---|---|
| — | Not applicable — Badge is not focusable |

**WCAG 2.2 notes:**
- Color is never the sole differentiator — each variant also differs in border and text weight
- Dot badges without `dotLabel` produce an unlabelled element — always provide the prop
- Contrast ratios: `solid` uses `--color-text-inverse` on status backgrounds (checked); `soft` uses `--color-text-{status}` (700 in light, 300 in dark) on subtle backgrounds for AA compliance

---

## Usage

```tsx
import { Badge } from '@/components/atoms/Badge/Badge';

// Status label
<Badge variant="soft" color="success">Active</Badge>

// Count notification
<Badge variant="solid" color="error" aria-label="3 unread notifications">3</Badge>

// Inline with rounded shape (version tag)
<Badge variant="outline" color="default" shape="rounded">v2.0</Badge>

// Online indicator dot
<Badge variant="dot" color="success" dotLabel="Online" />

// Combined: label + dot
<div className="flex items-center gap-2">
  <Badge variant="dot" color="success" dotLabel="Online" />
  <span>John Doe</span>
</div>
```