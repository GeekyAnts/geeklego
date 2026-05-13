import type { Meta, StoryObj } from '@storybook/react';
import { Home, Settings, User, Bell, BarChart2, FileText, Lock } from 'lucide-react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Organisms/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['line', 'enclosed', 'soft-rounded', 'solid-rounded'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    loading: { control: 'boolean' },
    loadingCount: { control: { type: 'number', min: 1, max: 8 } },
  },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    defaultValue: 'overview',
    variant: 'line',
    size: 'md',
  },
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="analytics">Analytics</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">
        <p>Overview content — key metrics and a summary of recent activity.</p>
      </Tabs.Panel>
      <Tabs.Panel value="analytics">
        <p>Analytics content — charts, funnels, and conversion data.</p>
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <p>Settings content — configure your account and preferences.</p>
      </Tabs.Panel>
    </Tabs>
  ),
};

// ── Variants ──────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      {(['line', 'enclosed', 'soft-rounded', 'solid-rounded'] as const).map((variant) => (
        <div key={variant}>
          <p className="text-body-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-component-sm)] capitalize">{variant}</p>
          <Tabs defaultValue="tab1" variant={variant}>
            <Tabs.List>
              <Tabs.Tab value="tab1">Account</Tabs.Tab>
              <Tabs.Tab value="tab2">Billing</Tabs.Tab>
              <Tabs.Tab value="tab3">Security</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="tab1"><p>Account settings and profile details.</p></Tabs.Panel>
            <Tabs.Panel value="tab2"><p>Manage your subscription and payment methods.</p></Tabs.Panel>
            <Tabs.Panel value="tab3"><p>Two-factor authentication and login history.</p></Tabs.Panel>
          </Tabs>
        </div>
      ))}
    </div>
  ),
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p className="text-body-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-component-sm)] uppercase">{size}</p>
          <Tabs defaultValue="profile" size={size}>
            <Tabs.List>
              <Tabs.Tab value="profile">Profile</Tabs.Tab>
              <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
              <Tabs.Tab value="privacy">Privacy</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="profile"><p>Edit your public profile information.</p></Tabs.Panel>
            <Tabs.Panel value="notifications"><p>Control how and when you receive notifications.</p></Tabs.Panel>
            <Tabs.Panel value="privacy"><p>Manage data sharing and privacy settings.</p></Tabs.Panel>
          </Tabs>
        </div>
      ))}
    </div>
  ),
};

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      <div>
        <p className="text-body-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-component-sm)]">With disabled tab</p>
        <Tabs defaultValue="active">
          <Tabs.List>
            <Tabs.Tab value="active">Active</Tabs.Tab>
            <Tabs.Tab value="disabled" disabled>Disabled</Tabs.Tab>
            <Tabs.Tab value="another">Another</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="active"><p>This tab is active and selectable.</p></Tabs.Panel>
          <Tabs.Panel value="disabled"><p>This content is not reachable.</p></Tabs.Panel>
          <Tabs.Panel value="another"><p>Another reachable panel.</p></Tabs.Panel>
        </Tabs>
      </div>

      <div>
        <p className="text-body-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-component-sm)]">With icons</p>
        <Tabs defaultValue="home">
          <Tabs.List>
            <Tabs.Tab value="home" icon={<Home size="var(--size-icon-sm)" />}>Home</Tabs.Tab>
            <Tabs.Tab value="analytics" icon={<BarChart2 size="var(--size-icon-sm)" />}>Analytics</Tabs.Tab>
            <Tabs.Tab value="profile" icon={<User size="var(--size-icon-sm)" />}>Profile</Tabs.Tab>
            <Tabs.Tab value="settings" icon={<Settings size="var(--size-icon-sm)" />}>Settings</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="home"><p>Home dashboard with an overview of your workspace.</p></Tabs.Panel>
          <Tabs.Panel value="analytics"><p>Analytics and reporting across your projects.</p></Tabs.Panel>
          <Tabs.Panel value="profile"><p>Your profile, avatar, and personal information.</p></Tabs.Panel>
          <Tabs.Panel value="settings"><p>Application-wide settings and configuration.</p></Tabs.Panel>
        </Tabs>
      </div>

      <div>
        <p className="text-body-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-component-sm)]">Loading</p>
        <Tabs defaultValue="tab1" loading loadingCount={4}>{null}</Tabs>
      </div>
    </div>
  ),
};

// ── Vertical ──────────────────────────────────────────────────────────────────

