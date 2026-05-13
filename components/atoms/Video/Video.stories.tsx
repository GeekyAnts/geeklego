import type { Meta, StoryObj } from '@storybook/react';
import { Video } from './Video';

// ── Demo video sources (open-license clips) ────────────────────────────────

const MP4_SRC = 'https://www.w3schools.com/html/mov_bbb.mp4';
const WEBM_SRC = 'https://www.w3schools.com/html/mov_bbb.webm';
const OGG_SRC = 'https://www.w3schools.com/html/mov_bbb.ogg';
const POSTER_SRC = 'https://www.w3schools.com/html/img_chania.jpg';

const meta: Meta<typeof Video> = {
  title: 'Atoms/Video',
  component: Video,
  tags: ['autodocs'],
  argTypes: {
    ratio:    { control: 'select', options: ['16/9', '4/3', '1/1', '21/9'] },
    preload:  { control: 'select', options: ['none', 'metadata', 'auto'] },
    rounded:  { control: 'boolean' },
    bordered: { control: 'boolean' },
    controls: { control: 'boolean' },
    autoPlay: { control: 'boolean' },
    loop:     { control: 'boolean' },
    muted:    { control: 'boolean' },
    schema:   { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Video>;

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    src: MP4_SRC,
    poster: POSTER_SRC,
    ratio: '16/9',
    controls: true,
    rounded: true,
    bordered: false,
    caption: 'Big Buck Bunny — open-license demo clip',
  },
};

export const Variants: Story = {
  name: 'Aspect Ratios',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-md)]">
      {(['16/9', '4/3', '1/1', '21/9'] as const).map((ratio) => (
        <div key={ratio} className="flex flex-col gap-[var(--spacing-component-xs)]">
          <span className="text-label-sm text-[var(--color-text-secondary)]">
            ratio="{ratio}"
          </span>
          <Video
            src={MP4_SRC}
            poster={POSTER_SRC}
            ratio={ratio}
            controls
            style={{ maxWidth: 480 }}
          />
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  name: 'Multi-Source with Tracks',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-xs)]" style={{ maxWidth: 600 }}>
      <span className="text-label-sm text-[var(--color-text-secondary)]">
        Multiple codec sources + caption track
      </span>
      <Video
        sources={[
          { src: MP4_SRC,  type: 'video/mp4' },
          { src: WEBM_SRC, type: 'video/webm' },
          { src: OGG_SRC,  type: 'video/ogg' },
        ]}
        poster={POSTER_SRC}
        tracks={[
          {
            src: '/captions/en.vtt',
            kind: 'captions',
            srcLang: 'en',
            label: 'English',
            default: true,
          },
          {
            src: '/captions/fr.vtt',
            kind: 'subtitles',
            srcLang: 'fr',
            label: 'Français',
          },
        ]}
        caption="Multi-format with WebVTT caption tracks (en, fr)"
        controls
        rounded
      />
    </div>
  ),
};

export const States: Story = {
  name: 'Display Variants',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-md)]" style={{ maxWidth: 520 }}>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-label-sm text-[var(--color-text-secondary)]">Rounded + bordered</span>
        <Video src={MP4_SRC} poster={POSTER_SRC} rounded bordered controls />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-label-sm text-[var(--color-text-secondary)]">No radius (rounded=false)</span>
        <Video src={MP4_SRC} poster={POSTER_SRC} rounded={false} controls />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-label-sm text-[var(--color-text-secondary)]">No controls — ambient / background video</span>
        <Video
          src={MP4_SRC}
          poster={POSTER_SRC}
          controls={false}
          autoPlay
          muted
          loop
          playsInline
          rounded
          aria-label="Background ambience video — no audio"
        />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-label-sm text-[var(--color-text-secondary)]">With caption</span>
        <Video src={MP4_SRC} poster={POSTER_SRC} controls rounded caption="A sample caption providing context for the video content." />
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="p-[var(--spacing-layout-sm)] bg-[var(--color-bg-primary)] max-w-2xl rounded-[var(--radius-component-lg)]"
    >
      <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
        <span className="text-label-sm text-[var(--color-text-secondary)]">Dark mode</span>
        <Video
          src={MP4_SRC}
          poster={POSTER_SRC}
          controls
          rounded
          bordered
          caption="Dark mode video with caption and border"
        />
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    src: MP4_SRC,
    poster: POSTER_SRC,
    ratio: '16/9',
    controls: true,
    autoPlay: false,
    loop: false,
    muted: false,
    playsInline: false,
    rounded: true,
    bordered: false,
    caption: 'Playground caption',
    preload: 'metadata',
    schema: false,
  },
};

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-md)]" style={{ maxWidth: 560 }}>
      {/* Explicit aria-label on the figure landmark */}
      <Video
        src={MP4_SRC}
        poster={POSTER_SRC}
        aria-label="Product demo: how to set up your account in under 2 minutes"
        controls
        rounded
        caption="Account setup walkthrough"
        tracks={[
          {
            src: '/captions/en.vtt',
            kind: 'captions',
            srcLang: 'en',
            label: 'English captions',
            default: true,
          },
        ]}
      />

      {/* Background / ambient video — role communicated via aria-label */}
      <Video
        src={MP4_SRC}
        aria-label="Decorative background animation — no audio, no information conveyed"
        controls={false}
        autoPlay
        muted
        loop
        playsInline
        rounded
      />
    </div>
  ),
};
