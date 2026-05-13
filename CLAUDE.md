# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Geeklego — Project Details & Claude Code Instructions

> Single source of truth for project context. All agents and skills read this before starting any task.

---

## What is Geeklego?

Geeklego is an open-source, design-system-first React component library built on Tailwind CSS v4.

It ships three things:

1. **A design system** — `design-system/geeklego.css` — a Tailwind v4 `@theme` file that is the single source of truth for all visual values
2. **A component library** — `components/` — pre-built React components that use only Tailwind classes generated from those tokens
3. **An AI generation skill** — `.claude/skills/component-builder/SKILL.md` + `.claude/agents/` — so Claude Code can generate new components that follow the exact same rules

It also includes a **token editor app** (`app/`) that runs locally via `npm run dev` to edit colors, typography, spacing, and export `geeklego.css`.

Geeklego is **not** a Shadcn converter. It is a competitor. It does not reference Shadcn. It does not use `cn()`, `cva`, or Tailwind arbitrary values. It has its own design system architecture, its own component patterns, its own identity.

**Design-system-first means:** the design system is defined completely before a single component is written. Components are an expression of the design system — not the other way around. You never style a component directly. You define the system, and the component inherits from it.

---

## Project Structure

```
geeklego/
├── CLAUDE.md                            ← this file
├── skills-lock.json                     ← version lock for externally sourced skills (see .agents/)
├── design-system/
│   ├── geeklego.css                     ← single source of truth for all tokens
│   └── geeklego.default.css             ← default/backup copy
├── components/
│   ├── atoms/                           ← L1 (no component imports)
│   ├── molecules/                       ← L2 (imports L1 only)
│   ├── organisms/                       ← L3 (imports L2 + L1)
│   ├── templates/                       ← L4 (imports L3 and below)
│   └── utils/                           ← keyboard hooks, ARIA helpers, StructuredData
├── app/                                 ← token editor (runs via npm run dev)
├── stories/                             ← root-level Storybook stories
├── .storybook/                          ← Storybook config
├── .agents/skills/                      ← externally sourced agent skills (managed via skills-lock.json)
│   └── web-accessibility/               ← WCAG 2.1 a11y skill (sourced from supercent-io/skills-template)
└── .claude/                             ← project-local agents, skills, references
```

---

## Development Commands

```bash
npm run dev              # Token editor app (http://localhost:5173)
npm run storybook        # Storybook (http://localhost:6006)
npm run build            # Build token editor
npm run build-storybook  # Build Storybook static site
npx vitest               # Run tests (Storybook stories via Vitest + Playwright browser)
npx vitest components/atoms/Button/Button.stories.tsx  # Single test
npx tsc --noEmit         # Type-check (covers app/ only — components checked by Storybook/Vite)
npm run validate-tokens  # Check for broken var() references in geeklego.css
```

No lint script configured. One `package.json`, one `npm run dev`. Node >= 20.0.0 required.

---

## Test Infrastructure

Stories ARE the tests. There are no separate unit test files.

- Each `.stories.tsx` file becomes a test via `@storybook/addon-vitest`
- Vitest runs stories headless in Chromium via Playwright browser mode
- Setup file: `.storybook/vitest.setup.ts` applies Storybook annotations
- A11y addon is configured in `test: "todo"` mode — reports violations in test UI but does not fail CI
- Custom Storybook viewport presets: mobile (375x812), tablet (768x1024), desktop (1280x800), wide (1536x900)

**TypeScript note:** `npx tsc --noEmit` only covers `app/` (tsconfig.json includes only that directory). Components are type-checked by Storybook/Vite during `npm run storybook` — this is intentional, not a bug.

---

## Token Editor App (`app/`)

The token editor is a full React + Vite app for editing the design system visually. It has 6 tabs: Primitives, Semantics, Components, Typography, Export, and Responsive.

