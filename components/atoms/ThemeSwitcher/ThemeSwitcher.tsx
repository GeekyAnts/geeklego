"use client"
import { forwardRef, memo, useState, useMemo, useCallback, useRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Monitor, Sun, Moon } from 'lucide-react';
import { useRovingTabindex } from '../../utils/keyboard/useRovingTabindex';
import type {
  ThemeSwitcherProps,
  ThemeSwitcherOption,
  ThemeSwitcherSize,
  ThemeMode,
} from './ThemeSwitcher.types';

// ── Static constants ──────────────────────────────────────────────────────────

const defaultOptions: ThemeSwitcherOption[] = [
  { value: 'system', label: 'System theme', icon: <Monitor /> },
  { value: 'light',  label: 'Light theme',  icon: <Sun /> },
  { value: 'dark',   label: 'Dark theme',   icon: <Moon /> },
];

/**
 * sizeMap keys are static strings so Tailwind v4 JIT scanner can detect them.
 * icon: CSS selector targets the SVG via [&>svg] — this uses CSS width/height
 * which DO support CSS variables (unlike SVG presentation attributes).
 */
const sizeMap: Record<ThemeSwitcherSize, { button: string; icon: string }> = {
  sm: {
    button: 'w-[var(--theme-switcher-item-size-sm)] h-[var(--theme-switcher-item-size-sm)]',
    icon:   '[&>svg]:w-[var(--theme-switcher-item-icon-sm)] [&>svg]:h-[var(--theme-switcher-item-icon-sm)]',
  },
  md: {
    button: 'w-[var(--theme-switcher-item-size-md)] h-[var(--theme-switcher-item-size-md)]',
    icon:   '[&>svg]:w-[var(--theme-switcher-item-icon-md)] [&>svg]:h-[var(--theme-switcher-item-icon-md)]',
  },
  lg: {
    button: 'w-[var(--theme-switcher-item-size-lg)] h-[var(--theme-switcher-item-size-lg)]',
    icon:   '[&>svg]:w-[var(--theme-switcher-item-icon-lg)] [&>svg]:h-[var(--theme-switcher-item-icon-lg)]',
  },
};

const baseItemClasses = [
  'flex items-center justify-center shrink-0',
  'transition-default',
  'focus-visible:outline-none focus-visible:focus-ring',
  'cursor-pointer select-none',
].join(' ');

const unpressedClasses = [
  'rounded-[var(--theme-switcher-item-radius)]',
  'bg-[var(--theme-switcher-item-bg)]',
  'text-[var(--theme-switcher-item-icon)]',
  'shadow-[var(--theme-switcher-item-shadow)]',
  'hover:bg-[var(--theme-switcher-item-bg-hover)]',
  'hover:text-[var(--theme-switcher-item-icon-pressed)]',
].join(' ');

const pressedClasses = [
  'rounded-[var(--theme-switcher-item-radius-pressed)]',
  'bg-[var(--theme-switcher-item-bg-pressed)]',
  'border border-[var(--theme-switcher-item-border-pressed)]',
  'text-[var(--theme-switcher-item-icon-pressed)]',
  'shadow-[var(--theme-switcher-item-shadow-pressed)]',
].join(' ');

// ── Internal item component ───────────────────────────────────────────────────

interface ThemeSwitcherItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onSelect'> {
  option: ThemeSwitcherOption;
  isPressed: boolean;
  size: ThemeSwitcherSize;
  onSelect: (value: ThemeMode) => void;
}

const ThemeSwitcherItem = memo(
  forwardRef<HTMLButtonElement, ThemeSwitcherItemProps>(
    ({ option, isPressed, size, onSelect, ...props }, ref) => {
      const handleClick = useCallback(
        () => onSelect(option.value),
        [onSelect, option.value],
      );

      const itemClasses = useMemo(
        () => [baseItemClasses, sizeMap[size].button, isPressed ? pressedClasses : unpressedClasses].join(' '),
        [size, isPressed],
      );

      return (
        <button
          ref={ref}
          type="button"
          aria-pressed={isPressed}
          aria-label={option.label}
          className={itemClasses}
          onClick={handleClick}
          {...props}
        >
          {/* Icon sized via CSS [&>svg] — CSS props support CSS vars, SVG attrs do not */}
          <span
            aria-hidden="true"
            className={`flex items-center justify-center ${sizeMap[size].icon}`}
          >
            {option.icon}
          </span>
        </button>
      );
    },
  ),
);
ThemeSwitcherItem.displayName = 'ThemeSwitcherItem';

// ── ThemeSwitcher ─────────────────────────────────────────────────────────────

export const ThemeSwitcher = memo(
  forwardRef<HTMLDivElement, ThemeSwitcherProps>(
    (
      {
        value,
        defaultValue = 'system',
        onChange,
        options = defaultOptions,
        size = 'md',
        className,
        ...rest
      },
      ref,
    ) => {
      const isControlled = value !== undefined;
      const [internalValue, setInternalValue] = useState<ThemeMode>(defaultValue);
      const currentValue = isControlled ? value! : internalValue;

      const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

      const currentIndex = useMemo(
        () => Math.max(0, options.findIndex(o => o.value === currentValue)),
        [options, currentValue],
      );

      const handleSelect = useCallback(
        (newValue: ThemeMode) => {
          if (newValue === currentValue) return;
          if (!isControlled) setInternalValue(newValue);
          onChange?.(newValue);
        },
        [currentValue, isControlled, onChange],
      );

      const handleActiveIndexChange = useCallback(
        (index: number) => {
          const newValue = options[index]?.value;
          if (!newValue) return;
          if (!isControlled) setInternalValue(newValue);
          onChange?.(newValue);
          buttonRefs.current[index]?.focus();
        },
        [options, isControlled, onChange],
      );

      const { handleKeyDown, getItemProps } = useRovingTabindex({
        itemCount: options.length,
        activeIndex: currentIndex,
        orientation: 'horizontal',
        onActiveIndexChange: handleActiveIndexChange,
      });

      const containerClasses = useMemo(
        () =>
          [
            'inline-flex items-center overflow-hidden',
            'rounded-[var(--theme-switcher-radius)]',
            'bg-[var(--theme-switcher-bg)]',
            'border border-[var(--theme-switcher-border)]',
            'p-[var(--theme-switcher-padding)]',
            'gap-[var(--theme-switcher-gap)]',
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [className],
      );

      return (
        <div
          ref={ref}
          role="group"
          aria-label="Theme"
          className={containerClasses}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          {options.map((option, index) => (
            <ThemeSwitcherItem
              key={option.value}
              ref={el => { buttonRefs.current[index] = el; }}
              option={option}
              isPressed={option.value === currentValue}
              size={size}
              onSelect={handleSelect}
              {...getItemProps(index)}
            />
          ))}
        </div>
      );
    },
  ),
);

ThemeSwitcher.displayName = 'ThemeSwitcher';
