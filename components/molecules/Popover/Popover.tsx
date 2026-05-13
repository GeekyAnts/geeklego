"use client";

import React, {
  forwardRef,
  memo,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { X } from 'lucide-react';
import { Button } from '../../atoms/Button/Button';
import { useFocusTrap } from '../../utils/keyboard/useFocusTrap';
import { useEscapeDismiss } from '../../utils/keyboard/useEscapeDismiss';
import { useClickOutside } from '../../utils/keyboard/useClickOutside';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import { isElementLike } from '../../utils/accessibility/aria-helpers';
import type { PopoverPlacement, PopoverProps } from './Popover.types';

// ── Placement classes — logical properties for RTL safety ──────────────────
// Each key anchors the floating panel relative to the trigger wrapper.
// Wrapper is `position: relative; display: inline-block`.
const placementClasses: Record<PopoverPlacement, string> = {
  'bottom-start': 'top-full start-0 mt-[var(--popover-panel-offset)]',
  'bottom-end':   'top-full end-0 mt-[var(--popover-panel-offset)]',
  'top-start':    'bottom-full start-0 mb-[var(--popover-panel-offset)]',
  'top-end':      'bottom-full end-0 mb-[var(--popover-panel-offset)]',
  'left-start':   'end-full top-0 me-[var(--popover-panel-offset)]',
  'left-end':     'end-full bottom-0 me-[var(--popover-panel-offset)]',
  'right-start':  'start-full top-0 ms-[var(--popover-panel-offset)]',
  'right-end':    'start-full bottom-0 ms-[var(--popover-panel-offset)]',
};

// ── Shared section padding classes (DRY, hoisted to module scope) ──────────
const SECTION_PX = 'px-[var(--popover-section-px)]';
const SECTION_PY = 'py-[var(--popover-section-py)]';

// ── Merge forwarded ref + internal ref onto the same element ───────────────
function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined | null>
): React.RefCallback<T> {
  return (value) => {
    for (const r of refs) {
      if (typeof r === 'function') r(value);
      else if (r) (r as React.MutableRefObject<T | null>).current = value;
    }
  };
}

// ── Popover ────────────────────────────────────────────────────────────────

