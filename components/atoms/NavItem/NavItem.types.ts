import type { HTMLAttributes, ReactNode } from 'react';

export interface NavItemProps extends HTMLAttributes<HTMLLIElement> {
  /** Icon element displayed before the label. */
  icon?: ReactNode;
  /** Text label for the nav item. Omit (or pass `undefined`) for icon-only/collapsed mode. */
  label?: string;
  /** Whether this item is currently active/selected. */
  isActive?: boolean;
  /** Whether this item is expandable (has children). */
  isExpandable?: boolean;
  /** Whether this expandable item is currently expanded. Controlled. */
  isExpanded?: boolean;
  /** Callback when the item is clicked. */
  onToggle?: () => void;
  /** Sub-items rendered when expanded. */
  children?: ReactNode;
  /** Whether the item is disabled. */
  disabled?: boolean;
  /** Href for navigation — renders as anchor if provided. */
  href?: string;
  /** Opt-in Schema.org SiteNavigationElement Microdata on link items. */
  schema?: boolean;
  /**
   * Override tabIndex on the inner focusable element (`<a>` or `<button>`).
   * Used by `useRovingTabindex` in parent containers (e.g. Sidebar) to manage
   * focus with arrow keys. When omitted the browser default applies.
   */
  innerTabIndex?: number;
  /**
   * Badge slot — displays a count or status indicator to the right of the label.
   * Pass any ReactNode (e.g. `<Badge>3</Badge>`). Hidden when the sidebar is
   * collapsed (parent passes `undefined` in that mode).
   */
  badge?: ReactNode;
  /**
   * Hover-reveal action slot — displays a secondary action (e.g. a "+" Button)
   * that fades in on `group-hover`. `onClick` on the slot wrapper calls
   * `stopPropagation` so the action does not trigger the item's own navigation.
   * Hidden when the sidebar is collapsed (parent passes `undefined`).
   */
  action?: ReactNode;
}
