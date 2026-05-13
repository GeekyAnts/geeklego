"use client"
import { forwardRef, memo, useMemo } from 'react';
import type { ChatBubbleProps, ChatBubbleVariant } from './ChatBubble.types';

const variantClasses: Record<ChatBubbleVariant, string> = {
  sent: [
    'bg-[var(--chat-bubble-sent-bg)] text-[var(--chat-bubble-sent-text)]',
    'border border-transparent',
    'hover:bg-[var(--chat-bubble-sent-bg-hover)] hover:border-[var(--chat-bubble-sent-bg-hover)]',
    'ms-auto',
  ].join(' '),
  received: [
    'bg-[var(--chat-bubble-received-bg)] text-[var(--chat-bubble-received-text)]',
    'border border-[var(--chat-bubble-received-border)]',
    'hover:bg-[var(--chat-bubble-received-bg-hover)] hover:border-[var(--color-border-default)]',
    'me-auto',
  ].join(' '),
  system: [
    'bg-[var(--chat-bubble-system-bg)] text-[var(--chat-bubble-system-text)]',
    'border border-[var(--chat-bubble-system-border)]',
    'mx-auto text-center',
  ].join(' '),
};

const timestampClasses: Record<ChatBubbleVariant, string> = {
  sent:     'text-[var(--chat-bubble-sent-timestamp)] text-end',
  received: 'text-[var(--chat-bubble-received-timestamp)] text-start',
  system:   'text-[var(--chat-bubble-system-timestamp)] text-center',
};

export const ChatBubble = memo(forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ variant = 'received', timestamp, className, children, ...rest }, ref) => {
    const classes = useMemo(() => [
      'relative flex flex-col gap-[var(--chat-bubble-gap)]',
      'rounded-[var(--chat-bubble-radius)]',
      'ps-[var(--chat-bubble-px)] pe-[var(--chat-bubble-px)] py-[var(--chat-bubble-py)]',
      'max-w-[var(--chat-bubble-max-width)]',
      'shadow-[var(--chat-bubble-shadow)]',
      'transition-default',
      variantClasses[variant],
      className,
    ].filter(Boolean).join(' '), [variant, className]);

    const timeClasses = useMemo(() => [
      'text-caption-sm',
      timestampClasses[variant],
    ].join(' '), [variant]);

    return (
      <div ref={ref} className={classes} {...rest}>
        <p className="text-body-sm">{children}</p>
        {timestamp && (
          <time className={timeClasses}>
            {timestamp}
          </time>
        )}
      </div>
    );
  },
));
ChatBubble.displayName = 'ChatBubble';
