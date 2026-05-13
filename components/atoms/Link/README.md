# Link

A semantic navigation atom built on the native `<a>` element. Provides four visual variants for different contexts — inline prose, secondary navigation, body text integration, and standalone CTAs — plus optional external link handling.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | — | Navigation URL. Omit when the link is disabled. |
| `variant` | `'default' \| 'subtle' \| 'inline' \| 'standalone'` | `'default'` | Visual style. |
| `size` | `'sm' \| 'md' \| 'lg'` | — | Explicit font size. When omitted, inherits from surrounding context (recommended for inline use). |
| `external` | `boolean` | `false` | Appends an external link icon and sets `target="_blank" rel="noopener noreferrer"`. |
| `disabled` | `boolean` | `false` | Removes `href`, applies muted styles, sets `aria-disabled="true"`, removes from tab order. |
| `children` | `ReactNode` | — | Link label. Use descriptive text — avoid "click here" or "read more". |

All other `<a>` attributes (`className`, `onClick`, `aria-*`, etc.) are forwarded.

---

## Tokens Used

```
--link-text                    → --color-action-primary
--link-text-hover              → --color-action-primary-hover
--link-text-active             → --color-action-primary-active
--link-text-visited            → --color-text-accent
--link-text-disabled           → --color-text-disabled
--link-subtle-text             → --color-text-secondary
--link-subtle-text-hover       → --color-text-primary
--link-subtle-text-active      → --color-text-primary
--link-standalone-text         → --color-action-primary
--link-standalone-text-hover   → --color-action-primary-hover
--link-standalone-text-active  → --color-action-primary-active
--link-gap                     — --spacing-component-xs
--link-label-overflow          — --content-overflow-label
--link-label-whitespace        — --content-whitespace-label
--link-label-text-overflow     — --content-text-overflow-label
```

---

## Variants

| Variant | Use when | Visual treatment |
|---|---|---|
| `default` | General inline links in UI text, form helper text, error messages | Brand color, no underline at rest, underline on hover |
| `subtle` | Secondary navigation, footer links, legal text | Muted secondary color, underline on hover |
| `inline` | Links flowing inside body prose paragraphs | Inherits surrounding text color, always underlined |
| `standalone` | Footer CTAs, card footers, "see all" actions, menu items | Brand color, semibold weight, underline on hover |

---

## Sizes

| Size | Typography class | Use when |
|---|---|---|
| `sm` | `text-body-sm` | Dense UIs, table cells, sidebar footnotes |
| `md` | `text-body-md` | Default paragraph text |
| `lg` | `text-body-lg` | Large body text, hero sections |
| *(omitted)* | inherits | Inline within a parent that already sets font size |

---

## States

| State | Visual treatment |
|---|---|
| Default | Resting color per variant |
| Hover | Text color shifts + underline appears (two-property change) |
| Focus-visible | Focus ring via `.focus-ring`, outline removed |
| Active | Darker text color (brand active shade) |
| Visited | Accent color (`--link-text-visited`) — applies to `default` and `standalone` |
| Disabled | Muted text, no underline, `cursor-not-allowed`, removed from tab order |
| External | Trailing `ExternalLink` icon (12px), `target="_blank"` |

---

## Usage

### Inline in prose

```tsx
<p className="text-body-md">
  Read the <Link href="/docs">full documentation</Link> to get started.
</p>
```

### Inline variant — blends with surrounding text

```tsx
<p className="text-body-md text-[var(--color-text-secondary)]">
  Geeklego is an open-source{' '}
  <Link href="/about" variant="inline">design-system-first</Link>
  {' '}component library.
</p>
```

### External link

```tsx
<Link href="https://tailwindcss.com" external>
  Tailwind CSS
</Link>
// Renders with ExternalLink icon, target="_blank", rel="noopener noreferrer"
// Recommended: also provide aria-label noting new tab
<Link
  href="https://tailwindcss.com"
  external
  aria-label="Tailwind CSS (opens in a new tab)"
>
  Tailwind CSS
</Link>
```

### Disabled link

```tsx
<Link href="/dashboard" disabled>
  Dashboard
</Link>
// href is removed, aria-disabled="true" is set, tabIndex=-1 removes from tab order
```

### Standalone CTA

```tsx
<Link href="/components" variant="standalone" size="md">
  Browse all components →
</Link>
```

### Explicit size

```tsx
// Use only when the link is not in an element that already sets font-size
<Link href="#" size="sm" variant="subtle">Privacy policy</Link>
```

---

## Accessibility

**Semantic element:** `<a href>` — native link role, right-click context menu, browser history integration.

**Keyboard interaction:**

| Key | Action |
|---|---|
| `Tab` | Moves focus to the link |
| `Enter` | Activates the link (navigates) |

**ARIA attributes:**

| Attribute | When applied | Value |
|---|---|---|
| `aria-disabled` | When `disabled={true}` | `"true"` |

**Screen reader notes:**
- `<a href>` has an implicit `link` role — no `role="link"` is added (redundant).
- Disabled links: `href` is removed (anchor loses its link role), `aria-disabled="true"` is set, and `tabIndex={-1}` removes the element from the tab order.
- External links: Screen readers will not automatically announce "opens in new tab". Use `aria-label` to include this information: `aria-label="Page title (opens in a new tab)"`.
- Visited state: The `:visited` pseudo-class applies `--link-text-accent` (accent color), providing a non-color secondary cue (color + different hue) to indicate previously visited destinations.
- Decorative icons (ExternalLink) are wrapped in `aria-hidden="true"` to suppress screen reader announcement.

**Link text guidelines:**
- Use descriptive text that makes sense out of context ("Download the CSS token file", not "click here").
- Screen reader users often navigate via a list of links — vague labels are disorienting.
- For external links, include "(opens in a new tab)" either in the visible label or in `aria-label`.