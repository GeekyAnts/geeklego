import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ToggleVariant = 'default' | 'outline' | 'ghost';
export type ToggleSize = 'sm' | 'md' | 'lg';

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /**
   * Whether the toggle is pressed (active). Use for controlled mode.
   * Leave undefined for uncontrolled — use `defaultPressed` instead.
   */
  pressed?: boolean;
  /** Initial pressed state in uncontrolled mode. Defaults to `false`. */
  defaultPressed?: boolean;
  /** Called when the pressed state changes, with the new boolean value. */
  onPressedChange?: (pressed: boolean) => void;
  /**
   * Visual treatment strategy. Defaults to `'default'`.
   * - `default`  — muted fill at rest, brand-tinted fill when pressed.
   * - `outline`  — border always visible; fill + brand colour appear on press.
   * - `ghost`    — invisible at rest; fill only appears on hover or when pressed.
   */
  variant?: ToggleVariant;
  /** Height and typography size. Defaults to `'md'`. */
  size?: ToggleSize;
  /** Disables interaction and visual response. */
  disabled?: boolean;
  /**
   * Button content — text, icon, or both.
   * Icon-only usage requires `aria-label` for an accessible name.
   */
  children?: ReactNode;
}
