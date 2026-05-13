import type { Meta, StoryObj } from '@storybook/react';
import { Building2, Bot, Crown } from 'lucide-react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['image', 'initials', 'icon', 'fallback'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    shape: { control: 'select', options: ['circle', 'rounded'] },
    bordered: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    variant: 'initials',
    initials: 'GL',
    size: 'lg',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Avatar variant="image" src="https://i.pravatar.cc/80?u=avatar1" alt="User" size="lg" />
      <Avatar variant="initials" initials="GL" size="lg" />
      <Avatar variant="icon" icon={<Crown />} size="lg" />
      <Avatar variant="fallback" size="lg" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
        <Avatar key={size} variant="initials" initials="GL" size={size} />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Avatar variant="initials" initials="GL" size="lg" />
      <Avatar variant="initials" initials="GL" size="lg" bordered />
      <Avatar variant="image" src="https://i.pravatar.cc/80?u=avatar2" alt="User" size="lg" bordered />
      <Avatar variant="icon" icon={<Building2 />} size="lg" shape="rounded" />
      <Avatar variant="image" src="https://broken-url.invalid/img.png" alt="Broken" size="lg" />
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="flex flex-wrap gap-4 items-center p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl">
      <Avatar variant="image" src="https://i.pravatar.cc/80?u=dark1" alt="User" size="lg" />
      <Avatar variant="initials" initials="DK" size="lg" />
      <Avatar variant="icon" icon={<Bot />} size="lg" />
      <Avatar variant="fallback" size="lg" />
      <Avatar variant="initials" initials="BD" size="lg" bordered />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'initials',
    initials: 'GL',
    size: 'lg',
    shape: 'circle',
    bordered: false,
  },
};

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)]">
      {/* Screen reader: "User avatar, image" (initials/fallback) | img alt text (image variant) */}

      {/* Image variant: alt text provides the accessible name */}
      <Avatar variant="image" src="https://i.pravatar.cc/80?u=a11y" alt="Jane Doe" size="lg" />

      {/* Initials variant: role="img" + aria-label with initials */}
      <Avatar variant="initials" initials="JD" size="lg" />

      {/* Fallback variant: role="img" + aria-label defaults to "User avatar" */}
      <Avatar variant="fallback" size="lg" />

      {/* Icon variant: role="img" + aria-label, icon is aria-hidden */}
      <Avatar variant="icon" icon={<Crown size="var(--size-icon-md)" />} size="lg" />
    </div>
  ),
};
