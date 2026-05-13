# Fieldset

A form-grouping molecule that wraps related controls in a semantically accessible `<fieldset>` + `<legend>` pair. Includes hint text, group-level error reporting, and a `disabled` state that cascades natively to all descendant form controls.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `legend` | `string` | **required** | Accessible group label rendered as `<legend>`. Announced by screen readers before each control in the group. |
| `variant` | `'default' \| 'boxed'` | `'default'` | Visual frame style. `boxed` adds a bordered container with padding. |
| `layout` | `'column' \| 'row'` | `'column'` | Direction child controls are stacked. |
| `gap` | `'sm' \| 'md' \| 'lg'` | `'md'` | Gap between child controls. |
| `hint` | `string` | — | Helper text shown below the legend. |
| `error` | `string` | — | Group-level validation error. Rendered with `role="alert"`. |
| `required` | `boolean` | `false` | Shows red asterisk + sr-only `(required)` text on the legend. |
| `disabled` | `boolean` | `false` | Disables the fieldset — all child form controls inherit this state natively. |
| `children` | `ReactNode` | **required** | Form controls to group (Input, Checkbox, Radio, Switch, etc.). |
| `i18nStrings` | `FieldsetI18nStrings` | — | Override localised system strings for this instance. |

All other `HTMLFieldSetElement` attributes (`form`, `name`, `id`, `className`, `data-*`, etc.) are forwarded.

---

## Tokens Used

| Token | Value | Purpose |
|---|---|---|
| `--fieldset-legend-text` | `var(--color-text-primary)` | Legend text colour |
| `--fieldset-legend-text-disabled` | `var(--color-text-disabled)` | Legend text colour when disabled |
| `--fieldset-required-color` | `var(--color-status-error)` | Required asterisk colour |
| `--fieldset-legend-gap` | `var(--spacing-component-xs)` | Gap between legend text and asterisk |
| `--fieldset-legend-mb` | `var(--spacing-component-sm)` | Margin below legend |
| `--fieldset-hint-text` | `var(--color-text-tertiary)` | Hint text colour |
| `--fieldset-hint-mb` | `var(--spacing-component-md)` | Margin below hint (before controls) |
| `--fieldset-error-text` | `var(--color-status-error)` | Error message colour |
| `--fieldset-error-mt` | `var(--spacing-component-xs)` | Margin above error (after controls) |
| `--fieldset-children-gap-sm/md/lg` | `var(--spacing-component-sm/md/lg)` | Gap between child controls |
| `--fieldset-border-color` | `var(--color-border-default)` | Boxed variant border colour |
| `--fieldset-border-color-error` | `var(--color-status-error)` | Boxed variant border colour in error state |
| `--fieldset-border-width` | `var(--border-width-hairline)` | Boxed variant border width (1px) |
| `--fieldset-radius` | `var(--radius-component-md)` | Boxed variant border radius |
| `--fieldset-padding` | `var(--spacing-component-xl)` | Boxed variant internal padding |

---

## Variants

### `default`

No visible border. Controls stack with consistent gap. Use for most forms where the grouping is implied by layout context.

```tsx
<Fieldset legend="Notification preferences" hint="Choose how you want to receive updates.">
  <Checkbox label="Email notifications" />
  <Checkbox label="SMS notifications" />
  <Checkbox label="Push notifications" />
</Fieldset>
```

### `boxed`

Bordered container with padding. Use when a form section needs clear visual separation or when displaying multiple fieldsets adjacent to each other.

```tsx
<Fieldset legend="Billing address" variant="boxed">
  <Input label="Street" placeholder="123 Main St" />
  <Input label="City" placeholder="London" />
</Fieldset>
```

---

## Sizes (gap)

| Gap | Token | Resolved |
|---|---|---|
| `sm` | `--fieldset-children-gap-sm` | 8px |
| `md` (default) | `--fieldset-children-gap-md` | 12px |
| `lg` | `--fieldset-children-gap-lg` | 16px |

---

## States

