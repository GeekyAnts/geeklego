import type { Meta, StoryObj } from '@storybook/react';
import {
  ChevronDown,
  User,
  Settings,
  CreditCard,
  LogOut,
  Bell,
  HelpCircle,
  Trash2,
  Edit,
  Copy,
  Download,
  ExternalLink,
  MoreHorizontal,
} from 'lucide-react';
import { DropdownMenu } from './DropdownMenu';
import type { DropdownMenuItemType } from './DropdownMenu.types';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Molecules/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A floating menu panel that opens on trigger click. Supports actions, links, groups, and separators. Full WAI-ARIA Menu Button pattern with roving tabindex keyboard navigation.',
      },
    },
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
    },
    open: { control: 'boolean' },
    menuLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

// ── Shared data ───────────────────────────────────────────────────────────────

const accountItems: DropdownMenuItemType[] = [
  {
    id: 'profile',
    label: 'View profile',
    icon: <User size="var(--size-icon-sm)" />,
    shortcut: '⌘P',
    onClick: () => console.log('Profile'),
  },
  {
    id: 'settings',
    label: 'Account settings',
    icon: <Settings size="var(--size-icon-sm)" />,
    shortcut: '⌘,',
    onClick: () => console.log('Settings'),
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: <CreditCard size="var(--size-icon-sm)" />,
    onClick: () => console.log('Billing'),
  },
  { type: 'separator', id: 'sep-1' },
  {
    id: 'logout',
    label: 'Sign out',
    icon: <LogOut size="var(--size-icon-sm)" />,
    destructive: true,
    onClick: () => console.log('Logout'),
  },
];

const contextMenuItems: DropdownMenuItemType[] = [
  { id: 'edit',     label: 'Edit',     icon: <Edit size="var(--size-icon-sm)" />,     shortcut: '⌘E' },
  { id: 'copy',     label: 'Copy',     icon: <Copy size="var(--size-icon-sm)" />,     shortcut: '⌘C' },
  { id: 'download', label: 'Download', icon: <Download size="var(--size-icon-sm)" />, shortcut: '⌘D' },
  {
    id: 'open-link',
    label: 'Open in new tab',
    icon: <ExternalLink size="var(--size-icon-sm)" />,
    href: 'https://geeklego.dev',
    target: '_blank',
  },
  { type: 'separator', id: 'sep-2' },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 size="var(--size-icon-sm)" />,
    destructive: true,
    shortcut: '⌫',
    onClick: () => console.log('Delete'),
  },
];

const groupedItems: DropdownMenuItemType[] = [
  {
    type: 'group',
    id: 'group-account',
    label: 'Account',
    items: [
      { id: 'g-profile',  label: 'Profile',  icon: <User size="var(--size-icon-sm)" /> },
      { id: 'g-settings', label: 'Settings', icon: <Settings size="var(--size-icon-sm)" /> },
    ],
  },
  { type: 'separator', id: 'sep-3' },
  {
    type: 'group',
    id: 'group-support',
    label: 'Support',
    items: [
      { id: 'g-notifs', label: 'Notifications', icon: <Bell size="var(--size-icon-sm)" /> },
      { id: 'g-help',   label: 'Help centre',   icon: <HelpCircle size="var(--size-icon-sm)" /> },
    ],
  },
  { type: 'separator', id: 'sep-4' },
  {
    id: 'g-logout',
    label: 'Sign out',
    icon: <LogOut size="var(--size-icon-sm)" />,
    destructive: true,
  },
];

// ── 1 · Default ───────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    placement: 'bottom-start',
    trigger: (
      <button
        type="button"
        className="inline-flex items-center gap-[var(--button-gap)] h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] text-button-md bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-primary-bg-hover)] active:bg-[var(--button-primary-bg-active)]"
      >
        Account
        <ChevronDown size="var(--size-icon-sm)" aria-hidden="true" />
      </button>
    ),
    items: accountItems,
  },
};

