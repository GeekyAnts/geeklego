# Header

Page-level banner landmark (`<header>`) with compound slots for light and dark theming, navigation, and actions. Manages responsive mobile menu state internally — no external state required.

---

## Usage

```tsx
import { Header } from '../../organisms/Header/Header';
import { NavItem } from '../../atoms/NavItem/NavItem';
import { Button } from '../../atoms/Button/Button';
import { Avatar } from '../../atoms/Avatar/Avatar';

<Header>
  <Header.Brand href="/">
    <Logo />
    <span className="truncate-label text-heading-h5">Geeklego</span>
  </Header.Brand>

  <Header.Nav>
    <NavItem href="/" label="Home" isActive />
    <NavItem href="/dashboard" label="Dashboard" />
    <NavItem href="/docs" label="Docs" />
  </Header.Nav>

  <Header.Actions>
    <Button variant="ghost" size="sm">Sign in</Button>
    <Button variant="primary" size="sm">Get started</Button>
  </Header.Actions>
</Header>
```

---

## Props

### `<Header>` (root)

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Compound slot children — Brand, Nav, Actions |
| `schema` | `boolean` | `false` | Opt-in Schema.org WPHeader Microdata |
| `i18nStrings` | `HeaderI18nStrings` | — | Override localised strings for this instance |
| `...rest` | `HTMLAttributes<HTMLElement>` | — | Forwarded to `<header>` element |

### `<Header.Brand>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Logo image, wordmark text, or both |
| `href` | `string` | `'#'` | URL the brand link navigates to. Sanitised via `sanitizeHref()` |
| `...rest` | `AnchorHTMLAttributes<HTMLAnchorElement>` | — | Forwarded to `<a>` element |

### `<Header.Nav>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Navigation items — typically `<NavItem>` atoms |
| `...rest` | `HTMLAttributes<HTMLElement>` | — | Forwarded to the desktop `<nav>` element |

### `<Header.Actions>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Action elements — typically `<Button>` atoms and/or `<Avatar>` |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | — | Forwarded to the wrapping `<div>` |

### `HeaderI18nStrings`

| Key | Default | Description |
|---|---|---|
| `navLabel` | `'Primary'` | `aria-label` for the primary `<nav>` landmark |
| `mobileNavLabel` | `'Navigation'` | `aria-label` for the mobile panel region |
| `openMenuLabel` | `'Open menu'` | Accessible label for mobile toggle when closed |
| `closeMenuLabel` | `'Close menu'` | Accessible label for mobile toggle when open |

---

## Compound Components

Header uses the compound component pattern. Each slot is a named static property on the root component:

| Component | Element | Purpose |
|---|---|---|
| `Header.Brand` | `<a>` | Navigable brand identity — logo + wordmark |
| `Header.Nav` | `<nav>` | Primary navigation. Renders desktop nav + mobile panel |
| `Header.Actions` | `<div>` | CTA buttons, icon buttons, avatar |

Internal only (not exported as standalone):

| Component | Purpose |
|---|---|
| `MobileToggle` | Hamburger / X button. Only renders on `<md` viewports |

---

## Tokens Used

All tokens are defined in `design-system/geeklego.css` under the `/* Header */` block.

| Token | Value (default) | Description |
|---|---|---|
| `--header-height` | `var(--size-component-2xl)` | Fixed height of the header bar |
| `--header-px` | `var(--spacing-layout-sm)` | Horizontal padding |
| `--header-gap` | `var(--spacing-component-md)` | Gap between direct children |
| `--header-nav-gap` | `var(--spacing-component-xs)` | Gap between nav items |
| `--header-actions-gap` | `var(--spacing-component-sm)` | Gap between action elements |
| `--header-bg` | `var(--color-surface-default)` | Header background |
| `--header-shadow` | `none` (light/dark) | Header elevation |
| `--header-border-color` | `var(--color-border-default)` | Bottom border |
| `--header-brand-text-color` | `var(--color-text-primary)` | Brand link text |
| `--header-brand-text-color-hover` | `var(--color-action-primary)` | Brand link hover text |
| `--header-brand-gap` | `var(--spacing-component-sm)` | Gap between logo and wordmark |
| `--header-mobile-panel-bg` | `var(--color-surface-default)` | Mobile panel background |
| `--header-mobile-panel-border` | `var(--color-border-default)` | Mobile panel bottom border |
| `--header-mobile-panel-shadow` | `var(--shadow-lg)` | Mobile panel elevation |
| `--header-mobile-panel-px` | `var(--spacing-layout-sm)` | Mobile panel horizontal padding |
| `--header-mobile-panel-py` | `var(--spacing-component-lg)` | Mobile panel vertical padding |

---

## Responsive Behaviour

