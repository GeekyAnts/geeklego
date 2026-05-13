"use client"
import type { Meta, StoryObj } from '@storybook/react';
import { useState, useCallback } from 'react';
import { Settings, User, Bell, HelpCircle, AlertTriangle } from 'lucide-react';
import { Drawer } from './Drawer';
import { Button } from '../../atoms/Button/Button';
import type { DrawerPlacement, DrawerSize } from './Drawer.types';

const meta = {
  title: 'Organisms/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An off-canvas panel that slides in from the edge of the viewport. Renders in a portal on `document.body`. Traps focus, dismisses on Escape or backdrop click, and announces via `role="dialog"`.',
      },
    },
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      description: 'Edge of the viewport the panel slides in from.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Panel size. Left/right: width. Top/bottom: height.',
    },
    title: { control: 'text' },
    loading: { control: 'boolean' },
    closeOnBackdropClick: { control: 'boolean' },
    isOpen: { control: false },
    onClose: { control: false },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Wrapper for controlled stories ───────────────────────────────────────────

function DrawerDemo({
  buttonLabel = 'Open drawer',
  buttonVariant = 'primary' as const,
  ...props
}: Partial<React.ComponentProps<typeof Drawer>> & {
  buttonLabel?: string;
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <Button variant={buttonVariant} onClick={() => setOpen(true)}>
        {buttonLabel}
      </Button>
      <Drawer isOpen={open} onClose={close} {...props} />
    </>
  );
}

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <DrawerDemo
      title="Settings"
      placement="right"
      buttonLabel="Open drawer"
    >
      <Drawer.Body>
        <div className="flex flex-col gap-[var(--spacing-component-lg)]">
          <div className="flex items-center gap-[var(--spacing-component-md)]">
            <span aria-hidden="true" className="text-[var(--color-text-secondary)]">
              <User size="var(--size-icon-md)" />
            </span>
            <div>
              <p className="text-body-md text-[var(--color-text-primary)]">Profile</p>
              <p className="text-body-sm text-[var(--color-text-secondary)]">Manage your account details</p>
            </div>
          </div>
          <div className="flex items-center gap-[var(--spacing-component-md)]">
            <span aria-hidden="true" className="text-[var(--color-text-secondary)]">
              <Bell size="var(--size-icon-md)" />
            </span>
            <div>
              <p className="text-body-md text-[var(--color-text-primary)]">Notifications</p>
              <p className="text-body-sm text-[var(--color-text-secondary)]">Configure alert preferences</p>
            </div>
          </div>
          <div className="flex items-center gap-[var(--spacing-component-md)]">
            <span aria-hidden="true" className="text-[var(--color-text-secondary)]">
              <HelpCircle size="var(--size-icon-md)" />
            </span>
            <div>
              <p className="text-body-md text-[var(--color-text-primary)]">Help & Support</p>
              <p className="text-body-sm text-[var(--color-text-secondary)]">Get help or contact us</p>
            </div>
          </div>
        </div>
      </Drawer.Body>
      <Drawer.Footer>
        <Button variant="ghost" onClick={() => {}}>Cancel</Button>
        <Button variant="primary" onClick={() => {}}>Save changes</Button>
      </Drawer.Footer>
    </DrawerDemo>
  ),
  args: {
    isOpen: false,
    onClose: () => {},
  },
};

// ── 2. Placements ─────────────────────────────────────────────────────────────

