import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NumberInput } from './NumberInput';

const meta = {
  title: 'Molecules/NumberInput',
  component: NumberInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'NumberInput wraps an Input atom between decrement and increment stepper buttons, providing an accessible and theme-aware numeric entry control.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'flushed', 'unstyled'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    value: { control: 'number' },
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    value: 5,
    min: 0,
    max: 100,
    step: 1,
    'aria-label': 'Quantity',
  },
};

// ── 2. Variants ───────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => {
    const [val, setVal] = useState<number | string>(5);
    const handler = (e: React.ChangeEvent<HTMLInputElement>) => setVal(e.target.value);
    return (
      <div className="flex flex-col gap-[var(--spacing-component-lg)] max-w-xs">
        {(['default', 'filled', 'flushed'] as const).map((variant) => (
          <div key={variant} className="flex flex-col gap-[var(--spacing-component-xs)]">
            <span className="text-body-sm text-[var(--color-text-tertiary)]">{variant}</span>
            <NumberInput
              variant={variant}
              value={val}
              min={0}
              max={100}
              onChange={handler}
              aria-label={`Quantity ${variant}`}
            />
          </div>
        ))}
      </div>
    );
  },
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] max-w-xs">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-[var(--spacing-component-xs)]">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">{size}</span>
          <NumberInput size={size} value={3} min={0} max={10} aria-label={`Size ${size}`} />
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] max-w-xs">
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">default</span>
        <NumberInput value={5} min={0} max={10} aria-label="Default" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">at minimum (decrement disabled)</span>
        <NumberInput value={0} min={0} max={10} aria-label="At minimum" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">at maximum (increment disabled)</span>
        <NumberInput value={10} min={0} max={10} aria-label="At maximum" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">error</span>
        <NumberInput value={-1} min={0} error aria-label="Error state" aria-describedby="ni-error" />
        <span id="ni-error" className="text-body-sm text-[var(--color-text-error)]">
          Value must be 0 or above.
        </span>
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">disabled</span>
        <NumberInput value={5} disabled aria-label="Disabled" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">custom step (0.5)</span>
        <NumberInput value={1.5} step={0.5} min={0} max={5} aria-label="Custom step" />
      </div>
    </div>
  ),
};

// ── 5. DarkMode ───────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-[var(--spacing-component-lg)] p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <NumberInput value={5} min={0} max={100} aria-label="Dark default" />
      <NumberInput variant="filled" value={3} min={0} max={10} aria-label="Dark filled" />
      <NumberInput value={0} min={0} max={10} aria-label="Dark at minimum" />
      <NumberInput error value={-1} aria-label="Dark error" />
      <NumberInput disabled value={5} aria-label="Dark disabled" />
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    value: 5,
    min: 0,
    max: 100,
    step: 1,
    error: false,
    disabled: false,
    'aria-label': 'Playground number input',
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] p-[var(--spacing-layout-xs)] max-w-xs">
      {/*
        Keyboard: Tab enters decrement button → Tab to input → Tab to increment button
        Screen reader: Buttons announced as "Decrease value" / "Increase value" with aria-controls
        The inner <input type="number"> has aria-label + aria-invalid when error=true
        At-bound buttons: disabled + aria-disabled="true"
      */}

      {/* Fully labelled */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <label htmlFor="a11y-qty" className="text-body-sm font-medium text-[var(--color-text-primary)]">
          Quantity
        </label>
        <NumberInput
          id="a11y-qty"
          value={3}
          min={1}
          max={99}
          aria-label="Quantity"
        />
      </div>

      {/* With error — aria-invalid + aria-describedby */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <label htmlFor="a11y-seats" className="text-body-sm font-medium text-[var(--color-text-primary)]">
          Seats
        </label>
        <NumberInput
          id="a11y-seats"
          value={0}
          min={1}
          max={10}
          error
          aria-label="Number of seats"
          aria-describedby="seats-error"
        />
        <span id="seats-error" className="text-body-sm text-[var(--color-text-error)]">
          At least 1 seat required.
        </span>
      </div>

      {/* Disabled */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <label htmlFor="a11y-disabled" className="text-body-sm font-medium text-[var(--color-text-disabled)]">
          Unavailable
        </label>
        <NumberInput
          id="a11y-disabled"
          value={5}
          disabled
          aria-label="Unavailable quantity"
        />
      </div>
    </div>
  ),
};
