"use client"
import type { Meta, StoryObj } from '@storybook/react';
import { useState, useCallback } from 'react';
import { Modal } from './Modal';
import { Button } from '../../atoms/Button/Button';
import { Trash2, AlertTriangle } from 'lucide-react';

const meta = {
  title: 'Organisms/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A modal dialog overlay. Renders in a portal on `document.body`. Traps focus, dismisses on Escape or backdrop click, and announces via `role="dialog"`.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Width preset for the dialog panel.',
    },
    title: { control: 'text' },
    loading: { control: 'boolean' },
    closeOnBackdropClick: { control: 'boolean' },
    isOpen: { control: false },
    onClose: { control: false },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Wrapper for controlled stories ───────────────────────────────────────────

function ModalDemo({
  buttonLabel = 'Open modal',
  buttonVariant = 'primary' as const,
  ...props
}: Partial<React.ComponentProps<typeof Modal>> & {
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
      <Modal isOpen={open} onClose={close} {...props} />
    </>
  );
}

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <ModalDemo
      title="Confirm deletion"
      buttonLabel="Open modal"
    >
      <Modal.Body>
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={() => {}}>Cancel</Button>
        <Button variant="destructive" onClick={() => {}}>Delete</Button>
      </Modal.Footer>
    </ModalDemo>
  ),
  args: {
    isOpen: false,
    onClose: () => {},
  },
};

// ── 2. Variants (Sizes) ───────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--spacing-component-md)]">
      {(['sm', 'md', 'lg', 'xl', 'full'] as const).map((size) => (
        <ModalDemo
          key={size}
          size={size}
          title={`${size.toUpperCase()} modal`}
          buttonLabel={`${size} (open)`}
          buttonVariant="outline"
        >
          <Modal.Body>
            <p>This is a <strong>{size}</strong> modal. The panel width is controlled by the <code>size</code> prop.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => {}}>Got it</Button>
          </Modal.Footer>
        </ModalDemo>
      ))}
    </div>
  ),
  args: {
    isOpen: false,
    onClose: () => {},
  },
};

// ── 3. Variants (intent/content types) ───────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--spacing-component-md)]">
      <ModalDemo title="Information" buttonLabel="Info modal" buttonVariant="secondary">
        <Modal.Body>
          <p>This is an informational dialog. It presents content that requires the user's attention before continuing.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {}}>Understood</Button>
        </Modal.Footer>
      </ModalDemo>

      <ModalDemo title="Confirm action" buttonLabel="Confirm modal" buttonVariant="secondary">
        <Modal.Body>
          <p>Do you want to proceed with this action?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => {}}>Cancel</Button>
          <Button variant="primary" onClick={() => {}}>Confirm</Button>
        </Modal.Footer>
      </ModalDemo>

      <ModalDemo title="Danger zone" buttonLabel="Destructive modal" buttonVariant="destructive">
        <Modal.Body>
          <div className="flex gap-[var(--spacing-component-md)]">
            <span aria-hidden="true" className="text-[var(--color-status-error)] shrink-0 mt-0.5">
              <AlertTriangle size="var(--size-icon-md)" />
            </span>
            <p>This action is permanent and cannot be undone. All associated data will be removed.</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => {}}>Cancel</Button>
          <Button variant="destructive" onClick={() => {}}>
            <span aria-hidden="true"><Trash2 size="var(--size-icon-sm)" /></span>
            Delete permanently
          </Button>
        </Modal.Footer>
      </ModalDemo>

      <ModalDemo title="Long content" buttonLabel="Scrollable modal" buttonVariant="outline">
        <Modal.Body>
          {Array.from({ length: 12 }).map((_, i) => (
            <p key={i} className="mb-[var(--spacing-component-md)]">
              Paragraph {i + 1}: The modal body scrolls independently when content overflows the maximum panel height. The header and footer remain fixed.
            </p>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {}}>Close</Button>
        </Modal.Footer>
      </ModalDemo>
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
      <ModalDemo title="Default state" buttonLabel="Default" buttonVariant="outline">
        <Modal.Body>
          <p>Normal modal with default state content.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {}}>OK</Button>
        </Modal.Footer>
      </ModalDemo>

      <ModalDemo title="Loading content" buttonLabel="Loading state" buttonVariant="outline" loading={true}>
        <Modal.Body>
          <p>This content is hidden during loading.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {}}>OK</Button>
        </Modal.Footer>
      </ModalDemo>

      <ModalDemo title="No title (aria-label fallback)" buttonLabel="No title" buttonVariant="outline">
        <Modal.Body>
          <p>When no <code>title</code> prop is provided, the dialog uses <code>aria-label</code> as its accessible name.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => {}}>Cancel</Button>
          <Button variant="primary" onClick={() => {}}>OK</Button>
        </Modal.Footer>
      </ModalDemo>

      <ModalDemo
        title="Backdrop disabled"
        buttonLabel="No backdrop close"
        buttonVariant="outline"
        closeOnBackdropClick={false}
      >
        <Modal.Body>
          <p>Clicking outside this modal does not close it. Only the close button or Escape key work.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {}}>Close</Button>
        </Modal.Footer>
      </ModalDemo>
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
      <ModalDemo
        title="Dark mode modal"
        buttonLabel="Open in dark mode"
        buttonVariant="primary"
      >
        <Modal.Body>
          <p>Tokens cascade correctly in dark mode. The backdrop, panel, text, and footer all use theme-aware semantics.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => {}}>Cancel</Button>
          <Button variant="primary" onClick={() => {}}>Confirm</Button>
        </Modal.Footer>
      </ModalDemo>
    </div>
  ),
  args: {
    isOpen: false,
    onClose: () => {},
  },
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <ModalDemo
      size={args.size}
      title={args.title}
      loading={args.loading}
      closeOnBackdropClick={args.closeOnBackdropClick}
      buttonLabel="Open playground modal"
    >
      <Modal.Body>
        <p>Adjust controls in the sidebar to explore different configurations.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={() => {}}>Cancel</Button>
        <Button variant="primary" onClick={() => {}}>Confirm</Button>
      </Modal.Footer>
    </ModalDemo>
  ),
  args: {
    isOpen: false,
    onClose: () => {},
    size: 'md',
    title: 'Playground modal',
    loading: false,
    closeOnBackdropClick: true,
  },
};

