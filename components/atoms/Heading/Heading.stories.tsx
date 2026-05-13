import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from './Heading';

const meta: Meta<typeof Heading> = {
  title: 'Atoms/Heading',
  component: Heading,
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'Semantic heading element rendered in the DOM.',
    },
    size: {
      control: 'select',
      options: [undefined, 'h1', 'h2', 'h3', 'h4', 'h5'],
      description: 'Visual typography size. Defaults to match `as`.',
    },
    responsive: {
      control: 'boolean',
      description: 'Scale font size down on smaller viewports.',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'accent', 'inverse'],
      description: 'Text colour from the semantic token palette.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    as: 'h2',
    color: 'primary',
    responsive: false,
    children: 'Build better products',
  },
};

// ── 2. Levels (Variants) ──────────────────────────────────────────────────────

export const Levels: Story = {
  name: 'Levels',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xl)]">
      <div>
        <p className="text-label-sm text-secondary mb-[var(--spacing-component-xs)]">h1 — 36px bold</p>
        <Heading as="h1">Design systems at scale</Heading>
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-[var(--spacing-component-xs)]">h2 — 32px bold</p>
        <Heading as="h2">Design systems at scale</Heading>
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-[var(--spacing-component-xs)]">h3 — 28px semibold</p>
        <Heading as="h3">Design systems at scale</Heading>
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-[var(--spacing-component-xs)]">h4 — 24px semibold</p>
        <Heading as="h4">Design systems at scale</Heading>
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-[var(--spacing-component-xs)]">h5 — 20px semibold</p>
        <Heading as="h5">Design systems at scale</Heading>
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-[var(--spacing-component-xs)]">h6 — 20px semibold (shares h5 scale)</p>
        <Heading as="h6">Design systems at scale</Heading>
      </div>
    </div>
  ),
};

// ── 3. Sizes (Visual vs Semantic decoupling) ──────────────────────────────────

export const Sizes: Story = {
  name: 'Sizes',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xl)]">
      <div>
        <p className="text-label-sm text-secondary mb-[var(--spacing-component-sm)]">
          Same semantic element <code className="text-accent">{'<h3>'}</code> — different visual sizes.
          Use this when document outline must remain h3 but the visual weight should differ.
        </p>
      </div>
      <div>
        <p className="text-label-xs text-tertiary mb-[var(--spacing-component-xs)]">size="h1"</p>
        <Heading as="h3" size="h1">Hero-scale heading on an h3</Heading>
      </div>
      <div>
        <p className="text-label-xs text-tertiary mb-[var(--spacing-component-xs)]">size="h2"</p>
        <Heading as="h3" size="h2">Section-scale heading on an h3</Heading>
      </div>
      <div>
        <p className="text-label-xs text-tertiary mb-[var(--spacing-component-xs)]">size="h3" (default)</p>
        <Heading as="h3" size="h3">Default size matches element</Heading>
      </div>
      <div>
        <p className="text-label-xs text-tertiary mb-[var(--spacing-component-xs)]">size="h4"</p>
        <Heading as="h3" size="h4">Compact heading on an h3</Heading>
      </div>
      <div>
        <p className="text-label-xs text-tertiary mb-[var(--spacing-component-xs)]">size="h5"</p>
        <Heading as="h3" size="h5">Smallest heading size on an h3</Heading>
      </div>
    </div>
  ),
};

// ── 4. Colors (States) ────────────────────────────────────────────────────────

export const Colors: Story = {
  name: 'Colors',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-md)]">
      <Heading as="h3" color="primary">Primary — high-contrast default</Heading>
      <Heading as="h3" color="secondary">Secondary — subdued, supporting text</Heading>
      <Heading as="h3" color="tertiary">Tertiary — muted, least prominent</Heading>
      <Heading as="h3" color="accent">Accent — calls out key content</Heading>
      <Heading as="h3" color="accent">Accent — complementary highlight</Heading>
      <div className="bg-[var(--color-bg-inverse)] p-[var(--spacing-component-md)] rounded-[var(--radius-component-md)]">
        <Heading as="h3" color="inverse">Inverse — for dark/coloured backgrounds</Heading>
      </div>
    </div>
  ),
};

// ── 5. Dark Mode ──────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  name: 'Dark Mode',
  render: () => (
    <div
      data-theme="dark"
      className="bg-primary p-[var(--spacing-layout-md)] rounded-[var(--radius-component-xl)] max-w-2xl"
    >
      <div className="flex flex-col gap-[var(--spacing-component-lg)]">
        <Heading as="h2" color="primary">Primary heading adapts to dark</Heading>
        <Heading as="h3" color="secondary">Secondary — reduced contrast in dark</Heading>
        <Heading as="h3" color="tertiary">Tertiary — furthest from foreground</Heading>
        <Heading as="h3" color="accent">Accent recalibrated for dark</Heading>
        <Heading as="h3" color="accent">Accent recalibrated for dark</Heading>
      </div>
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    as: 'h2',
    size: undefined,
    responsive: false,
    color: 'primary',
    children: 'Adjust props in the controls panel',
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <article>
      <Heading as="h1">Document title — one h1 per page</Heading>
      <p className="text-body-md text-secondary mt-[var(--spacing-component-md)]">
        The heading level in the document outline is controlled by the <code>as</code> prop.
        Screen readers announce the heading level so users can navigate the page structure.
        Heading levels must not be skipped (e.g. no h2 → h4 jump).
      </p>

      <section aria-labelledby="section-1">
        <Heading as="h2" id="section-1" className="mt-[var(--spacing-layout-sm)]">
          Section — h2 creates a new top-level section
        </Heading>
        <p className="text-body-md text-secondary mt-[var(--spacing-component-sm)]">
          Section content. Using <code>aria-labelledby</code> on the section links it to this heading.
        </p>

        <Heading as="h3" className="mt-[var(--spacing-component-lg)]">
          Sub-section — h3 nests inside h2
        </Heading>
        <p className="text-body-md text-secondary mt-[var(--spacing-component-sm)]">
          Decoupled visual size: <code>{'<h3 size="h4">'}</code> is semantically h3 but visually compact.
        </p>
        <Heading as="h3" size="h4" color="secondary" className="mt-[var(--spacing-component-sm)]">
          Same h3 level, h4 visual size — outline is preserved
        </Heading>

        <Heading as="h4" className="mt-[var(--spacing-component-lg)]">
          Card heading — h4
        </Heading>
        <Heading as="h5" color="secondary" className="mt-[var(--spacing-component-sm)]">
          Label heading — h5
        </Heading>
      </section>
    </article>
  ),
};
