# Card

A versatile surface container that groups related content and actions. Card ships as a compound component with three named slot sub-components — `Card.Header`, `Card.Body`, and `Card.Footer` — which may be composed freely or used individually.

Each slot owns its own padding. The Card root is a pure surface container (border, radius, shadow, background) with no padding of its own.

---

## Import

```tsx
import { Card } from 'components/molecules/Card/Card';
// or destructure slots:
import { Card, CardHeader, CardBody, CardFooter } from 'components/molecules/Card/Card';
```

---

## Usage

```tsx
import { Card } from '../Card/Card';
import { Button } from '../../atoms/Button/Button';

<Card variant="elevated">
  <Card.Header
    title="Project Update"
    description="Last modified 2 hours ago"
    action={<Button variant="ghost" size="sm">View all</Button>}
  />
  <Card.Body>
    <p>Your content here.</p>
  </Card.Body>
  <Card.Footer>
    <Button variant="outline" size="sm">Cancel</Button>
    <Button variant="primary" size="sm">Confirm</Button>
  </Card.Footer>
</Card>
```

### Interactive card (entire surface is clickable)

```tsx
<Card
  variant="elevated"
  interactive
  role="button"
  aria-label="Navigate to project details"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  <Card.Header title="Clickable Card" />
  <Card.Body>Content…</Card.Body>
</Card>
```

### Custom slot content

When `children` is passed to `Card.Header` without a `title`, the children replace the default layout entirely:

```tsx
<Card.Header>
  <p className="text-label-sm text-[var(--color-text-tertiary)]">Custom header content</p>
</Card.Header>
```

---

## Props

### Card

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'elevated' \| 'outlined' \| 'filled' \| 'ghost'` | `'elevated'` | Visual style of the card surface |
| `interactive` | `boolean` | `false` | Adds hover/focus states — use when the entire card is a clickable target |
| `className` | `string` | — | Additional classes merged onto the root element |
| `children` | `ReactNode` | — | Card content — compose with slot sub-components |
| ...rest | `HTMLAttributes<HTMLDivElement>` | — | All native div attributes forwarded |

### Card.Header

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Primary heading of the card. |
| `description` | `string` | — | Supporting description rendered below the title. |
| `action` | `ReactNode` | — | Right-aligned action slot — pass a `Button` atom. |
| `children` | `ReactNode` | — | When provided without `title`, replaces the default layout entirely. |
| ...rest | `HTMLAttributes<HTMLElement>` | — | All native header attributes forwarded |

### Card.Body

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Main content area. Grows to fill available space. |
| ...rest | `HTMLAttributes<HTMLDivElement>` | — | All native div attributes forwarded |

### Card.Footer

| Prop | Type | Default | Description |
|---|---|---|---|
| `border` | `boolean` | `true` | Renders a top border divider between body and footer. |
| `children` | `ReactNode` | — | Footer content — typically `Button` atoms. |
| ...rest | `HTMLAttributes<HTMLElement>` | — | All native footer attributes forwarded |

---

## Variants

| Variant | Visual treatment | Use when |
|---|---|---|
| `elevated` | Surface background + drop shadow | Default — primary card style for most content |
| `outlined` | Surface background + visible border, no shadow | Subtle emphasis; forms, settings panels |
| `filled` | Muted secondary background, no border/shadow | De-emphasized sections; sidebar widgets |
| `ghost` | Fully transparent, no border/shadow | Inline grouping that blends into the page |

---

## Tokens Used

| Token | Value | Purpose |
|---|---|---|
| `--card-radius` | `--radius-component-lg` (8px) | Border radius |
| `--card-border-width` | `--border-hairline` (1px) | Border thickness |
| `--card-gap` | `--spacing-component-md` (12px) | Internal gap (title→description, footer items) |
| `--card-min-width` | `--content-min-width-md` | Responsive overflow protection (via `.card-shell`) |
| `--card-section-px` | `--spacing-component-xl` (24px) | Horizontal padding — all slots |
| `--card-header-py` | `--spacing-component-lg` (16px) | Header vertical padding |
| `--card-footer-py` | `--spacing-component-lg` (16px) | Footer vertical padding |
| `--card-body-py` | `--spacing-component-xl` (24px) | Body vertical padding |
| `--card-divider-color` | `--color-border-subtle` | Header/footer separator |
| `--card-elevated-bg` | `--color-surface-default` | Elevated variant background |
| `--card-elevated-border` | `transparent` / `--color-border-subtle` (dark) | Elevated border |
| `--card-elevated-shadow` | `--shadow-sm` / `--shadow-md` | Resting shadow by theme |
| `--card-elevated-shadow-hover` | `--shadow-md` / `--shadow-lg` | Hover shadow by theme |
| `--card-outlined-bg` | `--color-surface-default` | Outlined variant background |
| `--card-outlined-border` | `--color-border-default` | Outlined border |
| `--card-filled-bg` | `--color-bg-secondary` | Filled variant background |
| `--card-interactive-bg-hover` | `--color-state-hover` | Interactive hover background tint |
| `--card-title-overflow` | `--content-overflow-label` | Title overflow behaviour |
| `--card-title-whitespace` | `--content-whitespace-label` | Title whitespace behaviour |
| `--card-title-text-overflow` | `--content-text-overflow-label` | Title text-overflow behaviour |
| `--card-description-lines` | `--content-lines-description` | Description line clamp |

---

## Accessibility

### Semantic elements

| Sub-component | Element | Notes |
|---|---|---|
| Card root | `<div>` | Generic by default — add `role="article"` for self-contained content |
| `Card.Header` | `<header>` | Landmark — include only one per card |
| `Card.Body` | `<div>` | — |
| `Card.Footer` | `<footer>` | Landmark — include only one per card |

### Static card with semantic article role

```tsx
<Card role="article" aria-label="Project summary">
  <Card.Header title="Project Summary" />
</Card>
```

### Interactive cards

When the entire card surface is clickable (`interactive={true}`), also set:
- `role="button"` (actions) or `role="link"` (navigation)
- `aria-label` describing the action
- `tabIndex={0}` (already applied by the component)
- `onKeyDown` handler for `Enter` and `Space`

### Loading state

```tsx
<Card aria-busy="true" aria-label="Loading content">
  <Card.Body>
    <div aria-hidden="true">…skeleton…</div>
    <span className="sr-only">Loading…</span>
  </Card.Body>
</Card>
```

### Keyboard interaction

| Key | Behaviour |
|---|---|
| `Tab` | Moves focus to the card (when `interactive={true}`) |
| `Enter` / `Space` | Activates the card (when `interactive={true}` — wire in `onKeyDown`) |
| `Tab` (inside) | Moves between focusable children (Buttons, links) in document order |

---

## Schema.org

Card has **no Schema.org mapping**. Do not add structured data to this component.