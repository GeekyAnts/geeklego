---
name: component-builder
description: >
  Generate production-grade, visually polished React components for the Geeklego
  design system, producing exactly 5 files per component (TSX, types, stories,
  README, mock-data) plus CSS design tokens — all fully wired into the token
  chain. Use this skill whenever the user asks to build, create, scaffold, add,
  wire up, or generate any UI component, atom, molecule, organism, or template
  — even if they don't say "component". Triggers on: "build a Button", "create
  a Card", "add a Sidebar", "generate a NavItem", "I need a search bar", "make
  a modal", "add a form field", "I want a data table", "build the header",
  "create a badge", "add a spinner", "scaffold a form input", "I need a loading
  state component", or any request involving UI elements, component library work,
  design system component generation, or implementing a design spec. Also
  triggers when the user pastes a Figma/design spec and asks to implement it,
  or when they ask to add a new component to the library even without specifying
  the exact file output format.
---

# Geeklego Component Builder

## Foundation — Read Before Every Session

Read these files at the start of every component generation session. Do not skip.

| File | What's in it |
|---|---|
| `CLAUDE.md` (project root) | Full project context, architecture rules, naming conventions, token chain rule, 5-file structure, "Never Do" / "Always Do" lists |
| `design-system/geeklego.css` | Live source of truth — all primitives, semantics, existing component tokens |
| `.claude/references/semantic-html-guide.md` | Element decision table, form/table/heading/landmark patterns |
| `components/utils/accessibility/index.ts` | ARIA helper types and functions for disclosure, navigation, live regions, loading/disabled states |

All paths are relative to `packages/geeklego/` inside the monorepo root.

Scan `geeklego.css` to know what tokens already exist. Every component you generate must integrate with what's already there — never duplicate, never conflict.

**⚡ Use code-review-graph tools first.** Before reaching for Grep or Read to explore the codebase, check whether `semantic_search_nodes`, `get_impact_radius`, or `query_graph` can answer the question faster. Fall back to file reads only when the graph doesn't cover what you need.

### Reference files (read on demand, not upfront)

| File | When to read |
|---|---|
| `references/aria-patterns.md` | When determining ARIA roles, keyboard patterns, or which helper/hook to use |
| `references/schema-org.md` | When the component maps to a Schema.org type (check the mapping table and status column) |
| `references/seo-guide.md` | When implementing SEO — Schema.org patterns, cascade rules, semantic HTML rules, and the step 4.7 checklist |
| `references/token-quick-reference.md` | When you need to look up available token names while writing component tokens |
| `.claude/references/storybook-stories.md` | When writing the 7 required stories — full template with JSX examples |
| `.claude/references/component-generation-flow.md` | When you need the full 5-step generation workflow with accessibility + performance audit checklists |
| `.claude/skills/state-handling/SKILL.md` | When implementing visual states (loading, disabled, error, selected) — decision matrix, patterns, and token naming. **Required for all interactive atoms and all L3 organisms.** |

---

## Design Quality — What Makes a Component Production-Grade

> This is the most important section in this skill. Architectural correctness is necessary but insufficient. A component that follows every token rule but *looks* like AI-generated boilerplate has failed. The skill exists to produce components that feel intentionally designed — not just structurally valid.

### Shadow Elevation Rule — Theme-Aware Depth

Shadows communicate layering — they should only appear when an element genuinely floats above the page. The rule differs by theme:

**Light mode & Dark mode — flat UI, contextual shadows only:**

| Element | Shadow | Why |
|---|---|---|
| Static/resting component (Button, Card, Input, Item) | `none` | Flat surfaces sit in the page, not above it |
| Overlay that opens on interaction (dropdown panel, tooltip, popover) | `--shadow-lg` | Floats above the page — shadow communicates this |
| Modal or dialog | `--shadow-xl` | Highest priority layer — demands the strongest shadow |

Never add shadow to a resting component in light or dark mode. Only the floating layer gets shadow.


### Spacing Has Rhythm

Inside a component, spacing follows the **component scale** (`--spacing-component-xs` through `xl`). Between components in a layout, spacing follows the **layout scale** (`--spacing-layout-xs` through `xl`).

The internal rhythm should be tighter than the external rhythm. A card's internal padding (`--spacing-component-lg` = 16px) should be noticeably less than the gap between cards in a grid (`--spacing-layout-sm` = 24px). If internal and external spacing are the same, the UI feels flat — nothing has hierarchy.

### Variants Must Be Visually Distinct at a Glance

If a user squints at your variants and can't tell `secondary` from `ghost`, the design has failed. Use **different types** of visual treatment for each variant — not just color shifts:

| Variant type | Visual approach | Example treatment |
|---|---|---|
| **Primary** | Filled background + high contrast text (light/dark flat) | Demands attention — this is the main action |
| **Secondary** | Filled but muted background, no shadow | Supports the primary without competing |
| **Outline** | Transparent background + visible border | Visible but lightweight — secondary emphasis |
| **Ghost** | Transparent everything, color appears only on hover | Hides until needed — tertiary emphasis |
| **Destructive** | Filled with error color (light/dark flat) | Signals danger — impossible to miss |
| **Link** | No background, no border, underline on hover | Inline text action — blends with prose |

