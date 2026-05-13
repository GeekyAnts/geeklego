import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Hash, Star, Zap, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Tag } from './Tag';
import type { TagVariant, TagColor, TagSize } from './Tag.types';

const meta: Meta<typeof Tag> = {
  title: 'Atoms/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'soft', 'outline'] satisfies TagVariant[],
    },
    color: {
      control: 'select',
      options: ['default', 'brand', 'success', 'warning', 'error', 'info'] satisfies TagColor[],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'] satisfies TagSize[],
    },
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: 'soft',
    color: 'default',
    size: 'md',
    children: 'Category',
  },
};

// ── 2. Variants ───────────────────────────────────────────────────────────────

const variants: TagVariant[] = ['solid', 'soft', 'outline'];
const colors: TagColor[] = ['default', 'brand', 'success', 'warning', 'error', 'info'];

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {variants.map((v) => (
        <div key={v} className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">{v}</span>
          <div className="flex items-center gap-3 flex-wrap">
            {colors.map((c) => (
              <Tag key={`${v}-${c}`} variant={v} color={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </Tag>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────

const sizes: TagSize[] = ['sm', 'md'];

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">{size}</span>
          <div className="flex items-center gap-3 flex-wrap">
            <Tag size={size} variant="solid" color="brand">Solid</Tag>
            <Tag size={size} variant="soft" color="brand">Soft</Tag>
            <Tag size={size} variant="outline" color="brand">Outline</Tag>
          </div>
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Static (default)</span>
        <div className="flex items-center gap-3 flex-wrap">
          <Tag color="brand">React</Tag>
          <Tag color="success">Published</Tag>
          <Tag color="warning">Draft</Tag>
          <Tag color="error">Deprecated</Tag>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Linked (hover to see effect)</span>
        <div className="flex items-center gap-3 flex-wrap">
          <Tag color="brand" href="#react">React</Tag>
          <Tag color="success" href="#typescript">TypeScript</Tag>
          <Tag color="info" href="#design">Design Systems</Tag>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Removable</span>
        <div className="flex items-center gap-3 flex-wrap">
          <Tag color="brand" onRemove={() => {}}>React</Tag>
          <Tag color="success" onRemove={() => {}}>TypeScript</Tag>
          <Tag color="info" onRemove={() => {}}>Tailwind</Tag>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">With icon</span>
        <div className="flex items-center gap-3 flex-wrap">
          <Tag color="default" leftIcon={<Hash size="var(--size-icon-xs)" />}>Topic</Tag>
          <Tag color="brand" leftIcon={<Star size="var(--size-icon-xs)" />}>Featured</Tag>
          <Tag color="warning" leftIcon={<AlertCircle size="var(--size-icon-xs)" />}>Caution</Tag>
        </div>
      </div>
    </div>
  ),
};

// ── 5. DarkMode ───────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-8 rounded-lg max-w-2xl">
      <div className="flex flex-col gap-6">
        {variants.map((v) => (
          <div key={v} className="flex flex-col gap-2">
            <span className="text-body-sm text-[var(--color-text-tertiary)]">{v}</span>
            <div className="flex items-center gap-3 flex-wrap">
              {colors.map((c) => (
                <Tag key={`${v}-${c}`} variant={v} color={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </Tag>
              ))}
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">Linked</span>
          <div className="flex items-center gap-3 flex-wrap">
            <Tag color="brand" href="#react">React</Tag>
            <Tag color="info" href="#design" leftIcon={<Info size="var(--size-icon-xs)" />}>Design</Tag>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">Removable</span>
          <div className="flex items-center gap-3 flex-wrap">
            <Tag color="brand" onRemove={() => {}}>React</Tag>
            <Tag color="error" onRemove={() => {}}>Bug</Tag>
          </div>
        </div>
      </div>
    </div>
  ),
};

// ── 6. EdgeCases ──────────────────────────────────────────────────────────────

export const EdgeCases: Story = {
  render: () => {
    const [tags, setTags] = useState(['React', 'Design', 'Figma']);
    return (
      <div className="flex flex-col gap-[var(--spacing-layout-md)]">
        {/* Very long text */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Long text (wrapped)</p>
          <div className="flex gap-2 flex-wrap">
            <Tag color="brand">This is a very long tag label that might wrap</Tag>
          </div>
        </div>

        {/* With icon */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">With icon</p>
          <div className="flex gap-2 flex-wrap">
            <Tag color="success" leftIcon={<Info size="var(--size-icon-xs)" />}>Success</Tag>
            <Tag color="warning" leftIcon={<Info size="var(--size-icon-xs)" />}>Warning</Tag>
          </div>
        </div>

        {/* Removable tags with state */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Removable (managed state)</p>
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag: string) => (
              <Tag
                key={tag}
                color="brand"
                onRemove={() => setTags(tags.filter((t: string) => t !== tag))}
              >
                {tag}
              </Tag>
            ))}
          </div>
        </div>

        {/* Linked tag */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">As link</p>
          <div className="flex gap-2 flex-wrap">
            <Tag color="brand" href="#getting-started">Getting Started</Tag>
            <Tag color="info" href="#components">Components</Tag>
          </div>
        </div>

        {/* All sizes */}
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <p className="text-body-sm font-semibold">Size variations</p>
          <div className="flex gap-2 flex-wrap items-center">
            <Tag size="sm" color="brand">Small</Tag>
            <Tag size="md" color="brand">Medium</Tag>
          </div>
        </div>
      </div>
    );
  },
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'soft',
    color: 'brand',
    size: 'md',
    children: 'Playground Tag',
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Static tags (span — no interaction)</span>
        <div className="flex items-center gap-3 flex-wrap">
          <Tag color="brand" aria-label="Category: React">React</Tag>
          <Tag color="success" aria-label="Status: Published">Published</Tag>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Linked tags (anchor — keyboard navigable)</span>
        <div className="flex items-center gap-3 flex-wrap">
          <Tag color="brand" href="#react" aria-label="Browse React articles">React</Tag>
          <Tag color="info" href="#design" aria-label="Browse Design articles">Design</Tag>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Removable tags (span + button — tab to remove)
        </span>
        <div role="list" className="flex items-center gap-3 flex-wrap">
          <span role="listitem">
            <Tag color="brand" onRemove={() => {}} aria-label="Tag: React">React</Tag>
          </span>
          <span role="listitem">
            <Tag color="success" onRemove={() => {}} aria-label="Tag: TypeScript">TypeScript</Tag>
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">With icons (icon hidden from AT)</span>
        <div className="flex items-center gap-3 flex-wrap">
          <Tag color="default" leftIcon={<Hash size="var(--size-icon-xs)" />} aria-label="Topic: React">React</Tag>
        </div>
      </div>
    </div>
  ),
};
