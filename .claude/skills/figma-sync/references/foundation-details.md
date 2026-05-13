# Foundation Sync — Detailed Reference

This file contains the detailed implementation patterns for creating and updating variable collections and text styles. Read this when you need to create variables from scratch (new collection or new variables during incremental sync).

---

## Variable Naming Convention

CSS custom property names map to Figma variable names using `/` for grouping:

| CSS Property | Figma Variable Name | Type |
|---|---|---|
| `--color-neutral-0: #ffffff` | `color/neutral/0` | COLOR |
| `--font-size-16: 1rem` | `font/size/16` | FLOAT |
| `--font-weight-bold: 700` | `font/weight/bold` | FLOAT |
| `--line-height-normal: 1.75rem` | `font/line-height/normal` | FLOAT |
| `--letter-spacing-tight: -0.025rem` | `font/letter-spacing/tight` | FLOAT |
| `--spacing-4: 1rem` | `spacing/4` | FLOAT |
| `--radius-md: 0.375rem` | `radius/md` | FLOAT |
| `--border-width-hairline: 1px` | `border-width/hairline` | FLOAT |
| `--opacity-50: 0.5` | `opacity/50` | FLOAT |
| `--z-index-modal: 400` | `z-index/modal` | FLOAT |
| `--duration-normal: 200ms` | `duration/normal` | FLOAT |
| `--size-component-md: 2.5rem` | `size/component/md` | FLOAT |
| `--size-icon-md: 1.25rem` | `size/icon/md` | FLOAT |
| `--size-avatar-md: 2rem` | `size/avatar/md` | FLOAT |
| `--shadow-color-neutral: #111827` | `shadow-color/neutral` | COLOR |
| `--breakpoint-md: 768px` | `breakpoint/md` | FLOAT |
| `--line-clamp-2: 2` | `line-clamp/2` | FLOAT |
| `--content-max-width-sm: 16rem` | `content-max-width/sm` | FLOAT |
| `--content-min-width-xs: 3rem` | `content-min-width/xs` | FLOAT |
| `--font-family-sans: "Inter", ...` | `font/family/sans` | STRING |
| `--ease-in-out: cubic-bezier(...)` | `easing/ease-in-out` | STRING |

## Token Naming Transformation Algorithm

Every CSS variable name must be transformed before use as a Figma variable name. Apply this three-step algorithm:

1. **Strip `var(...)` wrapper** — if the value is wrapped: `var(--foo-bar-baz)` → `--foo-bar-baz`
2. **Strip leading `--`** — `--foo-bar-baz` → `foo-bar-baz`
3. **Replace `-` with `/`** — `foo-bar-baz` → `foo/bar/baz`

The result is the Figma variable path. The naming table above shows the expected outputs for common cases.

**Hard rule:** A Figma variable name must never contain `--`, `var(`, or `)`. If an existing Figma variable has raw CSS syntax in its name, it is invalid and must be flagged in the Naming Audit section of the sync report. Do not silently accept it or work around it.

**Edge cases:**
- Numeric suffixes stay as-is: `--color-neutral-0` → `color/neutral/0`
- Multi-word segments stay connected via `/`: `--content-max-width-sm` → `content/max-width/sm` (note: the `-` between `max` and `width` becomes `/`, making it a three-level path `content/max/width/sm` — check against the naming table in the section above for the canonical form)
- `var()` references inside alias values are stripped the same way when resolving what a semantic token aliases

---

## Unit Conversions

All `rem` values convert to `px` (multiply by 16) for Figma FLOAT variables:
- `1rem` → `16` (px)
- `0.25rem` → `4` (px)
- `0.375rem` → `6` (px)

Values already in `px` or `ms` stay as raw numbers. Opacity values (0-1) stay as-is.

## Color Conversion

```js
const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#',''), 16);
  return { r: ((n>>16)&255)/255, g: ((n>>8)&255)/255, b: (n&255)/255, a: 1 };
};
```

## Scoping Rules

### Primitives
All primitives get `scopes = []` (hidden from picker — alias-only).

### Semantic Variables

| Variable group | Scopes |
|---|---|
| `color/background/*`, `color/surface/*` | `['FRAME_FILL', 'SHAPE_FILL']` |
| `color/text/*` | `['TEXT_FILL']` |
| `color/border/*` | `['STROKE_COLOR']` |
| `color/action/*`, `color/status/*`, `color/state/*`, `color/data-series/*` | `['ALL_FILLS', 'STROKE_COLOR']` |
| `opacity/*`, `elevation/*-opacity` | `['OPACITY']` |
| `spacing/component/*`, `spacing/layout/*` | `['GAP']` |
| `size/component/*`, `size/icon/*`, `size/person-media/*` | `['WIDTH_HEIGHT']` |
| `radius/component/*` | `['CORNER_RADIUS']` |
| `border/*` (widths) | `['STROKE_FLOAT']` |
| `duration/*` | `['ALL_SCOPES']` |
| `layer/*` (z-index) | `[]` |
| `content/max-width-*`, `content/min-width-*` | `['WIDTH_HEIGHT']` |
| `content/empty-color`, `content/empty-icon-color` | `['TEXT_FILL']` |
| `content/empty-bg` | `['FRAME_FILL', 'SHAPE_FILL']` |
| `content/empty-min-height`, `content/empty-icon-size` | `['WIDTH_HEIGHT']` |
| `content/empty-radius` | `['CORNER_RADIUS']` |
| `card-shell/min-width` | `['WIDTH_HEIGHT']` |
| `typography/*/font-size` | `['FONT_SIZE']` |
| `typography/*/font-weight` | `['FONT_WEIGHT']` |
| `typography/*/line-height` | `['LINE_HEIGHT']` |
| `typography/*/letter-spacing` | `['LETTER_SPACING']` |
| `typography/*/font-family` | `['FONT_FAMILY']` |
| `easing/*` (STRING) | `[]` |
| `content/overflow-*`, `content/whitespace-*`, etc. (STRING) | `[]` |

