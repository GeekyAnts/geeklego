# Footer

Page-level `<footer>` landmark component (`contentinfo` role). Composed of three compound slots — **Brand**, **Nav**, and **Legal** — arranged in a responsive flex-wrap layout. Brand and Nav columns flow horizontally on larger viewports and stack on mobile. The Legal bar always spans full width with a top border.

---

## Usage

```tsx
import { Footer } from './Footer';
import { Link } from '../../atoms/Link/Link';

<Footer>
  <Footer.Brand href="/" tagline="Design system for humans.">
    <img src="/logo.svg" alt="" aria-hidden="true" />
    <span>Geeklego</span>
  </Footer.Brand>

  <Footer.Nav heading="Product" navAriaLabel="Product navigation">
    <Link href="/features" variant="subtle" size="sm">Features</Link>
    <Link href="/pricing" variant="subtle" size="sm">Pricing</Link>
    <Link href="/docs" variant="subtle" size="sm">Documentation</Link>
  </Footer.Nav>

  <Footer.Nav heading="Company" navAriaLabel="Company navigation">
    <Link href="/about" variant="subtle" size="sm">About</Link>
    <Link href="/contact" variant="subtle" size="sm">Contact</Link>
  </Footer.Nav>

  <Footer.Legal>
    <p>© 2026 Geeklego. All rights reserved.</p>
    <Link href="/privacy" variant="subtle" size="sm">Privacy Policy</Link>
  </Footer.Legal>
</Footer>
```

---

## Props

### `<Footer>` (root)

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Padding and vertical rhythm scale |
| `schema` | `boolean` | `false` | Enable Schema.org WPFooter Microdata |
| `i18nStrings` | `FooterI18nStrings` | — | Per-instance i18n string overrides |
| `className` | `string` | — | Additional CSS classes on `<footer>` |
| `children` | `ReactNode` | — | Footer.Brand, Footer.Nav columns, Footer.Legal |
| ...rest | `HTMLAttributes<HTMLElement>` | — | Spread onto `<footer>` |

### `<Footer.Brand>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | `'#'` | URL for the brand link (passed through `sanitizeHref`) |
| `tagline` | `string` | — | Optional tagline below the brand content |
| `children` | `ReactNode` | — | Logo image, brand name text, or icon |
| `className` | `string` | — | Additional classes on the wrapper `<div>` |

### `<Footer.Nav>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `heading` | `string` | — | Column heading text **(required)** |
| `headingLevel` | `'h2' \| 'h3' \| 'h4' \| 'h5'` | `'h3'` | HTML heading element for the column title |
| `navAriaLabel` | `string` | i18n `navLabel` | Unique `aria-label` for the `<nav>` landmark. **Must be unique per column.** |
| `children` | `ReactNode` | — | Link components — each child is auto-wrapped in `<li>` |
| `className` | `string` | — | Additional classes on the `<nav>` element |

### `<Footer.Legal>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Copyright text, legal links, social links |
| `className` | `string` | — | Additional classes on the wrapper `<div>` |

---

## Sizes

| Size | Padding | Rhythm |
|---|---|---|
| `sm` | `--spacing-layout-sm` | Compact — dense sidebar footer, narrow layouts |
| `md` | `--spacing-layout-md` | Standard — default for most pages |
| `lg` | `--spacing-layout-lg` | Spacious — marketing / landing pages |

---

## Responsive Layout

| Viewport | Brand | Nav columns |
|---|---|---|
| Mobile (`< sm`) | Full width | Each column wraps to its own row |
| Tablet (`sm+`) | Auto width, inline | 2+ columns fit per row |
| Desktop (`lg+`) | Auto width, inline | All columns on one row |

Footer.Legal always takes `basis-full` — it wraps to its own row regardless of viewport, and is visually separated by a top border.

---

## Tokens Used

