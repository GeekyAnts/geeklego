"use client"
import { forwardRef, memo, useCallback, useId, useMemo, useState } from 'react';
import type { SwitchLabelPosition, SwitchProps, SwitchSize, SwitchVariant } from './Switch.types';

// ── Size map — all token references per size ─────────────────────────────────
const sizeMap: Record<
  SwitchSize,
  { track: string; thumb: string; thumbOffset: string; thumbTranslate: string }
> = {
  sm: {
    track: 'w-[var(--switch-track-width-sm)] h-[var(--switch-track-height-sm)]',
    thumb: 'w-[var(--switch-thumb-size-sm)] h-[var(--switch-thumb-size-sm)]',
    thumbOffset: 'top-[var(--switch-thumb-offset-sm)] left-[var(--switch-thumb-offset-sm)]',
    thumbTranslate: 'translate-x-[var(--switch-thumb-translate-sm)]',
  },
  md: {
    track: 'w-[var(--switch-track-width-md)] h-[var(--switch-track-height-md)]',
    thumb: 'w-[var(--switch-thumb-size-md)] h-[var(--switch-thumb-size-md)]',
    thumbOffset: 'top-[var(--switch-thumb-offset-md)] left-[var(--switch-thumb-offset-md)]',
    thumbTranslate: 'translate-x-[var(--switch-thumb-translate-md)]',
  },
  lg: {
    track: 'w-[var(--switch-track-width-lg)] h-[var(--switch-track-height-lg)]',
    thumb: 'w-[var(--switch-thumb-size-lg)] h-[var(--switch-thumb-size-lg)]',
    thumbOffset: 'top-[var(--switch-thumb-offset-lg)] left-[var(--switch-thumb-offset-lg)]',
    thumbTranslate: 'translate-x-[var(--switch-thumb-translate-lg)]',
  },
};

// ── Track colour strategy per variant (checked state) ───────────────────────
// Each variant uses a fundamentally different hue to communicate intent.
const variantCheckedClasses: Record<SwitchVariant, string> = {
  default:
    'bg-[var(--switch-track-bg-checked)] hover:bg-[var(--switch-track-bg-checked-hover)]',
  success:
    'bg-[var(--switch-track-bg-success-checked)] hover:bg-[var(--switch-track-bg-success-checked-hover)]',
};

// ── Static track state strings — hoisted to avoid re-allocation ──────────────
// Unchecked enabled — two properties change on hover: bg + shadow (satisfies WCAG contrast rule for state changes)
const TRACK_UNCHECKED =
  'bg-[var(--switch-track-bg)] hover:bg-[var(--switch-track-bg-hover)] hover:shadow-[var(--switch-track-shadow-hover)]';
const TRACK_DISABLED =
  'bg-[var(--switch-track-bg-disabled)] cursor-not-allowed pointer-events-none';
const TRACK_CHECKED_DISABLED =
  'bg-[var(--switch-track-bg-checked-disabled)] cursor-not-allowed pointer-events-none';

