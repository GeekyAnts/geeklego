"use client"
import { forwardRef, memo, useMemo } from 'react';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type { SkeletonProps, SkeletonTextSize, SkeletonCircleSize } from './Skeleton.types';

// ── Static class maps (hoisted — never recreated per render) ──────────────────

const textSizeClasses: Record<SkeletonTextSize, string> = {
  sm: 'h-[var(--skeleton-height-text-sm)]',
  md: 'h-[var(--skeleton-height-text-md)]',
  lg: 'h-[var(--skeleton-height-text-lg)]',
};

const circleSizeClasses: Record<SkeletonCircleSize, string> = {
  xs:    'w-[var(--skeleton-circle-xs)]  h-[var(--skeleton-circle-xs)]',
  sm:    'w-[var(--skeleton-circle-sm)]  h-[var(--skeleton-circle-sm)]',
  md:    'w-[var(--skeleton-circle-md)]  h-[var(--skeleton-circle-md)]',
  lg:    'w-[var(--skeleton-circle-lg)]  h-[var(--skeleton-circle-lg)]',
  xl:    'w-[var(--skeleton-circle-xl)]  h-[var(--skeleton-circle-xl)]',
  '2xl': 'w-[var(--skeleton-circle-2xl)] h-[var(--skeleton-circle-2xl)]',
};

const BASE_LINE   = 'rounded-[var(--skeleton-radius-text)] w-full';
const LAST_LINE   = 'rounded-[var(--skeleton-radius-text)] w-[var(--skeleton-last-line-width)]';
const BOX_BASE    = 'rounded-[var(--skeleton-radius-box)] w-full min-h-[var(--skeleton-box-min-height)]';
const CIRCLE_BASE = 'rounded-[var(--skeleton-radius-circle)] shrink-0';

// ── Component ─────────────────────────────────────────────────────────────────

export const Skeleton = memo(forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      size = 'md',
      circleSize = 'md',
      lines = 1,
      width,
      height,
      animated = true,
      className,
      'aria-label': ariaLabel,
      i18nStrings,
      style,
      ...rest
    },
    ref,
  ) => {
    const i18n = useComponentI18n('skeleton', i18nStrings);
    const shimmerClass = animated ? 'skeleton' : 'bg-[var(--color-state-loading)]';
    const isMultiLine  = variant === 'text' && lines > 1;

    // Merge explicit dimension overrides into inline style only when provided
    const inlineStyle = useMemo(
      () => (width || height) ? { ...style, ...(width ? { width } : {}), ...(height ? { height } : {}) } : style,
      [width, height, style],
    );

    // Compute the className for all single-element variants + multi-line wrapper
    const classes = useMemo(() => {
      if (variant === 'circle') {
        return [shimmerClass, CIRCLE_BASE, circleSizeClasses[circleSize], className].filter(Boolean).join(' ');
      }
      if (variant === 'box') {
        return [shimmerClass, BOX_BASE, className].filter(Boolean).join(' ');
      }
      if (!isMultiLine) {
        return [shimmerClass, BASE_LINE, textSizeClasses[size], className].filter(Boolean).join(' ');
      }
      // Multi-line wrapper — shimmer is applied to each child line, not here
      return ['flex flex-col gap-[var(--skeleton-gap)]', className].filter(Boolean).join(' ');
    }, [variant, shimmerClass, circleSize, size, isMultiLine, className]);

    const sharedProps = {
      ref,
      role: 'status' as const,
      'aria-label': ariaLabel ?? i18n.ariaLabel,
      'aria-busy': true as const,
      style: inlineStyle,
      ...rest,
    };

    // Multi-line text — wrapper holds the lines, each line gets the shimmer class
    if (isMultiLine) {
      const lineHeight = textSizeClasses[size];
      return (
        <div className={classes} {...sharedProps}>
          {Array.from({ length: lines }, (_, i) => (
            <div
              key={`line-${i}`}
              className={[shimmerClass, lineHeight, i === lines - 1 ? LAST_LINE : BASE_LINE].join(' ')}
            />
          ))}
        </div>
      );
    }

    return <div className={classes} {...sharedProps} />;
  },
));

Skeleton.displayName = 'Skeleton';
