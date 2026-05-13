"use client";

import {
  forwardRef,
  memo,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useId,
} from 'react';
import { Check, Minus } from 'lucide-react';
import type { CheckboxProps, CheckboxSize } from './Checkbox.types';
import { getErrorFieldProps } from '../../utils/accessibility/aria-helpers';

// ── Size map — box dimensions + icon sizes via component tokens ────────────────
const sizeClasses: Record<CheckboxSize, { box: string; iconSize: string }> = {
  sm: {
    box: 'w-[var(--checkbox-size-sm)] h-[var(--checkbox-size-sm)]',
    iconSize: 'var(--checkbox-icon-size-sm)',
  },
  md: {
    box: 'w-[var(--checkbox-size-md)] h-[var(--checkbox-size-md)]',
    iconSize: 'var(--checkbox-icon-size-md)',
  },
  lg: {
    box: 'w-[var(--checkbox-size-lg)] h-[var(--checkbox-size-lg)]',
    iconSize: 'var(--checkbox-icon-size-lg)',
  },
};

// ── Indicator state classes — each state uses a distinct visual strategy ───────

// Unchecked, no error
const indicatorUnchecked =
  'bg-[var(--checkbox-bg)] border-[var(--checkbox-border)] ' +
  'group-hover:bg-[var(--checkbox-bg-hover)] group-hover:border-[var(--checkbox-border-hover)] ' +
  'group-hover:shadow-[var(--checkbox-shadow-hover)] group-active:shadow-[var(--checkbox-shadow-active)]';

// Unchecked with error
const indicatorUncheckedError =
  'bg-[var(--checkbox-bg)] border-[var(--checkbox-border-error)] ' +
  'group-hover:bg-[var(--checkbox-bg-hover)]';

// Checked or indeterminate, no error
const indicatorChecked =
  'bg-[var(--checkbox-bg-checked)] border-[var(--checkbox-border-checked)] ' +
  'group-hover:bg-[var(--checkbox-bg-checked-hover)] group-hover:border-[var(--checkbox-border-checked-hover)] ' +
  'group-hover:shadow-[var(--checkbox-shadow-hover)] group-active:shadow-[var(--checkbox-shadow-active)]';

// Checked or indeterminate with error
const indicatorCheckedError =
  'bg-[var(--checkbox-bg-checked)] border-[var(--checkbox-border-error)] ' +
  'group-hover:bg-[var(--checkbox-bg-checked-hover)] group-hover:shadow-[var(--checkbox-shadow-hover)] ' +
  'group-active:shadow-[var(--checkbox-shadow-active)]';

// Disabled (all states)
const indicatorDisabled =
  'bg-[var(--checkbox-bg-disabled)] border-[var(--checkbox-border-disabled)] cursor-not-allowed';

export const Checkbox = memo(
  forwardRef<HTMLInputElement, CheckboxProps>(
    (
      {
        checked,
        indeterminate = false,
        size = 'md',
        error = false,
        disabled = false,
        required = false,
        children,
        id: idProp,
        className,
        onChange,
        ...rest
      },
      forwardedRef,
    ) => {
      const generatedId = useId();
      const inputId = idProp ?? generatedId;
      const localRef = useRef<HTMLInputElement>(null);

      // indeterminate is a DOM property, not an HTML attribute — must sync via ref
      useEffect(() => {
        if (localRef.current) {
          localRef.current.indeterminate = indeterminate;
        }
      }, [indeterminate]);

      // Merge internal ref with forwarded ref so both consumers and indeterminate sync work
      const setRef = useCallback(
        (node: HTMLInputElement | null) => {
          (localRef as { current: HTMLInputElement | null }).current = node;
          if (typeof forwardedRef === 'function') {
            forwardedRef(node);
          } else if (forwardedRef) {
            (forwardedRef as { current: HTMLInputElement | null }).current = node;
          }
        },
        [forwardedRef],
      );

      const sz = sizeClasses[size];
      const isCheckedOrIndeterminate = (checked ?? false) || indeterminate;

      // Indicator box — carries all visual state; aria-hidden (screen readers use native input).
      // Focus ring uses peer-focus-visible: CSS — no JS state needed.
      // This prevents outline-offset from being animated (transition-default only animates
      // bg-color, border-color, color, box-shadow, opacity, transform).
      const indicatorClasses = useMemo(
        () =>
          [
            'flex items-center justify-center flex-shrink-0 pointer-events-none',
            'border rounded-[var(--checkbox-radius)]',
            'transition-default',
            'shadow-[var(--checkbox-shadow)]',
            'peer-focus-visible:focus-ring',
            sz.box,
            disabled
              ? indicatorDisabled
              : isCheckedOrIndeterminate
                ? error
                  ? indicatorCheckedError
                  : indicatorChecked
                : error
                  ? indicatorUncheckedError
                  : indicatorUnchecked,
          ]
            .filter(Boolean)
            .join(' '),
        [sz.box, disabled, isCheckedOrIndeterminate, error],
      );

      // Wrapper label
      const labelClasses = useMemo(
        () =>
          [
            'inline-flex items-center group gap-[var(--checkbox-gap)]',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [disabled, className],
      );

      // Label text
      const labelTextClasses = useMemo(
        () =>
          [
            'text-body-md truncate-label',
            disabled
              ? 'text-[var(--checkbox-label-color-disabled)]'
              : 'text-[var(--checkbox-label-color)]',
          ].join(' '),
        [disabled],
      );

      const iconColorClass = disabled
        ? 'text-[var(--checkbox-icon-disabled)]'
        : 'text-[var(--checkbox-icon)]';

      return (
        <label htmlFor={inputId} className={labelClasses}>
          {/*
           * Indicator wrapper:
           * - touch-target: expands hit area to ≥24px (WCAG 2.5.8) via ::after pseudo-element
           * - inline-flex: prevents baseline-alignment shift when the icon appears/disappears
           * - relative: anchors the absolute-positioned native input and touch-target ::after
           */}
          <span className="relative flex-shrink-0 inline-flex touch-target">
            {/*
             * Native input: fully transparent overlay. Provides native checkbox semantics,
             * keyboard interaction (Space to toggle), and form participation.
             * Marked as Tailwind "peer" so the next sibling indicator can react to
             * :focus-visible via peer-focus-visible: without any JS state or re-renders.
             * onFocus/onBlur pass through via ...rest for consumer use.
             */}
            <input
              ref={setRef}
              id={inputId}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              required={required}
              aria-required={required || undefined}
              {...getErrorFieldProps(error, `${inputId}-error`)}
              onChange={onChange}
              readOnly={checked !== undefined && onChange == null}
              className="peer absolute inset-0 w-full h-full opacity-0 m-0"
              {...rest}
            />

            {/* Custom visual indicator — decorative, hidden from assistive tech */}
            <span className={indicatorClasses} aria-hidden="true">
              {isCheckedOrIndeterminate && (
                <span className={iconColorClass}>
                  {indeterminate ? (
                    <Minus size={sz.iconSize} strokeWidth={3} aria-hidden="true" />
                  ) : (
                    <Check size={sz.iconSize} strokeWidth={3} aria-hidden="true" />
                  )}
                </span>
              )}
            </span>
          </span>

          {/* Label text slot */}
          {children != null && (
            <span className={labelTextClasses}>{children}</span>
          )}
        </label>
      );
    },
  ),
);
Checkbox.displayName = 'Checkbox';
