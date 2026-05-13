---
name: figma-sync
description: Sync the Geeklego design system or individual components to Figma. Use this skill whenever the user asks to sync, push, update, or export anything to Figma — design system tokens, variables, text styles, or components. Triggers on: "sync design system", "sync component", "sync to figma", "update figma variables", "push tokens to figma", "figma design system", "export tokens", "design tokens to figma", "figma variables", "variable collections", "sync foundation", "sync tokens", "refresh figma tokens", "rebuild figma", "nuke and recreate", "create figma component from", "daisy-chain", "sync variables", or any request to make Figma match the CSS/code. This skill always operates code → Figma only. It never pulls from Figma. There are two scenarios: (1) Sync Design System — reads a CSS file, audits the current Figma state, diffs and reconciles variable collections and text styles, then produces a structured six-section sync report; (2) Sync Component — checks tokens exist first, then builds a full Figma component (auto-layout, variants, variable bindings) from a React component. This skill behaves as a Design System Auditor + Token Sync Engine.
---

# Figma Sync — Geeklego Design System

Two scenarios, one direction: **code → Figma**. This skill is a **Design System Auditor + Token Sync Engine** — it reads the current Figma state before writing anything, audits it against the CSS, and produces a structured report of every change made.

| Scenario | What it does |
|---|---|
| **Sync Design System** | Reads a CSS file, audits Figma's current variables + text styles, diffs and reconciles only what's missing or wrong, then reports in a structured six-section format |
| **Sync Component** | Checks required tokens exist first, then builds a full Figma component (auto-layout, variants, variable bindings) from a React component |

The design system follows a strict 3-tier token chain:

```
Primitive (raw values) → Semantic (purpose aliases) → Component (per-component aliases)
```

Figma must mirror this hierarchy exactly using variable aliases. Never skip a level. Never hardcode a value.

---

## Scope of Sync

Understanding what each trigger phrase does and does NOT touch prevents accidental writes.

| Trigger | Writes to Figma | Never writes to |
|---|---|---|
| `"sync my design system"` | `01 · Primitives`, `02 · Semantic`, Text Styles | `03 · Component` (read for audit only) |
| `"sync [component name]"` | `03 · Component` for that component only | Any other component's tokens |
| `"nuke and recreate"` | All three collections + Text Styles | (full rebuild — nothing excluded) |

**Rule:** Component token blocks in the CSS are always parsed for audit inventory, but during a design system sync they are never written. Writes to `03 · Component` happen only when the user explicitly requests a component sync.

---

## Pre-flight (Both Scenarios)

Before doing anything, verify the Figma connection:

1. Call `figma_get_status`
2. Confirm `transport.websocket.available: true` and a connected file
3. If not connected — tell the user to open the Figma Desktop Bridge plugin and retry

Do NOT proceed if Figma is not connected.

---

# SCENARIO 1: Sync Design System

## Step 0: Choose the CSS File (Mandatory — Always Ask)

**Always prompt the user before reading any file.** Do not assume or auto-detect.

Ask the user:

> "Which design system needs to be synced?"
> - `/Users/bittasingha/Documents/geeklego-monorepo/packages/geeklego/design-system/geeklego.css`
> - `/Users/bittasingha/Documents/geeklego-monorepo/apps/geeklego-site/src/styles/geeklego-site.css`

Wait for the answer before proceeding to Step 1. Never skip this prompt.

---

## Step 1: Read Both Sources

### CSS side — parse the chosen file

**If `geeklego.css` was chosen:**

| Block | What to parse | Notes |
|---|---|---|
| `@theme` | Primitives — raw values (`--color-*`, `--spacing-*`, `--font-*`, etc.) | |
| `:root` / `[data-theme="light"]` | Semantic tokens — purpose-driven aliases of primitives | |
| `[data-theme="dark"]` | Dark mode overrides for semantic tokens | |
| `.text-*` classes | 32 typography utility classes → Figma text styles | |
| `/* GENERATED COMPONENT TOKENS */` | Per-component token blocks | **Parsed for audit inventory only — not written during design system sync** |

**If `geeklego-site.css` was chosen:**

| Block | What to parse |
|---|---|
| `:root` (first block) | Site primitives — raw values with `--site-*` prefix |
| `:root` / `[data-theme="light"]` (second block) | Site semantic tokens aliasing site primitives |
| `[data-theme="dark"]` | Dark mode overrides |
| Component sections (`--site-header-*`, `--site-sidebar-*`, etc.) | Site-specific component tokens |

