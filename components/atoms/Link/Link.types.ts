import type { AnchorHTMLAttributes, ReactNode } from 'react';

export type LinkVariant = 'default' | 'subtle' | 'inline' | 'standalone';
export type LinkSize = 'sm' | 'md' | 'lg';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** Navigation URL. Omit when the link is disabled. */
  href?: string;
  /** Visual style. Defaults to 'default'. */
  variant?: LinkVariant;
  /**
   * Explicit font size. When omitted the link inherits size from its surrounding
   * context — the recommended approach for inline prose usage.
   */
  size?: LinkSize;
  /**
   * Renders an external link icon and sets `target="_blank"` with
   * `rel="noopener noreferrer"` automatically.
   */
  external?: boolean;
  /**
   * Removes `href`, applies muted styles, and sets `aria-disabled="true"`.
   * The anchor is removed from the tab order when disabled.
   */
  disabled?: boolean;
  children: ReactNode;
}
