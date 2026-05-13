"use client"
import { forwardRef, memo, useMemo } from 'react';
import type { BreadcrumbItemProps, BreadcrumbItemSize } from './BreadcrumbItem.types';
import { sanitizeHref } from '../../utils/security/sanitize';

const sizeClasses: Record<BreadcrumbItemSize, string> = {
  sm: 'text-label-sm',
  md: 'text-label-md',
  lg: 'text-body-md',
};

const innerBase = [
  'inline-flex items-center',
  'gap-[var(--breadcrumb-item-gap)]',
  'px-[var(--breadcrumb-item-px)] py-[var(--breadcrumb-item-py)]',
  'rounded-[var(--breadcrumb-item-radius)]',
].join(' ');

const linkClasses = [
  innerBase,
  'text-[var(--breadcrumb-item-text)]',
  'hover:text-[var(--breadcrumb-item-text-hover)] hover:bg-[var(--breadcrumb-item-bg-hover)]',
  'transition-default',
  'focus-visible:outline-none focus-visible:focus-ring',
  'cursor-pointer',
].join(' ');

const currentClasses = [
  innerBase,
  'text-[var(--breadcrumb-item-text-current)]',
  'cursor-default',
].join(' ');

const disabledClasses = [
  innerBase,
  'text-[var(--breadcrumb-item-text-disabled)]',
  'cursor-not-allowed pointer-events-none',
].join(' ');

export const BreadcrumbItem = memo(forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  (
    {
      href,
      current = false,
      disabled = false,
      size = 'md',
      leftIcon,
      children,
      schema,
      schemaPosition,
      className,
      ...rest
    },
    ref,
  ) => {
    const isLink = Boolean(href) && !current && !disabled;
    const safeHref = useMemo(() => sanitizeHref(href), [href]);

    const iconSlot = leftIcon ? (
      <span
        className="text-[var(--breadcrumb-item-icon)] inline-flex items-center justify-center shrink-0 w-[var(--size-icon-sm)] h-[var(--size-icon-sm)] [&>svg]:w-full [&>svg]:h-full"
        aria-hidden="true"
      >
        {leftIcon}
      </span>
    ) : null;

    return (
      <li
        ref={ref}
        className={[
          'flex items-center',
          sizeClasses[size],
          className,
        ].filter(Boolean).join(' ')}
        aria-current={current ? 'page' : undefined}
        {...(schema && {
          itemScope: true,
          itemProp: 'itemListElement',
          itemType: 'https://schema.org/ListItem',
        })}
        {...rest}
      >
        {isLink ? (
          <a
            href={safeHref}
            className={linkClasses}
            {...(schema && { itemProp: 'item' })}
          >
            {iconSlot}
            <span className="truncate-label" {...(schema && { itemProp: 'name' })}>{children}</span>
          </a>
        ) : (
          <span
            className={disabled ? disabledClasses : currentClasses}
            aria-disabled={disabled || undefined}
            {...(schema && { itemProp: 'item' })}
          >
            {iconSlot}
            <span className="truncate-label" {...(schema && { itemProp: 'name' })}>{children}</span>
          </span>
        )}
        {schema && schemaPosition != null && (
          <meta itemProp="position" content={String(schemaPosition)} />
        )}
      </li>
    );
  },
));

BreadcrumbItem.displayName = 'BreadcrumbItem';