Key internals:
- **Custom Vite plugin** (`tokenSavePlugin()` in `vite.config.ts`) — provides API endpoints (`/api/load-tokens`, `/api/save-tokens`, `/api/component-tokens`, etc.) that parse `geeklego.css` into a JS token object and write it back
- **Live reload** — watches `geeklego.css` for changes and pushes updates to the browser via WebSocket
- **Backup** — automatically maintains `geeklego.default.css` as a backup copy
- **Validation** — detects broken `var()` references on save
- **History** — undo/redo (max 50 entries) stored in localStorage under `geeklego-tokens`
- **CSS generation** — `app/src/utils/cssGenerator.ts` converts token objects to CSS with cross-browser `color-mix()` fallbacks (hex-to-rgba for older browsers)

---

## The Design System File

**Location:** `design-system/geeklego.css` — the most important file in the project.

It has 5 blocks in order:

1. **`@theme` Primitives** — raw values (`--color-brand-500`, `--spacing-4`, etc.). Tailwind auto-generates utility classes from these. Never referenced directly by components.
2. **`:root` Semantic Tokens** — purpose-driven aliases referencing primitives (`--color-action-primary: var(--color-brand-500)`). These respond to theme switching.
3. **Theme Overrides** — `[data-theme="dark"]` blocks that override semantic tokens.
4. **Typography Utility Classes** — composite text styles (`.text-heading-h1`, `.text-body-md`, `.text-button-sm`).
5. **Semantic Utility Classes + Generated Component Tokens** — shortcuts (`.bg-primary`) and AI-generated component token blocks appended at the end.

Read the file directly for exact token names and values.

---

## Design System Architecture — 2-Tier + AI-Generated Component Tokens

```
Tier 1 — Primitives   → raw values (@theme block)
Tier 2 — Semantics    → purpose aliases (:root block)
                                ↓
               Component tokens are generated by the AI skill
               when a component is first created.
```

### The Token Chain Rule

Never skip a level: **primitive → semantic → component**. A component token must always alias a semantic. If no semantic exists for the intent, create one first (aliasing a primitive), then create the component token from it. Never reference a primitive directly from a component token. Never hardcode a value. See `.claude/references/worked-examples.md` for concrete examples.

---

## Component Architecture — 5-Level Hierarchy

```
L1 — Atoms       No component imports. Tokens + Tailwind only.
L2 — Molecules   Import L1 atoms only.
L3 — Organisms   Import L2 molecules + L1 atoms.
L4 — Templates   Import L3 organisms + lower.
L5 — Pages       Import L4 templates + lower.
```

A component at level N may only import components at level N-1 or lower. Same-level imports are invalid.

---

## Component File Structure — 5 Files Per Component

Every component consists of exactly 5 files:

```
[ComponentName]/
├── [ComponentName].tsx          ← Component implementation
├── [ComponentName].types.ts     ← TypeScript interfaces
├── [ComponentName].stories.tsx  ← Storybook stories (8 required)
├── README.md                    ← Props table, token list, usage, accessibility
└── mock-data.json               ← Test/preview data
```

**Exception — compound organisms:** Slot components (e.g. `Sidebar.Header`) are internal named consts inside the organism's `.tsx` file, attached as static properties and also exported as named exports.

---

## How Components Are Styled

**Rule: Tailwind className only. No inline styles. No CSS modules. No hardcoded values.**

```tsx
// Correct — component token via var() wrapper (required in Tailwind v4.2)
<button className="bg-[var(--button-bg)] text-[var(--button-text)] h-[var(--button-height-md)] rounded-[var(--button-radius)] text-button-md transition-default hover:bg-[var(--button-bg-hover)]">

// Wrong — inline styles, hardcoded values, bare arbitrary values like bg-[#6366f1] or h-[40px]
```

---

## Available Semantic Token Groups

For the full token list with names and values, read `.claude/skills/component-builder/references/token-quick-reference.md`.

