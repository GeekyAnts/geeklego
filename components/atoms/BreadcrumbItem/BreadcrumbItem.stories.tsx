import type { Meta, StoryObj } from '@storybook/react';
import { Home } from 'lucide-react';
import { BreadcrumbItem } from './BreadcrumbItem';

const meta: Meta<typeof BreadcrumbItem> = {
  title: 'Atoms/BreadcrumbItem',
  component: BreadcrumbItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof BreadcrumbItem>;

export const Default: Story = {
  render: (args) => (
    <ol className="flex items-center">
      <BreadcrumbItem {...args} />
    </ol>
  ),
  args: {
    href: '#',
    children: 'Home',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[
        {
          label: 'Link',
          item: <BreadcrumbItem href="#">Products</BreadcrumbItem>,
        },
        {
          label: 'Current',
          item: <BreadcrumbItem current>Dashboard</BreadcrumbItem>,
        },
        {
          label: 'Disabled',
          item: <BreadcrumbItem href="#" disabled>Settings</BreadcrumbItem>,
        },
        {
          label: 'With icon',
          item: (
            <BreadcrumbItem
              href="#"
              leftIcon={<Home size="var(--size-icon-sm)" />}
            >
              Home
            </BreadcrumbItem>
          ),
        },
      ].map(({ label, item }) => (
        <div key={label} className="flex items-center gap-3">
          <span className="text-body-sm text-secondary w-20 shrink-0">{label}</span>
          <ol className="flex items-center">{item}</ol>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="text-body-sm text-secondary w-8 shrink-0">{size}</span>
          <ol className="flex items-center">
            <BreadcrumbItem href="#" size={size}>
              Products
            </BreadcrumbItem>
          </ol>
        </div>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[
        {
          label: 'Default',
          item: <BreadcrumbItem href="#">Home</BreadcrumbItem>,
        },
        {
          label: 'Current',
          item: <BreadcrumbItem current>Dashboard</BreadcrumbItem>,
        },
        {
          label: 'Disabled',
          item: <BreadcrumbItem href="#" disabled>Settings</BreadcrumbItem>,
        },
      ].map(({ label, item }) => (
        <div key={label} className="flex items-center gap-3">
          <span className="text-body-sm text-secondary w-20 shrink-0">{label}</span>
          <ol className="flex items-center">{item}</ol>
        </div>
      ))}
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-4 p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      {[
        { label: 'Link', item: <BreadcrumbItem href="#">Products</BreadcrumbItem> },
        { label: 'Current', item: <BreadcrumbItem current>Dashboard</BreadcrumbItem> },
        { label: 'Disabled', item: <BreadcrumbItem href="#" disabled>Settings</BreadcrumbItem> },
        {
          label: 'With icon',
          item: (
            <BreadcrumbItem href="#" leftIcon={<Home size="var(--size-icon-sm)" />}>
              Home
            </BreadcrumbItem>
          ),
        },
      ].map(({ label, item }) => (
        <div key={label} className="flex items-center gap-3">
          <span className="text-body-sm text-secondary w-20 shrink-0">{label}</span>
          <ol className="flex items-center">{item}</ol>
        </div>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  render: (args) => (
    <ol className="flex items-center">
      <BreadcrumbItem {...args} />
    </ol>
  ),
  args: {
    href: '#',
    current: false,
    disabled: false,
    size: 'md',
    children: 'Products',
  },
};

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)]">
      {/* Screen reader: "Home, link" | "Products, link" | "Laptops, current page" | "Archived, dimmed" */}

      <ol className="flex items-center">
        {/* Link item: focusable anchor */}
        <BreadcrumbItem href="/home" leftIcon={<Home size="var(--size-icon-sm)" />}>
          Home
        </BreadcrumbItem>

        {/* Link item: normal breadcrumb */}
        <BreadcrumbItem href="/products">Products</BreadcrumbItem>

        {/* Current page: aria-current="page", rendered as span */}
        <BreadcrumbItem current>Laptops</BreadcrumbItem>

        {/* Disabled: aria-disabled, no interaction */}
        <BreadcrumbItem disabled>Archived</BreadcrumbItem>
      </ol>
    </div>
  ),
};
