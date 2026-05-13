"use client";

import {
  forwardRef,
  memo,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Check, X } from 'lucide-react';
import { Input } from '../../atoms/Input/Input';
import { useEscapeDismiss } from '../../utils/keyboard/useEscapeDismiss';
import { useClickOutside } from '../../utils/keyboard/useClickOutside';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type { ComboboxProps, ComboboxOption, ComboboxSize } from './Combobox.types';

// ── Static class strings (no prop dependency) ────────────────────────────

const panelBase =
  'absolute start-0 top-full w-full z-[var(--combobox-panel-z)] ' +
  'mt-[var(--combobox-panel-offset)] ' +
  'bg-[var(--combobox-panel-bg)] border border-[var(--combobox-panel-border)] ' +
  'rounded-[var(--combobox-panel-radius)] shadow-[var(--combobox-panel-shadow)] ' +
  'p-[var(--combobox-panel-padding)] overflow-y-auto ' +
  'transition-enter';

const optionBase =
  'relative flex items-center gap-[var(--combobox-option-px)] w-full ' +
  'rounded-[var(--combobox-option-radius)] px-[var(--combobox-option-px)] ' +
  'cursor-pointer transition-default select-none perf-contain-content';

const groupLabelBase =
  'flex items-center px-[var(--combobox-group-label-px)] ' +
  'py-[var(--combobox-group-label-py)] text-body-sm ' +
  'text-[var(--combobox-group-label-text)] uppercase tracking-wide ' +
  'truncate-label';

const emptyStateBase =
  'flex items-center justify-center px-[var(--combobox-empty-px)] ' +
  'py-[var(--combobox-empty-py)] text-body-md text-[var(--combobox-empty-text)]';

// ── Size → option height mapping ─────────────────────────────────────────

const optionHeightClass: Record<ComboboxSize, string> = {
  sm: 'h-[var(--combobox-option-height-sm)]',
  md: 'h-[var(--combobox-option-height-md)]',
  lg: 'h-[var(--combobox-option-height-lg)]',
};

// ── Size → icon size mapping ──────────────────────────────────────────────

const iconSizeMap: Record<ComboboxSize, string> = {
  sm: 'var(--size-icon-xs)',
  md: 'var(--size-icon-sm)',
  lg: 'var(--size-icon-md)',
};

// ── Helper — extract unique ordered group names ───────────────────────────

function getGroups(options: ComboboxOption[]): string[] {
  const seen = new Set<string>();
  const groups: string[] = [];
  for (const opt of options) {
    const g = opt.group ?? '';
    if (!seen.has(g)) { seen.add(g); groups.push(g); }
  }
  return groups;
}

// ── Component ─────────────────────────────────────────────────────────────

