"use client"
import { forwardRef, memo, useCallback, useEffect, useMemo } from 'react';
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import type {
  ToastAppearance,
  ToastProps,
  ToastSize,
  ToastVariant,
} from './Toast.types';
import { getLiveRegionProps, getIconProps } from '../../utils/accessibility/aria-helpers';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';

// ── Default icons — one per status variant ────────────────────────────────────
const DEFAULT_ICONS: Record<ToastVariant, React.FC<{ size?: string | number; 'aria-hidden'?: boolean }>> = {
  info:    Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error:   XCircle,
};

// ── Container classes — appearance × variant ──────────────────────────────────
// Toast uses surface-raised bg for 'outline' (floating overlay needs solid bg,
// unlike AlertBanner where transparent outline works inline).
//
// 'left-accent' uses inline-start border approach with rounded-s-none so the
// flat edge reads as intentional against the shadow on the other three sides.

const containerClasses: Record<ToastAppearance, Record<ToastVariant, string>> = {
  solid: {
    info:    'bg-[var(--toast-solid-info-bg)]    text-[var(--toast-solid-info-text)]    border border-[var(--toast-solid-info-border)]',
    success: 'bg-[var(--toast-solid-success-bg)] text-[var(--toast-solid-success-text)] border border-[var(--toast-solid-success-border)]',
    warning: 'bg-[var(--toast-solid-warning-bg)] text-[var(--toast-solid-warning-text)] border border-[var(--toast-solid-warning-border)]',
    error:   'bg-[var(--toast-solid-error-bg)]   text-[var(--toast-solid-error-text)]   border border-[var(--toast-solid-error-border)]',
  },
  subtle: {
    info:    'bg-[var(--toast-subtle-info-bg)]    text-[var(--toast-subtle-info-text)]    border border-[var(--toast-subtle-info-border)]',
    success: 'bg-[var(--toast-subtle-success-bg)] text-[var(--toast-subtle-success-text)] border border-[var(--toast-subtle-success-border)]',
    warning: 'bg-[var(--toast-subtle-warning-bg)] text-[var(--toast-subtle-warning-text)] border border-[var(--toast-subtle-warning-border)]',
    error:   'bg-[var(--toast-subtle-error-bg)]   text-[var(--toast-subtle-error-text)]   border border-[var(--toast-subtle-error-border)]',
  },
  outline: {
    info:    'bg-[var(--toast-outline-info-bg)]    text-[var(--toast-outline-info-text)]    border border-[var(--toast-outline-info-border)]',
    success: 'bg-[var(--toast-outline-success-bg)] text-[var(--toast-outline-success-text)] border border-[var(--toast-outline-success-border)]',
    warning: 'bg-[var(--toast-outline-warning-bg)] text-[var(--toast-outline-warning-text)] border border-[var(--toast-outline-warning-border)]',
    error:   'bg-[var(--toast-outline-error-bg)]   text-[var(--toast-outline-error-text)]   border border-[var(--toast-outline-error-border)]',
  },
  'left-accent': {
    info: [
      'bg-[var(--toast-left-accent-info-bg)] text-[var(--toast-left-accent-info-text)]',
      '[border-inline-start-width:var(--toast-accent-width)] [border-inline-start-style:solid] [border-inline-start-color:var(--toast-left-accent-info-accent)]',
      'rounded-s-none',
    ].join(' '),
    success: [
      'bg-[var(--toast-left-accent-success-bg)] text-[var(--toast-left-accent-success-text)]',
      '[border-inline-start-width:var(--toast-accent-width)] [border-inline-start-style:solid] [border-inline-start-color:var(--toast-left-accent-success-accent)]',
      'rounded-s-none',
    ].join(' '),
    warning: [
      'bg-[var(--toast-left-accent-warning-bg)] text-[var(--toast-left-accent-warning-text)]',
      '[border-inline-start-width:var(--toast-accent-width)] [border-inline-start-style:solid] [border-inline-start-color:var(--toast-left-accent-warning-accent)]',
      'rounded-s-none',
    ].join(' '),
    error: [
      'bg-[var(--toast-left-accent-error-bg)] text-[var(--toast-left-accent-error-text)]',
      '[border-inline-start-width:var(--toast-accent-width)] [border-inline-start-style:solid] [border-inline-start-color:var(--toast-left-accent-error-accent)]',
      'rounded-s-none',
    ].join(' '),
  },
};

