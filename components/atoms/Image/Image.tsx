"use client"
import { forwardRef, memo, useCallback, useMemo, useState } from 'react';
import { ImageOff } from 'lucide-react';
import type { ImageProps, ImageRadius, ImageFit, ImageAspectRatio } from './Image.types';

// ── Static class maps (hoisted — never recreated per render) ──────────────────

const radiusClasses: Record<ImageRadius, string> = {
  none: 'rounded-[var(--image-radius-none)]',
  sm:   'rounded-[var(--image-radius-sm)]',
  md:   'rounded-[var(--image-radius-md)]',
  lg:   'rounded-[var(--image-radius-lg)]',
  xl:   'rounded-[var(--image-radius-xl)]',
  full: 'rounded-[var(--image-radius-full)]',
};

const fitClasses: Record<ImageFit, string> = {
  cover:   'object-cover',
  contain: 'object-contain',
  fill:    'object-fill',
  none:    'object-none',
};

const aspectClasses: Record<Exclude<ImageAspectRatio, 'auto'>, string> = {
  square:    'aspect-[var(--image-aspect-square)]',
  video:     'aspect-[var(--image-aspect-video)]',
  portrait:  'aspect-[var(--image-aspect-portrait)]',
  landscape: 'aspect-[var(--image-aspect-landscape)]',
  wide:      'aspect-[var(--image-aspect-wide)]',
};

const imageBoxBase = 'relative overflow-hidden w-full bg-[var(--image-bg-placeholder)]';

// ── Component ─────────────────────────────────────────────────────────────────

export const Image = memo(forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      caption,
      radius = 'none',
      fit = 'cover',
      aspectRatio = 'auto',
      bordered = false,
      fallback,
      loading = 'lazy',
      onLoad,
      onError,
      className,
      ...rest
    },
    ref,
  ) => {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

    const handleLoad = useCallback(() => {
      setStatus('loaded');
      onLoad?.();
    }, [onLoad]);

    const handleError = useCallback(() => {
      setStatus('error');
      onError?.();
    }, [onError]);

    // ── Class composition ──────────────────────────────────────────────────────

    const imageBoxClasses = useMemo(() => [
      imageBoxBase,
      radiusClasses[radius],
      aspectRatio !== 'auto' ? aspectClasses[aspectRatio] : 'min-h-[var(--image-min-height)]',
      bordered
        ? 'border-[length:var(--image-border-width)] border-[var(--image-border-color)]'
        : '',
    ].filter(Boolean).join(' '), [radius, aspectRatio, bordered]);

    const imgClasses = useMemo(() => [
      'w-full',
      aspectRatio !== 'auto' ? 'h-full' : 'h-auto',
      fitClasses[fit],
      'transition-default',
      status !== 'loaded' ? 'invisible' : '',
    ].filter(Boolean).join(' '), [aspectRatio, fit, status]);

    // ── Fallback content (loading skeleton + error state) ──────────────────────

    const fallbackContent = useMemo(() => {
      if (status === 'loaded') return null;

      if (status === 'error') {
        return (
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center text-[var(--image-fallback-icon-color)]"
          >
            {fallback ?? (
              <ImageOff size="var(--image-fallback-icon-size)" aria-hidden="true" />
            )}
          </span>
        );
      }

      // loading state — skeleton shimmer
      return (
        <span
          aria-hidden="true"
          className="skeleton absolute inset-0"
        />
      );
    }, [status, fallback]);

    // ── Render ────────────────────────────────────────────────────────────────

    const imgEl = (
      <>
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={imgClasses}
          {...rest}
        />
        {fallbackContent}
        {/* Hidden accessible text for error state — sighted users see the fallback icon */}
        {status === 'error' && alt && (
          <span className="sr-only">{alt} — failed to load</span>
        )}
      </>
    );

    if (caption) {
      return (
        <figure
          className={[
            'flex flex-col gap-[var(--image-caption-gap)]',
            className,
          ].filter(Boolean).join(' ')}
        >
          <div className={imageBoxClasses}>
            {imgEl}
          </div>
          <figcaption
            className="text-body-sm text-[var(--image-caption-color)] clamp-description"
          >
            {caption}
          </figcaption>
        </figure>
      );
    }

    return (
      <div className={[imageBoxClasses, className].filter(Boolean).join(' ')}>
        {imgEl}
      </div>
    );
  },
));

Image.displayName = 'Image';
