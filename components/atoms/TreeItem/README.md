# TreeItem

A single node in a hierarchical tree view. Handles its own expand/collapse toggle, icon slot, label, optional badge, and loading state. Designed to be composed by `TreeView` (L2 Molecule), which manages state, keyboard navigation, and recursive rendering.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | **Required.** Unique node identifier used for ARIA and keyboard nav. |
| `label` | `string` | — | **Required.** Display text. Truncated with ellipsis when overflow. |
| `icon` | `ReactNode` | — | Icon rendered before the label (e.g. a lucide-react icon). |
| `level` | `number` | `1` | Nesting depth (1-based). Controls indentation and `aria-level`. |
| `setsize` | `number` | `1` | Total siblings in the current group. Maps to `aria-setsize`. |
| `posinset` | `number` | `1` | 1-based position in the sibling group. Maps to `aria-posinset`. |
| `isExpanded` | `boolean` | `false` | Whether the node's children are visible. |
| `isSelected` | `boolean` | `false` | Whether this node is the active selection. |
| `isDisabled` | `boolean` | `false` | Prevents interaction and applies muted styles. |
| `isLoading` | `boolean` | `false` | Shows a spinner — use while async children are fetching. |
| `hasChildren` | `boolean` | `false` | Controls visibility of the expand toggle. |
| `badge` | `string \| number` | — | Trailing count or label (folder item count, notification, etc.). |
| `tabIndex` | `0 \| -1` | `-1` | Roving tabindex — managed by parent TreeView. |
| `onToggle` | `() => void` | — | Called when the expand/collapse button is clicked. |
| `onSelect` | `() => void` | — | Called when the node row is clicked or Enter/Space pressed. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Row height and typography scale. |
| `children` | `ReactNode` | — | The expanded subtree — a `<ul role="group">` provided by TreeView. |

---

## Tokens Used

| Token | Value | Purpose |
|---|---|---|
| `--tree-item-bg` | `transparent` | Resting row background |
| `--tree-item-bg-hover` | `--color-state-hover` | Hover background |
| `--tree-item-bg-active` | `--color-state-pressed` | Active/pressed background |
| `--tree-item-bg-selected` | `--color-state-selected` | Selected background |
| `--tree-item-label-color` | `--color-text-primary` | Default label text |
| `--tree-item-label-color-selected` | `--color-action-primary` | Selected label text |
| `--tree-item-label-color-disabled` | `--color-text-disabled` | Disabled label text |
| `--tree-item-icon-color` | `--color-text-secondary` | Default icon color |
| `--tree-item-icon-color-selected` | `--color-action-primary` | Selected icon color |
| `--tree-item-expand-color` | `--color-text-tertiary` | Expand chevron default |
| `--tree-item-expand-color-hover` | `--color-text-secondary` | Expand chevron hover |
| `--tree-item-badge-bg` | `--color-bg-secondary` | Badge background |
| `--tree-item-badge-text` | `--color-text-secondary` | Badge text |
| `--tree-item-radius` | `--radius-component-sm` | Row border-radius |
| `--tree-item-indent` | `--spacing-component-lg` | Per-level indentation |
| `--tree-item-gap` | `--spacing-component-sm` | Gap between row elements |
| `--tree-item-height-sm/md/lg` | `--size-component-sm/md/lg` | Row heights |
| `--tree-item-px-sm/md/lg` | `--spacing-component-sm/md/lg` | Row horizontal padding |

---

## Sizes

| Size | Row height | Typography | Icon size |
|---|---|---|---|
| `sm` | `--size-component-sm` | `text-body-sm` | `--size-icon-sm` |
| `md` | `--size-component-md` | `text-body-sm` | `--size-icon-sm` |
| `lg` | `--size-component-lg` | `text-body-md` | `--size-icon-md` |

---

## States

| State | Visual treatment |
|---|---|
| Default | Transparent background, primary text |
| Hover | `--color-state-hover` background (two-property: bg + text color shift) |
| Active | `--color-state-pressed` background |
| Selected | `--color-state-selected` background + primary-colored text and icon |
| Loading | Spinner at trailing edge, `aria-busy` on the tree |
| Disabled | Muted text, `cursor-not-allowed`, `pointer-events-none`, `aria-disabled` |
| Expanded | Chevron rotates 90°, children group rendered |

---

## Accessibility

**Semantic element:** `<li role="treeitem">` inside `<ul role="tree">` (managed by TreeView)
**Focus target:** Inner row `<div>` with `tabIndex` — uses roving tabindex pattern
**Expand control:** `<button tabIndex={-1}>` — keyboard-accessible via tree arrow keys, not Tab

### ARIA attributes

| Attribute | When set | Value |
|---|---|---|
| `role="treeitem"` | Always | On the `<li>` |
| `aria-expanded` | `hasChildren === true` | `true` / `false` |
| `aria-selected` | Always | `true` / `false` |
| `aria-level` | Always | Nesting depth (1-based) |
| `aria-setsize` | Always | Total siblings in group |
| `aria-posinset` | Always | 1-based position in group |
| `aria-disabled` | `isDisabled === true` | `true` |
| `aria-hidden` on expand button | `hasChildren === false` | `true` |
| `aria-label` on expand button | `hasChildren === true` | `"Expand {label}"` / `"Collapse {label}"` |

### Keyboard interaction

TreeItem itself handles Enter/Space for selection. Full tree keyboard nav (`↑↓←→`, Home, End) is managed by the parent `TreeView`.

| Key | Action |
|---|---|
| `Enter` / `Space` | Select this node |

### Screen reader announcement

> "Design Files - Client, expanded, level 2, 1 of 5" — tree item ARIA attributes compose into a natural announcement.

---

## Usage

```tsx
// Standalone (rare — typically used inside TreeView)
<ul role="tree" aria-label="File browser">
  <TreeItem
    id="folder-1"
    label="Design Files - Client"
    icon={<Folder size="var(--size-icon-sm)" />}
    hasChildren
    isExpanded
    onToggle={() => setExpanded(!expanded)}
    onSelect={() => setSelected('folder-1')}
    tabIndex={0}
    level={1}
    setsize={3}
    posinset={1}
  />
</ul>

// Typical — let TreeView manage everything
<TreeView items={treeData} onSelect={(id) => console.log(id)} />
```