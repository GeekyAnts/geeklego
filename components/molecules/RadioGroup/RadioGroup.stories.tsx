import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from './RadioGroup';

const meta = {
  title: 'Molecules/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'padded',
  },
  args: {
    options: [
      { value: 'starter', label: 'Starter' },
      { value: 'pro', label: 'Pro' },
      { value: 'enterprise', label: 'Enterprise' },
    ],
    value: 'pro',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'boxed'],
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseOptions = [
  { value: 'starter', label: 'Starter' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
];

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    legend: 'Select a plan',
    options: baseOptions,
    value: 'pro',
  },
};

// ── 2. Variants ───────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-sm">
      <RadioGroup
        legend="Default variant"
        options={baseOptions}
        value="starter"
        variant="default"
      />
      <RadioGroup
        legend="Boxed variant"
        options={baseOptions}
        value="pro"
        variant="boxed"
      />
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-sm">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-[var(--spacing-component-xs)]">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">{size}</span>
          <RadioGroup
            legend={`Size ${size}`}
            options={baseOptions}
            value="starter"
            size={size}
          />
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-sm">
      <div>
        <span className="block text-body-sm text-[var(--color-text-tertiary)] mb-2">default</span>
        <RadioGroup legend="Default" options={baseOptions} value="starter" />
      </div>
      <div>
        <span className="block text-body-sm text-[var(--color-text-tertiary)] mb-2">with hint</span>
        <RadioGroup
          legend="Plan"
          options={baseOptions}
          value="pro"
          hint="You can change your plan at any time."
        />
      </div>
      <div>
        <span className="block text-body-sm text-[var(--color-text-tertiary)] mb-2">error</span>
        <RadioGroup
          legend="Plan"
          options={baseOptions}
          error
          errorMessage="Please select a plan to continue."
        />
      </div>
      <div>
        <span className="block text-body-sm text-[var(--color-text-tertiary)] mb-2">disabled</span>
        <RadioGroup legend="Plan" options={baseOptions} value="pro" disabled />
      </div>
      <div>
        <span className="block text-body-sm text-[var(--color-text-tertiary)] mb-2">required</span>
        <RadioGroup legend="Plan" options={baseOptions} value="starter" required />
      </div>
      <div>
        <span className="block text-body-sm text-[var(--color-text-tertiary)] mb-2">
          option-level disabled
        </span>
        <RadioGroup
          legend="Plan"
          options={[
            { value: 'starter', label: 'Starter' },
            { value: 'pro', label: 'Pro' },
            { value: 'enterprise', label: 'Enterprise', disabled: true },
          ]}
          value="starter"
        />
      </div>
      <div>
        <span className="block text-body-sm text-[var(--color-text-tertiary)] mb-2">horizontal</span>
        <RadioGroup
          legend="Notification frequency"
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'never', label: 'Never' },
          ]}
          value="weekly"
          orientation="horizontal"
        />
      </div>
    </div>
  ),
};

// ── 5. DarkMode ───────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-[var(--spacing-layout-xs)] p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <RadioGroup legend="Select a plan" options={baseOptions} value="pro" />
      <RadioGroup
        legend="Select a plan"
        options={baseOptions}
        value="enterprise"
        variant="boxed"
      />
      <RadioGroup
        legend="Plan"
        options={baseOptions}
        error
        errorMessage="Please select a plan to continue."
        variant="boxed"
      />
      <RadioGroup legend="Plan" options={baseOptions} value="pro" disabled />
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    legend: 'Select a plan',
    options: baseOptions,
    value: 'pro',
    orientation: 'vertical',
    size: 'md',
    variant: 'default',
    error: false,
    disabled: false,
    required: false,
    hint: '',
    errorMessage: '',
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] p-[var(--spacing-layout-xs)] max-w-sm">
      {/*
        Keyboard: Tab enters the group · Arrow keys move between options (native behaviour)
        Screen reader: <fieldset> + <legend> announces group name before options
        Error: role="alert" on error paragraph — announced live by screen readers
        Required: SR-only "(required)" appended after legend * marker
        Disabled option: individual Radio with disabled + aria-disabled
      */}

      {/* Fully labelled group — fieldset/legend pattern */}
      <RadioGroup
        legend="Notification method"
        options={[
          { value: 'email', label: 'Email' },
          { value: 'sms', label: 'SMS' },
          { value: 'push', label: 'Push notification' },
        ]}
        value="email"
        required
        aria-label="Notification method selection"
      />

      {/* Error state — role="alert" announces message to screen readers */}
      <RadioGroup
        legend="Billing cycle"
        options={[
          { value: 'monthly', label: 'Monthly' },
          { value: 'annual', label: 'Annual (save 20%)' },
        ]}
        error
        errorMessage="Please select a billing cycle."
        required
      />

      {/* Disabled group — entire fieldset disabled */}
      <RadioGroup
        legend="Legacy option"
        options={[
          { value: 'a', label: 'Option A' },
          { value: 'b', label: 'Option B' },
        ]}
        value="a"
        disabled
      />

      {/* Partially disabled — individual option disabled */}
      <RadioGroup
        legend="Region"
        options={[
          { value: 'us', label: 'United States' },
          { value: 'eu', label: 'Europe' },
          { value: 'ap', label: 'Asia Pacific', disabled: true },
        ]}
        value="us"
      />
    </div>
  ),
};