Key groups: `color/background`, `color/text`, `color/border`, `color/action`, `color/status`, `color/state`, `color/data-series`, `spacing/component` (fixed), `spacing/layout` (responsive), `size/component`, `size/icon`, `radius/component`, `motion/duration`, `motion/easing`, `layer`, `border/width`, typography classes (`.text-body-md`, `.text-heading-h1`, etc.), content flexibility utilities (`.truncate-label`, `.clamp-description`, `.content-flex`, `.content-nowrap`, `.empty-placeholder`), responsive card protection (`.card-shell`, `.card-header-row`, `.card-header-title`, `.card-metric-row`), performance utilities (`.perf-contain-content`, `.perf-content-auto`, `.perf-will-change-transform`).

If a semantic token doesn't exist for an intent — create it before using it.

---

## Technology Stack

React 19 · TypeScript 5.7+ · Tailwind CSS v4.2 · Vite 6 · Storybook 10 · Vitest 4.1 · Playwright 1.58 · lucide-react 0.577 · npm

**No other styling libraries.** No `styled-components`, no `emotion`, no CSS modules, no `clsx`, no `cva`, no `cn()` utility.

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Component folders/files | PascalCase | `Button/`, `Button.tsx` |
| Component exports | Named export matching folder | `export const Button` |
| Token names | kebab-case with prefix | `--button-bg`, `--input-border-focus` |
| Component CSS tokens | `--{component}-{property}-{scale}` | `--avatar-size-md`, `--checkbox-icon-size-sm` |
| Story titles | `Atoms/Button`, `Molecules/Card` | Matches level hierarchy |
| TypeScript interfaces | PascalCase + Props | `ButtonProps` |

---

## What Claude Code Should Never Do

