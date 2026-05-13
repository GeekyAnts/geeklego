"use client";

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '../../atoms/Input/Input';
import { Button } from '../../atoms/Button/Button';
import { Label } from '../../atoms/Label/Label';
import { useFocusTrap } from '../../utils/keyboard/useFocusTrap';
import { useEscapeDismiss } from '../../utils/keyboard/useEscapeDismiss';
import { useClickOutside } from '../../utils/keyboard/useClickOutside';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type { DatepickerProps } from './Datepicker.types';

// ── Date helpers (pure, no side effects) ──────────────────────────────────────

/** Format a Date as YYYY-MM-DD */
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parse a YYYY-MM-DD string into a Date, or null if invalid */
function parseDate(str: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
  const [y, m, d] = str.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

/** Check if two dates represent the same calendar day */
function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Strip time — return a new Date at midnight */
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Get the number of days in a month */
function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Build a 6×7 grid of Date objects for a month view */
function buildCalendarGrid(year: number, month: number, firstDayOfWeek: 0 | 1): Date[][] {
  const firstOfMonth = new Date(year, month, 1);
  let startDay = firstOfMonth.getDay() - firstDayOfWeek;
  if (startDay < 0) startDay += 7;

  const gridStart = new Date(year, month, 1 - startDay);
  const weeks: Date[][] = [];

  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      const dayOffset = w * 7 + d;
      week.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + dayOffset));
    }
    weeks.push(week);
  }
  return weeks;
}

/** Default English month names */
const DEFAULT_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Default English weekday abbreviations (Monday-first) */
const DEFAULT_WEEKDAY_NAMES_MON = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const DEFAULT_WEEKDAY_NAMES_SUN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const DEFAULT_WEEKDAY_FULL_MON = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DEFAULT_WEEKDAY_FULL_SUN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ── Hoisted static classes ────────────────────────────────────────────────────

const HINT_CLASSES = 'text-body-sm text-[var(--datepicker-hint-text)] clamp-description';
const ERROR_CLASSES = 'text-body-sm text-[var(--datepicker-error-text)] clamp-description';

const PANEL_BASE_CLASSES = [
  'absolute z-[var(--datepicker-panel-z)]',
  'top-full start-0 mt-[var(--spacing-component-xs)]',
  'bg-[var(--datepicker-panel-bg)]',
  'border border-[var(--datepicker-panel-border)]',
  'rounded-[var(--datepicker-panel-radius)]',
  'shadow-[var(--datepicker-panel-shadow)]',
  'px-[var(--datepicker-panel-px)] py-[var(--datepicker-panel-py)]',
  'transition-enter',
].join(' ');

const HEADER_CLASSES = [
  'flex items-center justify-between',
  'gap-[var(--datepicker-header-gap)]',
  'mb-[var(--datepicker-header-gap)]',
].join(' ');

const WEEKDAY_HEADER_CLASSES = [
  'text-center text-label-sm',
  'text-[var(--datepicker-weekday-text)]',
  'pb-[var(--datepicker-day-gap)]',
].join(' ');

const DAY_BASE_CLASSES = [
  'inline-flex items-center justify-center',
  'w-[var(--datepicker-day-size)] h-[var(--datepicker-day-size)]',
  'rounded-[var(--datepicker-day-radius)]',
  'text-body-sm',
  'transition-default',
  'focus-visible:outline-none focus-visible:focus-ring',
  'cursor-pointer select-none',
].join(' ');

// ── Component ─────────────────────────────────────────────────────────────────

