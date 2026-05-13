"use client"
import { forwardRef, memo, useMemo } from 'react';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { ChatBubble } from '../../atoms/ChatBubble/ChatBubble';
import type { ChatMessageProps } from './ChatMessage.types';

export const ChatMessage = memo(forwardRef<HTMLLIElement, ChatMessageProps>(
  ({
    alignment = 'received',
    children,
    timestamp,
    senderName,
    showName = false,
    avatarSrc,
    avatarInitials,
    className,
    ...rest
  }, ref) => {
    const isSent = alignment === 'sent';

    const rowClasses = useMemo(() => [
      'flex items-end gap-[var(--chat-message-gap)]',
      isSent ? 'flex-row-reverse' : 'flex-row',
      className,
    ].filter(Boolean).join(' '), [isSent, className]);

    const bubbleColumnClasses = useMemo(() => [
      'flex flex-col gap-[var(--spacing-component-xs)] min-w-0',
      isSent ? 'items-end' : 'items-start',
    ].join(' '), [isSent]);

    return (
      <li ref={ref} className={rowClasses} {...rest}>
        {/* Avatar — received messages only */}
        {!isSent && (
          <Avatar
            variant={avatarSrc ? 'image' : avatarInitials ? 'initials' : 'fallback'}
            size="sm"
            src={avatarSrc}
            initials={avatarInitials}
            alt={senderName ?? 'Sender avatar'}
            aria-hidden={!showName}
          />
        )}

        <div className={bubbleColumnClasses}>
          {/* Sender name — received messages, optional */}
          {!isSent && showName && senderName && (
            <span
              className="text-caption-sm text-[var(--chat-message-name-color)] truncate-label ps-[var(--chat-bubble-px)]"
              aria-hidden="true"
            >
              {senderName}
            </span>
          )}

          <ChatBubble variant={isSent ? 'sent' : 'received'} timestamp={timestamp}>
            {children}
          </ChatBubble>
        </div>
      </li>
    );
  },
));
ChatMessage.displayName = 'ChatMessage';
