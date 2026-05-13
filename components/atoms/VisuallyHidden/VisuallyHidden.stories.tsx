import type { Meta, StoryObj } from '@storybook/react';
import { VisuallyHidden } from './VisuallyHidden';
import type { VisuallyHiddenElement } from './VisuallyHidden.types';

const meta: Meta<typeof VisuallyHidden> = {
  title: 'Atoms/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['span', 'div', 'p'] satisfies VisuallyHiddenElement[],
      description: 'HTML element to render',
    },
    children: {
      control: 'text',
      description: 'Content hidden from sighted users, announced by screen readers',
    },
  },
};

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;

// ── Story helper — shows what assistive technology will announce ────────────
// (story-local only — not a component)
const SrLabel = ({ text }: { text: string }) => (
  <span
    aria-hidden="true"
    className="inline-flex items-center gap-[var(--spacing-component-xs)] text-body-xs text-[var(--color-text-secondary)] font-mono bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-[var(--radius-component-sm)] px-[var(--spacing-component-sm)] py-[var(--spacing-component-xs)]"
  >
    <span className="text-[var(--color-text-secondary)]">SR:</span>
    &ldquo;{text}&rdquo;
  </span>
);

// Inline SVG icons (no lucide import — atoms import nothing from components/)
const IconSearch = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const IconClose = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const IconSettings = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// ─── 1. Default ─────────────────────────────────────────────────────────────

/**
 * The most common use case: providing an accessible label for an icon-only
 * button. The VisuallyHidden text is invisible on screen but read aloud by
 * screen readers, giving the button a meaningful accessible name.
 *
 * Without VisuallyHidden, a screen reader would announce "button" with no
 * context. With it, the announcement becomes "Search, button".
 */
export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
      <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
        Icon-only buttons need a visually hidden label for screen readers.
        The grey badge shows what assistive technology will announce.
      </p>

      <div className="flex items-center gap-[var(--spacing-layout-xs)]">
        {/* Icon-only button with hidden label */}
        <button
          type="button"
          aria-label={undefined}
          className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-component-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-default focus-visible:outline-none focus-visible:focus-ring cursor-pointer"
        >
          <IconSearch />
          <VisuallyHidden>Search</VisuallyHidden>
        </button>

        <SrLabel text="Search, button" />
      </div>

      <div className="flex items-center gap-[var(--spacing-layout-xs)]">
        <button
          type="button"
          className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-component-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-default focus-visible:outline-none focus-visible:focus-ring cursor-pointer"
        >
          <IconClose />
          <VisuallyHidden>Dismiss notification</VisuallyHidden>
        </button>

        <SrLabel text="Dismiss notification, button" />
      </div>
    </div>
  ),
};

// ─── 1b. WithoutVisuallyHidden ───────────────────────────────────────────────

/**
 * What happens when you omit VisuallyHidden from an icon-only button?
 * The button renders fine visually, but a screen reader announces only
 * "button" — giving the user no context about what it does.
 *
 * The red outline below marks the inaccessible element. This is the failure
 * VisuallyHidden exists to prevent.
 */
export const WithoutVisuallyHidden: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
      <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">
        Without a hidden label, a screen reader cannot describe what this button does.
      </p>

      <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
        {/* Inaccessible — no label */}
        <div className="flex items-center gap-[var(--spacing-layout-xs)]">
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-component-md)] bg-[var(--color-bg-secondary)] border-2 border-[var(--color-status-error)] text-[var(--color-text-secondary)] cursor-pointer"
            >
              <IconSearch />
              {/* No VisuallyHidden — screen reader announces "button" only */}
            </button>
          </div>
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <span className="text-body-xs font-semibold text-[var(--color-status-error)]">Without VisuallyHidden</span>
            <span
              aria-hidden="true"
              className="inline-flex items-center gap-[var(--spacing-component-xs)] text-body-xs text-[var(--color-status-error)] font-mono bg-[var(--color-bg-secondary)] border border-[var(--color-status-error)] rounded-[var(--radius-component-sm)] px-[var(--spacing-component-sm)] py-[var(--spacing-component-xs)]"
            >
              <span>SR:</span>
              &ldquo;button&rdquo;
            </span>
          </div>
        </div>

        {/* Accessible — with label */}
        <div className="flex items-center gap-[var(--spacing-layout-xs)]">
          <button
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-component-md)] bg-[var(--color-bg-secondary)] border-2 border-[var(--color-status-success)] text-[var(--color-text-secondary)] cursor-pointer"
          >
            <IconSearch />
            <VisuallyHidden>Search</VisuallyHidden>
          </button>
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <span className="text-body-xs font-semibold text-[var(--color-status-success)]">With VisuallyHidden</span>
            <SrLabel text="Search, button" />
          </div>
        </div>
      </div>
    </div>
  ),
};

