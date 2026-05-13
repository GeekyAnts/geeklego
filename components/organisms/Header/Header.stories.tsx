import type { Meta, StoryObj } from '@storybook/react';
import {
  Home,
  LayoutDashboard,
  BookOpen,
  Settings,
  Bell,
  Search,
  Star,
  Layers,
  HelpCircle,
  LogIn,
} from 'lucide-react';
import { Header } from './Header';
import { NavItem } from '../../atoms/NavItem/NavItem';
import { Button } from '../../atoms/Button/Button';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { Badge } from '../../atoms/Badge/Badge';

// ── Shared building blocks ─────────────────────────────────────────────────

const Logo = () => (
  <span
    className="flex h-[var(--size-icon-xl)] w-[var(--size-icon-xl)] items-center justify-center rounded-[var(--radius-component-md)] bg-[var(--color-action-primary)] text-[var(--color-text-inverse)] text-label-md font-bold"
    aria-hidden="true"
  >
    GL
  </span>
);

const PrimaryNav = ({ schema }: { schema?: boolean }) => (
  <>
    <NavItem href="/" label="Home" icon={<Home size="var(--size-icon-sm)" />} isActive schema={schema} />
    <NavItem href="/dashboard" label="Dashboard" icon={<LayoutDashboard size="var(--size-icon-sm)" />} schema={schema} />
    <NavItem href="/docs" label="Docs" icon={<BookOpen size="var(--size-icon-sm)" />} schema={schema} />
    <NavItem href="/components" label="Components" icon={<Layers size="var(--size-icon-sm)" />} schema={schema} />
  </>
);

// ── Meta ───────────────────────────────────────────────────────────────────

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Page-level banner landmark (`<header>`) with compound slots for brand, navigation, and actions. Manages responsive mobile menu state internally.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

// ── 1. Default ────────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Default',
  render: () => (
    <Header>
      <Header.Brand href="/">
        <Logo />
        <span className="truncate-label text-heading-h5">Geeklego</span>
      </Header.Brand>

      <Header.Nav>
        <PrimaryNav />
      </Header.Nav>

      <Header.Actions>
        <Button variant="ghost" size="sm">Sign in</Button>
        <Button variant="primary" size="sm">Get started</Button>
      </Header.Actions>
    </Header>
  ),
};

// ── 2. Variants ────────────────────────────────────────────────────────────

export const Variants: Story = {
  name: 'Variants',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      {/* Minimal — brand + single CTA, no nav */}
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] px-4 py-2">Minimal (brand + CTA only)</p>
        <Header>
          <Header.Brand href="/">
            <Logo />
            <span className="truncate-label text-heading-h5">Geeklego</span>
          </Header.Brand>
          <Header.Actions>
            <Button variant="primary" size="sm">Get started</Button>
          </Header.Actions>
        </Header>
      </div>

      {/* Standard — brand + nav + actions */}
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] px-4 py-2">Standard (brand + nav + actions)</p>
        <Header>
          <Header.Brand href="/">
            <Logo />
            <span className="truncate-label text-heading-h5">Geeklego</span>
          </Header.Brand>
          <Header.Nav>
            <PrimaryNav />
          </Header.Nav>
          <Header.Actions>
            <Button variant="ghost" size="sm">Sign in</Button>
            <Button variant="primary" size="sm">Get started</Button>
          </Header.Actions>
        </Header>
      </div>

      {/* App — brand + nav + icon actions + avatar */}
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] px-4 py-2">App shell (nav + icon actions + avatar)</p>
        <Header>
          <Header.Brand href="/">
            <Logo />
            <span className="truncate-label text-heading-h5 hidden sm:block">Geeklego</span>
          </Header.Brand>
          <Header.Nav>
            <NavItem href="/" label="Dashboard" isActive />
            <NavItem href="/settings" label="Settings" />
            <NavItem href="/help" label="Help" />
          </Header.Nav>
          <Header.Actions>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              leftIcon={<Bell size="var(--size-icon-md)" aria-hidden="true" />}
            >
              Notifications
            </Button>
            <Avatar variant="initials" initials="JD" size="sm" />
          </Header.Actions>
        </Header>
      </div>
    </div>
  ),
};

// ── 3. Sizes ───────────────────────────────────────────────────────────────
// Header has a single fixed height via --header-height token.
// This story demonstrates nav density configurations.

