# Checkbox

A fully accessible, theme-aware checkbox atom that replaces the browser default with a custom visual indicator while preserving all native checkbox semantics, keyboard interaction, and form participation.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | `false` | Whether the checkbox is checked. Control via `onChange`. |
| `indeterminate` | `boolean` | `false` | Tri-state. Shows a dash icon and visually overrides checked display. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Visual size of the indicator box (14 / 16 / 20 px). |
| `error` | `boolean` | `false` | Marks the field invalid — shifts border to `--color-border-error`. |
| `disabled` | `boolean` | `false` | Disables interaction. Applies muted appearance. |
| `required` | `boolean` | `false` | Marks the field required. Sets `aria-required="true"`. |
| `children` | `ReactNode` | — | Label text rendered alongside the indicator. Omit and supply `aria-label` for label-less usage. |
| `id` | `string` | auto (`useId`) | Override the generated `id` on the native `<input>`. |
| `onChange` | `ChangeEventHandler<HTMLInputElement>` | — | Controlled change handler. |
| `className` | `string` | — | Extra classes applied to the outer `<label>` wrapper. |

All other `InputHTMLAttributes<HTMLInputElement>` props (`aria-label`, `aria-describedby`, `name`, etc.) are forwarded to the native `<input>`.

---

## Tokens Used

| Token | Purpose |
|---|---|
| `--checkbox-bg` | Indicator background — unchecked |
| `--checkbox-bg-hover` | Indicator background — unchecked hover |
| `--checkbox-bg-checked` | Indicator background — checked / indeterminate |
| `--checkbox-bg-checked-hover` | Indicator background — checked hover |
| `--checkbox-bg-disabled` | Indicator background — disabled |
| `--checkbox-border` | Indicator border — unchecked |
| `--checkbox-border-hover` | Indicator border — unchecked hover |
| `--checkbox-border-checked` | Indicator border — checked |
| `--checkbox-border-checked-hover` | Indicator border — checked hover |
| `--checkbox-border-indeterminate` | Indicator border — indeterminate |
| `--checkbox-border-disabled` | Indicator border — disabled |
| `--checkbox-border-error` | Indicator border — error state |
| `--checkbox-icon` | Icon color (check / dash) |
| `--checkbox-icon-disabled` | Icon color — disabled |
| `--checkbox-label-color` | Label text color |
| `--checkbox-label-color-disabled` | Label text color — disabled |
| `--checkbox-radius` | Indicator corner radius |
| `--checkbox-gap` | Gap between indicator and label text |
| `--checkbox-shadow` | Box shadow — resting (none in light/dark) |
| `--checkbox-shadow-hover` | Box shadow — hover |
| `--checkbox-shadow-active` | Box shadow — active/pressed (inset) |
| `--checkbox-size-sm/md/lg` | Indicator box dimensions |
| `--checkbox-icon-size-sm/md/lg` | Check / dash icon size |

---

## Variants (display states)

| State | Visual treatment |
|---|---|
| **Unchecked** | White/bg-primary box, default border |
| **Checked** | Primary-filled box, inverse check icon |
| **Indeterminate** | Primary-filled box, inverse dash icon |

---

## Sizes

| Size | Indicator | Token |
|---|---|---|
| `sm` | 14 px | `--checkbox-size-sm` — `--size-control-indicator-sm` |
| `md` | 16 px | `--checkbox-size-md` — `--size-control-indicator-md` |
| `lg` | 20 px | `--checkbox-size-lg` — `--size-control-indicator-lg` |

---

## States

| State | How it looks |
|---|---|
| Default | White box, `--checkbox-border` border |
| Hover | Background deepens, border strengthens (two-property change) |
| Focus-visible | `focus-ring` outline on indicator; keyboard-only |
| Checked | Primary-filled + check icon |
| Indeterminate | Primary-filled + dash icon |
| Disabled | Muted bg + muted border; no hover response; `cursor-not-allowed` |
| Error | `--checkbox-border-error` border; `aria-invalid="true"` on input |

---

## Accessibility

**Semantic element:** `<input type="checkbox">` — implicit `checkbox` role (no `role` added).

**Accessible name sources (in priority order):**
1. `children` prop — rendered as a `<label>` wrapping the native input (wrapping label pattern)
2. `aria-label` prop — forwarded to the native `<input>` when no visible label is provided
3. `aria-labelledby` prop — forwarded to the native `<input>` for external label association

**ARIA attributes applied automatically:**

| Condition | Attribute | Value |
|---|---|---|
| `required={true}` | `aria-required` | `"true"` |
| `error={true}` | `aria-invalid` | `"true"` |
| `error={true}` | `aria-describedby` | `"{id}-error"` |
| `disabled={true}` | native `disabled` | set |

**Keyboard interaction:**

| Key | Action |
|---|---|
| `Tab` | Moves focus to the checkbox |
| `Space` | Toggles checked state |

**Focus ring:** Displayed on the custom visual indicator only when focused via keyboard (`:focus-visible` detection). Sighted mouse users do not see the focus ring.

**Indeterminate:** The `indeterminate` DOM property is set programmatically via `useEffect` — it is not an HTML attribute and cannot be set via JSX alone.

**Touch target:** All sizes use `.touch-target` to ensure a minimum 24×24 px click area (WCAG 2.5.8), even though the visual indicator is smaller.

**Screen reader announcement:** When checked: "checked". When unchecked: "not checked". When indeterminate: browser-dependent (typically "mixed" or "checked"). The visible label text is the accessible name.

**Label-less usage:** When `children` is omitted, you must supply `aria-label`:
```tsx
<Checkbox checked={val} onChange={handleChange} aria-label="Select all rows" />
```

---

## Usage

### Basic controlled checkbox

```tsx
import { useState } from 'react';
import { Checkbox } from './Checkbox';

function Example() {
  const [accepted, setAccepted] = useState(false);
  return (
    <Checkbox checked={accepted} onChange={(e) => setAccepted(e.target.checked)}>
      I accept the terms and conditions
    </Checkbox>
  );
}
```

### Indeterminate (parent checkbox in a list)

```tsx
const allChecked = items.every((i) => i.checked);
const someChecked = items.some((i) => i.checked);

<Checkbox
  checked={allChecked}
  indeterminate={someChecked && !allChecked}
  onChange={toggleAll}
>
  Select all
</Checkbox>
```

### Error state with helper text

```tsx
<Checkbox
  checked={marketingOptIn}
  error={!marketingOptIn && submitted}
  onChange={(e) => setMarketingOptIn(e.target.checked)}
  aria-describedby="marketing-error"
>
  I want to receive marketing emails
</Checkbox>
{!marketingOptIn && submitted && (
  <p id="marketing-error" role="alert" className="text-body-sm text-[var(--color-border-error)]">
    Please make a selection.
  </p>
)}
```

### Label-less (select all header)

```tsx
<Checkbox
  size="sm"
  checked={allSelected}
  onChange={handleSelectAll}
  aria-label="Select all rows"
/>
```