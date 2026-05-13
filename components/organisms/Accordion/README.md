# Accordion

An accessible, animated accordion component for revealing or hiding sections of related content. Supports single-expand and multi-expand modes, three visual variants, three size scales, controlled and uncontrolled state, and optional Schema.org FAQPage structured data.

**Level:** L3 Organism
**Location:** `components/organisms/Accordion/`

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `AccordionItem[]` | — | Items to render. Each produces a heading + trigger + panel. **Required.** |
| `variant` | `'default' \| 'bordered' \| 'flush'` | `'default'` | Visual style variant |
| `mode` | `'single' \| 'multiple'` | `'single'` | Whether one or many items can be open simultaneously |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Spacing and icon scale |
| `openItems` | `string[]` | — | Controlled open state (array of open item ids) |
| `defaultOpenItems` | `string[]` | `[]` | Initially open items for uncontrolled usage |
| `onChange` | `(openItems: string[]) => void` | — | Fires when open state changes |
| `headingLevel` | `'h1'–'h6'` | `'h3'` | HTML heading element wrapping each trigger |
| `schema` | `boolean` | `false` | Enable Schema.org FAQPage + Question/Answer Microdata |
| `i18nStrings` | `AccordionI18nStrings` | — | Override system strings |
| `className` | `string` | — | Additional class on the outer container |

### AccordionItem

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier used as key and open-state reference |
| `title` | `string` | Visible title rendered inside the trigger button |
| `content` | `ReactNode` | Panel body content |
| `disabled` | `boolean` | Prevents expand/collapse interaction |

---

## Tokens Used

```
--accordion-radius                    Container border radius
--accordion-min-width                 Minimum container width
--accordion-item-border               Divider/border colour (default + flush variants)
--accordion-item-border-width         Divider thickness
--accordion-bordered-bg               Card background (bordered variant)
--accordion-bordered-radius           Card radius (bordered variant)
--accordion-bordered-gap              Gap between bordered cards
--accordion-trigger-bg                Trigger resting background
--accordion-trigger-bg-hover          Trigger hover background
--accordion-trigger-bg-active         Trigger pressed background
--accordion-trigger-text              Trigger text colour
--accordion-trigger-text-hover        Trigger hover text colour
--accordion-trigger-icon              Chevron icon colour
--accordion-trigger-icon-hover        Chevron icon hover/open colour
--accordion-trigger-shadow            Trigger shadow (none in light/dark; depth in brand)
--accordion-trigger-shadow-hover      Trigger hover shadow (brand only)
--accordion-trigger-shadow-active     Trigger pressed shadow (brand inset)
--accordion-trigger-py-{sm|md|lg}     Trigger vertical padding by size
--accordion-trigger-px-{sm|md|lg}     Trigger horizontal padding by size
--accordion-panel-text                Panel body text colour
--accordion-panel-pb-{sm|md|lg}       Panel bottom padding by size
--accordion-panel-px-{sm|md|lg}       Panel horizontal padding by size
--accordion-title-overflow            Title truncation overflow
--accordion-title-whitespace          Title truncation whitespace
--accordion-title-text-overflow       Title truncation text-overflow
```

---

## Variants

### default
Bottom border between each item. Transparent background. Flush with surrounding content. Use for FAQ sections, help pages, or content-heavy pages where minimal chrome is preferred.

### bordered
Each item is an outlined card with rounded corners and a gap between cards. Elevated feel. Use for settings panels, feature breakdowns, or anywhere cards are the established pattern.

### flush
No borders or gaps. Trigger and panel are directly adjacent to surrounding content. Use inside already-bordered containers or when maximum density is needed.

---

## Sizes

| Size | Trigger `py` | Trigger `px` | Panel `px` |
|---|---|---|---|
| `sm` | 8px | 12px | 12px |
| `md` | 12px | 16px | 16px |
| `lg` | 16px | 24px | 24px |

---

## States

| State | Behaviour |
|---|---|
| **Default** | Trigger shows resting background; chevron points down |
| **Focus-visible** | Focus ring on trigger button; no background change |
| **Open** | Chevron rotates 180°; panel animates to full height via CSS grid transition |
| **Disabled** | Trigger is muted (50% opacity), non-interactive; panel content unreachable |

