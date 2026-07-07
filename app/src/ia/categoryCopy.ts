/** The architectural role a token category plays in the system. See the
 *  Motion Duration ADR (docs/ADR-motion-duration-governed-vocabulary.md):
 *  a category is either live-themeable, a governed vocabulary consumed by
 *  tooling/exports, or a build-time contract. */
export type ArchitecturalRole = 'Theme Token' | 'Governed Vocabulary' | 'Build-time Contract'

/** Per-category architectural metadata — the honest "what is this and does it
 *  re-theme live" record surfaced in the CategoryPage. `runtimeThemeable` MUST
 *  reflect the real build behaviour, not the aspiration (avoid the lying control). */
export interface CategoryArchitecture {
  role: ArchitecturalRole
  purpose: string
  runtimeThemeable: boolean
  /** Short label for the current-state of consumption, e.g. "Live" or "Exports only". */
  usage: string
  consumers: string[]
  notes: string
}

export interface CategoryMeta {
  id: string
  name: string
  statement: string
  pattern: string[]
  appliesToScale?: boolean
  sortFn?: (a: TokenEntry, b: TokenEntry) => number
  architecture?: CategoryArchitecture
}

/** Architectural metadata keyed by the CategoryPage `category` string (the top-level
 *  category, not the `foundations-*` sub-id). Only top-level categories are surfaced
 *  in the CategoryPage header panel. Verified against build behaviour, not aspiration. */
export const CATEGORY_ARCHITECTURE: Record<string, CategoryArchitecture> = {
  color: {
    role: 'Theme Token',
    purpose: 'Defines the brand palette and drives every semantic token.',
    runtimeThemeable: true,
    usage: 'Live',
    consumers: ['Components', 'Themes', 'AI', 'Figma', 'IR'],
    notes: 'Consumed by components through the semantic layer, never directly.',
  },
  spacing: {
    role: 'Theme Token',
    purpose: 'Sets the spacing scale that governs layout rhythm and component density.',
    runtimeThemeable: true,
    usage: 'Live',
    consumers: ['Components', 'AI', 'Figma', 'IR'],
    notes: 'Tailwind resolves the --spacing scale at runtime, so edits re-theme live.',
  },
  radius: {
    role: 'Theme Token',
    purpose: 'Controls corner rounding across every surface via a single --radius base.',
    runtimeThemeable: true,
    usage: 'Live',
    consumers: ['Components', 'Themes', 'AI', 'Figma', 'IR'],
    notes: 'Registered @theme inline; the sm/md/lg/xl scale derives from --radius via calc().',
  },
  typography: {
    role: 'Theme Token',
    purpose: 'Defines the type system — families, sizes, weights, line-height, and tracking.',
    runtimeThemeable: true,
    usage: 'Live',
    consumers: ['Components', 'AI', 'Figma', 'IR'],
    notes: 'Font families load via fonts.css @import; sizes/leading/tracking resolve live.',
  },
  shadow: {
    role: 'Theme Token',
    purpose: 'Establishes elevation depth from subtle surface lift to prominent overlays.',
    runtimeThemeable: true,
    usage: 'Live',
    consumers: ['Components', 'AI', 'Figma', 'IR'],
    notes: 'Consumed as shadow utilities that resolve the token at runtime.',
  },
  motion: {
    role: 'Governed Vocabulary',
    purpose: 'Defines the canonical motion language — approved durations plus live easing curves.',
    runtimeThemeable: false,
    usage: 'Governed (duration) · Live (easing)',
    consumers: ['AI', 'Figma', 'IR', 'React Native', 'Flutter', 'Docs'],
    notes:
      'Split category: --duration-* is a governed vocabulary — Tailwind compiles durations to static values, so it is not runtime-themeable and consumers translate it (e.g. fast → duration-150). --ease-* is the exception: it is live-wired and re-themes at runtime. See the Motion Duration ADR.',
  },
  border: {
    role: 'Governed Vocabulary',
    purpose: 'Defines the approved border-width vocabulary for strokes and boundaries.',
    runtimeThemeable: false,
    usage: 'Governed (wire-up deferred)',
    consumers: ['AI', 'Figma', 'IR', 'Docs'],
    notes:
      'Border-width tokens are a governed vocabulary; component wire-up is intentionally deferred (no mass migration). Existing components keep their current borders.',
  },
  breakpoint: {
    role: 'Build-time Contract',
    purpose: 'Defines the responsive breakpoints that drive every sm:/md:/lg:/xl: utility.',
    runtimeThemeable: false,
    usage: 'Build-time (live-wired)',
    consumers: ['Components', 'AI', 'IR'],
    notes:
      'Live-wired, not orphaned: --breakpoint-* is a real Tailwind v4 namespace, so editing a value re-themes every responsive component on the next build (our px steps override Tailwind’s rem defaults). "Build-time" because it compiles to @media queries rather than a runtime custom property, so a live in-editor edit won’t reflect until rebuild.',
  },
  // Semantic categories — the themeable interface components consume directly.
  surface: {
    role: 'Theme Token',
    purpose: 'Semantic background/surface layers (background, card, popover) aliased to primitives.',
    runtimeThemeable: true,
    usage: 'Live',
    consumers: ['Components', 'Themes', 'AI', 'Figma', 'IR'],
    notes: 'Re-pointed per theme; @theme inline makes overrides (.dark) re-theme live.',
  },
  interactive: {
    role: 'Theme Token',
    purpose: 'Semantic tokens for interactive elements (primary, secondary, accent, ring).',
    runtimeThemeable: true,
    usage: 'Live',
    consumers: ['Components', 'Themes', 'AI', 'Figma', 'IR'],
    notes: 'The standard ShadCN interactive vocabulary; consumed as bg-/text-/ring- utilities.',
  },
  status: {
    role: 'Theme Token',
    purpose: 'Semantic status colors (destructive, and any success/warning/info extensions).',
    runtimeThemeable: true,
    usage: 'Live',
    consumers: ['Components', 'Themes', 'AI', 'Figma', 'IR'],
    notes: 'Discovered semantics route here; consumed through standard utilities.',
  },
  layout: {
    role: 'Theme Token',
    purpose: 'Semantic structural tokens (borders, inputs) that frame and separate content.',
    runtimeThemeable: true,
    usage: 'Live',
    consumers: ['Components', 'Themes', 'AI', 'Figma', 'IR'],
    notes: 'border-border / border-input / ring-ring; re-theme live via @theme inline.',
  },
}

