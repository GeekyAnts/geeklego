import type { Meta, StoryObj } from '@storybook/react';
import { Phone, X, Info } from 'lucide-react';
import { Chat } from './Chat';
import { Button } from '../../atoms/Button/Button';
import type { ChatMessageData } from './Chat.types';

const meta: Meta<typeof Chat> = {
  title: 'Organisms/Chat',
  component: Chat,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    isTyping: { control: 'boolean' },
    loading: { control: 'boolean' },
    showAttach: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Chat>;

const ME = 'user-1';
const OTHER = 'user-2';

const PARTICIPANT = {
  name: 'Sarah Reynolds',
  status: 'online' as const,
  avatarInitials: 'SR',
};

const MESSAGES: ChatMessageData[] = [
  {
    id: '1',
    senderId: OTHER,
    senderName: 'Sarah',
    senderInitials: 'SR',
    content: 'Good morning! Did you get a chance to review the proposal?',
    timestamp: '9:01 AM',
    date: '2026-04-09',
  },
  {
    id: '2',
    senderId: ME,
    content: 'Yes, I went through it last night. Overall it looks great!',
    timestamp: '9:04 AM',
    date: '2026-04-09',
  },
  {
    id: '3',
    senderId: OTHER,
    senderName: 'Sarah',
    senderInitials: 'SR',
    content: 'Awesome. Any sections you would like to discuss in more detail?',
    timestamp: '9:05 AM',
    date: '2026-04-09',
  },
  {
    id: '4',
    senderId: ME,
    content: 'The pricing section — I think we can be more competitive.',
    timestamp: '9:07 AM',
    date: '2026-04-09',
  },
  {
    id: '5',
    senderId: OTHER,
    senderName: 'Sarah',
    senderInitials: 'SR',
    content: 'Great point! Let me rework those numbers and share a revised version.',
    timestamp: '9:09 AM',
    date: '2026-04-09',
  },
];

const HeaderActions = () => (
  <>
    <Button variant="ghost" size="sm" iconOnly leftIcon={<Phone size="var(--size-icon-sm)" />}>Call</Button>
    <Button variant="ghost" size="sm" iconOnly leftIcon={<Info size="var(--size-icon-sm)" />}>Info</Button>
    <Button variant="ghost" size="sm" iconOnly leftIcon={<X size="var(--size-icon-sm)" />}>Close</Button>
  </>
);

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-lg h-[600px] flex flex-col">
      <Chat
        messages={MESSAGES}
        currentUserId={ME}
        participant={PARTICIPANT}
        onSend={(msg) => console.log('Sent:', msg)}
        showAttach
        headerActions={<HeaderActions />}
        className="flex-1"
      />
    </div>
  ),
};

export const Variants: Story = {
  name: 'Typing Indicator',
  render: () => (
    <div className="w-full max-w-lg h-[600px] flex flex-col">
      <Chat
        messages={MESSAGES}
        currentUserId={ME}
        participant={PARTICIPANT}
        onSend={(msg) => console.log('Sent:', msg)}
        isTyping
        showAttach
        className="flex-1"
      />
    </div>
  ),
};

export const Sizes: Story = {
  name: 'Multi-Day Thread',
  render: () => (
    <div className="w-full max-w-lg h-[600px] flex flex-col">
      <Chat
        messages={[
          {
            id: 'a',
            senderId: OTHER,
            senderName: 'Sarah',
            senderInitials: 'SR',
            content: 'Quick update from yesterday',
            timestamp: '5:30 PM',
            date: '2026-04-08',
          },
          {
            id: 'b',
            senderId: ME,
            content: 'Got it, thanks!',
            timestamp: '5:45 PM',
            date: '2026-04-08',
          },
          ...MESSAGES,
        ]}
        currentUserId={ME}
        participant={PARTICIPANT}
        onSend={(msg) => console.log('Sent:', msg)}
        showAttach
        className="flex-1"
      />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      <div>
        <p className="text-label-sm text-secondary mb-3">Loading</p>
        <div className="w-full max-w-lg h-[400px] flex flex-col">
          <Chat messages={[]} currentUserId={ME} participant={PARTICIPANT} loading className="flex-1" />
        </div>
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-3">Empty — no messages</p>
        <div className="w-full max-w-lg h-[400px] flex flex-col">
          <Chat messages={[]} currentUserId={ME} participant={PARTICIPANT} className="flex-1" />
        </div>
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-6 rounded-[var(--radius-component-lg)] max-w-2xl">
      <div className="h-[500px] flex flex-col">
        <Chat
          messages={MESSAGES}
          currentUserId={ME}
          participant={PARTICIPANT}
          onSend={(msg) => console.log('Sent:', msg)}
          isTyping
          showAttach
          headerActions={<HeaderActions />}
          className="flex-1"
        />
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    messages: MESSAGES,
    currentUserId: ME,
    participant: PARTICIPANT,
    isTyping: false,
    loading: false,
    showAttach: true,
  },
  render: (args) => (
    <div className="w-full max-w-lg h-[600px] flex flex-col">
      <Chat {...args} className="flex-1" onSend={(msg) => console.log('Sent:', msg)} />
    </div>
  ),
};

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="w-full max-w-lg h-[600px] flex flex-col">
      <Chat
        messages={MESSAGES}
        currentUserId={ME}
        participant={PARTICIPANT}
        onSend={(msg) => console.log('Sent:', msg)}
        showAttach
        headerActions={<HeaderActions />}
        className="flex-1"
      />
    </div>
  ),
};

// ── 8. Edge Cases ─────────────────────────────────────────────────────────────

const LONG_MESSAGES: ChatMessageData[] = [
  {
    id: 'e1',
    senderId: OTHER,
    senderName: 'Sarah',
    senderInitials: 'SR',
    content: 'This is a very long message that should wrap gracefully across multiple lines without breaking the layout of the chat container. It goes on for quite a while to really stress-test the word-wrapping and overflow behaviour of the bubble component.',
    timestamp: '10:00 AM',
    date: '2026-05-11',
  },
  {
    id: 'e2',
    senderId: ME,
    content: '🎉🎊🥳🎈✨🎂🎁🎀',
    timestamp: '10:01 AM',
    date: '2026-05-11',
  },
  {
    id: 'e3',
    senderId: OTHER,
    senderName: 'Sarah',
    senderInitials: 'SR',
    content: 'Short reply.',
    timestamp: '10:02 AM',
    date: '2026-05-11',
  },
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `e${i + 4}`,
    senderId: i % 2 === 0 ? ME : OTHER,
    senderName: i % 2 === 0 ? undefined : 'Sarah',
    senderInitials: i % 2 === 0 ? undefined : 'SR',
    content: `Message ${i + 1} — scroll stress test`,
    timestamp: `10:${String(i + 3).padStart(2, '0')} AM`,
    date: '2026-05-11',
  })),
];

export const EdgeCases: Story = {
  render: () => (
    <div className="w-full max-w-lg h-[600px] flex flex-col">
      <Chat
        messages={LONG_MESSAGES}
        currentUserId={ME}
        participant={PARTICIPANT}
        onSend={(msg) => console.log('Sent:', msg)}
        showAttach
        className="flex-1"
      />
    </div>
  ),
};
