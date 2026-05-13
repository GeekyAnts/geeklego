"use client"
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  HardDrive,
  Folder,
  FolderOpen,
  File,
  FileText,
  Image,
  Video,
  Music,
  Settings,
  Users,
  LayoutDashboard,
} from 'lucide-react';
import { TreeView } from './TreeView';
import type { TreeNode } from './TreeView.types';

// ── Shared data ───────────────────────────────────────────────────────────────

const driveTree: TreeNode[] = [
  {
    id: 'shared-drives',
    label: 'Shared drives',
    icon: <HardDrive size="var(--size-icon-sm)" />,
    children: [
      {
        id: 'design-files',
        label: 'Design Files - Client',
        icon: <HardDrive size="var(--size-icon-sm)" />,
        children: [
          {
            id: 'abb',
            label: 'ABB',
            children: [
              {
                id: 'abb-icons',
                label: 'Icons',
                children: [
                  { id: 'abb-icons-source', label: 'Source file', children: [] },
                ],
              },
              { id: 'abb-source', label: 'Source File', children: [] },
            ],
          },
          { id: 'adobe', label: 'Adobe Old Account Users', children: [] },
          { id: 'aerobrief', label: 'Aerobrief', children: [] },
          { id: 'airops', label: 'AirOps', children: [] },
        ],
      },
    ],
  },
];

const fileSystemTree: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx', icon: <FileText size="var(--size-icon-sm)" /> },
          { id: 'input', label: 'Input.tsx', icon: <FileText size="var(--size-icon-sm)" /> },
          { id: 'modal', label: 'Modal.tsx', icon: <FileText size="var(--size-icon-sm)" /> },
        ],
      },
      {
        id: 'assets',
        label: 'assets',
        children: [
          { id: 'images', label: 'images', icon: <Image size="var(--size-icon-sm)" />, children: [] },
          { id: 'videos', label: 'videos', icon: <Video size="var(--size-icon-sm)" />, children: [] },
          { id: 'audio',  label: 'audio',  icon: <Music size="var(--size-icon-sm)" />, children: [] },
        ],
      },
      { id: 'index',  label: 'index.ts',   icon: <FileText size="var(--size-icon-sm)" /> },
      { id: 'app',    label: 'App.tsx',     icon: <FileText size="var(--size-icon-sm)" /> },
    ],
  },
  {
    id: 'public',
    label: 'public',
    children: [
      { id: 'favicon', label: 'favicon.ico', icon: <Image size="var(--size-icon-sm)" /> },
    ],
  },
  { id: 'pkg', label: 'package.json', icon: <File size="var(--size-icon-sm)" /> },
];

const navTree: TreeNode[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard size="var(--size-icon-sm)" />,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings size="var(--size-icon-sm)" />,
    children: [
      { id: 'profile',   label: 'Profile',   icon: <Users size="var(--size-icon-sm)" /> },
      { id: 'security',  label: 'Security',  icon: <Settings size="var(--size-icon-sm)" /> },
      { id: 'team',      label: 'Team',      icon: <Users size="var(--size-icon-sm)" /> },
    ],
  },
  {
    id: 'files',
    label: 'Files',
    icon: <Folder size="var(--size-icon-sm)" />,
    badge: 24,
    children: [
      { id: 'recent',    label: 'Recent',    badge: 5    },
      { id: 'starred',   label: 'Starred'                },
      { id: 'shared',    label: 'Shared',    badge: 3    },
      { id: 'trash',     label: 'Trash',     disabled: true },
    ],
  },
];

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof TreeView> = {
  title: 'Molecules/TreeView',
  component: TreeView,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    size:        { control: 'select', options: ['sm', 'md', 'lg'] },
    multiSelect: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof TreeView>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    items: driveTree,
    defaultExpanded: ['shared-drives', 'design-files', 'abb', 'abb-icons'],
    'aria-label': 'Shared drives',
  },
  render: (args) => (
    <div className="w-72">
      <TreeView {...args} />
    </div>
  ),
};

