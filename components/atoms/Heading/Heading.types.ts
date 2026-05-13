import type { HTMLAttributes, ReactNode } from 'react';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingSize  = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
export type HeadingColor = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'inverse';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * The rendered HTML heading element. Sets the semantic level in the document
   * outline. Defaults to 'h2'.
   */
  as?: HeadingLevel;
  /**
   * Visual typography size. Decoupled from the semantic `as` element so the
   * visual hierarchy can differ from the document outline (e.g. an `<h3>`
   * styled to look like an `<h1>`). Defaults to match `as`; h6 maps to h5
   * visually since no distinct h6 type scale exists.
   */
  size?: HeadingSize;
  /**
   * When true, applies a responsive typography class that scales the font size
   * down on smaller viewports. Responsive variants exist for h1–h4; h5 always
   * uses its static class. Defaults to false.
   */
  responsive?: boolean;
  /**
   * Text colour drawn from the semantic colour palette. Defaults to 'primary'.
   */
  color?: HeadingColor;
  children: ReactNode;
}
