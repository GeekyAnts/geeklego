"use client"
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  SquareTerminal,
  Bot,
  BookOpen,
  Settings2,
  ChevronsUpDown,
  ChevronRight,
  GalleryVerticalEnd,
  LayoutDashboard,
  User,
  Receipt,
  Users,
  LifeBuoy,
  Plus,
  MoreHorizontal,
} from 'lucide-react';
import { Sidebar, SidebarProvider, useSidebar } from './Sidebar';
import { Avatar } from '../../atoms/Avatar/Avatar';

// ── Shared building blocks ─────────────────────────────────────────────────

/** Workspace switcher shown in the header row */
const WorkspaceSwitcherRow = () => (
  <Sidebar.MenuButton
    size="lg"
    tooltip="Acme Inc"
    icon={
      <span
        className="flex aspect-square w-[var(--sidebar-logo-size)] items-center justify-center rounded-[var(--sidebar-logo-radius)] bg-[var(--sidebar-logo-bg)] text-[var(--sidebar-logo-color)]"
        aria-hidden="true"
      >
        <GalleryVerticalEnd size={16} />
      </span>
    }
    suffix={<ChevronsUpDown size={16} />}
    className="data-[state=open]:bg-[var(--sidebar-menu-button-bg-active)]"
  >
    <span className="grid flex-1 text-start">
      <span className="truncate-label text-body-sm font-semibold leading-none text-[var(--sidebar-workspace-name-color)]">
        Acme Inc
      </span>
      <span className="truncate-label text-body-xs leading-none text-[var(--sidebar-workspace-tier-color)]">
        Enterprise
      </span>
    </span>
  </Sidebar.MenuButton>
);

/** User footer row */
const UserFooterRow = () => (
  <Sidebar.MenuButton
    size="lg"
    tooltip="shadcn"
    icon={<Avatar variant="initials" initials="SC" size="sm" shape="rounded" aria-hidden="true" />}
    suffix={<ChevronsUpDown size={16} />}
  >
    <span className="grid flex-1 text-start">
      <span className="truncate-label text-body-sm font-semibold leading-none text-[var(--sidebar-footer-name-color)]">
        shadcn
      </span>
      <span className="truncate-label text-body-xs leading-none text-[var(--sidebar-footer-email-color)]">
        m@example.com
      </span>
    </span>
  </Sidebar.MenuButton>
);

/** Collapsible nav item using Sidebar.Menu primitives */
const PlaygroundNavItem = () => {
  const [open, setOpen] = useState(true);
  const { state, collapsible } = useSidebar();
  const isIconMode = state === 'collapsed' && collapsible === 'icon';

  return (
    <Sidebar.MenuItem>
      <Sidebar.MenuButton
        icon={<SquareTerminal size="var(--size-icon-sm)" />}
        suffix={
          <ChevronRight
            size="var(--size-icon-sm)"
            className={open ? 'rotate-90 transition-default' : 'transition-default'}
          />
        }
        onClick={() => setOpen((v) => !v)}
        aria-expanded={!isIconMode ? open : undefined}
        tooltip="Playground"
      >
        <span className="content-flex truncate-label">Playground</span>
      </Sidebar.MenuButton>
      {!isIconMode && open && (
        <Sidebar.MenuSub>
          <Sidebar.MenuSubItem>
            <Sidebar.MenuSubButton href="/playground/history">History</Sidebar.MenuSubButton>
          </Sidebar.MenuSubItem>
          <Sidebar.MenuSubItem>
            <Sidebar.MenuSubButton href="/playground/starred" isActive>
              Starred
            </Sidebar.MenuSubButton>
          </Sidebar.MenuSubItem>
          <Sidebar.MenuSubItem>
            <Sidebar.MenuSubButton href="/playground/settings">Settings</Sidebar.MenuSubButton>
          </Sidebar.MenuSubItem>
        </Sidebar.MenuSub>
      )}
    </Sidebar.MenuItem>
  );
};

/** Standard sidebar content used across most stories */
const DefaultSidebarContent = () => (
  <>
    <Sidebar.Header>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <WorkspaceSwitcherRow />
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Header>

    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <PlaygroundNavItem />
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                icon={<Bot size="var(--size-icon-sm)" />}
                href="/models"
                tooltip="Models"
              >
                Models
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                icon={<BookOpen size="var(--size-icon-sm)" />}
                href="/docs"
                tooltip="Documentation"
              >
                Documentation
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                icon={<Settings2 size="var(--size-icon-sm)" />}
                href="/settings"
                tooltip="Settings"
              >
                Settings
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar.Content>

    <Sidebar.Footer>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <UserFooterRow />
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Footer>
  </>
);

