import type { Meta, StoryObj } from '@storybook/react';
import { Image } from './Image';

const meta: Meta<typeof Image> = {
  title: 'Atoms/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
    },
    fit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none'],
    },
    aspectRatio: {
      control: 'select',
      options: ['auto', 'square', 'video', 'portrait', 'landscape', 'wide'],
    },
    loading: {
      control: 'select',
      options: ['lazy', 'eager'],
    },
    bordered: { control: 'boolean' },
    caption: { control: 'text' },
    alt: { control: 'text' },
    src: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Image>;

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    alt: 'Mountain landscape at sunset',
    aspectRatio: 'video',
    radius: 'md',
    fit: 'cover',
    loading: 'eager',
  },
};

// ── 2. Variants (radius shapes) ───────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(['none', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((radius) => (
        <div key={radius} className="flex flex-col gap-2 items-center">
          <Image
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80"
            alt={`${radius} radius`}
            aspectRatio="square"
            radius={radius}
            fit="cover"
            loading="eager"
            className="w-24"
          />
          <span className="text-body-xs text-[var(--color-text-secondary)]">{radius}</span>
        </div>
      ))}
    </div>
  ),
};

// ── 3. Sizes (aspect ratios) ──────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-lg">
      {(['square', 'video', 'portrait', 'landscape', 'wide'] as const).map((ratio) => (
        <div key={ratio} className="flex flex-col gap-1">
          <span className="text-body-xs text-[var(--color-text-secondary)] font-medium">{ratio}</span>
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
            alt={`${ratio} aspect ratio`}
            aspectRatio={ratio}
            radius="md"
            fit="cover"
            loading="eager"
          />
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 items-start">
      {/* Loaded */}
      <div className="flex flex-col gap-2 w-40">
        <span className="text-body-xs text-[var(--color-text-secondary)]">Loaded</span>
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80"
          alt="Loaded image example"
          aspectRatio="square"
          radius="md"
          loading="eager"
        />
      </div>

      {/* Loading (simulated — will show skeleton briefly) */}
      <div className="flex flex-col gap-2 w-40">
        <span className="text-body-xs text-[var(--color-text-secondary)]">Loading</span>
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80"
          alt="Loading image example"
          aspectRatio="square"
          radius="md"
          loading="lazy"
        />
      </div>

      {/* Error */}
      <div className="flex flex-col gap-2 w-40">
        <span className="text-body-xs text-[var(--color-text-secondary)]">Error</span>
        <Image
          src="https://this-url-does-not-exist.invalid/image.jpg"
          alt="Broken image example"
          aspectRatio="square"
          radius="md"
        />
      </div>

      {/* Error with custom fallback */}
      <div className="flex flex-col gap-2 w-40">
        <span className="text-body-xs text-[var(--color-text-secondary)]">Custom fallback</span>
        <Image
          src="https://this-url-does-not-exist.invalid/image.jpg"
          alt="Custom fallback example"
          aspectRatio="square"
          radius="md"
          fallback={
            <span className="text-body-sm text-[var(--color-text-tertiary)]">No image</span>
          }
        />
      </div>

      {/* With caption */}
      <div className="flex flex-col gap-2 w-40">
        <span className="text-body-xs text-[var(--color-text-secondary)]">With caption</span>
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80"
          alt="Mountain peak at sunrise"
          aspectRatio="square"
          radius="md"
          loading="eager"
          caption="Mountain peak at sunrise"
        />
      </div>

      {/* Bordered */}
      <div className="flex flex-col gap-2 w-40">
        <span className="text-body-xs text-[var(--color-text-secondary)]">Bordered</span>
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80"
          alt="Bordered image example"
          aspectRatio="square"
          radius="md"
          loading="eager"
          bordered
        />
      </div>
    </div>
  ),
};

// ── 5. DarkMode ───────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="flex flex-wrap gap-4 items-start p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl">
      <Image
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
        alt="Mountain landscape"
        aspectRatio="video"
        radius="md"
        fit="cover"
        loading="eager"
        className="w-full"
      />
      <Image
        src="https://this-url-does-not-exist.invalid/image.jpg"
        alt="Error state in dark mode"
        aspectRatio="square"
        radius="md"
        className="w-32"
      />
      <Image
        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80"
        alt="Captioned image"
        aspectRatio="landscape"
        radius="md"
        loading="eager"
        caption="Scenic mountain view — dark theme"
        className="w-64"
      />
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    alt: 'Mountain landscape at sunset',
    aspectRatio: 'video',
    radius: 'md',
    fit: 'cover',
    bordered: false,
    loading: 'eager',
    caption: '',
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)] max-w-lg">
      {/* Meaningful image — alt text describes the content */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm font-medium">Meaningful image — descriptive alt text</span>
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
          alt="Snow-capped mountain peaks reflecting in a still alpine lake at sunset"
          aspectRatio="video"
          radius="md"
          loading="eager"
        />
      </div>

      {/* Decorative image — empty alt collapses it for screen readers */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm font-medium">Decorative image — empty alt (screen-reader hidden)</span>
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80"
          alt=""
          aspectRatio="landscape"
          radius="md"
          loading="eager"
          aria-hidden="true"
        />
      </div>

      {/* Image with semantic figure + figcaption */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm font-medium">Figure with caption — semantic HTML</span>
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80"
          alt="Rocky mountain peak piercing through a sea of clouds"
          aspectRatio="landscape"
          radius="md"
          loading="eager"
          caption="Rocky mountain peak at 4,200m — Swiss Alps"
        />
      </div>

      {/* Error state — accessible announcement */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm font-medium">Error state — screen reader announced via sr-only text</span>
        <Image
          src="https://this-url-does-not-exist.invalid/image.jpg"
          alt="Profile photo of Jane Smith"
          aspectRatio="square"
          radius="full"
          className="w-24"
        />
        <span className="text-body-xs text-[var(--color-text-secondary)]">
          On error: screen readers hear "Profile photo of Jane Smith — failed to load"
        </span>
      </div>
    </div>
  ),
};
