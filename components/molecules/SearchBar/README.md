# SearchBar

A search input molecule with an integrated clear button and optional submit button. Wraps the native `<input type="search">` in a `role="search"` ARIA landmark so screen readers announce the search region separately from the main content.

SearchBar does **not** import the Input atom internally — the atom's `rightIcon` slot is `aria-hidden`, making it unsuitable for an interactive clear button. SearchBar reuses the same `--search-bar-*` CSS tokens (aliasing the same semantics) to remain visually consistent with the Input atom.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'default' \| 'filled'` | `'default'` | Visual style: outlined (border at rest) or filled (muted bg at rest). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and typography scale. |
| `value` | `string` | — | Controlled value. Component becomes controlled when provided. |
| `defaultValue` | `string` | `''` | Initial value for uncontrolled mode. |
| `onValueChange` | `(value: string) => void` | — | Fires on every keystroke with the current string value. |
| `onSearch` | `(value: string) => void` | — | Fires on Enter key press or search button click. |
| `onClear` | `() => void` | — | Fires when the clear button (×) is clicked. |
| `searchButton` | `ReactNode` | — | Optional `<Button>` rendered to the right of the input field. |
| `disabled` | `boolean` | `false` | Disables the input and clear button. |
| `isLoading` | `boolean` | `false` | Shows a spinner in place of the clear button. Sets `aria-busy`. |
| `error` | `boolean` | `false` | Applies error border styling. Sets `aria-invalid`. |
| `label` | `string` | i18n `'Search'` | Visible label above the field. Also used as the landmark `aria-label`. |
| `labelHidden` | `boolean` | `false` | Renders the label as `sr-only` — hidden visually, present for screen readers. |
| `placeholder` | `string` | resolved `label` | Input placeholder. Defaults to the resolved label value. |
| `id` | `string` | `useId()` | Forwarded to `<input>`. Auto-generated when omitted. |
| `schema` | `boolean` | `false` | When `true` and `searchUrl` is provided, injects a JSON-LD `SearchAction` block. |
| `searchUrl` | `string` | — | URL template for Schema.org, e.g. `'https://example.com/search?q={search_term_string}'`. |
| `i18nStrings` | `SearchBarI18nStrings` | — | Per-instance i18n string overrides. |

All other `InputHTMLAttributes` are forwarded to the inner `<input type="search">` element.

---

## Tokens Used

| Token | Purpose |
|---|---|
| `--search-bar-radius` | Border radius of the input wrapper |
| `--search-bar-gap` | Gap between wrapper and optional search button |
| `--search-bar-bg` / `--search-bar-bg-hover` | Default variant background |
| `--search-bar-filled-bg` / `--search-bar-filled-bg-hover` / `--search-bar-filled-bg-focus` | Filled variant background |
| `--search-bar-border` / `--search-bar-border-hover` / `--search-bar-border-focus` | Border colors |
| `--search-bar-border-error` / `--search-bar-border-disabled` | State border colors |
| `--search-bar-text` / `--search-bar-text-placeholder` / `--search-bar-text-disabled` | Text colors |
| `--search-bar-shadow` / `--search-bar-shadow-hover` | Shadow (none at rest; elevated on focus-within) |
| `--search-bar-icon-color` | Search icon color |
| `--search-bar-icon-size-{sm\|md\|lg}` | Search icon dimensions |
| `--search-bar-clear-color` / `--search-bar-clear-color-hover` | Clear button icon color |
| `--search-bar-clear-bg-hover` | Clear button background on hover |
| `--search-bar-clear-radius` | Clear button border radius |
| `--search-bar-clear-size-{sm\|md\|lg}` | Clear button icon dimensions |
| `--search-bar-height-{sm\|md\|lg}` | Component height |
| `--search-bar-px-{sm\|md\|lg}` | Input horizontal padding |
| `--search-bar-icon-offset-{sm\|md\|lg}` | Input start padding to clear the search icon |
| `--search-bar-clear-pe-{sm\|md\|lg}` | Input end padding when clear button is visible |
| `--search-bar-clear-inset-{sm\|md\|lg}` | Clear button inline-end inset position |
| `--search-bar-min-width` | Minimum width for responsive layout protection |

---

## Variants

| Variant | Visual strategy |
|---|---|
| `default` | Visible border at rest. Bg tints + border darkens on hover. Brand border on focus-within. |
| `filled` | Muted bg, transparent border at rest. Bg deepens on hover. White bg + brand border on focus-within. |

Both variants support all sizes, states, and the optional search button.

---

## Sizes

