"use client"
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Rating } from './Rating';

const meta: Meta<typeof Rating> = {
  title: 'Atoms/Rating',
  component: Rating,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Current rating value (0 = unrated).',
    },
    max: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Total number of stars.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    readOnly: { control: 'boolean' },
    disabled: { control: 'boolean' },
    showLabel: { control: 'boolean' },
    label: { control: 'text' },
    schema: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(3);
    return (
      <Rating
        {...args}
        value={value}
        onChange={setValue}
        label="Rate your experience"
        showLabel
      />
    );
  },
  args: {
    max: 5,
    size: 'md',
  },
};

// ── 2. Variants (Interactive vs Read-only) ────────────────────────────────────

export const Variants: Story = {
  name: 'Variants',
  render: () => {
    const [value, setValue] = useState(3);
    return (
      <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-label-sm text-secondary">Interactive — radio group pattern</p>
          <Rating value={value} onChange={setValue} label="Rate this product" showLabel />
          <p className="text-body-xs text-tertiary">Selected: {value} / 5</p>
        </div>

        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-label-sm text-secondary">Read-only — display only</p>
          <Rating value={4} readOnly label="Product rating" />
          <p className="text-body-xs text-tertiary">No hover, no selection — SR reads "4 out of 5 stars"</p>
        </div>

        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-label-sm text-secondary">Unrated (value=0)</p>
          <Rating value={0} onChange={() => {}} label="Not yet rated" />
          <p className="text-body-xs text-tertiary">All stars empty at rest</p>
        </div>
      </div>
    );
  },
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <p className="text-label-sm text-secondary">sm — 16px stars</p>
        <Rating value={3} readOnly size="sm" label="Small rating" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <p className="text-label-sm text-secondary">md — 20px stars (default)</p>
        <Rating value={3} readOnly size="md" label="Medium rating" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <p className="text-label-sm text-secondary">lg — 24px stars</p>
        <Rating value={3} readOnly size="lg" label="Large rating" />
      </div>
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    return (
      <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
        <div className="flex flex-col gap-[var(--spacing-component-xs)]">
          <p className="text-label-sm text-secondary">Unrated (value=0) — hover to preview</p>
          <Rating value={value} onChange={setValue} label="Unrated" />
        </div>

        <div className="flex flex-col gap-[var(--spacing-component-xs)]">
          <p className="text-label-sm text-secondary">Partially rated (3/5)</p>
          <Rating value={3} onChange={() => {}} label="Partial rating" />
        </div>

        <div className="flex flex-col gap-[var(--spacing-component-xs)]">
          <p className="text-label-sm text-secondary">Full rating (5/5)</p>
          <Rating value={5} onChange={() => {}} label="Full rating" />
        </div>

        <div className="flex flex-col gap-[var(--spacing-component-xs)]">
          <p className="text-label-sm text-secondary">Read-only (non-interactive)</p>
          <Rating value={4} readOnly label="Read-only rating" />
        </div>

        <div className="flex flex-col gap-[var(--spacing-component-xs)]">
          <p className="text-label-sm text-secondary">Disabled — muted, no interaction</p>
          <Rating value={3} disabled onChange={() => {}} label="Disabled rating" />
        </div>

        <div className="flex flex-col gap-[var(--spacing-component-xs)]">
          <p className="text-label-sm text-secondary">With visible label</p>
          <Rating value={4} onChange={() => {}} label="How satisfied were you?" showLabel />
        </div>
      </div>
    );
  },
};

// ── 5. Dark Mode ──────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  name: 'Dark Mode',
  render: () => {
    const [value, setValue] = useState(3);
    return (
      <div
        data-theme="dark"
        className="bg-primary p-[var(--spacing-layout-md)] rounded-[var(--radius-component-xl)] max-w-2xl"
      >
        <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <p className="text-label-sm text-secondary">Interactive in dark mode</p>
            <Rating
              value={value}
              onChange={setValue}
              label="Rate your experience"
              showLabel
            />
          </div>

          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <p className="text-label-sm text-secondary">Read-only in dark mode</p>
            <Rating value={4} readOnly label="Product rating" />
          </div>

          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <p className="text-label-sm text-secondary">Disabled in dark mode</p>
            <Rating value={2} disabled onChange={() => {}} label="Disabled" />
          </div>
        </div>
      </div>
    );
  },
};

// ── 6. EdgeCases ──────────────────────────────────────────────────────────────

export const EdgeCases: Story = {
  render: () => {
    const [value1, setValue1] = useState(0);
    const [value2, setValue2] = useState(5);
    const [value3, setValue3] = useState(2);
    return (
      <div className="flex flex-col gap-[var(--spacing-layout-md)]">
        {/* No rating (zero) */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">No rating yet</p>
          <Rating value={value1} onChange={setValue1} label="Rate this product" />
        </div>

        {/* Perfect rating */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Perfect rating (5/5)</p>
          <Rating value={value2} onChange={setValue2} label="Perfect score" />
        </div>

        {/* Read-only with tooltip */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Read-only (customer review)</p>
          <Rating value={4} readOnly label="Customer rating" />
        </div>

        {/* Disabled state */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Disabled</p>
          <Rating value={value3} disabled onChange={() => {}} label="Cannot rate" />
        </div>
      </div>
    );
  },
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value ?? 0);
    return (
      <Rating
        {...args}
        value={value}
        onChange={setValue}
      />
    );
  },
  args: {
    max: 5,
    size: 'md',
    readOnly: false,
    disabled: false,
    label: 'Rate this product',
    showLabel: true,
    schema: false,
    value: 0,
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => {
    const [rating1, setRating1] = useState(0);
    const [rating2, setRating2] = useState(3);
    return (
      <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
        <div>
          <p className="text-body-md text-primary mb-[var(--spacing-component-sm)]">
            Interactive rating — radio group pattern
          </p>
          <p className="text-body-sm text-secondary mb-[var(--spacing-component-md)]">
            Screen readers announce the group label from the <code>{'<legend>'}</code>. Each star
            is announced as "N out of M stars, radio button". Arrow keys navigate between stars.
            Enter or Space selects the focused star.
          </p>
          <Rating
            value={rating1}
            onChange={setRating1}
            label="Rate your overall experience"
            showLabel
            name="experience-rating"
          />
        </div>

        <div>
          <p className="text-body-md text-primary mb-[var(--spacing-component-sm)]">
            Pre-selected rating — also keyboard-navigable
          </p>
          <Rating
            value={rating2}
            onChange={setRating2}
            label="Rate product quality"
            showLabel
            name="quality-rating"
          />
        </div>

        <div>
          <p className="text-body-md text-primary mb-[var(--spacing-component-sm)]">
            Read-only display — single <code>{'<span role="img">'}</code>
          </p>
          <p className="text-body-sm text-secondary mb-[var(--spacing-component-md)]">
            Screen readers announce "4 out of 5 stars". Not focusable — purely informational.
          </p>
          <Rating
            value={4}
            readOnly
            label="Average customer rating"
          />
        </div>

        <div>
          <p className="text-body-md text-primary mb-[var(--spacing-component-sm)]">
            Disabled — announced as "dimmed, unavailable"
          </p>
          <Rating
            value={2}
            disabled
            onChange={() => {}}
            label="Rating unavailable"
            showLabel
          />
        </div>
      </div>
    );
  },
};
