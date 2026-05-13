# TreeView

A hierarchical, expandable/collapsible navigation tree. Converts a `TreeNode[]` data structure into a fully accessible WAI-ARIA tree widget with keyboard navigation, single or multi-select, and automatic icon defaults.

**Use for:** file explorers, folder browsers, nested navigation, org charts, JSON viewers, settings panels with nested sections.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `TreeNode[]` | — | **Required.** The tree data. Nodes with `children` array show an expand toggle. |
| `expanded` | `string[]` | — | Controlled set of expanded node IDs. |
| `defaultExpanded` | `string[]` | `[]` | Initially expanded IDs (uncontrolled). |
| `onExpand` | `(id, isExpanded) => void` | — | Called on each expand/collapse. |
| `selected` | `string \| string[]` | — | Controlled selected ID(s). |
| `defaultSelected` | `string \| string[]` | — | Initially selected ID(s) (uncontrolled). |
| `multiSelect` | `boolean` | `false` | Allow multiple simultaneous selections. |
| `onSelect` | `(id: string \| string[]) => void` | — | Called when selection changes. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Row height and typography for all nodes. |
| `aria-label` | `string` | — | Required when no visible heading labels the tree. |
| `aria-labelledby` | `string` | — | ID of an external label element. |

### TreeNode shape

```ts
interface TreeNode {
  id: string;           // Unique — must be stable across renders
  label: string;        // Display text
  icon?: ReactNode;     // Custom icon — defaults to Folder/FolderOpen/File
  children?: TreeNode[]; // Presence (even empty) shows the expand toggle
  disabled?: boolean;
  loading?: boolean;    // Shows spinner — use while async children load
  badge?: string | number;
}
```

---

## Tokens Used

### TreeItem (atom)

| Token | Semantic | Purpose |
|---|---|---|
| `--tree-item-bg-hover` | `--color-state-hover` | Row hover |
| `--tree-item-bg-active` | `--color-state-pressed` | Row pressed |
| `--tree-item-bg-selected` | `--color-state-selected` | Selected row |
| `--tree-item-label-color` | `--color-text-primary` | Default text |
| `--tree-item-label-color-selected` | `--color-action-primary` | Selected text |
| `--tree-item-label-color-disabled` | `--color-text-disabled` | Disabled text |
| `--tree-item-icon-color` | `--color-text-secondary` | Node icon |
| `--tree-item-expand-color` | `--color-text-tertiary` | Chevron |
| `--tree-item-badge-bg` | `--color-bg-secondary` | Badge background |
| `--tree-item-radius` | `--radius-component-sm` | Row radius |
| `--tree-item-indent` | `--spacing-component-lg` | Per-level indent |

### TreeView (molecule)

| Token | Semantic | Purpose |
|---|---|---|
| `--tree-view-bg` | `transparent` | Container background |
| `--tree-view-gap` | `--spacing-component-xs` | Gap between root nodes |
| `--tree-view-min-width` | `--content-min-width-label` | Overflow floor |

---

## Variants

The tree adapts to its data. No explicit visual variants — instead, use the `icon` prop per node to differentiate type (folder vs file vs drive vs custom entity).

| Pattern | Data shape |
|---|---|
| File explorer | Nodes with `children: []` for folders, no children for files |
| Navigation | Flat + nested mix; use `disabled` for locked sections |
| With counts | Add `badge` to folders/categories |
| Multi-select | Enable `multiSelect`, handle `onSelect` with `string[]` |

---

## Keyboard Interaction

| Key | Action |
|---|---|
| `↑` / `↓` | Move focus to previous / next visible node |
| `→` | Expand collapsed node — or focus first child if already expanded |
| `←` | Collapse expanded node — or move focus to parent node |
| `Home` | Focus first node in tree |
| `End` | Focus last visible node in tree |
| `Enter` / `Space` | Select focused node |
| `Tab` | Move focus out of the tree entirely |

---

## Accessibility

**Semantic element:** `<ul role="tree">` at root, `<ul role="group">` for nested lists, `<li role="treeitem">` for each node.

**Focus management:** Roving tabindex — exactly one node has `tabIndex={0}` at all times. Arrow keys navigate without requiring Tab. Tab leaves the tree.

### ARIA attributes on the tree root

| Attribute | Value |
|---|---|
| `role="tree"` | Always |
| `aria-label` / `aria-labelledby` | Required — pass one |
| `aria-multiselectable` | `true` when `multiSelect={true}` |

### ARIA attributes per node

| Attribute | When set | Value |
|---|---|---|
| `role="treeitem"` | Always | On every `<li>` |
| `aria-expanded` | Node has children | `true` / `false` |
| `aria-selected` | Always | `true` / `false` |
| `aria-level` | Always | Nesting depth (1-based) |
| `aria-setsize` | Always | Total sibling count |
| `aria-posinset` | Always | 1-based position |
| `aria-disabled` | Node is disabled | `true` |

---

## Usage

```tsx
import { TreeView } from '@/components/molecules/TreeView/TreeView';

// Uncontrolled
<TreeView
  items={myTree}
  defaultExpanded={['folder-1']}
  defaultSelected={['file-a']}
  onSelect={(id) => console.log('selected', id)}
  aria-label="File browser"
/>

// Controlled
const [expanded, setExpanded] = useState(['folder-1']);
const [selected, setSelected] = useState<string | undefined>();

<TreeView
  items={myTree}
  expanded={expanded}
  onExpand={(id, isExpanded) =>
    setExpanded(prev =>
      isExpanded ? [...prev, id] : prev.filter(x => x !== id)
    )
  }
  selected={selected}
  onSelect={(id) => setSelected(id as string)}
  aria-label="File browser"
/>

// Multi-select
const [selected, setSelected] = useState<string[]>([]);

<TreeView
  items={myTree}
  multiSelect
  selected={selected}
  onSelect={(ids) => setSelected(ids as string[])}
  aria-label="File browser"
/>
```