// ── 2 · Variants ─────────────────────────────────────────────────────────────
// Shows: plain items, items with icons, items with shortcuts, destructive item

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--spacing-layout-sm)] items-start p-[var(--spacing-layout-xs)]">
      {/* Plain text items — no icons */}
      <DropdownMenu
        trigger={
          <button type="button" className="inline-flex items-center gap-1 h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] text-button-md bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] border border-[var(--button-secondary-border)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-secondary-bg-hover)]">
            Plain items <ChevronDown size="var(--size-icon-sm)" aria-hidden="true" />
          </button>
        }
        items={[
          { id: 'p1', label: 'New file',   onClick: () => {} },
          { id: 'p2', label: 'Open file',  onClick: () => {} },
          { id: 'p3', label: 'Save file',  onClick: () => {} },
          { type: 'separator', id: 's' },
          { id: 'p4', label: 'Exit',       destructive: true },
        ]}
      />

      {/* Icons + shortcuts */}
      <DropdownMenu
        trigger={
          <button type="button" className="inline-flex items-center gap-1 h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] text-button-md bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] border border-[var(--button-secondary-border)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-secondary-bg-hover)]">
            With icons <ChevronDown size="var(--size-icon-sm)" aria-hidden="true" />
          </button>
        }
        items={contextMenuItems}
      />

      {/* Grouped */}
      <DropdownMenu
        trigger={
          <button type="button" className="inline-flex items-center gap-1 h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] text-button-md bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] border border-[var(--button-secondary-border)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-secondary-bg-hover)]">
            Grouped <ChevronDown size="var(--size-icon-sm)" aria-hidden="true" />
          </button>
        }
        items={groupedItems}
      />
    </div>
  ),
};

// ── 3 · Sizes (placement variants) ───────────────────────────────────────────

export const Sizes: Story = {
  name: 'Placement',
  render: () => (
    <div className="grid grid-cols-2 gap-[var(--spacing-layout-md)] p-[var(--spacing-layout-lg)]">
      {(['bottom-start', 'bottom-end', 'top-start', 'top-end'] as const).map((p) => (
        <div key={p} className="flex justify-center">
          <DropdownMenu
            placement={p}
            trigger={
              <button type="button" className="inline-flex items-center gap-1 h-[var(--button-height-sm)] px-[var(--button-px-sm)] rounded-[var(--button-radius)] text-button-sm bg-[var(--button-outline-bg)] text-[var(--button-outline-text)] border border-[var(--button-outline-border)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-outline-bg-hover)]">
                {p} <ChevronDown size="var(--size-icon-xs)" aria-hidden="true" />
              </button>
            }
            items={[
              { id: `${p}-1`, label: 'Option one', onClick: () => {} },
              { id: `${p}-2`, label: 'Option two', onClick: () => {} },
              { id: `${p}-3`, label: 'Option three', onClick: () => {} },
            ]}
          />
        </div>
      ))}
    </div>
  ),
};

// ── 4 · States ────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--spacing-layout-sm)] items-start p-[var(--spacing-layout-xs)]">
      {/* Disabled items */}
      <DropdownMenu
        trigger={
          <button type="button" className="inline-flex items-center gap-1 h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] text-button-md bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] border border-[var(--button-secondary-border)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-secondary-bg-hover)]">
            With disabled items <ChevronDown size="var(--size-icon-sm)" aria-hidden="true" />
          </button>
        }
        items={[
          { id: 'en1',  label: 'Enabled action',   icon: <Edit size="var(--size-icon-sm)" />,    onClick: () => {} },
          { id: 'dis1', label: 'Disabled action',  icon: <Copy size="var(--size-icon-sm)" />,    disabled: true },
          { id: 'en2',  label: 'Enabled action 2', icon: <Settings size="var(--size-icon-sm)" />, onClick: () => {} },
          { type: 'separator', id: 'ss' },
          { id: 'dis2', label: 'Disabled link',    href: '/disabled', disabled: true },
          {
            id: 'dest',
            label: 'Destructive (enabled)',
            icon: <Trash2 size="var(--size-icon-sm)" />,
            destructive: true,
            onClick: () => {},
          },
        ]}
      />

      {/* Icon-only trigger */}
      <DropdownMenu
        trigger={
          <button
            type="button"
            aria-label="More options"
            className="inline-flex items-center justify-center w-[var(--button-height-md)] h-[var(--button-height-md)] rounded-[var(--button-radius)] bg-[var(--button-ghost-bg)] text-[var(--button-ghost-text)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-ghost-bg-hover)]"
          >
            <MoreHorizontal size="var(--size-icon-md)" aria-hidden="true" />
          </button>
        }
        items={contextMenuItems}
      />
    </div>
  ),
};

