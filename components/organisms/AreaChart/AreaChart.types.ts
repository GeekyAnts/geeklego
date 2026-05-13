import type { HTMLAttributes } from 'react';
import type { AreaChartI18nStrings } from '../../utils/i18n';

export interface AreaChartDataPoint {
  /** X-axis label for this data point */
  label: string;
  /** Dynamic keys matching series dataKey → numeric value */
  [key: string]: string | number;
}

export interface AreaChartSeries {
  /** Display name shown in the legend and tooltip */
  name: string;
  /** Key in each data point object that holds this series' numeric value */
  dataKey: string;
}

export type AreaChartCurveType = 'linear' | 'monotone';

export interface AreaChartProps extends HTMLAttributes<HTMLDivElement> {
  /** Card title displayed in the header */
  title: string;
  /** Accessible label for the info icon button. Omit to hide the icon. */
  infoLabel?: string;
  /** Primary numeric metric displayed prominently below the header. Omit to show chart only. */
  metric?: number | string;
  /** Change percentage (+2.1 = "+2.1%"). Positive → green, negative → red. */
  delta?: number;
  /** Context text shown next to the delta value (e.g. "from last week") */
  deltaLabel?: string;
  /** Start-of-range date label shown left-aligned below the metric */
  dateStart?: string;
  /** End-of-range date label shown right-aligned below the metric */
  dateEnd?: string;
  /** Time-series data points — order determines left-to-right rendering */
  data: AreaChartDataPoint[];
  /** Series definitions — order determines stacking order and color assignment */
  series: AreaChartSeries[];
  /** When true, series areas are stacked on top of each other. Defaults to false. */
  stacked?: boolean;
  /** Curve interpolation method. Defaults to 'monotone'. */
  curveType?: AreaChartCurveType;
  /** Show horizontal grid lines. Defaults to true. */
  showGrid?: boolean;
  /** Show X-axis labels. Defaults to true. */
  showXAxis?: boolean;
  /** Show Y-axis labels. Defaults to true. */
  showYAxis?: boolean;
  /** Currently selected period value (should match one of `periods` lowercased) */
  period?: string;
  /** Available period options shown in the selector dropdown */
  periods?: string[];
  /** Called when the user selects a different period */
  onPeriodChange?: (period: string) => void;
  /** Optional description text rendered below the divider */
  description?: string;
  /** Custom value formatter for Y-axis labels and tooltip values */
  formatValue?: (value: number) => string;
  /** Render mode: 'area' draws filled areas + lines (default); 'bar' draws vertical columns. */
  chartType?: 'area' | 'bar';
  /** When true, replaces the chart area with a shimmer skeleton placeholder. */
  loading?: boolean;
  /** When true, the SVG fills its flex parent vertically instead of using the viewBox aspect ratio. Use in fixed-height containers (e.g. hero showcase grids). */
  fillContainer?: boolean;
  /** Override localised strings for this instance. Context strings apply when omitted. */
  i18nStrings?: AreaChartI18nStrings;
}
