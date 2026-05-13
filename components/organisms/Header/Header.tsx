"use client";

import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '../../atoms/Button/Button';
import { sanitizeHref } from '../../utils/security/sanitize';
import { useEscapeDismiss } from '../../utils/keyboard';
import { useClickOutside } from '../../utils/keyboard';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type {
  HeaderActionsProps,
  HeaderBrandProps,
  HeaderComposite,
  HeaderNavProps,
  HeaderProps,
} from './Header.types';

// ── Context ───────────────────────────────────────────────────────────────────

interface HeaderContextValue {
  mobileOpen: boolean;
  toggleMobile: () => void;
  mobileNavId: string;
  i18n: ReturnType<typeof useComponentI18n<'header'>>;
  loading: boolean;
}

const HeaderContext = createContext<HeaderContextValue | null>(null);

function useHeader(): HeaderContextValue {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error('Header compound components must be used inside <Header>.');
  return ctx;
}

// ── Module-scope static strings ───────────────────────────────────────────────

const HEADER_BASE = [
  'relative w-full sticky top-0',
  'bg-[var(--header-bg)]',
  'border-b border-[var(--header-border-color)]',
  'shadow-[var(--header-shadow)]',
  'z-[var(--layer-sticky)]',
].join(' ');

const HEADER_INNER = [
  'flex items-center',
  'h-[var(--header-height)]',
  'px-[var(--header-px)]',
  'gap-[var(--header-gap)]',
].join(' ');

const BRAND_BASE = [
  'flex shrink-0 items-center',
  'gap-[var(--header-brand-gap)]',
  'text-[var(--header-brand-text-color)]',
  'text-heading-h5',
  'transition-default',
  'rounded-[var(--radius-component-sm)]',
  'focus-visible:outline-none focus-visible:focus-ring',
  'hover:text-[var(--header-brand-text-color-hover)]',
].join(' ');

const NAV_DESKTOP_BASE = [
  'hidden md:flex',
  'items-center',
  'flex-1',
].join(' ');

const ACTIONS_BASE = [
  'flex shrink-0 items-center',
  'gap-[var(--header-actions-gap)]',
  'ms-auto',
].join(' ');

// ── Internal: MobileToggle ────────────────────────────────────────────────────

const MobileToggle = memo(function MobileToggle() {
  const { mobileOpen, toggleMobile, mobileNavId, i18n } = useHeader();

  const label = mobileOpen ? i18n.closeMenuLabel! : i18n.openMenuLabel!;
  const ariaProps = useMemo(
    () => ({
      'aria-expanded': mobileOpen,
      'aria-controls': mobileNavId,
    }),
    [mobileOpen, mobileNavId],
  );

  return (
    <Button
      variant="ghost"
      size="sm"
      iconOnly
      leftIcon={
        mobileOpen ? (
          <X size="var(--size-icon-md)" aria-hidden="true" />
        ) : (
          <Menu size="var(--size-icon-md)" aria-hidden="true" />
        )
      }
      className="ms-auto md:hidden"
      onClick={toggleMobile}
      {...ariaProps}
    >
      {label}
    </Button>
  );
});
MobileToggle.displayName = 'Header.MobileToggle';

// ── Header.Brand ──────────────────────────────────────────────────────────────

const HeaderBrand = memo(
  forwardRef<HTMLAnchorElement, HeaderBrandProps>(
    ({ children, href, className, ...rest }, ref) => {
      const safeHref = useMemo(() => sanitizeHref(href), [href]);
      const classes = useMemo(
        () => [BRAND_BASE, className].filter(Boolean).join(' '),
        [className],
      );
      return (
        <a ref={ref} href={safeHref} className={classes} {...rest}>
          {children}
        </a>
      );
    },
  ),
);
HeaderBrand.displayName = 'Header.Brand';

// ── Header.Nav ────────────────────────────────────────────────────────────────

const NAV_SKELETON_ITEM = 'skeleton h-[var(--size-component-xs)] w-16 rounded-[var(--radius-component-sm)]';

