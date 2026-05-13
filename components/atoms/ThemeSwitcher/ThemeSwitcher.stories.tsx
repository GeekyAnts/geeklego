"use client"
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import type { ThemeSwitcherOption } from './ThemeSwitcher.types';

const meta: Meta<typeof ThemeSwitcher> = {
  title: 'Atoms/ThemeSwitcher',
  component: ThemeSwitcher,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: 'select',
      options: ['system', 'light', 'dark'],
    },
    defaultValue: {
      control: 'select',
      options: ['system', 'light', 'dark'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeSwitcher>;

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    defaultValue: 'system',
    size: 'md',
  },
};

// ── 2. Variants ───────────────────────────────────────────────────────────────

const lightDarkOptions: ThemeSwitcherOption[] = [
  { value: 'light', label: 'Light theme', icon: <Sun /> },
  { value: 'dark',  label: 'Dark theme',  icon: <Moon /> },
];

const threeOptions: ThemeSwitcherOption[] = [
  { value: 'system', label: 'System theme', icon: <Sun /> },
  { value: 'light',  label: 'Light theme',  icon: <Sun /> },
  { value: 'dark',   label: 'Dark theme',   icon: <Moon /> },
];

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 items-start">
      <div className="flex flex-col gap-2">
        <span className="text-label-sm text-[var(--color-text-secondary)]">2 options (light · dark)</span>
        <ThemeSwitcher defaultValue="light" options={lightDarkOptions} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label-sm text-[var(--color-text-secondary)]">3 options — default (system · light · dark)</span>
        <ThemeSwitcher defaultValue="system" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label-sm text-[var(--color-text-secondary)]">3 options (system · light · dark) — custom</span>
        <ThemeSwitcher defaultValue="system" options={threeOptions} />
      </div>
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 items-start">
      <div className="flex flex-col gap-2">
        <span className="text-label-sm text-[var(--color-text-secondary)]">sm</span>
        <ThemeSwitcher defaultValue="system" size="sm" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label-sm text-[var(--color-text-secondary)]">md (default)</span>
        <ThemeSwitcher defaultValue="light" size="md" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label-sm text-[var(--color-text-secondary)]">lg</span>
        <ThemeSwitcher defaultValue="dark" size="lg" />
      </div>
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <div className="flex flex-col gap-2">
        <span className="text-label-sm text-[var(--color-text-secondary)]">System selected</span>
        <ThemeSwitcher value="system" onChange={() => {}} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label-sm text-[var(--color-text-secondary)]">Light selected</span>
        <ThemeSwitcher value="light" onChange={() => {}} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label-sm text-[var(--color-text-secondary)]">Dark selected</span>
        <ThemeSwitcher value="dark" onChange={() => {}} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label-sm text-[var(--color-text-secondary)]">Controlled (interactive)</span>
        <ControlledExample />
      </div>
    </div>
  ),
};

function ControlledExample() {
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');
  return (
    <div className="flex items-center gap-4">
      <ThemeSwitcher value={theme} onChange={setTheme} />
      <span className="text-body-sm text-[var(--color-text-secondary)]">Active: {theme}</span>
    </div>
  );
}

// ── 5. DarkMode ───────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-[var(--color-bg-primary)] p-8 rounded-lg max-w-2xl">
      <div className="flex flex-col gap-6 items-start">
        <ThemeSwitcher defaultValue="dark" size="sm" />
        <ThemeSwitcher defaultValue="system" size="md" />
        <ThemeSwitcher defaultValue="light" size="lg" />
      </div>
    </div>
  ),
};

// ── 6. EdgeCases ──────────────────────────────────────────────────────────────

export const EdgeCases: Story = {
  render: () => {
    const [value, setValue] = useState<'light' | 'dark' | 'system'>('system');
    return (
      <div className="flex flex-col gap-[var(--spacing-layout-md)]">
        {/* Light theme - ThemeSwitcher showing in light */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Light theme context</p>
          <div data-theme="light" className="bg-white p-4 rounded border border-gray-200">
            <ThemeSwitcher defaultValue="light" size="md" />
          </div>
        </div>

        {/* Dark theme - ThemeSwitcher showing in dark */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Dark theme context</p>
          <div data-theme="dark" className="bg-[var(--color-bg-primary)] p-4 rounded">
            <ThemeSwitcher defaultValue="dark" size="md" />
          </div>
        </div>

        {/* Controlled state */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Controlled state</p>
          <ThemeSwitcher value={value} onChange={setValue} size="md" />
          <p className="text-caption-sm text-[var(--color-text-secondary)]">Current: {value}</p>
        </div>

        {/* Different sizes side by side */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">All sizes</p>
          <div className="flex gap-3 items-center">
            <ThemeSwitcher defaultValue="system" size="sm" />
            <ThemeSwitcher defaultValue="system" size="md" />
            <ThemeSwitcher defaultValue="system" size="lg" />
          </div>
        </div>
      </div>
    );
  },
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    defaultValue: 'system',
    size: 'md',
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-6 items-start">
      <p className="text-body-sm text-[var(--color-text-secondary)] max-w-sm">
        Use <kbd>Arrow Left</kbd> / <kbd>Arrow Right</kbd> to move between options.
        Selected option has <code>aria-pressed="true"</code>.
        Container has <code>role="group" aria-label="Theme"</code>.
      </p>
      <ThemeSwitcher
        defaultValue="system"
        aria-label="Application theme"
      />
      <div className="text-body-sm text-[var(--color-text-tertiary)]">
        Each button: <code>type="button" aria-pressed aria-label</code>.
        Icons: <code>aria-hidden="true"</code>.
      </div>
    </div>
  ),
};
