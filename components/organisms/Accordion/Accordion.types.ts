import type { ReactNode } from 'react';

export type AccordionVariant = 'default' | 'bordered' | 'flush';
export type AccordionSize = 'sm' | 'md' | 'lg';
export type AccordionMode = 'single' | 'multiple';
export type AccordionHeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface AccordionI18nStrings {
  /** SR-only hint appended to trigger text when item is collapsed. Default: "Expand" */
  expandLabel?: string;
  /** SR-only hint appended to trigger text when item is expanded. Default: "Collapse" */
  collapseLabel?: string;
}

export interface AccordionItem {
  /** Unique identifier — used as key and open-state reference. */
  id: string;
  /** Visible title rendered inside the trigger button. Consumer-supplied. */
  title: string;
  /** Panel body content. Can be any ReactNode. */
  content: ReactNode;
  /** When true the item cannot be expanded or collapsed. */
  disabled?: boolean;
}

export interface AccordionProps {
  /** Items to render — each produces a heading + trigger + panel triple. */
  items: AccordionItem[];
  /** Visual style variant. Default: 'default' */
  variant?: AccordionVariant;
  /** Single-expand or multi-expand mode. Default: 'single' */
  mode?: AccordionMode;
  /** Spacing and icon scale. Default: 'md' */
  size?: AccordionSize;
  /**
   * Controlled open state — array of open item ids.
   * Pair with `onChange` to keep external state in sync.
   */
  openItems?: string[];
  /**
   * Initially open items for uncontrolled usage.
   * Ignored when `openItems` is provided.
   */
  defaultOpenItems?: string[];
  /** Fires when open state changes. Receives the new array of open item ids. */
  onChange?: (openItems: string[]) => void;
  /**
   * HTML heading element to wrap each trigger button.
   * Default: 'h3'. Override when Accordion is nested inside a higher-level heading.
   */
  headingLevel?: AccordionHeadingLevel;
  /**
   * Enable Schema.org FAQPage + Question/Answer Microdata.
   * Each item pair gets itemScope/itemType for Question and Answer.
   * Default: false
   */
  schema?: boolean;
  /**
   * When true, renders skeleton placeholder items instead of content.
   * Use while items are loading from an async source.
   */
  loading?: boolean;
  /**
   * Number of skeleton placeholder items to show when `loading` is true.
   * Default: 3
   */
  loadingCount?: number;
  /** Override system strings (sr-only expand/collapse hints). */
  i18nStrings?: AccordionI18nStrings;
  /** Additional CSS class on the outer container element. */
  className?: string;
}
