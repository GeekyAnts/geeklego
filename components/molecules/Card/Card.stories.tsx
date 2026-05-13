import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../../atoms/Button/Button';
import type { CardVariant } from './Card.types';

const SampleBody = () => (
  <p className="text-body-md text-[var(--color-text-secondary)]">
    A Card groups related content and actions into a single, scannable surface. Use it to present
    summaries, media, or interactive items in a consistent container.
  </p>
);

const meta: Meta<typeof Card> = {
  title: 'Molecules/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'filled', 'ghost'] satisfies CardVariant[],
    },
    interactive: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <Card {...args}>
        <Card.Header
          title="Project Update"
          description="Last modified 2 hours ago"
          action={<Button variant="ghost" size="sm">View all</Button>}
        />
        <Card.Body>
          <SampleBody />
        </Card.Body>
        <Card.Footer>
          <Button variant="outline" size="sm">Cancel</Button>
          <Button variant="primary" size="sm">Confirm</Button>
        </Card.Footer>
      </Card>
    </div>
  ),
  args: {
    variant: 'elevated',
    interactive: false,
  },
};

// ── 2. Variants ───────────────────────────────────────────────────────────────

const variants: CardVariant[] = ['elevated', 'outlined', 'filled', 'ghost'];

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 max-w-2xl">
      {variants.map((variant) => (
        <Card key={variant} variant={variant}>
          <Card.Header
            title={variant.charAt(0).toUpperCase() + variant.slice(1)}
            description="Variant preview"
            action={<Button variant="ghost" size="sm">Edit</Button>}
          />
          <Card.Body>
            <SampleBody />
          </Card.Body>
          <Card.Footer>
            <Button variant="outline" size="sm">Cancel</Button>
            <Button variant="primary" size="sm">Save</Button>
          </Card.Footer>
        </Card>
      ))}
    </div>
  ),
};

// ── 3. Sizes (Content Density) ────────────────────────────────────────────────
// Card padding is fixed per slot — this story shows realistic content scales
// via Button size props to demonstrate density control.

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-sm">
      <div className="flex flex-col gap-2">
        <span className="text-label-sm text-[var(--color-text-tertiary)]">
          Compact actions (sm Buttons)
        </span>
        <Card variant="outlined">
          <Card.Header
            title="Compact Card"
            description="Uses size sm buttons"
            action={<Button variant="ghost" size="sm">Edit</Button>}
          />
          <Card.Body>
            <SampleBody />
          </Card.Body>
          <Card.Footer>
            <Button variant="outline" size="sm">Cancel</Button>
            <Button variant="primary" size="sm">Save</Button>
          </Card.Footer>
        </Card>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-label-sm text-[var(--color-text-tertiary)]">
          Standard actions (md Buttons)
        </span>
        <Card variant="outlined">
          <Card.Header
            title="Standard Card"
            description="Uses size md buttons"
            action={<Button variant="ghost" size="md">Edit</Button>}
          />
          <Card.Body>
            <SampleBody />
          </Card.Body>
          <Card.Footer>
            <Button variant="outline" size="md">Cancel</Button>
            <Button variant="primary" size="md">Save</Button>
          </Card.Footer>
        </Card>
      </div>
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-sm">
      <div className="flex flex-col gap-2">
        <span className="text-label-sm text-[var(--color-text-tertiary)]">Default</span>
        <Card variant="elevated">
          <Card.Header title="Default State" />
          <Card.Body>
            <SampleBody />
          </Card.Body>
          <Card.Footer>
            <Button variant="primary" size="sm">Action</Button>
          </Card.Footer>
        </Card>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-label-sm text-[var(--color-text-tertiary)]">
          Interactive (hover / focus)
        </span>
        <Card variant="elevated" interactive>
          <Card.Header title="Interactive Card" description="Hover or focus to see state change" />
          <Card.Body>
            <SampleBody />
          </Card.Body>
        </Card>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-label-sm text-[var(--color-text-tertiary)]">Loading</span>
        <Card variant="outlined" aria-busy="true" aria-label="Loading card content">
          <Card.Body>
            <div className="flex flex-col gap-3" aria-hidden="true">
              <div className="skeleton h-4 w-3/4 rounded-[var(--radius-component-sm)]" />
              <div className="skeleton h-4 w-1/2 rounded-[var(--radius-component-sm)]" />
              <div className="skeleton h-4 w-5/6 rounded-[var(--radius-component-sm)]" />
            </div>
          </Card.Body>
          <Card.Footer>
            <Button variant="primary" size="sm" isLoading>Save</Button>
          </Card.Footer>
        </Card>
      </div>
    </div>
  ),
};

// ── 5. DarkMode ───────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-8 rounded-lg max-w-2xl">
      <div className="grid grid-cols-2 gap-6">
        {variants.map((variant) => (
          <Card key={variant} variant={variant}>
            <Card.Header
              title={variant.charAt(0).toUpperCase() + variant.slice(1)}
              description="Dark mode"
              action={<Button variant="ghost" size="sm">Edit</Button>}
            />
            <Card.Body>
              <SampleBody />
            </Card.Body>
            <Card.Footer>
              <Button variant="outline" size="sm">Cancel</Button>
              <Button variant="primary" size="sm">Save</Button>
            </Card.Footer>
          </Card>
        ))}
      </div>
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <div className="w-80">
      <Card {...args}>
        <Card.Header
          title="Playground Card"
          description="Adjust controls to explore"
          action={<Button variant="ghost" size="sm">Edit</Button>}
        />
        <Card.Body>
          <SampleBody />
        </Card.Body>
        <Card.Footer>
          <Button variant="outline" size="sm">Cancel</Button>
          <Button variant="primary" size="sm">Confirm</Button>
        </Card.Footer>
      </Card>
    </div>
  ),
  args: {
    variant: 'elevated',
    interactive: false,
  },
};

// ── 8. Accessibility ─────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-6 max-w-sm">
      {/* Static card — semantic article landmark */}
      <Card variant="elevated" role="article" aria-label="Project summary card">
        <Card.Header
          title="Accessible Static Card"
          description="Uses role='article' for self-contained content"
          action={<Button variant="ghost" size="sm" aria-label="Edit project summary">Edit</Button>}
        />
        <Card.Body>
          <SampleBody />
        </Card.Body>
        <Card.Footer>
          <Button variant="primary" size="sm">Read more</Button>
        </Card.Footer>
      </Card>

      {/* Interactive card — keyboard navigable */}
      <Card
        variant="outlined"
        interactive
        role="button"
        aria-label="Navigate to project details"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
          }
        }}
      >
        <Card.Header
          title="Interactive Card"
          description="Tab-navigable — Enter or Space to activate"
        />
        <Card.Body>
          <SampleBody />
        </Card.Body>
      </Card>

      {/* Loading card — aria-busy */}
      <Card variant="outlined" aria-busy="true" aria-label="Loading project summary">
        <Card.Body>
          <div className="flex flex-col gap-3" aria-hidden="true">
            <div className="skeleton h-4 w-3/4 rounded-[var(--radius-component-sm)]" />
            <div className="skeleton h-4 w-1/2 rounded-[var(--radius-component-sm)]" />
          </div>
          <span className="sr-only">Loading content…</span>
        </Card.Body>
        <Card.Footer>
          <Button variant="primary" size="sm" isLoading disabled>
            Loading
          </Button>
        </Card.Footer>
      </Card>
    </div>
  ),
};
