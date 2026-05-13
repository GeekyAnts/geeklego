# AreaChart

**Level:** Organism (L3)
**Dependencies:** `../../atoms/Select/Select`, `../../atoms/Divider/Divider`

## Description

A responsive SVG-based area chart for visualising time-series data. Supports multiple data series (overlay or stacked), smooth monotone or linear curve interpolation, interactive crosshair with tooltip, and the same card shell pattern as BarChart. Fully theme-aware across light and dark modes.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Card title displayed in the header |
| `infoLabel` | `string` | — | Accessible label for the info icon. Omit to hide. |
| `metric` | `number \| string` | — | Primary metric displayed below the header |
| `delta` | `number` | — | Change percentage. Positive — green, negative — red. |
| `deltaLabel` | `string` | `'from last period'` | Context text next to the delta value |
| `dateStart` | `string` | — | Start-of-range date label |
| `dateEnd` | `string` | — | End-of-range date label |
| `data` | `AreaChartDataPoint[]` | `[]` | Time-series data points |
| `series` | `AreaChartSeries[]` | `[]` | Series definitions (name + dataKey) |
| `stacked` | `boolean` | `false` | Stack series on top of each other |
| `curveType` | `'linear' \| 'monotone'` | `'monotone'` | Curve interpolation method |
| `showGrid` | `boolean` | `true` | Show horizontal grid lines |
| `showXAxis` | `boolean` | `true` | Show X-axis labels |
| `showYAxis` | `boolean` | `true` | Show Y-axis labels |
| `period` | `string` | `'weekly'` | Currently selected period |
| `periods` | `string[]` | `['Daily', ...]` | Period options for the selector |
| `onPeriodChange` | `(period: string) => void` | — | Called on period change |
| `description` | `string` | — | Description text below the divider |
| `formatValue` | `(value: number) => string` | auto K/M | Custom Y-axis/tooltip formatter |

## Tokens Used

| Token | Resolves to | Used for |
|---|---|---|
| `--areachart-bg` | `--color-surface-raised` | Card background |
| `--areachart-border` | `--color-border-default` | Card border |
| `--areachart-radius` | `--radius-component-xl` | Card corner radius |
| `--areachart-padding` | `--spacing-layout-xs` | Card padding |
| `--areachart-shadow` | `none` (brand: `--shadow-md`) | Card shadow |
| `--areachart-section-gap` | `--spacing-component-lg` | Gap between card sections |
| `--areachart-title-color` | `--color-text-primary` | Title text |
| `--areachart-icon-color` | `--color-text-tertiary` | Info icon |
| `--areachart-metric-color` | `--color-text-primary` | Metric text |
| `--areachart-delta-positive-color` | `--color-status-success` | Positive delta |
| `--areachart-delta-negative-color` | `--color-status-error` | Negative delta |
| `--areachart-date-color` | `--color-text-tertiary` | Date labels |
| `--areachart-grid-color` | `--color-border-subtle` | Grid lines |
| `--areachart-axis-label-color` | `--color-text-tertiary` | Axis labels |
| `--areachart-series-1–7` | `--color-data-series-1–7` | Series colors |
| `--areachart-crosshair-color` | `--color-border-default` | Hover crosshair |
| `--areachart-tooltip-bg` | `--color-surface-raised` | Tooltip background |
| `--areachart-tooltip-border` | `--color-border-subtle` | Tooltip border |
| `--areachart-tooltip-text` | `--color-text-primary` | Tooltip text |
| `--areachart-tooltip-shadow` | `--shadow-lg` | Tooltip shadow |
| `--areachart-tooltip-radius` | `--radius-component-md` | Tooltip radius |
| `--areachart-description-color` | `--color-text-secondary` | Description text |

## Variants

| Variant | Description |
|---|---|
| Overlay (default) | Series rendered independently from baseline 0 |
| Stacked | Series areas stacked on top of each other |
| Linear curves | Straight-line interpolation between data points |
| Monotone curves | Smooth Catmull-Rom cubic interpolation (default) |

## Sizes

The chart scales responsively to fill its container width. Height is determined by the SVG aspect ratio (600:280). A minimum width of `--areachart-min-width` (10rem) prevents content from collapsing at extreme widths. The header row (title + period selector) and metric row (value + delta) wrap gracefully when space is constrained.

## States

Handled: default, hover (crosshair + tooltip), empty data (message shown)

## Accessibility

- SVG uses `role="img"` with descriptive `aria-label`
- Hidden data table provides screen-reader-accessible tabular data
- Info button has `aria-label` for its purpose
- Tooltip uses `role="tooltip"`
- Interactive elements have `focus-visible:focus-ring`
- Series colors use the shared `--color-data-series-*` palette for consistency

## Usage

```tsx
import { AreaChart } from '../../organisms/AreaChart/AreaChart';

<AreaChart
  title="Revenue"
  metric="$48,290"
  delta={12.4}
  data={[
    { label: 'Jan', revenue: 4000, profit: 2400 },
    { label: 'Feb', revenue: 3200, profit: 1398 },
  ]}
  series={[
    { name: 'Revenue', dataKey: 'revenue' },
    { name: 'Profit', dataKey: 'profit' },
  ]}
/>
```