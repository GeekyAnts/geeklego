# Avatar

**Level:** Atom (L1)
**Dependencies:** None

## Description

A circular or rounded avatar component that displays a user image, initials, icon, or a generic fallback. Supports multiple sizes from xs to 2xl with optional border ring.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'image' \| 'initials' \| 'icon' \| 'fallback'` | `'fallback'` | Visual variant |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'` | Avatar size |
| `shape` | `'circle' \| 'rounded'` | `'circle'` | Avatar shape |
| `src` | `string` | — | Image source URL |
| `alt` | `string` | `''` | Alt text for image |
| `initials` | `string` | — | 1-2 character initials |
| `icon` | `ReactNode` | — | Custom icon element |
| `bordered` | `boolean` | `false` | Show border ring |

## Tokens Used

| Token | Resolves to | Used for |
|---|---|---|
| `--avatar-bg` | `--color-bg-tertiary` | Fallback/initials background |
| `--avatar-text` | `--color-text-secondary` | Initials text color |
| `--avatar-border` | `--color-border-subtle` | Border ring color |
| `--avatar-icon-color` | `--color-text-tertiary` | Icon color |
| `--avatar-radius-circle` | `--radius-component-full` | Circle shape radius |
| `--avatar-radius-rounded` | `--radius-component-lg` | Rounded shape radius |
| `--size-avatar-*` | Semantic sizing | Container dimensions |

## Variants

| Variant | Description |
|---|---|
| `image` | Displays user photo, falls back to generic icon on error |
| `initials` | Shows 1-2 uppercase letters |
| `icon` | Displays a custom icon element |
| `fallback` | Shows generic User icon |

## Sizes

| Size | Dimension | Typography |
|---|---|---|
| `xs` | 20px | `text-body-2xs` |
| `sm` | 28px | `text-body-xs` |
| `md` | 32px | `text-body-xs` |
| `lg` | 40px | `text-body-sm` |
| `xl` | 56px | `text-body-md` |
| `2xl` | 80px | `text-heading-h4` |

## States

Handled: default, image error fallback, bordered

## Accessibility

- Uses `role="img"` with `aria-label`
- Decorative icons have `aria-hidden="true"`
- Image has `alt` text support

## Schema.org

When `schema={true}` and variant is `'image'`, emits [ImageObject](https://schema.org/ImageObject) Microdata:

| Element | Attribute | Value |
|---|---|---|
| `<span>` (wrapper) | `itemScope`, `itemType` | `https://schema.org/ImageObject` |
| `<img>` | `itemProp` | `contentUrl` |

Only applies to the `image` variant — other variants do not emit Microdata.

```tsx
<Avatar variant="image" src="/photo.jpg" alt="Jane Doe" schema />
```

## Usage

```tsx
import { Avatar } from '../../atoms/Avatar/Avatar';

<Avatar variant="image" src="/photo.jpg" alt="Jane Doe" size="lg" />
<Avatar variant="initials" initials="JD" size="md" />
<Avatar variant="fallback" size="sm" bordered />
```