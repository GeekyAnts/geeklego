import type { Meta, StoryObj } from '@storybook/react';
import { ProgressIndicator } from './ProgressIndicator';

const meta: Meta<typeof ProgressIndicator> = {
  title: 'Atoms/ProgressIndicator',
  component: ProgressIndicator,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current value (0–max). Omit for indeterminate state.',
    },
    max: {
      control: { type: 'number', min: 1 },
      description: 'Maximum value. Defaults to 100.',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'error'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    showValue: {
      control: 'boolean',
      description: 'Show percentage at center (md+ only).',
    },
    label: {
      control: 'text',
      description: 'Accessible label (aria-label).',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressIndicator>;

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    value: 65,
    size: 'md',
    variant: 'default',
    showValue: true,
    label: 'Upload progress',
  },
};

// ── 2. Variants ───────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-[var(--spacing-layout-xs)]">
      {(
        [
          { variant: 'default', label: 'Default' },
          { variant: 'success', label: 'Success' },
          { variant: 'warning', label: 'Warning' },
          { variant: 'error',   label: 'Error' },
        ] as const
      ).map(({ variant, label }) => (
        <div key={variant} className="flex flex-col items-center gap-[var(--spacing-component-sm)]">
          <ProgressIndicator
            value={65}
            size="lg"
            variant={variant}
            showValue
            label={label}
          />
          <span className="text-caption-md text-[var(--color-text-secondary)]">{label}</span>
        </div>
      ))}
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-[var(--spacing-layout-xs)]">
      {(
        [
          { size: 'xs', label: 'xs · 16px' },
          { size: 'sm', label: 'sm · 24px' },
          { size: 'md', label: 'md · 40px' },
          { size: 'lg', label: 'lg · 64px' },
          { size: 'xl', label: 'xl · 80px' },
        ] as const
      ).map(({ size, label }) => (
        <div key={size} className="flex flex-col items-center gap-[var(--spacing-component-sm)]">
          <ProgressIndicator
            value={65}
            size={size}
            showValue
            label={`Progress ${size}`}
          />
          <span className="text-caption-sm text-[var(--color-text-tertiary)]">{label}</span>
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-[var(--spacing-layout-xs)]">
      {/* Determinate — 0% */}
      <div className="flex flex-col items-center gap-[var(--spacing-component-sm)]">
        <ProgressIndicator value={0} size="lg" showValue label="Empty" />
        <span className="text-caption-sm text-[var(--color-text-tertiary)]">0%</span>
      </div>

      {/* Determinate — 65% */}
      <div className="flex flex-col items-center gap-[var(--spacing-component-sm)]">
        <ProgressIndicator value={65} size="lg" showValue label="In progress" />
        <span className="text-caption-sm text-[var(--color-text-tertiary)]">65%</span>
      </div>

      {/* Complete — 100% */}
      <div className="flex flex-col items-center gap-[var(--spacing-component-sm)]">
        <ProgressIndicator value={100} size="lg" variant="success" showValue label="Complete" />
        <span className="text-caption-sm text-[var(--color-text-tertiary)]">100% · success</span>
      </div>

      {/* Indeterminate */}
      <div className="flex flex-col items-center gap-[var(--spacing-component-sm)]">
        <ProgressIndicator size="lg" label="Loading…" />
        <span className="text-caption-sm text-[var(--color-text-tertiary)]">indeterminate</span>
      </div>

      {/* Disabled — determinate */}
      <div className="flex flex-col items-center gap-[var(--spacing-component-sm)]">
        <ProgressIndicator value={40} size="lg" showValue disabled label="Paused" />
        <span className="text-caption-sm text-[var(--color-text-tertiary)]">disabled</span>
      </div>

      {/* Disabled — indeterminate */}
      <div className="flex flex-col items-center gap-[var(--spacing-component-sm)]">
        <ProgressIndicator size="lg" disabled label="Paused loading" />
        <span className="text-caption-sm text-[var(--color-text-tertiary)]">disabled + indeterminate</span>
      </div>
    </div>
  ),
};

// ── 5. DarkMode ───────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-wrap items-end gap-[var(--spacing-layout-xs)] p-[var(--spacing-layout-sm)] bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      {(
        [
          { variant: 'default', value: 65,  label: 'Default' },
          { variant: 'success', value: 80,  label: 'Success' },
          { variant: 'warning', value: 45,  label: 'Warning' },
          { variant: 'error',   value: 20,  label: 'Error' },
        ] as const
      ).map(({ variant, value, label }) => (
        <div key={variant} className="flex flex-col items-center gap-[var(--spacing-component-sm)]">
          <ProgressIndicator
            value={value}
            size="lg"
            variant={variant}
            showValue
            label={label}
          />
          <span className="text-caption-sm text-[var(--color-text-secondary)]">{label}</span>
        </div>
      ))}

      {/* Indeterminate in dark */}
      <div className="flex flex-col items-center gap-[var(--spacing-component-sm)]">
        <ProgressIndicator size="lg" label="Loading…" />
        <span className="text-caption-sm text-[var(--color-text-secondary)]">indeterminate</span>
      </div>
    </div>
  ),
};

