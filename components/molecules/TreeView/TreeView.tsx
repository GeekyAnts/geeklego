"use client";

import {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Folder, FolderOpen, File } from 'lucide-react';
import { TreeItem } from '../../atoms/TreeItem/TreeItem';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type { TreeViewProps, TreeNode, TreeViewSize } from './TreeView.types';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Flattens the tree into visible node IDs in document (depth-first) order. */
function flattenVisible(nodes: TreeNode[], expandedIds: Set<string>): string[] {
  const ids: string[] = [];
  const walk = (list: TreeNode[]) => {
    for (const node of list) {
      ids.push(node.id);
      if (node.children?.length && expandedIds.has(node.id)) {
        walk(node.children);
      }
    }
  };
  walk(nodes);
  return ids;
}

/** Finds a node and its parent list by ID, depth-first. */
function findNode(
  nodes: TreeNode[],
  id: string,
): { node: TreeNode; siblings: TreeNode[] } | null {
  for (const node of nodes) {
    if (node.id === id) return { node, siblings: nodes };
    if (node.children) {
      const hit = findNode(node.children, id);
      if (hit) return hit;
    }
  }
  return null;
}

/**
 * Returns the parent node of a given ID.
 * - Found at root level → `null` (no parent)
 * - Found in a subtree  → the parent `TreeNode`
 * - Not found anywhere  → `undefined` (use as sentinel)
 */
function findParent(
  nodes: TreeNode[],
  id: string,
  parent: TreeNode | null = null,
): TreeNode | null | undefined {
  for (const node of nodes) {
    if (node.id === id) return parent;
    if (node.children) {
      const hit = findParent(node.children, id, node);
      if (hit !== undefined) return hit;
    }
  }
  return undefined;
}

// ── Default icon helper ───────────────────────────────────────────────────────