export const Datepicker = memo(
  forwardRef<HTMLDivElement, DatepickerProps>(
    (
      {
        value: controlledValue,
        defaultValue,
        onChange,
        min,
        max,
        label,
        hint,
        errorMessage,
        size = 'md',
        variant = 'default',
        disabled = false,
        isLoading = false,
        placeholder = 'YYYY-MM-DD',
        firstDayOfWeek = 1,
        i18nStrings,
        wrapperClassName,
        id: idProp,
        className,
        ...rest
      },
      ref,
    ) => {
      const i18n = useComponentI18n('datepicker', i18nStrings);

      // ── IDs ──────────────────────────────────────────────────────────────
      const baseId = useId();
      const fieldId = idProp ?? baseId;
      const hintId = `${fieldId}-hint`;
      const errorId = `${fieldId}-error`;
      const panelId = `${fieldId}-calendar`;
      const gridId = `${fieldId}-grid`;
      const headingId = `${fieldId}-heading`;

      // ── Derived state ────────────────────────────────────────────────────
      const hasError = Boolean(errorMessage);
      const isDisabled = disabled || isLoading;
      const today = useMemo(() => startOfDay(new Date()), []);

      // ── Selected date (controlled / uncontrolled) ────────────────────────
      const isControlled = controlledValue !== undefined;
      const [uncontrolledValue, setUncontrolledValue] = useState<Date | null>(defaultValue ?? null);
      const selectedDate = isControlled ? controlledValue : uncontrolledValue;

      // ── Input text ───────────────────────────────────────────────────────
      const [inputText, setInputText] = useState(selectedDate ? formatDate(selectedDate) : '');

      // Sync input text when controlled value changes
      useEffect(() => {
        if (isControlled) {
          setInputText(controlledValue ? formatDate(controlledValue) : '');
        }
      }, [isControlled, controlledValue]);

      // ── Open state ───────────────────────────────────────────────────────
      const [isOpen, setIsOpen] = useState(false);

      // ── Displayed month ──────────────────────────────────────────────────
      const [displayMonth, setDisplayMonth] = useState(() => {
        const base = selectedDate ?? today;
        return { year: base.getFullYear(), month: base.getMonth() };
      });

      // ── Focused date in grid (for keyboard navigation) ──────────────────
      const [focusedDate, setFocusedDate] = useState<Date>(() => selectedDate ?? today);

      // ── Refs ─────────────────────────────────────────────────────────────
      const containerRef = useRef<HTMLDivElement>(null);
      const panelRef = useRef<HTMLDivElement>(null);
      const inputRef = useRef<HTMLInputElement>(null);
      const focusedDayRef = useRef<HTMLButtonElement>(null);

      // ── i18n strings ─────────────────────────────────────────────────────
      const monthNames: string[] = i18n.monthNames ?? DEFAULT_MONTH_NAMES;
      const weekdayAbbr = firstDayOfWeek === 1
        ? (i18n.weekdayNamesShort ?? DEFAULT_WEEKDAY_NAMES_MON)
        : (i18n.weekdayNamesShort ?? DEFAULT_WEEKDAY_NAMES_SUN);
      const weekdayFull = firstDayOfWeek === 1
        ? (i18n.weekdayNames ?? DEFAULT_WEEKDAY_FULL_MON)
        : (i18n.weekdayNames ?? DEFAULT_WEEKDAY_FULL_SUN);

      // ── Calendar grid data ───────────────────────────────────────────────
      const weeks = useMemo(
        () => buildCalendarGrid(displayMonth.year, displayMonth.month, firstDayOfWeek),
        [displayMonth.year, displayMonth.month, firstDayOfWeek],
      );

      // ── Min/max helpers ──────────────────────────────────────────────────
      const minDay = useMemo(() => (min ? startOfDay(min) : null), [min]);
      const maxDay = useMemo(() => (max ? startOfDay(max) : null), [max]);

      const isDayDisabled = useCallback(
        (date: Date) => {
          if (minDay && date < minDay) return true;
          if (maxDay && date > maxDay) return true;
          return false;
        },
        [minDay, maxDay],
      );

      // ── Handlers ─────────────────────────────────────────────────────────

      const selectDate = useCallback(
        (date: Date) => {
          if (!isControlled) setUncontrolledValue(date);
          setInputText(formatDate(date));
          onChange?.(date);
          setIsOpen(false);
          // Return focus to input after selection
          requestAnimationFrame(() => inputRef.current?.focus());
        },
        [isControlled, onChange],
      );

      const open = useCallback(() => {
        if (isDisabled) return;
        const base = selectedDate ?? today;
        setDisplayMonth({ year: base.getFullYear(), month: base.getMonth() });
        setFocusedDate(base);
        setIsOpen(true);
      }, [isDisabled, selectedDate, today]);

      const close = useCallback(() => {
        setIsOpen(false);
        requestAnimationFrame(() => inputRef.current?.focus());
      }, []);

      const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const text = e.target.value;
          setInputText(text);
          const parsed = parseDate(text);
          if (parsed && !isDayDisabled(parsed)) {
            if (!isControlled) setUncontrolledValue(parsed);
            onChange?.(parsed);
            setDisplayMonth({ year: parsed.getFullYear(), month: parsed.getMonth() });
          } else if (text === '') {
            if (!isControlled) setUncontrolledValue(null);
            onChange?.(null);
          }
        },
        [isControlled, onChange, isDayDisabled],
      );

      const handleInputKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
          if (e.key === 'ArrowDown' && !isOpen) {
            e.preventDefault();
            open();
          }
        },
        [isOpen, open],
      );

      const goToPrevMonth = useCallback(() => {
        setDisplayMonth((prev) => {
          const m = prev.month - 1;
          return m < 0 ? { year: prev.year - 1, month: 11 } : { year: prev.year, month: m };
        });
      }, []);

      const goToNextMonth = useCallback(() => {
        setDisplayMonth((prev) => {
          const m = prev.month + 1;
          return m > 11 ? { year: prev.year + 1, month: 0 } : { year: prev.year, month: m };
        });
      }, []);

      // ── Grid keyboard navigation ────────────────────────────────────────
      const navigateFocus = useCallback(
        (date: Date) => {
          // Update display month if the new date is outside the current month
          if (date.getMonth() !== displayMonth.month || date.getFullYear() !== displayMonth.year) {
            setDisplayMonth({ year: date.getFullYear(), month: date.getMonth() });
          }
          setFocusedDate(date);
        },
        [displayMonth.month, displayMonth.year],
      );

      const handleGridKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
          const fd = focusedDate;
          let next: Date | null = null;

          switch (e.key) {
            case 'ArrowLeft':
              next = new Date(fd.getFullYear(), fd.getMonth(), fd.getDate() - 1);
              break;
            case 'ArrowRight':
              next = new Date(fd.getFullYear(), fd.getMonth(), fd.getDate() + 1);
              break;
            case 'ArrowUp':
              next = new Date(fd.getFullYear(), fd.getMonth(), fd.getDate() - 7);
              break;
            case 'ArrowDown':
              next = new Date(fd.getFullYear(), fd.getMonth(), fd.getDate() + 7);
              break;
            case 'Home':
              // Start of week
              next = new Date(fd.getFullYear(), fd.getMonth(), fd.getDate() - ((fd.getDay() - firstDayOfWeek + 7) % 7));
              break;
            case 'End':
              // End of week
              next = new Date(fd.getFullYear(), fd.getMonth(), fd.getDate() + ((6 - (fd.getDay() - firstDayOfWeek + 7) % 7)));
              break;
            case 'PageUp':
              if (e.shiftKey) {
                // Previous year
                next = new Date(fd.getFullYear() - 1, fd.getMonth(), Math.min(fd.getDate(), daysInMonth(fd.getFullYear() - 1, fd.getMonth())));
              } else {
                // Previous month
                const prevMonth = fd.getMonth() - 1;
                const prevYear = prevMonth < 0 ? fd.getFullYear() - 1 : fd.getFullYear();
                const pm = (prevMonth + 12) % 12;
                next = new Date(prevYear, pm, Math.min(fd.getDate(), daysInMonth(prevYear, pm)));
              }
              break;
            case 'PageDown':
              if (e.shiftKey) {
                // Next year
                next = new Date(fd.getFullYear() + 1, fd.getMonth(), Math.min(fd.getDate(), daysInMonth(fd.getFullYear() + 1, fd.getMonth())));
              } else {
                // Next month
                const nextMonth = fd.getMonth() + 1;
                const nextYear = nextMonth > 11 ? fd.getFullYear() + 1 : fd.getFullYear();
                const nm = nextMonth % 12;
                next = new Date(nextYear, nm, Math.min(fd.getDate(), daysInMonth(nextYear, nm)));
              }
              break;
            case 'Enter':
            case ' ':
              e.preventDefault();
              if (!isDayDisabled(fd)) {
                selectDate(fd);
              }
              return;
            default:
              return;
          }

          if (next) {
            e.preventDefault();
            if (!isDayDisabled(next)) {
              navigateFocus(next);
            }
          }
        },
        [focusedDate, firstDayOfWeek, isDayDisabled, navigateFocus, selectDate],
      );

      // ── Focus management ─────────────────────────────────────────────────
      // Focus the focused day button when the panel opens or focusedDate changes
      useEffect(() => {
        if (isOpen) {
          requestAnimationFrame(() => focusedDayRef.current?.focus());
        }
      }, [isOpen, focusedDate]);

      // ── Keyboard / focus hooks ───────────────────────────────────────────
      useFocusTrap({ active: isOpen, containerRef: panelRef });
      useEscapeDismiss({ active: isOpen, onDismiss: close });
      useClickOutside({ active: isOpen, containerRef, onClickOutside: close });

      // ── aria-describedby ─────────────────────────────────────────────────
      const describedBy = useMemo(() => {
        const ids: string[] = [];
        if (hint && !hasError) ids.push(hintId);
        if (hasError) ids.push(errorId);
        return ids.length > 0 ? ids.join(' ') : undefined;
      }, [hint, hasError, hintId, errorId]);

      // ── Classes ──────────────────────────────────────────────────────────
      const wrapperClasses = useMemo(
        () => ['flex flex-col gap-[var(--datepicker-gap)] w-full', wrapperClassName].filter(Boolean).join(' '),
        [wrapperClassName],
      );

      const triggerRowClasses = 'flex items-end gap-[var(--datepicker-trigger-gap)]';

      const panelClasses = useMemo(
        () => [
          PANEL_BASE_CLASSES,
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none invisible',
        ].join(' '),
        [isOpen],
      );

      const monthYearLabel = `${monthNames[displayMonth.month]} ${displayMonth.year}`;

      const rootClasses = useMemo(
        () => ['relative', className].filter(Boolean).join(' '),
        [className],
      );

      // ── Render ───────────────────────────────────────────────────────────
      return (
        <div
          ref={(node) => {
            // Merge forwarded ref + internal containerRef
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
            (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          className={rootClasses}
          {...rest}
        >
          <div className={wrapperClasses}>
            {/* Label */}
            <Label
              htmlFor={fieldId}
              disabled={isDisabled}
              hasError={hasError}
              size={size === 'sm' ? 'sm' : 'md'}
            >
              {label}
            </Label>

            {/* Trigger row: Input + Calendar button */}
            <div className={triggerRowClasses}>
              <div className="content-flex">
                <Input
                  ref={inputRef}
                  type="text"
                  id={fieldId}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  size={size}
                  variant={variant}
                  error={hasError}
                  isLoading={isLoading}
                  disabled={disabled}
                  placeholder={placeholder}
                  aria-describedby={describedBy}
                  aria-haspopup="dialog"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  autoComplete="off"
                />
              </div>
              <Button
                variant="outline"
                size={size}
                disabled={isDisabled}
                onClick={open}
                iconOnly
                leftIcon={<Calendar size={`var(--size-icon-${size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm'})`} aria-hidden="true" />}
                aria-label={i18n.triggerLabel}
              >
                {i18n.triggerLabel}
              </Button>
            </div>

            {/* Hint text */}
            {hint && !hasError && (
              <p id={hintId} className={HINT_CLASSES}>
                {hint}
              </p>
            )}

            {/* Error message */}
            {hasError && (
              <p id={errorId} role="alert" className={ERROR_CLASSES}>
                {errorMessage}
              </p>
            )}
          </div>

          {/* Calendar panel */}
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            aria-hidden={!isOpen}
            className={panelClasses}
          >
            {/* Calendar header — month/year nav */}
            <div className={HEADER_CLASSES}>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={<ChevronLeft size="var(--size-icon-sm)" aria-hidden="true" />}
                onClick={goToPrevMonth}
              >
                {i18n.prevMonthLabel}
              </Button>

              <div
                id={headingId}
                aria-live="polite"
                aria-atomic="true"
                className="text-body-md font-semibold text-[var(--datepicker-header-text)] text-center content-flex"
              >
                {monthYearLabel}
              </div>

              <Button
                variant="ghost"
                size="sm"
                iconOnly
                leftIcon={<ChevronRight size="var(--size-icon-sm)" aria-hidden="true" />}
                onClick={goToNextMonth}
              >
                {i18n.nextMonthLabel}
              </Button>
            </div>

            {/* Calendar grid */}
            <table
              id={gridId}
              role="grid"
              aria-labelledby={headingId}
              className="w-full border-collapse"
              onKeyDown={handleGridKeyDown}
            >
              <thead>
                <tr>
                  {weekdayAbbr.map((day, idx) => (
                    <th
                      key={day}
                      scope="col"
                      abbr={weekdayFull[idx]}
                      className={WEEKDAY_HEADER_CLASSES}
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, wi) => (
                  <tr key={`week-${week[0].getTime()}`}>
                    {week.map((day) => {
                      const isCurrentMonth = day.getMonth() === displayMonth.month;
                      const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                      const isToday = isSameDay(day, today);
                      const dayDisabled = isDayDisabled(day) || !isCurrentMonth;
                      const isFocused = isSameDay(day, focusedDate);

                      const dayClasses = [
                        DAY_BASE_CLASSES,
                        !isCurrentMonth
                          ? 'text-[var(--datepicker-day-text-outside)] pointer-events-none'
                          : dayDisabled
                            ? 'text-[var(--datepicker-day-text-disabled)] cursor-not-allowed pointer-events-none'
                            : isSelected
                              ? 'bg-[var(--datepicker-day-bg-selected)] text-[var(--datepicker-day-text-selected)] font-semibold'
                              : [
                                  'text-[var(--datepicker-day-text)]',
                                  'hover:bg-[var(--datepicker-day-bg-hover)]',
                                  'active:bg-[var(--datepicker-day-bg-active)]',
                                ].join(' '),
                        isToday && !isSelected ? 'border border-[var(--datepicker-day-border-today)] font-semibold' : '',
                      ].filter(Boolean).join(' ');

                      return (
                        <td key={day.getTime()} className="text-center p-0">
                          <button
                            ref={isFocused ? focusedDayRef : undefined}
                            type="button"
                            tabIndex={isFocused ? 0 : -1}
                            disabled={dayDisabled}
                            aria-disabled={dayDisabled || undefined}
                            aria-selected={isSelected || undefined}
                            aria-current={isToday ? 'date' : undefined}
                            aria-label={`${day.getDate()} ${monthNames[day.getMonth()]} ${day.getFullYear()}${isToday ? `, ${i18n.todayLabel}` : ''}`}
                            className={dayClasses}
                            onClick={() => {
                              if (!dayDisabled && isCurrentMonth) selectDate(day);
                            }}
                          >
                            {day.getDate()}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    },
  ),
);

Datepicker.displayName = 'Datepicker';