export const Popover = memo(
  forwardRef<HTMLDivElement, PopoverProps>(
    (
      {
        trigger,
        children,
        title,
        headingLevel: HeadingTag = 'h3',
        showCloseButton = true,
        footerContent,
        placement = 'bottom-start',
        open: controlledOpen,
        onOpenChange,
        className,
        i18nStrings,
      },
      ref,
    ) => {
      const i18n = useComponentI18n('popover', i18nStrings);

      // ── IDs ───────────────────────────────────────────────────────────────
      const baseId   = useId();
      const triggerId = `${baseId}-trigger`;
      const panelId   = `${baseId}-panel`;
      const titleId   = title ? `${baseId}-title` : undefined;

      // ── Open state (uncontrolled / controlled) ────────────────────────────
      const isControlled      = controlledOpen !== undefined;
      const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
      const isOpen = isControlled ? controlledOpen! : uncontrolledOpen;

      const setOpen = useCallback(
        (next: boolean) => {
          if (!isControlled) setUncontrolledOpen(next);
          onOpenChange?.(next);
        },
        [isControlled, onOpenChange],
      );

      const toggle = useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);
      const close  = useCallback(() => setOpen(false),  [setOpen]);

      // ── Refs ──────────────────────────────────────────────────────────────
      const containerRef = useRef<HTMLDivElement>(null);
      const panelRef     = useRef<HTMLDivElement>(null);

      // ── Keyboard / focus hooks ────────────────────────────────────────────
      // useFocusTrap: traps focus inside the panel and returns it on close.
      // useEscapeDismiss: Escape key closes the popover.
      // useClickOutside: clicking outside the container closes the popover.
      useFocusTrap({ active: isOpen, containerRef: panelRef });
      useEscapeDismiss({ active: isOpen, onDismiss: close });
      useClickOutside({ active: isOpen, containerRef, onClickOutside: close });

      // ── Trigger — inject ARIA props via cloneElement ──────────────────────
      const triggerEl = useMemo(() => {
        const aria = {
          id:              triggerId,
          'aria-haspopup': 'dialog' as const,
          'aria-expanded': isOpen,
          'aria-controls': panelId,
        };

        if (isElementLike(trigger)) {
          const existing  = (trigger as React.ReactElement<Record<string, unknown>>).props;
          const prevClick = existing?.onClick as ((e: React.MouseEvent) => void) | undefined;
          return React.cloneElement(
            trigger as React.ReactElement<Record<string, unknown>>,
            {
              ...aria,
              onClick: prevClick
                ? (e: React.MouseEvent) => { prevClick(e); toggle(); }
                : toggle,
            },
          );
        }

        // Fallback: wrap raw content in an accessible button
        return (
          <button
            id={triggerId}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={toggle}
            className="focus-visible:outline-none focus-visible:focus-ring"
          >
            {trigger}
          </button>
        );
      }, [trigger, triggerId, isOpen, panelId, toggle]);

      // ── Root classes ──────────────────────────────────────────────────────
      const rootClasses = useMemo(
        () => ['relative inline-block', className].filter(Boolean).join(' '),
        [className],
      );

      // ── Panel classes ─────────────────────────────────────────────────────
      const panelClasses = useMemo(
        () =>
          [
            'absolute z-[var(--popover-panel-z)]',
            placementClasses[placement] ?? placementClasses['bottom-start'],
            'min-w-[var(--popover-panel-min-width)] max-w-[var(--popover-panel-max-width)] w-max',
            'bg-[var(--popover-panel-bg)]',
            'border border-[var(--popover-panel-border)]',
            'rounded-[var(--popover-panel-radius)]',
            'shadow-[var(--popover-panel-shadow)]',
            'overflow-hidden',
            'transition-default',
            isOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none invisible',
          ].join(' '),
        [placement, isOpen],
      );

      // ── Section flags ─────────────────────────────────────────────────────
      const hasHeader = !!title;
      const hasFooter = !!footerContent;

      // ── Render ────────────────────────────────────────────────────────────
      return (
        <div
          ref={mergeRefs(ref, containerRef)}
          className={rootClasses}
        >
          {/* Trigger slot — holds the injected trigger element */}
          <span className="inline-flex">
            {triggerEl}
          </span>

          {/* Popover panel */}
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-hidden={!isOpen}
            tabIndex={-1}
            className={panelClasses}
          >
            {/* Header — rendered when title prop is provided */}
            {hasHeader && (
              <header
                className={[
                  'flex items-center justify-between gap-[var(--popover-close-gap)]',
                  SECTION_PX,
                  SECTION_PY,
                  'border-b border-[var(--popover-divider)]',
                ].join(' ')}
              >
                <HeadingTag
                  id={titleId}
                  className="text-body-md text-[var(--popover-title-text)] font-semibold truncate-label"
                >
                  {title}
                </HeadingTag>

                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    leftIcon={<X size="var(--size-icon-sm)" aria-hidden="true" />}
                    onClick={close}
                    className="shrink-0"
                  >
                    {i18n.closeLabel}
                  </Button>
                )}
              </header>
            )}

            {/* Body */}
            <div
              className={[
                SECTION_PX,
                SECTION_PY,
                'text-body-sm text-[var(--popover-body-text)]',
              ].join(' ')}
            >
              {children}
            </div>

            {/* Footer — rendered when footerContent prop is provided */}
            {hasFooter && (
              <footer
                className={[
                  SECTION_PX,
                  SECTION_PY,
                  'border-t border-[var(--popover-divider)]',
                ].join(' ')}
              >
                {footerContent}
              </footer>
            )}
          </div>
        </div>
      );
    },
  ),
);

Popover.displayName = 'Popover';
