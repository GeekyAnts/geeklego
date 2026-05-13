import type { Meta, StoryObj } from '@storybook/react';
import { Info, HelpCircle, Star } from 'lucide-react';
import { Tooltip } from './Tooltip';
import type { TooltipPlacement } from './Tooltip.types';

const meta: Meta<typeof Tooltip> = {
  title: 'Molecules/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'] satisfies TooltipPlacement[],
    },
    delayMs: { control: { type: 'range', min: 0, max: 1000, step: 50 } },
    disabled: { control: 'boolean' },
    content: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

// ── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    content: 'Save your progress before leaving.',
    placement: 'top',
    delayMs: 300,
  },
  render: (args) => (
    <Tooltip {...args}>
      <button
        type="button"
        className="inline-flex items-center gap-[var(--button-gap)] h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] text-button-md transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-primary-bg-hover)]"
      >
        Save
      </button>
    </Tooltip>
  ),
};

// ── Placements ───────────────────────────────────────────────────────────────

export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-[var(--spacing-layout-md)] p-[var(--spacing-layout-lg)]">
      {(['top', 'bottom', 'left', 'right'] satisfies TooltipPlacement[]).map(
        (placement) => (
          <div key={placement} className="flex items-center justify-center">
            <Tooltip
              content={`Placement: ${placement}`}
              placement={placement}
              delayMs={0}
            >
              <button
                type="button"
                className="inline-flex items-center justify-center gap-[var(--button-gap)] h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] text-button-sm border border-[var(--button-secondary-border)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-secondary-bg-hover)]"
              >
                {placement}
              </button>
            </Tooltip>
          </div>
        ),
      )}
    </div>
  ),
};

// ── ContentTypes ─────────────────────────────────────────────────────────────

export const ContentTypes: Story = {
  render: () => (
    <div className="flex items-center gap-[var(--spacing-layout-md)]">
      {/* Plain text */}
      <Tooltip content="Plain text tooltip" delayMs={0}>
        <button
          type="button"
          className="inline-flex items-center gap-[var(--button-gap)] h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] text-button-sm border border-[var(--button-secondary-border)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-secondary-bg-hover)]"
        >
          Plain text
        </button>
      </Tooltip>

      {/* Long wrapping text */}
      <Tooltip
        content="This tooltip contains a longer description that demonstrates text wrapping behaviour within the max-width constraint."
        delayMs={0}
      >
        <button
          type="button"
          className="inline-flex items-center gap-[var(--button-gap)] h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] text-button-sm border border-[var(--button-secondary-border)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-secondary-bg-hover)]"
        >
          Long text
        </button>
      </Tooltip>

      {/* Icon-only trigger */}
      <Tooltip content="More information about this field" delayMs={0}>
        <button
          type="button"
          aria-label="Help"
          className="inline-flex items-center justify-center w-8 h-8 rounded-[var(--button-radius)] text-[var(--color-text-secondary)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:text-[var(--color-text-primary)] hover:bg-[var(--color-action-secondary)]"
        >
          <span aria-hidden="true">
            <HelpCircle size="var(--size-icon-md)" />
          </span>
        </button>
      </Tooltip>

      {/* Rich content */}
      <Tooltip
        content={
          <span className="flex items-center gap-[var(--spacing-component-xs)]">
            <span aria-hidden="true">
              <Star size="var(--size-icon-xs)" />
            </span>
            Pro feature
          </span>
        }
        delayMs={0}
      >
        <button
          type="button"
          className="inline-flex items-center gap-[var(--button-gap)] h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] text-button-sm border border-[var(--button-secondary-border)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-secondary-bg-hover)]"
        >
          Rich content
        </button>
      </Tooltip>
    </div>
  ),
};

