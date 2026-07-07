"use client";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { PanelLeft } from "lucide-react";
import { cn } from "../lib/cn";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../Sheet/Sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../Tooltip/Tooltip";
import { sidebarMenuButtonVariants } from "./sidebar-variants";
import type {
  SidebarContextValue,
  SidebarProviderProps,
  SidebarProps,
  SidebarHeaderProps,
  SidebarFooterProps,
  SidebarContentProps,
  SidebarGroupProps,
  SidebarGroupLabelProps,
  SidebarGroupContentProps,
  SidebarMenuProps,
  SidebarMenuItemProps,
  SidebarMenuButtonProps,
  SidebarMenuSubProps,
  SidebarMenuSubButtonProps,
  SidebarTriggerProps,
  SidebarInsetProps,
  SidebarRailProps,
  SidebarSeparatorProps,
} from "./Sidebar.types";

/**
 * Sidebar — ShadCN's composable navigation shell on geeklego's 2-tier tokens.
 *
 * There is no single Radix primitive for a collapsible app sidebar, so this is
 * a hand-built COMPOSITION (category C) that delegates its hard behavior to
 * shipped v2 components: the mobile drawer is the v2 `Sheet` (Radix Dialog —
 * focus trap, escape, scroll lock, portal), and collapsed icon-mode labels use
 * the v2 `Tooltip` (Radix Tooltip — delay, positioning, aria-describedby).
 * SidebarProvider owns the open/collapsed state + the mobile-breakpoint watch.
 *
 * The panel renders on its OWN surface — the --sidebar-* token group
 * (standard ShadCN core vocab; ShadCN ships a dedicated --sidebar-* group, so
 * in v2 these are core semantics, each chained to a primitive). The expanded / icon / mobile
 * widths map exactly onto existing spacing primitives (16rem = --spacing-64 →
 * `w-64`, 3rem = --spacing-12 → `w-12`, 18rem = --spacing-72 → `w-72`), so the
 * sidebar consumes the standard width utilities — no raw dimensions, no inline
 * width-var injection.
 */

const MOBILE_BREAKPOINT = 768;

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a <SidebarProvider>.");
  }
  return context;
}

/** Tracks whether the viewport is below the mobile breakpoint. */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

