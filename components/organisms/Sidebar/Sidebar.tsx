"use client";

import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { PanelLeft } from 'lucide-react';
import { Skeleton } from '../../atoms/Skeleton/Skeleton';
import { sanitizeHref } from '../../utils/security/sanitize';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type {
  SidebarCollapsible,
  SidebarComposite,
  SidebarContentProps,
  SidebarContextValue,
  SidebarFooterProps,
  SidebarGroupActionProps,
  SidebarGroupContentProps,
  SidebarGroupLabelProps,
  SidebarGroupProps,
  SidebarHeaderProps,
  SidebarInsetProps,
  SidebarMenuActionProps,
  SidebarMenuBadgeProps,
  SidebarMenuButtonProps,
  SidebarMenuItemProps,
  SidebarMenuProps,
  SidebarMenuSkeletonProps,
  SidebarMenuSubButtonProps,
  SidebarMenuSubItemProps,
  SidebarMenuSubProps,
  SidebarMenuBadgeProps as _MBadge,
  SidebarProps,
  SidebarProviderProps,
  SidebarRailProps,
  SidebarSeparatorProps,
  SidebarTriggerProps,
} from './Sidebar.types';

// ── Constants ──────────────────────────────────────────────────────────────

const MOBILE_BREAKPOINT = 768;
const STORAGE_KEY = 'sidebar:state';

// ── Context ────────────────────────────────────────────────────────────────

const SidebarCtx = createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarCtx);
  if (!ctx) throw new Error('useSidebar must be used inside <SidebarProvider>.');
  return ctx;
}

// ── Module-scope static strings ────────────────────────────────────────────

const PROVIDER_BASE =
  'group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-[var(--sidebar-inset-bg)]';

const ASIDE_BASE =
  'flex flex-col h-full bg-[var(--sidebar-bg)] overflow-hidden transition-[width,transform] ease-[var(--ease-default)] duration-[var(--sidebar-transition-width)]';

const MOBILE_OVERLAY =
  'fixed inset-0 z-[var(--layer-overlay)] bg-[var(--sidebar-overlay-bg)] transition-opacity duration-[var(--duration-enter)]';

const HEADER_BASE =
  'flex shrink-0 flex-col gap-[var(--sidebar-header-gap)] p-[var(--sidebar-header-padding-x)]';

const CONTENT_BASE =
  'flex min-h-0 flex-1 flex-col gap-[var(--sidebar-content-gap)] overflow-auto px-[var(--sidebar-content-padding-x)] py-[var(--sidebar-content-padding-y)]';

const FOOTER_BASE =
  'flex shrink-0 flex-col gap-[var(--sidebar-footer-gap)] p-[var(--sidebar-footer-padding-x)] border-t border-[var(--sidebar-divider-color)]';

const GROUP_BASE =
  'relative flex w-full min-w-0 flex-col p-[var(--sidebar-group-padding-y)]_[var(--sidebar-group-padding-x)]';

const GROUP_LABEL_BASE =
  'flex h-[var(--size-component-sm)] shrink-0 items-center rounded-[var(--radius-component-md)] px-[var(--sidebar-group-label-padding-x)] text-overline-md text-[var(--sidebar-group-label-color)] truncate-label';

const GROUP_ACTION_BASE =
  'absolute end-[var(--sidebar-group-padding-x)] top-[var(--sidebar-group-padding-y)] inline-flex items-center justify-center w-[var(--sidebar-group-action-size)] h-[var(--sidebar-group-action-size)] rounded-[var(--sidebar-group-action-radius)] text-[var(--sidebar-group-action-color)] hover:bg-[var(--sidebar-group-action-bg-hover)] hover:text-[var(--sidebar-group-action-color-hover)] transition-default focus-visible:outline-none focus-visible:focus-ring cursor-pointer';

const GROUP_CONTENT_BASE = 'w-full text-sm';

const MENU_BASE =
  'flex w-full min-w-0 flex-col gap-[var(--sidebar-menu-gap)] list-none m-0 p-0';

const MENU_ITEM_BASE = 'group/menu-item relative list-none';

