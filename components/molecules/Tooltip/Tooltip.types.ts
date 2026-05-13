import type { ReactNode } from 'react';

// ── i18n ────────────────────────────────────────────────────────────────────

export interface TooltipI18nStrings {
  /**
   * Accessible label for the tooltip panel when content is non-textual.
   * Used as `aria-label` on the `role="tooltip"` element.
   * Default: "Tooltip"
   */
  panelLabel?: string;
}

// ── Tooltip types ────────────────────────────────────────────────────────────

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /**
   * Tooltip panel content. Strings are most common;
   * ReactNode allows icon + text or formatted content.
   */
  content: ReactNode;

  /**
   * Position of the panel relative to the trigger element.
   * @default 'top'
   */
  placement?: TooltipPlacement;

  /**
   * Delay in milliseconds before the tooltip appears on mouse hover.
   * Focus-triggered tooltips always appear immediately (no delay).
   * @default 300
   */
  delayMs?: number;

  /**
   * When `true`, the tooltip is never shown.
   * Use to suppress tooltips on elements that are already labelled.
   * @default false
   */
  disabled?: boolean;

  /**
   * The trigger element. Should be a single focusable element (button, link, input…).
   * The component injects `aria-describedby` pointing to the tooltip panel
   * via `React.cloneElement`. If children is not a valid React element, the
   * `aria-describedby` is placed on a wrapping `<span>` instead.
   */
  children: ReactNode;

  /** Override system-generated strings (e.g. for i18n). */
  i18nStrings?: TooltipI18nStrings;

  /** Additional className applied to the outer wrapper `<span>`. */
  className?: string;
}
