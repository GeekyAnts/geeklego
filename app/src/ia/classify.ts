// ─── IA Classification Layer ──────────────────────────────────────────────────
// Pure functions to classify tokens from cssParser output into IA sections

import type {
  ClassifiedTokens,
  ClassifiedCategory,
  NavigationNode,
  NavigationStructure,
  KnownComponent,
  IATopLevel,
  FoundationsSubCategory,
  SemanticSubCategory
} from './classify.types.ts'
import type { TokenMetadata } from '../state/metadata.types'
import { semanticBucketOf, type SemanticBucket } from './semanticBuckets.ts'

// ─── Known Component List ───────────────────────────────────────────────────
// v2 (2-tier) has no component-token tier, so there are no component tokens to
// classify. The old `components/catalog` source was deleted in the §7.5 cut;
// this list is intentionally empty. The component-discovery functions below are
// retained (as no-ops) only so their Phase-4/5 consumers keep compiling — they
// will be removed when the component UI is stripped (rebuild-plan Phase 5).
const KNOWN_COMPONENTS: KnownComponent[] = []

// ─── Foundations Category Definitions ─────────────────────────────────────────

function getFoundationsCategories(): { 
  pattern: RegExp; 
  categoryId: FoundationsSubCategory; 
  label: string; 
  icon?: string 
}[] {
  return [
    { pattern: /^color-/, categoryId: 'color', label: 'Colors', icon: 'Palette' },
    { pattern: /^spacing-/, categoryId: 'spacing', label: 'Spacing', icon: 'Ruler' },
    { pattern: /^radius-/, categoryId: 'radius', label: 'Radius', icon: 'Box' },
    { pattern: /^(font|text|leading|tracking)-/, categoryId: 'typography', label: 'Fonts', icon: 'Type' },
    { pattern: /^shadow-/, categoryId: 'shadow', label: 'Shadows', icon: 'Layers' },
    { pattern: /^(motion|duration|ease)-/, categoryId: 'motion', label: 'Motion', icon: 'Zap' },
    // Match the border-WIDTH primitive scale specifically, not a bare `border-` prefix:
    // the semantic border ramp (border-strong / border-muted) also starts with `border-`
    // and must fall through to the semantic Layout bucket, not be grabbed as a primitive here.
    { pattern: /^border-width-/, categoryId: 'border', label: 'Borders', icon: 'Frame' },
    { pattern: /^breakpoint-/, categoryId: 'breakpoint', label: 'Breakpoints', icon: 'Monitor' },
  ]
}

// ─── Semantic Category Definitions ────────────────────────────────────────────

// UI metadata (label + icon) per semantic bucket. Membership itself lives in the
// shared `semanticBuckets` module — the single source of truth that NavRail (this
// file) and CategoryPage both classify from, so they can never drift apart.
//
// v2 (2-tier) semantics are the flat, standard ShadCN/Tailwind vocabulary
// (background, primary, ring, radius, …). The buckets map the core set onto the
// existing semantic sub-categories so routing / isRouteActive stay unchanged:
//   surface      → page/elevated surfaces + their foreground content
//   interactive  → brand/interactive fills (+ focus ring)
//   layout       → structural tokens (border, input, radius)
//   status       → feedback colors (destructive) + any discovered semantic
//                  beyond the standard ShadCN set (e.g. --chart-*, --info)
const SEMANTIC_BUCKET_META: Record<
  SemanticBucket,
  { categoryId: SemanticSubCategory; label: string; icon: string }
> = {
  surface: { categoryId: 'surface', label: 'Surfaces', icon: 'Layout' },
  interactive: { categoryId: 'interactive', label: 'Interactive', icon: 'Zap' },
  layout: { categoryId: 'layout', label: 'Layout', icon: 'Maximize2' },
  status: { categoryId: 'status', label: 'Status', icon: 'CircleAlert' },
}

// ─── Classification Functions ─────────────────────────────────────────────────

function getMetadataCategory(tokenName: string, metadata?: TokenMetadata): { categoryId: string; label: string; icon?: string; topLevel: string } | null {
  if (metadata?.category) {
    const level = metadata.category === 'foundations' ? 'foundations' : metadata.category === 'semantic' ? 'semantic' : null
    if (level) {
      return {
        categoryId: metadata.category,
        label: metadata.category.charAt(0).toUpperCase() + metadata.category.slice(1),
        topLevel: level,
      }
    }
  }
  return null
}

/**
 * Classify a single token into its IA category
 */
