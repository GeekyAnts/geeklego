# GeekLego

An open-source, design-system-first React component library built on **Tailwind CSS v4 + Radix UI**.

GeekLego pairs a **2-tier token system** (your brand primitives → a standard semantic vocabulary) with **53 accessible components** and a **Token Editor** for retheming the whole library live. Fork it, point the semantics at your brand palette, and ship your own themed component library.

## Get started

```bash
git clone https://github.com/GeekyAnts/geeklego.git
cd geeklego
pnpm install
pnpm run dev:all
```

This starts two tools side-by-side:

| URL | What it is |
|---|---|
| `http://localhost:5173` | **Token Editor** — edit primitives, semantics and themes; export to CSS / IR / design.md |
| `http://localhost:6006` | **Storybook** — browse every component, its variants and dark mode |

> **Use pnpm.** Dependencies are managed with pnpm and a `preinstall` guard blocks `npm install` / `yarn`. Running scripts with `npm run …` still works.

## Requirements

- Node.js 24 (pinned in `.nvmrc` / `.node-version`; `>=20.19` is the minimum)
- pnpm 9+
- React 19 and Tailwind CSS v4 in the consuming app

## How it works

```
Tier 1 — Primitives   your brand palette and scales
                      --color-brand-900   --spacing-4   --radius-lg   --text-base
                          ↓ aliased by
Tier 2 — Semantics    a standard semantic vocabulary
                      --primary   --background   --border   --ring   --card   --radius
                          ↓ consumed by
Components            plain Tailwind utilities
                      bg-primary  text-primary-foreground  border-input  ring-ring
```

- **Components only ever use semantics**, never primitives or hardcoded values.
- **A theme** is a set of semantic overrides. Dark mode ships in `themes/dark.css` and activates with either `data-theme="dark"` or `.dark` on any ancestor.
- **A brand fork** re-points the semantics at different primitives — no component code changes.
- Semantics are registered with Tailwind's `@theme inline`, so overrides re-theme live without a rebuild.

Beyond the core set (`background`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `card`, `popover`, `radius`), GeekLego adds **status** (`success`, `warning`, `info`), **brand**, **chart** and **sidebar** semantics.

## Components

Each component is built from `cva` variants + a `cn()` class merger + Radix primitives where there's an accessibility or keyboard surface (focus traps, dismissal, roving focus, portals).

| Group | Components |
|---|---|
| **Forms & inputs** | Button · Input · Textarea · Label · Checkbox · RadioGroup · Switch · Select · Slider · Toggle · ToggleGroup · Combobox · InputOTP · Calendar · DatePicker · FileUpload · Form |
| **Overlays & menus** | Dialog · AlertDialog · Sheet · Drawer · Popover · HoverCard · Tooltip · DropdownMenu · ContextMenu · Menubar · Command · Sonner (toasts) |
| **Navigation & layout** | NavigationMenu · Breadcrumb · Pagination · Tabs · Sidebar · Accordion · Collapsible · Card · Resizable · ScrollArea · Separator · AspectRatio |
| **Data display** | Table · DataTable · Chart · PieChart · Avatar · Badge · Alert · Progress · Skeleton · Typography · Carousel · ProductCard |

`components/v2/Button/` is the reference implementation — read it before building or changing anything.

## Using the library

Build the package, then import components and the stylesheet from it:

```bash
pnpm run build   # → dist/index.js, dist/index.cjs, dist/index.d.ts, dist/geeklego.css
```

```tsx
import { Button, Dialog, DialogTrigger, DialogContent } from "@geeklego/ui";
import "@geeklego/ui/styles";            // compiled CSS (dist/geeklego.css)
// or, if your app runs Tailwind v4 itself:
import "@geeklego/ui/styles-source";     // source design-system/v2/index.css

export function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open</Button>
      </DialogTrigger>
      <DialogContent>Hello from GeekLego</DialogContent>
    </Dialog>
  );
}
```