| State | Visual treatment |
|---|---|
| **Default** | Legend in primary text colour, no border (default) or hairline border (boxed) |
| **With hint** | Hint paragraph in tertiary text colour below legend |
| **Required** | Red asterisk (decorative) + sr-only `(required)` appended to legend |
| **Error** | Error paragraph in error colour below controls; `role="alert"` announces immediately; boxed border turns error colour |
| **Disabled** | Legend text shifts to disabled colour; all child controls disabled natively via `<fieldset disabled>` |

### Error example

```tsx
<Fieldset
  legend="Notification preferences"
  required
  error="Please select at least one notification method."
>
  <Checkbox label="Email" />
  <Checkbox label="SMS" />
</Fieldset>
```

---

## Layout

```tsx
{/* Vertical stack (default) */}
<Fieldset legend="Interests" layout="column" gap="md">
  <Checkbox label="Design" />
  <Checkbox label="Engineering" />
</Fieldset>

{/* Horizontal wrap — good for small controls like checkboxes */}
<Fieldset legend="Preferred days" layout="row" gap="lg">
  <Checkbox label="Monday" />
  <Checkbox label="Wednesday" />
  <Checkbox label="Friday" />
</Fieldset>
```

---

## Accessibility

### Semantic element

`<fieldset>` + `<legend>` is the WCAG 1.3.1 compliant pattern for grouping related form controls. Screen readers announce the legend text before each control's label, providing group context:

> "Shipping method group. Standard (5-7 days), radio button, 1 of 2."

### ARIA attributes

| Attribute | Applied to | Purpose |
|---|---|---|
| `aria-describedby` | `<fieldset>` | Links to `hint` and/or `error` paragraphs by ID |
| `role="alert"` | Error `<p>` | Triggers immediate SR announcement when error appears |
| `aria-hidden="true"` | Required `*` span | Hides decorative asterisk — sr-only span provides the accessible cue |
| `disabled` | `<fieldset>` | Natively disables all descendant form controls |

### Keyboard interaction

| Key | Behaviour |
|---|---|
| `Tab` | Moves focus to the next focusable control within the fieldset |
| `Shift + Tab` | Moves focus to the previous focusable control |
| `Arrow keys` | Navigate within a same-name radio group (native `<input type="radio">` behaviour) |

### Screen reader notes

- The `<legend>` text is announced as part of each control's accessible name — no additional `aria-label` is needed on the `<fieldset>`.
- When `error` appears, `role="alert"` causes the message to be announced immediately without the user navigating to it.
- `<fieldset disabled>` propagates the disabled state to all descendant `<input>`, `<select>`, `<textarea>`, and `<button>` elements natively — no manual `aria-disabled` threading required at the fieldset level.
- When using with a landmark region (e.g. `<form>` or `<section>`), the fieldset provides a sub-group within that landmark.

### Do not

- Do not use `<fieldset>` to group non-form content — use `<section>` or `<article>` instead.
- Do not nest fieldsets deeper than 2 levels (browser compatibility varies).

---

## i18n

### System strings

| Key | Default | When used |
|---|---|---|
| `required` | `"(required)"` | sr-only text appended to legend when `required={true}` |

### Override example

```tsx
<Fieldset
  legend="Notification preferences"
  required
  i18nStrings={{ required: '(champ obligatoire)' }}
>
  ...
</Fieldset>
```

---

## Usage

```tsx
import { Fieldset } from './components/molecules/Fieldset/Fieldset';
import { Radio } from './components/atoms/Radio/Radio';
import { Checkbox } from './components/atoms/Checkbox/Checkbox';

// Basic group
<Fieldset legend="Account type">
  <Radio name="account" label="Personal" value="personal" defaultChecked />
  <Radio name="account" label="Business" value="business" />
</Fieldset>

// With validation
<Fieldset
  legend="Contact methods"
  required
  hint="We need at least one way to reach you."
  error={errors.contactMethods}
>
  <Checkbox label="Email" name="contact-email" />
  <Checkbox label="Phone" name="contact-phone" />
</Fieldset>

// Boxed with row layout
<Fieldset legend="Working days" variant="boxed" layout="row" gap="lg">
  <Checkbox label="Mon" />
  <Checkbox label="Tue" />
  <Checkbox label="Wed" />
  <Checkbox label="Thu" />
  <Checkbox label="Fri" />
</Fieldset>
```