import type { HTMLAttributes, ReactNode } from 'react';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalI18nStrings {
  /** aria-label for the close (×) button. Default: "Close" */
  closeLabel?: string;
  /** Fallback aria-label for the dialog when no title prop is provided. Default: "Dialog" */
  dialogLabel?: string;
}

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** Body content — scrollable when panel height is constrained. */
  children?: ReactNode;
}

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Footer content — typically action buttons. */
  children?: ReactNode;
}

export interface ModalProps {
  /** Whether the modal is visible. */
  isOpen: boolean;
  /** Called when the modal should close (Escape key, backdrop click, close button). */
  onClose: () => void;
  /** Width preset for the dialog panel. Defaults to 'md'. */
  size?: ModalSize;
  /**
   * Title text rendered in the modal header.
   * Also used for aria-labelledby on the dialog.
   * When omitted, aria-label falls back to i18nStrings.dialogLabel.
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
  /** Modal content — compose Modal.Body and Modal.Footer inside. */
  children?: ReactNode;
  /** Per-instance i18n string overrides. */
  i18nStrings?: ModalI18nStrings;
}
