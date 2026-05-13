# ChatMessage

A single message row in a chat thread. Composes Avatar + ChatBubble. Handles sent/received alignment, sender name, and avatar display.

## Usage

```tsx
import { ChatMessage } from '@geeklego/ui/components/molecules/ChatMessage';

// Received message (left-aligned, with avatar)
<ul>
  <ChatMessage
    alignment="received"
    avatarInitials="SR"
    senderName="Sarah"
    showName
    timestamp="3:45 PM"
  >
    Hey! Are you free for a call later today?
  </ChatMessage>
</ul>

// Sent message (right-aligned, no avatar)
<ul>
  <ChatMessage
    alignment="sent"
    timestamp="3:47 PM"
  >
    Sure, I'm available after 4 PM!
  </ChatMessage>
</ul>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `alignment` | `'sent' \| 'received'` | `'received'` | Visual alignment and color scheme. `'sent'` = right-aligned, no avatar. `'received'` = left-aligned with avatar. |
| `children` | `string` | — | Message body text. **Required.** |
| `timestamp` | `string` | — | Display-ready timestamp string (e.g. `"3:45 PM"`). |
| `senderName` | `string` | — | Sender's display name. Only rendered for `'received'` messages when `showName` is `true`. |
| `showName` | `boolean` | `false` | Whether to show the sender name above the bubble (received only). |
| `avatarSrc` | `string` | — | URL for the sender avatar image (received messages only). Takes precedence over `avatarInitials`. |
| `avatarInitials` | `string` | — | Initials for fallback avatar (received messages only). Used when `avatarSrc` is not provided. |
| `className` | `string` | — | Additional CSS classes applied to the `<li>` element. |

All other `HTMLAttributes<HTMLLIElement>` props are forwarded to the root `<li>` element.

## Tokens Used

| Token | Purpose |
|-------|---------|
| `--chat-message-gap` | Gap between the avatar and the bubble column |
| `--chat-message-row-gap` | Vertical gap between consecutive message rows (used on the parent `<ul>`) |
| `--chat-message-name-color` | Text color for the sender name label |

## Alignment Behaviour

| `alignment` | Avatar | Sender Name | Bubble direction |
|-------------|--------|-------------|-----------------|
| `'received'` | Left side | Above bubble (when `showName` is `true`) | `flex-row`, `justify-start` |
| `'sent'` | None | Hidden | `flex-row-reverse`, `justify-end` |

## Accessibility

- **Element:** `<li>` — must be placed inside a `<ul>` or `<ol>` parent (e.g. `<ul className="list-none">`).
- **Avatar alt text:** The `Avatar` receives `alt={senderName ?? 'Sender avatar'}`, providing the sender's name to screen readers without needing to display it visually.
- **Sender name span:** Marked `aria-hidden="true"` since the same information is conveyed via the avatar `alt` attribute.
- **Avatar hidden state:** When `showName` is `false`, the avatar receives `aria-hidden={true}` to avoid double-announcement.
- **Bubble content:** Read by screen readers in natural DOM order (name → bubble text → timestamp).
- **No keyboard interaction:** ChatMessage is a display-only component. It contains no interactive elements.

### Recommended parent markup

```tsx
<ul
  role="list"
  aria-label="Chat messages"
  className="flex flex-col gap-[var(--chat-message-row-gap)] list-none p-0 m-0"
>
  <ChatMessage alignment="received" avatarInitials="SR" senderName="Sarah" timestamp="9:00 AM">
    Hello!
  </ChatMessage>
  <ChatMessage alignment="sent" timestamp="9:01 AM">
    Hi there!
  </ChatMessage>
</ul>
```

## Thread Example

```tsx
<ul role="list" aria-label="Conversation with Sarah" className="flex flex-col gap-[var(--chat-message-row-gap)] list-none p-0 m-0">
  {/* First message from sender — show name */}
  <ChatMessage alignment="received" avatarInitials="SR" senderName="Sarah" showName timestamp="9:01 AM">
    Good morning! Did you get a chance to review the proposal?
  </ChatMessage>

  {/* Consecutive message from same sender — omit name */}
  <ChatMessage alignment="received" avatarInitials="SR" senderName="Sarah" timestamp="9:02 AM">
    I can walk you through any questions you have.
  </ChatMessage>

  {/* Current user reply */}
  <ChatMessage alignment="sent" timestamp="9:04 AM">
    Yes, I went through it last night. Overall it looks great!
  </ChatMessage>
</ul>
```
