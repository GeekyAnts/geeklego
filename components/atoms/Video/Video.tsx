"use client"
import { forwardRef, memo, useMemo } from 'react';
import type { VideoProps, VideoRatio } from './Video.types';

// ── Static class maps (hoisted — never recreated per render) ──────────────────

const ratioClasses: Record<VideoRatio, string> = {
  '16/9': 'aspect-[var(--video-ratio-16-9)]',
  '4/3':  'aspect-[var(--video-ratio-4-3)]',
  '1/1':  'aspect-[var(--video-ratio-1-1)]',
  '21/9': 'aspect-[var(--video-ratio-21-9)]',
};

// ── Component ─────────────────────────────────────────────────────────────────

export const Video = memo(forwardRef<HTMLElement, VideoProps>(
  (
    {
      src,
      sources,
      poster,
      ratio = '16/9',
      controls = true,
      autoPlay = false,
      loop = false,
      muted = false,
      playsInline = false,
      preload = 'metadata',
      tracks,
      caption,
      rounded = true,
      bordered = false,
      schema = false,
      className,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) => {
    // Enforce muted when autoPlay is true (browser policy)
    const effectiveMuted = autoPlay ? true : muted;

    // Resolve accessible label — prefer explicit prop, then caption
    const resolvedLabel = ariaLabel ?? caption;

    const figureClasses = useMemo(() => [
      'flex flex-col gap-[var(--video-caption-gap)]',
      className,
    ].filter(Boolean).join(' '), [className]);

    const containerClasses = useMemo(() => [
      'relative overflow-hidden w-full bg-[var(--video-bg)]',
      ratioClasses[ratio],
      rounded ? 'rounded-[var(--video-radius)]' : '',
      bordered
        ? 'border-[length:var(--video-border-width)] border-[var(--video-border-color)]'
        : '',
    ].filter(Boolean).join(' '), [ratio, rounded, bordered]);

    // ── Source resolution ─────────────────────────────────────────────────────
    // First source URL used for Schema.org contentUrl
    const primarySrc = sources?.[0]?.src ?? src;

    // ── Render ────────────────────────────────────────────────────────────────

    return (
      <figure
        ref={ref as React.Ref<HTMLElement>}
        className={figureClasses}
        aria-label={resolvedLabel}
        {...(schema && {
          itemScope: true,
          itemType: 'https://schema.org/VideoObject',
        })}
        {...(rest as React.HTMLAttributes<HTMLElement>)}
      >
        <div className={containerClasses}>
          {/* Schema.org contentUrl — invisible to sighted users */}
          {schema && primarySrc && (
            <meta itemProp="contentUrl" content={primarySrc} />
          )}
          {schema && poster && (
            <meta itemProp="thumbnailUrl" content={poster} />
          )}

          <video
            className="absolute inset-0 w-full h-full object-contain"
            poster={poster}
            controls={controls}
            autoPlay={autoPlay}
            loop={loop}
            muted={effectiveMuted}
            playsInline={playsInline}
            preload={preload}
            aria-label={resolvedLabel}
          >
            {/* Multi-source support */}
            {sources
              ? sources.map(({ src: s, type }) => (
                  <source key={`${s}-${type}`} src={s} type={type} />
                ))
              : src && <source src={src} type="video/mp4" />}

            {/* Caption/subtitle tracks (WCAG 1.2.2) */}
            {tracks?.map((track) => (
              <track
                key={`${track.src}-${track.kind}`}
                src={track.src}
                kind={track.kind}
                srcLang={track.srcLang}
                label={track.label}
                default={track.default}
              />
            ))}

            {/* Fallback for browsers without <video> support */}
            Your browser does not support the video element.
          </video>
        </div>

        {caption && (
          <figcaption
            className="text-body-sm text-[var(--video-caption-color)] clamp-description"
            {...(schema && { itemProp: 'name' })}
          >
            {caption}
          </figcaption>
        )}
      </figure>
    );
  },
));

Video.displayName = 'Video';
