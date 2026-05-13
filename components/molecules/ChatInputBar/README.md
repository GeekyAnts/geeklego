# ChatInputBar

Message composition area — textarea with send and optional attachment buttons.

An L2 Molecule that renders a `<form>` containing an optional attachment ghost button, an auto-growing unstyled Textarea atom, and a primary send button. Submitting clears the textarea and calls `onSend` with the trimmed message text.

---

## Usage

```tsx
import { ChatInputBar } from '@geeklego/ui/components/molecules/ChatInputBar';

<ChatInputBar
  showAttach
  onSend={(message) => console.log('Sent:', message)}
/>
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `onSend` | `(message: string) => void` | — | Called with the trimmed message text when the user sends. |
| `maxLength` | `number` | — | Maximum character count enforced via `maxLength` on the textarea. No counter UI is shown. |
| `showAttach` | `boolean` | `true` | When true, renders the attachment icon button at the start of the bar. |
| `onAttach` | `() => void` | — | Called when the attachment button is clicked. |
| `disabled` | `boolean` | `false` | Disables the entire form — textarea and both buttons. |
| `i18nStrings` | `ChatInputBarI18nStrings` | — | Per-instance overrides for system strings (see i18n section below). |
| `className` | `string` | — | Additional classes merged onto the `<form>` element. |
| `...rest` | `FormHTMLAttributes` | — | All other `<form>` attributes (excluding `onSubmit`) spread onto the root element. |

---

## i18n Strings (`ChatInputBarI18nStrings`)

| Key | Default | Description |
|---|---|---|
| `sendLabel` | `"Send message"` | `aria-label` for the send button and `aria-label` on the textarea for screen reader context. |
| `attachLabel` | `"Attach file"` | `aria-label` for the attachment icon button. |
| `placeholder` | `"Type a message…"` | Placeholder text shown inside the textarea when empty. |

---

## Tokens Used

| Token | Purpose |
|---|---|
| `--chat-input-bar-bg` | Background colour of the form bar. |
| `--chat-input-bar-border` | Colour of the top border that separates the bar from the chat log. |
| `--chat-input-bar-px` | Horizontal padding inside the bar. |
| `--chat-input-bar-py` | Vertical padding inside the bar. |
| `--chat-input-bar-gap` | Gap between the attachment button, textarea, and send button. |
| `--chat-input-bar-min-width` | Minimum width of the bar to prevent collapse in flex/grid layouts. |

---

## Keyboard Interaction

| Key | Action |
|---|---|
| `Enter` (form submit) | Submits the message when the textarea has content. |
| `Ctrl + Enter` / `Cmd + Enter` | Submits the message from inside the textarea without a newline. |
| `Tab` | Moves focus between the attachment button, textarea, and send button. |

---

## Accessibility

- The root element is a `<form>`, giving the composition area implicit form landmark semantics.
- The attachment button is icon-only; its `aria-label` (default: "Attach file") is resolved via `useComponentI18n` so it is always announced by screen readers.
- The send button is icon-only; its `aria-label` (default: "Send message") is likewise resolved via `useComponentI18n`.
- When the textarea is empty, the send button has `disabled` applied, which also sets `aria-disabled="true"` via the Button atom, preventing activation via keyboard.
- The textarea carries `aria-label` matching the send button label, giving screen reader users context about its purpose without a visible `<label>`.
- The `Ctrl/Cmd + Enter` shortcut is an additive keyboard affordance — the standard form submit via `Enter` remains intact.
