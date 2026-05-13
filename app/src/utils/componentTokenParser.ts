import type { ComponentTokenGroup, ComponentTokenSection, TypographyMapping } from '../types.ts'

// ─── Default typography mappings per component ────────────────────────────────
// Mirrors the sizeMap entries in each component's TSX file.
// Used when no @typography metadata comment exists in the CSS block yet.

export const COMPONENT_TYPOGRAPHY_DEFAULTS: Record<string, TypographyMapping[]> = {
  Button:        [{ size: 'xs', className: 'text-button-xs' }, { size: 'sm', className: 'text-button-sm' }, { size: 'md', className: 'text-button-md' }, { size: 'lg', className: 'text-button-lg' }, { size: 'xl', className: 'text-button-xl' }],
  Input:         [{ size: 'sm', className: 'text-body-sm' }, { size: 'md', className: 'text-body-md' }, { size: 'lg', className: 'text-body-lg' }],
  Textarea:      [{ size: 'sm', className: 'text-body-sm' }, { size: 'md', className: 'text-body-md' }, { size: 'lg', className: 'text-body-lg' }],
  Select:        [{ size: 'sm', className: 'text-body-sm' }, { size: 'md', className: 'text-body-sm' }, { size: 'lg', className: 'text-body-md' }],
  NavItem:       [{ size: 'default', className: 'text-body-sm' }],
  BreadcrumbItem:[{ size: 'default', className: 'text-body-sm' }],
  Item:          [{ size: 'default', className: 'text-body-sm' }],
  Sidebar:       [{ size: 'default', className: 'text-body-sm' }],
  AreaChart:     [{ size: 'default', className: 'text-body-sm' }],
  BarChart:      [{ size: 'default', className: 'text-body-sm' }],
  Breadcrumb:    [{ size: 'default', className: 'text-body-sm' }],
}

// ─── Component level classification ──────────────────────────────────────────
// Maps every known component name to its design-system level tier.
// Components not in this map fall back to 'unknown'.
export const COMPONENT_LEVEL_MAP: Record<string, 'atom' | 'molecule' | 'organism'> = {
  // L1 — Atoms (no component imports)
  Avatar: 'atom', Badge: 'atom', BreadcrumbItem: 'atom', Button: 'atom',
  ChatBubble: 'atom', Checkbox: 'atom', Chip: 'atom', ColorSwatch: 'atom',
  Divider: 'atom', EmptyState: 'atom', FileInput: 'atom', Heading: 'atom',
  Image: 'atom', Input: 'atom', Item: 'atom', Label: 'atom',
  Link: 'atom', List: 'atom', NavItem: 'atom', ProgressBar: 'atom',
  ProgressIndicator: 'atom', Quote: 'atom', Radio: 'atom', Rating: 'atom',
  SegmentedControl: 'atom', Select: 'atom', Skeleton: 'atom', SkipLink: 'atom',
  Slider: 'atom', Spinner: 'atom', Stack: 'atom', Switch: 'atom',
  Tag: 'atom', Textarea: 'atom', ThemeSwitcher: 'atom', Toggle: 'atom',
  TreeItem: 'atom', TypingIndicator: 'atom', Video: 'atom', VisuallyHidden: 'atom',
  // L2 — Molecules (import L1 atoms only)
  AlertBanner: 'molecule', Breadcrumb: 'molecule', ButtonGroup: 'molecule',
  Card: 'molecule', ChatHeader: 'molecule', ChatInputBar: 'molecule',
  ChatMessage: 'molecule', Combobox: 'molecule', DateInput: 'molecule',
  DropdownMenu: 'molecule', Fieldset: 'molecule', FileUpload: 'molecule',
  FormField: 'molecule', InputGroup: 'molecule', Navbar: 'molecule',
  NumberInput: 'molecule', Pagination: 'molecule', Popover: 'molecule',
  RadioGroup: 'molecule', SearchBar: 'molecule', StatCard: 'molecule',
  Stepper: 'molecule', Toast: 'molecule', Tooltip: 'molecule', TreeView: 'molecule',
  // L3 — Organisms (import L2 + L1)
  Accordion: 'organism', AreaChart: 'organism', BarChart: 'organism',
  Carousel: 'organism', Chat: 'organism', ColorPicker: 'organism',
  DataTable: 'organism', Datepicker: 'organism', Drawer: 'organism',
  Footer: 'organism', Form: 'organism', Header: 'organism',
  Modal: 'organism', Sidebar: 'organism', Tabs: 'organism',
}