export const Sizes: Story = {
  name: 'Sizes / Nav density',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      {/* Icon + label nav (default) */}
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] px-4 py-2">Icon + label nav items</p>
        <Header>
          <Header.Brand href="/">
            <Logo />
            <span className="truncate-label text-heading-h5">Geeklego</span>
          </Header.Brand>
          <Header.Nav>
            <NavItem href="/" label="Home" icon={<Home size="var(--size-icon-sm)" />} isActive />
            <NavItem href="/dashboard" label="Dashboard" icon={<LayoutDashboard size="var(--size-icon-sm)" />} />
            <NavItem href="/docs" label="Docs" icon={<BookOpen size="var(--size-icon-sm)" />} />
          </Header.Nav>
          <Header.Actions>
            <Button variant="primary" size="sm">Sign up</Button>
          </Header.Actions>
        </Header>
      </div>

      {/* Label-only nav */}
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] px-4 py-2">Label-only nav items</p>
        <Header>
          <Header.Brand href="/">
            <Logo />
            <span className="truncate-label text-heading-h5">Geeklego</span>
          </Header.Brand>
          <Header.Nav>
            <NavItem href="/" label="Home" isActive />
            <NavItem href="/dashboard" label="Dashboard" />
            <NavItem href="/docs" label="Docs" />
            <NavItem href="/components" label="Components" />
            <NavItem href="/about" label="About" />
          </Header.Nav>
          <Header.Actions>
            <Button variant="ghost" size="sm">Log in</Button>
            <Button variant="primary" size="sm">Sign up</Button>
          </Header.Actions>
        </Header>
      </div>
    </div>
  ),
};

// ── 4. States ──────────────────────────────────────────────────────────────

export const States: Story = {
  name: 'States',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      {/* Default state */}
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] px-4 py-2">Default (mobile menu closed)</p>
        <Header>
          <Header.Brand href="/">
            <Logo />
            <span className="truncate-label text-heading-h5">Geeklego</span>
          </Header.Brand>
          <Header.Nav>
            <NavItem href="/" label="Home" isActive />
            <NavItem href="/docs" label="Docs" />
            <NavItem href="/components" label="Components" />
          </Header.Nav>
          <Header.Actions>
            <Button variant="primary" size="sm">Get started</Button>
          </Header.Actions>
        </Header>
      </div>

      {/* With badge count on nav item */}
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] px-4 py-2">Nav item with badge notification</p>
        <Header>
          <Header.Brand href="/">
            <Logo />
            <span className="truncate-label text-heading-h5">Geeklego</span>
          </Header.Brand>
          <Header.Nav>
            <NavItem href="/" label="Home" isActive />
            <NavItem
              href="/inbox"
              label="Inbox"
              badge={<Badge variant="solid" size="sm">4</Badge>}
            />
            <NavItem href="/settings" label="Settings" />
          </Header.Nav>
          <Header.Actions>
            <Button
              variant="ghost"
              size="sm"
              iconOnly
              leftIcon={<Search size="var(--size-icon-md)" aria-hidden="true" />}
            >
              Search
            </Button>
            <Avatar variant="initials" initials="AB" size="sm" />
          </Header.Actions>
        </Header>
      </div>

      {/* With schema microdata */}
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] px-4 py-2">Schema.org WPHeader microdata (schema=true)</p>
        <Header schema>
          <Header.Brand href="/">
            <Logo />
            <span className="truncate-label text-heading-h5">Geeklego</span>
          </Header.Brand>
          <Header.Nav>
            <NavItem href="/" label="Home" isActive schema />
            <NavItem href="/docs" label="Docs" schema />
          </Header.Nav>
          <Header.Actions>
            <Button variant="primary" size="sm">Get started</Button>
          </Header.Actions>
        </Header>
      </div>
    </div>
  ),
};

// ── 5. DarkMode ────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  name: 'Dark Mode',
  render: () => (
    <div
      data-theme="dark"
      className="bg-primary rounded-[var(--radius-component-lg)] max-w-2xl overflow-hidden"
    >
      <Header>
        <Header.Brand href="/">
          <Logo />
          <span className="truncate-label text-heading-h5">Geeklego</span>
        </Header.Brand>
        <Header.Nav>
          <NavItem href="/" label="Home" isActive />
          <NavItem href="/dashboard" label="Dashboard" />
          <NavItem href="/docs" label="Docs" />
        </Header.Nav>
        <Header.Actions>
          <Button variant="ghost" size="sm">Sign in</Button>
          <Button variant="primary" size="sm">Get started</Button>
        </Header.Actions>
      </Header>
    </div>
  ),
};

// ── 6. Loading ─────────────────────────────────────────────────────────────