> `geeklego-site.css` has no `@theme` block and no `.text-*` typography classes. Its token names all use the `--site-*` prefix.

### Figma side — fetch current state

```js
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const allVars = await figma.variables.getLocalVariablesAsync();
const textStyles = await figma.getLocalTextStylesAsync();

return {
  collections: collections.map(c => ({
    name: c.name, id: c.id,
    modes: c.modes.map(m => ({ name: m.name, modeId: m.modeId })),
    variableIds: c.variableIds
  })),
  variables: allVars.map(v => ({
    name: v.name, id: v.id, resolvedType: v.resolvedType,
    collectionId: v.variableCollectionId,
    scopes: v.scopes, description: v.description,
    valuesByMode: Object.fromEntries(
      Object.entries(v.valuesByMode).map(([mId, val]) => [
        mId,
        val && val.type === 'VARIABLE_ALIAS'
          ? { alias: allVars.find(x => x.id === val.id)?.name || val.id }
          : val
      ])
    )
  })),
  textStyles: textStyles.map(s => ({
    name: s.name, id: s.id,
    fontName: s.fontName, fontSize: s.fontSize,
    lineHeight: s.lineHeight, letterSpacing: s.letterSpacing,
    boundVariables: s.boundVariables
  }))
};
```

Use 30000ms timeout — this can be a large payload.

---

## Step 1b: Token Naming Transformation

Before any diff or write, all CSS variable names must be transformed into clean Figma token paths. Apply this algorithm to every CSS property name encountered:

**Algorithm:**
1. If the value is wrapped in `var(...)`: strip the wrapper → `var(--color-brand-500)` → `--color-brand-500`
2. Strip the leading `--` → `color-brand-500`
3. Replace each `-` with `/` → `color/brand/500`

**Examples:**

| CSS source | Figma variable name |
|---|---|
| `--color-primary-500` | `color/primary/500` |
| `var(--content-max-width-sm)` | `content/max-width/sm` |
| `--spacing-component-lg` | `spacing/component/lg` |
| `--typography-body-md-font-size` | `typography/body/md/font-size` |
| `--color-neutral-0` | `color/neutral/0` |
| `--font-weight-bold` | `font/weight/bold` |
| `--radius-md` | `radius/md` |

**Hard rule:** Figma variable names must never contain `--`, `var(`, or `)`. If an existing Figma variable is found with raw CSS syntax in its name, flag it in the Naming Audit section of the report — do not silently accept it.

See `references/foundation-details.md` for the complete naming convention table and special-case handling.

---

## Step 2: Audit Phase

Using the data already fetched in Step 1 (no new Figma API calls), analyse the current Figma state against the CSS and produce a **Pre-Sync Audit report** before writing anything.

This is a read-only analysis pass. Its purpose is to show the user what the sync will change before any writes happen.

### What to detect and record

**Primitive tokens (`01 · Primitives`)**
- Variables present in Figma but not in CSS (orphans)
- Variables missing from Figma that CSS defines
- Variables with incorrect raw values (CSS value ≠ Figma value)
- Variables using raw CSS syntax in their name (e.g. starts with `--`)

**Semantic tokens (`02 · Semantic`)**
- Variables whose alias target doesn't exist in `01 · Primitives` (broken alias)
- Variables with hardcoded values instead of aliases
- Variables where Light and Dark modes differ from what CSS defines
- Variables missing from Figma

**Typography styles**
- Styles with all 5 properties bound to semantic variables → healthy
- Styles missing one or more of the 5 bindings → detached
- Styles with hardcoded raw values instead of variable bindings
- Styles missing from Figma entirely

**Variable collections**
- Expected: `01 · Primitives` (1 mode: Value), `02 · Semantic` (2 modes: Light, Dark), `03 · Component` (1 mode: Value)
- Report any collections with wrong mode counts or missing collections

**Alias chain health**
- For each semantic token, trace its alias: semantic → primitive
- The chain must resolve in ≤ 2 hops
- Flag any chain with a dead-end or circular reference

**Naming audit**
- Any variable name containing `--`, `var(`, or `)`
- Names that don't follow slash-path conventions

### Pre-Sync Audit report format

Output this before any writes:

