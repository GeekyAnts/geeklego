"use client"
import { forwardRef, memo, useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { ColorSwatchProps, ColorSwatchSize, ColorSwatchShape } from './ColorSwatch.types';

// ── Static class maps (hoisted — never recreated per render) ──────────────────

const sizeClasses: Record<ColorSwatchSize, string> = {
  sm: 'w-[var(--color-swatch-size-sm)] h-[var(--color-swatch-size-sm)]',
  md: 'w-[var(--color-swatch-size-md)] h-[var(--color-swatch-size-md)]',
  lg: 'w-[var(--color-swatch-size-lg)] h-[var(--color-swatch-size-lg)]',
};

const shapeClasses: Record<ColorSwatchShape, string> = {
  square: 'rounded-[var(--color-swatch-radius-square)]',
  circle: 'rounded-[var(--color-swatch-radius-circle)]',
};

// Selected: persistent 2px outline ring with offset, using design-system ring color
const SELECTED_RING =
  'outline outline-2 outline-offset-2 outline-[var(--color-swatch-ring)]';

// Enabled hover/active: scale lift + border darkens (two-property change)
const ENABLED_CLASSES = [
  'hover:border-[var(--color-swatch-border-hover)]',
  'hover:scale-110',
  'hover:shadow-[var(--color-swatch-shadow-hover)]',
  'active:scale-100',
  'active:shadow-[var(--color-swatch-shadow-active)]',
].join(' ');

const DISABLED_CLASSES =
  'opacity-[var(--color-swatch-opacity-disabled)] cursor-not-allowed pointer-events-none';

// ── Component ─────────────────────────────────────────────────────────────────

export const ColorSwatch = memo(forwardRef<HTMLButtonElement, ColorSwatchProps>(
  (
    {
      color,
      selected = false,
      size = 'md',
      shape = 'square',
      disabled,
      className,
      ...rest
    },
    ref,
  ) => {
    const classes = useMemo(() => [
      // Layout
      'inline-flex shrink-0 cursor-pointer',
      // Border defines swatch against any background
      'border border-[var(--color-swatch-border)]',
      // Shadow (none)
      'shadow-[var(--color-swatch-shadow)]',
      // Transitions
      'transition-default',
      // Focus ring
      'focus-visible:outline-none focus-visible:focus-ring',
      // Color fill (dynamic via CSS custom property injection)
      'bg-[var(--color-swatch-value)]',
      // Size + shape
      sizeClasses[size],
      shapeClasses[shape],
      // Selection ring
      selected ? SELECTED_RING : '',
      // State
      disabled ? DISABLED_CLASSES : ENABLED_CLASSES,
      className,
    ].filter(Boolean).join(' '), [size, shape, selected, disabled, className]);

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-disabled={disabled || undefined}
        aria-pressed={selected}
        className={classes}
        // CSS custom property injection — not inline visual styling;
        // this is the only way to pass a dynamic user-provided color value
        style={{ '--color-swatch-value': color } as CSSProperties}
        {...rest}
      />
    );
  },
));
ColorSwatch.displayName = 'ColorSwatch';
