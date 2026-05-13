# String Inventory — i18n Audit Table

Per-component catalogue of system-generated strings that must be externalizable via `i18nStrings`.

**System string** = any string a user reads or a screen reader announces that is NOT consumer-supplied content (not `children`, `title`, `label`, `placeholder` props that the consumer explicitly passes).

---

## Components with System Strings (need `i18nStrings` prop)

| Component | Level | File | System strings | i18nStrings type | Status |
|---|---|---|---|---|---|
| `Label` | L1 | `components/atoms/Label/` | `(required)` (sr-only), `(Optional)` (visible) | `LabelI18nStrings` | ✅ Done |
| `Avatar` | L1 | `components/atoms/Avatar/` | fallback `'User avatar'` default alt/aria-label | `AvatarI18nStrings` | ✅ Done |
| `Rating` | L1 | `components/atoms/Rating/` | `"${v} out of ${max} stars"` (read-only span + each radio) | `RatingI18nStrings` | ✅ Done |
| `Breadcrumb` | L2 | `components/molecules/Breadcrumb/` | `"Breadcrumb"` on `<nav aria-label>` | `BreadcrumbI18nStrings` | ✅ Done |
| `Sidebar` | L3 | `components/organisms/Sidebar/` | `"Sidebar"`, `"Sidebar navigation"` (×2), `"Sidebar footer"`, `"Expand sidebar"`, `"Collapse sidebar"` | `SidebarI18nStrings` | ✅ Done |
| `BarChart` | L3 | `components/organisms/BarChart/` | `deltaLabel` default, `"Select time period"`, `"Chart legend"`, chart aria-label fn, table caption fn, `"Segment"`, `"Value"`, `"Share"`, `"Total"` | `BarChartI18nStrings` | ✅ Done |
| `AreaChart` | L3 | `components/organisms/AreaChart/` | `deltaLabel` default, `"Select time period"`, `"Chart legend"`, chart aria-label fn, table caption fn, `"Period"`, `"No data available"` | `AreaChartI18nStrings` | ✅ Done |
| `FileInput` | L1 | `components/atoms/FileInput/` | `"No file chosen"` (placeholder), `"Browse"` (action label), `"${n} files selected"` (multi-file fn) | `FileInputI18nStrings` | ✅ Done |
| `FileUpload` | L2 | `components/molecules/FileUpload/` | `"Drop files here"` (title), `"Release to drop"` (drag-active), `"or click to"` (hint prefix), `"browse"` (link), `"Upload files"` (input aria-label), `"Remove file"` (remove aria-label), `"Uploading…"`, `"Done"`, size-error fn, max-files-error fn | `FileUploadI18nStrings` | ✅ Done |
| `SearchBar` | L2 | `components/molecules/SearchBar/` | `"Search"` (label/landmark default), `"Clear search"` (clear button aria-label) | `SearchBarI18nStrings` | ✅ Done |
| `AlertBanner` | L2 | `components/molecules/AlertBanner/` | `"Dismiss"` (dismiss button aria-label) | `AlertBannerI18nStrings` | ✅ Done |
| `Tooltip` | L2 | `components/molecules/Tooltip/` | `"Tooltip"` (panel aria-label when content is non-textual) | `TooltipI18nStrings` | ✅ Done |
| `Pagination` | L2 | `components/molecules/Pagination/` | `"Previous page"`, `"Next page"`, `"First page"`, `"Last page"`, `"Page X of Y"` fn, `"Pagination"` nav label | `PaginationI18nStrings` | ✅ Done |
| `Toast` | L2 | `components/molecules/Toast/` | `"Dismiss"` (dismiss button aria-label) | `ToastI18nStrings` | ✅ Done |
| `Popover` | L2 | `components/molecules/Popover/` | `"Close"` (close button aria-label in header) | `PopoverI18nStrings` | ✅ Done |
| `Combobox` | L2 | `components/molecules/Combobox/` | `"Clear"` (clear button aria-label), `"Options"` (listbox aria-label), `"No results"` (empty state), `"Loading options…"` (loading state) | `ComboboxI18nStrings` | ✅ Done |
| `Fieldset` | L2 | `components/molecules/Fieldset/` | `"(required)"` (sr-only text on legend when required=true) | `FieldsetI18nStrings` | ✅ Done |
| `Stepper` | L2 | `components/molecules/Stepper/` | `"Steps"` (ol aria-label), `"(Completed)"` (sr-only on completed indicator), `"(Error)"` (sr-only on error indicator) | `StepperI18nStrings` | ✅ Done |
| `Header` | L3 | `components/organisms/Header/` | `"Primary"` (nav aria-label), `"Navigation"` (mobile nav aria-label), `"Open menu"` / `"Close menu"` (mobile toggle) | `HeaderI18nStrings` | ✅ Done |
| `Navbar` | L2 | `components/molecules/Navbar/` | `"Navigation"` (nav aria-label default) | `NavbarI18nStrings` | ✅ Done |
| `Chip` | L1 | `components/atoms/Chip/` | `"Remove"` (remove button aria-label default) | `ChipI18nStrings` | ✅ Done |
| `Tag` | L1 | `components/atoms/Tag/` | `"Remove"` (remove button aria-label default) | `TagI18nStrings` | ✅ Done |
| `Footer` | L3 | `components/organisms/Footer/` | `"Footer"` (footer aria-label), `"Footer navigation"` (default nav aria-label per column) | `FooterI18nStrings` | ✅ Done |
| `Modal` | L3 | `components/organisms/Modal/` | `"Close"` (close button aria-label), `"Dialog"` (fallback aria-label when no title) | `ModalI18nStrings` | ✅ Done |
| `Drawer` | L3 | `components/organisms/Drawer/` | `"Close"` (close button aria-label), `"Drawer"` (fallback aria-label when no title) | `DrawerI18nStrings` | ✅ Done |
| `Datepicker` | L3 | `components/organisms/Datepicker/` | `"Open calendar"` (trigger aria-label), `"Previous month"` / `"Next month"` (nav buttons), `"Today"` (today cue), month names, weekday names | `DatepickerI18nStrings` | ✅ Done |
| `ColorPicker` | L3 | `components/organisms/ColorPicker/` | `"Color"` (group label), `"Color spectrum…"` (spectrum aria-label), `"Hue"`, `"Opacity"`, `"Hex"`, `"R"`, `"G"`, `"B"`, `"H"`, `"S"`, `"L"` (channel labels), `"Preset colors"`, `"Copy hex"`, `"Copied!"` | `ColorPickerI18nStrings` | ✅ Done |
| `Carousel` | L3 | `components/organisms/Carousel/` | `"Previous slide"` (prev button aria-label), `"Next slide"` (next button aria-label), `(n) => "Go to slide N"` (dot aria-label fn), `(n, total) => "N of Total"` (slide label + live region fn), `"Pause auto-play"`, `"Resume auto-play"` (autoplay toggle) | `CarouselI18nStrings` | ✅ Done |

