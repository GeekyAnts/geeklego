import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import type { ColorValue } from './ColorPicker.types';

const PRESET_COLORS = [
  { color: '#ef4444', label: 'Red — #ef4444' },
  { color: '#f97316', label: 'Orange — #f97316' },
  { color: '#eab308', label: 'Yellow — #eab308' },
  { color: '#22c55e', label: 'Green — #22c55e' },
  { color: '#3b82f6', label: 'Blue — #3b82f6' },
  { color: '#8b5cf6', label: 'Purple — #8b5cf6' },
  { color: '#ec4899', label: 'Pink — #ec4899' },
  { color: '#0ea5e9', label: 'Sky — #0ea5e9' },
  { color: '#14b8a6', label: 'Teal — #14b8a6' },
  { color: '#f43f5e', label: 'Rose — #f43f5e' },
  { color: '#000000', label: 'Black — #000000' },
  { color: '#ffffff', label: 'White — #ffffff' },
];

const meta: Meta<typeof ColorPicker> = {
  title: 'Organisms/ColorPicker',
  component: ColorPicker,
  parameters: {
    docs: {
      description: {
        component:
          'A full-featured color picker with 2D spectrum, hue/alpha sliders, hex/RGB/HSL inputs, format switcher, and preset swatches. Supports controlled and uncontrolled usage.',
      },
    },
  },
  argTypes: {
    variant:   { control: 'radio', options: ['default', 'compact', 'minimal'] },
    size:      { control: 'radio', options: ['sm', 'md', 'lg'] },
    showAlpha: { control: 'boolean' },
    disabled:  { control: 'boolean' },
    loading:   { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

// ── 1. Default ────────────────────────────────────────────────────────────────
export const Default: Story = {
  render: () => {
    const [color, setColor] = useState<ColorValue | null>(null);
    return (
      <div className="flex flex-col gap-4">
        <ColorPicker
          defaultValue="#6366f1"
          presets={PRESET_COLORS}
          onChange={setColor}
        />
        {color && (
          <p className="text-body-sm text-secondary">
            Selected: <code>{color.hex}</code> · rgb({color.r}, {color.g}, {color.b}) · hsl({color.h}, {color.s}%, {color.l}%)
          </p>
        )}
      </div>
    );
  },
};

// ── 2. Variants ───────────────────────────────────────────────────────────────
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-label-sm text-secondary">default</p>
        <ColorPicker defaultValue="#6366f1" presets={PRESET_COLORS} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-label-sm text-secondary">compact</p>
        <ColorPicker defaultValue="#22c55e" variant="compact" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-label-sm text-secondary">minimal</p>
        <ColorPicker defaultValue="#f97316" variant="minimal" />
      </div>
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <p className="text-label-sm text-secondary">{size}</p>
          <ColorPicker defaultValue="#3b82f6" size={size} presets={PRESET_COLORS} />
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────
export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-label-sm text-secondary">Default</p>
        <ColorPicker defaultValue="#6366f1" presets={PRESET_COLORS} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-label-sm text-secondary">With Alpha</p>
        <ColorPicker defaultValue="#6366f1" showAlpha />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-label-sm text-secondary">Disabled</p>
        <ColorPicker defaultValue="#6366f1" presets={PRESET_COLORS} disabled />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-label-sm text-secondary">Loading</p>
        <ColorPicker defaultValue="#6366f1" loading />
      </div>
    </div>
  ),
};

// ── 5. Dark Mode ──────────────────────────────────────────────────────────────
export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-8 rounded-xl max-w-2xl">
      <ColorPicker defaultValue="#6366f1" presets={PRESET_COLORS} />
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────
export const Playground: Story = {
  args: {
    defaultValue: '#6366f1',
    variant: 'default',
    size: 'md',
    showAlpha: false,
    disabled: false,
    loading: false,
    presets: PRESET_COLORS,
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────
export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-body-sm text-secondary">
        The picker root is a <code>role="group"</code> with an SR-only label. The spectrum
        is a 2D <code>role="slider"</code> supporting arrow-key navigation. Hue and alpha
        sliders use <code>role="slider"</code> with <code>aria-valuemin/max/now</code>.
        Format buttons use <code>aria-pressed</code>. Preset swatches use <code>aria-pressed</code>
        to indicate the selected color. The copy button announces the action via <code>aria-label</code>.
      </p>
      <ColorPicker
        defaultValue="#6366f1"
        presets={PRESET_COLORS}
        showAlpha
        i18nStrings={{
          colorLabel: 'Brand color picker',
          spectrumLabel: 'Color spectrum. Use arrow keys to adjust.',
          hueLabel: 'Hue angle',
          opacityLabel: 'Opacity percentage',
          presetsLabel: 'Brand palette swatches',
        }}
      />
    </div>
  ),
};
