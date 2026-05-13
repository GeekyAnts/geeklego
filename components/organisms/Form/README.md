# Form

An L3 organism that wraps a native `<form>` element with compound slots for structured field layout and action alignment. Form provides `Form.Field` (label + control + hint + error) and `Form.Actions` (button row) as internal slots. All interactive controls are provided by consumers as children — Form itself does not render input elements.

---

## Import

```tsx
import { Form, FormField, FormActions } from '../../organisms/Form/Form';
// or via compound dot-notation
import { Form } from '../../organisms/Form/Form';
// <Form.Field> and <Form.Actions> are available as static properties
```

---

## Usage

### Basic stacked form

```tsx
<Form gap="md" onSubmit={(e) => { e.preventDefault(); /* submit */ }}>
  <Form.Field label="Email" htmlFor="email" required hint="We'll never share it.">
    <Input
      id="email"
      type="email"
      aria-required="true"
      aria-describedby="email-hint"
    />
  </Form.Field>

  <Form.Field label="Password" htmlFor="password" required>
    <Input id="password" type="password" aria-required="true" />
  </Form.Field>

  <Form.Actions align="end" separator>
    <Button type="button" variant="outline">Cancel</Button>
    <Button type="submit">Sign in</Button>
  </Form.Actions>
</Form>
```

### Inline label layout

```tsx
<Form gap="md">
  <Form.Field label="First name" htmlFor="fname" labelPosition="left" required>
    <Input id="fname" type="text" aria-required="true" />
  </Form.Field>

  <Form.Field label="Last name" htmlFor="lname" labelPosition="left">
    <Input id="lname" type="text" />
  </Form.Field>
</Form>
```

### Loading state

```tsx
<Form gap="md" loading={isSubmitting} onSubmit={handleSubmit}>
  {/* Wrap fields in Fieldset disabled to propagate disabled state to all controls */}
  <Fieldset legend="Account details" disabled={isSubmitting}>
    <Form.Field label="Name" htmlFor="name">
      <Input id="name" type="text" disabled={isSubmitting} />
    </Form.Field>
  </Fieldset>

  <Form.Actions align="end" separator>
    <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
      {isSubmitting ? 'Saving…' : 'Save'}
    </Button>
  </Form.Actions>
</Form>
```

### With validation errors

```tsx
<Form.Field
  label="Email"
  htmlFor="email"
  required
  error={errors.email}  // e.g. "Please enter a valid email address."
>
  <Input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined}
  />
</Form.Field>
```

> **ID convention:** `Form.Field` generates hint and error element IDs from `htmlFor`:
> - Hint element: `{htmlFor}-hint`
> - Error element: `{htmlFor}-error`
>
> Reference these in `aria-describedby` on the associated control for full WCAG 1.3.1 compliance.

---

## Props

### `Form`

| Prop | Type | Default | Description |
|---|---|---|---|
| `onSubmit` | `(e: FormEvent<HTMLFormElement>) => void` | — | Called on form submit. Call `e.preventDefault()` to handle submission. |
| `loading` | `boolean` | `false` | Sets `aria-busy="true"`. Wrap controls in `<Fieldset disabled>` to disable them. |
| `gap` | `'sm' \| 'md' \| 'lg'` | `'md'` | Vertical spacing between fields and actions. |
| `noValidate` | `boolean` | `true` | Disables browser constraint validation UI. Set `false` only for native validation. |
| `className` | `string` | — | Extra class names on the `<form>` element. |
| `children` | `ReactNode` | — | Form.Field blocks, Fieldset groups, and a Form.Actions row. |

All native `<form>` attributes are forwarded (except `onSubmit` — use the typed prop instead).

---

### `Form.Field`

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | **required** | Label text. Rendered via the Label atom with `htmlFor` association. |
| `htmlFor` | `string` | — | The `id` of the associated control. Drives hint/error element IDs. |
| `hint` | `string` | — | Helper text below the control. Hidden when `error` is present. |
| `error` | `string` | — | Validation error. Rendered with `role="alert"`. Replaces hint. |
| `required` | `boolean` | `false` | Asterisk (decorative) + sr-only "(required)" text on label. |
| `optional` | `boolean` | `false` | Visible "(Optional)" text on label. |
| `disabled` | `boolean` | `false` | Disabled text color on label. Does not propagate to children — use `<Fieldset disabled>` for group disabling. |
| `labelPosition` | `'top' \| 'left'` | `'top'` | `'top'` = stacked. `'left'` = inline (responsive — stacks on mobile). |
| `children` | `ReactNode` | **required** | The form control (Input, Select, Textarea, Checkbox, etc.). |
| `className` | `string` | — | Extra class names on the field wrapper. |

