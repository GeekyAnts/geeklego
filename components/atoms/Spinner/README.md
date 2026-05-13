# Spinner

An animated loading indicator that communicates an in-progress state. Renders as a `role="status"` live region so screen readers announce the loading label automatically.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'default' \| 'inverse'` | `'default'` | Visual style — see Variants section |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Spinner diameter — see Sizes section |
| `label` | `string` | `'Loading…'` | Accessible label announced by screen readers (visually hidden) |
| `className` | `string` | — | Additional class names applied to the wrapper `<div>` |
| `aria-label` | `string` | — | Overrides the `label` prop for SR announcements when you need a more descriptive string |
| `...rest` | `HTMLDivElement` attrs | — | All other `<div>` attributes forwarded to the wrapper |

---

## Tokens Used

| Token | Value | Purpose |
|---|---|---|
| `--spinner-default-color` | `--color-action-primary` | Arc colour for `default` variant |
| `--spinner-inverse-color` | `--color-text-inverse` | Arc colour for `inverse` variant |

Size dimensions come from the icon size scale primitives (`--size-icon-sm` through `--size-icon-2xl`), following the same pattern as other icon-bearing atoms.

---

## Variants

Each variant uses a fundamentally different visual strategy:

| Variant | Strategy | When to use |
|---|---|---|
| `default` | Coloured arc + faint ring track (opacity-20) | Page/content loading on neutral surfaces |
| `inverse` | White arc + faint ring track (opacity-20) | On coloured or dark backgrounds (inside primary buttons, dark overlays) |

---

## Sizes

| Size | Diameter | Icon scale |
|---|---|---|
| `xs` | 16px | `--size-icon-sm` |
| `sm` | 20px | `--size-icon-md` |
| `md` | 24px | `--size-icon-lg` (default) |
| `lg` | 32px | `--size-icon-xl` |
| `xl` | 48px | `--size-icon-2xl` |

---

## Usage

```tsx
import { Spinner } from '@/components/atoms/Spinner/Spinner';

// Basic
<Spinner />

// With explicit label
<Spinner label="Uploading file…" />

// Inside a loading button
<button disabled aria-busy="true">
  <Spinner size="xs" variant="default" label="Submitting form" />
  <span>Submit</span>
</button>

// On a dark/colored background
<div className="bg-[var(--color-action-primary)] p-4">
  <Spinner variant="inverse" size="lg" label="Loading dashboard" />
</div>

// Large page-level loader
<div role="region" aria-label="Page loading" className="flex items-center justify-center min-h-64">
  <Spinner size="xl" label="Loading page content" />
</div>
```

---

## Accessibility

### Semantic element
`<div role="status">` — a polite ARIA live region. Screen readers will announce its content when it appears or changes without requiring focus.

### ARIA attributes
| Attribute | Behaviour |
|---|---|
| `role="status"` | Polite live region — SR announces `label` when spinner mounts |
| `aria-label` | Pass to the `<Spinner>` to override the `label` prop with a more descriptive string |
| `aria-hidden="true"` | Applied to the `<svg>` — the visual ring is decorative; the SR label is in the `<span>` |

### Keyboard interaction

Spinner is a non-interactive element — it receives no focus and has no keyboard interaction.

| Key | Action |
|---|---|
| — | No keyboard interaction |

### Screen reader announcement
The visually-hidden `<span>` inside `role="status"` is announced politely when the spinner mounts. Use the `label` prop to provide a contextually meaningful message (e.g., `"Uploading 3 of 5 files"` rather than just `"Loading…"`).

### Reduced motion
When `prefers-reduced-motion: reduce` is active, the global geeklego CSS collapses the animation duration to 0.01ms, effectively rendering the spinner as a static arc. The `role="status"` label continues to communicate the loading state.

---

## Schema.org

No applicable Schema.org type for a loading indicator. The `schema` prop is not supported.