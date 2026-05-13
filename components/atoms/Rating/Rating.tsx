"use client"
import { forwardRef, memo, useCallback, useId, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import type { RatingProps, RatingSize } from './Rating.types';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';

// ── Static class maps (hoisted — never recreated per render) ──────────────────

const STAR_FILLED          = 'fill-[var(--rating-star-filled)] text-[var(--rating-star-filled)]';
const STAR_EMPTY           = 'fill-none text-[var(--rating-star-empty)]';
const STAR_FILLED_DISABLED = 'fill-[var(--rating-star-disabled)] text-[var(--rating-star-disabled)]';
const STAR_EMPTY_DISABLED  = 'fill-none text-[var(--rating-star-disabled)]';

// Focus indicator applied to the star icon when its sibling radio is focused
const STAR_FOCUS_RING =
  'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 ' +
  'peer-focus-visible:outline-[var(--color-border-focus)] peer-focus-visible:rounded-sm';

const sizeMap: Record<RatingSize, { starSize: string; gap: string }> = {
  sm: { starSize: 'var(--rating-star-size-sm)', gap: 'gap-[var(--rating-gap-sm)]' },
  md: { starSize: 'var(--rating-star-size-md)', gap: 'gap-[var(--rating-gap-md)]' },
  lg: { starSize: 'var(--rating-star-size-lg)', gap: 'gap-[var(--rating-gap-lg)]' },
};

// ── Component ─────────────────────────────────────────────────────────────────

export const Rating = memo(forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value = 0,
      onChange,
      max = 5,
      size = 'md',
      readOnly = false,
      disabled = false,
      label = 'Rating',
      showLabel = false,
      name: nameProp,
      schema = false,
      className,
      i18nStrings,
      ...rest
    },
    ref,
  ) => {
    const i18n = useComponentI18n('rating', i18nStrings);
    const generatedName = useId();
    const ratingName = nameProp ?? generatedName;
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const { starSize, gap } = sizeMap[size];

    const handleMouseLeave = useCallback(() => setHoverValue(null), []);

    const wrapperClasses = useMemo(
      () => ['inline-flex flex-col', className].filter(Boolean).join(' '),
      [className],
    );

    // ── Read-only display ─────────────────────────────────────────────────────

    if (readOnly) {
      return (
        <div ref={ref} className={wrapperClasses} {...rest}>
          <span
            role="img"
            aria-label={i18n.starLabel?.({ value, max })}
            className={['inline-flex items-center', gap].join(' ')}
            {...(schema && {
              itemScope: true,
              itemType: 'https://schema.org/AggregateRating',
            })}
          >
            {Array.from({ length: max }, (_, i) => {
              const starValue = i + 1;
              return (
                <Star
                  key={starValue}
                  aria-hidden="true"
                  size={starSize}
                  className={starValue <= value ? STAR_FILLED : STAR_EMPTY}
                />
              );
            })}
            {schema && (
              <>
                <meta itemProp="ratingValue" content={String(value)} />
                <meta itemProp="bestRating" content={String(max)} />
              </>
            )}
          </span>
        </div>
      );
    }

    // ── Interactive mode ──────────────────────────────────────────────────────

    // hoverValue previews which stars would be filled on click.
    // Falls back to committed value when not hovering.
    const activeValue = hoverValue ?? value;

    const legendClasses = useMemo(
      () =>
        [
          'text-label-sm text-[var(--rating-label-color)] truncate-label',
          !showLabel && 'sr-only',
        ]
          .filter(Boolean)
          .join(' '),
      [showLabel],
    );

    const fieldsetClasses = useMemo(
      () =>
        [
          'inline-flex flex-col border-none p-0 m-0',
          showLabel && 'gap-[var(--spacing-component-xs)]',
        ]
          .filter(Boolean)
          .join(' '),
      [showLabel],
    );

    return (
      <div ref={ref} className={wrapperClasses} {...rest}>
        {/*
         * <fieldset> wraps the radio group — setting `disabled` here disables
         * all contained <input type="radio"> elements at the browser level,
         * ensuring correct keyboard behaviour and form semantics.
         */}
        <fieldset className={fieldsetClasses} disabled={disabled}>
          {/*
           * <legend> is always present. When showLabel=false it is visually hidden
           * (sr-only) but still read by screen readers as the group label.
           */}
          <legend className={legendClasses}>{label}</legend>

          <div
            className={['inline-flex items-center', gap].join(' ')}
            onMouseLeave={handleMouseLeave}
          >
            {Array.from({ length: max }, (_, i) => {
              const starValue = i + 1;
              const isFilled = starValue <= activeValue;
              const starClass = disabled
                ? isFilled ? STAR_FILLED_DISABLED : STAR_EMPTY_DISABLED
                : isFilled ? STAR_FILLED : STAR_EMPTY;

              return (
                /*
                 * Each star is a <label> that wraps a visually-hidden
                 * <input type="radio">. Clicking the label clicks the input.
                 * Arrow-key navigation between stars is native radio behaviour.
                 * The focus ring appears on the Star icon via peer-focus-visible.
                 */
                <label
                  key={starValue}
                  className={[
                    'relative inline-flex touch-target',
                    disabled ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer',
                  ].join(' ')}
                  onMouseEnter={disabled ? undefined : () => setHoverValue(starValue)}
                >
                  {/*
                   * Native radio input: transparent overlay positioned over the label.
                   * Provides radio semantics, form participation, and arrow-key nav.
                   * `aria-label` gives each star a distinct accessible name —
                   * SR announces "3 out of 5 stars, radio button" etc.
                   */}
                  <input
                    type="radio"
                    name={ratingName}
                    value={String(starValue)}
                    checked={value === starValue}
                    disabled={disabled}
                    aria-label={i18n.starLabel?.({ value: starValue, max })}
                    onChange={disabled ? undefined : () => onChange?.(starValue)}
                    className="peer absolute inset-0 w-full h-full opacity-0 m-0 cursor-[inherit]"
                  />
                  {/* Star icon — decorative; visual state driven by starClass */}
                  <Star
                    aria-hidden="true"
                    size={starSize}
                    className={[starClass, 'transition-default', STAR_FOCUS_RING].join(' ')}
                  />
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>
    );
  },
));

Rating.displayName = 'Rating';
