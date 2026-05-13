import type { HTMLAttributes } from 'react';

// ── Sub-types ──────────────────────────────────────────────────────────────────

/** Per-step error override. Other states are auto-computed from position. */
export type StepStatus = 'error';

/** Visual style for the step indicator. */
export type StepperVariant = 'numbered' | 'dotted';

/** Overall component size — controls circle dimensions and typography. */
export type StepperSize = 'sm' | 'md' | 'lg';

/** Step flow direction. */
export type StepperOrientation = 'horizontal' | 'vertical';

// ── Step item ─────────────────────────────────────────────────────────────────

export interface StepItem {
  /** Unique stable identifier. Used as the React key. */
  id: string;
  /** Step label shown below (horizontal) or beside (vertical) the indicator. */
  label: string;
  /** Optional supporting description rendered under the label. */
  description?: string;
  /**
   * Per-step status override.
   * `'error'` marks this step as errored regardless of its position relative to `activeStep`.
   * Other states (active, completed, upcoming) are auto-computed from `activeStep`.
   */
  status?: StepStatus;
}

// ── i18n ──────────────────────────────────────────────────────────────────────

export interface StepperI18nStrings {
  /** `aria-label` for the `<ol>` step list. Default: "Steps" */
  listLabel?: string;
  /** SR-only suffix appended to completed step indicators. Default: "(Completed)" */
  completedLabel?: string;
  /** SR-only suffix appended to error step indicators. Default: "(Error)" */
  errorLabel?: string;
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface StepperProps extends Omit<HTMLAttributes<HTMLOListElement>, 'onChange'> {
  /** Ordered array of step data. Must contain at least one entry. */
  steps: StepItem[];
  /**
   * 0-based index of the currently active step.
   * Steps with `index < activeStep` are rendered as completed.
   * Defaults to `0`.
   */
  activeStep?: number;
  /**
   * Visual treatment for the indicator circle.
   * - `numbered` — shows the step number, a check icon (completed), or an alert icon (error).
   * - `dotted` — minimal solid dot; no numbers or icons.
   * Defaults to `'numbered'`.
   */
  variant?: StepperVariant;
  /** Layout direction. Defaults to `'horizontal'`. */
  orientation?: StepperOrientation;
  /** Indicator size and label typography size. Defaults to `'md'`. */
  size?: StepperSize;
  /**
   * When provided, completed and active steps become clickable `<button>` elements.
   * Receives the 0-based index of the clicked step.
   * Upcoming steps are never clickable even when this prop is set.
   */
  onStepClick?: (index: number) => void;
  /** Per-instance i18n string overrides. */
  i18nStrings?: StepperI18nStrings;
}
