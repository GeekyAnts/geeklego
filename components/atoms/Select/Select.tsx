"use client"
import { forwardRef, memo, useCallback, useId, useMemo, useRef, useState } from 'react';
import { useClickOutside } from '../../utils/keyboard';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import { Check, ChevronDown } from 'lucide-react';
import type { SelectOption, SelectProps, SelectSize, SelectVariant } from './Select.types';

// ── Variant map ──────────────────────────────────────────────────────────────
// Each variant uses a fundamentally different visual strategy for the trigger.

const variantTrigger: Record<SelectVariant, string> = {
  // Default: outlined border + surface background — clear affordance
  default: [
    'bg-[var(--select-default-bg)]',
    'border border-[var(--select-default-border)]',
    'hover:bg-[var(--select-trigger-bg-hover)] hover:border-[var(--select-trigger-border-hover)]',
    'shadow-[var(--select-trigger-shadow)]',
  ].join(' '),
  // Filled: muted surface bg, no border — secondary emphasis
  filled: [
    'bg-[var(--select-filled-bg)]',
    'border border-[var(--select-filled-border)]',
    'hover:bg-[var(--select-trigger-bg-hover)]',
  ].join(' '),
  // Ghost: fully transparent until hover — tertiary / inline emphasis
  ghost: [
    'bg-[var(--select-ghost-bg)]',
    'border border-[var(--select-ghost-border)]',
    'hover:bg-[var(--select-ghost-bg-hover)]',
  ].join(' '),
};

// ── Size map ─────────────────────────────────────────────────────────────────

