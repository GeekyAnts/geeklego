import type { Meta, StoryObj } from '@storybook/react';
import { AlignCenter, AlignLeft, AlignRight, Bold, Copy, Download, Italic, Strikethrough, Trash2, Underline } from 'lucide-react';
import { Button } from '../../atoms/Button/Button';
import { ButtonGroup } from './ButtonGroup';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Molecules/ButtonGroup',
  component: ButtonGroup,
  parameters: { layout: 'centered' },
  argTypes: {
    variant:     { control: 'select', options: ['attached', 'spaced'] },
    orientation: { control: 'radio',  options: ['horizontal', 'vertical'] },
  },
};
export default meta;
type Story = StoryObj<typeof ButtonGroup>;

// ── 1. Default ────────────────────────────────────────────────────────────────
export const Default: Story = {
  name: 'Default',
  render: () => (
    <ButtonGroup aria-label="Text alignment">
      <Button variant="outline" leftIcon={<AlignLeft size="var(--size-icon-sm)" />} iconOnly>Align left</Button>
      <Button variant="outline" leftIcon={<AlignCenter size="var(--size-icon-sm)" />} iconOnly>Align centre</Button>
      <Button variant="outline" leftIcon={<AlignRight size="var(--size-icon-sm)" />} iconOnly>Align right</Button>
    </ButtonGroup>
  ),
};

// ── 2. Variants ───────────────────────────────────────────────────────────────
export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xl)] items-start">
      {/* attached */}
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <p className="text-label-sm text-secondary">attached (default)</p>
        <ButtonGroup variant="attached" aria-label="Primary actions">
          <Button variant="primary">Save</Button>
          <Button variant="primary" leftIcon={<Copy size="var(--size-icon-sm)" />} iconOnly>Duplicate</Button>
          <Button variant="primary" leftIcon={<Trash2 size="var(--size-icon-sm)" />} iconOnly>Delete</Button>
        </ButtonGroup>
        <ButtonGroup variant="attached" aria-label="Outline actions">
          <Button variant="outline">Cancel</Button>
          <Button variant="outline">Preview</Button>
          <Button variant="outline">Submit</Button>
        </ButtonGroup>
        <ButtonGroup variant="attached" aria-label="Secondary actions">
          <Button variant="secondary">Left</Button>
          <Button variant="secondary">Centre</Button>
          <Button variant="secondary">Right</Button>
        </ButtonGroup>
      </div>
      {/* spaced */}
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <p className="text-label-sm text-secondary">spaced</p>
        <ButtonGroup variant="spaced" aria-label="Page actions">
          <Button variant="outline">Back</Button>
          <Button variant="primary">Continue</Button>
        </ButtonGroup>
        <ButtonGroup variant="spaced" aria-label="Destructive workflow">
          <Button variant="ghost">Cancel</Button>
          <Button variant="destructive">Delete account</Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────
export const Sizes: Story = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xl)] items-start">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-label-sm text-secondary">{size}</p>
          <ButtonGroup aria-label={`Size ${size} group`}>
            <Button variant="outline" size={size}>Option A</Button>
            <Button variant="outline" size={size}>Option B</Button>
            <Button variant="outline" size={size}>Option C</Button>
          </ButtonGroup>
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────
export const States: Story = {
  name: 'States',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xl)] items-start">
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <p className="text-label-sm text-secondary">Default</p>
        <ButtonGroup aria-label="Default state">
          <Button variant="outline">Bold</Button>
          <Button variant="outline">Italic</Button>
          <Button variant="outline">Underline</Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <p className="text-label-sm text-secondary">With disabled button</p>
        <ButtonGroup aria-label="Mixed disabled state">
          <Button variant="outline">Bold</Button>
          <Button variant="outline" disabled>Italic (disabled)</Button>
          <Button variant="outline">Underline</Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <p className="text-label-sm text-secondary">With loading button</p>
        <ButtonGroup aria-label="Mixed loading state">
          <Button variant="primary">Save</Button>
          <Button variant="primary" isLoading>Saving…</Button>
          <Button variant="primary">Discard</Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <p className="text-label-sm text-secondary">All buttons disabled</p>
        <ButtonGroup aria-label="All disabled">
          <Button variant="outline" disabled>Bold</Button>
          <Button variant="outline" disabled>Italic</Button>
          <Button variant="outline" disabled>Underline</Button>
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <p className="text-label-sm text-secondary">Vertical orientation</p>
        <ButtonGroup orientation="vertical" aria-label="Vertical actions">
          <Button variant="outline" leftIcon={<Download size="var(--size-icon-sm)" />}>Download PDF</Button>
          <Button variant="outline" leftIcon={<Copy size="var(--size-icon-sm)" />}>Copy link</Button>
          <Button variant="outline" leftIcon={<Trash2 size="var(--size-icon-sm)" />}>Delete</Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};

