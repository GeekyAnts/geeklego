import type { Meta, StoryObj } from '@storybook/react';
import { List } from './List';

const meta: Meta<typeof List> = {
  title: 'Atoms/List',
  component: List,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['bullet', 'ordered', 'none', 'check', 'dot', 'description'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
  },
  args: {
    variant: 'bullet',
    size: 'md',
    orientation: 'vertical',
  },
};

export default meta;
type Story = StoryObj<typeof List>;

// ── 1. Default ────────────────────────────────────────────────────────────────
export const Default: Story = {
  render: (args) => (
    <List {...args}>
      <List.Item>Design tokens are the single source of truth</List.Item>
      <List.Item>Components inherit from the design system</List.Item>
      <List.Item>Theme switching works across all variants</List.Item>
      <List.Item>Accessibility is built in from the start</List.Item>
    </List>
  ),
};

// ── 2. Variants ───────────────────────────────────────────────────────────────
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          bullet
        </p>
        <List variant="bullet">
          <List.Item>Disc markers in muted tertiary colour</List.Item>
          <List.Item>Default for unordered content</List.Item>
          <List.Item>Indented with token-based left padding</List.Item>
        </List>
      </div>

      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          ordered
        </p>
        <List variant="ordered">
          <List.Item>First step in the process</List.Item>
          <List.Item>Second step follows naturally</List.Item>
          <List.Item>Sequence matters here</List.Item>
        </List>
      </div>

      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          check
        </p>
        <List variant="check">
          <List.Item>WCAG 2.2 AA colour contrast on all text</List.Item>
          <List.Item>Keyboard navigation on every interactive element</List.Item>
          <List.Item>Screen reader announcements for live regions</List.Item>
          <List.Item>Touch targets minimum 24 × 24 px CSS</List.Item>
        </List>
      </div>

      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          dot
        </p>
        <List variant="dot">
          <List.Item>Accent-coloured dot markers</List.Item>
          <List.Item>Smaller visual weight than bullets</List.Item>
          <List.Item>Ideal for compact feature lists</List.Item>
        </List>
      </div>

      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          none
        </p>
        <List variant="none">
          <List.Item>No visible marker</List.Item>
          <List.Item>Pure layout list — items as flex children</List.Item>
          <List.Item>Semantic list structure maintained</List.Item>
        </List>
      </div>

      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          description
        </p>
        <List variant="description">
          <List.Item term="Version">4.2.1</List.Item>
          <List.Item term="Licence">MIT</List.Item>
          <List.Item term="Stack">React 19 · TypeScript 5.7 · Tailwind CSS v4</List.Item>
        </List>
      </div>
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
            size="{size}"
          </p>
          <List variant="check" size={size}>
            <List.Item>First feature ready to ship</List.Item>
            <List.Item>Second feature in review</List.Item>
            <List.Item>Third feature on the roadmap</List.Item>
          </List>
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          Default (all enabled)
        </p>
        <List variant="check">
          <List.Item>All items active and readable</List.Item>
          <List.Item>Hover and interaction available</List.Item>
          <List.Item>Full colour treatment</List.Item>
        </List>
      </div>

      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          Mixed (some disabled)
        </p>
        <List variant="check">
          <List.Item>Available feature — click to learn more</List.Item>
          <List.Item disabled>Disabled item — not available in this plan</List.Item>
          <List.Item>Another active feature</List.Item>
          <List.Item disabled>Disabled item — requires upgrade</List.Item>
        </List>
      </div>

      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          All disabled
        </p>
        <List variant="bullet">
          <List.Item disabled>Feature not available</List.Item>
          <List.Item disabled>Another unavailable option</List.Item>
          <List.Item disabled>Requires different plan</List.Item>
        </List>
      </div>

      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          Horizontal orientation
        </p>
        <List variant="none" orientation="horizontal">
          <List.Item>Terms</List.Item>
          <List.Item>Privacy</List.Item>
          <List.Item>Support</List.Item>
          <List.Item>Status</List.Item>
        </List>
      </div>

      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          Long content (wrapping)
        </p>
        <List variant="check" className="max-w-sm">
          <List.Item>
            A short item fits on one line without wrapping or truncation.
          </List.Item>
          <List.Item>
            A much longer item that contains a sentence worth of content will wrap naturally
            across multiple lines whilst keeping the check icon pinned to the top-left of the
            first line, maintaining optical alignment throughout.
          </List.Item>
          <List.Item>Back to a short item again.</List.Item>
        </List>
      </div>
    </div>
  ),
};

