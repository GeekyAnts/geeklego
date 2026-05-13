"use client"
import { memo, useCallback, useId, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '../../atoms/Button/Button';
import { useFocusTrap } from '../../utils/keyboard/useFocusTrap';
import { useEscapeDismiss } from '../../utils/keyboard/useEscapeDismiss';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type {
  ModalProps,
  ModalSize,
  ModalBodyProps,
  ModalFooterProps,
} from './Modal.types';

// ── Size → max-width class map ────────────────────────────────────────────────

const sizeClasses: Record<ModalSize, string> = {
  sm:   'max-w-[var(--modal-width-sm)] w-full',
  md:   'max-w-[var(--modal-width-md)] w-full',
  lg:   'max-w-[var(--modal-width-lg)] w-full',
  xl:   'max-w-[var(--modal-width-xl)] w-full',
  full: 'w-full h-dvh rounded-none max-w-none',
};

// ── Static module-scope class strings ─────────────────────────────────────────

const BACKDROP_CLASSES = [
  'fixed inset-0 flex items-center justify-center',
  'bg-[var(--modal-backdrop-bg)]',
  'z-[var(--modal-z-index)]',
  'p-[var(--spacing-component-lg)]',
].join(' ');

const PANEL_BASE_CLASSES = [
  'relative flex flex-col',
  'bg-[var(--modal-bg)]',
  'border border-[var(--modal-border-color)]',
  'rounded-[var(--modal-radius)]',
  'shadow-[var(--modal-shadow)]',
  'max-h-[var(--modal-max-height)]',
  'min-w-[var(--modal-min-width)]',
  'overflow-hidden',
].join(' ');

const HEADER_CLASSES = [
  'flex items-center justify-between',
  'card-header-row',
  'gap-[var(--modal-header-gap)]',
  'px-[var(--modal-header-px)] py-[var(--modal-header-py)]',
  'border-b border-[var(--modal-header-border)]',
  'shrink-0',
].join(' ');

const TITLE_CLASSES = [
  'text-heading-h4',
  'text-[var(--modal-title-color)]',
  'truncate-label',
  'content-flex',
].join(' ');

const LOADING_BODY_CLASSES = [
  'flex flex-col gap-[var(--spacing-component-md)]',
  'px-[var(--modal-body-px)] py-[var(--modal-body-py)]',
  'grow overflow-y-auto',
].join(' ');

// ── Compound slot components ──────────────────────────────────────────────────

/**
 * Scrollable body region of the Modal.
 * Compose inside <Modal> to wrap the main content.
 */
const ModalBody = memo(function ModalBody({ children, className, ...rest }: ModalBodyProps) {
  const classes = useMemo(
    () =>
      [
        'px-[var(--modal-body-px)] py-[var(--modal-body-py)]',
        'grow overflow-y-auto',
        'text-body-md text-[var(--modal-body-text-color)]',
        className,
      ]
        .filter(Boolean)
        .join(' '),
    [className],
  );
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
});
ModalBody.displayName = 'Modal.Body';

/**
 * Footer region of the Modal.
 * Compose inside <Modal> to render action buttons.
 */
const ModalFooter = memo(function ModalFooter({ children, className, ...rest }: ModalFooterProps) {
  const classes = useMemo(
    () =>
      [
        'flex items-center justify-end flex-wrap',
        'gap-[var(--modal-footer-gap)]',
        'px-[var(--modal-footer-px)] py-[var(--modal-footer-py)]',
        'border-t border-[var(--modal-footer-border)]',
        'shrink-0',
        className,
      ]
        .filter(Boolean)
        .join(' '),
    [className],
  );
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
});
ModalFooter.displayName = 'Modal.Footer';

// ── Main Modal component ──────────────────────────────────────────────────────

const ModalInner = memo(function Modal({
  isOpen,
  onClose,
  size = 'md',
  title,
  loading = false,
  closeOnBackdropClick = true,
  className,
  children,
  i18nStrings,
}: ModalProps) {
  const i18n = useComponentI18n('modal', i18nStrings);
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap({ active: isOpen, containerRef: panelRef });
  useEscapeDismiss({ active: isOpen, onDismiss: onClose });

  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdropClick) onClose();
  }, [closeOnBackdropClick, onClose]);

  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const panelClasses = useMemo(
    () => [PANEL_BASE_CLASSES, sizeClasses[size], className].filter(Boolean).join(' '),
    [size, className],
  );

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    /* Backdrop — closes modal on click when closeOnBackdropClick=true */
    <div
      className={BACKDROP_CLASSES}
      onClick={handleBackdropClick}
    >
      {/* Dialog panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? i18n.dialogLabel : undefined}
        aria-busy={loading || undefined}
        className={panelClasses}
        onClick={stopPropagation}
      >
        {/* Header — always rendered; title (when provided) + close button */}
        <header className={HEADER_CLASSES}>
          <div className="card-header-title">
            {title && (
              <h2 id={titleId} className={TITLE_CLASSES}>
                {title}
              </h2>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            aria-label={i18n.closeLabel}
            onClick={onClose}
          >
            <span aria-hidden="true">
              <X size="var(--size-icon-sm)" />
            </span>
          </Button>
        </header>

        {/* Loading state — replaces children with skeleton rows */}
        {loading ? (
          <div className={LOADING_BODY_CLASSES} aria-label={i18n.dialogLabel}>
            <div className="skeleton h-[var(--size-component-sm)] w-3/4 rounded-[var(--radius-component-sm)]" />
            <div className="skeleton h-[var(--size-component-xs)] w-full rounded-[var(--radius-component-sm)]" />
            <div className="skeleton h-[var(--size-component-xs)] w-5/6 rounded-[var(--radius-component-sm)]" />
            <div className="skeleton h-[var(--size-component-xs)] w-4/5 rounded-[var(--radius-component-sm)]" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>,
    document.body,
  );
});
ModalInner.displayName = 'Modal';

// ── Public export with static slot properties ─────────────────────────────────

export const Modal = Object.assign(ModalInner, {
  Body:   ModalBody,
  Footer: ModalFooter,
});

// Named slot exports — required for compound-slot registration in the docs site
export { ModalBody, ModalFooter };
