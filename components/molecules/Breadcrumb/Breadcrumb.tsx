"use client"
import { forwardRef, Fragment, memo, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbItem } from '../../atoms/BreadcrumbItem/BreadcrumbItem';
import type { BreadcrumbProps } from './Breadcrumb.types';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import { sanitizeHref } from '../../utils/security/sanitize';

export const Breadcrumb = memo(forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator, size = 'md', schema, className, i18nStrings, ...rest }, ref) => {
    const i18n = useComponentI18n('breadcrumb', i18nStrings);

    const defaultSeparator = useMemo(() => (
      <span className="inline-flex items-center justify-center w-[var(--size-icon-sm)] h-[var(--size-icon-sm)] text-[var(--breadcrumb-separator-color)] shrink-0">
        <ChevronRight className="w-full h-full" />
      </span>
    ), []);

    const sep = separator ?? defaultSeparator;

    if (items.length === 0) return null;

    const sanitizedItems = useMemo(() =>
      items.map(item => ({
        ...item,
        href: item.href ? sanitizeHref(item.href) : undefined,
      })),
      [items],
    );

    return (
      <nav
        ref={ref}
        aria-label={i18n.navLabel}
        className={['flex items-center', className].filter(Boolean).join(' ')}
        {...(schema && {
          itemScope: true,
          itemType: 'https://schema.org/BreadcrumbList',
        })}
        {...rest}
      >
        <ol className="flex items-center flex-wrap gap-[var(--breadcrumb-gap)]">
          {sanitizedItems.map((item, index) => {
            const isLast = index === sanitizedItems.length - 1;
            return (
              <Fragment key={item.href ?? item.label}>
                <BreadcrumbItem
                  href={item.href}
                  current={isLast || item.current}
                  disabled={item.disabled}
                  size={size}
                  leftIcon={item.icon}
                  schema={schema}
                  schemaPosition={schema ? index + 1 : undefined}
                >
                  {item.label}
                </BreadcrumbItem>
                {!isLast && (
                  <li
                    aria-hidden="true"
                    className="flex items-center text-[var(--breadcrumb-separator-color)] shrink-0"
                  >
                    {sep}
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
      </nav>
    );
  },
));

Breadcrumb.displayName = 'Breadcrumb';
