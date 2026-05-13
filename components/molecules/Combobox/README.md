# Combobox

A searchable dropdown widget. The trigger is a styled text `<input>` with `role="combobox"` — the user types to filter options and navigates the listbox with arrow keys. Focus stays on the input at all times (ARIA active-descendant pattern).

---

## Usage

```tsx
import { Combobox } from '../molecules/Combobox/Combobox';
import type { ComboboxOption } from '../molecules/Combobox/Combobox.types';

const options: ComboboxOption[] = [
  { id: 'react',   label: 'React' },
  { id: 'vue',     label: 'Vue' },
  { id: 'angular', label: 'Angular' },
];

// Uncontrolled
<Combobox options={options} placeholder="Select a framework…" />

// Controlled
const [value, setValue] = useState<string | null>(null);
<Combobox options={options} value={value} onChange={setValue} />
```

---

## Props

### `ComboboxOption`

| Prop | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | — | Unique option identifier — used as React key and selection value |
| `label` | `string` | — | Visible text shown in the input and the option list |
| `description` | `string` | — | Secondary description rendered below the label |
| `disabled` | `boolean` | — | Option is shown but cannot be selected |
| `group` | `string` | — | Group name — options with the same group are visually grouped |

### `ComboboxProps`

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `ComboboxOption[]` | — | Full list of options to filter and display |
| `value` | `string \| null` | — | Controlled selected option id |
| `defaultValue` | `string` | — | Initial selected id for uncontrolled usage |
| `onChange` | `(id: string \| null) => void` | — | Called when user selects or clears an option |
| `onQueryChange` | `(query: string) => void` | — | Called on every keystroke — use for async option loading |
| `placeholder` | `string` | — | Input placeholder text |
| `variant` | `'default' \| 'filled' \| 'flushed'` | `'default'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and typography scale |
| `disabled` | `boolean` | `false` | Disables the entire combobox |
| `error` | `boolean` | `false` | Shows error border on the input |
| `isLoading` | `boolean` | `false` | Shows spinner and loading message in the panel |
| `clearable` | `boolean` | `true` | Shows clear (×) button when a value is selected |
| `id` | `string` | — | Forwarded to the inner `<input>` |
| `name` | `string` | — | Forwarded to the inner `<input>` for form participation |
| `required` | `boolean` | — | Marks the field as required |
| `aria-label` | `string` | — | Accessible label when no visible `<label>` is associated |
| `aria-labelledby` | `string` | — | Points to an external labelling element |
| `aria-describedby` | `string` | — | Points to an external description/error element |
| `wrapperClassName` | `string` | — | Additional class names on the outer `<div>` wrapper |
| `className` | `string` | — | Additional class names on the inner `<input>` |
| `i18nStrings` | `ComboboxI18nStrings` | — | System string overrides (see below) |

### `ComboboxI18nStrings`

| Key | Default | Description |
|---|---|---|
| `clearLabel` | `"Clear"` | `aria-label` for the clear (×) button |
| `listboxLabel` | `"Options"` | `aria-label` for the `<ul role="listbox">` |
| `noResultsMessage` | `"No results"` | Text shown when no options match the query |
| `loadingMessage` | `"Loading options…"` | Text shown in the panel during async loading |

---

## Variants

| Variant | Visual strategy |
|---|---|
| `default` | Visible border at rest; border highlights on hover and focus |
| `filled` | Muted background, no border; border appears on focus |
| `flushed` | Bottom-border only, no radius — editorial feel |

---

## Sizes

| Size | Height token | Typography |
|---|---|---|
| `sm` | `--size-component-sm` | `text-body-sm` |
| `md` | `--size-component-md` | `text-body-md` |
| `lg` | `--size-component-lg` | `text-body-lg` |

---

## States

| State | Appearance |
|---|---|
| Default | Input resting, panel hidden |
| Open | Panel visible, filtered options shown |
| Typing | Panel open, options filtered live |
| Value selected | Input shows option label; clear (×) button appears |
| Loading | Spinner in input; "Loading options…" message in panel |
| Disabled | Muted input, no hover/focus response, panel never opens |
| Error | Error border on input via `Input` atom's error state |
| No results | "No results" message inside the panel |

---

## Token Reference

All tokens live in `design-system/geeklego.css` under the `/* Combobox */` block.

| Token | Default | Purpose |
|---|---|---|
| `--combobox-panel-bg` | `--color-surface-raised` | Panel background |
| `--combobox-panel-border` | `--color-border-default` | Panel border |
| `--combobox-panel-radius` | `--radius-component-md` | Panel corner radius |
| `--combobox-panel-shadow` | `--shadow-lg` | Panel elevation shadow |
| `--combobox-panel-z` | `--layer-raised` | Panel z-index |
| `--combobox-panel-offset` | `--spacing-component-xs` | Gap between input and panel |
| `--combobox-panel-max-height` | `16rem` | Maximum panel height before scroll |
| `--combobox-option-bg-hover` | `--color-action-secondary` | Option hover background |
| `--combobox-option-bg-focused` | `--color-action-secondary` | Active-descendant option background |
| `--combobox-option-bg-selected` | `--color-state-selected` | Selected option background |
| `--combobox-option-check-color` | `--color-action-primary` | Check-mark icon color |
| `--combobox-option-height-md` | `--size-component-sm` | Option row height (md combobox) |
| `--combobox-group-label-text` | `--color-text-tertiary` | Group header text color |
| `--combobox-group-divider` | `--color-border-subtle` | Divider between groups |
| `--combobox-empty-text` | `--color-text-tertiary` | Empty/loading state text color |

---

## Accessibility

### Semantic structure

| Element | HTML / Role | Notes |
|---|---|---|
| Input | `<input type="text" role="combobox">` | `Input` atom with overridden role |
| Panel | `<div role="presentation">` | Positional container |
| Listbox | `<ul role="listbox">` | Option container |
| Option | `<li role="option" aria-selected>` | Individual option |
| Group container | `<ul role="group" aria-label>` | Grouped options |
| Clear button | `<button type="button" aria-label="Clear">` | Separate focusable control |

### ARIA attributes

| Attribute | Where | Value |
|---|---|---|
| `role="combobox"` | `<input>` | Identifies the widget type |
| `aria-expanded` | `<input>` | Whether the panel is visible |
| `aria-controls` | `<input>` | Points to `<ul role="listbox">` by ID |
| `aria-autocomplete="list"` | `<input>` | Indicates live list filtering |
| `aria-activedescendant` | `<input>` | ID of the keyboard-focused option |
| `aria-haspopup="listbox"` | `<input>` | Declares the popup type |
| `aria-selected` | `<li role="option">` | True for the selected option |
| `aria-disabled` | `<li role="option">` | True for disabled options |
| `aria-label` | `<ul role="listbox">` | Accessible name for the listbox |
| `aria-multiselectable="false"` | `<ul role="listbox">` | Single-select mode |

### Keyboard interaction

| Key | Behaviour |
|---|---|
| `↓` Arrow Down | Opens panel (if closed) and moves active descendant to next option |
| `↑` Arrow Up | Moves active descendant to previous option |
| `Home` | Moves active descendant to first option |
| `End` | Moves active descendant to last option |
| `Enter` | Selects the active-descendant option; if none active, selects first filter match |
| `Escape` | Closes panel and restores input to last selected label |
| `Tab` | Closes panel without selecting; moves focus to next element |
| `Type` | Filters options live; deselects current value if typed text differs from its label |

### Screen reader announcement

When an option is focused via arrow key, the screen reader reads:
> "**{option label}**, option, {N} of {total}"

The active-descendant pattern means focus never physically leaves the `<input>`, so the SR context is always "you are in a combobox text field".

---

## Schema.org

No Schema.org mapping — Combobox is a form control with no structured data entity type.

---

## i18n

The Combobox has four system-generated strings. Override any of them via `i18nStrings` or globally via `GeeklegoI18nProvider`:

```tsx
<Combobox
  options={options}
  i18nStrings={{
    clearLabel: 'Supprimer la sélection',
    listboxLabel: 'Options disponibles',
    noResultsMessage: 'Aucun résultat',
    loadingMessage: 'Chargement…',
  }}
/>
```