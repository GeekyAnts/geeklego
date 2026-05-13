"use client"
import { forwardRef, memo, useCallback, useMemo, useRef, useState } from 'react';
import type {
  SegmentedControlProps,
  SegmentedControlVariant,
  SegmentedControlSize,
} from './SegmentedControl.types';
import { useRovingTabindex } from '../../utils/keyboard';

// ── Track background + border per variant — different visual strategies ───────
// default : muted secondary track, selected segment pops as a white/raised surface
// outline : transparent bordered track, selected segment fills with brand colour
const trackVariantClassMap: Record<SegmentedControlVariant, string> = {
  default: 'bg-[var(--segmented-default-track-bg)] border border-[var(--segmented-default-track-border)]',
  outline: 'bg-[var(--segmented-outline-track-bg)] border border-[var(--segmented-outline-track-border)]',
};

// ── Selected segment appearance — fundamentally different per variant ─────────
const selectedSegmentClassMap: Record<SegmentedControlVariant, string> = {
  default: [
    'bg-[var(--segmented-default-selected-bg)] text-[var(--segmented-default-selected-text)]',
    'border border-[var(--segmented-default-selected-border)]',
    'shadow-[var(--segmented-default-selected-shadow)] hover:shadow-[var(--segmented-default-selected-shadow-hover)]',
  ].join(' '),
  outline: [
    'bg-[var(--segmented-outline-selected-bg)] text-[var(--segmented-outline-selected-text)]',
    'border border-[var(--segmented-outline-selected-border)]',
    'shadow-[var(--segmented-outline-selected-shadow)] hover:shadow-[var(--segmented-outline-selected-shadow-hover)]',
  ].join(' '),
};

// ── Unselected segment — same across both variants ────────────────────────────
const UNSELECTED_CLASSES =
  'bg-[var(--segmented-segment-bg)] text-[var(--segmented-segment-text)] border border-transparent ' +
  'hover:bg-[var(--segmented-segment-bg-hover)] hover:text-[var(--segmented-segment-text-hover)]';

// ── Per-segment disabled — muted, no hover/active response ───────────────────
const SEGMENT_DISABLED_CLASSES =
  'bg-transparent text-[var(--segmented-segment-text-disabled)] border border-transparent cursor-not-allowed pointer-events-none';

// ── Size dimension + typography pairing ──────────────────────────────────────
const sizeClassMap: Record<SegmentedControlSize, { base: string; text: string }> = {
  sm: { base: 'h-[var(--segmented-height-sm)] px-[var(--segmented-px-sm)]', text: 'text-button-sm' },
  md: { base: 'h-[var(--segmented-height-md)] px-[var(--segmented-px-md)]', text: 'text-button-md' },
  lg: { base: 'h-[var(--segmented-height-lg)] px-[var(--segmented-px-lg)]', text: 'text-button-lg' },
};

export const SegmentedControl = memo(
  forwardRef<HTMLDivElement, SegmentedControlProps>(
    (
      {
        options,
        value,
        defaultValue,
        onChange,
        variant = 'default',
        size = 'md',
        disabled = false,
        fullWidth = false,
        className,
        'aria-label': ariaLabel,
        ...rest
      },
      ref,
    ) => {
      // ── Controlled vs uncontrolled ─────────────────────────────────────────
      const isControlled = value !== undefined;
      const [internalValue, setInternalValue] = useState<string>(
        defaultValue ?? options[0]?.value ?? '',
      );
      const selectedValue = isControlled ? value! : internalValue;

      const selectedIndex = useMemo(
        () => Math.max(0, options.findIndex((o) => o.value === selectedValue)),
        [options, selectedValue],
      );

      // Stable refs to each button for programmatic focus on arrow navigation
      const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

      const handleChange = useCallback(
        (nextValue: string) => {
          if (!isControlled) setInternalValue(nextValue);
          onChange?.(nextValue);
        },
        [isControlled, onChange],
      );

      // Single stable click handler — reads value from data attribute
      const handleSegmentClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
          const v = e.currentTarget.dataset.value;
          if (v) handleChange(v);
        },
        [handleChange],
      );

      const { handleKeyDown, getItemProps } = useRovingTabindex({
        itemCount: options.length,
        activeIndex: selectedIndex,
        orientation: 'horizontal',
        loop: true,
        isItemDisabled: useCallback(
          (i: number) => !!(options[i]?.disabled || disabled),
          [options, disabled],
        ),
        onActiveIndexChange: useCallback(
          (index: number) => {
            const option = options[index];
            if (option && !option.disabled && !disabled) {
              handleChange(option.value);
              buttonRefs.current[index]?.focus();
            }
          },
          [options, disabled, handleChange],
        ),
      });

      // ── Container className ────────────────────────────────────────────────
      const containerClasses = useMemo(
        () =>
          [
            fullWidth ? 'flex w-full' : 'inline-flex',
            'items-center',
            'rounded-[var(--segmented-track-radius)]',
            'p-[var(--segmented-track-padding)]',
            disabled
              ? 'bg-[var(--segmented-track-bg-disabled)] border border-transparent'
              : trackVariantClassMap[variant],
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [fullWidth, disabled, variant, className],
      );

      return (
        <div
          ref={ref}
          role="group"
          aria-label={ariaLabel}
          aria-disabled={disabled || undefined}
          onKeyDown={disabled ? undefined : handleKeyDown}
          className={containerClasses}
          {...rest}
        >
          {options.map((option, index) => {
            const isSelected = option.value === selectedValue;
            const isOptionDisabled = disabled || !!option.disabled;
            const { tabIndex } = getItemProps(index);

            const segmentClasses = [
              'inline-flex items-center justify-center',
              'gap-[var(--segmented-gap)]',
              'rounded-[var(--segmented-segment-radius)]',
              sizeClassMap[size].text,
              sizeClassMap[size].base,
              'transition-default',
              'focus-visible:outline-none focus-visible:focus-ring',
              'cursor-pointer',
              'content-nowrap',
              fullWidth ? 'flex-1' : '',
              isOptionDisabled
                ? SEGMENT_DISABLED_CLASSES
                : isSelected
                  ? selectedSegmentClassMap[variant]
                  : UNSELECTED_CLASSES,
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                key={option.value}
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                type="button"
                data-value={option.value}
                aria-pressed={isSelected}
                aria-label={option['aria-label']}
                aria-disabled={isOptionDisabled || undefined}
                disabled={isOptionDisabled}
                tabIndex={tabIndex}
                className={segmentClasses}
                onClick={isOptionDisabled ? undefined : handleSegmentClick}
              >
                {option.icon && (
                  <span aria-hidden="true" className="inline-flex shrink-0 items-center">
                    {option.icon}
                  </span>
                )}
                {option.label && (
                  <span className="truncate-label">{option.label}</span>
                )}
              </button>
            );
          })}
        </div>
      );
    },
  ),
);
SegmentedControl.displayName = 'SegmentedControl';