export const Loading: Story = {
  name: 'Loading',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] px-4 py-2">Loading — skeleton placeholders replace nav content; aria-busy="true" on the header</p>
        <Header loading>
          <Header.Brand href="/">
            <Logo />
            <span className="truncate-label text-heading-h5">Geeklego</span>
          </Header.Brand>
          <Header.Nav>
            <NavItem href="/" label="Home" isActive />
            <NavItem href="/dashboard" label="Dashboard" />
            <NavItem href="/docs" label="Docs" />
            <NavItem href="/components" label="Components" />
          </Header.Nav>
          <Header.Actions>
            <Button variant="ghost" size="sm">Sign in</Button>
            <Button variant="primary" size="sm">Get started</Button>
          </Header.Actions>
        </Header>
      </div>

      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] px-4 py-2">Resolved — nav content visible once loading completes</p>
        <Header>
          <Header.Brand href="/">
            <Logo />
            <span className="truncate-label text-heading-h5">Geeklego</span>
          </Header.Brand>
          <Header.Nav>
            <NavItem href="/" label="Home" isActive />
            <NavItem href="/dashboard" label="Dashboard" />
            <NavItem href="/docs" label="Docs" />
            <NavItem href="/components" label="Components" />
          </Header.Nav>
          <Header.Actions>
            <Button variant="ghost" size="sm">Sign in</Button>
            <Button variant="primary" size="sm">Get started</Button>
          </Header.Actions>
        </Header>
      </div>
    </div>
  ),
};

// ── 7. Playground ──────────────────────────────────────────────────────────

export const Playground: Story = {
  name: 'Playground',
  args: {
    schema: false,
    i18nStrings: {
      navLabel: 'Primary',
      mobileNavLabel: 'Navigation',
      openMenuLabel: 'Open menu',
      closeMenuLabel: 'Close menu',
    },
  },
  render: (args) => (
    <Header {...args}>
      <Header.Brand href="/">
        <Logo />
        <span className="truncate-label text-heading-h5">Geeklego</span>
      </Header.Brand>
      <Header.Nav>
        <NavItem href="/" label="Home" isActive />
        <NavItem href="/dashboard" label="Dashboard" />
        <NavItem href="/docs" label="Docs" />
        <NavItem href="/components" label="Components" />
      </Header.Nav>
      <Header.Actions>
        <Button variant="ghost" size="sm" iconOnly leftIcon={<Bell size="var(--size-icon-md)" aria-hidden="true" />}>
          Notifications
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          leftIcon={<Settings size="var(--size-icon-md)" aria-hidden="true" />}
        >
          Settings
        </Button>
        <Button variant="ghost" size="sm">Sign in</Button>
        <Button variant="primary" size="sm">Get started</Button>
      </Header.Actions>
    </Header>
  ),
};

// ── 8. Accessibility ───────────────────────────────────────────────────────

export const Accessibility: Story = {
  name: 'Accessibility',
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      {/*
        Keyboard: Tab to focus · Enter/Space to activate links/buttons
                  Escape dismisses mobile menu
        Screen reader:
          - <header> announced as "banner" landmark
          - <nav aria-label="Primary"> announced as "Primary navigation"
          - Mobile toggle: "Open menu, button" / "Close menu, expanded, button"
          - NavItem links: "[label], link" / "[label], current page, link"
          - Brand link: "Geeklego, link"
      */}

      {/* Full a11y example: all ARIA attributes exercised */}
      <Header
        aria-label="Site header"
        i18nStrings={{
          navLabel: 'Primary',
          mobileNavLabel: 'Navigation',
          openMenuLabel: 'Open menu',
          closeMenuLabel: 'Close menu',
        }}
      >
        <Header.Brand href="/">
          <Logo />
          <span className="truncate-label text-heading-h5">Geeklego</span>
        </Header.Brand>

        <Header.Nav>
          {/* Active nav item — aria-current="page" applied by NavItem */}
          <NavItem href="/" label="Home" isActive />
          {/* Standard nav items */}
          <NavItem href="/dashboard" label="Dashboard" />
          {/* Disabled nav item */}
          <NavItem href="/beta" label="Beta" disabled />
          {/* Nav item with notification badge */}
          <NavItem
            href="/inbox"
            label="Inbox"
            badge={
              <Badge variant="solid" size="sm" aria-label="4 unread messages">
                4
              </Badge>
            }
          />
        </Header.Nav>

        <Header.Actions>
          {/* Icon-only button — aria-label on Button via children when iconOnly */}
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            leftIcon={<HelpCircle size="var(--size-icon-md)" aria-hidden="true" />}
          >
            Help
          </Button>
          {/* Sign in with explicit label */}
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<LogIn size="var(--size-icon-sm)" aria-hidden="true" />}
          >
            Sign in
          </Button>
          {/* Avatar with descriptive alt */}
          <Avatar
            variant="initials"
            initials="JD"
            size="sm"
            aria-label="Jane Doe — open user menu"
          />
        </Header.Actions>
      </Header>

      <div className="px-4">
        <p className="text-body-sm text-[var(--color-text-secondary)]">
          Resize below 768 px to reveal the mobile menu toggle (☰). Press Escape or
          click outside to dismiss the mobile panel.
        </p>
      </div>
    </div>
  ),
};
