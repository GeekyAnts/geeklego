import type { ButtonHTMLAttributes } from 'react';

export type ColorSwatchSize = 'sm' | 'md' | 'lg';
export type ColorSwatchShape = 'square' | 'circle';

export interface ColorSwatchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /**
   * CSS color value to display (hex, rgb, hsl, named color).
   * Applied as background via CSS custom property injection.
   */
  color: string;
  /** Whether this swatch is currently selected (shows a persistent ring). Defaults to false. */
  selected?: boolean;
  /** Visual size of the swatch button. Defaults to 'md'. */
  size?: ColorSwatchSize;
  /** Shape of the swatch. Defaults to 'square'. */
  shape?: ColorSwatchShape;
  /**
   * Accessible label for this color (e.g. "Red — #ff0000", "Sky blue").
   * Required: screen readers announce this when the swatch is focused.
   */
  'aria-label': string;
}
