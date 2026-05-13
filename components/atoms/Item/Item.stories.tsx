import type { Meta, StoryObj } from '@storybook/react';
import { Mail, Settings, Bell, Star, User, MoreHorizontal, ChevronRight, FileText } from 'lucide-react';
import { Item } from './Item';

const meta: Meta<typeof Item> = {
  title: 'Atoms/Item',
  component: Item,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'outlined', 'elevated', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    interactive: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Item>;

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const IconMedia = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center justify-center w-[var(--size-component-sm)] h-[var(--size-component-sm)] rounded-[var(--radius-component-md)] bg-[var(--color-action-secondary)] text-[var(--color-text-accent)]">
    {children}
  </span>
);

const ActionButton = () => (
  <span className="inline-flex items-center justify-center w-[var(--size-icon-lg)] h-[var(--size-icon-lg)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-default cursor-pointer">
    <MoreHorizontal size="var(--size-icon-md)" />
  </span>
);

/* ── Default ─────────────────────────────────────────────────────────────── */
export const Default: Story = {
  args: {
    title: 'John Doe',
    description: 'john.doe@example.com',
    variant: 'default',
    size: 'md',
    media: (
      <IconMedia>
        <User size="var(--size-icon-md)" />
      </IconMedia>
    ),
    actions: <ActionButton />,
    interactive: true,
  },
};

/* ── Variants — each uses a fundamentally different visual strategy ─────── */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <div>
        <p className="text-label-sm text-secondary mb-2">Default — subtle filled background</p>
        <Item
          variant="default"
          title="Default variant"
          description="Subtle background, no border"
          media={<IconMedia><Mail size="var(--size-icon-md)" /></IconMedia>}
          actions={<ChevronRight size="var(--size-icon-md)" className="text-[var(--color-text-tertiary)]" />}
          interactive
        />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Outlined — visible border, transparent fill</p>
        <Item
          variant="outlined"
          title="Outlined variant"
          description="Border visible, no background fill"
          media={<IconMedia><Settings size="var(--size-icon-md)" /></IconMedia>}
          actions={<ChevronRight size="var(--size-icon-md)" className="text-[var(--color-text-tertiary)]" />}
          interactive
        />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Elevated — raised surface with shadow</p>
        <Item
          variant="elevated"
          title="Elevated variant"
          description="Raised surface with shadow progression"
          media={<IconMedia><Star size="var(--size-icon-md)" /></IconMedia>}
          actions={<ChevronRight size="var(--size-icon-md)" className="text-[var(--color-text-tertiary)]" />}
          interactive
        />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Ghost — transparent, hover reveals background</p>
        <Item
          variant="ghost"
          title="Ghost variant"
          description="Fully transparent until hovered"
          media={<IconMedia><Bell size="var(--size-icon-md)" /></IconMedia>}
          actions={<ChevronRight size="var(--size-icon-md)" className="text-[var(--color-text-tertiary)]" />}
          interactive
        />
      </div>
    </div>
  ),
};

/* ── Sizes ────────────────────────────────────────────────────────────────── */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <div>
        <p className="text-label-sm text-secondary mb-2">Small — compact, single-line</p>
        <Item
          size="sm"
          title="Compact item"
          media={<Mail size="var(--size-icon-sm)" className="text-[var(--color-text-secondary)]" />}
          interactive
        />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Medium — standard</p>
        <Item
          size="md"
          title="Standard item"
          description="With a supporting description"
          media={<IconMedia><Mail size="var(--size-icon-md)" /></IconMedia>}
          actions={<ActionButton />}
          interactive
        />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Large — spacious, multi-line friendly</p>
        <Item
          size="lg"
          title="Spacious item"
          description="With a longer supporting description for multi-line display"
          media={<IconMedia><Mail size="var(--size-icon-md)" /></IconMedia>}
          actions={<ActionButton />}
          interactive
        />
      </div>
    </div>
  ),
};

