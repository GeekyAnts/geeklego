import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';
import type { LinkVariant, LinkSize } from './Link.types';

const meta: Meta<typeof Link> = {
  title: 'Atoms/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'subtle', 'inline', 'standalone'] satisfies LinkVariant[],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'] satisfies LinkSize[],
    },
    external: { control: 'boolean' },
    disabled: { control: 'boolean' },
    href: { control: 'text' },
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    href: '#',
    variant: 'default',
    children: 'Learn more about Geeklego',
  },
};

// ── 2. Variants ───────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 max-w-md">
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">default</span>
        <p className="text-body-md text-[var(--color-text-primary)]">
          Read the{' '}
          <Link href="#" variant="default">
            component documentation
          </Link>{' '}
          to get started.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">subtle</span>
        <p className="text-body-md text-[var(--color-text-primary)]">
          See our{' '}
          <Link href="#" variant="subtle">
            privacy policy
          </Link>{' '}
          for details.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">inline</span>
        <p className="text-body-md text-[var(--color-text-primary)]">
          Geeklego is an open-source{' '}
          <Link href="#" variant="inline">
            design-system-first
          </Link>{' '}
          React component library built on{' '}
          <Link href="#" variant="inline">
            Tailwind CSS v4
          </Link>
          .
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">standalone</span>
        <Link href="#" variant="standalone">
          View all components →
        </Link>
      </div>
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(['sm', 'md', 'lg'] as LinkSize[]).map((size) => (
        <div key={size} className="flex flex-col gap-1">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">{size}</span>
          <div className="flex items-center gap-6 flex-wrap">
            <Link href="#" size={size} variant="default">
              Default link
            </Link>
            <Link href="#" size={size} variant="subtle">
              Subtle link
            </Link>
            <Link href="#" size={size} variant="standalone">
              Standalone link
            </Link>
          </div>
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Default</span>
        <Link href="#">Default link</Link>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Focus-visible (Tab to the link)
        </span>
        <Link href="#">Focus me with keyboard</Link>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">External</span>
        <Link href="https://example.com" external>
          Opens in new tab
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Visited (accent color — visible after clicking in browser)
        </span>
        <Link href="#">Click to visit, then come back</Link>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Disabled</span>
        <Link href="#" disabled>
          Disabled link
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">All variants — disabled</span>
        <div className="flex items-center gap-6 flex-wrap">
          <Link href="#" variant="default" disabled>Default</Link>
          <Link href="#" variant="subtle" disabled>Subtle</Link>
          <Link href="#" variant="inline" disabled>Inline</Link>
          <Link href="#" variant="standalone" disabled>Standalone</Link>
        </div>
      </div>
    </div>
  ),
};

// ── 5. Dark Mode ──────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-8 rounded-lg max-w-2xl">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">default</span>
          <p className="text-body-md text-[var(--color-text-primary)]">
            Read the{' '}
            <Link href="#" variant="default">
              component documentation
            </Link>{' '}
            to get started.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">subtle</span>
          <p className="text-body-md text-[var(--color-text-primary)]">
            See our{' '}
            <Link href="#" variant="subtle">
              privacy policy
            </Link>{' '}
            for details.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">inline</span>
          <p className="text-body-md text-[var(--color-text-primary)]">
            Built on{' '}
            <Link href="#" variant="inline">
              Tailwind CSS v4
            </Link>{' '}
            and{' '}
            <Link href="#" variant="inline">
              React 19
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">standalone</span>
          <Link href="#" variant="standalone">
            View all components →
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">external</span>
          <Link href="https://example.com" external>
            Opens in new tab
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">disabled</span>
          <Link href="#" disabled>
            Disabled link
          </Link>
        </div>
      </div>
    </div>
  ),
};

// ── 7. EdgeCases ───────────────────────────────────────────────────────────────

export const EdgeCases: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Very long link text */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-secondary)]">
          Long text that wraps across multiple lines — should remain underlined
        </span>
        <Link href="https://example.com/very/long/documentation/path">
          This is an exceptionally long link text that will wrap across multiple lines and should maintain its underline styling without breaking the layout or appearance
        </Link>
      </div>

      {/* External link with icon indication */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-secondary)]">
          External link — opens in new tab
        </span>
        <Link href="https://github.com" external>
          View source on GitHub
        </Link>
      </div>

      {/* Inline usage in paragraph */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-secondary)]">
          Inline context — as part of flowing text
        </span>
        <p className="text-body-md text-[var(--color-text-primary)]">
          Check out our{' '}
          <Link href="/about" variant="default">
            about page
          </Link>
          {' '}to learn more about our team and mission. You can also visit our{' '}
          <Link href="https://blog.example.com" external>
            blog
          </Link>
          {' '}for updates.
        </p>
      </div>

      {/* Subtle variant in context */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-secondary)]">
          Subtle variant — minimal emphasis
        </span>
        <p className="text-body-sm text-[var(--color-text-secondary)]">
          Additional resources:{' '}
          <Link href="#" variant="subtle">
            documentation
          </Link>
          {' '}·{' '}
          <Link href="#" variant="subtle">
            tutorials
          </Link>
          {' '}·{' '}
          <Link href="#" variant="subtle">
            community
          </Link>
        </p>
      </div>
    </div>
  ),
};

// ── 8. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    href: '#',
    variant: 'default',
    size: undefined,
    external: false,
    disabled: false,
    children: 'Click this link',
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-8 max-w-md">
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Inline link — native anchor semantics, no ARIA needed
        </span>
        <p className="text-body-md text-[var(--color-text-primary)]">
          Read the{' '}
          <Link href="https://example.com/docs">
            full documentation
          </Link>{' '}
          on our website.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          External link — announces target context to screen readers
        </span>
        <Link
          href="https://example.com"
          external
          aria-label="Visit example.com (opens in a new tab)"
        >
          External resource
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Disabled link — aria-disabled="true", removed from tab order
        </span>
        <Link href="#" disabled aria-label="Feature coming soon">
          Unavailable feature
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Focus ring — visible on keyboard focus (Tab to link)
        </span>
        <Link href="#">
          Focus me with the keyboard
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Descriptive link text — avoids "click here" / "read more" anti-patterns
        </span>
        <div className="flex flex-col gap-2">
          <Link href="#">Download the Geeklego design tokens (CSS)</Link>
          <Link href="#">View the Button component API reference</Link>
          <Link href="#">Read accessibility guidelines for interactive elements</Link>
        </div>
      </div>
    </div>
  ),
};