// ─── 2. Variants ────────────────────────────────────────────────────────────

/**
 * The `as` prop controls the rendered HTML element. Use the element that makes
 * the most semantic sense for the surrounding context:
 *
 * - `span` (default) — safe anywhere, including inside `<p>` or inline content
 * - `div` — block-level context, e.g. alongside a chart or data region
 * - `p` — when the content is a sentence or paragraph in a block container
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      {(
        [
          {
            tag: 'span',
            label: 'as="span" (default)',
            context: 'Safe in inline and block contexts',
            content: 'User avatar for Jane Smith',
            visual: (
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-[var(--color-action-primary)] text-[var(--color-text-on-primary)] text-button-md font-semibold">
                JS
                <VisuallyHidden as="span">User avatar for Jane Smith</VisuallyHidden>
              </span>
            ),
          },
          {
            tag: 'div',
            label: 'as="div"',
            context: 'Block-level announcements',
            content: 'Chart showing monthly revenue. Use the data table below for details.',
            visual: (
              <div className="relative w-full h-12 rounded-[var(--radius-component-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] overflow-hidden">
                <div
                  className="absolute inset-y-0 start-0 bg-[var(--color-action-primary)] opacity-20 rounded-[var(--radius-component-md)]"
                  style={{ width: '72%' }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-body-sm text-[var(--color-text-secondary)]">
                  Chart (72%)
                </span>
                <VisuallyHidden as="div">
                  Chart showing monthly revenue. Use the data table below for details.
                </VisuallyHidden>
              </div>
            ),
          },
          {
            tag: 'p',
            label: 'as="p"',
            context: 'Paragraph-length descriptions',
            content: 'Navigation section. Contains 5 links to main areas of the application.',
            visual: (
              <nav aria-labelledby="variants-nav-heading">
                <VisuallyHidden as="p" id="variants-nav-heading">
                  Navigation section. Contains 5 links to main areas of the application.
                </VisuallyHidden>
                <ul className="flex gap-[var(--spacing-component-md)] text-body-sm text-[var(--color-text-secondary)]">
                  {['Home', 'Docs', 'API', 'Blog', 'Support'].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="hover:text-[var(--color-text-primary)] transition-default focus-visible:outline-none focus-visible:focus-ring rounded-[var(--radius-component-xs)]"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ),
          },
        ] as const
      ).map(({ tag, label, context, content, visual }) => (
        <div key={tag} className="flex flex-col gap-[var(--spacing-component-sm)]">
          <div className="flex items-center gap-[var(--spacing-component-sm)]">
            <span className="text-body-sm font-semibold text-[var(--color-text-primary)]">{label}</span>
            <span className="text-body-sm text-[var(--color-text-tertiary)]">— {context}</span>
          </div>
          <div className="flex items-center gap-[var(--spacing-component-md)] flex-wrap">
            {visual}
            <SrLabel text={content} />
          </div>
        </div>
      ))}
    </div>
  ),
};

// ─── 3. UseCases ────────────────────────────────────────────────────────────

/**
 * VisuallyHidden has no size variants — it is always 1px × 1px. This story
 * shows the four most common integration patterns by content type:
 *
 * 1. Short label (icon button, badge)
 * 2. Status phrase (loading state, form error)
 * 3. Count announcement (notification badge)
 * 4. Navigation landmark description
 */
