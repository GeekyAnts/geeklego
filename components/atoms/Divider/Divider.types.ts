import type { HTMLAttributes } from 'react';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerStyle = 'solid' | 'dashed' | 'dotted';

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  /** Orientation of the divider. Defaults to 'horizontal'. */
  orientation?: DividerOrientation;
  /** Border style. Defaults to 'solid'. */
  variant?: DividerStyle;
}
