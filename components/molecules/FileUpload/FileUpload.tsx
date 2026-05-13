"use client"
import { forwardRef, memo, useCallback, useId, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { AlertCircle, CheckCircle2, FileText, UploadCloud, X } from 'lucide-react';
import { Button } from '../../atoms/Button/Button';
import { ProgressBar } from '../../atoms/ProgressBar/ProgressBar';
import { getErrorFieldProps } from '../../utils/accessibility/aria-helpers';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type {
  FileUploadFile,
  FileUploadProps,
  FileUploadSize,
  FileUploadVariant,
} from './FileUpload.types';

// ── Module-level helpers ─────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1_024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1_024).toFixed(1)} KB`;
  if (bytes < 1_073_741_824) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  return `${(bytes / 1_073_741_824).toFixed(1)} GB`;
}

function generateFileId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ── Module-level static class strings (Tailwind JIT-safe) ───────────────────

const zoneBase = [
  'w-full flex items-center justify-center border-2 border-dashed',
  'rounded-[var(--file-upload-zone-radius)] transition-default cursor-pointer',
  'shadow-[var(--file-upload-zone-shadow)]',
  'focus-visible:outline-none focus-visible:focus-ring',
].join(' ');

const zoneLayoutClasses: Record<FileUploadVariant, string> = {
  dropzone: 'flex-col text-center',
  compact:  'flex-row',
  button:   '',
};

const sizeMap: Record<FileUploadSize, {
  py: string;
  px: string;
  iconSize: string;
  gap: string;
  textTitle: string;
  textHint: string;
}> = {
  sm: {
    py:        'py-[var(--file-upload-zone-py-sm)]',
    px:        'px-[var(--file-upload-zone-px-sm)]',
    iconSize:  'var(--file-upload-zone-icon-size-sm)',
    gap:       'gap-[var(--file-upload-zone-gap-sm)]',
    textTitle: 'text-body-sm',
    textHint:  'text-body-sm',
  },
  md: {
    py:        'py-[var(--file-upload-zone-py-md)]',
    px:        'px-[var(--file-upload-zone-px-md)]',
    iconSize:  'var(--file-upload-zone-icon-size-md)',
    gap:       'gap-[var(--file-upload-zone-gap-md)]',
    textTitle: 'text-body-md',
    textHint:  'text-body-sm',
  },
  lg: {
    py:        'py-[var(--file-upload-zone-py-lg)]',
    px:        'px-[var(--file-upload-zone-px-lg)]',
    iconSize:  'var(--file-upload-zone-icon-size-lg)',
    gap:       'gap-[var(--file-upload-zone-gap-lg)]',
    textTitle: 'text-body-lg',
    textHint:  'text-body-md',
  },
};

const zoneIdleClass = [
  'bg-[var(--file-upload-zone-bg)] border-[var(--file-upload-zone-border)]',
  'hover:bg-[var(--file-upload-zone-bg-hover)] hover:border-[var(--file-upload-zone-border-hover)]',
  'hover:shadow-[var(--file-upload-zone-shadow-hover)]',
].join(' ');

const zoneDragoverClass = [
  'bg-[var(--file-upload-zone-bg-dragover)] border-[var(--file-upload-zone-border-dragover)]',
  'shadow-[var(--file-upload-zone-shadow-hover)]',
].join(' ');

const zoneErrorClass = [
  'bg-[var(--file-upload-zone-bg-error)] border-[var(--file-upload-zone-border-error)]',
].join(' ');

const zoneDisabledClass = [
  'bg-[var(--file-upload-zone-bg-disabled)] border-[var(--file-upload-zone-border-disabled)]',
  'cursor-not-allowed pointer-events-none',
].join(' ');

const fileItemBase = [
  'flex items-center gap-[var(--file-upload-item-gap)]',
  'rounded-[var(--file-upload-item-radius)] border',
  'bg-[var(--file-upload-item-bg)]',
  'py-[var(--file-upload-item-py)] px-[var(--file-upload-item-px)]',
  'transition-default perf-contain-content',
].join(' ');

const fileItemBorderNormal = 'border-[var(--file-upload-item-border)]';
const fileItemBorderError  = 'border-[var(--file-upload-item-border-error)]';

const removeBtnClass = [
  'flex-shrink-0 flex items-center justify-center',
  'w-[var(--file-upload-remove-size)] h-[var(--file-upload-remove-size)]',
  'rounded-[var(--file-upload-remove-radius)]',
  'text-[var(--file-upload-remove-color)]',
  'hover:text-[var(--file-upload-remove-color-hover)] hover:bg-[var(--file-upload-remove-bg-hover)]',
  'transition-default',
  'focus-visible:outline-none focus-visible:focus-ring',
].join(' ');

// ── Internal: FileUploadFileItem ─────────────────────────────────────────────

interface FileItemProps {
  file: FileUploadFile;
  onRemove: (id: string) => void;
  removeLabel: string;
  uploadingText: string;
  doneText: string;
  disabled?: boolean;
}

