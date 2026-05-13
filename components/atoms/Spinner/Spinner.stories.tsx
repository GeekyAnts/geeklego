import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';
import type { SpinnerVariant, SpinnerSize } from './Spinner.types';

const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'inverse'] satisfies SpinnerVariant[],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'] satisfies SpinnerSize[],
    },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    label: 'Loading…',
  },
};

// ── 2. Variants ───────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {/* default */}
      <div className="flex flex-col gap-2 items-start">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          default — accent arc + faint ring track
        </span>
        <div className="flex items-center gap-4 p-4 rounded-lg bg-[var(--color-bg-secondary)]">
          <Spinner variant="default" size="md" />
          <span className="text-body-sm text-[var(--color-text-secondary)]">
            Standard loading indicator. Accent arc on a neutral ring track.
          </span>
        </div>
      </div>

      {/* inverse */}
      <div className="flex flex-col gap-2 items-start">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          inverse — white arc + faint ring track
        </span>
        <div className="flex items-center gap-4 p-4 rounded-lg bg-[var(--color-action-primary)]">
          <Spinner variant="inverse" size="md" />
          <span className="text-body-sm text-[var(--color-text-inverse)]">
            White arc for use on accent-colored or dark backgrounds.
          </span>
        </div>
      </div>
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────

const sizes: SpinnerSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const sizeLabels: Record<SpinnerSize, string> = {
  xs: 'xs — 16px',
  sm: 'sm — 20px',
  md: 'md — 24px',
  lg: 'lg — 32px',
  xl: 'xl — 48px',
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-end gap-8">
        {sizes.map((size) => (
          <div key={size} className="flex flex-col items-center gap-3">
            <Spinner variant="default" size={size} />
            <span className="text-body-xs text-[var(--color-text-tertiary)]">
              {sizeLabels[size]}
            </span>
          </div>
        ))}
      </div>
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-full max-w-sm">
      {/* Inline with text */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Inline with text
        </span>
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          <span className="text-body-md text-[var(--color-text-secondary)]">
            Saving changes…
          </span>
        </div>
      </div>

      {/* Inside a disabled button shell */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Inside a loading button (pattern reference)
        </span>
        <div
          className="inline-flex items-center justify-center gap-2 px-[var(--spacing-component-lg)] h-[var(--size-component-md)] rounded-[var(--radius-component-md)] bg-[var(--color-action-disabled)] text-[var(--color-text-disabled)] cursor-not-allowed select-none"
          aria-disabled="true"
          aria-busy="true"
        >
          <Spinner variant="default" size="xs" label="Button loading" />
          <span className="text-button-md">Loading</span>
        </div>
      </div>

      {/* Full-width loading bar overlay pattern */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Centered overlay pattern
        </span>
        <div className="relative h-24 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <span className="text-body-sm text-[var(--color-text-tertiary)]">
              Loading content…
            </span>
          </div>
        </div>
      </div>

      {/* Custom label */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Custom accessible label (check screen reader output)
        </span>
        <div className="flex items-center gap-3">
          <Spinner label="Uploading file, please wait" />
          <span className="text-body-sm text-[var(--color-text-secondary)]">
            label="Uploading file, please wait"
          </span>
        </div>
      </div>
    </div>
  ),
};

// ── 5. Dark Mode ──────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-8 rounded-lg max-w-2xl">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-8">
          {(['default', 'inverse'] as SpinnerVariant[]).map((variant) => (
            <div key={variant} className="flex flex-col items-center gap-3">
              <div
                className={`p-3 rounded-lg ${
                  variant === 'inverse'
                    ? 'bg-[var(--color-action-primary)]'
                    : 'bg-[var(--color-bg-secondary)]'
                }`}
              >
                <Spinner variant={variant} size="md" />
              </div>
              <span className="text-body-xs text-[var(--color-text-tertiary)]">{variant}</span>
            </div>
          ))}
        </div>
        <div className="flex items-end gap-6">
          {sizes.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Spinner variant="default" size={size} />
              <span className="text-body-xs text-[var(--color-text-tertiary)]">{size}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

// ── 6. Overlay Patterns ───────────────────────────────────────────────────────

export const OverlayPatterns: Story = {
  render: () => (
    <div className="flex flex-col gap-8 max-w-2xl">
      {/* Full-screen overlay pattern */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Full-screen overlay with semi-transparent backdrop
        </span>
        <div className="relative w-full aspect-video rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 bg-white dark:bg-[var(--color-bg-primary)] p-8 rounded-lg shadow-lg">
              <Spinner size="lg" />
              <span className="text-body-md text-[var(--color-text-secondary)]">
                Loading data…
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Inline loading in card */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Loading state inside a card
        </span>
        <div className="border border-[var(--color-border-subtle)] rounded-lg p-6 bg-[var(--color-bg-primary)]">
          <div className="min-h-32 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Spinner variant="default" size="md" />
              <span className="text-body-sm text-[var(--color-text-tertiary)]">
                Fetching content…
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* List item skeleton with spinner */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Loading state in list context
        </span>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg-secondary)]">
            <Spinner size="sm" />
            <span className="text-body-sm text-[var(--color-text-secondary)]">
              Loading item 1…
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-bg-secondary)]">
            <Spinner size="sm" />
            <span className="text-body-sm text-[var(--color-text-secondary)]">
              Loading item 2…
            </span>
          </div>
        </div>
      </div>
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    label: 'Loading…',
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-8 max-w-lg">
      {/* role="status" live region */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          role="status" — polite live region (screen reader announces label)
        </span>
        <div className="flex items-center gap-3">
          <Spinner label="Loading search results" />
          <span className="text-body-sm text-[var(--color-text-secondary)]">
            Announces "Loading search results" to screen readers
          </span>
        </div>
      </div>

      {/* Default label */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Default label fallback
        </span>
        <div className="flex items-center gap-3">
          <Spinner />
          <span className="text-body-sm text-[var(--color-text-secondary)]">
            No label prop → announces "Loading…"
          </span>
        </div>
      </div>

      {/* aria-label override */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          aria-label override (takes precedence over label prop)
        </span>
        <div className="flex items-center gap-3">
          <Spinner aria-label="Uploading 3 of 5 files" label="Uploading" />
          <span className="text-body-sm text-[var(--color-text-secondary)]">
            aria-label="Uploading 3 of 5 files"
          </span>
        </div>
      </div>

      {/* Inline with aria-busy context */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Paired with aria-busy on a container
        </span>
        <div
          className="p-4 rounded-lg border border-[var(--color-border-subtle)] flex items-center gap-3"
          aria-busy="true"
          aria-label="Loading user data"
        >
          <Spinner size="sm" label="Loading user data" />
          <span className="text-body-sm text-[var(--color-text-secondary)]">
            Container has aria-busy="true" — both parent and spinner announce loading
          </span>
        </div>
      </div>

      {/* Reduced motion note */}
      <div className="flex flex-col gap-2">
        <span className="text-body-sm text-[var(--color-text-tertiary)]">
          Reduced motion (prefers-reduced-motion: reduce)
        </span>
        <div className="flex items-center gap-3">
          <Spinner size="md" />
          <span className="text-body-sm text-[var(--color-text-secondary)]">
            Animation collapses to static arc via global reduced-motion CSS.
            The role="status" and label ensure loading state is still communicated.
          </span>
        </div>
      </div>
    </div>
  ),
};
