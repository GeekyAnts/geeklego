import type { Meta, StoryObj } from '@storybook/react';
import { ChatMessage } from './ChatMessage';

const meta: Meta<typeof ChatMessage> = {
  title: 'Molecules/ChatMessage',
  component: ChatMessage,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    alignment: { control: 'select', options: ['sent', 'received'] },
    showName: { control: 'boolean' },
  },
  decorators: [(Story) => <ul className="flex flex-col gap-[var(--chat-message-row-gap)] list-none p-0 m-0 max-w-lg"><Story /></ul>],
};
export default meta;
type Story = StoryObj<typeof ChatMessage>;

export const Default: Story = {
  args: {
    alignment: 'received',
    children: 'Hey! Are you free for a call later today?',
    timestamp: '2:34 PM',
    avatarInitials: 'SR',
    senderName: 'Sarah',
  },
};

export const Variants: Story = {
  render: () => (
    <>
      <ChatMessage alignment="received" avatarInitials="SR" senderName="Sarah" timestamp="9:01 AM">
        Good morning! Did you get a chance to review the proposal?
      </ChatMessage>
      <ChatMessage alignment="sent" timestamp="9:04 AM">
        Yes, I went through it last night. Overall it looks great!
      </ChatMessage>
    </>
  ),
};

export const Thread: Story = {
  render: () => (
    <>
      <ChatMessage alignment="received" avatarInitials="SR" senderName="Sarah" showName timestamp="9:01 AM">
        Good morning! Did you get a chance to review the proposal?
      </ChatMessage>
      <ChatMessage alignment="sent" timestamp="9:04 AM">
        Yes, I went through it last night. Overall it looks great!
      </ChatMessage>
      <ChatMessage alignment="received" avatarInitials="SR" senderName="Sarah" timestamp="9:05 AM">
        Awesome. Any sections you'd like to discuss in more detail?
      </ChatMessage>
      <ChatMessage alignment="sent" timestamp="9:07 AM">
        The pricing section on page 4 — I think we can be more competitive.
      </ChatMessage>
    </>
  ),
};

export const States: Story = {
  render: () => (
    <>
      <ChatMessage alignment="received" avatarInitials="JD" senderName="John" showName timestamp="10:00 AM">
        With sender name shown above bubble
      </ChatMessage>
      <ChatMessage alignment="received" avatarInitials="JD" senderName="John" timestamp="10:01 AM">
        Without sender name (consecutive messages from same sender)
      </ChatMessage>
      <ChatMessage alignment="sent" timestamp="10:02 AM">
        Sent — right-aligned, no avatar
      </ChatMessage>
      <ChatMessage alignment="sent">
        Sent — no timestamp
      </ChatMessage>
    </>
  ),
};

export const DarkMode: Story = {
  decorators: [(Story) => (
    <div data-theme="dark" className="p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl">
      <ul className="flex flex-col gap-[var(--chat-message-row-gap)] list-none p-0 m-0">
        <Story />
      </ul>
    </div>
  )],
  render: () => (
    <>
      <ChatMessage alignment="received" avatarInitials="SR" senderName="Sarah" showName timestamp="9:01 AM">
        Good morning! Did you get a chance to review the proposal?
      </ChatMessage>
      <ChatMessage alignment="sent" timestamp="9:04 AM">
        Yes! Looks great overall.
      </ChatMessage>
    </>
  ),
};

export const LongContent: Story = {
  render: () => (
    <>
      <ChatMessage
        alignment="received"
        avatarInitials="JDSK"
        senderName="Jonathan David Smithson Kowalski"
        showName
        timestamp="9:01 AM"
      >
        This is a very long message that contains lots of text to demonstrate how the chat message
        component handles multi-line content. The text should wrap naturally across multiple lines
        whilst keeping proper alignment with the avatar.
      </ChatMessage>
      <ChatMessage alignment="sent" timestamp="9:02 AM">
        Reply with medium length that also wraps but represents a sent message instead of received.
      </ChatMessage>
      <ChatMessage alignment="received" avatarInitials="AB" senderName="A" timestamp="9:03 AM">
        Short.
      </ChatMessage>
    </>
  ),
};

export const Playground: Story = {
  args: {
    alignment: 'received',
    children: 'Hey! How are you doing today?',
    timestamp: '3:45 PM',
    senderName: 'Sarah',
    showName: true,
    avatarInitials: 'SR',
  },
};

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <>
      {/* <li> element — correct list item semantics in <ul role="list"> */}
      {/* Avatar has alt={senderName} for screen readers */}
      {/* Sender name is aria-hidden (avatar alt provides the name) */}
      {/* ChatBubble content is read in DOM order */}
      <ChatMessage alignment="received" avatarInitials="SR" senderName="Sarah" showName timestamp="9:01 AM">
        Hello! This message has full accessibility: avatar alt, sender name, timestamp.
      </ChatMessage>
      <ChatMessage alignment="sent" timestamp="9:02 AM">
        Sent message — no avatar. Timestamp via time element.
      </ChatMessage>
    </>
  ),
};
