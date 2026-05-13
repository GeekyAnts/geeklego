"use client"
import { forwardRef, memo, useCallback, useId, useRef, useState, useMemo } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { Button } from '../../atoms/Button/Button';
import { Textarea } from '../../atoms/Textarea/Textarea';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type { ChatInputBarProps } from './ChatInputBar.types';

export const ChatInputBar = memo(forwardRef<HTMLFormElement, ChatInputBarProps>(
  ({
    onSend,
    maxLength,
    showAttach = true,
    onAttach,
    disabled = false,
    i18nStrings,
    className,
    ...rest
  }, ref) => {
    const i18n = useComponentI18n('chatInputBar', i18nStrings);
    const textareaId = useId();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState('');

    const isEmpty = value.trim().length === 0;

    const handleSubmit = useCallback((e: React.FormEvent) => {
      e.preventDefault();
      if (isEmpty || disabled) return;
      onSend?.(value.trim());
      setValue('');
      textareaRef.current?.focus();
    }, [isEmpty, disabled, onSend, value]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (!isEmpty && !disabled) {
          onSend?.(value.trim());
          setValue('');
          textareaRef.current?.focus();
        }
      }
    }, [isEmpty, disabled, onSend, value]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    }, []);

    const formClasses = useMemo(() => [
      'flex items-end gap-[var(--chat-input-bar-gap)]',
      'bg-[var(--chat-input-bar-bg)]',
      'border-t border-[var(--chat-input-bar-border)]',
      'ps-[var(--chat-input-bar-px)] pe-[var(--chat-input-bar-px)]',
      'py-[var(--chat-input-bar-py)]',
      'min-w-[var(--chat-input-bar-min-width)]',
      className,
    ].filter(Boolean).join(' '), [className]);

    return (
      <form ref={ref} onSubmit={handleSubmit} className={formClasses} {...rest}>
        {/* Attach button */}
        {showAttach && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconOnly
            leftIcon={<Paperclip size="var(--size-icon-sm)" aria-hidden />}
            aria-label={i18n.attachLabel}
            disabled={disabled}
            onClick={onAttach}
            className="focus-visible:outline-none focus-visible:focus-ring"
          >
            {i18n.attachLabel}
          </Button>
        )}

        {/* Message textarea — unstyled variant, grows with content */}
        <Textarea
          ref={textareaRef}
          id={textareaId}
          variant="unstyled"
          size="sm"
          resize="none"
          rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={i18n.placeholder}
          maxLength={maxLength}
          disabled={disabled}
          aria-label={i18n.sendLabel}
          className="flex-1 min-w-0 max-h-[var(--chat-input-bar-textarea-max-height)] overflow-y-auto"
        />

        {/* Send button */}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          iconOnly
          leftIcon={<Send size="var(--size-icon-sm)" aria-hidden />}
          aria-label={i18n.sendLabel}
          disabled={isEmpty || disabled}
          className="focus-visible:outline-none focus-visible:focus-ring"
        >
          {i18n.sendLabel}
        </Button>
      </form>
    );
  },
));

ChatInputBar.displayName = 'ChatInputBar';
