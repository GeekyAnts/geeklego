# Stack

A layout utility atom that arranges children in a one-dimensional flex container. Stack is a passthrough atom — it carries no visual tokens of its own; all spacing uses the responsive `--spacing-layout-*` semantics from the design system.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `direction` | `'row' \| 'column'` | `'column'` | Flex direction |
| `gap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Gap between children — maps to `--spacing-layout-*` responsive tokens |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | `'stretch'` | `align-items` |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | `'start'` | `justify-content` |
| `wrap` | `boolean` | `false` | Whether children wrap onto multiple lines |
| `inline` | `boolean` | `false` | `inline-flex` instead of `flex` |
| `as` | `ElementType` | `'div'` | Root element for semantic override |
| `className` | `string` | — | Additional classes |
| `children` | `ReactNode` | — | Items to stack |

All other props are forwarded to the root element.

---

## Tokens Used

Stack is a passthrough atom — it uses semantic tokens directly rather than introducing its own component token block.

| Design token | Usage |
|---|---|
| `--spacing-layout-xs` | gap="xs" |
| `--spacing-layout-sm` | gap="sm" |
| `--spacing-layout-md` | gap="md" |
| `--spacing-layout-lg` | gap="lg" |
| `--spacing-layout-xl` | gap="xl" |

The layout spacing tokens are responsive — they adjust at 768px and 1024px breakpoints automatically.

---

## Direction

Stack defaults to `column` (vertical stacking). Use `direction="row"` for horizontal arrangements.

```tsx
// Vertical (default)
<Stack gap="md">
  <Card />
  <Card />
</Stack>

// Horizontal
<Stack direction="row" gap="sm" align="center">
  <Avatar />
  <Heading level={3}>Name</Heading>
</Stack>
```

---

## Gap Sizes

The `gap` prop maps to responsive layout spacing tokens. Gaps are **not** component-scale — they widen on larger viewports.

```tsx
<Stack gap="xs" />  {/* --spacing-layout-xs */}
<Stack gap="sm" />  {/* --spacing-layout-sm */}
<Stack gap="md" />  {/* --spacing-layout-md (default) */}
<Stack gap="lg" />  {/* --spacing-layout-lg */}
<Stack gap="xl" />  {/* --spacing-layout-xl */}
<Stack gap="none" /> {/* no gap */}
```

---

## Alignment

```tsx
// Center children horizontally in a column stack
<Stack direction="column" align="center">
  <Button>Submit</Button>
</Stack>

// Spread children across a row
<Stack direction="row" justify="between" align="center">
  <Logo />
  <Nav />
  <Actions />
</Stack>
```

---

## Wrap

By default children do not wrap. Enable `wrap` for responsive tag clouds or button groups.

```tsx
<Stack direction="row" gap="sm" wrap>
  <Tag>React</Tag>
  <Tag>TypeScript</Tag>
  <Tag>Tailwind</Tag>
  <Tag>Storybook</Tag>
</Stack>
```

---

## Semantic Override

Use `as` to change the root element for correct document semantics without nesting an extra div.

```tsx
// Navigation landmark
<Stack as="nav" aria-label="Primary navigation" direction="row" gap="md">
  <NavItem href="/">Home</NavItem>
  <NavItem href="/components">Components</NavItem>
</Stack>

// Ordered/unordered list layout
<Stack as="ul" direction="column" gap="xs" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
  <li><Item label="First" /></li>
  <li><Item label="Second" /></li>
</Stack>
```

---

## States

Stack itself is a stateless layout container — it has no loading, disabled, or error state. Visual state management belongs to its children.

---

## Accessibility

| Property | Value |
|---|---|
| Semantic element | `<div>` by default (override via `as`) |
| ARIA role | None — inherits from root element |
| Keyboard | Not applicable — layout only |
| Screen reader | No announcement — transparent container |

Stack adds no ARIA attributes of its own. Use the `as` prop and add explicit ARIA attributes (`aria-label`, `role`, etc.) when semantic grouping is needed.

```tsx
// Explicit grouping with role and label
<Stack role="group" aria-label="Form actions" direction="row" gap="sm">
  <Button variant="primary">Save</Button>
  <Button variant="ghost">Cancel</Button>
</Stack>
```

---

## Usage

```tsx
import { Stack } from '@geeklego/ui';

// Basic vertical stack
<Stack gap="lg">
  <Heading level={2}>Title</Heading>
  <p className="text-body-md">Description paragraph.</p>
  <Button>Action</Button>
</Stack>

// Horizontal header row
<Stack direction="row" justify="between" align="center" gap="md">
  <Stack direction="row" align="center" gap="sm">
    <Avatar src="/logo.png" size="sm" />
    <Heading level={1}>App Name</Heading>
  </Stack>
  <Stack direction="row" gap="xs">
    <Button variant="ghost">Sign in</Button>
    <Button>Get started</Button>
  </Stack>
</Stack>
```
