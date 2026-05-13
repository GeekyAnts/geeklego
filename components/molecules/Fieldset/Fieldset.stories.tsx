import type { Meta, StoryObj } from '@storybook/react';
import { Fieldset } from './Fieldset';
import { Checkbox } from '../../atoms/Checkbox/Checkbox';
import { Radio } from '../../atoms/Radio/Radio';

const meta: Meta<typeof Fieldset> = {
  title: 'Molecules/Fieldset',
  component: Fieldset,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    legend: { control: 'text' },
    variant: { control: 'select', options: ['default', 'boxed'] },
    layout: { control: 'select', options: ['column', 'row'] },
    gap: { control: 'select', options: ['sm', 'md', 'lg'] },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Fieldset>;

// ── 1. Default ────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    legend: 'Notification preferences',
    hint: 'Choose how you want to receive updates.',
  },
  render: (args) => (
    <Fieldset {...args}>
      <Checkbox defaultChecked>Email notifications</Checkbox>
      <Checkbox>SMS notifications</Checkbox>
      <Checkbox>Push notifications</Checkbox>
    </Fieldset>
  ),
};

// ── 2. Variants ───────────────────────────────────────────────────────────────
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-md)]">
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] mb-2">default</p>
        <Fieldset legend="Account type" hint="Select the account that best fits your needs.">
          <Radio name="account-default" value="personal" defaultChecked>Personal</Radio>
          <Radio name="account-default" value="business">Business</Radio>
          <Radio name="account-default" value="enterprise">Enterprise</Radio>
        </Fieldset>
      </div>

      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] mb-2">boxed</p>
        <Fieldset
          legend="Account type"
          hint="Select the account that best fits your needs."
          variant="boxed"
        >
          <Radio name="account-boxed" value="personal" defaultChecked>Personal</Radio>
          <Radio name="account-boxed" value="business">Business</Radio>
          <Radio name="account-boxed" value="enterprise">Enterprise</Radio>
        </Fieldset>
      </div>
    </div>
  ),
};

// ── 3. Sizes (gap variations) ─────────────────────────────────────────────────
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-md)]">
      {(['sm', 'md', 'lg'] as const).map((g) => (
        <div key={g}>
          <p className="text-label-sm text-[var(--color-text-tertiary)] mb-2">gap="{g}"</p>
          <Fieldset legend="Interests" gap={g}>
            <Checkbox defaultChecked>Design</Checkbox>
            <Checkbox>Engineering</Checkbox>
            <Checkbox>Product</Checkbox>
          </Fieldset>
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-md)]">
      {/* Default — no hint/error */}
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] mb-2">default</p>
        <Fieldset legend="Shipping method">
          <Radio name="shipping-default" value="standard" defaultChecked>Standard (5-7 days)</Radio>
          <Radio name="shipping-default" value="express">Express (2-3 days)</Radio>
        </Fieldset>
      </div>

      {/* With hint */}
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] mb-2">with hint</p>
        <Fieldset legend="Shipping method" hint="Free standard shipping on orders over $50.">
          <Radio name="shipping-hint" value="standard" defaultChecked>Standard (5-7 days)</Radio>
          <Radio name="shipping-hint" value="express">Express (2-3 days)</Radio>
        </Fieldset>
      </div>

      {/* Required */}
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] mb-2">required</p>
        <Fieldset legend="Shipping method" required>
          <Radio name="shipping-required" value="standard" defaultChecked>Standard (5-7 days)</Radio>
          <Radio name="shipping-required" value="express">Express (2-3 days)</Radio>
        </Fieldset>
      </div>

      {/* Error */}
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] mb-2">error</p>
        <Fieldset
          legend="Notification preferences"
          required
          error="Please select at least one notification method."
        >
          <Checkbox>Email</Checkbox>
          <Checkbox>SMS</Checkbox>
          <Checkbox>Push</Checkbox>
        </Fieldset>
      </div>

      {/* Error + boxed */}
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] mb-2">error + boxed</p>
        <Fieldset
          legend="Notification preferences"
          required
          variant="boxed"
          error="Please select at least one notification method."
        >
          <Checkbox>Email</Checkbox>
          <Checkbox>SMS</Checkbox>
          <Checkbox>Push</Checkbox>
        </Fieldset>
      </div>

      {/* Disabled */}
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] mb-2">disabled</p>
        <Fieldset legend="Shipping method" hint="Shipping options are locked during checkout." disabled>
          <Radio name="shipping-disabled" value="standard" defaultChecked>Standard (5-7 days)</Radio>
          <Radio name="shipping-disabled" value="express">Express (2-3 days)</Radio>
        </Fieldset>
      </div>

      {/* Row layout */}
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] mb-2">row layout</p>
        <Fieldset legend="Preferred days" layout="row" gap="lg">
          <Checkbox>Monday</Checkbox>
          <Checkbox>Wednesday</Checkbox>
          <Checkbox>Friday</Checkbox>
        </Fieldset>
      </div>
    </div>
  ),
};

