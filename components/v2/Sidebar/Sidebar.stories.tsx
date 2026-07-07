import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ChevronRight,
  LifeBuoy,
  Send,
} from "lucide-react";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarInset,
  SidebarRail,
  SidebarSeparator,
} from "./Sidebar";
import { TooltipProvider } from "../Tooltip/Tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../Collapsible/Collapsible";
import { withDarkPortalRoot } from "../lib/dark-portal-decorator";
import "../../../design-system/v2/index.css";

/**
 * Sidebar — a composable navigation shell. Built as a composition (no single
 * Radix primitive): the mobile drawer is the v2 Sheet (Radix Dialog) and the
 * collapsed-icon labels use the v2 Tooltip (Radix Tooltip). Wrap the app in
 * `SidebarProvider`; the panel renders on its own `--sidebar-*` surface.
 */
const meta = {
  title: "v2/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A collapsible navigation sidebar. Compose `SidebarProvider` > `Sidebar` + `SidebarInset`. The mobile view is portalled to `<body>` via the v2 Sheet; collapsed-icon labels portal via the v2 Tooltip — so dark stories flag the document root with the `withDarkPortalRoot` decorator.",
      },
    },
  },
  decorators: [
    // The Sidebar panel is position:fixed, so it anchors to the viewport top.
    // Storybook wraps stories in a padded container; that padding shifts the
    // (flowed) inset down while the fixed panel stays at top 0, breaking the
    // header/inset baseline. Neutralize the wrapper padding so the story matches
    // a real app mount (where viewport-top === layout-top).
    (Story) => (
      <TooltipProvider>
        <div className="fixed inset-0 overflow-auto bg-background">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const NAV = [
  { title: "Home", icon: Home },
  { title: "Inbox", icon: Inbox },
  { title: "Calendar", icon: Calendar },
  { title: "Search", icon: Search },
  { title: "Settings", icon: Settings },
];

function DemoSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="h-12 group-data-[collapsible=icon]:!h-8">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                G
              </div>
              <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                <span className="font-semibold">GeekLego</span>
                <span className="text-xs text-muted-foreground">Enterprise</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item, i) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={i === 0}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <Collapsible defaultOpen asChild className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Projects">
                      <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      <span>Projects</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <li>
                        <SidebarMenuSubButton href="#" isActive>
                          <span>Design System</span>
                        </SidebarMenuSubButton>
                      </li>
                      <li>
                        <SidebarMenuSubButton href="#">
                          <span>Token Editor</span>
                        </SidebarMenuSubButton>
                      </li>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Support">
                  <LifeBuoy />
                  <span>Support</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Feedback">
                  <Send />
                  <span>Feedback</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1 text-sm">
          <div className="size-6 rounded-full bg-muted" />
          <span className="group-data-[collapsible=icon]:hidden">
            kumar@geekyants.com
          </span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function Shell({
  sidebarProps,
}: {
  sidebarProps?: React.ComponentProps<typeof Sidebar>;
}) {
  return (
    <SidebarProvider>
      <DemoSidebar {...sidebarProps} />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium text-foreground">Dashboard</span>
        </header>
        <div className="p-4 text-sm text-muted-foreground">
          Main content. Click the trigger (or the rail on the panel edge) to
          toggle the sidebar.
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

/** Default — `collapsible="icon"`: toggling shrinks to an icon rail, labels become tooltips. */
export const Default: Story = {
  render: () => <Shell />,
};

/** `collapsible="offcanvas"` — toggling slides the whole panel off-screen; the header trigger brings it back. */
export const OffcanvasCollapsible: Story = {
  render: () => <Shell sidebarProps={{ collapsible: "offcanvas" }} />,
};

/** Floating variant — the panel is a detached, rounded, bordered card. */
export const Floating: Story = {
  render: () => <Shell sidebarProps={{ variant: "floating", collapsible: "icon" }} />,
};

/** Right-anchored sidebar. */
export const RightSide: Story = {
  render: () => <Shell sidebarProps={{ side: "right" }} />,
};

/**
 * DarkMode — the wrapper sets BOTH `data-theme="dark"` and `.dark`, plus
 * `bg-background text-foreground`. The mobile Sheet + collapsed tooltips
 * portal to `<body>`, so the `withDarkPortalRoot` decorator flags the root too.
 */
export const DarkMode: Story = {
  decorators: [withDarkPortalRoot],
  render: () => (
    <div className="dark max-w-2xl rounded-lg bg-background p-0 text-foreground" data-theme="dark">
      <Shell sidebarProps={{ collapsible: "icon" }} />
    </div>
  ),
};
