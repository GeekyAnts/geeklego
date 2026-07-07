// ─── GeekLego barrel ──────────────────────────────────────────────────────────
//
// The old 3-tier component exports (atoms/molecules/organisms) and the
// component catalog were removed in the v2 2-tier cut (see PROTOTYPE-SHADCN-2TIER.md
// §7.5). v2 components live under components/v2/<Name>/ and are re-exported below
// as the package's published surface.
//
// This barrel exports two groups: the v2 components, and the shared utility
// modules kept per §5 (pending a Radix audit — Radix may make some of the
// keyboard/a11y hooks redundant as v2 grows).

// ─── v2 components (the published surface) ──────────────────────────────────────
// Re-exported so `pnpm build` bundles them into dist/index.js — without this a
// consuming app cannot `import { Button } from "@scope/pkg"`. Every new component
// built via component-builder-v2 (Phase 3.5) must be added here. `export *` picks
// up compound sub-parts (DialogTrigger, etc.) in one line.
export * from './v2/Accordion/Accordion';
export type * from './v2/Accordion/Accordion.types';
export * from './v2/Alert/Alert';
export type * from './v2/Alert/Alert.types';
export * from './v2/AlertDialog/AlertDialog';
export type * from './v2/AlertDialog/AlertDialog.types';
export * from './v2/AspectRatio/AspectRatio';
export type * from './v2/AspectRatio/AspectRatio.types';
export * from './v2/Avatar/Avatar';
export type * from './v2/Avatar/Avatar.types';
export * from './v2/Badge/Badge';
export type * from './v2/Badge/Badge.types';
export * from './v2/Breadcrumb/Breadcrumb';
export type * from './v2/Breadcrumb/Breadcrumb.types';
export * from './v2/Button/Button';
export type * from './v2/Button/Button.types';
export * from './v2/Calendar/Calendar';
export type * from './v2/Calendar/Calendar.types';
export * from './v2/Card/Card';
export type * from './v2/Card/Card.types';
export * from './v2/Carousel/Carousel';
export type * from './v2/Carousel/Carousel.types';
export * from './v2/Chart/Chart';
export type * from './v2/Chart/Chart.types';
export * from './v2/Checkbox/Checkbox';
export type * from './v2/Checkbox/Checkbox.types';
export * from './v2/Collapsible/Collapsible';
export type * from './v2/Collapsible/Collapsible.types';
export * from './v2/Combobox/Combobox';
export type * from './v2/Combobox/Combobox.types';
export * from './v2/Command/Command';
export type * from './v2/Command/Command.types';
export * from './v2/ContextMenu/ContextMenu';
export type * from './v2/ContextMenu/ContextMenu.types';
export * from './v2/DataTable/DataTable';
export type * from './v2/DataTable/DataTable.types';
export * from './v2/DatePicker/DatePicker';
export type * from './v2/DatePicker/DatePicker.types';
export * from './v2/Dialog/Dialog';
export type * from './v2/Dialog/Dialog.types';
export * from './v2/Drawer/Drawer';
export type * from './v2/Drawer/Drawer.types';
export * from './v2/DropdownMenu/DropdownMenu';
export type * from './v2/DropdownMenu/DropdownMenu.types';
// Form is the canonical import path for the ShadCN Form recipe; its single
// implementation lives in Field/Field and is re-exported by Form/Form. We export
// the recipe's names from Form/Form ONLY (not also from Field/Field) to avoid a
// duplicate-export collision — the Field directory remains the implementation.
export * from './v2/Form/Form';
export type * from './v2/Form/Form.types';
export * from './v2/HoverCard/HoverCard';
export type * from './v2/HoverCard/HoverCard.types';
export * from './v2/Input/Input';
export type * from './v2/Input/Input.types';
export * from './v2/InputOTP/InputOTP';
export type * from './v2/InputOTP/InputOTP.types';
export * from './v2/Label/Label';
export type * from './v2/Label/Label.types';
export * from './v2/Menubar/Menubar';
export type * from './v2/Menubar/Menubar.types';
export * from './v2/NavigationMenu/NavigationMenu';
export type * from './v2/NavigationMenu/NavigationMenu.types';
export * from './v2/Pagination/Pagination';
export type * from './v2/Pagination/Pagination.types';
export * from './v2/PieChart/PieChart';
export type * from './v2/PieChart/PieChart.types';
export * from './v2/Popover/Popover';
export type * from './v2/Popover/Popover.types';
export * from './v2/Progress/Progress';
export type * from './v2/Progress/Progress.types';
export * from './v2/ProductCard/ProductCard';
export type * from './v2/ProductCard/ProductCard.types';
export * from './v2/RadioGroup/RadioGroup';
export type * from './v2/RadioGroup/RadioGroup.types';
export * from './v2/Resizable/Resizable';
export type * from './v2/Resizable/Resizable.types';
export * from './v2/ScrollArea/ScrollArea';
export type * from './v2/ScrollArea/ScrollArea.types';
export * from './v2/Select/Select';
export type * from './v2/Select/Select.types';
export * from './v2/Separator/Separator';
export type * from './v2/Separator/Separator.types';
export * from './v2/Sheet/Sheet';
export type * from './v2/Sheet/Sheet.types';
export * from './v2/Sidebar/Sidebar';
export type * from './v2/Sidebar/Sidebar.types';
export * from './v2/Skeleton/Skeleton';
export type * from './v2/Skeleton/Skeleton.types';
export * from './v2/Slider/Slider';
export type * from './v2/Slider/Slider.types';
export * from './v2/Sonner/Sonner';
export type * from './v2/Sonner/Sonner.types';
export * from './v2/Switch/Switch';
export type * from './v2/Switch/Switch.types';
export * from './v2/Table/Table';
export type * from './v2/Table/Table.types';
export * from './v2/Tabs/Tabs';
export type * from './v2/Tabs/Tabs.types';
export * from './v2/Textarea/Textarea';
export type * from './v2/Textarea/Textarea.types';
export * from './v2/Toggle/Toggle';
export type * from './v2/Toggle/Toggle.types';
export * from './v2/ToggleGroup/ToggleGroup';
export type * from './v2/ToggleGroup/ToggleGroup.types';
export * from './v2/Tooltip/Tooltip';
export type * from './v2/Tooltip/Tooltip.types';
export * from './v2/Typography/Typography';
export type * from './v2/Typography/Typography.types';

