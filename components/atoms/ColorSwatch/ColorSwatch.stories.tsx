import type { Meta, StoryObj } from '@storybook/react';
import { ColorSwatch } from './ColorSwatch';

const meta: Meta<typeof ColorSwatch> = {
  title: 'Atoms/ColorSwatch',
  component: ColorSwatch,
  parameters: {
    docs: {
      description: {
        component:
          'A clickable color swatch button. Displays an arbitrary CSS color and supports selected/disabled states. Used as a building block in color pickers, palette grids, and theme selectors.',
      },
    },
  },
  argTypes: {
    color:    { control: 'color' },
    selected: { control: 'boolean' },
    size:     { control: 'radio', options: ['sm', 'md', 'lg'] },
    shape:    { control: 'radio', options: ['square', 'circle'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ColorSwatch>;

// ── 1. Default ────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    color: '#6366f1',
    'aria-label': 'Indigo — #6366f1',
    size: 'md',
    shape: 'square',
  },
};

// ── 2. Variants (shapes) ──────────────────────────────────────────────────────
export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <ColorSwatch color="#6366f1" shape="square" aria-label="Square swatch" size="md" />
        <span className="text-body-xs text-secondary">Square</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ColorSwatch color="#6366f1" shape="circle" aria-label="Circle swatch" size="md" />
        <span className="text-body-xs text-secondary">Circle</span>
      </div>
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <ColorSwatch color="#22c55e" size={size} aria-label={`${size} green swatch`} />
          <span className="text-body-xs text-secondary">{size}</span>
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────
export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <ColorSwatch color="#f97316" aria-label="Default state" size="md" />
        <span className="text-body-xs text-secondary">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ColorSwatch color="#f97316" aria-label="Selected state" selected size="md" />
        <span className="text-body-xs text-secondary">Selected</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ColorSwatch color="#f97316" aria-label="Disabled state" disabled size="md" />
        <span className="text-body-xs text-secondary">Disabled</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ColorSwatch color="#f97316" aria-label="Selected + disabled" selected disabled size="md" />
        <span className="text-body-xs text-secondary">Selected + Disabled</span>
      </div>
    </div>
  ),
};

// ── 5. Dark Mode ──────────────────────────────────────────────────────────────
export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-6 rounded-lg max-w-2xl">
      <div className="flex flex-wrap gap-3">
        {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'].map((c) => (
          <ColorSwatch key={c} color={c} aria-label={c} size="md" />
        ))}
        <ColorSwatch color="#6366f1" aria-label="Selected indigo" selected size="md" />
        <ColorSwatch color="#6366f1" aria-label="Disabled indigo" disabled size="md" />
      </div>
    </div>
  ),
};

// ── 6. ColorPalette ───────────────────────────────────────────────────────────
export const ColorPalette: Story = {
  render: () => {
    const brandColors = [
      { color: '#312e81', label: 'Brand 950' },
      { color: '#3730a3', label: 'Brand 800' },
      { color: '#4338ca', label: 'Brand 700' },
      { color: '#4f46e5', label: 'Brand 600' },
      { color: '#6366f1', label: 'Brand 500' },
      { color: '#818cf8', label: 'Brand 400' },
      { color: '#a5b4fc', label: 'Brand 300' },
      { color: '#c7d2fe', label: 'Brand 200' },
    ];
    const neutralColors = [
      { color: '#0f172a', label: 'Neutral 950' },
      { color: '#1e293b', label: 'Neutral 800' },
      { color: '#334155', label: 'Neutral 700' },
      { color: '#475569', label: 'Neutral 600' },
      { color: '#64748b', label: 'Neutral 500' },
      { color: '#94a3b8', label: 'Neutral 400' },
      { color: '#cbd5e1', label: 'Neutral 300' },
      { color: '#e2e8f0', label: 'Neutral 200' },
    ];
    return (
      <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
        <div className="flex flex-col gap-2">
          <span className="text-label-sm text-[var(--color-text-secondary)]">Brand scale</span>
          <div role="group" aria-label="Brand color palette" className="flex gap-2 flex-wrap">
            {brandColors.map(({ color, label }) => (
              <ColorSwatch key={color} color={color} aria-label={label} size="md" shape="square" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-label-sm text-[var(--color-text-secondary)]">Neutral scale</span>
          <div role="group" aria-label="Neutral color palette" className="flex gap-2 flex-wrap">
            {neutralColors.map(({ color, label }) => (
              <ColorSwatch key={color} color={color} aria-label={label} size="md" shape="square" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-label-sm text-[var(--color-text-secondary)]">Circle variant palette</span>
          <div role="group" aria-label="Status color palette" className="flex gap-2 flex-wrap">
            {['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'].map((c) => (
              <ColorSwatch key={c} color={c} aria-label={c} size="md" shape="circle" />
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
    color: '#6366f1',
    'aria-label': 'Indigo — #6366f1',
    selected: false,
    size: 'md',
    shape: 'square',
    disabled: false,
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────
export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-body-sm text-secondary">
        Each swatch is a <code>&lt;button&gt;</code> with an explicit <code>aria-label</code>.
        Selected swatches announce <code>aria-pressed="true"</code>. Disabled swatches have
        both <code>disabled</code> and <code>aria-disabled="true"</code>.
      </p>
      <div className="flex gap-3">
        <ColorSwatch
          color="#6366f1"
          aria-label="Indigo — #6366f1"
          size="md"
        />
        <ColorSwatch
          color="#22c55e"
          aria-label="Green — #22c55e, currently selected"
          selected
          size="md"
        />
        <ColorSwatch
          color="#ef4444"
          aria-label="Red — #ef4444, unavailable"
          disabled
          size="md"
        />
      </div>
    </div>
  ),
};
