"use client";
import { forwardRef, memo, useMemo } from 'react';
import type { TypingIndicatorProps } from './TypingIndicator.types';

export const TypingIndicator = memo(
  forwardRef<HTMLDivElement, TypingIndicatorProps>(
    ({ name, i18nStrings, className, ...rest }, ref) => {
      const typingLabel = i18nStrings?.typingLabel ?? 'is typing\u2026';
      const srText = name ? `${name} ${typingLabel}` : 'Typing\u2026';

      const classes = useMemo(
        () =>
          [
            'inline-flex items-center gap-[var(--typing-indicator-dot-gap)]',
            'bg-[var(--typing-indicator-bg)]',
            'border border-[var(--typing-indicator-border)]',
            'rounded-[var(--typing-indicator-radius)]',
            'ps-[var(--typing-indicator-px)] pe-[var(--typing-indicator-px)]',
            'py-[var(--typing-indicator-py)]',
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [className],
      );

      const dotBase = [
        'block rounded-full',
        'w-[var(--typing-indicator-dot-size)] h-[var(--typing-indicator-dot-size)]',
        'bg-[var(--typing-indicator-dot-color)]',
        'animate-bounce',
      ].join(' ');

      return (
        <div
          ref={ref}
          role="status"
          aria-live="polite"
          className={classes}
          {...rest}
        >
          <span className="sr-only">{srText}</span>
          <span className={dotBase} aria-hidden="true" />
          <span
            className={`${dotBase} [animation-delay:var(--typing-indicator-dot-delay-2)]`}
            aria-hidden="true"
          />
          <span
            className={`${dotBase} [animation-delay:var(--typing-indicator-dot-delay-3)]`}
            aria-hidden="true"
          />
        </div>
      );
    },
  ),
);

TypingIndicator.displayName = 'TypingIndicator';
