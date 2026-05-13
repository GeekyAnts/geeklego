"use client"
import { forwardRef, memo, useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import type { LinkProps, LinkVariant, LinkSize } from './Link.types';
import { sanitizeHref } from '../../utils/security/sanitize';

// ── Static class maps (hoisted — never recreated per render) ──────────────────

const variantClasses: Record<LinkVariant, string> = {
  default: [
    'text-[var(--link-text)] no-underline',
    'hover:text-[var(--link-text-hover)] hover:underline hover:underline-offset-2',
    'active:text-[var(--link-text-active)]',
    'visited:text-[var(--link-text-visited)]',
  ].join(' '),
  subtle: [
    'text-[var(--link-subtle-text)] no-underline',
    'hover:text-[var(--link-subtle-text-hover)] hover:underline hover:underline-offset-2',
    'active:text-[var(--link-subtle-text-active)]',
  ].join(' '),
  inline: [
    'text-inherit underline underline-offset-2',
    'hover:text-[var(--link-text)] hover:underline-offset-4',
    'active:text-[var(--link-text-active)]',
  ].join(' '),
  standalone: [
    'text-[var(--link-standalone-text)] no-underline font-semibold',
    'hover:text-[var(--link-standalone-text-hover)] hover:underline hover:underline-offset-4',
    'active:text-[var(--link-standalone-text-active)]',
  ].join(' '),
};

const sizeClasses: Record<LinkSize, string> = {
  sm: 'text-body-sm',
  md: 'text-body-md',
  lg: 'text-body-lg',
};

const disabledClasses = 'text-[var(--link-text-disabled)] no-underline cursor-not-allowed pointer-events-none';

const baseClasses = [
  'inline-flex items-center gap-[var(--link-gap)]',
  'rounded-[var(--radius-component-sm)]',
  'transition-default',
  'focus-visible:outline-none focus-visible:focus-ring',
].join(' ');

// ── Component ─────────────────────────────────────────────────────────────────

export const Link = memo(forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      variant = 'default',
      size,
      external = false,
      disabled = false,
      className,
      children,
      target,
      rel,
      ...rest
    },
    ref,
  ) => {
    const classes = useMemo(
      () =>
        [
          baseClasses,
          disabled ? disabledClasses : variantClasses[variant],
          size ? sizeClasses[size] : undefined,
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [disabled, variant, size, className],
    );

    const resolvedTarget = external ? '_blank' : target;
    const resolvedRel = external ? 'noopener noreferrer' : rel;

    return (
      <a
        ref={ref}
        href={disabled ? undefined : sanitizeHref(href)}
        target={resolvedTarget}
        rel={resolvedRel}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        className={classes}
        {...rest}
      >
        {children}
        {external && !disabled && (
          <span aria-hidden="true" className="shrink-0 inline-flex items-center">
            <ExternalLink size="var(--size-icon-xs)" />
          </span>
        )}
      </a>
    );
  },
));

Link.displayName = 'Link';
