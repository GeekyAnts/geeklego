# Item

**Level:** Atom (L1)
**Dependencies:** None

## Description

A versatile content display component for lists, settings rows, notifications, contacts, and file browsers. Renders media, title, description, and action slots in a flexible row layout. Supports polymorphic rendering as `<div>`, `<div role="button">`, or `<a>`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'default' \| 'outlined' \| 'elevated' \| 'ghost'` | `'default'` | Visual treatment |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height, padding, and typography size |
| `title` | `ReactNode` | — | **Required.** Primary text content |
| `description` | `ReactNode` | — | Secondary text below title |
| `media` | `ReactNode` | — | Left-side slot for Avatar, icon, or thumbnail |
| `actions` | `ReactNode` | — | Right-side slot for Button, Badge, or Switch |
| `selected` | `boolean` | `false` | Selected/active state |
| `disabled` | `boolean` | `false` | Disables interaction |
| `loading` | `boolean` | `false` | Shows skeleton placeholder |
| `interactive` | `boolean` | auto | Enables hover/focus/active styles. Auto-true when `onClick` or `href` is provided |
| `href` | `string` | — | Renders as `<a>` element |
| `onClick` | `function` | — | Click handler. Sets interactive=true |
| `className` | `string` | — | Additional CSS classes |

## Tokens Used

| Token | Resolves to | Used for |
|---|---|---|
| `--item-default-bg` | `--color-bg-secondary` | Default variant background |
| `--item-default-bg-hover` | `--color-state-hover` | Default variant hover |
| `--item-default-bg-active` | `--color-state-pressed` | Default variant active/pressed |
| `--item-default-bg-selected` | `--color-state-selected` | Default variant selected state |
| `--item-outlined-bg` | `transparent` | Outlined variant background |
| `--item-outlined-bg-hover` | `--color-bg-secondary` | Outlined variant hover |
| `--item-outlined-border` | `--color-border-default` | Outlined variant border |
| `--item-elevated-bg` | `--color-surface-raised` | Elevated variant background |
| `--item-elevated-shadow` | `--shadow-sm` | Elevated variant resting shadow |
| `--item-elevated-shadow-hover` | `--shadow-md` | Elevated variant hover shadow |
| `--item-ghost-bg` | `transparent` | Ghost variant background |
| `--item-ghost-bg-hover` | `--color-state-hover` | Ghost variant hover |
| `--item-title-color` | `--color-text-primary` | Title text color |
| `--item-description-color` | `--color-text-secondary` | Description text color |
| `--item-bg-disabled` | `--color-action-disabled` | Disabled background |
| `--item-radius` | `--radius-component-md` | Corner radius |
| `--item-gap` | `--spacing-component-md` | Gap between media/content/actions |
| `--item-content-gap` | `--spacing-component-xs` | Gap between title and description |
| `--item-height-sm` | `--size-component-md` (40px) | Small min-height |
| `--item-height-md` | `--size-component-xl` (56px) | Medium min-height |
| `--item-height-lg` | `--size-component-xl` (56px) | Large min-height (padding adds space) |

## Variants

| Variant | Description |
|---|---|
| `default` | Subtle filled background. For general-purpose lists. |
| `outlined` | Visible border, transparent fill. For structured/separated lists. |
| `elevated` | Raised surface with shadow progression on hover. For card-like items. |
| `ghost` | Fully transparent. Hover reveals background. For menus and action lists. |

## Sizes

| Size | Min-height | Title typography | Description typography |
|---|---|---|---|
| `sm` | 40px | `.text-body-sm` | `.text-caption-sm` |
| `md` | 56px | `.text-body-md` | `.text-body-sm` |
| `lg` | 56px + extra padding | `.text-label-md` | `.text-body-md` |

## States

Handled: default, hover, focus-visible, active, disabled, selected, loading

## Accessibility

- Renders as `<a>` when `href` is provided (native link semantics)
- Renders as `<div role="button" tabIndex={0}>` when `onClick` is provided without `href`
- Renders as plain `<div>` when non-interactive
- `aria-selected` set when selected
- `aria-disabled` set when disabled
- `aria-busy` set when loading
- Media slot has `aria-hidden="true"` (decorative)
- Keyboard: Enter and Space trigger onClick on `div[role=button]`
- Disabled removes from tab order

## Usage

```tsx
import { Item } from '../../atoms/Item/Item';
import { Avatar } from '../../atoms/Avatar/Avatar';

// Basic
<Item title="John Doe" description="john.doe@example.com" />

// With media and actions
<Item
  title="John Doe"
  description="john.doe@example.com"
  media={<Avatar name="John Doe" size="md" />}
  actions={<Button variant="ghost" size="sm">Message</Button>}
  interactive
/>

// As a link
<Item
  title="View profile"
  description="See full details"
  href="/profile/john"
/>

// Elevated card-like
<Item
  variant="elevated"
  title="Project Update"
  description="New deployment completed"
  media={<Bell size="var(--size-icon-md)" />}
/>
```