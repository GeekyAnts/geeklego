# Toast

Floating, transient notification that overlays the page. Toast differs from AlertBanner in three key ways:

1. **It floats** — receives `--toast-shadow` (resolved from `--shadow-lg`), unlike the static, shadow-free AlertBanner
2. **It defaults to dismissible** — dismiss button shown by default
3. **It can auto-dismiss** — accepts a `duration` prop and optional countdown progress bar

Use Toast for transient feedback: file saved, connection lost, session expiring. For persistent, inline messages that are part of the page flow, use `AlertBanner`.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Status intent — drives colour, icon, and ARIA assertiveness |
| `appearance` | `'solid' \| 'subtle' \| 'outline' \| 'left-accent'` | `'subtle'` | Visual treatment strategy |
| `size` | `'sm' \| 'md'` | `'md'` | Padding and typography scale |
| `title` | `string` | — | Optional bold title above description |
| `description` | `ReactNode` | — | Toast body content |
| `icon` | `ReactNode` | — | Override the default status icon |
| `showIcon` | `boolean` | `true` | Toggle the leading status icon |
| `dismissible` | `boolean` | `true` | Render a dismiss (×) button on the trailing edge |
| `onDismiss` | `() => void` | — | Called on manual dismiss and on auto-timeout |
| `duration` | `number` | `0` | Auto-dismiss delay in ms; 0 = disabled |
| `showProgress` | `boolean` | `false` | Show countdown progress bar (requires `duration > 0`) |
| `actions` | `ReactNode` | — | Action buttons/links below the description |
| `i18nStrings` | `ToastI18nStrings` | — | Per-instance string overrides |
| `className` | `string` | — | Additional Tailwind classes |

All native `HTMLDivElement` attributes (`id`, `data-*`, etc.) are forwarded.

---

## Variants

| Variant | Icon | ARIA behaviour |
|---|---|---|
| `info` | `<Info />` | `role="status"` — polite live region |
| `success` | `<CheckCircle />` | `role="status"` — polite live region |
| `warning` | `<AlertTriangle />` | `role="alert"` — assertive live region |
| `error` | `<XCircle />` | `role="alert"` — assertive live region |

---

## Appearances

Each appearance uses a fundamentally different visual strategy — not just a colour shift.

| Appearance | Background | Border | Text |
|---|---|---|---|
| `solid` | Filled status colour | None (transparent) | Inverse (white) |
| `subtle` | Muted status tint | Status colour | Status text colour |
| `outline` | `--color-surface-raised` | Status colour (full) | Status text colour |
| `left-accent` | Muted status tint | Bold inline-start bar only | Status text colour |

> **Outline vs AlertBanner:** Toast's `outline` appearance uses `--color-surface-raised` (not transparent) because a floating overlay must have a solid background. AlertBanner's `outline` can be transparent because it sits within page content.

---

## Auto-dismiss

```tsx
// Auto-dismisses after 4 seconds, calls onDismiss when timer fires
<Toast
  variant="success"
  title="File uploaded"
  description="document.pdf has been saved."
  duration={4000}
  onDismiss={() => setToasts(t => t.filter(x => x.id !== id))}
/>

// With countdown progress bar
<Toast
  variant="info"
  title="Redirecting"
  description="You will be redirected in 5 seconds."
  duration={5000}
  showProgress
  onDismiss={() => router.push('/dashboard')}
/>
```

---

## Usage

```tsx
import { Toast } from './molecules/Toast/Toast';

// Minimal
<Toast description="Changes saved." />

// Full
<Toast
  variant="error"
  appearance="subtle"
  size="md"
  title="Upload failed"
  description="Maximum file size is 10 MB."
  dismissible
  onDismiss={() => removeToast(id)}
/>

// With actions
<Toast
  variant="warning"
  title="Session expiring"
  description="Your session expires in 2 minutes."
  actions={
    <button type="button" onClick={refreshSession}>
      Extend session
    </button>
  }
/>
```

---

## Design Tokens Used

| Token | Value |
|---|---|
| `--toast-radius` | `var(--radius-component-md)` |
| `--toast-shadow` | `var(--shadow-lg)` |
| `--toast-min-width` | `var(--content-min-width-md)` |
| `--toast-max-width` | `var(--content-max-width-overlay-sm)` |
| `--toast-z` | `var(--layer-notification)` |
| `--toast-{appearance}-{variant}-bg` | Status-aware background |
| `--toast-{appearance}-{variant}-text` | Status-aware text colour |
| `--toast-{appearance}-{variant}-border` | Status-aware border |
| `--toast-{appearance}-{variant}-icon` | Status-aware icon colour |
| `--toast-{appearance}-{variant}-progress` | Countdown bar colour |
| `--toast-progress-height` | `var(--spacing-component-xs)` |
| `--toast-dismiss-size` | `var(--size-component-xs)` |

---

## Accessibility

**Semantic element:** `<div>` with ARIA live region role

**Live region roles:**
- `variant="info"` / `"success"` — `role="status"` + `aria-live="polite"` + `aria-atomic="true"`
- `variant="warning"` / `"error"` — `role="alert"` + `aria-live="assertive"` + `aria-atomic="true"`

**ARIA attributes:**

| Attribute | Element | Purpose |
|---|---|---|
| `role="alert"` | Root `<div>` (error/warning) | Assertive live region |
| `role="status"` | Root `<div>` (info/success) | Polite live region |
| `aria-live` | Root `<div>` | `"assertive"` or `"polite"` |
| `aria-atomic="true"` | Root `<div>` | Announce entire toast as one unit |
| `aria-label` | Dismiss `<button>` | `"Dismiss"` (i18n-overridable) |
| `aria-hidden="true"` | Icon wrapper `<span>` | Decorative icons excluded from tree |
| `aria-hidden="true"` | Progress bar `<div>` | Purely visual; toast is already announced |

**Keyboard interaction:**

| Key | Behaviour |
|---|---|
| `Tab` | Move focus to dismiss button (when `dismissible=true`) |
| `Enter` / `Space` | Activate dismiss button |

**Screen reader announcements:**
- On mount: `"[title], [description]"` — announced based on live region priority
- Error/warning: interrupts the current reading immediately
- Info/success: queued for the next pause in reading
- Dismiss button: `"Dismiss, button"`

**Touch targets:** Dismiss button uses `.touch-target` — minimum 24×24 px WCAG 2.5.8.

**i18n:** Override the dismiss label per-instance via `i18nStrings={{ dismissLabel: 'Close' }}` or globally via `GeeklegoI18nProvider`.

---

## Notes

- Toast does not manage positioning or stacking. For a full notification stack, use a `ToastProvider` (L3 organism — planned).
- The countdown progress bar (`showProgress`) is purely visual and `aria-hidden`. The toast itself is already announced by the live region.
- Auto-dismiss fires `onDismiss` after `duration` ms. The consumer is responsible for removing the Toast from the DOM.