const MENU_ACTION_BASE =
  'absolute end-1 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-[var(--sidebar-menu-action-size)] h-[var(--sidebar-menu-action-size)] rounded-[var(--sidebar-menu-action-radius)] text-[var(--sidebar-menu-action-color)] hover:bg-[var(--sidebar-menu-action-bg-hover)] hover:text-[var(--sidebar-menu-action-color-hover)] transition-default focus-visible:outline-none focus-visible:focus-ring cursor-pointer';

const MENU_BADGE_BASE =
  'pointer-events-none ms-auto text-overline-sm text-[var(--sidebar-menu-badge-color)] select-none tabindex-[-1]';

const MENU_SUB_BASE = [
  'ms-[var(--sidebar-menu-sub-indent)]',
  'border-s border-[var(--sidebar-menu-sub-border)]',
  'ps-[var(--spacing-component-sm)]',
  'py-[var(--spacing-component-xs)]',
  'flex flex-col gap-[var(--sidebar-menu-sub-gap)]',
  'list-none m-0',
].join(' ');

const SEPARATOR_BASE =
  'my-[var(--sidebar-separator-margin-y)] h-px w-full border-none bg-[var(--sidebar-separator-color)]';

const RAIL_BASE =
  'absolute inset-y-0 z-20 hidden w-[var(--sidebar-rail-width)] -translate-x-1/2 border-none bg-transparent transition-colors duration-[var(--duration-interaction)] hover:bg-[var(--sidebar-rail-bg-hover)] sm:flex cursor-w-resize after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] focus-visible:outline-none focus-visible:focus-ring';

// ── SidebarProvider ────────────────────────────────────────────────────────

export const SidebarProvider = memo(
  forwardRef<HTMLDivElement, SidebarProviderProps>(
    (
      {
        defaultOpen = true,
        open: openProp,
        onOpenChange,
        shortcut = 'b',
        persist = false,
        i18nStrings,
        children,
        className,
        style,
        ...rest
      },
      ref,
    ) => {
      // Initialise false — safe for SSR. useEffect below syncs after mount.
      const [isMobile, setIsMobile] = useState(false);
      const [openMobile, setOpenMobile] = useState(false);

      // Initialise from defaultOpen — safe for SSR. useEffect below restores
      // persisted state client-side after mount, avoiding a hydration mismatch.
      const [openInternal, setOpenInternal] = useState(defaultOpen);

      useEffect(() => {
        if (!persist) return;
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'open') setOpenInternal(true);
        else if (stored === 'closed') setOpenInternal(false);
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

      const open = openProp !== undefined ? openProp : openInternal;

      const setOpen = useCallback(
        (value: boolean) => {
          if (persist) localStorage.setItem(STORAGE_KEY, value ? 'open' : 'closed');
          if (onOpenChange) onOpenChange(value);
          else setOpenInternal(value);
        },
        [onOpenChange, persist],
      );

      const toggleSidebar = useCallback(() => {
        if (isMobile) setOpenMobile((v) => !v);
        else setOpen(!open);
      }, [isMobile, open, setOpen]);

      // Track mobile breakpoint
      useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
        const handler = (e: MediaQueryListEvent) => {
          setIsMobile(e.matches);
          if (!e.matches) setOpenMobile(false);
        };
        mq.addEventListener('change', handler);
        setIsMobile(mq.matches);
        return () => mq.removeEventListener('change', handler);
      }, []);

      // Keyboard shortcut
      useEffect(() => {
        if (!shortcut) return;
        const handler = (e: KeyboardEvent) => {
          if ((e.metaKey || e.ctrlKey) && e.key === shortcut) {
            e.preventDefault();
            toggleSidebar();
          }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
      }, [shortcut, toggleSidebar]);

      const state = open ? 'expanded' : 'collapsed';

      const ctx = useMemo<SidebarContextValue>(
        () => ({
          state,
          open,
          setOpen,
          openMobile,
          setOpenMobile,
          isMobile,
          toggleSidebar,
          collapsible: 'offcanvas', // overridden by SidebarRoot via context update pattern
          i18nStrings,
        }),
        [state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar, i18nStrings],
      );

      const providerClasses = useMemo(
        () => [PROVIDER_BASE, className].filter(Boolean).join(' '),
        [className],
      );

      return (
        <SidebarCtx.Provider value={ctx}>
          {/* Mobile backdrop */}
          {isMobile && openMobile && (
            <div
              className={MOBILE_OVERLAY}
              onClick={() => setOpenMobile(false)}
              aria-hidden="true"
            />
          )}
          <div
            ref={ref}
            className={providerClasses}
            style={
              {
                '--sidebar-width': '16rem',
                '--sidebar-width-icon': 'var(--size-component-2xl)',
                ...style,
              } as React.CSSProperties
            }
            {...rest}
          >
            {children}
          </div>
        </SidebarCtx.Provider>
      );
    },
  ),
);
SidebarProvider.displayName = 'SidebarProvider';

