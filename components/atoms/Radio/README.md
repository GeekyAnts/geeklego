# Radio

A styled radio button atom that pairs a transparent native `<input type="radio">` with a custom circular visual indicator. Uses native radio group behaviour (grouped via the `name` attribute) and requires no custom keyboard handling.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Visual size of the indicator circle |
| `checked` | `boolean` | — | Controlled selected state |
| `defaultChecked` | `boolean` | — | Uncontrolled initial state |
| `error` | `boolean` | `false` | Marks the field invalid — shifts border to error colour |
| `disabled` | `boolean` | `false` | Disables interaction; mutes all visual states |
| `required` | `boolean` | `false` | Marks the field required for form validation |
| `name` | `string` | — | Groups radios; required for native group behaviour |
| `value` | `string` | — | Form submission value |
| `onChange` | `ChangeEventHandler<HTMLInputElement>` | — | Fired when selection changes |
| `children` | `ReactNode` | — | Label text. Omit and provide `aria-label` for label-less usage |
| `id` | `string` | auto | Input id; auto-generated via `useId()` if omitted |
| `className` | `string` | — | Added to the outer `<label>` wrapper |

All other `InputHTMLAttributes<HTMLInputElement>` props (except `type`) are forwarded to the native `<input>`.

---

## Tokens Used

```
--radio-bg                    Background colour (unselected)
--radio-bg-hover              Background on hover (unselected)
--radio-bg-checked            Background when selected
--radio-bg-checked-hover      Background on hover (selected)
--radio-bg-disabled           Background when disabled

--radio-border                Border colour (unselected)
--radio-border-hover          Border colour on hover
--radio-border-checked        Border colour when selected
--radio-border-checked-hover  Border colour on hover (selected)
--radio-border-disabled       Border colour when disabled
--radio-border-error          Border colour in error state

--radio-dot                   Inner dot fill colour when selected
--radio-dot-disabled          Inner dot fill colour when disabled

--radio-label-color           Label text colour
--radio-label-color-disabled  Label text colour when disabled

--radio-radius                Full-circle radius (var(--radius-component-full))
--radio-gap                   Gap between indicator and label

--radio-shadow                Elevation shadow (none in light/dark)
--radio-shadow-hover          Elevation shadow on hover
--radio-shadow-active         Inset shadow when pressed

--radio-size-sm/md/lg         Indicator circle diameter
--radio-dot-size-sm/md/lg     Inner dot diameter
```

---

## Sizes

| Size | Indicator | Dot |
|---|---|---|
| `sm` | 14 px | 6 px |
| `md` | 16 px | 6 px |
| `lg` | 20 px | 10 px |

---

## States

| State | Visual treatment |
|---|---|
| Default (unselected) | White/surface background, default border |
| Selected | Primary colour background, primary border, white dot |
| Hover (unselected) | Secondary background, strong border |
| Hover (selected) | Primary-hover background, primary-hover border |
| Focus-visible | Focus ring via `.focus-ring` on the indicator |
| Active/pressed | Inset shadow |
| Disabled | Muted background, subtle border, `cursor-not-allowed`, no hover response |
| Error | Error-colour border; selected state keeps primary background + error border |

---

## Variants

Radio has no named variants. Visual differentiation comes from the `size` prop and the `checked` / `error` / `disabled` state props.

---

## Usage

### Controlled group (recommended)

```tsx
const [plan, setPlan] = useState('pro');

<fieldset>
  <legend>Choose your plan</legend>
  {['free', 'pro', 'enterprise'].map((v) => (
    <Radio
      key={v}
      name="plan"
      value={v}
      checked={plan === v}
      onChange={() => setPlan(v)}
    >
      {v.charAt(0).toUpperCase() + v.slice(1)}
    </Radio>
  ))}
</fieldset>
```

### Uncontrolled

```tsx
<Radio name="newsletter" value="yes" defaultChecked>
  Subscribe to newsletter
</Radio>
```

### Label-less (icon-only context)

```tsx
<Radio
  name="select-all"
  value="all"
  checked={allSelected}
  onChange={handleSelectAll}
  aria-label="Select all rows"
/>
```

### With error and hint

```tsx
<Radio
  name="payment"
  value="card"
  checked={false}
  error
  onChange={() => {}}
  aria-describedby="payment-error"
>
  Credit card
</Radio>
<p id="payment-error" role="alert">
  Please select a payment method.
</p>
```

---

## Accessibility

### Semantic element

`<input type="radio">` — native radio semantics with built-in keyboard interaction and form participation. The visible circle indicator is `aria-hidden="true"`; assistive technology reads the native input only.

### ARIA attributes

| Attribute | When present | Value |
|---|---|---|
| `aria-required` | `required={true}` | `"true"` |
| `aria-invalid` | `error={true}` | `"true"` |
| `aria-describedby` | `error={true}` | ID of the error message element |

### Grouping

Radio buttons that represent mutually exclusive choices must share a `name` attribute. Wrap groups in `<fieldset>` + `<legend>` so screen readers announce the group name when the user enters the group.

### Keyboard interaction

| Key | Action |
|---|---|
| `Space` | Selects the focused radio (when unselected) |
| `ArrowDown` / `ArrowRight` | Moves focus to next radio in the group and selects it |
| `ArrowUp` / `ArrowLeft` | Moves focus to previous radio in the group and selects it |
| `Tab` | Moves focus out of the radio group |

Arrow-key navigation between radios is handled natively by the browser via the shared `name` attribute — no JavaScript is needed.

### Touch target

The indicator wrapper carries `.touch-target`, which expands the hit area to — 24 × 24 px via an `::after` pseudo-element, satisfying WCAG 2.5.8 Minimum Target Size.

### Screen reader announcement

> "Option label, radio button, N of N" (browser/OS dependent)

The browser appends group position and total count automatically when radios share a `name`.