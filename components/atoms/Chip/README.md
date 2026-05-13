# Chip

Compact interactive element used for filtering, labelling, and tagging. Chips communicate state via `aria-pressed` when used as toggles and support optional remove functionality for tag-input patterns.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'solid' \| 'soft' \| 'outline' \| 'ghost'` | `'solid'` | Visual treatment — each variant uses a fundamentally different strategy |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height and typography scale |
| `interactive` | `boolean` | `true` | `true` = `<button aria-pressed>` (filter/toggle); `false` = `<span>` (display/removable tag) |
| `selected` | `boolean \| undefined` | `undefined` | Toggle state. Pass `true`/`false` for filter chips; omit for pure action chips |
| `disabled` | `boolean` | `false` | Mutes appearance and removes interactivity (only applies when `interactive=true`) |
| `leftIcon` | `ReactNode` | — | Optional leading icon. Use a lucide-react icon at `var(--size-icon-sm)` |
| `onRemove` | `(e: MouseEvent) => void` | — | Callback for remove button. Only works when `interactive=false` |
| `i18nStrings` | `ChipI18nStrings` | — | Override system-generated strings (e.g. remove button label) |
| `className` | `string` | — | Additional class names appended to the chip |
| `children` | `ReactNode` | — | Chip label text or content |

Extends `ButtonHTMLAttributes<HTMLButtonElement>`. Extra button props are ignored when `interactive=false`.

---

## Tokens Used

| Token | Value alias | Purpose |
|---|---|---|
| `--chip-radius` | `--radius-component-full` | Pill shape |
| `--chip-gap` | `--spacing-component-xs` | Gap between icon, label, and remove button |
| `--chip-remove-gap` | `--spacing-component-xs` | Right padding when remove button is present |
| `--chip-height-sm/md/lg` | `--size-component-xs/sm/md` | Height per size |
| `--chip-px-sm/md/lg` | `--spacing-component-sm/md/lg` | Horizontal padding per size |
| `--chip-remove-size-sm/md/lg` | `--size-icon-xs/sm/sm` | Remove icon size per chip size |
| `--chip-solid-bg` | `--color-bg-secondary` | Solid variant resting background |
| `--chip-solid-bg-selected` | `--color-action-primary` | Solid variant selected background |
| `--chip-solid-text-selected` | `--color-text-inverse` | Solid variant selected text |
| `--chip-soft-bg` | `--color-state-selected` | Soft variant resting background |
| `--chip-outline-border` | `--color-border-default` | Outline variant resting border |
| `--chip-ghost-text` | `--color-text-secondary` | Ghost variant resting text |
| `--chip-bg-disabled` | `--color-action-disabled` | Disabled background |
| `--chip-text-disabled` | `--color-text-disabled` | Disabled text |
| `--chip-remove-color` | `--color-text-tertiary` | Remove button icon color |
| `--chip-remove-color-hover` | `--color-text-primary` | Remove button hover color |
| `--chip-solid-shadow-active` | `none` (light/dark) / `--shadow-inset-sm` (brand) | Active/pressed shadow |

---

## Variants

| Variant | Strategy | When to use |
|---|---|---|
| `solid` | Neutral filled background — brand fill when selected | Default filter chip; most common use |
| `soft` | Brand-tinted background — bolder brand fill when selected | Category tags on brand-coloured surfaces |
| `outline` | Transparent + border — brand border when selected | Lightweight filter options alongside other controls |
| `ghost` | Invisible at rest — tinted bg appears on hover | Tertiary filtering in dense UIs |

---

## Sizes

| Size | Height | Typography | Remove icon |
|---|---|---|---|
| `sm` | 24px | `text-button-xs` | 12px |
| `md` | 32px | `text-button-sm` | 16px |
| `lg` | 40px | `text-button-md` | 16px |

---

## States

| State | Visual treatment |
|---|---|
| Hover | Background deepens + border tints (two-property change) |
| Focus-visible | Focus ring appears via `focus-ring` utility |
| Active/pressed | Background darkens; brand mode collapses to inset shadow |
| Selected | `aria-pressed="true"` — brand colour fills chip (solid/soft variants) or brand border (outline/ghost) |
| Disabled | Muted bg + text, no hover/active response, `cursor-not-allowed` |

---

## Usage Patterns

### Filter chip (toggle)

```tsx
import { Chip } from '../atoms/Chip';

function FilterGroup() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (value: string) =>
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  return (
    <div role="group" aria-label="Filter by category">
      {['React', 'TypeScript', 'CSS'].map((tag) => (
        <Chip
          key={tag}
          selected={selected.includes(tag)}
          onClick={() => toggle(tag)}
        >
          {tag}
        </Chip>
      ))}
    </div>
  );
}
```

### Removable tag chip

```tsx
import { Chip } from '../atoms/Chip';

function TagList() {
  const [tags, setTags] = useState(['React', 'TypeScript', 'Tailwind']);

  return (
    <div role="list" aria-label="Selected tags">
      {tags.map((tag) => (
        <div key={tag} role="listitem">
          <Chip
            interactive={false}
            onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))}
            i18nStrings={{ removeLabel: `Remove ${tag}` }}
          >
            {tag}
          </Chip>
        </div>
      ))}
    </div>
  );
}
```

### Static display chip

```tsx
<Chip interactive={false} variant="soft">Beta</Chip>
```

---

## Accessibility

**Semantic element:** `<button>` (when `interactive=true`) or `<span>` (when `interactive=false`)

**ARIA attributes:**

| Attribute | Applied when | Value |
|---|---|---|
| `aria-pressed` | `interactive=true` and `selected` is defined | `true` / `false` |
| `aria-disabled` | `interactive=true` and `disabled=true` | `true` |
| `aria-label` on remove button | `onRemove` is provided | `"Remove"` (default) or `i18nStrings.removeLabel` |

**Keyboard interaction (interactive chips):**

| Key | Action |
|---|---|
| `Space` / `Enter` | Activate chip (toggle selected / fire onClick) |
| `Tab` | Move focus to chip |
| `Tab` (on remove button) | Move focus to remove button |
| `Space` / `Enter` (on remove button) | Fire onRemove |

**Screen reader announcement:**

- Interactive chip: _"[label], toggle button, pressed / not pressed"_
- Remove button: _"Remove [label], button"_ (customise via `i18nStrings.removeLabel`)
- Static chip: announced as inline text

**Touch target:** The remove button uses `.touch-target` to ensure a minimum 24×24 px hit area even when the icon is smaller.

**Group labelling:** Wrap multiple filter chips in a `<div role="group" aria-label="Filter by ...">` to give the group semantic context.

---

## Internationalisation

| String | Default | Override via |
|---|---|---|
| Remove button aria-label | `"Remove"` | `i18nStrings.removeLabel` |

For per-chip context (e.g. _"Remove React"_), pass `i18nStrings={{ removeLabel: 'Remove React' }}` directly on the chip instance.

---

## Schema.org

No Schema.org mapping — Chip has no standard entity type.
