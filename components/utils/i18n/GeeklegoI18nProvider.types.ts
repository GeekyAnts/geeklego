/**
 * Type definitions for Geeklego i18n infrastructure.
 *
 * Architecture: library-agnostic, prop-first with context fallback.
 * Resolution order (most specific wins):
 *   hardcoded English default ← context strings ← i18nStrings prop
 *
 * Consumers wire their own i18n tool (react-intl, i18next, etc.) into
 * GeeklegoI18nProvider. No i18n library is bundled with Geeklego.
 */

// ── Per-component string dictionaries ──────────────────────────────────────
// Only components with system-generated strings need an i18nStrings type.
// Content strings passed by the consumer (children, title, label) are not here.

export interface LabelI18nStrings {
  /** SR-only text appended when required=true. Default: "(required)" */
  required?: string;
  /** Visible text appended when optional=true. Default: "(Optional)" */
  optional?: string;
}

export interface AvatarI18nStrings {
  /** Fallback alt/aria-label for non-image avatars. Default: "User avatar" */
  fallbackLabel?: string;
}

export interface RatingI18nStrings {
  /**
   * Accessible label per star value. Used in both read-only and interactive modes.
   * Default: ({ value, max }) => `${value} out of ${max} stars`
   */
  starLabel?: (v: { value: number; max: number }) => string;
}

export interface BreadcrumbI18nStrings {
  /** aria-label for the <nav> landmark. Default: "Breadcrumb" */
  navLabel?: string;
}

export interface DateInputI18nStrings {
  /** Placeholder text for the date input. Defaults to 'MM/DD/YYYY' or locale variant. */
  placeholder?: string;
  /** Error message for invalid date format. Default: "Please enter a valid date." */
  invalidDateMessage?: string;
  /** Error message for required field. Default: "Date is required." */
  requiredMessage?: string;
}

export interface DropdownMenuI18nStrings {
  /** aria-label for the menu panel when no menuLabel prop is provided. Default: "Menu" */
  defaultMenuLabel?: string;
}

export interface FormFieldI18nStrings extends LabelI18nStrings {
  // Extends Label i18n for required/optional indicators
}

export interface FormI18nStrings {
  /** Accessible label for the form element. Default: "Form" */
  label?: string;
}

export interface SidebarI18nStrings {
  /** aria-label for the <aside> element. Default: "Sidebar" */
  sidebarLabel?: string;
  /** aria-label for the <nav> inside sidebar content. Default: "Sidebar navigation" */
  navLabel?: string;
  /** aria-label for the <footer> element. Default: "Sidebar footer" */
  footerLabel?: string;
  /** Button accessible label when sidebar is collapsed. Default: "Expand sidebar" */
  expandLabel?: string;
  /** Button accessible label when sidebar is expanded. Default: "Collapse sidebar" */
  collapseLabel?: string;
}

export interface BarChartI18nStrings {
  /** Context text shown next to the delta value. Default: "from last period" */
  deltaLabel?: string;
  /** aria-label for the period selector dropdown. Default: "Select time period" */
  periodSelectorLabel?: string;
  /** aria-label for the colour legend region. Default: "Chart legend" */
  legendLabel?: string;
  /**
   * aria-label for the visual bar chart element.
   * Receives the chart title. Default: (title) => `${title} distribution chart`
   */
  chartLabel?: (title: string) => string;
  /**
   * Caption for the SR-only data table.
   * Receives the chart title. Default: (title) => `${title} — data breakdown`
   */
  tableCaption?: (title: string) => string;
  /** Column header for segment names. Default: "Segment" */
  columnSegment?: string;
  /** Column header for numeric values. Default: "Value" */
  columnValue?: string;
  /** Column header for percentage share. Default: "Share" */
  columnShare?: string;
  /** Row header for the totals row in the SR data table. Default: "Total" */
  totalLabel?: string;
}

export interface FileInputI18nStrings {
  /** Placeholder shown when no file is selected. Default: "No file chosen" */
  placeholder?: string;
  /** Label for the browse action button area. Default: "Browse" */
  browseLabel?: string;
  /**
   * Label shown when multiple files are selected.
   * Receives the file count. Default: (count) => `${count} files selected`
   */
  filesSelectedLabel?: (count: number) => string;
}

