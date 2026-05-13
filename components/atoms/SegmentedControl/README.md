# SegmentedControl

A compact group of mutually-exclusive options presented as connected buttons. Used to switch between views, modes, or filter states. Selection is always visible — exactly one segment is active at all times.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `SegmentOption[]` | — | **Required.** Array of segment options. Minimum 2. |
| `value` | `string` | — | Controlled selected value. Pair with `onChange`. |
| `defaultValue` | `string` | First option value | Initial selected value for uncontrolled usage. |
| `onChange` | `(value: string) => void` | — | Called when the selection changes. |
| `variant` | `'default' \| 'outline'` | `'default'` | Visual style. See Variants. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and typography scale of each segment. |
| `disabled` | `boolean` | `false` | Disables all segments in the group. |
| `fullWidth` | `boolean` | `false` | Stretches the control to fill its container with equal-width segments. |
| `aria-label` | `string` | — | **Required.** Accessible name for the group (e.g. `"View mode"`, `"Time range"`). |
| `className` | `string` | — | Additional CSS classes applied to the track container. |

### SegmentOption

| Field | Type | Description |
|---|---|---|
| `value` | `string` | Unique identifier for this segment. |
| `label` | `string` | Visible text label. Optional when using icon-only. |
| `icon` | `ReactNode` | Icon rendered before the label. Use lucide-react; size icons at the call site. |
| `disabled` | `boolean` | Disables only this segment while others remain active. |
| `aria-label` | `string` | Required for icon-only segments (replaces the visible label for assistive tech). |

---

## Variants

### `default` — Surface-pop selection
The track has a muted secondary background. The selected segment appears to float above it as a white/raised surface with a subtle border and shadow. Unselected segments are transparent and gain a subtle hover tint.

**Use for:** view switchers, display toggles, sorting modes.

### `outline` — Brand-fill selection
The track has a visible border on a transparent background. The selected segment fills with the primary action (brand) colour with inverse text. Fundamentally different from `default` — selection is emphasised with colour rather than surface lift.

**Use for:** filter groups, tab-like navigation, inline options where strong emphasis is appropriate.

---

## Sizes

| Size | Height | Typography |
|---|---|---|
| `sm` | `--size-component-sm` (32px) | `text-button-sm` |
| `md` | `--size-component-md` (40px) | `text-button-md` |
| `lg` | `--size-component-lg` (48px) | `text-button-lg` |

---

## States

| State | Behaviour |
|---|---|
| **Default** | One segment is always selected. Unselected segments are transparent. |
| **Hover** | Background shifts + text colour changes (two-property change). |
| **Focus-visible** | Focus ring appears on the focused segment. |
| **Selected** | Segment shows its variant's selection treatment (surface-pop or brand-fill). |
| **Disabled (group)** | Entire track dims; all segments are non-interactive. `aria-disabled` on container. |
| **Disabled (option)** | Individual segment dims; other segments remain interactive. Roving tabindex skips it. |

---

## Tokens Used

### Geometry
| Token | Purpose |
|---|---|
| `--segmented-track-radius` | Track border radius |
| `--segmented-track-padding` | Internal padding around segments |
| `--segmented-segment-radius` | Each segment's border radius (inset from track) |
| `--segmented-gap` | Gap between icon and label within a segment |
| `--segmented-height-{sm\|md\|lg}` | Segment height per size |
| `--segmented-px-{sm\|md\|lg}` | Segment horizontal padding per size |

### Default variant
| Token | Purpose |
|---|---|
| `--segmented-default-track-bg` | Track background |
| `--segmented-default-track-border` | Track border |
| `--segmented-default-selected-bg` | Selected segment background |
| `--segmented-default-selected-text` | Selected segment text |
| `--segmented-default-selected-border` | Selected segment border |
| `--segmented-default-selected-shadow` | Selected segment shadow |
| `--segmented-default-selected-shadow-hover` | Hover shadow on selected |

### Outline variant
| Token | Purpose |
|---|---|
| `--segmented-outline-track-bg` | Track background (transparent) |
| `--segmented-outline-track-border` | Track border |
| `--segmented-outline-selected-bg` | Selected segment fill (brand colour) |
| `--segmented-outline-selected-text` | Selected segment text (inverse) |
| `--segmented-outline-selected-border` | Selected segment border |
| `--segmented-outline-selected-shadow` | Selected segment shadow |
| `--segmented-outline-selected-shadow-hover` | Hover shadow on selected |

### Unselected segments
| Token | Purpose |
|---|---|
| `--segmented-segment-bg` | Unselected background (transparent) |
| `--segmented-segment-text` | Unselected text |
| `--segmented-segment-bg-hover` | Hover background |
| `--segmented-segment-text-hover` | Hover text |
| `--segmented-track-bg-disabled` | Disabled track background |
| `--segmented-segment-text-disabled` | Disabled segment text |