Each variant should use a *fundamentally different strategy* to communicate its importance level.

### Transitions Must Feel Alive

Every state change must be animated. Instant snapping between states feels broken.

| Timing need | Class/token | Duration | When to use |
|---|---|---|---|
| Hover/active micro-moments | `--duration-interaction` | 100ms | Pressing a button, toggling a switch |
| State change (bg, border, shadow) | `.transition-default` | 200ms ease-out | Most hover/focus transitions |
| Component entry (modals, dropdowns) | `.transition-enter` | 300ms ease-out | Mount animations |

**Critical rule: hover states should change at least two properties.** In light/dark mode: Background AND border, or color AND opacity — not shadow (static elements have no shadow). A single-property change feels flat and lifeless.

### How Each State Should Feel

| State | Visual treatment | Required properties |
|---|---|---|
| **Default** | Resting appearance. Flat (no shadow) in light/dark. | — |
| **Hover** | Background shifts one step deeper + border tint change (light/dark). | `cursor-pointer`, two-property change |
| **Focus-visible** | Focus ring appears. No other change beyond the ring. | `focus-visible:outline-none focus-visible:focus-ring` |
| **Active/Pressed** | Background darkens beyond hover. | — |
| **Disabled** | Muted background + text. No shadow. No hover/active response. | `cursor-not-allowed`, `pointer-events-none`, `aria-disabled` |
| **Loading** | Spinner replaces content. Same dimensions — no layout shift. | `aria-busy="true"`, same `width`/`height` |
| **Error** | Border or background shifts to error color. Use `--component-border-error` or `--component-bg-error` token — never hardcode a color. Error text uses `--component-text-error` aliasing `--color-text-error`. | `aria-invalid="true"`, `aria-describedby` pointing to the error message element |

### Dark Mode Color Rules — Enforced on Every Component

Before assigning any color token in a dark mode override block, apply this table:

| Category | Light mode | Dark mode | Rule |
|---|---|---|---|
| Action primary bg | brand-500 | brand-400 | Lighter shade reads on dark surfaces |
| Text on filled bg | neutral-0 (white) | neutral-950 (near-black) | brand-400 is a light color — dark text required for contrast |
| Selected state bg | brand-50 (pale tint) | brand-950 (dark tint) | Muted dark container, never opaque brand fill |
| Hover overlay | neutral-50 | neutral-800 | One subtle step from surface |
| Pressed overlay | neutral-100 | neutral-700 | Deeper than hover |
| Status subtle bg | color-50 | color-900 | Pale tints are near-white on dark bg — broken |
| Shadow opacity | 6–14% | 40–70% | Dark surfaces absorb light, low-opacity shadows vanish |
| Data series colors | -500 shade | -400 shade | One step lighter for dark bg visibility |

**Contrast check rule:** If the background token resolves to a shade 700–950,
text must be neutral-0 to neutral-100. If background resolves to a shade 50–400
(a light color used as bg), text must be neutral-900 to neutral-950.
Never place light text on a light background or dark text on a dark background.

### Loading States Preserve Dimensions

A loading button stays the same size and shape — only the text is replaced by a spinner. The spinner inherits `currentColor` and uses the matching icon size token for the component's size. The component must not jump, resize, or reflow during loading.

---

## Workflow — 3 Phases

```
Phase 1 — Plan     → Decompose, classify, present tree, wait for approval
Phase 2 — Build    → Write tokens + component files together (co-developed)
Phase 3 — Verify   → Run checklist, fix failures before presenting output
```

Phase 1 has one approval gate (the dependency tree). After that, building is continuous — no more pauses. Tokens and code are co-developed, not written in rigid sequential order. If you realize mid-implementation that a new token is needed, go add it immediately and continue.

---

## Phase 1 — Atomic Decomposition

Every component request — no matter how simple — goes through decomposition first.

### Protocol

1. Identify the requested component's atomic level (atom / molecule / organism / template)
2. Recursively break it into every sub-component it needs
3. **Run the Semantic HTML Selection** (see below) — mandatory before classifying
4. **Run the Interactive Control Scan** (see below) — mandatory before classifying
5. Classify each sub-component by level
6. Check `components/` — note which already exist (reuse) vs. need to be generated
7. Flatten the tree into bottom-up generation order: atoms first, then molecules, then organisms
8. Present the full tree (including HTML element choices) and generation passes to the user. **Wait for approval.**

Do not write any code or touch any files until the user confirms.

### Semantic HTML Selection — Mandatory Step 3

Before classifying any component, determine the correct HTML element for each piece in the decomposition.

1. Open `.claude/references/semantic-html-guide.md`
2. For each component identified, look up its purpose in the **Element Decision Table** (Section A)
3. Record the correct HTML element in the decomposition tree
4. If the component contains both links AND buttons, apply the **Link vs Button Rule** (Section B)
5. If the component renders headings, determine the heading level using **Section C**
6. If the component is a form control, verify patterns against **Section D**
7. If the component is tabular data, verify structure against **Section E**
8. Check **Section G** — never add a redundant `role` that matches the native element's implicit role

