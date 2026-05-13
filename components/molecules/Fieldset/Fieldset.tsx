"use client"
import { forwardRef, memo, useId, useMemo } from 'react';
import type { FieldsetProps, FieldsetVariant, FieldsetLayout, FieldsetGap } from './Fieldset.types';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';

// ── Hoisted static classes — no prop deps ────────────────────────────────────
// Fieldset browsers defaults (border, padding, min-width) are reset per variant.
const baseFieldsetClass = 'min-w-0 m-0';

// Structural classes for each variant (no color — color computed per render)
const variantBaseClasses: Record<FieldsetVariant, string> = {
  default: 'border-0 p-0',
  boxed:
    '[border-width:var(--fieldset-border-width)] border-solid rounded-[var(--fieldset-radius)] p-[var(--fieldset-padding)]',
};

const layoutClasses: Record<FieldsetLayout, string> = {
  column: 'flex flex-col',
  row: 'flex flex-row flex-wrap',
};

const gapClasses: Record<FieldsetGap, string> = {
  sm: 'gap-[var(--fieldset-children-gap-sm)]',
  md: 'gap-[var(--fieldset-children-gap-md)]',
  lg: 'gap-[var(--fieldset-children-gap-lg)]',
};

// ─────────────────────────────────────────────────────────────────────────────

export const Fieldset = memo(forwardRef<HTMLFieldSetElement, FieldsetProps>(
  (
    {
      legend,
      variant = 'default',
      layout = 'column',
      gap = 'md',
      hint,
      error,
      required = false,
      disabled = false,
      children,
      className,
      i18nStrings,
      ...rest
    },
    ref,
  ) => {
    const i18n = useComponentI18n('fieldset', i18nStrings);

    // Unique IDs for hint and error — wired to aria-describedby on the fieldset
    const hintId = useId();
    const errorId = useId();

    // aria-describedby — only include IDs for present descriptions
    const describedBy = useMemo(() => {
      const ids: string[] = [];
      if (hint) ids.push(hintId);
      if (error) ids.push(errorId);
      return ids.length > 0 ? ids.join(' ') : undefined;
    }, [hint, error, hintId, errorId]);

    // Border color for boxed variant: error state overrides default
    const borderColorClass = useMemo(() => {
      if (variant !== 'boxed') return '';
      return error
        ? 'border-[var(--fieldset-border-color-error)]'
        : 'border-[var(--fieldset-border-color)]';
    }, [variant, error]);

    const fieldsetClasses = useMemo(
      () =>
        [
          baseFieldsetClass,
          variantBaseClasses[variant],
          borderColorClass,
          className,
        ]
          .filter(Boolean)
          .join(' '),
      [variant, borderColorClass, className],
    );

    const legendColorClass = useMemo(
      () =>
        disabled
          ? 'text-[var(--fieldset-legend-text-disabled)]'
          : 'text-[var(--fieldset-legend-text)]',
      [disabled],
    );

    const childrenClasses = useMemo(
      () => [layoutClasses[layout], gapClasses[gap]].join(' '),
      [layout, gap],
    );

    return (
      <fieldset
        ref={ref}
        disabled={disabled}
        aria-describedby={describedBy}
        className={fieldsetClasses}
        {...rest}
      >
        {/*
         * <legend> — WCAG 1.3.1 group accessible name.
         * The inner <span> creates a flex row for the text + required indicator;
         * flex on <legend> itself has inconsistent cross-browser behaviour.
         */}
        <legend
          className={`text-label-md mb-[var(--fieldset-legend-mb)] ${legendColorClass}`}
        >
          <span className="inline-flex items-center gap-[var(--fieldset-legend-gap)]">
            <span className="truncate-label">{legend}</span>
            {required && (
              <>
                {/* Asterisk is decorative — screen reader cue is in the sr-only span */}
                <span
                  className="text-[var(--fieldset-required-color)] shrink-0"
                  aria-hidden="true"
                >
                  *
                </span>
                <span className="sr-only">{i18n.required}</span>
              </>
            )}
          </span>
        </legend>

        {/* Hint — descriptive text beneath legend, before controls */}
        {hint && (
          <p
            id={hintId}
            className="text-body-sm text-[var(--fieldset-hint-text)] m-0 mb-[var(--fieldset-hint-mb)] clamp-description"
          >
            {hint}
          </p>
        )}

        {/* Children — consumer-provided form controls */}
        <div className={childrenClasses}>{children}</div>

        {/* Group-level error — role="alert" triggers immediate SR announcement */}
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-body-sm text-[var(--fieldset-error-text)] m-0 mt-[var(--fieldset-error-mt)] clamp-description"
          >
            {error}
          </p>
        )}
      </fieldset>
    );
  },
));
Fieldset.displayName = 'Fieldset';
