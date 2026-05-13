import type { Meta, StoryObj } from '@storybook/react';
import { DateInput } from './DateInput';

const meta: Meta<typeof DateInput> = {
  title: 'Molecules/DateInput',
  component: DateInput,
  parameters: {
    layout: 'padded',
  },
  args: {
    label: 'Date of birth',
    hint: 'Use the format MM/DD/YYYY',
    size: 'md',
    variant: 'default',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'flushed', 'unstyled'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    hint: { control: 'text' },
    errorMessage: { control: 'text' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof DateInput>;

// ── 1. Default ─────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    label: 'Date of birth',
    hint: 'Use the format MM/DD/YYYY',
  },
};

// ── 2. Variants ────────────────────────────────────────────────────────────
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-sm">
      <DateInput label="Default variant" variant="default" hint="Outlined border at rest" />
      <DateInput label="Filled variant" variant="filled" hint="Muted background, no border" />
      <DateInput label="Flushed variant" variant="flushed" hint="Bottom border only" />
      <DateInput label="Unstyled variant" variant="unstyled" hint="No border, no background" />
    </div>
  ),
};

// ── 3. Sizes ───────────────────────────────────────────────────────────────
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-sm">
      <DateInput label="Small" size="sm" hint="Height: 32px" />
      <DateInput label="Medium (default)" size="md" hint="Height: 40px" />
      <DateInput label="Large" size="lg" hint="Height: 48px" />
    </div>
  ),
};

// ── 4. States ──────────────────────────────────────────────────────────────
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-sm">
      <DateInput
        label="Default"
        hint="Helper text appears here"
      />
      <DateInput
        label="With value"
        defaultValue="2026-03-25"
        hint="Pre-filled date"
      />
      <DateInput
        label="Error state"
        errorMessage="Please enter a valid date"
        defaultValue="2026-13-45"
      />
      <DateInput
        label="Disabled"
        hint="This field cannot be edited"
        disabled
        defaultValue="2026-03-25"
      />
      <DateInput
        label="Loading"
        hint="Fetching allowed date range…"
        isLoading
      />
      <DateInput
        label="Required field"
        hint="This field is required"
        required
      />
    </div>
  ),
};

// ── 5. Dark mode ───────────────────────────────────────────────────────────
export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-8 rounded-lg max-w-2xl">
      <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-sm">
        <DateInput label="Date of birth" hint="Use the format MM/DD/YYYY" />
        <DateInput
          label="Start date"
          errorMessage="Date must be in the future"
          defaultValue="2020-01-01"
        />
        <DateInput label="End date" disabled defaultValue="2026-12-31" />
      </div>
    </div>
  ),
};

// ── 7. Playground ──────────────────────────────────────────────────────────
export const Playground: Story = {
  args: {
    label: 'Date of birth',
    hint: 'Use the format MM/DD/YYYY',
    errorMessage: '',
    size: 'md',
    variant: 'default',
    disabled: false,
    required: false,
    isLoading: false,
  },
};

// ── 8. Accessibility ───────────────────────────────────────────────────────
export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-sm">
      {/* label linked via htmlFor → input id */}
      <DateInput
        id="dob-field"
        label="Date of birth"
        hint="Your birth date is used to verify age eligibility"
        required
      />

      {/* Error state: role="alert" on error <p>, aria-describedby on input */}
      <DateInput
        id="start-date-field"
        label="Start date"
        errorMessage="Date must not be in the past"
        required
        aria-invalid="true"
      />

      {/* Disabled: mirrors aria-disabled on Input + Label */}
      <DateInput
        id="locked-date-field"
        label="Locked date"
        hint="This date is set by your administrator and cannot be changed"
        disabled
        defaultValue="2026-06-01"
      />
    </div>
  ),
};
