# FileInput

A styled `<input type="file">` atom that presents a filename display area and a "Browse" action label. The native file input is rendered as a transparent overlay covering the entire control, preserving all browser-native behaviour: OS file picker, keyboard activation, form participation, and screen-reader semantics.

---

## Usage

```tsx
import { FileInput } from './FileInput';

// Minimal — aria-label provides the accessible name
<FileInput aria-label="Upload profile photo" accept="image/*" />

// External label via htmlFor
<label htmlFor="resume">Resume</label>
<FileInput id="resume" accept=".pdf,.doc,.docx" />

// Error state with helper text
<FileInput
  error
  aria-label="Upload document"
  aria-describedby="upload-error"
/>
<p id="upload-error" role="alert">File must be under 10 MB.</p>

// Multiple files
<FileInput multiple accept="image/*" aria-label="Upload images" />

// Loading / uploading
<FileInput isLoading aria-label="Upload document" />
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'default' \| 'filled' \| 'ghost'` | `'default'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and typography scale |
| `error` | `boolean` | `false` | Error state — error border colour, sets `aria-invalid` |
| `isLoading` | `boolean` | `false` | Loading state — spinner in browse area, disables interaction |
| `disabled` | `boolean` | `false` | Disabled state — muted appearance, no interaction |
| `multiple` | `boolean` | `false` | Allow multiple file selection (native attribute) |
| `accept` | `string` | — | Accepted MIME types / extensions, e.g. `"image/*,.pdf"` |
| `i18nStrings` | `FileInputI18nStrings` | — | Override placeholder, browse label, multi-file label |
| `wrapperClassName` | `string` | — | Extra classes on the outer wrapper `<div>` |
| `className` | `string` | — | Extra classes on the hidden `<input>` element |
| + all native `<input>` attributes | — | — | Forwarded to the underlying input (except `type` and `size`) |

### `FileInputI18nStrings`

| Key | Type | Default |
|---|---|---|
| `placeholder` | `string` | `"No file chosen"` |
| `browseLabel` | `string` | `"Browse"` |
| `filesSelectedLabel` | `(count: number) => string` | `(n) => "${n} files selected"` |

---

## Variants

| Variant | Visual strategy |
|---|---|
| `default` | Outlined border at rest; bg tint + border deepens on hover; border shifts to focus colour on focus |
| `filled` | Muted filled background, no visible border; hover deepens fill; focus reveals border + lighter bg |
| `ghost` | Fully transparent, no border until hover — background and border appear together on hover |

---

## Sizes

| Size | Height token | Typography |
|---|---|---|
| `sm` | `--size-component-sm` (2rem) | `.text-body-sm` |
| `md` | `--size-component-md` (2.5rem) | `.text-body-md` |
| `lg` | `--size-component-lg` (3rem) | `.text-body-lg` |

---

## States

| State | Visual treatment |
|---|---|
| Default | Resting appearance; flat in light/dark |
| Hover | Background + border both shift one step deeper (two-property change) |
| Focus | Border colour changes to `--color-border-focus` via CSS `focus-within` |
| Error | Border locked to `--color-border-error` across all interaction states |
| Loading | Spinner replaces browse label; interaction disabled; `aria-busy="true"` |
| Disabled | Muted background + text; no hover/focus response; `cursor-not-allowed` |

---

## Component Tokens

All tokens are declared in `design-system/geeklego.css` under the `/* FileInput */` block.

| Token | Semantic alias | Notes |
|---|---|---|
| `--file-input-bg` | `--color-bg-primary` | Wrapper bg — default variant |
| `--file-input-bg-hover` | `--color-bg-secondary` | Wrapper bg on hover |
| `--file-input-bg-disabled` | `--color-action-disabled` | Disabled state |
| `--file-input-border` | `--color-border-default` | Resting border |
| `--file-input-border-hover` | `--color-border-strong` | Hover border |
| `--file-input-border-focus` | `--color-border-focus` | Focus indicator border |
| `--file-input-border-error` | `--color-border-error` | Error state border |
| `--file-input-border-disabled` | `--color-border-subtle` | Disabled border |
| `--file-input-filled-bg` | `--color-bg-secondary` | Filled variant bg |
| `--file-input-ghost-bg-hover` | `--color-action-secondary` | Ghost hover bg |
| `--file-input-ghost-border-hover` | `--color-border-default` | Ghost hover border |
| `--file-input-filename-color` | `--color-text-primary` | Text when file selected |
| `--file-input-placeholder-color` | `--color-text-tertiary` | Placeholder text |
| `--file-input-text-disabled` | `--color-text-disabled` | Text in disabled state |
| `--file-input-browse-bg` | `--color-bg-secondary` | Browse section bg |
| `--file-input-browse-bg-hover` | `--color-bg-tertiary` | Browse section hover bg |
| `--file-input-browse-text` | `--color-text-secondary` | Browse label text |
| `--file-input-browse-border` | `--color-border-default` | Separator between filename and browse areas |
| `--file-input-shadow` | `none` | Resting shadow |
| `--file-input-shadow-hover` | `none` | Hover shadow |
| `--file-input-height-sm/md/lg` | `--size-component-sm/md/lg` | Height per size |
| `--file-input-icon-size-sm/md/lg` | `--size-icon-xs/sm/md` | Upload + spinner icon size |
| `--file-input-radius` | `--radius-component-md` | Corner radius |

---

## Accessibility

### Semantic element

`<input type="file">` — native file input rendered as a transparent full-size overlay inside a styled `<div>` wrapper.

### Accessible name (required)

The `FileInput` atom does **not** provide its own label. Consumers must supply one of:

1. `aria-label` directly on `<FileInput>` — simplest
2. External `<label htmlFor={id}>` — preferred in forms

```tsx
// Option 1 — aria-label
<FileInput aria-label="Upload profile photo" />

