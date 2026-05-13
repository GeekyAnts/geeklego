"use client"
import { memo, useCallback, useMemo, type FormEvent } from 'react';
import type {
  FormProps,
  FormFieldProps,
  FormActionsProps,
  FormGap,
  FormActionsAlign,
  FormActionsGap,
} from './Form.types';
import { Label } from '../../atoms/Label/Label';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';

// ── Hoisted static strings — no prop deps ────────────────────────────────────

const gapClasses: Record<FormGap, string> = {
  sm: 'gap-[var(--form-gap-sm)]',
  md: 'gap-[var(--form-gap-md)]',
  lg: 'gap-[var(--form-gap-lg)]',
};

const actionsAlignClasses: Record<FormActionsAlign, string> = {
  start:   'justify-start',
  center:  'justify-center',
  end:     'justify-end',
  between: 'justify-between',
};

const actionsGapClasses: Record<FormActionsGap, string> = {
  sm: 'gap-[var(--form-actions-gap-sm)]',
  md: 'gap-[var(--form-actions-gap-md)]',
};

// ─────────────────────────────────────────────────────────────────────────────
// Form.Field — internal compound slot
//
// ID convention: if `htmlFor` is provided, hint and error elements get IDs
// `{htmlFor}-hint` and `{htmlFor}-error`. Pass these in `aria-describedby`
// on the associated control for full WCAG 1.3.1 compliance.
// ─────────────────────────────────────────────────────────────────────────────

const FormFieldInternal = memo<FormFieldProps>(
  ({
    label,
    htmlFor,
    hint,
    error,
    required = false,
    optional = false,
    disabled = false,
    labelPosition = 'top',
    i18nStrings,
    children,
    className,
  }) => {
    const isInline = labelPosition === 'left';

    // Deterministic IDs derived from htmlFor — consumers wire via aria-describedby
    const hintId  = htmlFor ? `${htmlFor}-hint`  : undefined;
    const errorId = htmlFor ? `${htmlFor}-error` : undefined;

    const wrapperClass = useMemo(
      () =>
        [
          isInline
            ? 'flex flex-col sm:flex-row sm:items-start gap-[var(--form-field-inline-gap)]'
            : 'flex flex-col',
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [isInline, className],
    );

    const labelClass = useMemo(
      () =>
        isInline
          ? 'shrink-0 sm:pt-[var(--form-field-label-pt-inline)]'
          : `mb-[var(--form-field-label-mb)]`,
      [isInline],
    );

    return (
      <div className={wrapperClass}>
        {/*
         * Label atom handles required asterisk + sr-only text and optional indicator.
         * hasError switches label text to error color.
         */}
        <Label
          htmlFor={htmlFor}
          required={required}
          optional={optional}
          disabled={disabled}
          hasError={!!error}
          i18nStrings={i18nStrings}
          className={labelClass}
        >
          {label}
        </Label>

        {/* Control column: control + hint + error ────────────────────────── */}
        <div className={isInline ? 'flex flex-col content-flex' : 'flex flex-col'}>
          {children}

          {/* Hint — visible only when no error is present */}
          {hint && !error && (
            <p
              id={hintId}
              className="text-body-sm text-[var(--form-hint-color)] mt-[var(--form-hint-mt)] m-0 clamp-description"
            >
              {hint}
            </p>
          )}

          {/* Error — role="alert" triggers immediate SR announcement on mount */}
          {error && (
            <p
              id={errorId}
              role="alert"
              className="text-body-sm text-[var(--form-error-color)] mt-[var(--form-error-mt)] m-0 truncate-label"
            >
              {error}
            </p>
          )}
        </div>
      </div>
    );
  },
);
FormFieldInternal.displayName = 'Form.Field';

// ─────────────────────────────────────────────────────────────────────────────
// Form.Actions — internal compound slot
// ─────────────────────────────────────────────────────────────────────────────

const FormActionsInternal = memo<FormActionsProps>(
  ({
    align = 'end',
    gap = 'md',
    separator = false,
    children,
    className,
  }) => {
    const classes = useMemo(
      () =>
        [
          'flex flex-wrap items-center',
          actionsAlignClasses[align],
          actionsGapClasses[gap],
          separator
            ? 'border-t border-[var(--form-actions-border)] pt-[var(--form-actions-pt)]'
            : 'pt-[var(--form-actions-pt)]',
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [align, gap, separator, className],
    );

    return <div className={classes}>{children}</div>;
  },
);
FormActionsInternal.displayName = 'Form.Actions';

// ─────────────────────────────────────────────────────────────────────────────
// Form (root) — <form> element
// ─────────────────────────────────────────────────────────────────────────────

const FormBase = memo<FormProps>(
  ({
    onSubmit,
    loading = false,
    gap = 'md',
    noValidate = true,
    className,
    i18nStrings,
    children,
    ...rest
  }) => {
    const i18n = useComponentI18n('form', i18nStrings);

    const handleSubmit = useCallback(
      (e: FormEvent<HTMLFormElement>) => {
        onSubmit?.(e);
      },
      [onSubmit],
    );

    const classes = useMemo(
      () =>
        [
          'flex flex-col w-full min-w-[var(--form-min-width)] perf-contain-content',
          gapClasses[gap],
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [gap, className],
    );

    return (
      <form
        onSubmit={handleSubmit}
        noValidate={noValidate}
        aria-label={i18n.label}
        {...(loading && { 'aria-busy': true })}
        className={classes}
        {...rest}
      >
        {children}
      </form>
    );
  },
);
FormBase.displayName = 'Form';

// ── Attach compound slots as static properties ───────────────────────────────

export const Form = Object.assign(FormBase, {
  Field:   FormFieldInternal,
  Actions: FormActionsInternal,
});

// Named exports for compound slots (enables tree-shaking and direct import)
export { FormFieldInternal as FormField, FormActionsInternal as FormActions };
