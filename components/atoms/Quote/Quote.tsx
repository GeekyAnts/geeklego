"use client"
import { forwardRef, memo, useMemo } from 'react';
import type { QuoteProps, QuoteVariant, QuoteSize } from './Quote.types';
import { sanitizeHref } from '../../utils/security/sanitize';

// ── Static class maps (hoisted — never recreated per render) ──────────────────

const variantContainerClasses: Record<QuoteVariant, string> = {
  default:
    'border-l-[length:var(--quote-border-width)] border-[color:var(--quote-border-color)]',
  pullquote: 'text-center',
  minimal:   '',
  card: [
    'border-[length:var(--quote-card-border-width)] border-[color:var(--quote-card-border-color)]',
    'rounded-[var(--quote-card-radius)] bg-[var(--quote-card-bg)]',
  ].join(' '),
};

const variantTextClasses: Record<QuoteVariant, string> = {
  default:   'not-italic text-[var(--quote-text-color)]',
  pullquote: 'italic text-[var(--quote-text-color)]',
  minimal:   'italic text-[var(--quote-minimal-text-color)]',
  card:      'not-italic text-[var(--quote-text-color)]',
};

const sizeContainerClasses: Record<QuoteSize, string> = {
  sm: 'px-[var(--quote-padding-inline-sm)] py-[var(--quote-padding-block-sm)]',
  md: 'px-[var(--quote-padding-inline-md)] py-[var(--quote-padding-block-md)]',
  lg: 'px-[var(--quote-padding-inline-lg)] py-[var(--quote-padding-block-lg)]',
};

const sizeGapClasses: Record<QuoteSize, string> = {
  sm: 'gap-[var(--quote-gap-sm)]',
  md: 'gap-[var(--quote-gap-md)]',
  lg: 'gap-[var(--quote-gap-lg)]',
};

// Quote text typography — larger for pullquote to communicate visual weight
const sizeTextClasses: Record<QuoteSize, Record<QuoteVariant, string>> = {
  sm: { default: 'text-body-sm',  pullquote: 'text-heading-h4', minimal: 'text-body-sm',  card: 'text-body-sm'  },
  md: { default: 'text-body-md',  pullquote: 'text-heading-h3', minimal: 'text-body-md',  card: 'text-body-md'  },
  lg: { default: 'text-body-lg',  pullquote: 'text-heading-h2', minimal: 'text-body-lg',  card: 'text-body-lg'  },
};

const sizeAttributionClasses: Record<QuoteSize, string> = {
  sm: 'text-label-xs',
  md: 'text-label-sm',
  lg: 'text-label-md',
};

// Decorative opening quotation mark for pullquote variant
const sizeDecorationClasses: Record<QuoteSize, string> = {
  sm: 'text-display-lg',
  md: 'text-display-xl',
  lg: 'text-display-2xl',
};

// ── Component ─────────────────────────────────────────────────────────────────

export const Quote = memo(forwardRef<HTMLElement, QuoteProps>(
  (
    {
      variant    = 'default',
      size       = 'md',
      children,
      attribution,
      source,
      sourceUrl,
      cite,
      className,
      ...rest
    },
    ref,
  ) => {
    const hasAttribution = Boolean(attribution || source);
    const safeSourceUrl = useMemo(() => sanitizeHref(sourceUrl), [sourceUrl]);

    const figureClasses = useMemo(() => [
      'flex flex-col',
      sizeGapClasses[size],
      sizeContainerClasses[size],
      variantContainerClasses[variant],
      className,
    ].filter(Boolean).join(' '), [variant, size, className]);

    const textClasses = useMemo(() => [
      variantTextClasses[variant],
      sizeTextClasses[size][variant],
    ].join(' '), [variant, size]);

    const figcaptionClasses = useMemo(() => [
      'flex flex-wrap items-baseline',
      variant === 'pullquote' ? 'justify-center' : 'justify-start',
      'gap-[var(--spacing-component-xs)]',
      'text-[var(--quote-attribution-color)]',
      sizeAttributionClasses[size],
    ].join(' '), [variant, size]);

    return (
      <figure ref={ref} className={figureClasses} {...rest}>
        <blockquote cite={cite} className="m-0">
          {variant === 'pullquote' && (
            <span
              aria-hidden="true"
              className={[
                'block leading-none text-[var(--quote-decoration-color)]',
                sizeDecorationClasses[size],
              ].join(' ')}
            >
              &ldquo;
            </span>
          )}
          <div className={textClasses}>{children}</div>
        </blockquote>

        {hasAttribution && (
          <figcaption className={figcaptionClasses}>
            {attribution && (
              <span className="truncate-label">
                &mdash;&nbsp;{attribution}
              </span>
            )}
            {source && (
              <cite className="not-italic text-[var(--quote-cite-color)] truncate-label">
                {sourceUrl ? (
                  <a
                    href={safeSourceUrl}
                    className={[
                      'underline decoration-[var(--quote-cite-color)] underline-offset-2',
                      'hover:text-[var(--quote-attribution-color)] hover:decoration-[var(--quote-attribution-color)]',
                      'transition-default',
                      'focus-visible:outline-none focus-visible:focus-ring',
                    ].join(' ')}
                  >
                    {source}
                  </a>
                ) : (
                  source
                )}
              </cite>
            )}
          </figcaption>
        )}
      </figure>
    );
  },
));

Quote.displayName = 'Quote';
