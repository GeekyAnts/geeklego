// ─── Types for Token Classification (IA Layer) ────────────────────────────────

/**
 * Top-level IA sections as defined in Phase 1
 */
export type IATopLevel = 'foundations' | 'semantic' | 'uncategorized'

/**
 * Sub-categories within Foundations section
 */
export type FoundationsSubCategory =
  | 'color'
  | 'spacing'
  | 'radius'
  | 'typography'
  | 'shadow'
  | 'motion'
  | 'border'
  | 'breakpoint'

/**
 * Semantic sub-categories
 */
export type SemanticSubCategory =
  | 'surface'
  | 'content'
  | 'interactive'
  | 'status'
  | 'layout'
  | 'typography-semantic'

/**
 * Component names that can have their own token buckets.
 * Derived from the canonical catalog.ts — the catalog is now the single
 * source of truth for component names and their levels.
 */
export type KnownComponent = string

/**
 * Full classification result for a token
 */
export interface TokenClassification {
  /** Top-level IA section */
  topLevel: IATopLevel
  /** Sub-category within the top-level section */
  subCategory: string
  /** Display-friendly name for the category */
  categoryName: string
  /** Component name if this is a component token */
  componentName?: KnownComponent
  /** The original token name */
  tokenName: string
  /** The token's category key for grouping */
  categoryKey: string
}

/**
 * Classification result grouping tokens by their category
 */
export interface ClassifiedCategory {
  /** Unique key for this category */
  key: string
  /** Display name for UI */
  label: string
  /** Display-friendly category name */
  categoryName: string
  /** Top-level section this belongs to */
  topLevel: IATopLevel
  /** Component name if this is a component category */
  componentName?: KnownComponent
  /** Sub-category type for grouping */
  subCategory: FoundationsSubCategory | SemanticSubCategory | 'component'
  /** List of token names in this category */
  tokens: string[]
  /** Icon name for UI (matching lucide-react or fallback) */
  icon?: string
}

/**
 * Complete classified token structure
 */
export interface ClassifiedTokens {
  /** All foundations tokens grouped */
  foundations: ClassifiedCategory[]
  /** All semantic tokens grouped */
  semantic: ClassifiedCategory[]
  /** All component tokens grouped */
  components: ClassifiedCategory[]
  /** Uncategorized tokens */
  uncategorized: string[]
  /** All known component names discovered */
  componentNames: KnownComponent[]
}

/**
 * Navigation structure for NavRail
 */
export interface NavigationNode {
  /** Unique id */
  id: string
  /** Display label */
  label: string
  /** Top-level type */
  type: 'section' | 'category'
  /** Parent section id */
  parentId?: string
  /** Sub-category type for grouping */
  subCategory?: string
  /** Icon name */
  icon?: string
  /** Token count */
  tokenCount: number
  /** Children for nested structure */
  children?: NavigationNode[]
}

/**
 * Generated navigation structure
 */
export interface NavigationStructure {
  /** Top-level navigation sections */
  sections: NavigationNode[]
}
