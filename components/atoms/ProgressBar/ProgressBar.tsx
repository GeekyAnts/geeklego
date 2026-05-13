"use client"
import { forwardRef, memo, useMemo } from 'react';
import type { ProgressBarProps, ProgressBarVariant, ProgressBarSize } from './ProgressBar.types';

// ── Static lookup maps (hoisted — never recreated on re-render) ──────────────

const variantFillClasses: Record<ProgressBarVariant, string> = {
  default: 'bg-[var(--progress-fill-default)]',
  success: 'bg-[var(--progress-fill-success)]',
  warning: 'bg-[var(--progress-fill-warning)]',
  error:   'bg-[var(--progress-fill-error)]',
  neutral: 'bg-[var(--progress-fill-neutral)]',
};

const sizeClasses: Record<ProgressBarSize, string> = {
  xs: 'h-[var(--progress-height-xs)]',
  sm: 'h-[var(--progress-height-sm)]',
  md: 'h-[var(--progress-height-md)]',
  lg: 'h-[var(--progress-height-lg)]',
};

const RADIUS_CLASS = 'rounded-[var(--progress-track-radius)]';

// ── Component ─────────────────────────────────────────────────────────────────

export const ProgressBar = memo(forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      max = 100,
      variant = 'default',
      size = 'md',
      rounded = true,
      label,
      showLabel = false,
      showValue = false,
      className,
      ...rest
    },
    ref,
  ) => {
    // ── Value derivation ────────────────────────────────────────────────────
    const isIndeterminate = value === undefined || value === null;
    const safeValue = isIndeterminate ? 0 : Math.min(max, Math.max(0, value));
    const percentage = isIndeterminate ? 0 : (safeValue / max) * 100;
    const percentageRounded = Math.round(percentage);
    const valueText = isIndeterminate ? undefined : `${percentageRounded}%`;

    // ── Class derivation ────────────────────────────────────────────────────
    const wrapperClasses = useMemo(
      () => ['w-full', className].filter(Boolean).join(' '),
      [className],
    );

    const trackClasses = useMemo(
      () =>
        [
          'relative w-full overflow-hidden bg-[var(--progress-track-bg)]',
          sizeClasses[size],
          rounded ? RADIUS_CLASS : '',
        ]
          .filter(Boolean)
          .join(' '),
      [size, rounded],
    );

    const fillClasses = useMemo(
      () =>
        [
          'h-full transition-default',
          rounded ? RADIUS_CLASS : '',
          variantFillClasses[variant],
          isIndeterminate ? 'progress-indeterminate' : 'w-[var(--progress-fill-width)]',
        ]
          .filter(Boolean)
          .join(' '),
      [variant, rounded, isIndeterminate],
    );

    // ── Optional header row ─────────────────────────────────────────────────
    const showHeaderRow = (showLabel && !!label) || (showValue && !isIndeterminate);

    return (
      <div ref={ref} className={wrapperClasses} {...rest}>
        {showHeaderRow && (
          <div className="flex items-center justify-between gap-[var(--spacing-component-sm)] mb-[var(--spacing-component-xs)]">
            {showLabel && label && (
              <span
                className="text-label-sm text-[var(--progress-label-color)] truncate-label"
                aria-hidden="true"
              >
                {label}
              </span>
            )}
            {showValue && !isIndeterminate && (
              <span
                className="text-label-sm text-[var(--progress-value-color)] content-nowrap ms-auto shrink-0"
                aria-hidden="true"
              >
                {valueText}
              </span>
            )}
          </div>
        )}

        {/*
         * The role="progressbar" element is the semantic anchor.
         * aria-label provides the accessible name when no visible heading is present.
         * aria-valuetext provides a human-readable value string alongside aria-valuenow.
         * aria-busy signals an indeterminate / still-loading state to assistive technology.
         */}
        <div
          role="progressbar"
          aria-valuenow={isIndeterminate ? undefined : percentageRounded}
          aria-valuemin={0}
          aria-valuemax={isIndeterminate ? undefined : 100}
          aria-valuetext={valueText}
          aria-label={label}
          aria-busy={isIndeterminate ? true : undefined}
          className={trackClasses}
        >
          {/*
           * The fill div drives width via a CSS custom property injected through
           * the style prop — the only case where a style prop is used in this
           * component. This is a data binding (percentage → CSS variable → width
           * utility class), not direct visual styling. In indeterminate mode the
           * width is fixed at 40% via .progress-indeterminate CSS class.
           */}
          <div
            className={fillClasses}
            style={
              isIndeterminate
                ? undefined
                : ({ '--progress-fill-width': `${percentage}%` } as React.CSSProperties)
            }
          />
        </div>
      </div>
    );
  },
));

ProgressBar.displayName = 'ProgressBar';
