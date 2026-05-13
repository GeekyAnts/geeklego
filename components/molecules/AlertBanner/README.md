# AlertBanner

A status message banner for surfacing informational, success, warning, and error feedback to users. Adapts its ARIA live region assertiveness to the severity of the message — errors and warnings interrupt immediately, while info and success wait for a pause.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Semantic status intent — controls colour palette, default icon, and ARIA live assertiveness |
| `appearance` | `'solid' \| 'subtle' \| 'outline' \| 'left-accent'` | `'subtle'` | Visual treatment strategy — each appearance uses a fundamentally different design approach |
| `size` | `'sm' \| 'md'` | `'md'` | Component scale — `'sm'` uses reduced padding for compact/dense layouts |
| `title` | `string` | — | Optional bold title line rendered above the description |
| `description` | `ReactNode` | — | Alert body content — accepts a string or any React node |
| `icon` | `ReactNode` | — | Override the default status icon entirely |
| `showIcon` | `boolean` | `true` | Whether to render the leading status icon |
| `dismissible` | `boolean` | `false` | Whether to render a dismiss (×) button on the trailing edge |
| `onDismiss` | `() => void` | — | Called when the user activates the dismiss button |
| `actions` | `ReactNode` | — | Optional action slot rendered below the description |
| `i18nStrings` | `AlertBannerI18nStrings` | — | Per-instance i18n string overrides |

---

## Variants

| Variant | Intent | ARIA live |
|---|---|---|
| `info` | General information, tips, neutral updates | `polite` (waits for pause) |
| `success` | Confirmation, task completed | `polite` |
| `warning` | Caution, approaching limit, impending issue | `assertive` (interrupts) |
| `error` | Failure, critical issue requiring action | `assertive` |

---

## Appearances

| Appearance | Visual strategy | When to use |
|---|---|---|
| `solid` | Filled status background, inverse text — maximum prominence | High-priority messages that demand attention |
| `subtle` | Muted tinted background + status-coloured border — balanced | Most common usage; clear but not overwhelming |
| `outline` | Transparent background + full status border — lightweight | Inline alerts, forms, or dense contexts |
| `left-accent` | Tinted background + bold 4px inline-start bar — contextual | Dashboard panels, sidebars, editorial content |

---

## Sizes

| Size | Padding | Icon | Typical use |
|---|---|---|---|
| `md` | `--spacing-component-lg` / `--spacing-component-md` | `--size-icon-md` | Default — most contexts |
| `sm` | `--spacing-component-md` / `--spacing-component-sm` | `--size-icon-sm` | Dense layouts, inline feedback, sidebars |

---

## Tokens Used

```
--alert-banner-radius
--alert-banner-min-width
--alert-banner-border-width
--alert-banner-accent-width
--alert-banner-px-md / --alert-banner-py-md / --alert-banner-gap-md
--alert-banner-px-sm / --alert-banner-py-sm / --alert-banner-gap-sm
--alert-banner-content-gap-md / --alert-banner-content-gap-sm
--alert-banner-actions-gap-md / --alert-banner-actions-gap-sm
--alert-banner-icon-size-md / --alert-banner-icon-size-sm
--alert-banner-dismiss-size / --alert-banner-dismiss-icon-size / --alert-banner-dismiss-radius
--alert-banner-{appearance}-{variant}-bg
--alert-banner-{appearance}-{variant}-text
--alert-banner-{appearance}-{variant}-border   (solid / subtle / outline)
--alert-banner-{appearance}-{variant}-accent   (left-accent only)
--alert-banner-{appearance}-{variant}-icon
--alert-banner-title-overflow / -whitespace / -text-overflow
--alert-banner-description-lines
```

---

## Usage

```tsx
import { AlertBanner } from '../molecules/AlertBanner/AlertBanner';

// Basic info
<AlertBanner
  variant="info"
  title="New feature available"
  description="Explore the updated dashboard for a faster workflow."
/>

// Dismissible error
<AlertBanner
  variant="error"
  appearance="solid"
  title="Payment failed"
  description="We could not process your card. Please update your billing details."
  dismissible
  onDismiss={() => setVisible(false)}
/>

// Warning with action
<AlertBanner
  variant="warning"
  appearance="left-accent"
  title="Subscription expiring"
  description="Your plan expires in 3 days."
  actions={<Button variant="outline" size="sm">Renew now</Button>}
/>

// Compact
<AlertBanner
  variant="success"
  size="sm"
  description="Draft saved."
/>

// Custom icon override
<AlertBanner
  variant="info"
  icon={<Zap size="var(--size-icon-md)" aria-hidden />}
  title="Quick tip"
  description="Press ⌘K to open the command palette."
/>

// i18n
<AlertBanner
  variant="error"
  dismissible
  i18nStrings={{ dismissLabel: 'Fermer l'alerte' }}
/>
```

---

## Schema.org

AlertBanner does not map to a Schema.org type — no `schema` prop is provided.

---

## Accessibility

### Semantic element

`<div>` — no native semantic element exists for status messages.

### ARIA roles and live regions

| Variant | Role | `aria-live` | Effect |
|---|---|---|---|
| `error`, `warning` | `alert` | `assertive` | Interrupts screen reader speech immediately — use for critical messages |
| `info`, `success` | `status` | `polite` | Waits for the screen reader to finish before announcing — use for non-critical updates |

Both roles set `aria-atomic="true"` via `getLiveRegionProps()` — the full banner content is read as a single announcement.

### Redundant cues

Colour is never the sole differentiator. Every variant provides:
- A unique lucide-react status icon (Info / CheckCircle / AlertTriangle / XCircle)
- A semantic ARIA role
- Distinct colour treatment

The icon wrapper carries `aria-hidden="true"` — the icon is decorative since the role/live region already communicates status.

### Dismiss button

The dismiss button renders with:
- `type="button"` to prevent form submission
- `aria-label` sourced from `i18nStrings.dismissLabel` (default: `"Dismiss"`)
- Minimum 24×24px touch target via `.touch-target`
- `focus-visible:focus-ring` for keyboard focus indicator

### Keyboard interaction

| Key | Action |
|---|---|
| `Tab` | Move focus to the dismiss button (when `dismissible={true}`) |
| `Enter` / `Space` | Activate the dismiss button |

### Screen reader announcement

When the banner mounts or its content changes, screen readers announce:
- **error/warning**: immediately interrupts — `"[title], [description]"` — assertive
- **info/success**: waits for a pause — `"[title], [description]"` — polite

### i18n

| Key | Default | Description |
|---|---|---|
| `dismissLabel` | `"Dismiss"` | `aria-label` on the dismiss button |