export const UseCases: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      {/* 1 — Short label */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm font-semibold text-[var(--color-text-primary)]">Short label</span>
        <div className="flex items-center gap-[var(--spacing-component-md)] flex-wrap">
          <button
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-component-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-default focus-visible:outline-none focus-visible:focus-ring cursor-pointer"
          >
            <IconSettings />
            <VisuallyHidden>Open settings</VisuallyHidden>
          </button>
          <SrLabel text="Open settings, button" />
        </div>
      </div>

      {/* 2 — Status phrase */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm font-semibold text-[var(--color-text-primary)]">Status phrase</span>
        <div className="flex items-center gap-[var(--spacing-component-md)] flex-wrap">
          <div
            role="status"
            aria-live="polite"
            className="inline-flex items-center gap-[var(--spacing-component-sm)] text-body-sm text-[var(--color-text-secondary)]"
          >
            {/* Spinner dot animation */}
            <span className="skeleton w-4 h-4 rounded-full flex-shrink-0" />
            <VisuallyHidden>Loading results, please wait…</VisuallyHidden>
          </div>
          <SrLabel text="Loading results, please wait…" />
        </div>
      </div>

      {/* 3 — Count announcement */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm font-semibold text-[var(--color-text-primary)]">Count announcement</span>
        <div className="flex items-center gap-[var(--spacing-component-md)] flex-wrap">
          <span className="relative inline-block">
            <button
              type="button"
              className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-component-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-default focus-visible:outline-none focus-visible:focus-ring cursor-pointer"
            >
              {/* Bell icon */}
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <VisuallyHidden>Notifications, 3 unread</VisuallyHidden>
            </button>
            <span
              aria-hidden="true"
              className="absolute -top-1 -end-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-[var(--color-status-error)] text-[var(--color-text-on-status)]"
            >
              3
            </span>
          </span>
          <SrLabel text="Notifications, 3 unread, button" />
        </div>
      </div>

      {/* 4 — Navigation landmark description */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm font-semibold text-[var(--color-text-primary)]">Landmark description</span>
        <div className="flex items-center gap-[var(--spacing-component-md)] flex-wrap">
          <nav aria-label="Primary">
            <VisuallyHidden as="p">
              Primary navigation — 4 sections available
            </VisuallyHidden>
            <ul className="flex gap-[var(--spacing-component-sm)] text-body-sm text-[var(--color-text-secondary)]">
              {['Dashboard', 'Analytics', 'Settings', 'Help'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-[var(--color-text-primary)] transition-default focus-visible:outline-none focus-visible:focus-ring rounded-[var(--radius-component-xs)]">{item}</a>
                </li>
              ))}
            </ul>
          </nav>
          <SrLabel text="Primary navigation — 4 sections available" />
        </div>
      </div>
    </div>
  ),
};

// ─── 4. LiveRegions ─────────────────────────────────────────────────────────

/**
 * VisuallyHidden has no visual states of its own — it is always invisible.
 * This story shows how `aria-live` regions work with VisuallyHidden to
 * communicate dynamic state changes to screen readers.
 */
export const LiveRegions: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      {/* Polite live region — announced after current speech */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm font-semibold text-[var(--color-text-primary)]">aria-live="polite" — status update</span>
        <p className="text-body-sm text-[var(--color-text-tertiary)]">
          Announced after the user finishes their current activity.
        </p>
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="inline-flex items-center gap-[var(--spacing-component-sm)] px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)] rounded-[var(--radius-component-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-body-sm text-[var(--color-text-secondary)] w-fit"
        >
          <span aria-hidden="true" className="w-2 h-2 rounded-full bg-[var(--color-status-success)] flex-shrink-0" />
          Saved
          <VisuallyHidden>Changes saved successfully</VisuallyHidden>
        </div>
        <SrLabel text="Changes saved successfully" />
      </div>

      {/* Assertive live region — interrupts current speech */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm font-semibold text-[var(--color-text-primary)]">aria-live="assertive" — urgent alert</span>
        <p className="text-body-sm text-[var(--color-text-tertiary)]">
          Interrupts the screen reader immediately. Use sparingly.
        </p>
        <div
          role="alert"
          aria-live="assertive"
          className="inline-flex items-center gap-[var(--spacing-component-sm)] px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)] rounded-[var(--radius-component-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-status-error)] text-body-sm text-[var(--color-status-error)] w-fit"
        >
          <span aria-hidden="true">⚠</span>
          Session expiring
          <VisuallyHidden>Warning: Your session will expire in 2 minutes. Save your work.</VisuallyHidden>
        </div>
        <SrLabel text="Warning: Your session will expire in 2 minutes. Save your work." />
      </div>

      {/* Static (no live region) — read in document order */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm font-semibold text-[var(--color-text-primary)]">Static — read in document order</span>
        <p className="text-body-sm text-[var(--color-text-tertiary)]">
          Content is present in the DOM from the start and read as the user navigates.
        </p>
        <div className="inline-flex items-center gap-[var(--spacing-component-sm)] px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)] rounded-[var(--radius-component-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-body-sm text-[var(--color-text-secondary)] w-fit">
          <span aria-hidden="true" className="font-bold text-[var(--color-text-primary)]">42</span>
          <span aria-hidden="true">issues</span>
          <VisuallyHidden>42 open issues in this repository</VisuallyHidden>
        </div>
        <SrLabel text="42 open issues in this repository" />
      </div>
    </div>
  ),
};

// ─── 5. DarkMode ────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="bg-primary rounded-[var(--radius-component-lg)] p-[var(--spacing-layout-xs)] max-w-2xl"
    >
      <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
        VisuallyHidden is theme-agnostic — it has no visual presence.
        The surrounding UI demonstrates it in dark mode context.
      </p>

      <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
        <div className="flex items-center gap-[var(--spacing-component-md)]">
          <button
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-component-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-default focus-visible:outline-none focus-visible:focus-ring cursor-pointer"
          >
            <IconSearch />
            <VisuallyHidden>Search</VisuallyHidden>
          </button>
          <SrLabel text="Search, button" />
        </div>

        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-[var(--spacing-component-sm)] text-body-sm text-[var(--color-text-secondary)]"
        >
          <span className="skeleton w-4 h-4 rounded-full flex-shrink-0" />
          <VisuallyHidden>Syncing data…</VisuallyHidden>
          <span aria-hidden="true">Syncing…</span>
          <SrLabel text="Syncing data…" />
        </div>
      </div>
    </div>
  ),
};

