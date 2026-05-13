# Select

**Level:** Atom (L1)
**Dependencies:** None — tokens + Tailwind + React hooks only

## Description

A fully custom dropdown select with its own trigger button, panel, and option items. Supports controlled and uncontrolled usage, full keyboard navigation, ARIA combobox semantics, three variants, three sizes, disabled/error states, and optional disabled individual options. Distinct from `NativeSelect` (a styled `<select>` wrapper, to be built separately).

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `SelectOption[]` | `[]` | Available options in the dropdown panel |
| `value` | `string` | — | Controlled selected value. Pair with `onChange`. |
| `defaultValue` | `string` | — | Initial value for uncontrolled usage |
| `onChange` | `(value: string) => void` | — | Called with the new value on selection |
| `placeholder` | `string` | `'Select…'` | Text shown when nothing is selected |
| `variant` | `'default' \| 'filled' \| 'ghost'` | `'default'` | Trigger visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Trigger height and font size |
| `disabled` | `boolean` | `false` | Disables the trigger and all options |
| `error` | `boolean` | `false` | Applies error border to the trigger |
| `label` | `string` | — | Visible label rendered above the trigger |
| `id` | `string` | auto | Forwarded to the trigger button for external label association |

### SelectOption

| Field | Type | Description |
|---|---|---|
| `value` | `string` | Submitted to `onChange` on selection |
| `label` | `string` | Displayed in trigger and panel |
| `disabled` | `boolean` | Visible but not selectable |

## Variants

| Variant | Visual strategy |
|---|---|
| `default` | Outlined border + surface background — high affordance, primary emphasis |
| `filled` | Muted surface background, no border — secondary / subdued context |
| `ghost` | Fully transparent trigger, background appears only on hover — inline / tertiary |

## Sizes

| Size | Height | Typography |
|---|---|---|
| `sm` | `--size-component-sm` (32px) | `text-body-sm` |
| `md` | `--size-component-md` (40px) | `text-body-sm` |
| `lg` | `--size-component-lg` (48px) | `text-body-md` |

## States

| State | Behaviour |
|---|---|
| Default | Resting trigger with shadow-sm |
| Hover | Background shifts + border darkens (two-property change) |
| Open | Border becomes focus colour + shadow lifts to shadow-md, chevron rotates 180° |
| Focus-visible | Focus ring via `focus-visible:focus-ring` |
| Disabled | Muted bg + text, no hover, cursor-not-allowed |
| Error | Error-colour border on trigger |
| Option hover | Option bg shifts to action-secondary |
| Option focused (keyboard) | Same as hover, driven by focusedIndex state |
| Option selected | Brand-tinted bg + primary text + check icon |
| Option disabled | Muted text, no pointer, skipped in keyboard nav |

## Keyboard Navigation

| Key | Action |
|---|---|
| `Enter` / `Space` | Open dropdown / confirm focused option |
| `ArrowDown` | Open dropdown / move focus down (skips disabled) |
| `ArrowUp` | Open dropdown / move focus up (skips disabled) |
| `Escape` | Close dropdown, return focus to trigger |
| `Tab` | Close dropdown, move browser focus forward |

## Tokens Used

| Token | Resolves to | Used for |
|---|---|---|
| `--select-trigger-radius` | `--radius-component-md` | Trigger corner radius |
| `--select-trigger-shadow` | `--shadow-sm` | Resting trigger shadow |
| `--select-trigger-shadow-open` | `--shadow-md` | Open trigger shadow |
| `--select-trigger-text` | `--color-text-primary` | Selected label text |
| `--select-trigger-placeholder` | `--color-text-tertiary` | Placeholder text |
| `--select-trigger-icon` | `--color-text-tertiary` | Chevron icon color |
| `--select-trigger-border-hover` | `--color-border-strong` | Hover border |
| `--select-trigger-border-focus` | `--color-border-focus` | Open/focus border |
| `--select-trigger-border-error` | `--color-border-error` | Error border |
| `--select-trigger-bg-hover` | `--color-bg-secondary` | Hover background |
| `--select-trigger-bg-disabled` | `--color-action-disabled` | Disabled bg |
| `--select-trigger-text-disabled` | `--color-text-disabled` | Disabled text |
| `--select-default-bg` | `--color-surface-raised` | Default variant bg |
| `--select-default-border` | `--color-border-default` | Default variant border |
| `--select-filled-bg` | `--color-bg-secondary` | Filled variant bg |
| `--select-ghost-bg-hover` | `--color-action-secondary` | Ghost hover bg |
| `--select-height-sm/md/lg` | `--size-component-sm/md/lg` | Trigger heights |
| `--select-label-color` | `--color-text-primary` | Label text |
| `--select-panel-bg` | `--color-surface-raised` | Dropdown panel background |
| `--select-panel-border` | `--color-border-default` | Panel border |
| `--select-panel-radius` | `--radius-component-md` | Panel corner radius |
| `--select-panel-shadow` | `--shadow-lg` | Panel elevation |
| `--select-panel-z` | `--layer-raised` | Panel z-index |
| `--select-option-bg-hover` | `--color-action-secondary` | Option hover bg |
| `--select-option-bg-focused` | `--color-action-secondary` | Keyboard-focused option bg |
| `--select-option-bg-selected` | `--color-state-selected` | Selected option bg |
| `--select-option-text-selected` | `--color-action-primary` | Selected option text |
| `--select-option-text-disabled` | `--color-text-disabled` | Disabled option text |
| `--select-option-check-color` | `--color-action-primary` | Checkmark icon |
| `--select-option-radius` | `--radius-component-sm` | Option corner radius |

## Accessibility

- Trigger uses `role="combobox"` with `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls`
- `aria-activedescendant` tracks the keyboard-focused option during navigation
- Dropdown uses `role="listbox"`; each option uses `role="option"` with `aria-selected` and `aria-disabled`
- `aria-invalid` set on trigger when `error` is true
- Full keyboard navigation with Escape to dismiss, Tab to move focus
- Click-outside closes the panel

## Usage

```tsx
import { Select } from '../atoms/Select/Select';

// Uncontrolled
<Select
  options={[
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ]}
  defaultValue="weekly"
  label="Time period"
/>

// Controlled
const [period, setPeriod] = useState('weekly');
<Select
  options={periodOptions}
  value={period}
  onChange={setPeriod}
  size="sm"
  variant="default"
/>
```