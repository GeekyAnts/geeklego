# Carousel

An accessible, animated slide carousel with arrow navigation, dot indicators, optional autoplay, and full WAI-ARIA carousel pattern compliance. Renders as a `<section>` landmark with per-slide `role="group"` and `aria-roledescription="slide"` semantics.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | **Required.** Accessible label for the carousel region (`aria-label` on `<section>`). |
| `variant` | `'default' \| 'loop'` | `'default'` | `'default'` stops at the first and last slide. `'loop'` wraps from last back to first. |
| `navigation` | `'arrows' \| 'dots' \| 'both' \| 'none'` | `'both'` | Which navigation controls to render. |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Controls the arrow button size and overall density. |
| `slidesPerView` | `1 \| 2 \| 3` | `1` | Number of slides visible simultaneously. |
| `autoPlay` | `boolean` | `false` | Enable automatic slide advancement. Shows a pause/resume toggle. |
| `autoPlayInterval` | `number` | `4000` | Milliseconds between automatic advances. |
| `pauseOnHover` | `boolean` | `true` | Pause autoplay when the cursor hovers over the carousel. |
| `loading` | `boolean` | `false` | Show a loading skeleton in place of slide content. |
| `i18nStrings` | `CarouselI18nStrings` | — | Per-instance i18n overrides (see i18n section). |
| `className` | `string` | — | Additional class names for the root `<section>`. |

All other props are spread onto the root `<section>` element.

---

## Compound Slot

| Slot | Element | Purpose |
|---|---|---|
| `Carousel.Slide` | `<div>` | Optional wrapper for slide content. Applies `w-full h-full` sizing. |

```tsx
<Carousel label="Product images">
  <Carousel.Slide>
    <img src="..." alt="Product front view" />
  </Carousel.Slide>
  <Carousel.Slide>
    <img src="..." alt="Product side view" />
  </Carousel.Slide>
</Carousel>
```

Slides can be any ReactNode — `<Carousel.Slide>` is optional but recommended for consistent sizing.

---

## Variants

| Variant | Behaviour |
|---|---|
| `default` | Navigation stops at first and last slide. Prev is disabled at index 0; Next is disabled at the last visible index. |
| `loop` | Navigation wraps. At the last slide, Next advances to slide 1. At the first slide, Prev advances to the last. |

---

## Sizes

| Size | Arrow button size | Use case |
|---|---|---|
| `sm` | `xs` | Compact or thumbnail carousels |
| `md` | `sm` | Default — general purpose |
| `lg` | `md` | Hero / full-width featured content |
| `full` | `sm` | Fills 100% of its container height (use inside a fixed-height wrapper) |

---

## States

| State | Prop | Visual | ARIA |
|---|---|---|---|
| Default | — | Arrows/dots shown, slide visible | `aria-roledescription="carousel"` |
| Loading | `loading={true}` | `aspect-video` Skeleton replaces slides; controls hidden | `aria-busy="true"` |
| Autoplay | `autoPlay={true}` | Pause/Play icon button added before dots | `aria-pressed` on toggle |
| Prev disabled | `variant="default"` at index 0 | Prev button is muted, `cursor-not-allowed` | `aria-disabled="true"`, `disabled` |
| Next disabled | `variant="default"` at last index | Next button is muted | `aria-disabled="true"`, `disabled` |

---

## Tokens Used

| Token | Purpose |
|---|---|
| `--carousel-bg` | Root background (default: `--color-bg-primary`) |
| `--carousel-radius` | Corner radius of the viewport |
| `--carousel-min-width` | Minimum width guard (default: `--content-min-width-md`) |
| `--carousel-nav-inset` | Inset of arrow buttons from the viewport edge |
| `--carousel-nav-radius` | Radius of arrow buttons (full circle) |
| `--carousel-dot-size` | Width + height of inactive dot indicators |
| `--carousel-dot-active-width` | Width of active dot (pill shape) |
| `--carousel-dot-bg` | Inactive dot colour |
| `--carousel-dot-bg-hover` | Inactive dot hover colour |
| `--carousel-dot-bg-active` | Active dot colour |
| `--carousel-dot-radius` | Dot border radius (full) |
| `--carousel-dot-gap` | Gap between dot indicators |
| `--carousel-dot-py` | Vertical padding of the controls row |
| `--carousel-autoplay-color` | Autoplay toggle icon colour |
| `--carousel-autoplay-color-hover` | Autoplay toggle icon hover colour |