// ── Icon color classes — appearance × variant ─────────────────────────────────
const iconColorClasses: Record<ToastAppearance, Record<ToastVariant, string>> = {
  solid: {
    info:    'text-[var(--toast-solid-info-icon)]',
    success: 'text-[var(--toast-solid-success-icon)]',
    warning: 'text-[var(--toast-solid-warning-icon)]',
    error:   'text-[var(--toast-solid-error-icon)]',
  },
  subtle: {
    info:    'text-[var(--toast-subtle-info-icon)]',
    success: 'text-[var(--toast-subtle-success-icon)]',
    warning: 'text-[var(--toast-subtle-warning-icon)]',
    error:   'text-[var(--toast-subtle-error-icon)]',
  },
  outline: {
    info:    'text-[var(--toast-outline-info-icon)]',
    success: 'text-[var(--toast-outline-success-icon)]',
    warning: 'text-[var(--toast-outline-warning-icon)]',
    error:   'text-[var(--toast-outline-error-icon)]',
  },
  'left-accent': {
    info:    'text-[var(--toast-left-accent-info-icon)]',
    success: 'text-[var(--toast-left-accent-success-icon)]',
    warning: 'text-[var(--toast-left-accent-warning-icon)]',
    error:   'text-[var(--toast-left-accent-error-icon)]',
  },
};

// ── Progress bar color classes — appearance × variant ─────────────────────────
const progressColorClasses: Record<ToastAppearance, Record<ToastVariant, string>> = {
  solid: {
    info:    'bg-[var(--toast-solid-info-progress)]',
    success: 'bg-[var(--toast-solid-success-progress)]',
    warning: 'bg-[var(--toast-solid-warning-progress)]',
    error:   'bg-[var(--toast-solid-error-progress)]',
  },
  subtle: {
    info:    'bg-[var(--toast-subtle-info-progress)]',
    success: 'bg-[var(--toast-subtle-success-progress)]',
    warning: 'bg-[var(--toast-subtle-warning-progress)]',
    error:   'bg-[var(--toast-subtle-error-progress)]',
  },
  outline: {
    info:    'bg-[var(--toast-outline-info-progress)]',
    success: 'bg-[var(--toast-outline-success-progress)]',
    warning: 'bg-[var(--toast-outline-warning-progress)]',
    error:   'bg-[var(--toast-outline-error-progress)]',
  },
  'left-accent': {
    info:    'bg-[var(--toast-left-accent-info-progress)]',
    success: 'bg-[var(--toast-left-accent-success-progress)]',
    warning: 'bg-[var(--toast-left-accent-warning-progress)]',
    error:   'bg-[var(--toast-left-accent-error-progress)]',
  },
};