export interface FileUploadI18nStrings {
  /** Drop zone heading at rest. Default: "Drop files here" */
  dropzoneTitle?: string;
  /** Drop zone heading while a drag is active. Default: "Release to drop" */
  dragActiveTitle?: string;
  /** Hint prefix before the browse link. Default: "or click to" */
  dropzoneHint?: string;
  /** The underlined browse link text. Default: "browse" */
  browseText?: string;
  /** Accessible label for the hidden file input. Default: "Upload files" */
  inputLabel?: string;
  /** aria-label for the remove button on each file item. Default: "Remove file" */
  removeFileLabel?: string;
  /** Status suffix when uploading with no known progress. Default: "Uploading…" */
  uploadingText?: string;
  /** Status suffix when upload completes. Default: "Done" */
  doneText?: string;
  /**
   * Error when a file exceeds maxFileSize.
   * Receives a human-readable size string. Default: (size) => `File exceeds ${size} limit`
   */
  maxSizeError?: (size: string) => string;
  /**
   * Error when maxFiles is exceeded (multiple mode).
   * Receives the allowed count. Default: (max) => `Maximum ${max} file${max === 1 ? '' : 's'} allowed`
   */
  maxFilesError?: (maxFiles: number) => string;
}

export interface SearchBarI18nStrings {
  /** Label for the search landmark and visible label when label prop is omitted. Default: "Search" */
  searchLabel?: string;
  /** aria-label for the clear (×) button. Default: "Clear search" */
  clearLabel?: string;
}

export interface AlertBannerI18nStrings {
  /** aria-label for the dismiss (×) button. Default: "Dismiss" */
  dismissLabel?: string;
}

export interface TooltipI18nStrings {
  /**
   * Accessible label for the tooltip panel when content is non-textual.
   * Used as `aria-label` on the `role="tooltip"` element.
   * Default: "Tooltip"
   */
  panelLabel?: string;
}

export interface PaginationI18nStrings {
  /** aria-label for the previous page button. Default: "Previous page" */
  prevLabel?: string;
  /** aria-label for the next page button. Default: "Next page" */
  nextLabel?: string;
  /** aria-label for the first page jump button (showFirstLast). Default: "First page" */
  firstLabel?: string;
  /** aria-label for the last page jump button (showFirstLast). Default: "Last page" */
  lastLabel?: string;
  /**
   * SR-only status text and simple-variant visible label.
   * Receives current page and total. Default: ({ page, total }) => `Page ${page} of ${total}`
   */
  pageLabel?: (v: { page: number; total: number }) => string;
  /** aria-label for the <nav> pagination landmark. Default: "Pagination" */
  navLabel?: string;
}

export interface ToastI18nStrings {
  /** aria-label for the dismiss (×) button. Default: "Dismiss" */
  dismissLabel?: string;
}

export interface PopoverI18nStrings {
  /** aria-label for the close (×) button in the header. Default: "Close" */
  closeLabel?: string;
}

export interface ComboboxI18nStrings {
  /** aria-label for the clear (×) button. Default: "Clear" */
  clearLabel?: string;
  /** aria-label for the listbox panel. Default: "Options" */
  listboxLabel?: string;
  /** Text shown when no options match the query. Default: "No results" */
  noResultsMessage?: string;
  /** Text shown in the panel during async option loading. Default: "Loading options…" */
  loadingMessage?: string;
}

export interface FieldsetI18nStrings {
  /** SR-only text appended to legend when required=true. Default: "(required)" */
  required?: string;
}

export interface ChipI18nStrings {
  /** aria-label for the remove (×) button. Default: "Remove" */
  removeLabel?: string;
}

export interface TagI18nStrings {
  /** aria-label for the remove (×) button. Default: "Remove" */
  removeLabel?: string;
}

export interface StepperI18nStrings {
  /** `aria-label` for the `<ol>` step list. Default: "Steps" */
  listLabel?: string;
  /** SR-only suffix appended to completed step indicators. Default: "(Completed)" */
  completedLabel?: string;
  /** SR-only suffix appended to error step indicators. Default: "(Error)" */
  errorLabel?: string;
}

