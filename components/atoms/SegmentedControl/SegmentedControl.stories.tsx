"use client"
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Grid, List, Map, LayoutGrid, AlignLeft, AlignCenter, AlignRight, Sun, Moon, Laptop } from 'lucide-react';
import { SegmentedControl } from './SegmentedControl';
import type { SegmentedControlProps } from './SegmentedControl.types';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Atoms/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

// ─── Shared option sets ────────────────────────────────────────────────────────

const viewOptions = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'map', label: 'Map' },
];

const timeOptions = [
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
  { value: '1y', label: '1y' },
];

const iconOptions = [
  {
    value: 'grid',
    icon: <Grid size="var(--size-icon-sm)" />,
    'aria-label': 'Grid view',
  },
  {
    value: 'list',
    icon: <List size="var(--size-icon-sm)" />,
    'aria-label': 'List view',
  },
  {
    value: 'map',
    icon: <Map size="var(--size-icon-sm)" />,
    'aria-label': 'Map view',
  },
];

const iconTextOptions = [
  { value: 'grid', label: 'Grid', icon: <Grid size="var(--size-icon-sm)" /> },
  { value: 'list', label: 'List', icon: <List size="var(--size-icon-sm)" /> },
  { value: 'map', label: 'Map', icon: <Map size="var(--size-icon-sm)" /> },
];

// ─── 1. Default ───────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    options: viewOptions,
    defaultValue: 'grid',
    'aria-label': 'View mode',
  },
};

// ─── 2. Variants ─────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <p className="text-body-sm text-[var(--color-text-secondary)]">default — surface-pop selection</p>
        <SegmentedControl options={viewOptions} defaultValue="grid" aria-label="View mode" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <p className="text-body-sm text-[var(--color-text-secondary)]">outline — accent-fill selection</p>
        <SegmentedControl options={viewOptions} defaultValue="grid" variant="outline" aria-label="View mode" />
      </div>
    </div>
  ),
};

// ─── 3. Sizes ─────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
      {(['sm', 'md', 'lg'] as const).map((sz) => (
        <div key={sz} className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm text-[var(--color-text-secondary)]">{sz}</p>
          <SegmentedControl options={timeOptions} defaultValue="30d" size={sz} aria-label="Time range" />
        </div>
      ))}
    </div>
  ),
};

// ─── 4. States ───────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => {
    const ControlledExample = () => {
      const [value, setValue] = useState('list');
      return (
        <SegmentedControl
          options={viewOptions}
          value={value}
          onChange={setValue}
          aria-label="View mode (controlled)"
        />
      );
    };

    return (
      <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm text-[var(--color-text-secondary)]">Uncontrolled — first selected</p>
          <SegmentedControl options={viewOptions} defaultValue="grid" aria-label="View mode" />
        </div>
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm text-[var(--color-text-secondary)]">Controlled — reacts to external state</p>
          <ControlledExample />
        </div>
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm text-[var(--color-text-secondary)]">Icon-only segments</p>
          <SegmentedControl options={iconOptions} defaultValue="grid" aria-label="View mode" />
        </div>
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm text-[var(--color-text-secondary)]">Icon + text</p>
          <SegmentedControl options={iconTextOptions} defaultValue="grid" aria-label="View mode" />
        </div>
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm text-[var(--color-text-secondary)]">Individual option disabled</p>
          <SegmentedControl
            options={[
              { value: 'grid', label: 'Grid' },
              { value: 'list', label: 'List', disabled: true },
              { value: 'map', label: 'Map' },
            ]}
            defaultValue="grid"
            aria-label="View mode"
          />
        </div>
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm text-[var(--color-text-secondary)]">Disabled (entire group)</p>
          <SegmentedControl options={viewOptions} defaultValue="grid" disabled aria-label="View mode" />
        </div>
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm text-[var(--color-text-secondary)]">Full width</p>
          <SegmentedControl options={viewOptions} defaultValue="grid" fullWidth aria-label="View mode" />
        </div>
      </div>
    );
  },
};

// ─── 5. DarkMode ──────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-[var(--spacing-layout-xs)] p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <SegmentedControl options={viewOptions} defaultValue="grid" aria-label="View mode" />
      <SegmentedControl options={viewOptions} defaultValue="list" variant="outline" aria-label="View mode" />
      <SegmentedControl options={iconOptions} defaultValue="grid" aria-label="View mode" />
      <SegmentedControl options={viewOptions} defaultValue="grid" disabled aria-label="View mode" />
    </div>
  ),
};