// NOTE: the hand-rolled keyboard hooks (useFocusTrap/useEscapeDismiss/
// useClickOutside/useRovingTabindex/useSingleSelectGroup) were removed in the
// v2 cleanup — Radix Dialog/Popover + cmdk provide that behavior natively
// (PROTOTYPE-SHADCN-2TIER.md §5 audit; Step 4 verdict on Radix redundancy).

// Accessibility helpers
export {
  getDisclosureProps,
  getNavigationItemProps,
  getLiveRegionProps,
  getLoadingProps,
  getDisabledProps,
  getErrorFieldProps,
  getIconProps,
} from './utils/accessibility/aria-helpers';
export type * from './utils/accessibility/aria-types';
export * from './utils/accessibility/VisuallyHidden';
export type * from './utils/accessibility/VisuallyHidden.types';

// Security utilities
export { sanitizeHref, getSafeExternalLinkProps } from './utils/security/sanitize';
export type { SafeExternalLinkProps, UnsafeProtocol } from './utils/security/sanitize.types';

// i18n
export { GeeklegoI18nProvider } from './utils/i18n/GeeklegoI18nProvider';
export type { GeeklegoI18nProviderProps } from './utils/i18n/GeeklegoI18nProvider';
export type {
  GeeklegoI18nStrings,
  GeeklegoFormatters,
  GeeklegoI18nContextValue,
  LabelI18nStrings,
  DialogI18nStrings,
  PopoverI18nStrings,
  DropdownMenuI18nStrings,
  ComboboxI18nStrings,
  CommandI18nStrings,
  AccordionI18nStrings,
  SelectI18nStrings,
} from './utils/i18n/GeeklegoI18nProvider.types';

// StructuredData
export * from './utils/StructuredData/StructuredData';
export type * from './utils/StructuredData/StructuredData.types';
