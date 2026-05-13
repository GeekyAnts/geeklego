"use client"
import { forwardRef, memo, useCallback, useMemo } from 'react';
import type { ItemProps, ItemVariant, ItemSize } from './Item.types';
import { getSafeExternalLinkProps } from '../../utils/security/sanitize';

/* ── Variant classes — each uses a different visual strategy ──────────────── */
const variantClasses: Record<ItemVariant, { base: string; interactive: string }> = {
  default: {
    base: [
      'bg-[var(--item-default-bg)]',
      'border border-[var(--item-default-border)]',
    ].join(' '),
    interactive: [
      'hover:bg-[var(--item-default-bg-hover)]',
      'active:bg-[var(--item-default-bg-active)]',
    ].join(' '),
  },
  outlined: {
    base: [
      'bg-[var(--item-outlined-bg)]',
      'border border-[var(--item-outlined-border)]',
    ].join(' '),
    interactive: [
      'hover:bg-[var(--item-outlined-bg-hover)]',
      'active:bg-[var(--item-outlined-bg-active)]',
    ].join(' '),
  },
  elevated: {
    base: [
      'bg-[var(--item-elevated-bg)]',
      'border border-[var(--item-elevated-border)]',
      'shadow-[var(--item-elevated-shadow)]',
    ].join(' '),
    interactive: [
      'hover:bg-[var(--item-elevated-bg-hover)]',
      'hover:shadow-[var(--item-elevated-shadow-hover)]',
      'active:bg-[var(--item-elevated-bg-active)]',
      'active:shadow-[var(--item-elevated-shadow)]',
    ].join(' '),
  },
  ghost: {
    base: [
      'bg-[var(--item-ghost-bg)]',
      'border border-[var(--item-ghost-border)]',
    ].join(' '),
    interactive: [
      'hover:bg-[var(--item-ghost-bg-hover)]',
      'active:bg-[var(--item-ghost-bg-active)]',
    ].join(' '),
  },
};

/* ── Selected state bg per variant ───────────────────────────────────────── */
const selectedClasses: Record<ItemVariant, string> = {
  default:  'bg-[var(--item-default-bg-selected)] border border-[var(--item-default-border)]',
  outlined: 'bg-[var(--item-outlined-bg-selected)] border border-[var(--item-outlined-border)]',
  elevated: 'bg-[var(--item-elevated-bg-selected)] border border-[var(--item-elevated-border)] shadow-[var(--item-elevated-shadow)]',
  ghost:    'bg-[var(--item-ghost-bg-selected)] border border-[var(--item-ghost-border)]',
};

/* ── Size classes ────────────────────────────────────────────────────────── */
const sizeClasses: Record<ItemSize, { container: string; title: string; description: string }> = {
  sm: {
    container: 'min-h-[var(--item-height-sm)] px-[var(--item-padding-x-sm)] py-[var(--item-padding-y-sm)]',
    title: 'text-label-sm',
    description: 'text-caption-sm',
  },
  md: {
    container: 'min-h-[var(--item-height-md)] px-[var(--item-padding-x-md)] py-[var(--item-padding-y-md)]',
    title: 'text-label-md',
    description: 'text-body-sm',
  },
  lg: {
    container: 'min-h-[var(--item-height-lg)] px-[var(--item-padding-x-lg)] py-[var(--item-padding-y-lg)]',
    title: 'text-heading-h5',
    description: 'text-body-md',
  },
};

/* ── Loading skeleton ────────────────────────────────────────────────────── */
const LoadingSkeleton = ({ size }: { size: ItemSize }) => (
  <>
    <span className="shrink-0 skeleton rounded-[var(--radius-component-full)] w-[var(--size-component-md)] h-[var(--size-component-md)]" />
    <span className="content-flex flex flex-col gap-[var(--item-content-gap)]">
      <span className="skeleton rounded-[var(--radius-component-sm)] h-4 w-3/4" />
      {size !== 'sm' && (
        <span className="skeleton rounded-[var(--radius-component-sm)] h-3 w-1/2" />
      )}
    </span>
  </>
);