// ── SidebarRoot ────────────────────────────────────────────────────────────

const SidebarRoot = memo(
  forwardRef<HTMLElement, SidebarProps>(
    (
      {
        side = 'left',
        variant = 'sidebar',
        collapsible = 'offcanvas',
        children,
        className,
        ...rest
      },
      ref,
    ) => {
      // Best-effort: get context if provider is present
      const ctx = useContext(SidebarCtx);

      // If no provider, render static non-collapsible sidebar
      const state = ctx?.state ?? 'expanded';
      const open = ctx?.open ?? true;
      const openMobile = ctx?.openMobile ?? false;
      const isMobile = ctx?.isMobile ?? false;

      // Override collapsible in context so children can read it
      const collapsibleForCtx = collapsible;

      const asideClasses = useMemo(() => {
        const widthClass =
          collapsible === 'none'
            ? 'w-[var(--sidebar-width)]'
            : collapsible === 'icon'
              ? state === 'collapsed'
                ? 'w-[var(--sidebar-width-icon)]'
                : 'w-[var(--sidebar-width)]'
              : // offcanvas
                state === 'collapsed'
                ? 'w-0'
                : 'w-[var(--sidebar-width)]';

        const positionClass = isMobile
          ? [
              'fixed inset-y-0 z-[var(--layer-dialog)]',
              side === 'left' ? 'start-0' : 'end-0',
              openMobile ? 'w-[var(--sidebar-width-mobile)]' : 'w-0',
            ].join(' ')
          : '';

        const floatingClass =
          variant === 'floating'
            ? [
                'm-[var(--sidebar-floating-margin)]',
                'rounded-[var(--sidebar-floating-radius)]',
                'shadow-[var(--sidebar-floating-shadow)]',
                'border border-[var(--sidebar-border-color)]',
                'h-[calc(100svh-calc(var(--sidebar-floating-margin)*2))]',
              ].join(' ')
            : variant === 'sidebar'
              ? 'border-e border-[var(--sidebar-border-color)] h-svh'
              : 'h-svh'; // inset

        return [ASIDE_BASE, widthClass, positionClass, floatingClass, className]
          .filter(Boolean)
          .join(' ');
      }, [collapsible, state, isMobile, side, openMobile, variant, className]);

      // If a provider is present, wrap with an updated ctx that has collapsible
      const updatedCtx = useMemo<SidebarContextValue | null>(() => {
        if (!ctx) return null;
        return { ...ctx, collapsible: collapsibleForCtx };
      }, [ctx, collapsibleForCtx]);

      const aside = (
        <aside
          ref={ref as React.Ref<HTMLElement>}
          data-state={state}
          data-collapsible={collapsible === 'none' ? 'none' : state === 'collapsed' ? collapsible : ''}
          data-variant={variant}
          data-side={side}
          className={asideClasses}
          {...rest}
        >
          {children}
        </aside>
      );

      if (updatedCtx) {
        return (
          <SidebarCtx.Provider value={updatedCtx}>
            {aside}
          </SidebarCtx.Provider>
        );
      }

      return aside;
    },
  ),
);
SidebarRoot.displayName = 'Sidebar';

// ── SidebarHeader ──────────────────────────────────────────────────────────

