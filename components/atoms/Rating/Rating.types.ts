import type { HTMLAttributes } from 'react';
import type { RatingI18nStrings } from '../../utils/i18n';

export type RatingSize = 'sm' | 'md' | 'lg';

export interface RatingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Current rating value (1–`max`). Pass `0` to indicate no rating selected.
   * Defaults to `0`.
   */
  value?: number;
  /**
   * Called when the user selects a star. Receives the clicked star value (1–`max`).
   * Required for interactive mode; ignored when `readOnly` is true.
   */
  onChange?: (value: number) => void;
  /**
   * Total number of stars. Defaults to `5`.
   */
  max?: number;
  /**
   * Star icon size. Defaults to `'md'`.
   */
  size?: RatingSize;
  /**
   * When true, renders a static display (`<span role="img">`) instead of a
   * radio-group control. No hover or selection interaction. Defaults to `false`.
   */
  readOnly?: boolean;
  /**
   * Disables all interaction. Stars are muted. Fieldset `disabled` is set,
   * so all contained radio inputs are disabled at the browser level. Defaults to `false`.
   */
  disabled?: boolean;
  /**
   * Accessible label for the radio group `<legend>`. Always present for screen
   * readers. Defaults to `'Rating'`.
   */
  label?: string;
  /**
   * When true, renders the `<legend>` visibly above the stars. When false (default),
   * the legend is visually hidden (`sr-only`) but still read by screen readers.
   */
  showLabel?: boolean;
  /**
   * `name` attribute for the radio group. Use when the Rating is inside a `<form>`
   * to ensure the value is submitted. Auto-generated via `useId()` when omitted.
   */
  name?: string;
  /**
   * Opt-in Schema.org `AggregateRating` Microdata. Only active when `readOnly={true}`.
   * Adds `itemScope`/`itemType` to the container and `<meta>` tags for
   * `ratingValue` and `bestRating`. Defaults to `false`.
   */
  schema?: boolean;
  /** Override localised strings for this instance. Context strings apply when omitted. */
  i18nStrings?: RatingI18nStrings;
}
