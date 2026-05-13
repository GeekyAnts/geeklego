import type { Meta, StoryObj } from '@storybook/react';
import { Home, BookOpen, Layers, FileText, Briefcase, Mail } from 'lucide-react';
import { Navbar } from './Navbar';
import type { NavbarItemDef } from './Navbar.types';

const meta: Meta<typeof Navbar> = {
  title: 'Molecules/Navbar',
  component: Navbar,
  parameters: { layout: 'padded' },
  argTypes: {
    variant:     { control: 'select', options: ['pills', 'underline', 'flush', 'bordered'] },
    size:        { control: 'select', options: ['sm', 'md', 'lg'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    schema:      { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Navbar>;

// ── Shared item sets ──────────────────────────────────────────────────────────

const basicItems: NavbarItemDef[] = [
  { id: 'home',     href: '/',         label: 'Home',     isActive: true  },
  { id: 'docs',     href: '/docs',     label: 'Docs'                       },
  { id: 'examples', href: '/examples', label: 'Examples'                   },
  { id: 'blog',     href: '/blog',     label: 'Blog'                       },
];

const iconItems: NavbarItemDef[] = [
  { id: 'home',    href: '/',      label: 'Home',    icon: <Home    size="var(--size-icon-sm)" />, isActive: true },
  { id: 'docs',    href: '/docs',  label: 'Docs',    icon: <BookOpen size="var(--size-icon-sm)" />               },
  { id: 'layers',  href: '/ui',    label: 'UI',      icon: <Layers   size="var(--size-icon-sm)" />               },
  { id: 'blog',    href: '/blog',  label: 'Blog',    icon: <FileText size="var(--size-icon-sm)" />               },
];

const stateItems: NavbarItemDef[] = [
  { id: 'active',   href: '/',       label: 'Active',   isActive: true  },
  { id: 'default',  href: '/a',      label: 'Default'                   },
  { id: 'disabled', href: '/b',      label: 'Disabled', disabled: true  },
];

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    items: basicItems,
    variant: 'pills',
    size: 'md',
    orientation: 'horizontal',
    'aria-label': 'Primary navigation',
  },
};

// ── 2. Variants ───────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
      {(['pills', 'underline', 'flush', 'bordered'] as const).map((v) => (
        <div key={v} className="flex flex-col gap-[var(--spacing-component-sm)]">
          <span className="text-label-sm text-[var(--color-text-secondary)] capitalize">{v}</span>
          <Navbar items={basicItems} variant={v} aria-label={`${v} navigation`} />
        </div>
      ))}
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s} className="flex flex-col gap-[var(--spacing-component-sm)]">
          <span className="text-label-sm text-[var(--color-text-secondary)]">
            {s === 'sm' ? 'Small (32 px)' : s === 'md' ? 'Medium (40 px)' : 'Large (48 px)'}
          </span>
          <Navbar items={basicItems} size={s} aria-label={`${s} navigation`} />
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <span className="text-label-sm text-[var(--color-text-secondary)]">Default items (pills)</span>
        <Navbar items={stateItems} aria-label="State demo pills" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <span className="text-label-sm text-[var(--color-text-secondary)]">Default items (underline)</span>
        <Navbar items={stateItems} variant="underline" aria-label="State demo underline" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <span className="text-label-sm text-[var(--color-text-secondary)]">With icons</span>
        <Navbar items={iconItems} aria-label="Icon items" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <span className="text-label-sm text-[var(--color-text-secondary)]">Vertical orientation</span>
        <Navbar
          items={stateItems}
          orientation="vertical"
          className="max-w-[200px]"
          aria-label="Vertical nav"
        />
      </div>
    </div>
  ),
};

// ── 5. DarkMode ───────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-[var(--spacing-component-xl)] p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      {(['pills', 'underline', 'flush', 'bordered'] as const).map((v) => (
        <div key={v} className="flex flex-col gap-[var(--spacing-component-xs)]">
          <span className="text-label-xs text-[var(--color-text-secondary)] capitalize">{v}</span>
          <Navbar items={basicItems} variant={v} aria-label={`dark ${v}`} />
        </div>
      ))}
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    items: basicItems,
    variant: 'pills',
    size: 'md',
    orientation: 'horizontal',
    'aria-label': 'Playground navigation',
    schema: false,
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)]">
      {/*
        Keyboard: Tab moves focus between links · Enter/Space follows a link
        Screen reader: announces "Navigation, navigation" (landmark) then
          "[label], link" / "[label], current, link" (NavItem)
        Multiple <nav> regions: each has a unique aria-label
      */}

      {/* Primary nav — unique aria-label distinguishes it from others */}
      <Navbar
        items={[
          { id: 'home',   href: '/',      label: 'Home',   isActive: true },
          { id: 'about',  href: '/about', label: 'About'                  },
          { id: 'contact',href: '/contact',label: 'Contact'               },
        ]}
        aria-label="Primary navigation"
      />

      {/* Secondary nav — different label prevents landmark collision */}
      <Navbar
        items={[
          { id: 'overview',  href: '/overview',  label: 'Overview',  isActive: true },
          { id: 'api',       href: '/api',        label: 'API reference'             },
          { id: 'changelog', href: '/changelog',  label: 'Changelog'                 },
          { id: 'locked',    href: '/locked',     label: 'Locked',   disabled: true  },
        ]}
        variant="underline"
        aria-label="Documentation navigation"
      />

      {/* With icons — decorative icons are aria-hidden by NavItem */}
      <Navbar
        items={[
          { id: 'work',    href: '/work',    label: 'Work',    icon: <Briefcase size="var(--size-icon-sm)" />, isActive: true },
          { id: 'contact', href: '/contact', label: 'Contact', icon: <Mail      size="var(--size-icon-sm)" />                },
        ]}
        aria-label="Portfolio navigation"
      />

      {/* Vertical nav — orientation does not change ARIA semantics */}
      <Navbar
        items={[
          { id: 'home',    href: '/',       label: 'Home',    isActive: true },
          { id: 'profile', href: '/profile',label: 'Profile'                 },
          { id: 'locked',  href: '/locked', label: 'Locked',  disabled: true },
        ]}
        orientation="vertical"
        variant="flush"
        className="max-w-[180px]"
        aria-label="Sidebar navigation"
      />
    </div>
  ),
};
