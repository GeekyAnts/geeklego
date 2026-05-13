"use client"
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Combobox } from './Combobox';
import type { ComboboxOption } from './Combobox.types';

// ── Shared mock data ──────────────────────────────────────────────────────

const frameworks: ComboboxOption[] = [
  { id: 'react',   label: 'React' },
  { id: 'vue',     label: 'Vue' },
  { id: 'angular', label: 'Angular' },
  { id: 'svelte',  label: 'Svelte' },
  { id: 'solid',   label: 'Solid' },
  { id: 'qwik',    label: 'Qwik' },
];

const plansWithDesc: ComboboxOption[] = [
  { id: 'free',       label: 'Free',       description: 'Up to 3 projects, 5 users' },
  { id: 'pro',        label: 'Pro',        description: 'Unlimited projects, 50 users' },
  { id: 'team',       label: 'Team',       description: 'Unlimited everything + priority support' },
  { id: 'enterprise', label: 'Enterprise', description: 'Custom SLA, SSO, dedicated infra' },
];

const countries: ComboboxOption[] = [
  { id: 'us', label: 'United States',  group: 'Americas' },
  { id: 'ca', label: 'Canada',         group: 'Americas' },
  { id: 'br', label: 'Brazil',         group: 'Americas' },
  { id: 'gb', label: 'United Kingdom', group: 'Europe' },
  { id: 'de', label: 'Germany',        group: 'Europe' },
  { id: 'fr', label: 'France',         group: 'Europe' },
  { id: 'jp', label: 'Japan',          group: 'Asia Pacific' },
  { id: 'au', label: 'Australia',      group: 'Asia Pacific' },
];

const withDisabled: ComboboxOption[] = [
  { id: 'basic',    label: 'Basic' },
  { id: 'standard', label: 'Standard', disabled: true },
  { id: 'premium',  label: 'Premium' },
];

// ── Meta ──────────────────────────────────────────────────────────────────

const meta: Meta<typeof Combobox> = {
  title: 'Molecules/Combobox',
  component: Combobox,
  parameters: {
    docs: {
      description: {
        component:
          'A searchable dropdown widget. The trigger is an `<input type="text">` ' +
          'with `role="combobox"`. Options are filtered as the user types and ' +
          'navigated via arrow keys using the ARIA active-descendant pattern.',
      },
    },
  },
  argTypes: {
    variant:    { control: 'select', options: ['default', 'filled', 'flushed'] },
    size:       { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled:   { control: 'boolean' },
    error:      { control: 'boolean' },
    isLoading:  { control: 'boolean' },
    clearable:  { control: 'boolean' },
    placeholder:{ control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof Combobox>;

// ── 1. Default ────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    options: frameworks,
    placeholder: 'Select a framework…',
    clearable: true,
  },
  render: (args) => (
    <div className="w-72">
      <Combobox {...args} />
    </div>
  ),
};

// ── 2. Variants ───────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] w-72">
      {(['default', 'filled', 'flushed'] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-[var(--spacing-component-sm)]">
          <span className="text-body-sm text-[var(--color-text-secondary)] capitalize">{variant}</span>
          <Combobox
            options={frameworks}
            variant={variant}
            placeholder={`${variant} variant…`}
          />
        </div>
      ))}
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] w-72">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-[var(--spacing-component-sm)]">
          <span className="text-body-sm text-[var(--color-text-secondary)] uppercase">{size}</span>
          <Combobox
            options={frameworks}
            size={size}
            placeholder={`Size ${size}…`}
          />
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] w-72">
      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">Default</span>
        <Combobox options={frameworks} placeholder="Select a framework…" />
      </div>

      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">With value selected</span>
        <Combobox options={frameworks} defaultValue="react" placeholder="Select a framework…" />
      </div>

      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">Loading</span>
        <Combobox options={[]} isLoading placeholder="Loading options…" />
      </div>

      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">Disabled</span>
        <Combobox options={frameworks} disabled placeholder="Disabled combobox" />
      </div>

      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">Error</span>
        <Combobox options={frameworks} error placeholder="Select a value (required)" />
      </div>

      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">With descriptions</span>
        <Combobox options={plansWithDesc} placeholder="Choose a plan…" />
      </div>

      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">Grouped options</span>
        <Combobox options={countries} placeholder="Select a country…" />
      </div>

      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">Not clearable</span>
        <Combobox
          options={frameworks}
          clearable={false}
          defaultValue="vue"
          placeholder="Required selection…"
        />
      </div>

      <div className="flex flex-col gap-[var(--spacing-component-sm)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">With disabled option</span>
        <Combobox options={withDisabled} placeholder="Select a tier…" />
      </div>
    </div>
  ),
};

// ── 5. DarkMode ───────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-8 rounded-lg max-w-2xl">
      <div className="flex flex-col gap-[var(--spacing-layout-sm)] w-72">
        <Combobox options={frameworks} placeholder="Select a framework…" />
        <Combobox options={frameworks} defaultValue="svelte" placeholder="With selection…" />
        <Combobox options={plansWithDesc} variant="filled" placeholder="Filled variant…" />
        <Combobox options={frameworks} error placeholder="Error state…" />
        <Combobox options={frameworks} disabled placeholder="Disabled…" />
      </div>
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    options: frameworks,
    placeholder: 'Select a framework…',
    variant: 'default',
    size: 'md',
    disabled: false,
    error: false,
    isLoading: false,
    clearable: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div className="w-80 flex flex-col gap-4">
        <Combobox {...args} value={value} onChange={setValue} />
        <p className="text-body-sm text-[var(--color-text-tertiary)]">
          Selected: <strong>{value ?? '(none)'}</strong>
        </p>
      </div>
    );
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div className="flex flex-col gap-[var(--spacing-layout-md)] w-80">
        {/* Labelled via <label> htmlFor */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <label
            htmlFor="a11y-combobox"
            className="text-body-sm text-[var(--color-text-primary)]"
          >
            Preferred framework
          </label>
          <Combobox
            id="a11y-combobox"
            options={frameworks}
            value={value}
            onChange={setValue}
            placeholder="Search or select…"
            required
            aria-describedby="a11y-combobox-hint"
          />
          <p
            id="a11y-combobox-hint"
            className="text-body-sm text-[var(--color-text-tertiary)]"
          >
            Start typing to filter options. Use arrow keys to navigate, Enter to select, Escape to dismiss.
          </p>
        </div>

        {/* Labelled via aria-label (no visible label) */}
        <Combobox
          options={countries}
          placeholder="Select a country…"
          aria-label="Country of residence"
        />

        {/* Disabled */}
        <Combobox
          options={frameworks}
          disabled
          placeholder="Disabled field"
          aria-label="Disabled combobox example"
        />

        {/* Error */}
        <Combobox
          options={frameworks}
          error
          placeholder="Select a framework (required)"
          aria-label="Framework selector with error"
        />
      </div>
    );
  },
};
