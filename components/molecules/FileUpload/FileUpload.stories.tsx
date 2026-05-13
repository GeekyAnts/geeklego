import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FileUpload } from './FileUpload';
import type { FileUploadFile } from './FileUpload.types';

// ── Helper: create a mock File with a controlled size ───────────────────────
function mockFile(name: string, sizeBytes: number, type = 'application/octet-stream'): File {
  const f = new File(['x'], name, { type });
  Object.defineProperty(f, 'size', { value: sizeBytes });
  return f;
}

const meta: Meta<typeof FileUpload> = {
  title: 'Molecules/FileUpload',
  component: FileUpload,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['dropzone', 'compact', 'button'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    multiple: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof FileUpload>;

// ── 1. Default ───────────────────────────────────────────────────────────────
export const Default: Story = {
  args: {
    variant: 'dropzone',
    size: 'md',
    hint: 'PNG, JPG, PDF up to 10 MB',
    multiple: true,
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [files, setFiles] = useState<FileUploadFile[]>([]);
    return (
      <div className="max-w-lg">
        <FileUpload
          {...args}
          files={files}
          onFilesChange={setFiles}
          onFileRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
        />
      </div>
    );
  },
};

// ── 2. Variants ──────────────────────────────────────────────────────────────
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] max-w-lg">
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">dropzone (default)</p>
        <FileUpload variant="dropzone" hint="PNG, JPG up to 5 MB" />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">compact</p>
        <FileUpload variant="compact" hint="PNG, JPG up to 5 MB" />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">button</p>
        <FileUpload variant="button" />
      </div>
    </div>
  ),
};

// ── 3. Sizes ─────────────────────────────────────────────────────────────────
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] max-w-lg">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size}>
          <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">{size}</p>
          <FileUpload size={size} hint="PNG, JPG up to 5 MB" />
        </div>
      ))}
    </div>
  ),
};

// ── 4. States ────────────────────────────────────────────────────────────────
const idleFile: FileUploadFile = {
  id: 'f1',
  file: mockFile('presentation.pdf', 2_457_600, 'application/pdf'),
  status: 'idle',
};
const uploadingFile: FileUploadFile = {
  id: 'f2',
  file: mockFile('banner.png', 512_000, 'image/png'),
  status: 'uploading',
  progress: 62,
};
const indeterminateFile: FileUploadFile = {
  id: 'f3',
  file: mockFile('report.xlsx', 98_304),
  status: 'uploading',
};
const doneFile: FileUploadFile = {
  id: 'f4',
  file: mockFile('logo.svg', 14_336, 'image/svg+xml'),
  status: 'done',
};
const errorFile: FileUploadFile = {
  id: 'f5',
  file: mockFile('video.mp4', 52_428_800, 'video/mp4'),
  status: 'error',
  error: 'File exceeds 10 MB limit',
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] max-w-lg">
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">Idle — no files selected</p>
        <FileUpload hint="PNG, JPG up to 10 MB" />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">With files — idle, uploading (with progress), uploading (indeterminate), done, error</p>
        <FileUpload
          files={[idleFile, uploadingFile, indeterminateFile, doneFile, errorFile]}
          hint="PNG, JPG up to 10 MB"
          multiple
        />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">Zone error state</p>
        <FileUpload error errorMessage="Only PNG and JPG files are accepted." hint="PNG, JPG up to 10 MB" />
      </div>
      <div>
        <p className="text-body-sm text-[var(--color-text-secondary)] mb-[var(--spacing-component-sm)]">Disabled</p>
        <FileUpload disabled files={[idleFile, doneFile]} hint="PNG, JPG up to 10 MB" multiple />
      </div>
    </div>
  ),
};

// ── 5. DarkMode ──────────────────────────────────────────────────────────────
export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-[var(--spacing-layout-sm)] p-8 bg-[var(--color-bg-primary)] rounded-[var(--radius-component-lg)] max-w-2xl"
    >
      <FileUpload hint="PNG, JPG up to 10 MB" />
      <FileUpload variant="compact" hint="PNG, JPG up to 5 MB" />
      <FileUpload
        files={[uploadingFile, doneFile, errorFile]}
        hint="PNG, JPG up to 10 MB"
        multiple
      />
    </div>
  ),
};

// ── 7. Playground ────────────────────────────────────────────────────────────
export const Playground: Story = {
  args: {
    variant:     'dropzone',
    size:        'md',
    multiple:    false,
    disabled:    false,
    error:       false,
    errorMessage: '',
    hint:        'PNG, JPG, PDF up to 10 MB',
    accept:      '',
  },
};

// ── 8. Accessibility ─────────────────────────────────────────────────────────
export const Accessibility: Story = {
  tags: ['a11y'],
  name: 'Accessibility',
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-layout-sm)] max-w-lg p-[var(--spacing-layout-xs)]">
      {/*
        Keyboard interactions:
          Tab          — focus the hidden input (labelled by the visible zone label)
          Enter/Space  — open the native file picker
          Drag & drop  — fires dragenter, dragover, drop events on the label element
          Tab to remove button — Enter/Space to remove a file
        Screen reader:
          Input:  "Upload files, file" (aria-label + type)
          Zone:   acted as <label> — announced as "Drop files here or click to browse"
          Item:   "2.4 MB · Done" via aria-live="polite" on meta paragraph
          Remove: "Remove file: presentation.pdf, button"
          Error:  announced immediately via role="alert"
      */}

      {/* Default accessible dropzone */}
      <FileUpload
        hint="PNG, JPG up to 5 MB"
        i18nStrings={{ inputLabel: 'Upload project files' }}
      />

      {/* With a file in done state — status change announced via aria-live */}
      <FileUpload
        files={[doneFile]}
        i18nStrings={{ removeFileLabel: 'Remove uploaded file' }}
      />

      {/* Disabled — aria-disabled on zone and input */}
      <FileUpload
        disabled
        hint="Uploads disabled during processing"
        i18nStrings={{ inputLabel: 'File upload (disabled)' }}
      />

      {/* Error state — role="alert" on error message */}
      <FileUpload
        error
        errorMessage="Only PNG and JPG files are accepted."
        i18nStrings={{ inputLabel: 'File upload (error state)' }}
      />

      {/* Button variant — Button atom handles keyboard + focus */}
      <FileUpload
        variant="button"
        files={[uploadingFile]}
        i18nStrings={{ dropzoneTitle: 'Attach files', removeFileLabel: 'Remove attachment' }}
      />
    </div>
  ),
};
