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

**The variables are now true-to-code — three collections:** `01 · Primitives` (`8:2`,
mode `Value`, ~190 vars: groups `color/ spacing/ radius/ border-width/ font/ motion/
breakpoint`), `02 · Semantics` (`9:2`, modes `Light`/`Dark`, ~44 vars: groups `surface/
interactive/ layout/ status/`), `03 · Ext` (`9:40`, `Light`/`Dark`, 5 `button-gamified/*`
vars). **The Figma variable NAME is grouped, but its WEB code syntax is the exact CSS
var the code uses** — `interactive/primary` → `var(--primary)`, `surface/popover` →
`var(--popover)`, `layout/border` → `var(--border)`, `button-gamified/bg` →
`var(--ext-button-gamified-bg)`. So bind by resolving the code's `cva` class to its CSS
var, then finding the Figma variable whose WEB code syntax is that `var(--…)` — do **not**
assume a `core/*` name (that was an older, wrong mapping). **Always re-resolve variable
IDs by name at build time** (IDs and even group names have drifted between sessions).

---

## The four-step workflow

Run these in order for every import request. Steps 1–2 are read-only.

### Step 1 — Inspect the existing library first (never skip)

Before building anything, learn the house style from what is already there, so your
additions look like the same person made them. Do **not** invent a new documentation
layout.

1. **List the pages first** (`figma.root.children`). The library is now **one page per
   component** (restructured 2026-07-08), not a single grid. Page order is
   `Welcome → Foundation → Icons → -------Components------- → <Component> pages A–Z`.
   Each component's `Foundation / <Name>` doc frame lives at (0,0) on its **own page**
   named `<Name>`. The old single-grid `Foundation` page is now just the shared
   **Interaction States** reference (the dead grid wrapper was deleted). Then
   `get_metadata` on the specific page you care about to read its frame hierarchy.
2. From that, determine:
   - **Which components already exist** — a page named `<Name>` (or a `Foundation / <Name>`
     frame on it) means it's already imported; never duplicate one. If asked to import
     something already present, say so and offer to update it instead. (Verify against the
     live page list — the count moves between sessions; do not trust a cached list.)
   - **Where the new doc frame goes** — create a **new dedicated page** named `<Name>` and
     place the `Foundation / <Name>` frame at (0,0). Do **not** append into a grid or
     compute a stacking `y` — that model is retired. Insert the page alphabetically among
     the component pages (after the `-------Components-------` divider) via
     `figma.root.insertChild(index, page)`.
   - **The exact naming + layout conventions** in play (see the house-style template
     below, which is derived from the current library — reconcile it against what you
     actually read, and follow the file if it has drifted).
   - **Cross-page instances are safe.** A component that nests another (Combobox→Command,
     AlertDialog→Button) puts *instances* on its own page pointing at a *master on another
     page* — the instance→master link is stable within a file (verified: 0 detachments
     across the whole restructure). Only copy-and-delete detaches; a true move/append never does.
3. Confirm the **`Icon` component** on the **Icons** page. It is now a **single
   COMPONENT_SET** (`Icon`, id `157:10`) with two variant axes — **`Type`** (1666 Lucide
   glyph names, e.g. `check`, `chevron-right`, `search`, `x`, `circle`, `minus`) ×
   **`Size`** (`24` / `16` / `14` / `12`) = 6664 variants; default `Type=a-arrow-down,
   Size=24`. **This replaced the old one-component-per-icon model.** To place an icon:
   instance the `Icon` set, then set its `Type` property to the glyph and `Size` to the
   pixel size the code's class implies (`size-4`→`16`, `size-3.5`→`14`, `size-3`→`12`,
   `size-5/6`→`24`). Never redraw an icon; never look for a per-glyph component — there is
   only the one `Icon` set now. (Icon-instance sizes stay owned by the set — never bind
   their width/height, and set `Size` via the variant property, not `resize()`.)
4. Load the **text styles** with `getLocalTextStylesAsync()` — the type system every
   piece of text must link to (see the style→role map in house-style.md). Just as
   variables are the source of truth for colour, text styles are the source of truth for
   type: doc chrome AND component content bind to them, never raw `fontName`/`fontSize`.

Read [references/house-style.md](references/house-style.md) for the full doc-frame
template, section vocabulary, naming rules, and the text-style → role map distilled from
the current library.

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
  open/closed on a disclosure — these are **states** to represent. Which of them become
  Figma properties vs. documentation is governed by the **state doctrine** below.

Write down the inferred API (properties, types, values, defaults, slots) **before**
building. This is the contract the source component must satisfy.

