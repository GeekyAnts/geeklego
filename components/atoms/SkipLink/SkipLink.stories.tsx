import type { Meta, StoryObj } from '@storybook/react';
import { SkipLink } from './SkipLink';
import type { SkipLinkSize } from './SkipLink.types';

const meta: Meta<typeof SkipLink> = {
  title: 'Atoms/SkipLink',
  component: SkipLink,
  tags: ['autodocs'],
  parameters: {
    // 'padded' keeps the top-left corner visible for the absolute positioning
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'] satisfies SkipLinkSize[],
      description: 'Height, padding, and typography scale',
    },
    forceVisible: {
      control: 'boolean',
      description:
        'Forces visible state — for Storybook/testing only. Never use in production.',
    },
    href: {
      control: 'text',
      description: 'Target landmark fragment id (e.g. "#main-content")',
    },
    children: {
      control: 'text',
      description: 'Label text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SkipLink>;

// ─── 1. Default ────────────────────────────────────────────────────────────

/**
 * Visually hidden by default. Tab into the preview to see the link slide into
 * view. `forceVisible` is on so the appearance is immediately visible here.
 */
export const Default: Story = {
  render: () => (
    <div className="relative h-20 flex items-center justify-center rounded-[var(--radius-component-lg)] bg-[var(--color-bg-secondary)] px-[var(--spacing-component-lg)]">
      <SkipLink href="#default-main" forceVisible>
        Skip to main content
      </SkipLink>
      <span className="text-body-sm text-[var(--color-text-tertiary)]">
        Tab here to reveal the skip link
      </span>
      <main id="default-main" tabIndex={-1} className="sr-only">
        Main content
      </main>
    </div>
  ),
};

// ─── 2. Variants ───────────────────────────────────────────────────────────

/**
 * A page can have multiple skip links pointing to different landmarks.
 * Place all skip links as the very first focusable elements in the DOM,
 * before `<header>` or `<nav>`.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-sm)]">
      <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
        Multiple skip links — each targeting a different landmark
      </p>
      <div className="relative h-12 flex items-center rounded-[var(--radius-component-sm)] bg-[var(--color-bg-tertiary)]">
        <SkipLink href="#variants-main" forceVisible>
          Skip to main content
        </SkipLink>
      </div>
      <div className="relative h-12 flex items-center rounded-[var(--radius-component-sm)] bg-[var(--color-bg-tertiary)]">
        <SkipLink href="#variants-nav" forceVisible>
          Skip to navigation
        </SkipLink>
      </div>
      <div className="relative h-12 flex items-center rounded-[var(--radius-component-sm)] bg-[var(--color-bg-tertiary)]">
        <SkipLink href="#variants-search" forceVisible>
          Skip to search
        </SkipLink>
      </div>
      <div className="relative h-12 flex items-center rounded-[var(--radius-component-sm)] bg-[var(--color-bg-tertiary)]">
        <SkipLink href="#variants-footer" forceVisible>
          Skip to footer
        </SkipLink>
      </div>
      {/* Landmark targets */}
      <main id="variants-main" tabIndex={-1} className="sr-only">Main</main>
      <nav id="variants-nav" tabIndex={-1} className="sr-only">Nav</nav>
      <section id="variants-search" tabIndex={-1} className="sr-only">Search</section>
      <footer id="variants-footer" tabIndex={-1} className="sr-only">Footer</footer>
    </div>
  ),
};

// ─── 3. Sizes ──────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="relative flex flex-col gap-[var(--spacing-layout-xs)]">
      {(['sm', 'md'] as SkipLinkSize[]).map((size) => (
        <div key={size} className="flex flex-col gap-[var(--spacing-component-xs)]">
          <span className="text-body-sm text-[var(--color-text-tertiary)] font-medium">{size}</span>
          <SkipLink href="#sizes-main" size={size} forceVisible>
            Skip to main content
          </SkipLink>
        </div>
      ))}
      <main id="sizes-main" tabIndex={-1} className="sr-only">Main</main>
    </div>
  ),
};

// ─── 4. States ─────────────────────────────────────────────────────────────

