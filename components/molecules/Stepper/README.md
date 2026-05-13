# Stepper

A multi-step progress indicator that shows where the user is in a sequential flow. Supports horizontal and vertical orientations, numbered and dotted visual styles, and optional clickable step navigation.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `steps` | `StepItem[]` | — | **Required.** Ordered array of step data. |
| `activeStep` | `number` | `0` | 0-based index of the currently active step. Steps with `index < activeStep` are marked completed. |
| `variant` | `'numbered' \| 'dotted'` | `'numbered'` | Visual treatment. `numbered` shows step numbers, check, and error icons. `dotted` shows a minimal solid dot. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Circle size and label typography. |
| `onStepClick` | `(index: number) => void` | — | When provided, completed and active steps become clickable `<button>` elements. Upcoming steps are never clickable. |
| `i18nStrings` | `StepperI18nStrings` | — | Override SR-only and aria-label strings. |
| `className` | `string` | — | Extra classes applied to the `<ol>` container. |

### StepItem shape

| Field | Type | Description |
|---|---|---|
| `id` | `string` | **Required.** Unique stable key. |
| `label` | `string` | **Required.** Step label text. |
| `description` | `string` | Optional supporting text rendered below the label. |
| `status` | `'error'` | Marks this step as errored regardless of its position relative to `activeStep`. |

### StepperI18nStrings

| Key | Default | Description |
|---|---|---|
| `listLabel` | `"Steps"` | `aria-label` on the `<ol>` list container. |
| `completedLabel` | `"(Completed)"` | SR-only suffix on completed step indicators. |
| `errorLabel` | `"(Error)"` | SR-only suffix on error step indicators. |

---

## Tokens Used

| Token | Value |
|---|---|
| `--stepper-circle-size-sm/md/lg` | `--size-component-xs/sm/md` |
| `--stepper-dot-size-sm/md/lg` | `--spacing-2 / --spacing-raw-10 / --spacing-3` |
| `--stepper-circle-radius` | `--radius-component-full` |
| `--stepper-circle-bg` | `transparent` |
| `--stepper-circle-border` | `--color-border-default` |
| `--stepper-circle-text` | `--color-text-tertiary` |
| `--stepper-circle-active-bg/border/text` | `--color-action-primary / --color-text-inverse` |
| `--stepper-circle-active-shadow` | `none` |
| `--stepper-circle-completed-bg/border/text` | `--color-action-primary / --color-text-inverse` |
| `--stepper-circle-error-bg/border/text` | `--color-status-error / --color-text-inverse` |
| `--stepper-connector-thickness` | `--border-interactive` |
| `--stepper-connector-color` | `--color-border-default` |
| `--stepper-connector-color-completed` | `--color-action-primary` |
| `--stepper-label-color` | `--color-text-secondary` |
| `--stepper-label-color-active` | `--color-text-primary` |
| `--stepper-label-color-completed` | `--color-text-primary` |
| `--stepper-label-color-error` | `--color-status-error` |
| `--stepper-description-color` | `--color-text-tertiary` |
| `--stepper-description-color-error` | `--color-text-error` |
| `--stepper-content-gap-sm/md/lg` | `--spacing-component-xs/sm/md` |
| `--stepper-item-gap` | `--spacing-component-xl` |

---

## Variants

### `numbered` (default)

Step indicators show the step number (1-based). Completed steps show a `<Check>` icon. Error steps show an `<AlertCircle>` icon. This is the recommended variant for most flows.

### `dotted`

Minimal solid circle with no text or icons. Colour changes communicate state. Ideal for progress trackers where the step count is secondary to the visual flow (e.g., onboarding slides, wizards).

---

## Sizes

| Size | Circle | Typography |
|---|---|---|
| `sm` | 24px | `text-label-xs` / `text-body-xs` |
| `md` (default) | 32px | `text-label-sm` / `text-body-xs` |
| `lg` | 40px | `text-label-md` / `text-body-sm` |

---

## States

| State | How it's set | Visual |
|---|---|---|
| `upcoming` | `index > activeStep`, no `status` | Hollow circle, muted border, tertiary number |
| `active` | `index === activeStep`, no `status` | Filled circle, action-primary colour |
| `completed` | `index < activeStep`, no `status` | Filled circle, check icon |
| `error` | `StepItem.status === 'error'` | Error-filled circle, alert icon, red label |

Note: `error` overrides the position-based state. An error step at `index === activeStep` will show as error rather than active.

---

## Orientations

### Horizontal

Steps are arranged left-to-right. Labels appear below each indicator. Connector lines span between indicators. Best for 3–5 steps in a wide container.

### Vertical

Steps stack top-to-bottom. Labels appear to the right of each indicator. Connector lines run downward. Best for 4+ steps in a narrow sidebar or when descriptions are long.

---

## Usage

```tsx
import { Stepper } from './Stepper';

const steps = [
  { id: 'account',  label: 'Account',  description: 'Create your login' },
  { id: 'profile',  label: 'Profile',  description: 'Tell us about yourself' },
  { id: 'billing',  label: 'Billing',  description: 'Payment details' },
  { id: 'confirm',  label: 'Confirm',  description: 'Review and finish' },
];

// Display-only
<Stepper steps={steps} activeStep={currentStep} />

// Clickable steps (navigate back to completed steps)
<Stepper
  steps={steps}
  activeStep={currentStep}
  onStepClick={(index) => setCurrentStep(index)}
/>

// Vertical layout
<Stepper steps={steps} activeStep={2} orientation="vertical" />

// With custom i18n
<Stepper
  steps={steps}
  activeStep={1}
  i18nStrings={{ listLabel: 'Checkout progress', completedLabel: '(Done)' }}
/>
```

---

## Accessibility

### Semantic structure

- Container: `<ol aria-label="Steps">` — screen reader announces as "Steps, list, N items"
- Each step: `<li>` — announces step number and position automatically
- Active step indicator (display-only): `<span aria-current="step">` — announces "current step"
- Active/completed step indicator (clickable): `<button aria-current="step">` — focusable, announces "current step, button"
- Completed indicators: VisuallyHidden `"(Completed)"` suffix in SR output
- Error indicators: VisuallyHidden `"(Error)"` suffix in SR output
- Connectors: `aria-hidden="true"` — purely decorative

### State communication

Color alone is never the sole indicator of state — every state also has a secondary cue:
- **Completed** — check icon AND VisuallyHidden text
- **Active** — `aria-current="step"` AND action-primary fill
- **Error** — alert icon AND red color AND VisuallyHidden text

### Keyboard interaction

| Key | Behaviour |
|---|---|
| `Tab` | Moves focus between clickable step buttons (when `onStepClick` provided). Upcoming steps are skipped (non-interactive). |
| `Enter` / `Space` | Activates the focused step button (when clickable). |

No arrow-key navigation — the Stepper is a list of discrete controls, not a composite widget like a tablist. Tab navigation is correct per ARIA specification.

### Dotted variant touch targets

For the `dotted` variant, the visual dot is smaller than 24×24px. The `.touch-target` class is applied to clickable dot indicators, expanding the interactive area to meet WCAG 2.5.8 minimum target size requirements.

### Screen reader announcement examples

Display-only, active step:
> "Steps, list, 4 items — 2, current step — 3, Shipping"

Interactive, completed step:
> "(Completed) — 1, Cart, button"

Error step:
> "(Error) — 2, Address"