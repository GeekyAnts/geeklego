"use client"
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  component: Select,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'filled', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    placeholder: { control: 'text' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const FRUIT_OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
  { value: 'elderberry', label: 'Elderberry' },
];

const PERIOD_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

// ── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    options: FRUIT_OPTIONS,
    placeholder: 'Choose a fruit…',
    variant: 'default',
    size: 'md',
  },
};

// ── Variants ─────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] max-w-xs">
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-2">Default — outlined border</p>
        <Select options={FRUIT_OPTIONS} placeholder="Choose…" variant="default" />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-2">Filled — muted surface, no border</p>
        <Select options={FRUIT_OPTIONS} placeholder="Choose…" variant="filled" />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-2">Ghost — transparent until hover</p>
        <Select options={FRUIT_OPTIONS} placeholder="Choose…" variant="ghost" />
      </div>
    </div>
  ),
};

// ── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] max-w-xs">
      <Select options={PERIOD_OPTIONS} defaultValue="weekly" size="sm" label="Small (sm)" />
      <Select options={PERIOD_OPTIONS} defaultValue="weekly" size="md" label="Medium (md)" />
      <Select options={PERIOD_OPTIONS} defaultValue="weekly" size="lg" label="Large (lg)" />
    </div>
  ),
};

// ── States ───────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] max-w-xs">
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-2">Default</p>
        <Select options={FRUIT_OPTIONS} placeholder="Choose a fruit…" />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-2">With selection</p>
        <Select options={FRUIT_OPTIONS} defaultValue="banana" />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-2">Disabled</p>
        <Select options={FRUIT_OPTIONS} defaultValue="apple" disabled />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-2">Error</p>
        <Select options={FRUIT_OPTIONS} placeholder="Required field" error />
      </div>
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-2">With disabled option</p>
        <Select options={FRUIT_OPTIONS} placeholder="Durian is disabled…" />
      </div>
    </div>
  ),
};

// ── With label ───────────────────────────────────────────────────────────────

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] max-w-xs">
      <Select
        options={PERIOD_OPTIONS}
        defaultValue="weekly"
        label="Time period"
      />
      <Select
        options={FRUIT_OPTIONS}
        placeholder="Pick one…"
        label="Favourite fruit"
        error
      />
      <Select
        options={FRUIT_OPTIONS}
        defaultValue="apple"
        label="Disabled field"
        disabled
      />
    </div>
  ),
};

// ── Controlled ───────────────────────────────────────────────────────────────

export const Controlled: Story = {
  render: () => {
    const [val, setVal] = useState('weekly');
    return (
      <div className="flex flex-col gap-[var(--spacing-component-md)] max-w-xs">
        <Select
          options={PERIOD_OPTIONS}
          value={val}
          onChange={setVal}
          label="Controlled select"
        />
        <p className="text-body-sm text-[var(--color-text-secondary)]">
          Selected: <strong>{val}</strong>
        </p>
      </div>
    );
  },
};

// ── Dark mode ────────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-[var(--spacing-component-lg)] p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-component-xl)] max-w-2xl"
    >
      <Select options={FRUIT_OPTIONS} placeholder="Choose…" variant="default" label="Default" />
      <Select options={FRUIT_OPTIONS} defaultValue="banana" variant="filled" label="Filled" />
      <Select options={FRUIT_OPTIONS} placeholder="Ghost" variant="ghost" label="Ghost" />
      <Select options={FRUIT_OPTIONS} placeholder="Error state" error label="Error" />
      <Select options={FRUIT_OPTIONS} defaultValue="apple" disabled label="Disabled" />
    </div>
  ),
};

// ── Accessibility ─────────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)] max-w-xs">
      {/* Keyboard: Tab to focus · Space/Enter to open · Arrow keys to navigate options · Escape to close */}
      {/* Screen reader: "[label], [value or placeholder], combo box" | "[label], required, invalid" | "[label], dimmed, combo box" */}

      {/* With label: label provides the accessible name via htmlFor/id */}
      <Select options={FRUIT_OPTIONS} placeholder="Choose a fruit…" label="Favourite fruit" />

      {/* Disabled: both disabled attribute + aria-disabled */}
      <Select options={FRUIT_OPTIONS} defaultValue="apple" disabled label="Disabled field" />

      {/* Error: aria-invalid + aria-describedby points to error message */}
      <Select options={FRUIT_OPTIONS} placeholder="Required field" error label="Required field" />
    </div>
  ),
};

// ── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    options: FRUIT_OPTIONS,
    placeholder: 'Choose a fruit…',
    variant: 'default',
    size: 'md',
    disabled: false,
    error: false,
    label: 'Label',
  },
};
