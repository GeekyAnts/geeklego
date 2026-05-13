import type { Meta, StoryObj } from '@storybook/react';
import { Search } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { Button } from '../../atoms/Button/Button';

const meta: Meta<typeof SearchBar> = {
  title: 'Molecules/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A search input with an integrated clear button and optional submit button. Implements the `role="search"` landmark for accessibility.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled'],
      description: 'Visual style of the input field.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Height and typography scale.',
    },
    label: { control: 'text' },
    labelHidden: { control: 'boolean' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    error: { control: 'boolean' },
    schema: { control: 'boolean' },
    searchUrl: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof SearchBar>;

// 1 ── Default
export const Default: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search…',
    size: 'md',
    variant: 'default',
  },
};

// 2 ── Variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-md">
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-2">Default (outlined)</p>
        <SearchBar label="Search" labelHidden placeholder="Outlined input…" variant="default" />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-2">Filled</p>
        <SearchBar label="Search" labelHidden placeholder="Filled input…" variant="filled" />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-2">Default + Search button</p>
        <SearchBar
          label="Search"
          labelHidden
          placeholder="With submit button…"
          variant="default"
          searchButton={<Button size="md">Search</Button>}
        />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-2">Filled + Icon button</p>
        <SearchBar
          label="Search"
          labelHidden
          placeholder="Filled with icon button…"
          variant="filled"
          searchButton={
            <Button size="md" iconOnly leftIcon={<Search size="var(--size-icon-md)" />}>
              Search
            </Button>
          }
        />
      </div>
    </div>
  ),
};

// 3 ── Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-md">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-2">{size.toUpperCase()}</p>
          <SearchBar label="Search" labelHidden placeholder={`Size ${size}…`} size={size} />
        </div>
      ))}
    </div>
  ),
};

// 4 ── States
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-md">
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-2">Default (empty)</p>
        <SearchBar label="Search" labelHidden placeholder="Start typing…" />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-2">With value (clear button visible)</p>
        <SearchBar label="Search" labelHidden defaultValue="design system" />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-2">Loading</p>
        <SearchBar label="Search" labelHidden defaultValue="loading state" isLoading />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-2">Error</p>
        <SearchBar label="Search" labelHidden defaultValue="invalid query" error />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-2">Disabled</p>
        <SearchBar label="Search" labelHidden placeholder="Disabled…" disabled />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-2">With visible label</p>
        <SearchBar label="Search documentation" placeholder="Find articles, guides…" />
      </div>
    </div>
  ),
};

// 5 ── DarkMode
export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-[var(--spacing-layout-xs)] p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <SearchBar label="Search" placeholder="Default dark…" />
      <SearchBar label="Search" labelHidden placeholder="Filled dark…" variant="filled" />
      <SearchBar label="Search" labelHidden defaultValue="with clear button" />
      <SearchBar
        label="Search"
        labelHidden
        placeholder="With submit…"
        searchButton={<Button size="md">Search</Button>}
      />
      <SearchBar label="Search" labelHidden placeholder="Disabled dark…" disabled />
    </div>
  ),
};

// 7 ── Playground
export const Playground: Story = {
  args: {
    label: 'Search',
    labelHidden: false,
    placeholder: 'Search…',
    variant: 'default',
    size: 'md',
    disabled: false,
    isLoading: false,
    error: false,
    schema: false,
  },
};

// 8 ── Accessibility
export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-md p-[var(--spacing-layout-xs)]">
      {/*
        Keyboard:
          Tab → focus the input
          Type → updates value; clear button appears
          Tab → focus clear button (when visible)
          Enter on clear → clears input, returns focus to input
          Enter in input → fires onSearch
          Tab → focus optional search button

        Screen reader:
          Enters "Search" landmark (role="search", aria-label="Search documentation")
          Input announced as: "Search documentation, search, edit text"
          Clear button announced as: "Clear search, button"
          Loading state: "busy" is announced on the input
          Error state: "invalid entry, Search" + describedby pointing to error message
      */}

      {/* Default with visible label — label provides accessible name */}
      <SearchBar
        label="Search documentation"
        placeholder="Find articles, guides, and more…"
      />

      {/* Hidden label — landmark still has aria-label */}
      <SearchBar
        label="Site search"
        labelHidden
        placeholder="Search the site…"
      />

      {/* Loading state — aria-busy on input */}
      <SearchBar
        label="Search"
        labelHidden
        defaultValue="react components"
        isLoading
      />

      {/* Disabled state — aria-disabled + disabled attribute */}
      <SearchBar
        label="Search"
        labelHidden
        placeholder="Search is unavailable"
        disabled
      />

      {/* Error state — aria-invalid + aria-describedby */}
      <SearchBar
        label="Search"
        labelHidden
        defaultValue="!@#$%"
        error
      />

      {/* With submit button — button is a separate Tab stop */}
      <SearchBar
        label="Search with button"
        labelHidden
        placeholder="Search…"
        searchButton={<Button size="md">Search</Button>}
      />
    </div>
  ),
};
