"use client"
import { forwardRef, memo, useMemo } from 'react';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type { SkipLinkProps, SkipLinkSize } from './SkipLink.types';
import { sanitizeHref } from '../../utils/security/sanitize';

// Size classes — hoisted to module scope (never recomputed)
const sizeClasses: Record<SkipLinkSize, string> = {
  sm: 'h-[var(--skip-link-height-sm)] py-[var(--skip-link-py-sm)] px-[var(--skip-link-px-sm)] text-button-sm',
  md: 'h-[var(--skip-link-height-md)] py-[var(--skip-link-py-md)] px-[var(--skip-link-px-md)] text-button-md',
};

// Base classes — static, never changes
const BASE_CLASSES = 'skip-link content-nowrap focus-visible:outline-none focus-visible:focus-ring';

export const SkipLink = memo(
  forwardRef<HTMLAnchorElement, SkipLinkProps>(
    (
      {
        href,
        size = 'md',
        forceVisible = false,
        children,
        i18nStrings,
        className,
        ...rest
      },
      ref,
    ) => {
      const i18n = useComponentI18n('skiplink', i18nStrings);
      const safeHref = useMemo(() => sanitizeHref(href), [href]);
      const resolvedLabel = children ?? i18n.label;

      const classes = useMemo(
        () =>
          [
            BASE_CLASSES,
            sizeClasses[size],
            forceVisible ? 'skip-link--force-visible' : '',
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [size, forceVisible, className],
      );

      return (
        <a ref={ref} href={safeHref} className={classes} {...rest}>
          {resolvedLabel}
        </a>
      );
    },
  ),
);

SkipLink.displayName = 'SkipLink';
