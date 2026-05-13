import type { InputHTMLAttributes, ReactNode } from 'react';
import type { SearchBarI18nStrings } from '../../utils/i18n/GeeklegoI18nProvider.types';

export type SearchBarVariant = 'default' | 'filled';
export type SearchBarSize = 'sm' | 'md' | 'lg';

export interface SearchBarProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'value' | 'defaultValue' | 'onChange' | 'onKeyDown' | 'type'
  > {
  /** Visual style of the input field. Defaults to 'default'. */
  variant?: SearchBarVariant;
  /** Height and typography scale. Defaults to 'md'. */
  size?: SearchBarSize;

  /** Controlled value. When provided, component is controlled. */
  value?: string;
  /** Initial value for the uncontrolled mode. */
  defaultValue?: string;
  /** Fires on every keystroke with the current string value. */
  onValueChange?: (value: string) => void;
  /** Fires when the user submits (Enter key or search button click). */
  onSearch?: (value: string) => void;
  /** Fires when the clear button is clicked. The value resets to ''. */
  onClear?: () => void;

  /**
   * Optional submit button rendered to the right of the input.
   * Pass a `<Button>` atom; SearchBar places it in a flex row with the field.
   */
  searchButton?: ReactNode;

  /** Disables the input and clear button. */
  disabled?: boolean;
  /** Shows a loading spinner in place of the clear button. aria-busy is set. */
  isLoading?: boolean;
  /** Applies error border styling and sets aria-invalid on the input. */
  error?: boolean;

  /**
   * Visible label rendered above the field.
   * Also used as `aria-label` on the `role="search"` landmark when no
   * visible label is shown. Always provide one for accessibility.
   * Defaults to the i18n 'searchLabel' string ("Search").
   */
  label?: string;
  /** Hides the visible label (sr-only). The label value still becomes the landmark aria-label. */
  labelHidden?: boolean;
  /** Error message displayed below the field. The input's aria-describedby points to this. */
  errorMessage?: string;

  /**
   * URL template for the JSON-LD SearchAction Schema.org block.
   * Required when schema={true}. E.g. 'https://example.com/search?q={search_term_string}'
   */
  searchUrl?: string;
  /**
   * When true and searchUrl is provided, injects a JSON-LD SearchAction
   * script into <head>. No DOM changes. Defaults to false.
   */
  schema?: boolean;

  /** Per-instance i18n string overrides. */
  i18nStrings?: SearchBarI18nStrings;
}
