# Switch

A toggle control that switches between an on and off state. Built as a `<button role="switch">` per ARIA authoring practices — there is no native HTML switch element.

Supports controlled and uncontrolled usage, two colour variants, three sizes, and optional label + description text.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | — | Controlled checked state. Pair with `onChange`. |
| `defaultChecked` | `boolean` | `false` | Initial state for uncontrolled usage. |
| `onChange` | `(checked: boolean) => void` | — | Called with the new value on toggle. |
| `variant` | `'default' \| 'success'` | `'default'` | Track colour when checked. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Track and thumb dimensions. |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Where the label text renders relative to the track. |
| `children` | `ReactNode` | — | Label text. Becomes the accessible name via `aria-labelledby`. |
| `description` | `string` | — | Secondary description below the label. Linked via `aria-describedby`. |
| `disabled` | `boolean` | `false` | Disables interaction and mutes visual appearance. |
| `className` | `string` | — | Additional class applied to the outermost wrapper `<div>`. |

All other `ButtonHTMLAttributes` (except `onChange`) are forwarded to the `<button>` element.

---

## Tokens Used

| Token | Role |
|---|---|
| `--switch-track-bg` | Track background (unchecked) |
| `--switch-track-bg-hover` | Track hover (unchecked) |
| `--switch-track-bg-disabled` | Track background (disabled unchecked) |
| `--switch-track-bg-checked` | Track background (checked, default variant) |
| `--switch-track-bg-checked-hover` | Track hover (checked, default variant) |
| `--switch-track-bg-checked-disabled` | Track background (disabled checked) |
| `--switch-track-bg-success-checked` | Track background (checked, success variant) |
| `--switch-track-bg-success-checked-hover` | Track hover (checked, success variant) |
| `--switch-track-shadow` | Track shadow (unchecked) |
| `--switch-track-shadow-checked` | Track shadow (checked; inset) |
| `--switch-thumb-bg` | Thumb background |
| `--switch-thumb-bg-disabled` | Thumb background (disabled) |
| `--switch-thumb-shadow` | Thumb drop shadow (`shadow-sm` for elevation) |
| `--switch-label-color` | Label text colour |
| `--switch-label-color-disabled` | Label text colour (disabled) |
| `--switch-description-color` | Description text colour |
| `--switch-description-color-disabled` | Description text colour (disabled) |
| `--switch-track-radius` | Track pill radius |
| `--switch-thumb-radius` | Thumb circle radius |
| `--switch-gap` | Gap between track and label |
| `--switch-label-gap` | Gap between label and description |
| `--switch-track-width-{sm\|md\|lg}` | Track width per size |
| `--switch-track-height-{sm\|md\|lg}` | Track height per size |
| `--switch-thumb-size-{sm\|md\|lg}` | Thumb diameter per size |
| `--switch-thumb-offset-{sm\|md\|lg}` | Thumb left-edge offset (unchecked position) |
| `--switch-thumb-translate-{sm\|md\|lg}` | Thumb translate-x distance (checked position) |

**New shared semantics added:**

| Semantic | Description |
|---|---|
| `--color-status-success-hover` | Darker success colour for hover states across components |
| `--color-control-thumb` | Always near-white surface for toggle/slider thumb elements |

---

## Variants

| Variant | When to use | Checked colour |
|---|---|---|
| `default` | General toggles, settings, preferences | Brand action colour (`--color-action-primary`) |
| `success` | Feature flags, "this thing is active/enabled" | Status success colour (`--color-status-success`) |

---

## Sizes

| Size | Track | Thumb |
|---|---|---|
| `sm` | 28×16px | 12px — uses `.touch-target` to meet 24px minimum |
| `md` | 44×24px | 20px |
| `lg` | 56×32px | 24px |

---

## States

| State | Visual treatment |
|---|---|
| Off | Muted neutral track, thumb at left |
| On | Coloured track (brand or success), thumb at right |
| Hover (off) | Track slightly darker (`--switch-track-bg-hover`) |
| Hover (on) | Track slightly darker (`--switch-track-bg-checked-hover`) |
| Focus-visible | 2px focus ring on the track button |
| Disabled | Both track and thumb muted; pointer events removed |

---

## Accessibility

### Semantic element
`<button type="button" role="switch">`

There is no native `<switch>` element in HTML. The `role="switch"` on a `<button>` is the ARIA authoring-practice-recommended pattern.

### ARIA attributes

| Attribute | Set to | Purpose |
|---|---|---|
| `role` | `"switch"` | Exposes toggle semantics to screen readers |
| `aria-checked` | `true` \| `false` | Communicates current on/off state |
| `aria-labelledby` | `id` of the label `<span>` | Provides accessible name from sibling text |
| `aria-describedby` | `id` of the description `<span>` | Provides additional context (when `description` is set) |
| `aria-disabled` | `true` (when disabled) | Reinforces disabled state for AT |
| `disabled` | present (when disabled) | Native browser disabled behaviour |

When `children` is omitted, pass `aria-label` directly to name the switch:
```tsx
<Switch aria-label="Toggle dark mode" defaultChecked />
```

### Keyboard interaction

| Key | Action |
|---|---|
| `Tab` | Move focus to the switch |
| `Space` | Toggle on/off |
| `Enter` | Toggle on/off (button default) |

### Screen reader announcement

- Off: _"[Label], switch, off"_
- On: _"[Label], switch, on"_
- Disabled: _"[Label], dimmed, switch, off/on"_

---

## Usage

```tsx
import { Switch } from './Switch';

// Uncontrolled
<Switch defaultChecked>Dark mode</Switch>

// Controlled
const [enabled, setEnabled] = useState(false);
<Switch checked={enabled} onChange={setEnabled}>
  Notifications
</Switch>

// With description
<Switch
  defaultChecked
  description="Sent once a day at 9 AM."
>
  Morning digest
</Switch>

// Success variant
<Switch variant="success" defaultChecked>
  Feature flag — enabled
</Switch>

// Label on the left (settings layout)
<Switch labelPosition="left" defaultChecked>
  Auto-save
</Switch>

// No visible label — aria-label required
<Switch aria-label="Toggle sidebar" defaultChecked />

// Disabled
<Switch disabled defaultChecked={false}>
  Unavailable setting
</Switch>
```