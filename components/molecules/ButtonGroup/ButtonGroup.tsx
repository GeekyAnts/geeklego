"use client"
import { Children, cloneElement, forwardRef, isValidElement, memo, useMemo } from 'react';
import type { ButtonGroupOrientation, ButtonGroupProps, ButtonGroupVariant } from './ButtonGroup.types';

// Container layout classes per orientation
const orientationClasses: Record<ButtonGroupOrientation, string> = {
  horizontal: 'flex-row items-center',
  vertical:   'flex-col items-stretch',
};

// Derived radius class for each button position inside an attached group
function getAttachedRadiusClass(
  index: number,
  total: number,
  orientation: ButtonGroupOrientation,
): string {
  if (total === 1) return ''; // single child — keep its own radius untouched
  const isFirst = index === 0;
  const isLast  = index === total - 1;

  if (orientation === 'horizontal') {
    if (isFirst) return 'rounded-e-none';           // keep start radius, remove end
    if (isLast)  return 'rounded-s-none';           // keep end radius, remove start
    return 'rounded-none';                          // middle: strip all radius
  }

  // vertical — block axis; use logical properties for consistency
  if (isFirst) return 'rounded-ee-none rounded-es-none';  // keep top, remove bottom (end)
  if (isLast)  return 'rounded-se-none rounded-ss-none';  // keep bottom, remove top (start)
  return 'rounded-none';
}

// Collapse offset class applied to every non-first child in an attached group
function getAttachedOffsetClass(
  index: number,
  orientation: ButtonGroupOrientation,
): string {
  if (index === 0) return '';
  return orientation === 'horizontal'
    ? 'ms-[var(--button-group-divider-offset)]'     // collapse inline border (RTL-safe)
    : 'mt-[var(--button-group-divider-offset)]';    // collapse block border
}

export const ButtonGroup = memo(
  forwardRef<HTMLDivElement, ButtonGroupProps>(
    (
      {
        variant     = 'attached',
        orientation = 'horizontal',
        className,
        children,
        ...rest
      },
      ref,
    ) => {
      const containerClasses = useMemo(
        () =>
          [
            'inline-flex',
            orientationClasses[orientation],
            variant === 'spaced' ? 'gap-[var(--button-group-gap)]' : '',
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [variant, orientation, className],
      );

      // For attached groups, clone each child to inject radius + border-collapse overrides.
      // For spaced groups, render children as-is — they keep their individual radii.
      const renderedChildren = useMemo(() => {
        if (variant !== 'attached') return children;

        const arr = Children.toArray(children).filter(isValidElement);
        return arr.map((child, index) => {
          const existingClass =
            (child.props as { className?: string }).className ?? '';

          const injectedClass = [
            existingClass,
            getAttachedRadiusClass(index, arr.length, orientation),
            getAttachedOffsetClass(index, orientation),
            // Raise z-index on hover/focus so the full border ring shows over its neighbour
            'relative hover:z-10 focus-visible:z-10',
          ]
            .filter(Boolean)
            .join(' ');

          return cloneElement(
            child as React.ReactElement<{ className?: string }>,
            {
              className: injectedClass,
              key: child.key ?? index,
            },
          );
        });
      }, [variant, orientation, children]);

      return (
        <div ref={ref} role="group" className={containerClasses} {...rest}>
          {renderedChildren}
        </div>
      );
    },
  ),
);
ButtonGroup.displayName = 'ButtonGroup';
