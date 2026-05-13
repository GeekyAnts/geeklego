import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  CSSProperties,
  ReactNode,
  ForwardRefExoticComponent,
  RefAttributes,
  ComponentType,
} from 'react';
import type { SidebarI18nStrings } from '../../utils/i18n';

// ── Variant unions ─────────────────────────────────────────────────────────

/** Which edge of the layout the sidebar renders on. */
export type SidebarSide = 'left' | 'right';

/** Visual style variant. */
export type SidebarVariant = 'sidebar' | 'floating' | 'inset';

/**
 * Collapse behaviour.
 * - `'offcanvas'` — slides completely off-screen when collapsed (default)
 * - `'icon'`      — collapses to a narrow icon rail
 * - `'none'`      — always visible; no toggle rendered
 */
export type SidebarCollapsible = 'offcanvas' | 'icon' | 'none';

/** Menu button size. */
export type SidebarMenuButtonSize = 'sm' | 'md' | 'lg';

// ── Context ────────────────────────────────────────────────────────────────

export interface SidebarContextValue {
  /** `'expanded'` or `'collapsed'`. Drives icon-rail mode. */
  state: 'expanded' | 'collapsed';
  /** Whether the desktop sidebar is open. */
  open: boolean;
  /** Set the desktop open state programmatically. */
  setOpen: (open: boolean) => void;
  /** Whether the mobile sheet is open. */
  openMobile: boolean;
  /** Set the mobile sheet open state. */
  setOpenMobile: (open: boolean) => void;
  /** True when viewport width is below 768 px. */
  isMobile: boolean;
  /** Toggle sidebar — routes to mobile or desktop state automatically. */
  toggleSidebar: () => void;
  /** The collapsible mode declared on the root `<Sidebar>`. */
  collapsible: SidebarCollapsible;
  /** i18n string overrides forwarded from `SidebarProvider`. */
  i18nStrings?: SidebarI18nStrings;
}

// ── SidebarProvider ────────────────────────────────────────────────────────

export interface SidebarProviderProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the sidebar is open by default (uncontrolled). Default: `true`. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Controlled open-state change handler. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Keyboard shortcut key combined with Cmd (Mac) / Ctrl (Win/Linux).
   * Default: `'b'` → Cmd+B / Ctrl+B.
   */
  shortcut?: string;
  /** Persist open state in `localStorage` under `'sidebar:state'`. Default: `false`. */
  persist?: boolean;
  /** Override i18n strings for aria-labels on trigger and rail buttons. */
  i18nStrings?: SidebarI18nStrings;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

// ── Sidebar root ───────────────────────────────────────────────────────────

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Which edge to render. Default: `'left'`. */
  side?: SidebarSide;
  /** Visual style variant. Default: `'sidebar'`. */
  variant?: SidebarVariant;
  /**
   * Collapse behaviour.
   * - `'offcanvas'` — slides off-screen (default)
   * - `'icon'`      — collapses to icon rail
   * - `'none'`      — always visible
   */
  collapsible?: SidebarCollapsible;
  children?: ReactNode;
  className?: string;
}

// ── Slot containers ────────────────────────────────────────────────────────

export interface SidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface SidebarContentProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
}

export interface SidebarFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

// ── Group ──────────────────────────────────────────────────────────────────

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface SidebarGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

export interface SidebarGroupActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label (required for icon-only buttons). */
  'aria-label': string;
  children?: ReactNode;
  className?: string;
}

export interface SidebarGroupContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

// ── Menu ───────────────────────────────────────────────────────────────────

export interface SidebarMenuProps extends HTMLAttributes<HTMLUListElement> {
  children?: ReactNode;
  className?: string;
}

export interface SidebarMenuItemProps extends HTMLAttributes<HTMLLIElement> {
  children?: ReactNode;
  className?: string;
}

