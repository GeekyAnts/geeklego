import type { HTMLAttributes, ReactNode } from 'react';
import type { BreadcrumbItemSize } from '../../atoms/BreadcrumbItem/BreadcrumbItem.types';
import type { BreadcrumbI18nStrings } from '../../utils/i18n';

export interface BreadcrumbItemData {
  /** The visible label text. */
  label: string;
  /** URL this item links to. Omit for the current page or non-navigable items. */
  href?: string;
  /** Explicitly marks as current page. Auto-applied to the last item in the array. */
  current?: boolean;
  /** Disabled state. Non-interactive, visually muted. */
  disabled?: boolean;
  /** Optional icon before the label. Use lucide-react icon nodes. */
  icon?: ReactNode;
}

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Ordered list of breadcrumb items. The last item is automatically treated as current. */
  items: BreadcrumbItemData[];
  /** Custom separator element between items. Defaults to a ChevronRight icon. */
  separator?: ReactNode;
  /** Text size applied to all items. Defaults to 'md'. */
  size?: BreadcrumbItemSize;
  /** Opt-in Schema.org BreadcrumbList Microdata on the nav element and ListItem on each item. */
  schema?: boolean;
  /** Override localised strings for this instance. Context strings apply when omitted. */
  i18nStrings?: BreadcrumbI18nStrings;
}
