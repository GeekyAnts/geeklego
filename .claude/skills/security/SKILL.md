---
name: security
description: >
  Audit and enforce XSS protection for Geeklego components. Use this skill whenever
  the user asks to: run a security audit, check for XSS vulnerabilities, retrofit
  existing components for security, add href sanitization, enforce noopener/noreferrer
  on external links, or requests a security review of any component. Also use this skill
  proactively when the component-builder skill generates any component that renders an
  <a> element — step 4.8 of the component generation flow requires this security check.
  Trigger on phrases like: "secure my components", "XSS protection", "sanitize href",
  "security audit", "javascript: vulnerability", "safe links", "external link protection".
---

# Geeklego Security Skill

## Foundation

Before starting any security work, read:
- `CLAUDE.md` — architecture rules (always first; security rules are 42-44 and 48)
- `components/utils/security/sanitize.ts` — the two utility functions and their contracts
- `components/utils/security/sanitize.types.ts` — `SafeExternalLinkProps`, `UnsafeProtocol`

---

## Architecture Overview

**Pure-function, import-per-use. No context, no provider, no hook.**

The security utilities are stateless pure functions that components call directly. They run in SSR.

```
Consumer href prop (string | undefined)
        ↓
sanitizeHref(href)          → strips javascript:, data:text/html, vbscript:
        ↓
getSafeExternalLinkProps()  → adds rel="noopener noreferrer" when target="_blank"
        ↓
rendered <a href={safe} rel={safe}>
```

**No new npm packages.** React already escapes text content. The only XSS vector in this
codebase is href protocol injection. DOMPurify is not needed.

Read `references/security-patterns.md` for the full threat model and edge cases.

---

## Phase 1 — Scope Assessment

**Always run this phase first. Always wait for user approval before writing any files.**

1. Read `CLAUDE.md` and `references/component-security-audit.md`
2. Confirm `components/utils/security/` exists. If not, create it (Phase 2A).
3. Determine scope:
   - **New component** — Run the security checklist in Phase 3 during generation; no separate scoping needed
   - **Single component retrofit** — Identify anchor elements, proceed to Phase 2B
   - **Full library retrofit** — Run the per-component audit table in `references/component-security-audit.md`, list all affected components in bottom-up order (atoms before molecules before organisms)
4. Present the work list with affected files. **Wait for approval before writing.**

---

## Phase 2 — Build

### Phase 2A — Create Utility Module (if absent)

Create exactly 3 files in `components/utils/security/`:

| File | Purpose |
|---|---|
| `sanitize.types.ts` | `SafeExternalLinkProps` interface + `UnsafeProtocol` type |
| `sanitize.ts` | `sanitizeHref` + `getSafeExternalLinkProps` pure functions |
| `index.ts` | Public barrel — exports both functions and both types |

Key constraints for `sanitize.ts`:
- Both functions must be pure — no `window`, `document`, `navigator`, `location`
- `UNSAFE_PROTOCOLS` is a `readonly string[]` at module scope — never inside the function body
- `sanitizeHref` normalises with `.trim().toLowerCase().replace(/\s/g, '')` before protocol check
- `getSafeExternalLinkProps` merges consumer `rel` parts and de-duplicates `noopener`/`noreferrer`
- No React import — the module is framework-agnostic

### Phase 2B — Per-Component Retrofit Pattern

Process in bottom-up order: atoms → molecules → organisms.

**Step 1 — Add the import (always direct, never from the barrel):**
```typescript
import { sanitizeHref } from '../../utils/security/sanitize';
// or, if the component renders external links with target/rel:
import { getSafeExternalLinkProps } from '../../utils/security/sanitize';
```

**Step 2 — Sanitize href (all `<a>`-rendering components):**
```typescript
const safeHref = useMemo(() => sanitizeHref(href), [href]);
// Then in JSX:
<a href={safeHref} ...>
```

**Step 3 — Guard external links (components with `target` prop or `external` concept):**
```typescript
const safeAnchorProps = useMemo(
  () => getSafeExternalLinkProps(href, target, rel),
  [href, target, rel],
);
// Spread in JSX — before ...rest so sanitized href wins:
<a {...safeAnchorProps} className={classes} ...otherProps>
```

