# Rating

A star-rating atom with two modes: **interactive** (radio group — users can select a value) and **read-only** (image role — displays a committed value). All accessibility semantics are handled by native HTML elements — no ARIA pattern libraries required.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | `0` | Current rating. `0` = unrated. |
| `onChange` | `(value: number) => void` | — | Called on star selection. Required for interactive use. |
| `max` | `number` | `5` | Total number of stars. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Star icon size. |
| `readOnly` | `boolean` | `false` | Static display mode — no interaction. |
| `disabled` | `boolean` | `false` | Disables all inputs at the browser level via `<fieldset disabled>`. Stars are muted. |
| `label` | `string` | `'Rating'` | Accessible label for the radio group `<legend>`. Always present for screen readers. |
| `showLabel` | `boolean` | `false` | When true, the legend is visible above the stars. When false it is `sr-only`. |
| `name` | `string` | auto | Radio group `name` attribute. Auto-generated via `useId()` when omitted. |
| `schema` | `boolean` | `false` | Opt-in Schema.org `AggregateRating` Microdata. Only active when `readOnly={true}`. |
| `className` | `string` | — | Applied to the outer wrapper `<div>`. |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | — | Forwarded to the outer wrapper. |

---

## Tokens Used

| Token | Value | Purpose |
|---|---|---|
| `--rating-star-filled` | `var(--color-status-warning)` | Fill and stroke of selected stars (amber) |
| `--rating-star-empty` | `var(--color-border-default)` | Stroke of unselected stars |
| `--rating-star-disabled` | `var(--color-action-disabled)` | Muted colour in disabled state |
| `--rating-label-color` | `var(--color-text-secondary)` | Legend text colour |
| `--rating-star-size-sm` | `var(--size-icon-sm)` | 16px stars |
| `--rating-star-size-md` | `var(--size-icon-md)` | 20px stars (default) |
| `--rating-star-size-lg` | `var(--size-icon-lg)` | 24px stars |
| `--rating-gap-sm/md` | `var(--spacing-component-xs)` | 4px gap between stars |
| `--rating-gap-lg` | `var(--spacing-component-sm)` | 8px gap between stars |

All tokens adapt automatically across light and dark themes — `--color-status-warning` resolves to amber (#f59e0b) in light mode and a lighter amber (#fcd34d) in dark mode.

---

## Variants

### Interactive (default)

A `<fieldset>` + `<legend>` + radio button group. Each star is a `<label>` wrapping a visually-hidden `<input type="radio">`. Hover previews which stars would be selected before clicking.

```tsx
const [value, setValue] = useState(0);

<Rating value={value} onChange={setValue} label="Rate your experience" showLabel />
```

### Read-only

A `<span role="img">` with an `aria-label` summarising the value. No hover or selection interaction.

```tsx
<Rating value={4} readOnly label="Product rating" />
// SR announces: "4 out of 5 stars"
```

---

## Sizes

| `size` | Star width | Icon token |
|---|---|---|
| `sm` | 16px | `--size-icon-sm` |
| `md` | 20px (default) | `--size-icon-md` |
| `lg` | 24px | `--size-icon-lg` |

---

## States

| State | Visual | Behaviour |
|---|---|---|
| Unrated (`value=0`) | All stars empty (border only) | Hover previews fill |
| Rated | Stars 1–N filled (amber), rest empty | Hover previews new selection |
| Hover preview | Stars 1–N filled (amber) as cursor passes | Click commits the hovered value |
| Read-only | Stars filled/empty, no hover change | Not focusable |
| Disabled | All stars muted (`--color-action-disabled`) | `<fieldset disabled>` — no keyboard/mouse interaction |

---

## Accessibility

### Semantic structure

**Interactive mode:** `<fieldset>` + `<legend>` + `<input type="radio">` — the correct WCAG pattern for a grouped selection control. Screen readers announce the legend label when entering the group, and each star as "N out of M stars, radio button".

**Read-only mode:** `<span role="img" aria-label="4 out of 5 stars">` — treated as a single image by assistive technology. All star icons are `aria-hidden="true"`.

### Keyboard interaction

| Key | Action |
|---|---|
| `Tab` | Move focus into the radio group (focuses the checked star, or first star if none checked) |
| `Arrow Right / Down` | Select the next star |
| `Arrow Left / Up` | Select the previous star |
| `Enter` / `Space` | Select the focused star (same as arrow key in radio groups) |
| `Tab` (again) | Move focus out of the group |

> Native `<input type="radio">` provides arrow-key navigation for free — no JavaScript keyboard handler is needed.

### ARIA attributes

| Attribute | Element | Purpose |
|---|---|---|
| `<legend>` | `<fieldset>` | Group label — always present, visually hidden by default |
| `aria-label="N out of M stars"` | Each `<input>` | Individual star name for screen readers |
| `role="img"` | `<span>` (readOnly) | Treats the star display as a single image |
| `aria-label="N out of M stars"` | `<span>` (readOnly) | Accessible name for the image role |
| `aria-hidden="true"` | `<Star>` icons | Decorative — SR reads the input labels instead |

### Touch targets

Each star `<label>` has `.touch-target` applied, expanding the interactive hit area to — 24×24 px (WCAG 2.5.8) regardless of the `size` prop.

### Colour contrast

- Filled stars: `--color-status-warning` (amber) on background — meets AA contrast against `--color-bg-primary` in all themes.
- Empty stars: `--color-border-default` — decorative only; colour contrast requirement does not apply to decorative elements.
- Disabled stars: `--color-action-disabled` — disabled elements are exempt from contrast requirements (WCAG 1.4.3 exception).

---

## Schema.org

When `readOnly={true}` and `schema={true}`, the component outputs `AggregateRating` Microdata:

```tsx
<Rating value={4} max={5} readOnly schema />
```

Renders:

```html
<span
  role="img"
  aria-label="4 out of 5 stars"
  itemscope
  itemtype="https://schema.org/AggregateRating"
>
  <!-- Star icons (aria-hidden) -->
  <meta itemprop="ratingValue" content="4" />
  <meta itemprop="bestRating" content="5" />
</span>
```

> **Schema.org is suppressed in interactive mode.** An interactive rating input is user-generated data, not committed structured metadata.

---

## Usage

```tsx
import { Rating } from '../atoms/Rating/Rating';

// Interactive — controlled
const [value, setValue] = useState(0);
<Rating value={value} onChange={setValue} label="Rate your experience" />

// With visible label
<Rating value={value} onChange={setValue} label="Overall satisfaction" showLabel />

// Read-only display (e.g. product page)
<Rating value={4.2} readOnly label="Customer rating" />

// Disabled
<Rating value={3} disabled onChange={() => {}} label="Rating locked" />

// Schema.org structured data (product listing)
<Rating value={4} max={5} readOnly schema label="Product rating" />

// Custom star count
<Rating value={7} max={10} onChange={setValue} label="Rate on a scale of 10" showLabel />
```