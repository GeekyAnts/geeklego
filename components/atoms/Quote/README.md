# Quote

A semantic blockquote atom for displaying quoted content with optional attribution and source citation. Uses `<figure>` + `<blockquote>` + `<figcaption>` per the HTML specification — the most semantically correct pattern for quotes with attribution.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'default' \| 'pullquote' \| 'minimal' \| 'card'` | `'default'` | Visual style strategy |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Text scale and internal spacing |
| `children` | `ReactNode` | — | The quoted text. Required. |
| `attribution` | `string` | `undefined` | Name of the person being quoted |
| `source` | `string` | `undefined` | Title of the work being cited (rendered in `<cite>`) |
| `sourceUrl` | `string` | `undefined` | URL of the source — makes the source title a link |
| `cite` | `string` | `undefined` | URL set on the `<blockquote cite>` attribute for assistive technology |
| `className` | `string` | `undefined` | Additional Tailwind classes appended to the root `<figure>` |

Extends `HTMLAttributes<HTMLElement>` — all standard HTML attributes are forwarded to the root `<figure>`.

---

## Tokens Used

| Token | Value | Purpose |
|---|---|---|
| `--quote-border-color` | `var(--color-action-primary)` | Left border accent — default variant |
| `--quote-border-width` | `var(--border-width-thick)` | Left border thickness (4px) |
| `--quote-card-bg` | `var(--color-bg-secondary)` | Card variant background |
| `--quote-card-border-color` | `var(--color-border-subtle)` | Card variant all-sides border |
| `--quote-card-border-width` | `var(--border-container)` | Card variant border thickness (1px) |
| `--quote-card-radius` | `var(--radius-component-md)` | Card variant corner radius |
| `--quote-decoration-color` | `var(--color-action-primary)` | Pullquote opening quote mark colour |
| `--quote-text-color` | `var(--color-text-primary)` | Main quote text |
| `--quote-minimal-text-color` | `var(--color-text-secondary)` | Minimal variant text |
| `--quote-attribution-color` | `var(--color-text-secondary)` | Attribution name |
| `--quote-cite-color` | `var(--color-text-tertiary)` | Source/citation text |
| `--quote-padding-inline-{size}` | component spacing scale | Horizontal padding |
| `--quote-padding-block-{size}` | component spacing scale | Vertical padding |
| `--quote-gap-{size}` | component spacing scale | Gap between blockquote and figcaption |

---

## Variants

### `default`
Left accent border using the primary action colour (`--quote-border-color`). Standard body text. Best for inline editorial use within article content.

### `pullquote`
No border. Large centered text with a decorative opening quotation mark (`"`) in the primary action colour. Text is set in italic. Scaled up typography per size. Ideal for editorial call-outs.

### `minimal`
No border, no background. Secondary text colour with italic styling. Minimal visual weight — best when the quote should blend naturally with surrounding prose.

### `card`
Filled secondary background (`--quote-card-bg`) with a subtle all-around border and rounded corners. Self-contained, card-like presentation. Best for standalone use outside of a prose context.

---

## Sizes

| Size | Quote text | Attribution | Padding |
|---|---|---|---|
| `sm` | `text-body-sm` / `text-heading-h4` (pullquote) | `text-label-xs` | `spacing-component-md` block, `spacing-component-lg` inline |
| `md` | `text-body-md` / `text-heading-h3` (pullquote) | `text-label-sm` | `spacing-component-lg` block, `spacing-component-xl` inline |
| `lg` | `text-body-lg` / `text-heading-h2` (pullquote) | `text-label-md` | `spacing-component-xl` block, `spacing-component-xl` inline |

---

## Usage

```tsx
import { Quote } from 'components/atoms/Quote/Quote';

// Basic
<Quote attribution="Steve Jobs">
  The only way to do great work is to love what you do.
</Quote>

// With source link
<Quote
  attribution="Steve Jobs"
  source="Stanford Commencement Address"
  sourceUrl="https://news.stanford.edu/2005/06/14/jobs-061505/"
  cite="https://news.stanford.edu/2005/06/14/jobs-061505/"
>
  Stay hungry, stay foolish.
</Quote>

// Pullquote
<Quote variant="pullquote" size="lg" attribution="Leonardo da Vinci">
  Simplicity is the ultimate sophistication.
</Quote>

// Card, no attribution
<Quote variant="card">
  Any fool can write code that a computer can understand.
</Quote>
```

---

## Accessibility

### Semantic structure

| Element | Role / Semantics | Notes |
|---|---|---|
| `<figure>` | Groups the quotation with its caption | Implicit `figure` role |
| `<blockquote>` | Marks the quoted content | Native blockquote semantics; `cite` attribute provides the source URL to AT |
| `<figcaption>` | Attribution for the quote | Associated with `<figure>` automatically |
| `<cite>` | Source work title | Communicates the work being cited; not used for person names |
| `<a>` (source link) | Navigates to source | Receives `.focus-ring` on focus-visible |
| Decoration `<span>` | `aria-hidden="true"` | Large `"` mark is purely decorative — hidden from screen readers |

### Screen reader behaviour

- Screen readers announce the `<blockquote>` content and, in most implementations, indicate it is a blockquote.
- The `<figcaption>` provides natural attribution context immediately following the quote.
- Source links include a visible focus ring and the destination is described by the visible link text.
- The decorative opening `"` in pullquote is `aria-hidden` and will not be announced.

### Keyboard interaction

| Key | Behaviour |
|---|---|
| `Tab` | Moves focus to the source link (if present) |
| `Enter` | Follows the source link |

### Checklist

- [x] `<blockquote>` with optional `cite` attribute for AT
- [x] `<figure>` + `<figcaption>` for semantic quote grouping
- [x] `<cite>` wraps source title only (not person names)
- [x] Decorative `"` mark has `aria-hidden="true"`
- [x] Source links have `focus-visible:focus-ring`
- [x] No colour-only differentiation — text hierarchy uses both colour and font size