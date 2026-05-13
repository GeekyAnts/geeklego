import type { HTMLAttributes } from 'react';

export type SkeletonVariant = 'text' | 'box' | 'circle';
export type SkeletonTextSize = 'sm' | 'md' | 'lg';
export type SkeletonCircleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface SkeletonI18nStrings {
  /** aria-label text for the loading placeholder. Defaults to 'Loading' */
  ariaLabel?: string;
}

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Shape of the placeholder. Defaults to 'text'. */
  variant?: SkeletonVariant;
  /** Height of each text line (text variant only). Defaults to 'md'. */
  size?: SkeletonTextSize;
  /** Diameter of the circle (circle variant only). Defaults to 'md'. */
  circleSize?: SkeletonCircleSize;
  /** Number of text lines to render (text variant only). Defaults to 1. */
  lines?: number;
  /** Optional explicit width override. Use token strings: 'var(--size-component-lg)'. */
  width?: string;
  /** Optional explicit height override. Use token strings: 'var(--skeleton-circle-xl)'. */
  height?: string;
  /** Whether to show the shimmer animation. Set to false for a static placeholder. Defaults to true. */
  animated?: boolean;
  /** Internationalization strings for system labels. Overrides defaults via `useComponentI18n()`. */
  i18nStrings?: SkeletonI18nStrings;
}
