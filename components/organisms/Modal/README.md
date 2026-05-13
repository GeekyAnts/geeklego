# Modal

A modal dialog overlay that renders into a portal on `document.body`. Traps focus within the dialog, dismisses on Escape key or backdrop click, and announces itself via `role="dialog"`.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | — | Controls visibility. When `false`, nothing is rendered. |
| `onClose` | `() => void` | — | Called when the modal should close (Escape, backdrop click, close button). |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Width preset of the dialog panel. |
| `title` | `string` | — | Title text shown in the header. Used for `aria-labelledby`. When omitted, `aria-label` fallback applies. |
| `loading` | `boolean` | `false` | Replaces body content with skeleton rows. Sets `aria-busy`. |
| `closeOnBackdropClick` | `boolean` | `true` | When `false`, clicking the backdrop does not call `onClose`. |
| `className` | `string` | — | Additional class applied to the dialog panel element. |
| `children` | `ReactNode` | — | Compose `Modal.Body` and `Modal.Footer` inside. |
| `i18nStrings` | `ModalI18nStrings` | — | Per-instance string overrides (see i18n). |

---

## Slots

Modal exposes two compound slot components. Both are wrappers with token-based styling.

### `Modal.Body`

Wraps the scrollable content area of the dialog. Accepts all `HTMLDivElement` attributes.

```tsx
<Modal.Body>
  <p>Are you sure you want to delete this item?</p>
</Modal.Body>
```

### `Modal.Footer`

Wraps the action row at the bottom of the dialog. Flexbox row, aligns children to the right. Accepts all `HTMLDivElement` attributes.

```tsx
<Modal.Footer>
  <Button variant="ghost" onClick={onClose}>Cancel</Button>
  <Button variant="destructive" onClick={handleDelete}>Delete</Button>
</Modal.Footer>
```

---

## Sizes

| Size | Max-width | Typical use |
|---|---|---|
| `sm` | 24rem (384px) | Compact alerts, quick confirmations |
| `md` | 32rem (512px) | Default dialogs, confirmations |
| `lg` | 40rem (640px) | Rich content, multi-step flows |
| `xl` | 48rem (768px) | Complex forms, data display |
| `full` | 100vw × 100dvh | Immersive content, editors |

---

## States

| State | Trigger | Behaviour |
|---|---|---|
| **Open** | `isOpen={true}` | Renders in portal, traps focus, blocks scroll |
| **Closed** | `isOpen={false}` | Returns `null` — nothing mounted |
| **Loading** | `loading={true}` | Skeleton rows replace body children; `aria-busy="true"` on dialog |
| **No backdrop close** | `closeOnBackdropClick={false}` | Backdrop click has no effect |

---

## Accessibility

### Semantic element
`<div role="dialog" aria-modal="true">` — an HTML `<dialog>` element was not used because `useFocusTrap` provides robust cross-browser focus management, and token-driven backdrop styling is simpler on a `<div>`.

### ARIA attributes

| Attribute | Value | When |
|---|---|---|
| `role="dialog"` | Always | On the panel `<div>` |
| `aria-modal="true"` | Always | Tells screen readers the rest of the page is inert |
| `aria-labelledby` | `id` of the `<h2>` title | When `title` prop is provided |
| `aria-label` | `i18n.dialogLabel` | When `title` is omitted |
| `aria-busy` | `"true"` | When `loading={true}` |

### Close button
The close button inside the header always has `aria-label={i18n.closeLabel}` (default: `"Close"`). It is a ghost `<Button>` atom.

### Keyboard interaction

| Key | Behaviour |
|---|---|
| `Tab` | Moves focus to next focusable element inside the dialog (wraps at last) |
| `Shift + Tab` | Moves focus to previous focusable element (wraps at first) |
| `Escape` | Calls `onClose` — dismisses the dialog |

Focus is automatically moved to the first focusable element inside the dialog on open. On close, focus returns to the element that triggered the modal.

### Screen reader announcement
On open, screen readers announce the dialog role and its accessible name (title or fallback aria-label). The `aria-modal="true"` attribute signals that content outside the dialog is inert.

---

## Tokens Used

| Token | Role |
|---|---|
| `--modal-bg` | Panel background |
| `--modal-border-color` | Panel border |
| `--modal-border-width` | Panel border width |
| `--modal-radius` | Panel corner radius |
| `--modal-shadow` | Panel elevation shadow (theme-aware) |
| `--modal-z-index` | Stacking layer (= `--layer-dialog`, z-index 400) |
| `--modal-min-width` | Minimum panel width (layout protection) |
| `--modal-max-height` | Maximum panel height (triggers body scroll) |
| `--modal-backdrop-bg` | Semi-transparent overlay background |
| `--modal-width-sm/md/lg/xl` | Panel max-widths per size preset |
| `--modal-header-px/py/gap` | Header padding and gap |
| `--modal-header-border` | Header bottom border colour |
| `--modal-title-color` | Title text colour |
| `--modal-body-px/py` | Body content padding |
| `--modal-body-text-color` | Body text colour |
| `--modal-footer-px/py/gap` | Footer padding and gap |
| `--modal-footer-border` | Footer top border colour |

---

## Usage

### Basic confirmation dialog

```tsx
import { Modal } from './Modal';
import { Button } from '../atoms/Button/Button';

function DeleteConfirm({ isOpen, onClose, onDelete }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm deletion">
      <Modal.Body>
        <p>This action cannot be undone. Are you sure?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="destructive" onClick={onDelete}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
}
```

### Loading state

```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Fetching data" loading={true}>
  <Modal.Body>
    <p>This content is hidden while loading.</p>
  </Modal.Body>
</Modal>
```

### No title (accessible label fallback)

```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  i18nStrings={{ dialogLabel: 'Image preview' }}
>
  <Modal.Body>
    <img src="..." alt="Preview of uploaded file" />
  </Modal.Body>
</Modal>
```

### Prevent backdrop dismissal

```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Required action"
  closeOnBackdropClick={false}
>
  <Modal.Body>
    <p>You must complete this action before continuing.</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="primary" onClick={handleComplete}>Complete</Button>
  </Modal.Footer>
</Modal>
```

---

## i18n

| String | Prop | Default (English) | Description |
|---|---|---|---|
| Close button label | `i18nStrings.closeLabel` | `"Close"` | `aria-label` on the header close button |
| Dialog fallback label | `i18nStrings.dialogLabel` | `"Dialog"` | `aria-label` on the dialog when `title` is omitted |

```tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  i18nStrings={{
    closeLabel: 'Schließen',
    dialogLabel: 'Dialogfeld',
  }}
>
  ...
</Modal>
```