// ── Meta ───────────────────────────────────────────────────────────────────

const meta: Meta<typeof Sidebar> = {
  title: 'Organisms/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

// ── Story 1 — Default (icon-rail collapsible) ──────────────────────────────

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <DefaultSidebarContent />
        <Sidebar.Rail />
      </Sidebar>
      <div className="flex flex-1 flex-col">
        <header className="flex h-[var(--sidebar-header-height)] items-center gap-2 border-b border-[var(--color-border-subtle)] px-4">
          <Sidebar.Trigger />
          <span className="h-4 w-px bg-[var(--sidebar-divider-color)]" aria-hidden="true" />
          <span className="text-body-sm text-[var(--color-text-secondary)]">Dashboard</span>
        </header>
        <main className="flex-1 p-8">
          <p className="text-body-sm text-[var(--color-text-secondary)]">Main content area</p>
        </main>
      </div>
    </SidebarProvider>
  ),
};

// ── Story 1b — Collapsed icon-rail (verify collapsed state) ───────────────

export const CollapsedIconRail: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon">
        <DefaultSidebarContent />
        <Sidebar.Rail />
      </Sidebar>
      <div className="flex flex-1 flex-col">
        <header className="flex h-[var(--sidebar-header-height)] items-center gap-2 border-b border-[var(--color-border-subtle)] px-4">
          <Sidebar.Trigger />
          <span className="text-body-sm text-[var(--color-text-secondary)]">Dashboard</span>
        </header>
        <main className="flex-1 p-8">
          <p className="text-body-sm text-[var(--color-text-secondary)]">Icon-rail collapsed state</p>
        </main>
      </div>
    </SidebarProvider>
  ),
};

// ── Story 1c — SSR-safe persist ────────────────────────────────────────────
// SidebarProvider initialises with `defaultOpen` on both server and client.
// When `persist=true`, localStorage is read in a useEffect after mount —
// never at render time — so there is no hydration mismatch.
// Open your browser console: zero hydration warnings should appear.
// Toggle the sidebar, reload the page — state is restored correctly.

export const SSRSafe: Story = {
  render: () => (
    <SidebarProvider persist defaultOpen={true}>
      <Sidebar collapsible="icon">
        <DefaultSidebarContent />
        <Sidebar.Rail />
      </Sidebar>
      <div className="flex flex-1 flex-col">
        <header className="flex h-[var(--sidebar-header-height)] items-center gap-2 border-b border-[var(--color-border-subtle)] px-4">
          <Sidebar.Trigger />
          <span className="h-4 w-px bg-[var(--sidebar-divider-color)]" aria-hidden="true" />
          <span className="text-body-sm text-[var(--color-text-secondary)]">
            persist=true — state restored from localStorage after mount, no hydration mismatch
          </span>
        </header>
        <main className="flex-1 p-8">
          <p className="text-body-sm text-[var(--color-text-secondary)]">
            Toggle the sidebar. Reload the page. The collapsed/expanded state persists without a React hydration warning.
          </p>
          <p className="text-body-sm text-[var(--color-text-secondary)] mt-4">
            Server always renders <code className="text-body-sm font-mono">defaultOpen=true</code>.
            Client reads localStorage in a <code className="text-body-sm font-mono">useEffect</code> after hydration completes.
          </p>
        </main>
      </div>
    </SidebarProvider>
  ),
};

// ── Story 2 — Offcanvas collapsible ────────────────────────────────────────

export const CollapsibleOffcanvas: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="offcanvas">
        <DefaultSidebarContent />
      </Sidebar>
      <div className="flex flex-1 flex-col">
        <header className="flex h-[var(--sidebar-header-height)] items-center gap-2 border-b border-[var(--color-border-subtle)] px-4">
          <Sidebar.Trigger />
          <span className="h-4 w-px bg-[var(--sidebar-divider-color)]" aria-hidden="true" />
          <span className="text-body-sm text-[var(--color-text-secondary)]">Dashboard</span>
        </header>
        <main className="flex-1 p-8">
          <p className="text-body-sm text-[var(--color-text-secondary)]">
            Click the trigger to slide the sidebar in from the left.
          </p>
        </main>
      </div>
    </SidebarProvider>
  ),
};

// ── Story 3 — Multi-group sidebar ─────────────────────────────────────────