export const SidebarHeader = memo(
  forwardRef<HTMLDivElement, SidebarHeaderProps>(({ children, className, ...rest }, ref) => {
    const classes = useMemo(
      () => [HEADER_BASE, className].filter(Boolean).join(' '),
      [className],
    );
    return (
      <div ref={ref} data-sidebar="header" className={classes} {...rest}>
        {children}
      </div>
    );
  }),
);
SidebarHeader.displayName = 'SidebarHeader';

// ── SidebarContent ─────────────────────────────────────────────────────────

export const SidebarContent = memo(
  forwardRef<HTMLElement, SidebarContentProps>(({ children, className, ...rest }, ref) => {
    const classes = useMemo(
      () => [CONTENT_BASE, className].filter(Boolean).join(' '),
      [className],
    );
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        data-sidebar="content"
        className={classes}
        {...rest}
      >
        {children}
      </div>
    );
  }),
);
SidebarContent.displayName = 'SidebarContent';

// ── SidebarFooter ──────────────────────────────────────────────────────────

export const SidebarFooter = memo(
  forwardRef<HTMLDivElement, SidebarFooterProps>(({ children, className, ...rest }, ref) => {
    const classes = useMemo(
      () => [FOOTER_BASE, className].filter(Boolean).join(' '),
      [className],
    );
    return (
      <div ref={ref} data-sidebar="footer" className={classes} {...rest}>
        {children}
      </div>
    );
  }),
);
SidebarFooter.displayName = 'SidebarFooter';

// ── SidebarGroup ───────────────────────────────────────────────────────────

export const SidebarGroup = memo(
  forwardRef<HTMLDivElement, SidebarGroupProps>(({ children, className, ...rest }, ref) => {
    const classes = useMemo(
      () => [GROUP_BASE, className].filter(Boolean).join(' '),
      [className],
    );
    return (
      <div ref={ref} data-sidebar="group" className={classes} {...rest}>
        {children}
      </div>
    );
  }),
);
SidebarGroup.displayName = 'SidebarGroup';

// ── SidebarGroupLabel ──────────────────────────────────────────────────────

