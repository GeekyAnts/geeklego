# DateInput

A labeled date field molecule. Composes the `Label` and `Input` atoms into a single accessible form-field group with built-in hint text and validation error display.

`DateInput` does **not** open a calendar popup — it renders `<input type="date">` and delegates the native date picker (or keyboard entry) to the browser. For a full calendar-based picker, see the planned `Datepicker` organism.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | **Required.** Label text shown above the input. |
| `hint` | `string` | `undefined` | Helper text shown below the input when no error is present. |
| `errorMessage` | `string` | `undefined` | Validation error message. Shown instead of hint; sets the input to its error state and announces via `role="alert"`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and typography scale. |
| `variant` | `'default' \| 'filled' \| 'flushed' \| 'unstyled'` | `'default'` | Visual style variant. |
| `isLoading` | `boolean` | `false` | Shows a spinner in the field and disables interaction. |
| `disabled` | `boolean` | `false` | Mutes the field and prevents interaction. Label also mirrors the disabled state. |
| `required` | `boolean` | `false` | Marks the field as required (asterisk on label, `aria-required` on input). |
| `id` | `string` | auto | ID for the underlying `<input>`. Auto-generated when omitted; label `htmlFor` is always kept in sync. |
| `min` | `string` | `undefined` | Minimum selectable date in `YYYY-MM-DD` format. |
| `max` | `string` | `undefined` | Maximum selectable date in `YYYY-MM-DD` format. |
| `defaultValue` | `string` | `undefined` | Uncontrolled initial value in `YYYY-MM-DD` format. |
| `value` | `string` | `undefined` | Controlled value in `YYYY-MM-DD` format. |
| `onChange` | `ChangeEventHandler<HTMLInputElement>` | `undefined` | Change handler; receives the native input event. |
| `wrapperClassName` | `string` | `undefined` | Class names applied to the outer wrapper `<div>`. Use to control width or layout position of the field group. |
| `className` | `string` | `undefined` | Class names forwarded to the underlying `<input>` element via `Input`. |
| `i18nStrings` | `DateInputI18nStrings` | `undefined` | Per-instance overrides for system strings (see i18n section below). |

All other native `<input>` props (excluding `type` and `size`) are forwarded to the underlying input element.

---

## i18n Strings (`DateInputI18nStrings`)

| Key | Default | Description |
|---|---|---|
| `placeholder` | `"MM/DD/YYYY"` | Placeholder text shown inside the input when empty. |
| `invalidDateMessage` | `"Please enter a valid date."` | Validation error message when the date format is invalid. |
| `requiredMessage` | `"Date is required."` | Validation error message when the field is required but empty. |

---

## Tokens Used

| Token | Purpose |
|---|---|
| `--date-input-gap` | Vertical spacing between label, input, and hint/error text |
| `--date-input-hint-text` | Color of hint text (`--color-text-tertiary`) |
| `--date-input-error-text` | Color of error text (`--color-status-error`) |
| `--date-input-hint-lines` | Max lines for hint text (2, via `--content-lines-description`) |
| `--date-input-error-lines` | Max lines for error text (2, via `--content-lines-description`) |

The visual states of the input control itself (borders, backgrounds, focus ring, shadows) are driven by `Input` atom tokens (`--input-*`).

---

## Variants

| Variant | Visual strategy |
|---|---|
| `default` | Outlined border at rest; border deepens on hover; focus border changes color |
| `filled` | Muted background, no visible border; focus reveals border and lightens background |
| `flushed` | Bottom border only, no radius — editorial/minimal feel |
| `unstyled` | No border, no background — blank slate for custom styling |

---

## Sizes

| Size | Height | Typography |
|---|---|---|
| `sm` | 32px | `text-body-sm` |
| `md` | 40px | `text-body-md` (default) |
| `lg` | 48px | `text-body-lg` |

---

## States

| State | How to trigger |
|---|---|
| Default | No special props |
| Error | `errorMessage="..."` — drives error border on Input, error text color on Label, `role="alert"` paragraph |
| Disabled | `disabled` — muted input and label, no hover/active response |
| Loading | `isLoading` — spinner in field, disabled interaction |
| Required | `required` — asterisk on label, `aria-required` on input |

---

## Accessibility

**Semantic element:** `<div>` wrapper (field group), `<label>`, `<input type="date">`, `<p>` for hint/error.

| Attribute | Location | Value |
|---|---|---|
| `htmlFor` | `<label>` | Matches `<input>` `id` (auto-generated or provided) |
| `aria-required` | `<input>` | `true` when `required` prop is set |
| `aria-disabled` | `<input>` | `true` when `disabled` or `isLoading` |
| `aria-invalid` | `<input>` | `"true"` when `errorMessage` is set (via `getErrorFieldProps`) |
| `aria-describedby` | `<input>` | Points to hint `<p>` when hint is shown; points to error `<p>` when error is set |
| `role="alert"` | error `<p>` | Announces error message immediately when it appears |
| `aria-busy` | `<input>` | `true` when `isLoading` |

### Keyboard interaction

| Key | Behaviour |
|---|---|
| `Tab` | Moves focus to the date input |
| `Shift+Tab` | Moves focus away from the date input |
| Arrow keys | Navigate date segments (day / month / year) within the native date picker |
| Number keys | Type a value into the focused date segment |
| `Delete` / `Backspace` | Clear the focused date segment |

Date keyboard navigation is handled natively by the browser's `<input type="date">` implementation — no custom key handling is required or added.

### Screen reader announcement

- **Label:** announced when the input receives focus (linked via `htmlFor`/`id`)
- **Hint:** read when the input receives focus (linked via `aria-describedby`)
- **Error:** announced immediately when it appears (`role="alert"`); also read when the input receives focus (`aria-describedby`)
- **Required:** Label appends an SR-only "(required)" text (via `Label` atom)

---

## Usage

### Basic

```tsx
import { DateInput } from './molecules/DateInput/DateInput';

<DateInput
  label="Date of birth"
  hint="Use the format MM/DD/YYYY"
/>
```

### Controlled with validation

```tsx
const [value, setValue] = useState('');
const [error, setError] = useState('');

const validate = (v: string) => {
  if (!v) return 'Date is required';
  if (new Date(v) < new Date()) return 'Date must be in the future';
  return '';
};

<DateInput
  label="Event date"
  value={value}
  onChange={(e) => {
    setValue(e.target.value);
    setError(validate(e.target.value));
  }}
  errorMessage={error}
  required
/>
```

### With date constraints

```tsx
<DateInput
  label="Appointment date"
  min="2026-01-01"
  max="2026-12-31"
  hint="Available dates: 2026 only"
/>
```

### Sizes and variants

```tsx
<DateInput label="Small field" size="sm" variant="filled" />
<DateInput label="Medium field" size="md" variant="default" />
<DateInput label="Large field" size="lg" variant="flushed" />
```