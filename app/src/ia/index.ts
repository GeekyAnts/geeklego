// ─── IA Module Exports ────────────────────────────────────────────────────────

export * from './classify.types.ts'
export { classifyTokens, generateNavigationStructure, getComponentNameFromToken, getTokenCategory, getKnownComponents } from './classify.ts'
export { getMetaForCategory, getCategoryById, groupTokensByPattern } from './categoryCopy.ts'
export { semanticBucketOf, semanticBucketOfVar, isStatusSemantic, FOUNDATION_PREFIX_RE, type SemanticBucket } from './semanticBuckets.ts'