function defaultIcon(node: TreeNode, isExpanded: boolean, size: TreeViewSize): ReactNode {
  const sz = size === 'lg' ? 'var(--size-icon-md)' : 'var(--size-icon-sm)';
  if (node.children !== undefined) {
    return isExpanded ? <FolderOpen size={sz} /> : <Folder size={sz} />;
  }
  return <File size={sz} />;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const TreeView = memo(function TreeView({
  items,
  expanded: controlledExpanded,
  defaultExpanded,
  onExpand,
  selected: controlledSelected,
  defaultSelected,
  multiSelect = false,
  onSelect,
  size = 'md',
  i18nStrings,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...rest
}: TreeViewProps) {
  const i18n = useComponentI18n('treeView', i18nStrings);
  // ── Expand state ────────────────────────────────────────────────────────
  const [internalExpanded, setInternalExpanded] = useState<Set<string>>(
    () => new Set(defaultExpanded ?? []),
  );
  const isControlledExpand = controlledExpanded !== undefined;
  const expandedIds: Set<string> = isControlledExpand
    ? new Set(controlledExpanded)
    : internalExpanded;

  const handleToggle = useCallback(
    (id: string) => {
      const next = !expandedIds.has(id);
      if (!isControlledExpand) {
        setInternalExpanded((prev) => {
          const s = new Set(prev);
          next ? s.add(id) : s.delete(id);
          return s;
        });
      }
      onExpand?.(id, next);
    },
    [expandedIds, isControlledExpand, onExpand],
  );

  // ── Selection state ─────────────────────────────────────────────────────
  const [internalSelected, setInternalSelected] = useState<Set<string>>(() => {
    if (!defaultSelected) return new Set();
    return new Set(Array.isArray(defaultSelected) ? defaultSelected : [defaultSelected]);
  });
  const isControlledSelect = controlledSelected !== undefined;
  const selectedIds: Set<string> = isControlledSelect
    ? new Set(Array.isArray(controlledSelected) ? controlledSelected : [controlledSelected])
    : internalSelected;

  const handleSelect = useCallback(
    (id: string) => {
      let next: Set<string>;
      if (multiSelect) {
        next = new Set(selectedIds);
        next.has(id) ? next.delete(id) : next.add(id);
      } else {
        next = new Set([id]);
      }
      if (!isControlledSelect) setInternalSelected(next);
      const val = multiSelect ? [...next] : [...next][0];
      onSelect?.(val);
    },
    [multiSelect, selectedIds, isControlledSelect, onSelect],
  );

  // ── Roving focus ────────────────────────────────────────────────────────
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLUListElement>(null);

  const flatIds = useMemo(() => flattenVisible(items, expandedIds), [items, expandedIds]);
  // The item with tabIndex={0} — first item initially, then the last focused item
  const activeId = focusedId && flatIds.includes(focusedId) ? focusedId : (flatIds[0] ?? null);

  // ── Keyboard navigation ─────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLUListElement>) => {
      const focusedEl = document.activeElement as HTMLElement | null;
      const itemId = focusedEl?.dataset.treeItemId ?? null;
      if (!itemId) return;

      const idx = flatIds.indexOf(itemId);
      if (idx === -1) return;

      const focusItem = (id: string) => {
        const el = containerRef.current?.querySelector<HTMLElement>(
          `[data-tree-item-id="${id}"]`,
        );
        el?.focus();
        setFocusedId(id);
      };

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const next = flatIds[idx + 1];
          if (next) focusItem(next);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prev = flatIds[idx - 1];
          if (prev) focusItem(prev);
          break;
        }
        case 'Home': {
          e.preventDefault();
          const first = flatIds[0];
          if (first) focusItem(first);
          break;
        }
        case 'End': {
          e.preventDefault();
          const last = flatIds[flatIds.length - 1];
          if (last) focusItem(last);
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          const hit = findNode(items, itemId);
          if (!hit) break;
          if (hit.node.children?.length) {
            if (!expandedIds.has(itemId)) {
              handleToggle(itemId);
            } else {
              // Already expanded — move focus to first child
              const firstChild = flatIds[idx + 1];
              if (firstChild) focusItem(firstChild);
            }
          }
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          if (expandedIds.has(itemId)) {
            handleToggle(itemId);
          } else {
            // Move focus to parent
            const parent = findParent(items, itemId);
            if (parent) focusItem(parent.id);
          }
          break;
        }
        default:
          break;
      }
    },
    [flatIds, items, expandedIds, handleToggle],
  );

  // ── Recursive renderer ──────────────────────────────────────────────────
  const treeItemI18n = useMemo(
    () => ({
      expandLabel: i18n.expandLabel,
      collapseLabel: i18n.collapseLabel,
    }),
    [i18n.expandLabel, i18n.collapseLabel],
  );

  const renderNode = useCallback(
    (node: TreeNode, siblings: TreeNode[], index: number, level: number): ReactNode => {
      const isExpanded = expandedIds.has(node.id);
      const isSelected = selectedIds.has(node.id);
      const hasChildren = node.children !== undefined && node.children.length > 0;
      const icon = node.icon ?? defaultIcon(node, isExpanded, size);

      return (
        <TreeItem
          key={node.id}
          id={node.id}
          label={node.label}
          icon={icon}
          level={level}
          setsize={siblings.length}
          posinset={index + 1}
          isExpanded={isExpanded}
          isSelected={isSelected}
          isDisabled={node.disabled}
          isLoading={node.loading}
          hasChildren={hasChildren}
          badge={node.badge}
          tabIndex={activeId === node.id ? 0 : -1}
          onToggle={() => handleToggle(node.id)}
          onSelect={() => handleSelect(node.id)}
          onFocus={() => setFocusedId(node.id)}
          size={size}
          i18nStrings={treeItemI18n}
        >
          {hasChildren &&
            node.children!.map((child, i) => renderNode(child, node.children!, i, level + 1))}
        </TreeItem>
      );
    },
    [expandedIds, selectedIds, activeId, size, handleToggle, handleSelect, treeItemI18n],
  );

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <ul
      ref={containerRef}
      role="tree"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-multiselectable={multiSelect || undefined}
      className={[
        'list-none p-0 m-0',
        'bg-[var(--tree-view-bg)]',
        'min-w-[var(--tree-view-min-width)]',
        'flex flex-col gap-[var(--tree-view-gap)]',
        'outline-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {items.map((node, i) => renderNode(node, items, i, 1))}
    </ul>
  );
});

TreeView.displayName = 'TreeView';
