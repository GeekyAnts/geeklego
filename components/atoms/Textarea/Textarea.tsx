"use client"
import { forwardRef, memo, useId, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import type { TextareaProps, TextareaVariant, TextareaSize, TextareaResize } from './Textarea.types';
import { getErrorFieldProps } from '../../utils/accessibility/aria-helpers';

// ── Variant classes applied to the wrapper <div> ──────────────────────────────
// Each variant uses a fundamentally different visual strategy — not just colour shifts

const variantClasses: Record<TextareaVariant, string> = {
  // Outlined: visible border at rest; bg tints + border darkens on hover; border changes on focus-within
  default: [
    'bg-[var(--textarea-bg)] border border-[var(--textarea-border)]',
    'hover:bg-[var(--textarea-bg-hover)] hover:border-[var(--textarea-border-hover)]',
    'focus-within:border-[var(--textarea-border-focus)]',
  ].join(' '),

  // Filled: muted bg, no border; hover deepens bg; focus-within reveals border + white bg
  filled: [
    'bg-[var(--textarea-filled-bg)] border border-transparent',
    'hover:bg-[var(--textarea-filled-bg-hover)]',
    'focus-within:bg-[var(--textarea-filled-bg-focus)] focus-within:border-[var(--textarea-border-focus)]',
  ].join(' '),

  // Flushed: border-bottom only, no side/top borders, no radius — editorial feel
  flushed: [
    'bg-transparent border-0 border-b border-[var(--textarea-border)] rounded-none',
    'hover:border-[var(--textarea-border-hover)]',
    'focus-within:border-[var(--textarea-border-focus)]',
  ].join(' '),

  // Unstyled: no border, no bg — composable blank slate
  unstyled: 'bg-transparent border-0',
};

// Error variants — same visual strategies, border locked to error colour throughout
const variantErrorClasses: Record<TextareaVariant, string> = {
  default: [
    'bg-[var(--textarea-bg)] border border-[var(--textarea-border-error)]',
    'hover:bg-[var(--textarea-bg-hover)]',
    'focus-within:border-[var(--textarea-border-error)]',
  ].join(' '),

  filled: [
    'bg-[var(--textarea-filled-bg)] border border-[var(--textarea-border-error)]',
    'hover:bg-[var(--textarea-filled-bg-hover)]',
    'focus-within:bg-[var(--textarea-filled-bg-focus)] focus-within:border-[var(--textarea-border-error)]',
  ].join(' '),

  flushed: [
    'bg-transparent border-0 border-b border-[var(--textarea-border-error)] rounded-none',
    'focus-within:border-[var(--textarea-border-error)]',
  ].join(' '),

  unstyled: 'bg-transparent border-0',
};

// Disabled wrapper — muted appearance, no hover/focus response
const disabledWrapperClass =
  'bg-[var(--textarea-bg-disabled)] border border-[var(--textarea-border-disabled)] cursor-not-allowed';

// Resize handle → Tailwind utility
const resizeClasses: Record<TextareaResize, string> = {
  none:       'resize-none',
  vertical:   'resize-y',
  horizontal: 'resize-x',
  both:       'resize',
};

// Size map: padding tokens, typography class, and spinner placement
const sizeMap: Record<TextareaSize, {
  px:          string;
  py:          string;
  text:        string;
  spinnerTop:  string;
  spinnerEnd:  string;
  spinnerSize: string;
}> = {
  sm: {
    px:          'px-[var(--textarea-px-sm)]',
    py:          'py-[var(--textarea-py-sm)]',
    text:        'text-body-sm',
    spinnerTop:  'top-[var(--textarea-py-sm)]',
    spinnerEnd:  'end-[var(--textarea-px-sm)]',
    spinnerSize: 'var(--size-icon-xs)',
  },
  md: {
    px:          'px-[var(--textarea-px-md)]',
    py:          'py-[var(--textarea-py-md)]',
    text:        'text-body-md',
    spinnerTop:  'top-[var(--textarea-py-md)]',
    spinnerEnd:  'end-[var(--textarea-px-md)]',
    spinnerSize: 'var(--size-icon-sm)',
  },
  lg: {
    px:          'px-[var(--textarea-px-lg)]',
    py:          'py-[var(--textarea-py-lg)]',
    text:        'text-body-lg',
    spinnerTop:  'top-[var(--textarea-py-lg)]',
    spinnerEnd:  'end-[var(--textarea-px-lg)]',
    spinnerSize: 'var(--size-icon-md)',
  },
};

export const Textarea = memo(forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = 'default',
      size = 'md',
      resize = 'vertical',
      error = false,
      isLoading = false,
      rows = 4,
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
    const textareaId = idProp ?? generatedId;
    const isDisabled = disabled || isLoading;
    const sz = sizeMap[size];

    // Wrapper: owns border, bg, radius, shadow, hover/focus-within visual state
    const wrapperClasses = useMemo(() => [
      'relative w-full transition-default',
      variant !== 'flushed' ? 'rounded-[var(--textarea-radius)]' : '',
      'shadow-[var(--textarea-shadow)] hover:shadow-[var(--textarea-shadow-hover)]',
      isDisabled
        ? disabledWrapperClass
        : error
          ? variantErrorClasses[variant]
          : variantClasses[variant],
      wrapperClassName,
    ].filter(Boolean).join(' '), [variant, isDisabled, error, wrapperClassName]);

    // Inner textarea: transparent so wrapper handles all visual styling
    const textareaClasses = useMemo(() => [
      'block w-full bg-transparent border-0 outline-none',
      sz.text,
      sz.px,
      sz.py,
      'text-[var(--textarea-text)]',
      resizeClasses[resize],
      isDisabled
        ? 'placeholder:text-[var(--textarea-text-disabled)] text-[var(--textarea-text-disabled)] cursor-not-allowed pointer-events-none'
        : 'placeholder:text-[var(--textarea-text-placeholder)]',
      // Inset focus ring — appears inside textarea bounds (WCAG 2.4.11)
      'focus-visible:outline-none focus-visible:focus-ring-inset',
      className,
    ].filter(Boolean).join(' '), [sz.text, sz.px, sz.py, resize, isDisabled, className]);

    const spinnerClasses = useMemo(() => [
      'absolute pointer-events-none text-[var(--textarea-icon-color)]',
      sz.spinnerTop,
      sz.spinnerEnd,
    ].join(' '), [sz.spinnerTop, sz.spinnerEnd]);

    return (
      <div className={wrapperClasses}>
        {/* Loading spinner — top-right corner, decorative */}
        {isLoading && (
          <span className={spinnerClasses} aria-hidden="true">
            <Loader2 size={sz.spinnerSize} className="animate-spin" />
          </span>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={isDisabled}
          aria-disabled={isDisabled || undefined}
          aria-required={required || undefined}
          aria-busy={isLoading || undefined}
          {...getErrorFieldProps(error, `${textareaId}-error`)}
          className={textareaClasses}
          {...rest}
        />
      </div>
    );
  },
));
Textarea.displayName = 'Textarea';
