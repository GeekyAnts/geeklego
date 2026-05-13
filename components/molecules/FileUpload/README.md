# FileUpload

A drag-and-drop file upload molecule that wraps a hidden `<input type="file">` with a styled drop zone, per-file status tracking, and upload progress display.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'dropzone' \| 'compact' \| 'button'` | `'dropzone'` | Visual layout. `dropzone` = large centred zone; `compact` = single-row zone; `button` = trigger button only |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Controls drop zone padding and icon size |
| `accept` | `string` | — | Forwarded to `<input type="file">`. E.g. `"image/*,.pdf"` |
| `multiple` | `boolean` | `false` | Allow selecting multiple files |
| `maxFiles` | `number` | — | Cap on accepted files (multiple mode only) |
| `maxFileSize` | `number` | — | Max file size in bytes. Oversized files are added with `status: 'error'` |
| `disabled` | `boolean` | `false` | Disables zone, input, and remove buttons |
| `error` | `boolean` | `false` | Puts the drop zone in error state (red border) |
| `errorMessage` | `string` | — | Error text shown below the zone when `error` is true |
| `hint` | `string` | — | Secondary hint inside the zone (e.g. `"PNG, JPG up to 5 MB"`) |
| `files` | `FileUploadFile[]` | — | Controlled file list. Omit for uncontrolled mode |
| `onFilesChange` | `(files: FileUploadFile[]) => void` | — | Called with full updated list when files are added |
| `onFileRemove` | `(id: string) => void` | — | Called with removed file id when user clicks remove |
| `i18nStrings` | `FileUploadI18nStrings` | — | Per-instance i18n string overrides |
| `className` | `string` | — | Additional class names on the container div |

### FileUploadFile shape

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier (stable key for React lists) |
| `file` | `File` | Native File object |
| `status` | `'idle' \| 'uploading' \| 'done' \| 'error'` | Display state of this file |
| `progress` | `number` | Upload progress 0–100. Shows `ProgressBar` when `status='uploading'` |
| `error` | `string` | Per-file error message shown when `status='error'` |

---

## Tokens Used

| Token | Purpose |
|---|---|
| `--file-upload-zone-bg` | Drop zone resting background |
| `--file-upload-zone-bg-hover` | Drop zone hover background |
| `--file-upload-zone-bg-dragover` | Drop zone drag-active background |
| `--file-upload-zone-bg-error` | Drop zone error background |
| `--file-upload-zone-bg-disabled` | Drop zone disabled background |
| `--file-upload-zone-border` | Drop zone resting border colour |
| `--file-upload-zone-border-hover` | Drop zone hover border |
| `--file-upload-zone-border-dragover` | Drop zone drag-active border |
| `--file-upload-zone-border-error` | Drop zone error border |
| `--file-upload-zone-border-disabled` | Drop zone disabled border |
| `--file-upload-zone-radius` | Drop zone corner radius |
| `--file-upload-zone-icon-color` | Upload icon colour at rest |
| `--file-upload-zone-icon-color-dragover` | Upload icon colour while dragging |
| `--file-upload-zone-title-color` | Zone heading text colour |
| `--file-upload-zone-hint-color` | Zone hint text colour |
| `--file-upload-zone-link-color` | "browse" underlined link colour |
| `--file-upload-zone-py-{sm,md,lg}` | Drop zone vertical padding by size |
| `--file-upload-zone-px-{sm,md,lg}` | Drop zone horizontal padding by size |
| `--file-upload-zone-icon-size-{sm,md,lg}` | Upload icon size by size prop |
| `--file-upload-zone-gap-{sm,md,lg}` | Gap between icon and text by size |
| `--file-upload-item-bg` | File item background |
| `--file-upload-item-border` | File item normal border |
| `--file-upload-item-border-error` | File item error border |
| `--file-upload-item-radius` | File item corner radius |
| `--file-upload-item-py` | File item vertical padding |
| `--file-upload-item-px` | File item horizontal padding |
| `--file-upload-item-gap` | Gap between file item parts |
| `--file-upload-item-name-color` | File name text colour |
| `--file-upload-item-meta-color` | File size / status meta colour |
| `--file-upload-item-error-color` | File error text colour |
| `--file-upload-item-icon-color` | File type icon colour |
| `--file-upload-item-icon-done-color` | Done icon colour |
| `--file-upload-item-icon-error-color` | Error icon colour |
| `--file-upload-item-icon-size` | Status icon size |
| `--file-upload-remove-color` | Remove button icon at rest |
| `--file-upload-remove-color-hover` | Remove button icon on hover |
| `--file-upload-remove-bg-hover` | Remove button background on hover |
| `--file-upload-remove-radius` | Remove button corner radius |
| `--file-upload-remove-size` | Remove button dimensions |
| `--file-upload-list-mt` | Top margin between zone and file list |
| `--file-upload-list-gap` | Gap between file items |
| `--file-upload-min-width` | Minimum component width |

---

## Variants

| Variant | Visual strategy |
|---|---|
| `dropzone` | Large centred zone with icon on top, title, and hint. Dashed border signals drop target. |
| `compact` | Single-row horizontal zone. Icon left, title inline. Smaller footprint for inline forms. |
| `button` | No drop zone rendered. An outline Button triggers the file picker. File list appears below. |

---

## Sizes

The `size` prop controls vertical padding and icon size of the drop zone. File items are always the same size.

| Size | Zone padding | Icon size |
|---|---|---|
| `sm` | `--spacing-component-xl` | 24px (`--size-icon-lg`) |
| `md` | `--spacing-layout-xs` | 32px (`--size-icon-xl`) |
| `lg` | `--spacing-layout-sm` | 48px (`--size-icon-2xl`) |

---

## States

| State | Visual treatment |
|---|---|
| **Idle** | Subtle background, dashed border |
| **Hover** | Background + border darken simultaneously |
| **Drag-over** | Highlight background + focus border colour |
| **Disabled** | Muted background, no hover, no pointer events |
| **Zone error** | Error background + red border + `role="alert"` message below |
| **File idle** | Normal border, no status suffix |
| **File uploading** | `ProgressBar` (when `progress` is set) or "Uploading…" suffix |
| **File done** | `CheckCircle2` icon + "Done" suffix |
| **File error** | `AlertCircle` icon + red error message |

---

## Accessibility

**Semantic element:** `<div>` container, `<label>` drop zone, `<input type="file">` (sr-only), `<ul>` + `<li>` file list, `<button>` remove buttons.

**Role:** No explicit role on container. `role="alert"` on the zone error message paragraph.

| ARIA attribute | Element | Value |
|---|---|---|
| `aria-label` | Hidden `<input type="file">` | Resolved from `i18nStrings.inputLabel` (default: "Upload files") |
| `aria-disabled` | `<label>` and `<input>` | `true` when `disabled` prop is set |
| `aria-invalid` + `aria-describedby` | `<input>` | Applied via `getErrorFieldProps()` when `error && errorMessage` |
| `aria-label` | `<ul>` file list | "Selected files" |
| `aria-label` | Remove `<button>` | `"${removeLabel}: ${filename}"` — includes the file name for specificity |
| `aria-live="polite"` `aria-atomic="true"` | File item meta `<p>` | Announces status changes (Done, Uploading, error message) |
| `role="alert"` | Zone error `<p>` | Announces zone-level error immediately |

### Keyboard interaction

| Key | Context | Action |
|---|---|---|
| `Tab` | Component | Moves focus to the hidden file input (labelled by its `<label>`) |
| `Enter` / `Space` | Hidden input focused | Opens native file picker |
| `Tab` | File list | Moves through remove buttons |
| `Enter` / `Space` | Remove button focused | Removes the file |
| Drag & drop | Drop zone | `onDragEnter`, `onDragOver`, `onDrop` events handled on `<label>` |

### Screen reader announcement

- Zone: announced as its label text ("Drop files here or click to browse")
- Input: "Upload files, file" (aria-label + implicit type)
- Status change: "2.4 MB · Done" re-announced via `aria-live="polite"` on the meta paragraph
- File error: error text appended to meta, announced politely
- Zone error: announced immediately via `role="alert"`
- Remove button: "Remove file: logo.svg, button"

---

## Usage

### Uncontrolled (simple)

```tsx
<FileUpload
  hint="PNG, JPG up to 5 MB"
  accept="image/*"
  onFilesChange={(files) => console.log(files)}
