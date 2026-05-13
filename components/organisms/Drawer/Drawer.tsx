"use client"
import { memo, useCallback, useId, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '../../atoms/Button/Button';
import { useFocusTrap } from '../../utils/keyboard/useFocusTrap';
import { useEscapeDismiss } from '../../utils/keyboard/useEscapeDismiss';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type {
  DrawerProps,
  DrawerPlacement,
  DrawerSize,
  DrawerBodyProps,
  DrawerFooterProps,
} from './Drawer.types';

// ── Placement position classes ────────────────────────────────────────────────

const placementPositionClasses: Record<DrawerPlacement, string> = {
  left:   'absolute inset-y-0 start-0',
  right:  'absolute inset-y-0 end-0',
  top:    'absolute inset-x-0 top-0',
  bottom: 'absolute inset-x-0 bottom-0',
};

// ── Placement radius classes (inner corners only) ─────────────────────────────

const placementRadiusClasses: Record<DrawerPlacement, string> = {
  left:   'rounded-e-[var(--drawer-radius)]',
  right:  'rounded-s-[var(--drawer-radius)]',
  top:    'rounded-b-[var(--drawer-radius)]',
  bottom: 'rounded-t-[var(--drawer-radius)]',
};

// ── Placement × size → dimension classes ─────────────────────────────────────

const placementSizeClasses: Record<DrawerPlacement, Record<DrawerSize, string>> = {
  left: {
    sm:   'w-[var(--drawer-width-sm)] h-full',
    md:   'w-[var(--drawer-width-md)] h-full',
    lg:   'w-[var(--drawer-width-lg)] h-full',
    xl:   'w-[var(--drawer-width-xl)] h-full',
    full: 'w-full h-full rounded-none',
  },
  right: {
    sm:   'w-[var(--drawer-width-sm)] h-full',
    md:   'w-[var(--drawer-width-md)] h-full',
    lg:   'w-[var(--drawer-width-lg)] h-full',
    xl:   'w-[var(--drawer-width-xl)] h-full',
    full: 'w-full h-full rounded-none',
  },
  top: {
    sm:   'w-full h-[var(--drawer-height-sm)]',
    md:   'w-full h-[var(--drawer-height-md)]',
    lg:   'w-full h-[var(--drawer-height-lg)]',
    xl:   'w-full h-[var(--drawer-height-xl)]',
    full: 'w-full h-full rounded-none',
  },
  bottom: {
    sm:   'w-full h-[var(--drawer-height-sm)]',
    md:   'w-full h-[var(--drawer-height-md)]',
    lg:   'w-full h-[var(--drawer-height-lg)]',
    xl:   'w-full h-[var(--drawer-height-xl)]',
    full: 'w-full h-full rounded-none',
  },
};

// ── Static module-scope class strings ─────────────────────────────────────────

const BACKDROP_CLASSES = [
  'fixed inset-0',
  'bg-[var(--drawer-backdrop-bg)]',
  'z-[var(--drawer-z-index)]',
].join(' ');

const PANEL_BASE_CLASSES = [
  'relative flex flex-col',
  'bg-[var(--drawer-bg)]',
  'border border-[var(--drawer-border-color)]',
  'shadow-[var(--drawer-shadow)]',
  'overflow-hidden',
  'min-w-[var(--drawer-min-width)]',
].join(' ');

const HEADER_CLASSES = [
  'flex items-center justify-between',
  'card-header-row',
  'gap-[var(--drawer-header-gap)]',
  'px-[var(--drawer-header-px)] py-[var(--drawer-header-py)]',
  'border-b border-[var(--drawer-header-border)]',
  'shrink-0',
].join(' ');

const TITLE_CLASSES = [
  'text-heading-h4',
  'text-[var(--drawer-title-color)]',
  'truncate-label',
  'content-flex',
].join(' ');

const LOADING_BODY_CLASSES = [
  'flex flex-col gap-[var(--spacing-component-md)]',
  'px-[var(--drawer-body-px)] py-[var(--drawer-body-py)]',
  'grow overflow-y-auto',
].join(' ');

// ── Compound slot components ──────────────────────────────────────────────────

/**
 * Scrollable body region of the Drawer.
 * Compose inside <Drawer> to wrap the main content.
 */
const DrawerBody = memo(function DrawerBody({ children, className, ...rest }: DrawerBodyProps) {
  const classes = useMemo(
    () =>
      [
        'px-[var(--drawer-body-px)] py-[var(--drawer-body-py)]',
        'grow overflow-y-auto',
        'text-body-md text-[var(--drawer-body-text-color)]',
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
DrawerBody.displayName = 'Drawer.Body';

/**
 * Footer region of the Drawer.
 * Compose inside <Drawer> to render action buttons.
 */
const DrawerFooter = memo(function DrawerFooter({ children, className, ...rest }: DrawerFooterProps) {
  const classes = useMemo(
    () =>
      [
        'flex items-center justify-end flex-wrap',
        'gap-[var(--drawer-footer-gap)]',
        'px-[var(--drawer-footer-px)] py-[var(--drawer-footer-py)]',
        'border-t border-[var(--drawer-footer-border)]',
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
DrawerFooter.displayName = 'Drawer.Footer';

// ── Main Drawer component ─────────────────────────────────────────────────────

const DrawerInner = memo(function Drawer({
  isOpen,
  onClose,
  placement = 'right',
  size = 'md',
  title,
  loading = false,
  closeOnBackdropClick = true,
  className,
  children,
  i18nStrings,
}: DrawerProps) {
  const i18n = useComponentI18n('drawer', i18nStrings);
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

  const isFull = size === 'full';

  const panelClasses = useMemo(
    () =>
      [
        PANEL_BASE_CLASSES,
        placementPositionClasses[placement],
        placementSizeClasses[placement][size],
        !isFull && placementRadiusClasses[placement],
        className,
      ]
        .filter(Boolean)
        .join(' '),
    [placement, size, isFull, className],
  );

  if (!isOpen) return null;

  return createPortal(
    /* Backdrop — closes drawer on click when closeOnBackdropClick=true */
    <div
      className={BACKDROP_CLASSES}
      onClick={handleBackdropClick}
      aria-hidden="true"
    >
      {/* Dialog panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? i18n.drawerLabel : undefined}
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
          <div className={LOADING_BODY_CLASSES} aria-label={i18n.drawerLabel}>
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
DrawerInner.displayName = 'Drawer';

// ── Public export with static slot properties ─────────────────────────────────

export const Drawer = Object.assign(DrawerInner, {
  Body:   DrawerBody,
  Footer: DrawerFooter,
});

// Named slot exports — required for compound-slot registration in the docs site
export { DrawerBody, DrawerFooter };