Include the element choices in the dependency tree presented to the user. Example:

```
Sidebar (L3 Organism) → <aside> + <nav>
├── NavItem (L1 Atom) → <li> containing <a> or <button>
├── Divider (L1 Atom) → <hr>
└── Avatar (L1 Atom) → <span>
```

### Interactive Control Scan — Mandatory Step 4

Before classifying any component, scan the design for every styled interactive HTML control.
Each one that has custom visual styling, hover/focus states, or reuse potential **must** be
factored out as its own L1 Atom — never inlined into a parent.

| If you see in the design... | Required atom | Why it can't be inlined |
|---|---|---|
| A styled dropdown / `<select>` | **Select** (L1 Atom) | Has its own states, tokens, chevron icon, focus ring |
| A styled text field / `<input>` | **Input** (L1 Atom) | Has its own variants, sizes, validation states |
| A styled checkbox | **Checkbox** (L1 Atom) | Has checked, indeterminate, disabled states |
| A styled radio button | **Radio** (L1 Atom) | Grouped state logic belongs at atom level |
| A styled toggle / switch | **Switch** (L1 Atom) | on/off animation + accessible role |
| A styled range slider | **Slider** (L1 Atom) | Track, thumb, and fill are token-driven |
| A standalone CTA / icon button | **Button** (L1 Atom) | Already exists — import it, don't re-implement |
| A styled textarea | **Textarea** (L1 Atom) | Resize behavior + validation states |

**Decision rule:** If you are giving a native HTML element custom visual styling (border, background, radius, hover, focus ring), it is an atom waiting to be born. The parent that uses it becomes a molecule or higher.

**The BarChart case study — how the violation happened:** BarChart contained a styled `<select>` with a custom chevron, border, hover background, and focus ring. That is a full Select atom. Because it was inlined, BarChart was mis-classified as L1 Atom. The correct tree is:
```
BarChart (Molecule — L2)
└── Select (Atom — L1)   ← must exist and be approved before BarChart is written
```

### Level Rules

See CLAUDE.md "Component Architecture — 5-Level Hierarchy" for the full level rules. Key reminders:
- Atoms import nothing from `components/`. Tokens + Tailwind only.
- Same-level imports are invalid. Circular dependencies are invalid.
- Compound organism slot components are internal consts, not separate 5-file folders.

### Example — Sidebar Decomposition

```
Sidebar (Organism — L3)
│
├── NavItem (Atom — L1)          ← self-contained, no sub-components
│   └── [optional Badge slot]    ← passed as ReactNode prop, not imported
│
└── Divider (Atom — L1)

Internal slot components (not standalone — defined inside Sidebar.tsx):
  Sidebar.Header   — sticky top, app/workspace selector
  Sidebar.Content  — scrollable nav region, owns <nav>
  Sidebar.Group    — labeled section within Content
  Sidebar.Footer   — sticky bottom, user profile
```

**Flattened generation order:**
- Pass 1 (Atoms): NavItem, Divider
- Pass 2 (Organism): Sidebar — with Header/Content/Group/Footer defined
  internally as compound slots, not as separate molecule folders

---

## Phase 2 — Build (Tokens + Code, Co-Developed)

For each component in bottom-up order, build the tokens and code together.

### Token Chain

Follow the token chain rule in CLAUDE.md. Key reminders:
- Every component token must alias a semantic — never a primitive, never hardcoded
- Before writing a component token that references a semantic — **verify it exists** in `geeklego.css`. A token that references an undefined variable resolves to `unset` and is silent at runtime.
- If a semantic is missing, create it first (aliasing a primitive), then create the component token from it
- Never auto-create primitives — STOP and ask the user

**Cross-file validation — mandatory before writing TSX:** After writing tokens to `geeklego.css`, verify every `var(--component-*)` reference you plan to use in the TSX actually exists in the token block you just wrote. The runtime is silent on undefined tokens — a missing name produces an invisible element with no error. Run:

```bash
npm run validate-tokens   # confirms all var() references in geeklego.css resolve
npx tsc --noEmit         # confirms no type errors in TSX
```

Both must exit 0 before you proceed to Phase 3.

**Type↔CSS contract:** If you add a new semantic group structure (e.g. a nested object in `types.ts`), `tokenValidator.ts` and `cssGenerator.ts` must be updated in the same session. The two sources diverging is what caused 75 TypeScript errors and token editor crashes in past regressions — the fix was always more expensive than the original alignment would have been.

### Content flexibility tokens are mandatory

After writing colour/spacing/sizing tokens, add content flexibility tokens for each text slot:
- Single-line slots: `--{component}-{slot}-overflow: var(--content-overflow-label)`, `--{component}-{slot}-whitespace: var(--content-whitespace-label)`, `--{component}-{slot}-text-overflow: var(--content-text-overflow-label)`
- Multi-line slots: `--{component}-{slot}-lines: var(--content-lines-description)` or `var(--content-lines-body)`
- Container slots: `--{component}-{slot}-max-width: var(--content-max-width-label)`, `--{component}-{slot}-min-width: var(--content-min-width-label)`

