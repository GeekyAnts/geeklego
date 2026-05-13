import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Atoms/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['solid', 'dashed', 'dotted'] },
  },
};
export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'solid',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-xs">
      <div>
        <span className="text-label-sm text-secondary mb-2 block">Solid</span>
        <Divider variant="solid" />
      </div>
      <div>
        <span className="text-label-sm text-secondary mb-2 block">Dashed</span>
        <Divider variant="dashed" />
      </div>
      <div>
        <span className="text-label-sm text-secondary mb-2 block">Dotted</span>
        <Divider variant="dotted" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  name: 'Orientations',
  render: () => (
    <div className="flex gap-8 items-stretch h-24">
      <div className="flex flex-col justify-center w-48">
        <span className="text-label-sm text-secondary mb-2">Horizontal</span>
        <Divider orientation="horizontal" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-label-sm text-secondary">Vertical</span>
        <Divider orientation="vertical" />
        <span className="text-body-sm text-primary">Content</span>
      </div>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <Divider variant="solid" />
      <Divider variant="dashed" />
      <Divider variant="dotted" />
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="flex flex-col gap-6 w-full max-w-2xl p-8 bg-primary rounded-[var(--radius-component-lg)]">
      <Divider variant="solid" />
      <Divider variant="dashed" />
      <Divider variant="dotted" />
    </div>
  ),
};

// ── 6. InContent ─────────────────────────────────────────────────────────────

export const InContent: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] w-full max-w-md">
      <div className="flex flex-col gap-[var(--spacing-component-md)]">
        <span className="text-label-sm text-[var(--color-text-secondary)]">Between prose blocks</span>
        <p className="text-body-sm text-[var(--color-text-primary)]">
          First section of content with some descriptive text that flows naturally.
        </p>
        <Divider variant="solid" />
        <p className="text-body-sm text-[var(--color-text-primary)]">
          Second section follows the divider with equal visual weight.
        </p>
        <Divider variant="dashed" />
        <p className="text-body-sm text-[var(--color-text-secondary)]">
          Third section uses a dashed divider for a lighter visual break.
        </p>
      </div>

      <div className="flex flex-col gap-[var(--spacing-component-md)] mt-[var(--spacing-layout-xs)]">
        <span className="text-label-sm text-[var(--color-text-secondary)]">Inline with text (vertical)</span>
        <div className="flex items-center gap-[var(--spacing-component-md)] h-6">
          <span className="text-body-sm text-[var(--color-text-secondary)]">Published</span>
          <Divider orientation="vertical" />
          <span className="text-body-sm text-[var(--color-text-secondary)]">May 11, 2026</span>
          <Divider orientation="vertical" />
          <span className="text-body-sm text-[var(--color-text-secondary)]">5 min read</span>
        </div>
      </div>

      <div className="flex flex-col gap-[var(--spacing-component-md)] mt-[var(--spacing-layout-xs)]">
        <span className="text-label-sm text-[var(--color-text-secondary)]">In a menu / nav sidebar</span>
        <div className="flex flex-col gap-[var(--spacing-component-xs)]">
          <span className="text-body-sm text-[var(--color-text-primary)]">Dashboard</span>
          <span className="text-body-sm text-[var(--color-text-primary)]">Projects</span>
          <Divider variant="solid" />
          <span className="text-body-sm text-[var(--color-text-secondary)]">Settings</span>
          <span className="text-body-sm text-[var(--color-text-secondary)]">Help</span>
        </div>
      </div>
    </div>
  ),
};

// ── 7. Playground ────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'solid',
  },
};

// ── 8. Accessibility ─────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)]">
      {/* Screen reader: "separator" with aria-orientation */}

      {/* Horizontal: role="separator" aria-orientation="horizontal" */}
      <Divider orientation="horizontal" />

      {/* Vertical: role="separator" aria-orientation="vertical" */}
      <div className="h-[var(--spacing-layout-sm)]">
        <Divider orientation="vertical" />
      </div>
    </div>
  ),
};
