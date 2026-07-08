# House Style — the GeekLego Foundation library doc-frame template

This is the documentation pattern **already established** in `geeklego-v2-final`,
distilled from the components currently imported (Button, Input, Checkbox, Switch,
Badge, Card, Label, Separator, Avatar, Progress, Alert, Skeleton, Toggle, ToggleGroup,
Tooltip, Tabs, Typography, Accordion, Textarea, Breadcrumb, RadioGroup, Slider, Select,
Sonner). New components MUST match it so the library reads as one author's work — that
includes linking every text node to a **text style** (see the text-style → role map
below); the library was migrated fully onto text styles, so nothing is raw Inter.

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
- **text** — the component name (e.g. `Button`, `Checkbox`), text style **`heading/h1`**.
- **text** — a **one-line description** below the name, text style **`body/base`**. This is a specific,
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
- **text label** — ALL CAPS, text style **`label/sm`**. `COMPONENT SET` when the
  component has variant axes, `COMPONENT` when it's a single master (Card, Label). (Some
  entries use `MASTER COMPONENT SET` — either is acceptable; match the more recent
  convention you see in Step 1.)
- **frame** `Master (original)` — **this is the purple-dashed source region.** It has a
  dashed purple stroke and holds:
  - **text** `ORIGINAL COMPONENT` (small caps tag, text style **`label/sm`**, top-left inset ~16px).
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
- **text** `USAGE & GUIDELINES` (ALL CAPS label, text style **`label/sm`**, inset ~20px).
- **text** — a **real** one-paragraph guideline in the house voice, text style **`body/sm`**: when to use each
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
| `p-*` / `px-*` / `py-*` / `pt/pb/pl/pr-*` | `paddingLeft/Right/Top/Bottom` | `spacing/N` (N = the Tailwind step) |
| `gap-*` / `space-*` | `itemSpacing` | `spacing/N` |
| `size-*` / `w-*` / `h-*` / `min-w-*` / `min-h-*` (fixed numeric) | width / height (FIXED axis only) | `spacing/N` |
| `--ext-<component>-<variant>-*` (e.g. Button `gamified`) | fill/text for that variant | the matching `--ext-*` variable |

If a class points at a variable that isn't in the file, that's a decision fork —
surface it; don't hardcode the raw value.

### Spacing → `spacing/*` (bind padding/gap always; width/height only for real sizes)

Bind with `node.setBoundVariable(prop, spacingVarObj)`. The `spacing/*` FLOAT vars live
in the `01 · Primitives` collection; each px = step × 4 (e.g. `spacing/4` = 16).

**Tailwind step → token px:**

| cva class | px | token |
|---|---|---|
| `-0` | 0 | `spacing/0` |
| `-0.5` / `-1.5` / `-2.5` / `-3.5` | 2 / 6 / 10 / 14 | `spacing/raw-2` / `raw-6` / `raw-10` / `raw-14` |
| `-1 … -12` (integer) | 4 … 48 | `spacing/1 … spacing/12` |
| `-16 / 20 / 24 / 32 / 40 / 44 / 48` | 64 / 80 / 96 / 128 / 160 / 176 / 192 | matching `spacing/N` |
| `-56 / 64 / 72 / 96 / 128` | 224 / 256 / 288 / 384 / 512 | `spacing/56 / 64 / 72 / 96 / 128` |
| `px` (1px hairline) | 1 | `spacing/px` |

**Rules:**
- **Padding & gap: bind every one, always.** `paddingLeft/Right/Top/Bottom` + `itemSpacing`
  on every auto-layout frame. Pure auto-layout props — binding is safe and non-negotiable.
- **Width & height: bind only genuine component sizes, only on FIXED axes.** Bindable iff
  the axis `layoutSizing*` is `FIXED` (not `FILL`/`HUG` — those mirror `w-full`/`w-auto`/
  `w-fit` and stay as sizing modes) **and** the px is a real `size-*`/`w-*`/`h-*`/`min-*`
  value from the code's `cva` (icon `size-4`=16, control `h-10`=40, thumb 16). **Do not
  bind** doc-layout/showcase container widths (the set bounding box, showcase rows, demo
  trigger widths) or **icon-instance sizes** (owned by the icon main component — binding
  detaches an override). Bind the source; instances inherit.
- **No exact token → STOP.** If a padding/gap/size px has no matching `spacing/*` var
  (an off-named-scale code value like `min-h-44`=176 / `max-h-96`=384 / `max-w-lg`=512
  before those tokens existed), surface it — add the token first (both CSS blocks in
  `design-system/v2/` **and** `v2-defaults/`, plus the Figma `spacing/N` var) or leave
  scaffolding raw. Never round.

### `min-*` / `max-*` constraints → Figma native min/max (bind to `spacing/*`)

Figma auto-layout has **native** min/max width & height — `node.minWidth / maxWidth /
minHeight / maxHeight` (a numeric floor/ceiling that sits *alongside* the sizing mode,
NOT instead of it) — and each is **variable-bindable**: `node.setBoundVariable('minWidth'
| 'maxWidth' | 'minHeight' | 'maxHeight', spacingVarObj)`. So model the code's `min-w-*`/
`max-h-*` faithfully, don't approximate as a FIXED size.

