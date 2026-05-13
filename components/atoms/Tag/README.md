# Tag

A categorisation label for metadata, keywords, and taxonomy. Tags classify content — unlike Badge (status indicator) or Chip (interactive filter/toggle).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'solid' \| 'soft' \| 'outline'` | `'soft'` | Visual treatment |
| `color` | `'default' \| 'brand' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Category colour intent |
| `size` | `'sm' \| 'md'` | `'md'` | Height and typography scale |
| `href` | `string` | — | Renders as `<a>` linking to a filtered view. Mutually exclusive with `onRemove`. |
| `leftIcon` | `ReactNode` | — | Optional leading icon |
| `onRemove` | `(e: MouseEvent) => void` | — | Shows remove button. Mutually exclusive with `href`. |
| `i18nStrings` | `TagI18nStrings` | — | i18n overrides for system text |
| `children` | `ReactNode` | — | Tag label content |

Extends `HTMLAttributes<HTMLElement>`.

## Tokens Used

| Token | Purpose |
|-------|---------|
| `--tag-height-{sm,md}` | Component height |
| `--tag-px-{sm,md}` | Horizontal padding |
| `--tag-gap` | Gap between icon, label, remove |
| `--tag-radius` | Border radius |
| `--tag-{variant}-{color}-{bg,text,border}` | Variant + colour combinations |
| `--tag-bg-hover` | Hover background for linked tags |
| `--tag-remove-color` | Remove button colour |
| `--tag-remove-color-hover` | Remove button hover colour |
| `--tag-remove-size-{sm,md}` | Remove icon size per tag size |
| `--tag-label-*` | Content flexibility tokens |

## Variants

| Variant | Visual approach |
|---------|-----------------|
| **Solid** | Filled background, high-contrast text |
| **Soft** | Tinted background matching colour intent |
| **Outline** | Transparent background, coloured border |

## Sizes

| Size | Height | Typography |
|------|--------|------------|
| `sm` | 20px | `text-button-xs` |
| `md` | 24px | `text-button-sm` |

## States

| State | Description |
|-------|-------------|
| Default | Static label — `<span>` |
| Linked | Navigable category link — `<a>` with hover effect |
| Removable | Dismissible tag — `<span>` with internal `<button>` |
| With icon | Leading icon via `leftIcon` prop |

## Accessibility

- **Semantic element:** `<span>` (static/removable), `<a>` (linked)
- **Role:** No explicit role needed — native semantics are correct
- **ARIA attributes:**
  - `aria-label` for additional context when needed
  - `aria-hidden="true"` on leading icon wrapper (decorative)
  - Remove button has `aria-label` (default: "Remove", i18n-configurable)
- **Keyboard interaction:**
  - Linked tags: focusable via Tab, activated with Enter
  - Remove button: focusable via Tab, activated with Enter/Space
  - Static tags: not focusable (no interaction)
- **Screen reader announcement:**
  - Static: label text read inline
  - Linked: "[label], link"
  - Removable: "[label]" then "Remove, button" on the internal button
- **Contrast:** All variant/colour combinations meet WCAG 2.2 AA minimum contrast ratio

## Usage

```tsx
import { Tag } from '@geeklego/ui';

// Static category label
<Tag color="brand">React</Tag>

// Linked to category page
<Tag color="info" href="/topics/design-systems">Design Systems</Tag>

// Removable tag
<Tag color="success" onRemove={(e) => handleRemove('typescript')}>TypeScript</Tag>

// With leading icon
<Tag color="default" leftIcon={<Hash size="var(--size-icon-xs)" />}>Topic</Tag>

// Wrap removable tags in a list for AT
<div role="list">
  <span role="listitem"><Tag onRemove={...}>React</Tag></span>
  <span role="listitem"><Tag onRemove={...}>Vue</Tag></span>
</div>
```
