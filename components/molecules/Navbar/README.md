# Navbar

A horizontal (or vertical) navigation bar molecule that composes `NavItem` atoms into a landmark `<nav>` region. Supports four visual variants, three sizes, and an orientation toggle, making it suitable for primary site navigation, section-level sub-navs, and documentation sidebars.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `NavbarItemDef[]` | — | Array of navigation items to render. |
| `variant` | `'pills' \| 'underline' \| 'flush' \| 'bordered'` | `'pills'` | Visual style. See Variants. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | NavItem height (32 / 40 / 48 px). |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction. |
| `aria-label` | `string` | `"Navigation"` | Accessible name for the `<nav>` landmark. Required when multiple navbars share a page. |
| `schema` | `boolean` | `false` | Opt-in Schema.org `SiteNavigationElement` Microdata on items. |
| `i18nStrings` | `NavbarI18nStrings` | — | Per-instance i18n overrides. |

### `NavbarItemDef`

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✓ | Unique React key. |
| `href` | `string` | ✓ | Navigation URL (passed through `sanitizeHref`). |
| `label` | `string` | ✓ | Visible label text. |
| `icon` | `ReactNode` | — | Icon displayed before the label. |
| `isActive` | `boolean` | — | Marks the current/active item (`aria-current="page"`). |
| `disabled` | `boolean` | — | Disables the item. |
| `badge` | `ReactNode` | — | Badge slot rendered after the label. |

---

## Variants

| Variant | Visual treatment |
|---|---|
| `pills` | Rounded filled background on the active item — default NavItem token behaviour. |
| `underline` | 2 px accent colour bottom-edge indicator on active item; no filled background. |
| `flush` | Plain text links; active item uses accent text colour only; no hover background. |
| `bordered` | Container has a raised-surface background and a border; active item fills normally. |

Variants are implemented as CSS custom-property override classes applied to the `<nav>` container. Child `NavItem` atoms re-resolve their tokens via cascade — no structural differences between variants.

---

## Sizes

| Size | NavItem height |
|---|---|
| `sm` | 32 px (`--size-component-sm`) |
| `md` | 40 px (`--size-component-md`) — default |
| `lg` | 48 px (`--size-component-lg`) |

---

## Tokens Used

| Token | Purpose |
|---|---|
| `--navbar-gap-sm/md/lg` | Gap between items per size |
| `--navbar-container-px/py` | Padding for the bordered variant container |
| `--navbar-bordered-bg` | Bordered container background |
| `--navbar-bordered-border` | Bordered container border colour |
| `--navbar-bordered-radius` | Bordered container corner radius |
| `--navbar-underline-border` | Bottom border of the underline variant container |
| `--navbar-underline-indicator` | Accent colour used for the underline indicator |
| `--navbar-underline-indicator-width` | Thickness of the underline indicator (2 px) |
| `--navbar-item-height-sm/md/lg` | NavItem height per size |

NavItem tokens (`--navitem-*`) are overridden by variant context classes in `geeklego.css`.

---

## Accessibility

**Semantic element:** `<nav>` (implicit `navigation` landmark role).

**ARIA attributes:**

| Attribute | Element | Value |
|---|---|---|
| `aria-label` | `<nav>` | Consumer-supplied or i18n default `"Navigation"` |
| `aria-current="page"` | Active `<a>` inside NavItem | Set automatically when `isActive={true}` |
| `aria-disabled` | Disabled `<a>` inside NavItem | Set automatically when `disabled={true}` |
| `aria-hidden="true"` | Icon wrappers | Set automatically by NavItem |

**Keyboard interaction:**

| Key | Action |
|---|---|
| `Tab` | Move focus to the next interactive element (standard link navigation) |
| `Shift + Tab` | Move focus to the previous interactive element |
| `Enter` / `Space` | Follow the focused link |

> Navbar is a list of navigation links, not a composite widget. Tab-based navigation (not arrow keys) is correct per WCAG. Arrow-key navigation applies only to `role="tablist"`, `role="menu"`, and similar composite widgets.

**Multiple nav landmarks:** When multiple `<Navbar>` components appear on the same page, each must have a unique `aria-label` (e.g. `"Primary navigation"`, `"Documentation navigation"`). Without unique labels, screen reader users cannot distinguish between landmarks.

**Touch targets:** Every NavItem anchor meets the WCAG 2.5.8 minimum 24 × 24 px CSS touch target.

---

## Schema.org

Add `schema={true}` to opt in. Each rendered `NavItem` receives `schema={true}`, applying `SiteNavigationElement` Microdata:

```html
<li itemscope itemtype="https://schema.org/SiteNavigationElement">
  <a href="/docs" itemprop="url">
    <span itemprop="name">Docs</span>
  </a>
</li>
```

**Type:** `https://schema.org/SiteNavigationElement`

| itemProp | Element | Value |
|---|---|---|
| `url` | `<a>` | href value |
| `name` | `<span>` inside anchor | Label text |

```tsx
<Navbar items={items} schema />
```

---

## i18n

| Key | Default | Description |
|---|---|---|
| `navLabel` | `"Navigation"` | `aria-label` for the `<nav>` landmark |

```tsx
<Navbar
  items={items}
  i18nStrings={{ navLabel: 'Navégation principale' }}
/>
```

---

## Usage

```tsx
import { Navbar } from './Navbar';

const items = [
  { id: 'home',  href: '/',     label: 'Home',  isActive: true },
  { id: 'docs',  href: '/docs', label: 'Docs'                  },
  { id: 'blog',  href: '/blog', label: 'Blog'                  },
];

// Primary navigation (pills, md)
<Navbar items={items} aria-label="Primary navigation" />

// Documentation sub-navigation (underline, sm)
<Navbar
  items={items}
  variant="underline"
  size="sm"
  aria-label="Documentation navigation"
/>

// Sidebar vertical navigation (flush)
<Navbar
  items={items}
  variant="flush"
  orientation="vertical"
  aria-label="Sidebar navigation"
/>
```

---

## RTL

All internal spacing uses logical properties via the underlying `NavItem` atom (`ps-*`, `pe-*`, `ms-*`, `me-*`). The Navbar container itself uses symmetric `gap` — no directional adjustments needed.