// ── Edge Cases ────────────────────────────────────────────────────────────────

export const EdgeCases: Story = {
  render: () => (
    <div className="flex flex-wrap gap-[var(--spacing-component-md)]">
      {/* No Footer slot */}
      <ModalDemo
        title="Notification"
        buttonLabel="No footer"
        buttonVariant="outline"
      >
        <Modal.Body>
          <p>This modal has no footer. It relies on the close button in the header to dismiss.</p>
        </Modal.Body>
      </ModalDemo>

      {/* Very long title — truncation */}
      <ModalDemo
        title="This is an extremely long modal title that should truncate gracefully without breaking the header layout"
        buttonLabel="Long title"
        buttonVariant="outline"
      >
        <Modal.Body>
          <p>The title above is truncated with an ellipsis. The close button remains visible and accessible.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {}}>OK</Button>
        </Modal.Footer>
      </ModalDemo>

      {/* Loading state */}
      <ModalDemo
        title="Loading content"
        buttonLabel="Loading state"
        buttonVariant="outline"
        loading={true}
      >
        <Modal.Body>
          <p>This content is hidden while loading.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => {}}>Cancel</Button>
          <Button variant="primary" onClick={() => {}}>Submit</Button>
        </Modal.Footer>
      </ModalDemo>
    </div>
  ),
  args: {
    isOpen: false,
    onClose: () => {},
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
          The modal uses <code>role="dialog"</code> with <code>aria-modal="true"</code>, traps Tab focus, and dismisses on Escape. The close button has an explicit <code>aria-label</code>. The title is referenced via <code>aria-labelledby</code>.
        </p>
        <Button
          variant="primary"
          aria-label="Open accessible modal dialog"
          onClick={() => setOpen(true)}
        >
          Open accessible modal
        </Button>
        <Modal
          isOpen={open}
          onClose={close}
          title="Accessible dialog"
          size="md"
          i18nStrings={{ closeLabel: 'Close dialog', dialogLabel: 'Accessible dialog' }}
        >
          <Modal.Body>
            <p>
              This modal is announced by screen readers as a dialog. Focus is trapped inside and returns to the trigger button on close.
            </p>
            <p className="mt-[var(--spacing-component-md)]">
              <strong>Keyboard interactions:</strong> Tab / Shift+Tab to navigate, Escape to close.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={close} aria-label="Cancel and close dialog">
              Cancel
            </Button>
            <Button variant="primary" onClick={close} aria-label="Confirm action and close dialog">
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  },
  args: {
    isOpen: false,
    onClose: () => {},
  },
};
