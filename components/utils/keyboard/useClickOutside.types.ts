import type { RefObject } from 'react';

export interface UseClickOutsideOptions {
  /** Whether the listener is active */
  active: boolean;
  /** Ref to the container — clicks outside this element trigger dismissal */
  containerRef: RefObject<HTMLElement | null>;
  /** Called when a click lands outside the container */
  onClickOutside: () => void;
}
