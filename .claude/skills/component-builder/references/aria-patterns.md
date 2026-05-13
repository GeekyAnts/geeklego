# ARIA Patterns — Component Type Reference

Use this table to determine which ARIA roles and attributes are required for each component type. **Semantic HTML first** — apply ARIA only when the native element's implicit semantics are insufficient or when the interaction pattern requires explicit state.

## Interactive controls

| Component type | Element | Role | Required ARIA | Keyboard pattern |
|---|---|---|---|---|
| Button (action) | `<button>` | implicit `button` | `aria-label` if icon-only; `aria-disabled` if disabled; `aria-busy` if loading | Enter, Space |
| Button (toggle) | `<button>` | implicit `button` | `aria-pressed={boolean}` | Enter, Space |
| Link | `<a href>` | implicit `link` | `aria-label` if icon-only; `aria-current="page"` if active | Enter |
| Checkbox | `<input type="checkbox">` | implicit `checkbox` | `aria-required`, `aria-invalid` | Space to toggle |
| Radio | `<input type="radio">` | implicit `radio` | `aria-required` | Arrow keys within group |
| Switch | `<button>` | `role="switch"` | `aria-checked={boolean}`, `aria-label` | Enter, Space |
| Combobox / Select | `<button>` trigger + `<ul>` listbox | trigger: `role="combobox"`, list: `role="listbox"` | `aria-expanded`, `aria-controls`, `aria-haspopup="listbox"`; `aria-selected` on options | Enter/Space to open, Arrow to navigate, Escape to close |
| Text input | `<input type="text">` | implicit `textbox` | `aria-required`, `aria-invalid`, `aria-describedby` for error message | Tab to focus |
| Slider | `<input type="range">` | implicit `slider` | `aria-label`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` | Arrow keys |

## Disclosure and expansion patterns

| Component type | Trigger element | Panel element | ARIA on trigger | ARIA on panel | Keyboard |
|---|---|---|---|---|---|
| Accordion | `<button>` | `<div>` | `aria-expanded`, `aria-controls="[panel-id]"` | `id="[panel-id]"`, `role="region"`, `aria-labelledby="[trigger-id]"` | Enter/Space |
| Expandable nav item | `<button>` | `<ul>` | `aria-expanded`, `aria-controls="[submenu-id]"` | `id="[submenu-id]"`, `role="group"` | Enter/Space; Escape to collapse |
| Dropdown menu | `<button>` | `<ul>` | `aria-expanded`, `aria-haspopup="menu"`, `aria-controls="[menu-id]"` | `id="[menu-id]"`, `role="menu"` | Enter/Arrow to open, Arrow to navigate, Escape to close |
| Modal / Dialog | trigger `<button>` | `<div>` | `aria-haspopup="dialog"` | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="[heading-id]"` | Escape to close; focus trapped inside; focus returns to trigger on close |
| Tooltip | any element | `<div>` | `aria-describedby="[tooltip-id]"` | `id="[tooltip-id]"`, `role="tooltip"` | Escape dismisses |
| Popover | `<button>` | `<div>` | `aria-expanded`, `aria-controls="[popover-id]"`, `aria-haspopup="dialog"` | `id="[popover-id]"`, `role="dialog"` | Escape to close |

## Navigation and landmark patterns

| Component type | Element | Required ARIA | Notes |
|---|---|---|---|
| Primary navigation | `<nav>` | `aria-label="Primary"` | Each `<nav>` on the page needs a unique label |
| Sidebar navigation | `<nav>` | `aria-label="Sidebar navigation"` | Multiple navs on a page must each be labelled |
| Breadcrumb | `<nav>` | `aria-label="Breadcrumb"` | Inner `<ol>`; current page item gets `aria-current="page"` |
| Tab list | `<div>` | `role="tablist"`, `aria-label` | Tabs: `role="tab"`, `aria-selected`, `aria-controls`; Panels: `role="tabpanel"`, `aria-labelledby` |
| Main content | `<main>` | `id="main-content"` | Skip link target — required on every page/layout |
| Sidebar region | `<aside>` | `aria-label` | Required if more than one `<aside>` |
| Footer | `<footer>` | — | Top-level footer is implicit `contentinfo`; nested footer scopes to parent section |

## ARIA Helper Integration

Before hand-writing `aria-expanded`, `aria-controls`, `aria-disabled`, or `aria-busy` attribute combinations, use the helpers from `components/utils/accessibility/`:

| Pattern needed | Helper to import | What it returns |
|---|---|---|
| Expand/collapse trigger + panel | `getDisclosureProps(isExpanded, panelId)` | `[triggerProps, panelProps]` tuple with `aria-expanded`, `aria-controls`, `id`, `role` |
| Active/disabled nav item | `getNavigationItemProps({ isActive, disabled })` | `aria-current`, `aria-disabled`, `tabIndex` |
| Loading spinner container | `getLoadingProps(isLoading)` | `{ 'aria-busy': true }` or `{}` |
| Disabled interactive element | `getDisabledProps(isDisabled)` | `{ 'aria-disabled': true, disabled: true }` or `{}` |
| Form field error state | `getErrorFieldProps(hasError, errorId)` | `{ 'aria-invalid': 'true', 'aria-describedby': errorId }` or `{}` |
| Decorative/meaningful icon | `getIconProps(isDecorative, label?)` | `{ 'aria-hidden': true }` or `{ role: 'img', 'aria-label': label }` |
| Live region announcements | `getLiveRegionProps(type)` | `aria-live`, `aria-atomic`, `role` combo |

Import from: `import { getDisclosureProps, getLoadingProps } from '../../utils/accessibility'`

## Keyboard Hook Integration

Before writing any `onKeyDown` handler or `useEffect` for keyboard/focus logic, check this table:

| Pattern needed | Hook to import | When it applies |
|---|---|---|
| Arrow keys move focus in a list | `useRovingTabindex` | Tabs, Sidebar nav, radio groups, menus, toolbars, listboxes |
| Focus must not leave a container | `useFocusTrap` | Modal, Dialog, responsive Sidebar overlay, Popover |
| Escape key closes an overlay | `useEscapeDismiss` | Modal, Tooltip, Popover, dropdown menus, responsive Sidebar |
| Clicking outside closes a panel | `useClickOutside` | Select, Popover, Dropdown menu, DatePicker |

Import from: `import { useRovingTabindex } from '../../utils/keyboard'`

**Rule:** If a component needs one of these four behaviors, use the hook. Never write the pattern inline.

## Status and live region patterns

| Pattern | Element | ARIA | Notes |
|---|---|---|---|
| Error message | `<p>` or `<span>` | `id` referenced by `aria-describedby` on the field | Prefer `aria-describedby` linkage over `aria-live` for form errors |
| Success / Toast | `<div>` | `role="status"`, `aria-live="polite"` | Polite — does not interrupt current announcement |
| Alert / Urgent error | `<div>` | `role="alert"`, `aria-live="assertive"` | Use only for errors requiring immediate attention |
| Loading state | container element | `aria-busy="true"` | Announce "loading complete" by removing `aria-busy` |
| Progress bar | `<div>` | `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-label` | Omit `aria-valuenow` for indeterminate |

## ID generation — always use `useId()`

```tsx
import { useId } from 'react';  // React 19 built-in — no install needed

const baseId = useId();
const panelId = `${baseId}-panel`;
const errorId = `${baseId}-error`;
// Then: aria-controls={panelId} on trigger, id={panelId} on panel
```

Never generate IDs manually or from labels — `useId()` guarantees uniqueness even with multiple instances.