// ─── 7. Playground ──────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    as: 'span',
    children: 'This text is hidden from sighted users but read by screen readers',
  },
  render: (args) => (
    <div className="flex flex-col gap-[var(--spacing-component-md)]">
      <p className="text-body-sm text-[var(--color-text-secondary)]">
        The component renders with 1×1px dimensions — adjust controls above to explore props.
      </p>
      <div className="relative p-[var(--spacing-component-lg)] bg-[var(--color-bg-secondary)] rounded-[var(--radius-component-md)] border border-[var(--color-border-subtle)]">
        <VisuallyHidden {...args} />
        <span className="text-body-sm text-[var(--color-text-tertiary)] italic">
          ← VisuallyHidden is rendered here (invisible to sighted users)
        </span>
      </div>
      <SrLabel text={typeof args.children === 'string' ? args.children : 'children'} />
    </div>
  ),
};

// ─── 8. Accessibility ───────────────────────────────────────────────────────

/**
 * WCAG 2.2 compliance patterns.
 *
 * 1. SC 1.3.1 — Info and Relationships (Level A):
 *    Information conveyed visually must be available programmatically.
 *    VisuallyHidden bridges the gap for icon-only controls.
 *
 * 2. SC 4.1.3 — Status Messages (Level AA):
 *    Status messages must be determinable by assistive technologies.
 *    Combine VisuallyHidden with role="status" and aria-live="polite".
 *
 * 3. SC 1.1.1 — Non-text Content (Level A):
 *    Every image/icon used convey meaning must have a text alternative.
 *    VisuallyHidden provides that alternative for decorative SVG icons.
 *
 * Screen reader: Tab to the icon button → announces "Search, button"
 * The `role="status"` region is polled on every render, no tab stop.
 */
export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] p-[var(--spacing-layout-xs)]">
      {/* SC 1.3.1 — icon-only button with accessible name */}
      <section aria-labelledby="a11y-1">
        <h3 id="a11y-1" className="text-body-sm font-semibold text-[var(--color-text-primary)] mb-[var(--spacing-component-xs)]">
          SC 1.3.1 — Icon-only button (accessible name)
        </h3>
        <div className="flex items-center gap-[var(--spacing-component-md)]">
          <button
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--radius-component-md)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-default focus-visible:outline-none focus-visible:focus-ring cursor-pointer"
          >
            <IconSearch />
            {/* VisuallyHidden provides the accessible name */}
            <VisuallyHidden>Search the site</VisuallyHidden>
          </button>
          <SrLabel text="Search the site, button" />
        </div>
      </section>

      {/* SC 4.1.3 — status live region */}
      <section aria-labelledby="a11y-2">
        <h3 id="a11y-2" className="text-body-sm font-semibold text-[var(--color-text-primary)] mb-[var(--spacing-component-xs)]">
          SC 4.1.3 — Status message (aria-live region)
        </h3>
        <div className="flex items-center gap-[var(--spacing-component-md)]">
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="inline-flex items-center gap-[var(--spacing-component-xs)] text-body-sm text-[var(--color-text-secondary)]"
          >
            {/* Visual indicator — decorative */}
            <span aria-hidden="true" className="w-2 h-2 rounded-full bg-[var(--color-status-success)] flex-shrink-0" />
            {/* Screen reader announcement */}
            <VisuallyHidden>Form submitted successfully. You will receive a confirmation email.</VisuallyHidden>
            {/* Abbreviated visual label */}
            <span aria-hidden="true">Submitted</span>
          </div>
          <SrLabel text="Form submitted successfully. You will receive a confirmation email." />
        </div>
      </section>

      {/* SC 1.1.1 — badge with hidden count context */}
      <section aria-labelledby="a11y-3">
        <h3 id="a11y-3" className="text-body-sm font-semibold text-[var(--color-text-primary)] mb-[var(--spacing-component-xs)]">
          SC 1.1.1 — Badge count with full context
        </h3>
        <div className="flex items-center gap-[var(--spacing-component-md)]">
          <span className="inline-flex items-center gap-[var(--spacing-component-xs)] px-[var(--spacing-component-sm)] py-[var(--spacing-component-xs)] rounded-full bg-[var(--color-status-error)] text-[var(--color-text-on-status)] text-body-xs font-semibold">
            <span aria-hidden="true">7</span>
            <VisuallyHidden>7 unread messages</VisuallyHidden>
          </span>
          <SrLabel text="7 unread messages" />
        </div>
      </section>
    </div>
  ),
};
