// Pure data — no React imports. Safe to import from server components.
// When adding a new component, append its name to the correct category here.
// The docs site imports this via "@geeklego/ui/catalog" and auto-generates the registry.

export const componentCatalog = {
  atoms: [
    'Avatar', 'Badge', 'BreadcrumbItem', 'Button', 'Checkbox', 'Chip', 'Divider',
    'EmptyState', 'FileInput', 'Heading', 'Image', 'Input', 'Item', 'Label', 'Link',
    'List', 'NavItem', 'ProgressBar', 'ProgressIndicator', 'Quote', 'Radio', 'Rating', 'SegmentedControl',
    'ColorSwatch', 'Select', 'Skeleton', 'SkipLink', 'Slider', 'Spinner', 'Stack', 'Switch', 'Tag', 'Textarea',
    'ChatBubble', 'ThemeSwitcher', 'Toggle', 'TreeItem', 'TypingIndicator', 'Video', 'VisuallyHidden',
  ],
  molecules: [
    'AlertBanner', 'Breadcrumb', 'ButtonGroup', 'Card', 'Combobox', 'DateInput',
    'ChatHeader', 'ChatInputBar', 'ChatMessage', 'DropdownMenu', 'Fieldset', 'FileUpload', 'FormField', 'InputGroup', 'Navbar', 'NumberInput', 'Pagination', 'Popover',
    'RadioGroup', 'SearchBar', 'StatCard', 'Stepper', 'Toast', 'Tooltip', 'TreeView',
  ],
  organisms: [
    'Accordion', 'AreaChart', 'BarChart', 'Carousel', 'Chat', 'ColorPicker', 'DataTable', 'Datepicker', 'Drawer', 'Footer', 'Form',
    'Header', 'Modal', 'Sidebar', 'Tabs',
  ],
} as const;

export type ComponentName =
  | (typeof componentCatalog.atoms)[number]
  | (typeof componentCatalog.molecules)[number]
  | (typeof componentCatalog.organisms)[number];
