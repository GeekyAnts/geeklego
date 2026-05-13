# Security Patterns — Geeklego Implementation Guide

## The XSS Threat Model for Geeklego

Geeklego is a React component library. React's JSX renderer **automatically escapes all text
content**, so standard reflected XSS via text injection is not a concern.

The one credible XSS vector is **href protocol injection**:

```tsx
// Safe — React escapes text content automatically
<p>{userSupplied}</p>  // even if userSupplied = '<script>alert(1)</script>'

// UNSAFE — React does NOT sanitize href values
<a href={userSupplied}>Click</a>  // javascript:alert(1) executes on click
```

React renders href verbatim. The `sanitizeHref` utility exists specifically to close this gap.

---

## What We Protect Against

| Attack | Example value | Result after sanitizeHref |
|---|---|---|
| JavaScript protocol | `javascript:alert(document.cookie)` | `#` |
| Mixed-case JS protocol | `JavaScript:alert(1)` | `#` |
| Whitespace-padded | `  javascript:alert(1)` | `#` |
| Embedded-whitespace bypass | `j a v a s c r i p t:alert(1)` | `#` |
| Data URI HTML | `data:text/html,<script>alert(1)</script>` | `#` |
| VBScript (IE legacy) | `vbscript:msgbox(1)` | `#` |

## What We Do NOT Protect Against

These are intentionally out of scope:

| Non-issue | Why |
|---|---|
| XSS via text content | React escapes all JSX text expressions automatically |
| CSS injection | Geeklego uses Tailwind classes — no style props, no inline CSS |
| `dangerouslySetInnerHTML` | Forbidden by CLAUDE.md rule — never used in Geeklego |
| Prototype pollution | No `eval`, no `Function()`, no dynamic code execution |
| CSRF | Server-side concern — not in component library scope |
| Open redirect | Application routing responsibility — not a library concern |
| Image `src` protocol | `<img src>` does not execute scripts; CSP handles this at the host level |

---

## The Protocol Check — Implementation Details

```typescript
const normalized = href.trim().toLowerCase().replace(/\s/g, '');
for (const protocol of UNSAFE_PROTOCOLS) {
  if (normalized.startsWith(protocol)) return '#';
}
```

This correctly handles:
- **Mixed case**: `JavaScript:`, `JAVASCRIPT:`, `jAvAsCrIpT:`
- **Leading whitespace**: `  javascript:` — `.trim()` removes it
- **Embedded whitespace**: `j a v a s c r i p t:` — `.replace(/\s/g, '')` removes all internal spaces

We use `startsWith` on a normalised string rather than a regex or `new URL()`:
- Regex: adds complexity with its own edge cases
- `new URL()`: throws in some SSR environments; has inconsistent protocol handling

The simple string-prefix approach covers all known attack patterns reliably.

---

## rel="noopener noreferrer" — Why It Matters

When `target="_blank"` opens a new tab, the new page gains a reference to the opener via
`window.opener`. A malicious page can redirect the original tab:
```js
window.opener.location = 'https://phishing-site.example.com';
```

- `rel="noopener"` — sets `window.opener` to `null` in the new tab
- `rel="noreferrer"` — additionally suppresses the `Referer` header (older browser compat)

Modern browsers handle `noopener` automatically for `target="_blank"`, but the explicit
`rel` remains best practice for older browser support and clearly communicates intent.

### Consumer rel Merging

When a consumer passes a custom `rel` like `"sponsored"` or `"ugc"`, `getSafeExternalLinkProps`
merges it with the safety directives and de-duplicates:

```typescript
getSafeExternalLinkProps('https://example.com', '_blank', 'sponsored noopener')
// → { href: 'https://example.com', target: '_blank', rel: 'noopener noreferrer sponsored' }
// Note: 'noopener' from consumer is de-duplicated
```

---

## Component Import Pattern

Always use a **direct relative import** — never the barrel (`index.ts`) in component code:

```typescript
// Correct — direct file import
import { sanitizeHref } from '../../utils/security/sanitize';
import { getSafeExternalLinkProps } from '../../utils/security/sanitize';

// Wrong — barrel import in component code
import { sanitizeHref } from '../../utils/security';
```

The barrel exists only for external consumers building on top of Geeklego.

---

## useMemo Wrapping

Wrap `sanitizeHref` calls in `useMemo` to follow the project performance pattern (rule 35):

```typescript
// Correct — memoized
const safeHref = useMemo(() => sanitizeHref(href), [href]);

// Also acceptable — inlined into an existing useMemo if href is already in the dep array
const { safeHref, classes } = useMemo(() => ({
  safeHref: sanitizeHref(href),
  classes: [...classArray].filter(Boolean).join(' '),
}), [href, ...otherDeps]);
```

`getSafeExternalLinkProps` should also be wrapped in `useMemo` when `href`, `target`, or `rel`
could change across renders:

```typescript
const safeProps = useMemo(
  () => getSafeExternalLinkProps(href, target, rel),
  [href, target, rel],
);
```

---

## SSR Safety Contract

Both `sanitizeHref` and `getSafeExternalLinkProps` make no reference to:
- `window` / `document` / `navigator` / `location`
- Any Web API or DOM global

They are safe to call during server-side rendering. The absence of DOM dependencies is
enforced at code review time — no `typeof window` guards are needed since DOM globals
are never accessed.

---

## The Polymorphic `<a>` Pattern (for components like Item)

When a component extends `HTMLAttributes<HTMLDivElement>` but renders as `<a>` in some
variants, `target` and `rel` are not in the base props type. They arrive via `...rest` cast
to `AnchorHTMLAttributes`. The correct fix:

1. Add explicit `target?: string` and `rel?: string` to the component's types interface
2. Destructure them from `rest` before rendering the `<a>`:

```typescript
const { target, rel, ...anchorRest } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
const safeProps = getSafeExternalLinkProps(href, target, rel);

return (
  <a
    {...safeProps}       // spreads sanitized href, and target/rel if needed
    className={classes}
    {...anchorRest}      // remaining attrs — never contains href/target/rel after destructure
  >
    {content}
  </a>
);
```

The order matters: `safeProps` must be spread **before** `anchorRest` so that the sanitized
`href` from `safeProps` wins over any `href` that might arrive via rest (unlikely, but defensive).

---

## When to Use sanitizeHref vs getSafeExternalLinkProps

| Scenario | Use |
|---|---|
| Component only renders same-tab links (navigation, breadcrumbs, skip links) | `sanitizeHref` only |
| Component has an `external` prop with its own rel logic (e.g. Link) | `sanitizeHref` on href only; don't change rel logic |
| Component accepts a `target` prop | `getSafeExternalLinkProps(href, target, rel)` |
| Component spreads `...rest` onto `<a>` and rest could contain `target` | Destructure `target`/`rel` from rest, then `getSafeExternalLinkProps` |
