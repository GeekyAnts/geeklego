# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **This is the GeekLego v2 system: 2-tier tokens (primitives → semantics) + ShadCN/Radix components.**
> It replaces the old 3-tier (primitive → semantic → component-token) architecture. The 2-tier cut has landed and the Token Editor `app/` has been rebuilt on v2 — see "Repo state" below. The reference implementation for every v2 rule in this file is the **Button slice** at [components/v2/Button/](components/v2/Button/) — read it before building anything.
>
> **This file is the authoritative source for v2 rules.** Read it together with the reference component above.

---

## What is GeekLego (v2)?

GeekLego is an open-source, design-system-first React component library built on **Tailwind CSS v4 + ShadCN/Radix UI**.

It ships:

1. **A 2-tier design system** — `design-system/v2/` — primitives (geeklego's brand palette/scales, unchanged) aliased to a **standard ShadCN/Tailwind semantic vocabulary** (`--primary`, `--background`, `--border`, `--ring`, …). Components consume the semantics directly.
2. **A component library** — `components/v2/` — ShadCN-pattern React components (`cva` variants + `cn()` + Radix primitives) styled with standard semantic utilities (`bg-primary text-primary-foreground`).
3. **An AI generation skill** — `component-builder-v2` — generates new v2 components following the rules below.
4. **A token editor → cockpit** (`app/`) — edit primitives + semantics, manage themes, export to CSS / IR / design.md. (Being adapted from 3-tier; see brief §4.)

**Design-system-first means:** the token system (primitives + semantics) is the source of truth. Components are an expression of it — you never hardcode a value or invent vocabulary. You consume the standard semantics, and only reach for namespaced `--ext-*` tokens for genuine brand-custom variants.

**Why standard ShadCN vocabulary?** Industry-standard, in every LLM's training set, native Tailwind v4 utilities, paste-and-go. The only geeklego-specific layer is the *primitive palette* (the brand seam) — the semantic interface is deliberately standard.

---

## Repo state: the 2-tier cut has landed (read this first)

The **§7 decision gate PASSED, the §7.5 2-tier cut executed (2026-06-21), and the Token Editor `app/` was rebuilt on v2 (2026-06-22).** v2 is the only live system. The old 3-tier **components, component-token block, and old skill are deleted**; the Token Editor now runs against `design-system/v2/`.

| Path | System | Status |
|---|---|---|
| `design-system/v2/`, `components/v2/` | **v2 — 2-tier ShadCN/Radix** | **Active. All new work goes here.** |
| `design-system/geeklego.css` | **DELETED** in the cut. | v2 imports `design-system/v2/index.css` only — there is no `geeklego.css` to fall back to. |
| `design-system/v2-defaults/` | **factory-reset baseline** — pristine copies of `primitives.css`, `semantics.css`, `themes/dark.css` | Source of truth for "reset to defaults" / export diffs. Don't edit by hand as part of normal token work — edit `design-system/v2/`. |
| `components/utils/` | shared helpers (keyboard/accessibility/security/i18n/StructuredData) | **Kept** per brief §5 — pending a Radix-redundancy audit. Survivors of that audit stay. |
| `components/index.ts` | package barrel | Re-exports all `v2/*` components (the published surface) + the kept `utils/*`. **Every new v2 component must be added here** so `pnpm build` bundles it. Old 3-tier + catalog re-exports were removed in the cut. |
| `components/{atoms,molecules,organisms}/`, `components/catalog.ts`, `scripts/catalog.ts` | old 3-tier components + catalog | **DELETED** in the cut. (Backups in the session scratchpad.) |
| `.claude/skills/component-builder/` | old 3-tier skill | **DELETED.** Use `component-builder-v2`. |
| `app/` (Token Editor cockpit) | **v2 — rebuilt** | **Active.** Flat `GeeklegoTokensV2` model; reads/writes `design-system/v2/` via a live inline plugin in `vite.config.mts` (not a standalone token-api). Run with `npm run dev`. |

**Current rules:**
- Build all new components under `components/v2/<Name>/`. The old atom/molecule/organism dirs are gone — there is nothing to import from them.
- v2 imports `design-system/v2/index.css` only — never `design-system/geeklego.css`.
- **ESLint now enforces v2 import discipline** via `no-restricted-imports` in [eslint.config.mjs](eslint.config.mjs) (bans `**/{atoms,molecules,organisms}/**` and direct `geeklego.css` imports). `npm run lint` is a real gate.
- `AGENTS.md` is refreshed for v2 (operational supplement to this file). `DESIGN_SYSTEM.md` was deleted; the gitignored `docs/` notes still describe 3-tier — ignore them.
- Shipped v2 components (verify with `ls components/v2/` — the list moves as work lands): **Button** (the reference leaf), **Input** (a styled leaf), **Dialog** & **Popover** (compound, on Radix primitives), and **Combobox** + **Command** (the `Popover` + `cmdk` recipe), plus shared helpers in `components/v2/lib/` (`cn.ts`). Radix deps in use: `@radix-ui/react-slot` (powers `asChild`), `@radix-ui/react-dialog`, `@radix-ui/react-popover`, and `cmdk`. The cockpit's own UI lives in `app/src/editor-ds/` and is separate from the published `components/v2/` library.

---

## Commands

Package manager is **pnpm** (the `node_modules` tree is pnpm-built; `pnpm-lock.yaml` is the live lockfile; `package.json` pins `packageManager: pnpm@…`). **Install packages with `pnpm add <pkg>` — never `npm install`:** npm's installer crashes on this pnpm tree (`Cannot read properties of null (reading 'matches')`), and a `preinstall` guard (`only-allow pnpm`) now hard-blocks npm/yarn. Running *scripts* works under either (`npm run dev` ≡ `pnpm run dev`); the table below uses `pnpm`. There is **no `test` script** — run Vitest directly.

| Task | Command |
|---|---|
| Install a dependency | `pnpm add <pkg>` (⚠️ **never `npm install`** — see above) |
| Token Editor cockpit (dev) | `pnpm run dev` (Vite, serves `app/`) |
| Storybook (component dev) | `pnpm run storybook` (port 6006) |
| Both at once | `pnpm run dev:all` |
| Type-check | `npx tsc --noEmit` |
| Lint (JS/TS — enforces v2 import rules; `--max-warnings 0`) | `pnpm run lint` |
| Lint CSS | `pnpm run lint-css` (stylelint over `design-system/v2/**`) |
| Run all tests | `npx vitest run` (config: [vitest.config.ts](vitest.config.ts) — `app/src/**/*.test.ts` + `scripts/**/*.test.ts`) |
| Run one test file | `npx vitest run scripts/validate-tokens.test.ts` |
| Watch a test | `npx vitest scripts/validate-tokens.test.ts` |
| Validate token chain | `pnpm run validate-tokens` (must exit 0) |
| Build library (JS + CSS) | `pnpm run build` (`tsup` bundle + `build:css`) |
| Build CSS only | `pnpm run build:css` (compiles `design-system/v2/index.css` → `dist/geeklego.css`) |
| Export IR / design.md | `pnpm run export-ir` · `pnpm run export-design-md` |
| Build Storybook | `pnpm run build-storybook` (passes — `.storybook/main.ts` globs only `components/v2/**`, so the legacy `stories/**` incl. the broken `Configure.mdx` is excluded) |

---

## The 2-Tier Token Model

```
Tier 1 — PRIMITIVES   geeklego's own brand palette/scales, UNCHANGED (the @theme block + :root mirror)
                      --color-brand-900   --color-accent-500   --spacing-4   --radius-lg   --text-base
                          ↓ aliased by
Tier 2 — SEMANTICS    ShadCN / Tailwind STANDARD vocabulary (the interface components consume)
                      --primary / --primary-foreground   --background / --foreground
                      --secondary   --muted   --accent   --destructive
                      --border   --input   --ring   --card   --popover   --radius

COMPONENTS            standard Tailwind v4 utilities, zero custom vocabulary:
                      className="bg-primary text-primary-foreground border-input ring-ring"

THEMES                a theme = a set of Tier-2 overrides   →  .dark { --primary: …; --background: … }
BRAND FORKS           re-point Tier-2 semantics at different primitives
CUSTOM VARIANTS       --ext-<component>-<variant>-*   (namespaced, OUTSIDE the core semantic set)
```

### The token chain rule (2-tier)

`primitive → semantic → utility`. **Never skip and never hardcode:**
- Every Tier-2 semantic aliases a Tier-1 primitive (`--primary: var(--color-brand-900)`). Never a raw value.
- Every `--ext-*` custom-variant token also aliases a primitive (`--ext-button-gamified-bg: var(--color-accent-500)`). Never a raw value.
- Components reference **semantics only**, via standard utilities. They never reference a primitive directly and never hardcode.
- There is **no component-token tier** in v2. Do not write `--button-*`-style component-token blocks. If you find yourself wanting one, you want either a standard utility or an `--ext-*` token.

---

## Design system file layout (`design-system/v2/`)

```
design-system/v2/
├── index.css            ← entrypoint. @imports the three below, in order (order matters)
├── primitives.css       ← Tier 1. @import "tailwindcss" + the @theme palette/scales. Copied unchanged from the brand source.
├── semantics.css        ← Tier 2. :root semantic aliases + @theme inline registration + the --ext-* block
└── themes/
    └── dark.css         ← dark theme = Tier-2 overrides under [data-theme="dark"], .dark
```

**How the semantic layer wires up** (see [semantics.css](design-system/v2/semantics.css)):

1. `:root { --primary: var(--color-brand-900); … }` — raw semantic vars, each aliasing a primitive. This is the themeable layer.
2. `@theme inline { --color-primary: var(--primary); … }` — registers each semantic as a Tailwind v4 color utility. **The `inline` keyword is required**: it makes Tailwind emit utilities that resolve the `var()` *at runtime*, so theme overrides (`.dark { --primary: … }`) re-theme live without a rebuild. Radius works the same way (`--radius` → `--radius-sm/md/lg/xl` via `calc()`).
3. `--ext-*` custom-variant tokens get their own `:root` block **and** their own `@theme inline` block, kept structurally separate from the core semantics so brand variants never pollute the themeable set.

**Themes** ([themes/dark.css](design-system/v2/themes/dark.css)) override only Tier-2 vars and support **both** selectors: `[data-theme="dark"]` (the Token Editor / Storybook switch) **and** `.dark` (ShadCN convention). Always write both.

### The standard semantic token set

`--background` `--foreground` · `--primary` `--primary-foreground` · `--secondary` `--secondary-foreground` · `--muted` `--muted-foreground` · `--accent` `--accent-foreground` · `--destructive` `--destructive-foreground` · `--border` · `--input` · `--ring` · `--card` `--card-foreground` · `--popover` `--popover-foreground` · `--radius`.

**geeklego extends ShadCN (deliberate, documented):**
- **Status** — `--success` `--success-foreground` · `--warning` `--warning-foreground` · `--info` `--info-foreground`. Feedback/status semantics beyond ShadCN's lone `--destructive`; bucketed under *Status* in the cockpit.
- **Sidebar** — `--sidebar-bg` `--sidebar-foreground` `--sidebar-border` `--sidebar-accent` `--sidebar-accent-foreground` `--sidebar-ring`. A dedicated navigation-chrome surface. **Naming deviation:** the panel-surface key is `--sidebar-bg`, *not* ShadCN's `--sidebar`, so the whole group is uniformly suffixed (`bg`/`foreground`/`border`/…). Internally consistent across component + variants + dark + defaults; bucketed under *Layout*.

These map to Tailwind utilities `bg-*`, `text-*`, `border-*`, `ring-*`, `rounded-*`. **Do not invent new core semantics.** If geeklego genuinely needs a semantic ShadCN doesn't define (e.g. status/info, data-series for charts), extend the standard set *deliberately*, document it as "geeklego extends ShadCN," and add it to this list — don't smuggle it in via a component.

---

## Component architecture (v2)

**No atom/molecule/organism tiers. No level folders. No catalog.** Flat: `components/v2/<ComponentName>/`. Atomic design survives as a *composition discipline* (decompose → plan the tree → build leaves first → compose), not as a taxonomy. Import discipline is enforced by ESLint (`eslint.config.mjs`), not folder structure.

### The component pattern — ShadCN/Radix

The canonical shape, proven by Button:

- **`cva` variants** in a separate `<name>-variants.ts` file — base classes + `variants` + `defaultVariants`. Variant classes are standard semantic utilities.
- **`cn()`** = `clsx` + `tailwind-merge` (from [components/v2/lib/cn.ts](components/v2/lib/cn.ts)) — merges variant output with consumer `className` (last-wins, so overrides compose cleanly).
- **`forwardRef`** + `displayName`. Plain `forwardRef` — **not** `memo(forwardRef)` (that was a 3-tier rule; dropped).
- **`asChild`** via Radix `<Slot>` for polymorphic rendering (e.g. a link styled as a button).
- **Radix primitives** for anything with a11y/keyboard/portal/focus surface — see the Radix-first rule below.
- `"use client";` at the top when the component uses hooks/refs/interactivity.

```tsx
// components/v2/Button/Button.tsx — the reference
"use client";
import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/cn";
import { buttonVariants } from "./button-variants";
import type { ButtonProps } from "./Button.types";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";
```

```ts
// button-variants.ts — core variants use ONLY standard semantics; `gamified` uses ONLY --ext-* tokens
export const buttonVariants = cva(
  ["inline-flex items-center justify-center …",
   "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
   "disabled:pointer-events-none disabled:opacity-50"].join(" "),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background text-foreground hover:bg-muted",
        // custom variant — namespaced --ext-* utilities only:
        gamified: "bg-ext-button-gamified-bg text-ext-button-gamified-foreground …",
      },
      size: { sm: "h-8 px-3 text-xs", md: "h-10 px-4 text-sm", lg: "h-11 px-6 text-base", icon: "size-10 p-0" },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);
```

```ts
// Button.types.ts — extend the native element attrs + VariantProps
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProps {
  asChild?: boolean;
}
```

### Radix-first rule (the one genuinely new decision)

**Before hand-rolling any component with a11y, keyboard nav, focus trapping, portals, or `aria-activedescendant` behavior, check whether `@radix-ui/react-*` already provides the primitive** (Dialog, Popover, Tabs, Tooltip, Select, Dropdown, …) and build on it. Radix delivers the focus trap, escape dismiss, click-outside, roving tabindex, and ARIA wiring natively — do not reimplement them. This replaces the old hand-rolled mechanisms (`cloneElement` injection, `__slot` markers, the `utils/keyboard` hooks).

### Compound components

When a component has slots (Card → Header/Content/Footer; Dialog → Trigger/Content), use the ShadCN sub-component-export pattern — separate sub-components exported as named exports (often each wrapping a Radix primitive part). This is the same shape as the old `Object.assign(Card, {Header})` compound slots, restyled. Prefer the Radix primitive's built-in context over a hand-rolled `createContext`.

---

## Files per component (v2)

Button shipped with **4 files** (TSX, types, variants, stories). v2 does **not** mandate the old fixed 5-file set (README + mock-data.json were 3-tier requirements). For a new component, write:

```
<ComponentName>/
├── <ComponentName>.tsx          ← implementation (forwardRef + cn + Radix)
├── <ComponentName>.types.ts     ← Props interface (native attrs + VariantProps + asChild?)
├── <component-name>-variants.ts ← cva variants (omit only for a component with no variants)
└── <ComponentName>.stories.tsx  ← Storybook stories
```

Add a `README.md` when the component's API/a11y genuinely warrants docs (compound components, anything with non-obvious keyboard behavior). Don't generate boilerplate READMEs or `mock-data.json` by reflex.

Shared helpers live in `components/v2/lib/` (e.g. `cn.ts`).

---

## How components are styled

**Standard semantic Tailwind utilities via `className`. No inline styles. No hardcoded values. No arbitrary color/size literals.**

```tsx
// Correct — standard ShadCN/Tailwind v4 utilities, generated from the semantic @theme inline layer
<button className="bg-primary text-primary-foreground border-input ring-ring rounded-md" />

// Correct — custom variant via namespaced --ext-* utilities
<button className="bg-ext-button-gamified-bg text-ext-button-gamified-foreground" />

// Wrong — inline styles, hardcoded hex/px, or bare arbitrary values (bg-[#6366f1], h-[40px])
```

Note the v2 difference: because semantics are registered as real Tailwind utilities (`@theme inline`), you write **`bg-primary`**, not `bg-[var(--primary)]`. The `var()`-wrapper arbitrary-value pattern was a 3-tier workaround and is no longer needed for semantic tokens. (Bare `shadow-[var(--ext-…)]` arbitrary values are acceptable only where no registered utility exists, as in the gamified shadow.)

**Inline `style` is acceptable only for genuine runtime-dynamic values** that can't be a class — and only via CSS-custom-property injection (`style={{ '--x': value }}` consumed by a `className`), SVG presentation props, or data-driven positioning (tooltip coords, etc.). If the value would be `var(--token)`, it's a className.

---

## Technology stack

React 19 · TypeScript 5.7+ · **Tailwind CSS v4** (`@theme` + `@import "tailwindcss"`) · Vite 6 · Storybook 10 · Vitest 4 · Playwright 1.58 · lucide-react.

**Component layer deps:** `@radix-ui/react-*` (per-component — install when you build the component, not up front), `class-variance-authority`, `clsx`, `tailwind-merge`. `@radix-ui/react-slot` is already installed (powers `asChild`).

**No other styling libraries** beyond this set. The 3-tier ban on `cva`/`cn()`/`clsx` is **reversed** in v2 — those are now the required pattern. Still no `styled-components`, `emotion`, or CSS modules.

**ShadCN is not a dependency.** Its CLI copies source into your repo; we hand-write off the ShadCN pattern instead (the CLI fights geeklego's token setup). Use relative imports between v2 files — never package paths.

---

## Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Component folder/file | PascalCase | `Button/`, `Button.tsx` |
| Variants file | kebab-case | `button-variants.ts` |
| Component export | named, matching folder | `export const Button` |
| Core semantic tokens | ShadCN standard kebab-case | `--primary`, `--primary-foreground`, `--ring` |
| Custom-variant tokens | `--ext-<component>-<variant>-<property>` | `--ext-button-gamified-bg` |
| TS interfaces | PascalCase + `Props` | `ButtonProps` |
| Story titles | `v2/<Name>` | `v2/Button` |

---

## Storybook stories (v2)

Each story file imports the v2 stylesheet directly so the slice is self-contained:
`import "../../../design-system/v2/index.css";` (the only stylesheet — the old 3-tier `geeklego.css` is gone).

Cover: Default, Variants (core/standard only), Sizes, each custom `--ext-*` variant, Disabled, `asChild`, and **DarkMode** (wrap in `<div data-theme="dark" className="dark max-w-2xl …">` — set *both* selectors, and keep `max-w-2xl` so the dark surface is bounded). See [Button.stories.tsx](components/v2/Button/Button.stories.tsx).

---

## Custom variants — the `--ext-*` containment rule

Brand-specific variants (e.g. Button's `gamified`) are the one place v2 departs from pure ShadCN vocabulary. Keep them contained:

1. Token name: `--ext-<component>-<variant>-<property>`, defined in the `--ext-*` block of `semantics.css` (its own `:root` + `@theme inline`), **separate** from the core semantic set.
2. The token still chains to a primitive — never a raw value.
3. In the `cva` variants, a custom variant uses **only** its `--ext-*` utilities and **none** of the core semantics — this structural separation is what keeps the themeable layer clean. (Button's `gamified` is the canary: watch whether this stays disciplined at variant #5, not just #1.)

---

## Verification

Build/check the v2 slice through the real pipeline before declaring done:
- `npx tsc --noEmit` — type-check.
- Build the v2 story via Storybook/Vite to confirm the full Tailwind pipeline resolves the chain (`--color-brand-900 → --primary → bg-primary`), the `--ext-*` utilities emit, and the dark override fires for both `[data-theme="dark"]` and `.dark`.
- `pnpm run lint` (ESLint flat config, `--max-warnings 0`) — also enforces v2 import discipline. The repo baseline is **0 warnings**; any new warning fails the gate.

> **Storybook HMR caveat (new-file gotcha):** Tailwind v4's `@tailwindcss/vite` content scan under the Storybook dev server does **not** reliably pick up classes in a *brand-new* component file — a page reload won't fix it either. If a utility you just wrote appears "missing" in the running Storybook (e.g. a rule absent from the live stylesheet), **restart Storybook** (stop + start) before concluding the code is wrong; the standalone `pnpm run build:css` and `pnpm run build-storybook` always emit it correctly. Also note: Tailwind v4 `rotate-180` sets the CSS `rotate` property, **not** `transform` — verify rotation via `getComputedStyle(el).rotate`, not `.transform`.

`pnpm run validate-tokens` runs [scripts/validate-tokens.ts](scripts/validate-tokens.ts), now adapted to 2-tier (primitive→semantic chain checks; no component-tier passes). It **must exit 0**. Both broken-ref passes (CSS-chain and component-TSX) allowlist framework-injected runtime vars (`tw-*`, `radix-*`, e.g. `--radix-accordion-content-height`), so Radix runtime vars used in keyframes/inline styles don't trip the chain check.

---

## Hard rules — never do this in v2

1. **Never hardcode a value.** Every value chains primitive → semantic (→ `--ext-*`).
2. **Never write a component-token tier** (no `--button-*`-style blocks). v2 is 2-tier.
3. **Never reference a primitive directly from a component.** Components consume semantics only.
4. **Never invent core semantic vocabulary** ad hoc. Extend the standard set deliberately and document it.
5. **Never edit, import from, or extend the old 3-tier code** (`components/{atoms,molecules,organisms}/`, `design-system/geeklego.css`).
6. **Never use the old `component-builder` skill.** Use `component-builder-v2`.
7. **Never reimplement focus trap / escape / click-outside / roving tabindex / portals by hand** when a Radix primitive provides it. Radix-first.
8. **Never use inline `style`** for a value that could be a className (`var(--token)` → use the utility).
9. **Never use bare arbitrary literals** (`bg-[#6366f1]`, `h-[40px]`). Use registered utilities; `var()` arbitraries only where no utility exists.
10. **Never put `--ext-*` custom variants inside the core semantic block** — they get their own separate block.
11. **Never write a DarkMode story without both `data-theme="dark"` and `.dark`** (and `max-w-2xl`).
12. **Never reference Shadcn by name in shipped code/docs**, and never wire in its CLI/`components.json` — we hand-write off the pattern.
13. **Never use package import paths** between v2 files — relative imports only.

---

## Always do this in v2

1. **Read [components/v2/Button/](components/v2/Button/) first** — it's the reference for every rule here.
2. **Build under `components/v2/<Name>/`** with the file set above.
3. **Check whether a Radix primitive exists** before building anything with an a11y/keyboard/portal surface.
4. **Style with standard semantic utilities** (`bg-primary`, `border-input`, `ring-ring`).
5. **Use `cva` for variants, `cn()` to merge, `forwardRef` + `displayName`.**
6. **Use `asChild` + Radix `Slot`** for polymorphic rendering.
7. **Add semantics to `semantics.css` (both `:root` and `@theme inline`)** if a genuinely new core semantic is justified.
8. **Add `--ext-*` tokens (own block) for brand variants**, chained to a primitive.
9. **Write a DarkMode story** and confirm theming re-themes live.
10. **Verify through `tsc --noEmit` + a scoped Storybook/Vite build + `npm run lint`.**
11. **Author new v2 components via the `component-builder-v2` skill** once it's validated.

---

## Key principles — in order of priority

1. **2-tier integrity** — primitive → semantic, never skip, never hardcode. No component-token tier.
2. **Standard semantic vocabulary** — consume ShadCN/Tailwind names; only `--ext-*` for brand variants.
3. **Radix-first** — use the primitive if it exists; don't re-roll a11y.
4. **ShadCN component pattern** — `cva` + `cn` + `forwardRef` + `Slot`.
5. **Theme-awareness** — every semantic works in light and dark (`@theme inline` makes overrides live).
6. **v2 isolation** — never entangle with the frozen 3-tier code at root.

---

*Project: GeekLego v2 — open-source, design-system-first component library*
*Architecture: 2-tier tokens (primitives → standard ShadCN semantics) + ShadCN/Radix components*
*Stack: React 19 + TypeScript 5.7 + Tailwind CSS v4 + Radix UI + Storybook 10 + Vite 6*
*Reference component: `components/v2/Button/` · This file is the authoritative source for v2 rules.*
*Last updated: 2026-06-22*