- **Which constraint, which axis:** `min-w-32`→`minWidth` 128, `max-h-96`→`maxHeight` 384,
  `min-h-20`→`minHeight` 80, etc. — same px→`spacing/N` map as above. Bind the token; set
  the numeric value first (`node.minHeight = 80`) then `setBoundVariable`.
- **Requires auto-layout.** `min*/max*` throw `"Can only set … on auto layout nodes"` on a
  `layoutMode: NONE` frame (plain rects/ellipse, e.g. the Slider track). For a non-auto-layout
  node the FIXED width/height already IS the resting min — bind that FIXED `width`/`height`
  to the token instead (that's the faithful representation; don't force auto-layout on it).
- **A throw ROLLS BACK the whole `use_figma` call.** If one node throws (the auto-layout
  error above), *every* bind earlier in that same call is reverted too — silently. So when
  binding min/max across several components in one script, wrap **each component in its own
  `try/catch`** and check `layoutMode !== 'NONE'` before touching `min*/max*`, so one
  non-auto-layout node can't undo the rest. Re-read the bindings after, never assume.
- **A `min-*` is a floor, not the resting size** — leave the frame's sizing mode as-is
  (HUG stays HUG, FIXED stays FIXED); the min just guarantees it never shrinks below the
  token. Same for `max-*` as a ceiling on a HUG axis (hug content, cap at the token, scroll
  beyond).
- **Binding must NOT shift layout — verify it.** A min/max bind is purely additive; the
  three ways it *could* move a node are all bugs to catch: (a) a **min floor > current size**
  force-grows the node, (b) a **max ceiling < current size** clips/shrinks it, (c) a bind
  call that flips the **sizing mode** (HUG→FIXED etc.). After binding, re-read each touched
  node and assert: its `w`/`h` equals the pre-bind resting value, `minWidth`/`minHeight` ≤
  current size, `maxWidth`/`maxHeight` ≥ current size, and `layoutSizingHorizontal/Vertical`
  is unchanged. Any mismatch = the floor/ceiling was wrong or hit a bad node; fix before
  moving on.
- **Skip — no static Figma equivalent** (same class as FILL/HUG axes): `min-w-0`/`min-h-0`
  (flex-shrink idiom, not a size), `min-h-svh`/`max-w-max` (viewport / max-content),
  `min-w-[var(--radix-…)]` (runtime-computed). These carry no token and no constraint.
- **Scope like sizes:** bind on the source component / hand-built showcase composition
  (e.g. a `SelectContent` popover built in the doc frame), never on instance-internal nodes.

---

## Text-style → role map (type is a token — never raw font/size)

Every text node links to a text style via `await node.setTextStyleIdAsync(id)`. The
style sets family/size/line-height; the bound **text-fill variable** still sets colour
(set both). The file has these styles — reconcile the names against a live
`getLocalTextStylesAsync()` in Step 1, and load each family before applying (Satoshi
Variable, Figtree, JetBrains Mono):

**Doc-frame chrome:**

| Chrome element | Text style |
|---|---|
| Doc title (~28) | `heading/h1` |
| Header description (~15) | `body/base` |
| Section labels (ALL CAPS) · `ORIGINAL COMPONENT` · `USAGE & GUIDELINES` · `COMPONENT SET`/`COMPONENT` | `label/sm` |
| Guideline paragraph (~13) | `body/sm` |
| Small helper note under a field (~12 regular) | `body/xs` |

**Component / showcase content — map from the code's type role (the cva text-* class):**

| Code type role (cva) | Text style |
|---|---|
| heading ramp — `text-4xl…text-lg` headings (Typography h1–h4, card titles) | `heading/h1…h4` by size (h1 36, h2 28, h3 24, h4 20/18) |
| `text-base` body / lead paragraph | `body/base` |
| `text-sm` body, item text, crumb, trigger value, tab/menu label content | `body/sm` |
| `text-sm font-medium` — field labels, toast titles, active tab labels, button labels | `label/base` |
| `text-xs font-medium` — small labels, group headings, badge text, avatar initials | `label/sm` |
| `text-xs` regular helper/placeholder | `body/xs` |
| `font-mono` / code / kbd | `code/base` (14) or `code/sm` (12) |
| blockquote *italic* | no italic style exists — leave as-is (do not force a style) |

**Rules that keep this clean:**
- **Style the source component's text; instances inherit.** Never call
  `setTextStyleIdAsync` on text *inside an INSTANCE* (creates an override) — walk up; if
  an ancestor is `INSTANCE`, skip and fix the source. Hand-built compositions (a Field
  label, an open-menu row) are not instances → style them directly.
- The **Typography** component's specimen nodes are the type ramp itself and are already
  styled — never restyle them.
- **Validate:** after building, walk the doc frame's TEXT nodes and assert every one has
  a `textStyleId` (instance-inherited counts). Zero raw `fontName`/`fontSize`.
