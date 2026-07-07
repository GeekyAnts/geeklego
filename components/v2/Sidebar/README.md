# Sidebar

A composable, collapsible navigation shell. Built as a **composition** (there is no single Radix primitive for an app sidebar): the mobile drawer is the v2 `Sheet` (Radix Dialog — focus trap, escape, scroll lock, portal) and the collapsed-icon labels use the v2 `Tooltip` (Radix Tooltip). `SidebarProvider` owns the open/collapsed state and the mobile-breakpoint watch.

## Context constraint

Every sidebar part must render inside a `<SidebarProvider>` — `useSidebar()` throws otherwise. Pair the `Sidebar` with a `SidebarInset` (the main content region) as siblings inside the provider.

```tsx
import {
  SidebarProvider, Sidebar, SidebarInset, SidebarTrigger,
  SidebarHeader, SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarRail,
} from "@geeklego/components"; // or relative path in-repo
import { TooltipProvider } from "@geeklego/components";

<TooltipProvider>
  <SidebarProvider>
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive tooltip="Home">
                  <HomeIcon />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
    <SidebarInset>
      <SidebarTrigger />
      {/* page content */}
    </SidebarInset>
  </SidebarProvider>
</TooltipProvider>
```

A `TooltipProvider` must wrap the tree if any `SidebarMenuButton` uses the `tooltip` prop (shown only when collapsed to icon mode on desktop).

## Parts

| Part | Notes |
|---|---|
| `SidebarProvider` | Owns state. Props: `defaultOpen`, `open`/`onOpenChange` (controlled). |
| `Sidebar` | The panel. Props: `side` (`left`/`right`), `variant` (`sidebar`/`floating`/`inset`), `collapsible` (`icon` (default — shrinks to an icon rail) / `offcanvas` (slides off-screen) / `none`). |
| `SidebarTrigger` | Toggle button. Reads `useSidebar().toggleSidebar`. |
| `SidebarRail` | Thin click target on the panel edge that toggles the sidebar. |
| `SidebarInset` | The `<main>` content region beside the sidebar. |
| `SidebarHeader` / `SidebarFooter` / `SidebarContent` | Layout regions. |
| `SidebarGroup` / `SidebarGroupLabel` / `SidebarGroupContent` | A labelled section; the label hides in icon mode. |
| `SidebarMenu` / `SidebarMenuItem` / `SidebarMenuButton` | The nav list. `SidebarMenuButton` supports `asChild`, `isActive`, `tooltip`, and `variant`/`size`. |
| `SidebarMenuSub` / `SidebarMenuSubButton` | Nested links; hidden in icon mode. |
| `SidebarSeparator` | A horizontal rule on the sidebar surface. |
| `useSidebar()` | Hook returning `{ state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar }`. |

## Tokens

The panel renders on its own surface via the `--sidebar-*` token group (background, foreground, border, accent + accent-foreground for hovered/active items, ring). These are **standard ShadCN core semantics** (ShadCN ships a dedicated `--sidebar-*` group) — they live in the core semantic set of `semantics.css`, each chained to a primitive, and are overridden per-theme in `themes/dark.css`. Widths reuse existing spacing primitives (`w-64` expanded, `w-12` icon, `w-72` mobile) — no raw dimensions.

## Responsive behavior

Below the `md` breakpoint the desktop panel is replaced by the v2 `Sheet` (a slide-in drawer), toggled by the same `SidebarTrigger`. On desktop the panel collapses per the `collapsible` prop.
