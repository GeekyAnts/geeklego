"use client"
import type { Meta, StoryObj } from '@storybook/react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Bookmark,
  Grid2x2,
  Italic,
  List,
  Underline,
} from 'lucide-react';
import { useState } from 'react';
import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Atoms/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost'],
      description: 'Visual treatment strategy',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Height and typography scale',
    },
    pressed: {
      control: 'boolean',
      description: 'Controlled pressed state',
    },
    defaultPressed: {
      control: 'boolean',
      description: 'Initial pressed state (uncontrolled)',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

// ── 1. Default ───────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    children: 'Bold',
    variant: 'default',
    size: 'md',
    defaultPressed: false,
  },
};

// ── 2. Variants ──────────────────────────────────────────────────────────────
// Shows each variant side-by-side in both unpressed and pressed states.
// Each variant uses a fundamentally different visual strategy.
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-body-sm text-[var(--color-text-tertiary)] mb-3">Default — muted fill at rest, accent tint when pressed</p>
        <div className="flex items-center gap-3">
          <Toggle variant="default">Unpressed</Toggle>
          <Toggle variant="default" pressed>Pressed</Toggle>
        </div>
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-tertiary)] mb-3">Outline — border always visible, fill appears on press</p>
        <div className="flex items-center gap-3">
          <Toggle variant="outline">Unpressed</Toggle>
          <Toggle variant="outline" pressed>Pressed</Toggle>
        </div>
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-tertiary)] mb-3">Ghost — invisible at rest, fill only on hover/press</p>
        <div className="flex items-center gap-3">
          <Toggle variant="ghost">Unpressed</Toggle>
          <Toggle variant="ghost" pressed>Pressed</Toggle>
        </div>
      </div>
    </div>
  ),
};

// ── 3. Sizes ─────────────────────────────────────────────────────────────────
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Toggle size="sm" variant="outline">Small</Toggle>
      <Toggle size="md" variant="outline">Medium</Toggle>
      <Toggle size="lg" variant="outline">Large</Toggle>
    </div>
  ),
};

// ── 4. States ────────────────────────────────────────────────────────────────
// Text toggles and icon-only toggles across all states.
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-body-sm text-[var(--color-text-tertiary)] mb-3">Text toggle</p>
        <div className="flex items-center gap-3">
          <Toggle variant="outline">Unpressed</Toggle>
          <Toggle variant="outline" pressed>Pressed</Toggle>
          <Toggle variant="outline" disabled>Disabled</Toggle>
          <Toggle variant="outline" pressed disabled>Pressed + Disabled</Toggle>
        </div>
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-tertiary)] mb-3">Icon-only toggle (aria-label required)</p>
        <div className="flex items-center gap-3">
          <Toggle variant="outline" aria-label="Bold">
            <span aria-hidden="true"><Bold size="var(--size-icon-sm)" /></span>
          </Toggle>
          <Toggle variant="outline" pressed aria-label="Bold (active)">
            <span aria-hidden="true"><Bold size="var(--size-icon-sm)" /></span>
          </Toggle>
          <Toggle variant="outline" disabled aria-label="Bold (disabled)">
            <span aria-hidden="true"><Bold size="var(--size-icon-sm)" /></span>
          </Toggle>
        </div>
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-tertiary)] mb-3">Icon + text toggle</p>
        <div className="flex items-center gap-3">
          <Toggle variant="outline">
            <span aria-hidden="true"><Grid2x2 size="var(--size-icon-sm)" /></span>
            Grid
          </Toggle>
          <Toggle variant="outline" pressed>
            <span aria-hidden="true"><List size="var(--size-icon-sm)" /></span>
            List
          </Toggle>
        </div>
      </div>
    </div>
  ),
};

// ── 5. Dark Mode ─────────────────────────────────────────────────────────────
export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-8 rounded-lg max-w-2xl">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Toggle variant="default">Default</Toggle>
        <Toggle variant="default" pressed>Default Pressed</Toggle>
        <Toggle variant="outline">Outline</Toggle>
        <Toggle variant="outline" pressed>Outline Pressed</Toggle>
        <Toggle variant="ghost">Ghost</Toggle>
        <Toggle variant="ghost" pressed>Ghost Pressed</Toggle>
        <Toggle variant="outline" disabled>Disabled</Toggle>
      </div>
      <div className="flex items-center gap-3">
        <Toggle variant="outline" aria-label="Bold">
          <span aria-hidden="true"><Bold size="var(--size-icon-sm)" /></span>
        </Toggle>
        <Toggle variant="outline" pressed aria-label="Italic (active)">
          <span aria-hidden="true"><Italic size="var(--size-icon-sm)" /></span>
        </Toggle>
        <Toggle variant="outline" aria-label="Underline">
          <span aria-hidden="true"><Underline size="var(--size-icon-sm)" /></span>
        </Toggle>
      </div>
    </div>
  ),
};

