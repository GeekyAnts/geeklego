"use client";

import {
  Children,
  createContext,
  forwardRef,
  memo,
  useContext,
  useMemo,
} from 'react';
import { sanitizeHref } from '../../utils/security/sanitize';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type {
  FooterBrandProps,
  FooterComposite,
  FooterLegalProps,
  FooterNavProps,
  FooterProps,
  FooterSize,
} from './Footer.types';

// ── Context ───────────────────────────────────────────────────────────────────

interface FooterContextValue {
  i18n: ReturnType<typeof useComponentI18n<'footer'>>;
}

const FooterContext = createContext<FooterContextValue | null>(null);

function useFooter(): FooterContextValue {
  const ctx = useContext(FooterContext);
  if (!ctx) throw new Error('Footer compound components must be used inside <Footer>.');
  return ctx;
}

// ── Module-scope static strings (never recreated per render) ──────────────────

const FOOTER_BASE = [
  'w-full',
  'bg-[var(--footer-bg)]',
  'border-t border-[var(--footer-border-color)]',
  'shadow-[var(--footer-shadow)]',
].join(' ');

const BRAND_WRAPPER_BASE = [
  'flex flex-col',
  'gap-[var(--footer-brand-gap)]',
  'flex-none',
  'w-full sm:w-auto',
  'min-w-[var(--footer-brand-min-width)]',
].join(' ');

const BRAND_LINK_BASE = [
  'inline-flex items-center gap-[var(--footer-brand-gap)]',
  'text-[var(--footer-brand-text-color)]',
  'text-heading-h5',
  'rounded-[var(--radius-component-sm)]',
  'transition-default',
  'focus-visible:outline-none focus-visible:focus-ring',
  'hover:text-[var(--footer-brand-text-color-hover)]',
  'self-start',
].join(' ');

const TAGLINE_BASE = [
  'text-body-sm',
  'text-[var(--footer-brand-tagline-color)]',
  'truncate-label',
].join(' ');

const NAV_COLUMN_BASE = [
  'flex flex-col',
  'gap-[var(--footer-nav-heading-gap)]',
  'flex-1',
  'min-w-[var(--footer-nav-min-width)]',
].join(' ');

const NAV_HEADING_BASE = [
  'text-label-md',
  'text-[var(--footer-nav-heading-color)]',
  'truncate-label',
  'm-0',
].join(' ');

const NAV_LIST_BASE = [
  'flex flex-col',
  'gap-[var(--footer-nav-link-gap)]',
  'list-none m-0 p-0',
].join(' ');

const LEGAL_BASE = [
  'basis-full',
  'border-t border-[var(--footer-legal-border-color)]',
  'pt-[var(--footer-legal-pt)]',
  'flex flex-wrap items-center justify-between',
  'gap-[var(--footer-legal-gap)]',
  'text-body-sm text-[var(--footer-legal-text-color)]',
].join(' ');

// Size → padding classes
const sizeClasses: Record<FooterSize, string> = {
  sm: 'px-[var(--footer-px-sm)] py-[var(--footer-py-sm)]',
  md: 'px-[var(--footer-px-md)] py-[var(--footer-py-md)]',
  lg: 'px-[var(--footer-px-lg)] py-[var(--footer-py-lg)]',
};

// ── Footer.Brand ──────────────────────────────────────────────────────────────

const FooterBrand = memo(
  forwardRef<HTMLDivElement, FooterBrandProps>(
    ({ href = '#', tagline, children, className, ...rest }, ref) => {
      const safeHref = useMemo(() => sanitizeHref(href), [href]);

      const wrapperClasses = useMemo(
        () => [BRAND_WRAPPER_BASE, className].filter(Boolean).join(' '),
        [className],
      );

      return (
        <div ref={ref} className={wrapperClasses} {...rest}>
          <a href={safeHref} className={BRAND_LINK_BASE}>
            {children}
          </a>
          {tagline && <p className={TAGLINE_BASE}>{tagline}</p>}
        </div>
      );
    },
  ),
);
FooterBrand.displayName = 'Footer.Brand';

// ── Footer.Nav ────────────────────────────────────────────────────────────────

const FooterNav = memo(
  forwardRef<HTMLElement, FooterNavProps>(
    (
      { heading, headingLevel = 'h3', navAriaLabel, children, className, ...rest },
      ref,
    ) => {
      const { i18n } = useFooter();
      const resolvedNavLabel = navAriaLabel ?? i18n.navLabel;

      const columnClasses = useMemo(
        () => [NAV_COLUMN_BASE, className].filter(Boolean).join(' '),
        [className],
      );

      const HeadingTag = headingLevel;

      return (
        <nav ref={ref} aria-label={resolvedNavLabel} className={columnClasses} {...rest}>
          <HeadingTag className={NAV_HEADING_BASE}>{heading}</HeadingTag>
          <ul className={NAV_LIST_BASE}>
            {Children.map(children, (child) =>
              child != null ? (
                <li className="perf-contain-content">{child}</li>
              ) : null,
            )}
          </ul>
        </nav>
      );
    },
  ),
);
FooterNav.displayName = 'Footer.Nav';