const HeaderNav = memo(
  forwardRef<HTMLElement, HeaderNavProps>(({ children, className, ...rest }, ref) => {
    const { mobileOpen, mobileNavId, i18n, loading } = useHeader();

    const desktopClasses = useMemo(
      () => [NAV_DESKTOP_BASE, className].filter(Boolean).join(' '),
      [className],
    );

    const mobilePanelClasses = useMemo(
      () =>
        [
          'absolute inset-x-0 top-[var(--header-height)]',
          'bg-[var(--header-mobile-panel-bg)]',
          'border-b border-[var(--header-mobile-panel-border)]',
          'shadow-[var(--header-mobile-panel-shadow)]',
          'px-[var(--header-mobile-panel-px)] py-[var(--header-mobile-panel-py)]',
          'transition-enter',
          mobileOpen ? 'flex flex-col md:hidden' : 'hidden',
        ].join(' '),
      [mobileOpen],
    );

    const navContent = loading ? (
      <>
        <div className={NAV_SKELETON_ITEM} aria-hidden="true" />
        <div className={`${NAV_SKELETON_ITEM} w-20`} aria-hidden="true" />
        <div className={`${NAV_SKELETON_ITEM} w-14`} aria-hidden="true" />
        <div className={`${NAV_SKELETON_ITEM} w-24`} aria-hidden="true" />
      </>
    ) : children;

    return (
      <>
        {/* Desktop nav — visible on md+ only */}
        <nav ref={ref} aria-label={i18n.navLabel} className={desktopClasses} {...rest}>
          <ul className="flex items-center gap-[var(--header-nav-gap)] list-none m-0 p-0">
            {navContent}
          </ul>
        </nav>

        {/* Mobile nav panel — absolutely positioned below the header bar, mobile only */}
        <nav
          id={mobileNavId}
          aria-label={i18n.navLabel}
          className={mobilePanelClasses}
          aria-hidden={!mobileOpen || undefined}
        >
          <ul className="flex flex-col gap-[var(--header-nav-gap)] list-none m-0 p-0 w-full">
            {navContent}
          </ul>
        </nav>
      </>
    );
  }),
);
HeaderNav.displayName = 'Header.Nav';

// ── Header.Actions ────────────────────────────────────────────────────────────

const HeaderActions = memo(
  forwardRef<HTMLDivElement, HeaderActionsProps>(({ children, className, ...rest }, ref) => {
    const classes = useMemo(
      () => [ACTIONS_BASE, className].filter(Boolean).join(' '),
      [className],
    );
    return (
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    );
  }),
);
HeaderActions.displayName = 'Header.Actions';

// ── Header (root) ─────────────────────────────────────────────────────────────

const HeaderRoot = memo(
  forwardRef<HTMLElement, HeaderProps>(
    ({ children, schema, i18nStrings, loading = false, className, ...rest }, externalRef) => {
      const i18n = useComponentI18n('header', i18nStrings);
      const [mobileOpen, setMobileOpen] = useState(false);
      const mobileNavId = useId();
      const internalRef = useRef<HTMLElement>(null);

      const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), []);
      const closeMobile = useCallback(() => setMobileOpen(false), []);

      // Merge internal ref (for click-outside) with the consumer ref
      const setRef = useCallback(
        (el: HTMLElement | null) => {
          (internalRef as React.MutableRefObject<HTMLElement | null>).current = el;
          if (typeof externalRef === 'function') {
            externalRef(el);
          } else if (externalRef) {
            (externalRef as React.MutableRefObject<HTMLElement | null>).current = el;
          }
        },
        [externalRef],
      );

      useEscapeDismiss({ active: mobileOpen, onDismiss: closeMobile });
      useClickOutside({
        active: mobileOpen,
        containerRef: internalRef,
        onClickOutside: closeMobile,
      });

      const headerClasses = useMemo(
        () => [HEADER_BASE, className].filter(Boolean).join(' '),
        [className],
      );

      const ctxValue = useMemo(
        () => ({ mobileOpen, toggleMobile, mobileNavId, i18n, loading }),
        [mobileOpen, toggleMobile, mobileNavId, i18n, loading],
      );

      return (
        <HeaderContext.Provider value={ctxValue}>
          <header
            ref={setRef}
            className={headerClasses}
            {...(loading && { 'aria-busy': true })}
            {...(schema && {
              itemScope: true,
              itemType: 'https://schema.org/WPHeader',
            })}
            {...rest}
          >
            <div className={HEADER_INNER}>
              {children}
              <MobileToggle />
            </div>
            {/* Mobile nav panel is rendered by Header.Nav as a sibling of HEADER_INNER,
                positioned absolutely relative to <header> via position: sticky context. */}
          </header>
        </HeaderContext.Provider>
      );
    },
  ),
) as unknown as React.MemoExoticComponent<
  React.ForwardRefExoticComponent<HeaderProps & React.RefAttributes<HTMLElement>>
> &
  HeaderComposite;

HeaderRoot.displayName = 'Header';

// Attach compound slots as static properties
(HeaderRoot as unknown as HeaderComposite).Brand = HeaderBrand;
(HeaderRoot as unknown as HeaderComposite).Nav = HeaderNav;
(HeaderRoot as unknown as HeaderComposite).Actions = HeaderActions;

// Public exports
export const Header = HeaderRoot;
export { HeaderBrand, HeaderNav, HeaderActions };
