import type { HTMLAttributes, ReactNode } from 'react';
import type { AlertBannerI18nStrings } from '../../utils/i18n/GeeklegoI18nProvider.types';

export type AlertBannerVariant = 'info' | 'success' | 'warning' | 'error';
export type AlertBannerAppearance = 'solid' | 'subtle' | 'outline' | 'left-accent';
export type AlertBannerSize = 'sm' | 'md';

export interface AlertBannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Semantic status intent.
   * Controls colour palette, default icon, and ARIA live region assertiveness.
   * - 'error' / 'warning' → role="alert" (assertive, interrupts screen reader)
   * - 'info' / 'success'  → role="status" (polite, waits for a pause)
   * Defaults to 'info'.
   */
  variant?: AlertBannerVariant;
  /**
   * Visual treatment strategy. Each appearance uses a fundamentally different
   * visual approach — not just a colour shift.
   * - 'solid'        → filled background, high-contrast inverse text (max prominence)
   * - 'subtle'       → muted tinted background + status border (balanced)
   * - 'outline'      → transparent background + full status border (lightweight)
   * - 'left-accent'  → tinted background + bold left-side status bar (contextual)
   * Defaults to 'subtle'.
   */
  appearance?: AlertBannerAppearance;
  /**
   * Component scale.
   * 'sm' uses reduced padding and a smaller icon for dense layouts.
   * Defaults to 'md'.
   */
  size?: AlertBannerSize;
  /** Optional bold title line. Renders above the description. */
  title?: string;
  /** Alert body content. Accepts a string or any React node. */
  description?: ReactNode;
  /**
   * Override the leading status icon entirely.
   * Pass `null` to suppress the icon without affecting `showIcon`.
   */
  icon?: ReactNode;
  /**
   * Whether to render the leading status icon.
   * Defaults to true.
   */
  showIcon?: boolean;
  /**
   * When true, a dismiss button (×) is rendered on the trailing edge.
   * Requires `onDismiss` to handle the interaction.
   * Defaults to false.
   */
  dismissible?: boolean;
  /** Called when the user activates the dismiss button. */
  onDismiss?: () => void;
  /**
   * Optional action slot rendered below the description.
   * Intended for one or two action Button or Link nodes.
   */
  actions?: ReactNode;
  /** Per-instance i18n string overrides. */
  i18nStrings?: AlertBannerI18nStrings;
}
