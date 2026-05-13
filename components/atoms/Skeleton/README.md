# Skeleton

A loading placeholder component that communicates pending content through a shimmer animation. Used to prevent layout shift and reduce perceived latency while data loads.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'text' \| 'box' \| 'circle'` | `'text'` | Shape of the placeholder |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height of text lines (text variant only) |
| `circleSize` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'` | Diameter of the circle (circle variant only) |
| `lines` | `number` | `1` | Number of text lines to render (text variant only) |
| `width` | `string` | — | Explicit width override. Use token strings: `'var(--size-component-lg)'` |
| `height` | `string` | — | Explicit height override. Use token strings: `'var(--spacing-32)'` |
| `animated` | `boolean` | `true` | Whether to show the shimmer animation |
| `aria-label` | `string` | `'Loading'` | Screen reader label describing the pending content |
| `className` | `string` | — | Additional CSS classes |

All other `HTMLAttributes<HTMLDivElement>` are forwarded to the root element.

---

## Tokens Used

| Token | Value | Purpose |
|---|---|---|
| `--skeleton-height-text-sm` | `var(--spacing-3)` | sm text line height (12px) |
| `--skeleton-height-text-md` | `var(--spacing-4)` | md text line height (16px) |
| `--skeleton-height-text-lg` | `var(--spacing-5)` | lg text line height (20px) |
| `--skeleton-circle-xs` | `var(--size-component-xs)` | 24px circle |
| `--skeleton-circle-sm` | `var(--size-component-sm)` | 32px circle |
| `--skeleton-circle-md` | `var(--size-component-md)` | 40px circle |
| `--skeleton-circle-lg` | `var(--size-component-lg)` | 48px circle |
| `--skeleton-circle-xl` | `var(--size-component-xl)` | 56px circle |
| `--skeleton-circle-2xl` | `var(--size-component-2xl)` | 64px circle |
| `--skeleton-box-min-height` | `var(--size-component-md)` | Box fallback min-height |
| `--skeleton-radius-text` | `var(--radius-component-sm)` | Text line border-radius |
| `--skeleton-radius-box` | `var(--radius-component-md)` | Box border-radius |
| `--skeleton-radius-circle` | `var(--radius-component-full)` | Circle border-radius |
| `--skeleton-gap` | `var(--spacing-component-xs)` | Gap between multi-line text rows |
| `--skeleton-last-line-width` | `75%` | Width of the final line in multi-line text |

The shimmer animation colors come from the `.skeleton` utility class in `geeklego.css`, which uses `--color-state-loading` and `--color-state-loading-shine` for the gradient.

---

## Variants

### `text`

A rectangular pill representing a line of text. Use `lines` to render a paragraph-style block. The last line is rendered at `--skeleton-last-line-width` (75%) to simulate natural text endings.

```tsx
<Skeleton variant="text" size="md" />
<Skeleton variant="text" size="md" lines={4} />
```

### `box`

A rectangular block for images, cards, or media areas. Fills 100% of its container width by default with a minimum height. Use the `height` prop to set a specific height.

```tsx
<Skeleton variant="box" height="var(--spacing-40)" />
```

### `circle`

A perfect circle for avatar or icon placeholders. Use `circleSize` to pick from the component size scale (xs — 2xl), which mirrors Avatar sizes.

```tsx
<Skeleton variant="circle" circleSize="lg" />
```

---

## Sizes

### Text sizes

| Size | Height | Use case |
|---|---|---|
| `sm` | 12px | Caption / label text |
| `md` | 16px | Body text (default) |
| `lg` | 20px | Heading / emphasis text |

### Circle sizes

| Size | Diameter | Matches Avatar |
|---|---|---|
| `xs` | 24px | `xs` |
| `sm` | 32px | `sm` |
| `md` | 40px | `md` (default) |
| `lg` | 48px | `lg` |
| `xl` | 56px | `xl` |
| `2xl` | 64px | `2xl` |

---

## States

| State | Description |
|---|---|
| Animated (default) | Shimmer gradient animates left-to-right via `.skeleton` utility |
| Static (`animated={false}`) | Solid `--color-state-loading` fill, no animation |

---

## Composing Skeletons

Skeleton components are composed together to match the layout of the content they replace. Never use a single large skeleton for an entire card — match the structure element by element.

```tsx
// Card skeleton composition
<div className="flex gap-3 p-4">
  <Skeleton variant="circle" circleSize="md" aria-label="Loading avatar" />
  <div className="flex flex-col gap-2 flex-1">
    <Skeleton variant="text" size="md" width="60%" aria-label="Loading name" />
    <Skeleton variant="text" size="sm" aria-label="Loading bio" />
    <Skeleton variant="text" size="sm" width="80%" aria-label="Loading bio" />
  </div>
</div>
```

---

## Accessibility

**Semantic element:** `<div>` with `role="status"` and `aria-label`.

**Screen reader behaviour:** The `role="status"` creates a live region with `aria-live="polite"`. When the skeleton mounts, assistive technology announces the `aria-label` text. Default label is `"Loading"`. Provide a descriptive label when context matters:

```tsx
<Skeleton aria-label="Loading user profile" variant="text" lines={3} />
```

`aria-busy={true}` is always set, signalling to assistive technology that the region is actively loading content.

**Keyboard interaction:** None. Skeleton is a non-interactive display element. It accepts no keyboard focus and has no interactive states.

| Key | Action |
|---|---|
| — | No keyboard interaction |

**Non-interactive:** Skeleton never receives focus. Do not place skeleton components inside focusable containers without proper `aria` updates when content loads.

---

## Usage

```tsx
import { Skeleton } from '@/components/atoms/Skeleton';

// Single text line
<Skeleton variant="text" size="md" />

// Paragraph block
<Skeleton variant="text" lines={3} aria-label="Loading description" />

// Avatar placeholder
<Skeleton variant="circle" circleSize="lg" aria-label="Loading avatar" />

// Image/media placeholder
<Skeleton variant="box" height="var(--spacing-48)" aria-label="Loading image" />

// Static (no animation)
<Skeleton variant="text" animated={false} />
```