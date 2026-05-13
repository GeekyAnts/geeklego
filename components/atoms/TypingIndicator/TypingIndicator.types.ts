import type { HTMLAttributes } from 'react';
import type { TypingIndicatorI18nStrings } from '../../utils/i18n';

export type { TypingIndicatorI18nStrings };

export interface TypingIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Name of the person currently typing. Used for the screen-reader accessible label. */
  name?: string;
  /** Override localised system strings for this instance. */
  i18nStrings?: TypingIndicatorI18nStrings;
}
