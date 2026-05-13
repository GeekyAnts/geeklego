import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';
import { Input } from '../../atoms/Input/Input';
import { Select } from '../../atoms/Select/Select';
import { Textarea } from '../../atoms/Textarea/Textarea';
import { Checkbox } from '../../atoms/Checkbox/Checkbox';

const meta: Meta<typeof FormField> = {
  title: 'Molecules/FormField',
  component: FormField,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    label: { control: 'text' },
    htmlFor: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    optional: { control: 'boolean' },
    disabled: { control: 'boolean' },
    labelPosition: { control: 'select', options: ['top', 'left'] },
    size: { control: 'select', options: ['sm', 'md'] },
  },
};
export default meta;
type Story = StoryObj<typeof FormField>;

// ── 1. Default ────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    label: 'Email address',
    htmlFor: 'email-default',
    hint: 'We will never share your email with anyone.',
  },
  render: (args) => (
    <FormField {...args}>
      <Input
        id="email-default"
        type="email"
        placeholder="you@example.com"
        aria-describedby={args.hint ? 'email-default-hint' : undefined}
      />
    </FormField>
  ),
};

// ── 2. Variants (label positions) ─────────────────────────────────────────────
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-md)] max-w-lg">
      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] mb-2">
          labelPosition="top" (default)
        </p>
        <FormField label="Full name" htmlFor="name-top" hint="As it appears on your ID.">
          <Input id="name-top" placeholder="Jane Doe" aria-describedby="name-top-hint" />
        </FormField>
      </div>

      <div>
        <p className="text-label-sm text-[var(--color-text-tertiary)] mb-2">
          labelPosition="left" (inline)
        </p>
        <FormField
          label="Full name"
          htmlFor="name-left"
          labelPosition="left"
          hint="As it appears on your ID."
        >
          <Input id="name-left" placeholder="Jane Doe" aria-describedby="name-left-hint" />
        </FormField>
      </div>
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-md)] max-w-lg">
      {(['sm', 'md'] as const).map((s) => (
        <div key={s}>
          <p className="text-label-sm text-[var(--color-text-tertiary)] mb-2">size="{s}"</p>
          <FormField
            label="Username"
            htmlFor={`username-${s}`}
            size={s}
            hint="3–20 characters, letters and numbers only."
          >
            <Input
              id={`username-${s}`}
              size={s}
              placeholder="johndoe"
              aria-describedby={`username-${s}-hint`}
            />
          </FormField>
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] max-w-lg">
      {/* Default */}
      <FormField label="Default" htmlFor="state-default" hint="Helper text">
        <Input id="state-default" placeholder="Default state" aria-describedby="state-default-hint" />
      </FormField>

      {/* Required */}
      <FormField label="Required" htmlFor="state-required" required hint="This field is mandatory.">
        <Input
          id="state-required"
          placeholder="Required field"
          required
          aria-required="true"
          aria-describedby="state-required-hint"
        />
      </FormField>

      {/* Optional */}
      <FormField label="Optional" htmlFor="state-optional" optional>
        <Input id="state-optional" placeholder="Optional field" />
      </FormField>

      {/* Disabled */}
      <FormField label="Disabled" htmlFor="state-disabled" disabled hint="This field is locked.">
        <Input
          id="state-disabled"
          placeholder="Disabled field"
          disabled
          aria-describedby="state-disabled-hint"
        />
      </FormField>

      {/* Error */}
      <FormField
        label="Error"
        htmlFor="state-error"
        error="Please enter a valid email address."
        required
      >
        <Input
          id="state-error"
          placeholder="bad@"
          error
          aria-invalid="true"
          aria-describedby="state-error-error"
        />
      </FormField>

      {/* Loading */}
      <FormField label="Loading" htmlFor="state-loading">
        <Input id="state-loading" placeholder="Validating…" isLoading aria-busy="true" />
      </FormField>
    </div>
  ),
};

// ── 5. DarkMode ───────────────────────────────────────────────────────────────
export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-[var(--spacing-layout-sm)] p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <FormField label="Email" htmlFor="dark-email" hint="We keep it private." required>
        <Input
          id="dark-email"
          type="email"
          placeholder="you@example.com"
          required
          aria-required="true"
          aria-describedby="dark-email-hint"
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="dark-password"
        error="Must be at least 8 characters."
      >
        <Input
          id="dark-password"
          type="password"
          placeholder="••••••••"
          error
          aria-invalid="true"
          aria-describedby="dark-password-error"
        />
      </FormField>

      <FormField label="Role" htmlFor="dark-role" labelPosition="left" optional>
        <Select
          id="dark-role"
          options={[
            { value: 'admin', label: 'Admin' },
            { value: 'editor', label: 'Editor' },
            { value: 'viewer', label: 'Viewer' },
          ]}
          placeholder="Choose a role"
        />
      </FormField>

      <FormField label="Disabled" htmlFor="dark-disabled" disabled>
        <Input id="dark-disabled" placeholder="Locked" disabled />
      </FormField>
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────
export const Playground: Story = {
  args: {
    label: 'Field label',
    htmlFor: 'playground-field',
    hint: 'This is a helpful hint.',
    error: '',
    required: false,
    optional: false,
    disabled: false,
    labelPosition: 'top',
    size: 'md',
  },
  render: (args) => (
    <div className="max-w-lg">
      <FormField {...args}>
        <Input
          id="playground-field"
          placeholder="Type something…"
          disabled={args.disabled}
          error={!!args.error}
          aria-describedby={
            args.error
              ? 'playground-field-error'
              : args.hint
                ? 'playground-field-hint'
                : undefined
          }
          {...(args.required && { required: true, 'aria-required': 'true' as const })}
          {...(args.error && { 'aria-invalid': 'true' as const })}
        />
      </FormField>
    </div>
  ),
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────
export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] max-w-lg p-[var(--spacing-layout-xs)]">
      {/*
        Keyboard: Tab moves between controls. Label click focuses associated control.
        Screen reader:
          - Label announces field name + required/optional state
          - Hint announced via aria-describedby on the control
          - Error announced immediately via role="alert"
          - Disabled conveyed via aria-disabled on the control
      */}

      {/* Required field: label has sr-only "(required)" text */}
      <FormField
        label="Email address"
        htmlFor="a11y-email"
        required
        hint="We will never share your email."
      >
        <Input
          id="a11y-email"
          type="email"
          placeholder="you@example.com"
          required
          aria-required="true"
          aria-describedby="a11y-email-hint"
        />
      </FormField>

      {/* Error state: role="alert" on error paragraph */}
      <FormField
        label="Username"
        htmlFor="a11y-username"
        error="Username is already taken."
        required
      >
        <Input
          id="a11y-username"
          defaultValue="admin"
          error
          aria-invalid="true"
          aria-describedby="a11y-username-error"
          required
          aria-required="true"
        />
      </FormField>

      {/* Disabled field: label shows disabled color, control is inert */}
      <FormField label="Organization" htmlFor="a11y-org" disabled>
        <Input
          id="a11y-org"
          defaultValue="Geeklego Inc."
          disabled
          aria-disabled="true"
        />
      </FormField>

      {/* Optional field: "(Optional)" text readable by SR */}
      <FormField label="Phone number" htmlFor="a11y-phone" optional>
        <Input id="a11y-phone" type="tel" placeholder="+1 (555) 000-0000" />
      </FormField>
    </div>
  ),
};
