import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from './BarChart';

const meta: Meta<typeof BarChart> = {
  title: 'Organisms/BarChart',
  component: BarChart,
  parameters: {
    layout: 'padded',
  },
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
    period: {
      control: 'select',
      options: ['daily', 'weekly', 'monthly', 'yearly'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof BarChart>;

const SALES_SERIES = [
  { name: 'Direct', value: 86 },
  { name: 'Email', value: 52 },
  { name: 'Social', value: 45 },
  { name: 'Paid', value: 30 },
  { name: 'Affiliate', value: 20 },
  { name: 'Organic', value: 8 },
  { name: 'Other', value: 5 },
];

// ── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    title: 'Sales Channels',
    infoLabel: 'Shows the distribution of total sales across channels',
    metric: 246,
    delta: 2.1,
    deltaLabel: 'from last week',
    dateStart: 'Mar 17, 2026',
    dateEnd: 'Mar 24, 2026',
    series: SALES_SERIES,
    period: 'weekly',
    description:
      'This chart shows the distribution of your total sales across different channels. Use this breakdown to understand where most of your revenue is coming from, which channels are underperforming, and where to focus your next campaign.',
  },
};

// ── All 7 series colors ──────────────────────────────────────────────────────

export const SeriesColors: Story = {
  name: 'Series Colors',
  render: () => (
    <div className="flex flex-col gap-6 max-w-2xl">
      <BarChart
        title="All 7 Series"
        infoLabel="Demonstrates all chart series colors"
        metric={700}
        dateStart="Jan 1, 2026"
        dateEnd="Jan 7, 2026"
        series={[
          { name: 'Series 1', value: 100 },
          { name: 'Series 2', value: 100 },
          { name: 'Series 3', value: 100 },
          { name: 'Series 4', value: 100 },
          { name: 'Series 5', value: 100 },
          { name: 'Series 6', value: 100 },
          { name: 'Series 7', value: 100 },
        ]}
      />
    </div>
  ),
};

// ── Positive delta ──────────────────────────────────────────────────────────

export const PositiveDelta: Story = {
  args: {
    title: 'Revenue Channels',
    infoLabel: 'Revenue by acquisition channel',
    metric: '$48,290',
    delta: 12.4,
    deltaLabel: 'from last month',
    dateStart: 'Feb 1, 2026',
    dateEnd: 'Feb 28, 2026',
    series: [
      { name: 'Direct', value: 210 },
      { name: 'Organic', value: 145 },
      { name: 'Paid', value: 98 },
      { name: 'Referral', value: 47 },
    ],
    period: 'monthly',
    description:
      'Revenue is up across all channels this month. Direct sales continue to lead, with organic search showing the strongest growth at +31%.',
  },
};

// ── Negative delta ──────────────────────────────────────────────────────────

export const NegativeDelta: Story = {
  args: {
    title: 'Active Users',
    infoLabel: 'Active users by acquisition source',
    metric: '1,842',
    delta: -4.7,
    deltaLabel: 'from last week',
    dateStart: 'Mar 10, 2026',
    dateEnd: 'Mar 17, 2026',
    series: [
      { name: 'App', value: 950 },
      { name: 'Web', value: 620 },
      { name: 'API', value: 272 },
    ],
    period: 'weekly',
  },
};

// ── No description ───────────────────────────────────────────────────────────

export const NoDescription: Story = {
  args: {
    title: 'Traffic Sources',
    infoLabel: 'Page views by source',
    metric: '12,048',
    delta: 8.3,
    deltaLabel: 'from last week',
    dateStart: 'Mar 17, 2026',
    dateEnd: 'Mar 24, 2026',
    series: [
      { name: 'Search', value: 5200 },
      { name: 'Direct', value: 3100 },
      { name: 'Social', value: 2400 },
      { name: 'Email', value: 1348 },
    ],
    period: 'weekly',
  },
};

// ── Few series ───────────────────────────────────────────────────────────────

export const FewSeries: Story = {
  args: {
    title: 'Platform Split',
    metric: '3,291',
    delta: 1.2,
    deltaLabel: 'from yesterday',
    dateStart: 'Mar 23, 2026',
    dateEnd: 'Mar 24, 2026',
    series: [
      { name: 'iOS', value: 1850 },
      { name: 'Android', value: 1020 },
      { name: 'Web', value: 421 },
    ],
    period: 'daily',
    periods: ['Hourly', 'Daily', 'Weekly'],
  },
};

// ── No period selector ───────────────────────────────────────────────────────

export const NoPeriods: Story = {
  args: {
    title: 'All-time Sources',
    metric: '284,120',
    dateStart: 'Jan 1, 2024',
    dateEnd: 'Mar 24, 2026',
    series: [
      { name: 'Organic', value: 142000 },
      { name: 'Paid', value: 68000 },
      { name: 'Referral', value: 45000 },
      { name: 'Direct', value: 29120 },
    ],
    periods: [],
    description: 'Cumulative breakdown since launch. Organic search has driven the majority of total acquisition.',
  },
};

// ── Dark mode ────────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="max-w-2xl p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-component-xl)]"
    >
      <BarChart
        title="Sales Channels"
        infoLabel="Shows the distribution of total sales across channels"
        metric={246}
        delta={2.1}
        deltaLabel="from last week"
        dateStart="Mar 17, 2026"
        dateEnd="Mar 24, 2026"
        series={SALES_SERIES}
        period="weekly"
        description="This chart shows the distribution of your total sales across different channels. Use this breakdown to understand where most of your revenue is coming from, which channels are underperforming, and where to focus your next campaign."
      />
    </div>
  ),
};

// ── Accessibility ─────────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)] max-w-2xl">
      {/* Keyboard: Tab navigates to the info button and period selector */}
      {/* Screen reader: Bar container has role="img" + aria-label · Visually hidden <table> provides full data fallback */}
      {/* Info button: aria-label with tooltip text · Period selector: aria-label="Select time period" */}

      {/* Full chart: demonstrates all interactive controls */}
      <BarChart
        title="Sales Channels"
        infoLabel="Shows the distribution of total sales across channels"
        metric={246}
        delta={2.1}
        deltaLabel="from last week"
        dateStart="Mar 17, 2026"
        dateEnd="Mar 24, 2026"
        series={SALES_SERIES}
        period="weekly"
        description="This chart shows the distribution of your total sales across different channels."
      />
    </div>
  ),
};

// ── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    title: 'Sales Channels',
    infoLabel: 'Shows the distribution of total sales across channels',
    metric: 246,
    delta: 2.1,
    deltaLabel: 'from last week',
    dateStart: 'Mar 17, 2026',
    dateEnd: 'Mar 24, 2026',
    series: SALES_SERIES,
    period: 'weekly',
    description:
      'This chart shows the distribution of your total sales across different channels.',
  },
};
