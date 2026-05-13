"use client"
import { forwardRef, memo, useMemo } from 'react';
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import type {
  AlertBannerAppearance,
  AlertBannerProps,
  AlertBannerSize,
  AlertBannerVariant,
} from './AlertBanner.types';
import { getLiveRegionProps, getIconProps } from '../../utils/accessibility/aria-helpers';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';

// ── Default icons ────────────────────────────────────────────────────────────
// Each status variant maps to a semantically appropriate lucide-react icon.
const DEFAULT_ICONS: Record<AlertBannerVariant, React.FC<{ size?: string | number; 'aria-hidden'?: boolean }>> = {
  info:    Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error:   XCircle,
};

// ── Container classes — appearance × variant ─────────────────────────────────
// Each appearance uses a fundamentally different visual strategy.
//   solid       → filled background, inverse text     (max prominence)
//   subtle      → muted tinted bg + status border     (balanced)
//   outline     → transparent bg + full status border (lightweight)
//   left-accent → tinted bg + bold inline-start bar   (contextual)

const containerClasses: Record<AlertBannerAppearance, Record<AlertBannerVariant, string>> = {
  solid: {
    info:    'bg-[var(--alert-banner-solid-info-bg)]    text-[var(--alert-banner-solid-info-text)]    border border-[var(--alert-banner-solid-info-border)]',
    success: 'bg-[var(--alert-banner-solid-success-bg)] text-[var(--alert-banner-solid-success-text)] border border-[var(--alert-banner-solid-success-border)]',
    warning: 'bg-[var(--alert-banner-solid-warning-bg)] text-[var(--alert-banner-solid-warning-text)] border border-[var(--alert-banner-solid-warning-border)]',
    error:   'bg-[var(--alert-banner-solid-error-bg)]   text-[var(--alert-banner-solid-error-text)]   border border-[var(--alert-banner-solid-error-border)]',
  },
  subtle: {
    info:    'bg-[var(--alert-banner-subtle-info-bg)]    text-[var(--alert-banner-subtle-info-text)]    border border-[var(--alert-banner-subtle-info-border)]',
    success: 'bg-[var(--alert-banner-subtle-success-bg)] text-[var(--alert-banner-subtle-success-text)] border border-[var(--alert-banner-subtle-success-border)]',
    warning: 'bg-[var(--alert-banner-subtle-warning-bg)] text-[var(--alert-banner-subtle-warning-text)] border border-[var(--alert-banner-subtle-warning-border)]',
    error:   'bg-[var(--alert-banner-subtle-error-bg)]   text-[var(--alert-banner-subtle-error-text)]   border border-[var(--alert-banner-subtle-error-border)]',
  },
  outline: {
    info:    'bg-[var(--alert-banner-outline-info-bg)]    text-[var(--alert-banner-outline-info-text)]    border border-[var(--alert-banner-outline-info-border)]',
    success: 'bg-[var(--alert-banner-outline-success-bg)] text-[var(--alert-banner-outline-success-text)] border border-[var(--alert-banner-outline-success-border)]',
    warning: 'bg-[var(--alert-banner-outline-warning-bg)] text-[var(--alert-banner-outline-warning-text)] border border-[var(--alert-banner-outline-warning-border)]',
    error:   'bg-[var(--alert-banner-outline-error-bg)]   text-[var(--alert-banner-outline-error-text)]   border border-[var(--alert-banner-outline-error-border)]',
  },
  'left-accent': {
    info: [
      'bg-[var(--alert-banner-left-accent-info-bg)] text-[var(--alert-banner-left-accent-info-text)]',
      '[border-inline-start-width:var(--alert-banner-accent-width)] [border-inline-start-style:solid] [border-inline-start-color:var(--alert-banner-left-accent-info-accent)]',
      'rounded-s-none',
    ].join(' '),
    success: [
      'bg-[var(--alert-banner-left-accent-success-bg)] text-[var(--alert-banner-left-accent-success-text)]',
      '[border-inline-start-width:var(--alert-banner-accent-width)] [border-inline-start-style:solid] [border-inline-start-color:var(--alert-banner-left-accent-success-accent)]',
      'rounded-s-none',
    ].join(' '),
    warning: [
      'bg-[var(--alert-banner-left-accent-warning-bg)] text-[var(--alert-banner-left-accent-warning-text)]',
      '[border-inline-start-width:var(--alert-banner-accent-width)] [border-inline-start-style:solid] [border-inline-start-color:var(--alert-banner-left-accent-warning-accent)]',
      'rounded-s-none',
    ].join(' '),
    error: [
      'bg-[var(--alert-banner-left-accent-error-bg)] text-[var(--alert-banner-left-accent-error-text)]',
      '[border-inline-start-width:var(--alert-banner-accent-width)] [border-inline-start-style:solid] [border-inline-start-color:var(--alert-banner-left-accent-error-accent)]',
      'rounded-s-none',
    ].join(' '),
  },
};

