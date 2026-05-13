"use client"
import { forwardRef, memo, useMemo } from 'react';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type { SpinnerProps, SpinnerVariant, SpinnerSize } from './Spinner.types';

// SVG diameter per size — maps to icon size scale primitives
const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'w-[var(--size-icon-sm)]  h-[var(--size-icon-sm)]',   // 16px
  sm: 'w-[var(--size-icon-md)]  h-[var(--size-icon-md)]',   // 20px
  md: 'w-[var(--size-icon-lg)]  h-[var(--size-icon-lg)]',   // 24px
  lg: 'w-[var(--size-icon-xl)]  h-[var(--size-icon-xl)]',   // 32px
  xl: 'w-[var(--size-icon-2xl)] h-[var(--size-icon-2xl)]',  // 48px
};

// Variant sets currentColor — SVG inherits via stroke="currentColor"
const variantColorClasses: Record<SpinnerVariant, string> = {
  default: 'text-[var(--spinner-default-color)]',
  inverse: 'text-[var(--spinner-inverse-color)]',
};

// Arc geometry for viewBox="0 0 24 24", r=10
// Circumference ≈ 62.83. Dash = 75% ≈ 47.1, gap = 25% ≈ 15.7.
const ARC_DASH = '47.1 15.7';

export const Spinner = memo(forwardRef<HTMLDivElement, SpinnerProps>(
  ({ variant = 'default', size = 'md', label, i18nStrings, className, ...rest }, ref) => {
    const i18n = useComponentI18n('spinner', i18nStrings);
    const resolvedLabel = i18n.label ?? label ?? 'Loading\u2026';

    const wrapperClasses = useMemo(
      () =>
        [
          'inline-flex items-center justify-center shrink-0',
          variantColorClasses[variant],
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [variant, className],
    );

    const svgClasses = useMemo(
      () => ['animate-spin shrink-0', sizeClasses[size]].join(' '),
      [size],
    );

    return (
      <div ref={ref} role="status" className={wrapperClasses} {...rest}>
        <svg
          className={svgClasses}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Track — full ring at 20% opacity. */}
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            className="opacity-20"
          />
          {/* Arc — 75% of circumference, rounded caps, spins with the SVG */}
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={ARC_DASH}
            strokeLinecap="round"
          />
        </svg>
        {/* Visually hidden label for screen readers */}
        <span className="sr-only">{resolvedLabel}</span>
      </div>
    );
  },
));
Spinner.displayName = 'Spinner';
