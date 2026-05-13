"use client"
import { forwardRef, memo, useCallback, useMemo, useState } from 'react';
import type { ToggleProps, ToggleSize, ToggleVariant } from './Toggle.types';

// ── Unpressed variant classes — hoisted, never re-allocated ──────────────────
// Each variant uses a DIFFERENT visual strategy: fill shift, border reveal, or
// ghost-to-fill. Two properties change on hover in all variants (bg + border
// or bg + text) to satisfy WCAG non-colour-alone state communication.
const variantUnpressedClasses: Record<ToggleVariant, string> = {
  default: [
    'bg-[var(--toggle-default-bg)] text-[var(--toggle-default-text)]',
    'border border-[var(--toggle-default-border)]',
    'hover:bg-[var(--toggle-default-bg-hover)] hover:text-[var(--toggle-default-text-hover)]',
    'hover:border-[var(--toggle-default-border-hover)]',
    'shadow-[var(--toggle-shadow)] hover:shadow-[var(--toggle-shadow-hover)]',
  ].join(' '),
  outline: [
    'bg-[var(--toggle-outline-bg)] text-[var(--toggle-outline-text)]',
    'border border-[var(--toggle-outline-border)]',
    'hover:bg-[var(--toggle-outline-bg-hover)]',
    'hover:border-[var(--toggle-outline-border-hover)]',
    'shadow-[var(--toggle-shadow)] hover:shadow-[var(--toggle-shadow-hover)]',
  ].join(' '),
  ghost: [
    'bg-[var(--toggle-ghost-bg)] text-[var(--toggle-ghost-text)]',
    'border border-[var(--toggle-ghost-border)]',
    'hover:bg-[var(--toggle-ghost-bg-hover)] hover:text-[var(--toggle-ghost-text-hover)]',
    'shadow-[var(--toggle-shadow)] hover:shadow-[var(--toggle-shadow-hover)]',
  ].join(' '),
};

// ── Pressed variant classes — hoisted, never re-allocated ────────────────────
// Pressed state shows brand-tinted bg + brand text/border across all variants.
// Shadow collapses to inset when pressed (tactile "pushed in" feel).
const variantPressedClasses: Record<ToggleVariant, string> = {
  default: [
    'bg-[var(--toggle-default-bg-pressed)] text-[var(--toggle-default-text-pressed)]',
    'border border-[var(--toggle-default-border-pressed)]',
    'hover:bg-[var(--toggle-default-bg-pressed-hover)]',
    'shadow-[var(--toggle-shadow-pressed)]',
  ].join(' '),
  outline: [
    'bg-[var(--toggle-outline-bg-pressed)] text-[var(--toggle-outline-text-pressed)]',
    'border border-[var(--toggle-outline-border-pressed)]',
    'hover:bg-[var(--toggle-outline-bg-pressed-hover)]',
    'shadow-[var(--toggle-shadow-pressed)]',
  ].join(' '),
  ghost: [
    'bg-[var(--toggle-ghost-bg-pressed)] text-[var(--toggle-ghost-text-pressed)]',
    'border border-[var(--toggle-ghost-border-pressed)]',
    'hover:bg-[var(--toggle-ghost-bg-pressed-hover)]',
    'shadow-[var(--toggle-shadow-pressed)]',
  ].join(' '),
};

// ── Disabled classes — hoisted, shared across all variants ───────────────────
const DISABLED_CLASSES =
  'bg-[var(--toggle-bg-disabled)] text-[var(--toggle-text-disabled)] border border-[var(--toggle-border-disabled)] cursor-not-allowed pointer-events-none shadow-none';

// ── Size classes — pair base dimensions with matching typography ──────────────
const sizeClasses: Record<ToggleSize, { base: string; text: string }> = {
  sm: {
    base: 'h-[var(--toggle-height-sm)] px-[var(--toggle-px-sm)] min-w-[var(--toggle-height-sm)]',
    text: 'text-button-sm',
  },
  md: {
    base: 'h-[var(--toggle-height-md)] px-[var(--toggle-px-md)] min-w-[var(--toggle-height-md)]',
    text: 'text-button-md',
  },
  lg: {
    base: 'h-[var(--toggle-height-lg)] px-[var(--toggle-px-lg)] min-w-[var(--toggle-height-lg)]',
    text: 'text-button-lg',
  },
};

export const Toggle = memo(
  forwardRef<HTMLButtonElement, ToggleProps>(
    (
      {
        pressed,
        defaultPressed = false,
        onPressedChange,
        variant = 'default',
        size = 'md',
        disabled = false,
        className,
        children,
        ...rest
      },
      ref,
    ) => {
      // ── Controlled vs uncontrolled ─────────────────────────────────────────
      const isControlled = pressed !== undefined;
      const [internalPressed, setInternalPressed] = useState(defaultPressed);
      const isPressed = isControlled ? (pressed as boolean) : internalPressed;

      const handleClick = useCallback(() => {
        if (disabled) return;
        const next = !isPressed;
        if (!isControlled) setInternalPressed(next);
        onPressedChange?.(next);
      }, [isPressed, isControlled, disabled, onPressedChange]);

      const classes = useMemo(
        () =>
          [
            'inline-flex items-center justify-center gap-[var(--toggle-gap)]',
            'rounded-[var(--toggle-radius)]',
            'content-nowrap',
            sizeClasses[size].text,
            'transition-default',
            'focus-visible:outline-none focus-visible:focus-ring',
            'cursor-pointer',
            disabled
              ? DISABLED_CLASSES
              : isPressed
                ? variantPressedClasses[variant]
                : variantUnpressedClasses[variant],
            sizeClasses[size].base,
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [disabled, isPressed, variant, size, className],
      );

      return (
        <button
          ref={ref}
          type="button"
          aria-pressed={isPressed}
          aria-disabled={disabled || undefined}
          disabled={disabled}
          onClick={handleClick}
          className={classes}
          {...rest}
        >
          {children}
        </button>
      );
    },
  ),
);
Toggle.displayName = 'Toggle';
