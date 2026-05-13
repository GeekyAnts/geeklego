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
import { Loader2, Search, X } from 'lucide-react';
import type { SearchBarProps, SearchBarSize, SearchBarVariant } from './SearchBar.types';
import { getErrorFieldProps, getIconProps } from '../../utils/accessibility/aria-helpers';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import { StructuredData } from '../../utils/StructuredData/StructuredData';

// ── Variant classes for the styled wrapper div ─────────────────────────────
// Each variant uses a different visual strategy — not just color shifts.

const variantClasses: Record<SearchBarVariant, string> = {
  // Default: visible border at rest; bg tint + border darkens on hover; border highlights on focus-within
  default: [
    'bg-[var(--search-bar-bg)] border border-[var(--search-bar-border)]',
    'hover:bg-[var(--search-bar-bg-hover)] hover:border-[var(--search-bar-border-hover)]',
    'focus-within:border-[var(--search-bar-border-focus)]',
  ].join(' '),

  // Filled: muted bg, no visible border at rest; hover deepens bg; focus-within reveals white bg + focus border
  filled: [
    'bg-[var(--search-bar-filled-bg)] border border-transparent',
    'hover:bg-[var(--search-bar-filled-bg-hover)]',
    'focus-within:bg-[var(--search-bar-filled-bg-focus)] focus-within:border-[var(--search-bar-border-focus)]',
  ].join(' '),
};

// Error override — border locked to error color throughout all interaction states
const variantErrorClasses: Record<SearchBarVariant, string> = {
  default: [
    'bg-[var(--search-bar-bg)] border border-[var(--search-bar-border-error)]',
    'hover:bg-[var(--search-bar-bg-hover)]',
    'focus-within:border-[var(--search-bar-border-error)]',
  ].join(' '),

  filled: [
    'bg-[var(--search-bar-filled-bg)] border border-[var(--search-bar-border-error)]',
    'hover:bg-[var(--search-bar-filled-bg-hover)]',
    'focus-within:bg-[var(--search-bar-filled-bg-focus)] focus-within:border-[var(--search-bar-border-error)]',
  ].join(' '),
};

// Disabled: muted, no hover/focus response
const disabledWrapperClass =
  'bg-[var(--search-bar-bg-disabled)] border border-[var(--search-bar-border-disabled)] cursor-not-allowed';

// ── Size map ───────────────────────────────────────────────────────────────
// Logical properties (ps/pe/start/end) used throughout for RTL support.
const sizeMap: Record<
  SearchBarSize,
  {
    height: string;
    ps: string;          // input start padding (icon always present)
    pe: string;          // input end padding when no clear button visible
    peClear: string;     // input end padding when clear button is visible
    text: string;
    iconSize: string;    // lucide size value for search icon
    iconStart: string;   // inset position of search icon
    clearSize: string;   // lucide size value for clear/spinner icon
    clearEnd: string;    // inset position of clear button from inline-end
  }
> = {
  sm: {
    height:    'h-[var(--search-bar-height-sm)]',
    ps:        'ps-[var(--search-bar-icon-offset-sm)]',
    pe:        'pe-[var(--search-bar-px-sm)]',
    peClear:   'pe-[var(--search-bar-clear-pe-sm)]',
    text:      'text-body-sm',
    iconSize:  'var(--search-bar-icon-size-sm)',
    iconStart: 'start-[var(--search-bar-px-sm)]',
    clearSize: 'var(--search-bar-clear-size-sm)',
    clearEnd:  'end-[var(--search-bar-clear-inset-sm)]',
  },
  md: {
    height:    'h-[var(--search-bar-height-md)]',
    ps:        'ps-[var(--search-bar-icon-offset-md)]',
    pe:        'pe-[var(--search-bar-px-md)]',
    peClear:   'pe-[var(--search-bar-clear-pe-md)]',
    text:      'text-body-md',
    iconSize:  'var(--search-bar-icon-size-md)',
    iconStart: 'start-[var(--search-bar-px-md)]',
    clearSize: 'var(--search-bar-clear-size-md)',
    clearEnd:  'end-[var(--search-bar-clear-inset-md)]',
  },
  lg: {
    height:    'h-[var(--search-bar-height-lg)]',
    ps:        'ps-[var(--search-bar-icon-offset-lg)]',
    pe:        'pe-[var(--search-bar-px-lg)]',
    peClear:   'pe-[var(--search-bar-clear-pe-lg)]',
    text:      'text-body-lg',
    iconSize:  'var(--search-bar-icon-size-lg)',
    iconStart: 'start-[var(--search-bar-px-lg)]',
    clearSize: 'var(--search-bar-clear-size-lg)',
    clearEnd:  'end-[var(--search-bar-clear-inset-lg)]',
  },
};

