import type { Meta, StoryObj } from "@storybook/react-vite";
// v2 prototype uses its own 2-tier stylesheet, imported here so the slice is
// self-contained and independent of the stale 3-tier geeklego.css.
import "../../../design-system/v2/index.css";
import { Slider } from "./Slider";
import { Label } from "../Label/Label";

const meta: Meta<typeof Slider> = {
  title: "v2/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    disabled: { control: "boolean" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
  },
};
export default meta;
type Story = StoryObj<typeof Slider>;

/* ── Default ──────────────────────────────────────────────────────────────── */
export const Default: Story = {
  args: { defaultValue: [50], max: 100, step: 1 },
  render: (args) => (
    <div className="w-80">
      <Slider {...args} aria-label="Volume" />
    </div>
  ),
};

/* ── Range — two thumbs from a two-entry value array ────────────────────────── */
export const Range: Story = {
  render: () => (
    <div className="w-80">
      <Slider defaultValue={[25, 75]} max={100} step={1} aria-label="Price range" />
    </div>
  ),
};

/* ── Steps — coarse increments ──────────────────────────────────────────────── */
export const Steps: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <Label>Rating (step 10)</Label>
      <Slider defaultValue={[40]} max={100} step={10} aria-label="Rating" />
    </div>
  ),
};

/* ── Vertical orientation ─────────────────────────────────────────────────────*/
export const Vertical: Story = {
  render: () => (
    <div className="flex h-48 items-center gap-8">
      <Slider
        defaultValue={[60]}
        max={100}
        step={1}
        orientation="vertical"
        aria-label="Level"
      />
      <Slider
        defaultValue={[20, 80]}
        max={100}
        step={1}
        orientation="vertical"
        aria-label="Vertical range"
      />
    </div>
  ),
};

/* ── Disabled ─────────────────────────────────────────────────────────────────*/
export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <Slider defaultValue={[50]} max={100} step={1} disabled aria-label="Disabled" />
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
      <div className="flex w-80 flex-col gap-6">
        <Slider defaultValue={[50]} max={100} step={1} aria-label="Single" />
        <Slider defaultValue={[25, 75]} max={100} step={1} aria-label="Range" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Sliders under a dark theme. The wrapper sets both data-theme="dark" and .dark; the track (secondary), filled range (primary), and thumb (background / primary ring) re-theme from Tier-2 semantics.',
      },
    },
  },
};