### Responsive layout protection is mandatory for card-shell components

Any L2/L3 component with a header + body pattern (cards, charts, panels, modals): Add a `--{component}-min-width: var(--content-min-width-md)` token and apply `.card-shell` on the outermost container. Use `.card-header-row` for the header row (title + action), `.card-header-title` for the title area, and `.card-metric-row` for metric + delta rows.

### Semantic naming test — before creating a new semantic

Ask: *"Could three different components plausibly use this token for the same design concept?"*

- **YES** → it belongs in `:root` as a semantic. Name it by **concept**, not by the component that needs it first.
  - `--color-data-series-1` (any data visualisation component can use it)
  - `--color-action-destructive` (any component with a destructive action needs this)
  - NOT `--color-chart-series-1` or `--color-button-destructive` (component name in a semantic is always wrong)

- **NO** → it belongs only in the component token block, aliasing the closest existing semantic.

### Token naming conventions

| Pattern | Example |
|---|---|
| `--[component]-[property]` | `--button-bg` |
| `--[component]-[property]-[state]` | `--button-bg-hover` |
| `--[component]-[variant]-[property]` | `--button-ghost-bg` |
| `--[component]-[variant]-[property]-[state]` | `--button-ghost-bg-hover` |
| `--[component]-[property]-[size]` | `--button-height-md` |
| `--[component]-[part]-[property]` | `--card-header-bg` |

### Writing tokens into geeklego.css

Open `design-system/geeklego.css` and append a new token block to the **GENERATED COMPONENT TOKENS** section (after the last existing block). Search for `/* GENERATED COMPONENT TOKENS */`. If that comment doesn't exist, create it at the very end, then append beneath it.

**CRITICAL:** Use the multi-selector pattern so tokens re-resolve in each theme context:

```css
/* [ComponentName] — generated [YYYY-MM-DD] */
:root,
[data-theme="dark"] {
  --component-token-1: var(--some-semantic);
  --component-token-2: var(--some-semantic-hover);
}
```

**Dark mode override blocks on component tokens:**
Only create a component-level `[data-theme="dark"]` override block when a
component token needs a value that CANNOT be achieved by the semantic token
alone re-resolving in dark context. Before writing a component dark override,
ask: does the semantic already flip correctly in [data-theme="dark"]? If yes,
no component override is needed. If the component token needs a structurally
different value in dark mode, add a focused override block for only those tokens.

When writing any dark component token override, every value must comply with the
Dark Mode Color Rules table in the Design Quality section above.

**Rules:**
- One token block per component. Check for duplicates first — if the block exists, STOP and ask: update, replace, or skip? **When regenerating, delete the old block in the same commit.** CSS source-order cascade silently picks the last duplicate — two blocks for the same component is a guaranteed silent regression waiting to happen.
- Every token aliases a semantic — never a primitive, never a hardcoded value
- Include tokens for all variants, sizes, states, and sub-parts
- **Never create typography tokens** at the component level — typography is handled by utility classes (`.text-button-md`, `.text-body-sm`, etc.)
- **Skip token blocks for passthrough atoms** where every token would be a 1:1 alias of a semantic — use semantics directly in TSX instead
- If you discover mid-coding that a token is missing, go add it now and continue

### When a component token needs different semantics per theme

Default: use the multi-selector — the component token aliases one semantic, and the semantic's own per-theme overrides cascade automatically. Most tokens work this way.

Exception: when the component needs a *different semantic* per theme (e.g., `--shadow-md` in light but `--shadow-lg` in dark), split into separate selector blocks:

```css
:root { --card-shadow: var(--shadow-md); }
[data-theme="dark"] { --card-shadow: var(--shadow-lg); }
```

Only split when you can articulate why the same semantic reference produces wrong results in a specific theme.

### Progressive Enhancement Check

Before writing the component TSX, verify that all CSS features used in the token block are safe per `.claude/references/cross-browser-compat.md`. Components **NEVER** contain `@supports`, `@media`, or `@container` blocks — all feature detection lives in `geeklego.css`. If you need a new progressively-enhanced CSS feature, add it to `cssGenerator.ts` first.

---

### The 5 Files — Structural Templates

Every component gets exactly 5 files in `components/[level]/[ComponentName]/`. See CLAUDE.md "Component File Structure" for the full specification. Below are the key structural patterns.

#### File 1: `[ComponentName].tsx`

