"use client"
import { forwardRef, memo, useId, useMemo, useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import type { FileInputProps, FileInputVariant, FileInputSize } from './FileInput.types';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import { getErrorFieldProps } from '../../utils/accessibility/aria-helpers';

// ── Wrapper variant classes — each uses a fundamentally different visual strategy ──

const variantClasses: Record<FileInputVariant, string> = {
  // Default: outlined border at rest; bg tint + border deepens on hover; border shifts to focus colour on focus-within
  default: [
    'bg-[var(--file-input-bg)] border border-[var(--file-input-border)]',
    'hover:bg-[var(--file-input-bg-hover)] hover:border-[var(--file-input-border-hover)]',
    'focus-within:border-[var(--file-input-border-focus)]',
  ].join(' '),

  // Filled: muted bg, no visible border; hover deepens bg; focus-within reveals border + lighter bg
  filled: [
    'bg-[var(--file-input-filled-bg)] border border-transparent',
    'hover:bg-[var(--file-input-filled-bg-hover)]',
    'focus-within:bg-[var(--file-input-filled-bg-focus)] focus-within:border-[var(--file-input-border-focus)]',
  ].join(' '),

  // Ghost: fully transparent, no border until hover — background + border appear on hover
  ghost: [
    'bg-transparent border border-transparent',
    'hover:bg-[var(--file-input-ghost-bg-hover)] hover:border-[var(--file-input-ghost-border-hover)]',
    'focus-within:border-[var(--file-input-border-focus)]',
  ].join(' '),
};

// Error variants — same strategies but border locked to error colour throughout
const variantErrorClasses: Record<FileInputVariant, string> = {
  default: [
    'bg-[var(--file-input-bg)] border border-[var(--file-input-border-error)]',
    'hover:bg-[var(--file-input-bg-hover)]',
    'focus-within:border-[var(--file-input-border-error)]',
  ].join(' '),
  filled: [
    'bg-[var(--file-input-filled-bg)] border border-[var(--file-input-border-error)]',
    'hover:bg-[var(--file-input-filled-bg-hover)]',
    'focus-within:bg-[var(--file-input-filled-bg-focus)] focus-within:border-[var(--file-input-border-error)]',
  ].join(' '),
  ghost: [
    'bg-transparent border border-[var(--file-input-border-error)]',
    'hover:bg-[var(--file-input-ghost-bg-hover)]',
    'focus-within:border-[var(--file-input-border-error)]',
  ].join(' '),
};

// Disabled wrapper — muted, no hover response, cursor-not-allowed
const disabledWrapperClass =
  'bg-[var(--file-input-bg-disabled)] border border-[var(--file-input-border-disabled)] cursor-not-allowed';

// ── Size map — height, padding, typography, icon sizes ─────────────────────────
const sizeMap: Record<FileInputSize, {
  height:    string;
  ps:        string;
  browsePx:  string;
  text:      string;
  iconSize:  string;
}> = {
  sm: {
    height:   'h-[var(--file-input-height-sm)]',
    ps:       'ps-[var(--file-input-px-sm)]',
    browsePx: 'px-[var(--file-input-browse-px-sm)]',
    text:     'text-body-sm',
    iconSize: 'var(--file-input-icon-size-sm)',
  },
  md: {
    height:   'h-[var(--file-input-height-md)]',
    ps:       'ps-[var(--file-input-px-md)]',
    browsePx: 'px-[var(--file-input-browse-px-md)]',
    text:     'text-body-md',
    iconSize: 'var(--file-input-icon-size-md)',
  },
  lg: {
    height:   'h-[var(--file-input-height-lg)]',
    ps:       'ps-[var(--file-input-px-lg)]',
    browsePx: 'px-[var(--file-input-browse-px-lg)]',
    text:     'text-body-lg',
    iconSize: 'var(--file-input-icon-size-lg)',
  },
};

export const FileInput = memo(forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      error = false,
      isLoading = false,
      disabled,
      className,
      wrapperClassName,
      onChange,
      id: idProp,
      required,
      multiple,
      i18nStrings,
      ...rest
    },
    ref,
  ) => {
    const i18n = useComponentI18n('fileInput', i18nStrings);
    const generatedId = useId();
    const inputId = idProp ?? generatedId;
    const isDisabled = disabled || isLoading;
    const sz = sizeMap[size];

    // Track selected filenames for display — uncontrolled internal state
    const [fileNames, setFileNames] = useState<string[]>([]);
    const hasFiles = fileNames.length > 0;

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      setFileNames(files.map((f) => f.name));
      onChange?.(e);
    }, [onChange]);

    // Build display text: placeholder → single filename → "N files selected"
    const displayText = useMemo(() => {
      if (!hasFiles) return i18n.placeholder ?? 'No file chosen';
      if (fileNames.length === 1) return fileNames[0];
      return i18n.filesSelectedLabel
        ? i18n.filesSelectedLabel(fileNames.length)
        : `${fileNames.length} files selected`;
    }, [hasFiles, fileNames, i18n]);

    // Wrapper
    const wrapperClasses = useMemo(() => [
      'relative flex items-center w-full overflow-hidden transition-default group',
      'rounded-[var(--file-input-radius)]',
      sz.height,
      'shadow-[var(--file-input-shadow)] hover:shadow-[var(--file-input-shadow-hover)]',
      isDisabled
        ? disabledWrapperClass
        : error
          ? variantErrorClasses[variant]
          : variantClasses[variant],
      wrapperClassName,
    ].filter(Boolean).join(' '), [variant, sz.height, isDisabled, error, wrapperClassName]);

    // Filename section
    const filenameSectionClasses = useMemo(() => [
      'flex items-center flex-1 min-w-0',
      sz.ps,
      'gap-[var(--file-input-gap)]',
    ].join(' '), [sz.ps]);

    // Filename text
    const filenameTextClasses = useMemo(() => [
      'truncate-label',
      sz.text,
      isDisabled
        ? 'text-[var(--file-input-text-disabled)]'
        : hasFiles
          ? 'text-[var(--file-input-filename-color)]'
          : 'text-[var(--file-input-placeholder-color)]',
    ].join(' '), [sz.text, isDisabled, hasFiles]);

    // Browse section
    const browseSectionClasses = useMemo(() => [
      'flex items-center flex-shrink-0 self-stretch',
      'border-s border-[var(--file-input-browse-border)]',
      sz.browsePx,
      'transition-default',
      isDisabled
        ? 'bg-[var(--file-input-browse-bg-disabled)]'
        : 'bg-[var(--file-input-browse-bg)] group-hover:bg-[var(--file-input-browse-bg-hover)]',
    ].filter(Boolean).join(' '), [sz.browsePx, isDisabled]);

    return (
      <div className={wrapperClasses}>
        {/* Left: icon + filename display — aria-live announces selection changes */}
        <div className={filenameSectionClasses}>
          <span aria-hidden="true" className="flex-shrink-0 text-[var(--file-input-icon-color)]">
            <Upload size={sz.iconSize} />
          </span>
          <span
            className={filenameTextClasses}
            aria-live="polite"
            aria-atomic="true"
          >
            {displayText}
          </span>
        </div>

        {/* Right: Browse label or loading spinner — purely decorative, aria-hidden */}
        <div className={browseSectionClasses} aria-hidden="true">
          {isLoading ? (
            <Loader2
              size={sz.iconSize}
              className="animate-spin text-[var(--file-input-icon-color)]"
              aria-hidden="true"
            />
          ) : (
            <span className={`content-nowrap ${sz.text} text-[var(--file-input-browse-text)]`}>
              {i18n.browseLabel ?? 'Browse'}
            </span>
          )}
        </div>

        {/*
         * Native <input type="file"> — transparent overlay covering the entire wrapper.
         * Provides native browser file picker, keyboard activation (Enter/Space),
         * form participation, and accessible name via aria-label / external <label htmlFor>.
         * The peer class enables focus-visible detection on sibling elements if needed.
         */}
        <input
          ref={ref}
          id={inputId}
          type="file"
          multiple={multiple}
          disabled={isDisabled}
          required={required}
          aria-required={required || undefined}
          aria-disabled={isDisabled || undefined}
          aria-busy={isLoading || undefined}
          {...getErrorFieldProps(error, `${inputId}-error`)}
          onChange={handleChange}
          className={[
            'absolute inset-0 w-full h-full opacity-0 focus:outline-none',
            isDisabled ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer',
            className,
          ].filter(Boolean).join(' ')}
          {...rest}
        />
      </div>
    );
  },
));
FileInput.displayName = 'FileInput';
