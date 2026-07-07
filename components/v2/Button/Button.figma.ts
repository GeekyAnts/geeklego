import type { ComponentDescriptor } from "../../../scripts/figma/contracts";

/**
 * Button — Figma sync descriptor (the Phase-0 reference).
 *
 * cva (`button-variants.ts`) stays the source of truth for WHICH variants
 * exist — the generator cross-checks `values` against the cva keys and fails
 * on drift. This file adds only what cva/Storybook cannot express: the Figma-
 * facing axis names, the Disabled render recipe, the text slot, and the pruned
 * nonsensical combinations.
 *
 * Excluded by design (MVP guardrails): hover/active/focus (pseudo-states have
 * no static Figma representation), `asChild` (a code-only polymorphism concern),
 * and icon slots (instance-swap is post-MVP; `size: icon` still ships as a
 * square text-free box).
 */
const descriptor: ComponentDescriptor = {
  name: "Button",
  storyIdPrefix: "v2-button",

  cvaAxes: [
    {
      name: "Variant",
      cvaProp: "variant",
      values: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
        "gamified",
      ],
      defaultValue: "default",
    },
    {
      name: "Size",
      cvaProp: "size",
      values: ["sm", "md", "lg", "icon"],
      defaultValue: "md",
    },
  ],

  declaredAxes: [],

  booleanProps: [
    {
      name: "Disabled",
      storyProps: { disabled: true },
      defaultValue: false,
    },
  ],

  text: {
    name: "Label",
    via: { kind: "children" },
    sample: "Button",
  },

  prune: [
    // `link` is inline text — a square icon box contradicts it.
    { Variant: "link", Size: "icon" },
  ],
};

export default descriptor;
