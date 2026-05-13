"use client"
import { forwardRef, memo, useMemo } from 'react';
import type { LabelProps, LabelSize } from './Label.types';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';

// Hoisted to module scope — static, no prop deps
const sizeClasses: Record<LabelSize, string> = {
  md: 'text-label-md',
  sm: 'text-label-sm',
};

const baseLabelClass =
  'inline-flex items-center gap-[var(--label-gap)] max-w-[var(--label-max-width)]';

export const Label = memo(forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      htmlFor,
      size = 'md',
      required = false,
      optional = false,
      disabled = false,
      hasError = false,
      children,
      className,
      i18nStrings,
      ...rest
    },
    ref,
  ) => {
    const i18n = useComponentI18n('label', i18nStrings);

    // Color state: disabled wins over hasError wins over default
    const colorClass = useMemo(() => {
      if (disabled) return 'text-[var(--label-text-disabled)]';
      if (hasError) return 'text-[var(--label-text-error)]';
      return 'text-[var(--label-text)]';
    }, [disabled, hasError]);

    const classes = useMemo(
      () =>
        [baseLabelClass, sizeClasses[size], colorClass, className]
          .filter(Boolean)
          .join(' '),
      [size, colorClass, className],
    );

    return (
      <label ref={ref} htmlFor={htmlFor} className={classes} {...rest}>
        {/* Label text — single-line truncation with ellipsis */}
        <span className="truncate-label">{children}</span>

        {/* Required indicator — asterisk is decorative; sr-only span is the accessible cue */}
        {required && (
          <>
            <span
              className="text-[var(--label-required-color)] shrink-0"
              aria-hidden="true"
            >
              *
            </span>
            <span className="sr-only">{i18n.required}</span>
          </>
        )}

        {/* Optional indicator — inline text readable directly by screen readers */}
        {optional && (
          <span className="text-[var(--label-optional-color)] shrink-0">
            {i18n.optional}
          </span>
        )}
      </label>
    );
  },
));
Label.displayName = 'Label';
