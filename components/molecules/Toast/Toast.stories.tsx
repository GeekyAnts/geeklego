import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import type { ToastProps } from './Toast.types';

const meta: Meta<typeof Toast> = {
  title: 'Molecules/Toast',
  component: Toast,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Floating transient notification. Overlays the page — always receives a shadow. ' +
          'Shares the same 4-variant status palette as AlertBanner but differs in: default-dismissible, shadow depth, and optional auto-dismiss countdown.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'error'],
    },
    appearance: {
      control: { type: 'select' },
      options: ['solid', 'subtle', 'outline', 'left-accent'],
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md'],
    },
    title: { control: 'text' },
    description: { control: 'text' },
    dismissible: { control: 'boolean' },
    showIcon: { control: 'boolean' },
    duration: { control: 'number' },
    showProgress: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<ToastProps>;

// ── 1. Default ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: 'info',
    appearance: 'subtle',
    size: 'md',
    title: 'Update available',
    description: 'Version 3.2.1 is ready to install. Restart to apply.',
    dismissible: true,
  },
};

// ── 2. Variants ───────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] p-6">
      <Toast
        variant="info"
        appearance="subtle"
        title="Info"
        description="Your export has been queued and will be ready shortly."
      />
      <Toast
        variant="success"
        appearance="subtle"
        title="Success"
        description="Changes saved successfully. All data is up to date."
      />
      <Toast
        variant="warning"
        appearance="subtle"
        title="Warning"
        description="Your session expires in 5 minutes. Save your work."
      />
      <Toast
        variant="error"
        appearance="subtle"
        title="Error"
        description="Failed to connect. Check your connection and try again."
      />
    </div>
  ),
};

// ── 3. Appearances ────────────────────────────────────────────────────────────

export const Appearances: Story = {
  name: 'Appearances',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] p-6">
      {(['solid', 'subtle', 'outline', 'left-accent'] as const).map((appearance) => (
        <Toast
          key={appearance}
          variant="info"
          appearance={appearance}
          title={`Appearance: ${appearance}`}
          description="Each appearance uses a fundamentally different visual strategy."
        />
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] p-6">
      <Toast
        variant="info"
        appearance="subtle"
        title="Default — dismissible"
        description="Dismiss button is visible on the trailing edge."
        dismissible
      />
      <Toast
        variant="success"
        appearance="subtle"
        title="Non-dismissible"
        description="No dismiss button. Consumer controls removal."
        dismissible={false}
      />
      <Toast
        variant="info"
        appearance="subtle"
        title="No icon"
        description="showIcon=false suppresses the leading status icon."
        showIcon={false}
      />
      <Toast
        variant="warning"
        appearance="subtle"
        title="With actions"
        description="Actions slot rendered below the description."
        actions={
          <div className="flex gap-[var(--spacing-component-sm)]">
            <button
              type="button"
              className="text-body-sm font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:focus-ring rounded-[var(--radius-component-xs)]"
            >
              Save now
            </button>
            <button
              type="button"
              className="text-body-sm opacity-70 focus-visible:outline-none focus-visible:focus-ring rounded-[var(--radius-component-xs)]"
            >
              Dismiss
            </button>
          </div>
        }
      />
      <Toast
        variant="info"
        appearance="subtle"
        title="With progress bar"
        description="showProgress=true renders a countdown strip at the bottom."
        duration={8000}
        showProgress
      />
      <Toast
        variant="error"
        appearance="subtle"
        title="Description only"
        description="No title — description sits flush to the top of the content area."
      />
      <Toast
        variant="success"
        appearance="subtle"
        description="Icon + description only, no title."
      />
    </div>
  ),
};

// ── 5. DarkMode ───────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-[var(--spacing-layout-xs)] p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      {(['info', 'success', 'warning', 'error'] as const).map((variant) => (
        <Toast
          key={variant}
          variant={variant}
          appearance="subtle"
          title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} — dark mode`}
          description="Tokens resolve to dark-mode palette via semantic cascade."
        />
      ))}
      <Toast
        variant="info"
        appearance="solid"
        title="Solid in dark mode"
        description="Solid appearance maintains contrast in dark mode."
      />
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'info',
    appearance: 'subtle',
    size: 'md',
    title: 'Notification title',
    description: 'This is a brief description of what happened.',
    dismissible: true,
    showIcon: true,
    duration: 0,
    showProgress: false,
  },
  render: (args) => (
    <div className="p-6">
      <Toast {...args} />
    </div>
  ),
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)]">
      {/*
        role="status" (info/success): polite live region — screen reader
        waits for a pause before announcing.
        role="alert"  (error/warning): assertive live region — interrupts
        the screen reader immediately.

        Keyboard: Tab → dismiss button → Enter/Space to dismiss.
        Screen reader announcement: "[title], [description]" as a group.
        Dismiss button: "Dismiss, button".
      */}

      {/* Polite — info status */}
      <Toast
        variant="info"
        appearance="subtle"
        title="Polite announcement"
        description="role=status — screen reader waits for a pause before announcing."
      />

      {/* Assertive — error status */}
      <Toast
        variant="error"
        appearance="subtle"
        title="Assertive announcement"
        description="role=alert — interrupts the screen reader immediately."
      />

      {/* Dismiss button accessible name */}
      <Toast
        variant="success"
        appearance="subtle"
        title="Dismiss button"
        description="Dismiss button carries aria-label='Dismiss' for icon-only button clarity."
        dismissible
      />

      {/* Non-dismissible — no interactive element */}
      <Toast
        variant="warning"
        appearance="subtle"
        title="Non-dismissible"
        description="No dismiss button — no Tab stop. Consumer manages removal."
        dismissible={false}
      />

      {/* Custom i18n dismiss label */}
      <Toast
        variant="info"
        appearance="outline"
        title="Localised dismiss label"
        description="i18nStrings.dismissLabel overrides the button aria-label."
        dismissible
        i18nStrings={{ dismissLabel: 'Fermer la notification' }}
      />
    </div>
  ),
};
