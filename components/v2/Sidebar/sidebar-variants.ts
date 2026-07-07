import { cva, type VariantProps } from "class-variance-authority";

/**
 * sidebarMenuButtonVariants — the one real variant axis in the Sidebar slice.
 *
 * Menu buttons are the interactive rows in the nav. They render on the sidebar
 * surface (--sidebar-*), so hover/active use the sidebar accent tokens
 * rather than the core --accent (the panel is its own surface). The collapsed
 * icon-mode width is driven by the data-[collapsible=icon] selector on the
 * sidebar root, handled in the component classes — these variants only own the
 * look and size of the button itself.
 */
export const sidebarMenuButtonVariants = cva(
  [
    "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm outline-none",
    "text-sidebar-foreground",
    "transition-colors",
    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
    "active:bg-sidebar-accent active:text-sidebar-accent-foreground",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground",
    // icon-collapsed: the root carries data-[collapsible=icon]; squeeze to a
    // square. `!` so it beats any size-variant h-* (e.g. lg's h-12) — matches
    // ShadCN, which forces the collapse with important too.
    "group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 group-data-[collapsible=icon]:justify-center",
    "[&>span:last-child]:truncate",
    // icon-collapsed: hide the trailing label entirely (not just truncate) so
    // the gap collapses and the lone icon centers in the square.
    "group-data-[collapsible=icon]:[&>span:last-child]:hidden",
    "[&>svg]:size-4 [&>svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        outline:
          "border border-sidebar-border bg-sidebar-bg shadow-sm",
      },
      size: {
        sm: "h-7 text-xs",
        md: "h-8 text-sm",
        lg: "h-12 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export type SidebarMenuButtonVariantProps = VariantProps<
  typeof sidebarMenuButtonVariants
>;
