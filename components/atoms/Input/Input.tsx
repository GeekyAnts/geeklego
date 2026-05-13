"use client"
import { forwardRef, memo, useId, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import type { InputProps, InputVariant, InputSize } from './Input.types';
import { getErrorFieldProps } from '../../utils/accessibility/aria-helpers';

// ── Variant classes applied to the wrapper <div> ──────────────────────────────
// Each variant uses a fundamentally different visual strategy (not just color shifts)

const variantClasses: Record<InputVariant, string> = {
  // Outlined: visible border at rest, bg tint + border darkens on hover, border changes on focus-within
  default: [
    'bg-[var(--input-bg)] border border-[var(--input-border)]',
    'hover:bg-[var(--input-bg-hover)] hover:border-[var(--input-border-hover)]',
    'focus-within:border-[var(--input-border-focus)]',
  ].join(' '),

  // Filled: muted bg, no border; hover deepens bg; focus-within reveals border + white bg
  filled: [
    'bg-[var(--input-filled-bg)] border border-transparent',
    'hover:bg-[var(--input-filled-bg-hover)]',
    'focus-within:bg-[var(--input-filled-bg-focus)] focus-within:border-[var(--input-border-focus)]',
  ].join(' '),

  // Flushed: border-bottom only, no side/top borders, no radius — editorial feel
  flushed: [
    'bg-transparent border-0 border-b border-[var(--input-border)] rounded-none',
    'hover:border-[var(--input-border-hover)]',
    'focus-within:border-[var(--input-border-focus)]',
  ].join(' '),

  // Unstyled: no border, no bg — composable blank slate
  unstyled: 'bg-transparent border-0',
};

// Error variants — same visual strategies but border locked to error color throughout
const variantErrorClasses: Record<InputVariant, string> = {
  default: [
    'bg-[var(--input-bg)] border border-[var(--input-border-error)]',
    'hover:bg-[var(--input-bg-hover)]',
    'focus-within:border-[var(--input-border-error)]',
  ].join(' '),

  filled: [
    'bg-[var(--input-filled-bg)] border border-[var(--input-border-error)]',
    'hover:bg-[var(--input-filled-bg-hover)]',
    'focus-within:bg-[var(--input-filled-bg-focus)] focus-within:border-[var(--input-border-error)]',
  ].join(' '),

  flushed: [
    'bg-transparent border-0 border-b border-[var(--input-border-error)] rounded-none',
    'focus-within:border-[var(--input-border-error)]',
  ].join(' '),

  unstyled: 'bg-transparent border-0',
};

// Disabled wrapper — muted appearance, no hover/focus response
const disabledWrapperClass =
  'bg-[var(--input-bg-disabled)] border border-[var(--input-border-disabled)] cursor-not-allowed';

// Size map: height (on wrapper), padding classes (on inner input), typography, icon sizing
// Logical property equivalents used throughout for RTL support:
//   ps-* / pe-*  instead of  pl-* / pr-*  (padding-inline-start/end)
//   start-* / end-*  instead of  left-* / right-*  (inset-inline-start/end)
const sizeMap: Record<InputSize, {
  height:     string;
  px:         string;   // shorthand both sides (px-* is already symmetric)
  ps:         string;   // inline-start padding only
  pe:         string;   // inline-end padding only
  psIcon:     string;   // inline-start padding when icon present
  peIcon:     string;   // inline-end padding when icon present
  text:       string;
  iconSize:   string;   // icon width/height (for lucide size prop)
  iconStart:  string;   // icon inline-start position (matches normal px)
  iconEnd:    string;   // icon inline-end position (matches normal px)
}> = {
  sm: {
    height:    'h-[var(--input-height-sm)]',
    px:        'px-[var(--input-px-sm)]',
    ps:        'ps-[var(--input-px-sm)]',
    pe:        'pe-[var(--input-px-sm)]',
    psIcon:    'ps-[var(--input-icon-offset-sm)]',
    peIcon:    'pe-[var(--input-icon-offset-sm)]',
    text:      'text-body-sm',
    iconSize:  'var(--input-icon-size-sm)',
    iconStart: 'start-[var(--input-px-sm)]',
    iconEnd:   'end-[var(--input-px-sm)]',
  },
  md: {
    height:    'h-[var(--input-height-md)]',
    px:        'px-[var(--input-px-md)]',
    ps:        'ps-[var(--input-px-md)]',
    pe:        'pe-[var(--input-px-md)]',
    psIcon:    'ps-[var(--input-icon-offset-md)]',
    peIcon:    'pe-[var(--input-icon-offset-md)]',
    text:      'text-body-md',
    iconSize:  'var(--input-icon-size-md)',
    iconStart: 'start-[var(--input-px-md)]',
    iconEnd:   'end-[var(--input-px-md)]',
  },
  lg: {
    height:    'h-[var(--input-height-lg)]',
    px:        'px-[var(--input-px-lg)]',
    ps:        'ps-[var(--input-px-lg)]',
    pe:        'pe-[var(--input-px-lg)]',
    psIcon:    'ps-[var(--input-icon-offset-lg)]',
    peIcon:    'pe-[var(--input-icon-offset-lg)]',
    text:      'text-body-lg',
    iconSize:  'var(--input-icon-size-lg)',
    iconStart: 'start-[var(--input-px-lg)]',
    iconEnd:   'end-[var(--input-px-lg)]',
  },
};

export const Input = memo(forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      error = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      wrapperClassName,
      required,
      id: idProp,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = idProp ?? generatedId;
    const isDisabled = disabled || isLoading;
    const hasLeftIcon = Boolean(leftIcon);
    const hasRightIcon = Boolean(rightIcon) || isLoading;
    const sz = sizeMap[size];

    // Wrapper: owns border, bg, radius, shadow, hover/focus-within visual state
    const wrapperClasses = useMemo(() => [
      'relative flex items-center w-full transition-default',
      variant !== 'flushed' ? 'rounded-[var(--input-radius)]' : '',
      sz.height,
      'shadow-[var(--input-shadow)] hover:shadow-[var(--input-shadow-hover)]',
      isDisabled
        ? disabledWrapperClass
        : error
          ? variantErrorClasses[variant]
          : variantClasses[variant],
      wrapperClassName,
    ].filter(Boolean).join(' '), [variant, sz.height, isDisabled, error, wrapperClassName]);

    // Inner input padding — expands on icon sides to avoid text overlapping icons
    // Uses logical properties (ps/pe) so layout mirrors correctly in RTL
    const paddingClasses = useMemo(() => {
      if (hasLeftIcon && hasRightIcon) return `${sz.psIcon} ${sz.peIcon}`;
      if (hasLeftIcon)                 return `${sz.psIcon} ${sz.pe}`;
      if (hasRightIcon)                return `${sz.ps} ${sz.peIcon}`;
      return sz.px;
    }, [hasLeftIcon, hasRightIcon, sz]);

    // Inner input: transparent so wrapper handles all visual styling
    const inputClasses = useMemo(() => [
      'flex-1 bg-transparent border-0 outline-none h-full truncate-label',
      sz.text,
      'text-[var(--input-text)]',
      isDisabled
        ? 'placeholder:text-[var(--input-text-disabled)]'
        : 'placeholder:text-[var(--input-text-placeholder)]',
      isDisabled ? 'text-[var(--input-text-disabled)] cursor-not-allowed pointer-events-none' : '',
      paddingClasses,
      // Inset focus ring — appears inside input bounds (WCAG 2.4.11)
      'focus-visible:outline-none focus-visible:focus-ring-inset',
      className,
    ].filter(Boolean).join(' '), [sz.text, isDisabled, paddingClasses, className]);

    const iconLeftClass = useMemo(() => [
      'absolute inset-y-0 flex items-center pointer-events-none',
      sz.iconStart,
      'text-[var(--input-icon-color)]',
    ].join(' '), [sz.iconStart]);

    const iconRightClass = useMemo(() => [
      'absolute inset-y-0 flex items-center pointer-events-none',
      sz.iconEnd,
      'text-[var(--input-icon-color)]',
    ].join(' '), [sz.iconEnd]);

    return (
      <div className={wrapperClasses}>
        {/* Left icon slot — decorative, hidden from assistive tech */}
        {hasLeftIcon && (
          <span className={iconLeftClass} aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={isDisabled}
          aria-disabled={isDisabled || undefined}
          aria-required={required || undefined}
          aria-busy={isLoading || undefined}
          {...getErrorFieldProps(error, `${inputId}-error`)}
          className={inputClasses}
          {...rest}
        />

        {/* Right icon slot or spinner — both decorative in this slot */}
        {hasRightIcon && (
          <span className={iconRightClass} aria-hidden="true">
            {isLoading ? (
              <Loader2 size={sz.iconSize} className="animate-spin" />
            ) : (
              rightIcon
            )}
          </span>
        )}
      </div>
    );
  },
));
Input.displayName = 'Input';