// ─── Auto-categorization heuristics ──────────────────────────────────────────
// When a new component is generated but not yet in COMPONENT_LEVEL_MAP,
// the token editor can call the Vite plugin API endpoint to auto-categorize.
// The server scans the components directory for import patterns.

export interface CategorizationResult {
  level: 'atom' | 'molecule' | 'organism' | 'unknown'
  confidence: number
  reason: string
}

export async function autoCategorizeComponent(
  componentName: string,
): Promise<CategorizationResult> {
  // If we're in the browser, fetch from the Vite plugin API
  try {
    const res = await fetch(`/api/categorize/${componentName}`)
    if (res.ok) {
      const data = await res.json()
      if (data.success) {
        return {
          level: data.level as CategorizationResult['level'],
          confidence: data.confidence,
          reason: data.reason,
        }
      }
    }
  } catch {
    // API not available — likely running in browser without the endpoint
  }
  return { level: 'unknown', confidence: 0, reason: 'Auto-categorization not available' }
}

const MARKER = '/* ─── GENERATED COMPONENT TOKENS'
const COMPONENT_COMMENT_RE = /\/\*[─\s]*?([\w][\w ]*?)\s*—\s*generated\s+([\d-]+)[─\s]*\*\//g
// Matches section headers like: /* ── Shared ── */ or /* ── Primary (filled + shadow) ── */
// Label is capped at 80 chars so that descriptive multi-clause comments
// (e.g. "Attached: outer radius matches the Button's own radius") are not
// promoted to section titles. Longer comments fall through and are ignored.
const SECTION_COMMENT_RE = /\/\*\s*──\s*([^\n*]{1,80}?)\s*─+\s*\*\//g
const TOKEN_RE = /(--[\w-]+):\s*(.+?);/g

export function parseComponentTokens(cssContent: string): ComponentTokenGroup[] {
  const markerIdx = cssContent.indexOf(MARKER)
  const section = markerIdx !== -1 ? cssContent.slice(markerIdx) : cssContent

  const groups: ComponentTokenGroup[] = []
  const matches = [...section.matchAll(COMPONENT_COMMENT_RE)]

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const componentName = match[1].trim()
    const generatedDate = match[2]
    const startIdx = match.index! + match[0].length
    const endIdx = i + 1 < matches.length ? matches[i + 1].index! : section.length

    const block = section.slice(startIdx, endIdx)
    const sections = parseSections(block)

    // Parse @typography metadata comment: /* @typography xs:text-button-xs sm:text-button-sm */
    let typography: TypographyMapping[] | undefined
    const typoMatch = block.match(/\/\* @typography (.+?) \*\//)
    if (typoMatch) {
      typography = typoMatch[1].trim().split(' ').flatMap(entry => {
        const colonIdx = entry.indexOf(':')
        if (colonIdx === -1) return []
        return [{ size: entry.slice(0, colonIdx), className: entry.slice(colonIdx + 1) }]
      })
    } else {
      typography = COMPONENT_TYPOGRAPHY_DEFAULTS[componentName]
    }

    const level = COMPONENT_LEVEL_MAP[componentName] ?? 'unknown'
    groups.push({ componentName, level, generatedDate, sections, typography })
  }

  // Deduplicate: if a component appears more than once, keep the latest by generatedDate
  const deduped = new Map<string, ComponentTokenGroup>()
  for (const group of groups) {
    const existing = deduped.get(group.componentName)
    // Strict > means first-seen wins on tie (same date)
    if (!existing || group.generatedDate > existing.generatedDate) {
      deduped.set(group.componentName, group)
    }
  }
  return [...deduped.values()].sort((a, b) => a.componentName.localeCompare(b.componentName))
}

