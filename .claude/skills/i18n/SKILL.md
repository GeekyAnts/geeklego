---
name: i18n
description: >
  Add internationalization (i18n) support to Geeklego components. Use this skill
  whenever the user mentions i18n, localization, translation, RTL layout, locale,
  multilingual, accessible strings, language support, or wants to add `i18nStrings`
  props to new or existing components. Also trigger when building a new component
  that will contain system-generated strings (aria-labels, default text, SR-only
  content) — even if i18n is not explicitly mentioned, the skill enforces that all
  system strings are externalizable from day one.
---

# Geeklego i18n Skill

## Foundation

Before starting any i18n work, read:
- `CLAUDE.md` — architecture rules (always first)
- `components/utils/i18n/GeeklegoI18nProvider.types.ts` — all type interfaces, `DEFAULT_STRINGS`, `DEFAULT_FORMATTERS`
- `components/utils/i18n/useGeeklegoI18n.ts` — hook signature and merge logic
- `.claude/skills/i18n/references/string-inventory.md` — which components have system strings

---

## Architecture Overview

**Library-agnostic, prop-first with context fallback.**

```
Consumer's i18n tool (react-intl, i18next, etc.)
        ↓
GeeklegoI18nProvider (optional, library-wide defaults)
        ↓  falls back
i18nStrings prop on individual component (per-instance override)
        ↓  falls back
Hardcoded English default in DEFAULT_STRINGS
```

**Resolution order — most specific wins:**
`DEFAULT_STRINGS[key]` ← `context.strings[key]` ← `i18nStrings prop`

Geeklego ships no i18n library. No new `npm install` needed.

---

## Phase 1 — Scope Assessment

**Always run this phase first.**

1. Read `CLAUDE.md` and `references/string-inventory.md`
2. Determine scope:
   - Is this a **new component**? → Check inventory for known system strings, then apply pattern in Phase 2 during component generation
   - Is this a **single component retrofit**? → Identify system strings, proceed to Phase 2 for that component
   - Is this a **full library retrofit**? → List all affected components in bottom-up level order (atoms before molecules before organisms), wait for user approval before writing
3. Check whether `components/utils/i18n/` already exists. If not, create it (see Phase 2A)

Present the work list and **wait for approval** before writing any files.

---

## Phase 2 — Build

### Phase 2A — Create Utility Module (if absent)

Create exactly 4 files in `components/utils/i18n/`:

| File | Purpose |
|---|---|
| `GeeklegoI18nProvider.types.ts` | All interfaces + `DEFAULT_STRINGS` + `DEFAULT_FORMATTERS` |
| `GeeklegoI18nProvider.tsx` | Context + provider component |
| `useGeeklegoI18n.ts` | Internal `useComponentI18n` hook |
| `index.ts` | Public barrel (provider + types only — NOT the hook) |

**Critical:** The hook is NOT exported from `index.ts`. Components import it via relative path: `import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n'`

### Phase 2B — Per-Component Retrofit Pattern

For each component in the approved list (process bottom-up: atoms → molecules → organisms):

**Step 1 — Add to types file:**
```typescript
import type { ComponentNameI18nStrings } from '../../utils/i18n';

export interface ComponentNameProps ... {
  // ... existing props ...
  /** Override localised strings for this instance. Context strings apply when omitted. */
  i18nStrings?: ComponentNameI18nStrings;
}
```

**Step 2 — Add to tsx file:**
```typescript
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';

// In destructuring:
{ ..., i18nStrings, ...rest }

// First line inside the component function:
const i18n = useComponentI18n('componentKey', i18nStrings);
```

**Step 3 — Replace system strings:**
```tsx
// Before: hardcoded SR/system string
<span className="sr-only">(required)</span>

// After: resolved via i18n
<span className="sr-only">{i18n.required}</span>
```

**Step 4 — Augment (never replace) existing content props:**
```tsx
// Props like deltaLabel, placeholder, label are CONTENT — keep them.
// The i18n system provides a smarter DEFAULT for when the prop is not passed.
const resolvedDeltaLabel = deltaLabelProp ?? i18n.deltaLabel;
```