### Upcoming components (apply on creation)

| Component | Anticipated system strings | i18nStrings type to create |
|---|---|---|
| `Spinner` | `"Loading…"` label (already a prop — document in i18nStrings as well) | `SpinnerI18nStrings` |
| `Skeleton` | `"Loading"` aria-label default | `SkeletonI18nStrings` |
| `Select` | `"Select…"` placeholder default (already a prop — document) | `SelectI18nStrings` |
| `Image` | SR text appended on load error | `ImageI18nStrings` |
| ~~`Modal`~~ | ~~`"Close"` button aria-label, `"Dialog"` role label~~ | ~~`ModalI18nStrings`~~ | ✅ Done |
| ~~`Tooltip`~~ | ~~`"Tooltip"` role description~~ | ~~`TooltipI18nStrings`~~ | ✅ Done |
| ~~`Pagination`~~ | ~~`"Previous page"`, `"Next page"`, `"Page X of Y"`~~ | ~~`PaginationI18nStrings`~~ | ✅ Done |
| ~~`SearchBar`~~ | ~~`"Search"` placeholder default, `"Clear"` button aria-label~~ | ~~`SearchBarI18nStrings`~~ | ✅ Done |
| ~~`DataTable`~~ | ~~Sort button aria-labels, `"Loading data"`, `"No results found"`, `"Select all rows"`, `"Select row N"`~~ | ~~`DataTableI18nStrings`~~ | ✅ Done |
| ~~`Accordion`~~ | ~~`"Expand"` / `"Collapse"` sr-only hints on triggers~~ | ~~`AccordionI18nStrings`~~ | ✅ Done |
| ~~`Tabs`~~ | ~~Tab list aria-label~~ | ~~`TabsI18nStrings`~~ | ✅ Done |

---

## Components with No System Strings (RTL audit only)

These components contain no hardcoded system strings. They only need RTL logical property audit when modified.

| Component | Level | RTL fixes needed? |
|---|---|---|
| `Button` | L1 | No (symmetric padding) |
| `Input` | L1 | ✅ Done — `pl-/pr-/left-/right-` → `ps-/pe-/start-/end-` |
| `Textarea` | L1 | ✅ Done — `right-*` → `end-*` on spinner |
| `Checkbox` | L1 | Check for `pl-*` (label indent) |
| `Radio` | L1 | Check for `pl-*` (label indent) |
| `Switch` | L1 | Thumb translate direction — deferred (noted in README) |
| `Toggle` | L1 | Minimal layout — low risk |
| `Badge` | L1 | No directional classes |
| `Divider` | L1 | No directional classes |
| `NavItem` | L1 | ✅ Done — `ml-auto` → `ms-auto`, `ml-*` → `ms-*`, `pl-*` → `ps-*`, `border-l` → `border-s` |
| `BreadcrumbItem` | L1 | No directional classes |
| `Item` | L1 | ✅ Clean — uses `px-*` (symmetric) |
| `Select` | L1 | ✅ Clean — uses `px-*` (symmetric), overlay anchors exempt |
| `Heading` | L1 | No directional classes |
| `Link` | L1 | No directional classes |
| `List` | L1 | ✅ Done — `pl-*` → `ps-*` for bullet/ordered indent |
| `TreeItem` | L1 | ✅ Done — `ml-auto` → `ms-auto` (×2), `paddingLeft` → `paddingInlineStart` |
| `ProgressBar` | L1 | No directional classes |

---

## How to Add a New Entry

When you build a new component that has system strings:

1. Add a row to the "Components with System Strings" table above
2. Add the interface to `GeeklegoI18nProvider.types.ts`
3. Add the key + defaults to `DEFAULT_STRINGS` in `GeeklegoI18nProvider.types.ts`
4. Export the type from `components/utils/i18n/index.ts`
5. Add `i18nStrings?` prop to the component's `.types.ts`
6. Call `useComponentI18n('key', i18nStrings)` in the component's `.tsx`

---

## String Classification Guide

**System string (externalise):**
- `aria-label` on a landmark, chart, or icon-only button with a fixed phrase
- SR-only status text: `"Loading…"`, `"(required)"`, `"User avatar"`
- Default text that appears when the consumer omits a prop
- Table headers in SR-only data tables

**Content string (keep as prop, do not wrap in i18n):**
- `children` / `label` / `title` — the consumer always supplies these
- `placeholder` — consumer content, but the prop default can be covered by `i18nStrings`
- `deltaLabel` — consumer content (e.g. "from last week") but the prop default `"from last period"` should be i18n-covered via the augment pattern