export interface HeaderI18nStrings {
  /** aria-label for the primary <nav> landmark. Default: "Primary" */
  navLabel?: string;
  /** aria-label for the mobile panel region. Default: "Navigation" */
  mobileNavLabel?: string;
  /** aria-label for the mobile menu toggle when closed. Default: "Open menu" */
  openMenuLabel?: string;
  /** aria-label for the mobile menu toggle when open. Default: "Close menu" */
  closeMenuLabel?: string;
}

export interface ModalI18nStrings {
  /** aria-label for the close (×) button. Default: "Close" */
  closeLabel?: string;
  /** Fallback aria-label for the dialog when no title prop is provided. Default: "Dialog" */
  dialogLabel?: string;
}

export interface DrawerI18nStrings {
  /** aria-label for the close (×) button. Default: "Close" */
  closeLabel?: string;
  /** Fallback aria-label for the dialog when no title prop is provided. Default: "Drawer" */
  drawerLabel?: string;
}

export interface AccordionI18nStrings {
  /** SR-only hint appended to trigger text when item is collapsed. Default: "Expand" */
  expandLabel?: string;
  /** SR-only hint appended to trigger text when item is expanded. Default: "Collapse" */
  collapseLabel?: string;
}

export interface TabsI18nStrings {
  /** aria-label for the tab list landmark. Default: "Tabs" */
  listLabel?: string;
}

export interface NavbarI18nStrings {
  /** aria-label for the `<nav>` landmark. Default: "Navigation" */
  navLabel?: string;
}

export interface FooterI18nStrings {
  /** aria-label for the `<footer>` landmark. Default: "Footer" */
  footerLabel?: string;
  /** Default aria-label for Footer.Nav `<nav>` landmarks when `navAriaLabel` is not provided. Default: "Footer navigation" */
  navLabel?: string;
}

export interface DataTableI18nStrings {
  /**
   * aria-label for a sort button when the column is sorted ascending.
   * Describes the *next* action. Default: (header) => `Sort ${header} descending`
   */
  sortAscLabel?: (header: string) => string;
  /**
   * aria-label for a sort button when the column is sorted descending.
   * Describes the *next* action. Default: (header) => `Clear sort for ${header}`
   */
  sortDescLabel?: (header: string) => string;
  /**
   * aria-label for a sort button when the column has no active sort.
   * Describes the *next* action. Default: (header) => `Sort ${header} ascending`
   */
  sortNoneLabel?: (header: string) => string;
  /** sr-only label for the loading spinner. Default: "Loading data" */
  loadingLabel?: string;
  /** Empty state message when data is empty. Default: "No results found" */
  emptyMessage?: string;
  /** aria-label for the select-all header checkbox. Default: "Select all rows" */
  selectAllLabel?: string;
  /**
   * aria-label for individual row checkboxes (1-based index).
   * Default: (n) => `Select row ${n}`
   */
  selectRowLabel?: (rowIndex: number) => string;
}

export interface DatepickerI18nStrings {
  /** aria-label for the calendar trigger button. Default: "Open calendar" */
  triggerLabel?: string;
  /** aria-label for the previous month button. Default: "Previous month" */
  prevMonthLabel?: string;
  /** aria-label for the next month button. Default: "Next month" */
  nextMonthLabel?: string;
  /** Screen reader cue appended to today's date aria-label. Default: "Today" */
  todayLabel?: string;
  /** Localized month names (12 entries, January-first). Default: English months. */
  monthNames?: string[];
  /** Localized full weekday names (7 entries, ordered by firstDayOfWeek). Default: English weekdays. */
  weekdayNames?: string[];
  /** Localized short weekday abbreviations (7 entries, ordered by firstDayOfWeek). Default: English 2-letter abbreviations. */
  weekdayNamesShort?: string[];
}

export interface CarouselI18nStrings {
  /** aria-label for the previous slide button. Default: "Previous slide" */
  previousSlide?: string;
  /** aria-label for the next slide button. Default: "Next slide" */
  nextSlide?: string;
  /**
   * aria-label template for each dot indicator button.
   * Default: (n) => `Go to slide ${n}`
   */
  goToSlide?: (n: number) => string;
  /**
   * aria-label and live-region text for each slide item.
   * Default: (n, total) => `${n} of ${total}`
   */
  slideLabel?: (n: number, total: number) => string;
  /** aria-label for the pause autoplay button. Default: "Pause auto-play" */
  pauseAutoPlay?: string;
  /** aria-label for the resume autoplay button. Default: "Resume auto-play" */
  resumeAutoPlay?: string;
}

