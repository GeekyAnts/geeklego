import type { ReactElement, ReactNode } from 'react';

export type PopoverPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end'
  | 'left-start'
  | 'left-end'
  | 'right-start'
  | 'right-end';

export interface PopoverI18nStrings {
  /** aria-label for the close (×) button. Default: "Close" */
  closeLabel?: string;
}

export interface PopoverProps {
  /**
   * The element that triggers the popover open/close.
   * ARIA props (aria-expanded, aria-controls, aria-haspopup="dialog") are injected
   * automatically via cloneElement. Accepts any valid React element.
   */
  trigger: ReactElement;
  /** Content displayed inside the popover body. */
  children: ReactNode;
  /** Optional title rendered in a header above the body. When provided, the panel gains aria-labelledby. */
  title?: string;
  /**
   * Heading element for the title. Defaults to 'h3' (contextually appropriate for L2 molecules).
   * Override when nesting inside an organism with a different heading hierarchy.
   */
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /**
   * Show a close (×) button in the header when `title` is provided.
   * Defaults to true. Has no effect when `title` is omitted.
   */
  showCloseButton?: boolean;
  /** Optional content rendered in a footer below the body, separated by a divider. */
  footerContent?: ReactNode;
  /** Placement of the panel relative to the trigger. Defaults to 'bottom-start'. */
  placement?: PopoverPlacement;
  /** Controlled open state. Pair with onOpenChange for full control. */
  open?: boolean;
  /** Callback fired when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Additional className on the root wrapper element. */
  className?: string;
  /** i18n string overrides for system-generated strings. */
  i18nStrings?: PopoverI18nStrings;
}
