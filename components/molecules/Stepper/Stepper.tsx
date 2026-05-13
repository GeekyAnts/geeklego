"use client"
import { forwardRef, memo, useMemo } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { VisuallyHidden } from '../../atoms/VisuallyHidden/VisuallyHidden';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type {
  StepperProps,
  StepperSize,
  StepItem,
} from './Stepper.types';

// ── Internal step state ────────────────────────────────────────────────────────
// Not exported — consumers control state via `activeStep` + `StepItem.status`.
type StepState = 'upcoming' | 'active' | 'completed' | 'error';

// ── Static lookup tables (module scope — never recreated per render) ───────────

const CIRCLE_SIZE: Record<StepperSize, string> = {
  sm: 'w-[var(--stepper-circle-size-sm)] h-[var(--stepper-circle-size-sm)]',
  md: 'w-[var(--stepper-circle-size-md)] h-[var(--stepper-circle-size-md)]',
  lg: 'w-[var(--stepper-circle-size-lg)] h-[var(--stepper-circle-size-lg)]',
};

const DOT_SIZE: Record<StepperSize, string> = {
  sm: 'w-[var(--stepper-dot-size-sm)] h-[var(--stepper-dot-size-sm)]',
  md: 'w-[var(--stepper-dot-size-md)] h-[var(--stepper-dot-size-md)]',
  lg: 'w-[var(--stepper-dot-size-lg)] h-[var(--stepper-dot-size-lg)]',
};

const NUMBER_TEXT: Record<StepperSize, string> = {
  sm: 'text-button-xs',
  md: 'text-button-sm',
  lg: 'text-button-md',
};

const LABEL_TEXT: Record<StepperSize, string> = {
  sm: 'text-label-xs',
  md: 'text-label-sm',
  lg: 'text-label-md',
};

const DESC_TEXT: Record<StepperSize, string> = {
  sm: 'text-body-xs',
  md: 'text-body-xs',
  lg: 'text-body-sm',
};

const ICON_SIZE: Record<StepperSize, string> = {
  sm: 'var(--size-icon-xs)',
  md: 'var(--size-icon-sm)',
  lg: 'var(--size-icon-md)',
};

const CONTENT_GAP: Record<StepperSize, string> = {
  sm: 'gap-[var(--stepper-content-gap-sm)]',
  md: 'gap-[var(--stepper-content-gap-md)]',
  lg: 'gap-[var(--stepper-content-gap-lg)]',
};

const CIRCLE_STATE_CLASSES: Record<StepState, string> = {
  upcoming:
    'bg-[var(--stepper-circle-bg)] border-[var(--stepper-circle-border)] text-[var(--stepper-circle-text)]',
  active:
    'bg-[var(--stepper-circle-active-bg)] border-[var(--stepper-circle-active-border)] text-[var(--stepper-circle-active-text)] shadow-[var(--stepper-circle-active-shadow,none)]',
  completed:
    'bg-[var(--stepper-circle-completed-bg)] border-[var(--stepper-circle-completed-border)] text-[var(--stepper-circle-completed-text)] shadow-[var(--stepper-circle-completed-shadow,none)]',
  error:
    'bg-[var(--stepper-circle-error-bg)] border-[var(--stepper-circle-error-border)] text-[var(--stepper-circle-error-text)]',
};

const LABEL_COLOR: Record<StepState, string> = {
  upcoming:  'text-[var(--stepper-label-color)]',
  active:    'text-[var(--stepper-label-color-active)]',
  completed: 'text-[var(--stepper-label-color-completed)]',
  error:     'text-[var(--stepper-label-color-error)]',
};

