# Sidebar

**Level:** L3 Organism
**Location:** `components/organisms/Sidebar/`

A collapsible navigation sidebar with workspace light and dark theming, grouped nav items, and a user identity footer. Supports expanded and icon-rail (collapsed) modes with a smooth CSS width transition.

---

## Import

```tsx
import { Sidebar } from '../../organisms/Sidebar/Sidebar';
import { NavItem } from '../../atoms/NavItem/NavItem';
```

---

## Usage

### Basic (uncontrolled)

```tsx
<Sidebar>
  <Sidebar.Header
    logo={<MyLogo />}
    workspaceName="Acme Inc"
    workspaceTier="Enterprise"
    actions={<WorkspaceSwitcherButton />}
  />
  <Sidebar.Content>
    <Sidebar.Group label="Platform">
      <NavItem label="Dashboard" icon={<LayoutDashboard />} href="/dashboard" isActive />
      <NavItem label="Settings" icon={<Settings2 />} href="/settings" />
    </Sidebar.Group>
  </Sidebar.Content>
  <Sidebar.Footer user={{ name: 'shadcn', email: 'm@example.com' }} onUserMenuOpen={() => {}} />
</Sidebar>
```

### Controlled collapsed state

```tsx
const [collapsed, setCollapsed] = useState(false);

<Sidebar
  collapsed={collapsed}
  onCollapse={() => setCollapsed(true)}
  onExpand={() => setCollapsed(false)}
>
  {/* ... */}
</Sidebar>
```

### Multiple groups

```tsx
<Sidebar.Content>
  <Sidebar.Group label="Platform">
    <NavItem label="Dashboard" icon={<LayoutDashboard />} href="/dashboard" />
  </Sidebar.Group>
  <Sidebar.Group label="Settings">
    <NavItem label="Account" icon={<User />} href="/account" />
  </Sidebar.Group>
</Sidebar.Content>
```

### Expandable nav item with sub-items

```tsx
const [open, setOpen] = useState(false);

<NavItem
  label="Playground"
  icon={<SquareTerminal />}
  isExpandable
  isExpanded={open}
  onToggle={() => setOpen(v => !v)}
>
  <NavItem label="History" href="/playground/history" />
  <NavItem label="Starred" href="/playground/starred" />
</NavItem>
```

---

## Props

### `Sidebar`

| Prop | Type | Default | Description |
|---|---|---|---|
| `collapsed` | `boolean` | `false` | Controlled collapsed (icon-rail) state |
| `onCollapse` | `() => void` | — | Called when the collapse toggle fires |
| `onExpand` | `() => void` | — | Called when the expand toggle fires |
| `collapsible` | `boolean` | `true` | Show/hide the collapse toggle button |
| `loading` | `boolean` | `false` | Show skeleton loading placeholders |
| `schema` | `boolean` | `false` | Enable Schema.org WPSideBar Microdata |
| `i18nStrings` | `SidebarI18nStrings` | — | Per-instance i18n string overrides |
| `children` | `ReactNode` | — | Sidebar.Header, Content, Footer slots |

### `Sidebar.Header`

| Prop | Type | Default | Description |
|---|---|---|---|
| `logo` | `ReactNode` | **required** | Rendered inside the fixed rounded-square logo container |
| `workspaceName` | `string` | **required** | Primary workspace name |
| `workspaceTier` | `string` | — | Secondary tier/subtitle line |
| `actions` | `ReactNode` | — | Slot after workspace text (workspace-switcher, etc.) |

### `Sidebar.Content`

Renders a `<nav>` region. Pass `Sidebar.Group` or `NavItem` as direct children.

### `Sidebar.Group`

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Overline section label, hidden when sidebar is collapsed |
| `children` | `ReactNode` | **required** | NavItem children |

### `Sidebar.Footer`

| Prop | Type | Default | Description |
|---|---|---|---|
| `user` | `SidebarUser` | **required** | User identity object |
| `onUserMenuOpen` | `() => void` | — | Makes the row interactive; opens a menu on click |

### `SidebarUser`

| Field | Type | Description |
|---|---|---|
| `name` | `string` | Display name |
| `email` | `string` | Email address |
| `avatarSrc` | `string?` | Avatar image URL |
| `avatarAlt` | `string?` | Avatar alt text (defaults to "User avatar") |

---

## Component Tokens

| Token | Aliases | Description |
|---|---|---|
| `--sidebar-width` | `16rem` | Expanded width |
| `--sidebar-width-collapsed` | `--size-component-2xl` | Collapsed icon-rail width (64px) |
| `--sidebar-transition-width` | `--duration-enter` | Width transition duration (300ms) |
| `--sidebar-bg` | `--color-bg-secondary` | Sidebar surface background |
| `--sidebar-border-color` | `--color-border-subtle` | Right edge border |
| `--sidebar-header-height` | `--size-component-2xl` | Header row height |
| `--sidebar-header-padding-x` | `--spacing-component-md` | Header horizontal padding |
| `--sidebar-header-gap` | `--spacing-component-sm` | Header item gap |
| `--sidebar-logo-size` | `--size-component-sm` | Logo square size (32px) |
| `--sidebar-logo-radius` | `--radius-component-md` | Logo square corner radius |
| `--sidebar-logo-bg` | `--color-bg-inverse` | Logo background |
| `--sidebar-logo-color` | `--color-text-inverse` | Logo icon color |
| `--sidebar-workspace-name-color` | `--color-text-primary` | Workspace name text |
| `--sidebar-workspace-tier-color` | `--color-text-secondary` | Workspace tier text |
| `--sidebar-toggle-color` | `--color-text-tertiary` | Toggle icon resting color |
| `--sidebar-toggle-color-hover` | `--color-text-secondary` | Toggle icon hover color |
| `--sidebar-toggle-bg-hover` | `--color-action-secondary` | Toggle background hover |
| `--sidebar-toggle-size` | `--size-component-sm` | Toggle button size |
| `--sidebar-content-padding-x` | `--spacing-component-md` | Nav region horizontal padding |
| `--sidebar-content-padding-y` | `--spacing-component-md` | Nav region vertical padding |
| `--sidebar-content-gap` | `--spacing-component-xs` | Gap between nav items |
| `--sidebar-group-label-color` | `--color-text-tertiary` | Group label text color |
| `--sidebar-footer-height` | `--size-component-2xl` | Footer row height |
| `--sidebar-footer-name-color` | `--color-text-primary` | Footer user name color |
| `--sidebar-footer-email-color` | `--color-text-secondary` | Footer email color |
| `--sidebar-footer-trigger-bg-hover` | `--color-action-secondary` | Footer row hover background |
| `--sidebar-divider-color` | `--color-border-subtle` | Header/footer border lines |