export interface ColorPickerI18nStrings {
  /** aria-label for the root group element. Default: "Color" */
  colorLabel?: string;
  /** aria-label for the 2D spectrum control. Default: "Color spectrum. Use arrow keys to adjust saturation and brightness." */
  spectrumLabel?: string;
  /** aria-label for the hue slider. Default: "Hue" */
  hueLabel?: string;
  /** aria-label for the opacity slider. Default: "Opacity" */
  opacityLabel?: string;
  /** Label shown above the hex input. Default: "Hex" */
  hexLabel?: string;
  /** Label shown above the red channel input. Default: "R" */
  redLabel?: string;
  /** Label shown above the green channel input. Default: "G" */
  greenLabel?: string;
  /** Label shown above the blue channel input. Default: "B" */
  blueLabel?: string;
  /** Label shown above the hue channel input in HSL mode. Default: "H" */
  hueChannelLabel?: string;
  /** Label shown above the saturation channel input. Default: "S" */
  saturationLabel?: string;
  /** Label shown above the lightness channel input. Default: "L" */
  lightnessLabel?: string;
  /** aria-label for the preset colors group. Default: "Preset colors" */
  presetsLabel?: string;
  /** aria-label for the copy hex button. Default: "Copy hex" */
  copyLabel?: string;
  /** Text shown on the copy button after copying. Default: "Copied!" */
  copiedLabel?: string;
}

export interface RadioGroupI18nStrings {
  /** SR-only text appended to legend when required=true. Default: "(required)" */
  required?: string;
}

export interface SelectI18nStrings {
  /** Placeholder text shown when no option is selected. Default: "Select…" */
  placeholder?: string;
}

export interface SpinnerI18nStrings {
  /** Visually-hidden label announced to screen readers. Default: "Loading…" */
  label?: string;
}

export interface SkeletonI18nStrings {
  /** aria-label text for the loading placeholder. Default: "Loading" */
  ariaLabel?: string;
}

export interface SkipLinkI18nStrings {
  /** Default label text. Default: "Skip to main content" */
  label?: string;
}

export interface InputGroupI18nStrings {
  /** Placeholder text for input. Default: "Search…" */
  placeholder?: string;
}

export interface TreeItemI18nStrings {
  /** Template function for aria-label when expanding. Receives the item label. Default: (label) => `Expand ${label}` */
  expandLabel?: (label: string) => string;
  /** Template function for aria-label when collapsing. Receives the item label. Default: (label) => `Collapse ${label}` */
  collapseLabel?: (label: string) => string;
}

export interface TreeViewI18nStrings {
  /** Template function for the expand button aria-label. Receives the node label. Default: (label) => `Expand ${label}` */
  expandLabel?: (label: string) => string;
  /** Template function for the collapse button aria-label. Receives the node label. Default: (label) => `Collapse ${label}` */
  collapseLabel?: (label: string) => string;
}

export interface NumberInputI18nStrings {
  /** aria-label for the decrement (−) button. Default: "Decrease value" */
  decrementLabel?: string;
  /** aria-label for the increment (+) button. Default: "Increase value" */
  incrementLabel?: string;
}

export interface StatCardI18nStrings {
  /** SR-only label for the loading spinner. Default: "Loading" */
  loadingLabel?: string;
  /** SR-only prefix for positive trend delta. Default: "Trending up" */
  trendUpLabel?: string;
  /** SR-only prefix for negative trend delta. Default: "Trending down" */
  trendDownLabel?: string;
}

export interface AreaChartI18nStrings {
  /** Context text shown next to the delta value. Default: "from last period" */
  deltaLabel?: string;
  /** aria-label for the period selector dropdown. Default: "Select time period" */
  periodSelectorLabel?: string;
  /** aria-label for the colour legend region. Default: "Chart legend" */
  legendLabel?: string;
  /**
   * aria-label for the SVG area chart element.
   * Receives the chart title. Default: (title) => `${title} area chart`
   */
  chartLabel?: (title: string) => string;
  /**
   * Caption for the SR-only data table.
   * Receives the chart title. Default: (title) => `${title} — data breakdown`
   */
  tableCaption?: (title: string) => string;
  /** Column header for the time period column. Default: "Period" */
  columnPeriod?: string;
  /** Text displayed in the empty state (no data). Default: "No data available" */
  emptyState?: string;
}

