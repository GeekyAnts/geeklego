# Textarea

A multi-line text input atom built on the native `<textarea>` element. Inherits the same 4-variant visual strategy as `Input` — each variant uses a fundamentally different treatment to communicate its emphasis level.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'default' \| 'filled' \| 'flushed' \| 'unstyled'` | `'default'` | Visual style. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Padding and typography scale. |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Resize handle behaviour. |
| `error` | `boolean` | `false` | Error state — error border + `aria-invalid`. |
| `isLoading` | `boolean` | `false` | Loading state — shows spinner, disables interaction. |
| `rows` | `number` | `4` | Number of visible text rows (native `rows` attribute). |
| `wrapperClassName` | `string` | — | Extra classes on the outer wrapper `<div>`. |
| `disabled` | `boolean` | — | Disabled state via native attribute + `aria-disabled`. |
| `required` | `boolean` | — | Sets `aria-required`. Add a `<label>` with a visual indicator separately. |
| `id` | `string` | auto | ID forwarded to the inner `<textarea>`. Auto-generated via `useId()` when omitted. |
| `placeholder` | `string` | — | Native placeholder text. |
| `defaultValue` / `value` | `string` | — | Uncontrolled / controlled value. |
| `...rest` | `TextareaHTMLAttributes` | — | All other native textarea attributes are forwarded. |

> **Note:** `size` is omitted from `TextareaHTMLAttributes` to avoid colliding with the visual size prop.

---

## Tokens Used

```css
/* Sizing */
--textarea-px-sm / -md / -lg
--textarea-py-sm / -md / -lg
--textarea-radius

/* Text */
--textarea-text
--textarea-text-placeholder
--textarea-text-disabled
--textarea-icon-color

/* Default variant */
--textarea-bg              --textarea-bg-hover        --textarea-bg-disabled
--textarea-border          --textarea-border-hover
--textarea-border-focus    --textarea-border-error    --textarea-border-disabled

/* Filled variant */
--textarea-filled-bg       --textarea-filled-bg-hover  --textarea-filled-bg-focus

/* Shadow */
--textarea-shadow           --textarea-shadow-hover

/* Content flexibility */
--textarea-overflow         --textarea-whitespace       --textarea-word-break
```

All tokens live in `design-system/geeklego.css` under the `/* Textarea */` generated block.

---

## Variants

| Variant | Visual Strategy | When to use |
|---|---|---|
| `default` | Visible border at rest; bg tints + border darkens on hover; focus border on focus | Standard form fields |
| `filled` | Muted bg, no border; hover deepens bg; focus-within reveals border + white bg | Embedded in card/panel contexts |
| `flushed` | Border-bottom only, no side borders, no radius | Minimal / editorial layouts |
| `unstyled` | No border, no bg — blank slate | Custom-composed fields |

---

## Sizes

| Size | Padding (px/py) | Typography |
|---|---|---|
| `sm` | `--spacing-component-sm` | `text-body-sm` |
| `md` | `--spacing-component-md` | `text-body-md` |
| `lg` | `--spacing-component-lg` | `text-body-lg` |

Height is determined by the `rows` prop (native textarea behaviour) combined with line-height and padding. Default is `rows={4}`.

---

## Resize Options

| Resize | CSS value | Notes |
|---|---|---|
| `none` | `resize: none` | Fixed dimensions, no handle |
| `vertical` | `resize: vertical` | Default — user adjusts height only |
| `horizontal` | `resize: horizontal` | User adjusts width only |
| `both` | `resize: both` | Unconstrained resizing |

---

## States

| State | What changes |
|---|---|
| Default | Resting appearance. No shadow in light/dark. |
| Hover | Background shifts one step deeper + border tints (light/dark), shadow lifts (brand). Two-property change. |
| Focus-visible | Inset focus ring (`--color-border-focus-visible`). Wrapper border also changes to focus colour. |
| Error | Border locked to `--textarea-border-error` across all states. `aria-invalid="true"` set. |
| Disabled | Muted bg + muted text. No hover/active response. `cursor-not-allowed`. Both `disabled` and `aria-disabled` set. |
| Loading | Spinner in top-right corner. Textarea disabled. `aria-busy="true"` set. |

---

## Accessibility

**Semantic element:** `<textarea>` — native multi-line text input. Screen readers announce it as "multi-line edit text".

**Role:** None required — `<textarea>` has implicit `textbox` role with `multiline: true`.

**ARIA attributes used:**

| Attribute | When set | Value |
|---|---|---|
| `aria-disabled` | `disabled` or `isLoading` | `true` |
| `aria-required` | `required` prop | `true` |
| `aria-busy` | `isLoading` | `true` |
| `aria-invalid` | `error` | `"true"` |
| `aria-describedby` | `error` | `"{id}-error"` — wire the error message element to this ID |

**Label association:** Textarea does not render a `<label>`. The consumer must provide one:

```tsx
// Pattern 1 — explicit association (preferred)
<label htmlFor="message">Message</label>
<Textarea id="message" placeholder="Write here…" />

// Pattern 2 — aria-label when no visible label
<Textarea aria-label="Search query" />
```

**Error message wiring:** When `error` is true, the component sets `aria-describedby="{id}-error"`. Render your error message with a matching `id`:

```tsx
<Textarea id="bio" error aria-describedby="bio-error" />
<p id="bio-error" role="alert" className="text-body-sm" style={{ color: 'var(--color-status-error)' }}>
  Bio must be at least 20 characters.
</p>
```

**Keyboard interaction:**

| Key | Action |
|---|---|
| `Tab` | Move focus to the textarea |
| `Shift + Tab` | Move focus away from the textarea |
| Any character key | Insert text at caret |
| `Enter` | Insert newline (native multiline behaviour) |
| `Ctrl/Cmd + A` | Select all text |
| Arrow keys | Move caret within text |

**Touch target:** The textarea surface is always large enough to meet the WCAG 2.5.8 minimum 24×24px target. With even the `sm` size and a single row, the target exceeds 44×24px.

**Focus ring:** `focus-ring-inset` is applied directly to the `<textarea>` element. The wrapper also shifts border colour on `focus-within` as an additional visual enhancement.

---

## Usage

```tsx
import { Textarea } from '../atoms/Textarea/Textarea';

// Basic
<Textarea placeholder="Enter your message…" />

// With label (required in production)
<div className="flex flex-col gap-[var(--spacing-component-xs)]">
  <label htmlFor="message" className="text-label-sm text-primary">Message</label>
  <Textarea id="message" placeholder="Write here…" rows={6} />
</div>

// Controlled
const [value, setValue] = useState('');
<Textarea value={value} onChange={(e) => setValue(e.target.value)} rows={4} />

// Error state with wired message
<Textarea id="bio" error aria-describedby="bio-error" rows={3} />
<p id="bio-error" role="alert">Bio must be at least 20 characters.</p>

// Fixed size — no resize
<Textarea resize="none" rows={5} />

// Filled variant in a card
<Textarea variant="filled" placeholder="Add a note…" rows={3} />
```

---

## Schema.org

Textarea does not map to a Schema.org type. No `schema` prop is provided.