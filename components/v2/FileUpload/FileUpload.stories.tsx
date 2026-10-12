import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FileUpload } from "./FileUpload";
import type { UploadFile } from "./FileUpload.types";
import "../../../design-system/v2/index.css";

const meta = {
  title: "v2/FileUpload",
  component: FileUpload,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Dropzone wrapping a visually-hidden native `<input type=\"file\">`. Supports drag-and-drop, click-to-browse, a selected-file list with per-file `progress`/`status`, and controlled or uncontrolled selection. Styled with standard semantics only; the `error` variant reuses `--destructive`.",
      },
    },
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "error"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Multiple: Story = {
  args: {
    multiple: true,
    label: "Drag & drop or browse",
    hint: "Upload as many files as you like",
  },
};

export const WithAccept: Story = {
  args: {
    accept: "image/png,image/jpeg",
    label: "Drop an image",
    hint: "PNG or JPG up to 5MB",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <FileUpload size="sm" label="Small dropzone" hint="click to browse" />
      <FileUpload size="md" label="Medium dropzone" hint="click to browse" />
      <FileUpload size="lg" label="Large dropzone" hint="click to browse" />
    </div>
  ),
};

export const ErrorState: Story = {
  args: {
    variant: "error",
    label: "Upload failed",
    hint: "File exceeds the 5MB limit — try again",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: "Uploads disabled",
    hint: "You don't have permission to upload here",
  },
};

/** Pre-populated list showing every per-file status: uploading, success, error. */
export const WithFileStatuses: Story = {
  render: () => {
    const files: UploadFile[] = [
      {
        id: "1",
        file: new File(["x".repeat(1_200_000)], "annual-report.pdf"),
        status: "uploading",
        progress: 62,
      },
      {
        id: "2",
        file: new File(["x".repeat(48_000)], "logo.png"),
        status: "success",
        message: "Uploaded",
      },
      {
        id: "3",
        file: new File(["x".repeat(9_500_000)], "keynote-recording.mov"),
        status: "error",
        message: "File exceeds the 5MB limit",
      },
    ];
    return <FileUpload multiple value={files} onValueChange={() => {}} />;
  },
};

/** Controlled example — remove buttons mutate the parent's state. */
const ControlledFileUpload = () => {
  const [files, setFiles] = useState<UploadFile[]>([
    { id: "a", file: new File(["x".repeat(320_000)], "resume.docx"), status: "idle" },
    { id: "b", file: new File(["x".repeat(85_000)], "cover-letter.pdf"), status: "idle" },
  ]);
  return (
    <div className="flex flex-col gap-3">
      <FileUpload multiple value={files} onValueChange={setFiles} />
      <p className="text-sm text-muted-foreground">
        {files.length} file{files.length === 1 ? "" : "s"} selected
      </p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledFileUpload />,
};

export const DarkMode: Story = {
  render: () => {
    const files: UploadFile[] = [
      {
        id: "1",
        file: new File(["x".repeat(1_200_000)], "annual-report.pdf"),
        status: "uploading",
        progress: 62,
      },
      {
        id: "2",
        file: new File(["x".repeat(48_000)], "logo.png"),
        status: "success",
        message: "Uploaded",
      },
    ];
    return (
      <div
        data-theme="dark"
        className="dark max-w-2xl rounded-lg bg-background p-8 text-foreground"
      >
        <FileUpload multiple value={files} onValueChange={() => {}} />
      </div>
    );
  },
};