#### The state doctrine (read before modelling any state)

The code has exactly **two authored `cva` axes — `variant` and `size` — and never a
`state` axis.** Every state is a *runtime* mechanism, expressed inside the one class
string, and there are three kinds. They map to Figma differently. Do **not** collapse
them into one generic `State=default/hover/active/focus/disabled` axis — that is the
variant explosion (a 7-variant × 3-size Button would become 100+ variants) and it is
not how the code models state.

| Kind of state | Code mechanism | Figma treatment |
|---|---|---|
| **Pointer** — hover, active/pressed, focus | Tailwind pseudo-classes (`hover:`, `active:`, `focus-visible:`) | **Documentation, NEVER a variant.** They can't be triggered on a static canvas and are derived *uniformly* from the base look (`hover = base/90`, `active = base/80`, `focus = ring-ring`). Document the formula once on the shared **Interaction States** page; optionally note a Figma prototype interaction (While hovering → show overlay) for live preview. |
| **disabled** | native `disabled` attribute + `disabled:` prefix (always `opacity-50` + no pointer events) | **A real state** — a `disabled` value on the `State` axis (or its own value), because a consumer sets it as a prop and a designer must place a disabled control. 50% opacity. |
| **Selection / disclosure** — checked / on / selected / active-tab / open | Radix `data-[state=…]` attribute | **A real variant property** where it *restyles a persistent element* (Checkbox `checked`, Switch `on`, Toggle `on`, Tabs-trigger `active`, Accordion-item `open`). Where `open/closed` merely toggles *visibility* of an overlay (Dialog, Popover, menus, Tooltip), do **not** variant-ize it — just show the open thing. |

**The litmus test:** *if a consumer sets it in code as a prop (`disabled`, `checked`,
`defaultValue`), it's a Figma property; if the browser or Radix derives it at runtime
from the base look (hover/active/focus), it's documentation.*

Only these interactive controls get a real state axis: **Checkbox, Switch, Toggle /
ToggleGroupItem, Tabs-trigger, Accordion-item, Table row.** Everything else that merely
inherits `disabled` does not need a disabled variant. When you add a state to a set,
prefer **extending the existing `State` axis with an extra value** over adding a whole
new axis (e.g. Checkbox `State=unchecked/checked/indeterminate/disabled`), unless the
component genuinely has two orthogonal state dimensions.

