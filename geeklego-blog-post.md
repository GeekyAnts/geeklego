# Geeklego: The Open-Source React Component Library Built for the AI Era

*An AI-native, design-system-first component library with 80 production-ready components, a visual token editor, and Claude Code skills that generate consistent, accessible UI in minutes — not days.*

---

## The Problem With Every Component Library You've Used

You've been there. You install a popular React component library, spend a week customizing it to match your brand, and three months later your codebase is a graveyard of hardcoded hex values, overridden styles, and one-off `className` hacks that no one dares touch.

Or you go the other route — you build your own design system from scratch. Six months in, you have 40 inconsistently named tokens, a Button that doesn't respond to dark mode correctly, and a team of engineers who've each discovered their own way to truncate text.

The root cause of both problems is the same: **component libraries are built component-first, not design-system-first.** The design system is an afterthought — extracted from implementations after the fact, gradually formalized, never quite enforced.

**Geeklego is our answer to this problem.** And it's open source.

---

## What Is Geeklego?

Geeklego is an **open-source, design-system-first React component library** built on Tailwind CSS v4. It ships three things:

1. **A design system** — a single CSS file (`geeklego.css`) that is the authoritative source of truth for every visual value in the library
2. **80 production-ready components** — atoms, molecules, and organisms that are expressions of that design system, built with React 19 and full TypeScript support
3. **An AI generation layer** — Claude Code skills that generate new components, sync with Figma, audit for accessibility and security, and add internationalization — all while preserving design integrity automatically

But Geeklego is more than a component library. It's a philosophy: **define the system first, build everything else from it.**

---

## The Vision: AI That Amplifies, Not Replaces

We're living through a moment where AI is changing how software gets built. Most tools respond to this by letting AI generate code that looks reasonable locally but breaks global consistency over time. Every new component introduces a slightly different spacing value, a slightly different color, a slightly different interaction pattern.

Geeklego's vision is different: **AI should be constrained by your design system, not set loose on your codebase.**

When Claude Code generates a component in Geeklego, it can't hardcode `#6366f1`. It can't use `h-[40px]`. It can't reach past the semantic layer to grab a primitive directly. The architecture makes inconsistency structurally impossible — not just a guideline someone has to remember.

The result: a future where you define the system once, and AI generates components that follow it perfectly. Hundreds of components, zero design drift. That's the Geeklego promise.

---

## Design-System-First: The Architecture That Changes Everything

In every component library you've used, the design system *emerges* from component code. You build a Button, extract its colors into variables, build a Card, extract its spacing, and over time something resembling a design system appears.

Geeklego inverts this completely.

Before a single component is written, the design system is defined and published. Components are built *as expressions* of the system, constrained to use only what the system provides.

### The Three-Tier Token Chain

The core of Geeklego's architecture is a three-tier token chain:

```
Primitives → Semantics → Component Tokens
```

**Primitives** are raw values — `--color-brand-500: #6366f1`, `--spacing-4: 1rem`. These are the foundation. Nothing references them directly.

**Semantics** give purpose to primitives — `--color-action-primary: var(--color-brand-500)`. When you toggle dark mode, semantic tokens update. Primitives stay unchanged.

**Component tokens** bind components to semantics — `--button-bg: var(--color-action-primary)`. A component token must always reference a semantic. Breaking this chain is forbidden.

Here's why this matters in practice. When you toggle dark mode, you update one semantic token:

```css
[data-theme="dark"] {
  --color-action-primary: var(--color-brand-400);
}
```

That's it. Every component that uses `--button-bg`, which references `--color-action-primary`, automatically renders correctly. No per-component dark mode overrides. No `!important` patches. One change, everywhere.

### No Arbitrary Values. Ever.

Geeklego forbids Tailwind arbitrary values like `bg-[#6366f1]` or `h-[40px]`. Every value — every color, every size, every spacing unit — must come from a token.

The only permitted syntax is `bg-[var(--button-bg)]`, wrapping a CSS variable in Tailwind v4's arbitrary value syntax.

