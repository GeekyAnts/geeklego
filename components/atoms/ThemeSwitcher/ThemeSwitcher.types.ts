import type { HTMLAttributes, ReactNode } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ThemeSwitcherSize = 'sm' | 'md' | 'lg';

export interface ThemeSwitcherOption {
  /** Theme value this option controls. */
  value: ThemeMode;
  /** Accessible label used as `aria-label` on the button. */
  label: string;
  /** Icon to render. Lucide elements are sized automatically. */
  icon: ReactNode;
}

export interface ThemeSwitcherProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Currently selected theme (controlled mode). */
  value?: ThemeMode;
  /** Default theme when uncontrolled. Defaults to `'system'`. */
  defaultValue?: ThemeMode;
  /** Called when the user selects a different theme. */
  onChange?: (value: ThemeMode) => void;
  /** Custom options list. Defaults to system · light · dark. */
  options?: ThemeSwitcherOption[];
  /** Size of each toggle button. Defaults to `'md'`. */
  size?: ThemeSwitcherSize;
}