export const SidebarGroupLabel = memo(
  forwardRef<HTMLDivElement, SidebarGroupLabelProps>(({ children, className, ...rest }, ref) => {
    const { state, collapsible } = useSidebar();
    const hidden = state === 'collapsed' && collapsible === 'icon';

    const classes = useMemo(
      () =>
        [
          GROUP_LABEL_BASE,
          hidden ? 'sr-only' : '',
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [hidden, className],
    );

    return (
      <div ref={ref} data-sidebar="group-label" className={classes} {...rest}>
        {children}
      </div>
    );
  }),
);
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

// ── SidebarGroupAction ─────────────────────────────────────────────────────

export const SidebarGroupAction = memo(
  forwardRef<HTMLButtonElement, SidebarGroupActionProps>(
    ({ children, className, ...rest }, ref) => {
      const classes = useMemo(
        () => [GROUP_ACTION_BASE, className].filter(Boolean).join(' '),
        [className],
      );
      return (
        <button
          ref={ref}
          type="button"
          data-sidebar="group-action"
          className={classes}
          {...rest}
        >
          {children}
        </button>
      );
    },
  ),
);
SidebarGroupAction.displayName = 'SidebarGroupAction';

// ── SidebarGroupContent ────────────────────────────────────────────────────

export const SidebarGroupContent = memo(
  forwardRef<HTMLDivElement, SidebarGroupContentProps>(({ children, className, ...rest }, ref) => {
    const classes = useMemo(
      () => [GROUP_CONTENT_BASE, className].filter(Boolean).join(' '),
      [className],
    );
    return (
      <div ref={ref} data-sidebar="group-content" className={classes} {...rest}>
        {children}
      </div>
    );
  }),
);
SidebarGroupContent.displayName = 'SidebarGroupContent';

// ── SidebarMenu ────────────────────────────────────────────────────────────

export const SidebarMenu = memo(
  forwardRef<HTMLUListElement, SidebarMenuProps>(({ children, className, ...rest }, ref) => {
    const classes = useMemo(
      () => [MENU_BASE, className].filter(Boolean).join(' '),
      [className],
    );
    return (
      <ul ref={ref} data-sidebar="menu" className={classes} {...rest}>
        {children}
      </ul>
    );
  }),
);
SidebarMenu.displayName = 'SidebarMenu';

// ── SidebarMenuItem ────────────────────────────────────────────────────────

export const SidebarMenuItem = memo(
  forwardRef<HTMLLIElement, SidebarMenuItemProps>(({ children, className, ...rest }, ref) => {
    const classes = useMemo(
      () => [MENU_ITEM_BASE, className].filter(Boolean).join(' '),
      [className],
    );
    return (
      <li ref={ref} data-sidebar="menu-item" className={classes} {...rest}>
        {children}
      </li>
    );
  }),
);
SidebarMenuItem.displayName = 'SidebarMenuItem';

// ── SidebarMenuButton ──────────────────────────────────────────────────────

const menuButtonSizeClasses: Record<string, string> = {
  sm: 'h-[var(--sidebar-menu-button-height-sm)] text-body-xs',
  md: 'h-[var(--sidebar-menu-button-height-md)] text-body-sm',
  lg: 'h-[var(--sidebar-menu-button-height-lg)] text-body-md',
};

export const SidebarMenuButton = memo(
  forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
    (
      {
        href,
        isActive = false,
        size = 'md',
        icon,
        tooltip,
        suffix,
        schema = false,
        children,
        className,
        disabled,
        ...rest
      },
      ref,
    ) => {
      const { state, collapsible } = useSidebar();
      const isIconMode = state === 'collapsed' && collapsible === 'icon';
      const safeHref = useMemo(() => sanitizeHref(href), [href]);

      const effectiveTooltip =
        tooltip ??
        (typeof children === 'string' ? children : undefined);

      const classes = useMemo(
        () =>
          [
            'group/menu-button',
            'flex w-full items-center gap-[var(--sidebar-menu-button-gap)]',
            'rounded-[var(--sidebar-menu-button-radius)]',
            'px-[var(--sidebar-menu-button-padding-x)]',
            menuButtonSizeClasses[size] ?? menuButtonSizeClasses.md,
            'transition-default',
            'focus-visible:outline-none focus-visible:focus-ring',
            'text-start',
            isIconMode ? 'justify-center px-0' : '',
            isActive
              ? 'bg-[var(--sidebar-menu-button-bg-active)] text-[var(--sidebar-menu-button-text-active)] font-medium'
              : [
                  'bg-[var(--sidebar-menu-button-bg)]',
                  'text-[var(--sidebar-menu-button-text)]',
                  'hover:bg-[var(--sidebar-menu-button-bg-hover)]',
                  'hover:text-[var(--sidebar-menu-button-text-hover)]',
                ].join(' '),
            disabled
              ? 'text-[var(--navitem-text-disabled)] cursor-not-allowed pointer-events-none'
              : 'cursor-pointer',
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [isIconMode, isActive, size, disabled, className],
      );

      // lg buttons (workspace switcher / user footer) hold a 32×32 badge/avatar —
      // no size clamp so the icon content dictates its own dimensions.
      const iconClasses =
        size === 'lg'
          ? 'shrink-0 inline-flex items-center justify-center text-[var(--sidebar-menu-button-icon-color)]'
          : 'shrink-0 inline-flex items-center justify-center w-[var(--size-icon-sm)] h-[var(--size-icon-sm)] text-[var(--sidebar-menu-button-icon-color)]';

      const content = (
        <>
          {icon && (
            <span className={iconClasses} aria-hidden="true">
              {icon}
            </span>
          )}
          {!isIconMode && children}
          {!isIconMode && suffix && (
            <span
              className="ms-auto shrink-0 inline-flex items-center justify-center w-[var(--size-icon-sm)] h-[var(--size-icon-sm)] text-[var(--color-text-tertiary)] transition-default overflow-hidden"
              aria-hidden="true"
            >
              {suffix}
            </span>
          )}
        </>
      );

      const schemaProps =
        schema && !!href
          ? {
              itemScope: true,
              itemType: 'https://schema.org/SiteNavigationElement',
            }
          : {};

      if (href) {
        return (
          <a
            ref={ref as unknown as React.Ref<HTMLAnchorElement>}
            href={safeHref}
            title={isIconMode ? effectiveTooltip : undefined}
            aria-current={isActive ? 'page' : undefined}
            aria-disabled={disabled || undefined}
            className={classes}
            data-active={isActive || undefined}
            {...schemaProps}
            {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {content}
          </a>
        );
      }

      return (
        <button
          ref={ref}
          type="button"
          title={isIconMode ? effectiveTooltip : undefined}
          disabled={disabled}
          aria-disabled={disabled || undefined}
          aria-current={isActive ? 'page' : undefined}
          className={classes}
          data-active={isActive || undefined}
          {...rest}
        >
          {content}
        </button>
      );
    },
  ),
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

// ── SidebarMenuAction ──────────────────────────────────────────────────────

export const SidebarMenuAction = memo(
  forwardRef<HTMLButtonElement, SidebarMenuActionProps>(
    ({ children, className, showOnHover = true, ...rest }, ref) => {
      const classes = useMemo(
        () =>
          [
            MENU_ACTION_BASE,
            showOnHover
              ? 'opacity-0 group-hover/menu-item:opacity-100 group-focus-within/menu-item:opacity-100'
              : '',
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [showOnHover, className],
      );
      return (
        <button
          ref={ref}
          type="button"
          data-sidebar="menu-action"
          className={classes}
          {...rest}
        >
          {children}
        </button>
      );
    },
  ),
);
SidebarMenuAction.displayName = 'SidebarMenuAction';

// ── SidebarMenuBadge ───────────────────────────────────────────────────────

export const SidebarMenuBadge = memo(
  forwardRef<HTMLSpanElement, SidebarMenuBadgeProps>(({ children, className, ...rest }, ref) => {
    const classes = useMemo(
      () => [MENU_BADGE_BASE, className].filter(Boolean).join(' '),
      [className],
    );
    return (
      <span ref={ref} data-sidebar="menu-badge" className={classes} {...rest}>
        {children}
      </span>
    );
  }),
);
SidebarMenuBadge.displayName = 'SidebarMenuBadge';

// ── SidebarMenuSkeleton ────────────────────────────────────────────────────

export const SidebarMenuSkeleton = memo(
  forwardRef<HTMLDivElement, SidebarMenuSkeletonProps>(
    ({ showIcon = true, className, ...rest }, ref) => {
      const { state, collapsible } = useSidebar();
      const isIconMode = state === 'collapsed' && collapsible === 'icon';

      const classes = useMemo(
        () =>
          [
            'flex h-[var(--sidebar-menu-button-height-md)] items-center gap-[var(--sidebar-menu-button-gap)] rounded-[var(--sidebar-menu-button-radius)] px-[var(--sidebar-menu-button-padding-x)]',
            isIconMode ? 'justify-center px-0' : '',
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [isIconMode, className],
      );

      return (
        <div ref={ref} data-sidebar="menu-skeleton" className={classes} {...rest}>
          {showIcon && (
            <Skeleton
              variant="box"
              width="var(--size-icon-sm)"
              height="var(--size-icon-sm)"
              className="rounded-[var(--radius-component-sm)] shrink-0"
            />
          )}
          {!isIconMode && <Skeleton variant="text" size="md" width="60%" />}
        </div>
      );
    },
  ),
);
SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton';

// ── SidebarMenuSub ─────────────────────────────────────────────────────────

export const SidebarMenuSub = memo(
  forwardRef<HTMLUListElement, SidebarMenuSubProps>(({ children, className, ...rest }, ref) => {
    const { state, collapsible } = useSidebar();
    const isIconMode = state === 'collapsed' && collapsible === 'icon';

    const classes = useMemo(
      () =>
        [
          MENU_SUB_BASE,
          isIconMode ? 'hidden' : '',
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [isIconMode, className],
    );

    return (
      <ul ref={ref} data-sidebar="menu-sub" className={classes} {...rest}>
        {children}
      </ul>
    );
  }),
);
SidebarMenuSub.displayName = 'SidebarMenuSub';

// ── SidebarMenuSubItem ─────────────────────────────────────────────────────

export const SidebarMenuSubItem = memo(
  forwardRef<HTMLLIElement, SidebarMenuSubItemProps>(({ children, className, ...rest }, ref) => (
    <li ref={ref} data-sidebar="menu-sub-item" className={className} {...rest}>
      {children}
    </li>
  )),
);
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

// ── SidebarMenuSubButton ───────────────────────────────────────────────────

export const SidebarMenuSubButton = memo(
  forwardRef<HTMLButtonElement, SidebarMenuSubButtonProps>(
    ({ href, isActive = false, disabled, children, className, ...rest }, ref) => {
      const safeHref = useMemo(() => sanitizeHref(href), [href]);

      const classes = useMemo(
        () =>
          [
            'flex w-full min-w-0 items-center gap-[var(--sidebar-menu-button-gap)]',
            'h-[var(--sidebar-menu-sub-button-height)]',
            'rounded-[var(--sidebar-menu-sub-button-radius)]',
            'px-[var(--sidebar-menu-sub-button-padding-x)]',
            'text-body-sm text-start',
            'transition-default',
            'focus-visible:outline-none focus-visible:focus-ring',
            isActive
              ? 'bg-[var(--sidebar-menu-sub-button-bg-active)] text-[var(--sidebar-menu-sub-button-text-active)] font-medium'
              : [
                  'text-[var(--sidebar-menu-sub-button-text)]',
                  'hover:bg-[var(--sidebar-menu-sub-button-bg-hover)]',
                  'hover:text-[var(--sidebar-menu-button-text-hover)]',
                ].join(' '),
            disabled ? 'cursor-not-allowed pointer-events-none opacity-50' : 'cursor-pointer',
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [isActive, disabled, className],
      );

      if (href) {
        return (
          <a
            ref={ref as unknown as React.Ref<HTMLAnchorElement>}
            href={safeHref}
            aria-current={isActive ? 'page' : undefined}
            aria-disabled={disabled || undefined}
            className={classes}
            {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {children}
          </a>
        );
      }

      return (
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          aria-current={isActive ? 'page' : undefined}
          className={classes}
          {...rest}
        >
          {children}
        </button>
      );
    },
  ),
);
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';

// ── SidebarSeparator ───────────────────────────────────────────────────────

export const SidebarSeparator = memo(
  forwardRef<HTMLElement, SidebarSeparatorProps>(({ className, ...rest }, ref) => {
    const classes = useMemo(
      () => [SEPARATOR_BASE, className].filter(Boolean).join(' '),
      [className],
    );
    return (
      <hr
        ref={ref as React.Ref<HTMLHRElement>}
        data-sidebar="separator"
        className={classes}
        {...rest}
      />
    );
  }),
);
SidebarSeparator.displayName = 'SidebarSeparator';

// ── SidebarTrigger ─────────────────────────────────────────────────────────

export const SidebarTrigger = memo(
  forwardRef<HTMLButtonElement, SidebarTriggerProps>(({ className, onClick, ...rest }, ref) => {
    const { toggleSidebar, i18nStrings: ctxI18n } = useSidebar();
    const i18n = useComponentI18n('sidebar', ctxI18n);

    const classes = useMemo(
      () =>
        [
          'inline-flex items-center justify-center',
          'w-[var(--sidebar-toggle-size)] h-[var(--sidebar-toggle-size)]',
          'rounded-[var(--sidebar-toggle-radius)]',
          'text-[var(--sidebar-toggle-color)]',
          'hover:bg-[var(--sidebar-toggle-bg-hover)] hover:text-[var(--sidebar-toggle-color-hover)]',
          'transition-default',
          'focus-visible:outline-none focus-visible:focus-ring',
          'cursor-pointer',
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [className],
    );

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        toggleSidebar();
      },
      [onClick, toggleSidebar],
    );

    return (
      <button
        ref={ref}
        type="button"
        aria-label={i18n.sidebarLabel ?? 'Toggle sidebar'}
        className={classes}
        onClick={handleClick}
        {...rest}
      >
        <PanelLeft size="var(--size-icon-sm)" aria-hidden="true" />
      </button>
    );
  }),
);
SidebarTrigger.displayName = 'SidebarTrigger';

// ── SidebarRail ────────────────────────────────────────────────────────────

export const SidebarRail = memo(
  forwardRef<HTMLButtonElement, SidebarRailProps>(({ className, ...rest }, ref) => {
    const { toggleSidebar, state, i18nStrings: ctxI18n } = useSidebar();
    const i18n = useComponentI18n('sidebar', ctxI18n);

    const classes = useMemo(
      () =>
        [
          RAIL_BASE,
          state === 'collapsed' ? 'end-auto start-full cursor-e-resize' : '-end-1 cursor-w-resize',
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [state, className],
    );

    return (
      <button
        ref={ref}
        type="button"
        aria-label={state === 'collapsed' ? (i18n.expandLabel ?? 'Expand sidebar') : (i18n.collapseLabel ?? 'Collapse sidebar')}
        data-sidebar="rail"
        className={classes}
        onClick={toggleSidebar}
        tabIndex={-1}
        {...rest}
      />
    );
  }),
);
SidebarRail.displayName = 'SidebarRail';

// ── SidebarInset ───────────────────────────────────────────────────────────

export const SidebarInset = memo(
  forwardRef<HTMLElement, SidebarInsetProps>(({ children, className, ...rest }, ref) => {
    const classes = useMemo(
      () =>
        [
          'relative flex min-h-svh flex-1 flex-col bg-[var(--sidebar-inset-bg)]',
          'peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))]',
          'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:rounded-[var(--sidebar-inset-radius)]',
          'md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ms-2',
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [className],
    );
    return (
      <main ref={ref as React.Ref<HTMLElement>} className={classes} {...rest}>
        {children}
      </main>
    );
  }),
);
SidebarInset.displayName = 'SidebarInset';

// ── Compound assembly ──────────────────────────────────────────────────────

const Sidebar = SidebarRoot as unknown as SidebarComposite;
Sidebar.Header = SidebarHeader;
Sidebar.Content = SidebarContent;
Sidebar.Footer = SidebarFooter;
Sidebar.Group = SidebarGroup;
Sidebar.GroupLabel = SidebarGroupLabel;
Sidebar.GroupAction = SidebarGroupAction;
Sidebar.GroupContent = SidebarGroupContent;
Sidebar.Menu = SidebarMenu;
Sidebar.MenuItem = SidebarMenuItem;
Sidebar.MenuButton = SidebarMenuButton;
Sidebar.MenuAction = SidebarMenuAction;
Sidebar.MenuBadge = SidebarMenuBadge;
Sidebar.MenuSkeleton = SidebarMenuSkeleton;
Sidebar.MenuSub = SidebarMenuSub;
Sidebar.MenuSubItem = SidebarMenuSubItem;
Sidebar.MenuSubButton = SidebarMenuSubButton;
Sidebar.Separator = SidebarSeparator;
Sidebar.Trigger = SidebarTrigger;
Sidebar.Rail = SidebarRail;
Sidebar.Inset = SidebarInset;

export { Sidebar };
export type {
  SidebarCollapsible,
  SidebarProps,
  SidebarProviderProps,
  SidebarHeaderProps,
  SidebarContentProps,
  SidebarFooterProps,
  SidebarGroupProps,
  SidebarGroupLabelProps,
  SidebarGroupActionProps,
  SidebarGroupContentProps,
  SidebarMenuProps,
  SidebarMenuItemProps,
  SidebarMenuButtonProps,
  SidebarMenuActionProps,
  SidebarMenuBadgeProps,
  SidebarMenuSkeletonProps,
  SidebarMenuSubProps,
  SidebarMenuSubItemProps,
  SidebarMenuSubButtonProps,
  SidebarSeparatorProps,
  SidebarTriggerProps,
  SidebarRailProps,
  SidebarInsetProps,
};