export const Switch = memo(
  forwardRef<HTMLButtonElement, SwitchProps>(
    (
      {
        checked,
        defaultChecked = false,
        onChange,
        variant = 'default',
        size = 'md',
        labelPosition = 'right' as SwitchLabelPosition,
        children,
        description,
        disabled = false,
        className,
        id: idProp,
        ...rest
      },
      ref,
    ) => {
      // ── Controlled vs uncontrolled ─────────────────────────────────────────
      const isControlled = checked !== undefined;
      const [internalChecked, setInternalChecked] = useState(defaultChecked);
      const isChecked = isControlled ? (checked as boolean) : internalChecked;

      // ── IDs for aria-labelledby / aria-describedby ─────────────────────────
      const generatedId = useId();
      const switchId = idProp ?? generatedId;
      const labelId = `${switchId}-label`;
      const descriptionId = `${switchId}-desc`;

      const hasLabel = children != null;
      const hasDescription = Boolean(description);

      const handleClick = useCallback(() => {
        if (disabled) return;
        const next = !isChecked;
        if (!isControlled) setInternalChecked(next);
        onChange?.(next);
      }, [isChecked, isControlled, disabled, onChange]);

      const sz = sizeMap[size];

      // ── Track classes ─────────────────────────────────────────────────────
      const trackClasses = useMemo(
        () =>
          [
            'relative inline-flex flex-shrink-0 items-center',
            sz.track,
            'rounded-[var(--switch-track-radius)]',
            // Shadow switches between unchecked / checked tokens
            isChecked
              ? 'shadow-[var(--switch-track-shadow-checked)]'
              : 'shadow-[var(--switch-track-shadow)]',
            'transition-default',
            'focus-visible:outline-none focus-visible:focus-ring',
            // Touch target expands hit area to ≥24px (WCAG 2.5.8) — required for sm size
            size === 'sm' ? 'touch-target' : '',
            disabled
              ? isChecked
                ? TRACK_CHECKED_DISABLED
                : TRACK_DISABLED
              : isChecked
                ? variantCheckedClasses[variant]
                : TRACK_UNCHECKED,
            disabled ? '' : 'cursor-pointer',
          ]
            .filter(Boolean)
            .join(' '),
        [sz.track, isChecked, size, disabled, variant],
      );

      // ── Thumb classes ──────────────────────────────────────────────────────
      const thumbClasses = useMemo(
        () =>
          [
            'absolute',
            sz.thumbOffset,
            sz.thumb,
            'rounded-[var(--switch-thumb-radius)]',
            disabled ? 'bg-[var(--switch-thumb-bg-disabled)]' : 'bg-[var(--switch-thumb-bg)]',
            'shadow-[var(--switch-thumb-shadow)]',
            'transition-default',
            isChecked ? sz.thumbTranslate : 'translate-x-0',
            'pointer-events-none',
          ]
            .filter(Boolean)
            .join(' '),
        [sz, isChecked, disabled],
      );

      // ── Label text classes ─────────────────────────────────────────────────
      const labelTextClasses = useMemo(
        () =>
          [
            'text-body-md truncate-label select-none',
            disabled
              ? 'text-[var(--switch-label-color-disabled)]'
              : 'text-[var(--switch-label-color)]',
          ].join(' '),
        [disabled],
      );

      // ── Description text classes ───────────────────────────────────────────
      const descriptionClasses = useMemo(
        () =>
          [
            'text-body-sm select-none',
            // clamp to --switch-description-lines via token
            'overflow-hidden',
            disabled
              ? 'text-[var(--switch-description-color-disabled)]'
              : 'text-[var(--switch-description-color)]',
          ].join(' '),
        [disabled],
      );

      // ── Wrapper alignment — items-start when description is present ────────
      const wrapperClasses = useMemo(
        () =>
          [
            'inline-flex',
            hasDescription ? 'items-start' : 'items-center',
            'gap-[var(--switch-gap)]',
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [hasDescription, className],
      );

      // ── Label + description block ──────────────────────────────────────────
      const labelBlock = (hasLabel || hasDescription) && (
        <div className="flex flex-col gap-[var(--switch-label-gap)] content-flex">
          {hasLabel && (
            <span id={labelId} className={labelTextClasses}>
              {children}
            </span>
          )}
          {hasDescription && (
            <span id={descriptionId} className={descriptionClasses}>
              {description}
            </span>
          )}
        </div>
      );

      return (
        <div className={wrapperClasses}>
          {labelPosition === 'left' && labelBlock}

          {/*
           * The <button> IS the switch track.
           * role="switch" + aria-checked communicate toggle state to AT.
           * aria-labelledby links to the sibling label text so screen readers
           * announce "[label], switch, on/off" without duplicating the text inside the button.
           * aria-describedby links to the optional description.
           */}
          <button
            ref={ref}
            id={switchId}
            type="button"
            role="switch"
            aria-checked={isChecked}
            aria-disabled={disabled || undefined}
            aria-labelledby={hasLabel ? labelId : undefined}
            aria-describedby={hasDescription ? descriptionId : undefined}
            disabled={disabled}
            onClick={handleClick}
            className={trackClasses}
            {...rest}
          >
            {/* Thumb — decorative sliding circle; hidden from AT */}
            <span className={thumbClasses} aria-hidden="true" />
          </button>

          {labelPosition === 'right' && labelBlock}
        </div>
      );
    },
  ),
);
Switch.displayName = 'Switch';
