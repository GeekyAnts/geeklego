# Button

**Level:** Atom (L1)
**Dependencies:** None

## Description

A versatile button atom with six visual variants, five sizes, loading/disabled states, and optional leading/trailing icons. Each variant uses a fundamentally different visual strategy — filled with shadow (primary, destructive), filled muted with border reveal on hover (secondary), transparent with visible border (outline), invisible until hover (ghost), and inline text (link). Fully token-driven with automatic light and dark theme support.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive' \| 'link'` | `'primary'` | Visual style |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Height and typography scale |
| `isLoading` | `boolean` | `false` | Shows spinner, preserves dimensions, disables interaction |
| `leftIcon` | `ReactNode` | — | Icon rendered before the label |
| `rightIcon` | `ReactNode` | — | Icon rendered after the label |
| `iconOnly` | `boolean` | `false` | Square button; hides label visually, uses it as `aria-label` |
| `children` | `ReactNode` | — | Button label (required; used as `aria-label` when `iconOnly`) |
| `disabled` | `boolean` | `false` | Disables interaction |
| `className` | `string` | — | Additional CSS classes |

## Tokens Used

## Semantic Token Chain

The Button component follows Geeklego's 3-tier token architecture:

### Tier 1 - Primitives
```css
/* Raw values in @theme */
--radius-component-md: 6px;
--spacing-component-xs: 8px;
--color-brand-950: #09090b;
--color-neutral-100: #ebebef;
```

### Tier 2 - Semantics
```css
/* Intent-driven aliases in :root */
:root {
  --color-action-primary: var(--color-brand-950);
  --color-action-secondary: var(--color-neutral-100);
  --color-text-on-primary: var(--color-neutral-0);
  --color-text-primary: var(--color-neutral-900);
  --color-border-default: var(--color-neutral-200);
  --color-state-selected: var(--color-brand-100);
}
```

### Tier 3 - Components (Button)
```css
/* Component-specific tokens */
--button-radius: var(--radius-component-md);
--button-gap: var(--spacing-component-xs);
--button-primary-bg: var(--color-action-primary);
--button-primary-text: var(--color-text-on-primary);
--button-secondary-bg: var(--color-action-secondary);
--button-secondary-text: var(--color-text-primary);
```

## Tokens Used

| Token | Semantic Reference | Purpose |
|---|---|---|
| `--button-radius` | `--radius-component-md` | Border radius |
| `--button-gap` | `--spacing-component-xs` | Icon-to-label gap |
| **Primary Variant** |  |  |
| `--button-primary-bg` | `--color-action-primary` | Background color |
| `--button-primary-bg-hover` | `--color-action-primary-hover` | Hover state |
| `--button-primary-bg-active` | `--color-action-primary-active` | Active state |
| `--button-primary-text` | `--color-text-on-primary` | Text color |
| `--button-primary-shadow` | `--shadow-sm` | Resting shadow |
| **Secondary Variant** |  |  |
| `--button-secondary-bg` | `--color-action-secondary` | Background color |
| `--button-secondary-bg-hover` | `--color-action-secondary-hover` | Hover state |
| `--button-secondary-border` | `transparent` | Resting border |
| `--button-secondary-text` | `--color-text-primary` | Text color |
| **Outline Variant** |  |  |
| `--button-outline-bg` | `transparent` | Background color |
| `--button-outline-bg-hover` | `--color-state-selected` | Hover background |
| `--button-outline-border` | `--color-border-default` | Border color |
| `--button-outline-text` | `--color-text-primary` | Text color |
| **Ghost Variant** |  |  |
| `--button-ghost-bg` | `transparent` | Background color |
| `--button-ghost-bg-hover` | `--color-action-secondary` | Hover background |
| `--button-ghost-text` | `--color-text-primary` | Text color |
| **Destructive Variant** |  |  |
| `--button-destructive-bg` | `--color-action-destructive` | Background color |
| `--button-destructive-bg-hover` | `--color-action-destructive-hover` | Hover state |
| `--button-destructive-text` | `--color-text-on-destructive` | Text color |
| **Link Variant** |  |  |
| `--button-link-text` | `--color-text-accent` | Text color |
| `--button-link-text-hover` | `--color-text-accent-hover` | Hover state |
| **Sizing Tokens** |  |  |
| `--button-height-xs` | `--size-button-xs` (24px) | Extra small height |
| `--button-height-sm` | `--size-button-sm` (28px) | Small height |
| `--button-height-md` | `--size-button-md` (36px) | Medium height |
| `--button-height-lg` | `--size-button-lg` (40px) | Large height |
| `--button-height-xl` | `--size-button-xl` (56px) | Extra large height |
| **Padding Tokens** |  |  |
| `--button-px-xs` | `--spacing-2` (8px) | Horizontal padding |
| `--button-px-sm` | `--spacing-3` (12px) | Small padding |

