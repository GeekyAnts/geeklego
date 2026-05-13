import type { HTMLAttributes, ReactNode } from 'react';
import type { ChatHeaderI18nStrings } from '../../utils/i18n';

export type ChatHeaderStatus = 'online' | 'away' | 'offline';

export interface ChatHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Display name of the conversation participant. */
  name: string;
  /** Online presence status. Controls status dot color and accessible label. Defaults to 'offline'. */
  status?: ChatHeaderStatus;
  /** Avatar image URL for the participant. */
  avatarSrc?: string;
  /** Initials for the fallback avatar (up to 2 characters). */
  avatarInitials?: string;
  /** Slot for action buttons (e.g. call, info, close). Renders end-aligned. */
  actions?: ReactNode;
  /** Override localised system strings. */
  i18nStrings?: ChatHeaderI18nStrings;
}
