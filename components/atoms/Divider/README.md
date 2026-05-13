# Divider

**Level:** Atom (L1)
**Dependencies:** None

## Description

A simple separator line used to visually divide content sections. Supports horizontal and vertical orientations with solid, dashed, or dotted styles.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of the divider |
| `variant` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | Border style |

## Tokens Used

| Token | Resolves to | Used for |
|---|---|---|
| `--divider-color` | `--color-border-subtle` | Line color |
| `--divider-spacing` | `--spacing-component-xs` | Margin around divider |

## Variants

| Variant | Description |
|---|---|
| `solid` | Continuous line |
| `dashed` | Dashed line |
| `dotted` | Dotted line |

## States

Handled: default (no interactive states — decorative element)

## Accessibility

- Uses semantic `<hr>` element
- Has `role="separator"` and `aria-orientation`

## Usage

```tsx
import { Divider } from '../../atoms/Divider/Divider';

<Divider />
<Divider variant="dashed" />
<Divider orientation="vertical" />
```