// ── Footer.Legal ──────────────────────────────────────────────────────────────

const FooterLegal = memo(
  forwardRef<HTMLDivElement, FooterLegalProps>(
    ({ children, className, ...rest }, ref) => {
      const classes = useMemo(
        () => [LEGAL_BASE, className].filter(Boolean).join(' '),
        [className],
      );

      return (
        <div ref={ref} className={classes} {...rest}>
          {children}
        </div>
      );
    },
  ),
);
FooterLegal.displayName = 'Footer.Legal';

// ── Loading skeleton ──────────────────────────────────────────────────────────

const FooterLoadingSkeleton = () => (
  <div className="flex flex-wrap gap-[var(--footer-columns-gap)] w-full" aria-hidden="true">
    {/* Brand skeleton */}
    <div className="flex flex-col gap-[var(--spacing-component-md)] flex-none w-full sm:w-auto min-w-[var(--footer-brand-min-width)]">
      <div className="skeleton h-[var(--size-icon-xl)] w-32 rounded-[var(--radius-component-sm)]" />
      <div className="skeleton h-[var(--size-component-xs)] w-48 rounded-[var(--radius-component-sm)]" />
    </div>
    {/* Nav column skeletons */}
    {[40, 48, 36].map((w, i) => (
      <div key={i} className="flex flex-col gap-[var(--footer-nav-heading-gap)] flex-1 min-w-[var(--footer-nav-min-width)]">
        <div className={`skeleton h-[var(--size-component-xs)] w-${w === 40 ? '20' : w === 48 ? '24' : '16'} rounded-[var(--radius-component-sm)]`} />
        <div className="flex flex-col gap-[var(--footer-nav-link-gap)]">
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="skeleton h-[var(--size-component-xs)] w-3/4 rounded-[var(--radius-component-sm)]" />
          ))}
        </div>
      </div>
    ))}
    {/* Legal skeleton */}
    <div className="basis-full border-t border-[var(--footer-legal-border-color)] pt-[var(--footer-legal-pt)] flex items-center justify-between gap-[var(--footer-legal-gap)]">
      <div className="skeleton h-[var(--size-component-xs)] w-48 rounded-[var(--radius-component-sm)]" />
      <div className="skeleton h-[var(--size-component-xs)] w-40 rounded-[var(--radius-component-sm)]" />
    </div>
  </div>
);
FooterLoadingSkeleton.displayName = 'Footer.LoadingSkeleton';

// ── Footer (root) ─────────────────────────────────────────────────────────────

const FooterRoot = memo(
  forwardRef<HTMLElement, FooterProps>(
    ({ size = 'md', schema, loading = false, i18nStrings, className, children, ...rest }, ref) => {
      const i18n = useComponentI18n('footer', i18nStrings);

      const footerClasses = useMemo(
        () => [FOOTER_BASE, className].filter(Boolean).join(' '),
        [className],
      );

      const innerClasses = useMemo(
        () =>
          [
            sizeClasses[size],
            'min-w-[var(--footer-min-width)]',
            'flex flex-wrap gap-[var(--footer-columns-gap)]',
          ].join(' '),
        [size],
      );

      const ctxValue = useMemo(() => ({ i18n }), [i18n]);

      return (
        <FooterContext.Provider value={ctxValue}>
          <footer
            ref={ref}
            aria-label={i18n.footerLabel}
            aria-busy={loading || undefined}
            className={footerClasses}
            {...(schema && {
              itemScope: true,
              itemType: 'https://schema.org/WPFooter',
            })}
            {...rest}
          >
            <div className={innerClasses}>
              {loading ? <FooterLoadingSkeleton /> : children}
            </div>
          </footer>
        </FooterContext.Provider>
      );
    },
  ),
) as unknown as React.MemoExoticComponent<
  React.ForwardRefExoticComponent<FooterProps & React.RefAttributes<HTMLElement>>
> &
  FooterComposite;

FooterRoot.displayName = 'Footer';

// Attach compound slots as static properties
(FooterRoot as unknown as FooterComposite).Brand = FooterBrand;
(FooterRoot as unknown as FooterComposite).Nav = FooterNav;
(FooterRoot as unknown as FooterComposite).Legal = FooterLegal;

// Public exports
export const Footer = FooterRoot;
export { FooterBrand, FooterNav, FooterLegal };