This constraint has a profound side effect: **AI can only generate valid code.** When Claude Code generates a component, there's nowhere to put a hardcoded value. The language doesn't permit it. Design integrity is enforced by architecture.

---

## What Ships With Geeklego Today

### 80 Production-Ready Components

Geeklego currently ships three levels of the component hierarchy:

**L1 Atoms (40 components)** — the building blocks: Avatar, Badge, Button, Checkbox, Input, Select, Spinner, Switch, Tooltip, and 31 more. Atoms import nothing — they're pure expressions of the design system.

**L2 Molecules (25 components)** — combinations of atoms: AlertBanner, Card, Combobox, DateInput, DropdownMenu, FormField, Pagination, SearchBar, StatCard, Toast, and 15 more.

**L3 Organisms (15 components)** — full UI sections: Accordion, AreaChart, BarChart, DataTable, Datepicker, Drawer, Form, Modal, Sidebar, Tabs, and 5 more.

**L4 Templates and L5 Pages** are in active development. DashboardLayout, AuthLayout, and LandingLayout are coming next.

Every component ships with:
- Full TypeScript types and JSDoc-annotated props
- Light and dark mode support
- WCAG 2.1 Level AA accessibility (keyboard nav, ARIA, focus management)
- Responsive design via Tailwind responsive prefixes
- 8 Storybook stories per component (used as automated tests via Vitest)
- Optional Schema.org markup for SEO
- Optional i18n string support

### A Visual Token Editor

`npm run dev` opens a full React app at `localhost:5173` for editing the design system without touching code.

Six tabs: Primitives, Semantics, Components, Typography, Export, Responsive. Changes preview instantly across Storybook via WebSocket. Full undo/redo history. Automatic backup. Token validation. Export as CSS or JSON.

This means designers can edit the design system directly. Not in a Notion doc that may or may not reflect the code. In the actual source of truth, with live preview.

### Storybook as Living Tests

Geeklego treats Storybook stories as executable tests. Each `.stories.tsx` file becomes a Vitest test running headless in Chromium via Playwright. No separate test infrastructure. Stories serve double duty as documentation and automated regression tests.

Every component requires eight stories: default, variant A, variant B, size/scale, disabled state, loading state, dark mode, and an accessibility story tagged for WCAG audit.

---

## The AI-First Layer: Claude Code Skills

This is where Geeklego separates itself from every other component library.

Geeklego ships with six Claude Code skills — self-contained prompt engines that guide AI through specific development workflows:

**`/component-builder`** — Generate a new component end-to-end. Type `/component-builder build a Tooltip atom` and Claude Code reads the design system, writes component tokens, generates all five required files, and runs accessibility, performance, SEO, and security audits automatically. A component that takes a human two to three hours ships in two to three minutes.

**`/figma-sync`** — Sync design tokens between code and Figma. The skill diffs variable collections and text styles, then creates or updates Figma variables to match `geeklego.css`. Design and code stay in sync automatically.

**`/i18n`** — Add internationalization to any component without picking a specific i18n library. Library-agnostic, prop-first, with RTL support via logical CSS properties.

**`/state-handling`** — Audit and fix visual state patterns. Every interactive component needs correct loading, disabled, error, and selected states — this skill generates and validates them.

**`/security-review`** — Audit components for XSS vulnerabilities, improper href handling, unsafe `target="_blank"` usage, and unsanitized user input.

**`/screenshot-workflow`** — Generate component screenshots automatically for documentation or CI/CD pipelines.

And these audit commands run on demand against the entire codebase:

```bash
do a refactor check     # Memoization, hooks compliance, performance utilities
do a reuse audit        # Find inlined markup that should use existing atoms
do an SEO audit         # Schema.org coverage, semantic HTML compliance
```

The entire architecture — 45 explicit "never do" rules, 49 "always do" rules, naming conventions, token chains, component hierarchy — is documented in `CLAUDE.md` specifically for AI consumption. Claude Code reads it before every task. Design integrity is preserved not by hope, but by the system.

---

## How It Compares

You might be wondering: isn't this just Shadcn with extra steps?

