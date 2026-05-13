# Geeklego Site — Design Language Reference

A living reference for the visual design language used in the Geeklego component library. Use this to maintain consistency across pages or port the aesthetic to other apps.

---

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI library | React 19 |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`) |
| Fonts | Geist Sans · Geist Mono (via `next/font`) |
| Icons | `lucide-react` |

> **Tailwind v4 note:** Uses `@import "tailwindcss"` — not `@tailwind base/components/utilities`. Dark mode is driven by `[data-theme="dark"]` on `<html>`, not Tailwind's `dark:` variant.

---

## Colour Palette

### Core tokens

| Token | Hex | Usage |
|---|---|---|
| `foreground` | `#0a0a0a` | Primary text, headings |
| `foreground-secondary` | `#171717` | Secondary headings |
| `muted` | `#737373` | Body copy, captions, labels |
| `background` | `#f9fafb` | Page background, section fills |
| `surface` | `#ffffff` | Cards, panels, inputs |
| `border` | `#e5e5e5` | All borders and dividers |
| `primary` | `#155dfc` | CTAs, links, active states, accents |
| `brand` | `#f97316` | Brand orange (Geeklego identity) |

### Dark mode overrides (via `data-theme="dark"`)

| Token | Hex |
|---|---|
| `background` | `#030712` |
| `foreground` | `#f9fafb` |

### Derived / one-off colours

| Usage | Value |
|---|---|
| Dark button background | `#252525` |
| Dark column (theme preview) | `#0a0a0a` |
| Dark divider | `#333333` |
| Inline border shadow overlay | `rgba(255,255,255,0.25)` (inset highlight) |
| Muted blue | `rgba(21,93,252,0.5)` |
| Subtle shadow | `rgba(0,0,0,0.05–0.08)` |

---

## Typography

### Typeface

- **Sans:** Geist Sans — all UI text
- **Mono:** Geist Mono — code blocks, token labels, terminal strings

### Scale

| Role | Size | Weight | Tracking | Line-height | Colour |
|---|---|---|---|---|---|
| Hero H1 | `56px` | `700` (bold) | `-1.2px` | `60px` | `#171717` |
| Section H2 | `36px` | `500` (medium) | `-1.8px` | `40px` | `#0a0a0a` |
| Card H3 | `18px` | `600` (semibold) | `-0.9px` | `28px` | `#0a0a0a` |
| Nav / Logo | `18px` | `600` (semibold) | — | `28px` | neutral-900 token |
| Body / Subtitle | `16px` | `500` (medium) | — | `24px` | `#737373` |
| Body regular | `16px` | `400` (normal) | — | `24px` | `#737373` |
| Small / Label | `14px` | `400` (normal) | `0.35px` | `20px` | varies |
| Caption / Meta | `12px` | `400` (normal) | — | `16px` | `#737373` |
| Code | `12px` | `400` (normal) | — | `22px` | Geist Mono |

---

## Layout

### Page container

```
max-w-[1280px]  mx-auto  border-l border-r border-[#e5e5e5]
```

The outer page wrapper is always `max-w-[1280px]` centred with visible `#e5e5e5` left/right rail borders. The grey (`#f9fafb`) body background shows on either side at wide viewports.

### Section anatomy

Every section follows this pattern:

```
<section>                         ← full width, border-b border-[#e5e5e5]
  <div mx-[40px] border-l/r>     ← inner frame with 40 px side gutters
    <header py-[56px] px-[56px]> ← centered heading block, border-b
    <grid>                        ← content grid
```

- Outer section: `border-b border-[#e5e5e5]`
- Inner frame: `mx-[40px] border-l border-r border-[#e5e5e5]`
- Header block: `py-[56px] px-[56px]`, centered text, `border-b border-[#e5e5e5]`

### Content widths

| Element | Max width |
|---|---|
| Page wrapper | `1280px` |
| Section heading copy | `576px` |
| Hero headline | `558px` |
| Hero body copy | `480px` |

### Horizontal padding rhythm