```tsx
import { forwardRef, memo, useMemo } from 'react';
import type { ComponentProps, ComponentVariant, ComponentSize } from './Component.types';

// Variant classes — each variant uses a DIFFERENT visual strategy
const variantClasses: Record<ComponentVariant, string> = {
  primary: [
    'bg-[var(--component-primary-bg)] text-[var(--component-primary-text)] border border-transparent',
    'hover:bg-[var(--component-primary-bg-hover)] active:bg-[var(--component-primary-bg-active)]',
    'shadow-[var(--component-primary-shadow)] hover:shadow-[var(--component-primary-shadow-hover)]',
  ].join(' '),
  ghost: [
    'bg-transparent text-[var(--component-ghost-text)] border border-transparent',
    'hover:bg-[var(--component-ghost-bg-hover)] active:bg-[var(--component-ghost-bg-active)]',
  ].join(' '),
};

// Size classes — always pair base dimensions with typography
const sizeClasses: Record<ComponentSize, { base: string; text: string }> = {
  sm: { base: 'h-[var(--component-height-sm)] px-[var(--component-px-sm)]', text: 'text-button-sm' },
  md: { base: 'h-[var(--component-height-md)] px-[var(--component-px-md)]', text: 'text-button-md' },
  lg: { base: 'h-[var(--component-height-lg)] px-[var(--component-px-lg)]', text: 'text-button-lg' },
};

export const Component = memo(forwardRef<HTMLButtonElement, ComponentProps>(
  ({ variant = 'primary', size = 'md', disabled, className, children, ...rest }, ref) => {
    const classes = useMemo(() => [
      'inline-flex items-center justify-center gap-[var(--component-gap)]',
      'rounded-[var(--component-radius)]',
      sizeClasses[size].text,
      'transition-default',
      'focus-visible:outline-none focus-visible:focus-ring',
      disabled
        ? 'bg-[var(--component-bg-disabled)] text-[var(--component-text-disabled)] border-transparent cursor-not-allowed shadow-none pointer-events-none'
        : variantClasses[variant],
      sizeClasses[size].base,
      className,
    ].filter(Boolean).join(' '), [disabled, variant, size, className]);

    return (
      <button ref={ref} disabled={disabled} aria-disabled={disabled || undefined} className={classes} {...rest}>
        {children}
      </button>
    );
  },
));
Component.displayName = 'Component';
```

**Key patterns** (full rules in CLAUDE.md):
- `memo(forwardRef())` — memo outer, forwardRef inner
- Token-based Tailwind only: `bg-[var(--token)]` — `var()` wrapper required in Tailwind v4.2
- Variant/size maps as plain `Record<Variant, string>` — no clsx, no cva
- Array join pattern: `[a, b, c].filter(Boolean).join(' ')`
- `transition-default` on all elements that change visual state
- `focus-visible:outline-none focus-visible:focus-ring` on all focusable elements
- Content flexibility: `.truncate-label` for single-line, `.clamp-description` for multi-line, `.content-nowrap` for buttons/chips, `.content-flex` for flex children

#### File 2: `[ComponentName].types.ts`

```tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ComponentSize = 'sm' | 'md' | 'lg';

export interface ComponentProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Defaults to 'primary'. */
  variant?: ComponentVariant;
  /** Height and typography size. Defaults to 'md'. */
  size?: ComponentSize;
  children: ReactNode;
}
```

- Extends native HTML element props
- JSDoc comment on every prop
- Export the prop interface AND the union types

#### File 3: `[ComponentName].stories.tsx`

All **7 stories** are non-negotiable:

| Story | What it shows |
|---|---|
| `Default` | Single most-common usage with args |
| `Variants` | All visual variants side by side |
| `Sizes` | All size variants side by side |
| `States` | default, hover (via CSS), focus-visible, active, disabled, loading, error |
| `DarkMode` | Wrapped in `data-theme="dark"` with `bg-primary` container and `max-w-2xl` |
| `Playground` | All args exposed as controls |
| `Accessibility` | Tagged `['a11y']`; renders with explicit aria-label, aria-expanded, aria-busy, aria-disabled |

Story title format: `'Atoms/Button'`, `'Molecules/Card'` (matches level hierarchy).

**Compound organism stories** — compose all slot children in the Default story to show realistic usage.

#### File 4: `README.md`

All sections required: Description, Props table, Tokens Used, Variants, Sizes, States, Accessibility (semantic element, role, ARIA attributes, keyboard interaction, screen reader announcement), Usage. See CLAUDE.md for the full template.

#### File 5: `mock-data.json`

Must cover: `default`, `variants` (array), `sizes` (array), `states` (object: loading, disabled, error), `edge_cases` (empty string, very long string, icon-only, etc.)

---

## Common Token Mistakes — What Not to Do

These five patterns caused the most regressions in the design system's history. They are silent at build time and only reveal themselves visually — which is why they survived undetected for months.

**❌ 1 — Hardcoding a Tier 1 primitive in a component token**
```css
/* Wrong — neutral-950 is a primitive, not a semantic */
--badge-text-disabled: var(--color-neutral-950);

/* Right — route through the semantic that captures the intent */
--badge-text-disabled: var(--color-text-on-status-solid);
```
If the needed semantic doesn't exist, create it in `:root` first. Hardcoding the primitive means this token becomes a maintenance liability: one palette change breaks every component that used the shortcut.

