import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Datepicker } from './Datepicker';

const meta: Meta<typeof Datepicker> = {
  title: 'Organisms/Datepicker',
  component: Datepicker,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Date',
    placeholder: 'YYYY-MM-DD',
  },
};

export default meta;
type Story = StoryObj<typeof Datepicker>;

// ── 1. Default ──────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: 'Start date',
    hint: 'Select a date from the calendar',
  },
};

// ── 2. Variants ─────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] w-80">
      <Datepicker label="Default variant" variant="default" hint="Outlined input style" />
      <Datepicker label="Filled variant" variant="filled" hint="Filled input style" />
      <Datepicker label="Flushed variant" variant="flushed" hint="Bottom-border only" />
      <Datepicker label="Unstyled variant" variant="unstyled" hint="No border or background" />
    </div>
  ),
};

// ── 3. Sizes ────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] w-80">
      <Datepicker label="Small" size="sm" />
      <Datepicker label="Medium (default)" size="md" />
      <Datepicker label="Large" size="lg" />
    </div>
  ),
};

// ── 4. States ───────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] w-80">
      <Datepicker label="Default" hint="Normal resting state" />
      <Datepicker label="With value" defaultValue={new Date(2026, 2, 15)} />
      <Datepicker label="Error" errorMessage="Please select a valid date" />
      <Datepicker label="Disabled" disabled />
      <Datepicker label="Loading" isLoading />
      <Datepicker
        label="Min / Max constrained"
        min={new Date(2026, 2, 10)}
        max={new Date(2026, 2, 20)}
        hint="Only March 10–20, 2026 selectable"
      />
    </div>
  ),
};

// ── 5. DarkMode ─────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-[var(--spacing-layout-md)] rounded-[var(--radius-component-lg)] max-w-2xl">
      <div className="flex flex-col gap-[var(--spacing-layout-sm)] w-80">
        <Datepicker label="Dark mode" hint="Calendar adapts to dark theme" />
        <Datepicker label="With value" defaultValue={new Date(2026, 5, 1)} />
        <Datepicker label="Error state" errorMessage="Invalid date format" />
        <Datepicker label="Disabled" disabled />
      </div>
    </div>
  ),
};

// ── 7. Playground ───────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    label: 'Playground',
    hint: 'Use the controls to explore all props',
    placeholder: 'YYYY-MM-DD',
    size: 'md',
    variant: 'default',
    disabled: false,
    isLoading: false,
    firstDayOfWeek: 1,
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'filled', 'flushed', 'unstyled'] },
    firstDayOfWeek: { control: 'radio', options: [0, 1] },
    disabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    label: { control: 'text' },
    hint: { control: 'text' },
    errorMessage: { control: 'text' },
    placeholder: { control: 'text' },
  },
};

// ── 8. Accessibility ────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => {
    const ControlledExample = () => {
      const [date, setDate] = useState<Date | null>(new Date(2026, 2, 31));
      return (
        <div className="flex flex-col gap-[var(--spacing-layout-sm)] w-80">
          <Datepicker
            label="Accessible datepicker"
            hint="Full keyboard navigation: ArrowKeys, PageUp/Down, Enter, Escape"
            value={date}
            onChange={setDate}
            aria-label="Select appointment date"
          />
          <Datepicker
            label="Constrained range"
            min={new Date(2026, 0, 1)}
            max={new Date(2026, 11, 31)}
            hint="Only 2026 dates"
            aria-label="Select date within 2026"
          />
          <Datepicker
            label="Error state"
            errorMessage="Date is required"
            aria-label="Required date field"
          />
          <Datepicker
            label="Disabled"
            disabled
            aria-disabled={true}
            aria-label="Disabled date field"
          />
          <Datepicker
            label="Loading"
            isLoading
            aria-busy={true}
            aria-label="Loading date field"
          />
        </div>
      );
    };
    return <ControlledExample />;
  },
};
