# Using GeekLego in a client app

This guide walks through consuming GeekLego from a separate React project — how the package is produced, how to install it, how to load its styles, and how to keep the client in sync when tokens change.

> **TL;DR**
> 1. In the GeekLego repo, generate `dist/` — click **Export to CSS** in the Token Editor or run `pnpm run build` — then `pnpm pack --pack-destination ../packs`.
> 2. In the client: `pnpm add ../packs/geeklego-ui-0.1.0.tgz lucide-react`
> 3. Import the styles once (`@geeklego/ui/styles`, or `@geeklego/ui/styles-source` if the client runs Tailwind v4).
> 4. `import { Button } from "@geeklego/ui";` — works in Vite apps and directly in Next.js Server Components.

---

## 1. How the package is produced: the `dist/` folder

Everything a client app consumes lives in `dist/`:

| Path | What it is | Consumed via |
|---|---|---|
| `dist/index.js` | ES module entry — re-exports every component and helper from the split modules below | `import … from "@geeklego/ui"` |
| `dist/components/`, `dist/utils/`, `dist/chunks/` | One ES module per component/helper plus shared chunks, so bundlers can drop what you don't use | automatic (via `index.js`) |
| `dist/index.cjs` | CommonJS build (a single file) | `require("@geeklego/ui")` |
| `dist/index.d.ts` / `index.d.cts` | TypeScript declarations | automatic |
| `dist/geeklego.css` | Compiled, minified stylesheet (Tailwind preflight + every utility the components use + your tokens + dark theme) | `import "@geeklego/ui/styles"` |
| `dist/styles.d.ts` | Types for the CSS-only `styles` / `styles-source` exports | automatic |
| `dist/ir/`, `dist/figma/` | Token IR and Figma manifests — **not** packed or used by client apps | — |

Component modules carry a `"use client"` directive; server-safe helpers (`buttonVariants()` and the other `*Variants` functions, `sanitizeHref`, the ARIA helpers) don't, so they stay callable on the server.

### `dist/` is gitignored