// ── Icon color classes — appearance × variant ────────────────────────────────
const iconColorClasses: Record<AlertBannerAppearance, Record<AlertBannerVariant, string>> = {
  solid: {
    info:    'text-[var(--alert-banner-solid-info-icon)]',
    success: 'text-[var(--alert-banner-solid-success-icon)]',
    warning: 'text-[var(--alert-banner-solid-warning-icon)]',
    error:   'text-[var(--alert-banner-solid-error-icon)]',
  },
  subtle: {
    info:    'text-[var(--alert-banner-subtle-info-icon)]',
    success: 'text-[var(--alert-banner-subtle-success-icon)]',
    warning: 'text-[var(--alert-banner-subtle-warning-icon)]',
    error:   'text-[var(--alert-banner-subtle-error-icon)]',
  },
  outline: {
    info:    'text-[var(--alert-banner-outline-info-icon)]',
    success: 'text-[var(--alert-banner-outline-success-icon)]',
    warning: 'text-[var(--alert-banner-outline-warning-icon)]',
    error:   'text-[var(--alert-banner-outline-error-icon)]',
  },
  'left-accent': {
    info:    'text-[var(--alert-banner-left-accent-info-icon)]',
    success: 'text-[var(--alert-banner-left-accent-success-icon)]',
    warning: 'text-[var(--alert-banner-left-accent-warning-icon)]',
    error:   'text-[var(--alert-banner-left-accent-error-icon)]',
  },
};

// ── Size maps ────────────────────────────────────────────────────────────────
const sizeMap: Record<AlertBannerSize, {
  padding:      string;
  gap:          string;
  contentGap:   string;
  actionsGap:   string;
  iconSize:     string;
  titleText:    string;
  bodyText:     string;
}> = {
  sm: {
    padding:    'px-[var(--alert-banner-px-sm)] py-[var(--alert-banner-py-sm)]',
    gap:        'gap-[var(--alert-banner-gap-sm)]',
    contentGap: 'mt-[var(--alert-banner-content-gap-sm)]',
    actionsGap: 'mt-[var(--alert-banner-actions-gap-sm)]',
    iconSize:   'var(--alert-banner-icon-size-sm)',
    titleText:  'text-body-sm',
    bodyText:   'text-body-sm',
  },
  md: {
    padding:    'px-[var(--alert-banner-px-md)] py-[var(--alert-banner-py-md)]',
    gap:        'gap-[var(--alert-banner-gap-md)]',
    contentGap: 'mt-[var(--alert-banner-content-gap-md)]',
    actionsGap: 'mt-[var(--alert-banner-actions-gap-md)]',
    iconSize:   'var(--alert-banner-icon-size-md)',
    titleText:  'text-body-md',
    bodyText:   'text-body-md',
  },
};

export const AlertBanner = memo(
  forwardRef<HTMLDivElement, AlertBannerProps>(
    (
      {
        variant = 'info',
        appearance = 'subtle',
        size = 'md',
        title,
        description,
        icon,
        showIcon = true,
        dismissible = false,
        onDismiss,
        actions,
        i18nStrings,
        className,
        ...rest
      },
      ref,
    ) => {
      const i18n = useComponentI18n('alertBanner', i18nStrings);

      // ARIA live region — error/warning are assertive; info/success are polite
      const liveProps = useMemo(
        () =>
          variant === 'error' || variant === 'warning'
            ? getLiveRegionProps('assertive')
            : getLiveRegionProps('status'),
        [variant],
      );

      const sz = sizeMap[size];

      const wrapperClass = useMemo(
        () =>
          [
            'flex items-start',
            sz.padding,
            sz.gap,
            'rounded-[var(--alert-banner-radius)]',
            'min-w-[var(--alert-banner-min-width)]',
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
              <p className={`font-semibold ${sz.titleText}`}>{title}</p>
            )}
            {description !== undefined && description !== null && (
              <p className={[sz.bodyText, title ? sz.contentGap : ''].filter(Boolean).join(' ')}>
                {description}
              </p>
            )}
            {actions && (
              <div className={`flex flex-wrap gap-[var(--alert-banner-gap-sm)] ${sz.actionsGap}`}>
                {actions}
              </div>
            )}
          </div>

          {/* Dismiss button — trailing edge */}
          {dismissible && (
            <button
              type="button"
              aria-label={i18n.dismissLabel}
              onClick={onDismiss}
              className={[
                'shrink-0 flex items-center justify-center ms-auto',
                'w-[var(--alert-banner-dismiss-size)] h-[var(--alert-banner-dismiss-size)]',
                'rounded-[var(--alert-banner-dismiss-radius)]',
                'opacity-70 hover:opacity-100',
                'transition-default',
                'focus-visible:outline-none focus-visible:focus-ring',
                'touch-target',
              ].join(' ')}
            >
              <X size="var(--alert-banner-dismiss-icon-size)" aria-hidden />
            </button>
          )}
        </div>
      );
    },
  ),
);

AlertBanner.displayName = 'AlertBanner';
