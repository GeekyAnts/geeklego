# Image

A responsive image atom that handles loading, error, and caption states with full accessibility support.

---

## Description

`Image` wraps a native `<img>` element with:
- **Aspect-ratio control** via CSS custom properties (square, video, portrait, landscape, wide, or auto)
- **Loading skeleton** — shimmer placeholder while the image fetches
- **Error fallback** — `ImageOff` icon (or custom content) when the image fails to load
- **Caption support** — renders as semantic `<figure>` + `<figcaption>` when a caption is provided
- **Border radius** variants from the component token scale
- **Object-fit** control for cover, contain, fill, or none behaviours
- **Decorative image** support via empty `alt=""`

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — | Image source URL (required) |
| `alt` | `string` | — | Alt text (required — pass `""` for decorative images) |
| `caption` | `ReactNode` | `undefined` | Caption rendered in `<figcaption>` below the image |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'none'` | Border radius shape |
| `fit` | `'cover' \| 'contain' \| 'fill' \| 'none'` | `'cover'` | CSS `object-fit` value |
| `aspectRatio` | `'auto' \| 'square' \| 'video' \| 'portrait' \| 'landscape' \| 'wide'` | `'auto'` | Container aspect ratio |
| `bordered` | `boolean` | `false` | Show 1px decorative border |
| `fallback` | `ReactNode` | `<ImageOff />` | Custom error fallback content |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | Native lazy-load hint |
| `onLoad` | `() => void` | — | Called when image loads successfully |
| `onError` | `() => void` | — | Called when image fails to load |
| `className` | `string` | — | Extra classes applied to the outermost container |

All other `ImgHTMLAttributes<HTMLImageElement>` are forwarded to the `<img>` element.

---

## Tokens Used

| Token | Value | Purpose |
|---|---|---|
| `--image-radius-{none–full}` | radius scale | Border radius variants |
| `--image-border-color` | `--color-border-subtle` | Decorative border colour |
| `--image-border-width` | `--border-container` | Decorative border width |
| `--image-bg-placeholder` | `--color-bg-tertiary` | Background while loading or on error |
| `--image-fallback-icon-color` | `--color-text-tertiary` | Error fallback icon colour |
| `--image-fallback-icon-size` | `--size-icon-xl` | Error fallback icon size |
| `--image-min-height` | `--size-component-2xl` | Minimum height when `aspectRatio="auto"` |
| `--image-caption-color` | `--color-text-secondary` | Caption text colour |
| `--image-caption-gap` | `--spacing-component-sm` | Gap between image and caption |
| `--image-aspect-{square–wide}` | CSS ratio values | Aspect ratio containers |
| `--image-caption-overflow` | `--content-overflow-body` | Caption overflow |
| `--image-caption-lines` | `--content-lines-description` | Caption line clamp |

---

## Variants

### Radius

| Value | Description |
|---|---|
| `none` | No rounding (default) |
| `sm` | Slight rounding (`--radius-component-sm`) |
| `md` | Medium rounding (`--radius-component-md`) |
| `lg` | Large rounding (`--radius-component-lg`) |
| `xl` | Extra large rounding (`--radius-component-xl`) |
| `full` | Fully circular (`--radius-component-full`) — useful with `aspectRatio="square"` for circular avatars |

### Aspect Ratios

| Value | Ratio | Use case |
|---|---|---|
| `auto` | Natural dimensions | Content images where the aspect ratio varies |
| `square` | 1:1 | Profile images, thumbnails |
| `video` | 16:9 | Video thumbnails, hero images |
| `portrait` | 3:4 | Portrait photos |
| `landscape` | 4:3 | Standard photos |
| `wide` | 21:9 | Cinematic banners |

---

## States

| State | Behaviour |
|---|---|
| Loading | Image is visually hidden (`visibility: hidden`); skeleton shimmer fills the container |
| Loaded | Skeleton removed; image fades in via `transition-default` |
| Error | Image hidden; `ImageOff` icon (or custom `fallback`) fills the container; screen readers hear `"{alt} — failed to load"` |

---

## Accessibility

**Semantic element:** `<img>` inside `<div>` (standalone) or `<figure>` (with caption)

| Scenario | Element | Notes |
|---|---|---|
| Meaningful image | `<img alt="descriptive text">` | `alt` is required and must describe the content |
| Decorative image | `<img alt="">` + `aria-hidden="true"` | Empty alt collapses the element for screen readers |
| Captioned image | `<figure>` + `<figcaption>` | Native association — no extra ARIA needed |
| Error state | `<span class="sr-only">{alt} — failed to load</span>` | Announced when the image fails to load |

**Keyboard interaction:** No keyboard interaction — `Image` is a non-interactive display element.

**WCAG 2.2 compliance:**
- 1.1.1 Non-text Content (A) — meaningful alt text required; decorative images use `alt=""`
- 1.4.5 Images of Text (AA) — use text, not images of text
- Error state announced to screen readers via visually-hidden text

---

## Usage

```tsx
import { Image } from 'components/atoms/Image';

// Standard responsive image
<Image
  src="/photos/mountain.jpg"
  alt="Snow-capped mountain peak at sunset"
  aspectRatio="video"
  radius="md"
/>

// With caption (renders as <figure>)
<Image
  src="/photos/mountain.jpg"
  alt="Mountain peak"
  aspectRatio="landscape"
  radius="md"
  caption="Mount Rainier, Washington — 14,411 ft"
/>

// Circular avatar-style
<Image
  src="/avatars/user.jpg"
  alt="User avatar"
  aspectRatio="square"
  radius="full"
  className="w-16"
/>

// Decorative background image (screen-reader hidden)
<Image
  src="/backgrounds/hero.jpg"
  alt=""
  aria-hidden="true"
  aspectRatio="wide"
  fit="cover"
/>

// Custom error fallback
<Image
  src="/dynamic/image.jpg"
  alt="Dynamic content image"
  aspectRatio="square"
  radius="md"
  fallback={<span className="text-body-sm">No image available</span>}
/>
```