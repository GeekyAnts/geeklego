"use client"
import { forwardRef, memo, useMemo } from 'react';
import type { ButtonProps, ButtonVariant, ButtonSize } from './Button.types';

// Each variant uses a fundamentally different visual strategy — not just color shifts
const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] border border-transparent',
    'shadow-[var(--button-primary-shadow)]',
    'hover:bg-[var(--button-primary-bg-hover)] hover:shadow-[var(--button-primary-shadow-hover)]',
    'active:bg-[var(--button-primary-bg-active)] active:shadow-none',
  ].join(' '),

  secondary: [
    'bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)]',
    'border border-[var(--button-secondary-border)]',
    'hover:bg-[var(--button-secondary-bg-hover)] hover:border-[var(--button-secondary-border-hover)]',
    'active:bg-[var(--button-secondary-bg-active)]',
  ].join(' '),

  outline: [
    'bg-[var(--button-outline-bg)] text-[var(--button-outline-text)]',
    'border border-[var(--button-outline-border)]',
    'hover:bg-[var(--button-outline-bg-hover)] hover:border-[var(--button-outline-border-hover)]',
    'active:bg-[var(--button-outline-bg-active)]',
  ].join(' '),

  ghost: [
    'bg-[var(--button-ghost-bg)] text-[var(--button-ghost-text)] border border-transparent',
    'hover:bg-[var(--button-ghost-bg-hover)] hover:text-[var(--button-ghost-text-hover)]',
    'active:bg-[var(--button-ghost-bg-active)]',
  ].join(' '),

  destructive: [
    'bg-[var(--button-destructive-bg)] text-[var(--button-destructive-text)] border border-transparent',
    'shadow-[var(--button-destructive-shadow)]',
    'hover:bg-[var(--button-destructive-bg-hover)] hover:shadow-[var(--button-destructive-shadow-hover)]',
    'active:bg-[var(--button-destructive-bg-active)] active:shadow-none',
  ].join(' '),

  link: [
    'bg-transparent text-[var(--button-link-text)] border border-transparent',
    'hover:text-[var(--button-link-text-hover)] hover:underline underline-offset-4',
    'active:text-[var(--button-link-text-active)]',
    'h-auto px-0',
  ].join(' '),
};

// Size: base = text button, square = icon-only button
const sizeClasses: Record<ButtonSize, { base: string; square: string; text: string }> = {
  xs: {
    base:   'h-[var(--button-height-xs)] px-[var(--button-px-xs)]',
    square: 'w-[var(--button-height-xs)] h-[var(--button-height-xs)] px-0',
    text:   'text-button-xs',
  },
  sm: {
    base:   'h-[var(--button-height-sm)] px-[var(--button-px-sm)]',
    square: 'w-[var(--button-height-sm)] h-[var(--button-height-sm)] px-0',
    text:   'text-button-sm',
  },
  md: {
    base:   'h-[var(--button-height-md)] px-[var(--button-px-md)]',
    square: 'w-[var(--button-height-md)] h-[var(--button-height-md)] px-0',
    text:   'text-button-md',
  },
  lg: {
    base:   'h-[var(--button-height-lg)] px-[var(--button-px-lg)]',
    square: 'w-[var(--button-height-lg)] h-[var(--button-height-lg)] px-0',
    text:   'text-button-lg',
  },
  xl: {
    base:   'h-[var(--button-height-xl)] px-[var(--button-px-xl)]',
    square: 'w-[var(--button-height-xl)] h-[var(--button-height-xl)] px-0',
    text:   'text-button-xl',
  },
};

const iconSizeClasses: Record<ButtonSize, string> = {
  xs: 'w-[var(--size-icon-xs)] h-[var(--size-icon-xs)]',
  sm: 'w-[var(--size-icon-sm)] h-[var(--size-icon-sm)]',
  md: 'w-[var(--size-icon-md)] h-[var(--size-icon-md)]',
  lg: 'w-[var(--size-icon-lg)] h-[var(--size-icon-lg)]',
  xl: 'w-[var(--size-icon-xl)] h-[var(--size-icon-xl)]',
};

export const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      iconOnly = false,
      children,
      disabled,
      className,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    // When iconOnly, children becomes the accessible label on the <button> itself
    const ariaLabel = iconOnly && typeof children === 'string' ? children : undefined;

    const classes = useMemo(() => [
      'inline-flex items-center justify-center gap-[var(--button-gap)] relative shrink-0 select-none content-nowrap',
      'rounded-[var(--button-radius)]',
      sizeClasses[size].text,
      'transition-default',
      'focus-visible:outline-none focus-visible:focus-ring',
      isDisabled
        ? 'bg-[var(--button-bg-disabled)] text-[var(--button-text-disabled)] border border-[var(--button-border-disabled)] cursor-not-allowed shadow-none pointer-events-none'
        : variantClasses[variant],
      variant !== 'link' ? (iconOnly ? sizeClasses[size].square : sizeClasses[size].base) : '',
      className,
    ]
      .filter(Boolean)
      .join(' '), [isDisabled, variant, size, iconOnly, className]);

    const iconWrapClass = useMemo(
      () => `shrink-0 inline-flex items-center justify-center ${iconSizeClasses[size]}`,
      [size],
    );

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={isLoading || undefined}
        aria-label={ariaLabel}
        className={classes}
        {...rest}
      >
        {isLoading ? (
          <>
            {/* Centered spinner — dimensions come from invisible ghost below */}
            <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <svg
                className={`animate-spin shrink-0 ${iconSizeClasses[size]}`}
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </span>
            {/* Invisible ghost content — preserves button width exactly, no layout shift */}
            <span className="invisible inline-flex items-center gap-[var(--button-gap)]" aria-hidden="true">
              {leftIcon && <span className={iconWrapClass}>{leftIcon}</span>}
              {!iconOnly && <span>{children}</span>}
              {rightIcon && <span className={iconWrapClass}>{rightIcon}</span>}
            </span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span className={iconWrapClass} aria-hidden="true">
                {leftIcon}
              </span>
            )}
            {iconOnly ? (
              <span className="sr-only">{children}</span>
            ) : (
              <span>{children}</span>
            )}
            {rightIcon && (
              <span className={iconWrapClass} aria-hidden="true">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  },
));
Button.displayName = 'Button';