### Shadow elevation by theme

| Theme | Resting | Hover | Active |
|---|---|---|---|
| Light | `none` | `none` | `none` |
| Dark | `none` | `none` | `none` |
| brand | `--shadow-brand-sm` | `--shadow-brand-md` | `--shadow-inset-sm` |

---

## Accessibility

**Semantic element:** Each trigger is a `<button type="button">` wrapped in an HTML heading (`<h3>` by default). The heading level is configurable via `headingLevel`.

**Role:** Trigger uses the native `button` role. Panel has `role="region"`.

**ARIA attributes:**

| Attribute | Element | Purpose |
|---|---|---|
| `aria-expanded` | `<button>` | Announces whether the panel is open |
| `aria-controls` | `<button>` | Links trigger to its panel by id |
| `id` | `<button>` | Referenced by the panel's `aria-labelledby` |
| `role="region"` | panel `<div>` | Marks panel as a landmark-like region |
| `aria-labelledby` | panel `<div>` | Associates panel with its trigger heading |
| `aria-disabled` + `disabled` | `<button>` | Communicates and enforces disabled state |
| `inert` | panel `<div>` | Prevents Tab focus into collapsed panel content |

**Keyboard interaction:**

| Key | Action |
|---|---|
| `Tab` | Move focus between accordion triggers (and any focusable elements outside the accordion) |
| `Shift + Tab` | Move focus in reverse |
| `Enter` or `Space` | Expand or collapse the focused trigger's panel |

**Screen reader announcement:**
When a trigger is focused, the screen reader announces:
`"[Title], [Expand/Collapse], button, [collapsed/expanded]"` — the title is the accessible name, the sr-only hint specifies direction, and `aria-expanded` communicates state.

**Motion:** Panel expand/collapse uses `grid-template-rows` CSS transition at `--duration-transition` (200ms). Respects `prefers-reduced-motion` — Tailwind's `transition-default` uses `transition-property` without `animation`, so reduced-motion preferences are observed automatically.

---

## Schema.org

Set `schema={true}` to enable FAQPage + Question/Answer Microdata. Appropriate for accordion sections presenting question-and-answer content (help centres, documentation, product FAQs).

| Schema type | Element | itemProps |
|---|---|---|
| `FAQPage` | Outer `<div>` | `itemScope`, `itemType="https://schema.org/FAQPage"` |
| `Question` | Item `<div>` | `itemScope`, `itemType="https://schema.org/Question"` |
| `name` | Trigger `<button>` | `itemProp="name"` (the question text) |
| `Answer` | Panel content `<div>` | `itemScope`, `itemType="https://schema.org/Answer"`, `itemProp="acceptedAnswer"` |

```tsx
<Accordion
  items={faqItems}
  schema
/>
```

---

## i18n

| Key | Default | Description |
|---|---|---|
| `expandLabel` | `"Expand"` | SR-only hint appended to trigger when item is collapsed |
| `collapseLabel` | `"Collapse"` | SR-only hint appended to trigger when item is expanded |

```tsx
<Accordion
  items={items}
  i18nStrings={{ expandLabel: 'Ouvrir', collapseLabel: 'Fermer' }}
/>
```

---

## Usage

### Basic uncontrolled

```tsx
import { Accordion } from '../components/organisms/Accordion/Accordion';

<Accordion
  items={[
    { id: 'q1', title: 'What is this?', content: 'A disclosure widget.' },
    { id: 'q2', title: 'How does it work?', content: 'Click to expand.' },
  ]}
  defaultOpenItems={['q1']}
/>
```

### Controlled

```tsx
const [open, setOpen] = useState<string[]>([]);

<Accordion
  items={items}
  openItems={open}
  onChange={setOpen}
/>
```

### Multi-expand with bordered variant

```tsx
<Accordion
  items={items}
  variant="bordered"
  mode="multiple"
  defaultOpenItems={['q1', 'q2']}
/>
```

### Schema.org FAQ

```tsx
<Accordion
  items={faqItems}
  schema
  headingLevel="h2"
/>
```