/**
 * The skip link has two visual states: hidden (default) and visible (on focus).
 * The hidden state is shown with an overflow-hidden container to simulate the
 * off-screen positioning. The visible state uses `forceVisible`.
 */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Hidden (default) — off-screen above container
        </span>
        <div className="relative h-10 overflow-hidden rounded-[var(--radius-component-md)] bg-[var(--color-bg-secondary)]">
          <SkipLink href="#states-main">Skip to main content</SkipLink>
          <span className="absolute inset-0 flex items-center justify-center text-body-sm text-[var(--color-text-tertiary)]">
            Link is hidden above
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Visible on focus (forceVisible) — size md
        </span>
        <div className="relative h-10">
          <SkipLink href="#states-main" size="md" forceVisible>
            Skip to main content
          </SkipLink>
        </div>
      </div>

      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Visible on focus (forceVisible) — size sm
        </span>
        <div className="relative h-10">
          <SkipLink href="#states-main" size="sm" forceVisible>
            Skip to main content
          </SkipLink>
        </div>
      </div>

      <main id="states-main" tabIndex={-1} className="sr-only">Main</main>
    </div>
  ),
};

// ─── 5. DarkMode ───────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="bg-primary rounded-[var(--radius-component-lg)] p-[var(--spacing-layout-xs)] max-w-2xl"
    >
      <div className="relative flex flex-col gap-[var(--spacing-component-md)]">
        <p className="text-body-sm text-[var(--color-text-secondary)]">
          Skip links in dark mode
        </p>
        <SkipLink href="#dark-main" forceVisible>
          Skip to main content
        </SkipLink>
        <SkipLink href="#dark-nav" size="sm" forceVisible>
          Skip to navigation
        </SkipLink>
        <main id="dark-main" tabIndex={-1} className="sr-only">Main</main>
        <nav id="dark-nav" tabIndex={-1} className="sr-only">Nav</nav>
      </div>
    </div>
  ),
};

// ─── 7. Playground ─────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    href: '#main-content',
    size: 'md',
    forceVisible: true,
    children: 'Skip to main content',
  },
};

// ─── 8. I18n ───────────────────────────────────────────────────────────────

/**
 * The skip link label is i18n-enabled via the `i18nStrings` prop.
 * The default label is resolved through `useComponentI18n()`.
 * Pass custom labels to override the default for different landmark targets.
 */
export const I18n: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
      <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
        Custom labels via i18nStrings prop (simulating localization):
      </p>
      <div className="relative flex flex-col gap-[var(--spacing-component-sm)]">
        <div className="relative h-10">
          <SkipLink
            href="#i18n-main"
            forceVisible
            i18nStrings={{ label: 'Passer au contenu principal' }}
          />
        </div>
        <div className="relative h-10">
          <SkipLink
            href="#i18n-nav"
            size="sm"
            forceVisible
            i18nStrings={{ label: 'Passer à la navigation' }}
          />
        </div>
      </div>
      <main id="i18n-main" tabIndex={-1} className="sr-only">Main</main>
      <nav id="i18n-nav" tabIndex={-1} className="sr-only">Nav</nav>
    </div>
  ),
};

// ─── 9. Accessibility ──────────────────────────────────────────────────────

/**
 * WCAG 2.1 SC 2.4.1 — Bypass Blocks (Level A).
 *
 * Keyboard: Tab to focus the skip link (it slides into view) · Enter to follow
 * the href and move focus to the target landmark.
 *
 * Screen reader: announces "[label text], link" from the text content.
 * No `aria-label` needed — the visible label IS the accessible name.
 *
 * Landmark targets use `tabIndex={-1}` so they receive programmatic focus
 * when the skip link is activated, even if they are not naturally focusable.
 */
export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] p-[var(--spacing-layout-xs)]">
      {/* Standard usage — tab to reveal */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">
          Tab to reveal skip link (WCAG 2.4.1 — Bypass Blocks):
        </span>
        <div className="relative h-10">
          <SkipLink href="#a11y-main">Skip to main content</SkipLink>
        </div>
      </div>

      {/* forceVisible — auditor / tester view */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">
          forceVisible=true — for accessibility audit tools:
        </span>
        <div className="relative h-10">
          <SkipLink href="#a11y-main" forceVisible>
            Skip to main content
          </SkipLink>
        </div>
      </div>

      {/* Multi-link pattern */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">
          Multi-link pattern — Tab navigates between each:
        </span>
        <div className="flex flex-col gap-[var(--spacing-component-xs)]">
          <div className="relative h-10">
            <SkipLink href="#a11y-main" forceVisible>
              Skip to main content
            </SkipLink>
          </div>
          <div className="relative h-10">
            <SkipLink href="#a11y-nav" size="sm" forceVisible>
              Skip to navigation
            </SkipLink>
          </div>
        </div>
      </div>

      {/* Landmark targets */}
      <main id="a11y-main" tabIndex={-1} className="sr-only">Main content</main>
      <nav id="a11y-nav" tabIndex={-1} className="sr-only">Navigation</nav>
    </div>
  ),
};
