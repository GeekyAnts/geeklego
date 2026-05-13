import type { FormHTMLAttributes } from 'react';
import type { ChatInputBarI18nStrings } from '../../utils/i18n';

export interface ChatInputBarProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Called with the trimmed message text when the user sends. */
  onSend?: (message: string) => void;
  /** Maximum character count. Shows no counter UI — only enforces via maxLength. */
  maxLength?: number;
  /** When true, renders the attachment icon button. Defaults to true. */
  showAttach?: boolean;
  /** Called when the attachment button is clicked. */
  onAttach?: () => void;
  /** Disables the entire form (textarea + send button). */
  disabled?: boolean;
  /** Override localised system strings. */
  i18nStrings?: ChatInputBarI18nStrings;
}
