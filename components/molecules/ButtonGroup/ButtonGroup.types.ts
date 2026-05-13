import type { HTMLAttributes, ReactNode } from 'react';

export type ButtonGroupVariant = 'attached' | 'spaced';
export type ButtonGroupOrientation = 'horizontal' | 'vertical';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `attached` — buttons share borders and joined radii (fused look).
   * `spaced` — buttons are separated by a gap with their individual radii intact.
   * Defaults to `'attached'`.
   */
  variant?: ButtonGroupVariant;
  /**
   * Layout axis of the group.
   * Defaults to `'horizontal'`.
   */
  orientation?: ButtonGroupOrientation;
  /**
   * Accessible label for the group. Provide when there is no visible heading
   * that already describes the group's purpose (e.g. `aria-labelledby`).
   * Passed through to the native `role="group"` container.
   */
  'aria-label'?: string;
  /** Button atoms to render inside the group. */
  children: ReactNode;
}
