# Heading

A typography atom that renders semantic heading elements (`<h1>`–`<h6>`) with design-system typography classes and colour tokens. The visual size is intentionally **decoupled from the semantic level** — a `<h3>` can be styled to look like an `<h1>` when the document outline and the visual hierarchy need to diverge.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | `'h2'` | Semantic HTML element rendered. Controls the document outline level. |
| `size` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5'` | matches `as` | Visual typography class. Decoupled from `as` so visual weight can differ from semantic level. `h6` maps to `h5` visually. |
| `responsive` | `boolean` | `false` | Apply responsive typography class that scales font size down on smaller viewports. Responsive variants exist for `h1`–`h4`; `h5` always uses its static class. |
| `color` | `'primary' \| 'secondary' \| 'tertiary' \| 'accent' \| 'inverse'` | `'primary'` | Text colour from the semantic token palette. Adapts automatically across light and dark themes. |
| `className` | `string` | — | Additional classes merged onto the element. |
| `children` | `ReactNode` | — | Heading text content. |
| `...rest` | `HTMLAttributes<HTMLHeadingElement>` | — | All native heading attributes (`id`, `aria-labelledby`, etc.) are forwarded. |

---

## Tokens Used

Heading is a **passthrough atom** — all visual styling comes from existing utility classes in `geeklego.css`. No component-specific token block is needed.

### Typography utility classes

| `size` value | Static class | Responsive class | Font size | Weight |
|---|---|---|---|---|
| `h1` | `.text-heading-h1` | `.text-heading-h1-responsive` | 36px | Bold |
| `h2` | `.text-heading-h2` | `.text-heading-h2-responsive` | 32px | Bold |
| `h3` | `.text-heading-h3` | `.text-heading-h3-responsive` | 28px | Semibold |
| `h4` | `.text-heading-h4` | `.text-heading-h4-responsive` | 24px | Semibold |
| `h5` | `.text-heading-h5` | `.text-heading-h5` (no responsive variant) | 20px | Semibold |

### Colour utility classes

| `color` value | Class | Semantic token |
|---|---|---|
| `primary` | `.text-primary` | `--color-text-primary` |
| `secondary` | `.text-secondary` | `--color-text-secondary` |
| `tertiary` | `.text-tertiary` | `--color-text-tertiary` |
| `accent` | `.text-accent` | `--color-text-accent` |
| `inverse` | `.text-inverse` | `--color-text-inverse` |

---

## Variants

### Levels

All six semantic heading elements are supported. The visual scale follows the design system type ramp:

```tsx
<Heading as="h1">Page title (36px bold)</Heading>
<Heading as="h2">Section heading (32px bold)</Heading>
<Heading as="h3">Sub-section (28px semibold)</Heading>
<Heading as="h4">Card title (24px semibold)</Heading>
<Heading as="h5">Label heading (20px semibold)</Heading>
<Heading as="h6">Caption heading (shares h5 scale)</Heading>
```

### Visual/semantic decoupling

Use `size` to override the visual weight without changing the document outline:

```tsx
{/* Semantically h3, visually as large as h1 — useful for hero sub-headings */}
<Heading as="h3" size="h1">Hero-weight sub-section</Heading>

{/* Semantically h2, compact visual weight — works in dense UIs */}
<Heading as="h2" size="h5">Compact-weight section heading</Heading>
```

### Responsive

Apply the `-responsive` typography variant to have font size scale down automatically on smaller viewports:

```tsx
<Heading as="h1" responsive>Scales from 36px — 28px on mobile</Heading>
```

### Colours

```tsx
<Heading color="primary">Primary — default</Heading>
<Heading color="secondary">Secondary — supporting text</Heading>
<Heading color="accent">Accent — key content callout</Heading>
<Heading color="inverse">Inverse — on dark backgrounds</Heading>
```

---

## Sizes

| Size | Font size | Font weight | Letter spacing |
|---|---|---|---|
| `h1` | 36px (`--font-size-36`) | Bold | Tight |
| `h2` | 32px (`--font-size-32`) | Bold | Tight |
| `h3` | 28px (`--font-size-28`) | Semibold | Tight |
| `h4` | 24px (`--font-size-24`) | Semibold | Tight |
| `h5` | 20px (`--font-size-20`) | Semibold | Tight |

---

## Accessibility

### Semantic element

The `as` prop controls the HTML element (`<h1>`–`<h6>`), which determines the heading's position in the document outline. Screen readers and assistive technologies navigate pages by heading hierarchy.

**Rules:**
- Use exactly **one `<h1>` per page** — this is the page title.
- **Never skip heading levels.** A page structure of `h1 — h3` is invalid; `h1 — h2 — h3` is correct.
- The `size` prop does not affect the heading level announced by screen readers — only `as` does.

### Keyboard interaction

Heading elements are not interactive and do not receive focus. No keyboard interaction applies.

### ARIA

| Pattern | Usage |
|---|---|
| `id` on heading + `aria-labelledby` on section | Associates a `<section>` with its heading as the accessible name. |
| Heading sequence | Must be sequential — do not jump from `h2` to `h4`. |

```tsx
<section aria-labelledby="section-title">
  <Heading as="h2" id="section-title">Section title</Heading>
  <p>Section content</p>
</section>
```

### Screen reader announcement

Headings are announced with their level: "Section heading, level 2". The visual size has no effect on the announcement.

### Colour contrast

All colour options meet WCAG 2.2 AA contrast requirements in light and dark modes:
- `primary`, `secondary`, `accent` — ≥ 4.5:1 against their respective backgrounds.
- `tertiary` — meets AA against the default background; verify contrast when used on non-default backgrounds.
- `inverse` — intended for use on `--color-bg-inverse` surfaces; use only in that context.

---

## Usage

```tsx
import { Heading } from '../atoms/Heading/Heading';

// Basic
<Heading as="h2">Section title</Heading>

// Decoupled size
<Heading as="h3" size="h1">Visually large, semantically h3</Heading>

// Responsive
<Heading as="h1" responsive>Scales on mobile</Heading>

// Colour
<Heading as="h2" color="accent">Accent heading</Heading>

// With section labelling
<section aria-labelledby="my-section">
  <Heading as="h2" id="my-section">Section title</Heading>
</section>
```