`dist/` is listed in `.gitignore`, so it is **never committed and never present in a fresh clone**. Every machine that packs or links GeekLego has to generate it locally first. If `dist/` is missing, the client fails with a module-resolution error for `@geeklego/ui` (e.g. Vite's *"Failed to resolve entry for package"*, or *"Cannot find module"*).

### How `dist/` gets (re)generated

There are two ways, and both run the same full build (`tsup` for the JS + types, then `build:css` for the stylesheet):

**A. Automatically, from the Token Editor**

```
Token Editor  ──"Export to CSS"──▶  writes design-system/v2/*.css
                                     │
                                     ▼
                            POST /api/sync-build
                                     │
                                     ▼
                   pnpm run sync-build  →  pnpm run build
                                     │
                     ┌───────────────┴───────────────┐
                     ▼                               ▼
     tsup → dist/index.*, components/, …     build:css → dist/geeklego.css
```

1. Start the Token Editor: `pnpm run dev`.
2. Edit tokens, then open **Export** and click **Export to CSS**.
3. The editor saves your tokens to `design-system/v2/` and, in the background, rebuilds `dist/`. **Restore Default** triggers the same rebuild.

Things to know about the automatic rebuild:

- **It runs in the background.** The export finishes before the build does — give it ~10 seconds. Check `ls -l dist/` to confirm the timestamps updated.
- **Build failures are quiet.** A failed build only logs `Post-export CSS build failed` in the browser devtools console; the UI doesn't show it. If `dist/` didn't update, run `pnpm run build` in a terminal to see the error.
- **Only token exports trigger it.** If you change component code in `components/v2/`, the Token Editor does nothing — rebuild manually.
- **It happens on the machine running the Token Editor.** Other machines still need to build their own `dist/`.
- **It updates `dist/`, not your client.** A `link:` client sees the new build immediately; a tarball or `file:` client needs a repack/reinstall (section 10).

**B. Manually**

```bash
cd /path/to/geeklego
pnpm install        # first time only
pnpm run build      # → dist/index.js, components/, index.cjs, index.d.ts, geeklego.css, …
```

Use this after a fresh clone, after pulling changes, after editing components, or whenever you're unsure `dist/` is current. `pnpm run build:css` rebuilds only the stylesheet (enough after a pure token change).

---

## 2. Prerequisites

| Requirement | Why |
|---|---|
| The GeekLego repo cloned locally, with `dist/` built | The package isn't on npm yet (see step 3) |
| **React 19** + **react-dom 19** in the client | Peer dependency |
| **lucide-react** in the client | Peer dependency — 21 components render Lucide icons |
| **Tailwind CSS v4** *(optional)* | Only if the client wants to write its own Tailwind classes — see option B in step 4 |

The other runtime libraries (Radix UI, `cmdk`, `sonner`, `recharts`, `react-hook-form`, `@tanstack/react-table`, …) are GeekLego dependencies — you don't install them yourself.

---

## 3. Install the package

`@geeklego/ui` is **not published to npm yet**. Pick one of three local install methods:

| Method | Best for | Picks up a rebuild of `dist/`? |
|---|---|---|
| **Tarball** (recommended) | Client apps — installs exactly what an npm release would | After repack + `pnpm install` |
| **`file:`** | Client apps on the same machine, no tarball to manage | After `pnpm install` |
| **`link:`** | Developing GeekLego itself alongside a client | Immediately (symlink) |

### Tarball (recommended)

```bash
# in the GeekLego repo
pnpm run build
pnpm pack --pack-destination ../packs        # → ../packs/geeklego-ui-0.1.0.tgz

# in the client app
pnpm add ../packs/geeklego-ui-0.1.0.tgz lucide-react
```

The tarball contains only what a client needs (`dist/` JS + types + CSS, `design-system/v2/`, README, LICENSE). npm and Yarn can install the same `.tgz`. To update: rebuild, repack to the same path, and run `pnpm install` in the client.

### `file:`

```bash
pnpm add @geeklego/ui@file:/absolute/path/to/geeklego lucide-react
```

This copies the same file set as the tarball into the client. Run `pnpm install` in the client again after each GeekLego rebuild.

### `link:`

```bash
pnpm add @geeklego/ui@link:/absolute/path/to/geeklego lucide-react
```

This symlinks the whole repo, so the client always sees the current `dist/` — handy while you're changing GeekLego. The catch: the client can pick up the repo's own copy of React (see *Invalid hook call* in section 12).

> The repo's `only-allow pnpm` guard only fires inside the GeekLego repo itself, so installing the package with npm or Yarn in a client app works.

---

## 4. Load the styles (pick one)

### Option A — Compiled CSS (client does **not** use Tailwind)

Import the prebuilt stylesheet once, at your app's entry point:

```tsx
// src/main.tsx
import "@geeklego/ui/styles";   // → dist/geeklego.css
```

That's it. It contains a CSS reset (Tailwind preflight), the Google Fonts `@import`s, all tokens, the dark theme, and every utility the components use.

The catch: it only contains the utilities GeekLego itself uses. If you write a class like `tracking-widest` in your own markup and GeekLego doesn't use it, it won't exist. If you want to style your own layout with Tailwind, use option B.

### Option B — Source CSS (client uses Tailwind v4)

The client's Tailwind build compiles GeekLego's tokens **and** your classes together, so you get one stylesheet with no duplicates.

1. Install Tailwind v4 and its integration for your bundler:

   ```bash
   # Vite
   pnpm add -D tailwindcss @tailwindcss/vite
   # Next.js / PostCSS
   pnpm add -D tailwindcss @tailwindcss/postcss
   ```

2. Wire up the plugin:

   ```ts
   // vite.config.ts
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";
   import tailwindcss from "@tailwindcss/vite";

   export default defineConfig({
     plugins: [react(), tailwindcss()],
   });
   ```

   ```js
   // postcss.config.mjs (Next.js)
   export default { plugins: { "@tailwindcss/postcss": {} } };
   ```

3. Make GeekLego's source CSS your Tailwind entry and point Tailwind at the component bundle:

   ```css
   /* src/index.css (Vite) or app/globals.css (Next.js) */
   @import "@geeklego/ui/styles-source";
   @source "../node_modules/@geeklego/ui/dist";

   /* your own CSS below */
   ```

   - `@geeklego/ui/styles-source` already contains `@import "tailwindcss"`. **Remove your own `@import "tailwindcss"`** — don't import it twice.
   - The `@source` line is **required**. Tailwind skips `node_modules` by default, and without it some component classes are silently dropped. Adjust the relative path so it points from your CSS file to `node_modules/@geeklego/ui/dist`.
   - Keep the GeekLego import **first** in the file — its Google Fonts `@import`s must come before everything else.

4. Import that CSS file once at your entry point (`import "./index.css";`, or in `app/layout.tsx` for Next.js).

Your own markup can now use every Tailwind utility plus all of GeekLego's semantic ones (`bg-primary`, `text-muted-foreground`, `border-border`, …).

> **Don't combine A and B.** Loading both ships two resets and two copies of every utility.

---

## 5. Add the app-level providers

Most components work standalone. A few need a provider or a mount point near the root:

| Component | What to add | Required? |
|---|---|---|
| **Tooltip** | Wrap the app in `<TooltipProvider>` | Yes, for tooltips |
| **Sonner** (toasts) | Render `<Toaster />` once, then call `toast("…")` anywhere | Yes, for toasts |
| **Sidebar** | Wrap the layout in `<SidebarProvider>` | Yes — Sidebar throws without it |
| **i18n** | `<GeeklegoI18nProvider strings={…} locale="…">` to localize built-in labels ("Close", "No results", …) | Optional — English defaults otherwise |

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TooltipProvider, Toaster, GeeklegoI18nProvider } from "@geeklego/ui";
import "@geeklego/ui/styles"; // or "./index.css" for option B
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GeeklegoI18nProvider strings={{ dialog: { closeLabel: "Fermer" } }} locale="fr">
      <TooltipProvider>
        <App />
        <Toaster />
      </TooltipProvider>
    </GeeklegoI18nProvider>
  </StrictMode>,
);
```

---

## 6. Use the components

Everything is a named export from `@geeklego/ui`, including compound parts:

```tsx
import {
  Button,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  Input,
  toast,
} from "@geeklego/ui";