const sizeMap: Record<SelectSize, { trigger: string; text: string; option: string }> = {
  sm: {
    trigger: 'h-[var(--select-height-sm)] px-[var(--select-px-sm)]',
    text: 'text-body-sm',
    option: 'h-[var(--select-option-height-sm)] px-[var(--select-option-px)]',
  },
  md: {
    trigger: 'h-[var(--select-height-md)] px-[var(--select-px-md)]',
    text: 'text-body-sm',
    option: 'h-[var(--select-option-height-md)] px-[var(--select-option-px)]',
  },
  lg: {
    trigger: 'h-[var(--select-height-lg)] px-[var(--select-px-lg)]',
    text: 'text-body-md',
    option: 'h-[var(--select-option-height-lg)] px-[var(--select-option-px)]',
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export const Select = memo(forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options = [],
      value,
      defaultValue,
      onChange,
      placeholder,
      i18nStrings,
      variant = 'default',
      size = 'md',
      disabled = false,
      error = false,
      label,
      id: idProp,
      className,
      ...rest
    },
    ref,
  ) => {
    const i18n = useComponentI18n('select', i18nStrings);
    const resolvedPlaceholder = placeholder ?? i18n.placeholder;

    const generatedId = useId();
    const id = idProp ?? generatedId;
    const listboxId = `${id}-listbox`;

    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue ?? '');
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const isControlled = value !== undefined;
    const selectedValue = isControlled ? value : internalValue;
    const selectedOption = options.find((o) => o.value === selectedValue);

    // ── Selection ────────────────────────────────────────────────────────────

    const handleSelect = useCallback(
      (optionValue: string) => {
        if (!isControlled) setInternalValue(optionValue);
        onChange?.(optionValue);
        setIsOpen(false);
        setFocusedIndex(-1);
        triggerRef.current?.focus();
      },
      [isControlled, onChange],
    );

    // ── Open / close ─────────────────────────────────────────────────────────

    const close = useCallback(() => {
      setIsOpen(false);
      setFocusedIndex(-1);
    }, []);

    const open = useCallback(() => {
      setIsOpen(true);
      // Pre-focus the currently selected option, or the first one
      const idx = selectedValue ? options.findIndex((o) => o.value === selectedValue) : 0;
      setFocusedIndex(idx >= 0 ? idx : 0);
    }, [selectedValue, options]);

    const handleTriggerClick = useCallback(() => {
      if (disabled) return;
      isOpen ? close() : open();
    }, [disabled, isOpen, close, open]);

    // ── Keyboard navigation ───────────────────────────────────────────────────

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ': {
          e.preventDefault();
          if (!isOpen) {
            open();
          } else if (focusedIndex >= 0) {
            const opt = options[focusedIndex];
            if (opt && !opt.disabled) handleSelect(opt.value);
          }
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          if (!isOpen) {
            open();
          } else {
            setFocusedIndex((prev) => {
              let next = prev + 1;
              while (next < options.length && options[next]?.disabled) next++;
              return next < options.length ? next : prev;
            });
          }
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          if (!isOpen) {
            open();
          } else {
            setFocusedIndex((prev) => {
              let next = prev - 1;
              while (next >= 0 && options[next]?.disabled) next--;
              return next >= 0 ? next : prev;
            });
          }
          break;
        }
        case 'Escape': {
          e.preventDefault();
          close();
          triggerRef.current?.focus();
          break;
        }
        case 'Tab': {
          close();
          break;
        }
      }
    };

    // ── Click outside ─────────────────────────────────────────────────────────

    useClickOutside({ active: isOpen, containerRef, onClickOutside: close });

    // ── Derived classes ───────────────────────────────────────────────────────

    const { trigger: sizeTrigger, text: sizeText, option: sizeOption } = sizeMap[size];

    const triggerClasses = useMemo(() => [
      'w-full flex items-center justify-between gap-[var(--spacing-component-sm)]',
      'rounded-[var(--select-trigger-radius)]',
      sizeTrigger,
      sizeText,
      'text-left cursor-pointer select-none',
      'transition-default',
      'focus-visible:outline-none focus-visible:focus-ring',
      disabled
        ? [
            'bg-[var(--select-trigger-bg-disabled)]',
            'border border-[var(--select-trigger-border-disabled)]',
            'text-[var(--select-trigger-text-disabled)]',
            'cursor-not-allowed pointer-events-none',
          ].join(' ')
        : [
            error
              ? 'border border-[var(--select-trigger-border-error)]'
              : variantTrigger[variant],
            isOpen
              ? 'border-[var(--select-trigger-border-focus)] shadow-[var(--select-trigger-shadow-open)]'
              : 'shadow-[var(--select-trigger-shadow)]',
            'text-[var(--select-trigger-text)]',
          ]
            .filter(Boolean)
            .join(' '),
    ]
      .filter(Boolean)
      .join(' '), [sizeTrigger, sizeText, disabled, error, variant, isOpen]);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
      <div ref={ref} className={['relative', className].filter(Boolean).join(' ')} {...rest}>
        {/* Optional label */}
        {label && (
          <label
            htmlFor={id}
            className="block text-label-sm text-[var(--select-label-color)] mb-[var(--spacing-component-xs)]"
          >
            {label}
          </label>
        )}

        <div ref={containerRef} className="relative">
          {/* ── Trigger ────────────────────────────────────────────────────── */}
          <button
            ref={triggerRef}
            type="button"
            id={id}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-activedescendant={
              isOpen && focusedIndex >= 0 ? `${listboxId}-option-${focusedIndex}` : undefined
            }
            aria-invalid={error || undefined}
            aria-disabled={disabled || undefined}
            disabled={disabled}
            onClick={handleTriggerClick}
            onKeyDown={handleKeyDown}
            className={triggerClasses}
          >
            <span
              className={
                selectedOption
                  ? 'text-[var(--select-trigger-text)]'
                  : 'text-[var(--select-trigger-placeholder)]'
              }
            >
              {selectedOption ? selectedOption.label : resolvedPlaceholder}
            </span>

            <ChevronDown
              size="var(--size-icon-sm)"
              className={[
                'flex-shrink-0 text-[var(--select-trigger-icon)]',
                'transition-default',
                isOpen ? 'rotate-180' : 'rotate-0',
              ].join(' ')}
            />
          </button>

          {/* ── Dropdown panel ──────────────────────────────────────────────── */}
          {/* Always in the DOM so CSS transitions play on open, not just on mount */}
          <div
            role="listbox"
            id={listboxId}
            aria-label={label ?? placeholder}
            aria-hidden={!isOpen}
            // inert removes the panel from tab order and pointer events when closed
            inert={!isOpen ? true : undefined}
            className={[
              'absolute top-full start-0 end-0',
              'z-[var(--select-panel-z)]',
              'mt-[var(--spacing-component-xs)]',
              'bg-[var(--select-panel-bg)]',
              'border border-[var(--select-panel-border)]',
              'rounded-[var(--select-panel-radius)]',
              'shadow-[var(--select-panel-shadow)]',
              'p-[var(--select-panel-padding)]',
              'flex flex-col gap-[var(--border-hairline)]',
              'overflow-y-auto max-h-[var(--select-panel-max-height)]',
              'transition-enter',
              // Transition plays because the element exists before isOpen changes
              isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
            ].join(' ')}
          >
              {options.map((option, i) => {
                const isSelected = option.value === selectedValue;
                const isFocused = i === focusedIndex;

                const optionClasses = [
                  'flex items-center justify-between',
                  sizeOption,
                  'rounded-[var(--select-option-radius)]',
                  sizeText,
                  'transition-default',
                  option.disabled
                    ? 'text-[var(--select-option-text-disabled)] cursor-not-allowed'
                    : 'cursor-pointer',
                  isSelected
                    ? 'bg-[var(--select-option-bg-selected)] text-[var(--select-option-text-selected)]'
                    : isFocused
                      ? 'bg-[var(--select-option-bg-focused)] text-[var(--select-option-text)]'
                      : 'bg-[var(--select-option-bg)] text-[var(--select-option-text)]',
                  !option.disabled && !isSelected
                    ? 'hover:bg-[var(--select-option-bg-hover)]'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <div
                    key={option.value}
                    id={`${listboxId}-option-${i}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    onMouseEnter={() => !option.disabled && setFocusedIndex(i)}
                    className={optionClasses}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <Check
                        size="var(--size-icon-sm)"
                        className="flex-shrink-0 text-[var(--select-option-check-color)]"
                      />
                    )}
                  </div>
                );
              })}
            </div>
        </div>
      </div>
    );
  },
));
Select.displayName = 'Select';
