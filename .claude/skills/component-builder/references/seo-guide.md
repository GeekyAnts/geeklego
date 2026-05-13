# SEO Guide — Component Builder Sub-Skill

This is the authoritative reference for SEO best practices in Geeklego component generation.
Read this file whenever building a new component or auditing an existing one for SEO.

---

## Table of Contents

1. [Schema.org Structured Data](#1-schemaorg-structured-data)
2. [Semantic HTML SEO Rules](#2-semantic-html-seo-rules)
3. [Step 4.7 — SEO Audit Checklist](#3-step-47--seo-audit-checklist)
4. [On-Demand SEO Audit Command](#4-on-demand-seo-audit-command)

---

## 1. Schema.org Structured Data

### Component-to-Schema.org mapping

The full mapping lives in `references/schema-org.md`. Key rules:

- **L1–L3 components** → Microdata via conditional-spread props (`itemScope`, `itemType`, `itemProp`)
- **L4+ templates** → JSON-LD via `<StructuredData data={...} />` utility
- Components not in the mapping table → no schema, no `schema` prop

### The `schema?: boolean` prop pattern

Every component that maps to a Schema.org type gets an opt-in `schema?: boolean` prop (default `false`).

**Why opt-in, not default:** Consumers often embed components inside richer structured data contexts. Defaulting to `true` would double-annotate the same entity and confuse crawlers. Opt-in gives the app developer full control.

**Types file:**
```typescript
/** Enable Schema.org structured data markup (Microdata). Defaults to false. */
schema?: boolean;
```

**Implementation — conditional spread (no DOM overhead when false):**
```tsx
<nav
  {...(schema && {
    itemScope: true,
    itemType: 'https://schema.org/BreadcrumbList',
  })}
>
```

**Hidden metadata that has no visible equivalent — use `<meta>`:**
```tsx
{schema && <meta itemProp="position" content={String(index + 1)} />}
```

**Never add DOM elements, wrapper divs, or extra markup for schema alone.**

### Cascading schema to child components

When a component wraps children that also have `schema` props, always cascade:

```tsx
// Parent organism passing schema down to atom children
<NavItem
  key={item.id}
  label={item.label}
  href={item.href}
  schema={schema}   // ← always cascade
/>
```

If the child receives schema through a renderer/intermediary component, the intermediary must also accept and forward the `schema` prop:

```tsx
// Correct — intermediary forwards schema
const NavItemRenderer = memo(function NavItemRenderer({
  item,
  schema,           // ← added to props
}: { item: ...; schema?: boolean }) {
  return (
    <NavItem
      label={item.label}
      schema={schema}  // ← forwarded
    />
  );
});
```

### When to use JSON-LD instead of Microdata

Use JSON-LD via `<StructuredData>` when:
- The component is at L4 (template) or L5 (page)
- The schema type has no direct semantic HTML element to attach to (e.g., `SearchAction`, `WebSite`, `Organization`)
- The structured data is page-wide rather than component-specific

```tsx
// L4 template using JSON-LD
import { StructuredData } from '../../../utils/StructuredData/StructuredData';

{schema && (
  <StructuredData data={{
    '@context': 'https://schema.org',
    '@type': 'SearchAction',
    target: `${siteUrl}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  }} />
)}
```

### AggregateRating — read-only only

`AggregateRating` is for displaying a pre-computed score (e.g., 4.2 out of 5 from 120 reviews). It does NOT apply to an interactive rating input — a user selecting stars is not an aggregate. Only annotate the `readOnly` variant of the Rating component with schema.

### README documentation requirement

Every component with schema support must include a "Schema.org" subsection in its README.md:

```markdown
## Schema.org

When `schema={true}`, the component annotates its root element with `itemScope` and
`itemType="https://schema.org/BreadcrumbList"`.

| Element | `itemProp` |
|---|---|
| `<li>` | `itemListElement` (type: `ListItem`) |
| `<a>` | `item` |
| `<span>` (label) | `name` |
| `<meta>` | `position` |

Usage: `<Breadcrumb items={items} schema />`
```

---

## 2. Semantic HTML SEO Rules

Good semantic HTML is the single biggest SEO lever at the component level. Crawlers and screen readers share the same dependency on semantic structure.

### Heading hierarchy

Each component level has a corresponding heading context. Never hardcode a heading level — always accept `as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'` when a component renders a heading.

| Context | Correct element |
|---|---|
| Page/Hero title | `<h1>` |
| Section heading (L4 template sections) | `<h2>` |
| Card title, Accordion panel title | `<h3>` |
| Sub-card or nested section | `<h4>` |
| Never skip levels | `<h1>` → `<h3>` is wrong |

**Why it matters for SEO:** Search engines build a document outline from heading hierarchy. Skipping levels or using headings for visual size rather than structure breaks that outline.

### Landmark roles and SEO impact

Correct landmark elements give crawlers clear page regions to parse:

| Element | Landmark role | SEO signal |
|---|---|---|
| `<header>` | `banner` | Site identity, logo, primary nav |
| `<nav>` | `navigation` | Link graph for crawling |
| `<main>` | `main` | Primary content — highest crawler weight |
| `<aside>` | `complementary` | Supplementary content |
| `<footer>` | `contentinfo` | Copyright, secondary links |
| `<article>` | `article` | Standalone indexable content |
| `<section>` | `region` (needs aria-label) | Thematic grouping |

