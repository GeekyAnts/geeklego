import type { Meta, StoryObj } from '@storybook/react';
import { Tag, Star, Zap, Filter } from 'lucide-react';
import { Chip } from './Chip';
import type { ChipVariant, ChipSize } from './Chip.types';

const meta: Meta<typeof Chip> = {
  title: 'Atoms/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'soft', 'outline', 'ghost'] satisfies ChipVariant[],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'] satisfies ChipSize[],
    },
    interactive: { control: 'boolean' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: 'solid',
    size: 'md',
    interactive: true,
    children: 'Design System',
  },
};

// ── 2. Variants ───────────────────────────────────────────────────────────────

const variants: ChipVariant[] = ['solid', 'soft', 'outline', 'ghost'];

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Unselected</span>
        <div className="flex items-center gap-3 flex-wrap">
          {variants.map((v) => (
            <Chip key={v} variant={v}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Chip>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Selected (aria-pressed)</span>
        <div className="flex items-center gap-3 flex-wrap">
          {variants.map((v) => (
            <Chip key={v} variant={v} selected>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Chip>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Static display (interactive=false)</span>
        <div className="flex items-center gap-3 flex-wrap">
          {variants.map((v) => (
            <Chip key={v} variant={v} interactive={false}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────

const sizes: ChipSize[] = ['sm', 'md', 'lg'];

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">{size}</span>
          <div className="flex items-center gap-3 flex-wrap">
            <Chip size={size} variant="solid">Solid</Chip>
            <Chip size={size} variant="soft">Soft</Chip>
            <Chip size={size} variant="outline">Outline</Chip>
            <Chip size={size} variant="ghost">Ghost</Chip>
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
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Default (interactive toggle)</span>
        <div className="flex items-center gap-3 flex-wrap">
          <Chip>Unselected</Chip>
          <Chip selected>Selected</Chip>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Disabled</span>
        <div className="flex items-center gap-3 flex-wrap">
          <Chip disabled>Disabled</Chip>
          <Chip disabled selected>Disabled selected</Chip>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">With leading icon</span>
        <div className="flex items-center gap-3 flex-wrap">
          <Chip leftIcon={<Tag size="var(--size-icon-sm)" />}>Category</Chip>
          <Chip variant="soft" selected leftIcon={<Star size="var(--size-icon-sm)" />}>Starred</Chip>
          <Chip variant="outline" leftIcon={<Filter size="var(--size-icon-sm)" />}>Filtered</Chip>
          <Chip variant="ghost" leftIcon={<Zap size="var(--size-icon-sm)" />}>Action</Chip>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Removable tags (interactive=false)</span>
        <div className="flex items-center gap-3 flex-wrap">
          <Chip interactive={false} onRemove={() => {}}>React</Chip>
          <Chip variant="soft" interactive={false} onRemove={() => {}}>TypeScript</Chip>
          <Chip variant="outline" interactive={false} onRemove={() => {}}>Tailwind CSS</Chip>
          <Chip variant="ghost" interactive={false} onRemove={() => {}}>Storybook</Chip>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Removable with icon</span>
        <div className="flex items-center gap-3 flex-wrap">
          <Chip
            interactive={false}
            leftIcon={<Tag size="var(--size-icon-sm)" />}
            onRemove={() => {}}
          >
            Design
          </Chip>
          <Chip
            variant="soft"
            interactive={false}
            leftIcon={<Star size="var(--size-icon-sm)" />}
            onRemove={() => {}}
          >
            Featured
          </Chip>
        </div>
      </div>
    </div>
  ),
};

// ── 5. Dark Mode ──────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-8 rounded-lg max-w-2xl">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">Unselected</span>
          <div className="flex items-center gap-3 flex-wrap">
            {variants.map((v) => (
              <Chip key={v} variant={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</Chip>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">Selected</span>
          <div className="flex items-center gap-3 flex-wrap">
            {variants.map((v) => (
              <Chip key={v} variant={v} selected>{v.charAt(0).toUpperCase() + v.slice(1)}</Chip>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">Removable tags</span>
          <div className="flex items-center gap-3 flex-wrap">
            <Chip interactive={false} onRemove={() => {}}>React</Chip>
            <Chip variant="soft" interactive={false} onRemove={() => {}}>TypeScript</Chip>
            <Chip variant="outline" interactive={false} onRemove={() => {}}>Tailwind</Chip>
          </div>
        </div>
      </div>
    </div>
  ),
};

// ── 6. InteractionGroup ───────────────────────────────────────────────────────

export const InteractionGroup: Story = {
  render: () => {
    const FILTERS = ['All', 'Design', 'Engineering', 'Product', 'Research'] as const;
    return (
      <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
        <div className="flex flex-col gap-2">
          <span className="text-label-sm text-[var(--color-text-secondary)]">Filter bar — single select</span>
          <div role="group" aria-label="Filter by department" className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f, i) => (
              <Chip key={f} variant={i === 0 ? 'solid' : 'outline'} selected={i === 0} aria-label={`${f}${i === 0 ? ' — active' : ''}`}>
                {f}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-label-sm text-[var(--color-text-secondary)]">Multi-select filter</span>
          <div role="group" aria-label="Filter by tag" className="flex items-center gap-2 flex-wrap">
            <Chip variant="soft" selected leftIcon={<Star size="var(--size-icon-sm)" />}>Featured</Chip>
            <Chip variant="soft" leftIcon={<Zap size="var(--size-icon-sm)" />}>Popular</Chip>
            <Chip variant="soft" selected leftIcon={<Filter size="var(--size-icon-sm)" />}>Filtered</Chip>
            <Chip variant="soft" leftIcon={<Tag size="var(--size-icon-sm)" />}>Tagged</Chip>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-label-sm text-[var(--color-text-secondary)]">Dismissible tag list</span>
          <div role="list" aria-label="Active filters" className="flex items-center gap-2 flex-wrap">
            {['React', 'TypeScript', 'Tailwind'].map((tag) => (
              <div key={tag} role="listitem">
                <Chip interactive={false} variant="soft" onRemove={() => {}} i18nStrings={{ removeLabel: `Remove ${tag}` }}>
                  {tag}
                </Chip>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'solid',
    size: 'md',
    interactive: true,
    selected: false,
    disabled: false,
    children: 'Chip label',
  },
};

// ── 8. Accessibility ─────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Filter chips — aria-pressed announces toggle state to screen readers
        </span>
        <div
          role="group"
          aria-label="Filter by category"
          className="flex items-center gap-3 flex-wrap"
        >
          <Chip selected aria-label="React — filter active">React</Chip>
          <Chip aria-label="TypeScript — filter inactive">TypeScript</Chip>
          <Chip aria-label="CSS — filter inactive">CSS</Chip>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Removable tags — remove button has accessible label via i18nStrings
        </span>
        <div
          role="list"
          aria-label="Selected tags"
          className="flex items-center gap-3 flex-wrap"
        >
          {['React', 'TypeScript', 'Tailwind CSS'].map((tag) => (
            <div key={tag} role="listitem">
              <Chip
                interactive={false}
                onRemove={() => {}}
                i18nStrings={{ removeLabel: `Remove ${tag}` }}
              >
                {tag}
              </Chip>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Disabled — aria-disabled and cursor-not-allowed, no hover response
        </span>
        <div className="flex items-center gap-3">
          <Chip disabled aria-label="Disabled chip, unavailable">Unavailable</Chip>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          With icon — icon is aria-hidden, label carries full meaning
        </span>
        <div className="flex items-center gap-3">
          <Chip leftIcon={<Tag size="var(--size-icon-sm)" />} aria-label="Design category filter">
            Design
          </Chip>
        </div>
      </div>
    </div>
  ),
};
