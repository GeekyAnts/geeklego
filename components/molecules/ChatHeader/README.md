# ChatHeader

Conversation header showing participant identity, presence status, and optional actions.

An L2 Molecule that renders a `<header>` element containing the participant's avatar, display name, status indicator (colored dot + label), and an optional end-aligned slot for action buttons (call, info, close, etc.).

---

## Usage

```tsx
import { ChatHeader } from '@geeklego/ui/components/molecules/ChatHeader';

<ChatHeader
  name="Sarah Reynolds"
  status="online"
  avatarInitials="SR"
/>
```

With action buttons:

```tsx
import { ChatHeader } from '@geeklego/ui/components/molecules/ChatHeader';
import { Button } from '@geeklego/ui/components/atoms/Button';
import { Phone, X } from 'lucide-react';

<ChatHeader
  name="Sarah Reynolds"
  status="online"
  avatarSrc="/avatars/sarah.jpg"
  actions={
    <>
      <Button variant="ghost" size="sm" iconOnly leftIcon={<Phone size="var(--size-icon-sm)" />}>Call</Button>
      <Button variant="ghost" size="sm" iconOnly leftIcon={<X size="var(--size-icon-sm)" />}>Close</Button>
    </>
  }
/>
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | **Required.** Display name of the conversation participant. |
| `status` | `'online' \| 'away' \| 'offline'` | `'offline'` | Online presence status. Controls dot color and accessible status label. |
| `avatarSrc` | `string` | — | Avatar image URL for the participant. |
| `avatarInitials` | `string` | — | Initials for the fallback avatar (up to 2 characters). |
| `actions` | `ReactNode` | — | Slot for action buttons (call, info, close). Renders end-aligned. |
| `i18nStrings` | `ChatHeaderI18nStrings` | — | Override localised system strings for this instance. |
| `className` | `string` | — | Additional CSS classes merged onto the `<header>` element. |
| `...rest` | `HTMLAttributes<HTMLElement>` | — | All standard `<header>` HTML attributes. |

---

## Status Variants

| Value | Dot Color Token | Default Label |
|-------|----------------|---------------|
| `online` | `--chat-header-status-online-color` | Online |
| `away` | `--chat-header-status-away-color` | Away |
| `offline` | `--chat-header-status-offline-color` | Offline |

---

## i18n Strings

| Key | Default | Purpose |
|-----|---------|---------|
| `onlineLabel` | `"Online"` | Status text and accessible label for online state |
| `awayLabel` | `"Away"` | Status text and accessible label for away state |
| `offlineLabel` | `"Offline"` | Status text and accessible label for offline state |

```tsx
<ChatHeader
  name="Sarah Reynolds"
  status="online"
  i18nStrings={{
    onlineLabel: 'En ligne',
    awayLabel: 'Absent',
    offlineLabel: 'Hors ligne',
  }}
/>
```

---

## Tokens Used

| Token | Purpose |
|-------|---------|
| `--chat-header-bg` | Header background color |
| `--chat-header-border` | Bottom border color |
| `--chat-header-px` | Horizontal padding (inline start/end) |
| `--chat-header-py` | Vertical padding (block) |
| `--chat-header-gap` | Gap between avatar, info column, and actions |
| `--chat-header-action-gap` | Gap between individual action buttons |
| `--chat-header-min-width` | Minimum width of the header |
| `--chat-header-title-color` | Participant name text color |
| `--chat-header-subtitle-color` | Status label text color |
| `--chat-header-status-dot-size` | Width and height of the status dot |
| `--chat-header-status-online-color` | Status dot color for online state |
| `--chat-header-status-away-color` | Status dot color for away state |
| `--chat-header-status-offline-color` | Status dot color for offline state |
| `--chat-header-title-overflow` | Overflow behavior for participant name |
| `--chat-header-title-whitespace` | Whitespace handling for participant name |
| `--chat-header-title-text-overflow` | Text overflow ellipsis for participant name |
| `--chat-header-subtitle-overflow` | Overflow behavior for status label |
| `--chat-header-subtitle-whitespace` | Whitespace handling for status label |
| `--chat-header-subtitle-text-overflow` | Text overflow ellipsis for status label |

---

## Accessibility

| Attribute | Element | Value |
|-----------|---------|-------|
| HTML element | Root | `<header>` — landmark scoped to parent `<section>` |
| `alt` | `<Avatar>` | Set to `name` prop — provides accessible participant name |
| `aria-hidden="true"` | Status dot `<span>` | Decorative — status conveyed by text label, not color alone |
| Visible status label | Status row | Status text (e.g. "Online") follows dot — meaning not color-only |
| Action buttons | Actions slot | Must have accessible names via `iconOnly` prop (renders `aria-label`) |

**Color alone is never the sole indicator of status.** Each status state shows both a colored dot and a visible text label resolved via the i18n system. Screen readers read the text label.

**Keyboard interaction** — ChatHeader is a non-interactive landmark. Interactive elements inside the `actions` slot follow their own keyboard patterns. Action buttons are reachable via Tab in DOM order.

| Key | Behavior |
|-----|----------|
| `Tab` | Moves focus through action buttons (if present) |
| `Enter` / `Space` | Activates the focused action button |
