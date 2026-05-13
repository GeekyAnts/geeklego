"use client"
import { forwardRef, memo, useId, useMemo, useCallback } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { NumberInputProps, NumberInputVariant, NumberInputSize } from './NumberInput.types';
import { Input } from '../../atoms/Input/Input';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';

// ── Container visual treatment — owns border/bg; Input renders variant="unstyled" ──

const containerVariantClasses: Record<NumberInputVariant, string> = {
  // Outlined: visible border at rest, bg tint + border darkens on hover
  default: [
    'bg-[var(--number-input-bg)] border border-[var(--number-input-border)]',
    'hover:bg-[var(--number-input-bg-hover)] hover:border-[var(--number-input-border-hover)]',
    'focus-within:border-[var(--number-input-border-focus)]',
  ].join(' '),

  // Filled: muted bg, no border; focus-within reveals border + lighter bg
  filled: [
    'bg-[var(--number-input-bg-filled)] border border-transparent',
    'hover:bg-[var(--number-input-bg-filled-hover)]',
    'focus-within:bg-[var(--number-input-bg-filled-focus)] focus-within:border-[var(--number-input-border-focus)]',
  ].join(' '),

  // Flushed: bottom border only, no radius
  flushed: [
    'bg-transparent border-0 border-b border-[var(--number-input-border)] rounded-none',
    'hover:border-[var(--number-input-border-hover)]',
    'focus-within:border-[var(--number-input-border-focus)]',
  ].join(' '),

  // Unstyled: blank slate
  unstyled: 'bg-transparent border-0',
};

const containerErrorClasses: Record<NumberInputVariant, string> = {
  default: [
    'bg-[var(--number-input-bg)] border border-[var(--number-input-border-error)]',
    'hover:bg-[var(--number-input-bg-hover)]',
    'focus-within:border-[var(--number-input-border-error)]',
  ].join(' '),
  filled: [
    'bg-[var(--number-input-bg-filled)] border border-[var(--number-input-border-error)]',
    'hover:bg-[var(--number-input-bg-filled-hover)]',
    'focus-within:bg-[var(--number-input-bg-filled-focus)] focus-within:border-[var(--number-input-border-error)]',
  ].join(' '),
  flushed: [
    'bg-transparent border-0 border-b border-[var(--number-input-border-error)] rounded-none',
    'focus-within:border-[var(--number-input-border-error)]',
  ].join(' '),
  unstyled: 'bg-transparent border-0',
};

const containerDisabledClass =
  'bg-[var(--number-input-bg-disabled)] border border-[var(--number-input-border-disabled)] cursor-not-allowed';

// ── Heights match Input atom sizes exactly ────────────────────────────────────
const heightClasses: Record<NumberInputSize, string> = {
  sm: 'h-[var(--input-height-sm)]',
  md: 'h-[var(--input-height-md)]',
  lg: 'h-[var(--input-height-lg)]',
};

// ── Stepper button widths ─────────────────────────────────────────────────────
const btnWidthClasses: Record<NumberInputSize, string> = {
  sm: 'w-[var(--number-input-btn-width-sm)]',
  md: 'w-[var(--number-input-btn-width-md)]',
  lg: 'w-[var(--number-input-btn-width-lg)]',
};

// ── Icon sizes match size rhythm ──────────────────────────────────────────────
const btnIconSizes: Record<NumberInputSize, string> = {
  sm: 'var(--size-icon-xs)',
  md: 'var(--size-icon-sm)',
  lg: 'var(--size-icon-md)',
};

