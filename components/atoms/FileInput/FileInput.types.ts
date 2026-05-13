import type { InputHTMLAttributes } from 'react';
import type { FileInputI18nStrings } from '../../utils/i18n';

export type FileInputVariant = 'default' | 'filled' | 'ghost';
export type FileInputSize = 'sm' | 'md' | 'lg';

export interface FileInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Visual style variant. Defaults to 'default'. */
  variant?: FileInputVariant;
  /** Height and typography scale. Defaults to 'md'. */
  size?: FileInputSize;
  /** Error state — shows error border and sets aria-invalid. */
  error?: boolean;
  /** Loading state — shows spinner in browse area and disables interaction. */
  isLoading?: boolean;
  /** i18n string overrides for placeholder, browse label, and multi-file label. */
  i18nStrings?: FileInputI18nStrings;
  /** Additional class names applied to the outer wrapper element. */
  wrapperClassName?: string;
}
