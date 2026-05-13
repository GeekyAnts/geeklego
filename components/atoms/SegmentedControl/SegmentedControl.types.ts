import type { HTMLAttributes, ReactNode } from 'react';

/** A single option within a SegmentedControl. */
export interface SegmentOption {
  /** Unique value identifying this segment. */
  value: string;
  /** Visible text label. Optional when an icon provides the label. */
  label?: string;
  /** Icon node rendered before the label. Size icons via token at the call site. */
  icon?: ReactNode;
  /** Disables only this segment while others remain interactive. */
  disabled?: boolean;
  /** Required accessible name when the segment is icon-only (no visible label). */
  'aria-label'?: string;
}

export type SegmentedControlVariant = 'default' | 'outline';
export type SegmentedControlSize = 'sm' | 'md' | 'lg';

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Array of segment options to render. Minimum 2 options. */
  options: SegmentOption[];
  /** Controlled selected value. Pair with `onChange`. */
  value?: string;
  /** Initial selected value for uncontrolled usage. Defaults to the first option. */
  defaultValue?: string;
  /** Called when the selected segment changes. Receives the newly selected value. */
  onChange?: (value: string) => void;
  /** Visual style. `default` uses a surface-pop indicator; `outline` uses a brand fill. Defaults to 'default'. */
  variant?: SegmentedControlVariant;
  /** Height and typography size of each segment. Defaults to 'md'. */
  size?: SegmentedControlSize;
  /** Disables all segments in the group. Individual segments can also be disabled via the option object. */
  disabled?: boolean;
  /** Stretches the control to fill its container, distributing segment width equally. */
  fullWidth?: boolean;
  /** Required accessible label describing what the control selects (e.g. "View mode", "Time range"). */
  'aria-label': string;
}
