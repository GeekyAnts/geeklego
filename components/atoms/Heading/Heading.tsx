"use client"
import { type ElementType, forwardRef, memo, useMemo } from 'react';
import type { HeadingProps, HeadingLevel, HeadingSize, HeadingColor } from './Heading.types';

// ── Static class maps (hoisted — never recreated per render) ──────────────────

const typographyClasses: Record<HeadingSize, string> = {
  h1: 'text-heading-h1',
  h2: 'text-heading-h2',
  h3: 'text-heading-h3',
  h4: 'text-heading-h4',
  h5: 'text-heading-h5',
};

// h5 has no responsive variant — falls back to its static class
const responsiveTypographyClasses: Record<HeadingSize, string> = {
  h1: 'text-heading-h1-responsive',
  h2: 'text-heading-h2-responsive',
  h3: 'text-heading-h3-responsive',
  h4: 'text-heading-h4-responsive',
  h5: 'text-heading-h5',
};

// Maps semantic level to default visual size. h6 shares the h5 type scale.
const defaultSizeForLevel: Record<HeadingLevel, HeadingSize> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h5',
};

const colorClasses: Record<HeadingColor, string> = {
  primary:   'text-primary',
  secondary: 'text-secondary',
  tertiary:  'text-tertiary',
  accent:    'text-accent',
  inverse:   'text-inverse',
};

// ── Component ─────────────────────────────────────────────────────────────────

export const Heading = memo(forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      as = 'h2',
      size,
      responsive = false,
      color = 'primary',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const resolvedSize = size ?? defaultSizeForLevel[as];
    const Tag = as as ElementType;

    const classes = useMemo(() => [
      responsive
        ? responsiveTypographyClasses[resolvedSize]
        : typographyClasses[resolvedSize],
      colorClasses[color],
      className,
    ].filter(Boolean).join(' '), [responsive, resolvedSize, color, className]);

    return (
      <Tag ref={ref} className={classes} {...rest}>
        {children}
      </Tag>
    );
  },
));

Heading.displayName = 'Heading';
