import type { Meta, StoryObj } from "@storybook/react-vite";
// v2 prototype uses its own 2-tier stylesheet, imported here so the slice is
// self-contained and independent of the stale 3-tier geeklego.css.
import "../../../design-system/v2/index.css";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";
import { Label } from "../Label/Label";

const meta: Meta<typeof RadioGroup> = {
  title: "v2/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: { disabled: { control: "boolean" } },
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

/* ── Default ──────────────────────────────────────────────────────────────── */
export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  ),
};

/* ── Horizontal layout (consumer className) ─────────────────────────────────── */
export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="card" className="grid-flow-col gap-6">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="card" id="p1" />
        <Label htmlFor="p1">Card</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="paypal" id="p2" />
        <Label htmlFor="p2">PayPal</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="apple" id="p3" />
        <Label htmlFor="p3">Apple Pay</Label>
      </div>
    </RadioGroup>
  ),
};

/* ── Disabled — whole group and a single item ───────────────────────────────── */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <RadioGroup defaultValue="a" disabled>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="a" id="d1" />
          <Label htmlFor="d1">Entire group disabled (a)</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="b" id="d2" />
          <Label htmlFor="d2">Entire group disabled (b)</Label>
        </div>
      </RadioGroup>
      <RadioGroup defaultValue="x">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="x" id="d3" />
          <Label htmlFor="d3">Enabled</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="y" id="d4" disabled />
          <Label htmlFor="d4">Single item disabled</Label>
        </div>
      </RadioGroup>
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
      <RadioGroup defaultValue="comfortable">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="default" id="dk1" />
          <Label htmlFor="dk1">Default</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="comfortable" id="dk2" />
          <Label htmlFor="dk2">Comfortable</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="compact" id="dk3" disabled />
          <Label htmlFor="dk3">Compact (disabled)</Label>
        </div>
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Radio group under a dark theme. The wrapper sets both data-theme="dark" and .dark; the item ring and selected dot re-theme from the primary semantic.',
      },
    },
  },
};