| Context | Padding |
|---|---|
| Header / footer inner | `px-[60px]` |
| Section inner frame margin | `mx-[40px]` |
| Section header | `px-[56px]` |
| Feature card text | `p-[24px]` |

---

## Spacing

Spacing is applied as explicit pixel values rather than Tailwind's default scale.

| Token | Value | Where used |
|---|---|---|
| Nav height | `58px` | `<Header>` height |
| Footer height | `56px` (`h-14`) | `<Footer>` height |
| Section vertical padding | `56px` top + bottom | Section headers |
| Card text padding | `24px` all sides | Feature grid text areas |
| CTA gap | `10px` | Between buttons |
| Content stack gap | `40px` | Hero content `gap-10` |
| Heading + body gap | `8px` | Within section header block |
| Divider line | `1px` | All `border-[#e5e5e5]` lines |

---

## Components

### Navbar `<Header>`

```
sticky top-0 z-50
border-b border-[#e5e5e5]
bg-[#f9fafb]
h-[58px]
px-[60px]
```

- **Logo:** image + `text-[18px] font-semibold`
- **Nav links:** pill-shaped, `rounded-full`, active state gets `border-[#0a0a0a]`, inactive `border-transparent text-[rgba(23,23,23,0.6)]`
- **GitHub button:** `h-8 w-[120px] rounded-full bg-[#252525]` with inset highlight shadow

```
shadow-[0px_3px_3px_0px_rgba(16,24,40,0.06),0px_1px_1px_0px_rgba(16,24,40,0.08)]
inset: shadow-[inset_0px_1px_2px_0px_rgba(255,255,255,0.25)]
```

---

### Primary CTA Button

```
h-[41px]  w-[116px]
rounded-full
bg-[#155dfc]
text-[#fafafa] text-[14px] font-normal tracking-[0.35px]
border border-white/[0.12]
shadow-[0px_3px_3px_0px_rgba(16,24,40,0.06),0px_1px_1px_0px_rgba(16,24,40,0.08)]
inset highlight: shadow-[inset_0px_1px_2px_0px_rgba(255,255,255,0.25)]
```

The blue fill and inset highlight are applied via two stacked `absolute` `<span>` children so the button text sits `relative` above them.

---

### Secondary / Ghost Button

```
h-10  w-[128px]
rounded-full
bg-white  border border-[#e5e7eb]
text-[#171717] text-[14px] font-normal tracking-[0.35px]
hover:bg-neutral-50
```

---

### Badge / Pill

Small label pill used for the hero "Open-Source Design System" badge:

```
h-8  px-[13px]
bg-white  border border-[#e5e5e5]
rounded-full
text-[14px] font-normal text-[#0a0a0a]
flex items-center gap-2
```

---

### Feature Grid (Bento)

A 2×2 grid of cells separated by `1px` `#e5e5e5` dividers. No card shadows or rounded corners — cells are pure rectangular sections of the same `#f9fafb` surface.

```
grid grid-cols-2
```

**Dividers (absolute positioned):**
```
Vertical:   absolute top-0 bottom-0 left-1/2  w-px  bg-[#e5e5e5]
Horizontal: absolute left-0 right-0  top-1/2  h-px  bg-[#e5e5e5]
```

**Each cell:**
```
Visual area:  h-[370px]  overflow-hidden  flex items-center justify-center
              gradient fades: h-[80px] from-[#f9fafb] at top and/or bottom

Text area:    p-[24px]  flex flex-col  gap-[2px]
  h3:  text-[18px] font-semibold text-[#0a0a0a] tracking-[-0.9px] leading-[28px]
  p:   text-[16px] text-[#737373] leading-[24px]
```

---

### Code Block (inline preview)

Styled terminal/editor window used as a visual inside feature cards:

```
rounded-[10px]
border border-[#e5e5e5]
bg-white
shadow-[0px_4px_20px_rgba(0,0,0,0.06)]
```

Title bar:
```
px-[14px] py-[10px]
border-b border-[#e5e5e5]
bg-[#fafafa]
```

Traffic-light dots: `#ff5f57` · `#ffbd2e` · `#28c840` — each `size-[10px] rounded-full`