---

### `Form.Actions`

| Prop | Type | Default | Description |
|---|---|---|---|
| `align` | `'start' \| 'center' \| 'end' \| 'between'` | `'end'` | Horizontal alignment of buttons. |
| `gap` | `'sm' \| 'md'` | `'md'` | Gap between buttons. |
| `separator` | `boolean` | `false` | Top border above the actions row. |
| `children` | `ReactNode` | **required** | Action buttons. |
| `className` | `string` | — | Extra class names on the actions wrapper. |

---

## Tokens Used

```
--form-gap-sm / -md / -lg           gap between fields (sm: 12px, md: 24px, lg: 32px+)
--form-field-label-mb               label bottom margin in stacked layout
--form-field-inline-gap             label→control horizontal gap in inline layout
--form-field-label-pt-inline        label vertical offset in inline layout (desktop only)
--form-hint-color                   hint text color (tertiary)
--form-hint-mt                      hint top margin
--form-error-color                  error text color (error status)
--form-error-mt                     error top margin
--form-actions-gap-sm / -md         gap between action buttons
--form-actions-pt                   padding-top on actions row
--form-actions-border               actions separator border color
--form-min-width                    minimum form width (responsive protection)
--form-hint-lines                   max lines for hint text (2 lines)
--form-error-lines                  max lines for error text (1 line)
```

---

## Accessibility

### Semantic structure

- `<form noValidate>` — native form element. `noValidate` disables browser validation popups so custom errors render in `Form.Field`.
- Labels via `Label` atom — explicit `<label htmlFor>` association (WCAG 1.3.1).
- Errors use `role="alert"` — announced immediately on first appearance (WCAG 4.1.3).
- Required fields: `aria-required="true"` on the control + asterisk + sr-only "(required)" on label.
- Loading: `aria-busy="true"` on `<form>`.

### ARIA attributes

| Attribute | Element | When |
|---|---|---|
| `aria-busy="true"` | `<form>` | `loading={true}` |
| `aria-required="true"` | control | `required` field — set by consumer on the control |
| `aria-invalid="true"` | control | validation failed — set by consumer on the control |
| `aria-describedby` | control | points to `{htmlFor}-hint` and/or `{htmlFor}-error` |
| `role="alert"` | error `<p>` | always on error paragraph |

### ID convention for `aria-describedby`

`Form.Field` generates deterministic IDs from the `htmlFor` prop:

| Element | ID |
|---|---|
| Hint paragraph | `{htmlFor}-hint` |
| Error paragraph | `{htmlFor}-error` |

**Consumer responsibility:** Add `aria-describedby` to the control referencing these IDs.

```tsx
// ✅ Correct — full WCAG 1.3.1 + 1.3.3 compliance
<Form.Field label="Email" htmlFor="email" hint="Work email preferred." error={err}>
  <Input
    id="email"
    aria-describedby={[err ? 'email-error' : undefined, !err ? 'email-hint' : undefined]
      .filter(Boolean).join(' ')}
    aria-invalid={!!err}
  />
</Form.Field>
```

### Keyboard interaction

| Key | Behavior |
|---|---|
| `Tab` | Move focus between form controls |
| `Shift+Tab` | Move focus backwards |
| `Enter` | Submit form (when focus is on a text input or submit button) |
| `Space` | Check/uncheck checkboxes; activate buttons |
| `Arrow keys` | Navigate radio groups; increment sliders |

### Group disabling

Native `<fieldset disabled>` propagates `disabled` to all descendant form controls. Wrap fields in `<Fieldset disabled={loading}>` to bulk-disable during async operations — do not thread individual `disabled` props.

### Screen reader announcements

- `Form.Field` label: "Email address, required, edit text" (native input announcement + label)
- Error on validation: "Please enter a valid email address. alert" (role="alert" announces immediately)
- Loading: `aria-busy="true"` — some screen readers announce "busy" on the form element

---

## Notes on Validation

Form does not include built-in validation state management. Use with:
- **React Hook Form**: `register()` provides `id`, `aria-invalid`, `ref`; pass errors as `Form.Field error` prop
- **Zod / Yup**: validate on submit, map errors to `Form.Field error` props
- **Formik**: `getFieldProps()` provides id + value; `errors[name]` maps to `error` prop

For each field wired with a validation library, also ensure:
1. `id` on the control matches `htmlFor` on `Form.Field`
2. `aria-required="true"` on required controls
3. `aria-invalid="true"` on controls with errors
4. `aria-describedby` referencing `{id}-hint` / `{id}-error`
