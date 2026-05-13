import type { HTMLAttributes, ReactNode } from 'react';

/** HTML elements the component can render as. */
export type VisuallyHiddenElement = 'span' | 'div' | 'p';

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLElement> {
  /**
   * HTML element to render. Use 'span' (default) for inline contexts,
   * 'div' for block contexts, and 'p' when the content is a paragraph.
   */
  as?: VisuallyHiddenElement;
  /** Content that is hidden visually but announced by assistive technology. */
  children: ReactNode;
}
