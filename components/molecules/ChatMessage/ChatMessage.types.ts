import type { HTMLAttributes } from 'react';

export type ChatMessageAlignment = 'sent' | 'received';

export interface ChatMessageProps extends HTMLAttributes<HTMLLIElement> {
  /** Visual alignment and color scheme. 'sent' = right-aligned, no avatar. 'received' = left-aligned with avatar. Defaults to 'received'. */
  alignment?: ChatMessageAlignment;
  /** Message body text. */
  children: string;
  /** Display-ready timestamp string (e.g. "3:45 PM"). */
  timestamp?: string;
  /** Sender's display name. Only rendered for 'received' messages when showName is true. */
  senderName?: string;
  /** Whether to show the sender name above the bubble (received only). Defaults to false. */
  showName?: boolean;
  /** URL or initials for the sender avatar (received messages only). */
  avatarSrc?: string;
  /** Initials for fallback avatar (received messages only). */
  avatarInitials?: string;
}
