import type { LiHTMLAttributes, ReactNode } from 'react';

export type BreadcrumbItemSize = 'sm' | 'md' | 'lg';

export interface BreadcrumbItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'children'> {
  /** URL this item links to. When provided (and not current/disabled), renders as an anchor. */
  href?: string;
  /** Marks as the current page. Renders non-interactive text with aria-current="page". */
  current?: boolean;
  /** Disabled state. Non-interactive and visually muted. */
  disabled?: boolean;
  /** Text size. Defaults to 'md'. */
  size?: BreadcrumbItemSize;
  /** Optional icon displayed before the label. Pass a lucide-react icon node. */
  leftIcon?: ReactNode;
  /** The visible label text. */
  children: ReactNode;
  /** Opt-in Schema.org ListItem Microdata. Passed from parent Breadcrumb. */
  schema?: boolean;
  /** Position in the breadcrumb list (1-based). Passed from parent Breadcrumb when schema is true. */
  schemaPosition?: number;
}
