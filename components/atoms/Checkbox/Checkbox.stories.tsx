"use client"
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    children: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

/* ── Default ─────────────────────────────────────────────────────────────── */
export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)}>
        Accept terms and conditions
      </Checkbox>
    );
  },
  args: { size: 'md' },
};

/* ── Variants — unchecked · checked · indeterminate ─────────────────────── */
export const Variants: Story = {
  render: () => {
    const [checkedA, setCheckedA] = useState(false);
    const [checkedB, setCheckedB] = useState(true);
    const [checkedC, setCheckedC] = useState(false);
    return (
      <div className="flex flex-col gap-[var(--spacing-component-lg)]">
        <Checkbox checked={checkedA} onChange={(e) => setCheckedA(e.target.checked)}>
          Unchecked
        </Checkbox>
        <Checkbox checked={checkedB} onChange={(e) => setCheckedB(e.target.checked)}>
          Checked
        </Checkbox>
        <Checkbox
          checked={checkedC}
          indeterminate
          onChange={(e) => setCheckedC(e.target.checked)}
        >
          Indeterminate
        </Checkbox>
        <Checkbox checked={false} onChange={() => {}}>
          {/* Label-only variant — no label text */}
        </Checkbox>
      </div>
    );
  },
};

/* ── Sizes ───────────────────────────────────────────────────────────────── */
export const Sizes: Story = {
  render: () => {
    const [sm, setSm] = useState(true);
    const [md, setMd] = useState(true);
    const [lg, setLg] = useState(true);
    return (
      <div className="flex flex-col gap-[var(--spacing-component-lg)]">
        <Checkbox size="sm" checked={sm} onChange={(e) => setSm(e.target.checked)}>
          Small (14 px indicator)
        </Checkbox>
        <Checkbox size="md" checked={md} onChange={(e) => setMd(e.target.checked)}>
          Medium (16 px indicator)
        </Checkbox>
        <Checkbox size="lg" checked={lg} onChange={(e) => setLg(e.target.checked)}>
          Large (20 px indicator)
        </Checkbox>
      </div>
    );
  },
};

/* ── States ──────────────────────────────────────────────────────────────── */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)]">
      <Checkbox checked={false} onChange={() => {}}>
        Default (unchecked)
      </Checkbox>
      <Checkbox checked onChange={() => {}}>
        Checked
      </Checkbox>
      <Checkbox checked={false} indeterminate onChange={() => {}}>
        Indeterminate
      </Checkbox>
      <Checkbox checked={false} disabled onChange={() => {}}>
        Disabled unchecked
      </Checkbox>
      <Checkbox checked disabled onChange={() => {}}>
        Disabled checked
      </Checkbox>
      <Checkbox checked={false} indeterminate disabled onChange={() => {}}>
        Disabled indeterminate
      </Checkbox>
      <Checkbox checked={false} error onChange={() => {}}>
        Error unchecked
      </Checkbox>
      <Checkbox checked error onChange={() => {}}>
        Error checked
      </Checkbox>
      <Checkbox checked={false} required onChange={() => {}}>
        Required field
      </Checkbox>
    </div>
  ),
};

/* ── Dark Mode ───────────────────────────────────────────────────────────── */
export const DarkMode: Story = {
  render: () => {
    const [a, setA] = useState(false);
    const [b, setB] = useState(true);
    const [c, setC] = useState(false);
    return (
      <div data-theme="dark" className="bg-primary p-[var(--spacing-component-xl)] rounded-[var(--radius-component-lg)] max-w-2xl">
        <div className="flex flex-col gap-[var(--spacing-component-lg)]">
          <Checkbox checked={a} onChange={(e) => setA(e.target.checked)}>
            Unchecked in dark mode
          </Checkbox>
          <Checkbox checked={b} onChange={(e) => setB(e.target.checked)}>
            Checked in dark mode
          </Checkbox>
          <Checkbox checked={c} indeterminate onChange={(e) => setC(e.target.checked)}>
            Indeterminate in dark mode
          </Checkbox>
          <Checkbox checked={false} disabled onChange={() => {}}>
            Disabled in dark mode
          </Checkbox>
          <Checkbox checked={false} error onChange={() => {}}>
            Error in dark mode
          </Checkbox>
        </div>
      </div>
    );
  },
};

/* ── Playground ──────────────────────────────────────────────────────────── */
export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked ?? false);
    return (
      <Checkbox
        {...args}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      >
        {args.children ?? 'Playground checkbox'}
      </Checkbox>
    );
  },
  args: {
    size: 'md',
    checked: false,
    indeterminate: false,
    error: false,
    disabled: false,
    required: false,
    children: 'Playground checkbox',
  },
};

// ── 8 · LongLabel ────────────────────────────────────────────────────────────

export const LongLabel: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex flex-col gap-6 w-96">
        {/* Multi-line label text */}
        <Checkbox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        >
          I understand and agree that by checking this box, I accept the terms and conditions, privacy policy, and cookie preferences as outlined in our comprehensive documentation.
        </Checkbox>

        {/* Very long single line — should wrap naturally */}
        <Checkbox>
          This is an exceptionally long checkbox label that contains a lot of text and should demonstrate how the component handles layout when the content extends beyond a single line.
        </Checkbox>

        {/* Long label with required indicator */}
        <Checkbox required>
          I confirm that all information provided above is accurate and complete to the best of my knowledge and belief.
        </Checkbox>
      </div>
    );
  },
};

/* ── Accessibility ───────────────────────────────────────────────────────── */
export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => {
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(true);
    const [checked3, setChecked3] = useState(false);
    return (
      <div className="flex flex-col gap-[var(--spacing-component-lg)]">
        {/* Explicit label via children */}
        <Checkbox
          checked={checked1}
          onChange={(e) => setChecked1(e.target.checked)}
          aria-describedby="terms-hint"
        >
          I agree to the terms of service
        </Checkbox>
        <p
          id="terms-hint"
          className="text-body-sm text-[var(--color-text-secondary)] ms-[var(--spacing-component-xl)]"
        >
          You must accept to continue.
        </p>

        {/* Required field */}
        <Checkbox
          checked={checked2}
          required
          onChange={(e) => setChecked2(e.target.checked)}
        >
          Required subscription confirmation
        </Checkbox>

        {/* Error state with describedby */}
        <Checkbox
          checked={checked3}
          error
          onChange={(e) => setChecked3(e.target.checked)}
          aria-describedby="marketing-error"
        >
          Marketing emails
        </Checkbox>
        <p
          id="marketing-error"
          className="text-body-sm text-[var(--color-border-error)] ms-[var(--spacing-component-xl)]"
          role="alert"
        >
          Please make a selection.
        </p>

        {/* Label-less — aria-label provides the accessible name */}
        <Checkbox
          checked={false}
          onChange={() => {}}
          aria-label="Select all items"
        />
      </div>
    );
  },
};
