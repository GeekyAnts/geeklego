"use client"
import { forwardRef, memo, useMemo, useCallback } from 'react';
import type { Ref, AnchorHTMLAttributes, HTMLAttributes, MouseEvent } from 'react';
import { X } from 'lucide-react';
import type { TagProps, TagVariant, TagColor, TagSize } from './Tag.types';
import { sanitizeHref } from '../../utils/security/sanitize';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';

// ── Static class maps (hoisted — never recreated per render) ──────────────────

const solidClasses: Record<TagColor, string> = {
  default:     'bg-[var(--tag-solid-default-bg)] text-[var(--tag-solid-default-text)] border-[var(--tag-solid-default-border)]',
  brand:       'bg-[var(--tag-solid-brand-bg)] text-[var(--tag-solid-brand-text)] border-[var(--tag-solid-brand-border)]',
  success:     'bg-[var(--tag-solid-success-bg)] text-[var(--tag-solid-success-text)] border-[var(--tag-solid-success-border)]',
  warning:     'bg-[var(--tag-solid-warning-bg)] text-[var(--tag-solid-warning-text)] border-[var(--tag-solid-warning-border)]',
  error:       'bg-[var(--tag-solid-error-bg)] text-[var(--tag-solid-error-text)] border-[var(--tag-solid-error-border)]',
  info:        'bg-[var(--tag-solid-info-bg)] text-[var(--tag-solid-info-text)] border-[var(--tag-solid-info-border)]',
};

const softClasses: Record<TagColor, string> = {
  default:     'bg-[var(--tag-soft-default-bg)] text-[var(--tag-soft-default-text)] border-[var(--tag-soft-default-border)]',
  brand:       'bg-[var(--tag-soft-brand-bg)] text-[var(--tag-soft-brand-text)] border-[var(--tag-soft-brand-border)]',
  success:     'bg-[var(--tag-soft-success-bg)] text-[var(--tag-soft-success-text)] border-[var(--tag-soft-success-border)]',
  warning:     'bg-[var(--tag-soft-warning-bg)] text-[var(--tag-soft-warning-text)] border-[var(--tag-soft-warning-border)]',
  error:       'bg-[var(--tag-soft-error-bg)] text-[var(--tag-soft-error-text)] border-[var(--tag-soft-error-border)]',
  info:        'bg-[var(--tag-soft-info-bg)] text-[var(--tag-soft-info-text)] border-[var(--tag-soft-info-border)]',
};

const outlineClasses: Record<TagColor, string> = {
  default:     'bg-[var(--tag-outline-default-bg)] text-[var(--tag-outline-default-text)] border-[var(--tag-outline-default-border)]',
  brand:       'bg-[var(--tag-outline-brand-bg)] text-[var(--tag-outline-brand-text)] border-[var(--tag-outline-brand-border)]',
  success:     'bg-[var(--tag-outline-success-bg)] text-[var(--tag-outline-success-text)] border-[var(--tag-outline-success-border)]',
  warning:     'bg-[var(--tag-outline-warning-bg)] text-[var(--tag-outline-warning-text)] border-[var(--tag-outline-warning-border)]',
  error:       'bg-[var(--tag-outline-error-bg)] text-[var(--tag-outline-error-text)] border-[var(--tag-outline-error-border)]',
  info:        'bg-[var(--tag-outline-info-bg)] text-[var(--tag-outline-info-text)] border-[var(--tag-outline-info-border)]',
};

const variantMap: Record<TagVariant, Record<TagColor, string>> = {
  solid:   solidClasses,
  soft:    softClasses,
  outline: outlineClasses,
};

const sizeClasses: Record<TagSize, { height: string; text: string; removeSize: string }> = {
  sm: { height: 'h-[var(--tag-height-sm)]', text: 'text-button-xs', removeSize: 'var(--tag-remove-size-sm)' },
  md: { height: 'h-[var(--tag-height-md)]', text: 'text-button-sm', removeSize: 'var(--tag-remove-size-md)' },
};

const paddingClasses: Record<TagSize, { symmetric: string; withRemove: string }> = {
  sm: { symmetric: 'px-[var(--tag-px-sm)]', withRemove: 'ps-[var(--tag-px-sm)] pe-[var(--tag-remove-gap)]' },
  md: { symmetric: 'px-[var(--tag-px-md)]', withRemove: 'ps-[var(--tag-px-md)] pe-[var(--tag-remove-gap)]' },
};

const removeButtonClasses = [
  'shrink-0 inline-flex items-center justify-center',
  'text-[var(--tag-remove-color)] hover:text-[var(--tag-remove-color-hover)]',
  'transition-default',
  'focus-visible:outline-none focus-visible:focus-ring',
  'touch-target',
].join(' ');

// ── Component ─────────────────────────────────────────────────────────────────

export const Tag = memo(forwardRef<HTMLElement, TagProps>(
  (
    {
      variant = 'soft',
      color = 'default',
      size = 'md',
      href,
      leftIcon,
      onRemove,
      i18nStrings,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const i18n = useComponentI18n('tag', i18nStrings);

    const isLink = !!href && !onRemove;
    const hasRemove = !!onRemove && !href;

    const safeHref = useMemo(
      () => (isLink ? sanitizeHref(href) : undefined),
      [isLink, href],
    );

    const classes = useMemo(() => [
      'inline-flex items-center gap-[var(--tag-gap)]',
      'rounded-[var(--tag-radius)]',
      'border',
      sizeClasses[size].height,
      sizeClasses[size].text,
      hasRemove ? paddingClasses[size].withRemove : paddingClasses[size].symmetric,
      variantMap[variant][color],
      'transition-default',
      isLink ? 'cursor-pointer hover:bg-[var(--tag-bg-hover)] focus-visible:outline-none focus-visible:focus-ring no-underline' : '',
      className,
    ].filter(Boolean).join(' '), [variant, color, size, isLink, hasRemove, className]);

    const handleRemove = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onRemove?.(e);
      },
      [onRemove],
    );

    const content = (
      <>
        {leftIcon && (
          <span className="shrink-0 inline-flex items-center" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className="truncate-label min-w-0">{children}</span>
        {hasRemove && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label={i18n.removeLabel}
            className={removeButtonClasses}
          >
            <X size={sizeClasses[size].removeSize} aria-hidden="true" />
          </button>
        )}
      </>
    );

    if (isLink) {
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          href={safeHref}
          className={classes}
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <span
        ref={ref as Ref<HTMLSpanElement>}
        className={classes}
        {...(rest as HTMLAttributes<HTMLSpanElement>)}
      >
        {content}
      </span>
    );
  },
));

Tag.displayName = 'Tag';
