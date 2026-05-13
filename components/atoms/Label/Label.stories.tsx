import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

const meta: Meta<typeof Label> = {
  title: 'Atoms/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    required: { control: 'boolean' },
    optional: { control: 'boolean' },
    disabled: { control: 'boolean' },
    hasError: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Label>;

/* ── 1. Default ───────────────────────────────────────────────────────────── */
export const Default: Story = {
  args: {
    children: 'Email address',
    htmlFor: 'email',
    size: 'md',
    required: false,
    optional: false,
    disabled: false,
    hasError: false,
  },
};

/* ── 2. Variants ──────────────────────────────────────────────────────────── */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-md)]">
      <Label htmlFor="v1">Default label</Label>
      <Label htmlFor="v2" required>Required label</Label>
      <Label htmlFor="v3" optional>Optional label</Label>
      <Label htmlFor="v4" required optional>Required and optional</Label>
    </div>
  ),
};

/* ── 3. Sizes ─────────────────────────────────────────────────────────────── */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-sm)]">
      <Label htmlFor="size-md" size="md">Medium label (default)</Label>
      <Label htmlFor="size-sm" size="sm">Small label</Label>
      <Label htmlFor="size-md-req" size="md" required>Medium required</Label>
      <Label htmlFor="size-sm-req" size="sm" required>Small required</Label>
    </div>
  ),
};

/* ── 4. States ────────────────────────────────────────────────────────────── */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-md)]">
      {[
        { label: 'Default',           props: {} },
        { label: 'Disabled',          props: { disabled: true } },
        { label: 'Error',             props: { hasError: true } },
        { label: 'Required',          props: { required: true } },
        { label: 'Required + Disabled', props: { required: true, disabled: true } },
        { label: 'Required + Error',  props: { required: true, hasError: true } },
        { label: 'Optional',          props: { optional: true } },
      ].map(({ label, props }) => (
        <div key={label}>
          <p className="text-label-xs text-[var(--color-text-tertiary)] mb-1">{label}</p>
          <Label htmlFor={`state-${label}`} {...props}>First name</Label>
        </div>
      ))}
      <div>
        <p className="text-label-xs text-[var(--color-text-tertiary)] mb-1">Truncated (long text)</p>
        <Label htmlFor="state-truncated">
          This is a very long label text that should truncate gracefully with ellipsis
        </Label>
      </div>
    </div>
  ),
};

/* ── 5. DarkMode ──────────────────────────────────────────────────────────── */
export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-[var(--spacing-component-md)] p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <Label htmlFor="d1">Default label</Label>
      <Label htmlFor="d2" required>Required label</Label>
      <Label htmlFor="d3" optional>Optional label</Label>
      <Label htmlFor="d4" disabled>Disabled label</Label>
      <Label htmlFor="d5" hasError>Error label</Label>
      <Label htmlFor="d6" required hasError>Required + Error</Label>
      <Label htmlFor="d7" size="sm" required>Small required</Label>
    </div>
  ),
};

/* ── 6. LongText ─────────────────────────────────────────────────────────── */
export const LongText: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
      <div className="flex flex-col gap-2">
        <span className="text-label-xs text-[var(--color-text-tertiary)]">Truncation at constrained width (120px)</span>
        <div className="w-[120px]">
          <Label htmlFor="lt-1">A very long label that should truncate</Label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-label-xs text-[var(--color-text-tertiary)]">Required with long text (200px)</span>
        <div className="w-[200px]">
          <Label htmlFor="lt-2" required>Full legal name as per passport or ID document</Label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-label-xs text-[var(--color-text-tertiary)]">Optional with long text (200px)</span>
        <div className="w-[200px]">
          <Label htmlFor="lt-3" optional>Secondary billing address line two</Label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-label-xs text-[var(--color-text-tertiary)]">i18n override — custom required/optional strings</span>
        <div className="flex flex-col gap-[var(--spacing-component-sm)]">
          <Label htmlFor="lt-4" required i18nStrings={{ required: '(pflicht)' }}>E-Mail-Adresse</Label>
          <Label htmlFor="lt-5" optional i18nStrings={{ optional: '(facultatif)' }}>Prénom</Label>
        </div>
      </div>
    </div>
  ),
};

/* ── 7. Playground ────────────────────────────────────────────────────────── */
export const Playground: Story = {
  args: {
    children: 'Email address',
    htmlFor: 'playground-input',
    size: 'md',
    required: false,
    optional: false,
    disabled: false,
    hasError: false,
  },
};

/* ── 8. Accessibility ─────────────────────────────────────────────────────── */
export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] p-[var(--spacing-layout-xs)]">
      {/* Default: label associated to input via htmlFor/id */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <Label htmlFor="a11y-email">Email address</Label>
        <input
          id="a11y-email"
          type="email"
          className="h-[var(--size-component-md)] px-[var(--spacing-component-md)] rounded-[var(--radius-component-md)] border border-[var(--color-border-default)] text-body-sm text-[var(--color-text-primary)] bg-[var(--color-bg-primary)]"
          placeholder="you@example.com"
        />
      </div>

      {/* Required: asterisk hidden from AT, "(required)" announced via sr-only */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <Label htmlFor="a11y-password" required>Password</Label>
        <input
          id="a11y-password"
          type="password"
          required
          aria-required="true"
          className="h-[var(--size-component-md)] px-[var(--spacing-component-md)] rounded-[var(--radius-component-md)] border border-[var(--color-border-default)] text-body-sm text-[var(--color-text-primary)] bg-[var(--color-bg-primary)]"
        />
      </div>

      {/* Optional: "(Optional)" text readable by screen readers */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <Label htmlFor="a11y-middle" optional>Middle name</Label>
        <input
          id="a11y-middle"
          type="text"
          className="h-[var(--size-component-md)] px-[var(--spacing-component-md)] rounded-[var(--radius-component-md)] border border-[var(--color-border-default)] text-body-sm text-[var(--color-text-primary)] bg-[var(--color-bg-primary)]"
        />
      </div>

      {/* Error: label color changes; aria-invalid belongs on the input, not the label */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <Label htmlFor="a11y-username" hasError required>Username</Label>
        <input
          id="a11y-username"
          type="text"
          aria-invalid="true"
          aria-describedby="a11y-username-error"
          className="h-[var(--size-component-md)] px-[var(--spacing-component-md)] rounded-[var(--radius-component-md)] border border-[var(--color-border-error)] text-body-sm text-[var(--color-text-primary)] bg-[var(--color-bg-primary)]"
          defaultValue="taken@user"
        />
        <span
          id="a11y-username-error"
          className="text-label-sm text-[var(--color-status-error)]"
        >
          This username is already taken.
        </span>
      </div>
    </div>
  ),
};
