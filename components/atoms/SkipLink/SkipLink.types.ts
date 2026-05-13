import type { AnchorHTMLAttributes, ReactNode } from 'react';

export type SkipLinkSize = 'sm' | 'md';

export interface SkipLinkI18nStrings {
  /** Default label text. Defaults to 'Skip to main content' */
  label?: string;
}

export interface SkipLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Fragment href pointing to the landmark to skip to.
   * Must match the `id` of a target element on the page (e.g. `"#main-content"`).
   * Required — a skip link without a destination does not function.
   */
  href: string;

  /**
   * Visual size. Controls height, padding, and typography scale.
   * Defaults to `'md'`.
   */
  size?: SkipLinkSize;

  /**
   * When `true`, overrides the visually-hidden state and forces the link to be
   * visible regardless of focus. Useful for Storybook previews, testing, and
   * accessibility audits. Never set to `true` in production.
   * Defaults to `false`.
   */
  forceVisible?: boolean;

  /**
   * The visible label text of the skip link.
   * Defaults to i18n resolved value or `'Skip to main content'`. Override for multi-skip-link patterns
   * (e.g. `'Skip to navigation'`, `'Skip to footer'`).
   */
  children?: ReactNode;

  /**
   * Internationalization strings for system labels. Overrides defaults via `useComponentI18n()`.
   */
  i18nStrings?: SkipLinkI18nStrings;
}
