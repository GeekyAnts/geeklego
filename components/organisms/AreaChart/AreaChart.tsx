"use client"
import { forwardRef, memo, useCallback, useId, useMemo, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import { Button } from '../../atoms/Button/Button';
import { Select } from '../../atoms/Select/Select';
import { Divider } from '../../atoms/Divider/Divider';
import { Skeleton } from '../../atoms/Skeleton/Skeleton';
import type { AreaChartCurveType, AreaChartDataPoint, AreaChartProps, AreaChartSeries } from './AreaChart.types';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import { getLoadingProps } from '../../utils/accessibility/aria-helpers';

/* ═══════════════════════════════════════════════════════════════════════════
   SVG coordinate system — structural constants, not CSS values.
   The SVG scales responsively via width="100%" preserveAspectRatio.
   ═══════════════════════════════════════════════════════════════════════════ */

const VW = 600;
const VH = 280;
const PAD = { top: 16, right: 16, bottom: 28, left: 48 };
const PL = PAD.left;
const PR = VW - PAD.right;
const PT = PAD.top;
const PB = VH - PAD.bottom;
const PW = PR - PL;
const PH = PB - PT;

const GRID_TICKS = 5;

/** Series CSS variable references for SVG fills/strokes */
const SERIES_VARS = [
  'var(--areachart-series-1)',
  'var(--areachart-series-2)',
  'var(--areachart-series-3)',
  'var(--areachart-series-4)',
  'var(--areachart-series-5)',
  'var(--areachart-series-6)',
  'var(--areachart-series-7)',
];

/** Series Tailwind bg classes for the legend swatches */
const SERIES_BG = [
  'bg-[var(--areachart-series-1)]',
  'bg-[var(--areachart-series-2)]',
  'bg-[var(--areachart-series-3)]',
  'bg-[var(--areachart-series-4)]',
  'bg-[var(--areachart-series-5)]',
  'bg-[var(--areachart-series-6)]',
  'bg-[var(--areachart-series-7)]',
];

/* ═══════════════════════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════════════════════ */

function defaultFormat(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return String(v);
}

/** Compute nice Y-axis ticks from 0 to a rounded max */
function niceScale(maxVal: number, count: number): { max: number; ticks: number[] } {
  if (maxVal <= 0) return { max: 1, ticks: [0, 1] };
  const rough = maxVal / (count - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const r = rough / mag;
  const step = r <= 1.5 ? mag : r <= 3 ? 2 * mag : r <= 7 ? 5 * mag : 10 * mag;
  const nMax = Math.ceil(maxVal / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= nMax; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
  return { max: nMax, ticks };
}

/** Build an SVG line-only path (no area closure) */
function buildLinePath(pts: { x: number; y: number }[], curve: AreaChartCurveType): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M${pts[0].x},${pts[0].y}`;
  if (curve === 'linear') return `M${pts.map((p) => `${p.x},${p.y}`).join('L')}`;
  return monotoneCubic(pts);
}

/** Catmull-Rom → cubic Bézier conversion for smooth, non-overshooting curves */
function monotoneCubic(pts: { x: number; y: number }[]): string {
  const n = pts.length;
  if (n < 2) return '';
  let d = `M${pts[0].x},${pts[0].y}`;
  const T = 0.3; // tension
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(n - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) * T;
    const cp1y = p1.y + (p2.y - p0.y) * T;
    const cp2x = p2.x - (p3.x - p1.x) * T;
    const cp2y = p2.y - (p3.y - p1.y) * T;
    d += `C${cp1x},${cp1y},${cp2x},${cp2y},${p2.x},${p2.y}`;
  }
  return d;
}

/** Close a line path into an area by tracing a baseline back */
function closeArea(
  linePath: string,
  topPts: { x: number; y: number }[],
  bottomPts: { x: number; y: number }[] | null,
  curve: AreaChartCurveType,
): string {
  if (topPts.length === 0) return '';
  if (!bottomPts) {
    // baseline is PB (bottom of plot)
    const first = topPts[0];
    const last = topPts[topPts.length - 1];
    return `${linePath}L${last.x},${PB}L${first.x},${PB}Z`;
  }
  // For stacked: trace the bottom line in reverse
  const reversed = [...bottomPts].reverse();
  const bottomPath = buildLinePath(reversed, curve);
  const last = topPts[topPts.length - 1];
  const revFirst = reversed[0];
  return `${linePath}L${last.x},${revFirst.y}${bottomPath.replace('M', 'L')}Z`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Compute chart geometry
   ═══════════════════════════════════════════════════════════════════════════ */

interface PlotSeries {
  points: { x: number; y: number }[];
  basePts: { x: number; y: number }[] | null;
  linePath: string;
  areaPath: string;
}

function computePlot(
  data: AreaChartDataPoint[],
  series: AreaChartSeries[],
  stacked: boolean,
  curve: AreaChartCurveType,
): { plotSeries: PlotSeries[]; scale: ReturnType<typeof niceScale> } {
  const n = data.length;
  if (n === 0 || series.length === 0) return { plotSeries: [], scale: { max: 1, ticks: [0, 1] } };

  // Resolve numeric values per data-point per series
  const raw = data.map((dp) => series.map((s) => Number(dp[s.dataKey]) || 0));

  // Compute cumulative stacks for max calculation
  let maxVal = 0;
  const cumulative = raw.map((row) => {
    let cum = 0;
    return row.map((v) => {
      if (stacked) {
        cum += v;
        return cum;
      }
      return v;
    });
  });
  cumulative.forEach((row) => row.forEach((v) => { if (v > maxVal) maxVal = v; }));

  const scale = niceScale(maxVal, GRID_TICKS);

  // Map to SVG coordinates
  const xStep = n > 1 ? PW / (n - 1) : 0;
  const toX = (i: number) => PL + i * xStep;
  const toY = (v: number) => PB - (v / scale.max) * PH;

  const plotSeries: PlotSeries[] = series.map((_, si) => {
    const points = data.map((_, di) => ({ x: toX(di), y: toY(cumulative[di][si]) }));

    let basePts: { x: number; y: number }[] | null = null;
    if (stacked && si > 0) {
      basePts = data.map((_, di) => ({ x: toX(di), y: toY(cumulative[di][si - 1]) }));
    }

    const linePath = buildLinePath(points, curve);
    const areaPath = closeArea(linePath, points, basePts, curve);

    return { points, basePts, linePath, areaPath };
  });

  return { plotSeries, scale };
}

/* ═══════════════════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════════════════ */

export const AreaChart = memo(forwardRef<HTMLDivElement, AreaChartProps>(
  (
    {
      title,
      infoLabel,
      metric,
      delta,
      deltaLabel: deltaLabelProp,
      dateStart,
      dateEnd,
      data = [],
      series = [],
      stacked = false,
      chartType = 'area',
      curveType = 'monotone',
      showGrid = true,
      showXAxis = true,
      showYAxis = true,
      period = 'weekly',
      periods = ['Daily', 'Weekly', 'Monthly', 'Yearly'],
      onPeriodChange,
      description,
      formatValue: formatValueProp,
      loading = false,
      fillContainer = false,
      className,
      i18nStrings,
      ...rest
    },
    ref,
  ) => {
    const i18n = useComponentI18n('areaChart', i18nStrings);
    // Explicit prop wins over i18n default; formatter falls back to built-in defaultFormat
    const deltaLabel = deltaLabelProp ?? i18n.deltaLabel;
    const formatValue = formatValueProp ?? i18n.formatters.formatNumber ?? defaultFormat;

    const gradientId = useId();
    const isDeltaPositive = delta !== undefined && delta > 0;
    const isDeltaNegative = delta !== undefined && delta < 0;

    const periodOptions = useMemo(
      () => periods.map((p) => ({ value: p.toLowerCase(), label: p })),
      [periods],
    );

    // ── Hover state ──────────────────────────────────────────────────────────
    const svgRef = useRef<SVGSVGElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const { plotSeries, scale } = useMemo(
      () => computePlot(data, series, stacked, curveType),
      [data, series, stacked, curveType],
    );

    const xStep = chartType === 'bar'
      ? PW / (data.length || 1)
      : (data.length > 1 ? PW / (data.length - 1) : 0);
    const toX = useCallback(
      (i: number) => chartType === 'bar' ? PL + xStep * i + xStep / 2 : PL + i * xStep,
      [xStep, chartType],
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = svgRef.current;
        if (!svg || data.length === 0) return;
        const rect = svg.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * VW;
        if (chartType === 'bar') {
          const groupW = PW / data.length;
          setHoveredIndex(Math.max(0, Math.min(data.length - 1, Math.floor((mouseX - PL) / groupW))));
        } else {
          let nearest = 0;
          let minDist = Infinity;
          for (let i = 0; i < data.length; i++) {
            const d = Math.abs(mouseX - (PL + i * xStep));
            if (d < minDist) { minDist = d; nearest = i; }
          }
          setHoveredIndex(nearest);
        }
      },
      [data.length, xStep, chartType],
    );

    const handleMouseLeave = useCallback(() => setHoveredIndex(null), []);

    // ── Tooltip data ─────────────────────────────────────────────────────────
    const tooltipData = useMemo(() => {
      if (hoveredIndex === null || data.length === 0) return null;
      const dp = data[hoveredIndex];
      return {
        label: dp.label,
        values: series.map((s) => ({
          name: s.name,
          value: Number(dp[s.dataKey]) || 0,
        })),
      };
    }, [hoveredIndex, data, series]);

    // ── Tooltip position (% of container width) ──────────────────────────────
    const tooltipLeft = hoveredIndex !== null ? ((toX(hoveredIndex) / VW) * 100) : 0;
    const tooltipFlip = tooltipLeft > 65;

    return (
      <div
        ref={ref}
        style={{ '--card-shell-min-width': 'var(--areachart-min-width)' } as React.CSSProperties}
        className={[
          'card-shell',
          'flex flex-col gap-[var(--areachart-section-gap)]',
          'rounded-[var(--areachart-radius)]',
          'border border-[var(--areachart-border)]',
          'bg-[var(--areachart-bg)]',
          'p-[var(--areachart-padding)]',
          'shadow-[var(--areachart-shadow)]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...getLoadingProps(loading)}
        {...rest}
      >
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="card-header-row">
          <div className="card-header-title">
            <h3 className="text-heading-h4 text-[var(--areachart-title-color)] truncate-label">{title}</h3>

            {infoLabel && (
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={<Info />}
                title={infoLabel}
                className="text-[var(--areachart-icon-color)] hover:text-[var(--areachart-icon-color-hover)]"
              >
                {infoLabel}
              </Button>
            )}
          </div>

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

        {/* ── Metric + delta ───────────────────────────────────────────────── */}
        {metric !== undefined && (
          <div className="card-metric-row">
            <span className="text-display-md text-[var(--areachart-metric-color)]">{metric}</span>

            {delta !== undefined && (
              <div className="flex items-center gap-[var(--spacing-component-xs)]">
                <span
                  className={[
                    'text-body-sm-semibold',
                    isDeltaPositive && 'text-[var(--areachart-delta-positive-color)]',
                    isDeltaNegative && 'text-[var(--areachart-delta-negative-color)]',
                    !isDeltaPositive && !isDeltaNegative && 'text-[var(--areachart-delta-context-color)]',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {isDeltaPositive ? '+' : ''}
                  {delta}%
                </span>
                {deltaLabel && (
                  <span className="text-body-sm text-[var(--areachart-delta-context-color)] truncate-label">
                    {deltaLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Date range ───────────────────────────────────────────────────── */}
        {(dateStart || dateEnd) && (
          <div className="flex items-center justify-between">
            {dateStart && (
              <span className="text-body-sm text-[var(--areachart-date-color)]">{dateStart}</span>
            )}
            {dateEnd && dateEnd !== dateStart && (
              <span className="text-body-sm text-[var(--areachart-date-color)]">{dateEnd}</span>
            )}
          </div>
        )}

        {/* ── Legend ────────────────────────────────────────────────────────── */}
        {series.length > 0 && (
          <div
            className="flex flex-wrap gap-x-[var(--spacing-component-lg)] gap-y-[var(--spacing-component-xs)]"
            aria-label={i18n.legendLabel}
          >
            {series.map((s, i) => (
              <div key={s.dataKey} className="flex items-center gap-[var(--spacing-component-xs)]">
                <span
                  className={[
                    SERIES_BG[i % SERIES_BG.length],
                    'w-[var(--size-icon-xs)] h-[var(--size-icon-xs)] rounded-[var(--radius-component-sm)] shrink-0',
                  ].join(' ')}
                  aria-hidden="true"
                />
                <span className="text-body-sm text-[var(--areachart-date-color)] content-nowrap">
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Chart SVG / Loading ──────────────────────────────────────────── */}
        {loading ? (
          <Skeleton
            variant="box"
            height="var(--areachart-loading-height)"
            aria-label="Loading chart data"
          />
        ) : data.length > 0 && series.length > 0 ? (
          <div className={fillContainer ? 'relative w-full flex-1 min-h-0' : 'relative w-full'}>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${VW} ${VH}`}
              width="100%"
              height={fillContainer ? '100%' : undefined}
              preserveAspectRatio={fillContainer ? 'none' : 'xMidYMid meet'}
              role="img"
              aria-label={i18n.chartLabel?.(title)}
              className="overflow-visible"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* ── Gradient definitions ──────────────────────────────────── */}
              <defs>
                {series.map((_, i) => (
                  <linearGradient
                    key={i}
                    id={`${gradientId}-g${i}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    {/* data-driven — inline style intentional (SVG stop-color) */}
                    <stop
                      offset="0%"
                      style={{ stopColor: SERIES_VARS[i % SERIES_VARS.length] }}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: SERIES_VARS[i % SERIES_VARS.length] }}
                      stopOpacity={0.03}
                    />
                  </linearGradient>
                ))}
              </defs>

              {/* ── Grid lines ────────────────────────────────────────────── */}
              {showGrid &&
                scale.ticks.map((tick) => {
                  const y = PB - (tick / scale.max) * PH;
                  return (
                    <line
                      key={tick}
                      x1={PL}
                      y1={y}
                      x2={PR}
                      y2={y}
                      stroke="var(--areachart-grid-color)"
                      strokeWidth={1}
                      strokeDasharray={tick === 0 ? 'none' : '4 4'}
                    />
                  );
                })}

              {/* ── Y-axis labels ─────────────────────────────────────────── */}
              {showYAxis &&
                scale.ticks.map((tick) => {
                  const y = PB - (tick / scale.max) * PH;
                  return (
                    <text
                      key={tick}
                      x={PL - 8}
                      y={y + 4}
                      textAnchor="end"
                      fill="var(--areachart-axis-label-color)"
                      fontSize={11}
                      fontFamily="var(--font-family-sans)"
                    >
                      {formatValue(tick)}
                    </text>
                  );
                })}

              {/* ── X-axis labels ─────────────────────────────────────────── */}
              {showXAxis &&
                data.map((dp, i) => {
                  // Show a reasonable number of labels to avoid overlap
                  const maxLabels = 8;
                  const step = Math.max(1, Math.ceil(data.length / maxLabels));
                  if (i % step !== 0 && i !== data.length - 1) return null;
                  return (
                    <text
                      key={i}
                      x={toX(i)}
                      y={PB + 18}
                      textAnchor="middle"
                      fill="var(--areachart-axis-label-color)"
                      fontSize={11}
                      fontFamily="var(--font-family-sans)"
                    >
                      {dp.label}
                    </text>
                  );
                })}

              {/* ── Area fills + lines OR Bar columns ────────────────────── */}
              {chartType === 'bar' ? (() => {
                const n = data.length;
                const groupW = PW / n;
                const numS = series.length;
                const totalSlotW = groupW * 0.65;
                const barW = totalSlotW / numS - (numS > 1 ? 2 : 0);
                const barGap = 2;
                return data.flatMap((dp, di) => {
                  const groupCenter = PL + groupW * di + groupW / 2;
                  const startX = groupCenter - totalSlotW / 2;
                  return series.map((s, si) => {
                    const val = Number(dp[s.dataKey]) || 0;
                    const barH = (val / scale.max) * PH;
                    if (barH <= 0) return null;
                    const bx = startX + si * (barW + barGap);
                    const by = PB - barH;
                    const r = Math.min(4, barW / 2);
                    const d = `M ${bx + r},${by} L ${bx + barW - r},${by} A ${r},${r} 0 0 1 ${bx + barW},${by + r} L ${bx + barW},${PB} L ${bx},${PB} L ${bx},${by + r} A ${r},${r} 0 0 1 ${bx + r},${by} Z`;
                    return (
                      <path
                        key={`bar-${di}-${si}`}
                        d={d}
                        fill={SERIES_VARS[si % SERIES_VARS.length]}
                        opacity={hoveredIndex !== null && hoveredIndex !== di ? 0.4 : 1}
                        className="transition-default"
                      />
                    );
                  });
                });
              })() : (
                <>
                  {plotSeries.map((ps, i) => (
                    <path
                      key={`area-${i}`}
                      d={ps.areaPath}
                      fill={`url(#${gradientId}-g${i})`}
                      className="transition-default"
                    />
                  ))}
                  {plotSeries.map((ps, i) => (
                    <path
                      key={`line-${i}`}
                      d={ps.linePath}
                      fill="none"
                      stroke={SERIES_VARS[i % SERIES_VARS.length]}
                      strokeWidth={2}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className="transition-default"
                    />
                  ))}
                </>
              )}

              {/* ── Crosshair + dots on hover ─────────────────────────────── */}
              {hoveredIndex !== null && (
                <>
                  <line
                    x1={toX(hoveredIndex)}
                    y1={PT}
                    x2={toX(hoveredIndex)}
                    y2={PB}
                    stroke="var(--areachart-crosshair-color)"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                  {chartType === 'area' && plotSeries.map((ps, i) => (
                    <circle
                      key={`dot-${i}`}
                      cx={ps.points[hoveredIndex].x}
                      cy={ps.points[hoveredIndex].y}
                      r={4}
                      fill={SERIES_VARS[i % SERIES_VARS.length]}
                      stroke="var(--areachart-bg)"
                      strokeWidth={2}
                    />
                  ))}
                </>
              )}
            </svg>

            {/* ── Tooltip (HTML overlay) ──────────────────────────────────── */}
            {hoveredIndex !== null && tooltipData && (
              // data-driven — inline style intentional (dynamic left position)
              <div
                role="tooltip"
                style={{ left: `${tooltipLeft}%` }}
                className={[
                  'absolute top-0',
                  tooltipFlip ? '-translate-x-full -ml-3' : 'ml-3',
                  'pointer-events-none',
                  'px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)]',
                  'rounded-[var(--areachart-tooltip-radius)]',
                  'bg-[var(--areachart-tooltip-bg)]',
                  'shadow-[var(--areachart-tooltip-shadow)]',
                  'border border-[var(--areachart-tooltip-border)]',
                  'text-[var(--areachart-tooltip-text)]',
                  'whitespace-nowrap',
                  'z-[var(--layer-popover)]',
                ].join(' ')}
              >
                <div className="text-body-sm-semibold mb-[var(--spacing-component-xs)]">
                  {tooltipData.label}
                </div>
                {tooltipData.values.map((v, i) => (
                  <div
                    key={v.name}
                    className="flex items-center gap-[var(--spacing-component-sm)] text-body-sm"
                  >
                    <span
                      className={[
                        SERIES_BG[i % SERIES_BG.length],
                        'w-2 h-2 rounded-[var(--radius-component-full)] shrink-0',
                      ].join(' ')}
                      aria-hidden="true"
                    />
                    <span className="text-[var(--areachart-date-color)]">{v.name}</span>
                    <span className="text-body-sm-bold text-[var(--areachart-tooltip-text)]">
                      {formatValue(v.value)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Visually hidden data table — screen reader alternative */}
            <table className="sr-only">
              <caption>{i18n.tableCaption?.(title)}</caption>
              <thead>
                <tr>
                  <th scope="col">{i18n.columnPeriod}</th>
                  {series.map((s) => (
                    <th key={s.dataKey} scope="col">{s.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((dp) => (
                  <tr key={dp.label}>
                    <td>{dp.label}</td>
                    {series.map((s) => (
                      <td key={s.dataKey}>{Number(dp[s.dataKey]) || 0}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* ── Empty state ─────────────────────────────────────────────────── */
          <div className="flex items-center justify-center py-[var(--spacing-layout-lg)]">
            <span className="text-body-md text-[var(--areachart-date-color)]">{i18n.emptyState}</span>
          </div>
        )}

        {/* ── Divider + description ──────────────────────────────────────── */}
        {description && (
          <>
            <Divider />
            <p className="text-body-sm text-[var(--areachart-description-color)]">{description}</p>
          </>
        )}
      </div>
    );
  },
));
AreaChart.displayName = 'AreaChart';
