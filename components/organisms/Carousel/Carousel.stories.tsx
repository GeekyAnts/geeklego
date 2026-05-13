import type { Meta, StoryObj } from '@storybook/react';
import { Carousel } from './Carousel';

const meta: Meta<typeof Carousel> = {
  title: 'Organisms/Carousel',
  component: Carousel,
  parameters: { layout: 'padded' },
  argTypes: {
    variant:       { control: 'select', options: ['default', 'loop'] },
    navigation:    { control: 'select', options: ['arrows', 'dots', 'both', 'none'] },
    size:          { control: 'select', options: ['sm', 'md', 'lg', 'full'] },
    slidesPerView: { control: 'select', options: [1, 2, 3] },
    autoPlay:      { control: 'boolean' },
    autoPlayInterval: { control: { type: 'number', min: 1000, max: 10000, step: 500 } },
    pauseOnHover:  { control: 'boolean' },
    loading:       { control: 'boolean' },
    label:         { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

// ── Slide helper ──────────────────────────────────────────────────────────────
const slides = [
  { bg: 'bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-800)]', label: 'Slide 1 — Brand gradient' },
  { bg: 'bg-gradient-to-br from-[var(--color-status-success)] to-[var(--color-brand-600)]', label: 'Slide 2 — Success gradient' },
  { bg: 'bg-gradient-to-br from-[var(--color-status-warning)] to-[var(--color-status-error)]', label: 'Slide 3 — Warm gradient' },
  { bg: 'bg-gradient-to-br from-[var(--color-text-secondary)] to-[var(--color-text-primary)]', label: 'Slide 4 — Neutral gradient' },
];

function SlideContent({ bg, label: slideLabel }: { bg: string; label: string }) {
  return (
    <div className={`${bg} w-full h-48 flex items-center justify-center rounded-[var(--carousel-radius)]`}>
      <span className="text-[var(--color-neutral-0)] text-body-lg font-semibold">{slideLabel}</span>
    </div>
  );
}

// 1 — Default ──────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    label: 'Featured content',
    variant: 'default',
    navigation: 'both',
    size: 'md',
    slidesPerView: 1,
  },
  render: (args) => (
    <div className="max-w-2xl">
      <Carousel {...args}>
        {slides.map((s) => (
          <Carousel.Slide key={s.label}>
            <SlideContent bg={s.bg} label={s.label} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  ),
};

// 2 — Variants ─────────────────────────────────────────────────────────────────
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] max-w-2xl">
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          variant="default" — navigation stops at first/last slide
        </p>
        <Carousel label="Default variant" variant="default" navigation="both">
          {slides.map((s) => (
            <Carousel.Slide key={s.label}>
              <SlideContent bg={s.bg} label={s.label} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          variant="loop" — wraps from last back to first
        </p>
        <Carousel label="Loop variant" variant="loop" navigation="both">
          {slides.map((s) => (
            <Carousel.Slide key={s.label}>
              <SlideContent bg={s.bg} label={s.label} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </div>
  ),
};

// 3 — Sizes ────────────────────────────────────────────────────────────────────
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] max-w-2xl">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
            size="{size}"
          </p>
          <Carousel label={`${size} carousel`} size={size} navigation="both">
            {slides.slice(0, 3).map((s) => (
              <Carousel.Slide key={s.label}>
                <SlideContent bg={s.bg} label={s.label} />
              </Carousel.Slide>
            ))}
          </Carousel>
        </div>
      ))}
    </div>
  ),
};

// 4 — States ───────────────────────────────────────────────────────────────────
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] max-w-2xl">
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          navigation="arrows"
        </p>
        <Carousel label="Arrows only" navigation="arrows">
          {slides.map((s) => (
            <Carousel.Slide key={s.label}>
              <SlideContent bg={s.bg} label={s.label} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          navigation="dots"
        </p>
        <Carousel label="Dots only" navigation="dots">
          {slides.map((s) => (
            <Carousel.Slide key={s.label}>
              <SlideContent bg={s.bg} label={s.label} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          navigation="none"
        </p>
        <Carousel label="No controls" navigation="none">
          {slides.map((s) => (
            <Carousel.Slide key={s.label}>
              <SlideContent bg={s.bg} label={s.label} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          slidesPerView=2
        </p>
        <Carousel label="Two slides per view" navigation="both" slidesPerView={2}>
          {slides.map((s) => (
            <Carousel.Slide key={s.label}>
              <SlideContent bg={s.bg} label={s.label} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          autoPlay — with pause/resume control
        </p>
        <Carousel label="Autoplay carousel" navigation="both" autoPlay autoPlayInterval={2000}>
          {slides.map((s) => (
            <Carousel.Slide key={s.label}>
              <SlideContent bg={s.bg} label={s.label} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
          loading=true
        </p>
        <Carousel label="Loading carousel" loading>
          {slides.map((s) => (
            <Carousel.Slide key={s.label}>
              <SlideContent bg={s.bg} label={s.label} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </div>
  ),
};

// 5 — DarkMode ─────────────────────────────────────────────────────────────────
export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <Carousel label="Dark mode carousel" navigation="both" variant="loop">
        {slides.map((s) => (
          <Carousel.Slide key={s.label}>
            <SlideContent bg={s.bg} label={s.label} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  ),
};

// 7 — Playground ───────────────────────────────────────────────────────────────
export const Playground: Story = {
  args: {
    label: 'Playground carousel',
    variant: 'default',
    navigation: 'both',
    size: 'md',
    slidesPerView: 1,
    autoPlay: false,
    autoPlayInterval: 4000,
    pauseOnHover: true,
    loading: false,
  },
  render: (args) => (
    <div className="max-w-2xl">
      <Carousel {...args}>
        {slides.map((s) => (
          <Carousel.Slide key={s.label}>
            <SlideContent bg={s.bg} label={s.label} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  ),
};

// 8 — Accessibility ────────────────────────────────────────────────────────────
export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)] max-w-2xl">
      {/*
        Keyboard: Tab → focuses carousel section → ArrowLeft/ArrowRight navigates slides
                  Tab → Previous / Next buttons (Enter/Space to activate)
                  Tab → Dot indicators (Enter/Space to jump to slide)
                  Tab → Autoplay toggle (Enter/Space to pause/resume)
        Screen reader: "Featured products, carousel" (section)
                       "1 of 4, slide group" (each visible slide)
                       "Previous slide, button" / "Next slide, button"
                       "Go to slide 2, button" (dot indicators)
                       "Pause auto-play, toggle button, pressed" (autoplay)
      */}
      <p className="text-body-sm text-[var(--color-text-secondary)]">
        Navigate with ArrowLeft / ArrowRight when the carousel is focused.
        Tab into individual controls.
      </p>

      {/* Default: all controls accessible */}
      <Carousel
        label="Featured products"
        navigation="both"
        variant="loop"
        i18nStrings={{
          previousSlide: 'Previous slide',
          nextSlide: 'Next slide',
          goToSlide: (n) => `Go to slide ${n}`,
          slideLabel: (n, total) => `${n} of ${total}`,
        }}
      >
        {slides.map((s) => (
          <Carousel.Slide key={s.label}>
            <SlideContent bg={s.bg} label={s.label} />
          </Carousel.Slide>
        ))}
      </Carousel>

      {/* With autoplay — pause/resume exposed via aria-pressed */}
      <Carousel
        label="Auto-advancing announcements"
        navigation="both"
        autoPlay
        autoPlayInterval={3000}
        i18nStrings={{
          pauseAutoPlay: 'Pause auto-play',
          resumeAutoPlay: 'Resume auto-play',
        }}
      >
        {slides.map((s) => (
          <Carousel.Slide key={s.label}>
            <SlideContent bg={s.bg} label={s.label} />
          </Carousel.Slide>
        ))}
      </Carousel>

      {/* Loading state — aria-busy communicated via getLoadingProps */}
      <Carousel label="Loading carousel" loading aria-busy>
        {slides.map((s) => (
          <Carousel.Slide key={s.label}>
            <SlideContent bg={s.bg} label={s.label} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  ),
};