| Viewport | Layout |
|---|---|
| `< md` (< 768px) | Brand · Actions · MobileToggle. Nav hidden. Toggle opens mobile panel below bar. |
| `≥ md` (≥ 768px) | Brand · Nav (flex-1, horizontal) · Actions. Toggle hidden. |

The mobile panel is positioned `absolute inset-x-0 top-[var(--header-height)]` relative to the `<header>` element (which acts as a containing block via `position: sticky`).

---

## States

| State | Description |
|---|---|
| Default | Mobile panel closed. Header sticky at top of viewport. |
| Mobile menu open | Panel slides in below bar. Toggle icon switches Menu — X. Focus remains in header. |
| Mobile menu closed | Dismissed by toggle click, Escape key, or click outside `<header>`. |

---

## Accessibility

### Semantic Element

`<header>` — announces as `"banner"` landmark to screen readers when it is a direct descendant of `<body>`. If nested, use `role="banner"` explicitly.

### ARIA Attributes

| Attribute | Element | Value | Description |
|---|---|---|---|
| `aria-label` | `<nav>` (desktop) | `i18n.navLabel` (default: `"Primary"`) | Distinguishes nav landmark |
| `aria-label` | `<nav>` (mobile) | `i18n.navLabel` | Distinguishes mobile nav landmark |
| `aria-hidden` | `<nav>` (mobile) | `true` when closed | Hides from AT when not visible |
| `aria-expanded` | Mobile toggle `<button>` | `true` / `false` | Communicates panel state |
| `aria-controls` | Mobile toggle `<button>` | mobile nav `id` | Links toggle to its panel |
| `id` | Mobile nav `<nav>` | Generated via `useId()` | Target for `aria-controls` |

### Keyboard Interaction

| Key | Behaviour |
|---|---|
| `Tab` | Moves focus through brand link, nav items, action buttons, mobile toggle |
| `Enter` / `Space` | Activates focused link or button |
| `Escape` | Closes mobile menu if open (via `useEscapeDismiss`) |
| Click outside | Closes mobile menu if open (via `useClickOutside`) |

### Screen Reader Announcements

- `<header>` — `"banner"` landmark
- `<nav aria-label="Primary">` — `"Primary navigation"` landmark
- Mobile toggle — `"Open menu, button"` / `"Close menu, expanded, button"`
- Brand link — `"[brand name], link"`
- `NavItem` with `isActive` — `"[label], current page, link"`

### Focus Management

Mobile menu opens and closes without moving focus from the toggle button. Tab order naturally flows into the mobile panel when it is visible.

---

## Schema.org

When `schema={true}`, the `<header>` element receives Schema.org Microdata:

```html
<header itemscope itemtype="https://schema.org/WPHeader">
```

This maps to the [WPHeader](https://schema.org/WPHeader) type — a specialisation of `WebPageElement` that identifies the page header region to search engines.

Pass `schema` to child `<NavItem>` elements separately if SiteNavigationElement markup is also desired.

### Usage

```tsx
<Header schema>
  <Header.Brand href="/">…</Header.Brand>
  <Header.Nav>
    <NavItem href="/" label="Home" isActive schema />
    <NavItem href="/docs" label="Docs" schema />
  </Header.Nav>
  <Header.Actions>…</Header.Actions>
</Header>
```

| Attribute | Value |
|---|---|
| `itemScope` | `true` |
| `itemType` | `https://schema.org/WPHeader` |

---

## Internationalisation

All system-generated strings are resolved via `useComponentI18n('header', i18nStrings)`. Pass custom strings per-instance via the `i18nStrings` prop, or provide them globally via `<GeeklegoI18nProvider strings={{ header: { — } }}>`.

```tsx
<Header
  i18nStrings={{
    navLabel: 'Hauptnavigation',
    mobileNavLabel: 'Navigation',
    openMenuLabel: 'Menü öffnen',
    closeMenuLabel: 'Menü schließen',
  }}
>
  …
</Header>
```

---

## Examples

### Minimal — light/dark + CTA only

```tsx
<Header>
  <Header.Brand href="/"><Logo /></Header.Brand>
  <Header.Actions>
    <Button variant="primary" size="sm">Get started</Button>
  </Header.Actions>
</Header>
```

### App shell — icon actions + avatar

```tsx
<Header>
  <Header.Brand href="/"><Logo /></Header.Brand>
  <Header.Nav>
    <NavItem href="/" label="Dashboard" isActive />
    <NavItem href="/settings" label="Settings" />
  </Header.Nav>
  <Header.Actions>
    <Button variant="ghost" size="sm" iconOnly leftIcon={<Bell size="var(--size-icon-md)" aria-hidden="true" />}>
      Notifications
    </Button>
    <Avatar variant="initials" initials="JD" size="sm" aria-label="Jane Doe — open user menu" />
  </Header.Actions>
</Header>
```

### Dark mode

```tsx
<div data-theme="dark">
  <Header>…</Header>
</div>
```