```
## Pre-Sync Audit — [filename]

### What will change
- Primitive tokens: N to create, N to update, N mismatched (values differ), N orphaned in Figma
- Semantic tokens: N to create, N broken aliases to fix, N hardcoded values to convert
- Typography styles: N to create, N detached (missing bindings) to fix
- Naming issues: N variables with raw CSS syntax in names

### No changes needed
- Primitives unchanged: N
- Semantics unchanged: N
- Text styles unchanged: N

Proceed with sync? (yes to continue, or describe what to skip)
```

Wait for user confirmation before proceeding to Step 3.

---

## Step 3: Diff & Reconcile Variables

### Collection names

| Chosen file | Figma collections |
|---|---|
| `geeklego.css` | `01 · Primitives`, `02 · Semantic`, `03 · Component` |
| `geeklego-site.css` | `01 · Site Primitives`, `02 · Site Semantic`, `03 · Site Components` |

### Collection existence check

For each of the 3 collections:
- If it doesn't exist → create it from scratch (see `references/foundation-details.md` for naming, scoping, and description conventions)
- If it exists → proceed with incremental diff

### Variable-level diff

For each variable that should exist (derived from the CSS):

| Situation | Action |
|---|---|
| Exists with correct name, type, and values | Skip — no change needed |
| Exists with correct name but wrong alias or raw value | **Flag as conflict** — report to user, wait for confirmation before overwriting |
| Exists with correct name but wrong scopes | Update scopes silently |
| Exists with correct name but missing or wrong description | Update description silently |
| Missing from Figma | **Create** it with correct value, scopes, and description |
| Exists in Figma but not in CSS | **Flag for removal** — report to user, do not auto-delete |

### Conflict report format

```
## Conflicts Found

| Variable | Figma Value | CSS Expected | Collection |
|---|---|---|---|
| — | — | — | — |

## Variables Not in CSS (candidates for removal)

| Variable | Collection |
|---|---|
| — | — |

Should I overwrite the conflicts to match CSS? And should I remove the orphaned variables?
```

Wait for user confirmation before making any changes to conflicted or orphaned variables.

### Creating new variables

Follow `references/foundation-details.md` for:
- Naming conventions and slash-path structure
- Unit conversions (px → number for Figma)
- Color format (CSS hex/rgb → Figma `{r, g, b, a}` 0–1)
- Scoping rules per token type
- Description patterns

Rules:
- **Primitives**: `scopes = []` (hidden from picker), description = raw value
- **Semantics**: appropriate scopes for the token type, aliased to primitives, description = purpose + which modes differ
- **Component tokens**: appropriate scopes, aliased to semantics — never to primitives directly
- **Transparent colors**: use `{r:0, g:0, b:0, a:0}` — not an alias
- **Shadow tokens**: skip — Figma handles shadows as effects, not variables

### Mode checks (Semantic collection only)

For multi-mode semantic variables (Light / Dark for `geeklego.css`, or Light / Dark for `geeklego-site.css`), verify each mode's alias independently. A variable can be correct in Light but wrong in Dark.

---

## Step 4: Diff & Reconcile Text Styles

> This step applies only to `geeklego.css`. `geeklego-site.css` does not define text styles.

### Text style binding rule — MANDATORY

**Every text style must bind all 5 typography properties to semantic variables.** A text style without bindings is considered broken regardless of whether its raw values look correct. Fix it.

The 5 required bindings per text style:

```js
const semKey = styleName.replace(/\//g, '-'); // 'display/hero' → 'display-hero'
ts.setBoundVariable('fontSize', sMap['typography/' + semKey + '/font-size']);
ts.setBoundVariable('lineHeight', sMap['typography/' + semKey + '/line-height']);
ts.setBoundVariable('letterSpacing', sMap['typography/' + semKey + '/letter-spacing']);
try { ts.setBoundVariable('fontFamily', sMap['typography/' + semKey + '/font-family']); } catch(e) {}
try { ts.setBoundVariable('fontWeight', sMap['typography/' + semKey + '/font-weight']); } catch(e) {}
```

The `try/catch` on `fontFamily`/`fontWeight` is a safety net for older plugin API versions — attempt them regardless.

**Never set `fontSize`, `lineHeight`, `letterSpacing`, `fontName`, or `fontWeight` as raw values on a text style.** Always go through the semantic variable binding. If the semantic variable doesn't exist yet, create it first (in `02 · Semantic`), then bind.

### Text style diff

