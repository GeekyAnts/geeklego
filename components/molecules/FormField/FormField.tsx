import { forwardRef, memo, useMemo } from 'react';
import type { FormFieldProps, FormFieldLabelPosition } from './FormField.types';
import { Label } from '../../atoms/Label/Label';

// ── Hoisted static strings ──────────────────────────────────────────────────

const stackedWrapperBase = 'flex flex-col';

const inlineWrapperBase =
  'flex flex-col sm:flex-row sm:items-start gap-[var(--formfield-inline-gap)]';

const labelInlineClass = 'shrink-0 sm:pt-[var(--formfield-label-pt-inline)]';

const controlColumnBase = 'flex flex-col';
const controlColumnInline = 'flex flex-col content-flex';

const hintClass =
  'text-body-sm text-[var(--formfield-hint-color)] mt-[var(--formfield-hint-mt)] m-0 clamp-description';

const errorClass =
  'text-body-sm text-[var(--formfield-error-color)] mt-[var(--formfield-error-mt)] m-0 truncate-label';

// ─────────────────────────────────────────────────────────────────────────────

export const FormField = memo(
  forwardRef<HTMLDivElement, FormFieldProps>(
    (
      {
        label,
        htmlFor,
        hint,
        error,
        required = false,
        optional = false,
        disabled = false,
        labelPosition = 'top',
        size = 'md',
        children,
        className,
        ...rest
      },
      ref,
    ) => {
      const isInline = labelPosition === 'left';

      // Deterministic IDs derived from htmlFor — consumers wire via aria-describedby
      const hintId = htmlFor ? `${htmlFor}-hint` : undefined;
      const errorId = htmlFor ? `${htmlFor}-error` : undefined;

      const wrapperClass = useMemo(
        () =>
          [isInline ? inlineWrapperBase : stackedWrapperBase, className]
            .filter(Boolean)
            .join(' '),
        [isInline, className],
      );

      const labelClass = useMemo(
        () => (isInline ? labelInlineClass : `mb-[var(--formfield-label-mb)]`),
        [isInline],
      );

      return (
        <div ref={ref} className={wrapperClass} {...rest}>
          <Label
            htmlFor={htmlFor}
            size={size}
            required={required}
            optional={optional}
            disabled={disabled}
            hasError={!!error}
            className={labelClass}
          >
            {label}
          </Label>

          <div className={isInline ? controlColumnInline : controlColumnBase}>
            {children}

            {/* Hint — visible only when no error is present */}
            {hint && !error && (
              <p id={hintId} className={hintClass}>
                {hint}
              </p>
            )}

            {/* Error — role="alert" triggers immediate SR announcement on mount */}
            {error && (
              <p id={errorId} role="alert" className={errorClass}>
                {error}
              </p>
            )}
          </div>
        </div>
      );
    },
  ),
);
FormField.displayName = 'FormField';