> `@geeklego/ui` is not published to npm yet. Until it is, consume the built `dist/` via a workspace or `file:` dependency, or copy components straight from `components/v2/`.

The package also exports a few shared helpers: `GeeklegoI18nProvider` (localized component strings), `sanitizeHref` / `getSafeExternalLinkProps`, ARIA prop helpers, `VisuallyHidden` and `StructuredData`.

## Custom brand variants

Brand-specific variants that fall outside the standard vocabulary use namespaced `--ext-<component>-<variant>-<property>` tokens — for example Button's `gamified` variant (`bg-ext-button-gamified-bg`). They live in their own block in `design-system/v2/semantics.css`, still alias a primitive, and never mix with the core semantics, so the themeable layer stays clean.

## Repository layout

| Path | Purpose |
|---|---|
| `design-system/v2/` | The token system. Entrypoint `index.css` imports `fonts.css` → `primitives.css` → `semantics.css` → `themes/dark.css` (order matters) |
| `design-system/v2-defaults/` | Factory-reset baseline the Token Editor diffs against — don't edit by hand |
| `components/v2/<Name>/` | One folder per component: `<Name>.tsx`, `<Name>.types.ts`, `<name>-variants.ts`, `<Name>.stories.tsx` |
| `components/v2/lib/` | Shared helpers (`cn.ts`) |
| `components/utils/` | Accessibility, security, i18n and structured-data helpers |
| `components/index.ts` | Package barrel — every new component must be re-exported here |
| `app/` | Token Editor (Vite app that reads and writes `design-system/v2/` live) |
| `figma-plugin/` | **GeekLego Sync** — code → Figma plugin for token variables and component import ([README](figma-plugin/README.md)) |
| `scripts/` | Token validation, IR / design.md export, token-usage scanning, Figma manifest generation |

## Scripts

```bash
pnpm run dev:all               # Token Editor + Storybook (recommended)
pnpm run dev                   # Token Editor only
pnpm run storybook             # Storybook only (port 6006)
pnpm run build                 # Library bundle (tsup) + compiled CSS
pnpm run build:css             # Compiled CSS only → dist/geeklego.css
pnpm run build-storybook       # Static Storybook
pnpm run validate-tokens       # Check the primitive → semantic chain (must exit 0)
pnpm run lint                  # ESLint, zero warnings allowed (enforces import rules)
pnpm run lint-css              # Stylelint over design-system/v2
pnpm run export-ir             # Export tokens as W3C-DTCG IR
pnpm run export-design-md      # Export tokens as design.md
pnpm run figma-plugin:build    # Build the Figma plugin
npx tsc --noEmit               # Type-check
npx vitest run                 # Unit tests
```

## Contributing

1. Read `components/v2/Button/` and [`CLAUDE.md`](CLAUDE.md) — the authoritative rules for tokens and components. [`AGENTS.md`](AGENTS.md) is the operational companion.
2. Build new components under `components/v2/<Name>/`, on a Radix primitive where one exists, styled with semantic utilities only.
3. Add the component to `components/index.ts`.
4. Before opening a PR: `npx tsc --noEmit`, `pnpm run lint`, `pnpm run validate-tokens` and `pnpm run build` should all pass.

### AI-assisted development

The repo ships Claude Code skills under `.claude/skills/`:

| Skill | Purpose |
|---|---|
| `component-builder-v2` | Generate new components that follow the token and component rules |
| `figma-sync` | Sync design tokens and components from code to Figma |
| `geeklego-foundation-import` | Import foundation components into the GeekLego Figma library |

## License

[MIT](LICENSE)

## Built by GeekyAnts

GeekLego is open-sourced and maintained by [GeekyAnts](https://geekyants.com) — engineering for the AI era, turning ambitious technology strategies into production-grade reality since 2006.

Building AI-native products? Explore [GeekyAnts AI Services](https://geekyants.com/ai).
