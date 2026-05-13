# ThemeSwitcher

A pill-shaped segmented control for switching between application themes. Renders a horizontal group of icon-only toggle buttons — one is always selected (exclusive choice). Supports controlled and uncontrolled usage, three sizes, and customisable options.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `ThemeMode` | — | Controlled selected theme. |
| `defaultValue` | `ThemeMode` | `'system'` | Initial theme in uncontrolled mode. |
| `onChange` | `(value: ThemeMode) => void` | — | Called when the user selects a theme. |
| `options` | `ThemeSwitcherOption[]` | system, light, dark | Custom option list. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of each toggle button. |
| `className` | `string` | — | Additional class on the container `<div>`. |

All other `<div>` HTML attributes are forwarded to the container.

### ThemeSwitcherOption

| Field | Type | Description |
|---|---|---|
| `value` | `ThemeMode` | Theme identifier: `'system' \| 'light' \| 'dark'`. |
| `label` | `string` | Accessible name used as `aria-label` on the button. |
| `icon` | `ReactNode` | Icon to render. Lucide elements are auto-sized. |

---

## Tokens Used

| Token | Purpose |
|---|---|
| `--theme-switcher-bg` | Container background (`--color-surface-default`) |
| `--theme-switcher-border` | Container border (`--color-border-subtle`) |
| `--theme-switcher-radius` | Container corner radius (`--radius-component-lg` = 8px) |
| `--theme-switcher-padding` | Inner padding around buttons (`--spacing-component-xs`) |
| `--theme-switcher-gap` | Gap between buttons (`--spacing-component-xs`) |
| `--theme-switcher-item-size-{sm/md/lg}` | Button square size |
| `--theme-switcher-item-icon-{sm/md/lg}` | Icon size inside button |
| `--theme-switcher-item-radius` | Unselected button corner radius (`--radius-component-lg` = 8px — matches container) |
| `--theme-switcher-item-radius-pressed` | Selected button corner radius (`--radius-component-md` = 6px — inset nested effect) |
| `--theme-switcher-item-bg` | Unselected button background (`transparent`) |
| `--theme-switcher-item-bg-hover` | Hover background (`--color-action-secondary`) |
| `--theme-switcher-item-bg-pressed` | Selected button background (`--color-bg-primary`) |
| `--theme-switcher-item-border-pressed` | Selected button border colour (`--color-border-subtle`) |
| `--theme-switcher-item-icon` | Unselected icon colour (`--color-text-secondary`) |
| `--theme-switcher-item-icon-pressed` | Selected icon colour (`--color-text-primary`) |
| `--theme-switcher-item-shadow` | Unselected button shadow (`none` in light/dark) |
| `--theme-switcher-item-shadow-pressed` | Selected button shadow (`--shadow-sm`) |

---

## Variants

There are no visual variants — the component always uses the same pill + toggle design. The `options` prop allows 2–N options with any icons and labels.

---

## Sizes

| Size | Button dimensions | Icon size |
|---|---|---|
| `sm` | 32 × 32 px | 16 px |
| `md` | 40 × 40 px | 20 px |
| `lg` | 48 × 48 px | 24 px |

---

## States

| State | Visual |
|---|---|
| **Unselected** | Transparent background, secondary icon colour |
| **Hover (unselected)** | `--color-state-hover` background + primary icon colour |
| **Selected / pressed** | `--color-bg-primary` background + `--shadow-sm` |
| **Focus-visible** | 2 px focus ring via `.focus-ring` |

---

## Usage

### Uncontrolled

```tsx
<ThemeSwitcher defaultValue="system" onChange={(theme) => console.log(theme)} />
```

### Controlled

```tsx
const [theme, setTheme] = useState<ThemeMode>('light');
<ThemeSwitcher value={theme} onChange={setTheme} />
```

### Custom options

```tsx
import { Sun, Moon } from 'lucide-react';

const options = [
  { value: 'light',  label: 'Light theme',  icon: <Sun /> },
  { value: 'dark',   label: 'Dark theme',   icon: <Moon /> },
];

<ThemeSwitcher options={options} defaultValue="light" />
```

### Sizes

```tsx
<ThemeSwitcher size="sm" defaultValue="system" />
<ThemeSwitcher size="md" defaultValue="system" />  {/* default */}
<ThemeSwitcher size="lg" defaultValue="system" />
```

---

## Accessibility

**Semantic element:** `<div role="group" aria-label="Theme">` container containing `<button>` elements.

| Attribute | Value | Purpose |
|---|---|---|
| `role="group"` | on container | Groups the buttons as a logical unit |
| `aria-label="Theme"` | on container | Names the group for assistive technology |
| `aria-pressed` | `true` / `false` on each button | Communicates selected state |
| `aria-label` | option's `label` string | Accessible name for icon-only buttons |
| `aria-hidden="true"` | on icon `<span>` | Prevents icon from being announced twice |

**Keyboard interaction:**

| Key | Action |
|---|---|
| `Tab` | Move focus into (or out of) the group |
| `Arrow Right` | Move focus to the next option and select it |
| `Arrow Left` | Move focus to the previous option and select it |
| `Home` | Move focus to the first option and select it |
| `End` | Move focus to the last option and select it |

Focus follows selection — arrow key navigation immediately changes the selected theme. The group uses a **roving tabindex**: only the selected button receives `tabIndex={0}`; all others have `tabIndex={-1}`.

**Screen reader announcement (example):**
> "System theme, toggle button, pressed, 1 of 3"