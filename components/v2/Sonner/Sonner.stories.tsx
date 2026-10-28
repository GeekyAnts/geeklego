import type { Meta, StoryObj } from "@storybook/react-vite";
import { withDarkPortalRoot } from "../lib/dark-portal-decorator";
// v2 prototype uses its own 2-tier stylesheet, imported here so the slice is
// self-contained and independent of the stale 3-tier geeklego.css.
import "../../../design-system/v2/index.css";
import { Toaster, toast } from "./Sonner";
import { Button } from "../Button/Button";

const meta: Meta<typeof Toaster> = {
  title: "v2/Sonner",
  component: Toaster,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;
type Story = StoryObj<typeof Toaster>;

/* ── Default — basic, description, success, error, action ────────────────────── */
export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={() => toast("Event has been created")}>
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, June 24 at 9:00 AM",
          })
        }
      >
        With description
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success("Profile saved")}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error("Something went wrong")}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("File ready", {
            action: { label: "Download", onClick: () => {} },
          })
        }
      >
        With action
      </Button>
      <Toaster />
    </div>
  ),
};

/* ── Promise toast — loading → success/error ─────────────────────────────────── */
export const Promise: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(
            new globalThis.Promise((resolve) => setTimeout(resolve, 1500)),
            {
              loading: "Saving…",
              success: "Saved!",
              error: "Failed to save",
            },
          )
        }
      >
        Run promise
      </Button>
      <Toaster />
    </div>
  ),
};

/* ── Rich colors + close button ──────────────────────────────────────────────── */
export const RichColors: Story = {
  render: () => (
    <div className="flex gap-3">
      <Button variant="outline" onClick={() => toast.success("All good")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error("Nope")}>
        Error
      </Button>
      <Toaster richColors closeButton />
    </div>
  ),
};

/* ── Dark theme — toasts are portalled, so flag the root too ─────────────────── */
export const DarkMode: Story = {
  render: () => (
    <div className="dark max-w-2xl rounded-lg bg-background p-8 text-foreground" data-theme="dark">
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() =>
            toast("Event created", { description: "Re-themes from the root" })
          }
        >
          Show toast (dark)
        </Button>
      </div>
      <Toaster />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Sonner toasts are portalled to `<body>`, so this story sets `data-theme=\"dark\"` and `.dark` on the document root (decorator) as well as the wrapper, with no `theme` prop — the Toaster re-points Sonner's surface vars at `--popover` / `--popover-foreground` / `--border`, so toasts re-theme from the same Tier-2 semantic overrides.",
      },
    },
  },
  decorators: [withDarkPortalRoot],
};
