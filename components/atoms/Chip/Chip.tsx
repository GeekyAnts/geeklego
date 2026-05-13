"use client"
import { forwardRef, memo, useMemo, useCallback } from 'react';
import type { Ref, ButtonHTMLAttributes, HTMLAttributes, MouseEvent } from 'react';
import { X } from 'lucide-react';
import type { ChipProps, ChipVariant, ChipSize } from './Chip.types';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';

// ── Static class maps (hoisted — never recreated per render) ──────────────────

// Interactive chip variants — button context, full hover / active / selected states.
// Each variant uses a fundamentally different visual strategy.
const interactiveClasses: Record<ChipVariant, { base: string; selected: string }> = {
  solid: {
    // Filled neutral — background shifts deeper on hover, border subtly tints
    base: [
      'bg-[var(--chip-solid-bg)] text-[var(--chip-solid-text)] border border-[var(--color-border-subtle)]',
      'shadow-[var(--chip-solid-shadow)]',
      'hover:bg-[var(--chip-solid-bg-hover)] hover:border-[var(--color-border-default)] hover:shadow-[var(--chip-solid-shadow-hover)]',
      'active:bg-[var(--chip-solid-bg-active)] active:shadow-[var(--chip-solid-shadow-active)]',
    ].join(' '),
    // Filled brand — inverted text, brand colour fills the chip
    selected: [
      'bg-[var(--chip-solid-bg-selected)] text-[var(--chip-solid-text-selected)] border border-transparent',
      'shadow-[var(--chip-solid-shadow)]',
      'hover:bg-[var(--chip-solid-bg-selected-hover)] hover:shadow-[var(--chip-solid-shadow-hover)]',
      'active:bg-[var(--chip-solid-bg-selected-active)] active:shadow-[var(--chip-solid-shadow-active)]',
    ].join(' '),
  },
  soft: {
    // Tinted brand background — brand-tinted fill, no border
    base: [
      'bg-[var(--chip-soft-bg)] text-[var(--chip-soft-text)] border border-transparent',
      'hover:bg-[var(--chip-soft-bg-hover)] hover:border-[var(--color-border-subtle)]',
      'active:bg-[var(--chip-soft-bg-active)]',
    ].join(' '),
    // Solid brand — same base strategy as solid.selected; soft variant becomes bold when selected
    selected: [
      'bg-[var(--chip-soft-bg-selected)] text-[var(--chip-soft-text-selected)] border border-transparent',
      'hover:bg-[var(--chip-soft-bg-selected-hover)]',
    ].join(' '),
  },
  outline: {
    // Border-only — visible frame, transparent interior
    base: [
      'bg-[var(--chip-outline-bg)] text-[var(--chip-outline-text)] border border-[var(--chip-outline-border)]',
      'hover:bg-[var(--chip-outline-bg-hover)] hover:border-[var(--chip-outline-border-hover)]',
      'active:bg-[var(--chip-outline-bg-active)]',
    ].join(' '),
    // Brand border + tinted bg — border upgrades to brand colour when selected
    selected: [
      'bg-[var(--chip-outline-bg-selected)] text-[var(--chip-outline-text-selected)] border border-[var(--chip-outline-border-selected)]',
      'hover:bg-[var(--chip-outline-bg-hover)] hover:border-[var(--chip-outline-border-hover)]',
    ].join(' '),
  },
  ghost: {
    // Invisible at rest — background appears only on hover
    base: [
      'bg-[var(--chip-ghost-bg)] text-[var(--chip-ghost-text)] border border-transparent',
      'hover:bg-[var(--chip-ghost-bg-hover)] hover:text-[var(--chip-ghost-text-hover)]',
      'active:bg-[var(--chip-ghost-bg-active)]',
    ].join(' '),
    // Tinted bg when selected — subtle fill, brand text
    selected: [
      'bg-[var(--chip-ghost-bg-selected)] text-[var(--chip-ghost-text-selected)] border border-transparent',
      'hover:bg-[var(--chip-ghost-bg-hover)]',
    ].join(' '),
  },
};