export const Vertical: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      <Tabs defaultValue="general" orientation="vertical">
        <Tabs.List>
          <Tabs.Tab value="general" icon={<Settings size="var(--size-icon-sm)" />}>General</Tabs.Tab>
          <Tabs.Tab value="notifications" icon={<Bell size="var(--size-icon-sm)" />}>Notifications</Tabs.Tab>
          <Tabs.Tab value="documents" icon={<FileText size="var(--size-icon-sm)" />}>Documents</Tabs.Tab>
          <Tabs.Tab value="security" icon={<Lock size="var(--size-icon-sm)" />}>Security</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="general">
          <p>General preferences — locale, timezone, and display options.</p>
        </Tabs.Panel>
        <Tabs.Panel value="notifications">
          <p>Email, push, and in-app notification preferences.</p>
        </Tabs.Panel>
        <Tabs.Panel value="documents">
          <p>Document storage, sharing permissions, and export settings.</p>
        </Tabs.Panel>
        <Tabs.Panel value="security">
          <p>Two-factor authentication, active sessions, and login activity.</p>
        </Tabs.Panel>
      </Tabs>
    </div>
  ),
};

// ── DarkMode ──────────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-[var(--spacing-layout-sm)] rounded-[var(--radius-component-lg)] max-w-2xl">
      <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
        {(['line', 'enclosed', 'soft-rounded', 'solid-rounded'] as const).map((variant) => (
          <Tabs key={variant} defaultValue="tab1" variant={variant}>
            <Tabs.List>
              <Tabs.Tab value="tab1">Overview</Tabs.Tab>
              <Tabs.Tab value="tab2">Analytics</Tabs.Tab>
              <Tabs.Tab value="tab3" disabled>Locked</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="tab1"><p>Dark mode panel — {variant} variant.</p></Tabs.Panel>
            <Tabs.Panel value="tab2"><p>Analytics data visualisation.</p></Tabs.Panel>
            <Tabs.Panel value="tab3"><p>Locked content.</p></Tabs.Panel>
          </Tabs>
        ))}
      </div>
    </div>
  ),
};

// ── Playground ────────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    defaultValue: 'overview',
    variant: 'line',
    size: 'md',
    orientation: 'horizontal',
    loading: false,
    loadingCount: 3,
  },
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Tab value="overview" icon={<Home size="var(--size-icon-sm)" />}>Overview</Tabs.Tab>
        <Tabs.Tab value="analytics" icon={<BarChart2 size="var(--size-icon-sm)" />}>Analytics</Tabs.Tab>
        <Tabs.Tab value="profile" icon={<User size="var(--size-icon-sm)" />}>Profile</Tabs.Tab>
        <Tabs.Tab value="settings" icon={<Settings size="var(--size-icon-sm)" />} disabled>Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">
        <p>This is the overview panel. Try switching tabs, using arrow keys, or toggling the <code>variant</code>, <code>size</code>, and <code>orientation</code> controls.</p>
      </Tabs.Panel>
      <Tabs.Panel value="analytics">
        <p>Analytics panel — metrics, charts, and trend data.</p>
      </Tabs.Panel>
      <Tabs.Panel value="profile">
        <p>Profile panel — user information and preferences.</p>
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <p>Settings panel — this tab is disabled and unreachable via keyboard or click.</p>
      </Tabs.Panel>
    </Tabs>
  ),
};

// ── Accessibility ─────────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      <Tabs
        defaultValue="account"
        aria-label="Account settings tabs"
        i18nStrings={{ listLabel: 'Account settings' }}
      >
        <Tabs.List aria-label="Account sections">
          <Tabs.Tab value="account" aria-label="Account tab">Account</Tabs.Tab>
          <Tabs.Tab value="billing" aria-label="Billing tab">Billing</Tabs.Tab>
          <Tabs.Tab value="security" aria-label="Security tab" disabled>Security (locked)</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="account" aria-label="Account panel">
          <p>Account settings panel. Focus this panel by pressing Tab after activating a tab.</p>
          <button type="button" className="mt-[var(--spacing-component-md)] px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)] bg-[var(--color-action-primary)] text-[var(--color-text-inverse)] rounded-[var(--radius-component-md)] focus-visible:outline-none focus-visible:focus-ring">
            Focusable element inside panel
          </button>
        </Tabs.Panel>
        <Tabs.Panel value="billing">
          <p>Billing settings panel.</p>
        </Tabs.Panel>
        <Tabs.Panel value="security">
          <p>Security settings panel — unreachable due to disabled tab.</p>
        </Tabs.Panel>
      </Tabs>
    </div>
  ),
};