export const NumberInput = memo(
  forwardRef<HTMLInputElement, NumberInputProps>(
    (
      {
        variant = 'default',
        size = 'md',
        error = false,
        value,
        min,
        max,
        step = 1,
        disabled = false,
        onChange,
        wrapperClassName,
        className,
        id: idProp,
        i18nStrings,
        ...rest
      },
      ref,
    ) => {
      const i18n = useComponentI18n('numberInput', i18nStrings);
      const generatedId = useId();
      const inputId = idProp ?? generatedId;

      // ── Clamp helpers ─────────────────────────────────────────────────────────
      const parseValue = useCallback(
        (v: number | string | undefined): number =>
          v === '' || v === undefined ? NaN : Number(v),
        [],
      );

      const clampValue = useCallback(
        (n: number): number => {
          if (isNaN(n)) return n;
          if (min !== undefined && n < min) return min;
          if (max !== undefined && n > max) return max;
          return n;
        },
        [min, max],
      );

      const emitChange = useCallback(
        (newVal: number) => {
          if (!onChange) return;
          const clamped = clampValue(newVal);
          // Synthetic event mirroring InputHTMLAttributes<HTMLInputElement> onChange
          const target = document.getElementById(inputId) as HTMLInputElement | null;
          if (!target) return;
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value',
          )?.set;
          nativeInputValueSetter?.call(target, String(isNaN(clamped) ? '' : clamped));
          target.dispatchEvent(new Event('input', { bubbles: true }));
        },
        [onChange, clampValue, inputId],
      );

      const handleDecrement = useCallback(() => {
        const current = parseValue(value);
        emitChange(isNaN(current) ? (min ?? 0) : current - step);
      }, [parseValue, value, emitChange, step, min]);

      const handleIncrement = useCallback(() => {
        const current = parseValue(value);
        emitChange(isNaN(current) ? (min ?? 0) : current + step);
      }, [parseValue, value, emitChange, step, min]);

      const numericValue = parseValue(value);
      const atMin = min !== undefined && !isNaN(numericValue) && numericValue <= min;
      const atMax = max !== undefined && !isNaN(numericValue) && numericValue >= max;

      // ── Container ─────────────────────────────────────────────────────────────
      const containerClasses = useMemo(
        () =>
          [
            'relative flex items-center w-full overflow-hidden transition-default',
            variant !== 'flushed' ? 'rounded-[var(--number-input-radius)]' : '',
            heightClasses[size],
            'shadow-[var(--number-input-shadow)] hover:shadow-[var(--number-input-shadow-hover)]',
            disabled
              ? containerDisabledClass
              : error
                ? containerErrorClasses[variant]
                : containerVariantClasses[variant],
            wrapperClassName,
          ]
            .filter(Boolean)
            .join(' '),
        [variant, size, disabled, error, wrapperClassName],
      );

      // ── Stepper button base class ─────────────────────────────────────────────
      const btnBaseClass = useMemo(
        () =>
          [
            'flex shrink-0 items-center justify-center self-stretch',
            'transition-default',
            'focus-visible:outline-none focus-visible:focus-ring-inset',
            btnWidthClasses[size],
            disabled
              ? [
                  'bg-[var(--number-input-btn-bg-disabled)]',
                  'text-[var(--number-input-btn-color-disabled)]',
                  'cursor-not-allowed pointer-events-none',
                ].join(' ')
              : [
                  'bg-[var(--number-input-btn-bg)]',
                  'text-[var(--number-input-btn-color)]',
                  'hover:bg-[var(--number-input-btn-bg-hover)] hover:text-[var(--number-input-btn-color-hover)]',
                  'active:bg-[var(--number-input-btn-bg-active)]',
                  'cursor-pointer',
                ].join(' '),
          ]
            .filter(Boolean)
            .join(' '),
        [size, disabled],
      );

      const decrementClass = useMemo(
        () =>
          [
            btnBaseClass,
            'border-e border-[var(--number-input-btn-border)]',
            atMin && !disabled
              ? 'opacity-40 pointer-events-none'
              : '',
          ]
            .filter(Boolean)
            .join(' '),
        [btnBaseClass, atMin, disabled],
      );

      const incrementClass = useMemo(
        () =>
          [
            btnBaseClass,
            'border-s border-[var(--number-input-btn-border)]',
            atMax && !disabled
              ? 'opacity-40 pointer-events-none'
              : '',
          ]
            .filter(Boolean)
            .join(' '),
        [btnBaseClass, atMax, disabled],
      );

      return (
        <div className={containerClasses}>
          {/* Decrement button */}
          <button
            type="button"
            tabIndex={0}
            aria-label={i18n.decrementLabel}
            aria-controls={inputId}
            disabled={disabled || (atMin && !isNaN(numericValue))}
            aria-disabled={disabled || (atMin && !isNaN(numericValue)) || undefined}
            onClick={handleDecrement}
            className={decrementClass}
          >
            <Minus size={btnIconSizes[size]} aria-hidden="true" />
          </button>

          {/* Numeric input — unstyled so container handles all visual treatment */}
          <Input
            ref={ref}
            id={inputId}
            type="number"
            variant="unstyled"
            size={size}
            error={error}
            disabled={disabled}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
            readOnly={value !== undefined && !onChange}
            wrapperClassName="flex-1 min-w-0 h-full"
            className={[
              'text-center',
              // Hide browser-native spin buttons — our custom steppers replace them
              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...rest}
          />

          {/* Increment button */}
          <button
            type="button"
            tabIndex={0}
            aria-label={i18n.incrementLabel}
            aria-controls={inputId}
            disabled={disabled || (atMax && !isNaN(numericValue))}
            aria-disabled={disabled || (atMax && !isNaN(numericValue)) || undefined}
            onClick={handleIncrement}
            className={incrementClass}
          >
            <Plus size={btnIconSizes[size]} aria-hidden="true" />
          </button>
        </div>
      );
    },
  ),
);
NumberInput.displayName = 'NumberInput';