**❌ 2 — Naming the token with property before component**
```css
/* Wrong — violates --{component}-{property} ordering */
--size-avatar-md: 2rem;
--icon-color-button: var(--color-text-primary);

/* Right — component name always leads */
--avatar-size-md: 2rem;
--button-icon-color: var(--color-text-primary);
```
The validator (`npm run validate-tokens`) enforces this pattern on component blocks and exits with code 1 on violations. Fixing after the fact requires hunting down every consumer.

**❌ 3 — Borrowing a global motion token as a per-element delay**
```css
/* Wrong — steals the interaction-level duration as an animation stagger */
--typing-dot-delay-2: var(--duration-interaction);
--typing-dot-delay-3: var(--duration-transition);

/* Right — use dedicated stagger semantics */
--typing-dot-delay-2: var(--duration-stagger-sm);
--typing-dot-delay-3: var(--duration-stagger-md);
```
Global durations are tuned for their interaction category. Reusing them for unrelated timing couples two unrelated design decisions — tune one, break the other.

**❌ 4 — Leaving duplicate token blocks after regeneration**
```css
/* Wrong — both blocks exist; cascade picks the second silently */
/* Button — generated 2026-01-15 */
:root { --button-bg-primary: var(--color-action-primary); }   /* old value */

/* Button — generated 2026-04-27 */
:root { --button-bg-primary: var(--color-brand-600); }        /* new value */
```
When you regenerate tokens, delete the old block in the same edit. Two blocks pass the validator and compile cleanly — the bug only shows up in the browser.

**❌ 5 — Inverting a semantic in dark mode instead of correcting it**
```css
/* Wrong — surface-overlay becomes opaque solid white in dark mode (inverted!) */
[data-theme="dark"] { --color-surface-overlay: var(--color-neutral-0); }

/* Right — an overlay is a transparent scrim in both modes */
[data-theme="dark"] { --color-surface-overlay: var(--color-overlay-backdrop); }
```
Dark mode overrides should adjust opacity or shade, never invert the semantic's role. When in doubt, check: does the dark value still describe the same concept the token name promises?

---

## Phase 3 — Verification Checklist

Run after all components in the tree are generated. Fix any failure before presenting.

### Token integrity
- [ ] Every component token references a semantic, never a primitive
- [ ] No duplicate token blocks in geeklego.css — if regenerated, old block deleted in the same edit
- [ ] No hardcoded values anywhere in CSS or TSX
- [ ] Every `var(--component-*)` used in the TSX exists in the component's token block in `geeklego.css` (missing tokens silently resolve to `unset`)
- [ ] Token naming follows `--{component}-{property}-{state}` ordering — `--button-bg-hover`, not `--bg-button-hover`
- [ ] `npm run validate-tokens` exits code 0 — confirms no broken references and no naming violations
- [ ] `npm run lint-css` exits code 0 — Stylelint confirms geeklego.css has no CSS violations
- [ ] `npx tsc --noEmit` exits code 0 — confirms no type errors introduced by the new component

### Theme completeness
- [ ] Every semantic token referenced by component tokens has overrides in `[data-theme="dark"]` — check geeklego.css directly
- [ ] Shadow tokens resolve to visible shadows in dark mode (not invisible against dark backgrounds)
- [ ] Dark mode action primary uses a lighter shade than light mode (brand-400 not brand-500/600)
- [ ] Dark mode text on any filled colored bg uses correct contrast pair:
      light bg (shade 50–400) → dark text (neutral-900/950);
      dark bg (shade 700–950) → light text (neutral-0/50)
- [ ] Dark mode selected state bg uses --color-state-selected (brand-950), NOT --color-action-primary
- [ ] Dark mode status subtle tokens use -900 tints, not -50 tints

### File integrity
- [ ] Exactly 5 files per component — no more, no fewer
- [ ] No inline `style` prop used for visual styling
- [ ] No arbitrary Tailwind values (`bg-[#xxx]`, `h-[40px]`) — only `bg-[var(--token)]` syntax (must include `var()`)
- [ ] No clsx, cva, cn(), or class-merging utilities imported
- [ ] All icon imports use lucide-react only

### Import integrity
- [ ] Atoms import nothing from `components/`
- [ ] Molecules import only atoms
- [ ] Organisms import molecules and/or atoms
- [ ] No same-level imports, no circular dependencies
- [ ] All imports are relative paths

### Storybook completeness
- [ ] All 7 required stories present (Default, Variants, Sizes, States, DarkMode, Playground, Accessibility)
- [ ] DarkMode uses `data-theme` wrapper with `max-w-2xl`
- [ ] Playground has all props as controls
- [ ] Accessibility story tagged `['a11y']`

### Design quality
- [ ] Variants are visually distinct — different *types* of treatment, not just color shifts
- [ ] Hover changes at least two properties
- [ ] Disabled state: muted, no shadow, no hover/active, `cursor-not-allowed`
- [ ] Loading state preserves component dimensions (no layout shift)
- [ ] Focus ring present on every focusable element
- [ ] `transition-default` on every element that changes visual state

### Responsive layout protection
- [ ] Card-shell components use `.card-shell`, `.card-header-row`, `.card-header-title`, `.card-metric-row`
- [ ] Title text uses `.truncate-label`
- [ ] DarkMode story includes `max-w-2xl`
- [ ] Component has `--{component}-min-width` token (for card-shell components)