/* ── Item component ──────────────────────────────────────────────────────── */
export const Item = memo(forwardRef<HTMLElement, ItemProps>(
  (
    {
      variant = 'default',
      size = 'md',
      title,
      description,
      media,
      actions,
      selected = false,
      disabled = false,
      loading = false,
      interactive,
      href,
      onClick,
      className,
      ...rest
    },
    ref,
  ) => {
    const isInteractive = interactive ?? (!!onClick || !!href);
    const isLink = !!href && !disabled;

    /* ── Root classes ──────────────────────────────────────────────────────── */
    const classes = useMemo(() => [
      // Layout
      'flex items-center gap-[var(--item-gap)] relative',
      // Radius
      'rounded-[var(--item-radius)]',
      // Size
      sizeClasses[size].container,
      // Transition
      'transition-default',
      // Focus (interactive only)
      isInteractive ? 'focus-visible:outline-none focus-visible:focus-ring' : '',
      // Variant / selected / disabled
      disabled
        ? 'bg-[var(--item-bg-disabled)] border border-transparent cursor-not-allowed pointer-events-none'
        : selected
          ? selectedClasses[variant]
          : variantClasses[variant].base,
      // Interactive hover/active (only when not disabled and not selected)
      !disabled && !selected && isInteractive ? variantClasses[variant].interactive : '',
      // Cursor
      !disabled && isInteractive ? 'cursor-pointer select-none' : '',
      // Link reset
      isLink ? 'no-underline' : '',
      // Consumer override
      className,
    ].filter(Boolean).join(' '), [variant, size, selected, disabled, isInteractive, isLink, className]);

    /* ── Title classes ─────────────────────────────────────────────────────── */
    const titleClasses = useMemo(() => [
      sizeClasses[size].title,
      'truncate-label',
      disabled
        ? 'text-[var(--item-title-color-disabled)]'
        : 'text-[var(--item-title-color)]',
    ].filter(Boolean).join(' '), [size, disabled]);

    /* ── Description classes ───────────────────────────────────────────────── */
    const descriptionClasses = useMemo(() => [
      sizeClasses[size].description,
      'truncate-label',
      disabled
        ? 'text-[var(--item-description-color-disabled)]'
        : 'text-[var(--item-description-color)]',
    ].filter(Boolean).join(' '), [size, disabled]);

    /* ── Keyboard handler for div[role=button] ─────────────────────────────── */
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (!isInteractive || disabled || isLink) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
    }, [isInteractive, disabled, isLink, onClick]);

    /* ── Inner content ─────────────────────────────────────────────────────── */
    const content = loading ? (
      <LoadingSkeleton size={size} />
    ) : (
      <>
        {media && (
          <span className="shrink-0 inline-flex items-center justify-center" aria-hidden="true">
            {media}
          </span>
        )}
        <span className="content-flex flex flex-col gap-[var(--item-content-gap)]">
          <span className={titleClasses}>{title}</span>
          {description && (
            <span className={descriptionClasses}>{description}</span>
          )}
        </span>
        {actions && (
          <span className="shrink-0 inline-flex items-center gap-[var(--item-gap)]">
            {actions}
          </span>
        )}
      </>
    );

    /* ── Render as <a> ─────────────────────────────────────────────────────── */
    if (isLink) {
      // Destructure target/rel from rest so getSafeExternalLinkProps can guard them,
      // then spread the remaining anchor attributes after safeProps so sanitized href wins.
      const { target, rel, ...anchorRest } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
      const safeProps = getSafeExternalLinkProps(href, target, rel);
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...safeProps}
          className={classes}
          aria-selected={selected || undefined}
          aria-busy={loading || undefined}
          {...anchorRest}
        >
          {content}
        </a>
      );
    }

    /* ── Render as <div> (with optional role=button) ───────────────────────── */
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={classes}
        role={isInteractive && !disabled ? 'button' : undefined}
        tabIndex={isInteractive && !disabled ? 0 : undefined}
        onClick={!disabled ? onClick : undefined}
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        aria-selected={selected || undefined}
        aria-disabled={disabled || undefined}
        aria-busy={loading || undefined}
        {...rest}
      >
        {content}
      </div>
    );
  },
));
Item.displayName = 'Item';
