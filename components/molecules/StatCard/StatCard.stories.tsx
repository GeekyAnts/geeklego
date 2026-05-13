import type { Meta, StoryObj } from '@storybook/react';
import {
  DollarSign,
  Users,
  ShoppingCart,
  Activity,
  TrendingUp,
  BarChart2,
} from 'lucide-react';
import { StatCard } from './StatCard';

const meta = {
  title: 'Molecules/StatCard',
  component: StatCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'StatCard displays a single KPI metric with an optional trend delta, context label, and icon. Built on <article> + <dl> semantics with Badge atom for the delta indicator.',
      },
    },
  },
  args: {
    label: 'Metric Label',
    value: '1,234',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'filled', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    trend: {
      control: 'select',
      options: ['up', 'down', 'neutral'],
    },
    isLoading: { control: 'boolean' },
    delta: { control: 'number' },
    deltaLabel: { control: 'text' },
    label: { control: 'text' },
    value: { control: 'text' },
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: 'Total Revenue',
    value: '$12,450',
    delta: 12.5,
    deltaLabel: 'vs last month',
    icon: <DollarSign size="var(--size-icon-md)" />,
  },
};

// ── 2. Variants ───────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-[var(--spacing-layout-xs)] max-w-2xl">
      <StatCard
        label="Elevated"
        value="$12,450"
        delta={12.5}
        deltaLabel="vs last month"
        variant="elevated"
        icon={<DollarSign size="var(--size-icon-md)" />}
      />
      <StatCard
        label="Outlined"
        value="3,218"
        delta={-2.1}
        deltaLabel="vs last week"
        variant="outlined"
        icon={<Users size="var(--size-icon-md)" />}
      />
      <StatCard
        label="Filled"
        value="845"
        delta={0}
        deltaLabel="no change"
        variant="filled"
        icon={<ShoppingCart size="var(--size-icon-md)" />}
      />
      <StatCard
        label="Ghost"
        value="99.8%"
        delta={0.3}
        deltaLabel="this week"
        variant="ghost"
        icon={<Activity size="var(--size-icon-md)" />}
      />
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-sm">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <StatCard
          key={size}
          label={`Monthly Active Users — ${size}`}
          value="24,891"
          delta={8.4}
          deltaLabel="vs last month"
          size={size}
          icon={<Users size="var(--size-icon-md)" />}
        />
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-[var(--spacing-layout-xs)] max-w-2xl">
      <StatCard
        label="Trend up"
        value="$8,320"
        delta={14.2}
        deltaLabel="vs last month"
      />
      <StatCard
        label="Trend down"
        value="142"
        delta={-6.8}
        deltaLabel="vs last week"
      />
      <StatCard
        label="Neutral (zero delta)"
        value="1,500"
        delta={0}
        deltaLabel="no change"
      />
      <StatCard
        label="No delta"
        value="$99/mo"
      />
      <StatCard
        label="Loading"
        value="—"
        isLoading
      />
      <StatCard
        label="With icon"
        value="4.9 / 5.0"
        delta={0.2}
        deltaLabel="this quarter"
        icon={<BarChart2 size="var(--size-icon-md)" />}
      />
      <StatCard
        label="Long value"
        value="1,234,567,890"
        delta={2.3}
        deltaLabel="all time"
      />
      <StatCard
        label="Icon, no delta"
        value="Active"
        icon={<Activity size="var(--size-icon-md)" />}
      />
    </div>
  ),
};

// ── 5. DarkMode ───────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="grid grid-cols-2 gap-[var(--spacing-layout-xs)] p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <StatCard
        label="Total Revenue"
        value="$12,450"
        delta={12.5}
        deltaLabel="vs last month"
        icon={<DollarSign size="var(--size-icon-md)" />}
      />
      <StatCard
        label="Active Users"
        value="3,218"
        delta={-2.1}
        deltaLabel="vs last week"
        icon={<Users size="var(--size-icon-md)" />}
      />
      <StatCard
        label="Orders"
        value="845"
        delta={0}
        deltaLabel="no change"
        variant="outlined"
      />
      <StatCard
        label="Uptime"
        value="99.8%"
        delta={0.3}
        deltaLabel="this week"
        variant="filled"
        isLoading={false}
      />
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    label: 'Monthly Revenue',
    value: '$12,450',
    delta: 12.5,
    deltaLabel: 'vs last month',
    variant: 'elevated',
    size: 'md',
    isLoading: false,
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] p-[var(--spacing-layout-xs)] max-w-sm">
      {/*
        Keyboard: StatCard is non-interactive — no keyboard interaction by default.
        Screen reader:
          <article> provides a landmark boundary.
          <dl> <dt> <dd> provides definition list semantics.
          SR-only trend prefix announced before the visible percentage.
          Icon wrapper has aria-hidden="true" — decorative.
          Loading state: aria-busy="true" + aria-label announces the metric name.
      */}

      {/* Up trend — SR announces "Trending up: +12.5%" */}
      <StatCard
        label="Total Revenue"
        value="$12,450"
        delta={12.5}
        deltaLabel="vs last month"
        icon={<DollarSign size="var(--size-icon-md)" />}
        aria-label="Total Revenue metric card"
      />

      {/* Down trend — SR announces "Trending down: −6.8%" */}
      <StatCard
        label="Bounce Rate"
        value="42.3%"
        delta={-6.8}
        deltaLabel="vs last week"
      />

      {/* Loading — aria-busy="true" with the metric name as aria-label */}
      <StatCard
        label="Active Sessions"
        value="—"
        isLoading
      />
    </div>
  ),
};
