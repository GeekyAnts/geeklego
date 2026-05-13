# BarChart

**Level:** Organism (L3)
**Folder:** `components/organisms/BarChart/`
**Dependencies:** `../../atoms/Select/Select`

## Description

A data visualization card that displays a proportional horizontal bar chart alongside a headline metric, period selector, date range labels, and an optional description. Bar widths are computed as a percentage of the total across all series. Up to 7 series are supported before the color palette cycles.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Card header title |
| `infoLabel` | `string` | `undefined` | Accessible label for the info icon button. Omit to hide the icon. |
| `metric` | `number \| string` | — | Primary metric value displayed in large type |
| `delta` | `number` | `undefined` | Change percentage. Positive — green, negative — red, zero — muted |
| `deltaLabel` | `string` | `'from last period'` | Context text shown next to the delta (e.g. "from last week") |
| `dateStart` | `string` | `undefined` | Start-of-range label, left-aligned below the metric |
| `dateEnd` | `string` | `undefined` | End-of-range label, right-aligned |
| `series` | `BarChartSeries[]` | `[]` | Bar segments — order determines rendering order and color |
| `period` | `string` | `'weekly'` | Selected period value (should match one of `periods` lowercased) |
| `periods` | `string[]` | `['Daily', 'Weekly', 'Monthly', 'Yearly']` | Options for the period selector. Pass `[]` to hide the selector. |
| `onPeriodChange` | `(period: string) => void` | `undefined` | Callback when the user selects a period |
| `description` | `string` | `undefined` | Descriptive text rendered below the divider |
| `className` | `string` | `undefined` | Additional Tailwind classes appended to the card root |

### BarChartSeries

| Field | Type | Description |
|---|---|---|
| `name` | `string` | Series label (used for tooltips and ARIA) |
| `value` | `number` | Raw numeric value — widths are auto-calculated as % of total |

## Tokens Used

| Token | Resolves to | Used for |
|---|---|---|
| `--barchart-bg` | `--color-surface-raised` | Card background |
| `--barchart-border` | `--color-border-default` | Card border |
| `--barchart-radius` | `--radius-component-xl` | Card corner radius |
| `--barchart-padding` | `--spacing-layout-xs` | Inner card padding |
| `--barchart-shadow` | `--shadow-lg` | Card elevation shadow |
| `--barchart-section-gap` | `--spacing-component-lg` | Vertical gap between sections |
| `--barchart-title-color` | `--color-text-primary` | Title text |
| `--barchart-icon-color` | `--color-text-tertiary` | Info icon + chevron |
| `--barchart-icon-color-hover` | `--color-text-secondary` | Info icon hover |
| `--barchart-period-bg` | `--color-surface-raised` | Period selector background |
| `--barchart-period-bg-hover` | `--color-bg-secondary` | Period selector hover |
| `--barchart-period-border` | `--color-border-default` | Period selector border |
| `--barchart-period-text` | `--color-text-primary` | Period selector text |
| `--barchart-period-radius` | `--radius-component-full` | Period selector pill shape |
| `--barchart-metric-color` | `--color-text-primary` | Headline metric value |
| `--barchart-delta-positive-color` | `--color-status-success` | Positive delta percentage |
| `--barchart-delta-negative-color` | `--color-status-error` | Negative delta percentage |
| `--barchart-delta-context-color` | `--color-text-secondary` | Delta context text |
| `--barchart-date-color` | `--color-text-tertiary` | Date range labels |
| `--barchart-bar-height` | `--size-component-lg` (48px) | Height of each bar segment |
| `--barchart-bar-radius` | `--radius-component-md` | Per-segment corner radius |
| `--barchart-bar-gap` | `--spacing-component-xs` (4px) | Gap between bar segments |
| `--barchart-series-1–7` | `--color-data-series-1–7` | Bar fill colors |
| `--barchart-divider-color` | `--color-border-subtle` | Horizontal divider |
| `--barchart-description-color` | `--color-text-secondary` | Description text |

### Data series palette

| Token | Light / Brand | Dark |
|---|---|---|
| `--color-data-series-1` | `--color-brand-500` | same (no dark override) |
| `--color-data-series-2` | `--color-success-500` | same |
| `--color-data-series-3` | `--color-warning-500` | same |
| `--color-data-series-4` | `--color-accent-500` | same |
| `--color-data-series-5` | `--color-error-500` | same |
| `--color-data-series-6` | `--color-brand-300` | same |
| `--color-data-series-7` | `--color-neutral-400` | same |

## Notes

**Dynamic bar widths:** Bar segments use `style={{ flexGrow: s.value }}` — flex distributes space proportionally between segments based on raw values. This is a deliberate exception to the no-inline-style rule — a data-driven flex ratio cannot come from a static design token.

**Period selector with no options:** Pass `periods={[]}` to hide the dropdown entirely.

**Responsive behavior:** A minimum width of `--barchart-min-width` (10rem) prevents content from collapsing at extreme widths. The header row (title + period selector) and metric row (value + delta) wrap gracefully when space is constrained.

## Accessibility

- Card uses a standard `<div>` container
- The info icon renders as a `<button type="button">` with `aria-label` and `title`
- The period selector is a native `<select>` with `aria-label`
- The bar chart container carries `role="img"` and `aria-label` describing the chart
- The visual bar container has `aria-hidden="true"` — it is intentionally hidden from assistive technology
- A visually hidden `<table>` with `<caption>`, `<thead>`, `<tbody>`, and `<tfoot>` provides full data access to screen readers
- Each row in the hidden table contains the segment name, raw value, and percentage share
- Focus ring applied to all interactive elements (`button`, `select`)

## Usage

```tsx
import { BarChart } from './components/organisms/BarChart/BarChart';

<BarChart
  title="Sales Channels"
  infoLabel="Distribution of sales by channel"
  metric={246}
  delta={2.1}
  deltaLabel="from last week"
  dateStart="Mar 17, 2026"
  dateEnd="Mar 24, 2026"
  series={[
    { name: 'Direct', value: 86 },
    { name: 'Email', value: 52 },
    { name: 'Social', value: 45 },
    { name: 'Paid', value: 30 },
    { name: 'Affiliate', value: 20 },
    { name: 'Organic', value: 8 },
    { name: 'Other', value: 5 },
  ]}
  period="weekly"
  onPeriodChange={(p) => console.log(p)}
  description="Use this breakdown to understand where most of your revenue is coming from."
/>
```