| Situation | Action |
|---|---|
| Exists with correct font properties AND all 5 bindings present | Skip |
| Exists with correct font properties but missing bindings | **Fix** — add all missing bindings |
| Exists but wrong font properties | **Fix** — update properties AND re-bind |
| Missing from Figma | **Create** with correct properties + all 5 bindings |
| Exists in Figma but not in CSS | **Flag for removal** — report to user |

### Complete text style list (32)

**Display (7):** hero, 3xl, 2xl, xl, lg, md, sm
**Heading (5):** h1, h2, h3, h4, h5
**Body (5):** lg, md, sm, xs, 2xs
**Label (3):** md, sm, xs
**Caption (2):** md, sm
**Overline (1):** md — also set `textCase = 'UPPER'`
**Code (4):** md, sm, xs, 2xs
**Button (5):** xl, lg, md, sm, xs

---

## Step 5: Post-Sync Validation

After all writes are complete, run these six checks before generating the final report. These verify the sync actually landed correctly — not just that the write calls succeeded.

1. **Primitive values** — spot-check ~10% of primitives: fetch each from Figma and confirm the raw value matches the CSS value
2. **Semantic aliasing** — verify that no semantic token in `02 · Semantic` has a hardcoded raw value; all must be `VARIABLE_ALIAS` type pointing into `01 · Primitives`
3. **Typography bindings** — confirm each text style has all 5 properties bound to semantic variables; any with raw values is still broken
4. **Alias chain depth** — trace 5–10 semantic tokens end-to-end; each must resolve to a primitive in ≤ 2 hops; flag dead-ends
5. **Collection structure** — confirm collection names, mode counts, and approximate variable counts match expectations (see `references/foundation-details.md`)
6. **Naming cleanliness** — scan all Figma variable names; flag any containing `--`, `var(`, or `)` as a blocking validation error

If validation check 6 finds raw CSS syntax names: list them in the Naming Audit section of the report and mark them as unresolved issues — they must be fixed before the sync is considered complete.

---

## Step 6: Structured Sync Report

Every sync must end with this exact six-section report. Always include all sections even if some show zero counts.

```
## Sync Report — [source filename] — [date/time]

### Primitive Tokens
- Created: N
- Updated: N
- Mismatched (values differed, now fixed): N — [list each if N > 0]
- Missing (in CSS but not in Figma after sync): N — [list each if N > 0]

### Semantic Tokens
- Created: N
- Updated: N
- Broken aliases fixed: N — [list each if N > 0]
- Invalid mappings (hardcoded values converted): N — [list each if N > 0]

### Typography
- Synced styles: N
- Detached styles fixed (missing bindings added): N — [list each if N > 0]
- Missing semantic links resolved: N
- Invalid typography mappings: N — [list each if N > 0]

### Component Tokens
[Only include this section when a component sync was requested]
- Created: N
- Updated: N
- Missing dependencies resolved: N
- Alias validation: Pass / Fail — [list failures if any]

[When design system sync only:]
N/A — design system sync only. Component tokens were read for audit but not written.

### Naming Audit
- Invalid naming structures: N — [list each]
- Raw CSS syntax detected (--var or var(...)): N — [list each]
- Hierarchy inconsistencies: N — [list each]

### Final Summary
- Total synced: N
- Total created: N
- Total updated: N
- Total mismatches: N
- Total warnings: N
- Unresolved issues: N — [list each if N > 0]

### Collection Totals
| Collection | Variables |
|---|---|
| 01 · Primitives | N |
| 02 · Semantic | N |
| 03 · Component | N |
| Text Styles | N |
```

If there are unresolved issues, do not mark the sync complete. List what needs manual attention.

## Full Rebuild Option

If the user says "nuke and recreate" or "delete and rebuild":
1. Delete all variable collections
2. Delete all text styles
3. Recreate everything from scratch following `references/foundation-details.md`
4. Run the full Post-Sync Validation (Step 5)
5. Output the Structured Sync Report (Step 6)

---

# SCENARIO 2: Sync Component

This scenario takes a React component from the codebase and creates a full interactive Figma component with auto-layout, variant sets, and variable bindings.

**Read `references/component-sync.md` for the complete implementation guide** (code patterns, variant generation, auto-layout mapping). This section provides the required sequence.

---

## Step 0: Token Preflight (Always First)

Before building anything in Figma, verify the full token chain for this component.

**0a. Read the component's token block**

In the chosen CSS file, find the section marked with the component's name (e.g. `/* Button — generated ... */`). Extract all `--button-*` (or equivalent) variables.

