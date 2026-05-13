# Input

Single-line text input atom for the Geeklego design system. Provides four visual variants, three sizes, full WCAG 2.2 AA accessibility, icon slots, and loading/error states. Designed to be composed with the `Label` atom and future `FormField` molecule.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'default' \| 'filled' \| 'flushed' \| 'unstyled'` | `'default'` | Visual style. Each uses a fundamentally different strategy — not just color shifts. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and typography scale. |
| `error` | `boolean` | `false` | Activates error border and sets `aria-invalid="true"`. |
| `isLoading` | `boolean` | `false` | Shows spinner in right slot; disables input interaction. |
| `leftIcon` | `ReactNode` | — | Icon node at the left edge. Decorative (`aria-hidden`). |
| `rightIcon` | `ReactNode` | — | Icon node at the right edge. Replaced by spinner when `isLoading`. |
| `wrapperClassName` | `string` | — | Extra classes for the outer `<div>` wrapper. |
| `className` | `string` | — | Extra classes for the inner `<input>` element. |
| `id` | `string` | auto | DOM id for label association. Auto-generated via `useId()` if not provided. |
| `disabled` | `boolean` | — | Native disabled attribute. Also sets `aria-disabled`. |
| `required` | `boolean` | — | Native required attribute. Also sets `aria-required`. |
| `type` | `string` | `'text'` | Native input type (`text`, `email`, `password`, `url`, `tel`, `number`, `search`). |
| `placeholder` | `string` | — | Placeholder text (not a substitute for a visible label). |

All native `InputHTMLAttributes<HTMLInputElement>` are supported (except `size`, which is reserved for the visual size prop).

---

## Semantic Token Chain

The Input component follows Geeklego's 3-tier token architecture:

### Tier 1 - Primitives
```css
/* Raw values in @theme */
--size-component-sm: 32px;
--size-component-md: 40px;
--size-component-lg: 48px;
--radius-component-md: 6px;
--spacing-component-sm: 12px;
--spacing-component-md: 16px;
```

### Tier 2 - Semantics
```css
/* Intent-driven aliases in :root */
:root {
  --color-text-primary: var(--color-neutral-900);
  --color-text-tertiary: var(--color-neutral-500);
  --color-text-disabled: var(--color-neutral-400);
  
  --color-bg-primary: var(--color-neutral-0);
  --color-bg-secondary: var(--color-neutral-50);
  --color-bg-tertiary: var(--color-neutral-100);
  
  --color-border-default: var(--color-neutral-200);
  --color-border-strong: var(--color-neutral-300);
  --color-border-focus: var(--color-brand-950);
  --color-border-error: var(--color-error-500);
  --color-border-subtle: var(--color-neutral-100);
  
  --color-state-hover: var(--color-brand-100);
  
  --input-placeholder: var(--color-text-tertiary);
  --input-placeholder-error: var(--color-text-error);
}
```

### Tier 3 - Components (Input)
```css
/* Component-specific tokens */
--input-height-sm: var(--size-input-sm);    /* 32px */
--input-height-md: var(--size-input-md);    /* 40px */
--input-height-lg: var(--size-input-lg);    /* 48px */

--input-px-sm: var(--spacing-3);            /* 12px */
--input-px-md: var(--spacing-4);            /* 16px */
--input-px-lg: var(--spacing-5);            /* 20px */