const FileUploadFileItem = memo(({
  file,
  onRemove,
  removeLabel,
  uploadingText,
  doneText,
  disabled,
}: FileItemProps) => {
  const { status = 'idle', progress, error: fileError, file: rawFile } = file;
  const isError     = status === 'error';
  const isUploading = status === 'uploading';
  const isDone      = status === 'done';

  const handleRemove = useCallback(() => onRemove(file.id), [onRemove, file.id]);

  return (
    <li className={[fileItemBase, isError ? fileItemBorderError : fileItemBorderNormal].join(' ')}>
      {/* File type icon */}
      <span className="flex-shrink-0 text-[var(--file-upload-item-icon-color)]" aria-hidden="true">
        <FileText size="var(--file-upload-item-icon-size)" />
      </span>

      {/* File info */}
      <div className="flex flex-col content-flex gap-[var(--file-upload-gap)]">
        {/* Name + status icon row */}
        <div className="flex items-center gap-[var(--file-upload-gap)]">
          <span className="text-body-sm text-[var(--file-upload-item-name-color)] truncate-label content-flex">
            {rawFile.name}
          </span>
          {isDone && (
            <span className="flex-shrink-0 text-[var(--file-upload-item-icon-done-color)]" aria-hidden="true">
              <CheckCircle2 size="var(--file-upload-item-icon-size)" />
            </span>
          )}
          {isError && (
            <span className="flex-shrink-0 text-[var(--file-upload-item-icon-error-color)]" aria-hidden="true">
              <AlertCircle size="var(--file-upload-item-icon-size)" />
            </span>
          )}
        </div>

        {/* Meta — announced as a live region so status changes are read aloud */}
        <p
          className="text-body-sm text-[var(--file-upload-item-meta-color)]"
          aria-live="polite"
          aria-atomic="true"
        >
          {formatFileSize(rawFile.size)}
          {isDone && ` · ${doneText}`}
          {isUploading && progress === undefined && ` · ${uploadingText}`}
          {isError && fileError ? (
            <span className="text-[var(--file-upload-item-error-color)]"> · {fileError}</span>
          ) : null}
        </p>

        {/* Progress bar — only when uploading with a known progress value */}
        {isUploading && progress !== undefined && (
          <ProgressBar
            value={progress}
            max={100}
            variant="default"
            size="xs"
            aria-label={`Uploading ${rawFile.name}`}
          />
        )}
      </div>

      {/* Remove button */}
      {!disabled && (
        <button
          type="button"
          onClick={handleRemove}
          aria-label={`${removeLabel}: ${rawFile.name}`}
          className={removeBtnClass}
        >
          <X size="var(--file-upload-remove-size)" aria-hidden="true" />
        </button>
      )}
    </li>
  );
});
FileUploadFileItem.displayName = 'FileUploadFileItem';

// ── Main component ────────────────────────────────────────────────────────────

