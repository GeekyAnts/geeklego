import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'flushed', 'unstyled'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
    error: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    rows: { control: 'number' },
    placeholder: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof Textarea>;

/* ── Default ─────────────────────────────────────────────────────────────── */
export const Default: Story = {
  args: {
    placeholder: 'Type your message here…',
    variant: 'default',
    size: 'md',
    rows: 4,
  },
};

/* ── Variants — each uses a fundamentally different visual strategy ────────── */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] w-80">
      <div>
        <p className="text-label-sm text-secondary mb-2">Default — outlined border</p>
        <Textarea variant="default" placeholder="Default textarea" rows={3} />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Filled — muted bg, no border</p>
        <Textarea variant="filled" placeholder="Filled textarea" rows={3} />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Flushed — border-bottom only</p>
        <Textarea variant="flushed" placeholder="Flushed textarea" rows={3} />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Unstyled — blank slate</p>
        <Textarea variant="unstyled" placeholder="Unstyled textarea" rows={3} />
      </div>
    </div>
  ),
};

/* ── Sizes ────────────────────────────────────────────────────────────────── */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] w-80">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s}>
          <p className="text-label-sm text-secondary mb-2">{s.toUpperCase()}</p>
          <Textarea size={s} placeholder={`Size ${s} — ${s === 'sm' ? 'compact padding' : s === 'md' ? 'standard padding' : 'generous padding'}`} rows={3} />
        </div>
      ))}
    </div>
  ),
};

/* ── States — every interactive state ────────────────────────────────────── */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] w-80">
      <div>
        <p className="text-label-sm text-secondary mb-2">Default</p>
        <Textarea placeholder="Enter your message…" rows={3} />
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-2">With value</p>
        <Textarea
          defaultValue="This is a sample message that has been entered by the user. It demonstrates how the textarea looks with actual content."
          rows={3}
        />
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-2">Disabled</p>
        <Textarea placeholder="Cannot edit this field" disabled rows={3} />
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-2">Error</p>
        <Textarea
          defaultValue="This field contains an error that must be resolved."
          error
          rows={3}
        />
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-2">Loading</p>
        <Textarea placeholder="Processing…" isLoading rows={3} />
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-2">Resize: none</p>
        <Textarea placeholder="Cannot resize" resize="none" rows={3} />
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-2">Resize: horizontal</p>
        <Textarea placeholder="Resize horizontally" resize="horizontal" rows={3} />
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-2">Resize: both</p>
        <Textarea placeholder="Resize in all directions" resize="both" rows={3} />
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-2">Tall (8 rows)</p>
        <Textarea placeholder="Lots of room to write…" rows={8} />
      </div>
    </div>
  ),
};

/* ── DarkMode ────────────────────────────────────────────────────────────── */
export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-[var(--spacing-component-lg)] p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl w-96"
    >
      <Textarea variant="default" placeholder="Default" rows={3} />
      <Textarea variant="filled" placeholder="Filled" rows={3} />
      <Textarea variant="flushed" placeholder="Flushed" rows={3} />
      <Textarea variant="default" placeholder="Error state" error rows={3} />
      <Textarea variant="default" placeholder="Loading…" isLoading rows={3} />
      <Textarea variant="default" placeholder="Disabled" disabled rows={3} />
    </div>
  ),
};

/* ── Playground — all props as controls ───────────────────────────────────── */
export const Playground: Story = {
  args: {
    placeholder: 'Type here…',
    variant: 'default',
    size: 'md',
    resize: 'vertical',
    rows: 4,
    error: false,
    isLoading: false,
    disabled: false,
  },
};

/* ── Accessibility ────────────────────────────────────────────────────────── */
export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] w-80 p-[var(--spacing-layout-xs)]">
      {/*
        Keyboard: Tab to reach, then type freely
        Screen reader: "Message, multi-line edit text" / "Description, required, multi-line edit text"
      */}

      {/* Explicit label association via htmlFor + id */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <label htmlFor="a11y-message" className="text-label-sm text-primary">
          Message
        </label>
        <Textarea
          id="a11y-message"
          placeholder="Write your message…"
          rows={4}
          aria-required="true"
        />
      </div>

      {/* Required field with visible indicator */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <label htmlFor="a11y-required" className="text-label-sm text-primary">
          Description <span aria-hidden="true" style={{ color: 'var(--color-status-error)' }}>*</span>
        </label>
        <Textarea
          id="a11y-required"
          placeholder="Required field…"
          rows={3}
          required
          aria-required="true"
        />
      </div>

      {/* Error: aria-invalid + aria-describedby linking error message */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <label htmlFor="a11y-error" className="text-label-sm text-primary">
          Comment
        </label>
        <Textarea
          id="a11y-error"
          defaultValue="x"
          error
          rows={3}
          aria-describedby="a11y-error-msg"
        />
        <p
          id="a11y-error-msg"
          role="alert"
          className="text-body-sm"
          style={{ color: 'var(--color-status-error)' }}
        >
          Comment must be at least 10 characters.
        </p>
      </div>

      {/* Disabled: disabled attribute + aria-disabled, no hover/focus */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <label htmlFor="a11y-disabled" className="text-label-sm text-secondary">
          System notes (read-only)
        </label>
        <Textarea
          id="a11y-disabled"
          defaultValue="Auto-generated system note. Cannot be edited."
          disabled
          rows={3}
          aria-label="System notes, read-only"
        />
      </div>

      {/* Loading: aria-busy communicates async state */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <label htmlFor="a11y-loading" className="text-label-sm text-primary">
          Analysis
        </label>
        <Textarea
          id="a11y-loading"
          placeholder="Analysing content…"
          isLoading
          rows={3}
          aria-label="Analysis, checking content"
        />
      </div>
    </div>
  ),
};
