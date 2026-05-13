import type { HTMLAttributes, ReactNode } from 'react';

export type QuoteVariant = 'default' | 'pullquote' | 'minimal' | 'card';
export type QuoteSize    = 'sm' | 'md' | 'lg';

export interface QuoteProps extends HTMLAttributes<HTMLElement> {
  /** Visual style variant. Defaults to 'default'. */
  variant?: QuoteVariant;
  /** Controls text scale and internal spacing. Defaults to 'md'. */
  size?: QuoteSize;
  /** The quoted text. Required. */
  children: ReactNode;
  /** Name of the person being quoted — rendered before the source. */
  attribution?: string;
  /** Title of the work being cited — wrapped in a semantic <cite> element. */
  source?: string;
  /** URL for the cited source — makes the source text a link. */
  sourceUrl?: string;
  /** URL of the quoted document, set on the <blockquote cite> attribute for assistive technology. */
  cite?: string;
}