// ── States ───────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      {/* Default — hover or focus to see */}
      <div className="flex items-center gap-[var(--spacing-component-lg)]">
        <span className="text-body-sm text-[var(--color-text-secondary)] w-24">Default</span>
        <Tooltip content="Hover or focus this button" delayMs={0}>
          <button
            type="button"
            className="inline-flex items-center gap-[var(--button-gap)] h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] text-button-sm transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-primary-bg-hover)]"
          >
            Hover me
          </button>
        </Tooltip>
      </div>

      {/* Disabled */}
      <div className="flex items-center gap-[var(--spacing-component-lg)]">
        <span className="text-body-sm text-[var(--color-text-secondary)] w-24">Disabled</span>
        <Tooltip content="This tooltip is suppressed" disabled delayMs={0}>
          <button
            type="button"
            className="inline-flex items-center gap-[var(--button-gap)] h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] bg-[var(--button-bg-disabled)] text-[var(--button-text-disabled)] text-button-sm cursor-not-allowed"
            aria-disabled="true"
          >
            No tooltip
          </button>
        </Tooltip>
      </div>

      {/* With icon trigger */}
      <div className="flex items-center gap-[var(--spacing-component-lg)]">
        <span className="text-body-sm text-[var(--color-text-secondary)] w-24">Icon trigger</span>
        <Tooltip content="Additional context for screen readers and keyboard users" delayMs={0}>
          <button
            type="button"
            aria-label="Information"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[var(--color-text-secondary)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:text-[var(--color-text-primary)] hover:bg-[var(--color-action-secondary)]"
          >
            <span aria-hidden="true">
              <Info size="var(--size-icon-md)" />
            </span>
          </button>
        </Tooltip>
      </div>
    </div>
  ),
};

// ── DarkMode ─────────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-[var(--spacing-layout-md)] rounded-[var(--radius-component-lg)] max-w-2xl">
      <div className="flex items-center gap-[var(--spacing-layout-md)]">
        <Tooltip content="Dark mode tooltip — inverted panel appears light" delayMs={0}>
          <button
            type="button"
            className="inline-flex items-center gap-[var(--button-gap)] h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] text-button-md transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-primary-bg-hover)]"
          >
            Hover me
          </button>
        </Tooltip>

        <Tooltip content="Secondary button tooltip" placement="bottom" delayMs={0}>
          <button
            type="button"
            className="inline-flex items-center gap-[var(--button-gap)] h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] text-button-md border border-[var(--color-border-default)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-secondary-bg-hover)]"
          >
            Bottom
          </button>
        </Tooltip>
      </div>
    </div>
  ),
};

// ── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    content: 'Customise me using the controls panel below.',
    placement: 'top',
    delayMs: 300,
    disabled: false,
  },
  render: (args) => (
    <Tooltip {...args}>
      <button
        type="button"
        className="inline-flex items-center gap-[var(--button-gap)] h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] text-button-md transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-primary-bg-hover)]"
      >
        Trigger
      </button>
    </Tooltip>
  ),
};

// ── Accessibility ─────────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)]">
      <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
        Tab to each trigger. The tooltip appears on focus with no delay. Press Escape to dismiss.
      </p>

      {/* Icon-only button — tooltip is the accessible description */}
      <div className="flex items-center gap-[var(--spacing-component-sm)]">
        <Tooltip
          content="Filter results by date range"
          delayMs={0}
          i18nStrings={{ panelLabel: 'Filter action description' }}
        >
          <button
            type="button"
            aria-label="Filter"
            className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--button-radius)] text-[var(--color-text-secondary)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:text-[var(--color-text-primary)] hover:bg-[var(--color-action-secondary)]"
          >
            <span aria-hidden="true">
              <Info size="var(--size-icon-md)" />
            </span>
          </button>
        </Tooltip>
        <span className="text-body-sm text-[var(--color-text-secondary)]">
          Icon-only trigger: aria-label on button + aria-describedby on tooltip
        </span>
      </div>

      {/* Labelled button — tooltip adds supplementary info */}
      <div className="flex items-center gap-[var(--spacing-component-sm)]">
        <Tooltip
          content="Permanently removes the item. This cannot be undone."
          placement="right"
          delayMs={0}
        >
          <button
            type="button"
            className="inline-flex items-center gap-[var(--button-gap)] h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] bg-[var(--button-destructive-bg)] text-[var(--button-primary-text)] text-button-sm transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-destructive-bg-hover)]"
          >
            Delete
          </button>
        </Tooltip>
        <span className="text-body-sm text-[var(--color-text-secondary)]">
          Labelled trigger: tooltip adds supplementary warning description
        </span>
      </div>
    </div>
  ),
};

