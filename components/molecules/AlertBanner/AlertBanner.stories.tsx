import type { Meta, StoryObj } from '@storybook/react';
import { AlertBanner } from './AlertBanner';
import type { AlertBannerAppearance, AlertBannerVariant } from './AlertBanner.types';

const meta: Meta<typeof AlertBanner> = {
  title: 'Molecules/AlertBanner',
  component: AlertBanner,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'] satisfies AlertBannerVariant[],
      description: 'Semantic status intent — controls colour, icon, and ARIA live assertiveness.',
    },
    appearance: {
      control: 'select',
      options: ['solid', 'subtle', 'outline', 'left-accent'] satisfies AlertBannerAppearance[],
      description: 'Visual treatment strategy — each uses a fundamentally different design approach.',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md'],
    },
    title: { control: 'text' },
    description: { control: 'text' },
    showIcon: { control: 'boolean' },
    dismissible: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof AlertBanner>;

// ── 1. Default ───────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: 'info',
    appearance: 'subtle',
    size: 'md',
    title: 'Your session expires in 10 minutes',
    description: 'Save your work to avoid losing any unsaved changes.',
    showIcon: true,
    dismissible: true,
  },
};

// ── 2. Variants ──────────────────────────────────────────────────────────────

const VARIANTS: AlertBannerVariant[] = ['info', 'success', 'warning', 'error'];

const VARIANT_CONTENT: Record<AlertBannerVariant, { title: string; description: string }> = {
  info:    { title: 'New feature available',    description: 'Explore the updated dashboard for a faster workflow.' },
  success: { title: 'Changes saved',            description: 'Your profile has been updated successfully.' },
  warning: { title: 'Storage limit approaching', description: 'You have used 90% of your available storage.' },
  error:   { title: 'Payment failed',            description: 'We could not process your card. Please update your billing details.' },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)]">
      {VARIANTS.map((variant) => (
        <AlertBanner
          key={variant}
          variant={variant}
          appearance="subtle"
          title={VARIANT_CONTENT[variant].title}
          description={VARIANT_CONTENT[variant].description}
          dismissible
        />
      ))}
    </div>
  ),
};

// ── 3. Appearances (Sizes story shows appearances — AlertBanner has no height-based sizes) ──

export const Appearances: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)]">
      {(['solid', 'subtle', 'outline', 'left-accent'] as AlertBannerAppearance[]).map((appearance) => (
        <AlertBanner
          key={appearance}
          variant="info"
          appearance={appearance}
          title={`Appearance: ${appearance}`}
          description="This appearance uses a distinct visual strategy to communicate its prominence level."
        />
      ))}
    </div>
  ),
};

// ── 4. Sizes ─────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)]">
      <AlertBanner
        variant="info"
        size="md"
        title="Standard size (md)"
        description="Default padding and icon size — suitable for most contexts."
        dismissible
      />
      <AlertBanner
        variant="info"
        size="sm"
        title="Compact size (sm)"
        description="Reduced padding and icon — ideal for dense UIs or inline contexts."
        dismissible
      />
    </div>
  ),
};

// ── 5. States ────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)]">
      {/* Icon visible (default) */}
      <AlertBanner
        variant="info"
        title="With icon"
        description="The leading status icon provides a redundant visual cue beyond colour alone."
        showIcon
      />
      {/* No icon */}
      <AlertBanner
        variant="warning"
        title="No icon"
        description="showIcon={false} removes the leading icon — useful when embedding in dense layouts."
        showIcon={false}
      />
      {/* Title only */}
      <AlertBanner
        variant="success"
        title="Title only — no description"
      />
      {/* Description only */}
      <AlertBanner
        variant="error"
        description="Description only, no title — banner text acts as the sole message."
      />
      {/* With actions */}
      <AlertBanner
        variant="warning"
        title="Subscription expiring"
        description="Your plan expires in 3 days. Renew to keep access."
        actions={
          <button
            type="button"
            className="text-body-sm font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:focus-ring rounded-[var(--radius-component-sm)]"
          >
            Renew now
          </button>
        }
      />
      {/* Dismissible */}
      <AlertBanner
        variant="info"
        title="Dismissible"
        description="A dismiss button (×) appears on the trailing edge when dismissible={true}."
        dismissible
        onDismiss={() => {}}
      />
    </div>
  ),
};

// ── 6. DarkMode ──────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-[var(--spacing-component-lg)] p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      {VARIANTS.map((variant) => (
        <AlertBanner
          key={variant}
          variant={variant}
          appearance="subtle"
          title={VARIANT_CONTENT[variant].title}
          description={VARIANT_CONTENT[variant].description}
          dismissible
        />
      ))}
      {/* Left-accent in dark */}
      <AlertBanner
        variant="error"
        appearance="left-accent"
        title="Left-accent in dark mode"
        description="The accent bar and tinted background adapt to dark semantics automatically."
      />
    </div>
  ),
};

// ── 8. Playground ────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'info',
    appearance: 'subtle',
    size: 'md',
    title: 'Alert title',
    description: 'A short description that explains the situation and what the user can do.',
    showIcon: true,
    dismissible: true,
  },
};

// ── 9. Accessibility ─────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] p-[var(--spacing-layout-xs)]">
      {/*
        Keyboard:      Tab to reach the dismiss button · Enter/Space to dismiss
        Screen reader: role="alert" announces immediately for error/warning
                       role="status" announces politely for info/success
                       Dismiss button: "Dismiss, button"
                       Icon wrapper is aria-hidden — colour is NOT the only cue (icon present too)
      */}

      {/* Info → role="status" (polite) */}
      <AlertBanner
        variant="info"
        title="Session info"
        description="Polite announcement — screen reader waits for a pause before reading."
        dismissible
        onDismiss={() => {}}
        i18nStrings={{ dismissLabel: 'Dismiss info alert' }}
      />

      {/* Warning → role="alert" (assertive) */}
      <AlertBanner
        variant="warning"
        title="Storage warning"
        description="Assertive announcement — screen reader interrupts current speech."
        dismissible
        onDismiss={() => {}}
        i18nStrings={{ dismissLabel: 'Dismiss storage warning' }}
      />

      {/* Error → role="alert" (assertive), icon-only dismiss with explicit label */}
      <AlertBanner
        variant="error"
        title="Payment error"
        description="Critical error — assertive live region ensures immediate announcement."
        dismissible
        onDismiss={() => {}}
        i18nStrings={{ dismissLabel: 'Dismiss payment error' }}
      />

      {/* Success → role="status" (polite), no title (description only) */}
      <AlertBanner
        variant="success"
        description="Changes saved — polite announcement, no icon title needed."
      />

      {/* Non-dismissible with actions — keyboard-accessible inline action */}
      <AlertBanner
        variant="warning"
        appearance="left-accent"
        title="Subscription expiring"
        description="Your plan expires in 3 days."
        actions={
          <button
            type="button"
            className="text-body-sm font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:focus-ring rounded-[var(--radius-component-sm)]"
            aria-label="Renew subscription now"
          >
            Renew now
          </button>
        }
      />
    </div>
  ),
};
