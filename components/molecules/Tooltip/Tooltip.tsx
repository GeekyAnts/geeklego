"use client";

import {
  forwardRef,
  memo,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import React from 'react';
import { useEscapeDismiss } from '../../utils/keyboard/useEscapeDismiss';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type { TooltipPlacement, TooltipProps } from './Tooltip.types';

// ── Placement position classes ───────────────────────────────────────────────
// Each variant positions the panel relative to the trigger's wrapper.
// Wrapper is `position: relative; display: inline-flex`.
// Panel is `position: absolute`.

const placementClasses: Record<TooltipPlacement, string> = {
  top: [
    'absolute bottom-full left-1/2 -translate-x-1/2',
    'mb-[var(--tooltip-offset)]',
  ].join(' '),
  bottom: [
    'absolute top-full left-1/2 -translate-x-1/2',
    'mt-[var(--tooltip-offset)]',
  ].join(' '),
  left: [
    'absolute right-full top-1/2 -translate-y-1/2',
    'me-[var(--tooltip-offset)]',
  ].join(' '),
  right: [
    'absolute left-full top-1/2 -translate-y-1/2',
    'ms-[var(--tooltip-offset)]',
  ].join(' '),
};

// ── Tooltip ──────────────────────────────────────────────────────────────────

export const Tooltip = memo(
  forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(
    {
      content,
      placement = 'top',
      delayMs = 300,
      disabled = false,
      children,
      i18nStrings,
      className,
    },
    ref,
  ) {
    const i18n = useComponentI18n('tooltip', i18nStrings);

    const baseId = useId();
    const tooltipId = `${baseId}-tooltip`;

    const [isVisible, setIsVisible] = useState(false);
    const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Visibility handlers ──────────────────────────────────────────────────

    const show = useCallback(() => {
      if (disabled) return;
      if (showTimeoutRef.current !== null) {
        clearTimeout(showTimeoutRef.current);
      }
      showTimeoutRef.current = setTimeout(() => setIsVisible(true), delayMs);
    }, [disabled, delayMs]);

    const hide = useCallback(() => {
      if (showTimeoutRef.current !== null) {
        clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
      }
      setIsVisible(false);
    }, []);

    /** Focus-triggered show: no delay — keyboard users need immediate feedback */
    const handleFocus = useCallback(() => {
      if (disabled) return;
      if (showTimeoutRef.current !== null) {
        clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
      }
      setIsVisible(true);
    }, [disabled]);

    // ── Escape dismiss ───────────────────────────────────────────────────────
    useEscapeDismiss({ active: isVisible, onDismiss: hide });

    // ── Trigger: inject aria-describedby via cloneElement ────────────────────
    // The `aria-describedby` lives on the trigger element so that screen readers
    // associate the tooltip panel with the correct interactive control.
    // Falls back to the wrapper `<span>` when children is not a React element.
    const trigger = useMemo((): ReactNode => {
      if (React.isValidElement(children)) {
        return React.cloneElement(
          children as React.ReactElement<Record<string, unknown>>,
          { 'aria-describedby': tooltipId },
        );
      }
      return children;
    }, [children, tooltipId]);

    // ── Classes ──────────────────────────────────────────────────────────────

    const wrapperClasses = useMemo(
      () =>
        ['relative inline-flex', className].filter(Boolean).join(' '),
      [className],
    );

    const panelClasses = useMemo(
      () =>
        [
          // Layout
          'w-max max-w-[var(--tooltip-max-width)]',
          // Appearance
          'bg-[var(--tooltip-bg)] text-[var(--tooltip-text)]',
          'shadow-[var(--tooltip-shadow)]',
          'rounded-[var(--tooltip-radius)]',
          // Padding
          'px-[var(--tooltip-px)] py-[var(--tooltip-py)]',
          // Z-index
          'z-[var(--tooltip-z)]',
          // Typography (tooltip text is label-sized)
          'text-body-sm',
          // Transition
          'transition-default',
          // Placement
          placementClasses[placement],
          // Visibility — aria-hidden is used instead of display:none so
          // CSS transitions work. pointer-events-none prevents hover flicker.
          isVisible && !disabled
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        ].join(' '),
      [placement, isVisible, disabled],
    );

    // ── Render ───────────────────────────────────────────────────────────────

    return (
      <span
        ref={ref}
        className={wrapperClasses}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={handleFocus}
        onBlur={hide}
      >
        {trigger}

        {/* Tooltip panel — always in DOM so aria-describedby reference is valid.
            aria-hidden removes it from the a11y tree when not visible. */}
        <div
          id={tooltipId}
          role="tooltip"
          aria-label={i18n.panelLabel}
          aria-hidden={!isVisible}
          className={panelClasses}
        >
          {content}
        </div>
      </span>
    );
  }),
);

Tooltip.displayName = 'Tooltip';
