import type { Meta, StoryObj } from '@storybook/react';
import { FileInput } from './FileInput';

const meta: Meta<typeof FileInput> = {
  title: 'Atoms/FileInput',
  component: FileInput,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A styled file input atom that wraps the native `<input type="file">`. ' +
          'Consumers associate an accessible label via `aria-label` or an external `<label htmlFor>`. ' +
          'Selected filenames are displayed inline. Supports single and multiple file selection.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'ghost'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Height and typography scale',
    },
    error: { control: 'boolean', description: 'Error state' },
    isLoading: { control: 'boolean', description: 'Loading/uploading state' },
    disabled: { control: 'boolean', description: 'Disabled state' },
    multiple: { control: 'boolean', description: 'Allow multiple file selection' },
    accept: { control: 'text', description: 'Accepted file types (e.g. "image/*,.pdf")' },
  },
};
export default meta;
type Story = StoryObj<typeof FileInput>;

// ── 1. Default ────────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    'aria-label': 'Upload document',
  },
};

// ── 2. Variants ───────────────────────────────────────────────────────────────
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-sm">
      {(['default', 'filled', 'ghost'] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-[var(--spacing-component-xs)]">
          <span className="text-body-sm text-[var(--color-text-secondary)] capitalize">{variant}</span>
          <FileInput variant={variant} aria-label={`Upload — ${variant} variant`} />
        </div>
      ))}
    </div>
  ),
};

// ── 3. Sizes ──────────────────────────────────────────────────────────────────
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-sm">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col gap-[var(--spacing-component-xs)]">
          <span className="text-body-sm text-[var(--color-text-secondary)] uppercase">{size}</span>
          <FileInput size={size} aria-label={`Upload — ${size} size`} />
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ─────────────────────────────────────────────────────────────────
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-component-lg)] max-w-sm">
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">Default</span>
        <FileInput aria-label="Upload document" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">Error</span>
        <FileInput error aria-label="Upload document" aria-describedby="file-error-msg" />
        <span id="file-error-msg" className="text-body-sm text-[var(--color-text-error)]">
          Please select a valid file.
        </span>
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">Loading</span>
        <FileInput isLoading aria-label="Upload document" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">Disabled</span>
        <FileInput disabled aria-label="Upload document" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">Multiple files</span>
        <FileInput multiple aria-label="Upload images" accept="image/*" />
      </div>
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">PDF only</span>
        <FileInput accept=".pdf" aria-label="Upload PDF" />
      </div>
    </div>
  ),
};

// ── 5. Dark mode ──────────────────────────────────────────────────────────────
export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="bg-primary p-[var(--spacing-layout-xs)] rounded-[var(--radius-component-lg)] max-w-2xl">
      <div className="flex flex-col gap-[var(--spacing-layout-xs)]">
        {(['default', 'filled', 'ghost'] as const).map((variant) => (
          <div key={variant} className="flex flex-col gap-[var(--spacing-component-xs)]">
            <span className="text-body-sm text-[var(--color-text-secondary)] capitalize">{variant}</span>
            <FileInput variant={variant} aria-label={`Upload — ${variant} dark`} />
          </div>
        ))}
        <FileInput error aria-label="Upload with error — dark" />
        <FileInput isLoading aria-label="Upload loading — dark" />
        <FileInput disabled aria-label="Upload disabled — dark" />
      </div>
    </div>
  ),
};

// ── 7. Playground ─────────────────────────────────────────────────────────────
export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    error: false,
    isLoading: false,
    disabled: false,
    multiple: false,
    accept: '',
    'aria-label': 'Upload file',
  },
};

// ── 8. Accessibility ──────────────────────────────────────────────────────────
export const Accessibility: Story = {
  tags: ['a11y'],
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-xs)] max-w-sm">
      {/* Pattern 1: aria-label directly on FileInput */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">
          Pattern 1 — aria-label on input
        </span>
        <FileInput
          aria-label="Profile photo"
          accept="image/*"
        />
      </div>

      {/* Pattern 2: External <label> via htmlFor */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">
          Pattern 2 — external label via htmlFor
        </span>
        <label
          htmlFor="resume-upload"
          className="text-body-md text-[var(--color-text-primary)] font-medium"
        >
          Resume
        </label>
        <FileInput id="resume-upload" accept=".pdf,.doc,.docx" />
      </div>

      {/* Error + aria-describedby */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">
          Error state with aria-describedby
        </span>
        <FileInput
          error
          aria-label="Upload document"
          aria-describedby="a11y-file-error"
          aria-invalid="true"
        />
        <span
          id="a11y-file-error"
          role="alert"
          className="text-body-sm text-[var(--color-text-error)]"
        >
          File must be under 10MB.
        </span>
      </div>

      {/* Required field */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <label
          htmlFor="required-upload"
          className="text-body-md text-[var(--color-text-primary)] font-medium"
        >
          Contract (required)
        </label>
        <FileInput
          id="required-upload"
          required
          aria-required="true"
          accept=".pdf"
        />
      </div>

      {/* Loading / busy */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">Loading (aria-busy)</span>
        <FileInput
          isLoading
          aria-label="Upload document"
          aria-busy="true"
        />
      </div>

      {/* Multiple selection */}
      <div className="flex flex-col gap-[var(--spacing-component-xs)]">
        <span className="text-body-sm text-[var(--color-text-secondary)]">Multiple files</span>
        <FileInput
          multiple
          aria-label="Upload images (multiple allowed)"
          accept="image/*"
        />
      </div>
    </div>
  ),
};
