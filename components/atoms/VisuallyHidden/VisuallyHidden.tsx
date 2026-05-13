"use client"
import { forwardRef, memo, useMemo } from 'react';
import type { ElementType } from 'react';
import type { VisuallyHiddenProps } from './VisuallyHidden.types';

// Static base class — never recomputed
const BASE_CLASSES = 'sr-only';

/**
 * VisuallyHidden — renders content that is invisible to sighted users but
 * fully announced by screen readers and other assistive technologies.
 *
 * Uses the `.sr-only` utility class from geeklego.css (position: absolute;
 * width/height: 1px; clip: rect(0,0,0,0); overflow: hidden).
 *
 * Common patterns:
 *   - Accessible labels for icon-only buttons
 *   - Status announcements alongside visual indicators (spinners, badges)
 *   - Navigation landmark descriptions
 *   - Form group context text
 */
export const VisuallyHidden = memo(
  forwardRef<HTMLElement, VisuallyHiddenProps>(
    ({ as = 'span', children, className, ...rest }, ref) => {
      const Element = as as ElementType;

      const classes = useMemo(
        () => [BASE_CLASSES, className].filter(Boolean).join(' '),
        [className],
      );

      return (
        <Element ref={ref} className={classes} {...rest}>
          {children}
        </Element>
      );
    },
  ),
);

VisuallyHidden.displayName = 'VisuallyHidden';
