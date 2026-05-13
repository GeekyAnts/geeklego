import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack';

const meta: Meta<typeof Stack> = {
  title: 'Atoms/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['column', 'row'] },
    gap: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between', 'around', 'evenly'] },
    wrap: { control: 'boolean' },
    inline: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Stack>;

// ─── Reusable demo blocks ────────────────────────────────────────────────────

const Box = ({ label, wide }: { label: string; wide?: boolean }) => (
  <div
    className={[
      'flex items-center justify-center rounded-[var(--radius-component-md)]',
      'bg-[var(--color-surface-raised)] border border-[var(--color-border-default)]',
      'text-body-sm text-[var(--color-text-secondary)]',
      wide ? 'px-[var(--spacing-component-xl)] py-[var(--spacing-component-md)]' : 'px-[var(--spacing-component-lg)] py-[var(--spacing-component-sm)]',
    ].join(' ')}
  >
    {label}
  </div>
);

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    direction: 'column',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
  },
  render: (args) => (
    <Stack {...args} style={{ width: 240 }}>
      <Box label="Item 1" />
      <Box label="Item 2" />
      <Box label="Item 3" />
    </Stack>
  ),
};

export const Variants: Story = {
  name: 'Direction',
  render: () => (
    <Stack direction="row" gap="xl" align="start">
      <Stack gap="sm" style={{ width: 180 }}>
        <span className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-xs)]">Column (default)</span>
        <Stack direction="column" gap="sm">
          <Box label="Item 1" />
          <Box label="Item 2" />
          <Box label="Item 3" />
        </Stack>
      </Stack>
      <Stack gap="sm">
        <span className="text-label-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-xs)]">Row</span>
        <Stack direction="row" gap="sm">
          <Box label="Item 1" />
          <Box label="Item 2" />
          <Box label="Item 3" />
        </Stack>
      </Stack>
    </Stack>
  ),
};

export const Sizes: Story = {
  name: 'Gap Sizes',
  render: () => (
    <Stack direction="column" gap="xl">
      {(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map((gap) => (
        <Stack key={gap} direction="column" gap="xs">
          <span className="text-label-sm text-[var(--color-text-secondary)]">gap="{gap}"</span>
          <Stack direction="row" gap={gap}>
            <Box label="A" />
            <Box label="B" />
            <Box label="C" />
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
};

export const States: Story = {
  name: 'Alignment & Wrap',
  render: () => (
    <Stack direction="column" gap="xl">
      <Stack gap="xs">
        <span className="text-label-sm text-[var(--color-text-secondary)]">align="center" + justify="between" (row)</span>
        <Stack direction="row" align="center" justify="between" style={{ width: 360 }}>
          <Box label="Start" />
          <Box label="Middle" wide />
          <Box label="End" />
        </Stack>
      </Stack>
      <Stack gap="xs">
        <span className="text-label-sm text-[var(--color-text-secondary)]">wrap=true (row, narrow container)</span>
        <Stack direction="row" gap="sm" wrap style={{ width: 220 }}>
          <Box label="Alpha" />
          <Box label="Beta" />
          <Box label="Gamma" />
          <Box label="Delta" />
          <Box label="Epsilon" />
        </Stack>
      </Stack>
      <Stack gap="xs">
        <span className="text-label-sm text-[var(--color-text-secondary)]">justify="center" (column)</span>
        <Stack direction="column" gap="sm" align="center" style={{ width: 280 }}>
          <Box label="Centered item" />
          <Box label="Also centered" wide />
        </Stack>
      </Stack>
    </Stack>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="p-[var(--spacing-layout-sm)] bg-[var(--color-surface-page)] max-w-2xl rounded-[var(--radius-component-lg)]">
      <Stack direction="column" gap="md">
        <span className="text-label-sm text-[var(--color-text-secondary)]">Dark mode — column gap md</span>
        <Stack direction="row" gap="sm">
          <Box label="Item 1" />
          <Box label="Item 2" />
          <Box label="Item 3" />
        </Stack>
        <Stack direction="column" gap="sm">
          <Box label="Item A" />
          <Box label="Item B" />
        </Stack>
      </Stack>
    </div>
  ),
};

// ── 6. EdgeCases ─────────────────────────────────────────────────────────────

export const EdgeCases: Story = {
  render: () => (
    <Stack direction="column" gap="xl">
      <Stack gap="xs">
        <span className="text-label-sm text-[var(--color-text-secondary)]">Wrap with many items (200px container)</span>
        <Stack direction="row" gap="sm" wrap style={{ width: 200 }}>
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((l) => (
            <Box key={l} label={l} />
          ))}
        </Stack>
      </Stack>

      <Stack gap="xs">
        <span className="text-label-sm text-[var(--color-text-secondary)]">Semantic override — as="section"</span>
        <Stack as="section" aria-label="Feature highlights" direction="column" gap="sm" style={{ width: 240 }}>
          <Box label="Feature one" wide />
          <Box label="Feature two" wide />
          <Box label="Feature three" wide />
        </Stack>
      </Stack>

      <Stack gap="xs">
        <span className="text-label-sm text-[var(--color-text-secondary)]">Inline row (inline-flex)</span>
        <p className="text-body-sm text-[var(--color-text-primary)]">
          Surrounding text —{' '}
          <Stack as="span" direction="row" gap="xs" inline>
            <Box label="A" /><Box label="B" />
          </Stack>
          {' '}— continues here.
        </p>
      </Stack>

      <Stack gap="xs">
        <span className="text-label-sm text-[var(--color-text-secondary)]">Mixed-height children (align="end")</span>
        <Stack direction="row" gap="sm" align="end" style={{ height: 80 }}>
          <Box label="Short" />
          <Box label="Tall" wide />
          <Box label="Short" />
        </Stack>
      </Stack>
    </Stack>
  ),
};

// ── 7. Playground ────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    direction: 'column',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
    inline: false,
  },
  render: (args) => (
    <Stack {...args} style={args.direction === 'row' ? { minHeight: 80 } : { width: 240 }}>
      <Box label="Item 1" />
      <Box label="Item 2" />
      <Box label="Item 3" />
    </Stack>
  ),
};

// ── 8. Accessibility ─────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <Stack direction="column" gap="md">
      {/* as="nav" with aria-label — Stack is a layout wrapper, semantic comes from the `as` element */}
      <Stack as="nav" aria-label="Primary navigation" direction="row" gap="sm">
        <Box label="Home" />
        <Box label="About" />
        <Box label="Contact" />
      </Stack>

      {/* as="ul" for a list-based vertical stack */}
      <Stack as="ul" direction="column" gap="xs" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li><Box label="List item 1" /></li>
        <li><Box label="List item 2" /></li>
        <li><Box label="List item 3" /></li>
      </Stack>

      {/* Default div — no landmark role, just layout */}
      <Stack direction="row" gap="sm" role="group" aria-label="Action buttons">
        <Box label="Action A" />
        <Box label="Action B" />
      </Stack>
    </Stack>
  ),
};