/* ── States ───────────────────────────────────────────────────────────────── */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      <div>
        <p className="text-label-sm text-secondary mb-2">Default (interactive)</p>
        <Item
          title="Interactive item"
          description="Hover to see state change"
          media={<IconMedia><User size="var(--size-icon-md)" /></IconMedia>}
          interactive
        />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Selected</p>
        <Item
          title="Selected item"
          description="Currently active"
          media={<IconMedia><Star size="var(--size-icon-md)" /></IconMedia>}
          selected
          interactive
        />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Disabled</p>
        <Item
          title="Disabled item"
          description="Cannot interact"
          media={<IconMedia><Settings size="var(--size-icon-md)" /></IconMedia>}
          disabled
        />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Loading</p>
        <Item title="" loading />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Static (non-interactive)</p>
        <Item
          title="Static display item"
          description="No hover or focus states"
          media={<IconMedia><FileText size="var(--size-icon-md)" /></IconMedia>}
        />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">As link</p>
        <Item
          title="Link item"
          description="Renders as an anchor element"
          media={<IconMedia><Mail size="var(--size-icon-md)" /></IconMedia>}
          actions={<ChevronRight size="var(--size-icon-md)" className="text-[var(--color-text-tertiary)]" />}
          href="#"
        />
      </div>
    </div>
  ),
};

/* ── DarkMode ─────────────────────────────────────────────────────────────── */
export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="flex flex-col gap-3 p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl">
      <Item
        variant="default"
        title="Default in dark"
        description="Subtle background variant"
        media={<IconMedia><Mail size="var(--size-icon-md)" /></IconMedia>}
        actions={<ActionButton />}
        interactive
      />
      <Item
        variant="outlined"
        title="Outlined in dark"
        description="Border variant"
        media={<IconMedia><Settings size="var(--size-icon-md)" /></IconMedia>}
        actions={<ActionButton />}
        interactive
      />
      <Item
        variant="elevated"
        title="Elevated in dark"
        description="Shadow variant"
        media={<IconMedia><Star size="var(--size-icon-md)" /></IconMedia>}
        actions={<ActionButton />}
        interactive
      />
      <Item
        variant="ghost"
        title="Ghost in dark"
        description="Transparent variant"
        media={<IconMedia><Bell size="var(--size-icon-md)" /></IconMedia>}
        actions={<ActionButton />}
        interactive
      />
      <Item title="Disabled in dark" description="Cannot interact" disabled />
      <Item title="" loading />
      <Item
        title="Selected in dark"
        description="Currently active"
        media={<IconMedia><Star size="var(--size-icon-md)" /></IconMedia>}
        selected
        interactive
      />
    </div>
  ),
};

/* ── Accessibility ─────────────────────────────────────────────────────────── */
export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)] max-w-2xl">
      {/* Keyboard: Tab to interactive items · Enter/Space to activate · items with href are native anchors */}
      {/* Screen reader: "[title]" | "[title], selected" | "[title], dimmed" | "[title], busy" */}

      {/* Default interactive: text content provides accessible name */}
      <Item
        title="Accessible item"
        description="Supporting description"
        media={<IconMedia><User size="var(--size-icon-md)" /></IconMedia>}
        interactive
      />

      {/* Selected: aria-selected communicates selection state */}
      <Item
        title="Selected item"
        description="Currently active"
        media={<IconMedia><Star size="var(--size-icon-md)" /></IconMedia>}
        selected
        interactive
      />

      {/* Disabled: aria-disabled + cursor-not-allowed communicate state */}
      <Item
        title="Disabled item"
        description="Cannot interact"
        media={<IconMedia><Settings size="var(--size-icon-md)" /></IconMedia>}
        disabled
      />

      {/* Loading: aria-busy communicates async skeleton state */}
      <Item title="" loading />

      {/* As link: href renders a native anchor — keyboard and screen readers treat it as a link */}
      <Item
        title="Link item"
        description="Renders as an anchor element"
        href="#"
        media={<IconMedia><FileText size="var(--size-icon-md)" /></IconMedia>}
        actions={<ChevronRight size="var(--size-icon-md)" className="text-[var(--color-text-tertiary)]" />}
      />
    </div>
  ),
};

/* ── Playground — all props as controls ───────────────────────────────────── */
export const Playground: Story = {
  args: {
    title: 'Playground item',
    description: 'Adjust props in the controls panel',
    variant: 'default',
    size: 'md',
    selected: false,
    disabled: false,
    loading: false,
    interactive: true,
    media: (
      <IconMedia>
        <User size="var(--size-icon-md)" />
      </IconMedia>
    ),
    actions: <ActionButton />,
  },
};
