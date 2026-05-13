import type { ReactNode } from 'react';
import type { ChatHeaderStatus } from '../../molecules/ChatHeader/ChatHeader.types';
import type { ChatI18nStrings } from '../../utils/i18n';

export interface ChatMessageData {
  /** Stable unique identifier for the message. */
  id: string;
  /** Message text content. */
  content: string;
  /** Display-ready time string (e.g. "3:45 PM"). */
  timestamp: string;
  /** ID of the message sender. Compared against currentUserId to determine alignment. */
  senderId: string;
  /** Optional display name shown above received bubbles when showName is true. */
  senderName?: string;
  /** Optional avatar image URL for received messages. */
  senderAvatar?: string;
  /** Optional initials for fallback avatar (up to 2 characters). */
  senderInitials?: string;
  /** ISO date string (YYYY-MM-DD) used for date group separators. If omitted, no separator is injected. */
  date?: string;
}

export interface ChatParticipant {
  /** Display name of the conversation participant. */
  name: string;
  /** Online presence status. */
  status: ChatHeaderStatus;
  /** Avatar image URL. */
  avatarSrc?: string;
  /** Initials for fallback avatar. */
  avatarInitials?: string;
}

export interface ChatProps {
  /** Array of messages to render in the thread. */
  messages: ChatMessageData[];
  /** ID of the current user — messages from this sender are right-aligned as 'sent'. */
  currentUserId: string;
  /** Participant shown in the header. */
  participant: ChatParticipant;
  /** Called with the trimmed message text when the user sends. */
  onSend?: (message: string) => void;
  /** When true, the other participant's typing indicator is shown. */
  isTyping?: boolean;
  /** When true, replaces the message list with a skeleton loading state. */
  loading?: boolean;
  /** When true, shows the attachment button in ChatInputBar. Defaults to true. */
  showAttach?: boolean;
  /** Called when the attachment button is clicked. */
  onAttach?: () => void;
  /** Slot for action buttons rendered in ChatHeader (e.g. call, close, info). */
  headerActions?: ReactNode;
  /** Additional CSS class applied to the root <section>. */
  className?: string;
  /** Override localised system strings. */
  i18nStrings?: ChatI18nStrings;
}
