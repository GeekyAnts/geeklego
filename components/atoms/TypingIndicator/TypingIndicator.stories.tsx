import type { Meta, StoryObj } from '@storybook/react';
import { TypingIndicator } from './TypingIndicator';

const meta: Meta<typeof TypingIndicator> = {
  title: 'Atoms/TypingIndicator',
  component: TypingIndicator,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    name: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof TypingIndicator>;

export const Default: Story = {
  args: {},
};

export const WithName: Story = {
  name: 'With Name',
  args: { name: 'Sarah' },
};

export const InContext: Story = {
  name: 'In Context',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-sm)] max-w-xs">
      <div className="flex justify-end">
        <div className="bg-[var(--color-action-primary)] text-[var(--color-text-on-primary)] rounded-[var(--radius-component-lg)] px-[var(--spacing-component-lg)] py-[var(--spacing-component-sm)] text-body-sm ms-auto max-w-[80%]">
          Sounds great, I will send the file now!
        </div>
      </div>
      <TypingIndicator name="Sarah" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] items-start">
      <div>
        <p className="text-label-sm text-secondary mb-3">Visible — dots animating</p>
        <TypingIndicator />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-3">With sender name</p>
        <TypingIndicator name="Alice" />
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-[var(--spacing-component-md)] p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <TypingIndicator />
      <TypingIndicator name="Sarah" />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    name: 'Sarah',
  },
};

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-md)]">
      {/* role="status" + aria-live="polite" — screen reader announces when indicator mounts */}
      {/* sr-only text: "Sarah is typing…" — dots are aria-hidden */}
      <TypingIndicator name="Sarah" />
      {/* Without name: "Typing…" */}
      <TypingIndicator />
    </div>
  ),
};
