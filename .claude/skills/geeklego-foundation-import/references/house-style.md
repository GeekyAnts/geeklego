# House Style — the GeekLego Foundation library doc-frame template

This is the documentation pattern **already established** in `geeklego-v2-final`,
distilled from the 12 components currently imported (Button, Input, Checkbox, Switch,
Badge, Card, Label, Separator, Avatar, Progress, Alert, Skeleton). New components MUST
match it so the library reads as one author's work.

**Always reconcile this doc against what you actually read in Step 1.** If the live file
has drifted from what's written here, follow the file — it is the real source of truth.

---

## Container hierarchy

```
Section  "Foundation Library"          (the outer page section)
└─ Frame "Frame 1"  (~1200 wide)        (the single wrapping frame; components stack in it)
   ├─ text  "Foundation"                (page title, ~48px)
   ├─ text  "Core components of the GeekLego v2 design system. Each block below
   │         documents one component: variants, states, and usage."   (intro)
   ├─ frame "Foundation / Button"       (one doc frame per component, ~1200 wide)
   ├─ frame "Foundation / Input"
   ├─ frame "Foundation / <NextComponent>"   ← new imports append here
   └─ …
```

**Placement of a new component:** append a new `Foundation / <Name>` frame **inside the
wrapping frame**, stacked below the last one. Compute its `y` from the previous frame's
`y + height` plus the gap the file uses between doc frames (read two adjacent frames'
`y`/`height` in Step 1 to get the exact rhythm; it is roughly frame-height + ~75px). Do
not create a floating frame outside the wrapper.

---

## Anatomy of one `Foundation / <Name>` doc frame

Width ~1200. Sub-frames, top to bottom, each inset ~48px from the left:

### 1. `Header`  (at ~48,48)
- **text** — the component name, ~34px (e.g. `Button`, `Checkbox`).
- **text** — a **one-line description** ~42px below the name. This is a specific,
  informative sentence in the house voice. It typically states: what the component is,
  the **count of variants / sizes / states**, and **which semantic variables** the
  properties bind to. Examples from the file:
  - Button: *"Triggers an action. 7 variants (default, secondary, destructive, outline,
    ghost, link, gamified) across 3 sizes (sm, md, lg). Fills, text and radius bind to
    Tier-2 semantic variables."*
  - Checkbox: *"A tri-state selection control built on Radix. Three states: unchecked,
    checked, indeterminate. The check and minus glyphs are instances of the existing
    icon library; the box fill/border bind to --primary / --input."*
  - Avatar: *"A circular user image with an initials fallback, built on Radix Avatar…
    the fallback surface binds to --muted with --muted-foreground initials. Size comes
    from consumer className (default size-10)."*

  Write the new component's description in this exact register: precise, names the
  counts, names the bound variables, notes if it's built on Radix and what Radix owns.

### 2. `Component set` (or `Component`)  — THE SOURCE
- **text label** — ALL CAPS. `COMPONENT SET` when the component has variant axes,
  `COMPONENT` when it's a single master (Card, Label). (Some entries use
  `MASTER COMPONENT SET` — either is acceptable; match the more recent convention you
  see in Step 1.)
- **frame** `Master (original)` — **this is the purple-dashed source region.** It has a
  dashed purple stroke and holds:
  - **text** `ORIGINAL COMPONENT` (small caps tag, ~13px, top-left inset ~16px).
  - the actual **component set / component** — named exactly `<Name>` — containing all
    the variant symbols.

This `Master (original)` frame is the single editable source. Its dashed-purple outline
is the visual signal "edit here." Reserve horizontal room for future variants.

### 3. Showcase frame(s) — INSTANCES ONLY
One or more frames, each: an ALL-CAPS **text label** + a `Row`/`Frame` of **instances**.
The label vocabulary already in use (reuse these names; add new ones in the same style):

| Label | Contents |
|---|---|
| `VARIANT SHOWCASE (MD)` | one instance per variant at the default size |
| `STATES` | default / disabled / focused instances |
| `WITH ICON (INSTANCES)` | instances with leading/trailing/icon-only icons |
| `SIZES (INSTANCES)` | one instance per size |
| `WITH LABEL` | instance composed with a text/label (Checkbox, Switch) |
| `SHOWCASE` | generic examples row |
| `IN CONTEXT` | instances used in a realistic mini-layout (Separator) |
| `LOADING PATTERNS (INSTANCES)` | composed instances (Skeleton) |
| `WITH A CONTROL` | composition with another component's instance (Label + Input) |
| `INSTANCE` | a single representative instance (Card) |

Choose the showcase frames that reproduce **this component's stories** — a component
with 4 variants + a with-icon story + a disabled story gets a `VARIANT SHOWCASE`, a
`WITH ICON`, and a `STATES` frame. Every node in these frames is an instance of the
source component (or of another library component, for compositions). Never detached.

### 4. `Documentation`  — USAGE & GUIDELINES
- **text** `USAGE & GUIDELINES` (ALL CAPS label, inset ~20px).
- **text** — a **real** one-paragraph guideline in the house voice: when to use each
  variant, pairing/a11y notes, and the disabled affordance (the file consistently notes
  *"Disabled uses 50% opacity."* where relevant). Not lorem. Not empty. Start it with
  the file's convention *"Reserved for guidelines. …"* and then give genuine guidance.

---

## Naming conventions (match exactly)

| Thing | Convention | Examples from the file |
|---|---|---|
| Doc frame | `Foundation / <Name>` | `Foundation / Badge` |
| Source component/set | `<Name>` | `Button`, `Checkbox` |
| Multi-axis variant | `Prop=Value, Prop=Value` | `Variant=default, Size=sm` |
| Single-axis variant | `Prop=Value` | `State=checked`, `Orientation=horizontal`, `Shape=line`, `Size=md` |
| Source region | `Master (original)` + `ORIGINAL COMPONENT` tag | — |
| Section labels | ALL CAPS | `COMPONENT SET`, `WITH ICON (INSTANCES)`, `USAGE & GUIDELINES` |
| Instance nodes | `<Name>` (Figma default for an instance of `<Name>`) | `Button`, `Badge` |

Variant property **names are capitalized** in Figma (`Variant`, `Size`, `State`,
`Orientation`, `Shape`) while their **values keep the code's casing** (`default`, `sm`,
`checked`, `horizontal`) — this mirrors the code's `cva` option strings. Keep it consistent.

---

## Binding hints — cva class → variable

Read the source component's `cva` and bind Figma visual props to the variable the class
points at. Common mappings (the semantic variables already exist in the file):

| Tailwind/cva class | Figma property | Semantic variable |
|---|---|---|
| `bg-primary` / `bg-secondary` / `bg-destructive` / `bg-muted` / `bg-card` / `bg-background` | fill | `--primary` / `--secondary` / `--destructive` / `--muted` / `--card` / `--background` |
| `text-primary-foreground` / `text-foreground` / `text-muted-foreground` | text fill | matching `*-foreground` |
| `border-input` / `border-border` / `border-destructive` | stroke | `--input` / `--border` / `--destructive` |
| `rounded-md` / `rounded-lg` / `rounded-full` | corner radius | the radius variable of that step |
| `ring-ring` (focus) | focus/stroke on the focused-state variant | `--ring` |
| `--ext-<component>-<variant>-*` (e.g. Button `gamified`) | fill/text for that variant | the matching `--ext-*` variable |

If a class points at a variable that isn't in the file, that's a decision fork —
surface it; don't hardcode the raw value.
