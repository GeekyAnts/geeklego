"use client"
import { forwardRef, memo, useMemo } from 'react';
import type { BadgeProps, BadgeColor, BadgeVariant, BadgeSize, BadgeShape } from './Badge.types';

// ── Static class maps (hoisted — never recreated per render) ──────────────────

const solidClasses: Record<BadgeColor, string> = {
  default: 'bg-[var(--badge-solid-default-bg)] text-[var(--badge-solid-default-text)] border-transparent',
  success: 'bg-[var(--badge-solid-success-bg)] text-[var(--badge-solid-success-text)] border-transparent',
  warning: 'bg-[var(--badge-solid-warning-bg)] text-[var(--badge-solid-warning-text)] border-transparent',
  error:   'bg-[var(--badge-solid-error-bg)] text-[var(--badge-solid-error-text)] border-transparent',
  info:    'bg-[var(--badge-solid-info-bg)] text-[var(--badge-solid-info-text)] border-transparent',
};

const softClasses: Record<BadgeColor, string> = {
  default: 'bg-[var(--badge-soft-default-bg)] text-[var(--badge-soft-default-text)] border-transparent',
  success: 'bg-[var(--badge-soft-success-bg)] text-[var(--badge-soft-success-text)] border-transparent',
  warning: 'bg-[var(--badge-soft-warning-bg)] text-[var(--badge-soft-warning-text)] border-transparent',
  error:   'bg-[var(--badge-soft-error-bg)] text-[var(--badge-soft-error-text)] border-transparent',
  info:    'bg-[var(--badge-soft-info-bg)] text-[var(--badge-soft-info-text)] border-transparent',
};

const outlineClasses: Record<BadgeColor, string> = {
  default: 'bg-[var(--badge-outline-default-bg)] text-[var(--badge-outline-default-text)] border-[var(--badge-outline-default-border)]',
  success: 'bg-[var(--badge-outline-success-bg)] text-[var(--badge-outline-success-text)] border-[var(--badge-outline-success-border)]',
  warning: 'bg-[var(--badge-outline-warning-bg)] text-[var(--badge-outline-warning-text)] border-[var(--badge-outline-warning-border)]',
  error:   'bg-[var(--badge-outline-error-bg)] text-[var(--badge-outline-error-text)] border-[var(--badge-outline-error-border)]',
  info:    'bg-[var(--badge-outline-info-bg)] text-[var(--badge-outline-info-text)] border-[var(--badge-outline-info-border)]',
};

const dotColorClasses: Record<BadgeColor, string> = {
  default: 'bg-[var(--badge-dot-default-color)]',
  success: 'bg-[var(--badge-dot-success-color)]',
  warning: 'bg-[var(--badge-dot-warning-color)]',
  error:   'bg-[var(--badge-dot-error-color)]',
  info:    'bg-[var(--badge-dot-info-color)]',
};

const variantMap: Record<Exclude<BadgeVariant, 'dot'>, Record<BadgeColor, string>> = {
  solid:   solidClasses,
  soft:    softClasses,
  outline: outlineClasses,
};

const sizeClasses: Record<BadgeSize, { badge: string; text: string; dotSize: string }> = {
  sm: {
    badge:   'h-[var(--badge-height-sm)] px-[var(--badge-px-sm)]',
    text:    'text-button-xs',
    dotSize: 'w-[var(--badge-dot-size-sm)] h-[var(--badge-dot-size-sm)]',
  },
  md: {
    badge:   'h-[var(--badge-height-md)] px-[var(--badge-px-md)]',
    text:    'text-button-sm',
    dotSize: 'w-[var(--badge-dot-size-md)] h-[var(--badge-dot-size-md)]',
  },
};

const shapeClasses: Record<BadgeShape, string> = {
  pill:    'rounded-[var(--badge-radius-pill)]',
  rounded: 'rounded-[var(--badge-radius-rounded)]',
};

// ── Component ─────────────────────────────────────────────────────────────────

export const Badge = memo(forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'solid',
      color = 'default',
      size = 'md',
      shape = 'pill',
      dotLabel,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const isDot = variant === 'dot';

    const classes = useMemo(() => {
      if (isDot) {
        return [
          'inline-block shrink-0',
          sizeClasses[size].dotSize,
          shapeClasses['pill'],
          dotColorClasses[color],
          className,
        ].filter(Boolean).join(' ');
      }

      return [
        'inline-flex items-center justify-center gap-[var(--badge-gap)]',
        'border',
        sizeClasses[size].badge,
        sizeClasses[size].text,
        shapeClasses[shape],
        variantMap[variant][color],
        'content-nowrap',
        className,
      ].filter(Boolean).join(' ');
    }, [isDot, variant, color, size, shape, className]);

    if (isDot) {
      return (
        <span
          ref={ref}
          className={classes}
          aria-label={dotLabel}
          role={dotLabel ? 'status' : undefined}
          {...rest}
        />
      );
    }

    return (
      <span ref={ref} className={classes} {...rest}>
        {children}
      </span>
    );
  },
));

Badge.displayName = 'Badge';
