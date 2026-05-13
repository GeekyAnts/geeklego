# State Handling — Code Patterns Reference

Full worked examples for every visual state. Each section shows: token chain, CSS classes, TypeScript prop, and ARIA wiring.

---

## Table of Contents
1. [Loading — Skeleton (organisms)](#loading-skeleton-organisms)
2. [Loading — Spinner (atoms/buttons)](#loading-spinner-atomsbuttons)
3. [Disabled](#disabled)
4. [Error](#error)
5. [Selected / Active](#selected--active)
6. [State Token Inventory](#state-token-inventory)
7. [Skeleton vs Spinner Decision Table](#skeleton-vs-spinner-decision-table)

---

## Loading — Skeleton (organisms)

**Use for:** Charts, cards, lists, data-heavy organisms where layout placeholder improves perceived performance.

### Token chain

```
Primitive:  --spacing-16 (64px)
Semantic:   --size-component-2xl → var(--spacing-16)
Component:  --areachart-loading-height → var(--size-component-2xl)
```

### geeklego.css addition (always first)

```css
/* In the component token block */
--{component}-loading-height:  var(--size-component-2xl);
--{component}-loading-radius:  var(--radius-component-md);
```

### Types

```typescript
/** When true, replaces the chart area with a shimmer skeleton placeholder. */
loading?: boolean;
```

### Component implementation

```tsx
import { Skeleton } from '../../atoms/Skeleton/Skeleton';
import { getLoadingProps } from '../../utils/accessibility/aria-helpers';

export const MyOrganism = memo(forwardRef<HTMLDivElement, MyOrganismProps>(
  ({ loading = false, data, className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={...}
        {...getLoadingProps(loading)}  // sets aria-busy="true" on root
        {...rest}
      >
        {/* Header always visible */}
        <header>...</header>

        {/* Data area: skeleton → data → empty */}
        {loading ? (
          <Skeleton
            variant="box"
            height="var(--{component}-loading-height)"
            aria-label="Loading content"
          />
        ) : data.length > 0 ? (
          /* normal render */
        ) : (
          /* empty state */
        )}
      </div>
    );
  },
));
```

---

## Loading — Spinner (atoms/buttons)

**Use for:** Button submit actions, inline status indicators. Preserves exact dimensions — no layout shift.

### Token chain

```
Component:  --spinner-default-color → var(--color-action-primary)
```

### Types

```typescript
/** Shows a spinner and prevents interaction while the action is in progress. */
isLoading?: boolean;
```

### Component implementation

```tsx
import { Spinner } from '../Spinner/Spinner';
import { getLoadingProps } from '../../utils/accessibility/aria-helpers';

const isDisabled = disabled || isLoading;

<button
  disabled={isDisabled}
  aria-disabled={isDisabled || undefined}
  {...getLoadingProps(isLoading)}
  className={['relative', ...classes].join(' ')}
>
  {/* Spinner overlaid absolutely — preserves button width */}
  {isLoading && (
    <span className="absolute inset-0 flex items-center justify-center">
      <Spinner size="sm" variant="inverse" />
    </span>
  )}
  {/* Ghost content preserves layout dimensions */}
  <span className={isLoading ? 'invisible' : ''}>
    {children}
  </span>
</button>
```

---

## Disabled

### Token chain

```
Primitive:  --color-neutral-200 (light) / --color-neutral-700 (dark)
Semantic:   --color-action-disabled → var(--color-neutral-200)
            --color-text-disabled   → var(--color-neutral-400)
Component:  --{component}-bg-disabled     → var(--color-action-disabled)
            --{component}-text-disabled   → var(--color-text-disabled)
            --{component}-border-disabled → var(--color-border-default)
```

### geeklego.css addition

```css
--{component}-bg-disabled:     var(--color-action-disabled);
--{component}-text-disabled:   var(--color-text-disabled);
--{component}-border-disabled: var(--color-border-default);
```

### Types

```typescript
/** Prevents interaction and applies muted styling. */
disabled?: boolean;
```

### Component implementation

```tsx
import { getDisabledProps } from '../../utils/accessibility/aria-helpers';

const isDisabled = disabled || isLoading;

<button
  {...getDisabledProps(isDisabled)}  // sets aria-disabled="true" and disabled attribute
  className={[
    baseClasses,
    isDisabled && 'bg-[var(--{component}-bg-disabled)]',
    isDisabled && 'text-[var(--{component}-text-disabled)]',
    isDisabled && 'border-[var(--{component}-border-disabled)]',
    isDisabled && 'cursor-not-allowed pointer-events-none',
    isDisabled && 'shadow-none',  // never shadow on disabled
  ].filter(Boolean).join(' ')}
>
  {children}
</button>
```

**Note:** Disabled elements must never have a box-shadow (CLAUDE.md rule #13).

---

## Error

Always provide a secondary visual cue beyond color (icon + text label).

### Token chain

```
Primitive:  --color-error-500
Semantic:   --color-status-error      → var(--color-error-500)
            --color-border-error      → var(--color-error-500)
Component:  --{component}-border-error → var(--color-border-error)
            --{component}-text-error   → var(--color-status-error)
```

### geeklego.css addition

```css
--{component}-border-error: var(--color-border-error);
--{component}-text-error:   var(--color-status-error);
```

### Types

```typescript
/** Validation error message. When provided, renders error styles and message. */
error?: string;
```

### Component implementation

```tsx
import { useId } from 'react';
import { AlertCircle } from 'lucide-react';
import { getErrorFieldProps } from '../../utils/accessibility/aria-helpers';

const errorId = useId();

<div className="flex flex-col gap-[var(--spacing-component-xs)]">
  <input
    {...getErrorFieldProps(!!error, errorId)}  // aria-invalid="true" + aria-describedby
    className={[
      baseInputClasses,
      error
        ? 'border-[var(--{component}-border-error)]'
        : 'border-[var(--{component}-border-default)]',
    ].join(' ')}
  />
  {error && (
    <span
      id={errorId}
      role="alert"
      className="text-body-sm text-[var(--{component}-text-error)] flex items-center gap-[var(--spacing-component-xs)]"
    >
      <AlertCircle className="shrink-0 w-[var(--size-icon-xs)] h-[var(--size-icon-xs)]" aria-hidden="true" />
      {error}
    </span>
  )}
</div>
```

---

## Selected / Active

### For list items and options (selected)

```css
--{component}-bg-selected:   var(--color-state-selected);
--{component}-text-selected: var(--color-action-primary);
```

```tsx
selected?: boolean;

<li
  aria-selected={selected || undefined}
  className={[
    baseClasses,
    selected && 'bg-[var(--{component}-bg-selected)]',
    selected && 'text-[var(--{component}-text-selected)]',
    !selected && 'hover:bg-[var(--{component}-bg-hover)]',
  ].filter(Boolean).join(' ')}
>
```

### For navigation items (isActive)

```tsx
isActive?: boolean;

<a
  aria-current={isActive ? 'page' : undefined}
  className={[
    baseClasses,
    isActive && 'bg-[var(--navitem-bg-active)]',
    isActive && 'text-[var(--navitem-text-active)]',
    !isActive && 'hover:bg-[var(--navitem-bg-hover)]',
  ].filter(Boolean).join(' ')}
>
```

---

## State Token Inventory

All semantic tokens available for state styling (from `geeklego.css`):

### Color — State
| Token | Light value | Purpose |
|---|---|---|
| `--color-state-hover` | `--color-action-secondary` | Generic hover bg |
| `--color-state-pressed` | `--color-neutral-900` | Active/pressed bg |
| `--color-state-selected` | `--color-brand-50` | Selected item bg |
| `--color-state-highlight` | `--color-brand-100` | Highlighted item bg |
| `--color-state-loading` | `--color-neutral-100` | Skeleton base colour |
| `--color-state-loading-shine` | `--color-neutral-200` | Skeleton shimmer highlight |

### Color — Action
| Token | Purpose |
|---|---|
| `--color-action-primary` | Primary CTA (interactive element fill) |
| `--color-action-primary-hover` | Primary CTA hover |
| `--color-action-primary-active` | Primary CTA active/pressed |
| `--color-action-disabled` | Disabled fill |
| `--color-action-secondary` | Secondary / ghost hover bg |

### Color — Status
| Token | Purpose |
|---|---|
| `--color-status-error` | Error text/icon |
| `--color-status-error-subtle` | Error background |
| `--color-status-success` | Success text/icon |
| `--color-status-warning` | Warning text/icon |
| `--color-status-info` | Info text/icon |

### Color — Text state
| Token | Purpose |
|---|---|
| `--color-text-disabled` | Disabled text |
| `--color-text-error` | Alias for `--color-status-error` |

### Color — Border state
| Token | Purpose |
|---|---|
| `--color-border-error` | Error border |
| `--color-border-focus` | Focus ring color |
| `--color-border-focus-visible` | Focus-visible ring color |

---

## Skeleton vs Spinner Decision Table

| Scenario | Component | Prop | Result |
|---|---|---|---|
| AreaChart data loading | `<AreaChart loading>` | `loading` | Box skeleton at chart height |
| BarChart data loading | `<BarChart loading>` | `loading` | Box skeleton at chart height |
| Avatar user not loaded | `<Avatar loading>` | `loading` | Circle skeleton matching size |
| Button form submit | `<Button isLoading>` | `isLoading` | Inline spinner, same dimensions |
| List item loading | `<Item loading>` | `loading` | Full item skeleton |
| Page section loading | Use `<Skeleton variant="box">` directly | — | Box placeholder |
| Standalone text line | Use `<Skeleton variant="text">` | — | Text line placeholder |
| Multiple text lines | Use `<Skeleton variant="text" lines={3}>` | — | Staggered text placeholder |
| User profile picture | `<Avatar loading>` | `loading` | Circle skeleton |
