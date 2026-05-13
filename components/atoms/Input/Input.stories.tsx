import type { Meta, StoryObj } from '@storybook/react';
import { Search, Mail, Eye, EyeOff, Lock, User, AtSign } from 'lucide-react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'flushed', 'unstyled'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    error: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    type: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof Input>;

/* ── Default ─────────────────────────────────────────────────────────────── */
export const Default: Story = {
  args: {
    placeholder: 'Enter text…',
    variant: 'default',
    size: 'md',
    type: 'text',
  },
};

/* ── Variants — each uses a fundamentally different visual strategy ────────── */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] w-72">
      <div>
        <p className="text-label-sm text-secondary mb-2">Default — outlined border</p>
        <Input variant="default" placeholder="Default input" />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Filled — muted bg, no border</p>
        <Input variant="filled" placeholder="Filled input" />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Flushed — border-bottom only</p>
        <Input variant="flushed" placeholder="Flushed input" />
      </div>
      <div>
        <p className="text-label-sm text-secondary mb-2">Unstyled — blank slate</p>
        <Input variant="unstyled" placeholder="Unstyled input" />
      </div>
    </div>
  ),
};

/* ── Sizes ────────────────────────────────────────────────────────────────── */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] w-72">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div key={s}>
          <p className="text-label-sm text-secondary mb-2">{s.toUpperCase()}</p>
          <Input size={s} placeholder={`Size ${s}`} />
        </div>
      ))}
    </div>
  ),
};

/* ── States — every interactive state ────────────────────────────────────── */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] w-80">
      <div>
        <p className="text-label-sm text-secondary mb-2">Default</p>
        <Input placeholder="Enter value…" />
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-2">With value</p>
        <Input defaultValue="john.doe@example.com" />
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-2">Disabled</p>
        <Input placeholder="Cannot edit" disabled />
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-2">Error</p>
        <Input
          placeholder="Invalid email"
          defaultValue="not-an-email"
          error
        />
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-2">Loading</p>
        <Input placeholder="Validating…" isLoading />
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-2">With left icon</p>
        <Input
          placeholder="Search…"
          leftIcon={<Search size="var(--input-icon-size-md)" />}
        />
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-2">With right icon</p>
        <Input
          placeholder="Password"
          type="password"
          rightIcon={<Eye size="var(--input-icon-size-md)" />}
        />
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-2">With both icons</p>
        <Input
          placeholder="Username"
          leftIcon={<AtSign size="var(--input-icon-size-md)" />}
          rightIcon={<User size="var(--input-icon-size-md)" />}
        />
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-2">Password type</p>
        <Input
          type="password"
          placeholder="Enter password"
          leftIcon={<Lock size="var(--input-icon-size-md)" />}
        />
      </div>

      <div>
        <p className="text-label-sm text-secondary mb-2">Email type</p>
        <Input
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail size="var(--input-icon-size-md)" />}
        />
      </div>
    </div>
  ),
};

/* ── DarkMode ────────────────────────────────────────────────────────────── */
export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-[var(--spacing-component-lg)] p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl w-96"
    >
      <Input variant="default" placeholder="Default" />
      <Input variant="filled" placeholder="Filled" />
      <Input variant="flushed" placeholder="Flushed" />
      <Input
        variant="default"
        placeholder="With icon"
        leftIcon={<Search size="var(--input-icon-size-md)" />}
      />
      <Input variant="default" placeholder="Error state" error />
      <Input variant="default" placeholder="Loading…" isLoading />
      <Input variant="default" placeholder="Disabled" disabled />
    </div>
  ),
};

/* ── Playground — all props as controls ───────────────────────────────────── */
export const Playground: Story = {
  args: {
    placeholder: 'Type here…',
    variant: 'default',
    size: 'md',
    type: 'text',
    error: false,
    isLoading: false,
    disabled: false,
  },
};

/* ── Accessibility ────────────────────────────────────────────────────────── */
export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] w-80 p-[var(--spacing-layout-xs)]">
      {/*
        Keyboard: Tab to focus
        Screen reader: "Email, edit text" / "Search, edit text" / "Password, dimmed, edit text"
      */}

      {/* Explicit label association via htmlFor + id */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <label htmlFor="a11y-email" className="text-label-sm text-primary">
          Email address
        </label>
        <Input
          id="a11y-email"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail size="var(--input-icon-size-md)" />}
          aria-required="true"
        />
      </div>

      {/* Search — aria-label when no visible label */}
      <Input
        type="search"
        placeholder="Search…"
        aria-label="Search"
        leftIcon={<Search size="var(--input-icon-size-md)" />}
      />

      {/* Error: aria-invalid + aria-describedby link error message */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <label htmlFor="a11y-email-error" className="text-label-sm text-primary">
          Email address
        </label>
        <Input
          id="a11y-email-error"
          type="email"
          defaultValue="invalid-email"
          error
          aria-describedby="a11y-email-error-msg"
        />
        <p
          id="a11y-email-error-msg"
          role="alert"
          className="text-body-sm"
          style={{ color: 'var(--color-status-error)' }}
        >
          Please enter a valid email address.
        </p>
      </div>

      {/* Disabled: disabled attribute + aria-disabled, no hover/focus */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <label htmlFor="a11y-disabled" className="text-label-sm text-secondary">
          Account ID (read-only)
        </label>
        <Input
          id="a11y-disabled"
          defaultValue="USR-00412"
          disabled
          aria-label="Account ID, read-only"
        />
      </div>

      {/* Loading: aria-busy communicates async validation */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <label htmlFor="a11y-loading" className="text-label-sm text-primary">
          Username
        </label>
        <Input
          id="a11y-loading"
          defaultValue="johndoe"
          isLoading
          aria-label="Username, checking availability"
        />
      </div>

      {/* Password: type="password" + left icon */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <label htmlFor="a11y-password" className="text-label-sm text-primary">
          Password
        </label>
        <Input
          id="a11y-password"
          type="password"
          placeholder="Enter password"
          leftIcon={<Lock size="var(--input-icon-size-md)" />}
          rightIcon={<EyeOff size="var(--input-icon-size-md)" />}
          aria-required="true"
        />
      </div>
    </div>
  ),
};