### Content flexibility
| Token | Purpose |
|---|---|
| `--segmented-label-overflow` | Label overflow behaviour |
| `--segmented-label-whitespace` | Label whitespace handling |
| `--segmented-label-text-overflow` | Label text-overflow (ellipsis) |
| `--segmented-label-max-width` | Maximum label width |

---

## Usage

### Uncontrolled (default selection)
```tsx
<SegmentedControl
  options={[
    { value: 'grid', label: 'Grid' },
    { value: 'list', label: 'List' },
    { value: 'map', label: 'Map' },
  ]}
  defaultValue="grid"
  aria-label="View mode"
/>
```

### Controlled
```tsx
const [view, setView] = useState('grid');

<SegmentedControl
  options={[
    { value: 'grid', label: 'Grid' },
    { value: 'list', label: 'List' },
    { value: 'map', label: 'Map' },
  ]}
  value={view}
  onChange={setView}
  aria-label="View mode"
/>
```

### Icon-only (accessible)
Each icon-only segment requires `aria-label`. The group still requires its own `aria-label`.
```tsx
import { Grid, List, Map } from 'lucide-react';

<SegmentedControl
  options={[
    { value: 'grid', icon: <Grid size="var(--size-icon-sm)" />, 'aria-label': 'Grid view' },
    { value: 'list', icon: <List size="var(--size-icon-sm)" />, 'aria-label': 'List view' },
    { value: 'map',  icon: <Map  size="var(--size-icon-sm)" />, 'aria-label': 'Map view'  },
  ]}
  defaultValue="grid"
  aria-label="View mode"
/>
```

### Icon + text
```tsx
<SegmentedControl
  options={[
    { value: 'grid', label: 'Grid', icon: <Grid size="var(--size-icon-sm)" /> },
    { value: 'list', label: 'List', icon: <List size="var(--size-icon-sm)" /> },
  ]}
  defaultValue="grid"
  variant="outline"
  aria-label="View mode"
/>
```

### Full width
```tsx
<SegmentedControl
  options={viewOptions}
  defaultValue="grid"
  fullWidth
  aria-label="View mode"
/>
```

### Individual disabled option
```tsx
<SegmentedControl
  options={[
    { value: 'basic', label: 'Basic' },
    { value: 'pro', label: 'Pro', disabled: true },
    { value: 'enterprise', label: 'Enterprise' },
  ]}
  defaultValue="basic"
  aria-label="Plan"
/>
```

---

## Accessibility

### Semantic element
`<div role="group">` — a named group of related buttons. Each segment is a `<button type="button">`.

### Required attributes

| Attribute | Applied to | Purpose |
|---|---|---|
| `role="group"` | Container `<div>` | Groups segments as a named widget |
| `aria-label` | Container `<div>` | Names the group for screen readers |
| `aria-pressed` | Each `<button>` | Communicates selected vs. unselected state |
| `aria-label` | Icon-only `<button>` | Names the segment when there is no visible label |
| `aria-disabled` | Disabled `<button>` or container | Communicates unavailability |
| `aria-hidden="true"` | Icon `<span>` wrapper | Marks icons as decorative |

### Keyboard interaction

| Key | Action |
|---|---|
| `Tab` | Enters the group. Focus lands on the currently selected segment. |
| `Arrow Left` | Moves focus (and selection) to the previous segment. Wraps from first to last. |
| `Arrow Right` | Moves focus (and selection) to the next segment. Wraps from last to first. |
| `Home` | Moves focus (and selection) to the first enabled segment. |
| `End` | Moves focus (and selection) to the last enabled segment. |
| `Space` / `Enter` | Selects the focused segment (equivalent to click). |
| `Tab` (out) | Leaves the group entirely; Tab does not move between segments. |

Disabled segments are skipped by arrow key navigation (roving tabindex honours `isItemDisabled`).

### Screen reader announcements
- Unselected: `"Grid, button"`
- Selected: `"Grid, pressed, button"` or `"Grid, button, pressed"` (varies by SR)
- Group: `"View mode, group"` on container focus or entry
- Disabled segment: `"List, dimmed, button"` (VoiceOver) / `"List, unavailable, button"` (NVDA)

### Touch target
Each segment meets the minimum 24×24 px CSS target (smallest size `sm` is 32px height).

### Contrast
- `default` selected: `--color-text-primary` on `--color-surface-default` — inherits page contrast.
- `outline` selected: `--color-text-inverse` (white) on `--color-action-primary` (brand-500 / #6366f1) — ratio — 4.5:1 against `#6366f1` confirmed.