export const SidebarProvider = forwardRef<HTMLDivElement, SidebarProviderProps>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = useState(false);
    const [internalOpen, setInternalOpen] = useState(defaultOpen);

    const open = openProp ?? internalOpen;
    const setOpen = useCallback(
      (value: boolean) => {
        if (onOpenChange) onOpenChange(value);
        else setInternalOpen(value);
      },
      [onOpenChange],
    );

    const toggleSidebar = useCallback(() => {
      if (isMobile) setOpenMobile((v) => !v);
      else setOpen(!open);
    }, [isMobile, open, setOpen]);

    const state = open ? "expanded" : "collapsed";

    const contextValue = useMemo<SidebarContextValue>(
      () => ({
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, openMobile, isMobile, toggleSidebar],
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="sidebar-wrapper"
          className={cn(
            "flex min-h-svh w-full text-sidebar-foreground",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  },
);
SidebarProvider.displayName = "SidebarProvider";

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "icon",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    // Non-collapsible: a plain fixed-width panel.
    if (collapsible === "none") {
      return (
        <div
          ref={ref}
          data-slot="sidebar"
          className={cn(
            "flex h-full w-64 flex-col border-sidebar-border bg-sidebar-bg",
            side === "left" ? "border-r" : "border-l",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    // Mobile: render inside the v2 Sheet (Radix Dialog owns the behavior).
    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            side={side}
            showClose={false}
            data-slot="sidebar"
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-72 gap-0 border-sidebar-border bg-sidebar-bg p-0 text-sidebar-foreground sm:max-w-72"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>Application navigation.</SheetDescription>
            </SheetHeader>
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      );
    }

    // Desktop: a self-collapsing panel. data-state / data-collapsible drive the
    // width + icon-mode squeeze; group-data selectors on children read these.
    return (
      <div
        ref={ref}
        className="group peer hidden md:block"
        data-slot="sidebar"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* spacer reserves the layout gap so the inset content flows beside it.
            Widths map onto spacing primitives: 16rem=w-64, 3rem=w-12,
            4rem(=3rem icon+1rem padding for floating/inset)=w-16. */}
        <div
          className={cn(
            "relative h-svh w-64 bg-transparent transition-[width] duration-200 ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            variant === "sidebar"
              ? "group-data-[collapsible=icon]:w-12"
              : "group-data-[collapsible=icon]:w-16",
          )}
        />
        <div
          className={cn(
            "fixed inset-y-0 z-10 hidden h-svh w-64 transition-[left,right,width] duration-200 ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:-left-64"
              : "right-0 group-data-[collapsible=offcanvas]:-right-64",
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-16"
              : "group-data-[collapsible=icon]:w-12",
            className,
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className={cn(
              "flex h-full w-full flex-col bg-sidebar-bg text-sidebar-foreground",
              variant === "floating"
                ? "rounded-lg border border-sidebar-border shadow-sm"
                : variant === "inset"
                  ? "rounded-lg"
                  : side === "left"
                    ? "border-r border-sidebar-border"
                    : "border-l border-sidebar-border",
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);
Sidebar.displayName = "Sidebar";

export const SidebarTrigger = forwardRef<
  HTMLButtonElement,
  SidebarTriggerProps
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      ref={ref}
      type="button"
      data-slot="sidebar-trigger"
      aria-label="Toggle sidebar"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-sidebar-foreground",
        "transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        "[&>svg]:size-4",
        className,
      )}
      {...props}
    >
      <PanelLeft />
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

/** Rail — a thin click target along the panel edge that toggles the sidebar. */
export const SidebarRail = forwardRef<HTMLButtonElement, SidebarRailProps>(
  ({ className, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();
    return (
      <button
        ref={ref}
        type="button"
        data-slot="sidebar-rail"
        aria-label="Toggle sidebar"
        tabIndex={-1}
        onClick={toggleSidebar}
        title="Toggle sidebar"
        className={cn(
          "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all md:flex",
          "after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 hover:after:bg-sidebar-border",
          "group-data-[side=left]:-right-4 group-data-[side=right]:left-0",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarRail.displayName = "SidebarRail";

/** Inset — the main content region that sits beside the sidebar. */
export const SidebarInset = forwardRef<HTMLDivElement, SidebarInsetProps>(
  ({ className, ...props }, ref) => (
    <main
      ref={ref}
      data-slot="sidebar-inset"
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        className,
      )}
      {...props}
    />
  ),
);
SidebarInset.displayName = "SidebarInset";

/* ------------------------------------------------------------------ layout */

export const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  ),
);
SidebarHeader.displayName = "SidebarHeader";

export const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  ),
);
SidebarFooter.displayName = "SidebarFooter";

export const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2",
        "group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...props}
    />
  ),
);
SidebarContent.displayName = "SidebarContent";

export const SidebarSeparator = forwardRef<
  HTMLDivElement,
  SidebarSeparatorProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sidebar-separator"
    role="separator"
    aria-orientation="horizontal"
    className={cn("mx-2 h-px shrink-0 bg-sidebar-border", className)}
    {...props}
  />
));
SidebarSeparator.displayName = "SidebarSeparator";

/* ------------------------------------------------------------------- group */

export const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-group"
      className={cn(
        // Vertical padding only — horizontal gutter comes from SidebarContent's
        // p-2, so the group label + menu items share ONE left inset with the
        // header (which is also p-2). Adding px here would double the gutter and
        // push menu icons out of vertical alignment with the header icon.
        "relative flex w-full min-w-0 flex-col py-2",
        className,
      )}
      {...props}
    />
  ),
);
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = forwardRef<
  HTMLDivElement,
  SidebarGroupLabelProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sidebar-group-label"
    className={cn(
      "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-muted-foreground outline-none",
      "transition-[margin,opacity] duration-200 ease-linear",
      "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
      className,
    )}
    {...props}
  />
));
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupContent = forwardRef<
  HTMLDivElement,
  SidebarGroupContentProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sidebar-group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

/* -------------------------------------------------------------------- menu */

export const SidebarMenu = forwardRef<HTMLUListElement, SidebarMenuProps>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-slot="sidebar-menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  ),
);
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = forwardRef<
  HTMLLIElement,
  SidebarMenuItemProps
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-slot="sidebar-menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

export const SidebarMenuButton = forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(
  (
    {
      asChild = false,
      isActive = false,
      variant,
      size,
      tooltip,
      className,
      ...props
    },
    ref,
  ) => {
    const { isMobile, state } = useSidebar();
    const Comp = asChild ? Slot : "button";

    const button = (
      <Comp
        ref={ref}
        data-slot="sidebar-menu-button"
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    );

    // No tooltip, or sidebar is expanded / mobile → show the bare button. The
    // collapsed-icon tooltip uses the v2 Tooltip (Radix owns the behavior).
    if (!tooltip) return button;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

/* ----------------------------------------------------------------- submenu */

export const SidebarMenuSub = forwardRef<
  HTMLUListElement,
  SidebarMenuSubProps
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-slot="sidebar-menu-sub"
    className={cn(
      "mx-3 flex min-w-0 flex-col gap-1 border-l border-sidebar-border px-2 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className,
    )}
    {...props}
  />
));
SidebarMenuSub.displayName = "SidebarMenuSub";

export const SidebarMenuSubButton = forwardRef<
  HTMLAnchorElement,
  SidebarMenuSubButtonProps
>(
  (
    { asChild = false, isActive = false, size = "md", className, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "a";
    return (
      <Comp
        ref={ref}
        data-slot="sidebar-menu-sub-button"
        data-active={isActive}
        className={cn(
          "flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none",
          "transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground",
          "[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
          size === "sm" ? "text-xs" : "text-sm",
          "group-data-[collapsible=icon]:hidden",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export { sidebarMenuButtonVariants };
