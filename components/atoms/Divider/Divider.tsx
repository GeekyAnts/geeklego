"use client"
import { forwardRef, memo, useMemo } from 'react';
import type { DividerProps, DividerStyle } from './Divider.types';

const styleClasses: Record<DividerStyle, string> = {
  solid:  'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
};

export const Divider = memo(forwardRef<HTMLHRElement, DividerProps>(
  ({ orientation = 'horizontal', variant = 'solid', className, ...rest }, ref) => {
    const isVertical = orientation === 'vertical';

    const classes = useMemo(() => [
      'border-[var(--divider-color)]',
      styleClasses[variant],
      isVertical
        ? 'border-l border-t-0 self-stretch h-auto w-0 my-[var(--divider-spacing)]'
        : 'border-t border-l-0 w-full h-0 mx-0 my-[var(--divider-spacing)]',
      className,
    ].filter(Boolean).join(' '), [isVertical, variant, className]);

    return (
      <hr
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={classes}
        {...rest}
      />
    );
  },
));
Divider.displayName = 'Divider';
