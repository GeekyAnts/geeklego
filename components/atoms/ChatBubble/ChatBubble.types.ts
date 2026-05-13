import type { HTMLAttributes, ReactNode } from 'react';

export type ChatBubbleVariant = 'sent' | 'received' | 'system';

export interface ChatBubbleProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual style and alignment. 'sent' = current user (action-primary bg, end-aligned). 'received' = other party (secondary bg, start-aligned). 'system' = system message (tertiary bg, centered). Defaults to 'received'. */
  variant?: ChatBubbleVariant;
  /** ISO timestamp string or display-ready string shown below the message. When a string is passed it is rendered verbatim. */
  timestamp?: string;
  /** Message content — plain text or rich inline nodes. */
  children: ReactNode;
}
