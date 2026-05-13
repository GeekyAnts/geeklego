"use client";

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import React from 'react';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import { useRovingTabindex } from '../../utils/keyboard/useRovingTabindex';
import { useEscapeDismiss } from '../../utils/keyboard/useEscapeDismiss';
import { useClickOutside } from '../../utils/keyboard/useClickOutside';
import { getSafeExternalLinkProps } from '../../utils/security/sanitize';
import { isElementLike } from '../../utils/accessibility/aria-helpers';
import type {
  DropdownMenuProps,
  DropdownMenuItemDef,
  DropdownMenuItemType,
} from './DropdownMenu.types';

// ── Panel placement — logical props for RTL safety ───────────────────────────
const placementClasses: Record<string, string> = {
  'bottom-start': 'top-full start-0 mt-[var(--dropdown-panel-offset)]',
  'bottom-end':   'top-full end-0 mt-[var(--dropdown-panel-offset)]',
  'top-start':    'bottom-full start-0 mb-[var(--dropdown-panel-offset)]',
  'top-end':      'bottom-full end-0 mb-[var(--dropdown-panel-offset)]',
};

// ── Flatten items → linear list of focusable items for roving tabindex ───────
function flattenItems(items: DropdownMenuItemType[]): DropdownMenuItemDef[] {
  const result: DropdownMenuItemDef[] = [];
  for (const item of items) {
    if (item.type === 'separator') continue;
    if (item.type === 'group') {
      result.push(...item.items);
    } else {
      result.push(item);
    }
  }
  return result;
}

// Build a stable id → flat index map so renderItem can look up indices.
function buildIndexMap(items: DropdownMenuItemType[]): Map<string, number> {
  const map = new Map<string, number>();
  let idx = 0;
  for (const item of items) {
    if (item.type === 'separator') continue;
    if (item.type === 'group') {
      for (const gi of item.items) map.set(gi.id, idx++);
    } else {
      map.set(item.id, idx++);
    }
  }
  return map;
}

// ── Merge forwarded ref + internal ref onto the same element ──────────────────
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

// ── DropdownMenu ──────────────────────────────────────────────────────────────