export interface SidebarMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** When provided renders as `<a>`. */
  href?: string;
  /** Marks this as the active route. Adds `aria-current="page"`. */
  isActive?: boolean;
  /** Height/text size. Default: `'md'`. */
  size?: SidebarMenuButtonSize;
  /**
   * Icon — always visible, including in icon-rail mode.
   * Pass a lucide-react icon: `<LayoutDashboard size="var(--size-icon-sm)" />`.
   */
  icon?: ReactNode;
  /**
   * Tooltip shown in icon-rail mode as the native `title` attribute.
   * Defaults to the text content of `children`.
   */
  tooltip?: string;
  /**
   * Trailing element rendered after children (e.g. a chevron for expandable items).
   * Hidden automatically in icon-rail mode. Pass a lucide icon or any ReactNode.
   */
  suffix?: ReactNode;
  /** Opt-in Schema.org `SiteNavigationElement` Microdata. */
  schema?: boolean;
  children?: ReactNode;
  className?: string;
}

export interface SidebarMenuActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Hide until the parent list item is hovered. Default: `true`. */
  showOnHover?: boolean;
  /** Required accessible label for the icon-only action button. */
  'aria-label': string;
  children?: ReactNode;
  className?: string;
}

export interface SidebarMenuBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  className?: string;
}

export interface SidebarMenuSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Show an icon placeholder before the text skeleton. Default: `true`. */
  showIcon?: boolean;
  className?: string;
}

// ── Sub-menu ───────────────────────────────────────────────────────────────

export interface SidebarMenuSubProps extends HTMLAttributes<HTMLUListElement> {
  children?: ReactNode;
  className?: string;
}

export interface SidebarMenuSubItemProps extends HTMLAttributes<HTMLLIElement> {
  children?: ReactNode;
  className?: string;
}

export interface SidebarMenuSubButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  isActive?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}

// ── Utility components ─────────────────────────────────────────────────────

export interface SidebarSeparatorProps extends HTMLAttributes<HTMLElement> {
  className?: string;
}

export interface SidebarTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export interface SidebarRailProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export interface SidebarInsetProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
}

// ── Composite type ─────────────────────────────────────────────────────────

export interface SidebarComposite
  extends ForwardRefExoticComponent<SidebarProps & RefAttributes<HTMLElement>> {
  Header: ComponentType<SidebarHeaderProps & RefAttributes<HTMLDivElement>>;
  Content: ComponentType<SidebarContentProps & RefAttributes<HTMLElement>>;
  Footer: ComponentType<SidebarFooterProps & RefAttributes<HTMLDivElement>>;
  Group: ComponentType<SidebarGroupProps & RefAttributes<HTMLDivElement>>;
  GroupLabel: ComponentType<SidebarGroupLabelProps & RefAttributes<HTMLDivElement>>;
  GroupAction: ComponentType<SidebarGroupActionProps & RefAttributes<HTMLButtonElement>>;
  GroupContent: ComponentType<SidebarGroupContentProps & RefAttributes<HTMLDivElement>>;
  Menu: ComponentType<SidebarMenuProps & RefAttributes<HTMLUListElement>>;
  MenuItem: ComponentType<SidebarMenuItemProps & RefAttributes<HTMLLIElement>>;
  MenuButton: ComponentType<SidebarMenuButtonProps>;
  MenuAction: ComponentType<SidebarMenuActionProps & RefAttributes<HTMLButtonElement>>;
  MenuBadge: ComponentType<SidebarMenuBadgeProps & RefAttributes<HTMLSpanElement>>;
  MenuSkeleton: ComponentType<SidebarMenuSkeletonProps & RefAttributes<HTMLDivElement>>;
  MenuSub: ComponentType<SidebarMenuSubProps & RefAttributes<HTMLUListElement>>;
  MenuSubItem: ComponentType<SidebarMenuSubItemProps & RefAttributes<HTMLLIElement>>;
  MenuSubButton: ComponentType<SidebarMenuSubButtonProps>;
  Separator: ComponentType<SidebarSeparatorProps & RefAttributes<HTMLElement>>;
  Trigger: ComponentType<SidebarTriggerProps & RefAttributes<HTMLButtonElement>>;
  Rail: ComponentType<SidebarRailProps & RefAttributes<HTMLButtonElement>>;
  Inset: ComponentType<SidebarInsetProps & RefAttributes<HTMLElement>>;
}

export type { SidebarI18nStrings };