### Component Variables

| Name pattern | Scopes |
|---|---|
| contains `/text`, `text-`, `/icon-color` | `['TEXT_FILL']` |
| contains `/border`, `border-` | `['STROKE_COLOR']` |
| contains `/bg`, `bg-`, `background-` | `['FRAME_FILL', 'SHAPE_FILL']` |
| contains `/height`, `/width`, `/size` | `['WIDTH_HEIGHT']` |
| contains `/radius`, `radius-` | `['CORNER_RADIUS']` |
| contains `/padding`, `/gap`, `padding-`, `gap-` | `['GAP']` |
| contains `/z`, `-z` (z-index / layer) | `[]` |
| contains `/shadow`, `shadow-` | `[]` (skip entirely) |
| COLOR not matching above | `['ALL_FILLS', 'STROKE_COLOR']` |
| FLOAT not matching above | `['ALL_SCOPES']` |
| STRING (easing) | `[]` |

## Description Patterns

```js
// Primitives
x.description = 'Raw value: #ffffff';
x.description = 'Raw value: 16px';

// Semantics
v.description = 'Primary canvas background. Light: white. Dark: near-black.';
v.description = 'Medium internal component padding. Fixed: 12px across all themes.';

// Component tokens
v.description = 'Primary button background. Aliases color/action/primary.';
v.description = 'Button border-radius. Aliases radius/component/md (6px).';
```

## Collection Structure

| Collection | Modes | Expected Variables |
|---|---|---|
| 01 · Primitives | Value | ~230 |
| 02 · Semantic | Light, Dark | ~290 |
| 03 · Component | Value | Varies |

## Creating Collections from Scratch

### Primitives Collection

```js
const h = s => { const n=parseInt(s,16); return {r:((n>>16)&255)/255,g:((n>>8)&255)/255,b:(n&255)/255,a:1}; };
const c = figma.variables.createVariableCollection('01 · Primitives');
c.renameMode(c.modes[0].modeId, 'Value');
const m = c.modes[0].modeId;
const mk = (name, type, value, desc) => {
  const x = figma.variables.createVariable(name, c, type);
  x.setValueForMode(m, value);
  x.scopes = [];
  if (desc) x.description = desc;
  return x;
};
// ... create all primitives from @theme block
return { id: c.id, modeId: m };
```

### Semantic Collection

```js
const c = figma.variables.createVariableCollection('02 · Semantic');
c.renameMode(c.modes[0].modeId, 'Light');
c.addMode('Dark');
const lm = c.modes[0].modeId, dm = c.modes[1].modeId;

// Look up primitives for aliasing
const allVars = await figma.variables.getLocalVariablesAsync();
const pMap = {};
allVars.forEach(v => { pMap[v.name] = v; });
const a = n => figma.variables.createVariableAlias(pMap[n]);
```

### Component Collection

```js
const c = figma.variables.createVariableCollection('03 · Component');
c.renameMode(c.modes[0].modeId, 'Value');
// Look up semantics for aliasing
const allVars = await figma.variables.getLocalVariablesAsync();
const sMap = {};
allVars.forEach(v => { sMap[v.name] = v; });
```

## Batching

Split large variable creation into ~80-100 variables per `figma_execute` call to avoid timeouts. Use 30000ms timeout on each call.

## Special Cases

- **Transparent colors**: Use raw `{r:0, g:0, b:0, a:0}` instead of an alias
- **Shadow tokens**: Skip — Figma handles shadows as effects
- **`100%` values**: Skip or store as FLOAT 100
- **Negative letter-spacing**: Store as negative FLOAT (e.g., `-0.025rem` → `-0.4` px)

## Font Loading & Text Style Creation

```js
await Promise.all([
  figma.loadFontAsync({family:'Inter', style:'Regular'}),
  figma.loadFontAsync({family:'Inter', style:'Medium'}),
  figma.loadFontAsync({family:'Inter', style:'Semi Bold'}),
  figma.loadFontAsync({family:'Inter', style:'Bold'}),
  figma.loadFontAsync({family:'JetBrains Mono', style:'Regular'}),
]);
```

| CSS Weight | Value | Inter Style | JetBrains Mono Style |
|---|---|---|---|
| regular | 400 | Regular | Regular |
| medium | 500 | Medium | Medium |
| semibold | 600 | Semi Bold | Semi Bold |
| bold | 700 | Bold | Bold |

Text style naming: `.text-display-hero` → `display/hero`
