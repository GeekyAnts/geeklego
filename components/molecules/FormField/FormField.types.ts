import type { HTMLAttributes, ReactNode } from 'react';
import type { LabelSize } from '../../atoms/Label/Label.types';
import type { LabelI18nStrings } from '../../utils/i18n/GeeklegoI18nProvider.types';

export type FormFieldLabelPosition = 'top' | 'left';

export interface FormFieldI18nStrings extends LabelI18nStrings {
  // Extends Label i18n for required/optional, can add FormField-specific strings here
}

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Human-readable label for the field. Rendered as a `<label>` via the Label atom.
   * Required for WCAG 1.3.1 — every form control must have a programmatic label.
   */
  label: string;
  /**
   * The `id` of the associated form control. Creates an explicit label–control
   * association via `htmlFor`. Also drives deterministic hint/error element IDs:
   * `{htmlFor}-hint` and `{htmlFor}-error`.
   * Pass these IDs in `aria-describedby` on the control for full WCAG 1.3.1 compliance.
   */
  htmlFor?: string;
  /** Helper text displayed below the control. Hidden when `error` is present. */
  hint?: string;
  /**
   * Validation error message. Rendered with `role="alert"` for immediate
   * screen-reader announcement when it first appears.
   */
  error?: string;
  /**
   * Marks the field as required. Shows a red asterisk (decorative, `aria-hidden`)
   * and sr-only `(required)` text via the Label atom.
   * Mirror this on the control: `required` + `aria-required="true"`.
   */
  required?: boolean;
  /** Shows `(Optional)` in secondary color via the Label atom. */
  optional?: boolean;
  /**
   * Applies disabled text color to the label. Mirror the associated control's
   * disabled state — does not propagate to children natively.
   */
  disabled?: boolean;
  /**
   * Label placement relative to the form control.
   * `'top'` (default) — stacked layout: label sits above the control.
   * `'left'` — inline layout: label beside the control (responsive: stacks on mobile).
   */
  labelPosition?: FormFieldLabelPosition;
  /**
   * Label typography scale. Passed through to the Label atom.
   * `'md'` (default) — 14px medium. `'sm'` — 12px medium (compact forms).
   */
  size?: LabelSize;
  /** The form control (Input, Select, Textarea, Checkbox, etc.). */
  children: ReactNode;
  /** Optional i18n strings for required/optional labels. */
  i18nStrings?: FormFieldI18nStrings;
}