---

## Accessibility

**Semantic element:** `<section>` with `aria-roledescription="carousel"` and `aria-label`.

**Roles and ARIA:**

| Element | Role / ARIA |
|---|---|
| Root `<section>` | `aria-roledescription="carousel"`, `aria-label={label}`, `aria-busy` when loading |
| Each `<li>` | `role="group"`, `aria-roledescription="slide"`, `aria-label="X of N"`, `aria-hidden` when off-screen |
| Live region `<div>` | `aria-live="polite"`, `aria-atomic="true"` — announces current slide on navigation |
| Track `<ul>` | `aria-live="off"` — suppresses individual child announcements |
| Previous / Next | `<button>` via `Button` atom, `aria-label` from i18n |
| Dot indicators | `<button>`, `aria-label="Go to slide N"`, `aria-current="true"` on active |
| Autoplay toggle | `<button>`, `aria-label` from i18n, `aria-pressed={isPlaying}` |

**Keyboard interaction:**

| Key | Action |
|---|---|
| `ArrowLeft` | Go to previous slide (when carousel section is focused) |
| `ArrowRight` | Go to next slide (when carousel section is focused) |
| `Tab` | Move focus to Previous / Next / Dot / Autoplay controls |
| `Enter` / `Space` | Activate focused button |

**Screen reader announcement flow:**
1. User focuses the `<section>`: "Featured products, carousel"
2. User presses ArrowRight: polite live region announces "2 of 4"
3. User Tabs to Next button: "Next slide, button"
4. User Tabs to dot 2: "Go to slide 2, toggle button, pressed"

---

## i18n

Add overrides via the `i18nStrings` prop or `GeeklegoI18nProvider`:

```tsx
<Carousel
  label="Featured products"
  i18nStrings={{
    previousSlide: 'Vorherige',
    nextSlide: 'Nächste',
    goToSlide: (n) => `Zu Folie ${n}`,
    slideLabel: (n, total) => `${n} von ${total}`,
    pauseAutoPlay: 'Pause',
    resumeAutoPlay: 'Abspielen',
  }}
>
  ...
</Carousel>
```

| Key | Type | Default |
|---|---|---|
| `previousSlide` | `string` | `"Previous slide"` |
| `nextSlide` | `string` | `"Next slide"` |
| `goToSlide` | `(n: number) => string` | `(n) => \`Go to slide ${n}\`` |
| `slideLabel` | `(n: number, total: number) => string` | `(n, total) => \`${n} of ${total}\`` |
| `pauseAutoPlay` | `string` | `"Pause auto-play"` |
| `resumeAutoPlay` | `string` | `"Resume auto-play"` |

---

## Implementation Notes

**Inline `translateX` exception:** The slide track uses an inline `style` prop to set `translateX` for the current slide offset. This is the approved exception to the no-inline-style rule — the offset is a runtime-computed dynamic value that changes on every navigation event and cannot be expressed as a static CSS token. All other visual values (colours, spacing, radius, shadows) use design-system tokens exclusively.

---

## Usage

```tsx
import { Carousel } from '@geeklego/ui';

// Basic — arrows and dots
<Carousel label="Product gallery">
  <Carousel.Slide>
    <img src="/product-1.jpg" alt="Red sneaker — front view" />
  </Carousel.Slide>
  <Carousel.Slide>
    <img src="/product-2.jpg" alt="Red sneaker — side view" />
  </Carousel.Slide>
  <Carousel.Slide>
    <img src="/product-3.jpg" alt="Red sneaker — back view" />
  </Carousel.Slide>
</Carousel>

// Looping autoplay
<Carousel
  label="Hero announcements"
  variant="loop"
  autoPlay
  autoPlayInterval={5000}
  navigation="dots"
>
  ...
</Carousel>

// Multi-slide view
<Carousel label="Related articles" slidesPerView={3} navigation="arrows">
  ...
</Carousel>

// Loading state
<Carousel label="Loading gallery" loading>
  ...
</Carousel>
```