It isn't. The philosophies are fundamentally different.

Shadcn is a distribution model. You copy components into your codebase and own them completely. It's great when you want total control and are willing to maintain every line yourself. There's no enforced design system — you can override anything, which is both its power and its weakness.

Geeklego is a design-system-first framework. You fork it, define your design system, and generate components from it. The system constrains what components can do. You can't accidentally introduce a hardcoded value or skip a token tier. Consistency is structural, not cultural.

| | Shadcn | Geeklego |
|---|---|---|
| Token architecture | No formal system | 3-tier: primitive → semantic → component |
| Dark mode | Manual CSS variable overrides | Automatic via semantic tokens |
| Component generation | Manual copy-paste | AI skill with full audit pipeline |
| Figma integration | Manual | Automated sync skill |
| AI-readiness | Not designed for it | Built from the ground up |
| Token editor | None | Visual editor with live preview |
| Accessibility | Basic (Radix patterns) | WCAG 2.1 AA, custom audits |
| i18n | Not included | Library-agnostic, built-in |

The right choice depends on your needs. If you want to own every line with maximum flexibility, Shadcn is excellent. If you want AI-amplified consistency that scales across teams and brands, Geeklego is built for you.

---

## Real-World Use Cases

**Rapid prototyping.** Edit the design system in the token editor. Use `/component-builder` to generate components that match. Preview in Storybook. Sync tokens to Figma for designer feedback. When the design is locked, your production components are ready. Two days instead of two weeks.

**Design system governance at scale.** Define your tokens. Every team generates components via `/component-builder` — they can't deviate because the architecture prevents it. Run audits on PRs. The design system becomes enforceable by architecture, not by policy. Code reviews drop from 30 minutes to 5 minutes.

**Multi-brand products.** Fork Geeklego twice. Each fork has its own `geeklego.css` with its own colors, fonts, and spacing. Both forks share identical component logic. Update the logic once, both brands benefit. Maintain one codebase, support multiple brands.

**Accessible component libraries.** Accessibility is built into the component-builder skill — not bolted on after. Every generated component includes the right ARIA attributes, keyboard navigation patterns, touch targets, and semantic HTML. WCAG 2.1 AA by default, not by accident.

---

## Getting Started in 3 Minutes

```bash
git clone https://github.com/GeekyAnts/geeklego.git
cd geeklego
npm install
npm run dev:all
```

Two apps open:
- `localhost:5173` — the token editor
- `localhost:6006` — Storybook with all 80 components

From there, open the project in Claude Code and type `/help` to see all available skills. Generate your first component with `/component-builder build a [ComponentName] [level]`.

To use Geeklego as a package in your existing project:

```bash
npm install geeklego
```

```typescript
import { Button, Card, Modal } from 'geeklego';
import 'geeklego/styles';
```

---

## How to Contribute

Geeklego is open source and actively welcoming contributors. The remaining work on the roadmap includes HeroSection (L3), DashboardLayout, AuthLayout, and LandingLayout (L4 Templates).

Every component follows the same pattern — 5 files, the token chain, 8 Storybook stories. The `CLAUDE.md` and Claude Code skills make it straightforward to generate a contribution that meets the bar from the start.

**GitHub:** https://github.com/GeekyAnts/geeklego  
**Website:** https://geeklego.dev  
**Issues & discussions:** open a thread on GitHub

Give it a star, open an issue, or use `/component-builder` to send us a PR. We'd love to see what you build.

---

*Geeklego is open source under the MIT license. Built with React 19, Tailwind CSS v4, Vite 6, Storybook 10, and Vitest.*

---

**Meta description:** Geeklego is an open-source, design-system-first React component library with 80 production-ready components, a visual token editor, and Claude Code AI skills that generate consistent, accessible UI in minutes. Built on Tailwind CSS v4.

**Primary keyword:** React component library  
**Secondary keywords:** design system, open source component library, Tailwind CSS v4 components, AI component generation, design tokens

**Suggested tags:** react, design-system, open-source, tailwind-css, typescript, component-library, ai-development, frontend
