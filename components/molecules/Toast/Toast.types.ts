import type { HTMLAttributes, ReactNode } from 'react';
import type { ToastI18nStrings } from '../../utils/i18n/GeeklegoI18nProvider.types';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';
export type ToastAppearance = 'solid' | 'subtle' | 'outline' | 'left-accent';
export type ToastSize = 'sm' | 'md';

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Semantic status intent.
   * Controls colour palette, default icon, and ARIA live region assertiveness.
   * - 'error' / 'warning' → role="alert" (assertive, interrupts screen reader)
   * - 'info' / 'success'  → role="status" (polite, waits for a pause)
   * Defaults to 'info'.
   */
  variant?: ToastVariant;
  /**
   * Visual treatment strategy. Each appearance uses a different visual approach.
   * - 'solid'        → filled status background, high-contrast inverse text
   * - 'subtle'       → muted tinted background + status border
   * - 'outline'      → surface-raised background + full status border
   * - 'left-accent'  → tinted background + bold inline-start status bar
   * Defaults to 'subtle'.
   */
  appearance?: ToastAppearance;
  /**
   * Component scale. Defaults to 'md'.
   */
  size?: ToastSize;
  /** Optional bold title line rendered above the description. */
  title?: string;
  /** Toast body content. Accepts a string or any React node. */
  description?: ReactNode;
  /**
   * Override the leading status icon.
   * Pass `null` to suppress the icon without affecting `showIcon`.
   */
  icon?: ReactNode;
  /**
   * Whether to render the leading status icon. Defaults to true.
   */
  showIcon?: boolean;
  /**
   * Whether to render a dismiss (×) button on the trailing edge. Defaults to true.
   */
  dismissible?: boolean;
  /** Called when the toast is dismissed (manually or via auto-timeout). */
  onDismiss?: () => void;
  /**
   * Auto-dismiss delay in milliseconds.
   * 0 or undefined = no auto-dismiss. Defaults to 0.
   */
  duration?: number;
  /**
   * Show a countdown progress bar at the bottom edge.
   * Only visible when `duration` is greater than 0. Defaults to false.
   */
  showProgress?: boolean;
  /**
   * Optional action slot rendered below the description.
   * Intended for one or two Button or Link nodes.
   */
  actions?: ReactNode;
  /** Per-instance i18n string overrides. */
  i18nStrings?: ToastI18nStrings;
}