// ── 6. EdgeCases ──────────────────────────────────────────────────────────────

export const EdgeCases: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-md)]">
      {/* Zero value */}
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <span className="text-body-sm font-semibold">Zero progress</span>
        <ProgressIndicator value={0} size="md" label="0%" showValue />
      </div>

      {/* Max value */}
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <span className="text-body-sm font-semibold">Complete</span>
        <ProgressIndicator value={100} size="md" label="100%" showValue />
      </div>

      {/* Indeterminate */}
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <span className="text-body-sm font-semibold">Loading (indeterminate)</span>
        <ProgressIndicator size="md" label="Processing…" />
      </div>

      {/* Custom max */}
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <span className="text-body-sm font-semibold">Custom max value</span>
        <ProgressIndicator value={50} max={200} size="md" label="25%" showValue />
      </div>
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    value: 65,
    max: 100,
    variant: 'default',
    size: 'md',
    showValue: true,
    label: 'Progress',
    disabled: false,
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] p-[var(--spacing-layout-sm)]">
      {/*
       * Keyboard: Not keyboard-focusable (display only).
       * Screen reader: "Upload progress, 65%, progressbar" (determinate)
       * Screen reader: "Loading files, busy, progressbar" (indeterminate)
       * Screen reader: "Paused upload, dimmed, 40%, progressbar" (disabled)
       */}

      {/* Determinate — explicit aria-label + visible percentage */}
      <div className="flex items-center gap-[var(--spacing-component-lg)]">
        <ProgressIndicator
          value={65}
          size="md"
          showValue
          label="Upload progress"
        />
        <span className="text-body-sm text-[var(--color-text-secondary)]">
          Determinate — aria-label="Upload progress", aria-valuenow=65
        </span>
      </div>

      {/* Indeterminate — aria-busy signals loading */}
      <div className="flex items-center gap-[var(--spacing-component-lg)]">
        <ProgressIndicator
          size="md"
          label="Loading files"
        />
        <span className="text-body-sm text-[var(--color-text-secondary)]">
          Indeterminate — aria-busy="true", no aria-valuenow
        </span>
      </div>

      {/* Disabled — aria-disabled */}
      <div className="flex items-center gap-[var(--spacing-component-lg)]">
        <ProgressIndicator
          value={40}
          size="md"
          showValue
          disabled
          label="Paused upload"
          aria-disabled
        />
        <span className="text-body-sm text-[var(--color-text-secondary)]">
          Disabled — aria-disabled="true", static, no animation
        </span>
      </div>

      {/* Sizes scale — all with accessible labels */}
      <div className="flex items-end gap-[var(--spacing-component-lg)]">
        {(
          ['xs', 'sm', 'md', 'lg', 'xl'] as const
        ).map((size) => (
          <ProgressIndicator
            key={size}
            value={50}
            size={size}
            showValue
            label={`${size} progress indicator`}
          />
        ))}
      </div>

      {/* Variant semantics — each conveys different meaning */}
      <div className="flex items-center gap-[var(--spacing-component-lg)]">
        <ProgressIndicator value={65} size="md" variant="default" label="Default progress" />
        <ProgressIndicator value={100} size="md" variant="success" label="Task completed successfully" />
        <ProgressIndicator value={55} size="md" variant="warning" label="Approaching storage limit" />
        <ProgressIndicator value={15} size="md" variant="error"   label="Critical: disk nearly full" />
      </div>
    </div>
  ),
};
