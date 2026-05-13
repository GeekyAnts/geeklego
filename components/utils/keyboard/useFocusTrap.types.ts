import type { RefObject } from 'react';

export interface UseFocusTrapOptions {
  /** Whether the focus trap is currently active */
  active: boolean;
  /** Ref to the container element that traps focus */
  containerRef: RefObject<HTMLElement | null>;
  /** Element to return focus to on deactivation. Defaults to the element focused at activation time. */
  returnFocusTo?: RefObject<HTMLElement | null>;
  /** Whether to auto-focus the first focusable child on activation. Default: true */
  autoFocus?: boolean;
}
