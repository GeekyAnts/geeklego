"use client"
import { memo, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { StatCardProps, StatCardVariant, StatCardSize, StatCardTrend } from './StatCard.types';
import { Badge } from '../../atoms/Badge/Badge';
import { Spinner } from '../../atoms/Spinner/Spinner';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';

// ── Variant classes ───────────────────────────────────────────────────────────
// Each variant uses a fundamentally different visual strategy

const variantClasses: Record<StatCardVariant, string> = {
  // Elevated: white card with border — sits on the page
  elevated: [
    'bg-[var(--stat-card-bg)]',
    'border border-[var(--stat-card-border)]',
    'shadow-[var(--stat-card-shadow)]',
  ].join(' '),

  // Outlined: transparent bg, visible border — lightweight presence
  outlined: 'bg-transparent border border-[var(--stat-card-border)]',

  // Filled: solid secondary background — blends into panel surfaces
  filled: 'bg-[var(--color-bg-secondary)] border border-transparent',

  // Ghost: no border, no bg — for use on already-coloured surfaces
  ghost: 'bg-transparent border-0',
};

// ── Size typography maps ──────────────────────────────────────────────────────
const labelTextClasses: Record<StatCardSize, string> = {
  sm: 'text-body-sm',
  md: 'text-body-sm',
  lg: 'text-body-md',
};

const valueTextClasses: Record<StatCardSize, string> = {
  sm: 'text-heading-sm',
  md: 'text-heading-md',
  lg: 'text-heading-lg',
};

// ── Trend → Badge colour ──────────────────────────────────────────────────────
const trendBadgeColor: Record<StatCardTrend, 'success' | 'error' | 'default'> = {
  up:      'success',
  down:    'error',
  neutral: 'default',
};

const TrendIcon = ({ trend, size }: { trend: StatCardTrend; size: string }) => {
  if (trend === 'up')      return <TrendingUp size={size} aria-hidden="true" />;
  if (trend === 'down')    return <TrendingDown size={size} aria-hidden="true" />;
  return <Minus size={size} aria-hidden="true" />;
};

export const StatCard = memo(
  ({
    label,
    value,
    delta,
    deltaLabel,
    trend: trendProp,
    icon,
    variant = 'elevated',
    size = 'md',
    isLoading = false,
    className,
    i18nStrings,
    ...rest
  }: StatCardProps) => {
    const i18n = useComponentI18n('statCard', i18nStrings);

    // Derive trend direction from delta if not explicitly set
    const trend: StatCardTrend = trendProp ?? (
      delta === undefined || delta === 0 ? 'neutral' : delta > 0 ? 'up' : 'down'
    );

    const hasDelta = delta !== undefined;
    const deltaFormatted = hasDelta
      ? `${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`
      : null;

    // SR-only trend prefix for the delta Badge
    const trendSrLabel = trend === 'up'
      ? i18n.trendUpLabel
      : trend === 'down'
        ? i18n.trendDownLabel
        : undefined;

    const cardClasses = useMemo(
      () =>
        [
          'card-shell rounded-[var(--stat-card-radius)] p-[var(--stat-card-padding)]',
          'min-w-[var(--stat-card-min-width)]',
          variantClasses[variant],
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [variant, className],
    );

    // Loading state — same card dimensions, content replaced by spinner
    if (isLoading) {
      return (
        <article className={cardClasses} aria-busy="true" aria-label={label} {...rest}>
          <div className="flex items-center justify-center min-h-[var(--spacing-16)]">
            <Spinner size="md" label={i18n.loadingLabel} />
          </div>
        </article>
      );
    }

    return (
      <article className={cardClasses} {...rest}>
        {/* Header row: label (dt) + optional icon */}
        <div className="card-header-row">
          <dl className="flex-1 min-w-0">
            <div className="card-header-title">
              <dt
                className={[
                  labelTextClasses[size],
                  'text-[var(--stat-card-label-color)] font-medium truncate-label',
                ].join(' ')}
              >
                {label}
              </dt>
            </div>

            {/* Value */}
            <dd
              className={[
                valueTextClasses[size],
                'text-[var(--stat-card-value-color)] font-bold mt-[var(--stat-card-value-mt)] truncate-label',
              ].join(' ')}
            >
              {value}
            </dd>

            {/* Delta row */}
            {hasDelta && (
              <dd className="flex items-center gap-[var(--stat-card-delta-gap)] mt-[var(--stat-card-delta-mt)] flex-wrap">
                <Badge
                  variant="soft"
                  color={trendBadgeColor[trend]}
                  size="sm"
                  shape="pill"
                >
                  {/* SR-only trend label before the visible percentage */}
                  {trendSrLabel && (
                    <span className="sr-only">{trendSrLabel}: </span>
                  )}
                  <TrendIcon trend={trend} size="var(--size-icon-xs)" />
                  {deltaFormatted}
                </Badge>

                {deltaLabel && (
                  <span
                    className={[
                      'text-body-sm text-[var(--stat-card-delta-label-color)] content-nowrap',
                    ].join(' ')}
                  >
                    {deltaLabel}
                  </span>
                )}
              </dd>
            )}
          </dl>

          {/* Optional icon badge — decorative, top-right */}
          {icon && (
            <div
              aria-hidden="true"
              className={[
                'flex shrink-0 items-center justify-center',
                'bg-[var(--stat-card-icon-bg)] rounded-[var(--stat-card-icon-radius)]',
                'p-[var(--stat-card-icon-padding)]',
                'text-[var(--stat-card-icon-color)]',
                'self-start',
              ].join(' ')}
            >
              {icon}
            </div>
          )}
        </div>
      </article>
    );
  },
);
StatCard.displayName = 'StatCard';
