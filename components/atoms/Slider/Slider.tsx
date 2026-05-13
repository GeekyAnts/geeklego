"use client"
import { forwardRef, memo, useCallback, useId, useMemo, useState } from 'react';
import type { SliderProps, SliderSize } from './Slider.types';

// ── Size → BEM modifier class (hoisted — never recreated on re-render) ────────
// md is the default in the CSS base rules; no extra class needed.
const sizeInputClass: Record<SliderSize, string> = {
  sm: 'slider-input--sm',
  md: '',
  lg: 'slider-input--lg',
};

// ── Component ─────────────────────────────────────────────────────────────────

export const Slider = memo(
  forwardRef<HTMLInputElement, SliderProps>(
    (
      {
        min = 0,
        max = 100,
        step = 1,
        value,
        defaultValue,
        onChange,
        size = 'md',
        disabled = false,
        label,
        showValue = false,
        className,
        id: idProp,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        ...rest
      },
      ref,
    ) => {
      // ── Controlled vs uncontrolled ───────────────────────────────────────────
      const isControlled = value !== undefined;
      const [internalValue, setInternalValue] = useState<number>(
        defaultValue !== undefined ? defaultValue : min,
      );
      const currentValue = isControlled ? (value as number) : internalValue;

      // ── IDs for aria associations ───────────────────────────────────────────
      const generatedId = useId();
      const inputId = idProp ?? generatedId;
      const labelId = `${inputId}-label`;

      // ── Fill percentage — clamped 0–100 ─────────────────────────────────────
      const safePct = useMemo(() => {
        const range = max - min;
        if (range === 0) return 0;
        return Math.min(100, Math.max(0, ((currentValue - min) / range) * 100));
      }, [currentValue, min, max]);

      // ── Event handler ────────────────────────────────────────────────────────
      const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const next = Number(e.target.value);
          if (!isControlled) setInternalValue(next);
          onChange?.(next);
        },
        [isControlled, onChange],
      );

      // ── Class derivation ─────────────────────────────────────────────────────
      const wrapperClasses = useMemo(
        () => ['w-full', className].filter(Boolean).join(' '),
        [className],
      );

      const labelClasses = useMemo(
        () =>
          [
            'text-label-sm truncate-label',
            disabled
              ? 'text-[var(--slider-label-color-disabled)]'
              : 'text-[var(--slider-label-color)]',
          ].join(' '),
        [disabled],
      );

      const valueClasses = useMemo(
        () =>
          [
            'text-label-sm content-nowrap ml-auto shrink-0',
            disabled
              ? 'text-[var(--slider-value-color-disabled)]'
              : 'text-[var(--slider-value-color)]',
          ].join(' '),
        [disabled],
      );

      const inputClasses = useMemo(
        () =>
          [
            'slider-input',
            sizeInputClass[size],
          ]
            .filter(Boolean)
            .join(' '),
        [size],
      );

      // ── Determine accessible name source ────────────────────────────────────
      // label prop → aria-labelledby to the visible <span>
      // aria-labelledby prop → pass through
      // aria-label prop → pass through
      // Neither → caller must provide aria-label via ...rest
      const resolvedLabelledBy = label ? labelId : ariaLabelledBy;
      const resolvedAriaLabel = !label ? ariaLabel : undefined;

      const showHeaderRow = !!label || showValue;

      return (
        <div className={wrapperClasses}>
          {showHeaderRow && (
            <div className="flex items-center gap-[var(--slider-gap)] mb-[var(--slider-gap)]">
              {label && (
                /*
                 * aria-hidden="true" — the ARIA accessible name is supplied via
                 * aria-labelledby on the <input>, pointing to this element's id.
                 * The span itself does not need to be in the AT reading order.
                 */
                <span
                  id={labelId}
                  className={labelClasses}
                  aria-hidden="true"
                >
                  {label}
                </span>
              )}
              {showValue && (
                /*
                 * The numeric value display is visual-only. The real value is
                 * communicated to AT via aria-valuenow / aria-valuetext on the input.
                 */
                <span className={valueClasses} aria-hidden="true">
                  {currentValue}
                </span>
              )}
            </div>
          )}

          {/*
           * Focus ring wrapper — provides a consistent cross-browser focus indicator
           * via focus-within:focus-ring. The <input> itself has outline:none in the
           * geeklego.css CSS rules block; this wrapper shows the ring instead.
           * min-h-[var(--size-component-xs)] = 24px — ensures the WCAG 2.5.8 touch
           * target minimum is met even for the sm size (14px thumb height).
           */}
          <div
            className="relative rounded-[var(--slider-track-radius)] min-h-[var(--size-component-xs)] flex items-center focus-within:focus-ring"
          >
            <input
              ref={ref}
              id={inputId}
              type="range"
              min={min}
              max={max}
              step={step}
              value={currentValue}
              disabled={disabled}
              aria-label={resolvedAriaLabel}
              aria-labelledby={resolvedLabelledBy}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={currentValue}
              aria-valuetext={String(currentValue)}
              aria-disabled={disabled || undefined}
              onChange={handleChange}
              className={inputClasses}
              /*
               * --slider-fill-pct is a data binding (computed percentage → CSS
               * gradient position), not a hardcoded visual style. This is the only
               * acceptable use of the style prop in this component.
               */
              style={{ '--slider-fill-pct': `${safePct}%` } as React.CSSProperties}
              {...rest}
            />
          </div>
        </div>
      );
    },
  ),
);

Slider.displayName = 'Slider';