function parseSections(block: string): ComponentTokenSection[] {
  // Find all section comment positions
  const sectionMatches = [...block.matchAll(SECTION_COMMENT_RE)]

  if (sectionMatches.length === 0) {
    // No section comments — put all tokens in a single "General" section
    const tokens: { name: string; value: string }[] = []
    for (const m of block.matchAll(TOKEN_RE)) {
      tokens.push({ name: m[1], value: m[2].trim() })
    }
    return tokens.length > 0 ? [{ label: 'General', tokens }] : []
  }

  const sections: ComponentTokenSection[] = []

  // Check for tokens before the first section comment
  const beforeFirst = block.slice(0, sectionMatches[0].index!)
  const preTokens: { name: string; value: string }[] = []
  for (const m of beforeFirst.matchAll(TOKEN_RE)) {
    preTokens.push({ name: m[1], value: m[2].trim() })
  }
  if (preTokens.length > 0) {
    sections.push({ label: 'General', tokens: preTokens })
  }

  // Parse each section
  for (let i = 0; i < sectionMatches.length; i++) {
    const sm = sectionMatches[i]
    // Extract label — strip parenthetical descriptions: "Primary (filled + shadow)" → "Primary"
    const rawLabel = sm[1].trim()
    const label = rawLabel.replace(/\s*\(.*\)\s*$/, '').trim()

    const sStart = sm.index! + sm[0].length
    const sEnd = i + 1 < sectionMatches.length ? sectionMatches[i + 1].index! : block.length

    const sectionBlock = block.slice(sStart, sEnd)
    const tokens: { name: string; value: string }[] = []
    for (const m of sectionBlock.matchAll(TOKEN_RE)) {
      tokens.push({ name: m[1], value: m[2].trim() })
    }

    if (tokens.length > 0) {
      sections.push({ label, tokens })
    }
  }

  return sections
}

function pad(name: string, width = 42): string {
  return name.padEnd(width)
}

// Map section labels back to CSS comment format
const SECTION_DESCRIPTIONS: Record<string, string> = {
  'Primary': 'Primary (filled + shadow)',
  'Secondary': 'Secondary (filled muted, no shadow)',
  'Outline': 'Outline (transparent + visible border)',
  'Ghost': 'Ghost (transparent, appears on hover)',
  'Destructive': 'Destructive (filled + shadow, danger)',
  'Link': 'Link (inline text action)',
  'Disabled': 'Disabled (all variants)',
}

export function generateComponentTokensCss(groups: ComponentTokenGroup[]): string {
  if (groups.length === 0) return ''

  const lines: string[] = []
  lines.push(`/* ─── GENERATED COMPONENT TOKENS ──────────────────────────────────────────`)
  lines.push(`   Written here automatically when a component is first generated.`)
  lines.push(`   Each block is added by the component generator skill — never manually.`)
  lines.push(`   ───────────────────────────────────────────────────────────────────────── */`)
  lines.push(``)

  for (const group of groups) {
    lines.push(`/* ${group.componentName} — generated ${group.generatedDate} */`)
    if (group.typography?.length) {
      const typoStr = group.typography.map(t => `${t.size}:${t.className}`).join(' ')
      lines.push(`/* @typography ${typoStr} */`)
    }
    lines.push(`:root,`)
    lines.push(`[data-theme="dark"] {`)

    for (const section of group.sections) {
      const desc = SECTION_DESCRIPTIONS[section.label] || section.label
      const dashFill = '─'.repeat(Math.max(0, 72 - desc.length - 6))
      lines.push(`  /* ── ${desc} ${dashFill} */`)

      for (const token of section.tokens) {
        lines.push(`  ${pad(`${token.name}:`, 42)} ${token.value};`)
      }
      lines.push(``)
    }

    lines.push(`}`)
    lines.push(``)
  }

  return lines.join('\n')
}

export type TokenCategory = 'color' | 'spacing' | 'size' | 'icon' | 'radius' | 'shadow' | 'motion' | 'layer' | 'border' | 'content' | 'aspect-ratio' | 'unit' | 'other'

