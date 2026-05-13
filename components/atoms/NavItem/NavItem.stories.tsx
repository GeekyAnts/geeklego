"use client"
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LayoutGrid, Box, BookOpen, Settings, Star, Clock } from 'lucide-react';
import { NavItem } from './NavItem';

const meta: Meta<typeof NavItem> = {
  title: 'Atoms/NavItem',
  component: NavItem,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    isActive: { control: 'boolean' },
    isExpandable: { control: 'boolean' },
    isExpanded: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <ul role="tree" className="w-full max-w-[var(--sidebar-width)]">
        <Story />
      </ul>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof NavItem>;

/* ── Default ─────────────────────────────────────────────────────────────── */
export const Default: Story = {
  args: {
    label: 'Dashboard',
    icon: <LayoutGrid size="var(--size-icon-sm)" />,
  },
};

/* ── Variants ────────────────────────────────────────────────────────────── */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-1 w-full max-w-[var(--sidebar-width)]">
      <ul role="tree" className="flex flex-col gap-1">
        <NavItem label="With icon" icon={<LayoutGrid size="var(--size-icon-sm)" />} />
        <NavItem label="Without icon" />
        <NavItem label="Active item" icon={<Star size="var(--size-icon-sm)" />} isActive />
        <NavItem label="As link" icon={<BookOpen size="var(--size-icon-sm)" />} href="/docs" />
        <NavItem label="Expandable" icon={<Box size="var(--size-icon-sm)" />} isExpandable isExpanded={false} />
        <NavItem label="Disabled" icon={<Settings size="var(--size-icon-sm)" />} disabled />
      </ul>
    </div>
  ),
};

/* ── Sizes (with/without icons, with/without children) ───────────────── */
export const Sizes: Story = {
  name: 'Sizes',
  render: () => {
    const ExpandableDemo = () => {
      const [expanded, setExpanded] = useState(true);
      return (
        <NavItem
          label="Components"
          icon={<Box size="var(--size-icon-sm)" />}
          isExpandable
          isExpanded={expanded}
          onToggle={() => setExpanded(!expanded)}
        >
          <NavItem label="Button" />
          <NavItem label="Input" />
          <NavItem label="NavItem" isActive />
        </NavItem>
      );
    };
    return (
      <div className="flex flex-col gap-6 w-full max-w-[var(--sidebar-width)]">
        <div>
          <p className="text-label-sm text-secondary mb-2">With icons</p>
          <ul role="tree" className="flex flex-col gap-1">
            <NavItem label="Dashboard" icon={<LayoutGrid size="var(--size-icon-sm)" />} />
            <NavItem label="Components" icon={<Box size="var(--size-icon-sm)" />} />
            <NavItem label="Documentation" icon={<BookOpen size="var(--size-icon-sm)" />} />
          </ul>
        </div>
        <div>
          <p className="text-label-sm text-secondary mb-2">Without icons</p>
          <ul role="tree" className="flex flex-col gap-1">
            <NavItem label="Overview" />
            <NavItem label="Getting started" />
            <NavItem label="Tokens" />
          </ul>
        </div>
        <div>
          <p className="text-label-sm text-secondary mb-2">With children (expandable)</p>
          <ul role="tree" className="flex flex-col gap-1">
            <ExpandableDemo />
          </ul>
        </div>
      </div>
    );
  },
};

/* ── States ───────────────────────────────────────────────────────────── */
export const States: Story = {
  render: () => {
    const ExpandedDemo = () => {
      const [expanded, setExpanded] = useState(true);
      return (
        <NavItem
          label="Expanded"
          icon={<Box size="var(--size-icon-sm)" />}
          isExpandable
          isExpanded={expanded}
          onToggle={() => setExpanded(!expanded)}
        >
          <NavItem label="Sub-item one" />
          <NavItem label="Sub-item two" isActive />
        </NavItem>
      );
    };
    return (
      <div className="flex flex-col gap-4 w-full max-w-[var(--sidebar-width)]">
        <div>
          <p className="text-label-sm text-secondary mb-2">Default</p>
          <ul role="tree">
            <NavItem label="Default" icon={<LayoutGrid size="var(--size-icon-sm)" />} />
          </ul>
        </div>
        <div>
          <p className="text-label-sm text-secondary mb-2">Hover (interact to see)</p>
          <ul role="tree">
            <NavItem label="Hover me" icon={<Star size="var(--size-icon-sm)" />} />
          </ul>
        </div>
        <div>
          <p className="text-label-sm text-secondary mb-2">Active</p>
          <ul role="tree">
            <NavItem label="Active" icon={<LayoutGrid size="var(--size-icon-sm)" />} isActive />
          </ul>
        </div>
        <div>
          <p className="text-label-sm text-secondary mb-2">Disabled</p>
          <ul role="tree">
            <NavItem label="Disabled" icon={<Settings size="var(--size-icon-sm)" />} disabled />
          </ul>
        </div>
        <div>
          <p className="text-label-sm text-secondary mb-2">Expanded</p>
          <ul role="tree">
            <ExpandedDemo />
          </ul>
        </div>
      </div>
    );
  },
};