// ── Variants ──────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex gap-[var(--spacing-layout-md)]">
      <div>
        <p className="text-label-xs text-[var(--color-text-tertiary)] mb-[var(--spacing-component-sm)] uppercase tracking-wider">
          File explorer
        </p>
        <div className="w-64">
          <TreeView
            items={fileSystemTree}
            defaultExpanded={['src', 'components']}
            defaultSelected={['button']}
            aria-label="File explorer"
          />
        </div>
      </div>
      <div>
        <p className="text-label-xs text-[var(--color-text-tertiary)] mb-[var(--spacing-component-sm)] uppercase tracking-wider">
          Navigation
        </p>
        <div className="w-56">
          <TreeView
            items={navTree}
            defaultExpanded={['settings', 'files']}
            defaultSelected={['dashboard']}
            aria-label="App navigation"
          />
        </div>
      </div>
    </div>
  ),
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-[var(--spacing-layout-md)]">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p className="text-label-xs text-[var(--color-text-tertiary)] mb-[var(--spacing-component-sm)] uppercase tracking-wider">
            {size}
          </p>
          <div className="w-56">
            <TreeView
              items={navTree}
              defaultExpanded={['settings']}
              size={size}
              aria-label={`${size} size tree`}
            />
          </div>
        </div>
      ))}
    </div>
  ),
};

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => {
    const withLoading: TreeNode[] = [
      {
        id: 'root',
        label: 'Loading children',
        children: [],
        loading: true,
      },
      {
        id: 'disabled-parent',
        label: 'Disabled folder',
        disabled: true,
        children: [
          { id: 'child-1', label: 'Child A' },
        ],
      },
      {
        id: 'normal',
        label: 'Normal folder',
        children: [
          { id: 'normal-a', label: 'Item A' },
          { id: 'normal-b', label: 'Item B', disabled: true },
        ],
      },
    ];

    return (
      <div className="w-64">
        <TreeView
          items={withLoading}
          defaultExpanded={['root', 'normal']}
          defaultSelected={['normal-a']}
          aria-label="State examples"
        />
      </div>
    );
  },
};

// ── Dark mode ─────────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="bg-primary p-[var(--spacing-component-xl)] rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <p className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
        Shared drives
      </p>
      <div className="w-72">
        <TreeView
          items={driveTree}
          defaultExpanded={['shared-drives', 'design-files', 'abb', 'abb-icons']}
          defaultSelected={['abb-icons-source']}
          aria-label="Shared drives"
        />
      </div>
    </div>
  ),
};

// ── Playground ────────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    items: fileSystemTree,
    defaultExpanded: ['src'],
    multiSelect: false,
    size: 'md',
    'aria-label': 'Playground tree',
  },
  render: (args) => (
    <div className="w-72">
      <TreeView {...args} />
    </div>
  ),
};

// ── Accessibility ─────────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => {
    const [selected, setSelected] = useState<string | undefined>('dashboard');

    const items: TreeNode[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard size="var(--size-icon-sm)" />,
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <Settings size="var(--size-icon-sm)" />,
        children: [
          { id: 'profile',  label: 'Profile',  icon: <Users size="var(--size-icon-sm)" /> },
          { id: 'security', label: 'Security', icon: <Settings size="var(--size-icon-sm)" /> },
        ],
      },
      {
        id: 'archived',
        label: 'Archived (disabled)',
        icon: <Folder size="var(--size-icon-sm)" />,
        disabled: true,
      },
    ];

    return (
      <div className="w-64">
        <h2 id="tree-heading" className="text-heading-h5 text-[var(--color-text-primary)] mb-[var(--spacing-component-md)]">
          Navigation
        </h2>
        <TreeView
          items={items}
          selected={selected}
          onSelect={(id) => setSelected(id as string)}
          defaultExpanded={['settings']}
          aria-labelledby="tree-heading"
        />
        {selected && (
          <p
            role="status"
            aria-live="polite"
            className="mt-[var(--spacing-component-md)] text-body-sm text-[var(--color-text-secondary)]"
          >
            Selected: {selected}
          </p>
        )}
      </div>
    );
  },
};

// ── 8. I18n ───────────────────────────────────────────────────────────────────

export const I18n: Story = {
  render: () => {
    const frenchItems: TreeNode[] = [
      {
        id: 'documents',
        label: 'Documents',
        icon: <Folder size="var(--size-icon-sm)" />,
        children: [
          { id: 'rapports', label: 'Rapports', icon: <FileText size="var(--size-icon-sm)" />, children: [] },
          { id: 'presentations', label: 'Présentations', icon: <File size="var(--size-icon-sm)" />, children: [] },
        ],
      },
      {
        id: 'images',
        label: 'Images',
        icon: <Image size="var(--size-icon-sm)" />,
        children: [
          { id: 'photos', label: 'Photos', icon: <Image size="var(--size-icon-sm)" />, children: [] },
          { id: 'captures', label: "Captures d'écran", icon: <Image size="var(--size-icon-sm)" />, children: [] },
        ],
      },
    ];

    return (
      <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
        <p className="text-label-sm text-[var(--color-text-tertiary)]">
          Custom i18n: French expand/collapse labels (inspect with screen reader or browser a11y tree)
        </p>
        <div className="w-64">
          <TreeView
            items={frenchItems}
            defaultExpanded={['documents']}
            aria-label="Arborescence de fichiers"
            i18nStrings={{
              expandLabel: (label) => `Développer ${label}`,
              collapseLabel: (label) => `Réduire ${label}`,
            }}
          />
        </div>
      </div>
    );
  },
};