export interface TypingIndicatorI18nStrings {
  /** SR-only text appended after the sender name (or used standalone). Default: "is typing…" */
  typingLabel?: string;
}

export interface ChatHeaderI18nStrings {
  /** Status label for online state. Default: "Online" */
  onlineLabel?: string;
  /** Status label for away state. Default: "Away" */
  awayLabel?: string;
  /** Status label for offline state. Default: "Offline" */
  offlineLabel?: string;
}

export interface ChatInputBarI18nStrings {
  /** aria-label for the send button. Default: "Send message" */
  sendLabel?: string;
  /** aria-label for the attach file button. Default: "Attach file" */
  attachLabel?: string;
  /** Placeholder text for the message textarea. Default: "Type a message…" */
  placeholder?: string;
}

export interface ChatI18nStrings {
  /** SR-only label for the chat log region. Default: "Chat" */
  chatLabel?: string;
  /** SR-only label for the loading spinner. Default: "Loading messages" */
  loadingLabel?: string;
  /** Date separator label for today. Default: "Today" */
  todayLabel?: string;
  /** Date separator label for yesterday. Default: "Yesterday" */
  yesterdayLabel?: string;
}

// ── Top-level composite dictionary ─────────────────────────────────────────
// Keyed by camelCase component name — consumers pass partial overrides.

export interface GeeklegoI18nStrings {
  label?: LabelI18nStrings;
  navbar?: NavbarI18nStrings;
  carousel?: CarouselI18nStrings;
  colorPicker?: ColorPickerI18nStrings;
  radioGroup?: RadioGroupI18nStrings;
  numberInput?: NumberInputI18nStrings;
  select?: SelectI18nStrings;
  spinner?: SpinnerI18nStrings;
  skeleton?: SkeletonI18nStrings;
  skiplink?: SkipLinkI18nStrings;
  inputGroup?: InputGroupI18nStrings;
  treeItem?: TreeItemI18nStrings;
  treeView?: TreeViewI18nStrings;
  statCard?: StatCardI18nStrings;
  footer?: FooterI18nStrings;
  avatar?: AvatarI18nStrings;
  rating?: RatingI18nStrings;
  breadcrumb?: BreadcrumbI18nStrings;
  dateInput?: DateInputI18nStrings;
  dropdownMenu?: DropdownMenuI18nStrings;
  formField?: FormFieldI18nStrings;
  form?: FormI18nStrings;
  sidebar?: SidebarI18nStrings;
  barChart?: BarChartI18nStrings;
  areaChart?: AreaChartI18nStrings;
  fileInput?: FileInputI18nStrings;
  fileUpload?: FileUploadI18nStrings;
  searchBar?: SearchBarI18nStrings;
  alertBanner?: AlertBannerI18nStrings;
  tooltip?: TooltipI18nStrings;
  pagination?: PaginationI18nStrings;
  toast?: ToastI18nStrings;
  popover?: PopoverI18nStrings;
  combobox?: ComboboxI18nStrings;
  chip?: ChipI18nStrings;
  tag?: TagI18nStrings;
  fieldset?: FieldsetI18nStrings;
  stepper?: StepperI18nStrings;
  header?: HeaderI18nStrings;
  modal?: ModalI18nStrings;
  drawer?: DrawerI18nStrings;
  accordion?: AccordionI18nStrings;
  tabs?: TabsI18nStrings;
  dataTable?: DataTableI18nStrings;
  datepicker?: DatepickerI18nStrings;
  typingIndicator?: TypingIndicatorI18nStrings;
  chatHeader?: ChatHeaderI18nStrings;
  chatInputBar?: ChatInputBarI18nStrings;
  chat?: ChatI18nStrings;
}

// ── Formatters ─────────────────────────────────────────────────────────────

export interface GeeklegoFormatters {
  /**
   * Format a number for chart metric and Y-axis display.
   * Replaces AreaChart's built-in K/M suffix formatter when provided.
   * Default: built-in component formatter (K/M suffixes) — not set here.
   */
  formatNumber?: (value: number, options?: Intl.NumberFormatOptions) => string;
  /**
   * Format a number as a percentage string (e.g. "42.1%").
   * Default: `${value.toFixed(1)}%`
   */
  formatPercent?: (value: number, fractionDigits?: number) => string;
  /**
   * Format a Date or ISO string for display.
   * Included for future components accepting raw Date objects.
   * Default: Intl.DateTimeFormat with browser locale.
   */
  formatDate?: (value: Date | string, options?: Intl.DateTimeFormatOptions) => string;
}

