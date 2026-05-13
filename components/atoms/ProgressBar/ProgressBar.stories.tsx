import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Atoms/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: 'number' },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'neutral'],
    },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    rounded: { control: 'boolean' },
    showLabel: { control: 'boolean' },
    showValue: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    value: 60,
    max: 100,
    variant: 'default',
    size: 'md',
    rounded: true,
    label: 'Loading progress',
    showLabel: false,
    showValue: false,
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

// ── 1 · Default ──────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <ProgressBar {...args} />
    </div>
  ),
};

// ── 2 · Variants ─────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: (args) => (
    <div className="w-80 flex flex-col gap-4">
      {(['default', 'success', 'warning', 'error', 'neutral'] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-1">
          <span className="text-label-sm text-[var(--color-text-secondary)] capitalize">{variant}</span>
          <ProgressBar {...args} variant={variant} label={`${variant} progress`} />
        </div>
      ))}
    </div>
  ),
  args: { value: 65, showLabel: false },
};

// ── 3 · Sizes ─────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: (args) => (
    <div className="w-80 flex flex-col gap-5">
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-1">
          <span className="text-label-sm text-[var(--color-text-secondary)]">size="{size}"</span>
          <ProgressBar {...args} size={size} label={`${size} size progress`} />
        </div>
      ))}
    </div>
  ),
  args: { value: 55 },
};

// ── 4 · States ────────────────────────────────────────────────────────────────

export const States: Story = {
  render: (args) => (
    <div className="w-80 flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <span className="text-label-sm text-[var(--color-text-secondary)]">0% (empty)</span>
        <ProgressBar {...args} value={0} label="Empty progress" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-label-sm text-[var(--color-text-secondary)]">25%</span>
        <ProgressBar {...args} value={25} label="Quarter progress" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-label-sm text-[var(--color-text-secondary)]">50%</span>
        <ProgressBar {...args} value={50} label="Half progress" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-label-sm text-[var(--color-text-secondary)]">75%</span>
        <ProgressBar {...args} value={75} label="Three-quarter progress" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-label-sm text-[var(--color-text-secondary)]">100% (complete)</span>
        <ProgressBar {...args} value={100} variant="success" label="Complete" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-label-sm text-[var(--color-text-secondary)]">Indeterminate (value omitted)</span>
        <ProgressBar {...args} value={undefined} label="Loading…" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-label-sm text-[var(--color-text-secondary)]">With label + value</span>
        <ProgressBar {...args} value={68} showLabel showValue label="Upload progress" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-label-sm text-[var(--color-text-secondary)]">Squared (rounded=false)</span>
        <ProgressBar {...args} value={55} rounded={false} label="Squared progress" />
      </div>
    </div>
  ),
  args: { size: 'md', variant: 'default' },
};

// ── 5 · DarkMode ──────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: (args) => (
    <div
      data-theme="dark"
      className="bg-[var(--color-bg-primary)] p-8 rounded-xl max-w-2xl w-full"
    >
      <div className="w-80 flex flex-col gap-5">
        {(['default', 'success', 'warning', 'error', 'neutral'] as const).map((variant) => (
          <ProgressBar
            key={variant}
            {...args}
            variant={variant}
            label={`${variant} progress`}
            showLabel
            showValue
          />
        ))}
        <ProgressBar
          {...args}
          value={undefined}
          label="Indeterminate loading"
          showLabel
        />
      </div>
    </div>
  ),
  args: { value: 65, size: 'md' },
};

// ── 6 · CustomMaxValue ────────────────────────────────────────────────────────

export const CustomMaxValue: Story = {
  render: () => (
    <div className="w-80 flex flex-col gap-6">
      {/* Custom max value — shows how max prop affects the percentage calc */}
      <div className="flex flex-col gap-2">
        <span className="text-label-sm font-medium text-[var(--color-text-primary)]">
          max=200 (value=140 = 70%)
        </span>
        <ProgressBar
          value={140}
          max={200}
          variant="default"
          label="Custom progress"
          showLabel
          showValue
        />
      </div>

      {/* Different max, error state */}
      <div className="flex flex-col gap-2">
        <span className="text-label-sm font-medium text-[var(--color-text-primary)]">
          max=500 (value=350 = 70%) — error variant
        </span>
        <ProgressBar
          value={350}
          max={500}
          variant="error"
          label="Large progress bar"
          showLabel
          showValue
        />
      </div>

      {/* Indeterminate with custom max (ignores max) */}
      <div className="flex flex-col gap-2">
        <span className="text-label-sm font-medium text-[var(--color-text-primary)]">
          Indeterminate (custom max ignored)
        </span>
        <ProgressBar
          value={undefined}
          max={200}
          variant="success"
          label="Processing…"
          showLabel
        />
      </div>
    </div>
  ),
};

// ── 7 · Playground ────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <div className="w-80">
      <ProgressBar {...args} />
    </div>
  ),
};

// ── 8 · Accessibility ─────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="w-80 flex flex-col gap-6">
      {/* Determinate — fully labelled */}
      <div className="flex flex-col gap-1">
        <span className="text-label-sm text-[var(--color-text-secondary)]">
          Determinate — aria-valuenow + aria-valuetext + aria-label
        </span>
        <ProgressBar
          value={72}
          max={100}
          variant="default"
          label="File upload progress"
          showLabel
          showValue
        />
      </div>

      {/* Indeterminate — aria-busy */}
      <div className="flex flex-col gap-1">
        <span className="text-label-sm text-[var(--color-text-secondary)]">
          Indeterminate — aria-busy="true", no aria-valuenow
        </span>
        <ProgressBar
          value={undefined}
          variant="default"
          label="Processing, please wait"
          showLabel
        />
      </div>

      {/* Success — completion signal */}
      <div className="flex flex-col gap-1">
        <span className="text-label-sm text-[var(--color-text-secondary)]">
          Success at 100% — variant="success"
        </span>
        <ProgressBar
          value={100}
          variant="success"
          label="Upload complete"
          showLabel
          showValue
        />
      </div>

      {/* Error state */}
      <div className="flex flex-col gap-1">
        <span className="text-label-sm text-[var(--color-text-secondary)]">
          Error state — variant="error"
        </span>
        <ProgressBar
          value={45}
          variant="error"
          label="Upload failed at 45%"
          showLabel
          showValue
        />
      </div>
    </div>
  ),
};
