# Chat

Full chat interface organism. Composes `ChatHeader`, a scrollable `ChatMessage` list with date separators, `TypingIndicator`, and `ChatInputBar`.

## Overview

`Chat` is an L3 Organism that manages a complete conversation thread. It determines message alignment by comparing each message's `senderId` against `currentUserId`, renders date group separators between messages from different days, auto-scrolls to the latest message, and optionally shows a typing indicator when the remote participant is composing.

---

## Props — `ChatProps`

| Prop | Type | Default | Description |
|---|---|---|---|
| `messages` | `ChatMessageData[]` | — | Array of messages to render in the thread. |
| `currentUserId` | `string` | — | ID of the current user. Messages from this sender are right-aligned as `sent`. |
| `participant` | `ChatParticipant` | — | Participant shown in the header. |
| `onSend` | `(message: string) => void` | `undefined` | Called with the trimmed message text when the user sends. |
| `isTyping` | `boolean` | `false` | When true, the typing indicator is shown below the message list. |
| `loading` | `boolean` | `false` | When true, replaces the message list with a skeleton loading state. |
| `showAttach` | `boolean` | `true` | When true, shows the attachment button in `ChatInputBar`. |
| `onAttach` | `() => void` | `undefined` | Called when the attachment button is clicked. |
| `headerActions` | `ReactNode` | `undefined` | Slot for action buttons rendered in `ChatHeader`. |
| `className` | `string` | `undefined` | Additional CSS class applied to the root `<section>`. |
| `i18nStrings` | `ChatI18nStrings` | `undefined` | Override localised system strings. |

---

## Types

### `ChatMessageData`

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Stable unique identifier for the message. |
| `content` | `string` | Yes | Message text content. |
| `timestamp` | `string` | Yes | Display-ready time string (e.g. `"3:45 PM"`). |
| `senderId` | `string` | Yes | ID of the message sender. Compared against `currentUserId`. |
| `senderName` | `string` | No | Display name shown above received bubbles when `showName` is true. |
| `senderAvatar` | `string` | No | Avatar image URL for received messages. |
| `senderInitials` | `string` | No | Initials for fallback avatar (up to 2 characters). |
| `date` | `string` | No | ISO date string (`YYYY-MM-DD`) used for date group separators. |

### `ChatParticipant`

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | Yes | Display name of the conversation participant. |
| `status` | `ChatHeaderStatus` | Yes | Online presence status (`"online"` \| `"away"` \| `"offline"` \| `"busy"`). |
| `avatarSrc` | `string` | No | Avatar image URL. |
| `avatarInitials` | `string` | No | Initials for fallback avatar. |

---

## CSS Tokens Used

| Token | Purpose |
|---|---|
| `--chat-bg` | Root background colour |
| `--chat-border` | Root border colour |
| `--chat-radius` | Root border radius |
| `--chat-shadow` | Root box shadow |
| `--chat-min-width` | Minimum width of the chat widget |
| `--chat-messages-bg` | Scrollable message area background |
| `--chat-messages-px` | Horizontal padding of the message list |
| `--chat-messages-py` | Vertical padding of the message list |
| `--chat-messages-gap` | Vertical gap between message bubbles |
| `--chat-date-separator-color` | Date separator label text colour |
| `--chat-date-separator-line` | Date separator horizontal rule colour |
| `--chat-loading-height` | Height of each skeleton loading row |
| `--chat-loading-radius` | Border radius of skeleton loading boxes |

---

## Accessibility

- **`<section role="log">`** — `role="log"` implicitly sets `aria-live="polite"` and `aria-relevant="additions text"`, so screen readers announce new messages without interrupting the user.
- **`aria-label`** on the root section uses the localised `chatLabel` string (from `i18nStrings`).
- **Date separators** render as `<li role="separator" aria-label="...">` so assistive technologies announce the date boundary when navigating through the message list.
- **Typing indicator** uses `role="status"` internally (inside `TypingIndicator`) so screen readers announce when the participant starts or stops typing.
- **Auto-scroll** is triggered via `scrollIntoView({ behavior: 'smooth' })` on a visually hidden anchor `<div aria-hidden="true">` at the bottom of the list. No focus is moved programmatically, preserving the user's keyboard focus.
- **Message list** is a `<ul role="list">` — each `ChatMessage` and date separator is an `<li>` — providing correct list semantics for assistive technologies.
- **Loading state** uses `aria-busy="true"` on the skeleton container.

### Keyboard Interaction

| Key | Action |
|---|---|
| `Tab` | Moves focus into the input bar |
| `Enter` | Sends the composed message (single-line mode) |
| `Ctrl+Enter` / `Cmd+Enter` | Sends the composed message (multi-line mode) |
| `Tab` (in header) | Cycles through header action buttons |

---

## Usage

```tsx
import { Chat } from '@geeklego/ui/components/organisms/Chat';
import type { ChatMessageData, ChatParticipant } from '@geeklego/ui/components/organisms/Chat/Chat.types';
import { useState } from 'react';

const participant: ChatParticipant = {
  name: 'Sarah Reynolds',
  status: 'online',
  avatarInitials: 'SR',
};

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageData[]>([
    {
      id: '1',
      senderId: 'user-2',
      senderName: 'Sarah',
      senderInitials: 'SR',
      content: 'Good morning! Did you get a chance to review the proposal?',
      timestamp: '9:01 AM',
      date: '2026-04-09',
    },
  ]);

  const handleSend = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        senderId: 'user-1',
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
  };

  return (
    <div className="h-screen max-w-lg mx-auto flex flex-col p-4">
      <Chat
        messages={messages}
        currentUserId="user-1"
        participant={participant}
        onSend={handleSend}
        showAttach
        className="flex-1"
      />
    </div>
  );
}
```

---

## Loading State

Pass `loading={true}` while fetching the initial message history. The message list is replaced by animated skeleton placeholders:

```tsx
<Chat
  messages={[]}
  currentUserId="user-1"
  participant={participant}
  loading
  className="h-full"
/>
```

---

## Date Separators

Date separators are injected automatically when a message's `date` field differs from the previous message's `date`. Label mapping:

- Same as today's date → `"Today"` (or `i18nStrings.todayLabel`)
- Same as yesterday's date → `"Yesterday"` (or `i18nStrings.yesterdayLabel`)
- Older → formatted as `"Apr 8"` using the browser's locale

Omit the `date` field from messages if you do not want any separators.
