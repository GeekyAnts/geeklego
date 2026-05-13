import type { HTMLAttributes, ReactNode } from 'react';

// ── Size ──────────────────────────────────────────────────────────────────────

export type FooterSize = 'sm' | 'md' | 'lg';

// ── i18n ─────────────────────────────────────────────────────────────────────

export interface FooterI18nStrings {
  /** aria-label for the `<footer>` landmark. Default: "Footer" */
  footerLabel?: string;
  /** Default aria-label for each Footer.Nav `<nav>` landmark when `navAriaLabel` is not provided. Default: "Footer navigation" */
  navLabel?: string;
}

// ── Slot props ────────────────────────────────────────────────────────────────

export interface FooterBrandProps extends HTMLAttributes<HTMLDivElement> {
  /** URL for the brand name/logo link. Passed through `sanitizeHref`. Default: '#' */
  href?: string;
  /** Optional tagline displayed below the brand content. */
  tagline?: string;
  /** Brand name, logo, or any ReactNode to render as the clickable link content. */
  children: ReactNode;
}

export interface FooterNavProps extends HTMLAttributes<HTMLElement> {
  /** Column heading text (rendered as a heading element). */
  heading: string;
  /** HTML heading level for the column heading. Default: 'h3'. */
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5';
  /**
   * Custom aria-label for the `<nav>` landmark.
   * When omitted, the i18n `navLabel` default ("Footer navigation") is used.
   * Provide a unique label when multiple Footer.Nav columns are rendered.
   */
  navAriaLabel?: string;
  /** Link items to render inside the nav list. Each child is automatically wrapped in `<li>`. */
  children: ReactNode;
}

export interface FooterLegalProps extends HTMLAttributes<HTMLDivElement> {
  /** Copyright text, legal links, or any inline content. */
  children: ReactNode;
}

// ── Composite type (for static property attachment) ───────────────────────────

export interface FooterComposite {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Brand: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Nav: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Legal: any;
}

// ── Root props ────────────────────────────────────────────────────────────────

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /**
   * Padding and vertical rhythm scale.
   * sm = compact, md = standard, lg = spacious.
   * Default: 'md'.
   */
  size?: FooterSize;
  /**
   * Enable Schema.org WPFooter Microdata.
   * When true, adds `itemScope` and `itemType="https://schema.org/WPFooter"` to `<footer>`.
   * Default: false.
   */
  schema?: boolean;
  /**
   * Show a loading skeleton in place of children content.
   * Default: false.
   */
  loading?: boolean;
  /** Per-instance i18n string overrides. */
  i18nStrings?: FooterI18nStrings;
  /** Footer.Brand, one or more Footer.Nav columns, and optionally Footer.Legal. */
  children?: ReactNode;
}
