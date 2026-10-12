import type { InputHTMLAttributes } from "react";
import type { DropzoneVariantProps } from "./file-upload-variants";

/**
 * A file tracked by FileUpload. Wraps the native File with an id (so React can
 * key the list and the consumer can target a specific entry) plus optional
 * upload state that a consumer can drive to show progress / errors.
 */
export interface UploadFile {
  /** Stable id for keying + targeting (generated on selection). */
  id: string;
  /** The underlying browser File object. */
  file: File;
  /** Upload progress 0–100. Renders a Progress bar when provided. */
  progress?: number;
  /** Terminal/interim status for the row's icon + styling. */
  status?: "idle" | "uploading" | "success" | "error";
  /** Message shown under the file (e.g. an error reason). */
  message?: string;
}

export interface FileUploadProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "size" | "value" | "defaultValue" | "onChange" | "type"
    >,
    DropzoneVariantProps {
  /**
   * Controlled list of selected files. Omit to run uncontrolled (the component
   * keeps its own list internally).
   */
  value?: UploadFile[];
  /** Initial files for the uncontrolled mode. */
  defaultValue?: UploadFile[];
  /**
   * Called whenever the selection changes (add via browse/drop, or remove).
   * Receives the full next list.
   */
  onValueChange?: (files: UploadFile[]) => void;
  /** Allow selecting more than one file. Mirrors the native `multiple`. */
  multiple?: boolean;
  /** Disable the dropzone + input. */
  disabled?: boolean;
  /** Hide the built-in selected-file list (consumer renders its own). */
  hideList?: boolean;
  /** Primary label inside the dropzone. */
  label?: string;
  /** Secondary hint line (e.g. "PNG, JPG up to 5MB"). */
  hint?: string;
}