export function App() {
  return (
    <main className="min-h-screen bg-background text-foreground p-8 space-y-4">
      <Input placeholder="Email" />

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hello</DialogTitle>
            <DialogDescription>From GeekLego</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Button onClick={() => toast.success("Saved")}>Save</Button>
    </main>
  );
}
```

Conventions that hold across the library:

- **Variants and sizes** are props: `<Button variant="outline" size="sm">`.
- **`className` merges last**, so your classes override the defaults cleanly: `<Button className="w-full">`.
- **`asChild`** renders the styling onto your own element, e.g. a router link: `<Button asChild><Link to="/pricing">Pricing</Link></Button>`.
- **Refs** are forwarded to the underlying DOM element.
- Browse every component, variant and prop in Storybook (`pnpm run storybook` in the GeekLego repo).

---

## 7. Framework notes

### Vite (React)

Works as shown above. Bundlers drop the components you don't import — a test app using Button, Dialog, Input, Tooltip and Toaster ships ~375 kB of JS minified (~118 kB gzipped), React included.

### Next.js (App Router)

Import components **directly**, including in Server Components — the component modules carry their own `"use client"` directive:

```tsx
// app/page.tsx — a Server Component
import { Button, Dialog, DialogTrigger, DialogContent, DialogTitle } from "@geeklego/ui";

export default function Page() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
      <DialogContent><DialogTitle>Rendered from a server page</DialogTitle></DialogContent>
    </Dialog>
  );
}
```

**Add `optimizePackageImports`.** Without it, Next ships every GeekLego client component (including recharts, cmdk, sonner, vaul and TanStack Table) to any page that imports from the package:

```js
// next.config.mjs
export default {
  experimental: { optimizePackageImports: ["@geeklego/ui"] },
};
```

In testing, a page using Button + Dialog went from 290 kB to 24 kB of route JS with this setting.

Load the CSS in `app/layout.tsx` (`import "./globals.css";` using option B with `@tailwindcss/postcss`, or `import "@geeklego/ui/styles";` for option A). Providers from step 5 render context, so put them in a small `"use client"` `providers.tsx` and wrap `{children}` with it in the layout.

---

## 8. Dark mode

Dark mode is driven by the dark theme's semantic overrides and turns on with **either** selector:

```html
<html class="dark">            <!-- or -->
<html data-theme="dark">
```

- **Put it on `<html>`, not on a wrapper div.** Dialogs, popovers, tooltips, menus and toasts render in a portal under `<body>`; they only pick up dark mode if the class is on an ancestor of `<body>`.
- Toggle it with `document.documentElement.classList.toggle("dark")`, or let a library like `next-themes` manage the class.
- **Toasts follow automatically** — no `theme` prop needed on `<Toaster />`. You can still pass `theme` to force one.

---

## 9. Theming

### Brand-wide (recommended)

Change tokens in the **Token Editor**, click **Export to CSS**, and let `dist/` rebuild (section 1). Then update the client: a `link:` client picks it up on its next build or dev-server reload; a tarball or `file:` client needs a repack/reinstall (section 10). This keeps every client app on the same brand.

### Per-app overrides

To adjust one app without changing the shared tokens, override the semantic variables **after** GeekLego's stylesheet:

```css
@import "@geeklego/ui/styles-source";   /* or load @geeklego/ui/styles before this file */
@source "../node_modules/@geeklego/ui/dist";

