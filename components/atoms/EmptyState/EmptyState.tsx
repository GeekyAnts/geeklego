"use client"
import { forwardRef, memo, useMemo } from 'react';
import type { EmptyStateProps, EmptyStateVariant, EmptyStateSize } from './EmptyState.types';

// ── Static lookup tables ──────────────────────────────────────────────────────

const variantClasses: Record<EmptyStateVariant, string> = {
  default: [
    'bg-[var(--empty-state-default-bg)]',
    'border border-[var(--empty-state-default-border)]',
    'rounded-[var(--empty-state-radius)]',
  ].join(' '),
  ghost: 'bg-[var(--empty-state-ghost-bg)]',
};

const paddingClasses: Record<EmptyStateSize, string> = {
  sm: 'p-[var(--empty-state-padding-sm)]',
  md: 'p-[var(--empty-state-padding-md)]',
  lg: 'p-[var(--empty-state-padding-lg)]',
};

const iconSizeClasses: Record<EmptyStateSize, string> = {
  sm: 'w-[var(--empty-state-icon-size-sm)] h-[var(--empty-state-icon-size-sm)]',
  md: 'w-[var(--empty-state-icon-size-md)] h-[var(--empty-state-icon-size-md)]',
  lg: 'w-[var(--empty-state-icon-size-lg)] h-[var(--empty-state-icon-size-lg)]',
};

const iconGapClasses: Record<EmptyStateSize, string> = {
  sm: 'mb-[var(--empty-state-icon-gap-sm)]',
  md: 'mb-[var(--empty-state-icon-gap-md)]',
  lg: 'mb-[var(--empty-state-icon-gap-lg)]',
};

const contentGapClasses: Record<EmptyStateSize, string> = {
  sm: 'gap-[var(--empty-state-content-gap-sm)]',
  md: 'gap-[var(--empty-state-content-gap-md)]',
  lg: 'gap-[var(--empty-state-content-gap-lg)]',
};

const actionGapClasses: Record<EmptyStateSize, string> = {
  sm: 'mt-[var(--empty-state-action-gap-sm)]',
  md: 'mt-[var(--empty-state-action-gap-md)]',
  lg: 'mt-[var(--empty-state-action-gap-lg)]',
};

const titleClasses: Record<EmptyStateSize, string> = {
  sm: 'text-body-md text-[var(--empty-state-title-color)]',
  md: 'text-heading-h5 text-[var(--empty-state-title-color)]',
  lg: 'text-heading-h4 text-[var(--empty-state-title-color)]',
};

const descClasses: Record<EmptyStateSize, string> = {
  sm: 'text-body-xs text-[var(--empty-state-description-color)]',
  md: 'text-body-sm text-[var(--empty-state-description-color)]',
  lg: 'text-body-md text-[var(--empty-state-description-color)]',
};

// ── Component ─────────────────────────────────────────────────────────────────

export const EmptyState = memo(
  forwardRef<HTMLDivElement, EmptyStateProps>(
    (
      {
        title,
        description,
        icon,
        action,
        variant = 'default',
        size = 'md',
        className,
        ...rest
      },
      ref,
    ) => {
      const outerClasses = useMemo(
        () =>
          [
            'flex flex-col items-center justify-center text-center',
            variantClasses[variant],
            paddingClasses[size],
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [variant, size, className],
      );

      return (
        <div ref={ref} className={outerClasses} {...rest}>
          {/* Icon / illustration — decorative, hidden from AT */}
          {icon && (
            <div
              aria-hidden="true"
              className={[
                'flex items-center justify-center flex-shrink-0',
                'text-[var(--empty-state-icon-color)]',
                iconSizeClasses[size],
                iconGapClasses[size],
              ].join(' ')}
            >
              {icon}
            </div>
          )}

          {/* Text block */}
          <div className={['flex flex-col items-center', contentGapClasses[size]].join(' ')}>
            <p className={[titleClasses[size], 'truncate-label max-w-full'].join(' ')}>
              {title}
            </p>
            {description && (
              <p className={[descClasses[size], 'clamp-description max-w-prose'].join(' ')}>
                {description}
              </p>
            )}
          </div>

          {/* Action CTA slot */}
          {action && (
            <div className={actionGapClasses[size]}>
              {action}
            </div>
          )}
        </div>
      );
    },
  ),
);

EmptyState.displayName = 'EmptyState';
