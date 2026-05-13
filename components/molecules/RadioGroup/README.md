# RadioGroup

A single-select group of radio buttons rendered inside a semantic `<fieldset>` + `<legend>` pair. Composes `Radio` atoms and supports controlled and uncontrolled usage, vertical or horizontal layout, and optional boxed container styling.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `RadioGroupOption[]` | — | **Required.** Radio options to render. |
| `value` | `string` | — | Controlled selected value. |
| `defaultValue` | `string` | — | Initial value for uncontrolled mode. |
| `onChange` | `(value: string) => void` | — | Called with the selected option's value when selection changes. |
| `name` | `string` | auto | Shared name attribute for all radios. Auto-generated when omitted. |
| `legend` | `ReactNode` | — | Group label rendered as a `<legend>`. Strongly recommended for accessibility. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Direction the options are laid out. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of each Radio indicator and label. |
| `variant` | `'default' \| 'boxed'` | `'default'` | `'boxed'` draws a bordered container around the group. |
| `error` | `boolean` | `false` | Error state — shifts Radio indicators to error colour. |
| `required` | `boolean` | `false` | Marks all options as required. Appends SR-only "(required)" to the legend. |
| `hint` | `string` | — | Helper text shown below options. Hidden when `errorMessage` is visible. |
| `errorMessage` | `string` | — | Error message shown when `error=true`. |
| `disabled` | `boolean` | `false` | Disables all options. |
| `i18nStrings` | `RadioGroupI18nStrings` | — | Per-instance string overrides. |

### RadioGroupOption

| Field | Type | Description |
|-------|------|-------------|
| `value` | `string` | Unique value identifier. |
| `label` | `ReactNode` | Label text or element shown alongside the indicator. |
| `disabled` | `boolean` | Disables this individual option. |

## Tokens Used

| Token | Purpose |
|-------|---------|
| `--radiogroup-gap-{sm\|md\|lg}` | Gap between options per size |
| `--radiogroup-legend-mb` | Space between legend and first option |
| `--radiogroup-legend-text` | Legend text colour |
| `--radiogroup-required-color` | Required asterisk colour |
| `--radiogroup-hint-color` | Hint text colour |
| `--radiogroup-error-color` | Error text colour |
| `--radiogroup-border` | Boxed variant border colour |
| `--radiogroup-border-error` | Boxed variant error border colour |
| `--radiogroup-radius` | Boxed variant border radius |
| `--radiogroup-padding` | Boxed variant inner padding |

## Variants

| Variant | Description |
|---------|-------------|
| `default` | No container — options float directly in the layout |
| `boxed` | Bordered container wraps all options |

## Sizes

| Size | Radio indicator |
|------|----------------|
| `sm` | 14px indicator |
| `md` | 16px indicator |
| `lg` | 20px indicator |

## States

| State | Behaviour |
|-------|-----------|
| Default | All options interactive |
| Error | Radio indicators shift to error colour; `errorMessage` rendered with `role="alert"` |
| Disabled (group) | All options muted and non-interactive via native `<fieldset disabled>` |
| Disabled (option) | Individual option muted; rest remain interactive |
| Required | SR-only "(required)" appended to legend; `*` visible marker |

## Accessibility

- **Element**: `<fieldset>` with `<legend>` — provides correct grouping semantics natively
- **Role**: implicit `group` from `<fieldset>` — no explicit `role` needed
- **Keyboard**: Tab to enter group; Arrow keys navigate between options (native browser behaviour)
- **Error**: `role="alert"` on error paragraph ensures screen reader announcement on change
- **Required**: `aria-required` on `<fieldset>`; SR-only text appended to legend
- **Disabled**: `disabled` attribute on `<fieldset>` disables all children natively
- **Screen reader**: Each option announced as "Option label, radio button, N of M, Group name"

## Usage

```tsx
import { RadioGroup } from '@geeklego/ui';

// Controlled
const [plan, setPlan] = useState('pro');

<RadioGroup
  legend="Select a plan"
  options={[
    { value: 'starter', label: 'Starter' },
    { value: 'pro', label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise' },
  ]}
  value={plan}
  onChange={setPlan}
/>

// With boxed container and error state
<RadioGroup
  legend="Billing cycle"
  variant="boxed"
  options={[
    { value: 'monthly', label: 'Monthly' },
    { value: 'annual', label: 'Annual (save 20%)' },
  ]}
  error
  errorMessage="Please select a billing cycle."
  required
/>

// Horizontal layout
<RadioGroup
  legend="Notification frequency"
  orientation="horizontal"
  options={[
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'never', label: 'Never' },
  ]}
  value="weekly"
  onChange={setFrequency}
/>
```
