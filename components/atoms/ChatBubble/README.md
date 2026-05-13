# ChatBubble

Message bubble for chat interfaces. Three variants — sent (current user), received (other party), system — with optional timestamp.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'sent' \| 'received' \| 'system'` | `'received'` | Visual style and alignment |
| `timestamp` | `string` | `undefined` | Display-ready string shown below the message, rendered verbatim |
| `children` | `ReactNode` | required | Message content — plain text or rich inline nodes |
| `className` | `string` | `undefined` | Additional classes merged onto the root element |

## Tokens Used

| Token | Purpose |
|---|---|
| `--chat-bubble-radius` | Border radius for all corners |
| `--chat-bubble-px` | Horizontal padding |
| `--chat-bubble-py` | Vertical padding |
| `--chat-bubble-max-width` | Maximum bubble width |
| `--chat-bubble-gap` | Gap between content and timestamp |
| `--chat-bubble-shadow` | Box shadow on bubble |
| `--chat-bubble-sent-bg` | Sent bubble background |
| `--chat-bubble-sent-bg-hover` | Sent bubble hover background |
| `--chat-bubble-sent-text` | Sent bubble text colour |
| `--chat-bubble-sent-timestamp` | Sent timestamp colour |
| `--chat-bubble-received-bg` | Received bubble background |
| `--chat-bubble-received-bg-hover` | Received bubble hover background |
| `--chat-bubble-received-text` | Received bubble text colour |
| `--chat-bubble-received-border` | Received bubble border colour |
| `--chat-bubble-received-timestamp` | Received timestamp colour |
| `--chat-bubble-system-bg` | System message background |
| `--chat-bubble-system-text` | System message text colour |
| `--chat-bubble-system-border` | System message border |
| `--chat-bubble-system-timestamp` | System timestamp colour |
| `--chat-bubble-text-max-width` | Max width for text content |

## Variants

| Variant | Strategy | Alignment | Use case |
|---|---|---|---|
| `received` | Muted secondary bg + border | `me-auto` (inline-start) | Messages from other participants |
| `sent` | Filled brand bg, no resting border | `ms-auto` (inline-end) | Messages from the current user |
| `system` | Tertiary bg + border | `mx-auto text-center` | Notices, date separators, call events |

## States

| State | Behaviour |
|---|---|
| Default | Resting bubble with variant-specific background and border |
| Hover (sent) | Background deepens (`--chat-bubble-sent-bg-hover`) + border appears (`border-transparent` → `border-[--chat-bubble-sent-bg-hover]`) |
| Hover (received) | Background changes (`--chat-bubble-received-bg-hover`) + border darkens (`--color-border-default`) |
| Focus-visible | Not applicable — ChatBubble is non-interactive |

## Accessibility

- **Element:** `<div>` — no native interactive semantics, no keyboard interaction
- **Timestamp:** Rendered as `<time>` element for semantic date/time meaning; screen readers announce it naturally after message content
- **Reading order:** DOM order conveys conversation flow — use appropriate ordering in the parent container
- **Colour + secondary cue:** Variant is communicated by background colour AND alignment AND border treatment — not colour alone
- **No keyboard interaction:** ChatBubble is a display-only element; no focus management required

## Usage

```tsx
import { ChatBubble } from '@geeklego/ui/components/atoms/ChatBubble';

// Received message
<ChatBubble variant="received" timestamp="2:34 PM">
  Hey! Are you free for a call later today?
</ChatBubble>

// Sent message
<ChatBubble variant="sent" timestamp="2:35 PM">
  Sure, I'm available after 3pm!
</ChatBubble>

// System notice
<ChatBubble variant="system">
  You are now connected
</ChatBubble>
```
