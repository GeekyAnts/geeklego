# ColorPicker

A full-featured interactive color picker with a 2D saturation/brightness spectrum, hue slider, optional alpha slider, hex/RGB/HSL inputs with format switcher, and a preset swatches section.

Supports controlled and uncontrolled usage, three layout variants, three sizes, disabled and loading states, and full i18n string overrides.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Controlled hex color (e.g. `"#ff0000"`). When provided, the picker is controlled. |
| `defaultValue` | `string` | `'#6366f1'` | Uncontrolled initial hex color. |
| `onChange` | `(color: ColorValue) => void` | — | Called on every color change with a full `ColorValue` object. |
| `variant` | `'default' \| 'compact' \| 'minimal'` | `'default'` | Layout variant (see Variants section). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size scale affecting spectrum height and picker width. |
| `presets` | `ColorPickerPreset[]` | — | Array of preset colors shown in the swatches section. |
| `showAlpha` | `boolean` | `false` | Show the opacity/alpha slider and alpha channel input. |
| `disabled` | `boolean` | `false` | Disable the entire picker. |
| `loading` | `boolean` | `false` | Show a skeleton loading state. |
| `i18nStrings` | `ColorPickerI18nStrings` | — | Per-instance string overrides. |
| `className` | `string` | — | Additional class names for the root element. |

### ColorValue

The `onChange` callback receives a `ColorValue` object:

| Field | Type | Description |
|---|---|---|
| `hex` | `string` | Hex without alpha (`#rrggbb`) |
| `hexa` | `string` | Hex with alpha (`#rrggbbaa`) |
| `r`, `g`, `b` | `number` | RGB channels (0–255) |
| `a` | `number` | Alpha (0–1) |
| `h` | `number` | Hue (0–360) |
| `s` | `number` | HSL saturation (0–100) |
| `l` | `number` | HSL lightness (0–100) |
| `sv` | `number` | HSV saturation (0–100) |
| `v` | `number` | HSV brightness (0–100) |

## Variants

| Variant | What's shown |
|---|---|
| `default` | Spectrum + hue slider + alpha slider (if `showAlpha`) + inputs + format switcher + presets |
| `compact` | Spectrum + hue slider + hex input only — no format switcher or presets |
| `minimal` | Color preview swatch + hex input + copy button only — no spectrum |

## Sizes

| Size | Spectrum height | Picker width |
|---|---|---|
| `sm` | 80px | 192px |
| `md` | 96px | 256px |
| `lg` | 128px | 384px |

## States

| State | Behaviour |
|---|---|
| Default | Fully interactive picker |
| Disabled | All controls are non-interactive; muted appearance |
| Loading | Skeleton placeholders replace spectrum and sliders |

## Tokens Used

| Token | Purpose |
|---|---|
| `--color-picker-bg` | Container background |
| `--color-picker-border` | Container border |
| `--color-picker-radius` | Container corner radius |
| `--color-picker-shadow` | Container drop shadow |
| `--color-picker-padding` | Internal padding |
| `--color-picker-width-sm/md/lg` | Picker width by size |
| `--color-picker-spectrum-height-sm/md/lg` | Spectrum height by size |
| `--color-picker-thumb-size` | Spectrum draggable thumb size |
| `--color-picker-thumb-shadow` | Spectrum thumb shadow |
| `--color-picker-track-height` | Hue/alpha slider track height |
| `--color-picker-slider-thumb-size` | Slider thumb dimensions |
| `--color-picker-slider-thumb-shadow` | Slider thumb shadow |
| `--color-picker-label-color` | Channel input label color |
| `--color-picker-presets-gap` | Gap between preset swatches |
| `--color-picker-copy-color` | Copy icon default color |
| `--color-picker-copy-color-hover` | Copy icon hover color |

## Accessibility

**Root element:** `<div role="group">` labelled by a SR-only heading.

**Spectrum:** `<div role="slider">` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` (saturation value), `aria-label`.

**Sliders:** `<div role="slider">` with full `aria-value*` and `aria-label`.

**Format buttons:** `<button aria-pressed>` for each format (HEX/RGB/HSL).

**Preset swatches:** Each `ColorSwatch` has `aria-pressed` (selected) and a required `aria-label`.

**Copy button:** `aria-label` switches between copy label and "Copied!" confirmation.

**Keyboard interaction:**

| Key | Element | Action |
|---|---|---|
| `Tab` | — | Moves focus between focusable controls |
| `Arrow keys` | Spectrum | Adjust saturation (←→) or brightness (↑↓) by 1% |
| `Shift + Arrow keys` | Spectrum | Adjust by 10% |
| `Home` / `End` | Spectrum | Jump to min/max |
| `Arrow keys` | Hue/Alpha slider | Adjust value by 1 |
| `Shift + Arrow keys` | Hue/Alpha slider | Adjust by 10 |
| `Enter` / `Space` | Format button | Switch format |
| `Enter` / `Space` | Color swatch | Select preset color |
| `Enter` / `Space` | Copy button | Copy hex to clipboard |

**i18n strings:**

| Key | Default |
|---|---|
| `colorLabel` | `"Color"` |
| `spectrumLabel` | `"Color spectrum. Use arrow keys to adjust saturation and brightness."` |
| `hueLabel` | `"Hue"` |
| `opacityLabel` | `"Opacity"` |
| `hexLabel` | `"Hex"` |
| `redLabel` | `"R"` |
| `greenLabel` | `"G"` |
| `blueLabel` | `"B"` |
| `hueChannelLabel` | `"H"` |
| `saturationLabel` | `"S"` |
| `lightnessLabel` | `"L"` |
| `presetsLabel` | `"Preset colors"` |
| `copyLabel` | `"Copy hex"` |
| `copiedLabel` | `"Copied!"` |

## Schema.org

Not applicable — no Schema.org mapping exists for a color picker widget.

## Usage

```tsx
import { ColorPicker } from '@geeklego/ui/components/organisms/ColorPicker';

// Uncontrolled
<ColorPicker defaultValue="#6366f1" onChange={(c) => console.log(c.hex)} />

// Controlled
const [hex, setHex] = useState('#6366f1');
<ColorPicker value={hex} onChange={(c) => setHex(c.hex)} />

// With presets
<ColorPicker
  defaultValue="#ef4444"
  presets={[
    { color: '#ef4444', label: 'Red — #ef4444' },
    { color: '#3b82f6', label: 'Blue — #3b82f6' },
  ]}
/>

// Compact + alpha
<ColorPicker variant="compact" showAlpha defaultValue="#6366f180" />

// Minimal (hex input only)
<ColorPicker variant="minimal" defaultValue="#22c55e" />
```
