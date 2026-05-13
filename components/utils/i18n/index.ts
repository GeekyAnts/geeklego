/**
 * Public API for Geeklego i18n.
 *
 * Consumers import the provider and its types from here:
 *   import { GeeklegoI18nProvider } from '../utils/i18n';
 *   import type { GeeklegoI18nStrings } from '../utils/i18n';
 *
 * The internal useComponentI18n hook is NOT exported here — it is for
 * Geeklego component internals only and is imported via relative path.
 */

export { GeeklegoI18nProvider } from './GeeklegoI18nProvider';
export type { GeeklegoI18nProviderProps } from './GeeklegoI18nProvider';

export type {
  GeeklegoI18nStrings,
  NavbarI18nStrings,
  FooterI18nStrings,
  GeeklegoFormatters,
  GeeklegoI18nContextValue,
  LabelI18nStrings,
  AvatarI18nStrings,
  RatingI18nStrings,
  BreadcrumbI18nStrings,
  DateInputI18nStrings,
  DropdownMenuI18nStrings,
  FormFieldI18nStrings,
  FormI18nStrings,
  SidebarI18nStrings,
  BarChartI18nStrings,
  AreaChartI18nStrings,
  FileInputI18nStrings,
  FileUploadI18nStrings,
  SearchBarI18nStrings,
  AlertBannerI18nStrings,
  TooltipI18nStrings,
  PaginationI18nStrings,
  ToastI18nStrings,
  PopoverI18nStrings,
  ComboboxI18nStrings,
  ChipI18nStrings,
  TagI18nStrings,
  FieldsetI18nStrings,
  StepperI18nStrings,
  HeaderI18nStrings,
  ModalI18nStrings,
  DrawerI18nStrings,
  AccordionI18nStrings,
  TabsI18nStrings,
  DataTableI18nStrings,
  ColorPickerI18nStrings,
  CarouselI18nStrings,
  TypingIndicatorI18nStrings,
  ChatHeaderI18nStrings,
  ChatInputBarI18nStrings,
  ChatI18nStrings,
  TreeViewI18nStrings,
  SpinnerI18nStrings,
  InputGroupI18nStrings,
} from './GeeklegoI18nProvider.types';
