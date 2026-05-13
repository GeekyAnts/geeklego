import type { HTMLAttributes, ReactNode } from 'react';
import type { DrawerI18nStrings } from '../../utils/i18n/GeeklegoI18nProvider.types';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DrawerBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** Body content — scrollable when panel height is constrained. */
  children?: ReactNode;
}

export interface DrawerFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Footer content — typically action buttons. */
  children?: ReactNode;
}

export interface DrawerProps {
  /** Whether the drawer is visible. */
  isOpen: boolean;
  /** Called when the drawer should close (Escape key, backdrop click, close button). */
  onClose: () => void;
  /**
   * Edge of the viewport the panel slides in from.
   * Defaults to 'right'.
   */
  placement?: DrawerPlacement;
  /**
   * Panel size preset.
   * Left/right: controls panel width. Top/bottom: controls panel height.
   * Defaults to 'md'.
   */
  size?: DrawerSize;
  /**
   * Title text rendered in the drawer header.
   * Also used for aria-labelledby on the dialog.
   * When omitted, aria-label falls back to i18nStrings.drawerLabel.
   */
  title?: string;
  /**
   * When true, the body content is replaced with a loading skeleton.
   * Required minimum state for all L3 organisms.
   */
  loading?: boolean;
  /**
   * When false, clicking the backdrop overlay does not call onClose.
   * Defaults to true.
   */
  closeOnBackdropClick?: boolean;
  /** Additional className applied to the dialog panel element. */
  className?: string;
  /** Drawer content — compose Drawer.Body and Drawer.Footer inside. */
  children?: ReactNode;
  /** Per-instance i18n string overrides. */
  i18nStrings?: DrawerI18nStrings;
}

export type { DrawerI18nStrings };
