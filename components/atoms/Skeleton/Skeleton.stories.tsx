import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';
import type { SkeletonVariant, SkeletonTextSize, SkeletonCircleSize } from './Skeleton.types';

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'box', 'circle'] satisfies SkeletonVariant[],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'] satisfies SkeletonTextSize[],
    },
    circleSize: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] satisfies SkeletonCircleSize[],
    },
    lines: {
      control: { type: 'number', min: 1, max: 10 },
    },
    animated: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <Skeleton variant="text" size="md" />
    </div>
  ),
};

// ── 2. Variants ───────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-80">
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">text — single line</span>
        <Skeleton variant="text" size="md" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">text — multiple lines</span>
        <Skeleton variant="text" size="md" lines={4} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">box</span>
        <Skeleton variant="box" height="var(--spacing-32)" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">circle</span>
        <Skeleton variant="circle" circleSize="md" />
      </div>
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────

const textSizes: SkeletonTextSize[] = ['sm', 'md', 'lg'];
const circleSizes: SkeletonCircleSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-80">
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Text line heights</span>
        <div className="flex flex-col gap-4">
          {textSizes.map((size) => (
            <div key={size} className="flex items-center gap-4">
              <span className="text-body-xs text-[var(--color-text-tertiary)] w-6 shrink-0">{size}</span>
              <div className="flex-1">
                <Skeleton variant="text" size={size} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Circle sizes</span>
        <div className="flex items-end gap-4 flex-wrap">
          {circleSizes.map((size) => (
            <div key={size} className="flex flex-col items-center gap-1">
              <Skeleton variant="circle" circleSize={size} />
              <span className="text-body-xs text-[var(--color-text-tertiary)]">{size}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-80">
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Animated (shimmer)</span>
        <Skeleton variant="text" size="md" animated={true} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Static (no shimmer)</span>
        <Skeleton variant="text" size="md" animated={false} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Custom width (50%)</span>
        <Skeleton variant="text" size="md" width="50%" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Card skeleton composition</span>
        <div className="flex gap-3 p-4 border border-[var(--color-border-subtle)] rounded-[var(--radius-component-md)]">
          <Skeleton variant="circle" circleSize="md" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton variant="text" size="md" width="60%" />
            <Skeleton variant="text" size="sm" />
            <Skeleton variant="text" size="sm" width="80%" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Image/media placeholder</span>
        <Skeleton variant="box" height="var(--spacing-40)" />
      </div>
    </div>
  ),
};

// ── 5. Dark Mode ──────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-8 rounded-lg max-w-2xl">
      <div className="flex flex-col gap-8 w-80">
        <div className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">text — multi-line</span>
          <Skeleton variant="text" size="md" lines={3} />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">box</span>
          <Skeleton variant="box" height="var(--spacing-32)" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">circles</span>
          <div className="flex items-end gap-4">
            {(['xs', 'sm', 'md', 'lg'] as SkeletonCircleSize[]).map((size) => (
              <Skeleton key={size} variant="circle" circleSize={size} />
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'text',
    size: 'md',
    lines: 1,
    animated: true,
  },
  render: (args) => (
    <div className="w-64">
      <Skeleton {...args} />
    </div>
  ),
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-8 w-80">
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Default — screen readers announce "Loading" via <code>role="status"</code>
        </span>
        <Skeleton variant="text" size="md" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Custom <code>aria-label</code> for context-specific announcement
        </span>
        <Skeleton variant="text" size="md" lines={2} aria-label="Loading user profile" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Avatar placeholder with meaningful label
        </span>
        <div className="flex items-center gap-3">
          <Skeleton variant="circle" circleSize="md" aria-label="Loading avatar" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton variant="text" size="md" width="60%" aria-label="Loading name" />
            <Skeleton variant="text" size="sm" aria-label="Loading email" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          <code>aria-busy={'{true}'}</code> always set — signals active loading to assistive tech
        </span>
        <Skeleton variant="box" height="var(--spacing-24)" aria-label="Loading image" />
      </div>
    </div>
  ),
};