There is a shared **`Foundation / Interaction States`** doc frame in the library (a
table: state → code mechanism → token formula → Figma handling). Keep it as the single
place pointer states are explained; don't re-document hover/active/focus per component.

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
- **Bind spacing to the `spacing/*` primitive variables — MANDATORY, same discipline as
  colour.** This covers two groups; a raw px padding/gap/size is as wrong as a hardcoded
  hex. Set each with `node.setBoundVariable(prop, spacingVarObj)`:
  - **Padding & gap — bind ALL of them, always.** `paddingLeft/Right/Top/Bottom` +
    `itemSpacing` on every auto-layout frame you create. These are pure auto-layout
    props; binding never fights anything. Map the px to its token: a Tailwind `p-3`/
    `gap-2` = `var(--spacing-3/2)` = 12/8px → `spacing/3`, `spacing/2`. Fractional steps
    (`py-1.5`=6, `px-2.5`=10, `size-3.5`=14, `py-0.5`=2) → the `spacing/raw-6/10/14/2`
    tokens. `0` → `spacing/0`.
  - **Width & height — bind ONLY genuine component sizes, and ONLY on FIXED axes.** A
    dimension is bindable only if (a) that axis is `layoutSizing* === 'FIXED'` — never
    `FILL`/`HUG` (those mirror the code's `w-full`/`w-auto`/`w-fit` and stay as sizing
    modes), and (b) the px equals a **real component-size value from the code** (the
    `size-*`/`w-*`/`h-*`/`min-*` in the `cva` — icon `size-4`=16, control `h-10`=40,
    thumb 16, etc.). **Do NOT bind doc-layout/showcase container widths** (the 900px set
    bounding box, a 340px showcase row, a 224px demo trigger) — those are scaffolding,
    not design tokens; leave them raw. **Do NOT bind icon-instance sizes** — an icon
    instance's size is owned by its main component; binding it detaches an override.
  - **`min-*` / `max-*` constraints — bind to Figma's NATIVE min/max, not a fake FIXED
    size.** Figma auto-layout has real `minWidth`/`maxWidth`/`minHeight`/`maxHeight` (a
    floor/ceiling *alongside* the sizing mode) and each is variable-bindable:
    `node.setBoundVariable('minWidth'|'maxWidth'|'minHeight'|'maxHeight', spacingVarObj)`
    (set the numeric value first, then bind). Map `min-w-32`→`minWidth` 128, `max-h-96`→
    `maxHeight` 384, etc. via the same px→`spacing/N` table. A `min-*` is a floor, not the
    resting size — leave the sizing mode (HUG/FIXED) as-is; the min just guards the shrink
    bound. **Requires auto-layout** — on a `layoutMode: NONE` node (plain rects, e.g. a
    Slider track) `min*/max*` throw; there the FIXED `width`/`height` already IS the min,
    so bind that dimension instead. **Skip** `min-w-0`/`min-h-0` (flex-shrink idiom),
    `min-h-svh`/`max-w-max` (viewport/max-content), and `min-w-[var(--radix-…)]` (runtime) —
    no static Figma equivalent, no token.
  - **The token set must cover every value.** Before binding, resolve each distinct px
    against the `spacing/*` scale; **if any value has no exact token, STOP and surface it**
    (it's either an off-scale code value to fix first — like `min-h-44`/`max-h-96` needing
    a `--spacing-44/96` token — or scaffolding that shouldn't be bound). Never round to
    "close enough."
  - **Bind the source; instances inherit.** Bind on the source component / hand-built
    composition frames — never on a node inside an INSTANCE.
- **Link every text node to a text style — the same discipline as variables, applied to
  type.** A text node styled with raw `fontName`/`fontSize` is as wrong as a hardcoded
  hex fill. When you create any text (a label inside the source, a placeholder, a title),
  set its style with `await node.setTextStyleIdAsync(styleId)` — do **not** stop at
  setting `fontName`/`fontSize`. Pick the style from the code's type role via the
  **text-style → role map in house-style.md** (`text-sm` → `body/sm`, `text-xs font-medium`
  → `label/sm`, a heading → `heading/*`, mono/code → `code/*`, etc.). Colour still comes
  from the bound text-fill variable (`text-foreground` → the `foreground` var) — style
  sets family/size/line-height, the variable sets colour; set both.
  - **`setTextStyleIdAsync` needs the style's font loaded first.** The styles use
    Satoshi Variable (headings), Figtree (body/label), JetBrains Mono (code) — `await
    figma.loadFontAsync(...)` each family/weight before applying, or it throws.
  - **Style the source, and instances inherit.** Set the style on the source component's
    text nodes; every showcase instance picks it up automatically. Never restyle text
    *inside an INSTANCE* (that creates an override) — for a text node whose ancestor is an
    INSTANCE, leave it; fix the source instead. Hand-built compositions (a Field label,
    an open-menu item) are not instances, so style their text directly.
- Create all variant combinations via `combineAsVariants`, then **manually grid-layout
  and resize** them (they stack at 0,0 otherwise — this is the single most common
  breakage; see `figma-generate-library`).
  - **Naming trap when adding an axis to an existing set:** `combineAsVariants` needs
    every variant named consistently `Prop=Val, Prop=Val, …` with the *same* property
    keys. Appending a new axis by renaming (e.g. `+ ", State=off"`) onto variants that
    were combined under a different shape can mangle the property defs into blank keys
    (names like `=Toggle, =default, =md, =off`). After any recombine, **verify
    `set.componentPropertyDefinitions`** has the expected named keys; if mangled,
    renormalize every child to the full `Prop=Val, …` form to repair.
- Add component properties and link them to child nodes: TEXT for labels, BOOLEAN for
  optional slots / flags, INSTANCE_SWAP for icons — the swap target is the single `Icon`
  set (id `157:10`); a leading/trailing icon slot is an `Icon` instance with its `Type`
  property set to the glyph, never a variant-per-icon and never a per-glyph component.
- **Sizing trap — source must HUG before instances can grow.** If a source variant must
  grow with content (a label that toggles visible, an expanding panel), calling
  `resize(w,h)` on its auto-layout frame LOCKS that axis to `FIXED`, so instances stay
  stuck at the fixed size and clip their content. Set `primaryAxisSizingMode="AUTO"`
  (HUG) on the source variant, and set existing instances' `layoutSizing*="HUG"`, so the
  content can expand. (Hit twice: ToggleGroup labels clipped, Accordion items stuck at
  ~10px.)
- Follow the Radix-first spirit: represent states the primitive owns (checked,
  indeterminate, on/off) as the component's states, matching how the code models them
  (see the state doctrine above for which become properties).

**One source component per family. Never a second master. Never a duplicate.**

**When component B reuses component A's look (shared `cva`), B has NO own master.**
Figma has no "component extends component" — the only reuse is instance-nesting. So if
the code shows B built from A (e.g. `ToggleGroupItem` imports and reuses `toggleVariants`
from `Toggle`; a `MenuItem` reusing a `Button` look), do **not** build a second source
set for B. Instead, compose B's doc from **instances of A**, and label B's `Master`
region "NO OWN MASTER · uses <A> instances" with a note. Two masters of the same look
*will* drift — this is the most tempting duplicate-master trap.

**But not every part is a reuse.** If a part is its own atom in the code (e.g.
`TabsTrigger` has its own `data-[state=active]` styling and is not reusing another
component), then *it* is the master and the assembled component (Tabs) is composed from
*its* instances. The test: does B's code **import** A's variants/styles? Reuse → no B
master. Independent styling → B is its own master. When unsure, surface it as a decision
fork rather than guessing.

### Step 4 — Document with instances (never detach, never redraw)

Build the doc frame in the house style, and populate every showcase from **instances
of the source component** (or instances composed together). Rules:

- Examples are always instances linked to the source — **never** manually recreated,
  **never** detached.
- Icons are **instances of the single `Icon` set** (`157:10`) with the right `Type` +
  `Size` variant — never redrawn, never a per-glyph component.
- The `Master (original)` sits in the purple-dashed source region inside the doc frame;
  showcase instances live in the sibling showcase frames, outside that source region.
- Reproduce the stories: a variant row, a states row, a with-icon row, sizes, and
  whatever compositions the stories imply — each as its own ALL-CAPS-labelled showcase
  frame, matching the section vocabulary already in the file.
- Leave the `Documentation` / `USAGE & GUIDELINES` frame with a real one-paragraph
  guideline (when to use each variant, a11y notes, disabled behavior), in the same
  voice as the existing entries — not lorem, not empty.
- **All doc-frame chrome text links to a text style too** — the title (`heading/h1`),
  the description (`body/base`), every ALL-CAPS section label and the `ORIGINAL
  COMPONENT` / `USAGE & GUIDELINES` tags (`label/sm`), the guideline paragraph
  (`body/sm`). Chrome is not exempt: no raw `fontName`/`fontSize` anywhere in the frame.
- **Representing interaction Figma can't do statically** (a tooltip that appears on
  hover, a popover that opens): the static canvas has no runtime, so show the *result*
  as an explicit, connected composition rather than a floating element. For a Tooltip,
  that means an attached tip whose **directional arrow touches its trigger** (model the
  arrow direction as a `Side` variant: top/right/bottom/left), labelled e.g. "ON HOVER",
  so it reads as one object belonging to the trigger. Note in the guideline that a live
  appear-on-hover can be added via a Figma prototype interaction. Do not leave it as a
  disconnected bubble hovering in space.

