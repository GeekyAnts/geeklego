import type { Meta, StoryObj } from '@storybook/react';
import { ChatBubble } from './ChatBubble';

const meta: Meta<typeof ChatBubble> = {
  title: 'Atoms/ChatBubble',
  component: ChatBubble,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: ['sent', 'received', 'system'] },
  },
};
export default meta;
type Story = StoryObj<typeof ChatBubble>;

export const Default: Story = {
  args: {
    variant: 'received',
    timestamp: '2:34 PM',
    children: 'Hey! Are you free for a call later today?',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-md)] max-w-lg">
      <ChatBubble variant="received" timestamp="2:30 PM">
        Hey! Are you free for a call later today?
      </ChatBubble>
      <ChatBubble variant="sent" timestamp="2:31 PM">
        Sure, I'm available after 3pm!
      </ChatBubble>
      <ChatBubble variant="system">
        You are now connected
      </ChatBubble>
    </div>
  ),
};

export const MessageThread: Story = {
  name: 'Message Thread',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-sm)] max-w-lg w-full">
      <ChatBubble variant="received" timestamp="9:01 AM">
        Good morning! Did you get a chance to review the proposal?
      </ChatBubble>
      <ChatBubble variant="sent" timestamp="9:04 AM">
        Yes, I went through it last night. Overall it looks great!
      </ChatBubble>
      <ChatBubble variant="received" timestamp="9:05 AM">
        Awesome. Any sections you'd like to discuss in more detail?
      </ChatBubble>
      <ChatBubble variant="sent" timestamp="9:07 AM">
        The pricing section on page 4 — I think we can be more competitive.
      </ChatBubble>
      <ChatBubble variant="system">
        Maria left the conversation
      </ChatBubble>
      <ChatBubble variant="received" timestamp="9:12 AM">
        This is a very long message that should wrap to multiple lines without breaking the layout. It demonstrates how the bubble handles overflow text content gracefully.
      </ChatBubble>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] max-w-lg">
      <div>
        <p className="text-label-sm text-secondary mb-3">Default</p>
        <ChatBubble variant="received">Hello there!</ChatBubble>
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-3">With timestamp</p>
        <ChatBubble variant="sent" timestamp="3:45 PM">
          See you tomorrow!
        </ChatBubble>
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-3">Long content</p>
        <ChatBubble variant="received" timestamp="4:00 PM">
          This message contains a lot of text to verify that the bubble wraps correctly and respects the maximum width constraint while remaining visually comfortable to read.
        </ChatBubble>
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-3">System message</p>
        <ChatBubble variant="system">
          Encryption enabled — messages are end-to-end encrypted
        </ChatBubble>
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-[var(--spacing-component-sm)] p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <ChatBubble variant="received" timestamp="9:01 AM">
        Good morning! Did you get a chance to review the proposal?
      </ChatBubble>
      <ChatBubble variant="sent" timestamp="9:04 AM">
        Yes, I went through it last night. Overall it looks great!
      </ChatBubble>
      <ChatBubble variant="system">
        Maria joined the conversation
      </ChatBubble>
      <ChatBubble variant="received" timestamp="9:12 AM">
        Welcome, Maria! Let's get started.
      </ChatBubble>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'received',
    timestamp: '3:45 PM',
    children: 'Hey! How are you doing today?',
  },
};

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-md)] max-w-lg">
      {/* Bubble is a <div> — no focusable element; reading order is conveyed by DOM order */}
      {/* Timestamp uses <time> element for semantic date/time meaning */}
      {/* Screen reader reads: message content, then timestamp (caption-sm) */}
      <ChatBubble variant="received" timestamp="9:00 AM">
        Hello! This is a received message bubble.
      </ChatBubble>
      <ChatBubble variant="sent" timestamp="9:01 AM">
        This is a sent message bubble.
      </ChatBubble>
      <ChatBubble variant="system">
        System notification — no timestamp needed
      </ChatBubble>
    </div>
  ),
};
