import type { FormHTMLAttributes, FormEvent, ReactNode } from 'react';
import type { FormFieldI18nStrings } from '../../utils/i18n';

export type FormGap = 'sm' | 'md' | 'lg';
export type FormLabelPosition = 'top' | 'left';
export type FormActionsAlign = 'start' | 'center' | 'end' | 'between';
export type FormActionsGap = 'sm' | 'md';

// ── i18n ─────────────────────────────────────────────────────────────────────

export interface FormI18nStrings {
  /** Accessible label for the form. Default: "Form" */
  label?: string;
}

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /**
   * Called when the form is submitted. Receives the native `FormEvent`.
   * Call `e.preventDefault()` to take control of submission.
   */
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  /**
   * Signals an async submission is in progress. Sets `aria-busy="true"` on the
   * `<form>` element so assistive technologies announce the busy state.
   * Consumer is responsible for disabling controls during loading
   * (e.g. wrap fields in `<Fieldset disabled={loading}>`).
   */
  loading?: boolean;
  /** Vertical spacing between fields and the actions row. Defaults to `'md'`. */
  gap?: FormGap;
  /**
   * Disables the browser's built-in constraint validation UI. Set to `false`
   * only if relying entirely on browser-native validation. Defaults to `true`.
   */
  noValidate?: boolean;
  /** i18n strings for localization */
  i18nStrings?: FormI18nStrings;
  children: ReactNode;
}

export interface FormFieldProps {
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
   * disabled state — does not propagate to children natively (use `<Fieldset disabled>`
   * for group-level disabling).
   */
  disabled?: boolean;
  /**
   * Label placement relative to the form control.
   * `'top'` (default) — stacked layout: label sits above the control.
   * `'left'` — inline layout: label beside the control (responsive: stacks on mobile).
   */
  labelPosition?: FormLabelPosition;
  /** Per-instance i18n string overrides for the Label (supports required/optional indicators). */
  i18nStrings?: FormFieldI18nStrings;
  /** The form control (Input, Select, Textarea, Checkbox, etc.). */
  children: ReactNode;
  /** Additional class names applied to the outermost field wrapper. */
  className?: string;
}

export interface FormActionsProps {
  /**
   * Horizontal alignment of action buttons within the row.
   * Defaults to `'end'` (right-aligned) — the conventional placement for primary actions.
   */
  align?: FormActionsAlign;
  /** Horizontal gap between buttons. Defaults to `'md'`. */
  gap?: FormActionsGap;
  /**
   * Renders a top border above the actions row. Use when the form is long and
   * a visual separator helps indicate the end of fields.
   */
  separator?: boolean;
  /** Action buttons (Button atoms, icon buttons, etc.). */
  children: ReactNode;
  /** Additional class names applied to the actions wrapper. */
  className?: string;
}
