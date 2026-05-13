import type { ImgHTMLAttributes, ReactNode } from 'react';

export type ImageRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ImageFit = 'cover' | 'contain' | 'fill' | 'none';
export type ImageAspectRatio = 'auto' | 'square' | 'video' | 'portrait' | 'landscape' | 'wide';

export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading' | 'onLoad' | 'onError'> {
  /** Image source URL. */
  src: string;
  /** Alt text. Required — pass empty string `""` for purely decorative images. */
  alt: string;
  /** Optional caption rendered below the image in a `<figcaption>`. */
  caption?: ReactNode;
  /** Border radius shape. Default: `'none'` */
  radius?: ImageRadius;
  /** CSS object-fit behaviour. Default: `'cover'` */
  fit?: ImageFit;
  /** Container aspect ratio. Default: `'auto'` (natural image size). */
  aspectRatio?: ImageAspectRatio;
  /** Show a 1px decorative border around the image. Default: `false` */
  bordered?: boolean;
  /** Content rendered in the error fallback slot. Defaults to an `ImageOff` icon. */
  fallback?: ReactNode;
  /** Native lazy loading hint. Default: `'lazy'` */
  loading?: 'lazy' | 'eager';
  /** Called when the image loads successfully. */
  onLoad?: () => void;
  /** Called when the image fails to load. */
  onError?: () => void;
}