export const Placements: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--spacing-component-md)]">
      {(['right', 'left', 'top', 'bottom'] as DrawerPlacement[]).map((placement) => (
        <DrawerDemo
          key={placement}
          placement={placement}
          title={`${placement.charAt(0).toUpperCase() + placement.slice(1)} drawer`}
          buttonLabel={`${placement} (open)`}
          buttonVariant="outline"
        >
          <Drawer.Body>
            <p>This drawer slides in from the <strong>{placement}</strong>. The panel edge touching the viewport has no border-radius; the inner edge is rounded.</p>
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="primary" onClick={() => {}}>Got it</Button>
          </Drawer.Footer>
        </DrawerDemo>
      ))}
    </div>
  ),
  args: {
    isOpen: false,
    onClose: () => {},
  },
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--spacing-component-md)]">
      {(['sm', 'md', 'lg', 'xl', 'full'] as DrawerSize[]).map((size) => (
        <DrawerDemo
          key={size}
          size={size}
          placement="right"
          title={`${size.toUpperCase()} drawer`}
          buttonLabel={`${size} (open)`}
          buttonVariant="outline"
        >
          <Drawer.Body>
            <p>This is a <strong>{size}</strong> right-side drawer. The panel width is controlled by the <code>size</code> prop.</p>
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="primary" onClick={() => {}}>Close</Button>
          </Drawer.Footer>
        </DrawerDemo>
      ))}
    </div>
  ),
  args: {
    isOpen: false,
    onClose: () => {},
  },
};

// ── 4. States ─────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--spacing-component-md)]">
      <DrawerDemo title="Default state" buttonLabel="Default" buttonVariant="outline">
        <Drawer.Body>
          <p>Normal drawer with default state content.</p>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="primary" onClick={() => {}}>OK</Button>
        </Drawer.Footer>
      </DrawerDemo>

      <DrawerDemo title="Loading content" buttonLabel="Loading state" buttonVariant="outline" loading={true}>
        <Drawer.Body>
          <p>This content is hidden during loading.</p>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="primary" onClick={() => {}}>OK</Button>
        </Drawer.Footer>
      </DrawerDemo>

      <DrawerDemo buttonLabel="No title" buttonVariant="outline">
        <Drawer.Body>
          <p>When no <code>title</code> prop is provided, the dialog uses <code>aria-label</code> as its accessible name.</p>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="ghost" onClick={() => {}}>Cancel</Button>
          <Button variant="primary" onClick={() => {}}>OK</Button>
        </Drawer.Footer>
      </DrawerDemo>

      <DrawerDemo
        title="Backdrop disabled"
        buttonLabel="No backdrop close"
        buttonVariant="outline"
        closeOnBackdropClick={false}
      >
        <Drawer.Body>
          <p>Clicking outside this drawer does not close it. Only the close button or Escape key work.</p>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="primary" onClick={() => {}}>Close</Button>
        </Drawer.Footer>
      </DrawerDemo>

      <DrawerDemo title="Scrollable content" buttonLabel="Long content" buttonVariant="outline" size="md">
        <Drawer.Body>
          {Array.from({ length: 15 }).map((_, i) => (
            <p key={i + 1} className="mb-[var(--spacing-component-md)]">
              Item {i + 1}: The drawer body scrolls independently when content overflows the panel height. The header and footer remain fixed in place.
            </p>
          ))}
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="primary" onClick={() => {}}>Done</Button>
        </Drawer.Footer>
      </DrawerDemo>

      <DrawerDemo title="Destructive action" buttonLabel="Danger drawer" buttonVariant="destructive">
        <Drawer.Body>
          <div className="flex gap-[var(--spacing-component-md)]">
            <span aria-hidden="true" className="text-[var(--color-status-error)] shrink-0 mt-0.5">
              <AlertTriangle size="var(--size-icon-md)" />
            </span>
            <p>This action is permanent and cannot be undone. All associated data will be removed.</p>
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="ghost" onClick={() => {}}>Cancel</Button>
          <Button variant="destructive" onClick={() => {}}>Delete permanently</Button>
        </Drawer.Footer>
      </DrawerDemo>
    </div>
  ),
  args: {
    isOpen: false,
    onClose: () => {},
  },
};