// ── 5. Dark mode ──────────────────────────────────────────────────────────────
export const DarkMode: Story = {
  name: 'Dark Mode',
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-[var(--spacing-component-xl)] items-start p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <ButtonGroup aria-label="Text formatting">
        <Button variant="outline" leftIcon={<Bold size="var(--size-icon-sm)" />} iconOnly>Bold</Button>
        <Button variant="outline" leftIcon={<Italic size="var(--size-icon-sm)" />} iconOnly>Italic</Button>
        <Button variant="outline" leftIcon={<Underline size="var(--size-icon-sm)" />} iconOnly>Underline</Button>
        <Button variant="outline" leftIcon={<Strikethrough size="var(--size-icon-sm)" />} iconOnly>Strikethrough</Button>
      </ButtonGroup>
      <ButtonGroup variant="spaced" aria-label="Page actions">
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Publish</Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical" aria-label="Vertical group dark">
        <Button variant="secondary">Option A</Button>
        <Button variant="secondary">Option B</Button>
        <Button variant="secondary">Option C</Button>
      </ButtonGroup>
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────
export const Playground: Story = {
  name: 'Playground',
  args: {
    variant:     'attached',
    orientation: 'horizontal',
    'aria-label': 'Playground group',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Option A</Button>
      <Button variant="outline">Option B</Button>
      <Button variant="outline">Option C</Button>
    </ButtonGroup>
  ),
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────
export const Accessibility: Story = {
  name: 'Accessibility',
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)]">
      {/*
        role="group" announces the button group as a named group to screen readers.
        Each button inside retains its own accessible name.

        Keyboard:
          Tab → moves focus between buttons
          Enter / Space → activates the focused button
          (No arrow-key navigation — buttons in a group are individually tab-focusable)

        Screen reader (NVDA/VoiceOver):
          "[aria-label] group" announced when entering the group
          "[button label], button" for each item
          "[button label], dimmed, button" for disabled items
      */}

      {/* Labelled group — screen reader announces "Text formatting, group" on entry */}
      <ButtonGroup aria-label="Text formatting">
        <Button variant="outline" leftIcon={<Bold size="var(--size-icon-sm)" />} iconOnly>Bold</Button>
        <Button variant="outline" leftIcon={<Italic size="var(--size-icon-sm)" />} iconOnly>Italic</Button>
        <Button variant="outline" leftIcon={<Underline size="var(--size-icon-sm)" />} iconOnly>Underline</Button>
      </ButtonGroup>

      {/* Mixed disabled — disabled button announced as "dimmed" by VoiceOver */}
      <ButtonGroup aria-label="Export options">
        <Button variant="outline">PDF</Button>
        <Button variant="outline" disabled aria-disabled>CSV (disabled)</Button>
        <Button variant="outline">JSON</Button>
      </ButtonGroup>

      {/* Vertical — same keyboard and SR behaviour regardless of orientation */}
      <ButtonGroup orientation="vertical" aria-label="View modes">
        <Button variant="outline">List</Button>
        <Button variant="outline">Grid</Button>
        <Button variant="outline">Kanban</Button>
      </ButtonGroup>
    </div>
  ),
};
