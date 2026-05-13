import type { TextareaHTMLAttributes } from 'react';

export type TextareaVariant = 'default' | 'filled' | 'flushed' | 'unstyled';
export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Visual style variant. Defaults to 'default'. */
  variant?: TextareaVariant;
  /** Padding and typography scale. Defaults to 'md'. */
  size?: TextareaSize;
  /** Resize handle behaviour. Defaults to 'vertical'. */
  resize?: TextareaResize;
  /** Error state — shows error border and sets aria-invalid. */
  error?: boolean;
  /** Loading state — shows spinner and disables interaction. */
  isLoading?: boolean;
  /** Number of visible text rows. Defaults to 4. */
  rows?: number;
  /** Additional class names applied to the outer wrapper element. */
  wrapperClassName?: string;
}
