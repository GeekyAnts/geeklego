---
name: state-handling
description: >
  Implement and audit visual state handling for Geeklego components.
  Use this skill whenever the user asks about component states, loading placeholders,
  skeleton/spinner usage, disabled states, error states, or visual feedback patterns.
  Also trigger proactively when building or auditing any interactive component or data
  organism — every component that holds, fetches, or accepts user input needs a state plan.
  Trigger on phrases like: "add loading state", "skeleton placeholder", "disabled button",
  "error state", "loading spinner", "visual states", "state handling", "loading=true",
  "show a skeleton", "aria-busy", "aria-disabled", "aria-invalid", "selected state",
  "active state", or any request to add/fix component feedback behaviour.
---

# Geeklego — Component State Handling

Visual states make components feel alive and trustworthy. A component without a loading state
leaves users wondering if something is broken. A disabled state without proper ARIA leaves screen
reader users confused. This skill ensures every component handles visual state correctly —
consistently, accessibly, and in alignment with the design system.

---

## State Type Decision Matrix

| Situation | State to add | Key prop | ARIA attribute |
|---|---|---|---|
| Data is being fetched | **loading** | `loading?: boolean` | `aria-busy="true"` |
| User cannot interact | **disabled** | `disabled?: boolean` | `aria-disabled="true"` |
| Validation failed | **error** | `error?: string` | `aria-invalid="true"` + `aria-describedby` |
| Item is chosen / current | **selected / active** | `selected?` / `isActive?` | `aria-selected` / `aria-current="page"` |

---

## Loading State

### When to use Skeleton vs Spinner

| Signal | Use Skeleton | Use Spinner |
|---|---|---|
| Layout is unknown / content placeholder | ✓ | |
| Chart, list, card content loading | ✓ | |
| Button action in progress | | ✓ |
| Inline page indicator (no layout shift) | | ✓ |
| Full section / organism content | ✓ | |

### Skeleton pattern (organisms and section-level components)

```tsx
// 1. Declare the prop in types
loading?: boolean;

// 2. Spread aria-busy on the root element
{...getLoadingProps(loading)}

// 3. Replace the data area with Skeleton when loading
{loading ? (
  <Skeleton
    variant="box"
    height="var(--{component}-loading-height)"
    aria-label="Loading chart data"
  />
) : data.length > 0 ? (
  /* normal render */
) : (
  /* empty state */
)}
```

### Spinner pattern (buttons and inline atoms)

```tsx
// Button loading — content hidden, skeleton preserves dimensions
{isLoading ? (
  <span className="absolute inset-0 flex items-center justify-center">
    <Spinner size="sm" variant="inverse" />
  </span>
) : null}
<span className={isLoading ? 'invisible' : ''}>
  {children}
</span>
```

### Token naming

Always add loading tokens to `geeklego.css` **before** writing the component:

```css
/* In the component token block */
--{component}-loading-height:  var(--size-component-2xl);
--{component}-loading-radius:  var(--radius-component-md);
```

### ARIA rule

- `aria-busy="true"` goes on the outermost element of the component being loaded.
- The `<Skeleton>` already sets `aria-busy` and `role="status"` internally — do not double-set.
- Use `getLoadingProps(loading)` from `components/utils/accessibility/aria-helpers.ts` and spread it on the root.

---

## Disabled State

```tsx
// Types
disabled?: boolean;

// Component
const isDisabled = disabled || isLoading;

// ARIA — use getDisabledProps() from aria-helpers.ts
{...getDisabledProps(isDisabled)}

// CSS classes (component token pattern)
className={[
  isDisabled && 'bg-[var(--{component}-bg-disabled)]',
  isDisabled && 'text-[var(--{component}-text-disabled)]',
  isDisabled && 'border-[var(--{component}-border-disabled)]',
  isDisabled && 'cursor-not-allowed pointer-events-none',
].filter(Boolean).join(' ')}
```

### Token naming

```css
--{component}-bg-disabled:     var(--color-action-disabled);
--{component}-text-disabled:   var(--color-text-disabled);
--{component}-border-disabled: var(--color-border-default);
```

---

## Error State

Always provide a secondary cue beyond color (icon, border + text, or both).

```tsx
// Types
error?: string;

// ARIA — use getErrorFieldProps() from aria-helpers.ts
const errorId = useId();
{...getErrorFieldProps(!!error, errorId)}

// Error message element
{error && (
  <span id={errorId} className="text-body-sm text-[var(--color-status-error)] flex items-center gap-[var(--spacing-component-xs)]">
    <AlertCircle className="shrink-0" aria-hidden="true" />
    {error}
  </span>
)}
```

### Token naming

```css
--{component}-border-error:    var(--color-border-error);
--{component}-text-error:      var(--color-status-error);
```

---

## Selected / Active State

```tsx
// Types
selected?: boolean;   // for list items, options, chips
isActive?: boolean;   // for nav items

// CSS classes
className={[
  selected && 'bg-[var(--{component}-bg-selected)]',
  selected && 'text-[var(--{component}-text-selected)]',
].filter(Boolean).join(' ')}

// ARIA
aria-selected={selected || undefined}
// OR for navigation:
aria-current={isActive ? 'page' : undefined}
```

---

## Audit Checklist — By Component Type

### L1 Interactive Atoms (Button, Input, Select, Checkbox, Radio, Switch, Toggle)
- [ ] `disabled` prop → visual + ARIA
- [ ] `loading` prop if async (Button, Submit)
- [ ] `error` prop for form controls
- [ ] `selected`/`checked` for choice controls

### L1 Display Atoms (Avatar, Badge, Chip, Tag, Spinner, Skeleton)
- [ ] `loading` for Avatar (shimmer circle)
- [ ] No disabled needed for purely decorative atoms

### L2 Molecules (Card, SearchBar, FormField, Pagination, Breadcrumb)
- [ ] `loading` prop → Skeleton placeholder for content area
- [ ] Pass `disabled`/`error` down to constituent atoms

### L3 Organisms (Sidebar, AreaChart, BarChart, DataTable, Modal, Accordion)
- [ ] `loading` prop → Skeleton box at organism height
- [ ] `error` state for data-fetch failure (AlertBanner or inline error)

---

## Rules

1. **Always add loading tokens to `geeklego.css` first** — `--{component}-loading-height`, `--{component}-loading-radius`.
2. **Never double-set `aria-busy`** — it belongs on the root; `<Skeleton>` sets its own.
3. **Never use color alone** for error — pair with icon or text label.
4. **Never render a spinner and a skeleton simultaneously** on the same component.
5. **Use `getLoadingProps()`, `getDisabledProps()`, `getErrorFieldProps()`** from `components/utils/accessibility/aria-helpers.ts`.
6. **Preserve layout dimensions during loading** — skeleton must match the target area's size.

---

## Reference

Full code examples and token chains → `.claude/skills/state-handling/references/patterns.md`

Existing components with loading state:
- `Button` — inline Spinner (`isLoading`)
- `Item` — full Skeleton (`loading`)
- `AreaChart` — Skeleton box (`loading`)
- `BarChart` — Skeleton box (`loading`)
- `Avatar` — Skeleton circle (`loading`)