export const FileUpload = memo(forwardRef<HTMLDivElement, FileUploadProps>(
  ({
    variant = 'dropzone',
    size = 'md',
    accept,
    multiple = false,
    maxFiles,
    maxFileSize,
    disabled = false,
    error = false,
    errorMessage,
    hint,
    files: controlledFiles,
    onFilesChange,
    onFileRemove,
    i18nStrings,
    className,
    ...rest
  }, ref) => {
    const i18n     = useComponentI18n('fileUpload', i18nStrings);
    const inputId  = useId();
    const errorId  = useId();
    const inputRef = useRef<HTMLInputElement>(null);

    const [internalFiles, setInternalFiles] = useState<FileUploadFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const isControlled = controlledFiles !== undefined;
    const displayFiles = isControlled ? controlledFiles : internalFiles;
    const sz           = sizeMap[size];

    // ── File processing ──────────────────────────────────────────────────
    const processFiles = useCallback((rawFiles: FileList | File[]) => {
      const fileArray    = Array.from(rawFiles);
      const currentCount = displayFiles.length;

      const newEntries: FileUploadFile[] = fileArray.map((f): FileUploadFile => {
        if (maxFileSize && f.size > maxFileSize) {
          const humanSize = formatFileSize(maxFileSize);
          return {
            id:     generateFileId(),
            file:   f,
            status: 'error',
            error:  i18n.maxSizeError
              ? i18n.maxSizeError(humanSize)
              : `File exceeds ${humanSize} limit`,
          };
        }
        return { id: generateFileId(), file: f, status: 'idle' };
      });

      let result: FileUploadFile[];
      if (!multiple) {
        result = [newEntries[0]];
      } else if (maxFiles) {
        const slotsLeft = maxFiles - currentCount;
        if (slotsLeft <= 0) return;
        result = [...displayFiles, ...newEntries.slice(0, slotsLeft)];
      } else {
        result = [...displayFiles, ...newEntries];
      }

      if (!isControlled) setInternalFiles(result);
      onFilesChange?.(result);
    }, [displayFiles, multiple, maxFiles, maxFileSize, isControlled, onFilesChange, i18n]);

    // ── Input + drag event handlers ──────────────────────────────────────
    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        processFiles(e.target.files);
        e.target.value = ''; // allow re-selecting the same file
      }
    }, [processFiles]);

    const handleRemove = useCallback((id: string) => {
      if (!isControlled) {
        setInternalFiles((prev) => prev.filter((f) => f.id !== id));
      }
      onFileRemove?.(id);
    }, [isControlled, onFileRemove]);

    const handleDragEnter = useCallback((e: DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragging(false);
      }
    }, []);

    const handleDragOver = useCallback((e: DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
    }, []);

    const handleDrop = useCallback((e: DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (!disabled && e.dataTransfer.files.length) {
        processFiles(e.dataTransfer.files);
      }
    }, [disabled, processFiles]);

    const handleButtonClick = useCallback(() => {
      inputRef.current?.click();
    }, []);

    // ── Computed classes ────────────────────────────────────────────────
    const zoneStateClass = disabled
      ? zoneDisabledClass
      : isDragging
        ? zoneDragoverClass
        : error
          ? zoneErrorClass
          : zoneIdleClass;

    const zoneClasses = useMemo(() => [
      zoneBase,
      zoneLayoutClasses[variant],
      sz.py,
      sz.px,
      sz.gap,
      zoneStateClass,
    ].filter(Boolean).join(' '), [variant, sz, zoneStateClass]);

    const containerClasses = useMemo(() => [
      'flex flex-col w-full min-w-[var(--file-upload-min-width)]',
      className,
    ].filter(Boolean).join(' '), [className]);

    const errorProps = useMemo(
      () => getErrorFieldProps(error && !!errorMessage, errorId),
      [error, errorMessage, errorId],
    );

    // ── Resolved i18n strings ────────────────────────────────────────────
    const title         = isDragging ? (i18n.dragActiveTitle ?? 'Release to drop') : (i18n.dropzoneTitle ?? 'Drop files here');
    const browseText    = i18n.browseText ?? 'browse';
    const dropzoneHint  = i18n.dropzoneHint ?? 'or click to';
    const inputLabel    = i18n.inputLabel ?? 'Upload files';
    const removeLabel   = i18n.removeFileLabel ?? 'Remove file';
    const uploadingText = i18n.uploadingText ?? 'Uploading\u2026';
    const doneText      = i18n.doneText ?? 'Done';

    const iconColorClass = isDragging
      ? 'text-[var(--file-upload-zone-icon-color-dragover)]'
      : 'text-[var(--file-upload-zone-icon-color)]';

    return (
      <div ref={ref} className={containerClasses} {...rest}>
        {/* Hidden file input — triggered by label click or button click */}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-label={inputLabel}
          aria-disabled={disabled || undefined}
          tabIndex={-1}
          {...errorProps}
          onChange={handleInputChange}
          className="sr-only"
        />

        {/* Drop zone — dropzone + compact variants */}
        {variant !== 'button' && (
          <label
            htmlFor={inputId}
            className={zoneClasses}
            aria-disabled={disabled || undefined}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <span
              className={`flex-shrink-0 transition-default ${iconColorClass}`}
              aria-hidden="true"
            >
              <UploadCloud size={sz.iconSize} />
            </span>

            <div className={`flex flex-col ${variant === 'dropzone' ? 'items-center' : 'items-start'}`}>
              <span className={`${sz.textTitle} font-medium text-[var(--file-upload-zone-title-color)] content-nowrap`}>
                {title}
              </span>
              {variant === 'dropzone' && (
                <span className={`${sz.textHint} text-[var(--file-upload-zone-hint-color)] truncate-label`}>
                  {dropzoneHint}{' '}
                  <span className="text-[var(--file-upload-zone-link-color)] underline underline-offset-1">
                    {browseText}
                  </span>
                </span>
              )}
              {hint && (
                <span className={`${sz.textHint} text-[var(--file-upload-zone-hint-color)] truncate-label`}>
                  {hint}
                </span>
              )}
            </div>
          </label>
        )}

        {/* Button variant trigger */}
        {variant === 'button' && (
          <Button
            variant="outline"
            size="md"
            disabled={disabled}
            leftIcon={<UploadCloud size="var(--size-icon-sm)" aria-hidden="true" />}
            onClick={handleButtonClick}
            type="button"
          >
            {i18n.dropzoneTitle ?? 'Browse files'}
          </Button>
        )}

        {/* File list */}
        {displayFiles.length > 0 && (
          <ul
            className="flex flex-col mt-[var(--file-upload-list-mt)] gap-[var(--file-upload-list-gap)] list-none p-0 m-0"
            aria-label="Selected files"
          >
            {displayFiles.map((file) => (
              <FileUploadFileItem
                key={file.id}
                file={file}
                onRemove={handleRemove}
                removeLabel={removeLabel}
                uploadingText={uploadingText}
                doneText={doneText}
                disabled={disabled}
              />
            ))}
          </ul>
        )}

        {/* Error message */}
        {error && errorMessage && (
          <p
            id={errorId}
            role="alert"
            className="mt-[var(--file-upload-gap)] text-body-sm text-[var(--file-upload-item-error-color)]"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
));
FileUpload.displayName = 'FileUpload';
