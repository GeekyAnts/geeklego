# Label

**Level:** Atom (L1)
**Dependencies:** None

## Description

A form label atom wrapping the native `<label>` element. Supports two sizes, required/optional indicators, disabled and error color states, and single-line truncation. Fully token-driven with automatic light and dark theme support.

Use this component as the visible label for every form control (`<input>`, `<select>`, `<textarea>`, etc.) by pairing it via `htmlFor` + the control's `id`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `htmlFor` | `string` | — | Associates this label with a form control by its `id` (native `for` attribute) |
| `size` | `'sm' \| 'md'` | `'md'` | Typography scale |
| `required` | `boolean` | `false` | Shows a red asterisk (decorative) and `.sr-only "(required)"` for screen readers |
| `optional` | `boolean` | `false` | Shows `(Optional)` in secondary color, readable by screen readers |
| `disabled` | `boolean` | `false` | Applies disabled text color to mirror the associated control's disabled state |
| `hasError` | `boolean` | `false` | Applies error text color when the associated field has a validation error |
| `children` | `ReactNode` | — | Label text. Truncates to one line with ellipsis. |
| `className` | `string` | — | Additional CSS classes |

All other `LabelHTMLAttributes<HTMLLabelElement>` props are spread onto the `<label>` element.

## Tokens Used

| Token | Resolves to | Used for |
|---|---|---|
| `--label-text` | `--color-text-primary` | Default label text color |
| `--label-text-disabled` | `--color-text-disabled` | Disabled state text color |
| `--label-text-error` | `--color-status-error` | Error state text color |
| `--label-required-color` | `--color-action-primary` | Required asterisk color |
| `--label-optional-color` | `--color-text-secondary` | `(Optional)` text color |
| `--label-gap` | `--spacing-component-xs` | Gap between text, asterisk, and optional indicator |
| `--label-overflow` | `--content-overflow-label` | Overflow (hidden) |
| `--label-whitespace` | `--content-whitespace-label` | White-space (nowrap) |
| `--label-text-overflow` | `--content-text-overflow-label` | Text overflow style (ellipsis) |
| `--label-max-width` | `--content-max-width-label` | Maximum width before truncation |

## Sizes

| Size | Typography class | Font size | Weight |
|---|---|---|---|
| `md` (default) | `.text-label-md` | 14px | Medium (500) |
| `sm` | `.text-label-sm` | 12px | Medium (500) |

## States

| State | Visual change | Priority | How to trigger |
|---|---|---|---|
| Default | Primary text color | — | No props |
| Disabled | Muted text (`--label-text-disabled`) | Highest | `disabled` prop |
| Error | Error red text (`--label-text-error`) | Second | `hasError` prop |
| Required | Red asterisk + sr-only text | — | `required` prop |
| Optional | `(Optional)` in secondary color | — | `optional` prop |

**Priority:** `disabled` overrides `hasError` overrides default color.

## Accessibility

- Semantic `<label>` element — no `role` attribute needed (native association)
- `htmlFor` wires to the native `for` attribute, associating the label with a form control
- Required asterisk uses `aria-hidden="true"` — purely decorative visual cue
- A `.sr-only "(required)"` span provides the accessible text for screen readers
- The `(Optional)` text is inline and read directly by screen readers
- `disabled` and `hasError` change color only — they add no ARIA attributes to the label
- `aria-required="true"` belongs on the associated `<input>`, not the label
- `aria-invalid="true"` belongs on the associated `<input>`, not the label

### Keyboard Interaction

| Key | Action |
|---|---|
| (none) | Labels are non-interactive and receive no keyboard focus |

Clicking a label activates its associated form control (native browser behaviour via `htmlFor`/`id`). No JavaScript event handling required.

## Usage

```tsx
import { Label } from '../../atoms/Label/Label';

// Default
<Label htmlFor="email">Email address</Label>

// Required field
<Label htmlFor="password" required>Password</Label>

// Optional field
<Label htmlFor="bio" optional>Bio</Label>

// Error state (mirror hasError from the form field)
<Label htmlFor="username" hasError required>Username</Label>

// Disabled state (mirror disabled from the form control)
<Label htmlFor="readonly" disabled>Account ID</Label>

// Small size
<Label htmlFor="search" size="sm">Search</Label>

// Full form context — associate label + input via htmlFor/id
<div className="flex flex-col gap-[var(--spacing-component-xs)]">
  <Label htmlFor="email-input" required>Email address</Label>
  <input
    id="email-input"
    type="email"
    required
    aria-required="true"
  />
</div>
```