"use client"
import { forwardRef, memo, useId, useMemo, useCallback } from 'react';
import type { RadioGroupProps, RadioGroupVariant, RadioGroupOrientation } from './RadioGroup.types';
import type { RadioSize } from '../../atoms/Radio/Radio.types';
import { Radio } from '../../atoms/Radio/Radio';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';

// ── Gap map — controls spacing between options ────────────────────────────────
const gapClasses: Record<RadioSize, string> = {
  sm: 'gap-[var(--radiogroup-gap-sm)]',
  md: 'gap-[var(--radiogroup-gap-md)]',
  lg: 'gap-[var(--radiogroup-gap-lg)]',
};

// ── Variant classes — boxed draws a container; default is invisible wrapper ──
const variantNormalClasses: Record<RadioGroupVariant, string> = {
  default: 'border-0 p-0',
  boxed:   [
    '[border-width:var(--radiogroup-border-width)] border-solid',
    'border-[var(--radiogroup-border)]',
    'rounded-[var(--radiogroup-radius)] p-[var(--radiogroup-padding)]',
  ].join(' '),
};

const variantErrorClasses: Record<RadioGroupVariant, string> = {
  default: 'border-0 p-0',
  boxed:   [
    '[border-width:var(--radiogroup-border-width)] border-solid',
    'border-[var(--radiogroup-border-error)]',
    'rounded-[var(--radiogroup-radius)] p-[var(--radiogroup-padding)]',
  ].join(' '),
};

// ── Orientation ───────────────────────────────────────────────────────────────
const orientationClasses: Record<RadioGroupOrientation, string> = {
  vertical:   'flex-col',
  horizontal: 'flex-row flex-wrap',
};

export const RadioGroup = memo(
  forwardRef<HTMLFieldSetElement, RadioGroupProps>(
    (
      {
        options,
        value,
        defaultValue,
        onChange,
        name: nameProp,
        orientation = 'vertical',
        size = 'md',
        variant = 'default',
        error = false,
        disabled = false,
        required = false,
        legend,
        hint,
        errorMessage,
        className,
        i18nStrings,
        ...rest
      },
      ref,
    ) => {
      const i18n = useComponentI18n('radioGroup', i18nStrings);
      const generatedName = useId();
      const name = nameProp ?? generatedName;
      const hintId = useId();
      const errorId = useId();

      const hasHint = Boolean(hint);
      const hasError = Boolean(error && errorMessage);

      const fieldsetClasses = useMemo(
        () =>
          [
            'min-w-0 m-0',
            error ? variantErrorClasses[variant] : variantNormalClasses[variant],
            disabled ? 'opacity-60' : '',
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [error, variant, disabled, className],
      );

      const optionsWrapperClasses = useMemo(
        () =>
          [
            'flex',
            orientationClasses[orientation],
            gapClasses[size],
            'mt-[var(--radiogroup-legend-mb)]',
          ].join(' '),
        [orientation, size],
      );

      const handleChange = useCallback(
        (optionValue: string) => {
          onChange?.(optionValue);
        },
        [onChange],
      );

      const describedBy = [hasHint && !hasError && hintId, hasError && errorId]
        .filter(Boolean)
        .join(' ') || undefined;

      return (
        <fieldset
          ref={ref}
          disabled={disabled}
          aria-required={required || undefined}
          aria-describedby={describedBy}
          className={fieldsetClasses}
          {...rest}
        >
          {legend != null && (
            <legend className="float-none w-full text-body-md font-medium text-[var(--radiogroup-legend-text)] transition-default">
              <span className="inline-flex items-center gap-[var(--radiogroup-legend-gap)]">
                <span className="truncate-label">
                  {legend}
                </span>
                {required && (
                  <span
                    className="text-[var(--radiogroup-required-color)]"
                    aria-hidden="true"
                  >
                    *
                  </span>
                )}
              </span>
              {required && <span className="sr-only">{i18n.required}</span>}
            </legend>
          )}

          <div className={optionsWrapperClasses}>
            {options.map((option) => (
              <Radio
                key={option.value}
                name={name}
                value={option.value}
                checked={value !== undefined ? value === option.value : undefined}
                defaultChecked={
                  value === undefined && defaultValue !== undefined
                    ? defaultValue === option.value
                    : undefined
                }
                size={size}
                error={error}
                disabled={disabled || option.disabled}
                onChange={onChange ? () => handleChange(option.value) : undefined}
              >
                {option.label}
              </Radio>
            ))}
          </div>

          {hasHint && !hasError && (
            <p
              id={hintId}
              className="mt-[var(--radiogroup-hint-mt)] text-body-sm text-[var(--radiogroup-hint-color)] clamp-description"
            >
              {hint}
            </p>
          )}

          {hasError && (
            <p
              id={errorId}
              role="alert"
              className="mt-[var(--radiogroup-error-mt)] text-body-sm text-[var(--radiogroup-error-color)] clamp-description"
            >
              {errorMessage}
            </p>
          )}
        </fieldset>
      );
    },
  ),
);
RadioGroup.displayName = 'RadioGroup';
