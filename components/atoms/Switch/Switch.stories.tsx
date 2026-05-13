import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Atoms/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'success'],
      description: 'Track colour when checked.',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Track and thumb size.',
    },
    labelPosition: {
      control: { type: 'select' },
      options: ['left', 'right'],
      description: 'Where the label renders relative to the track.',
    },
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text', description: 'Label text.' },
    description: { control: 'text', description: 'Secondary description below the label.' },
  },
};
export default meta;
type Story = StoryObj<typeof Switch>;

// ── 1. Default ───────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    children: 'Email notifications',
    defaultChecked: false,
    variant: 'default',
    size: 'md',
  },
};

// ── 2. Variants ──────────────────────────────────────────────────────────────
// Each variant uses a different colour hue when checked, communicating distinct intent.
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
      <div className="flex flex-col gap-[var(--spacing-component-md)]">
        <p className="text-body-sm text-[var(--color-text-secondary)]">Default (accent colour)</p>
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <Switch variant="default" defaultChecked={false}>Notifications off</Switch>
          <Switch variant="default" defaultChecked>Notifications on</Switch>
        </div>
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-md)]">
        <p className="text-body-sm text-[var(--color-text-secondary)]">Success (green — feature enabled)</p>
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <Switch variant="success" defaultChecked={false}>Feature disabled</Switch>
          <Switch variant="success" defaultChecked>Feature enabled</Switch>
        </div>
      </div>
    </div>
  ),
};

// ── 3. Sizes ─────────────────────────────────────────────────────────────────
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-md)] items-start">
      <Switch size="sm" defaultChecked>Small (28×16)</Switch>
      <Switch size="md" defaultChecked>Medium (44×24)</Switch>
      <Switch size="lg" defaultChecked>Large (56×32)</Switch>
    </div>
  ),
};

// ── 4. States ────────────────────────────────────────────────────────────────
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-md)] items-start">
      <Switch defaultChecked={false}>Off (default)</Switch>
      <Switch defaultChecked>On (checked)</Switch>
      <Switch defaultChecked={false} disabled>Disabled off</Switch>
      <Switch defaultChecked disabled>Disabled on</Switch>
      <Switch defaultChecked description="With a secondary description below the label">
        With description
      </Switch>
      <Switch labelPosition="left" defaultChecked>Label on the left</Switch>
      <Switch aria-label="No visible label (icon-only style)" defaultChecked />
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
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <Switch defaultChecked={false}>Dark — off</Switch>
        <Switch defaultChecked>Dark — on</Switch>
        <Switch variant="success" defaultChecked>Dark — success</Switch>
        <Switch disabled defaultChecked={false}>Dark — disabled off</Switch>
        <Switch disabled defaultChecked>Dark — disabled on</Switch>
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <Switch size="sm" defaultChecked>Small</Switch>
        <Switch size="lg" defaultChecked>Large</Switch>
      </div>
    </div>
  ),
};

// ── 6. EdgeCases ─────────────────────────────────────────────────────────────
export const EdgeCases: Story = {
  render: () => {
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(true);
    return (
      <div className="flex flex-col gap-[var(--spacing-layout-md)]">
        {/* Long label text */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Long label that wraps</p>
          <Switch defaultChecked>
            Enable this feature which has a very long description that might wrap to multiple lines
          </Switch>
        </div>

        {/* With description text */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">With description</p>
          <Switch description="Additional context about this setting">
            Enable marketing emails
          </Switch>
        </div>

        {/* Left label position */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Label on left</p>
          <Switch labelPosition="left" defaultChecked>
            Dark mode
          </Switch>
        </div>

        {/* Controlled state */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Controlled state</p>
          <Switch checked={checked1} onChange={(checked) => setChecked1(checked)}>
            Feature flag (currently {checked1 ? 'enabled' : 'disabled'})
          </Switch>
        </div>

        {/* Disabled variations */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Disabled states</p>
          <Switch disabled>Disabled off</Switch>
          <Switch disabled defaultChecked>Disabled on</Switch>
        </div>
      </div>
    );
  },
};

// ── 7. Playground ────────────────────────────────────────────────────────────
export const Playground: Story = {
  args: {
    children: 'Enable notifications',
    description: 'Receive alerts about account activity.',
    variant: 'default',
    size: 'md',
    labelPosition: 'right',
    defaultChecked: false,
    disabled: false,
  },
};

// ── 8. Accessibility ─────────────────────────────────────────────────────────
export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)]">
      {/*
        Keyboard: Tab to focus · Space or Enter to toggle
        Screen reader: "[label], switch, on" / "[label], switch, off"
        When disabled: "[label], switch, dimmed, off" — no toggle possible
      */}

      {/* Labelled via children → aria-labelledby (recommended pattern) */}
      <Switch defaultChecked={false}>
        Accessible label via children
      </Switch>

      {/* With description → aria-describedby announces context after the label */}
      <Switch defaultChecked description="Sent once a day at 9 AM.">
        Morning digest
      </Switch>

      {/* Label on the left — same aria wiring, different visual position */}
      <Switch labelPosition="left" defaultChecked>
        Label on the left
      </Switch>

      {/* Icon-only / no children — must supply aria-label directly */}
      <Switch aria-label="Toggle dark mode" defaultChecked />

      {/* Disabled off — aria-disabled + disabled attribute both present */}
      <Switch disabled aria-disabled defaultChecked={false}>
        Disabled (off)
      </Switch>

      {/* Disabled on — shows that checked state is preserved but unresponsive */}
      <Switch disabled aria-disabled defaultChecked>
        Disabled (on)
      </Switch>
    </div>
  ),
};
