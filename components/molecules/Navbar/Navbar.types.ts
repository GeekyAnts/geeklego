import type { HTMLAttributes, ReactNode } from 'react';
import type { NavbarI18nStrings } from '../../utils/i18n/GeeklegoI18nProvider.types';

export type NavbarVariant = 'pills' | 'underline' | 'flush' | 'bordered';
export type NavbarSize = 'sm' | 'md' | 'lg';
export type NavbarOrientation = 'horizontal' | 'vertical';

export interface NavbarItemDef {
  /** Unique key for the item — used as React key. */
  id: string;
  /** Navigation href — rendered as an anchor element. */
  href: string;
  /** Visible label text. */
  label: string;
  /** Optional icon rendered before the label. */
  icon?: ReactNode;
  /** Whether this item is currently active / the current page. */
  isActive?: boolean;
  /** Whether this item is disabled. */
  disabled?: boolean;
  /** Optional badge slot (e.g. a count `<Badge>`). Rendered after the label. */
  badge?: ReactNode;
}

export interface NavbarProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Array of navigation items to render. */
  items: NavbarItemDef[];
  /**
   * Visual style variant.
   * - `pills`     — filled rounded-pill background on the active item (default)
   * - `underline` — 2 px bottom-edge indicator on the active item; no fill
   * - `flush`     — plain text; active item uses accent colour only
   * - `bordered`  — container has a surface background and border
   * @default 'pills'
   */
  variant?: NavbarVariant;
  /**
   * Controls the NavItem height (sm → 32 px, md → 40 px, lg → 48 px).
   * @default 'md'
   */
  size?: NavbarSize;
  /**
   * Layout direction.
   * @default 'horizontal'
   */
  orientation?: NavbarOrientation;
  /**
   * Accessible label for the `<nav>` landmark.
   * When multiple navbars appear on the same page each must have a unique label.
   * Defaults to the i18n-resolved value ("Navigation").
   */
  'aria-label'?: string;
  /**
   * Opt-in Schema.org `SiteNavigationElement` Microdata on every rendered item.
   * @default false
   */
  schema?: boolean;
  /** Per-instance i18n string overrides. */
  i18nStrings?: NavbarI18nStrings;
}
