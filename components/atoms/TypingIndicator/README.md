# TypingIndicator

Three-dot bounce animation indicating someone is composing a message. Announces to screen readers via `role="status"` and `aria-live="polite"`.

## Usage

```tsx
import { TypingIndicator } from '@geeklego/ui/components/atoms/TypingIndicator';

// Basic usage
<TypingIndicator />

// With sender name (screen reader announces "Sarah is typing…")
<TypingIndicator name="Sarah" />

// Custom i18n label
<TypingIndicator name="Sarah" i18nStrings={{ typingLabel: 'está escribiendo…' }} />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — | Name of the person currently typing. Used in the sr-only accessible label. |
| `i18nStrings` | `TypingIndicatorI18nStrings` | — | Override localised system strings for this instance. |
| `className` | `string` | — | Additional CSS classes merged onto the root element. |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | — | All standard div attributes forwarded to the root element. |

### TypingIndicatorI18nStrings

| Key | Type | Default | Description |
|---|---|---|---|
| `typingLabel` | `string` | `'is typing…'` | Overrides the "is typing…" portion of the sr-only label. |

## Tokens Used

| Token | Purpose |
|---|---|
| `--typing-indicator-bg` | Background colour of the indicator bubble |
| `--typing-indicator-border` | Border colour of the indicator bubble |
| `--typing-indicator-radius` | Border radius of the indicator bubble |
| `--typing-indicator-px` | Horizontal padding (inline) of the bubble |
| `--typing-indicator-py` | Vertical padding (block) of the bubble |
| `--typing-indicator-dot-color` | Fill colour of each animated dot |
| `--typing-indicator-dot-size` | Width and height of each dot |
| `--typing-indicator-dot-gap` | Gap between the three dots |
| `--typing-indicator-dot-delay-2` | Animation delay for the second dot |
| `--typing-indicator-dot-delay-3` | Animation delay for the third dot |

## Accessibility

| Attribute | Value | Purpose |
|---|---|---|
| `role` | `"status"` | Marks the element as a live region status container |
| `aria-live` | `"polite"` | Screen reader announces the content politely when the component mounts |
| dot `aria-hidden` | `"true"` | The three animated dots are hidden from the accessibility tree |
| sr-only text | `"{name} is typing…"` | Visible only to screen readers; constructed from the `name` prop |

When `name` is provided, the sr-only text reads: **"{name} is typing…"**  
When `name` is omitted, the sr-only text reads: **"Typing…"**

The `typingLabel` i18n string allows overriding the "is typing…" portion for non-English locales.

There are no keyboard interactions — this is a purely visual/auditory indicator with no interactive elements.