// ── 6. EdgeCases ─────────────────────────────────────────────────────────────
export const EdgeCases: Story = {
  render: () => {
    const [pressed1, setPressed1] = useState(false);
    const [pressed2, setPressed2] = useState(false);
    return (
      <div className="flex flex-col gap-[var(--spacing-layout-md)]">
        {/* Text toggle - long text */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Text with long label</p>
          <Toggle variant="default">This is a longer toggle label</Toggle>
        </div>

        {/* Icon-only toggles */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Icon-only toggles</p>
          <div className="flex gap-2">
            <Toggle variant="outline" aria-label="Bold">
              <span aria-hidden="true"><Bold size="var(--size-icon-sm)" /></span>
            </Toggle>
            <Toggle variant="outline" aria-label="Italic">
              <span aria-hidden="true"><Italic size="var(--size-icon-sm)" /></span>
            </Toggle>
            <Toggle variant="outline" aria-label="Underline">
              <span aria-hidden="true"><Underline size="var(--size-icon-sm)" /></span>
            </Toggle>
          </div>
        </div>

        {/* Mixed content (icon + text) */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Icon with text</p>
          <div className="flex gap-2">
            <Toggle variant="outline" pressed aria-label="Bookmark">
              <span aria-hidden="true"><Bookmark size="var(--size-icon-sm)" /></span>
              <span className="hidden sm:inline">Save</span>
            </Toggle>
          </div>
        </div>

        {/* Controlled state */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Controlled toggle</p>
          <Toggle
            pressed={pressed1}
            onPressedChange={setPressed1}
            variant="default"
          >
            {pressed1 ? 'Enabled' : 'Disabled'}
          </Toggle>
        </div>

        {/* Disabled state */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Disabled variants</p>
          <div className="flex gap-2">
            <Toggle variant="default" disabled>Default off</Toggle>
            <Toggle variant="default" disabled pressed>Default on</Toggle>
            <Toggle variant="outline" disabled>Outline off</Toggle>
            <Toggle variant="ghost" disabled pressed>Ghost on</Toggle>
          </div>
        </div>
      </div>
    );
  },
};

// ── 7. Playground ────────────────────────────────────────────────────────────
// Fully interactive with all args wired to controls.
export const Playground: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isPressed, setIsPressed] = useState(args.defaultPressed ?? false);
    return (
      <Toggle
        {...args}
        pressed={isPressed}
        onPressedChange={setIsPressed}
      >
        Toggle me
      </Toggle>
    );
  },
  args: {
    variant: 'default',
    size: 'md',
    defaultPressed: false,
    disabled: false,
  },
};

// ── 8. Accessibility ─────────────────────────────────────────────────────────
// Verifies aria-pressed, accessible names, keyboard operation, disabled state.
export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-6">
      {/* Icon-only — accessible name from aria-label */}
      <div>
        <p className="text-body-sm text-[var(--color-text-tertiary)] mb-3">
          Icon-only: aria-label provides the accessible name
        </p>
        <div className="flex items-center gap-3">
          <Toggle variant="outline" aria-label="Bold">
            <span aria-hidden="true"><Bold size="var(--size-icon-sm)" /></span>
          </Toggle>
          <Toggle variant="outline" pressed aria-label="Italic (currently active)">
            <span aria-hidden="true"><Italic size="var(--size-icon-sm)" /></span>
          </Toggle>
          <Toggle variant="outline" aria-label="Underline">
            <span aria-hidden="true"><Underline size="var(--size-icon-sm)" /></span>
          </Toggle>
        </div>
      </div>

      {/* Text — accessible name from children */}
      <div>
        <p className="text-body-sm text-[var(--color-text-tertiary)] mb-3">
          Text: children provides the accessible name; aria-pressed communicates state
        </p>
        <div className="flex items-center gap-3">
          <Toggle variant="outline">Grid view</Toggle>
          <Toggle variant="outline" pressed>List view (active)</Toggle>
        </div>
      </div>

      {/* Alignment group — real-world toolbar scenario */}
      <div>
        <p className="text-body-sm text-[var(--color-text-tertiary)] mb-3">
          Toolbar group: Tab to each button, Space/Enter to toggle
        </p>
        <div role="toolbar" aria-label="Text alignment" className="flex items-center gap-1">
          <Toggle variant="ghost" aria-label="Align left" pressed>
            <span aria-hidden="true"><AlignLeft size="var(--size-icon-sm)" /></span>
          </Toggle>
          <Toggle variant="ghost" aria-label="Align center">
            <span aria-hidden="true"><AlignCenter size="var(--size-icon-sm)" /></span>
          </Toggle>
          <Toggle variant="ghost" aria-label="Align right">
            <span aria-hidden="true"><AlignRight size="var(--size-icon-sm)" /></span>
          </Toggle>
        </div>
      </div>

      {/* Disabled */}
      <div>
        <p className="text-body-sm text-[var(--color-text-tertiary)] mb-3">
          Disabled: aria-disabled + native disabled, no hover/focus response
        </p>
        <div className="flex items-center gap-3">
          <Toggle variant="outline" disabled aria-disabled>
            Unavailable
          </Toggle>
          <Toggle variant="outline" pressed disabled aria-disabled>
            Locked active
          </Toggle>
        </div>
      </div>
    </div>
  ),
};
