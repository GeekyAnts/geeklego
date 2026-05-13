import type { HTMLAttributes } from 'react';

// ── Option data shape ─────────────────────────────────────────────────────

export interface ComboboxOption {
  /** Unique identifier for this option — used as React key and selection value. */
  id: string;
  /** Visible label text shown in the input and option list. */
  label: string;
  /** Optional secondary description shown below the label. */
  description?: string;
  /** When true, the option is visible but cannot be selected. */
  disabled?: boolean;
  /** Optional group name — options with the same group are visually grouped. */
  group?: string;
}

// ── Variants + sizes ──────────────────────────────────────────────────────

export type ComboboxVariant = 'default' | 'filled' | 'flushed';
export type ComboboxSize = 'sm' | 'md' | 'lg';

// ── i18n strings ──────────────────────────────────────────────────────────

export interface ComboboxI18nStrings {
  /** aria-label for the clear (×) button. Default: "Clear" */
  clearLabel?: string;
  /** aria-label for the listbox. Default: "Options" */
  listboxLabel?: string;
  /** Text shown when no options match the query. Default: "No results" */
  noResultsMessage?: string;
  /** Text shown during async option loading. Default: "Loading options…" */
  loadingMessage?: string;
}

// ── Props ──────────────────────────────────────────────────────────────────

export interface ComboboxProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Full list of options to filter and display. */
  options: ComboboxOption[];

  /**
   * Controlled selected option id.
   * Pass `null` to represent an explicit empty selection.
   * When provided, the component is fully controlled — manage updates via `onChange`.
   */
  value?: string | null;

  /** Initial selected option id for uncontrolled usage. */
  defaultValue?: string;

  /** Called when the user selects or clears an option. */
  onChange?: (id: string | null) => void;

  /**
   * Called whenever the filter query changes as the user types.
   * Use this for async option loading (pass fresh `options` each time).
   */
  onQueryChange?: (query: string) => void;

  /** Placeholder text shown in the input when no value is selected. */
  placeholder?: string;

  /** Visual style variant. Defaults to 'default'. */
  variant?: ComboboxVariant;

  /** Height and typography size. Defaults to 'md'. */
  size?: ComboboxSize;

  /** Disables the entire combobox — prevents opening, typing, and selection. */
  disabled?: boolean;

  /** Error state — shows error border on the input. */
  error?: boolean;

  /**
   * Loading state — shows spinner inside the input and an informational message
   * in the panel. Useful during async option fetching.
   */
  isLoading?: boolean;

  /**
   * When true (default), shows a clear (×) button when an option is selected.
   * Set to false to require explicit selection — e.g. required form fields.
   */
  clearable?: boolean;

  /** `id` forwarded to the underlying `<input>` element. */
  id?: string;

  /** `name` forwarded to the underlying `<input>` element for form participation. */
  name?: string;

  /** Marks the field as required — forwarded to the input as `aria-required`. */
  required?: boolean;

  /** Accessible label when no visible `<label>` is associated. */
  'aria-label'?: string;

  /** Points to an external element that labels this field. */
  'aria-labelledby'?: string;

  /**
   * Points to an external description element (hint, error).
   * Combined with the internal error description when `error` is true.
   */
  'aria-describedby'?: string;

  /** Additional class names applied to the outer `<div>` wrapper. */
  wrapperClassName?: string;

  /** Additional class names applied to the inner `Input` element. */
  className?: string;

  /** Overrides for system-generated strings (clear button label, empty state, etc.). */
  i18nStrings?: ComboboxI18nStrings;
}