// Option 2 — external label
<label htmlFor="upload">Profile photo</label>
<FileInput id="upload" />
```

### ARIA attributes

| Attribute | Condition | Value |
|---|---|---|
| `aria-required` | `required` prop | `"true"` |
| `aria-disabled` | `disabled` or `isLoading` | `"true"` |
| `aria-invalid` | `error` prop | `"true"` |
| `aria-describedby` | `error` prop | Points to `${id}-error` |
| `aria-busy` | `isLoading` | `"true"` |
| `aria-live="polite"` | Filename display `<span>` | Announces selection changes |

### Keyboard interaction

| Key | Action |
|---|---|
| `Tab` | Move focus to the file input |
| `Enter` / `Space` | Open the OS file picker |
| `Escape` | (OS-dependent) Dismiss file picker |

### Screen reader announcement

When a file is selected, the `aria-live="polite"` region announces the filename (or "N files selected" for multiple). The OS file picker itself is announced natively by the browser.

### Icon

The Upload icon (`<Upload>`) is `aria-hidden="true"` — decorative. The Browse label span is inside an `aria-hidden` container; the native input provides the interactive accessible name.

### Minimum touch target

The transparent `<input>` fills the entire wrapper (minimum `h-[var(--file-input-height-sm)]` = 2rem = 32px), exceeding the WCAG 2.5.8 minimum of 24×24px.

---

## i18n

Localise system strings via the `i18nStrings` prop or `GeeklegoI18nProvider`:

```tsx
// Per-instance
<FileInput
  aria-label="Hochladen"
  i18nStrings={{
    placeholder: 'Keine Datei ausgewählt',
    browseLabel: 'Durchsuchen',
    filesSelectedLabel: (n) => `${n} Dateien ausgewählt`,
  }}
/>

// Provider-level (all FileInput instances)
<GeeklegoI18nProvider strings={{ fileInput: { browseLabel: 'Parcourir' } }}>
  {children}
</GeeklegoI18nProvider>
```

---

## Schema.org

No Schema.org entity mapping applies to a generic file input control. The `schema` prop is not implemented.