### Accessibility — WCAG 2.2 AA

Read `references/aria-patterns.md` for the full ARIA reference tables. Key checks:

**Semantic structure**
- [ ] Semantic HTML used throughout (see `.claude/references/semantic-html-guide.md`)
- [ ] No `<div>` where a semantic element exists
- [ ] No `onClick` on `<div>` or `<span>`
- [ ] No redundant `role` overriding native element semantics

**Accessible names**
- [ ] Every interactive element has an accessible name
- [ ] Icon-only buttons have `aria-label`
- [ ] Every `<nav>` landmark has `aria-label`
- [ ] Decorative icons have `aria-hidden="true"` on wrapper

**Interactive states**
- [ ] Toggle controls have `aria-expanded` — use `getDisclosureProps()`
- [ ] Controls with panels have `aria-controls` + matching `id` — use `useId()`
- [ ] Disabled: both `disabled` attribute AND `aria-disabled={true}`
- [ ] Loading: `aria-busy={true}` with visible spinner

**Focus and keyboard**
- [ ] Every focusable element has `focus-visible:outline-none focus-visible:focus-ring`
- [ ] Inputs use `focus-visible:focus-ring-inset`
- [ ] Arrow-navigated groups use `useRovingTabindex`
- [ ] Overlays use `useFocusTrap` and `useEscapeDismiss`
- [ ] No positive `tabIndex` values

**Touch targets**
- [ ] All interactive elements minimum 24x24px CSS

### Schema.org (when applicable)
- [ ] Component checked against mapping table in `references/schema-org.md`
- [ ] `schema?: boolean` prop added if applicable
- [ ] Microdata attributes only render when `schema={true}`

### Performance
- [ ] `memo(forwardRef(...))` wrapping — memo outer
- [ ] `displayName` set
- [ ] `useMemo` for computed className strings
- [ ] Static class strings hoisted to module scope
- [ ] `useCallback` for internal event handlers
- [ ] No index-based keys in `.map()`
- [ ] `.perf-contain-content` on repeated list items
- [ ] `.perf-content-auto` for off-screen collapsible panels

### Cross-browser
- [ ] No `color-mix()`, vendor prefixes, `@supports`, or `@property` in component code
- [ ] All values via `var(--token-name)` — no raw hex, px, or rem

### Security

**Read `.claude/skills/security/SKILL.md` for full implementation patterns.**

- [ ] Every component that renders `<a href={...}>` imports `sanitizeHref` from `'../../utils/security/sanitize'`
- [ ] Every `href` value is passed through `sanitizeHref()` — never rendered verbatim; wrapped in `useMemo`
- [ ] Components with `external` prop or `target` prop use `getSafeExternalLinkProps()` instead
- [ ] `target`/`rel` are destructured from `...rest` before anchor props are constructed (for polymorphic `<a>` components)
- [ ] No `dangerouslySetInnerHTML` anywhere (covered by CLAUDE.md rule — confirm)
- [ ] New component row added to `.claude/skills/security/references/component-security-audit.md`

### i18n — Internationalisation

**Check `.claude/skills/i18n/references/string-inventory.md` before marking this section complete.**