/>
```

### Controlled with upload simulation

```tsx
const [files, setFiles] = useState<FileUploadFile[]>([]);

function handleFilesChange(incoming: FileUploadFile[]) {
  setFiles(incoming);
  // simulate upload for new idle files
  incoming.filter((f) => f.status === 'idle').forEach((f) => startUpload(f.id));
}

function handleRemove(id: string) {
  setFiles((prev) => prev.filter((f) => f.id !== id));
}

<FileUpload
  multiple
  maxFiles={5}
  maxFileSize={10 * 1024 * 1024}
  hint="Up to 5 files, 10 MB each"
  files={files}
  onFilesChange={handleFilesChange}
  onFileRemove={handleRemove}
/>
```

### Compact in a form

```tsx
<FormField label="Attachment" htmlFor="attachment-input">
  <FileUpload
    variant="compact"
    size="sm"
    accept=".pdf,.doc,.docx"
    hint="PDF or Word"
  />
</FormField>
```

### i18n

```tsx
<GeeklegoI18nProvider strings={{
  fileUpload: {
    dropzoneTitle: 'Datei ablegen',
    dragActiveTitle: 'Loslassen zum Hochladen',
    dropzoneHint: 'oder',
    browseText: 'durchsuchen',
    removeFileLabel: 'Datei entfernen',
    doneText: 'Fertig',
    uploadingText: 'Wird hochgeladen…',
  },
}}>
  <FileUpload hint="PNG, JPG bis 5 MB" />
</GeeklegoI18nProvider>
```