const DESC_COLOR: Record<StepState, string> = {
  upcoming:  'text-[var(--stepper-description-color)]',
  active:    'text-[var(--stepper-description-color)]',
  completed: 'text-[var(--stepper-description-color)]',
  error:     'text-[var(--stepper-description-color-error)]',
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function resolveState(index: number, activeStep: number, item: StepItem): StepState {
  if (item.status === 'error') return 'error';
  if (index < activeStep) return 'completed';
  if (index === activeStep) return 'active';
  return 'upcoming';
}

// ── Component ──────────────────────────────────────────────────────────────────

export const Stepper = memo(
  forwardRef<HTMLOListElement, StepperProps>(
    (
      {
        steps,
        activeStep = 0,
        variant = 'numbered',
        orientation = 'horizontal',
        size = 'md',
        onStepClick,
        i18nStrings,
        className,
        ...rest
      },
      ref,
    ) => {
      const i18n = useComponentI18n('stepper', i18nStrings);
      const isHorizontal = orientation === 'horizontal';
      const isDotted = variant === 'dotted';

      const listClasses = useMemo(
        () =>
          [
            isHorizontal ? 'flex w-full' : 'flex flex-col',
            'p-0 m-0 list-none',
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [isHorizontal, className],
      );

      return (
        <ol ref={ref} aria-label={i18n.listLabel} className={listClasses} {...rest}>
          {steps.map((step, index) => {
            const state = resolveState(index, activeStep, step);
            const isFirst = index === 0;
            const isLast = index === steps.length - 1;
            const isClickable =
              !!onStepClick && (state === 'completed' || state === 'active');

            // Connector completion state:
            // left connector is "completed" when current step has been reached or passed
            const leftConnCompleted = !isFirst && index <= activeStep;
            // right connector is "completed" when the current step is already done (not just active)
            const rightConnCompleted = !isLast && index < activeStep;

            const iconSz = ICON_SIZE[size];

            // Circle content
            const circleInner = isDotted ? null : state === 'completed' ? (
              <Check size={iconSz} aria-hidden="true" />
            ) : state === 'error' ? (
              <AlertCircle size={iconSz} aria-hidden="true" />
            ) : (
              <span aria-hidden="true" className={NUMBER_TEXT[size]}>
                {index + 1}
              </span>
            );

            // SR-only state suffix
            const srSuffix =
              state === 'completed'
                ? i18n.completedLabel
                : state === 'error'
                  ? i18n.errorLabel
                  : null;

            const circleDims = isDotted ? DOT_SIZE[size] : CIRCLE_SIZE[size];

            // Indicator classes shared between <button> and <span>
            const indicatorBase = [
              'inline-flex items-center justify-center shrink-0 border transition-default',
              'rounded-[var(--stepper-circle-radius)]',
              circleDims,
              CIRCLE_STATE_CLASSES[state],
              'focus-visible:outline-none focus-visible:focus-ring',
              isClickable
                ? 'cursor-pointer hover:opacity-85 hover:scale-105 active:scale-95 active:opacity-70 perf-will-change-transform'
                : 'cursor-default',
              // dotted clickable → touch target expansion
              isDotted && isClickable ? 'touch-target' : '',
            ]
              .filter(Boolean)
              .join(' ');

            const indicator = isClickable ? (
              <button
                type="button"
                className={indicatorBase}
                onClick={() => onStepClick!(index)}
                aria-current={state === 'active' ? 'step' : undefined}
              >
                {circleInner}
                {srSuffix && <VisuallyHidden>{srSuffix}</VisuallyHidden>}
              </button>
            ) : (
              <span
                className={indicatorBase}
                aria-current={state === 'active' && !isClickable ? 'step' : undefined}
              >
                {circleInner}
                {srSuffix && <VisuallyHidden>{srSuffix}</VisuallyHidden>}
              </span>
            );

            // ── Horizontal layout ────────────────────────────────────────
            if (isHorizontal) {
              return (
                <li
                  key={step.id}
                  className={[
                    'flex-1 flex flex-col items-center perf-contain-content',
                    CONTENT_GAP[size],
                  ].join(' ')}
                  aria-current={!isClickable && state === 'active' ? undefined : undefined}
                >
                  {/* Row: left-connector · circle · right-connector */}
                  <div className="flex items-center w-full">
                    <div
                      aria-hidden="true"
                      className={[
                        'flex-1 transition-default',
                        `h-[var(--stepper-connector-thickness)]`,
                        isFirst ? 'invisible' : '',
                        leftConnCompleted
                          ? 'bg-[var(--stepper-connector-color-completed)]'
                          : 'bg-[var(--stepper-connector-color)]',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    />
                    {indicator}
                    <div
                      aria-hidden="true"
                      className={[
                        'flex-1 transition-default',
                        `h-[var(--stepper-connector-thickness)]`,
                        isLast ? 'invisible' : '',
                        rightConnCompleted
                          ? 'bg-[var(--stepper-connector-color-completed)]'
                          : 'bg-[var(--stepper-connector-color)]',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    />
                  </div>
                  {/* Label + description */}
                  <div className="flex flex-col items-center gap-[var(--stepper-content-gap-sm)]">
                    <span
                      className={[
                        'truncate-label text-center',
                        LABEL_TEXT[size],
                        LABEL_COLOR[state],
                      ].join(' ')}
                    >
                      {step.label}
                    </span>
                    {step.description && (
                      <p
                        className={[
                          'clamp-description text-center m-0',
                          DESC_TEXT[size],
                          DESC_COLOR[state],
                        ].join(' ')}
                      >
                        {step.description}
                      </p>
                    )}
                  </div>
                </li>
              );
            }

            // ── Vertical layout ──────────────────────────────────────────
            return (
              <li key={step.id} className="flex perf-contain-content">
                {/* Left column: circle + vertical connector */}
                <div className="flex flex-col items-center shrink-0 me-[var(--stepper-content-gap-md)]">
                  {indicator}
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className={[
                        'flex-1 min-h-[var(--stepper-item-gap)] transition-default',
                        `w-[var(--stepper-connector-thickness)]`,
                        rightConnCompleted
                          ? 'bg-[var(--stepper-connector-color-completed)]'
                          : 'bg-[var(--stepper-connector-color)]',
                      ].join(' ')}
                    />
                  )}
                </div>
                {/* Right column: label + description */}
                <div
                  className={[
                    'flex flex-col',
                    CONTENT_GAP[size],
                    !isLast ? 'pb-[var(--stepper-item-gap)]' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span
                    className={[
                      'truncate-label',
                      LABEL_TEXT[size],
                      LABEL_COLOR[state],
                    ].join(' ')}
                  >
                    {step.label}
                  </span>
                  {step.description && (
                    <p
                      className={[
                        'clamp-description m-0',
                        DESC_TEXT[size],
                        DESC_COLOR[state],
                      ].join(' ')}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      );
    },
  ),
);

Stepper.displayName = 'Stepper';
