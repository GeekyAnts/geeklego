---
name: geeklego-foundation-import
description: Import GeekLego foundation components from the codebase into the official geeklego-v2-final Figma library as production-quality, maintainable design-system components. Use this skill whenever the user asks to import, add, bring in, port, or recreate GeekLego components in Figma — e.g. "import six foundation components", "continue importing GeekLego foundation components", "add the Tabs component to the Figma library", "port Badge and Alert into Figma", "bring the Select component into the Figma design system", or any request to make the Figma foundation library catch up with components that exist in `components/v2/`. This is code → Figma only. Unlike the `figma-sync` skill (which syncs tokens/variables and builds one component at a time from a component-token model), this skill imports full foundation components into an EXISTING, already-styled documentation library — inferring each component's API from its code + Storybook stories, building exactly ONE editable source component per family, and reproducing every story as instances inside a doc frame that matches the library's established house style. Do NOT recreate Storybook screens; recreate the component architecture.
---

# GeekLego Foundation Component Import

Import components from `components/v2/` into the official Figma library at
`https://www.figma.com/design/wdTqm64qq31cIHogVYGZjz/geeklego-v2-final` so the
Figma library is a faithful, maintainable **design counterpart** of the code.

**The code and Storybook are the single source of truth. Figma is the mirror.**

## Think like a design-system engineer, not a Figma designer

The goal is not to redraw Storybook screens. It is to reconstruct the *component
architecture* inside Figma. A Storybook story is an **example** — an instance of a
component with particular props. It is not a component. So the job for each family is:
read the code + every story, infer the one flexible component API underneath them,
build that **single source component**, and then reproduce the stories as **instances**
of it. Every decision serves reusability, maintainability, and fidelity to the code.

If you catch yourself building "the with-icon Badge" and "the secondary Badge" as
separate components, stop — those are the *same* Badge with different property values.

---

## This skill is a thin layer — load the Figma skills for mechanics

This skill owns the **GeekLego-specific decisions and the house style**. It does
**not** re-teach the Figma Plugin API. Before any Figma write:

- **Load `figma-use`** — how to call `use_figma` (return pattern, page reset, ID
  return, font loading, 0–1 color range). MANDATORY before every `use_figma` call.
- **Load `figma-generate-library`** — the WHAT/ORDER of design-system building:
  variant matrices (`combineAsVariants` + manual grid layout), component properties
  (TEXT / BOOLEAN / INSTANCE_SWAP), the state ledger, idempotency, sequential-only
  writes, `get_screenshot` validation. Follow its Phase 3 (Components) checklist for
  each component you build here.

Everything below **overrides or specializes** those skills for the GeekLego library.
Where this skill and `figma-generate-library` differ, this skill wins.

**Prerequisite that is already done:** the foundations (variable collections, text
styles) already exist in the library. This skill imports **components**, binding to
the variables that are already there. Do not rebuild tokens — that is the `figma-sync`
skill's job. If a semantic variable a component needs is genuinely missing, surface it
(decision fork) rather than hardcoding the value.

---

## The four-step workflow

Run these in order for every import request. Steps 1–2 are read-only.

### Step 1 — Inspect the existing library first (never skip)

Before building anything, learn the house style from what is already there, so your
additions look like the same person made them. Do **not** invent a new documentation
layout.

1. `get_metadata` on the Foundation page (start at the file URL / the `Foundation
   Library` section) to read the current frame hierarchy, names, and positions.
2. From that, determine:
   - **Which components already exist** — never duplicate one; if asked to import
     something already present, say so and offer to update it instead.
   - **Where the next doc frame goes** — components stack vertically inside the single
     wrapping frame; compute the next `y` from the last frame's `y + height + gap`.
   - **The exact naming + layout conventions** in play (see the house-style template
     below, which is derived from the current library — reconcile it against what you
     actually read, and follow the file if it has drifted).
3. Confirm the **icon components already in the file** (Checkbox's check/minus, Alert's
   icons, Badge/Button leading icons all use them). You will reuse these as instances —
   never redraw an icon.

Read [references/house-style.md](references/house-style.md) for the full doc-frame
template, section vocabulary, and naming rules distilled from the current library.

### Step 2 — Infer the component API from code + stories

For each component, read its slice under `components/v2/<Name>/`:

- **`<name>-variants.ts`** (the `cva`) → the **variant axes**. Each `variants` key is a
  Figma **variant property**; each option is a value. `variant: {default, secondary,
  destructive, outline}` → a `Variant` property; `size: {sm, md, lg}` → a `Size`
  property. `defaultVariants` → the Figma default combination. Components with no
  `-variants.ts` file have no variant axes (a single master, like Card / Label).
- **`<Name>.types.ts`** → boolean and slot props. `asChild`, `disabled`-like flags →
  **BOOLEAN** properties. A leading/trailing icon, an avatar image, a card footer →
  **INSTANCE_SWAP** or nested-instance slots. Text content → **TEXT** properties.
- **`<Name>.stories.tsx`** → the set of examples you must be able to reproduce. Treat
  each story as a target output, and ask: *what property values on the single source
  component produce this?* The stories tell you the real matrix, the icon usages, the
  disabled/error states, the `asChild` cases, and the dark-mode expectation.
