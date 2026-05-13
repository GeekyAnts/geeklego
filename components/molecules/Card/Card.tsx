"use client"
import { forwardRef, memo, useMemo } from 'react';
import type {
  CardProps,
  CardVariant,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
} from './Card.types';

// ── Static class maps (hoisted — never recreated per render) ──────────────────

const baseClasses = [
  'relative flex flex-col overflow-hidden',
  'rounded-[var(--card-radius)]',
  'border-[length:var(--card-border-width)]',
  'transition-default',
  'card-shell perf-contain-content',
].join(' ');

const variantClasses: Record<CardVariant, string> = {
  elevated: [
    'bg-[var(--card-elevated-bg)]',
    'border-[color:var(--card-elevated-border)]',
    'shadow-[var(--card-elevated-shadow)]',
  ].join(' '),
  outlined: [
    'bg-[var(--card-outlined-bg)]',
    'border-[color:var(--card-outlined-border)]',
    'shadow-none',
  ].join(' '),
  filled: [
    'bg-[var(--card-filled-bg)]',
    'border-transparent',
    'shadow-none',
  ].join(' '),
  ghost: [
    'bg-transparent',
    'border-transparent',
    'shadow-none',
  ].join(' '),
};

// Interactive cards change shadow + background (elevated) or background + border (others) on hover
const interactiveElevatedClasses = [
  'hover:shadow-[var(--card-elevated-shadow-hover)]',
  'hover:bg-[var(--card-interactive-bg-hover)]',
  'focus-visible:outline-none focus-visible:focus-ring',
  'cursor-pointer',
].join(' ');

const interactiveOtherClasses = [
  'hover:bg-[var(--card-interactive-bg-hover)]',
  'hover:border-[color:var(--card-outlined-border)]',
  'focus-visible:outline-none focus-visible:focus-ring',
  'cursor-pointer',
].join(' ');

// ── Card root ─────────────────────────────────────────────────────────────────

const CardRoot = memo(
  forwardRef<HTMLDivElement, CardProps>(
    ({ variant = 'elevated', interactive = false, className, children, ...rest }, ref) => {
      const classes = useMemo(
        () =>
          [
            baseClasses,
            variantClasses[variant],
            interactive
              ? variant === 'elevated'
                ? interactiveElevatedClasses
                : interactiveOtherClasses
              : '',
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [variant, interactive, className],
      );

      return (
        <div ref={ref} tabIndex={interactive ? 0 : undefined} className={classes} {...rest}>
          {children}
        </div>
      );
    },
  ),
);

CardRoot.displayName = 'Card';

// ── Card.Header ───────────────────────────────────────────────────────────────

const CardHeader = memo(
  forwardRef<HTMLElement, CardHeaderProps>(
    ({ title, description, action, className, children, ...rest }, ref) => {
      const headerClasses = useMemo(
        () =>
          [
            'flex-shrink-0 card-header-row',
            'px-[var(--card-section-px)] py-[var(--card-header-py)]',
            'border-b border-[color:var(--card-divider-color)]',
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [className],
      );

      // Custom layout override — children replace the default title/description/action layout
      if (children && !title) {
        return (
          <header ref={ref} className={headerClasses} {...rest}>
            {children}
          </header>
        );
      }

      return (
        <header ref={ref} className={headerClasses} {...rest}>
          <div className="card-header-title">
            <div className="flex flex-col gap-[var(--card-gap)] min-w-0">
              {title && (
                <h4 className="text-heading-h4 text-[var(--color-text-primary)] truncate-label">
                  {title}
                </h4>
              )}
              {description && (
                <p className="text-body-sm text-[var(--color-text-secondary)] clamp-description">
                  {description}
                </p>
              )}
              {children}
            </div>
          </div>
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </header>
      );
    },
  ),
);

CardHeader.displayName = 'Card.Header';

// ── Card.Body ─────────────────────────────────────────────────────────────────

const CardBody = memo(
  forwardRef<HTMLDivElement, CardBodyProps>(({ className, children, ...rest }, ref) => {
    const classes = useMemo(
      () =>
        [
          'content-flex',
          'px-[var(--card-section-px)] py-[var(--card-body-py)]',
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [className],
    );

    return (
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    );
  }),
);

CardBody.displayName = 'Card.Body';

// ── Card.Footer ───────────────────────────────────────────────────────────────

const CardFooter = memo(
  forwardRef<HTMLElement, CardFooterProps>(
    ({ border = true, className, children, ...rest }, ref) => {
      const classes = useMemo(
        () =>
          [
            'flex-shrink-0 flex items-center gap-[var(--card-gap)]',
            'px-[var(--card-section-px)] py-[var(--card-footer-py)]',
            border ? 'border-t border-[color:var(--card-divider-color)]' : '',
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [border, className],
      );

      return (
        <footer ref={ref} className={classes} {...rest}>
          {children}
        </footer>
      );
    },
  ),
);

CardFooter.displayName = 'Card.Footer';

// ── Compound component assembly ────────────────────────────────────────────────

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body:   CardBody,
  Footer: CardFooter,
});

// Named exports for destructuring consumers
export { CardHeader, CardBody, CardFooter };
