import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import type { ChipI18nStrings } from '../../utils/i18n/GeeklegoI18nProvider.types';

export type ChipVariant = 'solid' | 'soft' | 'outline' | 'ghost';
export type ChipSize = 'sm' | 'md' | 'lg';

export type { ChipI18nStrings };

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual treatment. Defaults to 'solid'. */
  variant?: ChipVariant;
  /** Height and typography scale. Defaults to 'md'. */
  size?: ChipSize;
  /**
   * When true (default), renders as `<button aria-pressed>` — the whole chip
   * is an interactive toggle. When false, renders as `<span>` (display chip).
   * Use false for removable tag chips; true for filter/action chips.
   */
  interactive?: boolean;
  /**
   * Toggled/selected state — communicates via `aria-pressed` when `interactive=true`.
   * Pass undefined (default) for pure action chips that are not toggles.
   */
  selected?: boolean;
  /** Optional leading icon node. Use a lucide-react icon at `var(--size-icon-sm)`. */
  leftIcon?: ReactNode;
  /**
   * Callback fired when the remove × button is clicked.
   * Only works when `interactive=false` — nesting `<button>` inside `<button>` is invalid HTML.
   * When provided, a remove button appears inside the chip.
   */
  onRemove?: (e: MouseEvent<HTMLButtonElement>) => void;
  /** Internationalisation strings for system-generated text (e.g. remove button aria-label). */
  i18nStrings?: ChipI18nStrings;
  /** Chip label text or content. */
  children: ReactNode;
}