| Token | Value | Purpose |
|---|---|---|
| `--footer-bg` | `var(--color-bg-secondary)` | Footer background |
| `--footer-border-color` | `var(--color-border-subtle)` | Top border |
| `--footer-shadow` | `none` | Shadow (flat in all modes) |
| `--footer-min-width` | `var(--content-min-width-md)` | Min-width guard |
| `--footer-px-{sm\|md\|lg}` | layout spacing | Horizontal padding by size |
| `--footer-py-{sm\|md\|lg}` | layout spacing | Vertical padding by size |
| `--footer-columns-gap` | `var(--spacing-layout-sm)` | Gap between columns |
| `--footer-brand-text-color` | `var(--color-text-primary)` | Brand link text |
| `--footer-brand-tagline-color` | `var(--color-text-tertiary)` | Tagline text |
| `--footer-brand-gap` | `var(--spacing-component-sm)` | Brand icon + text gap |
| `--footer-brand-min-width` | `var(--content-min-width-xs)` | Brand column floor |
| `--footer-nav-heading-color` | `var(--color-text-secondary)` | Column heading text |
| `--footer-nav-heading-gap` | `var(--spacing-component-xl)` | Gap between heading and link list |
| `--footer-nav-link-gap` | `var(--spacing-component-md)` | Gap between nav links |
| `--footer-nav-min-width` | `var(--content-min-width-xs)` | Nav column floor |
| `--footer-legal-border-color` | `var(--color-border-subtle)` | Legal bar top border |
| `--footer-legal-pt` | `var(--spacing-component-xl)` | Legal bar top padding |
| `--footer-legal-text-color` | `var(--color-text-secondary)` | Legal text |
| `--footer-legal-gap` | `var(--spacing-component-xl)` | Legal bar internal gap |

---

## Schema.org

Footer supports opt-in `WPFooter` structured data.

| Schema.org type | `schema` prop | Element |
|---|---|---|
| [`WPFooter`](https://schema.org/WPFooter) | `schema={true}` | `<footer>` gets `itemScope` + `itemType` |

```tsx
<Footer schema={true}>
  {/* compound slots */}
</Footer>

<!-- Rendered HTML (excerpt) -->
<footer
  itemscope
  itemtype="https://schema.org/WPFooter"
  aria-label="Footer"
>
  ...
</footer>
```

---

## Accessibility

### Semantic element
`<footer>` — implicit `contentinfo` landmark role when a direct child of `<body>`. No `role` attribute needed.

### ARIA attributes

| Attribute | Element | Value |
|---|---|---|
| `aria-label` | `<footer>` | i18n `footerLabel` (default: `"Footer"`) |
| `aria-label` | each `<nav>` in Footer.Nav | `navAriaLabel` prop or i18n `navLabel` |

> **Important:** When rendering multiple `Footer.Nav` columns, always provide a unique `navAriaLabel` to each one. Otherwise, all `<nav>` landmarks share the same accessible name, which makes them indistinguishable in the browser's landmark navigation.

### Heading hierarchy

Footer.Nav renders a heading (`h3` by default) for each column. This is correct when the `<footer>` follows page sections that use `h2`. Override with the `headingLevel` prop when the page structure requires a different level.

### Link safety

All `href` values in `Footer.Brand` are passed through `sanitizeHref()` automatically. This strips `javascript:`, `vbscript:`, and `data:text/html` protocols.

External links in `Footer.Nav` (via `Link` atom with `external={true}`) automatically receive `rel="noopener noreferrer"` and a visually-hidden "(opens in new tab)" cue.

### Keyboard interaction

| Key | Behaviour |
|---|---|
| `Tab` | Moves through all focusable links in document order |
| `Enter` / `Space` | Follows the focused link |

The footer contains no disclosure controls or composite widgets — all focus management is provided natively by the browser.

### Screen reader announcement

When the `<footer>` is a top-level landmark (direct child of `<body>`), screen readers announce it as **"Footer"** (or the value of `aria-label`). Users can jump to it directly using landmark navigation shortcuts (e.g., `F6` in NVDA, `R` in VoiceOver).

---

## i18n

| Key | Default | Usage |
|---|---|---|
| `footerLabel` | `"Footer"` | `aria-label` on the `<footer>` landmark |
| `navLabel` | `"Footer navigation"` | Default `aria-label` on each Footer.Nav `<nav>` (overridden by `navAriaLabel` prop) |

```tsx
// Via GeeklegoI18nProvider (global)
<GeeklegoI18nProvider strings={{ footer: { footerLabel: 'Pied de page', navLabel: 'Navigation du pied de page' } }}>
  <Footer>...</Footer>
</GeeklegoI18nProvider>

// Via i18nStrings prop (per-instance)
<Footer i18nStrings={{ footerLabel: 'Pied de page' }}>...</Footer>
```
