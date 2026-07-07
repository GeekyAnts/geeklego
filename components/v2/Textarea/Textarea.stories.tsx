import type { Meta, StoryObj } from "@storybook/react-vite";
// v2 prototype uses its own 2-tier stylesheet, imported here so the slice is
// self-contained and independent of the stale 3-tier geeklego.css.
import "../../../design-system/v2/index.css";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "v2/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "select", options: ["default", "error"] },
    textareaSize: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    rows: { control: "number" },
  },
};
export default meta;
type Story = StoryObj<typeof Textarea>;

/* ── Default ──────────────────────────────────────────────────────────────── */
export const Default: Story = {
  args: {
    placeholder: "Type your message here…",
    variant: "default",
    textareaSize: "md",
  },
  render: (args) => (
    <div className="w-80">
      <Textarea {...args} />
    </div>
  ),
};

/* ── Variants — standard ShadCN semantics only ──────────────────────────────── */
export const Variants: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Textarea variant="default" defaultValue="Looks good — a valid note." />
      <Textarea variant="error" defaultValue="This field has an error." />
    </div>
  ),
};

/* ── Sizes ──────────────────────────────────────────────────────────────────── */
export const Sizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Textarea textareaSize="sm" placeholder="Small" />
      <Textarea textareaSize="md" placeholder="Medium" />
      <Textarea textareaSize="lg" placeholder="Large" />
    </div>
  ),
};

/* ── Disabled / read-only ─────────────────────────────────────────────────────*/
export const Disabled: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Textarea placeholder="Disabled" disabled />
      <Textarea defaultValue="Disabled with value" disabled />
      <Textarea defaultValue="Read-only value" readOnly />
    </div>
  ),
};

/* ── With a label (composition) ───────────────────────────────────────────────*/
export const WithLabel: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-1.5">
      <label htmlFor="bio" className="text-sm font-medium text-foreground">
        Bio
      </label>
      <Textarea id="bio" placeholder="Tell us about yourself…" rows={4} />
      <p className="text-xs text-muted-foreground">
        Your bio is visible on your public profile.
      </p>
    </div>
  ),
};

/* ── Dark theme — semantic override set (the .dark / data-theme test) ────────── */
export const DarkMode: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="dark max-w-2xl rounded-lg bg-background p-8 text-foreground"
    >
      <div className="flex w-80 flex-col gap-3">
        <Textarea variant="default" placeholder="Default" />
        <Textarea variant="error" defaultValue="Invalid note" />
        <Textarea placeholder="Disabled" disabled />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Textareas under a dark theme. The wrapper sets both data-theme="dark" and .dark; only Tier-2 semantic vars are overridden — the component and primitives are untouched.',
      },
    },
  },
};