Syntax token colours:
| Token type | Colour |
|---|---|
| Keyword (`import`, `from`) | `#155dfc` |
| Component / tag name | `#155dfc` |
| Prop / attribute name | `#e07b39` |
| String value | `#2d9e5f` |
| Comment / MDX prose | `#737373` |
| Default text | `#0a0a0a` |

---

### Footer `<Footer>`

```
border-t border-[#e5e5e5]
bg-[#f9fafb]
h-14  px-[60px]
text-sm text-[#737373]
```

- "Built by" link: `font-medium text-[#171717] underline underline-offset-2`
- GitHub link: plain `text-[#737373] hover:text-[#171717]`

---

## Borders & Dividers

The entire site uses a single border style:

```css
border: 1px solid #e5e5e5
```

Applied as:
- `border-b` — below header, between sections, below section header block
- `border-l border-r` — page container rails + inner section frames
- `border-t` — above footer
- `w-px bg-[#e5e5e5]` / `h-px bg-[#e5e5e5]` — bento grid internal dividers

**No** `border-radius` on layout containers. Rounded corners only appear on interactive elements (buttons, badges, pills, code blocks, token swatches).

---

## Shadows

All shadows are very subtle:

| Use | Value |
|---|---|
| Button / CTA | `0px 3px 3px rgba(16,24,40,0.06), 0px 1px 1px rgba(16,24,40,0.08)` |
| Inset button highlight | `inset 0px 1px 2px rgba(255,255,255,0.25)` |
| Floating bubbles / cards | `0px 0px 10px rgba(0,0,0,0.05)` |
| Code block | `0px 4px 20px rgba(0,0,0,0.06)` |
| Token swatches | `0px 2px 8px rgba(0,0,0,0.08)` |
| Theme column panel | `0px 4px 16px rgba(0,0,0,0.06)` |

---

## Dark Mode

Dark mode is toggled by setting `data-theme="dark"` on `<html>`. CSS variables respond to this selector — **not** `prefers-color-scheme` or Tailwind's `dark:` variant.

```css
:root                  { --background: #f9fafb; --foreground: #111827; }
[data-theme="dark"]    { --background: #030712; --foreground: #f9fafb; }
```

The `ThemeToggle` component uses `localStorage` to persist the preference and applies the attribute on mount.

---

## Gradients

Gradient fades are used to blend illustration content into section backgrounds:

```css
/* Fade to section background at top */
background: linear-gradient(to bottom, #f9fafb, transparent)   h-[80px]

/* Fade to section background at bottom */
background: linear-gradient(to top, #f9fafb, transparent)      h-[80px]
```

These are always `pointer-events-none` and positioned `absolute` over the illustration area with `z-10`.

---

## Interaction Patterns

| Element | Behaviour |
|---|---|
| Nav links | `transition-colors duration-200` colour fade |
| Primary CTA | `hover:opacity-90 transition-opacity` |
| Secondary button | `hover:bg-neutral-50 transition-colors` |
| Footer links | `hover:text-[#171717] transition-colors` |

All transitions are `200ms` or default (150ms). No scale, translate, or rotate on hover — only colour/opacity changes.

---

## Do's and Don'ts

### Do
- Use `#e5e5e5` for every border — never `gray-200` or other Tailwind greys
- Use explicit `px` values matching the scale above rather than Tailwind's numbered utilities
- Keep section backgrounds `#f9fafb` and card/panel surfaces `#ffffff`
- Use `rounded-full` for all interactive pills, buttons, and badges
- Apply the `mx-[40px] border-l border-r border-[#e5e5e5]` inner frame pattern to new sections

### Don't
- Don't use `border-radius` on layout sections or grid containers
- Don't use Tailwind's `dark:` variant — use `[data-theme="dark"]` selectors
- Don't add coloured section backgrounds — the palette is intentionally monochromatic
- Don't use box shadows on layout containers — shadows are reserved for interactive elements and floating cards
- Don't mix font weights arbitrarily — headings are `medium`/`semibold`, body is `normal`/`medium`
