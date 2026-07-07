# GeekLego Sync — Figma plugin

Deterministic **code → Figma** sync for the GeekLego v2 design system. Two
capabilities:

- **Sync Tokens** — the 2-tier token chain becomes native Figma Variables
  (light/dark modes, alias chain preserved), grouped into four collections
  (`01 · Primitives`, `02 · Semantics`, `03 · Ext`, `04 · Typography`).
- **Import component** — turns a scraped component manifest into a native Figma
  **variant set** (Auto Layout + Variant/Size/Disabled properties + a Label
  text property) with fills/stroke/radius/text-color **bound** to the semantic
  variables. Currently ships Button; more as descriptors + scrapes are added.

Both run from one plugin, no network, no agent. Run **Sync Tokens** before
importing so the bindings resolve.

## How it works

- The plugin build **bakes in the current IR** (`dist/ir/tokens.json`, the
  W3C-DTCG export from `pnpm run export-ir`). "Sync Tokens" needs zero input
  and the plugin needs **no network access**. Rebuild the plugin whenever
  tokens change. An ad-hoc IR can be pasted in the UI to override.
- Mapping (mirrors the 2-tier model):
  - Tier-1 primitives → collection **`01 · Primitives`** (single `Value` mode),
    names like `color/brand/600`, `radius/lg` (px), `fontFamily/sans`.
  - Tier-2 semantics → collection **`02 · Semantics`** (modes `Light`/`Dark`),
    bare ShadCN names (`primary`, `background`, `radius`), values are
    **variable aliases** into Primitives — the `var()` chain, 1:1.
  - `--ext-*` variants → collection **`03 · Ext`** (`Light`/`Dark`).
  - Text Styles: one per `fontSize` step (`text/base`, `text/xl`, …), paired
    with `lineHeight` where the step exists in both groups (else AUTO).
- Tokens with no Figma variable type (easing `cubicBezier`, composite
  `shadow`) are skipped and listed in the sync report.
- Idempotent: re-running matches collections/variables/styles **by name** and
  updates values — no duplicates.

## Build

```bash
# 1. Generate the component manifest (Playwright scrapes the real components):
pnpm run figma:component-manifest        # all registered; or: … Button
# 2. Bundle the plugin (also regenerates the IR, bakes both manifests in):
pnpm run figma-plugin:build              # → figma-plugin/dist/code.js
```

The component manifest is optional at build time — the plugin builds with an
empty component list if you haven't run the generator yet.

## Load in Figma (development)

1. Open any Figma **design file** (desktop app).
2. Menu → **Plugins → Development → Import plugin from manifest…**
3. Pick `figma-plugin/manifest.json`.
4. Run **GeekLego Sync** → click **Sync Tokens**.
5. Check: Local variables panel shows the four collections; toggling the
   `02 · Semantics` mode between Light/Dark re-themes anything bound to a
   semantic; semantic values display as aliases (chips), not raw colors.
6. Under **Components**, click **Import** on Button → a variant set appears on
   the canvas. Check: variant properties (Variant/Size/Disabled) in the right
   panel; a fill/stroke on a variant shows as a **bound variable** (chip), and
   switching the semantic mode re-themes the imported component too.

> Fonts: text needs the component's font family (e.g. Inter) available in
> Figma. A missing font degrades to the default and is reported, never a crash.
>
> Re-syncing after a token rename leaves the old-named variables behind — delete
> the old collections first for a clean state (a "nuke & recreate" toggle is a
> planned follow-up).

## Tests

The token mapper is a pure module tested against the real IR:

```bash
npx vitest run figma-plugin
```

## Layout

```
figma-plugin/
├── manifest.json          Figma plugin manifest (dev id placeholder)
├── vite.config.mts        sandbox bundle build + IR baking (define)
├── src/
│   ├── code.ts            sandbox: executes the SyncPlan via figma.variables
│   ├── ui.html            iframe UI — hand-written, no build step
│   └── token-sync/        PURE mapper: IR → SyncPlan (+ oklch→sRGB, rem→px)
└── dist/code.js           build output (gitignored)
```