export const getArchitectureForCategory = (category: string): CategoryArchitecture | undefined =>
  CATEGORY_ARCHITECTURE[category]

interface TokenEntry {
  name: string
  value: string
}

export const CATEGORY_META: CategoryMeta[] = [
  {
    id: 'foundations-color',
    name: 'Color',
    statement:
      'Color tokens define the palette used across the design system. Primary colors create brand identity while neutrals establish visual hierarchy and readability.',
    pattern: ['--color-*'],
    appliesToScale: true,
  },
  {
    id: 'foundations-color-primary',
    name: 'Primary',
    statement:
      'Primary color shades establish the core brand identity. Use these for key actions, links, and interactive elements.',
    pattern: ['--color-primary-*'],
    appliesToScale: true,
  },
  {
    id: 'foundations-color-neutral',
    name: 'Neutral',
    statement:
      'Neutral colors provide flexibility for backgrounds, text, and borders. They work with all primary colors and create accessible contrast.',
    pattern: ['--color-neutral-*'],
    appliesToScale: true,
  },
  {
    id: 'foundations-color-success',
    name: 'Success',
    statement:
      'Success colors communicate positive states like completion, approval, and safety. Use in status indicators and feedback messages.',
    pattern: ['--color-success-*'],
    appliesToScale: true,
  },
  {
    id: 'foundations-color-warning',
    name: 'Warning',
    statement:
      'Warning colors indicate caution, pending actions, or potential issues. Use sparingly to draw attention without causing alarm.',
    pattern: ['--color-warning-*'],
    appliesToScale: true,
  },
  {
    id: 'foundations-color-danger',
    name: 'Danger',
    statement:
      'Danger colors communicate critical states like errors, deletions, and destructive actions. Ensure high contrast for accessibility.',
    pattern: ['--color-danger-*'],
    appliesToScale: true,
  },
  {
    id: 'foundations-color-info',
    name: 'Info',
    statement:
      'Info colors present neutral informational content. Use for tips, hints, and supplementary details that don\'t require action.',
    pattern: ['--color-info-*'],
    appliesToScale: true,
  },
  {
    id: 'foundations-spacing',
    name: 'Spacing',
    statement:
      'Spacing tokens ensure consistent rhythm and alignment throughout the interface. They scale proportionally across densities and screen sizes.',
    pattern: ['--spacing-*'],
    appliesToScale: true,
  },
  {
    id: 'foundations-spacing-layout',
    name: 'Layout',
    statement:
      'Layout spacing defines major structural gaps—between sections, columns, and major UI blocks. These create the primary visual rhythm.',
    pattern: ['--spacing-layout-*'],
    appliesToScale: true,
  },
  {
    id: 'foundations-spacing-component',
    name: 'Component',
    statement:
      'Component-level spacing establishes internal padding and small gaps within UI elements. Maintain these for component integrity.',
    pattern: ['--spacing-component-*'],
    appliesToScale: true,
  },
  {
    id: 'foundations-radius',
    name: 'Border Radius',
    statement:
      'Border radius tokens control corner rounding across the interface. Consistent radius usage creates visual harmony and reinforces brand personality.',
    pattern: ['--radius-*'],
    appliesToScale: true,
  },
  {
    id: 'foundations-radius-button',
    name: 'Button',
    statement:
      'Button-specific radius values ensure interactive elements feel cohesive. Matches typical touch target expectations.',
    pattern: ['--radius-button-*'],
    appliesToScale: true,
  },
  {
    id: 'foundations-radius-card',
    name: 'Cards & Containers',
    statement:
      'Card and container radius values define the soft geometry of elevated surfaces. These guide user attention to content blocks.',
    pattern: ['--radius-card-*'],
    appliesToScale: true,
  },
  {
    id: 'foundations-font-size',
    name: 'Font Size',
    statement:
      'Font size tokens establish typographic scale and hierarchy. They maintain readability while creating visual distinction between content levels.',
    pattern: ['--text-*', '--font-*'],
    appliesToScale: true,
  },
  {
    id: 'foundations-font-line-height',
    name: 'Line Height',
    statement:
      'Line height values ensure comfortable reading across all type sizes. They work with font size tokens to create optimal text density.',
    pattern: ['--leading-*'],
    appliesToScale: true,
  },
  {
    id: 'foundations-letter-spacing',
    name: 'Letter Spacing',
    statement:
      'Letter spacing fine-tunes text density and readability. Adjustments are subtle but impact text appearance at scale.',
    pattern: ['--tracking-*'],
    appliesToScale: true,
  },
  {
    id: 'foundations-shadow',
    name: 'Shadow',
    statement:
      'Shadow tokens create depth and elevation. They follow a consistent spread pattern from subtle surface separation to prominent popups.',
    pattern: ['--shadow-*'],
    appliesToScale: false,
  },
  {
    id: 'foundations-shadow-sm',
    name: 'Small Shadows',
    statement:
      'Small shadows lift content slightly above the surface—used for cards, dropdowns, and subtle elevation.',
    pattern: ['--shadow-sm-*'],
    appliesToScale: false,
  },
  {
    id: 'foundations-shadow-md',
    name: 'Medium Shadows',
    statement:
      'Medium shadows create noticeable elevation—used for modals, sidebars, and floating elements.',
    pattern: ['--shadow-md-*'],
    appliesToScale: false,
  },
  {
    id: 'foundations-shadow-lg',
    name: 'Large Shadows',
    statement:
      'Large shadows establish prominent depth—used for popovers, heavy overlays, and floating action elements.',
    pattern: ['--shadow-lg-*'],
    appliesToScale: false,
  },
  {
    id: 'foundations-motion',
    name: 'Motion',
    statement:
      'Motion tokens define animation timing and easing. They create fluid, predictable interactions that enhance user experience without distraction.',
    pattern: ['--motion-*'],
    appliesToScale: false,
  },
  {
    id: 'foundations-motion-duration',
    name: 'Duration',
    statement:
      'Animation durations range from quick feedback (micro-interactions) to substantial transitions. Follow established patterns for consistency.',
    pattern: ['--motion-duration-*'],
    appliesToScale: true,
  },
  {
    id: 'foundations-motion-easing',
    name: 'Easing',
    statement:
      'Easing functions define the acceleration curve of animations. They make interactions feel natural and polished.',
    pattern: ['--motion-easing-*'],
    appliesToScale: false,
  },
  {
    id: 'foundations-border',
    name: 'Border',
    statement:
      'Border tokens define stroke styles including width and appearance. They frame content and establish visual boundaries.',
    pattern: ['--border-*'],
    appliesToScale: false,
  },
  {
    id: 'semantic-surface',
    name: 'Surface',
    statement:
      'Surface tokens define background layers and containers. They create the foundation upon which all other UI elements rest.',
    pattern: ['--surface-*'],
    appliesToScale: false,
  },
  {
    id: 'semantic-surface-primary',
    name: 'Primary Surface',
    statement:
      'Primary surfaces form the main content area. They\'re used for app backgrounds and primary document areas.',
    pattern: ['--surface-primary-*'],
    appliesToScale: false,
  },
  {
    id: 'semantic-surface-secondary',
    name: 'Secondary Surface',
    statement:
      'Secondary surfaces elevate content within the primary surface—cards, panels, and modal backgrounds.',
    pattern: ['--surface-secondary-*'],
    appliesToScale: false,
  },
  {
    id: 'semantic-surface-elevated',
    name: 'Elevated Surface',
    statement:
      'Elevated surfaces exist above normal hierarchy—popups, tooltips, and floating elements with shadows.',
    pattern: ['--surface-elevated-*'],
    appliesToScale: false,
  },
  {
    id: 'semantic-content',
    name: 'Content',
    statement:
      'Content tokens define text and icon colors. They establish readability across different surface backgrounds.',
    pattern: ['--content-*'],
    appliesToScale: false,
  },
  {
    id: 'semantic-content-text',
    name: 'Text',
    statement:
      'Text colors establish typographic hierarchy and readability. Respect semantic intent for accessibility.',
    pattern: ['--content-text-*'],
    appliesToScale: false,
  },
  {
    id: 'semantic-content-icon',
    name: 'Icons',
    statement:
      'Icon colors ensure visual consistency across all iconography. They adapt to their surface background.',
    pattern: ['--content-icon-*'],
    appliesToScale: false,
  },
  {
    id: 'semantic-interactive',
    name: 'Interactive',
    statement:
      'Interactive tokens define interactive element states—hover, focus, active, disabled. They guide user expectations.',
    pattern: ['--interactive-*'],
    appliesToScale: false,
  },
  {
    id: 'semantic-interactive-states',
    name: 'States',
    statement:
      'Interactive states communicate element behavior and user feedback. Maintain clear visual distinction between states.',
    pattern: ['--interactive-*-states-*'],
    appliesToScale: false,
  },
  {
    id: 'semantic-interactive-press',
    name: 'Press',
    statement:
      'Press states indicate element interaction—when buttons, links, or controls are being activated.',
    pattern: ['--interactive-press-*'],
    appliesToScale: false,
  },
  {
    id: 'semantic-status',
    name: 'Status',
    statement:
      'Status colors communicate system states and feedback. They follow semantic meaning (success, warning, error) for immediate recognition.',
    pattern: ['--status-*'],
    appliesToScale: false,
  },
  {
    id: 'semantic-layout',
    name: 'Layout',
    statement:
      'Layout tokens define structural values that govern the page arrangement—grid gaps, container constraints, and layout spacing.',
    pattern: ['--layout-*'],
    appliesToScale: false,
  },
]

export const getMetaForCategory = (categoryId: string): CategoryMeta | undefined => {
  return CATEGORY_META.find((m) => m.id === categoryId)
}

export const getCategoryById = (id: string): string | undefined => {
  const meta = CATEGORY_META.find((m) => m.id === id)
  return meta?.name
}

export const groupTokensByPattern = (
  tokens: Array<{ name: string; value: string }>,
  pattern: string[]
): Record<string, Array<{ name: string; value: string }>> => {
  const groups: Record<string, Array<{ name: string; value: string }>> = {}

  pattern.forEach((p) => {
    if (p.includes('*')) {
      const prefix = p.replace('*', '')
      const matchingTokens = tokens.filter((t) => t.name.startsWith(prefix))
      const groupName = prefix.replace('--', '').split('-')[0]

      if (groups[groupName]) {
        groups[groupName].push(...matchingTokens)
      } else {
        groups[groupName] = matchingTokens
      }
    }
  })

  return groups
}
