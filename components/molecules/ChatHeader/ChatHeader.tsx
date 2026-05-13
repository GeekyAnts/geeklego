"use client"
import { forwardRef, memo, useMemo } from 'react';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type { ChatHeaderProps, ChatHeaderStatus } from './ChatHeader.types';

const statusDotClasses: Record<ChatHeaderStatus, string> = {
  online:  'bg-[var(--chat-header-status-online-color)]',
  away:    'bg-[var(--chat-header-status-away-color)]',
  offline: 'bg-[var(--chat-header-status-offline-color)]',
};

export const ChatHeader = memo(forwardRef<HTMLElement, ChatHeaderProps>(
  ({
    name,
    status = 'offline',
    avatarSrc,
    avatarInitials,
    actions,
    i18nStrings,
    className,
    ...rest
  }, ref) => {
    const i18n = useComponentI18n('chatHeader', i18nStrings);

    const statusLabel = status === 'online'
      ? i18n.onlineLabel
      : status === 'away'
        ? i18n.awayLabel
        : i18n.offlineLabel;

    const classes = useMemo(() => [
      'flex items-center gap-[var(--chat-header-gap)]',
      'bg-[var(--chat-header-bg)]',
      'border-b border-[var(--chat-header-border)]',
      'ps-[var(--chat-header-px)] pe-[var(--chat-header-px)]',
      'py-[var(--chat-header-py)]',
      'min-w-[var(--chat-header-min-width)]',
      'card-shell',
      className,
    ].filter(Boolean).join(' '), [className]);

    const dotClasses = useMemo(() => [
      'inline-block rounded-full shrink-0',
      'w-[var(--chat-header-status-dot-size)] h-[var(--chat-header-status-dot-size)]',
      statusDotClasses[status],
    ].join(' '), [status]);

    return (
      <header ref={ref} className={classes} {...rest}>
        {/* Avatar */}
        <Avatar
          variant={avatarSrc ? 'image' : avatarInitials ? 'initials' : 'fallback'}
          size="sm"
          shape="circle"
          src={avatarSrc}
          initials={avatarInitials}
          alt={name}
        />

        {/* Participant info */}
        <div className="flex flex-col gap-[var(--spacing-component-xs)] content-flex min-w-0">
          <span className="text-label-md text-[var(--chat-header-title-color)] truncate-label">
            {name}
          </span>
          <div className="flex items-center gap-[var(--spacing-component-xs)]">
            <span className={dotClasses} aria-hidden="true" />
            <span className="text-caption-sm text-[var(--chat-header-subtitle-color)] truncate-label">
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Actions slot */}
        {actions && (
          <div className="flex items-center gap-[var(--chat-header-action-gap)] flex-shrink-0 ms-auto">
            {actions}
          </div>
        )}
      </header>
    );
  },
));
ChatHeader.displayName = 'ChatHeader';
