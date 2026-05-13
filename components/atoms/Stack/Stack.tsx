"use client"
import { forwardRef, memo, useMemo } from 'react';
import type { StackProps, StackDirection, StackGap, StackAlign, StackJustify } from './Stack.types';

const directionClasses: Record<StackDirection, string> = {
  column: 'flex-col',
  row:    'flex-row',
};

const gapClasses: Record<StackGap, string> = {
  none: '',
  xs:   'gap-[var(--spacing-layout-xs)]',
  sm:   'gap-[var(--spacing-layout-sm)]',
  md:   'gap-[var(--spacing-layout-md)]',
  lg:   'gap-[var(--spacing-layout-lg)]',
  xl:   'gap-[var(--spacing-layout-xl)]',
};

const alignClasses: Record<StackAlign, string> = {
  start:    'items-start',
  center:   'items-center',
  end:      'items-end',
  stretch:  'items-stretch',
  baseline: 'items-baseline',
};

const justifyClasses: Record<StackJustify, string> = {
  start:   'justify-start',
  center:  'justify-center',
  end:     'justify-end',
  between: 'justify-between',
  around:  'justify-around',
  evenly:  'justify-evenly',
};

export const Stack = memo(forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = 'column',
      gap = 'md',
      align = 'stretch',
      justify = 'start',
      wrap = false,
      inline = false,
      as: Tag = 'div',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const classes = useMemo(() => [
      inline ? 'inline-flex' : 'flex',
      directionClasses[direction],
      gapClasses[gap],
      alignClasses[align],
      justifyClasses[justify],
      wrap ? 'flex-wrap' : 'flex-nowrap',
      className,
    ].filter(Boolean).join(' '), [inline, direction, gap, align, justify, wrap, className]);

    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Tag ref={ref as any} className={classes} {...(rest as any)}>
        {children}
      </Tag>
    );
  },
));
Stack.displayName = 'Stack';