1. **Never hardcode a value** — every value comes from a token.
2. **Never use inline `style` prop** for visual styling.
3. **Never use arbitrary Tailwind values** like `bg-[#6366f1]` or `h-[40px]`. Only `bg-[var(--token)]` (must include `var()` wrapper).
4. **Never create a component token that references a primitive directly.** Chain: primitive → semantic → component.
5. **Never import a component from the same or higher level.**
6. **Never create more or fewer than 5 files per component.**
7. **Never skip writing component tokens** into `geeklego.css` before writing the component.
8. **Never use `clsx`, `cva`, `cn()` or any class-merging utility.**
9. **Never reference Shadcn** in any way.
10. **Never use package import paths** — use relative imports only.
11. **Never create a separate 5-file folder for a non-reusable slot component.** Define as internal const + static property.
12. **Never classify a self-contained interactive unit as a molecule.** No component deps = L1 atom.
13. **Never apply box-shadow to a resting component in light/dark mode.** Shadows only on overlays (dropdowns, modals, tooltips, popovers).
14. **Never create an interactive element smaller than 24x24px CSS** (WCAG 2.5.8). Use `.touch-target` for visually smaller controls.
15. **Never create an interactive element without an accessible name.** Icon-only buttons need `aria-label`. Form controls need `<label>`. Multiple landmarks of same type need `aria-label`.
16. **Never place a decorative icon without `aria-hidden="true"` on its wrapper.**
17. **Never rely on color alone to convey state.** Use a secondary cue (icon, border, text label).
18. **Never write `animation:` or `transition:` directly.** Use `.transition-default`, `.transition-enter`, etc.
19. **Never add Schema.org markup to components with no semantic entity mapping.**
20. **Never render Microdata when `schema` prop is `false`/undefined.** Use conditional spread.
21. **Never use React context for schema state.** Pass via props.
22. **Never use `role="treeitem"` outside a `role="tree"` container.** Flat nav = plain `<li>` in `<ul>`.
23. **Never default Avatar `alt` to empty string** for user-facing avatars. Default to `'User avatar'`.
24. **Never write `@media`/`@container` queries in component TSX.** Use Tailwind responsive prefixes or token overrides in `geeklego.css`.
25. **Never make `--spacing-component-*` tokens responsive.** Only `--spacing-layout-*` scales with viewport.
26. **Never write vendor-prefixed CSS manually.** Autoprefixer handles this.
27. **Never use `color-mix()` in component token blocks.** Isolated to shadow tokens in `geeklego.css` with `@supports` fallbacks via `cssGenerator.ts`.
28. **Never add `@supports` blocks in component TSX.** Feature-gated CSS lives only in `geeklego.css`.
29. **Never use unsafe CSS features without `cssGenerator.ts` fallback first.** Unsafe: `@property`, `anchor-positioning`, `round()`/`mod()`/`rem()`. See `.claude/references/cross-browser-compat.md`.
30. **Never implement arrow-key nav, focus trapping, escape dismiss, or click-outside inline.** Use hooks from `components/utils/keyboard/`.
31. **Never use `tabIndex` greater than 0.**
32. **Never use raw Tailwind overflow utilities** (`truncate`, `whitespace-nowrap`, `line-clamp-*`). Use `.truncate-label`, `.clamp-description`, `.content-nowrap`, `.content-flex`.
33. **Never hardcode `-webkit-line-clamp`.** Use `.clamp-description`/`.clamp-body` or `.clamp-lines` with a component token.
34. **Never apply `will-change` permanently.** Use `.perf-will-change-transform` (hover/focus only).
35. **Never use index as sole React key in `.map()`.** Use a stable unique identifier.
36. **Never skip `React.memo` on L1/L2 components.** Wrap with `memo(forwardRef(...))`.
37. **Never create a card-shell component without responsive layout protection.** Use `.card-shell`, `.card-header-row`, `.card-header-title`, `.card-metric-row`.
38. **Never write a DarkMode story without `max-w-2xl`.**
39. **Never hand-roll ARIA attribute objects.** Use helpers from `components/utils/accessibility/aria-helpers.ts`.
40. **Never hardcode a system string directly into JSX.** Any string a screen reader announces or a user reads that is not consumer-supplied content (not `children`, `title`, `label` prop) must be resolvable via `useComponentI18n()` and the `i18nStrings` prop.
41. **Never use `pl-*`/`pr-*`/`ml-*`/`mr-*`/`left-*`/`right-*` for component-internal padding, margin, or icon offsets.** Use logical equivalents: `ps-*`/`pe-*`/`ms-*`/`me-*`/`start-*`/`end-*`.
42. **Never render `href` verbatim on an `<a>` element.** Always pass it through `sanitizeHref()` from `components/utils/security/sanitize.ts`. This strips `javascript:`, `data:text/html`, and `vbscript:` protocols that bypass React's automatic text-escaping.
43. **Never render `<a target="_blank">` without `rel="noopener noreferrer"`.** Use `getSafeExternalLinkProps()` from `components/utils/security/sanitize.ts` for any component that accepts a `target` prop or has an `external` concept.
44. **Never accept a `href` prop on any component that renders `<a>` without importing `sanitizeHref`.** Even when the href is expected to be a fragment or relative path — sanitize unconditionally. The utility is a no-op on safe values.
45. **Never name a component token with the property before the component name.** Always use `--{component}-{property}-{scale}` (e.g. `--avatar-size-md`), never `--{property}-{component}-{scale}` (e.g. `--size-avatar-md`).

---

## What Claude Code Should Always Do

