import type { HTMLAttributes, ReactNode } from 'react';

// ── i18n ───────────────────────────────────────────────────────────────────────

export interface DropdownMenuI18nStrings {
  /** aria-label for the menu panel when no menuLabel prop is provided. Default: "Menu" */
  defaultMenuLabel?: string;
}

// ── Item discriminated union ──────────────────────────────────────────────────

/** A single actionable menu item (button or link). */
export interface DropdownMenuItemDef {
  type?: 'item';
  /** Stable unique identifier — used as React key and for internal index map. */
  id: string;
  /** Visible text label. */
  label: string;
  /** Optional leading icon (lucide-react element recommended). */
  icon?: ReactNode;
  /** Optional keyboard shortcut hint displayed trailing-end (decorative only). */
  shortcut?: string;
  /** When provided the item renders as `<a>` instead of `<button>`. */
  href?: string;
  /** Passed to the anchor `target` attribute. Triggers rel guard for `_blank`. */
  target?: string;
  /** Passed to the anchor `rel` attribute. Merged with safety directives. */
  rel?: string;
  /** Called when the item is activated (click or Enter/Space). */
  onClick?: () => void;
  /** When true the item is non-interactive and visually muted. */
  disabled?: boolean;
  /** Renders the item in error/danger colour with filled-error hover background. */
  destructive?: boolean;
}

/** A horizontal rule that visually separates item groups. */
export interface DropdownMenuSeparatorDef {
  type: 'separator';
  /** Stable unique identifier — used as React key. */
  id: string;
}

/** A named group of items preceded by a visible label. */
export interface DropdownMenuGroupDef {
  type: 'group';
  /** Stable unique identifier — used as React key. */
  id: string;
  /** Visible group heading text (also used for `aria-label` on the sub-list). */
  label: string;
  /** Items contained in this group. */
  items: DropdownMenuItemDef[];
}

/** Top-level union of all item shapes accepted by DropdownMenu. */
export type DropdownMenuItemType =
  | DropdownMenuItemDef
  | DropdownMenuSeparatorDef
  | DropdownMenuGroupDef;

// ── Placement ─────────────────────────────────────────────────────────────────

/**
 * Where the panel opens relative to the trigger.
 * - `bottom-start` (default) — opens below, aligned to the trigger's start edge
 * - `bottom-end`             — opens below, aligned to the trigger's end edge
 * - `top-start`              — opens above, aligned to the trigger's start edge
 * - `top-end`                — opens above, aligned to the trigger's end edge
 */
export type DropdownMenuPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end';

// ── Component props ───────────────────────────────────────────────────────────

export interface DropdownMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * The element that opens and closes the menu.
   *
   * Pass a `<Button>` or any other React element — ARIA props (`aria-expanded`,
   * `aria-haspopup`, `aria-controls`, `id`) and an `onClick` handler are
   * injected automatically via `React.cloneElement`.
   *
   * If a plain non-element value is passed (string, number) it is wrapped in
   * an accessible `<button>` automatically.
   */
  trigger: ReactNode;
  /** Array of items, separators, and groups to render in the menu panel. */
  items: DropdownMenuItemType[];
  /**
   * Where the panel opens relative to the trigger.
   * @default 'bottom-start'
   */
  placement?: DropdownMenuPlacement;
  /**
   * Controlled open state. When provided, the consumer manages open/close.
   * Pair with `onOpenChange` to respond to internal close events (Escape,
   * click-outside, Tab, item selection).
   */
  open?: boolean;
  /**
   * Called when the menu requests an open-state change.
   * Receives the new desired state. Required for controlled usage.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Accessible label for the `role="menu"` panel.
   * When omitted the panel is labelled by the trigger element via
   * `aria-labelledby`. Only provide if the trigger label does not
   * adequately describe the menu contents.
   */
  menuLabel?: string;
  /** Optional i18n strings for menu labels and UI text. */
  i18nStrings?: DropdownMenuI18nStrings;
}
