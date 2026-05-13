import type { Meta, StoryObj } from '@storybook/react';
import { Search, Globe, Lock, Mail, Phone, DollarSign, AtSign } from 'lucide-react';
import { InputGroup } from './InputGroup';
import { Button } from '../../atoms/Button/Button';

const meta = {
  title: 'Molecules/InputGroup',
  component: InputGroup,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'InputGroup wraps an Input with start and/or end addon elements (icons, text labels, or interactive elements) sharing a unified border and visual boundary.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'flushed', 'unstyled'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    error: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    placeholder: 'Search…',
    prefix: <Search size="var(--size-icon-sm)" aria-hidden="true" />,
    'aria-label': 'Search',
  },
};

// ── 2. Variants ───────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] max-w-sm">
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">default</span>
        <InputGroup
          variant="default"
          placeholder="Default variant"
          prefix={<Globe size="var(--size-icon-sm)" aria-hidden="true" />}
          aria-label="URL input default"
        />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">filled</span>
        <InputGroup
          variant="filled"
          placeholder="Filled variant"
          prefix={<Mail size="var(--size-icon-sm)" aria-hidden="true" />}
          aria-label="Email input filled"
        />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">flushed</span>
        <InputGroup
          variant="flushed"
          placeholder="Flushed variant"
          prefix={<AtSign size="var(--size-icon-sm)" aria-hidden="true" />}
          aria-label="Username input flushed"
        />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">with button suffix</span>
        <InputGroup
          variant="default"
          placeholder="Search the docs…"
          prefix={<Search size="var(--size-icon-sm)" aria-hidden="true" />}
          suffix={
            <Button variant="primary" size="sm">
              Search
            </Button>
          }
          aria-label="Docs search with button"
        />
      </div>
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] max-w-sm">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-[var(--spacing-component-xs)]">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">{size}</span>
          <InputGroup
            size={size}
            placeholder={`Size ${size}`}
            prefix={<Search size="var(--size-icon-sm)" aria-hidden="true" />}
            suffix={<span aria-hidden="true">⌘K</span>}
            aria-label={`Search size ${size}`}
          />
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] max-w-sm">
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">default</span>
        <InputGroup
          placeholder="Default state"
          prefix={<Lock size="var(--size-icon-sm)" aria-hidden="true" />}
          aria-label="Password default"
        />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">error</span>
        <InputGroup
          error
          placeholder="Error state"
          prefix={<Lock size="var(--size-icon-sm)" aria-hidden="true" />}
          aria-label="Password error"
        />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">disabled</span>
        <InputGroup
          disabled
          placeholder="Disabled state"
          prefix={<Lock size="var(--size-icon-sm)" aria-hidden="true" />}
          aria-label="Password disabled"
        />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">loading</span>
        <InputGroup
          isLoading
          placeholder="Loading state"
          prefix={<Search size="var(--size-icon-sm)" aria-hidden="true" />}
          aria-label="Search loading"
        />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">text prefix + suffix</span>
        <InputGroup
          placeholder="0.00"
          prefix={<span aria-hidden="true" className="text-[var(--input-group-addon-text)]">$</span>}
          suffix={<span aria-hidden="true" className="text-[var(--input-group-addon-text)]">USD</span>}
          type="number"
          aria-label="Amount in USD"
        />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">button suffix</span>
        <InputGroup
          placeholder="Enter your email"
          prefix={<Mail size="var(--size-icon-sm)" aria-hidden="true" />}
          suffix={
            <Button variant="primary" size="sm">
              Subscribe
            </Button>
          }
          type="email"
          aria-label="Email subscription"
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
      className="flex flex-col gap-[var(--spacing-component-lg)] p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <InputGroup
        placeholder="Search…"
        prefix={<Search size="var(--size-icon-sm)" aria-hidden="true" />}
        aria-label="Search dark"
      />
      <InputGroup
        variant="filled"
        placeholder="Email address"
        prefix={<Mail size="var(--size-icon-sm)" aria-hidden="true" />}
        aria-label="Email dark"
      />
      <InputGroup
        placeholder="Amount"
        prefix={<span aria-hidden="true" className="text-[var(--input-group-addon-text)]"><DollarSign size="var(--size-icon-sm)" /></span>}
        suffix={<span aria-hidden="true" className="text-[var(--input-group-addon-text)]">USD</span>}
        type="number"
        aria-label="Amount dark"
      />
      <InputGroup
        error
        placeholder="Invalid input"
        prefix={<Lock size="var(--size-icon-sm)" aria-hidden="true" />}
        aria-label="Error dark"
      />
      <InputGroup
        placeholder="Search the docs…"
        prefix={<Search size="var(--size-icon-sm)" aria-hidden="true" />}
        suffix={
          <Button variant="primary" size="sm">
            Search
          </Button>
        }
        aria-label="Docs search dark"
      />
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    placeholder: 'Placeholder text…',
    error: false,
    isLoading: false,
    disabled: false,
    prefix: undefined,
    suffix: undefined,
    'aria-label': 'Playground input group',
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)] max-w-sm">
      {/*
        Keyboard: Tab enters the inner input · input has focus-ring-inset on focus-visible
        Screen reader: group label announced, then input placeholder/label
        Decorative addons (icons, text) have aria-hidden="true" on their content
        Interactive suffixes (Button) remain fully keyboard-accessible
      */}

      {/* Fully labelled: group aria-label + visible input placeholder */}
      <InputGroup
        aria-label="Search documentation"
        i18nStrings={{ placeholder: 'Search…' }}
        prefix={<Search size="var(--size-icon-sm)" aria-hidden="true" />}
      />

      {/* Phone with country-code prefix — prefix text has semantic value (no aria-hidden) */}
      <InputGroup
        aria-label="Phone number"
        type="tel"
        placeholder="(555) 000-0000"
        prefix={<span className="text-[var(--input-group-addon-text)] text-body-sm content-nowrap">+1</span>}
      />

      {/* Error: aria-invalid communicated via inner Input */}
      <InputGroup
        aria-label="Email address"
        type="email"
        placeholder="you@example.com"
        prefix={<Mail size="var(--size-icon-sm)" aria-hidden="true" />}
        error
        aria-describedby="ig-email-error"
      />
      <span id="ig-email-error" className="text-body-sm text-[var(--color-text-error)]">
        Enter a valid email address.
      </span>

      {/* Disabled: both disabled + aria-disabled on inner Input */}
      <InputGroup
        aria-label="Locked field"
        placeholder="Not editable"
        prefix={<Lock size="var(--size-icon-sm)" aria-hidden="true" />}
        disabled
      />

      {/* Interactive suffix: Button retains its own accessible name */}
      <InputGroup
        aria-label="Newsletter signup"
        type="email"
        placeholder="your@email.com"
        prefix={<Mail size="var(--size-icon-sm)" aria-hidden="true" />}
        suffix={
          <Button variant="primary" size="sm">
            Subscribe
          </Button>
        }
      />
    </div>
  ),
};
