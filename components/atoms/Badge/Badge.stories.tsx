import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import type { BadgeColor, BadgeSize, BadgeVariant, BadgeShape } from './Badge.types';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'soft', 'outline', 'dot'] satisfies BadgeVariant[],
    },
    color: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'] satisfies BadgeColor[],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'] satisfies BadgeSize[],
    },
    shape: {
      control: 'select',
      options: ['pill', 'rounded'] satisfies BadgeShape[],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: 'solid',
    color: 'default',
    size: 'md',
    shape: 'pill',
    children: 'Badge',
  },
};

// ── 2. Variants ───────────────────────────────────────────────────────────────

const colors: BadgeColor[] = ['default', 'success', 'warning', 'error', 'info'];

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(['solid', 'soft', 'outline'] as BadgeVariant[]).map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)] capitalize">{variant}</span>
          <div className="flex items-center gap-3 flex-wrap">
            {colors.map((color) => (
              <Badge key={color} variant={variant} color={color}>
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">dot</span>
        <div className="flex items-center gap-3">
          {colors.map((color) => (
            <Badge key={color} variant="dot" color={color} dotLabel={`${color} status`} />
          ))}
        </div>
      </div>
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md'] as BadgeSize[]).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">{size}</span>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge size={size} variant="solid" color="default">Solid</Badge>
            <Badge size={size} variant="soft" color="success">Soft</Badge>
            <Badge size={size} variant="outline" color="warning">Outline</Badge>
            <Badge size={size} variant="dot" color="error" dotLabel="error indicator" />
          </div>
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Default</span>
        <div className="flex items-center gap-3">
          {colors.map((color) => (
            <Badge key={color} variant="solid" color={color}>{color}</Badge>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">With icon placeholder (leading dot)</span>
        <div className="flex items-center gap-3">
          <Badge variant="soft" color="success">
            <span aria-hidden="true" className="inline-block w-[6px] h-[6px] rounded-full bg-current" />
            Active
          </Badge>
          <Badge variant="soft" color="warning">
            <span aria-hidden="true" className="inline-block w-[6px] h-[6px] rounded-full bg-current" />
            Pending
          </Badge>
          <Badge variant="soft" color="error">
            <span aria-hidden="true" className="inline-block w-[6px] h-[6px] rounded-full bg-current" />
            Failed
          </Badge>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Numeric counts</span>
        <div className="flex items-center gap-3">
          <Badge variant="solid" color="error">3</Badge>
          <Badge variant="solid" color="info">12</Badge>
          <Badge variant="solid" color="default">99+</Badge>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">Rounded shape</span>
        <div className="flex items-center gap-3">
          <Badge variant="solid" color="default" shape="rounded">Beta</Badge>
          <Badge variant="soft" color="info" shape="rounded">New</Badge>
          <Badge variant="outline" color="default" shape="rounded">v2.0</Badge>
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
        {(['solid', 'soft', 'outline'] as BadgeVariant[]).map((variant) => (
          <div key={variant} className="flex flex-col gap-2">
            <span className="text-body-sm text-[var(--color-text-tertiary)] capitalize">{variant}</span>
            <div className="flex items-center gap-3 flex-wrap">
              {colors.map((color) => (
                <Badge key={color} variant={variant} color={color}>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <span className="text-body-sm text-[var(--color-text-tertiary)]">dot</span>
          <div className="flex items-center gap-3">
            {colors.map((color) => (
              <Badge key={color} variant="dot" color={color} dotLabel={`${color} status`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'solid',
    color: 'default',
    size: 'md',
    shape: 'pill',
    children: 'Badge',
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Text badges — announced by screen readers inline
        </span>
        <div className="flex items-center gap-3">
          <Badge variant="solid" color="success">Active</Badge>
          <Badge variant="soft" color="warning">Pending</Badge>
          <Badge variant="outline" color="error">Failed</Badge>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Dot badges — require <code>dotLabel</code> for screen reader announcement
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="dot" color="success" dotLabel="Online" role="status" />
            <span className="text-body-sm">Online (announced as "Online")</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="dot" color="error" dotLabel="3 unread notifications" role="status" />
            <span className="text-body-sm">3 unread notifications</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Count badge inline with label context
        </span>
        <div className="flex items-center gap-2">
          <span className="text-body-md">Messages</span>
          <Badge variant="solid" color="info" aria-label="12 unread messages">12</Badge>
        </div>
      </div>
    </div>
  ),
};