// ── 5. DarkMode ───────────────────────────────────────────────────────────────
export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-[var(--spacing-layout-xs)] rounded-[var(--radius-component-xl)] max-w-2xl">
      <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
        <List variant="check">
          <List.Item>WCAG 2.2 AA contrast in dark mode</List.Item>
          <List.Item>Check icon colour resolves via semantic tokens</List.Item>
          <List.Item disabled>Disabled item — muted in dark mode</List.Item>
        </List>

        <List variant="bullet">
          <List.Item>Bullet markers use tertiary text colour</List.Item>
          <List.Item>Item text uses primary text colour</List.Item>
          <List.Item>All values resolve via theme overrides</List.Item>
        </List>

        <List variant="description">
          <List.Item term="Background">var(--color-bg-primary) → neutral-950</List.Item>
          <List.Item term="Text">var(--color-text-primary) → neutral-50</List.Item>
          <List.Item term="Border">var(--color-border-subtle) → neutral-800</List.Item>
        </List>
      </div>
    </div>
  ),
};

// ── 6. LongContent ────────────────────────────────────────────────────────────
export const LongContent: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          Text wrapping with markers pinned to first line
        </p>
        <List variant="check" className="max-w-lg">
          <List.Item>Short item on one line without any wrapping or overflow.</List.Item>
          <List.Item>
            A longer item that spans multiple lines whilst keeping the check icon pinned to the
            top-left of the first line, maintaining optical alignment throughout the entire
            wrapped text. This demonstrates proper marker positioning for multi-line content.
          </List.Item>
          <List.Item>Another short item.</List.Item>
        </List>
      </div>

      <div>
        <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          Long content in description variant
        </p>
        <List variant="description" className="max-w-lg">
          <List.Item term="Project Name">A very long project name that might wrap across multiple lines if the container is narrow</List.Item>
          <List.Item term="Description">This is a longer description that explains the project in detail. It contains enough content to potentially wrap across multiple lines depending on the available width of the container.</List.Item>
          <List.Item term="Status">Active and in production</List.Item>
        </List>
      </div>
    </div>
  ),
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────
export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      {/* Unordered list — native list role, item count announced */}
      <section aria-labelledby="ul-heading">
        <h2 id="ul-heading" className="text-heading-h4 text-[var(--color-text-primary)] mb-[var(--spacing-component-sm)]">
          Unordered list (bullet)
        </h2>
        <List variant="bullet" aria-label="Feature list">
          <List.Item>Screen readers announce total item count</List.Item>
          <List.Item>Each item is a native listitem role</List.Item>
          <List.Item>No redundant role attributes added</List.Item>
        </List>
      </section>

      {/* Ordered list — sequence announced */}
      <section aria-labelledby="ol-heading">
        <h2 id="ol-heading" className="text-heading-h4 text-[var(--color-text-primary)] mb-[var(--spacing-component-sm)]">
          Ordered list (numbered)
        </h2>
        <List variant="ordered" aria-label="Installation steps">
          <List.Item>Install dependencies with npm install</List.Item>
          <List.Item>Run npm run dev to start the dev server</List.Item>
          <List.Item>Open localhost:5173 in your browser</List.Item>
        </List>
      </section>

      {/* Check list — icons are aria-hidden, text carries meaning */}
      <section aria-labelledby="check-heading">
        <h2 id="check-heading" className="text-heading-h4 text-[var(--color-text-primary)] mb-[var(--spacing-component-sm)]">
          Check list — icons aria-hidden
        </h2>
        <List variant="check" aria-label="Accessibility requirements">
          <List.Item>Check icon has aria-hidden="true" — decorative</List.Item>
          <List.Item>Text content carries all semantic meaning</List.Item>
          <List.Item aria-disabled="true" disabled>
            Disabled item — aria-disabled="true" applied
          </List.Item>
        </List>
      </section>

      {/* Description list — term/definition semantics */}
      <section aria-labelledby="dl-heading">
        <h2 id="dl-heading" className="text-heading-h4 text-[var(--color-text-primary)] mb-[var(--spacing-component-sm)]">
          Description list — dt / dd semantics
        </h2>
        <List variant="description" aria-label="Component metadata">
          <List.Item term="Level">L1 Atom</List.Item>
          <List.Item term="HTML element">dl + dt + dd</List.Item>
          <List.Item term="ARIA role">term / definition (native)</List.Item>
        </List>
      </section>
    </div>
  ),
};
