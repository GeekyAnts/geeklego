"use client"
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'Atoms/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    checked: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    children: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof Radio>;

/* ── Default ─────────────────────────────────────────────────────────────── */
export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState(false);
    return (
      <Radio
        {...args}
        checked={selected}
        onChange={(e) => setSelected(e.target.checked)}
      >
        Accept notifications
      </Radio>
    );
  },
  args: { size: 'md' },
};

/* ── Variants — unselected · selected ────────────────────────────────────── */
export const Variants: Story = {
  render: () => {
    const [picked, setPicked] = useState<string>('b');
    const opts = [
      { value: 'a', label: 'Unselected option' },
      { value: 'b', label: 'Selected option' },
      { value: 'c', label: 'Another option' },
    ];
    return (
      <div className="flex flex-col gap-[var(--spacing-component-lg)]">
        {opts.map((opt) => (
          <Radio
            key={opt.value}
            name="variants-demo"
            value={opt.value}
            checked={picked === opt.value}
            onChange={() => setPicked(opt.value)}
          >
            {opt.label}
          </Radio>
        ))}
        {/* Label-less — accessible via aria-label */}
        <Radio
          name="variants-demo-solo"
          value="solo"
          checked={false}
          onChange={() => {}}
          aria-label="Solo radio without visible label"
        />
      </div>
    );
  },
};

/* ── Sizes ───────────────────────────────────────────────────────────────── */
export const Sizes: Story = {
  render: () => {
    const [picked, setPicked] = useState<string>('md');
    return (
      <div className="flex flex-col gap-[var(--spacing-component-lg)]">
        <Radio
          name="size-demo"
          value="sm"
          size="sm"
          checked={picked === 'sm'}
          onChange={() => setPicked('sm')}
        >
          Small (14 px indicator)
        </Radio>
        <Radio
          name="size-demo"
          value="md"
          size="md"
          checked={picked === 'md'}
          onChange={() => setPicked('md')}
        >
          Medium (16 px indicator)
        </Radio>
        <Radio
          name="size-demo"
          value="lg"
          size="lg"
          checked={picked === 'lg'}
          onChange={() => setPicked('lg')}
        >
          Large (20 px indicator)
        </Radio>
      </div>
    );
  },
};

/* ── States ──────────────────────────────────────────────────────────────── */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)]">
      <Radio name="states-a" value="a" checked={false} onChange={() => {}}>
        Default (unselected)
      </Radio>
      <Radio name="states-b" value="b" checked onChange={() => {}}>
        Selected
      </Radio>
      <Radio name="states-c" value="c" checked={false} disabled onChange={() => {}}>
        Disabled unselected
      </Radio>
      <Radio name="states-d" value="d" checked disabled onChange={() => {}}>
        Disabled selected
      </Radio>
      <Radio name="states-e" value="e" checked={false} error onChange={() => {}}>
        Error unselected
      </Radio>
      <Radio name="states-f" value="f" checked error onChange={() => {}}>
        Error selected
      </Radio>
      <Radio name="states-g" value="g" checked={false} required onChange={() => {}}>
        Required field
      </Radio>
    </div>
  ),
};

/* ── Dark Mode ───────────────────────────────────────────────────────────── */
export const DarkMode: Story = {
  render: () => {
    const [picked, setPicked] = useState<string>('b');
    return (
      <div
        data-theme="dark"
        className="bg-primary p-[var(--spacing-component-xl)] rounded-[var(--radius-component-lg)] max-w-2xl"
      >
        <div className="flex flex-col gap-[var(--spacing-component-lg)]">
          <Radio
            name="dark-demo"
            value="a"
            checked={picked === 'a'}
            onChange={() => setPicked('a')}
          >
            Unselected in dark mode
          </Radio>
          <Radio
            name="dark-demo"
            value="b"
            checked={picked === 'b'}
            onChange={() => setPicked('b')}
          >
            Selected in dark mode
          </Radio>
          <Radio name="dark-disabled" value="c" checked={false} disabled onChange={() => {}}>
            Disabled in dark mode
          </Radio>
          <Radio name="dark-error" value="d" checked={false} error onChange={() => {}}>
            Error in dark mode
          </Radio>
        </div>
      </div>
    );
  },
};

