import type { Meta, StoryObj } from '@storybook/react';
import { Phone, X, Info } from 'lucide-react';
import { ChatHeader } from './ChatHeader';
import { Button } from '../../atoms/Button/Button';

const meta: Meta<typeof ChatHeader> = {
  title: 'Molecules/ChatHeader',
  component: ChatHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    status: { control: 'select', options: ['online', 'away', 'offline'] },
    name: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof ChatHeader>;

const Actions = () => (
  <>
    <Button variant="ghost" size="sm" iconOnly leftIcon={<Phone size="var(--size-icon-sm)" />}>Call</Button>
    <Button variant="ghost" size="sm" iconOnly leftIcon={<Info size="var(--size-icon-sm)" />}>Info</Button>
    <Button variant="ghost" size="sm" iconOnly leftIcon={<X size="var(--size-icon-sm)" />}>Close</Button>
  </>
);

export const Default: Story = {
  args: {
    name: 'Sarah Reynolds',
    status: 'online',
    avatarInitials: 'SR',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-sm)]">
      <ChatHeader name="Sarah Reynolds" status="online" avatarInitials="SR" />
      <ChatHeader name="John Doe" status="away" avatarInitials="JD" />
      <ChatHeader name="Mike Chen" status="offline" avatarInitials="MC" />
    </div>
  ),
};

export const Sizes: Story = {
  name: 'With Actions',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-sm)]">
      <ChatHeader name="Sarah Reynolds" status="online" avatarInitials="SR" actions={<Actions />} />
      <ChatHeader name="John Doe" status="away" avatarInitials="JD" actions={<Actions />} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-sm)]">
      <div>
        <p className="text-label-sm text-secondary mb-2">Online</p>
        <ChatHeader name="Sarah Reynolds" status="online" avatarInitials="SR" actions={<Actions />} />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Away</p>
        <ChatHeader name="John Doe" status="away" avatarInitials="JD" />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Offline</p>
        <ChatHeader name="Mike Chen" status="offline" avatarInitials="MC" />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Long name (truncated)</p>
        <ChatHeader name="Alexandra Pemberton-Hughes de Villeneuve" status="online" avatarInitials="AP" />
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary rounded-[var(--radius-component-lg)] max-w-2xl overflow-hidden">
      <ChatHeader name="Sarah Reynolds" status="online" avatarInitials="SR" actions={<Actions />} />
      <ChatHeader name="John Doe" status="away" avatarInitials="JD" />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    name: 'Sarah Reynolds',
    status: 'online',
    avatarInitials: 'SR',
  },
};

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <ChatHeader
      name="Sarah Reynolds"
      status="online"
      avatarInitials="SR"
      actions={<Actions />}
    />
  ),
};
