# VisuallyHidden

A utility atom that renders its children invisibly to sighted users while keeping the content fully accessible to screen readers and other assistive technologies.

Uses the `.sr-only` utility class from `design-system/geeklego.css`:

```css
position: absolute;
width: 1px;
height: 1px;
padding: 0;
margin: -1px;
overflow: hidden;
clip: rect(0, 0, 0, 0);
white-space: nowrap;
border-width: 0;
```

---

## When to use

| Use case | Pattern |
|---|---|
| Icon-only button label | `<button><Icon /><VisuallyHidden>Open menu</VisuallyHidden></button>` |
| Badge count context | `<span aria-hidden>7</span><VisuallyHidden>7 unread messages</VisuallyHidden>` |
| Loading status announcement | `<div role="status" aria-live="polite"><VisuallyHidden>Saving…</VisuallyHidden></div>` |
| Navigation landmark description | `<nav><VisuallyHidden as="p">Primary navigation — 4 sections</VisuallyHidden>…</nav>` |
| Avatar alt text (non-`<img>`) | `<span role="img"><VisuallyHidden>Jane Smith's avatar</VisuallyHidden></span>` |

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `'span' \| 'div' \| 'p'` | `'span'` | HTML element to render. Use `span` in inline contexts, `div` or `p` in block contexts. |
| `children` | `ReactNode` | — | Content hidden from sighted users, announced by screen readers. |
| `className` | `string` | — | Additional CSS classes. |
| `...rest` | `HTMLAttributes<HTMLElement>` | — | Any native HTML attribute — `id`, `aria-live`, `aria-atomic`, `role`, etc. |

---

## Element choice — `as` prop

Choose the rendered element based on the surrounding context:

```tsx
// — span — default. Safe inside <p>, <a>, <button>, or any inline parent.
<button>
  <SearchIcon />
  <VisuallyHidden>Search</VisuallyHidden>
</button>

// — div — block parent, no paragraph semantics needed.
<div role="status" aria-live="polite">
  <VisuallyHidden as="div">Data loaded successfully</VisuallyHidden>
</div>

// — p — block parent where a paragraph is the correct semantic.
<nav aria-label="Primary">
  <VisuallyHidden as="p">
    Primary navigation — 4 sections available
  </VisuallyHidden>
  …
</nav>
```

---

## Tokens Used

None. VisuallyHidden is a passthrough atom. It applies the structural `.sr-only` class from `geeklego.css` and has no visual appearance to tokenize. It is correctly theme-agnostic.

---

## Variants

VisuallyHidden has no visual variants — it is always invisible to sighted users. The `as` prop controls the rendered HTML element, not any visual difference.

---

## Sizes

VisuallyHidden has no size variants. The element is always rendered at 1×1px (via `.sr-only`), regardless of content length or `as` element choice.

---

## States

VisuallyHidden has no visual states. It does not respond to hover, focus, disabled, or loading states. For dynamic content updates, combine it with an `aria-live` region:

```tsx
// Polite — announced when screen reader is idle
<div role="status" aria-live="polite" aria-atomic="true">
  <VisuallyHidden>12 results loaded</VisuallyHidden>
</div>

// Assertive — interrupts current speech (use sparingly)
<div role="alert" aria-live="assertive">
  <VisuallyHidden>Error: Session expired. Please log in again.</VisuallyHidden>
</div>
```

---

## Accessibility

### Semantic element

| Context | Element | Rendered HTML |
|---|---|---|
| Inline (default) | `span` | `<span class="sr-only">…</span>` |
| Block wrapper | `div` | `<div class="sr-only">…</div>` |
| Paragraph text | `p` | `<p class="sr-only">…</p>` |

### WCAG 2.2 compliance

| Success Criterion | Level | How VisuallyHidden helps |
|---|---|---|
| SC 1.1.1 Non-text Content | A | Provides text alternative for icon-only controls |
| SC 1.3.1 Info and Relationships | A | Makes visually implicit information available programmatically |
| SC 4.1.3 Status Messages | AA | Text placed in `role="status"` / `aria-live` regions is announced without focus change |

### Screen reader announcement

The element is present in the accessibility tree and read in document order. Screen readers announce the text content normally.

```
Button with icon + VisuallyHidden:
  — NVDA/JAWS: "Search, button"
  — VoiceOver: "Search, button"
  — TalkBack: "Search, button"
```

### Keyboard interaction

VisuallyHidden is a non-interactive element. It has no keyboard interaction of its own.

| Key | Effect |
|---|---|
| — | No keyboard interaction. Content is read in document order. |

### ARIA attributes accepted via `...rest`

| Attribute | Purpose | Example |
|---|---|---|
| `aria-live` | Declares a live region | `aria-live="polite"` |
| `aria-atomic` | Announces full region on change | `aria-atomic="true"` |
| `id` | Allows `aria-labelledby` / `aria-describedby` references | `id="nav-description"` |
| `role` | Declares widget semantics | `role="status"` |

### Do not use for focusable content

VisuallyHidden uses `.sr-only` which renders the element off-screen and clips it — focus still works, but the element has no visible focus indicator. If you need content that is hidden by default but revealed on focus (like a skip link), use the `SkipLink` component instead.

---

## Usage

```tsx
import { VisuallyHidden } from './atoms/VisuallyHidden/VisuallyHidden';

// Icon-only button
<button type="button" onClick={openSearch}>
  <SearchIcon aria-hidden="true" />
  <VisuallyHidden>Search</VisuallyHidden>
</button>

// Loading status
<div role="status" aria-live="polite">
  <Spinner size="sm" />
  <VisuallyHidden>Loading your dashboard…</VisuallyHidden>
</div>

// Badge with full count context
<span className="badge">
  <span aria-hidden="true">3</span>
  <VisuallyHidden>3 new notifications</VisuallyHidden>
</span>

// Navigation landmark description
<nav aria-labelledby="primary-nav-desc">
  <VisuallyHidden id="primary-nav-desc" as="p">
    Main navigation — 5 sections
  </VisuallyHidden>
  <ul>…</ul>
</nav>
```

---

## Implementation notes

- The component renders exactly one DOM element — no wrappers, no portals.
- No design tokens are used — the component has no visual appearance.
- Content length has no effect on layout — `.sr-only` clips the element to 1×1px regardless.
- The component is `memo`-wrapped and uses `forwardRef` for consistency with the atom pattern, even though neither is strictly necessary for a non-interactive element.