export const Combobox = memo(forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      options,
      value: valueProp,
      defaultValue,
      onChange,
      onQueryChange,
      placeholder,
      variant = 'default',
      size = 'md',
      disabled = false,
      error = false,
      isLoading = false,
      clearable = true,
      id: idProp,
      name,
      required,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      wrapperClassName,
      className,
      i18nStrings,
      ...rest
    },
    ref,
  ) => {
    const i18n = useComponentI18n('combobox', i18nStrings);

    // ── IDs ─────────────────────────────────────────────────────────────
    const baseId = useId();
    const inputId = idProp ?? `${baseId}-input`;
    const listboxId = `${baseId}-listbox`;
    const getOptionId = useCallback(
      (id: string) => `${baseId}-option-${id}`,
      [baseId],
    );

    // ── State ────────────────────────────────────────────────────────────
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = useState<string | null>(
      defaultValue ?? null,
    );
    const selectedId = isControlled ? valueProp : internalValue;
    const selectedOption = useMemo(
      () => options.find((o) => o.id === selectedId) ?? null,
      [options, selectedId],
    );

    // Display value in the input — synced to selected option label
    const [displayValue, setDisplayValue] = useState<string>(
      selectedOption?.label ?? '',
    );
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    // ── Filtered options ─────────────────────────────────────────────────
    const filteredOptions = useMemo(() => {
      // If the display value exactly matches the selected label → show all
      if (selectedOption && displayValue === selectedOption.label) {
        return options;
      }
      const q = displayValue.toLowerCase();
      return q
        ? options.filter((o) => o.label.toLowerCase().includes(q))
        : options;
    }, [options, displayValue, selectedOption]);

    const activeDescendant =
      activeIndex >= 0 && filteredOptions[activeIndex]
        ? getOptionId(filteredOptions[activeIndex].id)
        : undefined;

    // ── Refs ─────────────────────────────────────────────────────────────
    const wrapperRef = useRef<HTMLDivElement>(null);
    // Input's forwarded ref (for focus management)
    const inputRef = useRef<HTMLInputElement | null>(null);

    // ── Selection helpers ────────────────────────────────────────────────
    const selectOption = useCallback(
      (option: ComboboxOption) => {
        if (option.disabled) return;
        setDisplayValue(option.label);
        setIsOpen(false);
        setActiveIndex(-1);
        if (!isControlled) setInternalValue(option.id);
        onChange?.(option.id);
      },
      [isControlled, onChange],
    );

    const clearSelection = useCallback(() => {
      setDisplayValue('');
      setIsOpen(false);
      setActiveIndex(-1);
      if (!isControlled) setInternalValue(null);
      onChange?.(null);
      onQueryChange?.('');
      // Return focus to input after clearing
      inputRef.current?.focus();
    }, [isControlled, onChange, onQueryChange]);

    const closePanel = useCallback(() => {
      setIsOpen(false);
      setActiveIndex(-1);
      // Restore display value to selected option label on close
      setDisplayValue(selectedOption?.label ?? displayValue);
    }, [selectedOption, displayValue]);

    // ── Keyboard + outside hooks ─────────────────────────────────────────
    useEscapeDismiss({ active: isOpen, onDismiss: closePanel });
    useClickOutside({ active: isOpen, containerRef: wrapperRef, onClickOutside: closePanel });

    // ── Keyboard handler (active-descendant pattern) ─────────────────────
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        switch (e.key) {
          case 'ArrowDown': {
            e.preventDefault();
            if (!isOpen) {
              setIsOpen(true);
              setActiveIndex(0);
            } else {
              setActiveIndex((prev) =>
                prev < filteredOptions.length - 1 ? prev + 1 : prev,
              );
            }
            break;
          }
          case 'ArrowUp': {
            e.preventDefault();
            if (isOpen) {
              setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
            }
            break;
          }
          case 'Home': {
            e.preventDefault();
            if (isOpen) setActiveIndex(0);
            break;
          }
          case 'End': {
            e.preventDefault();
            if (isOpen) setActiveIndex(filteredOptions.length - 1);
            break;
          }
          case 'Enter': {
            e.preventDefault();
            if (isOpen && activeIndex >= 0 && filteredOptions[activeIndex]) {
              selectOption(filteredOptions[activeIndex]);
            } else if (isOpen && filteredOptions.length === 1) {
              selectOption(filteredOptions[0]);
            }
            break;
          }
          case 'Tab': {
            // Close without selecting — let Tab move focus naturally
            closePanel();
            break;
          }
        }
      },
      [disabled, isOpen, filteredOptions, activeIndex, selectOption, closePanel],
    );

    // ── Input change handler ─────────────────────────────────────────────
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value;
        setDisplayValue(q);
        setIsOpen(true);
        setActiveIndex(-1);
        // Deselect when user edits the query away from the selected label
        if (selectedOption && q !== selectedOption.label) {
          if (!isControlled) setInternalValue(null);
          onChange?.(null);
        }
        onQueryChange?.(q);
      },
      [selectedOption, isControlled, onChange, onQueryChange],
    );

    // ── Input focus handler ───────────────────────────────────────────────
    const handleInputFocus = useCallback(() => {
      if (!disabled) {
        setIsOpen(true);
        // Pre-select all text so typing immediately replaces the current value
        inputRef.current?.select();
      }
    }, [disabled]);

    // ── Clear icon node (passed as rightIcon to Input) ────────────────────
    const showClear = clearable && selectedId != null && !disabled && !isLoading;
    const clearIcon = useMemo(() => {
      if (!showClear) return undefined;
      return (
        <button
          type="button"
          aria-label={i18n.clearLabel ?? 'Clear'}
          className={
            'flex items-center justify-center rounded-[var(--combobox-option-radius)] ' +
            'text-[var(--combobox-empty-text)] transition-default ' +
            'hover:text-[var(--combobox-option-text)] ' +
            'focus-visible:outline-none focus-visible:focus-ring ' +
            'touch-target'
          }
          onClick={(e) => { e.stopPropagation(); clearSelection(); }}
          tabIndex={0}
        >
          <X size={iconSizeMap[size]} aria-hidden="true" />
        </button>
      );
    }, [showClear, i18n.clearLabel, size, clearSelection]);

    // ── Wrapper classes ───────────────────────────────────────────────────
    const wrapperClasses = useMemo(
      () =>
        [
          'relative w-full',
          wrapperClassName,
        ]
          .filter(Boolean)
          .join(' '),
      [wrapperClassName],
    );

    // ── Panel max-height style ────────────────────────────────────────────
    const panelStyle = useMemo(
      () => ({ maxHeight: 'var(--combobox-panel-max-height)' }),
      [],
    );

    // ── Grouped render ────────────────────────────────────────────────────
    const groups = useMemo(() => getGroups(filteredOptions), [filteredOptions]);
    const hasGroups = useMemo(
      () => filteredOptions.some((o) => o.group),
      [filteredOptions],
    );

    const renderOption = useCallback(
      (option: ComboboxOption, flatIndex: number) => {
        const isSelected = option.id === selectedId;
        const isFocused = flatIndex === activeIndex;
        const optId = getOptionId(option.id);

        const optionClasses = [
          optionBase,
          optionHeightClass[size],
          option.disabled
            ? 'text-[var(--combobox-option-text-disabled)] cursor-not-allowed'
            : isSelected
              ? 'bg-[var(--combobox-option-bg-selected)] text-[var(--combobox-option-text-selected)]'
              : isFocused
                ? 'bg-[var(--combobox-option-bg-focused)] text-[var(--combobox-option-text)]'
                : 'bg-[var(--combobox-option-bg)] text-[var(--combobox-option-text)] hover:bg-[var(--combobox-option-bg-hover)]',
        ].join(' ');

        return (
          <li
            key={option.id}
            id={optId}
            role="option"
            aria-selected={isSelected}
            aria-disabled={option.disabled || undefined}
            className={optionClasses}
            onMouseDown={(e) => {
              // Prevent input blur before the click registers
              e.preventDefault();
              selectOption(option);
            }}
            onMouseEnter={() => setActiveIndex(flatIndex)}
          >
            {/* Check icon — visible when selected */}
            <span
              className="flex-none text-[var(--combobox-option-check-color)]"
              aria-hidden="true"
              style={{ visibility: isSelected ? 'visible' : 'hidden', width: iconSizeMap[size] }}
            >
              <Check size={iconSizeMap[size]} />
            </span>

            {/* Label + optional description */}
            <span className="content-flex min-w-0">
              <span className="truncate-label text-[var(--combobox-option-text)]">
                {option.label}
              </span>
              {option.description && (
                <span className="clamp-description text-body-sm text-[var(--combobox-empty-text)]">
                  {option.description}
                </span>
              )}
            </span>
          </li>
        );
      },
      [selectedId, activeIndex, size, getOptionId, selectOption],
    );

    // ── Build option index map for flat activeIndex ───────────────────────
    const flatOptions = filteredOptions;

    // ── Render ────────────────────────────────────────────────────────────
    return (
      <div
        ref={wrapperRef}
        className={wrapperClasses}
        {...rest}
      >
        {/* ── Trigger input ──────────────────────────────────────────────── */}
        <Input
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
          }}
          id={inputId}
          name={name}
          variant={variant}
          size={size}
          disabled={disabled}
          error={error}
          isLoading={isLoading}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          rightIcon={isLoading ? undefined : clearIcon}
          className={className}
          // ARIA — combobox pattern
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeDescendant}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          aria-haspopup="listbox"
        />

        {/* ── Dropdown panel ─────────────────────────────────────────────── */}
        {isOpen && (
          <div
            className={panelBase}
            style={panelStyle}
            role="presentation"
          >
            <ul
              id={listboxId}
              role="listbox"
              aria-label={i18n.listboxLabel ?? 'Options'}
              aria-multiselectable={false}
            >
              {/* Loading state */}
              {isLoading && (
                <li
                  className={emptyStateBase}
                  role="option"
                  aria-disabled="true"
                  aria-selected={false}
                >
                  {i18n.loadingMessage ?? 'Loading options…'}
                </li>
              )}

              {/* Empty state — no matches */}
              {!isLoading && flatOptions.length === 0 && (
                <li
                  className={emptyStateBase}
                  role="option"
                  aria-disabled="true"
                  aria-selected={false}
                >
                  {i18n.noResultsMessage ?? 'No results'}
                </li>
              )}

              {/* Options — grouped or flat */}
              {!isLoading && flatOptions.length > 0 && (
                hasGroups ? (
                  groups.map((group, gIdx) => {
                    const groupOptions = flatOptions.filter(
                      (o) => (o.group ?? '') === group,
                    );
                    if (groupOptions.length === 0) return null;

                    // Compute flat indices for this group's options
                    const groupStartIndex = flatOptions.indexOf(groupOptions[0]);

                    return (
                      <li key={group || `group-${gIdx}`} role="presentation">
                        {/* Group divider (after first group) */}
                        {gIdx > 0 && (
                          <div
                            className="h-px my-[var(--combobox-group-label-py)] bg-[var(--combobox-group-divider)]"
                            aria-hidden="true"
                          />
                        )}
                        {/* Group label */}
                        {group && (
                          <div
                            className={groupLabelBase}
                            aria-hidden="true"
                            role="presentation"
                          >
                            {group}
                          </div>
                        )}
                        {/* Group options */}
                        <ul role="group" aria-label={group || undefined}>
                          {groupOptions.map((option, i) =>
                            renderOption(option, groupStartIndex + i),
                          )}
                        </ul>
                      </li>
                    );
                  })
                ) : (
                  flatOptions.map((option, i) => renderOption(option, i))
                )
              )}
            </ul>
          </div>
        )}
      </div>
    );
  },
));
Combobox.displayName = 'Combobox';