- If the component is **built on Radix** (Dialog, Popover, Tabs, Switch, Checkbox,
  Separator, Avatar, Progress…), note which behaviors are Radix props rather than
  visual variants. Orientation on Separator, checked/indeterminate on Checkbox,
  open/closed on a disclosure — these are **states** to represent, but some (like
  orientation) are cleaner as a variant axis and some (like a controlled open state)
  are better shown as separate showcase instances. The current library's choices
  (`State=…`, `Orientation=…`) are your precedent.

Write down the inferred API (properties, types, values, defaults, slots) **before**
building. This is the contract the source component must satisfy.

**When a story doesn't map to a property:** some stories are *compositions* — a Field
that is a Label + Input, a Card footer with real Buttons, a "with label" Switch row.
Do not invent a story-only property to force these onto the source component. Reproduce
them by **composing instances** of the relevant source components in a showcase frame
(exactly as the current Label/Card/Checkbox docs do). If an example genuinely cannot be
expressed as either a property value or an instance composition, **pause and surface
it** rather than detaching an instance or hardcoding — that is a signal the API model
needs a decision from the user.

### Step 3 — Build the ONE source component

Per component family, create **exactly one** editable source component (a component
set if it has variant axes, a single component if it doesn't). This is the doc frame's
`Master (original)` — the purple-dashed source (see house style). Everything the code
supports lives here as properties/variants:

- Build the base with **auto-layout** and bind every visual property to the **existing
  semantic variables** — fills, text color, border, radius, padding, gap. Read the
  binding hints from the component's `cva` classes (`bg-primary` → the `--primary`
  fill variable, `border-input` → the `--input` stroke variable, `rounded-md` →
  the radius variable, etc.). Never hardcode a color/radius/spacing that has a variable.
- Create all variant combinations via `combineAsVariants`, then **manually grid-layout
  and resize** them (they stack at 0,0 otherwise — this is the single most common
  breakage; see `figma-generate-library`).
- Add component properties and link them to child nodes: TEXT for labels, BOOLEAN for
  optional slots / flags, INSTANCE_SWAP for icons (never a variant-per-icon).
- Follow the Radix-first spirit: represent states the primitive owns (checked,
  indeterminate, on/off) as the component's states, matching how the code models them.

**One source component per family. Never a second master. Never a duplicate.**

### Step 4 — Document with instances (never detach, never redraw)

Build the doc frame in the house style, and populate every showcase from **instances
of the source component** (or instances composed together). Rules:

- Examples are always instances linked to the source — **never** manually recreated,
  **never** detached.
- Icons are **instances of the existing icon components** — never redrawn.
- The `Master (original)` sits in the purple-dashed source region inside the doc frame;
  showcase instances live in the sibling showcase frames, outside that source region.
- Reproduce the stories: a variant row, a states row, a with-icon row, sizes, and
  whatever compositions the stories imply — each as its own ALL-CAPS-labelled showcase
  frame, matching the section vocabulary already in the file.
- Leave the `Documentation` / `USAGE & GUIDELINES` frame with a real one-paragraph
  guideline (when to use each variant, a11y notes, disabled behavior), in the same
  voice as the existing entries — not lorem, not empty.

---

## Validation — before calling a component done

Verify each of these (via `get_metadata` for structure + `get_screenshot` for visual,
per `figma-generate-library` Phase 3):

- ✓ **API parity with code** — every variant axis, size, and state from the `cva` /
  types is a property on the source component, with the right defaults.
- ✓ **Visual parity with Storybook** — the source and instances read like the stories.
- ✓ **One source component only** — no duplicate master; a component set, not loose copies.
- ✓ **Examples are instances** — no detached nodes, no hand-drawn copies.
- ✓ **Existing icons reused** — every icon is an instance of a library icon component.
- ✓ **Variables everywhere** — no hardcoded fill/stroke/radius/spacing that has a token.
  Bindings match the component's `cva` semantic utilities.
- ✓ **House style matched** — frame named `Foundation / <Name>`, correct sub-frames
  (`Header`, `Component set`/`Component`, showcase frames, `Documentation`), ALL-CAPS
  section labels, purple-dashed `Master (original)`, real guideline text.
- ✓ **Placed correctly** — stacked below the previous component at the right `y`, inside
  the wrapping frame, not floating.
- ✓ Consistent naming (`Variant=…, Size=…`), consistent spacing, production-ready.

If any check fails, fix it before moving to the next component. Never build the next
component on an unvalidated one.

---

## Hard rules

1. **Never duplicate a source component** — one master per family, forever.
2. **Never detach an instance** and never hand-redraw something a component/instance can express.
3. **Never redraw an icon** — reuse the existing icon components as instances.
4. **Never hardcode** a color, type, radius, border, effect, or spacing that has a
   variable — bind to the existing semantic variables the code's `cva` points at.
5. **Never invent a new documentation style** — continue the established house style so
   the library reads as one author's work.
6. **Never recreate Storybook stories as bespoke components** — stories are examples;
   collapse them into properties on the single source component.
7. **Never rebuild tokens/variables here** — foundations already exist; that's `figma-sync`.
8. **Never batch components in one `use_figma` call** — one component at a time,
   sequential writes only, validate between (per `figma-generate-library`).

---

*Skill: GeekLego Foundation Component Import — code → Figma, into the official library.*
*Layer over `figma-use` + `figma-generate-library`; specializes them for GeekLego.*
*Source of truth: `components/v2/` + Storybook. House style: the existing Foundation library.*