**Rules:**
- Never use `<div>` where a semantic element is available.
- `<section>` must have `aria-label` or `aria-labelledby` to be a `region` landmark.
- Multiple `<nav>` elements must each have `aria-label` to distinguish them.

### Link text

Crawlers use anchor text to understand what the linked page is about. Poor link text loses that signal.

```tsx
// Wrong — no signal to crawler
<a href="/pricing">Click here</a>
<a href="/pricing">Read more</a>

// Correct — descriptive, indexable anchor text
<a href="/pricing">View pricing plans</a>
```

**Rules:**
- Never use "click here", "read more", "learn more", or "here" as the full link text.
- Icon-only links MUST have `aria-label` with a meaningful description (required for a11y AND SEO).
- `title` attribute on links is not a substitute for descriptive text.

### Image alt text

Alt text is how crawlers index images. It is also required for accessibility.

```tsx
// Decorative — no alt, aria-hidden
<img src="divider.svg" alt="" aria-hidden="true" />

// Informative — descriptive alt
<img src={src} alt={alt} />  // alt prop required, no default empty string

// User avatar — meaningful default
<img src={avatarSrc} alt={alt ?? 'User avatar'} />
```

**Rules:**
- Never default alt to `""` for user-facing images. Default to a meaningful description.
- Never use filename or "image of" in alt text.
- Alt text should describe the content and function of the image, not its appearance.

### Content structure in components

- Use `<ul>` / `<ol>` for lists of items (NavItems, BreadcrumbItems, etc.). Never `<div>` lists.
- Use `<dl>` / `<dt>` / `<dd>` for definition/description pairs (key-value data in cards).
- Use `<figure>` + `<figcaption>` for images or charts with captions.
- Use `<time datetime="...">` for dates and times — crawlers use `datetime` for indexing.
- Use `<address>` for contact information in footers.
- Use `<blockquote cite="...">` for quoted content.

### Component-level SEO checklist for semantic HTML

- [ ] Uses the most specific semantic HTML element available
- [ ] Heading-bearing components accept `as?:` prop for level flexibility
- [ ] All `<a>` elements have descriptive text (not "click here" / "read more")
- [ ] All images have meaningful `alt` (no empty-string default for user-facing images)
- [ ] Lists use `<ul>` or `<ol>`, never `<div>` stacks
- [ ] Landmark elements are used correctly (`<nav>`, `<main>`, `<aside>`, `<article>`)
- [ ] Multiple same-type landmarks have `aria-label` to distinguish them
- [ ] Dates use `<time datetime="...">` — never plain text

---

## 3. Step 4.7 — SEO Audit Checklist

Run this as step 4.7 in the generation flow, between the performance audit (4.6) and import verification (5).

### Schema.org

- [ ] Check `references/schema-org.md` — does this component map to a Schema.org type?
  - **If yes:** Is `schema?: boolean` declared in the types file?
  - **If yes:** Is the Microdata conditional-spread implemented in the TSX? (Not just declared in types)
  - **If yes:** Are `<meta>` tags used for data that has no visible DOM equivalent?
- [ ] Does this component wrap child components that have `schema` props?
  - **If yes:** Is `schema={schema}` passed down to every child? Including through intermediary renderers?
- [ ] Is this an L4+ template that maps to a JSON-LD type?
  - **If yes:** Is `<StructuredData data={...} />` conditionally rendered when `schema={true}`?

### Semantic HTML

- [ ] Heading-bearing components: does the component accept `as?:` for level selection?
- [ ] All `<a>` tags have descriptive text visible to crawlers
- [ ] All `<img>` tags have meaningful `alt` (non-empty for user-facing images)
- [ ] Lists are `<ul>`/`<ol>`, not `<div>` stacks
- [ ] Landmark elements used correctly (no `<div>` standing in for `<nav>`, `<aside>`, etc.)
- [ ] Multiple same-landmark-type elements have `aria-label` to distinguish them

### README

- [ ] If the component has `schema` support: README has a "Schema.org" subsection with type, itemProps table, and usage example

**Fix any failure before proceeding to step 5.**

---

## 4. On-Demand SEO Audit Command

When the user types **"do an SEO audit"**, scan all components in `components/atoms/`, `components/molecules/`, `components/organisms/`, and `components/templates/`.

For each component, check:

**Schema.org coverage**
- Does a mapping exist in `references/schema-org.md` for this component?
- If yes: Is `schema?: boolean` declared in `[ComponentName].types.ts`?
- If yes: Is the conditional-spread Microdata implemented in `[ComponentName].tsx`? (Check that the schema prop actually drives `itemScope`/`itemType` attributes, not just declared)
- If yes: Does it cascade `schema` to child components that also have schema props?
- If yes: Is the Schema.org section documented in `README.md`?

**Semantic HTML**
- Does the component use the most specific semantic HTML element available?
- Are all image `alt` texts non-empty for user-facing images?
- Is link text descriptive (no "click here", "read more")?
- Are lists using `<ul>` or `<ol>`, not bare `<div>` stacks?

**Output format:**
- List each violation as: `[File:line] — [what is wrong]`
- Clean components: single `✓ ComponentName` line
- End with a "Summary" section: total components scanned, violations found, clean count

Do not make any file changes — output the plan only and wait for approval.
