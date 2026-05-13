"use client"
import { forwardRef, memo, useCallback, useMemo, useState } from 'react';
import { User } from 'lucide-react';
import { Skeleton } from '../Skeleton/Skeleton';
import type { AvatarProps, AvatarSize, AvatarShape } from './Avatar.types';
import type { SkeletonCircleSize } from '../Skeleton/Skeleton.types';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';

const sizeClasses: Record<AvatarSize, { container: string; text: string; icon: string }> = {
  xs:  { container: 'w-[var(--avatar-size-xs)] h-[var(--avatar-size-xs)]',   text: 'text-label-xs',  icon: 'w-[var(--size-icon-xs)] h-[var(--size-icon-xs)]' },
  sm:  { container: 'w-[var(--avatar-size-sm)] h-[var(--avatar-size-sm)]',   text: 'text-label-xs',  icon: 'w-[var(--size-icon-sm)] h-[var(--size-icon-sm)]' },
  md:  { container: 'w-[var(--avatar-size-md)] h-[var(--avatar-size-md)]',   text: 'text-label-sm',  icon: 'w-[var(--size-icon-sm)] h-[var(--size-icon-sm)]' },
  lg:  { container: 'w-[var(--avatar-size-lg)] h-[var(--avatar-size-lg)]',   text: 'text-label-md',  icon: 'w-[var(--size-icon-md)] h-[var(--size-icon-md)]' },
  xl:  { container: 'w-[var(--avatar-size-xl)] h-[var(--avatar-size-xl)]',   text: 'text-body-md',   icon: 'w-[var(--size-icon-lg)] h-[var(--size-icon-lg)]' },
  '2xl': { container: 'w-[var(--avatar-size-2xl)] h-[var(--avatar-size-2xl)]', text: 'text-heading-h4', icon: 'w-[var(--size-icon-xl)] h-[var(--size-icon-xl)]' },
};

const shapeClasses: Record<AvatarShape, string> = {
  circle:  'rounded-[var(--avatar-radius-circle)]',
  rounded: 'rounded-[var(--avatar-radius-rounded)]',
};

export const Avatar = memo(forwardRef<HTMLSpanElement, AvatarProps>(
  ({ variant = 'fallback', size = 'md', shape = 'circle', src, alt, initials, icon, bordered = false, loading = false, schema, className, i18nStrings, ...rest }, ref) => {
    const i18n = useComponentI18n('avatar', i18nStrings);
    const resolvedAlt = alt ?? i18n.fallbackLabel;
    const [imgError, setImgError] = useState(false);
    const showImage = variant === 'image' && src && !imgError;
    const showInitials = variant === 'initials' && initials;
    const showIcon = variant === 'icon' && icon;

    const handleImgError = useCallback(() => setImgError(true), []);

    const classes = useMemo(() => [
      'inline-flex items-center justify-center shrink-0 overflow-hidden select-none',
      'bg-[var(--avatar-bg)] text-[var(--avatar-text)]',
      shapeClasses[shape],
      sizeClasses[size].container,
      bordered ? 'ring-2 ring-[var(--avatar-border)]' : '',
      'transition-default',
      className,
    ].filter(Boolean).join(' '), [shape, size, bordered, className]);

    if (loading) {
      return (
        <Skeleton
          variant="circle"
          circleSize={size as SkeletonCircleSize}
          className={className}
        />
      );
    }

    return (
      <span
        ref={ref}
        role={showImage ? undefined : 'img'}
        aria-label={showImage ? undefined : (initials || resolvedAlt)}
        className={classes}
        {...(schema && showImage && {
          itemScope: true,
          itemType: 'https://schema.org/ImageObject',
        })}
        {...rest}
      >
        {showImage && (
          <img
            src={src}
            alt={resolvedAlt}
            className="w-full h-full object-cover"
            onError={handleImgError}
            {...(schema && { itemProp: 'contentUrl' })}
          />
        )}
        {showInitials && (
          <span className={`${sizeClasses[size].text} uppercase`}>
            {initials.slice(0, 2)}
          </span>
        )}
        {showIcon && (
          <span className={`inline-flex items-center justify-center text-[var(--avatar-icon-color)] ${sizeClasses[size].icon}`} aria-hidden="true">
            {icon}
          </span>
        )}
        {!showImage && !showInitials && !showIcon && (
          <User className={`text-[var(--avatar-icon-color)] ${sizeClasses[size].icon}`} aria-hidden="true" />
        )}
      </span>
    );
  },
));
Avatar.displayName = 'Avatar';