:root {
  --primary: var(--color-brand-600);
  --radius: var(--radius-md);
}

.dark,
[data-theme="dark"] {
  --primary: var(--color-brand-400);
}
```

Point semantics at existing primitives (`--color-brand-*`, `--color-accent-*`, `--color-neutral-*`, `--radius-*`, …) instead of raw hex values, so the app stays on the token chain. Every component re-themes live — no rebuild of GeekLego needed.

---

## 10. Keeping the client in sync

**Step 1 — rebuild GeekLego:**

| You changed… | Do this in the GeekLego repo |
|---|---|
| Tokens, in the Token Editor | **Export to CSS** (auto-rebuilds `dist/`) |
| Tokens, by editing CSS files | `pnpm run build:css` |
| Component code | `pnpm run build` |
| Pulled new commits | `pnpm install && pnpm run build` |

**Step 2 — update the client:**

| Install method | Do this in the client |
|---|---|
| Tarball | Repack in GeekLego (`pnpm pack --pack-destination ../packs`), then `pnpm install` |
| `file:` | `pnpm install` |
| `link:` | Nothing — reload the dev server / rebuild |

If the client dev server doesn't pick up the change, restart it.

---

## 11. Verify the integration

After setup, a quick check in the client:

- [ ] `pnpm run build` (or `tsc --noEmit`) passes — the `@geeklego/ui` types resolve.
- [ ] A `<Button>` renders with the brand's colour, radius and font — not unstyled browser defaults.
- [ ] A `<Dialog>` opens, traps focus and closes with Escape.
- [ ] Adding `class="dark"` to `<html>` flips the page **and** an open dialog to dark.
- [ ] The browser console has no errors.

---

## 12. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Failed to resolve entry for package "@geeklego/ui"` / `Cannot find module` | `dist/` wasn't built before packing/installing | `pnpm run build` in GeekLego, repack, reinstall |
| Client doesn't show the latest tokens or component changes | Tarball / `file:` installs are snapshots | Rebuild, repack, `pnpm install` (section 10) |
| Components render unstyled | No stylesheet imported | Import `@geeklego/ui/styles` or set up option B |
| Some states/variants unstyled (option B) | Missing `@source` line, or wrong relative path | Add `@source "…/node_modules/@geeklego/ui/dist";` (step 4) |
| Next.js: *"needs `createContext`… only works in a Client Component"* | The client has an old build without `"use client"` directives | Rebuild GeekLego, repack, reinstall |
| Next.js pages ship recharts / cmdk / sonner they don't use | `optimizePackageImports` not set | Add it to `next.config` (section 7) |
| Portalled content (dialog, menu) stays light in dark mode | `.dark` set on a wrapper, not `<html>` | Set it on `document.documentElement` |
| Token Editor export didn't change the client | Background build failed, or the client wasn't updated | Check the devtools console; run `pnpm run build`; then update the client (section 10) |
| *"Invalid hook call"* / two copies of React (`link:` installs) | The linked repo's own React was picked up | Use a tarball or `file:` install, or in Vite add `resolve: { dedupe: ["react", "react-dom"] }` |
| Fonts fall back to system fonts | Google Fonts blocked (offline, CSP) | Allow `fonts.googleapis.com` / `fonts.gstatic.com`, or self-host and override `--font-*` |

---

## 13. Current limitations

- **Not on npm yet** — install from a tarball, `file:` or `link:`. The package metadata (`files`, `exports`, `sideEffects`, `"use client"` directives) is ready for a release.
- **No per-component import paths** (`@geeklego/ui/button`) — import from the package root; Next.js needs `optimizePackageImports` to trim unused components.
- **The CommonJS build is a single file**, so `require()` consumers load the whole library. Bundlers use the split ES build.