// ── 6 · Grouped ──────────────────────────────────────────────────────────────

export const Grouped: Story = {
  render: () => {
    const [category, setCategory] = useState<string>('tech');
    return (
      <fieldset className="flex flex-col gap-[var(--spacing-component-lg)]">
        <legend className="text-heading-h6 font-medium text-[var(--color-text-primary)] mb-2">
          Product Category
        </legend>
        <div className="flex flex-col gap-[var(--spacing-component-md)]">
          <Radio
            name="category"
            value="tech"
            checked={category === 'tech'}
            onChange={() => setCategory('tech')}
          >
            Technology & Software
          </Radio>
          <Radio
            name="category"
            value="design"
            checked={category === 'design'}
            onChange={() => setCategory('design')}
          >
            Design & Creative Services
          </Radio>
          <Radio
            name="category"
            value="marketing"
            checked={category === 'marketing'}
            onChange={() => setCategory('marketing')}
          >
            Marketing & Business
          </Radio>
          <Radio
            name="category"
            value="other"
            checked={category === 'other'}
            onChange={() => setCategory('other')}
            disabled
          >
            Other (Coming Soon)
          </Radio>
        </div>
      </fieldset>
    );
  },
};

/* ── Playground ──────────────────────────────────────────────────────────── */
export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked ?? false);
    return (
      <Radio
        {...args}
        name="playground"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      >
        {args.children ?? 'Playground radio'}
      </Radio>
    );
  },
  args: {
    size: 'md',
    checked: false,
    error: false,
    disabled: false,
    required: false,
    children: 'Playground radio',
  },
};

/* ── Accessibility ───────────────────────────────────────────────────────── */
export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => {
    const [plan, setPlan] = useState<string>('pro');
    return (
      <div className="flex flex-col gap-[var(--spacing-component-lg)]">
        {/* Radio group — fieldset + legend for grouped controls */}
        <fieldset className="border-0 m-0 p-0">
          <legend className="text-body-md text-[var(--color-text-primary)] mb-[var(--spacing-component-md)]">
            Choose your plan
          </legend>
          <div className="flex flex-col gap-[var(--spacing-component-md)]">
            <Radio
              name="a11y-plan"
              value="free"
              checked={plan === 'free'}
              onChange={() => setPlan('free')}
              aria-describedby="free-hint"
            >
              Free
            </Radio>
            <p
              id="free-hint"
              className="text-body-sm text-[var(--color-text-secondary)] ms-[var(--spacing-component-xl)]"
            >
              Up to 3 projects, community support.
            </p>

            <Radio
              name="a11y-plan"
              value="pro"
              checked={plan === 'pro'}
              onChange={() => setPlan('pro')}
            >
              Pro
            </Radio>

            <Radio
              name="a11y-plan"
              value="enterprise"
              checked={plan === 'enterprise'}
              onChange={() => setPlan('enterprise')}
              aria-describedby="enterprise-hint"
            >
              Enterprise
            </Radio>
            <p
              id="enterprise-hint"
              className="text-body-sm text-[var(--color-text-secondary)] ms-[var(--spacing-component-xl)]"
            >
              Contact sales for custom pricing.
            </p>
          </div>
        </fieldset>

        {/* Error state */}
        <Radio
          name="a11y-error"
          value="x"
          checked={false}
          error
          onChange={() => {}}
          aria-describedby="payment-error"
        >
          Credit card
        </Radio>
        <p
          id="payment-error"
          className="text-body-sm text-[var(--color-border-error)] ms-[var(--spacing-component-xl)]"
          role="alert"
        >
          Please select a payment method.
        </p>

        {/* Label-less — accessible name via aria-label */}
        <Radio
          name="a11y-solo"
          value="solo"
          checked={false}
          onChange={() => {}}
          aria-label="Enable feature flag"
        />
      </div>
    );
  },
};