---

## Validation — before calling a component done

Verify each of these (via `get_metadata` for structure + `get_screenshot` for visual,
per `figma-generate-library` Phase 3):

- ✓ **API parity with code** — every variant axis, size, and state from the `cva` /
  types is a property on the source component, with the right defaults.
- ✓ **State doctrine honored** — pointer states (hover/active/focus) are NOT variants
  (documented on the Interaction States page); `disabled` and persistent selection
  states (checked/on/selected/active/open-that-restyles) ARE variant/State values on the
  interactive controls. No generic `State=hover/focus/…` axis anywhere.
- ✓ **Property defs intact** — `componentPropertyDefinitions` has clean named keys
  (`Variant`/`Size`/`State`), not mangled blank keys from a bad recombine.
- ✓ **Visual parity with Storybook** — the source and instances read like the stories.
- ✓ **One source component only** — no duplicate master; a component set, not loose
  copies. A component that reuses another's look (shared `cva`) has NO own master —
  it's composed from that component's instances.
- ✓ **Examples are instances** — no detached nodes, no hand-drawn copies.
- ✓ **Icons reused from the `Icon` set** — every icon is an instance of the single `Icon`
  set (`157:10`) with `Type`=glyph + `Size`=px, never redrawn, never a per-glyph component.
- ✓ **Variables everywhere** — no hardcoded fill/stroke/radius that has a token.
  Bindings match the component's `cva` semantic utilities.
- ✓ **Spacing bound** — every `paddingLeft/Right/Top/Bottom` + `itemSpacing` on a
  non-instance auto-layout frame is bound to a `spacing/*` variable (zero raw px). Every
  FIXED width/height whose px is a real component-size value is bound too; FILL/HUG axes,
  doc-layout container dims, and icon-instance sizes are correctly left unbound. Verify
  by walking the frame's nodes and asserting `boundVariables` carries the padding/gap
  props (and width/height on FIXED component-size nodes).