- [ ] Component has no hardcoded system strings in JSX (strings a user reads or a screen reader announces that aren't consumer-supplied `children`/`label`/`title` props)
- [ ] If the component has system strings: `i18nStrings?` prop added to `.types.ts` with a typed per-component interface (e.g. `SpinnerI18nStrings`)
- [ ] If the component has system strings: `useComponentI18n('key', i18nStrings)` called as first line inside the component function — import via `import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n'` (NOT from the barrel export)
- [ ] If the component has system strings: `GeeklegoI18nProvider.types.ts`, `DEFAULT_STRINGS`, `index.ts`, and `string-inventory.md` are updated
- [ ] Existing content props (`label`, `placeholder`, `deltaLabel`) are never replaced — use augment pattern: `const resolved = propValue ?? i18n.default`
- [ ] Template label functions typed as `(arg: T) => string`, not inline concatenation

### RTL — Logical Properties

- [ ] No `pl-*` / `pr-*` for directional padding — use `ps-*` / `pe-*`
- [ ] No `ml-*` / `mr-*` for directional margin — use `ms-*` / `me-*`
- [ ] No `left-[var(--token)]` / `right-[var(--token)]` for icon/content inset — use `start-[var(--token)]` / `end-[var(--token)]`
- [ ] Symmetric padding (`px-*`), block axis (`py-*`, `pt-*`, `pb-*`, `mt-*`, `mb-*`), and overlay anchors (`left-0 top-full`) are exempt
- [ ] No `direction:` or `writing-mode:` set in component TSX — `dir` is read from `<html>`

### Reuse Audit

After the verification checklist passes, scan all existing components at the same level or above as the newly generated component.

For each existing component file, check whether it inlines markup, styling, or logic that the new component now owns — e.g. hand-rolled spinners, raw badge-like spans, custom dividers, inline avatar markup.

If violations are found:
1. Print a terminal summary in this format:
   ```
   ⚠ Reuse audit — N refactor candidates found:
     → [Filename]   [what is inlined] → replace with <[NewComponent]>
   ↳ Logged to REFACTOR.md
   ```

2. Append a new block to `REFACTOR.md` in the project root (create the file if it does not exist) in this format:
   ```
   ## [NewComponent] — [Month Year]
   - [ ] `[Filename]` — [what is inlined], replace with <[NewComponent]>
   ```

Each generation session appends a new dated block. Never overwrite existing entries.

If no violations are found, print:
```
✓ Reuse audit — no refactor candidates found
```
And do not touch REFACTOR.md.

---

## Icons — lucide-react Only

All icons must come from `lucide-react`. Size and color always via tokens:

```tsx
import { ChevronDown, Search, X, Plus } from 'lucide-react';

// Size via token — use --icon-size-* (Tier 1 primitive) or --icon-semantic-* (Tier 2 alias)
<Search size="var(--icon-size-md)" />

// Color via parent or prop
<span className="text-[var(--color-text-secondary)]"><Search /></span>

// Icon slots: pass as React nodes, not strings
<Button leftIcon={<Plus size="var(--icon-size-sm)" />}>Add item</Button>
```

---

## Industry-Standard Variants

Use these as the baseline for all components. For unlisted components, research industry-standard patterns before designing.

| Component | Variants | Sizes |
|---|---|---|
| Button | primary, secondary, outline, ghost, destructive, link | xs, sm, md, lg, xl |
| Input | default, filled, flushed, unstyled | sm, md, lg |
| Badge | solid, soft, outline, dot | sm, md (heights: 16px, 24px) |
| Card | elevated, outlined, filled, ghost | — |
| Avatar | image, initials, icon, fallback | xs, sm, md, lg, xl, 2xl — shapes: circle, rounded |
| Modal | — | sm, md, lg, xl, full |
| Alert/Banner | info, success, warning, error | styles: solid, subtle, outline, left-accent |
| Checkbox | default, indeterminate | sm, md, lg |
| Switch | default | sm, md, lg |
| Spinner | default, inverse | xs, sm, md, lg, xl |
| Divider | horizontal, vertical | styles: solid, dashed, dotted |
| Chip | solid, outline, ghost | sm, md |
| Tag | default, dismissible | sm, md |
| FormField | default, inline | — |
| Navbar | default | — |

**All components must handle these states:** default, hover, focus-visible, active, disabled, loading, error (where applicable).

---

## Effects Tokens — Mandatory Usage

| Need | What to use | Never use |
|---|---|---|
| Resting shadow — light/dark mode | `none` — static elements do not float | Raw `box-shadow:` |
| Elevated surface (card, popover) | `var(--shadow-lg)` or `var(--shadow-xl)` | — |
| All state transitions | `.transition-default` class | Raw `transition: property` |
| Element entry animations | `.transition-enter` class | `transition-duration:` in component |
| Focus indicator | `focus-visible:focus-ring` | `outline:` directly |
| Input focus ring | `focus-visible:focus-ring-inset` | `box-shadow:` directly |
| Loading placeholder | `.skeleton` class | Custom shimmer |

---

## Error Handling

| Situation | Action |
|---|---|
| Missing dependency component | Generate it first with the full 5-file treatment before the current component |
| Missing semantic token for an intent | Create the semantic `:root` entry aliasing the correct primitive, then create the component token from it |
| Missing primitive | **STOP** — ask the user. Never auto-create primitives. |
| Component already exists in `components/` | **STOP** — ask: "Update it, replace it, or skip and reuse it?" |
| Circular dependency detected | **STOP** — show the cycle, propose restructuring |
| Dark mode token gap | Verify semantic has a `[data-theme="dark"]` override AND that the dark value follows the Dark Mode Color Rules table in Design Quality above. If not, fix geeklego.css first before writing the component token. If a component dark override produces light-text-on-light-bg or dark-text-on-dark-bg — STOP. Fix the semantic, never patch contrast failures by hardcoding a color. |

---

## What This Skill Must Never Do

Rules 1-16 are covered by CLAUDE.md's "What Claude Code Should Never Do" list. The following are **skill-specific** rules that go beyond the project-level constraints:

17. **Never create a standalone 5-file molecule folder for a non-reusable slot component.** If a sub-component (e.g. `SidebarHeader`, `DialogFooter`, `CardHeader`) is only ever used inside one parent organism, define it as an internal named const and attach as a static property.
18. **Never classify a self-contained interactive unit as a molecule just because it appears in a list.** `NavItem`, `TabItem`, `BreadcrumbItem`, `MenuOption` — no component dependencies means they are atoms. Level is determined by import dependencies, not visual complexity.
19. **Never inline a styled interactive HTML control inside a parent component.** A `<select>`, `<input>`, `<textarea>`, styled checkbox/radio — if it has custom styling, it is a full L1 Atom with 5 files. The Interactive Control Scan exists to catch this.