--input-radius: var(--radius-component-md);
--input-gap: var(--spacing-xs);             /* 4px */
```

## Tokens Used

| Token | Semantic Reference | Purpose |
|---|---|---|
| **Sizing Tokens** |  |  |
| `--input-height-sm` | `--size-input-sm` (32px) | Small height |
| `--input-height-md` | `--size-input-md` (40px) | Medium height |
| `--input-height-lg` | `--size-input-lg` (48px) | Large height |
| **Padding Tokens** |  |  |
| `--input-px-sm` | `--spacing-3` (12px) | Horizontal padding |
| `--input-px-md` | `--spacing-4` (16px) | Medium padding |
| `--input-px-lg` | `--spacing-5` (20px) | Large padding |
| **Base Properties** |  |  |
| `--input-radius` | `--radius-component-md` | Border radius |
| `--input-gap` | `--spacing-component-xs` | Icon spacing |
| **Variant: Default** |  |  |
| `--input-default-bg` | `--color-bg-primary` | Background color |
| `--input-default-bg-hover` | `--color-state-hover` | Hover background |
| `--input-default-text` | `--color-text-primary` | Text color |
| `--input-default-placeholder` | `--input-placeholder` | Placeholder color |
| `--input-default-border` | `--color-border-default` | Border color |
| `--input-default-border-hover` | `--color-border-strong` | Hover border |
| `--input-default-border-focus` | `--color-border-focus` | Focus border |
| **Variant: Filled** |  |  |
| `--input-filled-bg` | `--color-bg-secondary` | Background color |
| `--input-filled-bg-hover` | `--color-bg-tertiary` | Hover background |
| `--input-filled-bg-focus` | `--color-bg-primary` | Focus background |
| `--input-filled-text` | `--color-text-primary` | Text color |
| `--input-filled-placeholder` | `--input-placeholder` | Placeholder color |
| **Variant: Flushed** |  |  |
| `--input-flushed-bg` | `transparent` | No background |
| `--input-flushed-text` | `--color-text-primary` | Text color |
| `--input-flushed-placeholder` | `--input-placeholder` | Placeholder color |
| `--input-flushed-border` | `--color-border-default` | Border color |
| **Variant: Unstyled** |  |  |
| `--input-unstyled-bg` | `transparent` | No background |
| `--input-unstyled-text` | `--color-text-primary` | Text color |
| `--input-unstyled-placeholder` | `--input-placeholder` | Placeholder color |
| **Validation States** |  |  |
| `--input-error-border` | `--color-border-error` | Error border |
| `--input-error-placeholder` | `--input-placeholder-error` | Error placeholder |
| **Icon Properties** |  |  |
| `--input-icon-color` | `--color-text-tertiary` | Default icon color |
| `--input-icon-color-hover` | `--color-text-accent` | Hover icon color |
| `--input-icon-size-sm` | `--size-icon-xs` (12px) | Small icon size |
| `--input-icon-size-md` | `--size-icon-sm` (16px) | Medium icon size |
| `--input-icon-size-lg` | `--size-icon-md` (20px) | Large icon size |
| **Disabled State** |  |  |
| `--input-disabled-bg` | `--color-bg-tertiary` | Background color |
| `--input-disabled-text` | `--color-text-disabled` | Text color |
| `--input-disabled-border` | `--color-border-subtle` | Border color |
| `--input-disabled-opacity` | `--disabled-opacity` | Reduced opacity |

---

## Variants

| Variant | Visual strategy |
|---|---|
| **`default`** | Outlined border at rest. Hover: subtle bg tint + border darkens. Focus-within: border turns focus color. |
| **`filled`** | Muted background, no border at rest. Hover: bg deepens. Focus-within: bg goes white, border appears. |
| **`flushed`** | Border-bottom only, no side/top borders, no border-radius. Editorial / minimalist feel. |
| **`unstyled`** | No border, no background. Blank slate for custom wrappers. |

---

## Sizes

| Size | Height | Typography | Use case |
|---|---|---|---|
| `sm` | 32px | `text-body-sm` | Compact forms, filter bars, inline editing |
| `md` | 40px | `text-body-md` | Standard forms (default) |
| `lg` | 48px | `text-body-lg` | Prominent hero search, sign-in forms |

---

## States

| State | Visual treatment |
|---|---|
| Default | Resting style per variant. No shadow in light/dark. |
| Hover | Two-property change: bg tint + border color shift. |
| Focus-visible | Inset focus ring (2px focus color box-shadow) + border color shift. |
| Error | Border locked to error color. `aria-invalid="true"` announced by screen readers. |
| Loading | Spinner replaces rightIcon. Input is non-interactive. `aria-busy="true"`. |
| Disabled | Muted bg + text. No hover/focus. `cursor-not-allowed`. |

---

## Accessibility

**Semantic element:** `<input>` (native form control — implicit `textbox` role)

**Required label association:**
```tsx
// Always associate with a visible label via htmlFor + id
<label htmlFor="email">Email address</label>
<Input id="email" type="email" />

// Or use aria-label when no visible label (e.g. search bars)
<Input type="search" aria-label="Search" />
```

**ARIA attributes:**

| Attribute | When | Value |
|---|---|---|
| `aria-required` | Required fields | `"true"` |
| `aria-invalid` | Error state | `"true"` |
| `aria-describedby` | Error state | ID of error message element |
| `aria-busy` | Loading state | `"true"` |
| `aria-disabled` | Disabled or loading | `"true"` |

**Keyboard interaction:**

| Key | Action |
|---|---|
| `Tab` | Move focus to/from input |
| Any printable key | Type into input |
| `Enter` | Submit form (if inside `<form>`) |
| `Backspace` / `Delete` | Remove characters |
| `Home` / `End` | Move cursor to start / end |
| `Ctrl+A` | Select all |

**Screen reader announcement:**
- Default: `"[label text], edit text"` (or placeholder if no value)
- Error: `"[label text], edit text, invalid entry"` — error message announced via `role="alert"`
- Loading: `"[label text], edit text, busy"`
- Disabled: `"[label text], dimmed, edit text"`

**Icon slots:** Left and right icons are wrapped in `aria-hidden="true"` spans — they are purely decorative and do not affect the accessible name of the input.

**Error message pattern:**
```tsx
<Input
  id="email"
  type="email"
  error
  aria-describedby="email-error"
/>
<p id="email-error" role="alert" className="text-body-sm" style={{ color: 'var(--color-status-error)' }}>
  Please enter a valid email address.
</p>
```

---

## Usage

```tsx
import { Input } from '../atoms/Input/Input';
import { Search, Mail } from 'lucide-react';

// Basic
<Input placeholder="Enter your name" />

// Email with label
<label htmlFor="email">Email</label>
<Input id="email" type="email" placeholder="you@example.com" />

// Search with icon
<Input
  type="search"
  aria-label="Search"
  placeholder="Search…"
  leftIcon={<Search size="var(--input-icon-size-md)" />}
/>

// Error state with message
<Input
  id="email"
  type="email"
  error
  aria-describedby="email-err"
  defaultValue="not-valid"
/>
<p id="email-err" role="alert">Invalid email address.</p>

// Loading state
<Input placeholder="Checking availability…" isLoading />

// Disabled
<Input defaultValue="USR-00412" disabled aria-label="Account ID, read-only" />

// Filled variant
<Input variant="filled" placeholder="Search…" />

// Flushed variant
<Input variant="flushed" placeholder="Your message" />

// Large size
<Input size="lg" placeholder="Search everything…" />
```

**With FormField (when available):**
```tsx
// FormField (L2 Molecule) composes Label + Input + error/hint text
<FormField label="Email" error="Invalid email">
  <Input type="email" />
</FormField>
```