// ── 5 · DarkMode ──────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-wrap gap-[var(--spacing-layout-sm)] items-start p-[var(--spacing-layout-sm)] bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <DropdownMenu
        trigger={
          <button type="button" className="inline-flex items-center gap-1 h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] text-button-md bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-primary-bg-hover)]">
            Account <ChevronDown size="var(--size-icon-sm)" aria-hidden="true" />
          </button>
        }
        items={accountItems}
      />
      <DropdownMenu
        trigger={
          <button type="button" className="inline-flex items-center gap-1 h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] text-button-md bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] border border-[var(--button-secondary-border)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-secondary-bg-hover)]">
            Grouped <ChevronDown size="var(--size-icon-sm)" aria-hidden="true" />
          </button>
        }
        items={groupedItems}
      />
    </div>
  ),
};

// ── 7 · Playground ───────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    placement: 'bottom-start',
    menuLabel: undefined,
    trigger: (
      <button
        type="button"
        className="inline-flex items-center gap-1 h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] text-button-md bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-primary-bg-hover)]"
      >
        Open menu <ChevronDown size="var(--size-icon-sm)" aria-hidden="true" />
      </button>
    ),
    items: accountItems,
  },
};

// ── 8 · Accessibility ─────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] p-[var(--spacing-layout-xs)]">
      {/*
        Keyboard: Tab to reach trigger · Enter/Space to open ·
                  ↑↓ to navigate items · Enter/Space to activate ·
                  Escape to close · Tab to close and advance focus
        Screen reader (menu closed): "Account, button, has popup, collapsed"
        Screen reader (menu open):   "Account menu, list"
                                     "View profile, ⌘P, 1 of 4" → "Sign out, 4 of 4"
        Disabled item:               "Disabled action, dimmed"
      */}

      {/* Standard accessible dropdown */}
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-2">
          Standard — trigger labelled by its text content
        </p>
        <DropdownMenu
          trigger={
            <button
              type="button"
              className="inline-flex items-center gap-1 h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] text-button-md bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-primary-bg-hover)]"
            >
              Account <ChevronDown size="var(--size-icon-sm)" aria-hidden="true" />
            </button>
          }
          items={accountItems}
        />
      </div>

      {/* Icon-only trigger — accessible name via aria-label */}
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-2">
          Icon-only trigger — accessible name via aria-label
        </p>
        <DropdownMenu
          trigger={
            <button
              type="button"
              aria-label="More options"
              className="inline-flex items-center justify-center w-[var(--button-height-md)] h-[var(--button-height-md)] rounded-[var(--button-radius)] bg-[var(--button-ghost-bg)] text-[var(--button-ghost-text)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-ghost-bg-hover)]"
            >
              <MoreHorizontal size="var(--size-icon-md)" aria-hidden="true" />
            </button>
          }
          items={contextMenuItems}
          menuLabel="Document actions"
        />
      </div>

      {/* Grouped with ARIA group labels */}
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-2">
          Grouped items — each group gets its own aria-label
        </p>
        <DropdownMenu
          trigger={
            <button
              type="button"
              className="inline-flex items-center gap-1 h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] text-button-md bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] border border-[var(--button-secondary-border)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-secondary-bg-hover)]"
            >
              User menu <ChevronDown size="var(--size-icon-sm)" aria-hidden="true" />
            </button>
          }
          items={groupedItems}
        />
      </div>
    </div>
  ),
};
