"use client"
import { forwardRef, memo, useMemo, isValidElement } from 'react';
import { Input } from '../../atoms/Input/Input';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type { InputGroupProps, InputVariant, InputSize } from './InputGroup.types';

// ── Group container variant classes ──────────────────────────────────────────
// Each variant mirrors the Input atom's visual strategy but applied to the group wrapper.
// The inner Input always uses variant="unstyled" — the group owns all border/bg styling.

const groupVariantClasses: Record<InputVariant, string> = {
  // Outlined: visible border at rest, bg tint + border darkens on hover, border changes on focus-within
  default: [
    'bg-[var(--input-group-bg)] border border-[var(--input-group-border)]',
    'hover:bg-[var(--input-group-bg-hover)] hover:border-[var(--input-group-border-hover)]',
    'focus-within:border-[var(--input-group-border-focus)]',
  ].join(' '),

  // Filled: muted bg, no border; hover deepens bg; focus-within reveals border + light bg
  filled: [
    'bg-[var(--input-group-addon-bg)] border border-transparent',
    'hover:bg-[var(--input-group-bg-hover)]',
    'focus-within:bg-[var(--input-group-bg)] focus-within:border-[var(--input-group-border-focus)]',
  ].join(' '),

  // Flushed: bottom border only, no radius — editorial/minimal feel
  flushed: [
    'bg-transparent border-0 border-b border-[var(--input-group-border)] rounded-none',
    'hover:border-[var(--input-group-border-hover)]',
    'focus-within:border-[var(--input-group-border-focus)]',
  ].join(' '),

  // Unstyled: blank slate — no border, no bg, no radius
  unstyled: 'bg-transparent border-0',
};

const groupErrorClasses: Record<InputVariant, string> = {
  default: [
    'bg-[var(--input-group-bg)] border border-[var(--input-group-border-error)]',
    'hover:bg-[var(--input-group-bg-hover)]',
    'focus-within:border-[var(--input-group-border-error)]',
  ].join(' '),

  filled: [
    'bg-[var(--input-group-addon-bg)] border border-[var(--input-group-border-error)]',
    'hover:bg-[var(--input-group-bg-hover)]',
    'focus-within:bg-[var(--input-group-bg)] focus-within:border-[var(--input-group-border-error)]',
  ].join(' '),

  flushed: [
    'bg-transparent border-0 border-b border-[var(--input-group-border-error)] rounded-none',
    'focus-within:border-[var(--input-group-border-error)]',
  ].join(' '),

  unstyled: 'bg-transparent border-0',
};

const groupDisabledClasses =
  'bg-[var(--input-group-bg-disabled)] border border-[var(--input-group-border-disabled)] cursor-not-allowed';

// ── Size map for addon padding (matches Input sizing rhythm) ──────────────────
const addonSizeClasses: Record<InputSize, { px: string; text: string }> = {
  sm: { px: 'px-[var(--input-group-addon-px-sm)]', text: 'text-body-sm' },
  md: { px: 'px-[var(--input-group-addon-px-md)]', text: 'text-body-md' },
  lg: { px: 'px-[var(--input-group-addon-px-lg)]', text: 'text-body-lg' },
};

const groupHeightClasses: Record<InputSize, string> = {
  sm: 'h-[var(--input-height-sm)]',
  md: 'h-[var(--input-height-md)]',
  lg: 'h-[var(--input-height-lg)]',
};

export const InputGroup = memo(forwardRef<HTMLInputElement, InputGroupProps>(
  (
    {
      prefix,
      suffix,
      variant = 'default',
      size = 'md',
      error = false,
      isLoading = false,
      disabled,
      wrapperClassName,
      className,
      'aria-label': ariaLabel,
      i18nStrings,
      ...inputProps
    },
    ref,
  ) => {
    const i18n = useComponentI18n('inputGroup', i18nStrings);
    const isDisabled = disabled || isLoading;
    const hasPrefix = Boolean(prefix);
    const hasSuffix = Boolean(suffix);
    const addonSz = addonSizeClasses[size];

    const isButtonElement = (element: React.ReactNode): boolean => {
      if (!isValidElement(element)) return false;
      const el = element as React.ReactElement<any>;
      return (el as any).type === 'button' || 
             (typeof (el as any).type === 'function' && 
              (el as any).type.displayName === 'Button');
    };
    
    const prefixIsButton = isButtonElement(prefix);
    const suffixIsButton = isButtonElement(suffix);

    // Group wrapper — owns border, bg, radius, shadow, hover/focus-within state
    const groupClasses = useMemo(() => [
      'relative flex items-center w-full transition-default',
      variant !== 'flushed' ? 'rounded-[var(--input-group-radius)]' : '',
      variant !== 'flushed' ? 'overflow-hidden' : '',
      groupHeightClasses[size],
      'shadow-[var(--input-group-shadow)] hover:shadow-[var(--input-group-shadow-hover)]',
      isDisabled
        ? groupDisabledClasses
        : error
          ? groupErrorClasses[variant]
          : groupVariantClasses[variant],
      wrapperClassName,
    ].filter(Boolean).join(' '), [variant, size, isDisabled, error, wrapperClassName]);

    // Prefix addon — start side, separator on the end edge
    const prefixClasses = useMemo(() => [
      'flex shrink-0 items-center self-stretch',
      addonSz.px,
      addonSz.text,
      'text-[var(--input-group-addon-text)]',
      'bg-[var(--input-group-addon-bg)]',
      // Separator: border on the inline-end edge, inside the group border
      'border-e border-[var(--input-group-addon-border)]',
      // If button, clip left border-radius and remove left border
      prefixIsButton ? 'rounded-s-none border-s-0' : '',
      isDisabled ? 'text-[var(--input-group-addon-text-disabled)] bg-[var(--input-group-addon-bg-disabled)]' : '',
    ].filter(Boolean).join(' '), [addonSz, isDisabled, prefixIsButton]);

    // Suffix addon — end side, separator on the start edge
    const suffixClasses = useMemo(() => [
      'flex shrink-0 items-center self-stretch',
      addonSz.px,
      addonSz.text,
      'text-[var(--input-group-addon-text)]',
      'bg-[var(--input-group-addon-bg)]',
      // Separator: border on the inline-start edge, inside the group border
      'border-s border-[var(--input-group-addon-border)]',
      // If button, clip right border-radius and remove right border
      suffixIsButton ? 'rounded-e-none border-e-0' : '',
      isDisabled ? 'text-[var(--input-group-addon-text-disabled)] bg-[var(--input-group-addon-bg-disabled)]' : '',
    ].filter(Boolean).join(' '), [addonSz, isDisabled, suffixIsButton]);

    return (
      <div
        role="group"
        aria-label={ariaLabel}
        className={groupClasses}
      >
        {/* Start addon slot */}
        {hasPrefix && (
          <span className={prefixClasses}>
            {prefix}
          </span>
        )}

        {/* Inner Input — unstyled so the group container owns all visual treatment */}
        <Input
          ref={ref}
          variant="unstyled"
          size={size}
          error={error}
          isLoading={isLoading}
          disabled={disabled}
          wrapperClassName="flex-1 min-w-0 h-full"
          className={className}
          placeholder={inputProps.placeholder ?? i18n.placeholder}
          {...inputProps}
        />

        {/* End addon slot */}
        {hasSuffix && (
          <span className={suffixClasses}>
            {suffix}
          </span>
        )}
      </div>
    );
  },
));
InputGroup.displayName = 'InputGroup';
