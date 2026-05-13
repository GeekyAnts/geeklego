# Tabs

**Level:** L3 Organism
**Location:** `components/organisms/Tabs/`

A WAI-ARIA-compliant tabs component with automatic tab activation, four visual variants, three sizes, and horizontal/vertical orientation. Uses a compound-component API (`Tabs.List`, `Tabs.Tab`, `Tabs.Panel`) backed by React Context. Keyboard navigation follows the ARIA Tabs pattern with roving tabindex.

---

## Props

### `<Tabs>` (root)

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Controlled selected value |
| `defaultValue` | `string` | `''` | Uncontrolled initial selected value |
| `onChange` | `(value: string) => void` | — | Called when selected tab changes |
| `variant` | `TabsVariant` | `'line'` | Visual style of the tab list |
| `size` | `TabsSize` | `'md'` | Height and text size of tab triggers |
| `orientation` | `TabsOrientation` | `'horizontal'` | Tab list direction |
| `loading` | `boolean` | `false` | Show loading skeleton |
| `loadingCount` | `number` | `3` | Number of skeleton tabs when loading |
| `i18nStrings` | `TabsI18nStrings` | — | Override system strings |
| `className` | `string` | — | Additional CSS classes on root element |

### `<Tabs.List>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Additional CSS classes |
| `children` | `ReactNode` | — | `<Tabs.Tab>` elements |

### `<Tabs.Tab>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | **required** | Unique identifier matching a `<Tabs.Panel>` value |
| `disabled` | `boolean` | `false` | Disables the tab trigger |
| `icon` | `ReactNode` | — | Icon rendered before the tab label |
| `className` | `string` | — | Additional CSS classes |
| `children` | `ReactNode` | **required** | Tab label text |

### `<Tabs.Panel>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | **required** | Unique identifier matching a `<Tabs.Tab>` value |
| `className` | `string` | — | Additional CSS classes |
| `children` | `ReactNode` | **required** | Panel content |

---

## Types

```ts
type TabsVariant    = 'line' | 'enclosed' | 'soft-rounded' | 'solid-rounded';
type TabsSize       = 'sm' | 'md' | 'lg';
type TabsOrientation = 'horizontal' | 'vertical';

interface TabsI18nStrings {
  /** aria-label for the tab list landmark. Default: "Tabs" */
  listLabel?: string;
}
```

---

## Variants

| Variant | Visual Treatment |
|---|---|
| `line` | Underline indicator below the active tab. Clean, minimal. |
| `enclosed` | Active tab has a filled card background, sitting in a grey container bar. |
| `soft-rounded` | Pill shape with a soft tinted background on the active tab. |
| `solid-rounded` | Pill shape with a filled primary-color background on the active tab. Strongest visual emphasis. |

---

## Sizes

| Size | Height token | Padding token |
|---|---|---|
| `sm` | `--tabs-tab-height-sm` | `--tabs-tab-px-sm` |
| `md` | `--tabs-tab-height-md` | `--tabs-tab-px-md` |
| `lg` | `--tabs-tab-height-lg` | `--tabs-tab-px-lg` |

---

## States

| State | Behaviour |
|---|---|
| **Default** | Tab shows secondary text colour |
| **Hover** | Background tint + primary text |
| **Focus-visible** | Focus ring via `focus-visible:focus-ring` |
| **Active/Pressed** | Deeper background tint |
| **Selected** | Variant-specific indicator (underline / filled bg). `aria-selected="true"`. |
| **Disabled** | 50% opacity, `cursor-not-allowed`, skipped by keyboard nav |
| **Loading** | Skeleton tab buttons + skeleton panel area |

---

## Accessibility

### Semantic element

- Root: `<div>` container
- Tab list: `<div role="tablist">` with `aria-label` and `aria-orientation`
- Tab trigger: `<button role="tab">` with `aria-selected`, `aria-controls`
- Panel: `<div role="tabpanel">` with `aria-labelledby`, `tabIndex={0}`

### ARIA attributes

| Element | Attribute | Value |
|---|---|---|
| Tab list | `role` | `"tablist"` |
| Tab list | `aria-label` | Resolved via `i18nStrings.listLabel` (default: `"Tabs"`) |
| Tab list | `aria-orientation` | `"horizontal"` or `"vertical"` |
| Tab | `role` | `"tab"` |
| Tab | `aria-selected` | `true` when selected |
| Tab | `aria-controls` | ID of the associated panel |
| Tab | `aria-disabled` | `true` when disabled |
| Panel | `role` | `"tabpanel"` |
| Panel | `aria-labelledby` | ID of the associated tab |
| Panel | `tabIndex` | `0` (panel is focusable) |
| Panel | `hidden` | Present when panel is not selected |

