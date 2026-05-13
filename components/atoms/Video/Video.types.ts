import type { HTMLAttributes } from 'react';

export type VideoRatio = '16/9' | '4/3' | '1/1' | '21/9';
export type VideoPreload = 'none' | 'metadata' | 'auto';
export type VideoTrackKind = 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';

export interface VideoSource {
  /** URL of the video file. */
  src: string;
  /** MIME type of the video file (e.g. 'video/mp4', 'video/webm'). */
  type: string;
}

export interface VideoTrack {
  /** URL of the WebVTT track file. */
  src: string;
  /** Track kind — determines how the track is used. */
  kind: VideoTrackKind;
  /** BCP-47 language tag for the track (e.g. 'en', 'fr'). */
  srcLang?: string;
  /** Human-readable label shown in the browser's subtitle menu. */
  label?: string;
  /** Whether this track is enabled by default. */
  default?: boolean;
}

export interface VideoProps extends Omit<HTMLAttributes<HTMLElement>, 'onError'> {
  /** Single video source URL. Use `sources` for multi-format fallback. */
  src?: string;
  /** Multiple sources for codec fallback (mp4, webm, ogg). Preferred over `src`. */
  sources?: VideoSource[];
  /** Poster image URL displayed before the video plays. */
  poster?: string;
  /** Aspect ratio of the video container. Defaults to '16/9'. */
  ratio?: VideoRatio;
  /** Show native browser controls. Defaults to true. */
  controls?: boolean;
  /** Autoplay on mount. Must be paired with `muted={true}` per browser policy. */
  autoPlay?: boolean;
  /** Loop playback. Defaults to false. */
  loop?: boolean;
  /** Mute audio. Required when `autoPlay` is true. Defaults to false. */
  muted?: boolean;
  /** Inline playback on mobile (prevents fullscreen on iOS). Defaults to false. */
  playsInline?: boolean;
  /** Preload behaviour. Defaults to 'metadata'. */
  preload?: VideoPreload;
  /** Caption/subtitle/description tracks for WCAG 1.2.2 compliance. */
  tracks?: VideoTrack[];
  /** Visible caption rendered in <figcaption>. Also used as Schema.org `name`. */
  caption?: string;
  /** Apply corner radius. Defaults to true. */
  rounded?: boolean;
  /** Show a 1px border around the container. Defaults to false. */
  bordered?: boolean;
  /** Accessible label for the video landmark. Falls back to `caption` if omitted. */
  'aria-label'?: string;
  /** Emit Schema.org VideoObject Microdata. Defaults to false. */
  schema?: boolean;
}
