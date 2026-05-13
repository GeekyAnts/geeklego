# ColorSwatch

A clickable color swatch button. Displays an arbitrary CSS color and supports selected, disabled, size, and shape variants. Used as a building block in the ColorPicker's preset grid, palette builders, and theme selectors.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `string` | — | **Required.** CSS color value (hex, rgb, hsl, named). Applied as background via CSS custom property. |
| `aria-label` | `string` | — | **Required.** Accessible label for the color (e.g. `"Red — #ff0000"`). |
| `selected` | `boolean` | `false` | Whether the swatch is selected. Shows a persistent ring and sets `aria-pressed="true"`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Visual size. sm=24px, md=32px, lg=40px. |
| `shape` | `'square' \| 'circle'` | `'square'` | Shape of the swatch. |
| `disabled` | `boolean` | `false` | Disables interaction. Sets `disabled` + `aria-disabled="true"`, reduces opacity. |
| `className` | `string` | — | Additional class names. |

All other `ButtonHTMLAttributes<HTMLButtonElement>` props are forwarded (except `color` which is intercepted by the component's own prop).

## Tokens Used

| Token | Purpose |
|---|---|
| `--color-swatch-size-sm/md/lg` | Width and height per size |
| `--color-swatch-radius-square` | Border radius for square shape |
| `--color-swatch-radius-circle` | Border radius for circle shape |
| `--color-swatch-border` | Subtle border to define swatch against light backgrounds |
| `--color-swatch-border-hover` | Border darkens on hover |
| `--color-swatch-ring` | Outline color for selected state |
| `--color-swatch-opacity-disabled` | Opacity when disabled |
| `--color-swatch-gap` | Recommended gap for swatch grid layouts |

## Variants

**Shape:**
- `square` — rounded corners (`--radius-component-sm`)
- `circle` — fully rounded (`--radius-component-full`)

## Sizes

| Size | Dimensions |
|---|---|
| `sm` | 24×24px (`--size-component-xs`) |
| `md` | 32×32px (`--size-component-sm`) |
| `lg` | 40×40px (`--size-component-md`) |

All sizes meet the WCAG 2.5.8 minimum 24×24px touch target requirement.

## States

| State | Visual treatment |
|---|---|
| Default | Flat color fill, subtle 1px border |
| Hover | Border darkens, scale lifts to 110% |
| Active/Pressed | Scale returns to 100% |
| Focus-visible | 2px outline focus ring |
| Selected | Persistent 2px outline ring with 2px offset (`aria-pressed="true"`) |
| Disabled | 40% opacity, `cursor-not-allowed`, no hover/active response |

## Accessibility

**Semantic element:** `<button type="button">`

**Role:** Implicit `button`.

**ARIA attributes:**
| Attribute | Value |
|---|---|
| `aria-label` | Required — describes the color (consumer-supplied) |
| `aria-pressed` | `true` when `selected`, otherwise not set |
| `aria-disabled` | `true` when `disabled` |
| `disabled` | HTML disabled attribute when `disabled` |

**Keyboard interaction:**
| Key | Action |
|---|---|
| `Enter` / `Space` | Activates the swatch (triggers `onClick`) |
| `Tab` | Moves focus to/from the swatch |

**Screen reader announcement:**
> "[aria-label], button, [pressed / not pressed]"

Example: "Indigo — #6366f1, button, pressed"

**Touch target:** All sizes meet WCAG 2.5.8 minimum 24×24px.

## Usage

```tsx
import { ColorSwatch } from '@geeklego/ui/components/atoms/ColorSwatch';

// Basic
<ColorSwatch color="#6366f1" aria-label="Indigo — #6366f1" />

// Selected (in a controlled palette)
<ColorSwatch
  color="#22c55e"
  aria-label="Green — #22c55e"
  selected={selectedColor === '#22c55e'}
  onClick={() => setSelectedColor('#22c55e')}
/>

// Disabled
<ColorSwatch color="#999" aria-label="Unavailable color" disabled />

// In a grid
<div role="group" aria-label="Color palette" className="flex flex-wrap gap-[var(--color-swatch-gap)]">
  {colors.map((c) => (
    <ColorSwatch key={c.hex} color={c.hex} aria-label={c.label} />
  ))}
</div>
```
