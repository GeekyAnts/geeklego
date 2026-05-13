"use client"
import { forwardRef, memo, useId, useMemo } from 'react';
import { Input } from '../../atoms/Input/Input';
import { Label } from '../../atoms/Label/Label';
import type { DateInputProps } from './DateInput.types';

// Static class strings — hoisted to avoid re-creation per render
const HINT_CLASSES =
  'text-body-sm text-[var(--date-input-hint-text)] clamp-description';

const ERROR_CLASSES =
  'text-body-sm text-[var(--date-input-error-text)] clamp-description';

export const DateInput = memo(
  forwardRef<HTMLInputElement, DateInputProps>(
    (
      {
        label,
        hint,
        errorMessage,
        size = 'md',
        variant = 'default',
        isLoading = false,
        disabled,
        required,
        id: idProp,
        className,
        wrapperClassName,
        ...rest
      },
      ref,
    ) => {
      const generatedId = useId();
      const fieldId = idProp ?? generatedId;
      const hintId = `${fieldId}-hint`;
      const errorId = `${fieldId}-error`;
      const hasError = Boolean(errorMessage);
      const isDisabled = disabled || isLoading;

      // aria-describedby: include hint when no error, include error when present
      const describedBy = useMemo(() => {
        const ids: string[] = [];
        if (hint && !hasError) ids.push(hintId);
        if (hasError) ids.push(errorId);
        return ids.length > 0 ? ids.join(' ') : undefined;
      }, [hint, hasError, hintId, errorId]);

      const wrapperClasses = useMemo(
        () =>
          [
            'flex flex-col gap-[var(--date-input-gap)] w-full',
            wrapperClassName,
          ]
            .filter(Boolean)
            .join(' '),
        [wrapperClassName],
      );

      return (
        <div className={wrapperClasses}>
          {/* Label — linked via htmlFor; mirrors disabled/error state */}
          <Label
            htmlFor={fieldId}
            required={required}
            disabled={isDisabled}
            hasError={hasError}
            size={size === 'sm' ? 'sm' : 'md'}
          >
            {label}
          </Label>

          {/* Native date input via Input atom — type locked to "date" */}
          <Input
            ref={ref}
            type="date"
            id={fieldId}
            size={size}
            variant={variant}
            error={hasError}
            isLoading={isLoading}
            disabled={disabled}
            required={required}
            aria-describedby={describedBy}
            className={className}
            {...rest}
          />

          {/* Hint text — visible only when no error is present */}
          {hint && !hasError && (
            <p id={hintId} className={HINT_CLASSES}>
              {hint}
            </p>
          )}

          {/* Error message — role="alert" announces it immediately on mount */}
          {hasError && (
            <p id={errorId} role="alert" className={ERROR_CLASSES}>
              {errorMessage}
            </p>
          )}
        </div>
      );
    },
  ),
);
DateInput.displayName = 'DateInput';