// Static display chip variants — span context, no interactive states
const staticClasses: Record<ChipVariant, string> = {
  solid:   'bg-[var(--chip-solid-bg)] text-[var(--chip-solid-text)] border border-[var(--color-border-subtle)]',
  soft:    'bg-[var(--chip-soft-bg)] text-[var(--chip-soft-text)] border border-transparent',
  outline: 'bg-[var(--chip-outline-bg)] text-[var(--chip-outline-text)] border border-[var(--chip-outline-border)]',
  ghost:   'bg-[var(--chip-ghost-bg)] text-[var(--chip-ghost-text)] border border-transparent',
};

const sizeClasses: Record<ChipSize, { height: string; text: string; removeSize: string }> = {
  sm: { height: 'h-[var(--chip-height-sm)]', text: 'text-button-xs', removeSize: 'var(--chip-remove-size-sm)' },
  md: { height: 'h-[var(--chip-height-md)]', text: 'text-button-sm', removeSize: 'var(--chip-remove-size-md)' },
  lg: { height: 'h-[var(--chip-height-lg)]', text: 'text-button-md', removeSize: 'var(--chip-remove-size-lg)' },
};

const paddingClasses: Record<ChipSize, { symmetric: string; withRemove: string }> = {
  sm: { symmetric: 'px-[var(--chip-px-sm)]', withRemove: 'ps-[var(--chip-px-sm)] pe-[var(--chip-remove-gap)]' },
  md: { symmetric: 'px-[var(--chip-px-md)]', withRemove: 'ps-[var(--chip-px-md)] pe-[var(--chip-remove-gap)]' },
  lg: { symmetric: 'px-[var(--chip-px-lg)]', withRemove: 'ps-[var(--chip-px-lg)] pe-[var(--chip-remove-gap)]' },
};

// Hoisted static strings — never recreated
const disabledClasses =
  'bg-[var(--chip-bg-disabled)] text-[var(--chip-text-disabled)] border-transparent cursor-not-allowed shadow-none pointer-events-none';

const removeButtonClasses = [
  'shrink-0 inline-flex items-center justify-center',
  'text-[var(--chip-remove-color)] hover:text-[var(--chip-remove-color-hover)]',
  'transition-default',
  'focus-visible:outline-none focus-visible:focus-ring',
  'touch-target',
].join(' ');

// ── Component ─────────────────────────────────────────────────────────────────

export const Chip = memo(forwardRef<HTMLElement, ChipProps>(
  (
    {
      variant = 'solid',
      size = 'md',
      interactive = true,
      selected,
      disabled = false,
      leftIcon,
      onRemove,
      i18nStrings,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const i18n = useComponentI18n('chip', i18nStrings);

    // Remove button only appears on static chips (interactive=false).
    // Nesting <button> inside <button> is invalid HTML — enforce this boundary.
    const hasRemove = !!onRemove && !interactive;
    const isDisabled = interactive && disabled;

    const classes = useMemo(() => [
      'inline-flex items-center gap-[var(--chip-gap)]',
      'rounded-[var(--chip-radius)]',
      sizeClasses[size].height,
      sizeClasses[size].text,
      hasRemove ? paddingClasses[size].withRemove : paddingClasses[size].symmetric,
      'transition-default',
      interactive ? 'cursor-pointer focus-visible:outline-none focus-visible:focus-ring select-none' : '',
      isDisabled
        ? disabledClasses
        : interactive
          ? (selected ? interactiveClasses[variant].selected : interactiveClasses[variant].base)
          : staticClasses[variant],
      className,
    ].filter(Boolean).join(' '), [variant, size, interactive, selected, isDisabled, hasRemove, className]);

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
            disabled={disabled}
            aria-label={i18n.removeLabel}
            className={removeButtonClasses}
          >
            <X size={sizeClasses[size].removeSize} aria-hidden="true" />
          </button>
        )}
      </>
    );

    if (interactive) {
      return (
        <button
          ref={ref as Ref<HTMLButtonElement>}
          type="button"
          disabled={isDisabled}
          aria-disabled={isDisabled || undefined}
          aria-pressed={selected}
          className={classes}
          {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {content}
        </button>
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

Chip.displayName = 'Chip';