export const WithGroups: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <Sidebar.Header>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <WorkspaceSwitcherRow />
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Header>

        <Sidebar.Content>
          {/* Platform group */}
          <Sidebar.Group>
            <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
            <Sidebar.GroupAction aria-label="Add project">
              <Plus size="var(--size-icon-sm)" aria-hidden="true" />
            </Sidebar.GroupAction>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton
                    icon={<LayoutDashboard size="var(--size-icon-sm)" />}
                    href="/dashboard"
                    isActive
                    tooltip="Dashboard"
                  >
                    Dashboard
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton
                    icon={<Bot size="var(--size-icon-sm)" />}
                    href="/models"
                    tooltip="Models"
                  >
                    Models
                  </Sidebar.MenuButton>
                  <Sidebar.MenuBadge>3</Sidebar.MenuBadge>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>

          <Sidebar.Separator />

          {/* Settings group */}
          <Sidebar.Group>
            <Sidebar.GroupLabel>Settings</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton
                    icon={<User size="var(--size-icon-sm)" />}
                    href="/account"
                    tooltip="Account"
                  >
                    Account
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton
                    icon={<Receipt size="var(--size-icon-sm)" />}
                    href="/billing"
                    tooltip="Billing"
                  >
                    Billing
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton
                    icon={<Users size="var(--size-icon-sm)" />}
                    href="/team"
                    tooltip="Team"
                  >
                    Team
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>

          {/* Help group — pushed to bottom */}
          <Sidebar.Group className="mt-auto">
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton
                    icon={<LifeBuoy size="var(--size-icon-sm)" />}
                    href="/support"
                    tooltip="Support"
                  >
                    Support
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>

        <Sidebar.Footer>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <UserFooterRow />
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Footer>
        <Sidebar.Rail />
      </Sidebar>
      <div className="flex-1 p-8">
        <p className="text-body-sm text-[var(--color-text-secondary)]">Main content area</p>
      </div>
    </SidebarProvider>
  ),
};

// ── Story 4 — States (loading skeleton + disabled + action + badge) ────────

export const States: Story = {
  render: () => (
    <div className="flex gap-4 h-screen bg-[var(--color-bg-primary)]">
      {/* Loading skeleton */}
      <SidebarProvider>
        <Sidebar collapsible="none">
          <Sidebar.Header>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuSkeleton showIcon />
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Loading…</Sidebar.GroupLabel>
              <Sidebar.GroupContent>
                <Sidebar.Menu>
                  {[1, 2, 3, 4].map((i) => (
                    <Sidebar.MenuItem key={i}>
                      <Sidebar.MenuSkeleton showIcon />
                    </Sidebar.MenuItem>
                  ))}
                </Sidebar.Menu>
              </Sidebar.GroupContent>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuSkeleton showIcon />
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Footer>
        </Sidebar>
      </SidebarProvider>

      {/* Active, disabled, badge, hover-action */}
      <SidebarProvider>
        <Sidebar collapsible="none">
          <Sidebar.Header>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <WorkspaceSwitcherRow />
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>States</Sidebar.GroupLabel>
              <Sidebar.GroupContent>
                <Sidebar.Menu>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton
                      icon={<LayoutDashboard size="var(--size-icon-sm)" />}
                      isActive
                    >
                      Active item
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton
                      icon={<Bot size="var(--size-icon-sm)" />}
                      disabled
                    >
                      Disabled item
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton icon={<BookOpen size="var(--size-icon-sm)" />}>
                      With badge
                    </Sidebar.MenuButton>
                    <Sidebar.MenuBadge>12</Sidebar.MenuBadge>
                  </Sidebar.MenuItem>
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton icon={<Settings2 size="var(--size-icon-sm)" />}>
                      Hover for action
                    </Sidebar.MenuButton>
                    <Sidebar.MenuAction
                      aria-label="More options"
                      showOnHover
                    >
                      <MoreHorizontal size="var(--size-icon-sm)" aria-hidden="true" />
                    </Sidebar.MenuAction>
                  </Sidebar.MenuItem>
                </Sidebar.Menu>
              </Sidebar.GroupContent>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <UserFooterRow />
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Footer>
        </Sidebar>
      </SidebarProvider>
    </div>
  ),
  decorators: [(Story) => <Story />],
};

// ── Story 5 — Floating variant ─────────────────────────────────────────────

export const Floating: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="floating">
        <DefaultSidebarContent />
        <Sidebar.Rail />
      </Sidebar>
      <div className="flex flex-1 flex-col">
        <header className="flex h-[var(--sidebar-header-height)] items-center gap-2 px-4">
          <Sidebar.Trigger />
          <span className="text-body-sm text-[var(--color-text-secondary)]">Dashboard</span>
        </header>
        <main className="flex-1 p-8">
          <p className="text-body-sm text-[var(--color-text-secondary)]">
            Floating variant — sidebar has rounded corners and a shadow.
          </p>
        </main>
      </div>
    </SidebarProvider>
  ),
};

