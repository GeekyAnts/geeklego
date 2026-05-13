# Datepicker

Calendar-based date selection component with text input, popover calendar, and full keyboard navigation per the WAI-ARIA Date Picker Dialog pattern.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `Date \| null` | — | Controlled selected date |
| `defaultValue` | `Date` | — | Uncontrolled initial date |
| `onChange` | `(date: Date \| null) => void` | — | Fired when a date is selected or cleared |
| `min` | `Date` | — | Earliest selectable date |
| `max` | `Date` | — | Latest selectable date |
| `label` | `string` | **required** | Field label text |
| `hint` | `string` | — | Helper text below input |
| `errorMessage` | `string` | — | Validation error (replaces hint) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and typography scale |
| `variant` | `'default' \| 'filled' \| 'flushed' \| 'unstyled'` | `'default'` | Input visual style |
| `disabled` | `boolean` | `false` | Disables all interaction |
| `isLoading` | `boolean` | `false` | Shows spinner, disables interaction |
| `placeholder` | `string` | `'YYYY-MM-DD'` | Input placeholder text |
| `firstDayOfWeek` | `0 \| 1` | `1` | 0 = Sunday, 1 = Monday |
| `i18nStrings` | `DatepickerI18nStrings` | — | System string overrides |
| `wrapperClassName` | `string` | — | Class on outer wrapper |
| `id` | `string` | auto | Input element ID |

## Tokens Used

All tokens defined in `design-system/geeklego.css` under the `Datepicker` block:

| Token | Purpose |
|---|---|
| `--datepicker-gap` | Vertical gap between label, input, hint/error |
| `--datepicker-hint-text` | Hint text color |
| `--datepicker-error-text` | Error text color |
| `--datepicker-trigger-gap` | Gap between input and calendar button |
| `--datepicker-panel-bg` | Calendar panel background |
| `--datepicker-panel-border` | Calendar panel border |
| `--datepicker-panel-radius` | Calendar panel border radius |
| `--datepicker-panel-shadow` | Calendar panel shadow |
| `--datepicker-panel-z` | Calendar panel z-index |
| `--datepicker-panel-px/py` | Calendar panel padding |
| `--datepicker-header-text` | Month/year heading color |
| `--datepicker-header-gap` | Gap in calendar header |
| `--datepicker-weekday-text` | Weekday abbreviation color |
| `--datepicker-day-size` | Day cell width/height |
| `--datepicker-day-radius` | Day cell border radius |
| `--datepicker-day-gap` | Gap between day cells |
| `--datepicker-day-text` | Default day text color |
| `--datepicker-day-bg-hover` | Day hover background |
| `--datepicker-day-bg-active` | Day pressed background |
| `--datepicker-day-bg-selected` | Selected day background |
| `--datepicker-day-text-selected` | Selected day text color |
| `--datepicker-day-border-today` | Today indicator border |
| `--datepicker-day-text-outside` | Outside-month day text |
| `--datepicker-day-text-disabled` | Disabled day text |

## Variants

Inherits from the Input atom: `default`, `filled`, `flushed`, `unstyled`.

## Sizes

| Size | Input height | Typography |
|---|---|---|
| `sm` | 32px | `text-body-sm` |
| `md` | 40px | `text-body-md` |
| `lg` | 48px | `text-body-lg` |

## States

| State | Behavior |
|---|---|
| Default | Resting — input + calendar button visible |
| Hover | Input and button follow their own hover patterns |
| Focus | Input focus ring (inset), calendar button focus ring |
| Open | Calendar panel appears below, focus moves to selected/today |
| Selected | Selected day has filled action-primary background |
| Today | Today has a strong border ring |
| Error | Input border turns error, error message announced via `role="alert"` |
| Disabled | All interaction disabled, muted appearance |
| Loading | Spinner in input, all interaction disabled |
| Min/Max | Days outside range are visually disabled and non-interactive |

## Accessibility

### Semantic structure

- **Input**: `<input type="text">` with `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`
- **Calendar button**: `<button>` with `aria-label` from i18n
- **Calendar panel**: `<div role="dialog" aria-modal="true" aria-labelledby>`
- **Calendar grid**: `<table role="grid">` with `<th scope="col" abbr>` for weekdays
- **Day cells**: `<button>` with `aria-selected`, `aria-current="date"` (today), `aria-disabled`
- **Month heading**: `aria-live="polite"` announces month changes

### Keyboard interaction

| Key | Context | Action |
|---|---|---|
| `ArrowDown` | Input focused | Opens calendar |
| `Enter` / `Space` | Day focused | Selects date, closes calendar |
| `ArrowLeft` / `ArrowRight` | Grid focused | Previous / next day |
| `ArrowUp` / `ArrowDown` | Grid focused | Previous / next week |
| `Home` / `End` | Grid focused | Start / end of week |
| `PageUp` / `PageDown` | Grid focused | Previous / next month |
| `Shift+PageUp` / `Shift+PageDown` | Grid focused | Previous / next year |
| `Escape` | Calendar open | Closes calendar, returns focus to input |
| `Tab` | Calendar open | Cycles within focus trap |

### Screen reader announcements

- Month/year heading has `aria-live="polite"` — announces when month changes
- Each day button has an `aria-label` with full date text (e.g., "15 March 2026")
- Today's date appends the `todayLabel` string (e.g., ", Today")
- Error messages use `role="alert"` for immediate announcement

## Usage

```tsx
import { Datepicker } from '@geeklego/ui/components/organisms/Datepicker';

// Uncontrolled
<Datepicker
  label="Start date"
  hint="When should the project begin?"
  onChange={(date) => console.log(date)}
/>

// Controlled
const [date, setDate] = useState<Date | null>(null);
<Datepicker
  label="Appointment"
  value={date}
  onChange={setDate}
  min={new Date()}
  errorMessage={!date ? 'Required' : undefined}
/>

// Monday-first (default) or Sunday-first
<Datepicker label="Date" firstDayOfWeek={0} />

// Localized
<Datepicker
  label="Datum"
  i18nStrings={{
    triggerLabel: 'Kalender oeffnen',
    prevMonthLabel: 'Vorheriger Monat',
    nextMonthLabel: 'Naechster Monat',
    todayLabel: 'Heute',
    monthNames: ['Januar', 'Februar', 'Maerz', ...],
    weekdayNames: ['Montag', 'Dienstag', ...],
    weekdayNamesShort: ['Mo', 'Di', 'Mi', ...],
  }}
/>
```
