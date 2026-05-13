"use client";
import { Fragment, memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { ChatHeader } from '../../molecules/ChatHeader/ChatHeader';
import { ChatMessage } from '../../molecules/ChatMessage/ChatMessage';
import { ChatInputBar } from '../../molecules/ChatInputBar/ChatInputBar';
import { TypingIndicator } from '../../atoms/TypingIndicator/TypingIndicator';
import { Skeleton } from '../../atoms/Skeleton/Skeleton';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import { sanitizeHref } from '../../utils/security/sanitize';
import type { ChatProps, ChatMessageData } from './Chat.types';

// ── Date separator helpers ──────────────────────────────────────────────────

function getDateLabel(date: string, todayLabel: string, yesterdayLabel: string): string {
  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayISO = yesterday.toISOString().slice(0, 10);

  if (date === todayISO) return todayLabel;
  if (date === yesterdayISO) return yesterdayLabel;
  return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// ── Loading skeleton ────────────────────────────────────────────────────────

const LoadingSkeletons = () => (
  <div
    className="flex flex-col gap-[var(--chat-messages-gap)] ps-[var(--chat-messages-px)] pe-[var(--chat-messages-px)] py-[var(--chat-messages-py)]"
    aria-busy="true"
    aria-label="Loading messages"
  >
    <div className="flex justify-start">
      <Skeleton variant="box" width="55%" height="var(--chat-loading-height)" animated />
    </div>
    <div className="flex justify-end">
      <Skeleton variant="box" width="45%" height="var(--chat-loading-height)" animated />
    </div>
    <div className="flex justify-start">
      <Skeleton variant="box" width="65%" height="var(--chat-loading-height)" animated />
    </div>
    <div className="flex justify-end">
      <Skeleton variant="box" width="50%" height="var(--chat-loading-height)" animated />
    </div>
  </div>
);
LoadingSkeletons.displayName = 'Chat.LoadingSkeletons';

// ── Date separator ──────────────────────────────────────────────────────────

const DateSeparator = ({ label }: { label: string }) => (
  <li
    className="flex items-center gap-[var(--spacing-component-md)] py-[var(--spacing-component-xs)]"
    role="separator"
    aria-label={label}
  >
    <span
      className="flex-1 border-t border-[var(--chat-date-separator-line)]"
      aria-hidden="true"
    />
    <span className="text-caption-sm text-[var(--chat-date-separator-color)] content-nowrap shrink-0">
      {label}
    </span>
    <span
      className="flex-1 border-t border-[var(--chat-date-separator-line)]"
      aria-hidden="true"
    />
  </li>
);
DateSeparator.displayName = 'Chat.DateSeparator';

// ── Chat root ───────────────────────────────────────────────────────────────

export const Chat = memo(({
  messages,
  currentUserId,
  participant,
  onSend,
  isTyping = false,
  loading = false,
  showAttach = true,
  onAttach,
  headerActions,
  className,
  i18nStrings,
}: ChatProps) => {
  const i18n = useComponentI18n('chat', i18nStrings);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or typing indicator appears
  useEffect(() => {
    if (!loading) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isTyping, loading]);

  const handleSend = useCallback((msg: string) => {
    onSend?.(msg);
  }, [onSend]);

  const safeParticipantAvatar = useMemo(
    () => (participant.avatarSrc ? sanitizeHref(participant.avatarSrc) : undefined),
    [participant.avatarSrc],
  );

  const rootClasses = useMemo(() => [
    'flex flex-col overflow-hidden',
    'bg-[var(--chat-bg)]',
    'border border-[var(--chat-border)]',
    'rounded-[var(--chat-radius)]',
    'shadow-[var(--chat-shadow)]',
    'min-w-[var(--chat-min-width)]',
    'card-shell',
    className,
  ].filter(Boolean).join(' '), [className]);

  const listClasses = useMemo(() => [
    'flex flex-col gap-[var(--chat-messages-gap)] list-none p-0 m-0',
    'ps-[var(--chat-messages-px)] pe-[var(--chat-messages-px)]',
    'py-[var(--chat-messages-py)]',
  ].join(' '), []);

  return (
    <section role="log" aria-label={i18n.chatLabel} className={rootClasses}>
      {/* Header */}
      <ChatHeader
        name={participant.name}
        status={participant.status}
        avatarSrc={safeParticipantAvatar}
        avatarInitials={participant.avatarInitials}
        actions={headerActions}
      />

      {/* Message list */}
      <div className="flex-1 overflow-y-auto bg-[var(--chat-messages-bg)] perf-contain-content">
        {loading ? (
          <LoadingSkeletons />
        ) : (
          <ul className={listClasses}>
            {messages.map((msg: ChatMessageData, idx: number) => {
              const isSent = msg.senderId === currentUserId;
              const prevMsg: ChatMessageData | undefined = messages[idx - 1];
              const showSeparator = !!msg.date && msg.date !== prevMsg?.date;
              const showName = !isSent && prevMsg?.senderId !== msg.senderId;
              const safeAvatar = msg.senderAvatar ? sanitizeHref(msg.senderAvatar) : undefined;

              return (
                <Fragment key={msg.id}>
                  {showSeparator && msg.date && (
                    <DateSeparator
                      label={getDateLabel(
                        msg.date,
                        i18n.todayLabel ?? 'Today',
                        i18n.yesterdayLabel ?? 'Yesterday',
                      )}
                    />
                  )}
                  <ChatMessage
                    alignment={isSent ? 'sent' : 'received'}
                    timestamp={msg.timestamp}
                    senderName={msg.senderName}
                    showName={showName}
                    avatarSrc={safeAvatar}
                    avatarInitials={msg.senderInitials}
                  >
                    {msg.content}
                  </ChatMessage>
                </Fragment>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <li className="flex items-end gap-[var(--chat-message-gap)]">
                <TypingIndicator name={participant.name} />
              </li>
            )}
          </ul>
        )}
        {/* Scroll anchor */}
        <div ref={bottomRef} aria-hidden="true" />
      </div>

      {/* Input bar */}
      <ChatInputBar
        onSend={handleSend}
        showAttach={showAttach}
        onAttach={onAttach}
      />
    </section>
  );
});
Chat.displayName = 'Chat';