// ── Context value ──────────────────────────────────────────────────────────

export interface GeeklegoI18nContextValue {
  strings: GeeklegoI18nStrings;
  formatters: GeeklegoFormatters;
  /** BCP 47 locale tag, e.g. "en-US", "ar", "de". Defaults to navigator.language. */
  locale?: string;
}

// ── Default strings (module-scope constant — never recreated per render) ───
// These are the English fallbacks used when no i18n provider is present.

export const DEFAULT_STRINGS: GeeklegoI18nStrings = {
  navbar: {
    navLabel: 'Navigation',
  },
  carousel: {
    previousSlide: 'Previous slide',
    nextSlide: 'Next slide',
    goToSlide: (n) => `Go to slide ${n}`,
    slideLabel: (n, total) => `${n} of ${total}`,
    pauseAutoPlay: 'Pause auto-play',
    resumeAutoPlay: 'Resume auto-play',
  },
  footer: {
    footerLabel: 'Footer',
    navLabel: 'Footer navigation',
  },
  label: {
    required: '(required)',
    optional: '(Optional)',
  },
  avatar: {
    fallbackLabel: 'User avatar',
  },
  rating: {
    starLabel: ({ value, max }) => `${value} out of ${max} stars`,
  },
  breadcrumb: {
    navLabel: 'Breadcrumb',
  },
  dateInput: {
    placeholder: 'MM/DD/YYYY',
    invalidDateMessage: 'Please enter a valid date.',
    requiredMessage: 'Date is required.',
  },
  dropdownMenu: {
    defaultMenuLabel: 'Menu',
  },
  formField: {
    required: '(required)',
    optional: '(Optional)',
  },
  form: {
    label: 'Form',
  },
  sidebar: {
    sidebarLabel: 'Sidebar',
    navLabel: 'Sidebar navigation',
    footerLabel: 'Sidebar footer',
    expandLabel: 'Expand sidebar',
    collapseLabel: 'Collapse sidebar',
  },
  barChart: {
    deltaLabel: 'from last period',
    periodSelectorLabel: 'Select time period',
    legendLabel: 'Chart legend',
    chartLabel: (title) => `${title} distribution chart`,
    tableCaption: (title) => `${title} — data breakdown`,
    columnSegment: 'Segment',
    columnValue: 'Value',
    columnShare: 'Share',
    totalLabel: 'Total',
  },
  areaChart: {
    deltaLabel: 'from last period',
    periodSelectorLabel: 'Select time period',
    legendLabel: 'Chart legend',
    chartLabel: (title) => `${title} area chart`,
    tableCaption: (title) => `${title} — data breakdown`,
    columnPeriod: 'Period',
    emptyState: 'No data available',
  },
  fileInput: {
    placeholder: 'No file chosen',
    browseLabel: 'Browse',
    filesSelectedLabel: (count) => `${count} files selected`,
  },
  fileUpload: {
    dropzoneTitle:   'Drop files here',
    dragActiveTitle: 'Release to drop',
    dropzoneHint:    'or click to',
    browseText:      'browse',
    inputLabel:      'Upload files',
    removeFileLabel: 'Remove file',
    uploadingText:   'Uploading\u2026',
    doneText:        'Done',
    maxSizeError:    (size) => `File exceeds ${size} limit`,
    maxFilesError:   (max) => `Maximum ${max} file${max === 1 ? '' : 's'} allowed`,
  },
  searchBar: {
    searchLabel: 'Search',
    clearLabel: 'Clear search',
  },
  alertBanner: {
    dismissLabel: 'Dismiss',
  },
  tooltip: {
    panelLabel: 'Tooltip',
  },
  pagination: {
    prevLabel: 'Previous page',
    nextLabel: 'Next page',
    firstLabel: 'First page',
    lastLabel: 'Last page',
    pageLabel: ({ page, total }) => `Page ${page} of ${total}`,
    navLabel: 'Pagination',
  },
  toast: {
    dismissLabel: 'Dismiss',
  },
  popover: {
    closeLabel: 'Close',
  },
  combobox: {
    clearLabel: 'Clear',
    listboxLabel: 'Options',
    noResultsMessage: 'No results',
    loadingMessage: 'Loading options\u2026',
  },
  chip: {
    removeLabel: 'Remove',
  },
  tag: {
    removeLabel: 'Remove',
  },
  fieldset: {
    required: '(required)',
  },
  radioGroup: {
    required: '(required)',
  },
  select: {
    placeholder: 'Select…',
  },
  spinner: {
    label: 'Loading…',
  },
  skeleton: {
    ariaLabel: 'Loading',
  },
  skiplink: {
    label: 'Skip to main content',
  },
  inputGroup: {
    placeholder: 'Search…',
  },
  treeItem: {
    expandLabel: (label) => `Expand ${label}`,
    collapseLabel: (label) => `Collapse ${label}`,
  },
  treeView: {
    expandLabel: (label) => `Expand ${label}`,
    collapseLabel: (label) => `Collapse ${label}`,
  },
  numberInput: {
    decrementLabel: 'Decrease value',
    incrementLabel: 'Increase value',
  },
  statCard: {
    loadingLabel: 'Loading',
    trendUpLabel: 'Trending up',
    trendDownLabel: 'Trending down',
  },
  stepper: {
    listLabel: 'Steps',
    completedLabel: '(Completed)',
    errorLabel: '(Error)',
  },
  header: {
    navLabel: 'Primary',
    mobileNavLabel: 'Navigation',
    openMenuLabel: 'Open menu',
    closeMenuLabel: 'Close menu',
  },
  modal: {
    closeLabel: 'Close',
    dialogLabel: 'Dialog',
  },
  drawer: {
    closeLabel: 'Close',
    drawerLabel: 'Drawer',
  },
  accordion: {
    expandLabel: 'Expand',
    collapseLabel: 'Collapse',
  },
  tabs: {
    listLabel: 'Tabs',
  },
  dataTable: {
    sortAscLabel:   (header) => `Sort ${header} descending`,
    sortDescLabel:  (header) => `Clear sort for ${header}`,
    sortNoneLabel:  (header) => `Sort ${header} ascending`,
    loadingLabel:   'Loading data',
    emptyMessage:   'No results found',
    selectAllLabel: 'Select all rows',
    selectRowLabel: (n) => `Select row ${n}`,
  },
  datepicker: {
    triggerLabel: 'Open calendar',
    prevMonthLabel: 'Previous month',
    nextMonthLabel: 'Next month',
    todayLabel: 'Today',
  },
  colorPicker: {
    colorLabel: 'Color',
    spectrumLabel: 'Color spectrum. Use arrow keys to adjust saturation and brightness.',
    hueLabel: 'Hue',
    opacityLabel: 'Opacity',
    hexLabel: 'Hex',
    redLabel: 'R',
    greenLabel: 'G',
    blueLabel: 'B',
    hueChannelLabel: 'H',
    saturationLabel: 'S',
    lightnessLabel: 'L',
    presetsLabel: 'Preset colors',
    copyLabel: 'Copy hex',
    copiedLabel: 'Copied!',
  },
  typingIndicator: {
    typingLabel: 'is typing\u2026',
  },
  chatHeader: {
    onlineLabel: 'Online',
    awayLabel: 'Away',
    offlineLabel: 'Offline',
  },
  chatInputBar: {
    sendLabel: 'Send message',
    attachLabel: 'Attach file',
    placeholder: 'Type a message\u2026',
  },
  chat: {
    chatLabel: 'Chat',
    loadingLabel: 'Loading messages',
    todayLabel: 'Today',
    yesterdayLabel: 'Yesterday',
  },
};

// ── Default formatters (module-scope constant — never recreated per render) ─

export const DEFAULT_FORMATTERS: GeeklegoFormatters = {
  formatPercent: (value, fractionDigits = 1) => `${value.toFixed(fractionDigits)}%`,
  formatDate: (value, options) => {
    const date = value instanceof Date ? value : new Date(value as string);
    return new Intl.DateTimeFormat(undefined, options).format(date);
  },
  // formatNumber intentionally omitted — components use their own built-in formatter
  // and only swap to this when explicitly provided via context.
};
