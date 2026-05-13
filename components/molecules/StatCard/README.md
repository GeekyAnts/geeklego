# StatCard

A single KPI metric card built on `<article>` + `<dl>` semantics. Displays a label, a prominent value, an optional trend delta with directional badge, an optional context label, and an optional icon. Ideal for dashboard overview panels.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | **Required.** Metric name (e.g. "Total Revenue"). |
| `value` | `ReactNode` | — | **Required.** Primary metric value (e.g. "$12,450"). |
| `delta` | `number` | — | Percentage change (e.g. `12.5` for +12.5%). Determines trend colour and icon. |
| `deltaLabel` | `string` | — | Context shown after the delta Badge (e.g. "vs last month"). |
| `trend` | `'up' \| 'down' \| 'neutral'` | derived | Override trend direction. Defaults to sign of `delta`. |
| `icon` | `ReactNode` | — | Optional icon displayed top-right. Pass a Lucide icon node. |
| `variant` | `'elevated' \| 'outlined' \| 'filled' \| 'ghost'` | `'elevated'` | Visual container style. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Typography and spacing scale. |
| `isLoading` | `boolean` | `false` | Shows a spinner and suppresses metric content. |
| `i18nStrings` | `StatCardI18nStrings` | — | Per-instance string overrides for SR labels. |

## Tokens Used

| Token | Purpose |
|-------|---------|
| `--stat-card-bg` | Card background (elevated variant) |
| `--stat-card-border` | Card border colour |
| `--stat-card-radius` | Card border radius |
| `--stat-card-padding` | Card inner padding |
| `--stat-card-min-width` | Minimum card width |
| `--stat-card-label-color` | Label text colour |
| `--stat-card-value-color` | Value text colour |
| `--stat-card-delta-mt` | Margin above the delta row |
| `--stat-card-delta-gap` | Gap between Badge and context label |
| `--stat-card-delta-label-color` | Context label text colour |
| `--stat-card-icon-color` | Icon colour |
| `--stat-card-icon-bg` | Icon background |
| `--stat-card-icon-radius` | Icon container radius |
| `--stat-card-icon-padding` | Icon container padding |

## Variants

| Variant | Description |
|---------|-------------|
| `outlined` | Transparent background with visible border |
| `filled` | Secondary background, no border — for panel surfaces |
| `ghost` | No border, no background — for coloured surface overlays |

## Trend Colours

Trend direction maps to `Badge` colour intent:

| Trend | Badge colour | Icon |
|-------|-------------|------|
| `up` | `success` | `TrendingUp` |
| `down` | `error` | `TrendingDown` |
| `neutral` | `default` | `Minus` |

## Accessibility

- **Element**: `<article>` for self-contained content unit
- **Structure**: `<dl>` + `<dt>` (label) + `<dd>` (value + delta) — definition list semantics
- **Delta SR label**: SR-only prefix ("Trending up: " / "Trending down: ") prepended to the Badge content
- **Icon**: wrapped in `aria-hidden="true"` — decorative
- **Loading**: `aria-busy="true"` with `aria-label={label}` on the article

## Usage

```tsx
import { StatCard } from '@geeklego/ui';
import { DollarSign } from 'lucide-react';

// Basic metric
<StatCard
  label="Total Revenue"
  value="$12,450"
  delta={12.5}
  deltaLabel="vs last month"
  icon={<DollarSign size="var(--size-icon-md)" />}
/>

// Negative trend
<StatCard
  label="Bounce Rate"
  value="42.3%"
  delta={-6.8}
  deltaLabel="vs last week"
  variant="outlined"
/>

// Loading state
<StatCard
  label="Active Sessions"
  value="—"
  isLoading
/>

// Dashboard grid
<div className="grid grid-cols-4 gap-4">
  <StatCard label="Revenue" value="$12k" delta={8.2} />
  <StatCard label="Users" value="3,218" delta={-1.4} />
  <StatCard label="Orders" value="845" delta={0} />
  <StatCard label="Uptime" value="99.9%" trend="up" />
</div>
```
