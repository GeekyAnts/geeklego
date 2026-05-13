import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export type StackDirection = 'row' | 'column';
export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** Flex direction. Defaults to 'column'. */
  direction?: StackDirection;
  /** Gap between children using responsive layout spacing tokens. Defaults to 'md'. */
  gap?: StackGap;
  /** align-items value. Defaults to 'stretch'. */
  align?: StackAlign;
  /** justify-content value. Defaults to 'start'. */
  justify?: StackJustify;
  /** Allow children to wrap onto multiple lines. Defaults to false. */
  wrap?: boolean;
  /** Use inline-flex instead of flex. Defaults to false. */
  inline?: boolean;
  /** Root element type for semantic override (e.g. 'ul', 'section', 'nav'). Defaults to 'div'. */
  as?: ElementType;
  children?: ReactNode;
}