---

## Accessibility

### Semantic HTML

The Sidebar uses the following semantic structure:

```
<aside aria-label="Sidebar">        — complementary landmark
  <div>                             — header (not a landmark)
    <button aria-label="Collapse sidebar" />   — collapse toggle
  </div>
  <nav aria-label="Sidebar navigation">  — navigation landmark
    <ul>                            — group item list
      <li>                          — NavItem (link or button)
    </ul>
  </nav>
  <footer aria-label="Sidebar footer">   — footer (scoped)
    <button />                      — user menu trigger (when interactive)
  </footer>
</aside>
```

### Keyboard Interaction

| Key | Action |
|---|---|
| `Tab` | Enter sidebar; focus moves to collapse toggle |
| `Tab` | Move into nav region; first nav item receives focus |
| `Arrow Down` | Move to next nav item (roving tabindex) |
| `Arrow Up` | Move to previous nav item |
| `Home` | Jump to first nav item |
| `End` | Jump to last nav item |
| `Enter` / `Space` | Activate nav link or toggle expandable item |
| `Tab` | Exit nav region; move to footer user button |

### ARIA Attributes

| Element | Attribute | Value |
|---|---|---|
| `<aside>` | `aria-label` | "Sidebar" (i18n key: `sidebarLabel`) |
| `<aside>` | `aria-busy` | `true` during loading state |
| `<nav>` | `aria-label` | "Sidebar navigation" (i18n key: `navLabel`) |
| `<footer>` | `aria-label` | "Sidebar footer" (i18n key: `footerLabel`) |
| Collapse toggle | `aria-label` | "Collapse sidebar" / "Expand sidebar" (switches on state) |
| Expandable NavItem | `aria-expanded` | `true` / `false` (managed by NavItem atom) |
| Active NavItem | `aria-current` | `"page"` (managed by NavItem atom) |

### Screen Reader Announcements

- Focused into `<aside>`: "Sidebar, complementary"
- Focused into `<nav>`: "Sidebar navigation, navigation"
- Loading state: "Sidebar, busy" (via `aria-busy`)
- Collapse toggle: "Collapse sidebar, button" or "Expand sidebar, button"

### Touch Target Compliance

All interactive elements (collapse toggle: 32×32px, footer row: 64px tall) meet WCAG 2.5.8 minimum 24×24px touch targets.

---

## Schema.org

**Type:** `WPSideBar` (`https://schema.org/WPSideBar`)

When `schema={true}`:

- `<aside>` receives `itemScope itemType="https://schema.org/WPSideBar"`
- `schema` prop cascades to `Sidebar.Footer`'s `<footer>` element
- NavItems with `href` receive `SiteNavigationElement` Microdata (managed by NavItem atom — pass `schema` to each `NavItem` to enable)

```tsx
<Sidebar schema>
  <Sidebar.Content>
    <NavItem label="Dashboard" href="/dashboard" schema />
  </Sidebar.Content>
</Sidebar>
```

---

## i18n

Component key: `sidebar` in `GeeklegoI18nStrings`.

| String key | Default | When used |
|---|---|---|
| `sidebarLabel` | `"Sidebar"` | `aria-label` on `<aside>` |
| `navLabel` | `"Sidebar navigation"` | `aria-label` on `<nav>` |
| `footerLabel` | `"Sidebar footer"` | `aria-label` on `<footer>` |
| `expandLabel` | `"Expand sidebar"` | Collapse toggle when collapsed |
| `collapseLabel` | `"Collapse sidebar"` | Collapse toggle when expanded |

Override via prop:

```tsx
<Sidebar
  i18nStrings={{
    sidebarLabel: 'Main navigation',
    collapseLabel: 'Hide sidebar',
    expandLabel: 'Show sidebar',
  }}
>
```

Or globally via `GeeklegoI18nProvider`:

```tsx
<GeeklegoI18nProvider strings={{ sidebar: { sidebarLabel: 'Navigation' } }}>
```

---

## Theming

| Theme | `<aside>` shadow | Toggle button shadow | Footer row |
|---|---|---|---|
| Light | `none` — static panel | `none` at rest | Flat hover background |
| Dark | `none` — static panel | `none` at rest | Flat hover background |
| Brand | `none` — static panel | `none` at rest | Flat hover background |

The Sidebar is a static panel that sits flush in the layout — it does not float above page content. Shadows only appear on overlays (modals, dropdowns, tooltips). The collapse toggle and footer row interactive buttons inherit the flat light/dark hover pattern from `--color-action-secondary`.