1. **Read `design-system/geeklego.css` before generating any component.**
2. **Check if a component token block already exists** before creating a new one.
3. **Write component tokens into `geeklego.css` first**, then write the component.
4. **Follow the 5-file structure exactly.**
5. **Place components in the correct level folder.**
6. **Use typography utility classes** (`.text-button-md`, `.text-body-sm`) — never set font properties manually.
7. **Use `.transition-default`** for all hover/focus transitions.
8. **Use `.focus-ring`** for all focus-visible states.
9. **Use `.skeleton`** for all loading states.
10. **Use relative imports** between components.
11. **Attach compound organism slots as static properties** and export as named exports.
12. **Apply shadows contextually by theme.** Light/dark resting = `none`, overlays = `--shadow-lg`/`--shadow-xl`. Active = `--shadow-inset-sm`, overlays = `-lg`.
13. **Use semantic HTML first, ARIA second.** See `.claude/references/semantic-html-guide.md`. `<button>` for actions, `<a>` for navigation, landmarks for sections. Never `onClick` on `<div>`.
14. **Add `aria-expanded`** to every disclosure trigger.
15. **Add `aria-controls` + matching `id`** to every disclosure trigger/panel pair. Use `useId()`.
16. **Include an `Accessibility` story** as the 8th story, tagged `['a11y']`.
17. **Minimum 24x24px touch target** on every interactive element. Use `.touch-target` for visually smaller controls.
18. **Write the Accessibility section** in every README.md with keyboard interaction table.
19. **Check Schema.org mapping table** when generating. Add `schema?: boolean` if applicable.
20. **Document Schema.org** in README.md when supported.
21. **Use `--spacing-layout-*`** for between-component gaps (responsive). Use `--spacing-component-*`** for internal padding (fixed).
22. **Use Tailwind responsive prefixes** (`md:hidden`, `lg:flex`) for conditional layout.
23. **Use `-responsive` typography classes** for viewport-scaling text.
24. **Add new `color-mix()` shadow tokens to `cssGenerator.ts`**, not hand-edited in `geeklego.css`.
25. **Default `@container` layouts to small/mobile variant.** Container queries progressively enhance.
26. **Use keyboard hooks** from `components/utils/keyboard/`: `useRovingTabindex`, `useFocusTrap`, `useEscapeDismiss`, `useClickOutside`.
27. **Include keyboard interaction table** in every interactive component's README.md.
28. **Use roving tabindex** (not regular Tab) for arrow-navigated groups via `useRovingTabindex`.
29. **Include content flexibility tokens** in every component token block for all text/container slots.
30. **Use `.truncate-label`** for single-line truncation (not Tailwind's `truncate`).
31. **Use `.content-flex`** on flex children with text (replaces `flex-1 min-w-0`).
32. **Use `.content-nowrap`** for non-wrapping text in buttons/chips/badges.
33. **Use `.empty-placeholder`** for empty/zero-data states with `emptyMessage?: string` prop.
34. **Wrap L1/L2 with `memo(forwardRef(...))`**, L3+ with `memo` unless complex internal state. Set `displayName`.
35. **Use `useMemo`** for computed className strings. Hoist static strings to module scope.
36. **Use `useCallback`** only for internally-created handlers, not pass-through props.
37. **Use stable unique identifiers as React keys** — id, href, or unique data field, never index alone.
38. **Use `.perf-contain-content`** on repeated list items and card-like components.
39. **Use `.perf-content-auto`** for off-screen collapsible content.
40. **No permanent `will-change`** — use `.perf-will-change-transform` (hover/focus only).
41. **Use `.card-shell`** on every L2/L3 with header + body layout.
42. **Use `.card-header-row`** for header rows with title + action.
43. **Use `.card-header-title`** for the title area inside header rows.
44. **Use `.card-metric-row`** for metric + delta/label rows.
45. **Use ARIA helper functions** from `components/utils/accessibility/aria-helpers.ts`: `getDisclosureProps`, `getNavigationItemProps`, `getLiveRegionProps`, `getLoadingProps`, `getDisabledProps`, `getErrorFieldProps`, `getIconProps`.
46. **Check `.claude/skills/i18n/references/string-inventory.md`** when building a component to see whether it has known system strings. If so, add `i18nStrings?` to its types and resolve via `useComponentI18n()`.
47. **Use `ps-*`/`pe-*` for content padding and `start-*`/`end-*` for icon inset positioning** (RTL-safe logical properties).
48. **Apply `sanitizeHref()` to every `href` prop** before passing it to an `<a>` element. Import from `../../utils/security/sanitize` (relative path). Wrap in `useMemo` per the performance pattern.
49. **Read `.claude/skills/state-handling/SKILL.md`** when adding or auditing visual states (loading, disabled, error, selected). Use `getLoadingProps()`, `getDisabledProps()`, `getErrorFieldProps()` from `components/utils/accessibility/aria-helpers.ts`. Minimum requirement: L3 organisms must have a `loading` prop.

---

## The Component Generation Flow

Component generation follows a 5-step flow: (1) read `geeklego.css`, (2) classify level + dependencies, (3) write component tokens, (4) write 5 files, (4.5) accessibility audit, (4.6) performance audit, (4.7) SEO audit, (4.8) security audit, (5) verify imports.

**Full flow with checklists:** `.claude/references/component-generation-flow.md`
**Storybook story template:** `.claude/references/storybook-stories.md`

---

## Reference Documents

These files in `.claude/references/` contain detailed implementation guidance. Read them when the topic is relevant to your task:

| File | When to read |
|---|---|
| `component-generation-flow.md` | Before generating any component — full 5-step flow with accessibility + performance checklists |
| `storybook-stories.md` | Before writing stories — 8-story template with JSX examples |
| `worked-examples.md` | When unsure how the token chain works — concrete primitive → semantic → component examples |
| `cross-browser-compat.md` | When using `color-mix()`, `@property`, `anchor-positioning`, or other unsafe CSS features |
| `semantic-html-guide.md` | When choosing HTML elements — decision table for `<button>` vs `<a>` vs `<div>`, landmarks, etc. |
| `component-variants.md` | When implementing size/variant props — patterns for variant-based styling |

Additional skill-specific references live in `.claude/skills/component-builder/references/` (token-quick-reference, schema-org, aria-patterns).

**State handling** — Read `.claude/skills/state-handling/SKILL.md` when adding or auditing any visual state (loading, disabled, error, selected). Full code patterns and token chains in `.claude/skills/state-handling/references/patterns.md`.

---

## External Skills — `.agents/` and `skills-lock.json`

The `.agents/skills/` directory holds externally sourced skills managed by `skills-lock.json`. These are pulled from GitHub repos (not written locally) and should not be edited by hand.

```json
// skills-lock.json format
{
  "version": 1,
  "skills": {
    "<skill-name>": {
      "source": "<org>/<repo>",
      "sourceType": "github",
      "computedHash": "<integrity-hash>"
    }
  }
}
```

Currently installed external skills:

| Skill | Source | Purpose |
|---|---|---|
| `web-accessibility` | `supercent-io/skills-template` | WCAG 2.1 a11y — use for accessibility audits and remediation outside the component-builder flow |

Project-local skills (authored in-repo) live in `.claude/skills/` and are not in `skills-lock.json`.

---

## Schema.org Structured Data

Opt-in via `schema?: boolean` prop (default `false`). Two levels: Microdata on L1-L3 components, JSON-LD via `<StructuredData>` at L4+.

**Full mapping table, implementation patterns, and rules:** `.claude/skills/component-builder/references/schema-org.md`

**Key rules:** `schema` defaults to `false`. All Microdata uses conditional spread `{...(schema && {...})}`. Pass via props, not context. No new DOM when off.

---

## Existing Components

**L1 Atoms**

| Component | Location |
|---|---|
| Avatar | `components/atoms/Avatar/` |
| Badge | `components/atoms/Badge/` |
| BreadcrumbItem | `components/atoms/BreadcrumbItem/` |
| Button | `components/atoms/Button/` |
| ChatBubble | `components/atoms/ChatBubble/` |
| Checkbox | `components/atoms/Checkbox/` |
| Chip | `components/atoms/Chip/` |
| ColorSwatch | `components/atoms/ColorSwatch/` |
| Divider | `components/atoms/Divider/` |
| EmptyState | `components/atoms/EmptyState/` |
| FileInput | `components/atoms/FileInput/` |
| Heading | `components/atoms/Heading/` |
| Image | `components/atoms/Image/` |
| Input | `components/atoms/Input/` |
| Item | `components/atoms/Item/` |
| Label | `components/atoms/Label/` |
| Link | `components/atoms/Link/` |
| List | `components/atoms/List/` |
| NavItem | `components/atoms/NavItem/` |
| ProgressBar | `components/atoms/ProgressBar/` |
| ProgressIndicator | `components/atoms/ProgressIndicator/` |
| Quote | `components/atoms/Quote/` |
| Radio | `components/atoms/Radio/` |
| Rating | `components/atoms/Rating/` |
| SegmentedControl | `components/atoms/SegmentedControl/` |
| Select | `components/atoms/Select/` |
| Skeleton | `components/atoms/Skeleton/` |
| SkipLink | `components/atoms/SkipLink/` |
| Slider | `components/atoms/Slider/` |
| Spinner | `components/atoms/Spinner/` |
| Stack | `components/atoms/Stack/` |
| Switch | `components/atoms/Switch/` |
| Tag | `components/atoms/Tag/` |
| Textarea | `components/atoms/Textarea/` |
| ThemeSwitcher | `components/atoms/ThemeSwitcher/` |
| Toggle | `components/atoms/Toggle/` |
| TreeItem | `components/atoms/TreeItem/` |
| TypingIndicator | `components/atoms/TypingIndicator/` |
| Video | `components/atoms/Video/` |
| VisuallyHidden | `components/atoms/VisuallyHidden/` |

**L2 Molecules**

| Component | Location |
|---|---|
| AlertBanner | `components/molecules/AlertBanner/` |
| Breadcrumb | `components/molecules/Breadcrumb/` |
| ButtonGroup | `components/molecules/ButtonGroup/` |
| Card | `components/molecules/Card/` |
| ChatHeader | `components/molecules/ChatHeader/` |
| ChatInputBar | `components/molecules/ChatInputBar/` |
| ChatMessage | `components/molecules/ChatMessage/` |
| Combobox | `components/molecules/Combobox/` |
| DateInput | `components/molecules/DateInput/` |
| DropdownMenu | `components/molecules/DropdownMenu/` |
| Fieldset | `components/molecules/Fieldset/` |
| FileUpload | `components/molecules/FileUpload/` |
| FormField | `components/molecules/FormField/` |
| InputGroup | `components/molecules/InputGroup/` |
| Navbar | `components/molecules/Navbar/` |
| NumberInput | `components/molecules/NumberInput/` |
| Pagination | `components/molecules/Pagination/` |
| Popover | `components/molecules/Popover/` |
| RadioGroup | `components/molecules/RadioGroup/` |
| SearchBar | `components/molecules/SearchBar/` |
| StatCard | `components/molecules/StatCard/` |
| Stepper | `components/molecules/Stepper/` |
| Toast | `components/molecules/Toast/` |
| Tooltip | `components/molecules/Tooltip/` |
| TreeView | `components/molecules/TreeView/` |

**L3 Organisms**

| Component | Location |
|---|---|
| Accordion | `components/organisms/Accordion/` |
| AreaChart | `components/organisms/AreaChart/` |
| BarChart | `components/organisms/BarChart/` |
| Carousel | `components/organisms/Carousel/` |
| Chat | `components/organisms/Chat/` |
| ColorPicker | `components/organisms/ColorPicker/` |
| DataTable | `components/organisms/DataTable/` |
| Datepicker | `components/organisms/Datepicker/` |
| Drawer | `components/organisms/Drawer/` |
| Footer | `components/organisms/Footer/` |
| Form | `components/organisms/Form/` |
| Header | `components/organisms/Header/` |
| Modal | `components/organisms/Modal/` |
| Sidebar | `components/organisms/Sidebar/` |
| Tabs | `components/organisms/Tabs/` |

**Utility modules (not components):** `useRovingTabindex`, `useFocusTrap`, `useEscapeDismiss`, `useClickOutside` (in `components/utils/keyboard/`), ARIA helpers (`components/utils/accessibility/aria-helpers.ts`), StructuredData (`components/utils/StructuredData/`), i18n helpers (`components/utils/i18n/`), security utilities (`components/utils/security/`).

---

## Priority Component Build Order

All L1 atoms and L2 molecules are built. Remaining work:

**L3 Organisms (remaining):** HeroSection
**L4 Templates:** DashboardLayout · AuthLayout · LandingLayout

---

## On-Demand Audit Commands

These commands can be typed at any time to trigger a targeted audit across all existing components.

### "do a refactor check" / "run a quality audit"

Scans all components in `components/atoms/`, `components/molecules/`, `components/organisms/`, and `components/templates/`.

For each component, check:

**Hooks compliance**
- Wrapped with `memo(forwardRef(...))` for L1/L2, `memo()` for L3+
- `displayName` set on every component
- `useMemo` on all computed className strings
- Static class strings hoisted to module scope
- `useCallback` on all internally-created event handlers
- No index-based keys in `.map()`

**Utility class compliance**
- No raw `flex-1 min-w-0` — use `.content-flex`
- No raw `truncate` or `whitespace-nowrap` — use `.truncate-label` or `.content-nowrap`
- No inline click-outside `useEffect` — use `useClickOutside` hook
- No inline escape key `useEffect` — use `useEscapeDismiss` hook
- No inline focus trap logic — use `useFocusTrap` hook
- No raw `-webkit-line-clamp` — use `.clamp-description` or `.clamp-body`

**Token compliance**
- No hardcoded hex, px, or rem values
- No arbitrary Tailwind values except `var(--token)` syntax
- No primitive tokens referenced directly in component tokens

Output format:
- List each component that needs fixes with specific line-level changes
- List components that are clean as a single `✓` line
- End with a "Skip / Not worth fixing" section for over-engineering calls
- Do not make any file changes — output the plan only and wait for approval

### "do a reuse audit"

Scans all existing components for inlined markup, styling, or logic that an already-built atom now owns.

Check every existing component against the current component inventory in CLAUDE.md. Flag any case where a component is hand-rolling something an existing atom provides.

Output format:
- List each violation as: `[File] — [what is inlined] → replace with <[Atom]>`
- If no violations found, print: `✓ Reuse audit — no violations found`
- Do not make any file changes — output the plan only and wait for approval

### "do an SEO audit"

Scans all components in `components/atoms/`, `components/molecules/`, `components/organisms/`, and `components/templates/`.

For each component, check:

**Schema.org coverage**
- Does a mapping exist in `.claude/skills/component-builder/references/schema-org.md`?
- If yes: Is `schema?: boolean` declared in `[ComponentName].types.ts`?
- If yes: Is the conditional-spread Microdata implemented in `[ComponentName].tsx`? (Check that `itemScope`/`itemType` is driven by the prop — not just declared in types)
- If yes: Does it cascade `schema` to child components that also have schema props (including through intermediary renderers)?
- If yes: Is the Schema.org section documented in `README.md` with type, itemProps table, and usage example?

**Semantic HTML**
- Does the component use the most semantically specific HTML element available?
- Are all image `alt` texts non-empty for user-facing images?
- Is link text descriptive (no "click here", "read more", "here")?
- Are lists using `<ul>` or `<ol>`, not bare `<div>` stacks?
- Multiple same-type landmark elements each have `aria-label` to distinguish them?

Output format:
- List each violation as: `[File:line] — [what is wrong]`
- Clean components as: `✓ ComponentName`
- End with a "Summary" section: total components scanned, count with violations, count clean
- Do not make any file changes — output the plan only and wait for approval

### "apply the refactor" / "apply the audit"

Only run this after a refactor check, reuse audit, or SEO audit has been output and reviewed.
Apply all fixes from the most recent audit output.
After applying, print a summary of what was changed.

---

## Key Principles — In Order of Priority

1. **Design-system-first integrity** — primitive → semantic → component. Never skip. Never break.
2. **geeklego.css is always updated first** — component tokens before component code.
3. **5 files always** — no more, no less.
4. **Tailwind className only** — no inline styles, no arbitrary values except `[var(--token)]` syntax.
5. **Level hierarchy respected** — atoms import nothing, molecules import atoms only.
6. **Typography via utility classes** — `.text-body-md` not `fontSize: '16px'`.
7. **Theme-awareness** — every colour token must work in light and dark modes.

---

*Project: Geeklego*
*Type: Open-source design-system-first component library*
*Stack: React 19 + TypeScript 5.7 + Tailwind CSS v4.2 + Storybook 10 + Vite 6*
*Last updated: March 2026*
