# NumberInput

A numeric entry control that wraps an `Input` atom between decrement (`−`) and increment (`+`) stepper buttons. The container owns all border and background styling while the inner input renders as unstyled — identical to the `InputGroup` pattern.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number \| string` | — | Controlled numeric value. |
| `min` | `number` | — | Minimum allowed value. Disables the decrement button at boundary. |
| `max` | `number` | — | Maximum allowed value. Disables the increment button at boundary. |
| `step` | `number` | `1` | Amount to increment or decrement per button press. |
| `variant` | `'default' \| 'filled' \| 'flushed' \| 'unstyled'` | `'default'` | Visual style variant. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and typography scale. |
| `error` | `boolean` | `false` | Error state — red border and `aria-invalid`. |
| `disabled` | `boolean` | `false` | Disables both the input and both stepper buttons. |
| `onChange` | `ChangeEventHandler<HTMLInputElement>` | — | Standard input change handler. |
| `wrapperClassName` | `string` | — | Additional class names for the outer container. |
| `i18nStrings` | `NumberInputI18nStrings` | — | Per-instance string overrides (button labels). |

## Tokens Used

| Token | Purpose |
|-------|---------|
| `--number-input-radius` | Container border radius |
| `--number-input-border` | Default border colour |
| `--number-input-border-hover` | Border colour on hover |
| `--number-input-border-focus` | Border colour when inner input is focused |
| `--number-input-border-error` | Border colour in error state |
| `--number-input-border-disabled` | Border colour when disabled |
| `--number-input-bg` | Container background |
| `--number-input-bg-hover` | Container background on hover |
| `--number-input-btn-bg` | Stepper button background |
| `--number-input-btn-bg-hover` | Stepper button background on hover |
| `--number-input-btn-bg-active` | Stepper button background when pressed |
| `--number-input-btn-color` | Stepper button icon colour |
| `--number-input-btn-color-hover` | Stepper button icon colour on hover |
| `--number-input-btn-width-{sm\|md\|lg}` | Stepper button width per size |

## Variants

Matches `Input` atom variants. The container adopts the same visual strategy as `InputGroup`.

| Variant | Description |
|---------|-------------|
| `default` | Outlined border at rest |
| `filled` | Filled background, border appears on focus |
| `flushed` | Bottom border only — no radius |
| `unstyled` | No border, no background |

## States

| State | Behaviour |
|-------|-----------|
| At `min` | Decrement button becomes `disabled` + `aria-disabled` |
| At `max` | Increment button becomes `disabled` + `aria-disabled` |
| Error | Red border; inner input gets `aria-invalid` |
| Disabled | All interactive elements disabled via native attributes |

## Accessibility

- **Element**: `<div>` container with two `<button>` stepper controls flanking a native `<input type="number">`
- **Button labels**: `aria-label` reads from `i18nStrings.decrementLabel` / `incrementLabel` (defaults: "Decrease value" / "Increase value")
- **Button aria-controls**: points to the inner input's id
- **Boundary buttons**: `disabled` + `aria-disabled="true"` when value is at `min` or `max`
- **Error**: `aria-invalid="true"` on inner input; pair with `aria-describedby` pointing to an error message element
- **Keyboard**: Tab → decrement button → Tab → input → Tab → increment button

## Usage

```tsx
import { NumberInput } from '@geeklego/ui';

// Controlled
const [qty, setQty] = useState(1);

<NumberInput
  value={qty}
  min={1}
  max={99}
  onChange={(e) => setQty(Number(e.target.value))}
  aria-label="Quantity"
/>

// With error
<NumberInput
  value={qty}
  min={1}
  error={qty < 1}
  aria-label="Quantity"
  aria-describedby="qty-error"
/>
<span id="qty-error">At least 1 required.</span>
```
