import type { Meta, StoryObj } from '@storybook/react';
import {
  Inbox,
  SearchX,
  FolderOpen,
  FilePlus,
  CloudOff,
  Star,
} from 'lucide-react';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Atoms/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    icon: { control: false },
    action: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    title: 'No messages yet',
    description: 'When you receive messages, they\'ll appear here.',
    icon: <Inbox size="var(--empty-state-icon-size-md)" />,
    variant: 'default',
    size: 'md',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Default — subtle border + muted background
        </p>
        <EmptyState
          title="No results found"
          description="Try adjusting your search or filters."
          icon={<SearchX size="var(--empty-state-icon-size-md)" />}
          variant="default"
        />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Ghost — borderless, transparent
        </p>
        <EmptyState
          title="Your library is empty"
          description="Add your first item to get started."
          icon={<FolderOpen size="var(--empty-state-icon-size-md)" />}
          variant="ghost"
        />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            {size.toUpperCase()}
          </p>
          <EmptyState
            title="Nothing here yet"
            description="Start by creating your first item."
            icon={<Inbox size={`var(--empty-state-icon-size-${size})`} />}
            size={size}
          />
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Title only (minimal)
        </p>
        <EmptyState title="No data available" />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Title + description
        </p>
        <EmptyState
          title="No notifications"
          description="You're all caught up! Check back later."
        />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          With icon + title + description
        </p>
        <EmptyState
          title="No projects yet"
          description="Create a project to start collaborating with your team."
          icon={<FilePlus size="var(--empty-state-icon-size-md)" />}
        />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Full — icon + title + description + action
        </p>
        <EmptyState
          title="No favourites saved"
          description="Star items to find them quickly later."
          icon={<Star size="var(--empty-state-icon-size-md)" />}
          action={
            <button
              type="button"
              className="bg-[var(--color-action-primary)] text-[var(--color-text-inverse)] px-[var(--spacing-component-lg)] py-[var(--spacing-component-sm)] rounded-[var(--radius-component-md)] text-body-sm transition-default hover:bg-[var(--color-action-primary-hover)]"
            >
              Browse items
            </button>
          }
        />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Offline / error — ghost variant
        </p>
        <EmptyState
          title="Unable to load content"
          description="Check your internet connection and try again."
          icon={<CloudOff size="var(--empty-state-icon-size-md)" />}
          variant="ghost"
        />
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl flex flex-col gap-[var(--spacing-layout-sm)]"
    >
      <EmptyState
        title="No messages yet"
        description="When you receive messages, they'll appear here."
        icon={<Inbox size="var(--empty-state-icon-size-md)" />}
      />
      <EmptyState
        title="No results found"
        description="Try adjusting your search or filters to find what you're looking for."
        icon={<SearchX size="var(--empty-state-icon-size-md)" />}
        variant="ghost"
      />
    </div>
  ),
};

// ── 6. WithRole ───────────────────────────────────────────────────────────────

export const WithRole: Story = {
  name: 'Dynamic Usage (role="status")',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Static — no live region needed. Icon is <code>aria-hidden</code>, content is plain paragraphs.
        </p>
        <EmptyState
          title="No results found"
          description="Try adjusting your filters or broadening your search."
          icon={<SearchX size="var(--empty-state-icon-size-md)" />}
          variant="default"
        />
      </div>

      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Dynamic — <code>role=&quot;status&quot;</code> announces the change when this appears in the DOM.
        </p>
        <EmptyState
          role="status"
          title="No notifications"
          description="You're all caught up. New notifications will appear here."
          icon={<Inbox size="var(--empty-state-icon-size-md)" />}
          variant="ghost"
        />
      </div>

      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Dynamic with CTA — the button inside the action slot is the tab stop.
        </p>
        <EmptyState
          role="status"
          title="No projects yet"
          description="Create your first project to start collaborating."
          icon={<FilePlus size="var(--empty-state-icon-size-md)" />}
          variant="default"
          action={
            <button
              type="button"
              className="bg-[var(--color-action-primary)] text-[var(--color-text-inverse)] px-[var(--spacing-component-lg)] py-[var(--spacing-component-sm)] rounded-[var(--radius-component-md)] text-body-sm transition-default hover:bg-[var(--color-action-primary-hover)] focus-visible:outline-none focus-visible:focus-ring"
            >
              Create project
            </button>
          }
        />
      </div>
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    title: 'Nothing here yet',
    description: 'Add your first item to get started.',
    icon: <Inbox size="var(--empty-state-icon-size-md)" />,
    variant: 'default',
    size: 'md',
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] p-[var(--spacing-layout-xs)]">
      {/*
        Screen reader behaviour:
          - The icon wrapper has aria-hidden="true" — purely decorative, not announced
          - The title is a <p> — no heading role, no heading level assumed
          - The description is a <p> below the title
          - Consumer should add role="status" for dynamically-inserted empty states
            so assistive tech announces the change: <EmptyState role="status" ... />
          - action slot receives focus normally via its own interactive element
      */}

      {/* Static empty state — no live region needed */}
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-3">
          Static — icon is aria-hidden, title + description are plain paragraphs
        </p>
        <EmptyState
          title="No items found"
          description="Your search returned no results. Try broadening your query."
          icon={<SearchX size="var(--empty-state-icon-size-md)" />}
        />
      </div>

      {/* Dynamic empty state — add role="status" so AT announces the change */}
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-3">
          Dynamic — role="status" makes AT announce when this appears in the DOM
        </p>
        <EmptyState
          role="status"
          title="No notifications"
          description="You're all caught up."
          icon={<Inbox size="var(--empty-state-icon-size-md)" />}
        />
      </div>

      {/* With focusable action — tab target is the action element itself */}
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-3">
          With action — the button inside the action slot is the tab stop
        </p>
        <EmptyState
          title="No projects"
          description="Create a project to collaborate with your team."
          icon={<FilePlus size="var(--empty-state-icon-size-md)" />}
          action={
            <button
              type="button"
              aria-label="Create your first project"
              className="bg-[var(--color-action-primary)] text-[var(--color-text-inverse)] px-[var(--spacing-component-lg)] py-[var(--spacing-component-sm)] rounded-[var(--radius-component-md)] text-body-sm transition-default hover:bg-[var(--color-action-primary-hover)] focus-visible:outline-none focus-visible:focus-ring"
            >
              Create project
            </button>
          }
        />
      </div>
    </div>
  ),
};
