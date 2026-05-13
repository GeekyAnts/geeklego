import type { LiHTMLAttributes, ReactNode } from 'react';

export type TreeItemSize = 'sm' | 'md' | 'lg';

export interface TreeItemI18nStrings {
  /** Template function for aria-label when expanding. Receives the item label. Default: (label) => `Expand ${label}` */
  expandLabel?: (label: string) => string;
  /** Template function for aria-label when collapsing. Receives the item label. Default: (label) => `Collapse ${label}` */
  collapseLabel?: (label: string) => string;
}

export interface TreeItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'onSelect'> {
  /** Unique identifier for this node — used for ARIA and keyboard navigation. */
  id: string;
  /** Display text for the node. */
  label: string;
  /** Icon rendered before the label. Any ReactNode (e.g. a lucide-react icon). */
  icon?: ReactNode;
  /** Nesting depth, 1-based. Used for aria-level and indentation. Defaults to 1. */
  level?: number;
  /** Total number of siblings in the current group. Used for aria-setsize. */
  setsize?: number;
  /** 1-based position within the current sibling group. Used for aria-posinset. */
  posinset?: number;
  /** Whether this node's children are currently visible. */
  isExpanded?: boolean;
  /** Whether this node is the active/selected item. */
  isSelected?: boolean;
  /** Whether this node is non-interactive. */
  isDisabled?: boolean;
  /** Shows a spinner — use while async children are loading. */
  isLoading?: boolean;
  /** Whether this node has children (shows the expand toggle). */
  hasChildren?: boolean;
  /** Optional badge count or label rendered at the trailing edge. */
  badge?: string | number;
  /**
   * Roving tabindex value — managed by the parent TreeView.
   * Exactly one item in the tree has tabIndex={0}; all others are -1.
   */
  tabIndex?: 0 | -1;
  /** Called when the expand/collapse toggle is clicked. */
  onToggle?: () => void;
  /** Called when this node is selected (click or Enter/Space). */
  onSelect?: () => void;
  /** Row height and typography scale. Defaults to 'md'. */
  size?: TreeItemSize;
  /** Internationalization strings for system labels. Overrides defaults via `useComponentI18n()`. */
  i18nStrings?: TreeItemI18nStrings;
  /** The expanded subtree — a <ul role="group"> rendered by TreeView. */
  children?: ReactNode;
}
