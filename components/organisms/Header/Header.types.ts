import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import type { HeaderI18nStrings } from '../../utils/i18n';

// ── Variant / size unions ─────────────────────────────────────────────────────

// Header has no size variants — height is fixed via --header-height token.

// ── Slot component props ──────────────────────────────────────────────────────

export interface HeaderBrandProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Content to render inside the brand link (logo image, text, or both). */
  children: ReactNode;
  /**
   * URL the brand link navigates to. Sanitized via `sanitizeHref()`.
   * Defaults to '#' when omitted.
   */
  href?: string;
}

export interface HeaderNavProps extends HTMLAttributes<HTMLElement> {
  /**
   * Navigation items — typically `<NavItem>` atoms or custom `<li>` elements.
   * Rendered horizontally on md+ and vertically in the mobile panel.
   */
  children: ReactNode;
}

export interface HeaderActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Action elements — typically `<Button>` atoms and/or an `<Avatar>`. */
  children: ReactNode;
}

// ── Root component props ──────────────────────────────────────────────────────

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  /** Compound slot children — Brand, Nav, Actions. */
  children: ReactNode;
  /**
   * Opt-in Schema.org WPHeader Microdata.
   * When true, adds `itemScope` and `itemType="https://schema.org/WPHeader"`
   * to the `<header>` element.
   * Defaults to false.
   */
  schema?: boolean;
  /** Override localised strings for this instance. */
  i18nStrings?: HeaderI18nStrings;
  /**
   * Signals an async data fetch is in progress. Replaces nav and actions content
   * with skeleton placeholders and sets `aria-busy="true"` on the `<header>`.
   * Defaults to `false`.
   */
  loading?: boolean;
}

// ── Composite static-property map ────────────────────────────────────────────

export interface HeaderComposite {
  Brand: React.ForwardRefExoticComponent<HeaderBrandProps & React.RefAttributes<HTMLAnchorElement>>;
  Nav: React.ForwardRefExoticComponent<HeaderNavProps & React.RefAttributes<HTMLElement>>;
  Actions: React.ForwardRefExoticComponent<HeaderActionsProps & React.RefAttributes<HTMLDivElement>>;
}
