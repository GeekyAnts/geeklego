import type { HTMLAttributes, ReactNode } from 'react';
import type { AvatarI18nStrings } from '../../utils/i18n';

export type AvatarVariant = 'image' | 'initials' | 'icon' | 'fallback';
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarShape = 'circle' | 'rounded';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual variant. Defaults to 'fallback'. */
  variant?: AvatarVariant;
  /** Size of the avatar. Defaults to 'md'. */
  size?: AvatarSize;
  /** Shape of the avatar. Defaults to 'circle'. */
  shape?: AvatarShape;
  /** Image source URL. Used when variant is 'image'. */
  src?: string;
  /** Alt text for the image. Defaults to 'User avatar'. Pass empty string for decorative images. */
  alt?: string;
  /** Initials to display (1-2 characters). Used when variant is 'initials'. */
  initials?: string;
  /** Icon element to display. Used when variant is 'icon'. */
  icon?: ReactNode;
  /** Whether to show a border ring. */
  bordered?: boolean;
  /** When true, replaces the avatar with a shimmer skeleton circle placeholder. */
  loading?: boolean;
  /** Opt-in Schema.org ImageObject Microdata (image variant only). */
  schema?: boolean;
  /** Override localised strings for this instance. Context strings apply when omitted. */
  i18nStrings?: AvatarI18nStrings;
}
