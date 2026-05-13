import type { HTMLAttributes } from 'react';

export type FileUploadVariant = 'dropzone' | 'compact' | 'button';
export type FileUploadSize = 'sm' | 'md' | 'lg';
export type FileUploadFileStatus = 'idle' | 'uploading' | 'done' | 'error';

export interface FileUploadFile {
  /** Unique identifier for this file entry. */
  id: string;
  /** Original File object from the browser. */
  file: File;
  /** Current upload status. Defaults to 'idle'. */
  status?: FileUploadFileStatus;
  /** Upload progress 0–100. Only relevant when status is 'uploading'. */
  progress?: number;
  /** Error message shown below the filename when status is 'error'. */
  error?: string;
}

export interface FileUploadI18nStrings {
  /** Dropzone heading at rest. Default: "Drop files here" */
  dropzoneTitle?: string;
  /** Dropzone heading while a drag is active. Default: "Release to drop" */
  dragActiveTitle?: string;
  /** Hint prefix before the browse link. Default: "or click to" */
  dropzoneHint?: string;
  /** The underlined "browse" link text inside the hint. Default: "browse" */
  browseText?: string;
  /** Accessible label for the hidden file input. Default: "Upload files" */
  inputLabel?: string;
  /** aria-label for the remove button on each file item. Default: "Remove file" */
  removeFileLabel?: string;
  /** Status suffix when a file is uploading with no known progress. Default: "Uploading…" */
  uploadingText?: string;
  /** Status suffix when a file has finished uploading. Default: "Done" */
  doneText?: string;
  /**
   * Error shown when a file exceeds maxFileSize.
   * Receives a human-readable size string. Default: (size) => `File exceeds ${size} limit`
   */
  maxSizeError?: (size: string) => string;
  /**
   * Error shown when maxFiles is exceeded (multiple mode).
   * Receives the allowed count. Default: (max) => `Maximum ${max} file${max === 1 ? '' : 's'} allowed`
   */
  maxFilesError?: (maxFiles: number) => string;
}

export interface FileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Visual layout variant. Defaults to 'dropzone'. */
  variant?: FileUploadVariant;
  /** Controls drop zone padding and icon size. Defaults to 'md'. */
  size?: FileUploadSize;
  /** Accepted MIME types or file extensions forwarded to the hidden input. E.g. "image/*,.pdf" */
  accept?: string;
  /** Allow multiple file selection. Defaults to false. */
  multiple?: boolean;
  /** Maximum number of files (enforced in multiple mode only). */
  maxFiles?: number;
  /** Maximum file size in bytes. Files over this limit are added with status 'error'. */
  maxFileSize?: number;
  /** Disables the entire component including the drop zone and remove buttons. */
  disabled?: boolean;
  /** Puts the drop zone in error visual state (red border). */
  error?: boolean;
  /** Error message shown below the drop zone when error is true. */
  errorMessage?: string;
  /** Secondary hint text inside the drop zone (e.g. "PNG, JPG up to 5 MB"). */
  hint?: string;
  /**
   * Controlled file list. Each entry carries id, File object, and optional status/progress.
   * When provided the component is controlled — update state via onFilesChange/onFileRemove.
   */
  files?: FileUploadFile[];
  /** Called with the full updated file list whenever files are added. */
  onFilesChange?: (files: FileUploadFile[]) => void;
  /** Called with the removed file's id when the user clicks remove. */
  onFileRemove?: (id: string) => void;
  /** Per-instance i18n string overrides. */
  i18nStrings?: FileUploadI18nStrings;
}