export function detectTokenCategory(value: string): TokenCategory {
  // Existing var(--…) branches — unchanged. Order preserved for parity.
  if (value === 'transparent' || value.startsWith('var(--color-')) return 'color'
  if (value.startsWith('var(--spacing-')) return 'spacing'
  if (value.startsWith('var(--size-')) return 'size'
  if (value.startsWith('var(--icon-semantic-')) return 'icon'
  if (value.startsWith('var(--radius-')) return 'radius'
  if (value.startsWith('var(--shadow-')) return 'shadow'
  if (value.startsWith('var(--duration-') || value.startsWith('var(--ease-')) return 'motion'
  if (value.startsWith('var(--layer-')) return 'layer'
  if (value.startsWith('var(--border-')) return 'border'
  if (value.startsWith('var(--content-')) return 'content'

  // New branches — only reached when no existing var(--…) prefix matched.

  // calc(...) wrapping a single var(--…): inherit the inner var's category.
  if (value.startsWith('calc(')) {
    const innerMatch = value.match(/var\((--[\w-]+)/)
    if (innerMatch) {
      return detectTokenCategory(`var(${innerMatch[1]})`)
    }
  }

  // Color literals: rgba/rgb/hsl/color-mix/hex
  if (/^(rgba?|hsla?|color-mix|hwb|lab|lch|oklab|oklch)\(/i.test(value)) return 'color'
  if (/^#[0-9a-f]{3,8}$/i.test(value)) return 'color'

  // Aspect ratio: "16/9", "1 / 1", etc.
  if (/^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test(value)) return 'aspect-ratio'

  // Raw length values: 1.5rem, 24px, 1em → size
  if (/^-?\d+(\.\d+)?(rem|px|em)$/.test(value)) return 'size'

  // Percentage / viewport units: 75%, 85vh, 100vw
  if (/^-?\d+(\.\d+)?(%|vh|vw|vmin|vmax)$/.test(value)) return 'unit'

  return 'other'
}

// ─── Color sub-scoping (Figma-like) ──────────────────────────────────────────
//
// Detects the semantic "intent" of a color token using two signals:
//   1. The token NAME   (e.g. --button-primary-bg → fill)
//   2. The current VALUE (e.g. var(--color-text-inverse) → text)
//
// This mirrors Figma's variable scoping: a "fill color" variable only shows
// other fill-appropriate colors, a "text color" only shows text colors, etc.

export type ColorScope = 'fill' | 'text' | 'stroke' | 'status'

export function detectColorScope(tokenName: string, value: string): ColorScope {
  // 1. Infer from token name first (most reliable intent signal)
  const n = tokenName.toLowerCase()
  if (/-text/.test(n) || /-icon-color/.test(n) || /-chevron-color/.test(n) ||
      /-title-color/.test(n) || /-subtitle-color/.test(n) || /-label-color/.test(n) ||
      /-name-color/.test(n) || /-email-color/.test(n)) return 'text'
  if (/-border/.test(n) || /-subitem-border/.test(n) || /-indicator/.test(n)) return 'stroke'
  if (/-bg/.test(n) || /-surface/.test(n) || /-icon-bg/.test(n)) return 'fill'

  // 2. Fall back to value prefix
  if (value.startsWith('var(--color-text-')) return 'text'
  if (value.startsWith('var(--color-border-')) return 'stroke'
  if (value.startsWith('var(--color-bg-') || value.startsWith('var(--color-surface-') ||
      value.startsWith('var(--color-action-') || value.startsWith('var(--color-state-') ||
      value === 'transparent') return 'fill'
  if (value.startsWith('var(--color-status-')) return 'status'

  // 3. Generic -color suffix → text (icon-color, chevron-color, etc.)
  if (/-color/.test(n)) return 'text'

  return 'fill'
}

// ─── Scoped semantic options ─────────────────────────────────────────────────

export interface SemanticOption {
  label: string
  value: string
  group?: string
}

const FILL_OPTIONS: SemanticOption[] = [
  { label: 'transparent', value: 'transparent', group: 'Special' },
  // Background
  { label: 'bg-primary', value: 'var(--color-bg-primary)', group: 'Background' },
  { label: 'bg-secondary', value: 'var(--color-bg-secondary)', group: 'Background' },
  { label: 'bg-tertiary', value: 'var(--color-bg-tertiary)', group: 'Background' },
  { label: 'bg-inverse', value: 'var(--color-bg-inverse)', group: 'Background' },
  // Surface
  { label: 'surface-default', value: 'var(--color-surface-default)', group: 'Surface' },
  { label: 'surface-raised', value: 'var(--color-surface-raised)', group: 'Surface' },
  { label: 'surface-overlay', value: 'var(--color-surface-overlay)', group: 'Surface' },
  // Action
  { label: 'action-primary', value: 'var(--color-action-primary)', group: 'Action' },
  { label: 'action-primary-hover', value: 'var(--color-action-primary-hover)', group: 'Action' },
  { label: 'action-primary-active', value: 'var(--color-action-primary-active)', group: 'Action' },
  { label: 'action-secondary', value: 'var(--color-action-secondary)', group: 'Action' },
  { label: 'action-secondary-hover', value: 'var(--color-action-secondary-hover)', group: 'Action' },
  { label: 'action-secondary-active', value: 'var(--color-action-secondary-active)', group: 'Action' },
  { label: 'action-disabled', value: 'var(--color-action-disabled)', group: 'Action' },
  { label: 'action-accent', value: 'var(--color-action-accent)', group: 'Action' },
  { label: 'action-destructive', value: 'var(--color-action-destructive)', group: 'Action' },
  { label: 'action-destructive-hover', value: 'var(--color-action-destructive-hover)', group: 'Action' },
  { label: 'action-destructive-active', value: 'var(--color-action-destructive-active)', group: 'Action' },
  // State
  { label: 'state-hover', value: 'var(--color-state-hover)', group: 'State' },
  { label: 'state-pressed', value: 'var(--color-state-pressed)', group: 'State' },
  { label: 'state-selected', value: 'var(--color-state-selected)', group: 'State' },
  { label: 'state-highlight', value: 'var(--color-state-highlight)', group: 'State' },
  { label: 'state-loading', value: 'var(--color-state-loading)', group: 'State' },
  { label: 'state-loading-shine', value: 'var(--color-state-loading-shine)', group: 'State' },
  // Status (subtle — used as subtle backgrounds)
  { label: 'status-success-subtle', value: 'var(--color-status-success-subtle)', group: 'Status' },
  { label: 'status-warning-subtle', value: 'var(--color-status-warning-subtle)', group: 'Status' },
  { label: 'status-error-subtle', value: 'var(--color-status-error-subtle)', group: 'Status' },
  { label: 'status-info-subtle', value: 'var(--color-status-info-subtle)', group: 'Status' },
  // Special
  { label: 'control-thumb', value: 'var(--color-control-thumb)', group: 'Special' },
  { label: 'overlay-backdrop', value: 'var(--color-overlay-backdrop)', group: 'Special' },
  { label: 'color-picker-default', value: 'var(--color-picker-default)', group: 'Special' },
  { label: 'ring', value: 'var(--color-ring)', group: 'Special' },
  // Data series
  { label: 'data-series-1', value: 'var(--color-data-series-1)', group: 'Data' },
  { label: 'data-series-2', value: 'var(--color-data-series-2)', group: 'Data' },
  { label: 'data-series-3', value: 'var(--color-data-series-3)', group: 'Data' },
  { label: 'data-series-4', value: 'var(--color-data-series-4)', group: 'Data' },
  { label: 'data-series-5', value: 'var(--color-data-series-5)', group: 'Data' },
  { label: 'data-series-6', value: 'var(--color-data-series-6)', group: 'Data' },
  { label: 'data-series-7', value: 'var(--color-data-series-7)', group: 'Data' },
]

const TEXT_OPTIONS: SemanticOption[] = [
  { label: 'text-primary', value: 'var(--color-text-primary)', group: 'Text' },
  { label: 'text-secondary', value: 'var(--color-text-secondary)', group: 'Text' },
  { label: 'text-tertiary', value: 'var(--color-text-tertiary)', group: 'Text' },
  { label: 'text-disabled', value: 'var(--color-text-disabled)', group: 'Text' },
  { label: 'text-inverse', value: 'var(--color-text-inverse)', group: 'Text' },
  { label: 'text-accent', value: 'var(--color-text-accent)', group: 'Text' },
  { label: 'text-on-primary', value: 'var(--color-text-on-primary)', group: 'Text' },
  { label: 'text-on-destructive', value: 'var(--color-text-on-destructive)', group: 'Text' },
  { label: 'text-on-status-solid', value: 'var(--color-text-on-status-solid)', group: 'Text' },
  { label: 'text-error', value: 'var(--color-text-error)', group: 'Text' },
  { label: 'text-success', value: 'var(--color-text-success)', group: 'Text' },
  { label: 'text-warning', value: 'var(--color-text-warning)', group: 'Text' },
  { label: 'text-info', value: 'var(--color-text-info)', group: 'Text' },
  // Action (for interactive text like links)
  { label: 'action-primary', value: 'var(--color-action-primary)', group: 'Action' },
  { label: 'action-primary-hover', value: 'var(--color-action-primary-hover)', group: 'Action' },
  { label: 'action-primary-active', value: 'var(--color-action-primary-active)', group: 'Action' },
]

const STROKE_OPTIONS: SemanticOption[] = [
  { label: 'border-default', value: 'var(--color-border-default)', group: 'Border' },
  { label: 'border-subtle', value: 'var(--color-border-subtle)', group: 'Border' },
  { label: 'border-strong', value: 'var(--color-border-strong)', group: 'Border' },
  { label: 'border-inverse', value: 'var(--color-border-inverse)', group: 'Border' },
  { label: 'border-focus', value: 'var(--color-border-focus)', group: 'Border' },
  { label: 'border-focus-visible', value: 'var(--color-border-focus-visible)', group: 'Border' },
  { label: 'border-error', value: 'var(--color-border-error)', group: 'Border' },
  { label: 'border-success', value: 'var(--color-border-success)', group: 'Border' },
  { label: 'border-warning', value: 'var(--color-border-warning)', group: 'Border' },
  { label: 'border-info', value: 'var(--color-border-info)', group: 'Border' },
  // Action (for interactive borders on hover)
  { label: 'action-primary', value: 'var(--color-action-primary)', group: 'Action' },
  { label: 'action-primary-hover', value: 'var(--color-action-primary-hover)', group: 'Action' },
  { label: 'action-primary-active', value: 'var(--color-action-primary-active)', group: 'Action' },
]

const STATUS_OPTIONS: SemanticOption[] = [
  { label: 'status-success', value: 'var(--color-status-success)', group: 'Status' },
  { label: 'status-success-subtle', value: 'var(--color-status-success-subtle)', group: 'Status' },
  { label: 'status-warning', value: 'var(--color-status-warning)', group: 'Status' },
  { label: 'status-warning-subtle', value: 'var(--color-status-warning-subtle)', group: 'Status' },
  { label: 'status-error', value: 'var(--color-status-error)', group: 'Status' },
  { label: 'status-error-subtle', value: 'var(--color-status-error-subtle)', group: 'Status' },
  { label: 'status-info', value: 'var(--color-status-info)', group: 'Status' },
  { label: 'status-info-subtle', value: 'var(--color-status-info-subtle)', group: 'Status' },
  { label: 'status-success-hover', value: 'var(--color-status-success-hover)', group: 'Status' },
]

const SCOPED_COLOR_OPTIONS: Record<ColorScope, SemanticOption[]> = {
  fill: FILL_OPTIONS,
  text: TEXT_OPTIONS,
  stroke: STROKE_OPTIONS,
  status: STATUS_OPTIONS,
}

export function getSemanticOptions(category: TokenCategory, tokenName?: string, value?: string): SemanticOption[] {
  switch (category) {
    case 'color': {
      const scope = detectColorScope(tokenName ?? '', value ?? '')
      return SCOPED_COLOR_OPTIONS[scope]
    }
    case 'spacing':
      return [
        { label: 'component-xs', value: 'var(--spacing-component-xs)' },
        { label: 'component-sm', value: 'var(--spacing-component-sm)' },
        { label: 'component-md', value: 'var(--spacing-component-md)' },
        { label: 'component-lg', value: 'var(--spacing-component-lg)' },
        { label: 'component-xl', value: 'var(--spacing-component-xl)' },
        { label: 'layout-xs', value: 'var(--spacing-layout-xs)' },
        { label: 'layout-sm', value: 'var(--spacing-layout-sm)' },
        { label: 'layout-md', value: 'var(--spacing-layout-md)' },
        { label: 'layout-lg', value: 'var(--spacing-layout-lg)' },
        { label: 'layout-xl', value: 'var(--spacing-layout-xl)' },
      ]
    case 'size':
      return [
        { label: 'component-xs', value: 'var(--size-component-xs)' },
        { label: 'component-sm', value: 'var(--size-component-sm)' },
        { label: 'component-md', value: 'var(--size-component-md)' },
        { label: 'component-lg', value: 'var(--size-component-lg)' },
        { label: 'component-xl', value: 'var(--size-component-xl)' },
        { label: 'component-2xl', value: 'var(--size-component-2xl)' },
        { label: 'control-indicator-sm', value: 'var(--size-control-indicator-sm)' },
        { label: 'control-indicator-md', value: 'var(--size-control-indicator-md)' },
        { label: 'control-indicator-lg', value: 'var(--size-control-indicator-lg)' },
        { label: 'indicator-xs', value: 'var(--size-indicator-xs)' },
        { label: 'indicator-sm', value: 'var(--size-indicator-sm)' },
        { label: 'indicator-md', value: 'var(--size-indicator-md)' },
        { label: 'indicator-lg', value: 'var(--size-indicator-lg)' },
        { label: 'indicator-xl', value: 'var(--size-indicator-xl)' },
        { label: 'overlay-sm', value: 'var(--size-overlay-sm)' },
        { label: 'overlay-md', value: 'var(--size-overlay-md)' },
        { label: 'overlay-lg', value: 'var(--size-overlay-lg)' },
        { label: 'overlay-xl', value: 'var(--size-overlay-xl)' },
        { label: 'overlay-max-height', value: 'var(--size-overlay-max-height)' },
        { label: 'overlay-height-sm', value: 'var(--size-overlay-height-sm)' },
        { label: 'overlay-height-md', value: 'var(--size-overlay-height-md)' },
        { label: 'overlay-height-lg', value: 'var(--size-overlay-height-lg)' },
        { label: 'overlay-height-xl', value: 'var(--size-overlay-height-xl)' },
        { label: 'fixed-0', value: 'var(--size-fixed-0)' },
        { label: 'fixed-1', value: 'var(--size-fixed-1)' },
        { label: 'fixed-2', value: 'var(--size-fixed-2)' },
        { label: 'fixed-3', value: 'var(--size-fixed-3)' },
        { label: 'fixed-4', value: 'var(--size-fixed-4)' },
        { label: 'fixed-5', value: 'var(--size-fixed-5)' },
        { label: 'fixed-6', value: 'var(--size-fixed-6)' },
        { label: 'fixed-7', value: 'var(--size-fixed-7)' },
        { label: 'fixed-8', value: 'var(--size-fixed-8)' },
        { label: 'fixed-10', value: 'var(--size-fixed-10)' },
        { label: 'fixed-11', value: 'var(--size-fixed-11)' },
        { label: 'fixed-14', value: 'var(--size-fixed-14)' },
      ]
    case 'icon':
      return [
        { label: 'semantic-xs', value: 'var(--icon-semantic-xs)' },
        { label: 'semantic-sm', value: 'var(--icon-semantic-sm)' },
        { label: 'semantic-md', value: 'var(--icon-semantic-md)' },
        { label: 'semantic-lg', value: 'var(--icon-semantic-lg)' },
        { label: 'semantic-xl', value: 'var(--icon-semantic-xl)' },
        { label: 'semantic-2xl', value: 'var(--icon-semantic-2xl)' },
      ]
    case 'radius':
      return [
        { label: 'none', value: 'var(--radius-component-none)' },
        { label: 'sm', value: 'var(--radius-component-sm)' },
        { label: 'md', value: 'var(--radius-component-md)' },
        { label: 'lg', value: 'var(--radius-component-lg)' },
        { label: 'xl', value: 'var(--radius-component-xl)' },
        { label: 'full', value: 'var(--radius-component-full)' },
      ]
    case 'shadow':
      return [
        { label: 'sm', value: 'var(--shadow-sm)' },
        { label: 'md', value: 'var(--shadow-md)' },
        { label: 'lg', value: 'var(--shadow-lg)' },
        { label: 'xl', value: 'var(--shadow-xl)' },
      ]
    case 'motion':
      return [
        { label: 'duration-interaction', value: 'var(--duration-interaction)' },
        { label: 'duration-transition', value: 'var(--duration-transition)' },
        { label: 'duration-enter', value: 'var(--duration-enter)' },
        { label: 'ease-default', value: 'var(--ease-default)' },
        { label: 'ease-emphasis', value: 'var(--ease-emphasis)' },
        { label: 'duration-spin', value: 'var(--duration-spin)' },
        { label: 'duration-stagger-sm', value: 'var(--duration-stagger-sm)' },
        { label: 'duration-stagger-md', value: 'var(--duration-stagger-md)' },
      ]
    case 'layer':
      return [
        { label: 'raised', value: 'var(--layer-raised)' },
        { label: 'sticky', value: 'var(--layer-sticky)' },
        { label: 'overlay', value: 'var(--layer-overlay)' },
        { label: 'dialog', value: 'var(--layer-dialog)' },
        { label: 'notification', value: 'var(--layer-notification)' },
        { label: 'popover', value: 'var(--layer-popover)' },
      ]
    case 'border':
      return [
        { label: 'hairline', value: 'var(--border-hairline)' },
        { label: 'default', value: 'var(--border-default)' },
        { label: 'focus', value: 'var(--border-focus)' },
        { label: 'thick', value: 'var(--border-thick)' },
        { label: 'interactive', value: 'var(--border-interactive)' },
        { label: 'interactive-focus', value: 'var(--border-interactive-focus)' },
        { label: 'container', value: 'var(--border-container)' },
        { label: 'media', value: 'var(--border-media)' },
        { label: 'focus-ring', value: 'var(--border-focus-ring)' },
        { label: 'width-hairline', value: 'var(--border-width-hairline)' },
        { label: 'width-thick', value: 'var(--border-width-thick)' },
      ]
    case 'content':
      return [
        // Overflow
        { label: 'overflow-label', value: 'var(--content-overflow-label)', group: 'Overflow' },
        { label: 'overflow-body', value: 'var(--content-overflow-body)', group: 'Overflow' },
        { label: 'overflow-visible', value: 'var(--content-overflow-visible)', group: 'Overflow' },
        // Whitespace
        { label: 'whitespace-label', value: 'var(--content-whitespace-label)', group: 'Whitespace' },
        { label: 'whitespace-body', value: 'var(--content-whitespace-body)', group: 'Whitespace' },
        // Text overflow
        { label: 'text-overflow-label', value: 'var(--content-text-overflow-label)', group: 'Text Overflow' },
        // Line clamp
        { label: 'lines-single', value: 'var(--content-lines-single)', group: 'Lines' },
        { label: 'lines-description', value: 'var(--content-lines-description)', group: 'Lines' },
        { label: 'lines-body', value: 'var(--content-lines-body)', group: 'Lines' },
        // Max width
        { label: 'max-width-xs', value: 'var(--content-max-width-xs)', group: 'Max Width' },
        { label: 'max-width-sm', value: 'var(--content-max-width-sm)', group: 'Max Width' },
        { label: 'max-width-overlay-sm', value: 'var(--content-max-width-overlay-sm)', group: 'Max Width' },
        { label: 'max-width-md', value: 'var(--content-max-width-md)', group: 'Max Width' },
        { label: 'max-width-lg', value: 'var(--content-max-width-lg)', group: 'Max Width' },
        { label: 'max-width-xl', value: 'var(--content-max-width-xl)', group: 'Max Width' },
        { label: 'max-width-full', value: 'var(--content-max-width-full)', group: 'Max Width' },
        // Min width
        { label: 'min-width-0', value: 'var(--content-min-width-0)', group: 'Min Width' },
        { label: 'min-width-xs', value: 'var(--content-min-width-xs)', group: 'Min Width' },
        { label: 'min-width-sm', value: 'var(--content-min-width-sm)', group: 'Min Width' },
        { label: 'min-width-md', value: 'var(--content-min-width-md)', group: 'Min Width' },
      ]
    case 'aspect-ratio':
      return [
        { label: '1/1 (square)', value: '1/1' },
        { label: '4/3', value: '4/3' },
        { label: '3/4 (portrait)', value: '3/4' },
        { label: '16/9 (widescreen)', value: '16/9' },
        { label: '21/9 (ultrawide)', value: '21/9' },
      ]
    default:
      return []
  }
}