// ── Story 6 — Dark mode ─────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="flex h-[600px] max-w-2xl bg-[var(--color-bg-primary)]">
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <DefaultSidebarContent />
          <Sidebar.Rail />
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <header className="flex h-[var(--sidebar-header-height)] items-center gap-2 border-b border-[var(--color-border-subtle)] px-4">
            <Sidebar.Trigger />
          </header>
          <main className="flex-1 p-8">
            <p className="text-body-sm text-[var(--color-text-secondary)]">Dark mode</p>
          </main>
        </div>
      </SidebarProvider>
    </div>
  ),
  decorators: [(Story) => <Story />],
};

// ── Story 8 — Playground (all controls) ────────────────────────────────────

export const Playground: Story = {
  argTypes: {
    collapsible: {
      control: 'select',
      options: ['offcanvas', 'icon', 'none'],
      description: 'Collapse behaviour',
    },
    variant: {
      control: 'select',
      options: ['sidebar', 'floating', 'inset'],
      description: 'Visual style variant',
    },
    side: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Which edge the sidebar renders on',
    },
  },
  args: {
    collapsible: 'icon',
    variant: 'sidebar',
    side: 'left',
  },
  render: (args) => (
    <SidebarProvider>
      <Sidebar {...args}>
        <DefaultSidebarContent />
        <Sidebar.Rail />
      </Sidebar>
      <div className="flex flex-1 flex-col">
        <header className="flex h-[var(--sidebar-header-height)] items-center gap-2 border-b border-[var(--color-border-subtle)] px-4">
          <Sidebar.Trigger />
          <span className="h-4 w-px bg-[var(--sidebar-divider-color)]" aria-hidden="true" />
          <span className="text-body-sm text-[var(--color-text-secondary)]">
            {args.variant} / {args.collapsible} / {args.side}
          </span>
        </header>
        <main className="flex-1 p-8">
          <p className="text-body-sm text-[var(--color-text-secondary)]">Main content area</p>
        </main>
      </div>
    </SidebarProvider>
  ),
};

// ── Story 9 — Accessibility ─────────────────────────────────────────────────
/**
 * Keyboard interaction:
 *
 * - **Tab** — moves into the sidebar; first Tab stop is `<Sidebar.Trigger>`.
 * - **Tab (again)** — enters `<Sidebar.Content>`; first nav item gets focus.
 * - **↓ / ↑** — moves between `<SidebarMenuButton>` items (roving tabindex).
 * - **Enter / Space** — activates a link or opens a sub-menu.
 * - **Tab** — exits the nav and reaches the footer `<SidebarMenuButton>`.
 * - **Cmd+B / Ctrl+B** — toggles sidebar from anywhere in the page (keyboard shortcut).
 * - **`<SidebarRail>`** receives `tabIndex={-1}` so it is reachable by pointer only.
 *
 * Landmarks:
 * - `<aside>` → complementary landmark (announced as "Sidebar navigation")
 * - `<Sidebar.Content>` → scrollable content wrapper
 * - `<Sidebar.Footer>` → scoped footer inside the aside
 *
 * Icon-rail mode:
 * - When `state === 'collapsed'` + `collapsible === 'icon'`, `<SidebarMenuButton>`
 *   hides text and exposes the `tooltip` prop as a native `title` attribute.
 *   Screen readers still announce the accessible name from `title`.
 */
export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <Sidebar.Header>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <WorkspaceSwitcherRow />
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Header>

        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <PlaygroundNavItem />
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton
                    icon={<Bot size="var(--size-icon-sm)" />}
                    href="/models"
                    aria-label="Models"
                    tooltip="Models"
                  >
                    Models
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton
                    icon={<BookOpen size="var(--size-icon-sm)" />}
                    href="/docs"
                    tooltip="Documentation"
                    disabled
                    aria-disabled
                  >
                    Documentation
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton
                    icon={<Settings2 size="var(--size-icon-sm)" />}
                    href="/settings"
                    tooltip="Settings"
                    isActive
                    aria-current="page"
                  >
                    Settings
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>

        <Sidebar.Footer>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <UserFooterRow />
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Footer>
        <Sidebar.Rail />
      </Sidebar>
      <div className="flex flex-1 flex-col">
        <header className="flex h-[var(--sidebar-header-height)] items-center gap-2 border-b border-[var(--color-border-subtle)] px-4">
          <Sidebar.Trigger />
        </header>
        <main className="flex-1 p-8">
          <p className="text-body-sm text-[var(--color-text-secondary)]">
            Use Tab, ↑↓ arrow keys, and Cmd+B / Ctrl+B to navigate.
          </p>
        </main>
      </div>
    </SidebarProvider>
  ),
};
