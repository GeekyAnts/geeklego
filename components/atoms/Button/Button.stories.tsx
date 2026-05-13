import type { Meta, StoryObj } from '@storybook/react';
import { Plus, ArrowRight, Trash2, Download, Search, Settings, Copy } from 'lucide-react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
    },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

/* ── Default ──────────────────────────────────────────────────────────────── */
export const Default: Story = {
  args: { children: 'Get started', variant: 'primary', size: 'md' },
};

/* ── Variants — each uses a fundamentally different visual strategy ────────── */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="primary" leftIcon={<Download size="var(--size-icon-md)" />}>
        Primary
      </Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive" leftIcon={<Trash2 size="var(--size-icon-md)" />}>
        Destructive
      </Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

/* ── Sizes ──────────────────────────────────────────────────────────────────── */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-end">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <Button key={s} size={s}>
          {s.toUpperCase()}
        </Button>
      ))}
    </div>
  ),
};

/* ── States — every interactive state ────────────────────────────────────── */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-label-sm text-secondary mb-3">Default</p>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-3">Disabled</p>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary" disabled>Primary</Button>
          <Button variant="secondary" disabled>Secondary</Button>
          <Button variant="outline" disabled>Outline</Button>
          <Button variant="ghost" disabled>Ghost</Button>
          <Button variant="destructive" disabled>Destructive</Button>
          <Button variant="link" disabled>Link</Button>
        </div>
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-3">Loading (dimensions preserved)</p>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary" isLoading>Saving changes</Button>
          <Button variant="secondary" isLoading>Processing</Button>
          <Button variant="outline" isLoading>Loading</Button>
          <Button variant="destructive" isLoading>Deleting</Button>
        </div>
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-3">With icons</p>
        <div className="flex flex-wrap gap-3 items-center">
          <Button leftIcon={<Plus size="var(--size-icon-md)" />}>Add item</Button>
          <Button variant="secondary" rightIcon={<ArrowRight size="var(--size-icon-md)" />}>
            Continue
          </Button>
          <Button variant="outline" leftIcon={<Search size="var(--size-icon-md)" />}>
            Search
          </Button>
          <Button variant="ghost" leftIcon={<Copy size="var(--size-icon-md)" />}>
            Copy
          </Button>
          <Button variant="destructive" leftIcon={<Trash2 size="var(--size-icon-md)" />}>
            Delete
          </Button>
        </div>
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-3">Icon only — all sizes</p>
        <div className="flex flex-wrap gap-3 items-end">
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
            <Button
              key={s}
              size={s}
              iconOnly
              leftIcon={<Settings size={`var(--size-icon-${s})`} />}
            >
              Settings
            </Button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-3">Icon only — variants</p>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary" iconOnly leftIcon={<Plus size="var(--size-icon-md)" />}>Add</Button>
          <Button variant="secondary" iconOnly leftIcon={<Copy size="var(--size-icon-md)" />}>Copy</Button>
          <Button variant="outline" iconOnly leftIcon={<Search size="var(--size-icon-md)" />}>Search</Button>
          <Button variant="ghost" iconOnly leftIcon={<Settings size="var(--size-icon-md)" />}>Settings</Button>
          <Button variant="destructive" iconOnly leftIcon={<Trash2 size="var(--size-icon-md)" />}>Delete</Button>
        </div>
      </div>
    </div>
  ),
};

/* ── DarkMode ──────────────────────────────────────────────────────────────── */
export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-6 p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="primary" disabled>Disabled</Button>
        <Button variant="primary" isLoading>Loading</Button>
        <Button variant="primary" leftIcon={<Plus size="var(--size-icon-md)" />}>With icon</Button>
        <Button variant="primary" iconOnly leftIcon={<Settings size="var(--size-icon-md)" />}>Settings</Button>
      </div>
    </div>
  ),
};

/* ── Playground — all props as controls ────────────────────────────────────── */
export const Playground: Story = {
  args: {
    children: 'Click me',
    variant: 'primary',
    size: 'md',
    isLoading: false,
    disabled: false,
    iconOnly: false,
  },
};

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)]">
      {/* Keyboard: Tab to focus · Enter/Space to activate */}
      {/* Screen reader: "Save changes, button" | "Search, button" | "Cannot save, dimmed, button" | "Saving, busy, button" */}

      {/* Default: visible label provides accessible name */}
      <Button variant="primary">Save changes</Button>

      {/* Icon-only: aria-label provides the accessible name */}
      <Button variant="secondary" iconOnly aria-label="Search">
        <Search size="var(--size-icon-sm)" />
      </Button>

      {/* Disabled: both disabled + aria-disabled */}
      <Button variant="primary" disabled>
        Cannot save
      </Button>

      {/* Loading: aria-busy communicates async state */}
      <Button variant="primary" isLoading>
        Saving…
      </Button>
    </div>
  ),
};
