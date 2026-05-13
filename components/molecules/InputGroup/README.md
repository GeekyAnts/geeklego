# InputGroup

A molecule that wraps an `Input` atom with start and/or end addon elements — icons, text labels, or interactive elements (e.g., a `Button`) — sharing a unified border and visual boundary.

## Description

`InputGroup` is the standard way to attach prefix or suffix decorations to a text input. The group container owns the border, background, radius, hover state, and focus-within indicator so the composition reads as a single visual unit. The inner `Input` always renders in `unstyled` mode — all visual treatment comes from the group.

Addons can be:
- **Decorative** — icon or short text label (e.g., `$`, `USD`, `+1`). Pass `aria-hidden="true"` on the content for purely decorative items.
- **Interactive** — a `Button` component used as a submit action for the field.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `prefix` | `ReactNode` | — | Node shown in the start addon slot (icon, text, any node). |
| `suffix` | `ReactNode` | — | Node shown in the end addon slot (icon, text, `Button`, any node). |
| `variant` | `'default' \| 'filled' \| 'flushed' \| 'unstyled'` | `'default'` | Visual style applied to the group container. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and typography scale. |
| `error` | `boolean` | `false` | Error state — shows error border; passed to inner Input. |
| `isLoading` | `boolean` | `false` | Loading state — shows spinner; disables interaction; passed to inner Input. |
| `disabled` | `boolean` | `false` | Disables the group. Mutes addon appearance and input. |
| `wrapperClassName` | `string` | — | Extra class names for the outer group wrapper. |
| `aria-label` | `string` | — | Accessible label for the `role="group"` element. Recommended when no visible label is present. |
| `...rest` | `InputHTMLAttributes` | — | All standard `<input>` attributes (value, onChange, placeholder, name, id, type, etc.) passed to the inner Input. |

---

## Tokens Used

| Token | Purpose |
|---|---|
| `--input-group-radius` | Border radius of the group container |
| `--input-group-border` | Border colour at rest |
| `--input-group-border-hover` | Border colour on hover |
| `--input-group-border-focus` | Border colour on focus-within |
| `--input-group-border-error` | Border colour in error state |
| `--input-group-border-disabled` | Border colour when disabled |
| `--input-group-bg` | Background of the input area |
| `--input-group-bg-hover` | Background on hover |
| `--input-group-bg-disabled` | Background when disabled |
| `--input-group-addon-bg` | Addon element background (muted) |
| `--input-group-addon-bg-disabled` | Addon background when disabled |
| `--input-group-addon-border` | Separator border between addon and input |
| `--input-group-addon-text` | Addon text/icon colour |
| `--input-group-addon-text-disabled` | Addon text colour when disabled |
| `--input-group-addon-px-{sm\|md\|lg}` | Addon horizontal padding per size |
| `--input-group-shadow` | Box shadow at rest (flat in light/dark) |
| `--input-group-shadow-hover` | Box shadow on hover (flat in light/dark) |

---

## Variants

| Variant | Visual strategy |
|---|---|
| `default` | Outlined container — visible border at rest, darkens on hover, switches to focus colour on focus-within |
| `filled` | Muted-background container — no visible border at rest; border appears on focus |
| `flushed` | Bottom-border only, no radius — editorial / minimal |
| `unstyled` | No border, no background — blank slate |

---

## Sizes

| Size | Height token | Typography |
|---|---|---|
| `sm` | `--input-height-sm` | `.text-body-sm` |
| `md` | `--input-height-md` | `.text-body-md` |
| `lg` | `--input-height-lg` | `.text-body-lg` |

Addon padding scales with size via `--input-group-addon-px-{size}`.

---

## States

| State | Visual treatment |
|---|---|
| Default | Resting border and muted addon background |
| Hover | Border deepens; background shifts one step |
| Focus-within | Border switches to focus colour |
| Error | Border locked to error colour in all states |
| Disabled | Muted border and muted addon bg; no hover/focus response; `cursor-not-allowed` |
| Loading | Spinner replaces inner content (via inner Input); group stays same size |

---

## Accessibility

**Semantic element:** `<div role="group">` wrapping a native `<input>` (via `Input` atom)

| Attribute | Applied to | Notes |
|---|---|---|
| `role="group"` | Group `<div>` | Groups the label, input, and addons as one logical unit |
| `aria-label` | Group `<div>` | Recommended when no visible `<label>` is present |
| `aria-disabled` | Inner `<input>` | Set alongside `disabled` by the inner Input atom |
| `aria-invalid` | Inner `<input>` | Set by the inner Input atom when `error={true}` |
| `aria-busy` | Inner `<input>` | Set by the inner Input atom when `isLoading={true}` |
| `aria-describedby` | `...rest` → inner `<input>` | Pass to connect a hint/error message element |

**Decorative addons** — icon or text-label addons that are purely decorative should have `aria-hidden="true"` applied to their content (not the container span):

```tsx
<InputGroup
  prefix={<Search size="var(--size-icon-sm)" aria-hidden="true" />}
/>
```

**Semantic addons** — text prefixes with meaning (e.g., `+1` country code) should be read by screen readers. Omit `aria-hidden` and ensure the group `aria-label` describes the full field intent:

```tsx
<InputGroup
  aria-label="Phone number"
  prefix={<span>+1</span>}
/>
```

**Interactive suffix** — a `Button` used as suffix retains its own accessible name and keyboard behaviour. No additional ARIA needed:

```tsx
<InputGroup
  aria-label="Newsletter signup"
  suffix={<Button variant="primary" size="sm">Subscribe</Button>}
/>
```

### Keyboard Interaction

| Key | Behaviour |
|---|---|
| `Tab` | Moves focus to the inner input (addons are not focusable unless they contain interactive elements) |
| Standard input keys | Character input, selection, deletion |
| `Tab` (with button suffix) | Continues to the Button in the suffix slot |

---

## Usage

```tsx
import { InputGroup } from '@geeklego/ui/components/molecules/InputGroup';
import { Button } from '@geeklego/ui/components/atoms/Button';
import { Search, Mail } from 'lucide-react';

// Icon prefix
<InputGroup
  aria-label="Search"
  placeholder="Search…"
  prefix={<Search size="var(--size-icon-sm)" aria-hidden="true" />}
/>

// Text prefix + suffix (currency input)
<InputGroup
  aria-label="Amount in USD"
  type="number"
  placeholder="0.00"
  prefix={<span aria-hidden="true">$</span>}
  suffix={<span aria-hidden="true">USD</span>}
/>

// Button suffix (newsletter signup)
<InputGroup
  aria-label="Newsletter signup"
  type="email"
  placeholder="your@email.com"
  prefix={<Mail size="var(--size-icon-sm)" aria-hidden="true" />}
  suffix={<Button variant="primary" size="sm">Subscribe</Button>}
/>

// Error state
<InputGroup
  aria-label="Email"
  type="email"
  placeholder="you@example.com"
  error
  aria-describedby="email-error"
/>
<span id="email-error">Enter a valid email address.</span>

// Filled variant, large size
<InputGroup
  variant="filled"
  size="lg"
  placeholder="Search docs…"
  prefix={<Search size="var(--size-icon-md)" aria-hidden="true" />}
  aria-label="Documentation search"
/>
```
