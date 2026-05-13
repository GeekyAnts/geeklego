# List

A semantic, token-driven list atom supporting six visual variants, three sizes, and a compound `List.Item` slot. Renders `<ul>`, `<ol>`, or `<dl>` depending on variant, with full theme support and WCAG 2.2 AA accessibility.

---

## Props

### `<List>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'bullet' \| 'ordered' \| 'none' \| 'check' \| 'dot' \| 'description'` | `'bullet'` | Visual style of list markers |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Typography and spacing scale |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction |
| `className` | `string` | — | Additional Tailwind classes |
| `children` | `ReactNode` | — | `List.Item` elements |

Extends `HTMLAttributes<HTMLElement>` — all standard HTML attributes are forwarded to the underlying `<ul>`, `<ol>`, or `<dl>` element.

### `<List.Item>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `disabled` | `boolean` | `false` | Renders in muted disabled state with `aria-disabled` |
| `term` | `ReactNode` | — | Term label (`<dt>`) for `description` variant only |
| `className` | `string` | — | Additional Tailwind classes |
| `children` | `ReactNode` | — | Item content (rendered as `<li>` or `<dd>`) |

Extends `HTMLAttributes<HTMLElement>`.

---

## Tokens Used

| Token | Value | Purpose |
|---|---|---|
| `--list-marker-color` | `var(--color-text-tertiary)` | Bullet disc marker colour |
| `--list-ordered-number-color` | `var(--color-action-primary)` | Ordered list number colour |
| `--list-check-color` | `var(--color-status-success)` | Check icon colour |
| `--list-dot-color` | `var(--color-action-primary)` | Dot marker colour |
| `--list-item-text` | `var(--color-text-primary)` | Default item text colour |
| `--list-item-text-disabled` | `var(--color-text-disabled)` | Disabled item text + marker |
| `--list-term-color` | `var(--color-text-secondary)` | Description list term (`<dt>`) colour |
| `--list-definition-color` | `var(--color-text-primary)` | Description list definition (`<dd>`) colour |
| `--list-term-border` | `var(--color-border-subtle)` | Divider between description rows |
| `--list-gap-sm` | `var(--spacing-component-xs)` | Gap between items at `sm` |
| `--list-gap-md` | `var(--spacing-component-sm)` | Gap between items at `md` |
| `--list-gap-lg` | `var(--spacing-component-md)` | Gap between items at `lg` |
| `--list-indent` | `var(--spacing-component-xl)` | Left padding for bullet/ordered |
| `--list-marker-gap` | `var(--spacing-component-sm)` | Gap between icon/dot and text |
| `--list-dot-size` | `var(--spacing-component-xs)` | Dot marker diameter |
| `--list-check-icon-size-sm/md/lg` | `var(--size-icon-xs/sm/md)` | Check icon size per list size |

---

## Variants

| Variant | HTML | Marker | Use case |
|---|---|---|---|
| `bullet` | `<ul>` | CSS disc, tertiary colour | Unordered prose content |
| `ordered` | `<ol>` | CSS decimal, primary colour | Numbered steps or sequences |
| `none` | `<ul>` | None | Layout lists (nav items, tags) |
| `check` | `<ul>` | `Check` icon, success colour | Feature lists, task completion |
| `dot` | `<ul>` | Small dot, primary colour | Compact feature highlights |
| `description` | `<dl>` | None — term + definition | Key-value data pairs |

---

## Sizes

| Size | Typography | Gap |
|---|---|---|
| `sm` | `text-body-sm` | `--list-gap-sm` (4px) |
| `md` | `text-body-md` | `--list-gap-md` (8px) |
| `lg` | `text-body-lg` | `--list-gap-lg` (12px) |

---

## States

| State | Visual treatment |
|---|---|
| Default | Full colour markers, primary text |
| Disabled | Marker and text shift to `--list-item-text-disabled`, `pointer-events-none` |

The List component has no loading or error state — it is a pure content component.

---

## Accessibility

**Semantic element:** `<ul>` (bullet/check/dot/none), `<ol>` (ordered), `<dl>` (description)

**Roles (native — no explicit `role` needed):**

| Element | Implicit role |
|---|---|
| `<ul>` | `list` |
| `<ol>` | `list` |
| `<li>` | `listitem` |
| `<dl>` | N/A (no standard role) |
| `<dt>` | `term` |
| `<dd>` | `definition` |

**ARIA attributes:**

| Attribute | When applied |
|---|---|
| `aria-disabled="true"` | On `<li>` when `disabled={true}` |
| `aria-hidden="true"` | On check icon `<span>` and dot `<span>` — decorative |
| `aria-label` | Recommended on the `<List>` itself when context is not obvious |

**Keyboard interaction:**

The List itself is non-interactive. If items contain interactive elements (links, buttons), they are keyboard-reachable via Tab. No custom keyboard handling is required.

| Key | Behaviour |
|---|---|
| Tab | Moves focus to the next interactive element inside a list item |
| Enter / Space | Activates any button or link within the focused item |

**Screen reader announcements:**

- `<ul>` and `<ol>` announce item count and position (e.g. "list, 4 items", "item 1 of 4")
- `<dl>` announces term/definition pairs in supported screen readers
- Check and dot icons carry `aria-hidden="true"` — the textual content carries all meaning
- Disabled items use `aria-disabled="true"` so screen readers announce the disabled state

---

## Usage

```tsx
import { List } from 'components/atoms/List';

// Bullet list
<List variant="bullet">
  <List.Item>First point</List.Item>
  <List.Item>Second point</List.Item>
</List>

// Ordered steps
<List variant="ordered">
  <List.Item>Install dependencies</List.Item>
  <List.Item>Run the dev server</List.Item>
  <List.Item>Open localhost:5173</List.Item>
</List>

// Feature checklist
<List variant="check">
  <List.Item>Accessible by default</List.Item>
  <List.Item>Token-driven design</List.Item>
  <List.Item disabled>Coming soon</List.Item>
</List>

// Description list
<List variant="description">
  <List.Item term="Version">4.2.1</List.Item>
  <List.Item term="Licence">MIT</List.Item>
</List>

// Horizontal layout
<List variant="none" orientation="horizontal">
  <List.Item>Terms</List.Item>
  <List.Item>Privacy</List.Item>
</List>

// Nested list
<List variant="bullet">
  <List.Item>
    Parent item
    <List variant="dot" size="sm">
      <List.Item>Nested child one</List.Item>
      <List.Item>Nested child two</List.Item>
    </List>
  </List.Item>
</List>
```