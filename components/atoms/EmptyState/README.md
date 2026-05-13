# EmptyState

Displays a centred placeholder when content is absent or unavailable — empty lists, no search results, first-time onboarding, or error states.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | **Required.** Main empty-state message. Rendered as a `<p>` — no heading level assumed. |
| `description` | `string` | — | Secondary explanatory text. |
| `icon` | `ReactNode` | — | Icon or illustration slot. Wrapped in `aria-hidden` — decorative only. |
| `action` | `ReactNode` | — | CTA slot. Pass a `<Button>` or any interactive element. |
| `variant` | `'default' \| 'ghost'` | `'default'` | Visual treatment. See Variants. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Controls padding, icon size, and typography scale. |
| `className` | `string` | — | Additional Tailwind classes on the root `<div>`. |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | — | All native `<div>` attributes (including `role`, `aria-*`). |

---

## Tokens Used

| Token | Value | Purpose |
|---|---|---|
| `--empty-state-radius` | `var(--radius-component-lg)` | Border radius on the `default` variant |
| `--empty-state-border-width` | `var(--border-interactive)` | 1px border on the `default` variant |
| `--empty-state-default-bg` | `var(--color-bg-secondary)` | Muted background for `default` variant |
| `--empty-state-default-border` | `var(--color-border-default)` | Subtle border for `default` variant |
| `--empty-state-ghost-bg` | `transparent` | No background for `ghost` variant |
| `--empty-state-icon-color` | `var(--color-text-tertiary)` | Icon tint |
| `--empty-state-icon-size-{sm\|md\|lg}` | `--size-icon-{lg\|xl\|2xl}` | Icon container size |
| `--empty-state-padding-{sm\|md\|lg}` | Component / layout spacing | Internal padding |
| `--empty-state-icon-gap-{sm\|md\|lg}` | Component spacing | Gap between icon and text block |
| `--empty-state-content-gap-{sm\|md\|lg}` | Component spacing | Gap between title and description |
| `--empty-state-action-gap-{sm\|md\|lg}` | Component spacing | Gap above the action slot |
| `--empty-state-title-color` | `var(--color-text-primary)` | Title text colour |
| `--empty-state-description-color` | `var(--color-text-secondary)` | Description text colour |

---

## Variants

| Variant | Appearance | When to use |
|---|---|---|
| `default` | Subtle border + muted background, rounded corners | Inside cards, panels, or data containers |
| `ghost` | Borderless, transparent background | On plain page backgrounds or as a full-section placeholder |

---

## Sizes

| Size | Padding | Icon | Title typography | Description typography |
|---|---|---|---|---|
| `sm` | `--spacing-component-xl` | `--size-icon-lg` (24px) | `text-body-md` (16px) | `text-body-xs` (12px) |
| `md` | `--spacing-layout-sm` | `--size-icon-xl` (32px) | `text-heading-h5` (20px semibold) | `text-body-sm` (14px) |
| `lg` | `--spacing-layout-md` | `--size-icon-2xl` (48px) | `text-heading-h4` (24px semibold) | `text-body-md` (16px) |

---

## Usage

### Minimal

```tsx
<EmptyState title="No items found" />
```

### With description and icon

```tsx
import { SearchX } from 'lucide-react';

<EmptyState
  title="No results"
  description="Try adjusting your filters to find what you're looking for."
  icon={<SearchX size="var(--empty-state-icon-size-md)" />}
/>
```

### With action CTA

```tsx
import { FilePlus } from 'lucide-react';
import { Button } from '../../atoms/Button';

<EmptyState
  title="No projects yet"
  description="Create a project to start collaborating with your team."
  icon={<FilePlus size="var(--empty-state-icon-size-md)" />}
  action={<Button onClick={handleCreate}>Create project</Button>}
/>
```

### Dynamic — announce to assistive technology

When the empty state is **inserted dynamically** (e.g. after clearing a search), add `role="status"` so screen readers announce it:

```tsx
<EmptyState
  role="status"
  title="No results"
  description="Your search returned no matches."
/>
```

### Ghost variant on a plain background

```tsx
<EmptyState
  variant="ghost"
  title="Unable to load"
  description="Check your internet connection and try again."
  icon={<CloudOff size="var(--empty-state-icon-size-md)" />}
/>
```

---

## Accessibility

### Semantic structure

| Element | Role | Notes |
|---|---|---|
| Root `<div>` | Generic container | No implicit ARIA role. Add `role="status"` for dynamic insertions. |
| Icon `<div>` | `aria-hidden="true"` | Purely decorative — never announced. |
| Title `<p>` | Paragraph | Avoids heading-level assumptions. Consumers control the heading hierarchy. |
| Description `<p>` | Paragraph | Secondary information, announced after title. |
| Action slot | Varies | Each interactive element (button, link) carries its own accessible name. |

### Keyboard interaction

| Key | Behaviour |
|---|---|
| `Tab` | Moves focus to the interactive element in the `action` slot (if present). |
| `Enter` / `Space` | Activates the focused action element (button behaviour). |

EmptyState itself is not focusable. Only elements inside the `action` slot receive focus.

### Screen reader tips

- The icon is wrapped in `aria-hidden="true"` and is not announced.
- Pass a descriptive `aria-label` on the action button when the button text alone is ambiguous: `aria-label="Create your first project"`.
- For dynamically-rendered empty states (replacing content after a search or filter), use `role="status"` on the `<EmptyState>` so assistive technology announces the appearance without interrupting the user.

---

## Schema.org

Not applicable. EmptyState is a UI placeholder pattern with no semantic entity mapping.