"use client";

import {
  Children,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import type { KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '../../atoms/Button/Button';
import { Skeleton } from '../../atoms/Skeleton/Skeleton';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import { getLoadingProps } from '../../utils/accessibility';
import type {
  CarouselProps,
  CarouselSlideProps,
  CarouselSize,
  CarouselSlidesPerView,
} from './Carousel.types';

// ── Slide width classes ───────────────────────────────────────────────────────
const slideWidthClasses: Record<CarouselSlidesPerView, string> = {
  1: 'w-full',
  2: 'w-1/2',
  3: 'w-1/3',
};

// ── Nav button size mapping ───────────────────────────────────────────────────
const navButtonSizes: Record<CarouselSize, 'xs' | 'sm' | 'md'> = {
  sm:   'xs',
  md:   'sm',
  lg:   'md',
  full: 'sm',
};

// ── Module-scope static class strings ─────────────────────────────────────────
const dotBaseClasses = [
  'h-[var(--carousel-dot-size)]',
  'rounded-[var(--carousel-dot-radius)]',
  'transition-default',
  'cursor-pointer',
  'focus-visible:outline-none focus-visible:focus-ring',
].join(' ');

const dotInactiveClasses = [
  'w-[var(--carousel-dot-size)]',
  'bg-[var(--carousel-dot-bg)]',
  'hover:bg-[var(--carousel-dot-bg-hover)]',
].join(' ');

const dotActiveClasses = [
  'w-[var(--carousel-dot-active-width)]',
  'bg-[var(--carousel-dot-bg-active)]',
].join(' ');

const autoplayBtnClasses = [
  'me-[var(--spacing-component-sm)]',
  'inline-flex items-center justify-center',
  'text-[var(--carousel-autoplay-color)]',
  'hover:text-[var(--carousel-autoplay-color-hover)]',
  'transition-default',
  'focus-visible:outline-none focus-visible:focus-ring',
  'rounded-[var(--carousel-nav-radius)]',
].join(' ');

// ── Internal CarouselSlide slot component ─────────────────────────────────────
export const CarouselSlide = memo(({ children, className }: CarouselSlideProps) => {
  const classes = useMemo(
    () => ['w-full h-full', className].filter(Boolean).join(' '),
    [className],
  );
  return <div className={classes}>{children}</div>;
});
CarouselSlide.displayName = 'Carousel.Slide';

// ── Carousel organism ──────────────────────────────────────────────────────────
const CarouselRoot = memo(
  forwardRef<HTMLElement, CarouselProps>(
    (
      {
        variant = 'default',
        navigation = 'both',
        size = 'md',
        slidesPerView = 1,
        autoPlay = false,
        autoPlayInterval = 4000,
        pauseOnHover = true,
        loading = false,
        label,
        i18nStrings,
        children,
        className,
        onKeyDown,
        ...rest
      },
      ref,
    ) => {
      const i18n = useComponentI18n('carousel', i18nStrings);

      const slideArray = useMemo(() => Children.toArray(children), [children]);
      const total = slideArray.length;
      const maxIndex = Math.max(0, total - slidesPerView);

      const [currentIndex, setCurrentIndex] = useState(0);
      const [isPlaying, setIsPlaying] = useState(autoPlay);
      const [isHovering, setIsHovering] = useState(false);

      const baseId = useId();
      const liveRegionId = `${baseId}-live`;

      // ── Navigation ──────────────────────────────────────────────────────────
      const goTo = useCallback(
        (index: number) => {
          if (variant === 'loop') {
            setCurrentIndex(((index % total) + total) % total);
          } else {
            setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
          }
        },
        [variant, total, maxIndex],
      );

      const prev = useCallback(() => {
        if (variant === 'loop' && currentIndex === 0) {
          goTo(total - 1);
        } else {
          goTo(currentIndex - 1);
        }
      }, [goTo, variant, currentIndex, total]);

      const next = useCallback(() => {
        if (variant === 'loop' && currentIndex >= maxIndex) {
          goTo(0);
        } else {
          goTo(currentIndex + 1);
        }
      }, [goTo, variant, currentIndex, maxIndex]);

      const canGoPrev = variant === 'loop' || currentIndex > 0;
      const canGoNext = variant === 'loop' || currentIndex < maxIndex;

      // ── Autoplay ────────────────────────────────────────────────────────────
      useEffect(() => {
        if (!autoPlay || !isPlaying || (pauseOnHover && isHovering) || total <= 1) return;
        const timer = setInterval(next, autoPlayInterval);
        return () => clearInterval(timer);
      }, [autoPlay, isPlaying, isHovering, pauseOnHover, next, autoPlayInterval, total]);

      const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

      // ── Pointer interaction ─────────────────────────────────────────────────
      const handleMouseEnter = useCallback(() => {
        if (pauseOnHover) setIsHovering(true);
      }, [pauseOnHover]);

      const handleMouseLeave = useCallback(() => {
        if (pauseOnHover) setIsHovering(false);
      }, [pauseOnHover]);

      // ── Keyboard ────────────────────────────────────────────────────────────
      const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLElement>) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prev();
          }
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            next();
          }
          onKeyDown?.(e);
        },
        [prev, next, onKeyDown],
      );

      // ── Track transform (dynamic position — justified inline style) ──────────
      // This is a runtime-computed translate value; cannot be expressed as a
      // static token. It is the only inline style in this component.
      const trackStyle = useMemo(
        () => ({ transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)` }),
        [currentIndex, slidesPerView],
      );

      // ── Root classes ─────────────────────────────────────────────────────────
      const rootClasses = useMemo(
        () =>
          [
            'relative overflow-hidden',
            'rounded-[var(--carousel-radius)]',
            'bg-[var(--carousel-bg)]',
            'min-w-[var(--carousel-min-width)]',
            'w-full',
            size === 'full' ? 'h-full' : '',
            'focus-visible:outline-none focus-visible:focus-ring',
            className,
          ]
            .filter(Boolean)
            .join(' '),
        [size, className],
      );

      const showArrows = navigation === 'arrows' || navigation === 'both';
      const showDots = navigation === 'dots' || navigation === 'both';
      const navSize = navButtonSizes[size];

      return (
        <section
          ref={ref}
          aria-roledescription="carousel"
          aria-label={label}
          className={rootClasses}
          onKeyDown={handleKeyDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...getLoadingProps(loading)}
          {...rest}
        >
          {/* Polite live region — announces current slide on navigation */}
          <div
            id={liveRegionId}
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {i18n.slideLabel?.(currentIndex + 1, total)}
          </div>

          {/* Slide viewport — clips the translate track */}
          <div className="overflow-hidden w-full">
            {loading ? (
              <Skeleton variant="box" className="w-full aspect-video" />
            ) : (
              /* Track — translate drives slide advancement */
              <ul
                className="flex transition-default"
                style={trackStyle}
                aria-live="off"
              >
                {slideArray.map((slide, i) => (
                  <li
                    key={`slide-${baseId}-${i}`}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={i18n.slideLabel?.(i + 1, total)}
                    aria-hidden={
                      i < currentIndex || i >= currentIndex + slidesPerView
                        ? true
                        : undefined
                    }
                    className={[
                      slideWidthClasses[slidesPerView],
                      'shrink-0 perf-contain-content',
                    ].join(' ')}
                  >
                    {slide}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Previous arrow */}
          {showArrows && !loading && (
            <Button
              variant="outline"
              size={navSize}
              iconOnly
              disabled={!canGoPrev}
              onClick={prev}
              aria-label={i18n.previousSlide}
              className={[
                'absolute top-1/2 start-[var(--carousel-nav-inset)] -translate-y-1/2 z-10',
                'rounded-[var(--carousel-nav-radius)]',
              ].join(' ')}
            >
              <ChevronLeft size="var(--size-icon-md)" />
            </Button>
          )}

          {/* Next arrow */}
          {showArrows && !loading && (
            <Button
              variant="outline"
              size={navSize}
              iconOnly
              disabled={!canGoNext}
              onClick={next}
              aria-label={i18n.nextSlide}
              className={[
                'absolute top-1/2 end-[var(--carousel-nav-inset)] -translate-y-1/2 z-10',
                'rounded-[var(--carousel-nav-radius)]',
              ].join(' ')}
            >
              <ChevronRight size="var(--size-icon-md)" />
            </Button>
          )}

          {/* Controls row — autoplay toggle + dot indicators */}
          {(showDots || autoPlay) && !loading && total > 1 && (
            <div
              className={[
                'flex items-center justify-center',
                'gap-[var(--carousel-dot-gap)]',
                'py-[var(--carousel-dot-py)]',
              ].join(' ')}
            >
              {autoPlay && (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? i18n.pauseAutoPlay : i18n.resumeAutoPlay}
                  aria-pressed={isPlaying}
                  className={autoplayBtnClasses}
                >
                  <span aria-hidden="true">
                    {isPlaying ? (
                      <Pause size="var(--size-icon-sm)" />
                    ) : (
                      <Play size="var(--size-icon-sm)" />
                    )}
                  </span>
                </button>
              )}

              {showDots &&
                slideArray.map((_, i) => (
                  <button
                    key={`dot-${baseId}-${i}`}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={i18n.goToSlide?.(i + 1)}
                    aria-current={i === currentIndex ? 'true' : undefined}
                    className={[
                      dotBaseClasses,
                      i === currentIndex ? dotActiveClasses : dotInactiveClasses,
                    ].join(' ')}
                  />
                ))}
            </div>
          )}
        </section>
      );
    },
  ),
);

CarouselRoot.displayName = 'Carousel';

// ── Compound component assembly ───────────────────────────────────────────────
export const Carousel = Object.assign(CarouselRoot, {
  Slide: CarouselSlide,
});