// ── 5. Dark mode ──────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-[var(--spacing-layout-md)] rounded-[var(--radius-component-lg)] max-w-2xl">
      <DrawerDemo
        title="Dark mode drawer"
        buttonLabel="Open in dark mode"
        buttonVariant="primary"
      >
        <Drawer.Body>
          <p>Tokens cascade correctly in dark mode. The backdrop, panel, text, and footer all use theme-aware semantics.</p>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="ghost" onClick={() => {}}>Cancel</Button>
          <Button variant="primary" onClick={() => {}}>Confirm</Button>
        </Drawer.Footer>
      </DrawerDemo>
    </div>
  ),
  args: {
    isOpen: false,
    onClose: () => {},
  },
};

// ── 6. Minimal ────────────────────────────────────────────────────────────────

export const Minimal: Story = {
  name: 'Minimal',
  render: () => (
    <DrawerDemo
      title="Quick info"
      buttonLabel="Open minimal drawer"
      buttonVariant="outline"
      placement="right"
      size="sm"
    >
      <Drawer.Body>
        <p className="text-body-sm text-[var(--color-text-secondary)]">
          This is the simplest Drawer usage — a title, body content, and no footer. Ideal for non-blocking contextual information or quick references.
        </p>
      </Drawer.Body>
    </DrawerDemo>
  ),
  args: {
    isOpen: false,
    onClose: () => {},
  },
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <DrawerDemo
      placement={args.placement}
      size={args.size}
      title={args.title}
      loading={args.loading}
      closeOnBackdropClick={args.closeOnBackdropClick}
      buttonLabel="Open playground drawer"
    >
      <Drawer.Body>
        <div className="flex flex-col gap-[var(--spacing-component-md)]">
          <div className="flex items-center gap-[var(--spacing-component-md)]">
            <span aria-hidden="true" className="text-[var(--color-text-secondary)]">
              <Settings size="var(--size-icon-md)" />
            </span>
            <p>Adjust controls in the sidebar to explore different configurations.</p>
          </div>
        </div>
      </Drawer.Body>
      <Drawer.Footer>
        <Button variant="ghost" onClick={() => {}}>Cancel</Button>
        <Button variant="primary" onClick={() => {}}>Confirm</Button>
      </Drawer.Footer>
    </DrawerDemo>
  ),
  args: {
    isOpen: false,
    onClose: () => {},
    placement: 'right',
    size: 'md',
    title: 'Playground drawer',
    loading: false,
    closeOnBackdropClick: true,
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const close = useCallback(() => setOpen(false), []);

    return (
      <div className="flex flex-col gap-[var(--spacing-component-md)]">
        <p className="text-body-sm text-[var(--color-text-secondary)]">
          The drawer uses <code>role="dialog"</code> with <code>aria-modal="true"</code>, traps Tab focus, and dismisses on Escape. The close button has an explicit <code>aria-label</code>. The title is referenced via <code>aria-labelledby</code>.
        </p>
        <Button
          variant="primary"
          aria-label="Open accessible drawer panel"
          onClick={() => setOpen(true)}
        >
          Open accessible drawer
        </Button>
        <Drawer
          isOpen={open}
          onClose={close}
          title="Accessible drawer"
          placement="right"
          size="md"
          i18nStrings={{ closeLabel: 'Close drawer', drawerLabel: 'Accessible drawer panel' }}
        >
          <Drawer.Body>
            <p>
              This drawer is announced by screen readers as a dialog. Focus is trapped inside and returns to the trigger button on close.
            </p>
            <p className="mt-[var(--spacing-component-md)]">
              <strong>Keyboard interactions:</strong> Tab / Shift+Tab to navigate within the panel, Escape to close.
            </p>
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="ghost" onClick={close} aria-label="Cancel and close drawer">
              Cancel
            </Button>
            <Button variant="primary" onClick={close} aria-label="Confirm action and close drawer">
              Confirm
            </Button>
          </Drawer.Footer>
        </Drawer>
      </div>
    );
  },
  args: {
    isOpen: false,
    onClose: () => {},
  },
};
