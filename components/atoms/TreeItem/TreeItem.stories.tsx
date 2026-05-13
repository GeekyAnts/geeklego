import type { Meta, StoryObj } from '@storybook/react';
import { Folder, FolderOpen, File, HardDrive, FileText } from 'lucide-react';
import { TreeItem } from './TreeItem';

const meta: Meta<typeof TreeItem> = {
  title: 'Atoms/TreeItem',
  component: TreeItem,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    isExpanded: { control: 'boolean' },
    isSelected: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    hasChildren: { control: 'boolean' },
    badge: { control: 'text' },
    label: { control: 'text' },
    level: { control: { type: 'number', min: 1, max: 6 } },
  },
};

export default meta;
type Story = StoryObj<typeof TreeItem>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    id: 'item-1',
    label: 'Design Files - Client',
    icon: <Folder size="var(--size-icon-sm)" />,
    hasChildren: true,
    isExpanded: false,
    size: 'md',
  },
  render: (args) => (
    <ul role="tree" aria-label="File tree" className="list-none p-0 m-0 w-72">
      <TreeItem {...args} />
    </ul>
  ),
};

// ── Variants ─────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <ul role="tree" aria-label="Variant examples" className="list-none p-0 m-0 w-72 flex flex-col gap-[var(--tree-view-gap)]">
      <TreeItem
        id="default"
        label="Default (resting)"
        icon={<Folder size="var(--size-icon-sm)" />}
        hasChildren
      />
      <TreeItem
        id="expanded"
        label="Expanded"
        icon={<FolderOpen size="var(--size-icon-sm)" />}
        hasChildren
        isExpanded
      />
      <TreeItem
        id="selected"
        label="Selected"
        icon={<Folder size="var(--size-icon-sm)" />}
        isSelected
      />
      <TreeItem
        id="leaf"
        label="Leaf node (no children)"
        icon={<FileText size="var(--size-icon-sm)" />}
      />
      <TreeItem
        id="badge"
        label="With badge"
        icon={<HardDrive size="var(--size-icon-sm)" />}
        hasChildren
        badge={12}
      />
      <TreeItem
        id="no-icon"
        label="No icon"
        hasChildren
      />
    </ul>
  ),
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p className="text-label-xs text-[var(--color-text-tertiary)] mb-[var(--spacing-component-xs)] uppercase tracking-wider">
            {size}
          </p>
          <ul role="tree" aria-label={`${size} size tree`} className="list-none p-0 m-0 w-72">
            <TreeItem
              id={`folder-${size}`}
              label="Design Files - Client"
              icon={<Folder size={size === 'lg' ? 'var(--size-icon-md)' : 'var(--size-icon-sm)'} />}
              hasChildren
              size={size}
            />
          </ul>
        </div>
      ))}
    </div>
  ),
};

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <ul role="tree" aria-label="State examples" className="list-none p-0 m-0 w-80 flex flex-col gap-[var(--tree-view-gap)]">
      <TreeItem id="s-default" label="Default" icon={<Folder size="var(--size-icon-sm)" />} hasChildren />
      <TreeItem id="s-expanded" label="Expanded" icon={<FolderOpen size="var(--size-icon-sm)" />} hasChildren isExpanded />
      <TreeItem id="s-selected" label="Selected" icon={<Folder size="var(--size-icon-sm)" />} isSelected />
      <TreeItem id="s-sel-exp" label="Selected + expanded" icon={<FolderOpen size="var(--size-icon-sm)" />} hasChildren isExpanded isSelected />
      <TreeItem id="s-loading" label="Loading children…" icon={<Folder size="var(--size-icon-sm)" />} hasChildren isLoading />
      <TreeItem id="s-disabled" label="Disabled" icon={<Folder size="var(--size-icon-sm)" />} hasChildren isDisabled />
      <TreeItem id="s-dis-sel" label="Disabled + selected" icon={<Folder size="var(--size-icon-sm)" />} isSelected isDisabled />
    </ul>
  ),
};

// ── Dark mode ─────────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-[var(--spacing-component-xl)] rounded-[var(--radius-component-lg)] max-w-2xl">
      <ul role="tree" aria-label="Dark mode tree" className="list-none p-0 m-0 w-72 flex flex-col gap-[var(--tree-view-gap)]">
        <TreeItem id="d-folder" label="Design Files - Client" icon={<HardDrive size="var(--size-icon-sm)" />} hasChildren isExpanded>
          <TreeItem id="d-sub" label="ABB" icon={<Folder size="var(--size-icon-sm)" />} hasChildren level={2} setsize={3} posinset={1} />
          <TreeItem id="d-sub2" label="Aerobrief" icon={<Folder size="var(--size-icon-sm)" />} level={2} setsize={3} posinset={2} />
          <TreeItem id="d-sub3" label="AirOps" icon={<Folder size="var(--size-icon-sm)" />} level={2} setsize={3} posinset={3} isSelected />
        </TreeItem>
      </ul>
    </div>
  ),
};

// ── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    id: 'playground-item',
    label: 'Design Files - Client',
    icon: <Folder size="var(--size-icon-sm)" />,
    hasChildren: true,
    isExpanded: false,
    isSelected: false,
    isDisabled: false,
    isLoading: false,
    size: 'md',
    level: 1,
    setsize: 1,
    posinset: 1,
    badge: undefined,
  },
  render: (args) => (
    <ul role="tree" aria-label="Playground" className="list-none p-0 m-0 w-80">
      <TreeItem {...args} />
    </ul>
  ),
};

// ─── 8. I18n ─────────────────────────────────────────────────────────────────

/**
 * The expand/collapse aria-labels are i18n-enabled via the `i18nStrings` prop.
 * Template functions allow localization of the labels while preserving the item's label text.
 */
export const I18n: Story = {
  render: () => (
    <ul role="tree" aria-label="Localized tree" className="list-none p-0 m-0 w-72 flex flex-col gap-[var(--tree-view-gap)]">
      <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
        Custom expand/collapse labels via i18nStrings prop (simulating French localization):
      </p>
      <TreeItem
        id="i18n-folder"
        label="Design Files"
        icon={<Folder size="var(--size-icon-sm)" />}
        hasChildren
        isExpanded={false}
        i18nStrings={{
          expandLabel: (label) => `Développer ${label}`,
          collapseLabel: (label) => `Réduire ${label}`,
        }}
      />
    </ul>
  ),
};

// ─── 9. Accessibility ─────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <ul role="tree" aria-label="File browser" className="list-none p-0 m-0 w-80 flex flex-col gap-[var(--tree-view-gap)]">
      <TreeItem
        id="a11y-drive"
        label="Shared drives"
        icon={<HardDrive size="var(--size-icon-sm)" />}
        hasChildren
        isExpanded
        aria-label="Shared drives, expanded"
        level={1}
        setsize={1}
        posinset={1}
        tabIndex={0}
      >
        <TreeItem
          id="a11y-client"
          label="Design Files - Client"
          icon={<Folder size="var(--size-icon-sm)" />}
          hasChildren
          isExpanded={false}
          aria-label="Design Files - Client, collapsed, contains folders"
          level={2}
          setsize={1}
          posinset={1}
          tabIndex={-1}
        />
      </TreeItem>
      <TreeItem
        id="a11y-disabled"
        label="Archived (disabled)"
        icon={<File size="var(--size-icon-sm)" />}
        isDisabled
        aria-label="Archived, disabled"
        level={1}
        setsize={1}
        posinset={1}
        tabIndex={-1}
      />
    </ul>
  ),
};