**0b. Fetch Figma's current variable state** (same query as Scenario 1 Step 1)

**0c. Diff component tokens**

For each component token:
1. Does it exist in Figma's `03 · Component` collection?
2. Is its alias pointing to the correct semantic variable in `02 · Semantic`?
3. Does that semantic variable exist in `02 · Semantic`?

**0d. Inject missing tokens**

If any component token is missing from Figma:
- Create it in `03 · Component` with the correct semantic alias
- If the semantic variable it aliases is also missing → create it first in `02 · Semantic`
- Never reference a primitive directly from a component token

**Component token isolation:** Inject ONLY the tokens for the requested component. If primitives or semantics are missing, create those (they are shared infrastructure), but `03 · Component` receives entries only for this component — never for other components as a side effect.

**0e. Confirm before building**

Once all tokens are confirmed or injected, report:
```
✓ Token preflight complete
  - 12 component tokens confirmed
  - 3 semantic tokens created
  - 0 conflicts
Proceeding to build component...
```

Only after this confirmation proceed to Step 1.

---

## Step 1: Parse the Component

Read the component's files:
- `[Component].tsx` — layout structure, variant maps, sub-component usage
- `[Component].types.ts` — props, variants, sizes, states

Determine:
1. **Tier** — L1 (atom), L2 (molecule), L3 (organism)
2. **Dependencies** — which atoms/molecules it imports
3. **Variants** — from props (variant, size, state combinations)
4. **Layout** — auto-layout hierarchy from the JSX structure

---

## Step 2: Page and Section Setup

Navigate to or create the correct page:

| Tier | Page |
|---|---|
| L1 Atoms | `Atoms` |
| L2 Molecules | `Molecules` |
| L3 Organisms — charts | `Charts` |
| L3 Organisms — navigation | `Navigation` |
| L3 Organisms — other | `[OrganismName]` |
| Foundation reference | `Foundation` |

```js
await figma.loadAllPagesAsync();
let page = figma.root.children.find(p => p.name === 'Atoms');
if (!page) {
  page = figma.createPage();
  page.name = 'Atoms';
}
figma.currentPage = page;
```

Find or create the Section for this component:

```js
let section = figma.currentPage.findOne(n => n.type === 'SECTION' && n.name === 'Button');
if (!section) {
  // Calculate safe position — always below existing content
  const allSections = figma.currentPage.findAll(n => n.type === 'SECTION');
  const lastBottom = allSections.reduce((y, s) => Math.max(y, s.y + s.height), 0);
  section = figma.createSection();
  section.name = 'Button';
  section.x = 0;
  section.y = lastBottom > 0 ? lastBottom + 80 : 0;
}
```

**Never place a new Section at a position occupied by an existing Section.** Always compute position from the bounding boxes of all existing sections.

Add a header label inside the section:

```js
await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
const headerLabel = figma.createText();
headerLabel.fontName = { family: 'Inter', style: 'Semi Bold' };
headerLabel.fontSize = 14;
headerLabel.characters = 'Button — Variants · Sizes · States';
section.appendChild(headerLabel);
```

---

## Step 3: Ensure Dependencies Exist

For L2+ components, check whether dependency atoms/molecules already exist as Figma components:

```js
await figma.loadAllPagesAsync();
const allComponents = [];
for (const p of figma.root.children) {
  p.findAll(n => n.type === 'COMPONENT' || n.type === 'COMPONENT_SET').forEach(c => allComponents.push({ name: c.name, id: c.id, page: p.name }));
}
return allComponents;
```

If dependencies are missing, build them first (bottom-up: atoms before molecules before organisms). Present the dependency tree to the user and confirm before recursing.

**When using a dependency inside this component, always instantiate — never re-draw:**

```js
let selectComp = null;
for (const p of figma.root.children) {
  selectComp = p.findOne(n => (n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') && n.name === 'Select');
  if (selectComp) break;
}
if (selectComp) {
  const inst = (selectComp.type === 'COMPONENT_SET' ? selectComp.defaultVariant : selectComp).createInstance();
  parentFrame.appendChild(inst);
}
```

---

## Step 4: Build the Component

