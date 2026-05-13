import type { HTMLAttributes, ReactNode } from 'react';

export type CarouselVariant = 'default' | 'loop';
export type CarouselNavigation = 'arrows' | 'dots' | 'both' | 'none';
export type CarouselSize = 'sm' | 'md' | 'lg' | 'full';
export type CarouselSlidesPerView = 1 | 2 | 3;

export interface CarouselI18nStrings {
  /** aria-label for the previous slide button. Default: "Previous slide" */
  previousSlide?: string;
  /** aria-label for the next slide button. Default: "Next slide" */
  nextSlide?: string;
  /**
   * aria-label template for each dot indicator button.
   * Default: (n) => `Go to slide ${n}`
   */
  goToSlide?: (n: number) => string;
  /**
   * aria-label and live-region text for each slide item.
   * Default: (n, total) => `${n} of ${total}`
   */
  slideLabel?: (n: number, total: number) => string;
  /** aria-label for the pause autoplay button. Default: "Pause auto-play" */
  pauseAutoPlay?: string;
  /** aria-label for the resume autoplay button. Default: "Resume auto-play" */
  resumeAutoPlay?: string;
}

export interface CarouselSlideProps {
  /** Slide content. */
  children: ReactNode;
  /** Additional className for the slide wrapper div. */
  className?: string;
}

export interface CarouselProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * Slide wrapping behaviour. 'loop' wraps from last slide back to first.
   * Defaults to 'default'.
   */
  variant?: CarouselVariant;
  /** Which navigation controls to render. Defaults to 'both'. */
  navigation?: CarouselNavigation;
  /** Control density / arrow button size. Defaults to 'md'. */
  size?: CarouselSize;
  /** Number of slides visible simultaneously. Defaults to 1. */
  slidesPerView?: CarouselSlidesPerView;
  /** Enable automatic slide advancement. Defaults to false. */
  autoPlay?: boolean;
  /** Interval in milliseconds between automatic slide advances. Defaults to 4000. */
  autoPlayInterval?: number;
  /** Pause autoplay when the cursor hovers over the carousel. Defaults to true. */
  pauseOnHover?: boolean;
  /** Show a loading skeleton in place of slide content. Defaults to false. */
  loading?: boolean;
  /**
   * Accessible label for the carousel region (`aria-label` on `<section>`).
   * Required — describes the carousel's purpose to screen readers.
   */
  label: string;
  /** Per-instance i18n string overrides. */
  i18nStrings?: CarouselI18nStrings;
  /** Slides — each direct child becomes one slide. Wrap in `<Carousel.Slide>` for consistent sizing. */
  children: ReactNode;
}