// ── 8. Edge Cases ─────────────────────────────────────────────────────────────

export const EdgeCases: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] p-[var(--spacing-layout-xs)] max-w-lg">
      <p className="text-label-sm text-[var(--color-text-tertiary)] mb-[var(--spacing-component-sm)]">Edge cases</p>

      {/* Very long content — panel should wrap and not overflow viewport */}
      <div className="flex items-center gap-[var(--spacing-component-sm)]">
        <Tooltip
          content="This tooltip contains a longer description that spans multiple lines to verify the panel wraps gracefully without overflowing the viewport or clipping at the boundary of the layout container."
          delayMs={0}
        >
          <button
            type="button"
            className="inline-flex items-center gap-[var(--spacing-component-xs)] h-[var(--button-height-sm)] px-[var(--button-px-sm)] rounded-[var(--button-radius)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] text-button-sm border border-[var(--color-border-default)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-secondary-bg-hover)]"
          >
            <span aria-hidden="true"><HelpCircle size="var(--size-icon-xs)" /></span>
            Long content
          </button>
        </Tooltip>
        <span className="text-body-xs text-[var(--color-text-tertiary)]">Multi-line wrap</span>
      </div>

      {/* Tooltip on a disabled-looking element — wrapping span is the focus target */}
      <div className="flex items-center gap-[var(--spacing-component-sm)]">
        <Tooltip
          content="This action is unavailable because you don't have the required permissions."
          placement="right"
          delayMs={0}
        >
          {/* Disabled buttons cannot receive focus, so wrap in a span to keep tooltip reachable */}
          <span
            tabIndex={0}
            role="button"
            aria-disabled="true"
            className="inline-flex items-center gap-[var(--button-gap)] h-[var(--button-height-md)] px-[var(--button-px-md)] rounded-[var(--button-radius)] bg-[var(--button-bg-disabled)] text-[var(--button-text-disabled)] text-button-md cursor-not-allowed focus-visible:outline-none focus-visible:focus-ring"
          >
            Restricted
          </span>
        </Tooltip>
        <span className="text-body-xs text-[var(--color-text-tertiary)]">Disabled element wrapper pattern</span>
      </div>

      {/* Icon-only content — uses panelLabel i18n for accessible name */}
      <div className="flex items-center gap-[var(--spacing-component-sm)]">
        <Tooltip
          content={<Star size="var(--size-icon-md)" aria-hidden="true" />}
          i18nStrings={{ panelLabel: 'Starred item indicator' }}
          placement="bottom"
          delayMs={0}
        >
          <button
            type="button"
            aria-label="Star this item"
            className="inline-flex items-center justify-center w-10 h-10 rounded-[var(--button-radius)] text-[var(--color-text-secondary)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:text-[var(--color-text-primary)] hover:bg-[var(--color-action-secondary)]"
          >
            <span aria-hidden="true"><Star size="var(--size-icon-md)" /></span>
          </button>
        </Tooltip>
        <span className="text-body-xs text-[var(--color-text-tertiary)]">Non-textual content — panelLabel i18n provides accessible name</span>
      </div>

      {/* Disabled tooltip — never shown even on hover/focus */}
      <div className="flex items-center gap-[var(--spacing-component-sm)]">
        <Tooltip
          content="You should never see this"
          disabled
          delayMs={0}
        >
          <button
            type="button"
            className="inline-flex items-center gap-[var(--button-gap)] h-[var(--button-height-sm)] px-[var(--button-px-sm)] rounded-[var(--button-radius)] bg-[var(--button-outline-bg)] text-[var(--button-outline-text)] text-button-sm border border-[var(--color-border-default)] transition-default focus-visible:outline-none focus-visible:focus-ring hover:bg-[var(--button-outline-bg-hover)]"
          >
            No tooltip
          </button>
        </Tooltip>
        <span className="text-body-xs text-[var(--color-text-tertiary)]">disabled=true — tooltip suppressed</span>
      </div>
    </div>
  ),
};
