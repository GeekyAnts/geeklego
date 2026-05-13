import type { Meta, StoryObj } from '@storybook/react';
import { AreaChart } from './AreaChart';

const meta: Meta<typeof AreaChart> = {
  title: 'Organisms/AreaChart',
  component: AreaChart,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    infoLabel: { control: 'text' },
    metric: { control: 'text' },
    delta: { control: 'number' },
    deltaLabel: { control: 'text' },
    dateStart: { control: 'text' },
    dateEnd: { control: 'text' },
    description: { control: 'text' },
    stacked: { control: 'boolean' },
    curveType: { control: 'select', options: ['linear', 'monotone'] },
    showGrid: { control: 'boolean' },
    showXAxis: { control: 'boolean' },
    showYAxis: { control: 'boolean' },
    period: { control: 'select', options: ['daily', 'weekly', 'monthly', 'yearly'] },
  },
};

export default meta;
type Story = StoryObj<typeof AreaChart>;

/* ── Shared data ─────────────────────────────────────────────────────────── */

const MONTHLY_DATA = [
  { label: 'Jan', revenue: 4000, profit: 2400, expenses: 1600 },
  { label: 'Feb', revenue: 3200, profit: 1398, expenses: 1802 },
  { label: 'Mar', revenue: 5100, profit: 3800, expenses: 1300 },
  { label: 'Apr', revenue: 4800, profit: 2908, expenses: 1892 },
  { label: 'May', revenue: 6200, profit: 4800, expenses: 1400 },
  { label: 'Jun', revenue: 5800, profit: 3200, expenses: 2600 },
  { label: 'Jul', revenue: 7100, profit: 5100, expenses: 2000 },
  { label: 'Aug', revenue: 6500, profit: 4300, expenses: 2200 },
  { label: 'Sep', revenue: 7800, profit: 5600, expenses: 2200 },
  { label: 'Oct', revenue: 7200, profit: 4900, expenses: 2300 },
  { label: 'Nov', revenue: 8100, profit: 5800, expenses: 2300 },
  { label: 'Dec', revenue: 9200, profit: 6800, expenses: 2400 },
];

const REVENUE_SERIES = [
  { name: 'Revenue', dataKey: 'revenue' },
  { name: 'Profit', dataKey: 'profit' },
];

const ALL_SERIES = [
  { name: 'Revenue', dataKey: 'revenue' },
  { name: 'Profit', dataKey: 'profit' },
  { name: 'Expenses', dataKey: 'expenses' },
];

const SINGLE_SERIES = [{ name: 'Revenue', dataKey: 'revenue' }];

/* ── Default ─────────────────────────────────────────────────────────────── */

export const Default: Story = {
  args: {
    title: 'Revenue Overview',
    infoLabel: 'Monthly revenue and profit trend',
    metric: '$75,100',
    delta: 12.4,
    deltaLabel: 'from last year',
    dateStart: 'Jan 2026',
    dateEnd: 'Dec 2026',
    data: MONTHLY_DATA,
    series: REVENUE_SERIES,
    period: 'monthly',
    description:
      'Revenue has grown consistently throughout the year, with the strongest gains in Q4. Profit margins have improved as operational efficiency increased.',
  },
};

/* ── Variants — overlay vs stacked, linear vs monotone ───────────────────── */

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-2">Overlay · Monotone</p>
        <AreaChart
          title="Overlay (default)"
          data={MONTHLY_DATA}
          series={ALL_SERIES}
          curveType="monotone"
          periods={[]}
        />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-2">Stacked · Monotone</p>
        <AreaChart
          title="Stacked"
          data={MONTHLY_DATA}
          series={ALL_SERIES}
          stacked
          curveType="monotone"
          periods={[]}
        />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-2">Overlay · Linear</p>
        <AreaChart
          title="Linear curves"
          data={MONTHLY_DATA}
          series={REVENUE_SERIES}
          curveType="linear"
          periods={[]}
        />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-2">Stacked · Linear</p>
        <AreaChart
          title="Stacked Linear"
          data={MONTHLY_DATA}
          series={ALL_SERIES}
          stacked
          curveType="linear"
          periods={[]}
        />
      </div>
    </div>
  ),
};

/* ── Sizes — single series vs multi-series vs dense data ─────────────────── */

export const Sizes: Story = {
  name: 'Sizes',
  render: () => {
    const denseData = Array.from({ length: 30 }, (_, i) => ({
      label: `D${i + 1}`,
      visitors: Math.round(800 + Math.random() * 1200),
    }));
    return (
      <div className="flex flex-col gap-8 max-w-2xl">
        <div>
          <p className="text-label-sm text-[var(--color-text-secondary)] mb-2">Single series</p>
          <AreaChart
            title="Page Views"
            metric="72,048"
            data={MONTHLY_DATA}
            series={SINGLE_SERIES}
            periods={[]}
          />
        </div>
        <div>
          <p className="text-label-sm text-[var(--color-text-secondary)] mb-2">Multi-series (3)</p>
          <AreaChart
            title="Financials"
            data={MONTHLY_DATA}
            series={ALL_SERIES}
            periods={[]}
          />
        </div>
        <div>
          <p className="text-label-sm text-[var(--color-text-secondary)] mb-2">Dense data (30 points)</p>
          <AreaChart
            title="Daily Visitors"
            metric="28,400"
            data={denseData}
            series={[{ name: 'Visitors', dataKey: 'visitors' }]}
            periods={[]}
          />
        </div>
      </div>
    );
  },
};

/* ── States — empty, no description, negative delta ──────────────────────── */