### Keyboard interaction

| Key | Behaviour |
|---|---|
| `Tab` | Moves focus to/from the tab list as a single unit; then into the active panel |
| `ArrowRight` / `ArrowLeft` | Move focus between tabs (horizontal orientation); selection follows focus |
| `ArrowDown` / `ArrowUp` | Move focus between tabs (vertical orientation); selection follows focus |
| `Home` | Move focus to first non-disabled tab |
| `End` | Move focus to last non-disabled tab |

Disabled tabs are skipped during arrow-key navigation.

### Screen reader announcement

When a tab is selected, screen readers announce:
- The tab's label
- Its role (`tab`)
- Its position (`1 of 3`)
- Its state (`selected`)

The active panel is announced when it receives focus after `Tab` key press.

---

## Tokens used

```css
/* Layout */
--tabs-min-width
--tabs-list-gap
--tabs-panel-pt
--tabs-vertical-gap

/* Tab trigger — shared */
--tabs-tab-text
--tabs-tab-text-hover
--tabs-tab-text-selected
--tabs-tab-text-disabled
--tabs-tab-bg-hover
--tabs-tab-bg-active
--tabs-tab-gap

/* Sizes */
--tabs-tab-height-sm / -md / -lg
--tabs-tab-px-sm / -md / -lg

/* line variant */
--tabs-line-list-border
--tabs-line-indicator-color

/* enclosed variant */
--tabs-enclosed-list-bg
--tabs-enclosed-list-border
--tabs-enclosed-list-radius
--tabs-enclosed-list-padding
--tabs-enclosed-tab-bg-selected
--tabs-enclosed-tab-border-selected
--tabs-enclosed-tab-shadow-selected
--tabs-enclosed-tab-radius

/* soft-rounded variant */
--tabs-soft-rounded-list-bg
--tabs-soft-rounded-list-radius
--tabs-soft-rounded-list-padding
--tabs-soft-rounded-tab-bg-selected
--tabs-soft-rounded-tab-text-selected
--tabs-soft-rounded-tab-radius

/* solid-rounded variant */
--tabs-solid-rounded-list-bg
--tabs-solid-rounded-list-radius
--tabs-solid-rounded-list-padding
--tabs-solid-rounded-tab-bg-selected
--tabs-solid-rounded-tab-text-selected
--tabs-solid-rounded-tab-shadow-selected  (brand: --shadow-brand-md)
--tabs-solid-rounded-tab-radius

/* Panel */
--tabs-panel-text

/* Content flexibility */
--tabs-tab-label-overflow
--tabs-tab-label-whitespace
--tabs-tab-label-text-overflow
```

---

## Usage

### Uncontrolled (default)

```tsx
import { Tabs } from './Tabs';

<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="analytics">Analytics</Tabs.Tab>
    <Tabs.Tab value="settings" disabled>Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="overview">Overview content</Tabs.Panel>
  <Tabs.Panel value="analytics">Analytics content</Tabs.Panel>
  <Tabs.Panel value="settings">Settings content</Tabs.Panel>
</Tabs>
```

### Controlled

```tsx
const [tab, setTab] = useState('overview');

<Tabs value={tab} onChange={setTab}>
  ...
</Tabs>
```

### With icons

```tsx
import { Home, Settings } from 'lucide-react';

<Tabs defaultValue="home">
  <Tabs.List>
    <Tabs.Tab value="home" icon={<Home size="var(--size-icon-sm)" />}>Home</Tabs.Tab>
    <Tabs.Tab value="settings" icon={<Settings size="var(--size-icon-sm)" />}>Settings</Tabs.Tab>
  </Tabs.List>
  ...
</Tabs>
```

### Vertical orientation

```tsx
<Tabs defaultValue="general" orientation="vertical" variant="line">
  <Tabs.List>
    <Tabs.Tab value="general">General</Tabs.Tab>
    <Tabs.Tab value="security">Security</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="general">General content</Tabs.Panel>
  <Tabs.Panel value="security">Security content</Tabs.Panel>
</Tabs>
```

### Enclosed variant

```tsx
<Tabs defaultValue="tab1" variant="enclosed">
  <Tabs.List>
    <Tabs.Tab value="tab1">Monthly</Tabs.Tab>
    <Tabs.Tab value="tab2">Annual</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="tab1">Monthly pricing</Tabs.Panel>
  <Tabs.Panel value="tab2">Annual pricing (save 20%)</Tabs.Panel>
</Tabs>
```

### Loading state

```tsx
<Tabs defaultValue="tab1" loading loadingCount={3} />
```

### Custom i18n strings

```tsx
<Tabs defaultValue="tab1" i18nStrings={{ listLabel: 'Account sections' }}>
  ...
</Tabs>
```
