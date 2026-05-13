"use client"
import { forwardRef, memo, useMemo } from 'react';
import type { ProgressIndicatorProps, ProgressIndicatorVariant, ProgressIndicatorSize } from './ProgressIndicator.types';

// ── SVG geometry constants ──────────────────────────────────────────────────
// Fixed 36×36 viewBox. Radius is chosen so circumference ≈ 100 —
// simplifying the dash-offset math to: offset = circumference × (1 − pct/100).
const VIEWBOX = 36;
const CX = VIEWBOX / 2; // 18
const CY = VIEWBOX / 2; // 18
const RADIUS = 15.9155;  // 2πr ≈ 100
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 100.0

// Stroke width in viewBox units — thinner on small circles, thicker on large.
// Scales proportionally with the CSS diameter because the SVG fills its box.
const STROKE_WIDTHS: Record<ProgressIndicatorSize, number> = {
  xs: 4.0,
  sm: 3.5,
  md: 3.0,
  lg: 2.8,
  xl: 2.5,
};

// ── Static class maps (hoisted — never recreated on re-render) ──────────────

const sizeClasses: Record<ProgressIndicatorSize, string> = {
  xs: 'w-[var(--progress-indicator-size-xs)] h-[var(--progress-indicator-size-xs)]',
  sm: 'w-[var(--progress-indicator-size-sm)] h-[var(--progress-indicator-size-sm)]',
  md: 'w-[var(--progress-indicator-size-md)] h-[var(--progress-indicator-size-md)]',
  lg: 'w-[var(--progress-indicator-size-lg)] h-[var(--progress-indicator-size-lg)]',
  xl: 'w-[var(--progress-indicator-size-xl)] h-[var(--progress-indicator-size-xl)]',
};

// Typography classes for the center value — only used on md, lg, xl.
const labelTextClasses: Record<ProgressIndicatorSize, string> = {
  xs: '',
  sm: '',
  md: 'text-label-xs',
  lg: 'text-label-sm',
  xl: 'text-label-md',
};

const variantFillClasses: Record<ProgressIndicatorVariant, string> = {
  default: 'stroke-[var(--progress-indicator-fill-default)]',
  success: 'stroke-[var(--progress-indicator-fill-success)]',
  warning: 'stroke-[var(--progress-indicator-fill-warning)]',
  error:   'stroke-[var(--progress-indicator-fill-error)]',
};

// ── Component ─────────────────────────────────────────────────────────────────

export const ProgressIndicator = memo(forwardRef<HTMLDivElement, ProgressIndicatorProps>(
  (
    {
      value,
      max = 100,
      variant = 'default',
      size = 'md',
      showValue = false,
      label,
      disabled = false,
      className,
      ...rest
    },
    ref,
  ) => {
    // ── Value derivation ────────────────────────────────────────────────────
    const isIndeterminate = value === undefined || value === null;
    const safeValue  = isIndeterminate ? 0 : Math.min(max, Math.max(0, value));
    const percentage = isIndeterminate ? 0 : (safeValue / max) * 100;
    const percentageRounded = Math.round(percentage);
    const valueText  = isIndeterminate ? undefined : `${percentageRounded}%`;

    // ── SVG stroke dash geometry ────────────────────────────────────────────
    // Indeterminate: show 25% visible arc + rotate the whole SVG.
    // Determinate:   arc length proportional to percentage.
    const dashOffset  = isIndeterminate
      ? CIRCUMFERENCE * 0.75
      : CIRCUMFERENCE * (1 - percentage / 100);
    const strokeWidth = STROKE_WIDTHS[size];

    // ── Center value label ──────────────────────────────────────────────────
    // Shown on md/lg/xl, determinate state, showValue=true.
    const canShowCenter = size === 'md' || size === 'lg' || size === 'xl';
    const showCenter    = showValue && !isIndeterminate && canShowCenter;

    // ── Class derivation ────────────────────────────────────────────────────
    const containerClasses = useMemo(
      () =>
        [
          'relative inline-flex items-center justify-center flex-shrink-0',
          sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [size, className],
    );

    // The SVG is rotated −90° for determinate (arc starts at 12 o'clock).
    // In indeterminate + enabled mode, the spin animation takes over all rotation.
    const svgClasses = useMemo(
      () =>
        [
          'w-full h-full origin-center',
          isIndeterminate && !disabled ? 'progress-indicator-spin' : '-rotate-90',
        ]
          .filter(Boolean)
          .join(' '),
      [isIndeterminate, disabled],
    );

    const fillClasses = useMemo(
      () =>
        [
          'transition-default',
          disabled
            ? 'stroke-[var(--progress-indicator-fill-disabled)]'
            : variantFillClasses[variant],
        ]
          .filter(Boolean)
          .join(' '),
      [disabled, variant],
    );

    const trackClass = disabled
      ? 'stroke-[var(--progress-indicator-track-disabled)]'
      : 'stroke-[var(--progress-indicator-track-color)]';

    const labelClasses = useMemo(
      () =>
        [
          'absolute inset-0 flex items-center justify-center content-nowrap',
          labelTextClasses[size],
          disabled
            ? 'text-[var(--progress-indicator-label-color-disabled)]'
            : 'text-[var(--progress-indicator-label-color)]',
        ]
          .filter(Boolean)
          .join(' '),
      [size, disabled],
    );

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : percentageRounded}
        aria-valuemin={0}
        aria-valuemax={isIndeterminate ? undefined : 100}
        aria-valuetext={valueText}
        aria-label={label}
        aria-busy={isIndeterminate || undefined}
        aria-disabled={disabled || undefined}
        className={containerClasses}
        {...rest}
      >
        {/*
         * aria-hidden prevents screen readers from narrating the SVG internals.
         * focusable="false" prevents IE/Edge from making the SVG keyboard-reachable.
         * The outer div carries all ARIA state (progressbar role, aria-valuenow, etc.).
         */}
        <svg
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          className={svgClasses}
          aria-hidden="true"
          focusable="false"
        >
          {/* Background track ring */}
          <circle
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            strokeWidth={strokeWidth}
            className={trackClass}
          />
          {/* Progress fill arc */}
          <circle
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className={fillClasses}
          />
        </svg>

        {/* Center percentage — md/lg/xl + determinate + showValue only */}
        {showCenter && (
          <span className={labelClasses} aria-hidden="true">
            {valueText}
          </span>
        )}
      </div>
    );
  },
));

ProgressIndicator.displayName = 'ProgressIndicator';