export const States: Story = {
  name: 'States',
  render: () => (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-2">Empty data</p>
        <AreaChart
          title="No Data"
          data={[]}
          series={REVENUE_SERIES}
          periods={[]}
        />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-2">Negative delta</p>
        <AreaChart
          title="Churn Rate"
          metric="4.2%"
          delta={-1.8}
          deltaLabel="from last month"
          data={MONTHLY_DATA.map((d) => ({
            ...d,
            churn: Math.round(d.expenses / 10),
          }))}
          series={[{ name: 'Churn', dataKey: 'churn' }]}
          periods={[]}
        />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-2">No period selector / no grid</p>
        <AreaChart
          title="Minimal"
          data={MONTHLY_DATA}
          series={SINGLE_SERIES}
          showGrid={false}
          showYAxis={false}
          periods={[]}
        />
      </div>
    </div>
  ),
};

/* ── Dark mode ───────────────────────────────────────────────────────────── */

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="max-w-2xl p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-component-xl)]"
    >
      <AreaChart
        title="Revenue Overview"
        infoLabel="Monthly revenue and profit trend"
        metric="$75,100"
        delta={12.4}
        deltaLabel="from last year"
        dateStart="Jan 2026"
        dateEnd="Dec 2026"
        data={MONTHLY_DATA}
        series={REVENUE_SERIES}
        period="monthly"
        description="Revenue has grown consistently throughout the year, with the strongest gains in Q4."
      />
    </div>
  ),
};

/* ── Accessibility ───────────────────────────────────────────────────────── */

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)] max-w-2xl">
      {/* Keyboard: Tab navigates to the info button and period selector */}
      {/* Screen reader: SVG has role="img" + aria-label · Visually hidden <table> provides full data fallback */}
      {/* Info button: aria-label with tooltip text · Period selector: aria-label="Select time period" */}

      {/* Full chart: demonstrates all interactive controls */}
      <AreaChart
        title="Revenue Overview"
        infoLabel="Monthly revenue and profit trend"
        metric="$75,100"
        delta={12.4}
        deltaLabel="from last year"
        dateStart="Jan 2026"
        dateEnd="Dec 2026"
        data={MONTHLY_DATA}
        series={REVENUE_SERIES}
        period="monthly"
        description="Revenue has grown consistently throughout the year, with the strongest gains in Q4."
      />
    </div>
  ),
};

/* ── Playground ──────────────────────────────────────────────────────────── */

export const Playground: Story = {
  args: {
    title: 'Revenue Overview',
    infoLabel: 'Monthly revenue and profit trend',
    metric: '$75,100',
    delta: 12.4,
    deltaLabel: 'from last year',
    dateStart: 'Jan 2026',
    dateEnd: 'Dec 2026',
    data: MONTHLY_DATA,
    series: ALL_SERIES,
    period: 'monthly',
    stacked: false,
    curveType: 'monotone',
    showGrid: true,
    showXAxis: true,
    showYAxis: true,
    description: 'Adjust all controls below to explore the component.',
  },
};

/* ── Edge Cases ──────────────────────────────────────────────────────────── */

const LARGE_DATASET = Array.from({ length: 36 }, (_, i) => {
  const month = (i % 12) + 1;
  const year = 2024 + Math.floor(i / 12);
  return {
    label: `${year}-${String(month).padStart(2, '0')}`,
    value: Math.round(3000 + Math.sin(i * 0.5) * 1500 + i * 80),
    baseline: Math.round(2800 + i * 60),
  };
});

const ALL_ZERO_DATA = [
  { label: 'Q1', revenue: 0, profit: 0 },
  { label: 'Q2', revenue: 0, profit: 0 },
  { label: 'Q3', revenue: 0, profit: 0 },
  { label: 'Q4', revenue: 0, profit: 0 },
];

const NEGATIVE_DATA = [
  { label: 'Jan', revenue: 4200, net: -800 },
  { label: 'Feb', revenue: 3900, net: -1200 },
  { label: 'Mar', revenue: 5100, net: 300 },
  { label: 'Apr', revenue: 4700, net: -200 },
  { label: 'May', revenue: 6100, net: 1400 },
  { label: 'Jun', revenue: 5500, net: 900 },
];

export const EdgeCases: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-md)]">
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Mixed positive/negative series
        </p>
        <AreaChart
          title="Revenue vs Net"
          metric="$26,200"
          delta={-3.1}
          deltaLabel="from prior period"
          dateStart="Jan 2026"
          dateEnd="Jun 2026"
          data={NEGATIVE_DATA}
          series={[
            { name: 'Revenue', dataKey: 'revenue' },
            { name: 'Net', dataKey: 'net' },
          ]}
          period="monthly"
        />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          All-zero data (empty chart baseline)
        </p>
        <AreaChart
          title="No Activity"
          metric="$0"
          delta={0}
          deltaLabel="no change"
          dateStart="Q1 2026"
          dateEnd="Q4 2026"
          data={ALL_ZERO_DATA}
          series={REVENUE_SERIES}
          period="monthly"
          description="No revenue or profit recorded this period."
        />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Large dataset (36 data points — scroll stress test)
        </p>
        <AreaChart
          title="3-Year Trend"
          metric="—"
          dateStart="Jan 2024"
          dateEnd="Dec 2026"
          data={LARGE_DATASET}
          series={[
            { name: 'Value', dataKey: 'value' },
            { name: 'Baseline', dataKey: 'baseline' },
          ]}
          period="monthly"
          curveType="monotone"
          showGrid
        />
      </div>
    </div>
  ),
};