## Variants

| Variant | Visual Strategy | Description |
|---|---|---|
| `primary` | Filled bg + resting shadow; shadow lifts on hover | High-emphasis main action — demands attention |
| `secondary` | Filled muted bg; border appears on hover | Supports primary without competing |
| `outline` | Transparent bg + visible border; bg fills on hover | Visible but lightweight — secondary emphasis |
| `ghost` | Fully transparent; bg + primary text appear on hover | Hides until needed — tertiary emphasis |
| `destructive` | Filled error bg + resting shadow; shadow lifts on hover | Signals danger — impossible to miss |
| `link` | No bg, no border; underline appears on hover | Inline text action — blends with prose |

## Sizes

| Size | Height | Typography |
|---|---|---|
| `xs` | 24px (`--size-component-xs`) | `.text-button-xs` |
| `sm` | 32px (`--size-component-sm`) | `.text-button-sm` |
| `md` | 40px (`--size-component-md`) | `.text-button-md` |
| `lg` | 48px (`--size-component-lg`) | `.text-button-lg` |
| `xl` | 56px (`--size-component-xl`) | `.text-button-xl` |

## States

| State | Behaviour |
|---|---|
| Default | Resting appearance. Primary/destructive have shadow. |
| Hover | Background shifts. Shadow lifts (primary/destructive). Border appears (secondary). Text shifts to primary colour (ghost). Two properties always change. |
| Focus-visible | Focus ring appears via `.focus-ring`. No other change. |
| Active/pressed | Background darkens beyond hover. Shadow flattens (primary/destructive). |
| Disabled | Muted bg + text. No shadow. No hover/active. `cursor-not-allowed`. |
| Loading | Centered spinner via absolute positioning. Invisible ghost content preserves dimensions exactly — no layout shift. `aria-busy="true"`. |

## Accessibility

- Semantic `<button>` element
- `aria-disabled` set when disabled or loading (omitted when false)
- `aria-busy` set when loading (omitted when false)
- `aria-label` automatically set from `children` string when `iconOnly` is true
- `focus-visible:focus-ring` for keyboard navigation
- Icon slots and spinner include `aria-hidden="true"`
- Hidden label in icon-only mode uses `<span className="sr-only">` as additional fallback
- Touch targets meet 44×44px minimum at `md` size and above

### Keyboard Interaction

| Key | Action |
|---|---|
| Tab | Moves focus to the button |
| Enter | Activates the button |
| Space | Activates the button |

## Usage

```tsx
import { Button } from '../../atoms/Button/Button';
import { Plus, ArrowRight, Trash2, Settings } from 'lucide-react';

// Standard
<Button variant="primary" size="md">Save changes</Button>

// With icon
<Button variant="outline" size="sm" leftIcon={<Plus size="var(--size-icon-sm)" />}>
  Add item
</Button>

// Icon only — children provides the accessible label
<Button variant="ghost" size="md" iconOnly leftIcon={<Settings size="var(--size-icon-md)" />}>
  Settings
</Button>

// Destructive
<Button variant="destructive" leftIcon={<Trash2 size="var(--size-icon-md)" />}>
  Delete account
</Button>

// Loading — preserves dimensions
<Button variant="primary" isLoading>Saving…</Button>

// Continue with right icon
<Button variant="secondary" rightIcon={<ArrowRight size="var(--size-icon-md)" />}>
  Continue
</Button>
```