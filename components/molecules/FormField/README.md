# FormField

A form-field wrapper that associates a Label with any form control, plus optional hint text and error messaging. Use standalone or inside a `<Form>` organism.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | **Required.** Human-readable label text. |
| `htmlFor` | `string` | — | The `id` of the associated control. Drives `<label htmlFor>` and deterministic hint/error IDs. |
| `hint` | `string` | — | Helper text below the control. Hidden when `error` is present. |
| `error` | `string` | — | Validation error. Rendered with `role="alert"` for immediate SR announcement. |
| `required` | `boolean` | `false` | Shows red asterisk + sr-only "(required)" via Label. |
| `optional` | `boolean` | `false` | Shows "(Optional)" in secondary color via Label. |
| `disabled` | `boolean` | `false` | Applies disabled text color to the label. |
| `labelPosition` | `'top' \| 'left'` | `'top'` | Label placement. `'left'` = inline layout (stacks on mobile). |
| `size` | `'sm' \| 'md'` | `'md'` | Label typography scale. `'sm'` = 12px, `'md'` = 14px. |
| `children` | `ReactNode` | — | The form control (Input, Select, Textarea, Checkbox, etc.). |
| `i18nStrings` | `FormFieldI18nStrings` | — | Per-instance overrides for system strings (see i18n section below). |
| `className` | `string` | — | Additional classes on the wrapper `<div>`. |

Also accepts all native `<div>` HTML attributes via spread.

## i18n Strings (`FormFieldI18nStrings`)

| Key | Default | Description |
|---|---|---|
| `required` | `"(required)"` | Text shown as sr-only on the label when `required={true}`. |
| `optional` | `"(Optional)"` | Text shown in secondary color on the label when `optional={true}`. |

---

## Tokens Used

| Token | Purpose |
|---|---|
| `--formfield-label-mb` | Label bottom margin in stacked layout |
| `--formfield-inline-gap` | Label → control horizontal gap in inline layout |
| `--formfield-label-pt-inline` | Label vertical offset in inline layout (desktop) |
| `--formfield-hint-color` | Hint text color |
| `--formfield-hint-mt` | Hint top margin |
| `--formfield-error-color` | Error text color |
| `--formfield-error-mt` | Error top margin |
| `--formfield-hint-lines` | Max lines for hint text (clamp) |
| `--formfield-error-overflow` | Error text overflow behavior |
| `--formfield-error-whitespace` | Error text whitespace behavior |
| `--formfield-error-text-overflow` | Error text-overflow (ellipsis) |

## Label Positions

| Position | Behavior |
|---|---|
| `top` (default) | Stacked — label above control. |
| `left` | Inline — label beside control on desktop, stacks on mobile (`sm:flex-row`). |

## Sizes

| Size | Label typography |
|---|---|
| `md` (default) | 14px medium (`.text-label-md`) |
| `sm` | 12px medium (`.text-label-sm`) |

## States

| State | Visual treatment |
|---|---|
| Default | Normal label color, hint visible below control. |
| Required | Red asterisk + sr-only "(required)" text on label. |
| Optional | "(Optional)" shown in secondary color on label. |
| Disabled | Muted label text color. Mirror on the control itself. |
| Error | Label turns error color. Error message replaces hint, announced via `role="alert"`. |

## Accessibility

### Semantic structure

- **Wrapper:** `<div>` — structural grouping (no semantic element for form-field wrapper per spec).
- **Label:** Renders via the `Label` atom → `<label>` with native `htmlFor` association.
- **Hint:** `<p>` with deterministic `id="{htmlFor}-hint"`.
- **Error:** `<p>` with `role="alert"` and `id="{htmlFor}-error"`.

### ARIA wiring (consumer responsibility)

FormField generates deterministic IDs for hint and error elements. The **consumer** must wire these to the control via `aria-describedby`:

```tsx
<FormField label="Email" htmlFor="email" hint="We keep it private." error={error}>
  <Input
    id="email"
    aria-describedby={error ? 'email-error' : 'email-hint'}
    aria-invalid={!!error}
    aria-required="true"
    required
  />
</FormField>
```

### Keyboard interaction

| Key | Behavior |
|---|---|
| Tab | Moves focus to the form control inside the field. |
| Click on label | Focuses the associated control (native `<label>` behavior). |

### Screen reader announcements

| Context | Announcement |
|---|---|
| Focus on control | Label text, then control role/state. |
| Required field | Label + "(required)" via sr-only span. |
| Optional field | Label + "(Optional)" visible text. |
| Hint present | Announced via `aria-describedby` pointing to hint `id`. |
| Error present | Immediately announced via `role="alert"` on error element. |
| Disabled | Conveyed via `aria-disabled` on the control. |

## Usage

### Basic field with hint

```tsx
import { FormField } from '../molecules/FormField/FormField';
import { Input } from '../atoms/Input/Input';

<FormField label="Email address" htmlFor="email" hint="We keep it private." required>
  <Input
    id="email"
    type="email"
    placeholder="you@example.com"
    required
    aria-required="true"
    aria-describedby="email-hint"
  />
</FormField>
```

### Field with error

```tsx
<FormField label="Username" htmlFor="username" error="Already taken." required>
  <Input
    id="username"
    defaultValue="admin"
    error
    aria-invalid="true"
    aria-describedby="username-error"
    required
    aria-required="true"
  />
</FormField>
```

### Inline label

```tsx
<FormField label="Role" htmlFor="role" labelPosition="left" optional>
  <Select
    id="role"
    options={[
      { value: 'admin', label: 'Admin' },
      { value: 'editor', label: 'Editor' },
    ]}
    placeholder="Choose a role"
  />
</FormField>
```

### Compact form (sm size)

```tsx
<FormField label="API key" htmlFor="api-key" size="sm">
  <Input id="api-key" size="sm" placeholder="sk-..." />
</FormField>
```