// ─── 6. EdgeCases ────────────────────────────────────────────────────────────

export const EdgeCases: Story = {
  render: () => {
    const [value1, setValue1] = useState('grid');
    const [value2, setValue2] = useState('list');
    return (
      <div className="flex flex-col gap-[var(--spacing-layout-md)]">
        {/* Very long option labels */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Long labels (wrapped)</p>
          <SegmentedControl
            options={[
              { value: 'option1', label: 'This is a very long option label' },
              { value: 'option2', label: 'Another lengthy description here' },
            ]}
            defaultValue="option1"
            aria-label="Long option test"
          />
        </div>

        {/* Full width variant */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Full width layout</p>
          <SegmentedControl
            options={viewOptions}
            defaultValue="grid"
            fullWidth
            aria-label="View mode"
          />
        </div>

        {/* Single selected state persistence */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Interactive selection</p>
          <SegmentedControl
            options={viewOptions}
            value={value1}
            onChange={setValue1}
            aria-label="View mode"
          />
          <p className="text-caption-sm text-[var(--color-text-secondary)]">Selected: {value1}</p>
        </div>

        {/* Outline variant interactive */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Outline variant</p>
          <SegmentedControl
            options={viewOptions}
            value={value2}
            onChange={setValue2}
            variant="outline"
            aria-label="View mode"
          />
        </div>
      </div>
    );
  },
};

// ─── 7. Playground ───────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    options: viewOptions,
    defaultValue: 'grid',
    variant: 'default',
    size: 'md',
    disabled: false,
    fullWidth: false,
    'aria-label': 'View mode',
  },
};

// ─── 8. Accessibility ─────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => {
    const AlignmentControl = () => {
      const [align, setAlign] = useState('left');
      return (
        <SegmentedControl
          options={[
            { value: 'left', icon: <AlignLeft size="var(--size-icon-sm)" />, 'aria-label': 'Align left' },
            { value: 'center', icon: <AlignCenter size="var(--size-icon-sm)" />, 'aria-label': 'Align center' },
            { value: 'right', icon: <AlignRight size="var(--size-icon-sm)" />, 'aria-label': 'Align right' },
          ]}
          value={align}
          onChange={setAlign}
          aria-label="Text alignment"
        />
      );
    };

    return (
      <div className="flex flex-col gap-[var(--spacing-layout-xs)] p-[var(--spacing-layout-xs)]">
        {/*
          Keyboard: Tab enters group → focuses selected segment.
          Arrow Left / Right moves focus AND selection between segments.
          Home / End jumps to first / last segment.
          Space / Enter selects the focused segment.
          Screen reader: "[label], pressed, button" | "[label], button"
        */}

        {/* Text labels — group accessible name via aria-label */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm text-[var(--color-text-secondary)]">
            Text segments — group label: "Time range"
          </p>
          <SegmentedControl
            options={timeOptions}
            defaultValue="30d"
            aria-label="Time range"
          />
        </div>

        {/* Icon-only — each segment needs its own aria-label */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm text-[var(--color-text-secondary)]">
            Icon-only — each segment aria-label: "Grid view", "List view", "Map view"
          </p>
          <AlignmentControl />
        </div>

        {/* Individual option disabled */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm text-[var(--color-text-secondary)]">
            Individual disabled segment — aria-disabled="true", skipped by roving tabindex (dark option disabled)
          </p>
          <SegmentedControl
            options={[
              { value: 'light', label: 'Light', icon: <Sun size="var(--size-icon-sm)" /> },
              { value: 'dark', label: 'Dark', icon: <Moon size="var(--size-icon-sm)" />, disabled: true },
              { value: 'system', label: 'System', icon: <Laptop size="var(--size-icon-sm)" /> },
            ]}
            defaultValue="light"
            aria-label="Theme preference"
          />
        </div>

        {/* Entire group disabled */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm text-[var(--color-text-secondary)]">
            Group disabled — aria-disabled on container, all segments non-interactive
          </p>
          <SegmentedControl
            options={viewOptions}
            defaultValue="grid"
            disabled
            aria-label="View mode (disabled)"
          />
        </div>

        {/* outline variant for contrast check */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm text-[var(--color-text-secondary)]">
            outline variant — selected uses accent fill with inverse text (contrast ≥ 4.5:1)
          </p>
          <SegmentedControl
            options={viewOptions}
            defaultValue="grid"
            variant="outline"
            aria-label="View mode"
          />
        </div>
      </div>
    );
  },
};
