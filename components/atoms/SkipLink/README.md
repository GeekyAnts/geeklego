# SkipLink

An accessibility navigation link that allows keyboard and assistive technology users to bypass repeated blocks of content (such as the site header or main navigation) and jump directly to a target landmark on the page.

Satisfies **WCAG 2.1 SC 2.4.1 — Bypass Blocks (Level A)**.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | — | **Required.** Fragment pointing to the target landmark (e.g. `"#main-content"`). Must match the `id` of a DOM element. |
| `size` | `'sm' \| 'md'` | `'md'` | Height, padding, and typography scale. |
| `forceVisible` | `boolean` | `false` | Forces the visible state regardless of focus. Use only in Storybook, tests, and accessibility audits — never in production. |
| `children` | `ReactNode` | `'Skip to main content'` | Visible label text. Override for multi-skip-link patterns. |
| `...rest` | `AnchorHTMLAttributes<HTMLAnchorElement>` | — | All native anchor attributes pass through (`onClick`, `rel`, `target`, `data-*`, `aria-*`, etc.). |

---

## Tokens Used

| Token | Semantic | Purpose |
|---|---|---|
| `--skip-link-offset` | `--spacing-component-lg` | Distance from the container's top-left edge when visible |
| `--skip-link-z` | `--layer-popover` | z-index (600) — above all page content |
| `--skip-link-bg` | `--color-action-primary` | Background — light | dark | action primary blue for maximum contrast |
| `--skip-link-text` | `--color-text-inverse` | Label text |
| `--skip-link-border-width` | `--border-focus-ring` | Border width (2px) |
| `--skip-link-border-color` | `--color-action-primary` | Border color matches background (cohesive fill) |
| `--skip-link-radius` | `--radius-component-md` | Border radius |
| `--skip-link-shadow` | `--shadow-lg` (light/dark) · `--shadow-lg` | Overlay-level shadow when visible |
| `--skip-link-height-md` | `--size-component-md` | Height at size md |
| `--skip-link-height-sm` | `--size-component-sm` | Height at size sm |
| `--skip-link-py-md/sm` | `--spacing-component-sm/xs` | Vertical padding |
| `--skip-link-px-md/sm` | `--spacing-component-lg/md` | Horizontal padding |

---

## Sizes

| Size | Height | V-Padding | H-Padding | Typography |
|---|---|---|---|---|
| `sm` | `--size-component-sm` (28px) | `--spacing-component-xs` (4px) | `--spacing-component-md` (12px) | `text-button-sm` |
| `md` | `--size-component-md` (36px) | `--spacing-component-sm` (8px) | `--spacing-component-lg` (16px) | `text-button-md` |

---

## Placement Guide

**The SkipLink must be the first focusable element in the DOM**, placed before `<header>` or any navigation. Keyboard users encounter it on their first Tab press.

```tsx
// Correct — first element inside <body>
<body>
  <SkipLink href="#main-content" />
  <header>...</header>
  <main id="main-content" tabIndex={-1}>
    ...
  </main>
</body>
```

**Target elements require `tabIndex={-1}`** if they are not naturally focusable (i.e. not a link or form control). Without this, the href anchor scroll works visually but assistive technology does not move focus to the target.

```tsx
// Correct
<main id="main-content" tabIndex={-1}>...</main>

// Will scroll but won't move AT focus
<main id="main-content">...</main>
```

**The component uses `position: absolute`**, so it positions from the nearest positioned ancestor. In most cases, the SkipLink should be a direct child of `<body>` (which is position `static` by default — `position: absolute` then positions from the viewport). If placed inside a `position: relative` container, the link appears relative to that container instead.

> If you need viewport-relative positioning regardless of DOM nesting, override with `className="!fixed"`.

---

## Multi-Skip-Link Pattern

Multiple skip links let keyboard users navigate to different regions efficiently. Place all of them at the top of the DOM in sequence.

```tsx
<SkipLink href="#main-content">Skip to main content</SkipLink>
<SkipLink href="#main-nav">Skip to navigation</SkipLink>
<SkipLink href="#search">Skip to search</SkipLink>

<header>...</header>
<nav id="main-nav" tabIndex={-1} aria-label="Primary">...</nav>
<section id="search" tabIndex={-1}>...</section>
<main id="main-content" tabIndex={-1}>...</main>
```

Each link is hidden until tabbed to. Users pressing Tab twice reach the second skip link, and so on.

---

## `forceVisible` Prop

When `true`, applies `.skip-link--force-visible` which overrides the transform that hides the link. **Never use in production** — only in:

- Storybook stories
- Vitest / Playwright snapshot tests
- Accessibility audits and design reviews

---

## Accessibility

### Semantic element

`<a href="...">` — a native hyperlink. Keyboard users activate it with **Enter**. Screen readers announce it as a link with the text content as its accessible name.

### ARIA

No ARIA attributes are needed. The link's text content is its accessible name. There is no `aria-label` because the visible label text is already descriptive.

### Keyboard interaction

| Key | Action |
|---|---|
| `Tab` | Move focus to the skip link (the link slides into view) |
| `Enter` | Follow the `href` to the target landmark; AT focus moves to the target |
| `Tab` (again) | Move focus past the skip link to the next focusable element |

### WCAG compliance

| Criterion | Level | Status |
|---|---|---|
| 2.4.1 Bypass Blocks | A | — Provides a mechanism to skip repeated navigation |
| 2.4.7 Focus Visible | AA | — Focus ring appears when focused |
| 1.4.3 Contrast (Minimum) | AA | — `--color-action-primary` / `--color-text-inverse` pair is verified for contrast |
| 2.5.3 Label in Name | A | — Accessible name matches visible text |

### Windows High Contrast

In forced colors mode, `background-color` maps to `ButtonFace` and the `border` maps to `ButtonText`. The link remains visible due to the border outline. The focus ring from `.focus-ring` is preserved globally via the Geeklego forced-colors override in `geeklego.css`.

### Reduced motion

The slide-in `transform` transition respects `prefers-reduced-motion`. The global `@media (prefers-reduced-motion: reduce)` block in `geeklego.css` collapses all transition durations to `0.01ms`, so the link appears instantly without animation.

---

## Usage

### Minimal

```tsx
import { SkipLink } from '@/components/atoms/SkipLink/SkipLink';

// Inside your root layout, before <header>
<SkipLink href="#main-content" />

// Target element
<main id="main-content" tabIndex={-1}>
  {children}
</main>
```

### Custom label

```tsx
<SkipLink href="#dashboard-content">Skip to dashboard</SkipLink>
```

### Small size

```tsx
<SkipLink href="#main-content" size="sm" />
```