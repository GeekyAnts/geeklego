"use client";
import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  CloudUpload,
  File as FileIcon,
  X,
} from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "../Button/Button";
import { Progress } from "../Progress/Progress";
import { dropzoneVariants } from "./file-upload-variants";
import type { FileUploadProps, UploadFile } from "./FileUpload.types";

/**
 * FileUpload — ShadCN/Radix-pattern component on geeklego's 2-tier tokens.
 *
 * There is no Radix file-upload primitive and no headless backbone (drag-and-drop
 * is native HTML5 DnD, not "drag physics"), so this is a hand-rolled leaf built
 * with cva + cn + forwardRef. It wraps a visually-hidden native `<input type="file">`
 * (the a11y-correct source of truth) inside a labelled dropzone, and tracks
 * drag-over + selection in local state. Styled entirely with standard semantics
 * (border-input, bg-background, text-muted-foreground, ring-ring, --destructive).
 *
 * Controlled via `value` + `onValueChange`, or uncontrolled via `defaultValue`.
 * Per-file `progress` / `status` are consumer-driven (this component does not
 * upload) so it composes with any upload transport.
 */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      className,
      variant,
      size,
      value,
      defaultValue = [],
      onValueChange,
      multiple = false,
      disabled = false,
      hideList = false,
      label = "Drag & drop files here",
      hint = "or click to browse",
      accept,
      id,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [internal, setInternal] = useState<UploadFile[]>(defaultValue);
    const reactId = useId();
    const listId = `${id ?? reactId}-list`;

    const isControlled = value !== undefined;
    const files = isControlled ? value : internal;

    // Bridge the forwarded ref to our internal input ref (so we can trigger the
    // native file dialog on dropzone click while still exposing the input).
    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const commit = useCallback(
      (next: UploadFile[]) => {
        if (!isControlled) setInternal(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const addFiles = useCallback(
      (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;
        const incoming: UploadFile[] = Array.from(fileList).map((file, i) => ({
          // Stable-enough id from name/size/time-ish index; consumers may override.
          id: `${file.name}-${file.size}-${file.lastModified}-${i}`,
          file,
          status: "idle" as const,
        }));
        const next = multiple ? [...files, ...incoming] : incoming.slice(0, 1);
        commit(next);
      },
      [files, multiple, commit],
    );

    const removeFile = useCallback(
      (fileId: string) => {
        commit(files.filter((f) => f.id !== fileId));
      },
      [files, commit],
    );

    const openPicker = useCallback(() => {
      if (!disabled) inputRef.current?.click();
    }, [disabled]);

    const onDrop = useCallback(
      (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        if (disabled) return;
        addFiles(e.dataTransfer.files);
      },
      [disabled, addFiles],
    );

    const onDragOver = useCallback(
      (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      },
      [disabled],
    );

    const onKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPicker();
        }
      },
      [openPicker],
    );

    return (
      <div className="flex w-full flex-col gap-3">
        {/* Dropzone — button-role so keyboard users can open the picker. */}
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          aria-controls={files.length ? listId : undefined}
          data-dragging={dragging}
          data-disabled={disabled}
          onClick={openPicker}
          onKeyDown={onKeyDown}
          onDragOver={onDragOver}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(dropzoneVariants({ variant, size }), className)}
        >
          <CloudUpload
            className={cn(
              "size-8 shrink-0",
              variant === "error" ? "text-destructive" : "text-muted-foreground",
            )}
            aria-hidden="true"
          />
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-foreground">{label}</span>
            {hint ? <span className="text-muted-foreground">{hint}</span> : null}
          </div>

          {/* The real, accessible control — visually hidden, not display:none, so
              it stays focusable/labelled and native form submission still works. */}
          <input
            ref={setRefs}
            type="file"
            id={id}
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={(e) => addFiles(e.target.files)}
            // Clear the value on click so re-selecting the same file re-fires change.
            onClick={(e) => {
              (e.target as HTMLInputElement).value = "";
            }}
            className="sr-only"
            tabIndex={-1}
            {...props}
          />
        </div>

        {/* Selected-file list. */}
        {!hideList && files.length > 0 ? (
          <ul id={listId} className="flex flex-col gap-2">
            {files.map((f) => (
              <li
                key={f.id}
                className={cn(
                  "flex items-center gap-3 rounded-md border bg-card p-3 text-card-foreground",
                  f.status === "error" ? "border-destructive" : "border-border",
                )}
              >
                <FileStatusIcon status={f.status} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {f.file.name}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatBytes(f.file.size)}
                    </span>
                  </div>
                  {typeof f.progress === "number" && f.status !== "success" ? (
                    <Progress value={f.progress} className="h-1.5" />
                  ) : null}
                  {f.message ? (
                    <span
                      className={cn(
                        "text-xs",
                        f.status === "error"
                          ? "text-destructive"
                          : "text-muted-foreground",
                      )}
                    >
                      {f.message}
                    </span>
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
                  aria-label={`Remove ${f.file.name}`}
                  disabled={disabled}
                  onClick={() => removeFile(f.id)}
                >
                  <X />
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  },
);
FileUpload.displayName = "FileUpload";

/** Row leading icon reflecting the file's upload status. */
function FileStatusIcon({ status }: { status?: UploadFile["status"] }) {
  if (status === "success")
    return (
      <CheckCircle2 className="size-5 shrink-0 text-success" aria-hidden="true" />
    );
  if (status === "error")
    return (
      <AlertCircle className="size-5 shrink-0 text-destructive" aria-hidden="true" />
    );
  return (
    <FileIcon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
  );
}

/** Human-readable byte size (1023 → "1023 B", 2048 → "2 KB"). */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unit]}`;
}
