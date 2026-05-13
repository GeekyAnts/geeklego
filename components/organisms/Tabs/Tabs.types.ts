import type { HTMLAttributes, ReactNode } from 'react';
import type { TabsI18nStrings } from '../../utils/i18n/GeeklegoI18nProvider.types';

export type TabsVariant = 'line' | 'enclosed' | 'soft-rounded' | 'solid-rounded';
export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsOrientation = 'horizontal' | 'vertical';

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Currently selected tab value (controlled). */
  value?: string;
  /** Initially selected tab value (uncontrolled). */
  defaultValue?: string;
  /** Called when the selected tab changes. */
  onChange?: (value: string) => void;
  /** Visual style of the tab list. Defaults to 'line'. */
  variant?: TabsVariant;
  /** Height and typography size of tabs. Defaults to 'md'. */
  size?: TabsSize;
  /** Tab list direction. Defaults to 'horizontal'. */
  orientation?: TabsOrientation;
  /** Show loading skeleton state. Defaults to false. */
  loading?: boolean;
  /** Number of skeleton tabs to show when loading. Defaults to 3. */
  loadingCount?: number;
  /** Override i18n system strings. */
  i18nStrings?: TabsI18nStrings;
  children: ReactNode;
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface TabsTabProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Unique identifier matching a TabsPanel value. */
  value: string;
  /** Disables the tab trigger. */
  disabled?: boolean;
  /** Icon or element rendered before the label. */
  icon?: ReactNode;
  children: ReactNode;
}

export interface TabsPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Unique identifier matching a TabsTab value. */
  value: string;
  children: ReactNode;
}
