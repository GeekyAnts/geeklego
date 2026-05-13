import type { InputHTMLAttributes, ReactNode } from 'react';

export type RadioSize = 'sm' | 'md' | 'lg';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Visual size of the indicator circle. Defaults to 'md'. */
  size?: RadioSize;
  /** Marks the field as invalid — shifts border to error colour. */
  error?: boolean;
  /** Label text or elements rendered alongside the indicator. Without children, supply aria-label. */
  children?: ReactNode;
}