Using `figma_execute` (30000ms timeout):
1. Create `figma.createComponent()` for each variant
2. Set up auto-layout matching the React JSX structure
3. Bind fills, strokes, corner radius, and spacing to component token variables
4. Add text nodes and bind them to text styles (which are already bound to semantic variables)
5. Instantiate dependency components where the React code uses them
6. Combine variants with `figma.combineAsVariants()` into a component set
7. Arrange variant frames left-to-right, 40px spacing between variants, with a text label above each

See `references/component-sync.md` for complete code patterns.

---

## Step 5: Screenshot Verification Loop (Mandatory)

After building the component's Section, run this loop before reporting completion:

**5a. Take a screenshot**

```js
figma_take_screenshot({ nodeId: section.id })
```

**5b. Check for stacking and layout issues**

Inspect the screenshot for each of these:
- **Overlapping frames** — two or more variant frames occupying the same x/y region
- **Zero-size nodes** — frames with 0 width or 0 height (invisible but blocking)
- **Missing variant labels** — text labels above each variant frame
- **Empty frames** — frames with no children
- **Misaligned auto-layout** — children not flowing in the expected direction

Also run a positional check in code:

```js
// After placing all variant frames, verify no two share the same x coordinate
const frames = section.findAll(n => n.type === 'FRAME' || n.type === 'COMPONENT');
const positions = frames.map(f => f.x);
const hasDuplicates = positions.length !== new Set(positions).size;
if (hasDuplicates) { /* fix positions */ }
```

**5c. Fix and re-screenshot**

If issues are found: fix the positions/layout and re-screenshot. Repeat up to 3 iterations.

**5d. Report**

```
✓ Button verified — no stacking, all 5 variants labelled, auto-layout correct
```

Or list any remaining issues that couldn't be auto-fixed.

---

# Canvas Organization Reference

## Page Architecture

| Page Name | What lives here |
|---|---|
| `Atoms` | All L1 components |
| `Molecules` | All L2 components |
| `Charts` | AreaChart, BarChart, any future chart organisms |
| `Navigation` | Sidebar, Navbar, navigational organisms |
| `Foundation` | Token reference frames, color swatches, typography specimens |
| `[OrganismName]` | L3 organisms that don't fit the above categories |

Always find-or-create. Never create a duplicate page.

## Layout Rules

- Variant frames within a Section: **left-to-right**, 40px gap, text label above each
- Sections on a page: **top-to-bottom**, 80px gap between bottom of one section and top of next
- Every Section has a header text label: `"[ComponentName] — States · Variants · Sizes"`
- Never place frames loose on the canvas — always inside a named Section

---

# Key Rules (Both Scenarios)

1. **Always read the CSS file fresh** — never use cached or hardcoded values
2. **Code is the single source of truth** — Figma is downstream; never pull from Figma to update CSS
3. **Never skip the alias chain** — primitive → semantic → component
4. **Check first, update only what's needed** — diff before writing
5. **Flag conflicts, don't silently overwrite** — user decides on mismatches
6. **Text styles are never valid without semantic bindings** — all 5 properties must be bound to variables
7. **Token preflight always runs before component build** — Step 0, no exceptions
8. **Positions are always computed from bounding boxes** — never hardcode x/y or assume the canvas is empty
9. **Screenshot verification is mandatory after every component** — take screenshot, check for stacking, fix, re-screenshot (max 3 iterations)
10. **L2+ organisms always instance existing atoms** — never re-draw an atom as a raw frame
11. **Always search all pages for dependencies** — atoms live on the Atoms page, not currentPage
12. **Primitives get `scopes = []`** — hidden from the variable picker
13. **Shadow tokens are skipped** — Figma handles shadows as effects, not variables
14. **Transparent colors** use raw `{r:0, g:0, b:0, a:0}` — not an alias
15. **Overline text style** needs `textCase = 'UPPER'`
16. **Every variable gets a description** — raw value (primitives), purpose + mode notes (semantics), alias chain (components)
17. **Always prompt for CSS file before design system sync** — the AskUserQuestion in Step 0 is not optional
18. **"sync my design system" never writes component tokens** — component token blocks are parsed for the audit phase only; writes to `03 · Component` require an explicit component sync request
19. **"sync [component]" writes ONLY that component's tokens** — never touch another component's token entries in `03 · Component` as a side effect
20. **Figma variable names are always slash-path strings** — produced by the transformation algorithm in Step 1b; raw CSS syntax in a variable name is a blocking validation error, not a warning
21. **Run the 6-point post-sync validation before reporting complete** — Step 5 is not optional; unresolved naming or alias issues must appear in the Final Summary