// ── Component ──────────────────────────────────────────────────────────────

export const SearchBar = memo(
  forwardRef<HTMLInputElement, SearchBarProps>(
    (
      {
        variant = 'default',
        size = 'md',
        value: valueProp,
        defaultValue,
        onValueChange,
        onSearch,
        onClear,
        searchButton,
        disabled = false,
        isLoading = false,
        error = false,
        label,
        labelHidden = false,
        errorMessage,
        placeholder,
        id: idProp,
        schema = false,
        searchUrl,
        i18nStrings,
        className,
        ...rest
      },
      forwardedRef,
    ) => {
      const i18n = useComponentI18n('searchBar', i18nStrings);
      const generatedId = useId();
      const inputId = idProp ?? generatedId;
      const landmarkId = `${inputId}-region`;

      // Merge the forwarded ref with our internal ref so we can call .focus() on clear
      const internalRef = useRef<HTMLInputElement>(null);
      const setRef = useCallback(
        (node: HTMLInputElement | null) => {
          (internalRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
          if (typeof forwardedRef === 'function') {
            forwardedRef(node);
          } else if (forwardedRef) {
            (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
          }
        },
        [forwardedRef],
      );

      // Controlled / uncontrolled value state
      const isControlled = valueProp !== undefined;
      const [internalValue, setInternalValue] = useState(defaultValue ?? '');
      const currentValue = isControlled ? valueProp : internalValue;

      const isDisabled = disabled || isLoading;
      const showClear = Boolean(currentValue) && !isLoading && !isDisabled;

      const sz = sizeMap[size];

      // ── Resolved strings ──
      const resolvedLabel = label ?? i18n.searchLabel ?? 'Search';
      const resolvedPlaceholder = placeholder ?? resolvedLabel;
      const resolvedClearLabel = i18n.clearLabel ?? 'Clear search';

      // ── Handlers ──
      const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value;
          if (!isControlled) setInternalValue(val);
          onValueChange?.(val);
        },
        [isControlled, onValueChange],
      );

      const handleClear = useCallback(() => {
        if (!isControlled) setInternalValue('');
        onValueChange?.('');
        onClear?.();
        internalRef.current?.focus();
      }, [isControlled, onValueChange, onClear]);

      const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter' && onSearch) {
            onSearch(currentValue ?? '');
          }
        },
        [currentValue, onSearch],
      );

      // ── Classes ──
      const wrapperClasses = useMemo(
        () =>
          [
            'relative flex items-center w-full transition-default',
            `rounded-[var(--search-bar-radius)]`,
            sz.height,
            'shadow-[var(--search-bar-shadow)] hover:shadow-[var(--search-bar-shadow-hover)]',
            isDisabled
              ? disabledWrapperClass
              : error
                ? variantErrorClasses[variant]
                : variantClasses[variant],
          ]
            .filter(Boolean)
            .join(' '),
        [variant, sz.height, isDisabled, error],
      );

      const inputClasses = useMemo(
        () =>
          [
            'flex-1 bg-transparent border-0 outline-none h-full truncate-label',
            sz.text,
            'text-[var(--search-bar-text)]',
            sz.ps,
            showClear || isLoading ? sz.peClear : sz.pe,
            isDisabled
              ? 'placeholder:text-[var(--search-bar-text-disabled)] text-[var(--search-bar-text-disabled)] cursor-not-allowed pointer-events-none'
              : 'placeholder:text-[var(--search-bar-text-placeholder)]',
            'focus-visible:outline-none focus-visible:focus-ring-inset',
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [sz, showClear, isLoading, isDisabled, className],
      );

      const iconClass = useMemo(
        () =>
          [
            'absolute inset-y-0 flex items-center pointer-events-none',
            sz.iconStart,
            'text-[var(--search-bar-icon-color)]',
          ].join(' '),
        [sz.iconStart],
      );

      const clearBtnClass = useMemo(
        () =>
          [
            'absolute inset-y-0 flex items-center justify-center',
            sz.clearEnd,
            'min-w-[var(--size-component-xs)] min-h-[var(--size-component-xs)]',
            'rounded-[var(--search-bar-clear-radius)]',
            'text-[var(--search-bar-clear-color)]',
            'hover:text-[var(--search-bar-clear-color-hover)] hover:bg-[var(--search-bar-clear-bg-hover)]',
            'transition-default',
            'focus-visible:outline-none focus-visible:focus-ring',
          ]
            .filter(Boolean)
            .join(' '),
        [sz.clearEnd],
      );

      // ── JSON-LD SearchAction ──
      const schemaData = useMemo(() => {
        if (!schema || !searchUrl) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: searchUrl,
            },
            'query-input': 'required name=search_term_string',
          },
        };
      }, [schema, searchUrl]);

      return (
        <>
          {schemaData && <StructuredData data={schemaData} />}

          <div
            role="search"
            aria-label={resolvedLabel}
            id={landmarkId}
            className="flex flex-col gap-[var(--search-bar-gap)] min-w-[var(--search-bar-min-width)]"
          >
            {/* Label — always rendered; sr-only when labelHidden so input always has an accessible name */}
            <label
              htmlFor={inputId}
              className={labelHidden ? 'sr-only' : 'text-body-sm text-[var(--search-bar-text)] truncate-label'}
            >
              {resolvedLabel}
            </label>

            {/* Input row: styled wrapper + optional search button */}
            <div className="flex items-stretch gap-[var(--search-bar-gap)]">
              {/* ── Styled input area ── */}
              <div className={`${wrapperClasses} flex-1`}>
                {/* Left: search icon — decorative */}
                <span className={iconClass} {...getIconProps(true)}>
                  <Search size={sz.iconSize} />
                </span>

                {/* The native search input */}
                <input
                  ref={setRef}
                  id={inputId}
                  type="search"
                  value={currentValue}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder={resolvedPlaceholder}
                  disabled={isDisabled}
                  aria-disabled={isDisabled || undefined}
                  aria-busy={isLoading || undefined}
                  {...getErrorFieldProps(error, `${inputId}-error`)}
                  className={inputClasses}
                  {...rest}
                />

                {/* Right: clear button (interactive) or loading spinner (decorative) */}
                {isLoading ? (
                  <span
                    className={[
                      'absolute inset-y-0 flex items-center pointer-events-none',
                      sz.clearEnd,
                      'text-[var(--search-bar-icon-color)]',
                    ].join(' ')}
                    {...getIconProps(true)}
                  >
                    <Loader2 size={sz.clearSize} className="animate-spin" />
                  </span>
                ) : showClear ? (
                  <button
                    type="button"
                    aria-label={resolvedClearLabel}
                    onClick={handleClear}
                    className={clearBtnClass}
                  >
                    <X size={sz.clearSize} />
                  </button>
                ) : null}
              </div>

              {/* Optional search submit button */}
              {searchButton}
            </div>

            {/* Error message — announced by aria-describedby on input; rendered only when error=true */}
            {error && (
              <span
                id={`${inputId}-error`}
                role="alert"
                className="text-body-sm text-[var(--color-text-error)]"
              >
                {errorMessage}
              </span>
            )}
          </div>
        </>
      );
    },
  ),
);
SearchBar.displayName = 'SearchBar';
