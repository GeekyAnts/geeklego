# Video

A semantic, accessible `<video>` embed component. Wraps the native HTML video element in a `<figure>` container with aspect-ratio enforcement, multi-source codec fallback, WebVTT caption track support, and optional Schema.org `VideoObject` microdata.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — | Single video source URL. Use `sources` for multi-format fallback. |
| `sources` | `VideoSource[]` | — | Multiple codec sources (mp4, webm, ogg). Preferred over `src`. |
| `poster` | `string` | — | Poster image URL shown before playback. |
| `ratio` | `VideoRatio` | `'16/9'` | Aspect ratio of the container. |
| `controls` | `boolean` | `true` | Show native browser playback controls. |
| `autoPlay` | `boolean` | `false` | Autoplay on mount. Forces `muted` to `true` per browser policy. |
| `loop` | `boolean` | `false` | Loop playback. |
| `muted` | `boolean` | `false` | Mute audio. Required when `autoPlay` is true. |
| `playsInline` | `boolean` | `false` | Prevent fullscreen on iOS; play inline in the page. |
| `preload` | `VideoPreload` | `'metadata'` | Browser preload hint. |
| `tracks` | `VideoTrack[]` | — | WebVTT tracks for captions, subtitles, and descriptions. |
| `caption` | `string` | — | Visible caption in `<figcaption>`. Used as Schema.org `name`. |
| `rounded` | `boolean` | `true` | Apply `--video-radius` corner radius. |
| `bordered` | `boolean` | `false` | Apply a 1px border around the container. |
| `aria-label` | `string` | `caption` | Accessible label for the video landmark. Falls back to `caption`. |
| `schema` | `boolean` | `false` | Emit Schema.org `VideoObject` microdata. |

### VideoSource

| Field | Type | Description |
|---|---|---|
| `src` | `string` | URL of the video file. |
| `type` | `string` | MIME type (e.g. `'video/mp4'`). |

### VideoTrack

| Field | Type | Description |
|---|---|---|
| `src` | `string` | URL of the WebVTT file. |
| `kind` | `VideoTrackKind` | `'captions'`, `'subtitles'`, `'descriptions'`, `'chapters'`, `'metadata'` |
| `srcLang` | `string?` | BCP-47 language tag (e.g. `'en'`). |
| `label` | `string?` | Human-readable label in the browser's subtitle menu. |
| `default` | `boolean?` | Enable this track by default. |

---

## Tokens Used

| Token | Purpose |
|---|---|
| `--video-bg` | Placeholder background (visible before video loads / no poster) |
| `--video-border-color` | Optional 1px border color |
| `--video-border-width` | Border thickness (`var(--border-media)`) |
| `--video-radius` | Corner radius when `rounded={true}` |
| `--video-min-width` | Minimum container width |
| `--video-ratio-16-9` | Aspect ratio constant 16/9 |
| `--video-ratio-4-3` | Aspect ratio constant 4/3 |
| `--video-ratio-1-1` | Aspect ratio constant 1/1 |
| `--video-ratio-21-9` | Aspect ratio constant 21/9 |
| `--video-caption-color` | Caption text color |
| `--video-caption-gap` | Space between video and caption |
| `--video-caption-overflow` | Caption overflow behaviour |
| `--video-caption-lines` | Caption line clamp (2 lines) |

---

## Variants

### Aspect Ratios

| Value | Ratio | Use case |
|---|---|---|
| `'16/9'` (default) | 16∶9 | Standard widescreen video |
| `'4/3'` | 4∶3 | Legacy / presentation video |
| `'1/1'` | 1∶1 | Square social / story |
| `'21/9'` | 21∶9 | Cinematic ultra-wide |

---

## States

| State | How to trigger |
|---|---|
| With caption | Pass `caption` prop |
| Bordered | `bordered={true}` |
| No radius | `rounded={false}` |
| Ambient / background | `controls={false} autoPlay muted loop playsInline` |
| With tracks | Pass `tracks` array with at least one `kind="captions"` track |

---

## Accessibility

### Semantic structure

- **`<figure>`** — wraps the media unit; receives `aria-label` and optional Schema.org `itemscope`
- **`<video>`** — native element; also receives `aria-label` so screen readers can identify it
- **`<figcaption>`** — visible text description; renders only when `caption` is provided
- **`<track kind="captions">`** — required for WCAG 1.2.2 (Captions — Prerecorded)

### ARIA attributes

| Attribute | Element | Notes |
|---|---|---|
| `aria-label` | `<figure>` + `<video>` | Required. Provide an explicit `aria-label` or `caption` prop. |

### WCAG compliance

| Criterion | How it is met |
|---|---|
| **1.2.2 Captions (Prerecorded)** | Pass `tracks` with at least one `kind="captions"` entry for any video with dialogue or audio information |
| **1.2.5 Audio Description (Prerecorded)** | Pass a `tracks` entry with `kind="descriptions"` for video with visual-only information |
| **2.1.1 Keyboard** | Native `<video controls>` is fully keyboard-navigable |
| **4.1.2 Name, Role, Value** | `aria-label` on both `<figure>` and `<video>`; native `<track>` exposes caption state |

### Best practice: ambient / background video

When `autoPlay` is used without controls (decorative background video), provide an `aria-label` explicitly stating that the video is decorative and conveys no information:

```tsx
<Video
  src="/bg-loop.mp4"
  controls={false}
  autoPlay
  muted
  loop
  playsInline
  aria-label="Decorative background animation — no audio, no information conveyed"
/>
```

---

## Schema.org

Add `schema={true}` to emit **VideoObject** microdata.

| Attribute | Element | Schema.org property |
|---|---|---|
| `itemScope` `itemType="…/VideoObject"` | `<figure>` | Declares the entity |
| `<meta itemProp="contentUrl">` | Hidden `<meta>` | First source URL |
| `<meta itemProp="thumbnailUrl">` | Hidden `<meta>` | Poster image URL |
| `itemProp="name"` | `<figcaption>` | Video title |

```tsx
<Video
  sources={[{ src: '/product-demo.mp4', type: 'video/mp4' }]}
  poster="/product-demo-poster.jpg"
  caption="Product demo: 2-minute account setup guide"
  controls
  schema
/>
```

---

## Usage

### Basic usage

```tsx
import { Video } from '@geeklego/ui/components/atoms/Video';

<Video
  src="/intro.mp4"
  poster="/intro-poster.jpg"
  controls
  caption="Product introduction video"
/>
```

### Multi-source with caption tracks

```tsx
<Video
  sources={[
    { src: '/intro.mp4',  type: 'video/mp4' },
    { src: '/intro.webm', type: 'video/webm' },
  ]}
  poster="/intro-poster.jpg"
  tracks={[
    { src: '/captions/en.vtt', kind: 'captions', srcLang: 'en', label: 'English', default: true },
    { src: '/captions/fr.vtt', kind: 'subtitles', srcLang: 'fr', label: 'Français' },
  ]}
  caption="Introduction — click CC to toggle captions"
  controls
  rounded
/>
```

### Ambient background video

```tsx
<Video
  src="/hero-bg.mp4"
  controls={false}
  autoPlay
  muted
  loop
  playsInline
  ratio="21/9"
  rounded={false}
  aria-label="Decorative animated background — no meaningful content"
/>
```
