"use client"
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Form, FormField, FormActions } from './Form';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../atoms/Input/Input';
import { Textarea } from '../../atoms/Textarea/Textarea';
import { Select } from '../../atoms/Select/Select';
import { Checkbox } from '../../atoms/Checkbox/Checkbox';
import { Fieldset } from '../../molecules/Fieldset/Fieldset';

const meta: Meta<typeof Form> = {
  title: 'Organisms/Form',
  component: Form,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    gap: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
    noValidate: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Form>;

// ─────────────────────────────────────────────────────────────────────────────
// 1. Default
// ─────────────────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => {
    return (
      <div className="max-w-lg">
        <Form
          gap="md"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Form.Field label="Full name" htmlFor="name" required hint="As it appears on your ID.">
            <Input
              id="name"
              type="text"
              placeholder="Jane Smith"
              aria-required="true"
              aria-describedby="name-hint"
            />
          </Form.Field>

          <Form.Field label="Email address" htmlFor="email" required>
            <Input
              id="email"
              type="email"
              placeholder="jane@example.com"
              aria-required="true"
            />
          </Form.Field>

          <Form.Field label="Country" htmlFor="country">
            <Select
              id="country"
              options={[
                { value: '', label: 'Select a country…' },
                { value: 'us', label: 'United States' },
                { value: 'gb', label: 'United Kingdom' },
                { value: 'ca', label: 'Canada' },
                { value: 'au', label: 'Australia' },
              ]}
            />
          </Form.Field>

          <Form.Field label="Message" htmlFor="message" optional hint="Up to 500 characters.">
            <Textarea
              id="message"
              placeholder="Tell us about your project…"
              rows={4}
              aria-describedby="message-hint"
            />
          </Form.Field>

          <Fieldset legend="Notifications" gap="sm">
            <Checkbox id="notify-email">Email notifications</Checkbox>
            <Checkbox id="notify-sms">SMS notifications</Checkbox>
          </Fieldset>

          <Form.Actions align="end" gap="md" separator>
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit">Send message</Button>
          </Form.Actions>
        </Form>
      </div>
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Variants — stacked vs inline label position
// ─────────────────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-md)]">
      {/* Stacked (top) */}
      <div>
        <p className="text-label-md text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Stacked (labelPosition="top" — default)
        </p>
        <div className="max-w-lg">
          <Form gap="md" onSubmit={(e) => e.preventDefault()}>
            <Form.Field label="First name" htmlFor="stacked-fname" required>
              <Input id="stacked-fname" type="text" placeholder="Jane" aria-required="true" />
            </Form.Field>
            <Form.Field label="Last name" htmlFor="stacked-lname">
              <Input id="stacked-lname" type="text" placeholder="Smith" />
            </Form.Field>
            <Form.Actions align="end">
              <Button type="submit">Save</Button>
            </Form.Actions>
          </Form>
        </div>
      </div>

      {/* Inline (left) */}
      <div>
        <p className="text-label-md text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Inline (labelPosition="left")
        </p>
        <div className="max-w-2xl">
          <Form gap="md" onSubmit={(e) => e.preventDefault()}>
            <Form.Field label="First name" htmlFor="inline-fname" required labelPosition="left">
              <Input id="inline-fname" type="text" placeholder="Jane" aria-required="true" />
            </Form.Field>
            <Form.Field label="Last name" htmlFor="inline-lname" labelPosition="left">
              <Input id="inline-lname" type="text" placeholder="Smith" />
            </Form.Field>
            <Form.Field label="Country" htmlFor="inline-country" labelPosition="left">
              <Select
                id="inline-country"
                options={[
                  { value: '', label: 'Select…' },
                  { value: 'us', label: 'United States' },
                  { value: 'gb', label: 'United Kingdom' },
                ]}
              />
            </Form.Field>
            <Form.Actions align="end">
              <Button type="submit">Save</Button>
            </Form.Actions>
          </Form>
        </div>
      </div>
    </div>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Sizes — gap spacing between fields
// ─────────────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-md)]">
      {(['sm', 'md', 'lg'] as const).map((gap) => (
        <div key={gap}>
          <p className="text-label-md text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            gap="{gap}"
          </p>
          <div className="max-w-md">
            <Form gap={gap} onSubmit={(e) => e.preventDefault()}>
              <Form.Field label="Name" htmlFor={`size-name-${gap}`}>
                <Input id={`size-name-${gap}`} type="text" placeholder="Jane Smith" />
              </Form.Field>
              <Form.Field label="Email" htmlFor={`size-email-${gap}`}>
                <Input id={`size-email-${gap}`} type="email" placeholder="jane@example.com" />
              </Form.Field>
              <Form.Actions align="end">
                <Button type="submit">Submit</Button>
              </Form.Actions>
            </Form>
          </div>
        </div>
      ))}
    </div>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. States — loading, errors, disabled group
// ─────────────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);

    return (
      <div className="flex flex-col gap-[var(--spacing-layout-md)]">
        {/* With validation errors */}
        <div>
          <p className="text-label-md text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            Validation errors
          </p>
          <div className="max-w-md">
            <Form gap="md" onSubmit={(e) => e.preventDefault()}>
              <Form.Field
                label="Email"
                htmlFor="err-email"
                required
                error="Please enter a valid email address."
              >
                <Input
                  id="err-email"
                  type="email"
                  defaultValue="not-an-email"
                  aria-invalid="true"
                  aria-required="true"
                  aria-describedby="err-email-error"
                />
              </Form.Field>
              <Form.Field
                label="Password"
                htmlFor="err-password"
                required
                error="Password must be at least 8 characters."
                hint="Use a mix of letters, numbers and symbols."
              >
                <Input
                  id="err-password"
                  type="password"
                  aria-invalid="true"
                  aria-required="true"
                  aria-describedby="err-password-error"
                />
              </Form.Field>
              <Form.Actions align="end">
                <Button type="submit">Sign in</Button>
              </Form.Actions>
            </Form>
          </div>
        </div>

        {/* Loading / submitting */}
        <div>
          <p className="text-label-md text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            Loading state (aria-busy)
          </p>
          <div className="max-w-md">
            <Form gap="md" loading={loading} onSubmit={(e) => { e.preventDefault(); setLoading(true); setTimeout(() => setLoading(false), 2000); }}>
              <Fieldset legend="Account details" disabled={loading}>
                <Form.Field label="Name" htmlFor="loading-name">
                  <Input id="loading-name" type="text" placeholder="Jane Smith" disabled={loading} />
                </Form.Field>
                <Form.Field label="Email" htmlFor="loading-email">
                  <Input id="loading-email" type="email" placeholder="jane@example.com" disabled={loading} />
                </Form.Field>
              </Fieldset>
              <Form.Actions align="end" separator>
                <Button type="submit" isLoading={loading} disabled={loading}>
                  {loading ? 'Saving…' : 'Save changes'}
                </Button>
              </Form.Actions>
            </Form>
          </div>
        </div>

        {/* Disabled (entire group) */}
        <div>
          <p className="text-label-md text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
            Disabled group (fieldset disabled)
          </p>
          <div className="max-w-md">
            <Form gap="md">
              <Fieldset legend="Read-only profile" disabled>
                <Form.Field label="Name" htmlFor="dis-name" disabled>
                  <Input id="dis-name" type="text" defaultValue="Jane Smith" disabled />
                </Form.Field>
                <Form.Field label="Email" htmlFor="dis-email" disabled>
                  <Input id="dis-email" type="email" defaultValue="jane@example.com" disabled />
                </Form.Field>
              </Fieldset>
              <Form.Actions align="end" separator>
                <Button type="submit" disabled>Save changes</Button>
              </Form.Actions>
            </Form>
          </div>
        </div>
      </div>
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. DarkMode
// ─────────────────────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="p-8 bg-primary rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <Form gap="md" onSubmit={(e) => e.preventDefault()}>
        <Form.Field label="Full name" htmlFor="dm-name" required hint="As it appears on your ID.">
          <Input
            id="dm-name"
            type="text"
            placeholder="Jane Smith"
            aria-required="true"
            aria-describedby="dm-name-hint"
          />
        </Form.Field>
        <Form.Field label="Email address" htmlFor="dm-email" required>
          <Input id="dm-email" type="email" placeholder="jane@example.com" aria-required="true" />
        </Form.Field>
        <Form.Field label="Message" htmlFor="dm-message" optional>
          <Textarea id="dm-message" placeholder="Tell us about your project…" rows={3} />
        </Form.Field>
        <Form.Field
          label="Password"
          htmlFor="dm-err"
          required
          error="Password must be at least 8 characters."
        >
          <Input id="dm-err" type="password" aria-invalid="true" aria-describedby="dm-err-error" />
        </Form.Field>
        <Form.Actions align="end" gap="md" separator>
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit">Submit</Button>
        </Form.Actions>
      </Form>
    </div>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. Validation
// ─────────────────────────────────────────────────────────────────────────────

export const Validation: Story = {
  name: 'Validation States',
  render: () => (
    <div className="max-w-lg flex flex-col gap-[var(--spacing-layout-sm)]">
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Error state — <code>role=&quot;alert&quot;</code> announces the error immediately on mount.
          Link hint and error IDs via <code>aria-describedby</code> on the control.
        </p>
        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Field
            label="Email address"
            htmlFor="val-email"
            required
            error="Please enter a valid email address."
          >
            <Input
              id="val-email"
              type="email"
              defaultValue="not-an-email"
              aria-invalid="true"
              aria-required="true"
              aria-describedby="val-email-error"
            />
          </Form.Field>
          <Form.Field
            label="Password"
            htmlFor="val-pw"
            required
            hint="Must be at least 8 characters."
            error="Password is too short."
          >
            <Input
              id="val-pw"
              type="password"
              defaultValue="abc"
              aria-invalid="true"
              aria-required="true"
              aria-describedby="val-pw-error"
            />
          </Form.Field>
          <Form.Field label="Username" htmlFor="val-user" required hint="Letters and numbers only.">
            <Input
              id="val-user"
              type="text"
              placeholder="jane_doe"
              aria-required="true"
              aria-describedby="val-user-hint"
            />
          </Form.Field>
          <Form.Actions align="end" separator>
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit">Submit</Button>
          </Form.Actions>
        </Form>
      </div>

      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-md)]">
          Loading state — <code>aria-busy=&quot;true&quot;</code> on the form element; controls disabled via <code>Fieldset</code>.
        </p>
        <Form onSubmit={(e) => e.preventDefault()} loading>
          <Fieldset legend="Account details" disabled>
            <Form.Field label="Full name" htmlFor="val-name-loading">
              <Input id="val-name-loading" type="text" defaultValue="Jane Smith" />
            </Form.Field>
            <Form.Field label="Email" htmlFor="val-email-loading">
              <Input id="val-email-loading" type="email" defaultValue="jane@example.com" />
            </Form.Field>
          </Fieldset>
          <Form.Actions align="end" separator>
            <Button type="button" variant="outline" disabled>Cancel</Button>
            <Button type="submit" isLoading disabled>Submitting…</Button>
          </Form.Actions>
        </Form>
      </div>
    </div>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. Playground
// ─────────────────────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    gap: 'md',
    loading: false,
    noValidate: true,
  },
  render: (args) => (
    <div className="max-w-lg">
      <Form {...args} onSubmit={(e) => e.preventDefault()}>
        <Form.Field label="Name" htmlFor="pg-name" required hint="Your full name.">
          <Input id="pg-name" type="text" placeholder="Jane Smith" />
        </Form.Field>
        <Form.Field label="Email" htmlFor="pg-email" required>
          <Input id="pg-email" type="email" placeholder="jane@example.com" />
        </Form.Field>
        <Form.Field label="Message" htmlFor="pg-message" optional>
          <Textarea id="pg-message" placeholder="Your message…" rows={3} />
        </Form.Field>
        <Form.Actions align="end" separator>
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit" isLoading={args.loading} disabled={args.loading}>
            {args.loading ? 'Submitting…' : 'Submit'}
          </Button>
        </Form.Actions>
      </Form>
    </div>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. Accessibility
// ─────────────────────────────────────────────────────────────────────────────

export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] p-[var(--spacing-layout-xs)] max-w-2xl">
      {/*
       * KEYBOARD: Tab moves between fields · Enter submits · Space checks checkboxes
       * SCREEN READER:
       *   - "Full name, required, edit text" (input with aria-required)
       *   - "(required)" announced after label text via sr-only span in Label atom
       *   - Error: "Please enter a valid email, alert" (role="alert" on error paragraph)
       *   - Loading: form with aria-busy="true" → "busy" announced by some SR
       *   - Form.Field IDs: {htmlFor}-hint / {htmlFor}-error for aria-describedby
       */}

      {/* Proper label association + required + hint */}
      <Form gap="md" onSubmit={(e) => e.preventDefault()}>
        <Form.Field
          label="Full name"
          htmlFor="a11y-name"
          required
          hint="As it appears on your government-issued ID."
        >
          <Input
            id="a11y-name"
            type="text"
            placeholder="Jane Smith"
            aria-required="true"
            aria-describedby="a11y-name-hint"
          />
        </Form.Field>

        {/* Email with validation error — aria-invalid + aria-describedby */}
        <Form.Field
          label="Email address"
          htmlFor="a11y-email"
          required
          error="Please enter a valid email address."
        >
          <Input
            id="a11y-email"
            type="email"
            defaultValue="not-an-email"
            aria-required="true"
            aria-invalid="true"
            aria-describedby="a11y-email-error"
          />
        </Form.Field>

        {/* Optional field */}
        <Form.Field
          label="Phone number"
          htmlFor="a11y-phone"
          optional
          hint="Used for two-factor authentication only."
        >
          <Input
            id="a11y-phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            aria-describedby="a11y-phone-hint"
          />
        </Form.Field>

        {/* Checkbox inside Fieldset for group labelling */}
        <Fieldset legend="Communication preferences" gap="sm">
          <Checkbox id="a11y-email-pref">Email updates</Checkbox>
          <Checkbox id="a11y-sms-pref">SMS alerts</Checkbox>
        </Fieldset>

        {/* Actions */}
        <Form.Actions align="end" gap="md" separator>
          {/* type="button" explicitly prevents accidental form submission */}
          <Button type="button" variant="outline">Cancel</Button>
          {/* type="submit" submits the enclosing <form> — no onClick needed */}
          <Button type="submit">Save profile</Button>
        </Form.Actions>
      </Form>
    </div>
  ),
};

// Named exports for compound slot direct usage
export { FormField, FormActions };
