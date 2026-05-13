import type { ReactNode, HTMLAttributes } from 'react';

export type TreeViewSize = 'sm' | 'md' | 'lg';

// ── i18n ─────────────────────────────────────────────────────────────────────

export interface TreeViewI18nStrings {
  /** Template function for the expand button aria-label. Receives the node label. Default: (label) => `Expand ${label}` */
  expandLabel?: (label: string) => string;
  /** Template function for the collapse button aria-label. Receives the node label. Default: (label) => `Collapse ${label}` */
  collapseLabel?: (label: string) => string;
}

/** A single node in the tree data structure. */
export interface TreeNode {
  /** Unique identifier for this node. Must be stable across renders. */
  id: string;
  /** Display label. Truncated with ellipsis when overflow. */
  label: string;
  /** Optional icon — any ReactNode (lucide-react icons recommended). */
  icon?: ReactNode;
  /** Child nodes. Presence of this array (even empty) determines `hasChildren`. */
  children?: TreeNode[];
  /** Prevents interaction with this node. */
  disabled?: boolean;
  /** Shows a spinner on this node while async children are loading. */
  loading?: boolean;
  /** Trailing badge count or label. */
  badge?: string | number;
}

export interface TreeViewProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  /** The tree data. Nodes with a `children` array will show an expand toggle. */
  items: TreeNode[];

  // ── Expand / collapse ────────────────────────────────────────────────────
  /** Controlled set of expanded node IDs. */
  expanded?: string[];
  /** Initially expanded IDs (uncontrolled). */
  defaultExpanded?: string[];
  /** Called when a node is expanded or collapsed. */
  onExpand?: (id: string, isExpanded: boolean) => void;

  // ── Selection ─────────────────────────────────────────────────────────────
  /** Controlled selected ID(s). Pass a string for single-select, string[] for multi-select. */
  selected?: string | string[];
  /** Initially selected ID(s) (uncontrolled). */
  defaultSelected?: string | string[];
  /** Allow multiple nodes to be selected simultaneously. Defaults to false. */
  multiSelect?: boolean;
  /** Called when selection changes. Receives the newly selected ID(s). */
  onSelect?: (id: string | string[]) => void;

  // ── Appearance ────────────────────────────────────────────────────────────
  /** Row height and typography scale applied to all nodes. Defaults to 'md'. */
  size?: TreeViewSize;

  // ── i18n ──────────────────────────────────────────────────────────────────
  /** Per-instance i18n string overrides for expand/collapse button labels. */
  i18nStrings?: TreeViewI18nStrings;

  // ── Accessibility ─────────────────────────────────────────────────────────
  /**
   * Accessible label for the tree — required when there is no visible heading
   * adjacent to the tree. Pass either aria-label or aria-labelledby.
   */
  'aria-label'?: string;
  /** ID of an external element that labels the tree. */
  'aria-labelledby'?: string;
}