### Phase 2C — RTL Fixes

When updating any component (or for the Input atom which needs it now):

| Replace | With | When |
|---|---|---|
| `pl-[var(--token)]` | `ps-[var(--token)]` | Content padding that should mirror in RTL |
| `pr-[var(--token)]` | `pe-[var(--token)]` | Content padding that should mirror in RTL |
| `ml-[var(--token)]` | `ms-[var(--token)]` | Directional margin |
| `mr-[var(--token)]` | `me-[var(--token)]` | Directional margin |
| `left-[var(--token)]` | `start-[var(--token)]` | Icon/content inline-start positioning |
| `right-[var(--token)]` | `end-[var(--token)]` | Icon/content inline-end positioning |

**Exempt from RTL conversion:** `left-0`/`right-0` on absolutely-positioned overlays (tooltips, dropdowns) — these align with their trigger which already mirrors in RTL flow.

### Phase 2D — Formatters (chart components)

For components that display numbers or dates (BarChart, AreaChart):

```tsx
const i18n = useComponentI18n('areaChart', i18nStrings);

// Explicit prop > context formatter > built-in defaultFormat
const formatValue = formatValueProp ?? i18n.formatters.formatNumber ?? defaultFormat;
```

---

## Phase 3 — Verify

Run through this checklist before presenting work as complete.

### Utility module integrity
- [ ] Exactly 4 files in `components/utils/i18n/`
- [ ] `useComponentI18n` is NOT exported from `index.ts`
- [ ] `DEFAULT_STRINGS` is a module-scope constant (not inside the hook or component)
- [ ] Provider `useMemo` wraps the context value object

### Per-component checks
- [ ] `i18nStrings?` typed with the exact per-component interface (not `GeeklegoI18nStrings`)
- [ ] `useComponentI18n('key', i18nStrings)` called as first non-hook-of-hooks line
- [ ] Template functions typed as `(arg: T) => string`, never concatenated inline
- [ ] Existing content props unchanged — no breaking changes

### Fallback chain (manual test)
- [ ] No provider + no prop → English defaults appear in DOM
- [ ] Provider only → provider strings override defaults
- [ ] Prop only → prop strings override defaults without provider
- [ ] Both → prop wins over provider

### Formatters
- [ ] `formatters.formatNumber` replaces AreaChart `defaultFormat` when provided
- [ ] `formatValue` prop still takes full precedence over `formatters.formatNumber`

### RTL
- [ ] No `pl-*` / `pr-*` / `left-*` / `right-*` for directional component padding or icon offsets
- [ ] No `direction:` or `writing-mode:` written in component TSX
- [ ] `dir` attribute is NOT set by Geeklego — it is read from HTML (`<html dir="rtl">`)

### Backward compatibility
- [ ] All existing props unchanged (no renames, no removed defaults except where replaced by i18n)
- [ ] TypeScript: adding optional `i18nStrings?` never breaks existing callers

---

## Adding i18nStrings to a New Component

When the component-builder skill generates a new component, include i18n if the component has any system-generated strings (not consumer content). Common system strings:

- `aria-label` on landmark elements (`<nav>`, `<aside>`, etc.)
- `aria-label` on icon-only buttons where the label is a fixed phrase
- SR-only status text (`"Loading…"`, `"Required"`, etc.)
- Default text that would appear when the consumer passes nothing (not `children`)

Do **NOT** add `i18nStrings` to components where all text is consumer content (children, title, label, placeholder props that the consumer always supplies).

When adding a new component to the library's i18n coverage, also update:
1. `GeeklegoI18nProvider.types.ts` — add the new `ComponentNameI18nStrings` interface and add the key to `GeeklegoI18nStrings`
2. `DEFAULT_STRINGS` constant — add the component's English defaults
3. `index.ts` — add the new type to the public export
4. `references/string-inventory.md` — add a row for the new component

---

## References

| File | When to read |
|---|---|
| `references/string-inventory.md` | Before any retrofit — full per-component audit table |
| `references/rtl-class-map.md` | When applying RTL fixes — exact substitution table |
