"use client"
import { forwardRef, memo, useId, useMemo } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { NavItemProps } from './NavItem.types';
import { getDisclosureProps } from '../../utils/accessibility';
import { sanitizeHref } from '../../utils/security/sanitize';

const indicatorClasses = [
  'shrink-0 ms-auto',
  'w-[var(--size-icon-sm)] h-[var(--size-icon-sm)]',
  'text-[var(--navitem-indicator-color)]',
  'transition-default',
].join(' ');

export const NavItem = memo(forwardRef<HTMLLIElement, NavItemProps>(
  (
    {
      icon,
      label,
      isActive = false,
      isExpandable = false,
      isExpanded = false,
      onToggle,
      children,
      disabled = false,
      href,
      schema,
      className,
      innerTabIndex,
      badge,
      action,
      ...rest
    },
    ref,
  ) => {
    const isLink = !!href && !isExpandable;
    const safeHref = useMemo(() => sanitizeHref(href), [href]);

    /* ── Trigger classes ──────────────────────────────────────────────────── */
    const iconOnly = !label;

    const triggerClasses = useMemo(() => [
      // group — enables group-hover for the action slot opacity transition
      'group',
      // Layout
      'flex items-center w-full text-start',
      iconOnly ? 'justify-center' : 'gap-[var(--navitem-gap)]',
      // Sizing
      'h-[var(--navitem-height)] px-[var(--navitem-padding-x)]',
      // Radius
      'rounded-[var(--navitem-radius)]',
      // Typography
      'text-body-sm',
      // Transition
      'transition-default',
      // Focus
      'focus-visible:outline-none focus-visible:focus-ring',
      // Background
      isActive
        ? 'bg-[var(--navitem-bg-active)]'
        : 'bg-[var(--navitem-bg)] hover:bg-[var(--navitem-bg-hover)]',
      // Text color
      isActive
        ? 'text-[var(--navitem-text-active)]'
        : 'text-[var(--navitem-text)]',
      // Disabled
      disabled
        ? 'text-[var(--navitem-text-disabled)] cursor-not-allowed pointer-events-none'
        : 'cursor-pointer',
    ].filter(Boolean).join(' '), [iconOnly, isActive, disabled]);

    /* ── Icon classes ─────────────────────────────────────────────────────── */
    const iconClasses = useMemo(() => [
      'shrink-0 inline-flex items-center justify-center',
      'w-[var(--size-icon-sm)] h-[var(--size-icon-sm)]',
      'transition-default',
      isActive
        ? 'text-[var(--navitem-icon-color-active)]'
        : 'text-[var(--navitem-icon-color)]',
    ].filter(Boolean).join(' '), [isActive]);

    const IndicatorIcon = isExpandable
      ? isExpanded
        ? ChevronDown
        : ChevronRight
      : null;

    const baseId = useId();
    const subMenuId = `${baseId}-submenu`;

    /* ── Disclosure ARIA props (trigger + panel) ──────────────────────── */
    const [disclosureTrigger, disclosurePanel] = isExpandable
      ? getDisclosureProps(isExpanded, subMenuId)
      : [undefined, undefined];

    /* ── Shared inner content ─────────────────────────────────────────────── */
    const innerContent = (
      <>
        {icon && (
          <span className={iconClasses} aria-hidden="true">
            {icon}
          </span>
        )}
        {label && (
          <span className="truncate-label content-flex" {...(schema && isLink && { itemProp: 'name' })}>
            {label}
          </span>
        )}
        {badge && (
          <span className="shrink-0" aria-hidden="true">
            {badge}
          </span>
        )}
        {action && (
          <span
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-default"
            onClick={(e) => e.stopPropagation()}
            aria-hidden="true"
          >
            {action}
          </span>
        )}
        {IndicatorIcon && (
          <IndicatorIcon className={indicatorClasses} aria-hidden="true" />
        )}
      </>
    );

    /* ── Sub-items (expandable) ───────────────────────────────────────────── */
    const subItems = isExpandable && children ? (
      <div
        className={[
          'grid transition-[grid-template-rows] duration-[var(--duration-enter)] ease-[var(--ease-default)]',
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        ].filter(Boolean).join(' ')}
      >
        <div className="overflow-hidden">
          <ul
            className={[
              'flex flex-col gap-[var(--spacing-component-xs)]',
              'ms-[var(--navitem-subitem-indent)]',
              'border-s border-[var(--navitem-subitem-border)]',
              'ps-[var(--navitem-gap)]',
              'py-[var(--spacing-component-xs)]',
            ].filter(Boolean).join(' ')}
            {...(disclosurePanel ?? {})}
          >
            {children}
          </ul>
        </div>
      </div>
    ) : null;

    /* ── Wrapper classes ──────────────────────────────────────────────────── */
    const wrapperClasses = ['list-none', className].filter(Boolean).join(' ');

    return (
      <li
        ref={ref}
        className={wrapperClasses}
        {...(schema && isLink && {
          itemScope: true,
          itemType: 'https://schema.org/SiteNavigationElement',
        })}
        {...rest}
      >
        {isLink ? (
          <a
            href={safeHref}
            className={triggerClasses}
            aria-current={isActive ? 'page' : undefined}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : innerTabIndex}
            {...(schema && { itemProp: 'url' })}
          >
            {innerContent}
          </a>
        ) : (
          <button
            type="button"
            className={triggerClasses}
            onClick={disabled ? undefined : onToggle}
            disabled={disabled}
            aria-disabled={disabled || undefined}
            aria-current={isActive ? 'page' : undefined}
            {...(disclosureTrigger ?? {})}
            tabIndex={innerTabIndex}
          >
            {innerContent}
          </button>
        )}
        {subItems}
      </li>
    );
  },
));
NavItem.displayName = 'NavItem';