| Size | Height | Typography |
|---|---|---|
| `sm` | `--size-component-sm` (2rem) | `text-body-sm` |
| `md` | `--size-component-md` (2.5rem) | `text-body-md` |
| `lg` | `--size-component-lg` (3rem) | `text-body-lg` |

---

## States

| State | Visual treatment |
|---|---|
| Default (empty) | Resting appearance. No clear button. |
| With value | Clear (×) button visible at inline-end. |
| Loading | Spinner replaces clear button. Input `aria-busy="true"`. |
| Error | Border locked to error color. Input `aria-invalid="true"`. |
| Disabled | Muted bg + text. No hover/focus response. `cursor-not-allowed`. |
| Focus-within | Focus ring on inner `<input>`. Container border highlights. |

---

## Internationalization

SearchBar uses two system strings managed via `i18nStrings`:

| String key | Default | Description |
|---|---|---|
| `searchLabel` | `'Search'` | Label text and landmark `aria-label` when `label` prop is omitted. |
| `clearLabel` | `'Clear search'` | `aria-label` for the clear (×) button. |

```tsx
<SearchBar
  i18nStrings={{
    searchLabel: 'Rechercher',
    clearLabel: 'Effacer la recherche',
  }}
/>
```

---

## Schema.org

**Type:** `SearchAction` (via JSON-LD `<script>`, injected into `<head>`)

SearchAction does not map to a single DOM element and cannot use Microdata. Instead, it uses JSON-LD via the `<StructuredData>` utility, which renders no visible DOM.

**Required props:** `schema={true}` + `searchUrl="https://example.com/search?q={search_term_string}"`

```tsx
<SearchBar
  label="Search"
  schema
  searchUrl="https://example.com/search?q={search_term_string}"
/>
```

**Emitted JSON-LD:**

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://example.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

---

## Accessibility

**Semantic element:** `<div role="search">` landmark containing `<label>` + `<input type="search">`

The `role="search"` landmark is announced by screen readers as a distinct region, allowing users to jump directly to search via landmark navigation (e.g. NVDA's `Q` key, VoiceOver rotor).

| Attribute | Element | Value |
|---|---|---|
| `role="search"` | Outer `<div>` | Marks the search region as an ARIA landmark |
| `aria-label` | Outer `<div>` | Resolved from `label` prop or i18n default |
| `htmlFor` | `<label>` | Associated with input via `id` |
| `type="search"` | `<input>` | Native search semantics; browser may add a system clear button (suppressed by SearchBar's own clear) |
| `aria-busy` | `<input>` | `true` when `isLoading` is set |
| `aria-disabled` | `<input>` | `true` when `disabled` is set |
| `aria-invalid` | `<input>` | `"true"` when `error` is set |
| `aria-describedby` | `<input>` | Points to the error message span when `error` is set |
| `aria-label` | Clear `<button>` | Resolved from i18n `clearLabel` — announces as "Clear search, button" |
| `aria-hidden` | Search icon `<span>` | `true` — decorative icon, not announced |
| `aria-hidden` | Spinner `<span>` | `true` — loading state communicated via `aria-busy` on input |

**Keyboard interaction:**

| Key | Context | Behaviour |
|---|---|---|
| `Tab` | Any | Focuses input; then clear button (when visible); then search button (when present) |
| `Enter` | Input focused | Fires `onSearch(currentValue)` |
| `Enter` / `Space` | Clear button focused | Clears value, returns focus to input |
| `Enter` / `Space` | Search button focused | Submits search (controlled by the Button consumer) |

**Touch target:** The clear button has a minimum size of `--size-component-xs` (24×24 px CSS) — meets WCAG 2.5.8.

**Screen reader announcement (VoiceOver / NVDA):**
- Entering landmark: *"Search landmark"*
- Input: *"Search documentation, search, edit text"*
- Clear button: *"Clear search, button"*
- Loading: *"Search documentation, busy, search, edit text"*

---

## Usage

```tsx
import { SearchBar } from './SearchBar';
import { Button } from '../atoms/Button/Button';

// Uncontrolled — shows clear button, no submit
<SearchBar
  label="Search"
  placeholder="Search products…"
  onSearch={(value) => console.log('search:', value)}
/>

// Controlled
<SearchBar
  label="Search"
  value={query}
  onValueChange={setQuery}
  onSearch={handleSearch}
  onClear={() => setQuery('')}
/>

// With attached submit button (sizes should match)
<SearchBar
  label="Search"
  labelHidden
  size="md"
  onSearch={handleSearch}
  searchButton={<Button size="md" onClick={() => handleSearch(query)}>Search</Button>}
/>

// Filled variant with Schema.org
<SearchBar
  label="Search"
  variant="filled"
  schema
  searchUrl="https://example.com/search?q={search_term_string}"
/>
```