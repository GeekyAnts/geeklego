"use client"
import { createContext, useContext, forwardRef, memo, useMemo } from 'react';
import { Check } from 'lucide-react';
import type {
  ListProps,
  ListItemProps,
  ListVariant,
  ListSize,
  ListContextValue,
} from './List.types';

// ── Internal context ──────────────────────────────────────────────────────────
const ListContext = createContext<ListContextValue>({ variant: 'bullet', size: 'md' });

// ── Static lookup maps (hoisted — never re-created per render) ────────────────
const sizeGapClass: Record<ListSize, string> = {
  sm: 'gap-[var(--list-gap-sm)]',
  md: 'gap-[var(--list-gap-md)]',
  lg: 'gap-[var(--list-gap-lg)]',
};

const sizeTextClass: Record<ListSize, string> = {
  sm: 'text-body-sm',
  md: 'text-body-md',
  lg: 'text-body-lg',
};

const checkIconSize: Record<ListSize, string> = {
  sm: 'var(--list-check-icon-size-sm)',
  md: 'var(--list-check-icon-size-md)',
  lg: 'var(--list-check-icon-size-lg)',
};

// ── List ──────────────────────────────────────────────────────────────────────
const ListBase = memo(
  forwardRef<HTMLElement, ListProps>(
    ({ variant = 'bullet', size = 'md', orientation = 'vertical', className, children, ...rest }, ref) => {
      const ctx = useMemo<ListContextValue>(() => ({ variant, size }), [variant, size]);

      const containerClasses = useMemo(
        () =>
          [
            'flex',
            orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col',
            sizeGapClass[size],
            variant === 'bullet' && 'list-disc list-outside ps-[var(--list-indent)]',
            variant === 'ordered' && 'list-decimal list-outside ps-[var(--list-indent)]',
            (variant === 'none' || variant === 'check' || variant === 'dot' || variant === 'description') &&
              'list-none',
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [variant, size, orientation, className],
      );

      const Element: React.ElementType =
        variant === 'ordered' ? 'ol' : variant === 'description' ? 'dl' : 'ul';

      return (
        <ListContext.Provider value={ctx}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Element ref={ref as any} className={containerClasses} {...rest}>
            {children}
          </Element>
        </ListContext.Provider>
      );
    },
  ),
);
ListBase.displayName = 'List';

// ── List.Item ─────────────────────────────────────────────────────────────────
const ListItem = memo(
  forwardRef<HTMLElement, ListItemProps>(({ disabled = false, term, className, children, ...rest }, ref) => {
    const { variant, size } = useContext(ListContext);
    const textClass = sizeTextClass[size];

    // ── description variant — <div> wrapping <dt> + <dd> ─────────────────────
    if (variant === 'description') {
      return (
        <div
          className={[
            'flex flex-col gap-[var(--list-marker-gap)]',
            'pb-[var(--list-gap-md)] border-b border-[var(--list-term-border)]',
            '[&:last-child]:border-b-0 [&:last-child]:pb-0',
            disabled && 'pointer-events-none',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {term != null && (
            <dt
              className={[
                'text-label-sm truncate-label',
                disabled ? 'text-[var(--list-item-text-disabled)]' : 'text-[var(--list-term-color)]',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {term}
            </dt>
          )}
          <dd
            className={[
              textClass,
              'm-0',
              disabled ? 'text-[var(--list-item-text-disabled)]' : 'text-[var(--list-definition-color)]',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {children}
          </dd>
        </div>
      );
    }

    // ── check variant — flex row with check icon ──────────────────────────────
    if (variant === 'check') {
      return (
        <li
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={ref as any}
          className={[
            'flex items-start gap-[var(--list-marker-gap)]',
            textClass,
            disabled
              ? 'text-[var(--list-item-text-disabled)] pointer-events-none'
              : 'text-[var(--list-item-text)]',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-disabled={disabled || undefined}
          {...rest}
        >
          <span
            aria-hidden="true"
            className={[
              'shrink-0 mt-[var(--spacing-component-xs)]',
              disabled ? 'text-[var(--list-item-text-disabled)]' : 'text-[var(--list-check-color)]',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <Check size={checkIconSize[size]} />
          </span>
          <span className="content-flex">{children}</span>
        </li>
      );
    }

    // ── dot variant — flex row with small filled dot ───────────────────────────
    if (variant === 'dot') {
      return (
        <li
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={ref as any}
          className={[
            'flex items-start gap-[var(--list-marker-gap)]',
            textClass,
            disabled
              ? 'text-[var(--list-item-text-disabled)] pointer-events-none'
              : 'text-[var(--list-item-text)]',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-disabled={disabled || undefined}
          {...rest}
        >
          <span
            aria-hidden="true"
            className={[
              'shrink-0 rounded-full mt-[var(--spacing-component-xs)]',
              'w-[var(--list-dot-size)] h-[var(--list-dot-size)]',
              disabled ? 'bg-[var(--list-item-text-disabled)]' : 'bg-[var(--list-dot-color)]',
            ]
              .filter(Boolean)
              .join(' ')}
          />
          <span className="content-flex">{children}</span>
        </li>
      );
    }

    // ── bullet / ordered / none — standard <li> with CSS marker ──────────────
    return (
      <li
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        className={[
          textClass,
          disabled
            ? 'text-[var(--list-item-text-disabled)] pointer-events-none'
            : 'text-[var(--list-item-text)]',
          'marker:text-[var(--list-marker-color)]',
          variant === 'ordered' && 'marker:text-[var(--list-ordered-number-color)]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-disabled={disabled || undefined}
        {...rest}
      >
        {children}
      </li>
    );
  }),
);
ListItem.displayName = 'List.Item';

// ── Attach compound slot + named export ──────────────────────────────────────
export const List = ListBase as typeof ListBase & { Item: typeof ListItem };
List.Item = ListItem;

export { ListItem };
