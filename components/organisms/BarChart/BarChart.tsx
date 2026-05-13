"use client"
import { forwardRef, memo, useState, useRef, useCallback, useMemo } from 'react';
import { Info } from 'lucide-react';
import { Button } from '../../atoms/Button/Button';
import { Select } from '../../atoms/Select/Select';
import { Divider } from '../../atoms/Divider/Divider';
import { Skeleton } from '../../atoms/Skeleton/Skeleton';
import type { BarChartProps } from './BarChart.types';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import { getLoadingProps } from '../../utils/accessibility/aria-helpers';

/**
 * Series background classes — each maps to a --barchart-series-N token.
 * Color assignment follows insertion order in the `series` prop array.
 */
const SERIES_BG_CLASSES = [
  'bg-[var(--barchart-series-1)]',
  'bg-[var(--barchart-series-2)]',
  'bg-[var(--barchart-series-3)]',
  'bg-[var(--barchart-series-4)]',
  'bg-[var(--barchart-series-5)]',
  'bg-[var(--barchart-series-6)]',
  'bg-[var(--barchart-series-7)]',
];

export const BarChart = memo(forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      title,
      infoLabel,
      metric,
      delta,
      deltaLabel: deltaLabelProp,
      dateStart,
      dateEnd,
      series = [],
      period = 'weekly',
      periods = ['Daily', 'Weekly', 'Monthly', 'Yearly'],
      onPeriodChange,
      description,
      loading = false,
      className,
      i18nStrings,
      ...rest
    },
    ref,
  ) => {
    const i18n = useComponentI18n('barChart', i18nStrings);
    // deltaLabelProp (explicit) wins over i18n default
    const deltaLabel = deltaLabelProp ?? i18n.deltaLabel;

    const total = useMemo(() => series.reduce((sum, s) => sum + s.value, 0), [series]);
    const isDeltaPositive = delta !== undefined && delta > 0;
    const isDeltaNegative = delta !== undefined && delta < 0;

    const periodOptions = useMemo(
      () => periods.map((p) => ({ value: p.toLowerCase(), label: p })),
      [periods],
    );

    // Tooltip state
    const [tooltip, setTooltip] = useState<{ index: number; x: number } | null>(null);
    const barsRef = useRef<HTMLDivElement>(null);

    const handleBarMouseEnter = useCallback(
      (index: number, e: React.MouseEvent<HTMLDivElement>) => {
        const container = barsRef.current;
        if (!container) return;
        const containerRect = container.getBoundingClientRect();
        const barRect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = barRect.left - containerRect.left + barRect.width / 2;
        setTooltip({ index, x });
      },
      [],
    );

    const handleBarMouseLeave = useCallback(() => setTooltip(null), []);

    return (
      <div
        ref={ref}
        style={{ '--card-shell-min-width': 'var(--barchart-min-width)' } as React.CSSProperties}
        className={[
          'card-shell',
          'flex flex-col gap-[var(--barchart-section-gap)]',
          'rounded-[var(--barchart-radius)]',
          'border border-[var(--barchart-border)]',
          'bg-[var(--barchart-bg)]',
          'p-[var(--barchart-padding)]',
          'shadow-[var(--barchart-shadow)]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...getLoadingProps(loading)}
        {...rest}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="card-header-row">
          <div className="card-header-title">
            <h3 className="text-heading-h4 text-[var(--barchart-title-color)] truncate-label">{title}</h3>

            {infoLabel && (
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={<Info />}
                title={infoLabel}
                className="text-[var(--barchart-icon-color)] hover:text-[var(--barchart-icon-color-hover)]"
              >
                {infoLabel}
              </Button>
            )}
          </div>

          {/* Period selector — Select atom (L1) */}
          {periodOptions.length > 0 && (
            <Select
              options={periodOptions}
              value={period}
              onChange={onPeriodChange}
              variant="default"
              size="sm"
              aria-label={i18n.periodSelectorLabel}
              className="flex-shrink-0 w-[8rem]"
            />
          )}
        </div>

        {/* ── Metric + delta ──────────────────────────────────────────────── */}
        {metric !== undefined && (
          <div className="card-metric-row">
            <span className="text-display-md text-[var(--barchart-metric-color)]">{metric}</span>

            {delta !== undefined && (
              <div className="flex items-center gap-[var(--spacing-component-xs)]">
                <span
                  className={[
                    'text-body-sm-semibold',
                    isDeltaPositive && 'text-[var(--barchart-delta-positive-color)]',
                    isDeltaNegative && 'text-[var(--barchart-delta-negative-color)]',
                    !isDeltaPositive &&
                      !isDeltaNegative &&
                      'text-[var(--barchart-delta-context-color)]',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {isDeltaPositive ? '+' : ''}
                  {delta}%
                </span>
                {deltaLabel && (
                  <span className="text-body-sm text-[var(--barchart-delta-context-color)] truncate-label">
                    {deltaLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Date range ──────────────────────────────────────────────────── */}
        {(dateStart || dateEnd) && (
          <div className="flex items-center justify-between">
            {dateStart && (
              <span className="text-body-sm text-[var(--barchart-date-color)]">{dateStart}</span>
            )}
            {dateEnd && dateEnd !== dateStart && (
              <span className="text-body-sm text-[var(--barchart-date-color)]">{dateEnd}</span>
            )}
          </div>
        )}

        {/* ── Chart area / Loading ─────────────────────────────────────────── */}
        {loading ? (
          <Skeleton
            variant="box"
            height="var(--barchart-loading-height)"
            aria-label="Loading chart data"
          />
        ) : (
          <>
        {/* ── Colour legend ────────────────────────────────────────────────── */}
        {series.length > 0 && total > 0 && (
          <div
            className="flex flex-wrap gap-x-[var(--spacing-component-lg)] gap-y-[var(--spacing-component-xs)]"
            aria-label={i18n.legendLabel}
          >
            {series.map((s, i) => {
              const bgClass = SERIES_BG_CLASSES[i % SERIES_BG_CLASSES.length];
              return (
                <div key={s.name} className="flex items-center gap-[var(--spacing-component-xs)]">
                  <span
                    className={`${bgClass} w-[var(--size-icon-xs)] h-[var(--size-icon-xs)] rounded-[var(--radius-component-sm)] shrink-0`}
                    aria-hidden="true"
                  />
                  <span className="text-body-sm text-[var(--barchart-date-color)] content-nowrap">
                    {s.name}
                  </span>
                  <span className="text-body-sm-semibold text-[var(--barchart-metric-color)]">
                    {((s.value / total) * 100).toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Proportional bar segments ────────────────────────────────────── */}
        {series.length > 0 && total > 0 && (
          <div className="relative w-full">
            {/* Tooltip */}
            {tooltip !== null && (
              // data-driven — inline style intentional
              <div
                role="tooltip"
                style={{ left: tooltip.x, bottom: 'calc(var(--barchart-bar-height) + 8px)' }}
                className={[
                  'absolute z-[var(--layer-popover)]',
                  '-translate-x-1/2',
                  'pointer-events-none',
                  'px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)]',
                  'rounded-[var(--barchart-tooltip-radius)]',
                  'bg-[var(--barchart-tooltip-bg)]',
                  'shadow-[var(--barchart-tooltip-shadow)]',
                  'border border-[var(--barchart-tooltip-border)]',
                  'text-body-sm text-[var(--barchart-tooltip-text)]',
                  'whitespace-nowrap',
                ].join(' ')}
              >
                <span className="text-body-sm-medium">{series[tooltip.index].name}</span>
                {' – '}
                <span className="text-body-sm-bold">
                  {((series[tooltip.index].value / total) * 100).toFixed(2)}%
                </span>
              </div>
            )}

            <div
              ref={barsRef}
              className="flex gap-[var(--barchart-bar-gap)] w-full"
              role="img"
              aria-label={i18n.chartLabel?.(title)}
              aria-hidden="true"
            >
              {series.map((s, i) => {
                const bgClass = SERIES_BG_CLASSES[i % SERIES_BG_CLASSES.length];
                return (
                  // data-driven — inline style intentional
                  <div
                    key={s.name}
                    role="presentation"
                    style={{ flexGrow: s.value }}
                    className={[
                      bgClass,
                      'h-[var(--barchart-bar-height)]',
                      'rounded-[var(--barchart-bar-radius)]',
                      'shrink',
                      'transition-default',
                      tooltip?.index === i ? 'opacity-80' : 'opacity-100',
                      'cursor-default',
                    ].join(' ')}
                    onMouseEnter={(e) => handleBarMouseEnter(i, e)}
                    onMouseLeave={handleBarMouseLeave}
                  />
                );
              })}
            </div>

            {/* Visually hidden data table — screen reader alternative to the visual bars */}
            <table className="sr-only">
              <caption>{i18n.tableCaption?.(title)}</caption>
              <thead>
                <tr>
                  <th scope="col">{i18n.columnSegment}</th>
                  <th scope="col">{i18n.columnValue}</th>
                  <th scope="col">{i18n.columnShare}</th>
                </tr>
              </thead>
              <tbody>
                {series.map((s) => (
                  <tr key={s.name}>
                    <td>{s.name}</td>
                    <td>{s.value}</td>
                    <td>{((s.value / total) * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
              {metric !== undefined && (
                <tfoot>
                  <tr>
                    <th scope="row">{i18n.totalLabel}</th>
                    <td>{total}</td>
                    <td>100%</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
          </>
        )}

        {/* ── Divider + description ────────────────────────────────────────── */}
        {description && (
          <>
            <Divider />
            <p className="text-body-sm text-[var(--barchart-description-color)]">{description}</p>
          </>
        )}
      </div>
    );
  },
));
BarChart.displayName = 'BarChart';
