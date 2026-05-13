"use client"
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Settings, Info, ChevronDown } from 'lucide-react';
import { Popover } from './Popover';
import { Button } from '../../atoms/Button/Button';
import mockData from './mock-data.json';

const meta: Meta<typeof Popover> = {
  title: 'Molecules/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'bottom-start', 'bottom-end',
        'top-start', 'top-end',
        'left-start', 'left-end',
        'right-start', 'right-end',
      ],
    },
    headingLevel: {
      control: 'select',
      options: ['h2', 'h3', 'h4', 'h5', 'h6'],
    },
    showCloseButton: { control: 'boolean' },
    open: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    trigger: (
      <Button variant="secondary" rightIcon={<ChevronDown size="var(--size-icon-sm)" />}>
        {mockData.default.triggerLabel}
      </Button>
    ),
    children: (
      <p>{mockData.default.bodyText}</p>
    ),
    placement: 'bottom-start',
  },
};

// ── 2. Placements ─────────────────────────────────────────────────────────────
// Shows all 8 placement variants. Each popover is forced open via the `open` prop
// so placement is visible without interaction.

export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-32 p-20">
      {mockData.placements.map((p) => (
        <div key={p.placement} className="flex flex-col items-center gap-2">
          <span className="text-caption-sm text-[var(--color-text-tertiary)]">{p.placement}</span>
          <Popover
            open={true}
            placement={p.placement as Parameters<typeof Popover>[0]['placement']}
            trigger={
              <Button variant="outline" size="sm">{p.triggerLabel}</Button>
            }
          >
            <p className="text-body-sm">{p.bodyText}</p>
          </Popover>
        </div>
      ))}
    </div>
  ),
};

// ── 3. Content Variants ───────────────────────────────────────────────────────
// No header, with header (no close), with header (with close), with footer.

export const ContentVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8 p-8">
      {/* No header */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-caption-sm text-[var(--color-text-tertiary)]">Body only</span>
        <Popover
          open={true}
          trigger={<Button variant="secondary" size="sm">Body only</Button>}
        >
          <p>{mockData.contentVariants.bodyOnly.body}</p>
        </Popover>
      </div>

      {/* With header, no close button */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-caption-sm text-[var(--color-text-tertiary)]">Header, no close</span>
        <Popover
          open={true}
          title={mockData.contentVariants.withHeaderNoClose.title}
          showCloseButton={false}
          trigger={<Button variant="secondary" size="sm">Header</Button>}
        >
          <p>{mockData.contentVariants.withHeaderNoClose.body}</p>
        </Popover>
      </div>

      {/* With header and close button */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-caption-sm text-[var(--color-text-tertiary)]">Header + close</span>
        <Popover
          open={true}
          title={mockData.contentVariants.withHeaderAndClose.title}
          showCloseButton={true}
          trigger={<Button variant="secondary" size="sm">Header + close</Button>}
        >
          <p>{mockData.contentVariants.withHeaderAndClose.body}</p>
        </Popover>
      </div>

      {/* With header and footer */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-caption-sm text-[var(--color-text-tertiary)]">With footer</span>
        <Popover
          open={true}
          title={mockData.contentVariants.withFooter.title}
          trigger={<Button variant="secondary" size="sm">With footer</Button>}
          footerContent={
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm">Cancel</Button>
              <Button variant="primary" size="sm">Confirm</Button>
            </div>
          }
        >
          <p>{mockData.contentVariants.withFooter.body}</p>
        </Popover>
      </div>
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────
// Controlled open/close state management.

export const States: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-body-sm text-[var(--color-text-secondary)]">
          Controlled state: <strong>{open ? 'Open' : 'Closed'}</strong>
        </p>
        <div className="flex gap-4">
          <Popover
            open={open}
            onOpenChange={setOpen}
            title={mockData.states.controlled.title}
            trigger={
              <Button
                variant="primary"
                leftIcon={<Settings size="var(--size-icon-sm)" />}
              >
                {mockData.states.controlled.triggerLabel}
              </Button>
            }
            footerContent={
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
                  Apply
                </Button>
              </div>
            }
          >
            <p>{mockData.states.controlled.body}</p>
          </Popover>

          {/* Info popover — no title, no close, bottom-end */}
          <Popover
            placement="bottom-end"
            trigger={
              <Button variant="ghost" size="sm" iconOnly leftIcon={<Info size="var(--size-icon-sm)" />}>
                More info
              </Button>
            }
          >
            <p>{mockData.states.infoOnly.body}</p>
          </Popover>
        </div>
      </div>
    );
  },
};

// ── 5. DarkMode ───────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary rounded-lg p-8 max-w-2xl">
      <div className="flex items-center justify-center gap-6">
        <Popover
          open={true}
          title={mockData.darkMode.title}
          trigger={<Button variant="secondary">Open popover</Button>}
        >
          <p>{mockData.darkMode.body}</p>
        </Popover>

        <Popover
          open={true}
          placement="bottom-end"
          title={mockData.darkMode.footerTitle}
          trigger={<Button variant="outline">With footer</Button>}
          footerContent={
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm">Cancel</Button>
              <Button variant="primary" size="sm">Save</Button>
            </div>
          }
        >
          <p>{mockData.darkMode.footerBody}</p>
        </Popover>
      </div>
    </div>
  ),
};

// ── 7. Playground ────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    trigger: (
      <Button variant="primary">Open popover</Button>
    ),
    title: mockData.playground.title,
    showCloseButton: true,
    placement: 'bottom-start',
    children: (
      <p>{mockData.playground.body}</p>
    ),
    footerContent: (
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm">Cancel</Button>
        <Button variant="primary" size="sm">Confirm</Button>
      </div>
    ),
  },
};

// ── 8. Accessibility ─────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-6">
      {/* Panel with role="dialog", aria-labelledby, aria-modal */}
      <Popover
        open={true}
        title={mockData.accessibility.title}
        trigger={
          <Button
            variant="primary"
            aria-label={mockData.accessibility.triggerAriaLabel}
          >
            {mockData.accessibility.triggerLabel}
          </Button>
        }
        footerContent={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm">Cancel</Button>
            <Button variant="primary" size="sm">Confirm</Button>
          </div>
        }
      >
        <p id="popover-a11y-description">{mockData.accessibility.body}</p>
      </Popover>

      {/* Body-only popover — no title, no close button */}
      <Popover
        open={true}
        placement="bottom-end"
        trigger={
          <Button variant="outline" size="sm">
            {mockData.accessibility.bodyOnlyTrigger}
          </Button>
        }
      >
        <p>{mockData.accessibility.bodyOnlyText}</p>
      </Popover>

      <p className="text-caption-sm text-[var(--color-text-tertiary)] max-w-sm">
        {mockData.accessibility.note}
      </p>
    </div>
  ),
};