/* ── DarkMode ─────────────────────────────────────────────────────────── */
export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <div data-theme="dark" className="p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <NavItem label="Dashboard" icon={<LayoutGrid size="var(--size-icon-sm)" />} isActive />
      <NavItem label="Components" icon={<Box size="var(--size-icon-sm)" />} />
      <NavItem label="Documentation" icon={<BookOpen size="var(--size-icon-sm)" />} />
      <NavItem label="Settings" icon={<Settings size="var(--size-icon-sm)" />} disabled />
    </>
  ),
};

/* ── 6. CollapsedHierarchy ───────────────────────────────────────────── */
export const CollapsedHierarchy: Story = {
  render: () => {
    const DeepNestDemo = () => {
      const [expanded, setExpanded] = useState({ level1: true, level2: true });
      return (
        <ul role="tree" className="w-full max-w-sm flex flex-col gap-1">
          <NavItem
            label="Platform"
            icon={<Box size="var(--size-icon-sm)" />}
            isExpandable
            isExpanded={expanded.level1}
            onToggle={() => setExpanded(prev => ({ ...prev, level1: !prev.level1 }))}
          >
            <NavItem
              label="Components"
              icon={<LayoutGrid size="var(--size-icon-sm)" />}
              isExpandable
              isExpanded={expanded.level2}
              onToggle={() => setExpanded(prev => ({ ...prev, level2: !prev.level2 }))}
            >
              <NavItem label="Button" href="/components/button" />
              <NavItem label="Input" href="/components/input" isActive />
              <NavItem label="Select" href="/components/select" />
            </NavItem>
            <NavItem label="Documentation" icon={<BookOpen size="var(--size-icon-sm)" />} />
            <NavItem label="Settings" icon={<Settings size="var(--size-icon-sm)" />} />
          </NavItem>
        </ul>
      );
    };
    return <DeepNestDemo />;
  },
};

/* ── 7. Playground ───────────────────────────────────────────────────────── */
export const Playground: Story = {
  args: {
    label: 'Navigation item',
    icon: <LayoutGrid size="var(--size-icon-sm)" />,
    isActive: false,
    isExpandable: false,
    isExpanded: false,
    disabled: false,
  },
};

/* ── 8. Accessibility ─────────────────────────────────────────────────────── */
export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)]">
      {/* Keyboard: Tab to focus · Enter to activate/navigate · Arrow keys with roving tabindex */}
      {/* Screen reader: "Dashboard, current page, link" | "Settings, dimmed, button" | "Projects, expanded, button" */}

      <ul className="list-none flex flex-col gap-[var(--spacing-component-xs)] w-[240px]">
        {/* Active link: aria-current="page" */}
        <NavItem
          label="Dashboard"
          icon={<LayoutGrid size="var(--size-icon-sm)" />}
          href="/dashboard"
          isActive
        />

        {/* Expandable: aria-expanded + aria-controls on button */}
        <NavItem
          label="Projects"
          icon={<Box size="var(--size-icon-sm)" />}
          isExpandable
          isExpanded
        >
          <NavItem label="Active" href="/projects/active" />
          <NavItem label="Archived" href="/projects/archived" />
        </NavItem>

        {/* Disabled: aria-disabled on the trigger */}
        <NavItem
          label="Settings"
          icon={<Settings size="var(--size-icon-sm)" />}
          disabled
        />
      </ul>
    </div>
  ),
};
