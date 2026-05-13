import type { Meta, StoryObj } from '@storybook/react';
import { ChatInputBar } from './ChatInputBar';

const meta: Meta<typeof ChatInputBar> = {
  title: 'Molecules/ChatInputBar',
  component: ChatInputBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    showAttach: { control: 'boolean' },
    disabled: { control: 'boolean' },
    maxLength: { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<typeof ChatInputBar>;

export const Default: Story = {
  args: {
    showAttach: true,
    onSend: (msg: string) => console.log('Sent:', msg),
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-md)]">
      <div>
        <p className="text-label-sm text-secondary mb-2">With attachment button</p>
        <ChatInputBar showAttach onSend={(msg) => console.log('Sent:', msg)} />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Without attachment button</p>
        <ChatInputBar showAttach={false} onSend={(msg) => console.log('Sent:', msg)} />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  name: 'With Max Length',
  args: {
    showAttach: true,
    maxLength: 160,
    onSend: (msg: string) => console.log('Sent:', msg),
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-md)]">
      <div>
        <p className="text-label-sm text-secondary mb-2">Default (empty — send disabled)</p>
        <ChatInputBar showAttach />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Disabled</p>
        <ChatInputBar showAttach disabled />
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary rounded-[var(--radius-component-lg)] max-w-2xl overflow-hidden">
      <ChatInputBar showAttach onSend={(msg) => console.log('Sent:', msg)} />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    showAttach: true,
    disabled: false,
    onSend: (msg: string) => console.log('Sent:', msg),
  },
};

export const CustomStrings: Story = {
  name: 'Custom i18n Strings',
  args: {
    showAttach: true,
    onSend: (msg: string) => console.log('Sent:', msg),
    i18nStrings: {
      placeholder: 'Send a message...',
      sendLabel: 'Send',
      attachLabel: 'Attach file',
    },
  },
};

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <ChatInputBar
      showAttach
      onSend={(msg) => console.log('Sent:', msg)}
    />
  ),
};