- ✓ **Min/max bound** — every code `min-*`/`max-*` (that isn't skip-listed: `min-w-0`,
  `svh`, `max-content`, runtime `var()`) is modelled as the node's native
  `minWidth`/`maxWidth`/`minHeight`/`maxHeight` bound to `spacing/*` — on an auto-layout
  node, or as the bound FIXED dimension on a `layoutMode: NONE` node. Verify `boundVariables`
  carries the min/max prop.
- ✓ **No layout shift from binding** — re-read every node touched by a spacing/size/min/max
  bind and assert its `w`/`h` equals the pre-bind resting value, `layoutSizing*` is
  unchanged, and each `min*` ≤ current size ≤ each `max*`. A bind is additive; any geometry
  or sizing-mode change means a wrong floor/ceiling or a bad target node — fix it.
- ✓ **Text styles everywhere** — every text node (chrome AND component content) has a
  `textStyleId`; none is raw `fontName`/`fontSize`. Verify by walking the doc frame's
  TEXT nodes and asserting `textStyleId` is set (instance-internal text inherits from the
  styled source — that counts). The style chosen matches the code's type role.
- ✓ **House style matched** — frame named `Foundation / <Name>`, correct sub-frames
  (`Header`, `Component set`/`Component`, showcase frames, `Documentation`), ALL-CAPS
  section labels, purple-dashed `Master (original)`, real guideline text.
- ✓ **Placed correctly** — the `Foundation / <Name>` frame sits at (0,0) on its **own
  dedicated page** named `<Name>`, and that page is inserted alphabetically among the
  component pages (after the `-------Components-------` divider). Not in a grid, not floating.
- ✓ Consistent naming (`Variant=…, Size=…`), consistent spacing, production-ready.

If any check fails, fix it before moving to the next component. Never build the next
component on an unvalidated one.

---

## Hard rules

1. **Never duplicate a source component** — one master per family, forever. A component
   that reuses another's look in code has no own master; compose it from that
   component's instances.
2. **Never make pointer states (hover/active/focus) into variants** — they're a
   documented formula, never a `State` value. Only `disabled` and persistent selection
   states become properties (see the state doctrine).
4. **Never detach an instance** and never hand-redraw something a component/instance can express.
5. **Never redraw an icon, and never look for a per-glyph icon component** — there is one
   `Icon` set (`157:10`); instance it and set `Type`=glyph + `Size`=px.
6. **Never hardcode** a color, radius, border, or effect that has a
   variable — bind to the existing semantic variables the code's `cva` points at.
   **Never leave text as raw `fontName`/`fontSize`** — every text node links to a text
   style via `setTextStyleIdAsync` (type is a token too; see Step 3 and the house-style
   map). Chrome and component content alike; style the source, instances inherit.
6a. **Never leave padding/gap as raw px** — bind every `paddingLeft/Right/Top/Bottom`
   + `itemSpacing` on a non-instance auto-layout frame to a `spacing/*` variable, always
   (see Step 3). **Bind width/height too, but only genuine component sizes on FIXED axes**
   — never FILL/HUG axes, never doc-layout container widths, never icon-instance sizes.
   **Model `min-*`/`max-*` as Figma's native `minWidth`/`maxWidth`/`minHeight`/`maxHeight`
   bound to `spacing/*`** (a floor/ceiling alongside the sizing mode — not a fake FIXED
   size); needs auto-layout, else bind the FIXED dimension. Skip `min-w-0`/`svh`/`max-content`/
   runtime-`var()` — no token. **If a spacing value has no exact token, STOP and surface it**
   — never round to the nearest step (it's an off-scale code value to fix first, or
   scaffolding to leave raw).
7. **Never invent a new documentation style** — continue the established house style so
   the library reads as one author's work.
8. **Never recreate Storybook stories as bespoke components** — stories are examples;
   collapse them into properties on the single source component.
9. **Never rebuild tokens/variables here** — foundations already exist; that's `figma-sync`.
10. **Never batch components in one `use_figma` call** — one component at a time,
    sequential writes only, validate between (per `figma-generate-library`).

---

*Skill: GeekLego Foundation Component Import — code → Figma, into the official library.*
*Layer over `figma-use` + `figma-generate-library`; specializes them for GeekLego.*
*Source of truth: `components/v2/` + Storybook. House style: the existing Foundation library.*
