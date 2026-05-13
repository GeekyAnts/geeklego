import type { Meta, StoryObj } from '@storybook/react';
import { Home, Settings } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';
import type { BreadcrumbItemData } from './Breadcrumb.types';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Molecules/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

const defaultItems: BreadcrumbItemData[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Dashboard' },
];

export const Default: Story = {
  args: {
    items: defaultItems,
    size: 'md',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-label-sm text-secondary">Default (ChevronRight separator)</p>
        <Breadcrumb items={defaultItems} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-label-sm text-secondary">Custom separator (slash)</p>
        <Breadcrumb
          items={defaultItems}
          separator={
            <span className="text-[var(--breadcrumb-separator-color)] text-label-md px-[var(--breadcrumb-item-px)]">
              /
            </span>
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-label-sm text-secondary">With icons</p>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/', icon: <Home size="var(--size-icon-sm)" /> },
            { label: 'Settings', href: '/settings', icon: <Settings size="var(--size-icon-sm)" /> },
            { label: 'Profile' },
          ]}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-label-sm text-secondary">Single item (root page)</p>
        <Breadcrumb items={[{ label: 'Home' }]} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-label-sm text-secondary">Two items</p>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Dashboard' },
          ]}
        />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="text-body-sm text-secondary w-8 shrink-0">{size}</span>
          <Breadcrumb items={defaultItems} size={size} />
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-label-sm text-secondary">Default trail</p>
        <Breadcrumb items={defaultItems} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-label-sm text-secondary">With disabled item</p>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products', disabled: true },
            { label: 'Dashboard' },
          ]}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-label-sm text-secondary">Long trail (5 items)</p>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Workspace', href: '/workspace' },
            { label: 'Projects', href: '/workspace/projects' },
            { label: 'Alpha', href: '/workspace/projects/alpha' },
            { label: 'Settings' },
          ]}
        />
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-6 p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <Breadcrumb items={defaultItems} />
      <Breadcrumb
        items={[
          { label: 'Home', href: '/', icon: <Home size="var(--size-icon-sm)" /> },
          { label: 'Settings', href: '/settings' },
          { label: 'Profile' },
        ]}
      />
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products', disabled: true },
          { label: 'Dashboard' },
        ]}
      />
    </div>
  ),
};

export const Playground: Story = {
  args: {
    items: defaultItems,
    size: 'md',
  },
};

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)]">
      {/* Screen reader: "Breadcrumb, navigation" landmark with aria-label */}
      {/* Each item: "Home, link" | "Products, link" | "Laptops, current page" */}

      {/* Default: nav landmark with aria-label="Breadcrumb" */}
      <Breadcrumb items={defaultItems} />

      {/* With Schema.org: itemScope + itemType for SEO */}
      <Breadcrumb items={defaultItems} schema />
    </div>
  ),
};