// ── Size maps ─────────────────────────────────────────────────────────────────
const sizeMap: Record<ToastSize, {
  padding:    string;
  gap:        string;
  contentGap: string;
  actionsGap: string;
  iconSize:   string;
  titleText:  string;
  bodyText:   string;
}> = {
  sm: {
    padding:    'px-[var(--toast-px-sm)] py-[var(--toast-py-sm)]',
    gap:        'gap-[var(--toast-gap-sm)]',
    contentGap: 'mt-[var(--toast-content-gap-sm)]',
    actionsGap: 'mt-[var(--toast-actions-gap-sm)]',
    iconSize:   'var(--toast-icon-size-sm)',
    titleText:  'text-body-sm',
    bodyText:   'text-body-sm',
  },
  md: {
    padding:    'px-[var(--toast-px-md)] py-[var(--toast-py-md)]',
    gap:        'gap-[var(--toast-gap-md)]',
    contentGap: 'mt-[var(--toast-content-gap-md)]',
    actionsGap: 'mt-[var(--toast-actions-gap-md)]',
    iconSize:   'var(--toast-icon-size-md)',
    titleText:  'text-body-md',
    bodyText:   'text-body-md',
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export const Toast = memo(
  forwardRef<HTMLDivElement, ToastProps>(
    (
      {
        variant = 'info',
        appearance = 'subtle',
        size = 'md',
        title,
        description,
        icon,
        showIcon = true,
        dismissible = true,
        onDismiss,
        duration = 0,
        showProgress = false,
        actions,
        i18nStrings,
        className,
        ...rest
      },
      ref,
    ) => {
      const i18n = useComponentI18n('toast', i18nStrings);

      // ARIA live region — error/warning are assertive; info/success are polite
      const liveProps = useMemo(
        () =>
          variant === 'error' || variant === 'warning'
            ? getLiveRegionProps('assertive')
            : getLiveRegionProps('status'),
        [variant],
      );

      // Auto-dismiss timer
      const handleDismiss = useCallback(() => {
        onDismiss?.();
      }, [onDismiss]);

      useEffect(() => {
        if (!duration || duration <= 0) return;
        const timer = setTimeout(handleDismiss, duration);
        return () => clearTimeout(timer);
      }, [duration, handleDismiss]);

      const sz = sizeMap[size];
      const hasProgress = showProgress && duration > 0;

      const wrapperClass = useMemo(
        () =>
          [
            'relative flex items-start',
            sz.padding,
            sz.gap,
            'rounded-[var(--toast-radius)]',
            'min-w-[var(--toast-min-width)]',
            'max-w-[var(--toast-max-width)]',
            'shadow-[var(--toast-shadow)]',
            containerClasses[appearance][variant],
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [appearance, variant, sz.padding, sz.gap, className],
      );

      const iconClass = useMemo(
        () => ['shrink-0 mt-px', iconColorClasses[appearance][variant]].join(' '),
        [appearance, variant],
      );

      // Resolve icon: explicit override > default status icon > nothing if showIcon=false
      const resolvedIcon = useMemo(() => {
        if (!showIcon) return null;
        if (icon !== undefined) return icon;
        const StatusIcon = DEFAULT_ICONS[variant];
        return <StatusIcon size={sz.iconSize} aria-hidden />;
      }, [showIcon, icon, variant, sz.iconSize]);

      const progressFillClass = useMemo(
        () =>
          [
            'toast-progress-fill',
            'h-full rounded-[var(--toast-progress-radius)]',
            progressColorClasses[appearance][variant],
          ].join(' '),
        [appearance, variant],
      );

      return (
        <div ref={ref} {...liveProps} {...rest} className={wrapperClass}>
          {/* Leading status icon */}
          {resolvedIcon !== null && (
            <span {...getIconProps(true)} className={iconClass}>
              {resolvedIcon}
            </span>
          )}

          {/* Content area — title + description + actions */}
          <div className="content-flex">
            {title && (
              <p className={`font-semibold truncate-label ${sz.titleText}`}>{title}</p>
            )}
            {description !== undefined && description !== null && (
              <p
                className={[
                  sz.bodyText,
                  'clamp-description',
                  title ? sz.contentGap : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {description}
              </p>
            )}
            {actions && (
              <div
                className={`flex flex-wrap gap-[var(--toast-gap-sm)] ${sz.actionsGap}`}
              >
                {actions}
              </div>
            )}
          </div>

          {/* Dismiss button — trailing edge */}
          {dismissible && (
            <button
              type="button"
              aria-label={i18n.dismissLabel}
              onClick={handleDismiss}
              className={[
                'shrink-0 flex items-center justify-center ms-auto',
                'w-[var(--toast-dismiss-size)] h-[var(--toast-dismiss-size)]',
                'rounded-[var(--toast-dismiss-radius)]',
                'opacity-70 hover:opacity-100',
                'transition-default',
                'focus-visible:outline-none focus-visible:focus-ring',
                'touch-target',
              ].join(' ')}
            >
              <X size="var(--toast-dismiss-icon-size)" aria-hidden />
            </button>
          )}

          {/* Countdown progress bar — purely visual, aria-hidden */}
          {hasProgress && (
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[var(--toast-progress-height)] rounded-b-[var(--toast-radius)] overflow-hidden"
            >
              <div
                className={progressFillClass}
                /* CSS custom property drives animation duration — not visual styling */
                style={{ '--toast-progress-duration': `${duration}ms` } as React.CSSProperties}
              />
            </div>
          )}
        </div>
      );
    },
  ),
);

Toast.displayName = 'Toast';
