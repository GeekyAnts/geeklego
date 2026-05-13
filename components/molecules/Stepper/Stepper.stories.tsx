import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from './Stepper';
import type { StepItem } from './Stepper.types';

const meta: Meta<typeof Stepper> = {
  title: 'Molecules/Stepper',
  component: Stepper,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['numbered', 'dotted'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    activeStep: {
      control: { type: 'number', min: 0 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

// ── Fixtures ──────────────────────────────────────────────────────────────────

const CHECKOUT_STEPS: StepItem[] = [
  { id: 'cart',     label: 'Cart',        description: 'Review your items' },
  { id: 'shipping', label: 'Shipping',    description: 'Delivery details' },
  { id: 'payment',  label: 'Payment',     description: 'Billing information' },
  { id: 'review',   label: 'Review',      description: 'Confirm your order' },
];

const SIMPLE_STEPS: StepItem[] = [
  { id: 'step-1', label: 'Step 1' },
  { id: 'step-2', label: 'Step 2' },
  { id: 'step-3', label: 'Step 3' },
  { id: 'step-4', label: 'Step 4' },
  { id: 'step-5', label: 'Step 5' },
];

const ERROR_STEPS: StepItem[] = [
  { id: 'info',    label: 'Personal info',   description: 'Name and contact' },
  { id: 'address', label: 'Address',         description: 'Delivery details', status: 'error' },
  { id: 'confirm', label: 'Confirmation',    description: 'Review and submit' },
];

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    steps: CHECKOUT_STEPS,
    activeStep: 1,
    variant: 'numbered',
    orientation: 'horizontal',
    size: 'md',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Numbered — horizontal
        </p>
        <Stepper steps={CHECKOUT_STEPS} activeStep={2} variant="numbered" />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Dotted — horizontal
        </p>
        <Stepper steps={SIMPLE_STEPS} activeStep={2} variant="dotted" />
      </div>
      <div className="flex gap-[var(--spacing-layout-lg)]">
        <div className="flex-1">
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            Numbered — vertical
          </p>
          <Stepper steps={CHECKOUT_STEPS} activeStep={1} orientation="vertical" variant="numbered" />
        </div>
        <div className="flex-1">
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            Dotted — vertical
          </p>
          <Stepper steps={CHECKOUT_STEPS} activeStep={2} orientation="vertical" variant="dotted" />
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            {size.toUpperCase()}
          </p>
          <Stepper steps={CHECKOUT_STEPS} activeStep={1} size={size} />
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          All upcoming (activeStep=0)
        </p>
        <Stepper steps={CHECKOUT_STEPS} activeStep={0} />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Mixed — some completed, one active (activeStep=2)
        </p>
        <Stepper steps={CHECKOUT_STEPS} activeStep={2} />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          All completed (activeStep beyond last)
        </p>
        <Stepper steps={CHECKOUT_STEPS} activeStep={4} />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Error step override
        </p>
        <Stepper steps={ERROR_STEPS} activeStep={1} />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Clickable steps (onStepClick provided)
        </p>
        <Stepper
          steps={CHECKOUT_STEPS}
          activeStep={2}
          onStepClick={(i) => console.log('Clicked step', i)}
        />
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl flex flex-col gap-[var(--spacing-layout-sm)]"
    >
      <Stepper steps={CHECKOUT_STEPS} activeStep={2} />
      <Stepper steps={ERROR_STEPS} activeStep={1} />
      <Stepper
        steps={CHECKOUT_STEPS}
        activeStep={1}
        orientation="vertical"
        className="max-w-xs"
      />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    steps: CHECKOUT_STEPS,
    activeStep: 1,
    variant: 'numbered',
    orientation: 'horizontal',
    size: 'md',
  },
};

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] p-[var(--spacing-layout-xs)]">
      {/*
        Keyboard: Tab to focus clickable step buttons · Enter/Space to activate
        Screen reader:
          <ol aria-label="Steps"> announces as "Steps, list, 4 items"
          Active step: "2" / "Step 2", current step button
          Completed step: "✓ (Completed)" SR suffix
          Error step: "! (Error)" SR suffix
      */}

      {/* Display-only: aria-current="step" on active indicator span */}
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-3">
          Display-only — aria-current="step" marks the active indicator
        </p>
        <Stepper
          steps={CHECKOUT_STEPS}
          activeStep={1}
          i18nStrings={{
            listLabel: 'Checkout steps',
            completedLabel: '(Completed)',
            errorLabel: '(Error)',
          }}
        />
      </div>

      {/* Clickable: completed + active become <button> with aria-current */}
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-3">
          Interactive — completed and active steps are keyboard-focusable buttons
        </p>
        <Stepper
          steps={CHECKOUT_STEPS}
          activeStep={2}
          onStepClick={(i) => console.log('Navigate to step', i)}
          i18nStrings={{ listLabel: 'Order progress' }}
        />
      </div>

      {/* Error state */}
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-3">
          Error state — screen reader announces "(Error)" suffix
        </p>
        <Stepper
          steps={ERROR_STEPS}
          activeStep={1}
          i18nStrings={{ listLabel: 'Registration steps', errorLabel: '(Error — please fix)' }}
        />
      </div>
    </div>
  ),
};