export const DropdownMenu = memo(
  forwardRef<HTMLDivElement, DropdownMenuProps>(
    (
      {
        trigger,
        items,
        placement = 'bottom-start',
        open: controlledOpen,
        onOpenChange,
        menuLabel,
        i18nStrings,
        className,
        ...rest
      },
      ref,
    ) => {
      // ── i18n ────────────────────────────────────────────────────────────────
      const i18n = useComponentI18n('dropdownMenu', i18nStrings);

      // ── IDs ─────────────────────────────────────────────────────────────────
      const baseId = useId();
      const triggerId = `${baseId}-trigger`;
      const panelId   = `${baseId}-panel`;

      // ── Open state (uncontrolled / controlled) ───────────────────────────────
      const isControlled = controlledOpen !== undefined;
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

      // ── Flat items + index map ──────────────────────────────────────────────
      const flatItems = useMemo(() => flattenItems(items), [items]);
      const indexMap  = useMemo(() => buildIndexMap(items),  [items]);

      // ── Roving tabindex ─────────────────────────────────────────────────────
      const [activeIndex, setActiveIndex] = useState(0);
      const itemRefs       = useRef<Array<HTMLElement | null>>([]);
      const containerRef   = useRef<HTMLDivElement>(null);
      const triggerWrapRef = useRef<HTMLSpanElement>(null);

      const { handleKeyDown: rovingKeyDown, getItemProps } = useRovingTabindex({
        itemCount: flatItems.length,
        activeIndex,
        orientation: 'vertical',
        loop: true,
        isItemDisabled: (i) => !!flatItems[i]?.disabled,
        onActiveIndexChange: (i) => {
          setActiveIndex(i);
          itemRefs.current[i]?.focus();
        },
      });

      // ── Focus management: first item on open, trigger on close ───────────────
      useEffect(() => {
        if (isOpen) {
          const first = flatItems.findIndex((i) => !i.disabled);
          const idx   = first >= 0 ? first : 0;
          setActiveIndex(idx);
          requestAnimationFrame(() => itemRefs.current[idx]?.focus());
        } else {
          const focusable = triggerWrapRef.current?.querySelector<HTMLElement>(
            'button, [role="button"], a[href]',
          );
          focusable?.focus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isOpen]);

      // ── Keyboard dismiss + click outside ─────────────────────────────────────
      useEscapeDismiss({ active: isOpen, onDismiss: close });
      useClickOutside({ active: isOpen, containerRef, onClickOutside: close });

      // Handle Tab to close and let natural focus advance
      const handlePanelKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
          if (e.key === 'Tab') { close(); return; }
          rovingKeyDown(e);
        },
        [rovingKeyDown, close],
      );

      // ── Trigger — inject ARIA props via cloneElement ──────────────────────────
      const triggerEl = useMemo(() => {
        const aria = {
          id:               triggerId,
          'aria-haspopup':  'menu' as const,
          'aria-expanded':  isOpen,
          'aria-controls':  panelId,
        };

        if (isElementLike(trigger)) {
          const existing = (trigger as React.ReactElement<Record<string, unknown>>).props;
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
            aria-haspopup="menu"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={toggle}
            className="focus-visible:outline-none focus-visible:focus-ring"
          >
            {trigger}
          </button>
        );
      }, [trigger, triggerId, isOpen, panelId, toggle]);

      // ── Classes ─────────────────────────────────────────────────────────────
      const rootClasses = useMemo(
        () => ['relative inline-block', className].filter(Boolean).join(' '),
        [className],
      );

      const panelClasses = useMemo(
        () => [
          'absolute z-[var(--dropdown-panel-z)]',
          placementClasses[placement] ?? placementClasses['bottom-start'],
          'min-w-[var(--dropdown-panel-min-width)] w-max',
          'bg-[var(--dropdown-panel-bg)]',
          'border border-[var(--dropdown-panel-border)]',
          'rounded-[var(--dropdown-panel-radius)]',
          'shadow-[var(--dropdown-panel-shadow)]',
          'py-[var(--dropdown-panel-padding-y)]',
          'transition-default',
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none invisible',
        ].join(' '),
        [placement, isOpen],
      );

      // ── Render a single menu item (action or link) ───────────────────────────
      // Defined inline (not useCallback) since getItemProps changes on each arrow
      // key press and must produce the updated tabIndex on every render.
      const renderItem = (item: DropdownMenuItemDef) => {
        const flatIdx    = indexMap.get(item.id) ?? 0;
        const { tabIndex } = getItemProps(flatIdx);
        const isLink       = !!item.href;
        const isDisabled   = !!item.disabled;
        const isDestructive = !!item.destructive;

        const itemClasses = [
          'w-full flex items-center gap-[var(--dropdown-item-gap)] text-left',
          'min-h-[var(--dropdown-item-height)]',
          'px-[var(--dropdown-item-padding-x)]',
          'text-body-sm transition-default',
          'rounded-[var(--dropdown-item-radius)]',
          'focus-visible:outline-none focus-visible:focus-ring',
          'perf-contain-content',
          isDisabled
            ? [
                'text-[var(--dropdown-item-text-disabled)]',
                'bg-[var(--dropdown-item-bg-disabled)]',
                'cursor-not-allowed pointer-events-none',
              ].join(' ')
            : isDestructive
              ? [
                  'text-[var(--dropdown-item-text-destructive)]',
                  'bg-[var(--dropdown-item-bg)]',
                  'hover:bg-[var(--dropdown-item-bg-destructive-hover)]',
                  'hover:text-[var(--dropdown-item-text-destructive-hover)]',
                  'active:bg-[var(--dropdown-item-bg-destructive-hover)]',
                  'cursor-pointer select-none',
                ].join(' ')
              : [
                  'text-[var(--dropdown-item-text)]',
                  'bg-[var(--dropdown-item-bg)]',
                  'hover:bg-[var(--dropdown-item-bg-hover)]',
                  'active:bg-[var(--dropdown-item-bg-active)]',
                  'cursor-pointer select-none',
                ].join(' '),
        ].join(' ');

        const iconClasses = `shrink-0 inline-flex ${
          isDestructive
            ? 'text-[var(--dropdown-item-icon-color-destructive)]'
            : 'text-[var(--dropdown-item-icon-color)]'
        }`;

        const handleClick = () => {
          if (isDisabled) return;
          item.onClick?.();
          // Close after action (not after link navigation — browser handles that)
          if (!isLink) close();
        };

        const content = (
          <>
            {item.icon && (
              <span className={iconClasses} aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span className="content-flex truncate-label">{item.label}</span>
            {item.shortcut && (
              <span
                className="ms-auto shrink-0 text-caption-sm text-[var(--dropdown-item-shortcut-text)]"
                aria-hidden="true"
              >
                {item.shortcut}
              </span>
            )}
          </>
        );

        if (isLink) {
          const safeProps = getSafeExternalLinkProps(item.href, item.target, item.rel);
          return (
            <li key={item.id} role="presentation">
              <a
                ref={(el) => { itemRefs.current[flatIdx] = el; }}
                {...safeProps}
                role="menuitem"
                tabIndex={isDisabled ? -1 : tabIndex}
                aria-disabled={isDisabled || undefined}
                className={itemClasses}
                onClick={handleClick}
              >
                {content}
              </a>
            </li>
          );
        }

        return (
          <li key={item.id} role="presentation">
            <button
              ref={(el) => { itemRefs.current[flatIdx] = el; }}
              type="button"
              role="menuitem"
              tabIndex={isDisabled ? -1 : tabIndex}
              disabled={isDisabled}
              aria-disabled={isDisabled || undefined}
              className={itemClasses}
              onClick={handleClick}
            >
              {content}
            </button>
          </li>
        );
      };

      // ── Render all items (including separators and groups) ───────────────────
      const renderedItems = items.map((item) => {
        if (item.type === 'separator') {
          return (
            <li key={item.id} role="presentation">
              <hr
                role="separator"
                className="border-0 border-t border-[var(--dropdown-separator-color)] my-[var(--dropdown-separator-margin)]"
              />
            </li>
          );
        }

        if (item.type === 'group') {
          return (
            <li key={item.id} role="presentation">
              {/* Group label is decorative — `aria-label` on the sub-list is SR's cue */}
              <div
                className="px-[var(--dropdown-group-label-padding-x)] py-[var(--dropdown-group-label-padding-y)] text-caption-sm text-[var(--dropdown-group-label-text)] uppercase tracking-wide"
                aria-hidden="true"
              >
                {item.label}
              </div>
              <ul role="group" aria-label={item.label}>
                {item.items.map((gi) => renderItem(gi))}
              </ul>
            </li>
          );
        }

        // TypeScript's control flow narrows `item` to DropdownMenuItemDef here
        // (both 'separator' and 'group' have been handled above).
        return renderItem(item as DropdownMenuItemDef);
      });

      // ── Render ───────────────────────────────────────────────────────────────
      return (
        <div
          ref={mergeRefs(ref, containerRef)}
          className={rootClasses}
          {...rest}
        >
          {/* Trigger wrapper — holds ref used to return focus on close */}
          <span ref={triggerWrapRef} className="inline-flex">
            {triggerEl}
          </span>

          {/* Menu panel */}
          <ul
            id={panelId}
            role="menu"
            aria-label={menuLabel ?? i18n.defaultMenuLabel ?? undefined}
            aria-labelledby={menuLabel ? undefined : triggerId}
            aria-orientation="vertical"
            aria-hidden={!isOpen}
            onKeyDown={handlePanelKeyDown}
            className={panelClasses}
          >
            {renderedItems}
          </ul>
        </div>
      );
    },
  ),
);

DropdownMenu.displayName = 'DropdownMenu';