**Step 4 — Extract target/rel from rest for polymorphic `<a>` components:**
```typescript
// When rest is cast to AnchorHTMLAttributes and could contain target/rel
const { target, rel, ...anchorRest } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
const safeProps = getSafeExternalLinkProps(href, target, rel);
// Spread: safeProps first, then anchorRest (never contains href/target/rel after destructure)
<a {...safeProps} className={classes} {...anchorRest}>
```

### Phase 2C — Component-Specific Notes

| Component | Fix needed | Notes |
|---|---|---|
| `SkipLink` | `sanitizeHref` only | Fragment-only hrefs — no external link risk |
| `Item` | `getSafeExternalLinkProps` | Destructure `target`/`rel` from `rest` cast; also add them to `ItemProps` |
| `BreadcrumbItem` | `sanitizeHref` only | Navigation — always same-tab; add `useMemo` to React imports |
| `NavItem` | `sanitizeHref` only | No explicit `target` prop — `target` from rest is lower risk |
| `Quote` | `sanitizeHref` on `sourceUrl` | Citation link — same-tab |
| `Link` | `sanitizeHref` on href only | Existing `rel` logic is correct — do NOT change it |

After fixing atoms, molecules and organisms that delegate to these atoms are automatically protected.

---

## Phase 3 — Verify

Run through this checklist before presenting work as complete.

### Utility module integrity
- [ ] Exactly 3 files in `components/utils/security/`
- [ ] `sanitizeHref('')` → `'#'`
- [ ] `sanitizeHref(undefined)` → `'#'`
- [ ] `sanitizeHref('javascript:alert(1)')` → `'#'`
- [ ] `sanitizeHref('JavaScript:alert(1)')` → `'#'` (case-insensitive)
- [ ] `sanitizeHref('  javascript:alert(1)')` → `'#'` (whitespace-trimmed)
- [ ] `sanitizeHref('https://example.com')` → `'https://example.com'` (unchanged)
- [ ] `sanitizeHref('#section')` → `'#section'` (unchanged)
- [ ] `sanitizeHref('/relative-path')` → `'/relative-path'` (unchanged)
- [ ] `sanitizeHref('data:text/html,<script>alert(1)</script>')` → `'#'`
- [ ] `getSafeExternalLinkProps('https://ex.com', '_blank')` → `{ rel: 'noopener noreferrer', ... }`
- [ ] `getSafeExternalLinkProps('https://ex.com', '_blank', 'sponsored')` → rel contains all three without duplicating safety directives
- [ ] `getSafeExternalLinkProps('/page')` returns no `target` or `rel` keys (not `undefined` values)
- [ ] No `window`, `document`, or DOM reference in `sanitize.ts`

### Per-component checks
- [ ] Every component rendering `<a href={...}>` now passes `href` through `sanitizeHref` or `getSafeExternalLinkProps`
- [ ] `safeProps` spread appears before `...rest` — sanitized href wins
- [ ] `Link` uses `sanitizeHref` on href but existing `rel` logic is unchanged
- [ ] `Item` extracts `target`/`rel` from `rest` before constructing safe anchor props

### Backward compatibility
- [ ] `href="#main-content"` on SkipLink still works — fragments pass through unchanged
- [ ] `Link external={true}` still sets `rel="noopener noreferrer"` — only href changes
- [ ] `Item href="/dashboard"` still renders as `<a>` — relative paths pass through unchanged
- [ ] New `target`/`rel` props on Item are optional (no breaking change)

### Documentation
- [ ] New component's row added to `references/component-security-audit.md`

---

## Adding Security to a New Component (Step 4.8)

When generating a new component that renders `<a>`:

1. Import `sanitizeHref` from `'../../utils/security/sanitize'`
2. Apply `sanitizeHref(href)` to every href prop before rendering, wrapped in `useMemo`
3. If the component has an `external` or `target` prop: use `getSafeExternalLinkProps` instead
4. Add a row to `references/component-security-audit.md`

---

## References

| File | When to read |
|---|---|
| `references/security-patterns.md` | Full threat model, implementation patterns, edge cases, SSR contract |
| `references/component-security-audit.md` | Per-component audit status — update after each fix or new component |