// ── 5. DarkMode ───────────────────────────────────────────────────────────────
export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-[var(--color-surface-default)] p-6 rounded-lg max-w-2xl">
      <div className="flex flex-col gap-[var(--spacing-layout-md)]">
        <Fieldset legend="Notification preferences" hint="Choose how you'd like to be notified.">
      <Checkbox defaultChecked>Email notifications</Checkbox>
      <Checkbox>SMS notifications</Checkbox>
      <Checkbox>Push notifications</Checkbox>
        </Fieldset>

        <Fieldset
          legend="Account type"
          variant="boxed"
          hint="Your plan determines your feature access."
          required
        >
          <Radio name="account-dark" value="personal" defaultChecked>Personal</Radio>
          <Radio name="account-dark" value="business">Business</Radio>
        </Fieldset>

        <Fieldset
          legend="Required selection"
          required
          error="Please select at least one option."
        >
          <Checkbox>Option A</Checkbox>
          <Checkbox>Option B</Checkbox>
        </Fieldset>
      </div>
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────
export const Playground: Story = {
  args: {
    legend: 'Preferred contact method',
    variant: 'default',
    layout: 'column',
    gap: 'md',
    hint: "We'll use this to reach you about your account.",
    error: '',
    required: false,
    disabled: false,
  },
  render: (args) => (
    <Fieldset {...args}>
      <Checkbox defaultChecked>Email</Checkbox>
      <Checkbox>Phone</Checkbox>
      <Checkbox>Post</Checkbox>
    </Fieldset>
  ),
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────
export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-lg)]">
      {/*
       * Keyboard: Tab moves focus into the group — each control is individually
       * focusable. Arrow keys navigate within same-name radio groups.
       * Screen reader: announces the legend text before each control label
       * (e.g., "Shipping method, Standard (5-7 days), radio button, 1 of 2").
       */}
      <Fieldset
        legend="Shipping method"
        required
        hint="Expedited options available at checkout."
        data-testid="fieldset-a11y"
      >
        <Radio
          name="shipping-a11y"
          value="standard"
          defaultChecked
          aria-describedby="standard-desc"
        >
          Standard (5-7 days)
        </Radio>
        <Radio
          name="shipping-a11y"
          value="express"
        >
          Express (2-3 days)
        </Radio>
      </Fieldset>

      {/*
       * Error state: role="alert" on the error paragraph causes screen readers
       * to announce the error immediately when it appears in the DOM.
       */}
      <Fieldset
        legend="Notification preferences"
        required
        error="Please select at least one notification method."
      >
        <Checkbox aria-required="true">Email</Checkbox>
        <Checkbox>SMS</Checkbox>
        <Checkbox>Push</Checkbox>
      </Fieldset>

      {/*
       * Disabled: <fieldset disabled> natively propagates disabled state to all
       * descendant controls. No extra aria-disabled threading needed.
       */}
      <Fieldset
        legend="Locked preferences"
        disabled
        hint="These settings are managed by your organisation."
      >
          <Checkbox defaultChecked>Read-only option A</Checkbox>
          <Checkbox>Read-only option B</Checkbox>
      </Fieldset>
    </div>
  ),
};