function classifyToken(tokenName: string, tokenMetadata?: TokenMetadata): ClassifiedCategory | null {
  const metadataOverride = getMetadataCategory(tokenName, tokenMetadata)
  
  if (metadataOverride) {
    const pattern = metadataOverride.categoryId === 'foundations' ? /^.*$/ : 
                    metadataOverride.categoryId === 'semantic' ? /^.*$/ : /^.*$/
    
    if (pattern.test(tokenName)) {
      return {
        key: `${metadataOverride.topLevel}/${metadataOverride.categoryId}`,
        label: metadataOverride.label,
        categoryName: metadataOverride.label,
        topLevel: metadataOverride.topLevel as IATopLevel,
        subCategory: metadataOverride.categoryId as FoundationsSubCategory | SemanticSubCategory | 'component',
        tokens: [tokenName],
      }
    }
  }

  const foundations = getFoundationsCategories()
  for (const { pattern, categoryId, label, icon } of foundations) {
    if (pattern.test(tokenName)) {
      return {
        key: `foundations/${categoryId}`,
        label: label,
        categoryName: label,
        topLevel: 'foundations',
        subCategory: categoryId,
        tokens: [tokenName],
        icon: icon,
      }
    }
  }

  const bucket = semanticBucketOf(tokenName)
  if (bucket) {
    const { categoryId, label, icon } = SEMANTIC_BUCKET_META[bucket]
    return {
      key: `semantic/${categoryId}`,
      label: label,
      categoryName: label,
      topLevel: 'semantic',
      subCategory: categoryId,
      tokens: [tokenName],
      icon: icon,
    }
  }

  return null
}

/**
 * Classify all tokens and group them by category
 */
export function classifyTokens(
  tokenNames: string[],
  tokenMetadataMap: Map<string, TokenMetadata> = new Map()
): ClassifiedTokens {
  const categoryMap = new Map<string, ClassifiedCategory>()
  const uncategorized: string[] = []
  const discoveredComponents = new Set<KnownComponent>()

  for (const tokenName of tokenNames) {
    const metadata = tokenMetadataMap.get(tokenName)
    const classification = classifyToken(tokenName, metadata)
    
    if (!classification) {
      uncategorized.push(tokenName)
      continue
    }

    if (!categoryMap.has(classification.key)) {
      categoryMap.set(classification.key, {
        ...classification,
        tokens: [],
      })
    }
    categoryMap.get(classification.key)!.tokens.push(tokenName)
  }

  return {
    foundations: Array.from(categoryMap.values()).filter(c => c.topLevel === 'foundations'),
    semantic: Array.from(categoryMap.values()).filter(c => c.topLevel === 'semantic'),
    // v2 (2-tier) has no component-token tier — there are no 'components' tokens to classify.
    components: [],
    uncategorized,
    componentNames: Array.from(discoveredComponents) as KnownComponent[],
  }
}

/**
 * Generate navigation structure from classified tokens
 */
export function generateNavigationStructure(classified: ClassifiedTokens): NavigationStructure {
  const sections: NavigationNode[] = [
    {
      id: 'foundations',
      label: 'Foundations',
      type: 'section',
      tokenCount: foundationalCount(classified.foundations),
      children: classified.foundations.map(cat => ({
        id: `foundations-${cat.key}`,
        label: cat.label,
        type: 'category',
        parentId: 'foundations',
        subCategory: cat.subCategory,
        icon: cat.icon,
        tokenCount: cat.tokens.length,
      })),
    },
    {
      id: 'semantic',
      label: 'Semantic',
      type: 'section',
      tokenCount: semanticCount(classified.semantic),
      children: classified.semantic.map(cat => ({
        id: `semantic-${cat.key}`,
        label: cat.label,
        type: 'category',
        parentId: 'semantic',
        subCategory: cat.subCategory,
        icon: cat.icon,
        tokenCount: cat.tokens.length,
      })),
    },
    {
      id: 'components',
      label: 'Components',
      type: 'section',
      tokenCount: componentCount(classified.components),
      children: classified.components.map(cat => ({
        id: `components-${cat.key}`,
        label: cat.label,
        type: 'category',
        parentId: 'components',
        subCategory: 'component',
        tokenCount: cat.tokens.length,
      })),
    },
  ]

  return { sections }
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

function foundationalCount(categories: ClassifiedCategory[]): number {
  return categories.reduce((sum, cat) => sum + cat.tokens.length, 0)
}

function semanticCount(categories: ClassifiedCategory[]): number {
  return categories.reduce((sum, cat) => sum + cat.tokens.length, 0)
}

function componentCount(categories: ClassifiedCategory[]): number {
  return categories.reduce((sum, cat) => sum + cat.tokens.length, 0)
}

// ─── Utility Functions ────────────────────────────────────────────────────────

/**
 * Extract component name from a token if it's a component token
 */
export function getComponentNameFromToken(tokenName: string): KnownComponent | undefined {
  for (const componentName of KNOWN_COMPONENTS) {
    const pattern = new RegExp(`^${componentName}-`)
    if (pattern.test(tokenName)) {
      return componentName
    }
  }
  return undefined
}

/**
 * Check if a token belongs to a specific category
 */
export function getTokenCategory(
  tokenName: string
): { topLevel: string; subCategory: string; categoryName: string } | null {
  const classification = classifyToken(tokenName)
  if (!classification) return null
  
  return {
    topLevel: classification.topLevel,
    subCategory: classification.subCategory,
    categoryName: classification.categoryName,
  }
}

/**
 * Get list of all known component names
 */
export function getKnownComponents(): readonly KnownComponent[] {
  return [...KNOWN_COMPONENTS]
}

