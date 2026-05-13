# Geeklego

An open-source, design-system-first React component library built on Tailwind CSS v4. Fork it, customize it, and ship it as your own.

**58 production-ready components** — atoms, molecules, and organisms — with a visual token editor, Storybook, and built-in Claude Code skills for AI-assisted development.

## Get Started

```bash
git clone https://github.com/GeekyAnts/geeklego.git
cd geeklego
pnpm install
pnpm dev:all
```

This starts two tools side-by-side:

| URL | What it is |
|---|---|
| `localhost:5173` | Token editor — visually edit colours, fonts, and spacing |
| `localhost:6006` | Storybook — browse and interact with all 58 components |

## Requirements

- Node.js 20+
- pnpm 9.15.0 (`npm install -g pnpm@9.15.0`)
- React 19
- Tailwind CSS v4

## Scripts

```bash
pnpm dev:all     # Token editor + Storybook (recommended)
pnpm dev         # Token editor only (localhost:5173)
pnpm storybook   # Storybook only (localhost:6006)
pnpm build       # Build the library
```

## What's Included

- **31 atoms, 15 molecules, 5 organisms** — production-grade, accessible React components
- **Token editor** — visual design system manager with live preview
- **Design system** — three-tier token chain (primitives → semantics → components)
- **Claude Code skills** — generate components, sync Figma, run audits, add i18n and more via slash commands
- **Storybook** — interactive component browser with full prop controls
- **TypeScript** — fully typed, no `@types` packages needed

## Claude Code Skills

This repo ships with built-in AI skills for Claude Code. Open the repo in Claude Code and run:

```bash
/component-builder build a Tooltip atom
/security
/i18n
/figma-sync
```

See `.claude/skills/` for the full list.

## License

MIT
