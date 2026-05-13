"use client"
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Atoms/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Track height and thumb size.',
    },
    min: { control: { type: 'number' }, description: 'Minimum value.' },
    max: { control: { type: 'number' }, description: 'Maximum value.' },
    step: { control: { type: 'number' }, description: 'Step increment.' },
    value: { control: { type: 'number' }, description: 'Controlled value.' },
    defaultValue: { control: { type: 'number' }, description: 'Uncontrolled initial value.' },
    disabled: { control: 'boolean' },
    label: { control: 'text', description: 'Visible label above the slider.' },
    showValue: { control: 'boolean', description: 'Show numeric value next to label.' },
  },
};
export default meta;
type Story = StoryObj<typeof Slider>;

// ── 1. Default ────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    label: 'Volume',
    defaultValue: 40,
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

// ── 2. Sizes ──────────────────────────────────────────────────────────────────
// Track height and thumb size scale together: sm (2px / 14px), md (4px / 16px), lg (8px / 20px).
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] w-80">
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <p className="text-body-sm text-[var(--color-text-secondary)]">Small — 2px track · 14px thumb</p>
        <Slider size="sm" label="Brightness" defaultValue={60} />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <p className="text-body-sm text-[var(--color-text-secondary)]">Medium (default) — 4px track · 16px thumb</p>
        <Slider size="md" label="Volume" defaultValue={60} />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <p className="text-body-sm text-[var(--color-text-secondary)]">Large — 8px track · 20px thumb</p>
        <Slider size="lg" label="Bass" defaultValue={60} />
      </div>
    </div>
  ),
};

// ── 3. States ─────────────────────────────────────────────────────────────────
// Demonstrates all visual states: empty fill, partial fill, full fill, disabled, value display, and label-less usage.
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] w-80">
      <Slider label="Empty (0%)" defaultValue={0} />
      <Slider label="Half (50%)" defaultValue={50} />
      <Slider label="Full (100%)" defaultValue={100} />
      <Slider label="Disabled" defaultValue={50} disabled />
      <Slider label="With value display" defaultValue={72} showValue />
      {/* No visible label — aria-label provides the accessible name */}
      <Slider aria-label="Brightness (no visible label)" defaultValue={30} />
    </div>
  ),
};

// ── 4. Controlled ─────────────────────────────────────────────────────────────
// Two sliders share the same state — changing one updates both, demonstrating the controlled pattern.
export const Controlled: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(40);
    return (
      <div className="flex flex-col gap-[var(--spacing-layout-xs)] w-80">
        <p className="text-body-sm text-[var(--color-text-secondary)]">
          Both sliders share the same controlled value: <strong>{value}</strong>
        </p>
        <Slider
          label="Primary"
          value={value}
          onChange={setValue}
          showValue
        />
        <Slider
          label="Linked"
          value={value}
          onChange={setValue}
          showValue
        />
      </div>
    );
  },
};

// ── 5. DarkMode ───────────────────────────────────────────────────────────────
export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-[var(--spacing-component-lg)] p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl w-80"
    >
      <Slider label="Volume" defaultValue={55} showValue />
      <Slider label="Disabled" defaultValue={40} disabled />
      <Slider size="sm" label="Small track" defaultValue={70} />
      <Slider size="lg" label="Large track" defaultValue={30} />
    </div>
  ),
};

// ── 6. Range ─────────────────────────────────────────────────────────────────
// Number formatting: demonstrates decimal precision and large numbers.
export const Range: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] w-80">
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <p className="text-body-sm text-[var(--color-text-secondary)]">Temperature range — decimal step</p>
        <Slider label="Temperature" min={16} max={32} step={0.5} defaultValue={22} showValue />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <p className="text-body-sm text-[var(--color-text-secondary)]">Price range — large numbers</p>
        <Slider label="Budget" min={0} max={5000} step={100} defaultValue={2500} showValue />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <p className="text-body-sm text-[var(--color-text-secondary)]">Percentage with small steps</p>
        <Slider label="Discount" min={0} max={100} step={5} defaultValue={50} showValue />
      </div>
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────
export const Playground: Story = {
  args: {
    label: 'Volume',
    defaultValue: 40,
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
    disabled: false,
    showValue: false,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────
/*
 * Keyboard interaction (all native, no JS hooks needed):
 *   Tab / Shift+Tab    — focus / blur the slider
 *   ArrowRight / Up    — increase value by `step`
 *   ArrowLeft / Down   — decrease value by `step`
 *   Home               — set to min
 *   End                — set to max
 *   PageUp             — increase by 10× step (browser default)
 *   PageDown           — decrease by 10× step (browser default)
 *
 * Screen reader announcement on focus:
 *   "[label], slider, [value], [min] to [max]"
 * On value change:
 *   "[new value]" (aria-valuenow + aria-valuetext)
 */
export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)] w-80">

      {/* Labelled via label prop → aria-labelledby (recommended pattern) */}
      <Slider label="Volume" defaultValue={40} />

      {/* showValue: the numeric display has aria-hidden="true".
          The real value reaches AT via aria-valuenow + aria-valuetext on the input. */}
      <Slider label="Brightness" defaultValue={65} showValue />

      {/* No visible label — aria-label supplies the accessible name directly */}
      <Slider aria-label="Bass level" defaultValue={30} />

      {/* Disabled: both `disabled` attribute and `aria-disabled` are present.
          Native `disabled` removes the element from tab order;
          `aria-disabled` additionally announces the state to AT. */}
      <Slider label="Treble (disabled)" defaultValue={50} disabled aria-disabled />

      {/* Custom step — AT announces each increment when navigating with arrow keys */}
      <Slider label="Temperature (°C)" min={16} max={30} step={0.5} defaultValue={22} showValue />

    </div>
  ),
};
