# Schema.org Structured Data — Component Generation Rules

Some components map to Schema.org semantic types. When generating a component that appears in the mapping table below, add opt-in structured data support.

## Component-to-Schema.org mapping

| Component | Schema.org Type | Microdata target | Status |
|---|---|---|---|
| Breadcrumb (L2) | `BreadcrumbList` | `<nav>` gets `itemScope`/`itemType` | ✅ Implemented |
| BreadcrumbItem (L1) | `ListItem` | `<li>` gets `itemScope`/`itemProp="itemListElement"`, `<a>` gets `itemProp="item"`, `<meta>` for position | ✅ Implemented |
| NavItem (L1) | `SiteNavigationElement` | `<li>` gets `itemScope`/`itemType` when rendered as link | ✅ Implemented |
| Sidebar (L3) | `WPSideBar` | `<aside>` gets `itemScope`/`itemType`; cascades `schema` to child NavItems | ✅ Implemented |
| Avatar (L1) | `ImageObject` | Wrapper gets `itemScope`/`itemType` on image variant | ✅ Implemented |
| Rating (L1) | `AggregateRating` | Read-only variant only: star container gets `itemScope`/`itemType`; `<meta>` for `ratingValue` and `bestRating` | ✅ Implemented (read-only only) |
| Header (L3) | `WPHeader` | `<header>` gets `itemScope`/`itemType` | ⬜ Planned |
| Footer (L3) | `WPFooter` | `<footer>` gets `itemScope`/`itemType` | ⬜ Planned |
| DataTable (L3) | `Table` | `<table>` gets `itemScope`/`itemType` | ⬜ Planned |
| Accordion (L3) | `FAQPage` + `Question`/`Answer` | Each panel pair: panel wrapper gets `itemScope`/`itemType="Question"`, answer div gets `itemScope`/`itemType="Answer"` | ⬜ Planned |
| Card (L2) | `Article` or `Product` | Context-dependent: editorial content → `Article`, product listing → `Product`. `<article>` gets `itemScope`/`itemType` | ⬜ Planned |
| SearchBar (L2) | `SearchAction` | JSON-LD only via `<StructuredData>` — not Microdata (no semantic element to attach to) | ⬜ Planned |

| Video (L1) | `VideoObject` | `<figure>` gets `itemScope`/`itemType`; `<meta>` for `contentUrl`/`thumbnailUrl`; `<figcaption>` gets `itemProp="name"` | ✅ Implemented |

**No Schema.org:** Button, Input, Textarea, Checkbox, Radio, Switch, Toggle, Badge, Tag, Chip, Spinner, ProgressBar, Divider, Label, Select, Modal, Tooltip.

## Implementation rules

1. Add `schema?: boolean` to the component's types file — always optional, defaults to `false`
2. Use conditional spread for all Microdata attributes: `{...(schema && { itemScope: true, itemType: 'https://schema.org/...' })}`
3. No new DOM elements when `schema={false}` — `<meta>` tags render only when schema is true
4. Parent passes `schema` to children via props — never React context
5. For position/order values not in visible DOM, use: `{schema && <meta itemProp="position" content={String(index)} />}`

## README requirement

Add a "Schema.org" subsection to README.md listing:
- Schema.org type applied
- `itemProp` attributes and which elements they attach to
- Usage example with `schema={true}`

Demonstrate `schema={true}` in README code examples. No additional story required — the 8-story rule stands.