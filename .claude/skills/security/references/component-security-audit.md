# Component Security Audit Table

Per-component audit of XSS protection status.
Update this table after each retrofit or new component generation.

**Last audited:** 2026-03-24

---

## Audit Legend

| Status | Meaning |
|---|---|
| ✅ Secure | All anchor hrefs sanitized; rel guard in place where needed |
| ⚠ Partial | `sanitizeHref` applied but rel guard missing (or vice versa) |
| ❌ Vulnerable | Unsanitized href rendered verbatim |
| N/A | No anchor elements rendered — not applicable |

---

## Component Audit Status

| Component | Level | Renders `<a>`? | `sanitizeHref` | rel guard | Status | Notes |
|---|---|---|---|---|---|---|
| `Button` | L1 | No | — | — | N/A | Renders `<button>` only |
| `Avatar` | L1 | No | — | — | N/A | Renders `<span>` only |
| `Divider` | L1 | No | — | — | N/A | Renders `<hr>` only |
| `SkipLink` | L1 | Yes | ✅ | N/A | ✅ | Fragment hrefs only; no external link risk |
| `Link` | L1 | Yes | ✅ | ✅ (via `external` prop) | ✅ | `external` prop already handles rel; `sanitizeHref` added to href |
| `Item` | L1 | Yes (link variant) | ✅ | ✅ | ✅ | `getSafeExternalLinkProps`; `target`/`rel` added to `ItemProps` |
| `NavItem` | L1 | Yes (link variant) | ✅ | Partial (no explicit `target` prop) | ✅ | `sanitizeHref` added; `target` via `rest` is lower risk |
| `BreadcrumbItem` | L1 | Yes (link variant) | ✅ | N/A | ✅ | Navigation only; always same-tab |
| `Select` | L1 | No | — | — | N/A | Renders `<select>` / `<button>` |
| `Quote` | L1 | Yes (`sourceUrl`) | ✅ | N/A | ✅ | Citation link; same-tab |
| `Badge` | L1 | No | — | — | N/A | Renders `<span>` |
| `Chip` | L1 | No | — | — | N/A | Renders `<button>` or `<span>` — no anchor elements |
| `Tag` | L1 | Yes (when `href` provided) | `sanitizeHref` | N/A (no `target` prop) | ✅ Secure | `href` passed through `sanitizeHref()` via `useMemo`; renders `<a>` only when `href` is provided |
| `Checkbox` | L1 | No | — | — | N/A | Form control |
| `Heading` | L1 | No | — | — | N/A | Renders heading element |
| `Image` | L1 | No | — | — | N/A | Renders `<img>` — no `href` |
| `Input` | L1 | No | — | — | N/A | Form control |
| `Label` | L1 | No | — | — | N/A | Renders `<label>` |
| `List` | L1 | No | — | — | N/A | Renders `<ul>/<ol>` |
| `ProgressBar` | L1 | No | — | — | N/A | No anchor |
| `Radio` | L1 | No | — | — | N/A | Form control |
| `Rating` | L1 | No | — | — | N/A | No anchor |
| `SegmentedControl` | L1 | No | — | — | N/A | No anchor |
| `Skeleton` | L1 | No | — | — | N/A | Loading placeholder |
| `Slider` | L1 | No | — | — | N/A | Form control |
| `Spinner` | L1 | No | — | — | N/A | No anchor |
| `Switch` | L1 | No | — | — | N/A | Form control |
| `Textarea` | L1 | No | — | — | N/A | Form control |
| `ThemeSwitcher` | L1 | No | — | — | N/A | No anchor |
| `Toggle` | L1 | No | — | — | N/A | Form control |
| `TreeItem` | L1 | No | — | — | N/A | No anchor |
| `Breadcrumb` | L2 | Via `BreadcrumbItem` | ✅ inherited | N/A | ✅ | Delegates href to `BreadcrumbItem` |
| `Card` | L2 | Potentially | Audit on creation | — | Pending | Audit when built |
| `TreeView` | L2 | Via `TreeItem` | N/A | — | N/A | TreeItem has no anchor |
| `Sidebar` | L3 | Via `NavItem` | ✅ inherited | Partial inherited | ✅ | Delegates href to `NavItem` |
| `AreaChart` | L3 | No | — | — | N/A | No anchor elements |
| `BarChart` | L3 | No | — | — | N/A | No anchor elements |
| `FileInput` | L1 | No | — | — | N/A | No anchor elements; file input overlay only |

---

## Components Added After Retrofit (Generation Checklist Applied)

New components added after 2026-03-24 are checked at generation time via step 4.8 in
`component-generation-flow.md`. Add a row here for each new component that renders `<a>`.

| Component | Added date | Renders `<a>`? | Security status | Notes |
| `DropdownMenu` | 2026-03-25 | Yes (link items) | ✅ Secure | `getSafeExternalLinkProps` on all link items; `target`/`rel` from item props; sanitized href wins |
| `Header` | 2026-03-26 | Yes (`Header.Brand`) | ✅ Secure | `sanitizeHref` applied to `href` prop in `useMemo`; no external link risk (brand always same-origin) |
| `Navbar` | 2026-03-27 | Via `NavItem` | ✅ Secure inherited | Delegates all href rendering to NavItem which applies `sanitizeHref()`; no direct `<a>` in Navbar.tsx |
|---|---|---|---|---|
| `VisuallyHidden` | 2026-03-25 | No | N/A | Renders `span`/`div`/`p` only — no anchor elements |
| `SearchBar` | 2026-03-25 | No | N/A | Renders `<input type="search">` + `<button>` only — no anchor elements |
| `Toast` | 2026-03-25 | No | N/A | Renders `<div>` live region + `<button>` dismiss — no anchor elements |
| `Combobox` | 2026-03-25 | No | N/A | Renders `<input>` + `<ul>`/`<li>` + `<button>` clear — no anchor elements |
| `Modal` | 2026-03-26 | No | N/A | Renders `<div role="dialog">` + `<header>` + `<button>` close — no anchor elements; children slots are consumer-controlled |
| `Form` | 2026-03-27 | No | N/A | Renders `<form>` + `<div>` layout wrappers only — no anchor elements; all controls are consumer-provided children |
| `Datepicker` | 2026-03-31 | No | N/A | Renders `<input type="text">` + `<button>` trigger + `<table>` calendar grid — no anchor elements |
| `Carousel` | 2026-04-04 | No | N/A | Renders `<section>` + `<ul>`/`<li>` slide track + `<button>` controls — no anchor elements; slide content is consumer-provided children |
| `FileUpload` | 2026-04-04 | No | N/A | Renders `<div>` container + `<label>` zone + `<input type="file">` + `<ul>`/`<li>` file list + `<button>` remove — no anchor elements |

---

## False Positives (Confirmed Safe — No Action Needed)

| Component | Why it looks like a risk but is not |
|---|---|
| `Sidebar.tsx` | Contains `querySelectorAll('a[href]:not([disabled])')` — this is a DOM query string, not a rendered href |
| `Image.tsx` | `src` prop on `<img>` — does not execute scripts; image loading is controlled by CSP at the host level |
| `Avatar.tsx` | `src` prop on `<img>` — same as Image above |
