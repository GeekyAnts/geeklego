import { describe, it, expect } from 'vitest'
import { flattenTokens, collectTokenNames } from './flattenTokens'
import type { GeeklegoTokensV2 } from '../types'

// Minimal model: one Record scale, the nested colors scale, the scalar
// colorShadowNeutral primitive, and one flat semantic. Exercises all three
// walk() branches (flat scale, nested, scalar) plus semantics.
function model(over: Partial<GeeklegoTokensV2['primitives']> = {}): GeeklegoTokensV2 {
  return {
    primitives: {
      colors: { neutral: { '500': '#808080' } },
      spacing: { '4': '1rem' },
      colorShadowNeutral: '#141619',
      ...over,
    } as unknown as GeeklegoTokensV2['primitives'],
    semantics: { light: { primary: 'var(--color-brand-900)' }, dark: {} },
    ext: { rawBlock: '' },
  } as unknown as GeeklegoTokensV2
}

describe('flattenTokens — scalar primitive colorShadowNeutral (L1)', () => {
  it('emits --color-shadow-neutral with its value (flattenTokens, dashed)', () => {
    const entries = flattenTokens(model())
    const shadow = entries.find((e) => e.name === '--color-shadow-neutral')
    expect(shadow).toBeDefined()
    expect(shadow?.value).toBe('#141619')
  })

  it('emits color-shadow-neutral for the classifier (collectTokenNames, no dashes)', () => {
    expect(collectTokenNames(model())).toContain('color-shadow-neutral')
  })

  it('still emits the Record scales and flat semantics alongside the scalar', () => {
    const names = flattenTokens(model()).map((e) => e.name)
    expect(names).toContain('--color-neutral-500')
    expect(names).toContain('--spacing-4')
    expect(names).toContain('--primary')
    expect(names).toContain('--color-shadow-neutral')
  })

  it('omits the scalar when empty (matches parser default of "")', () => {
    const names = flattenTokens(model({ colorShadowNeutral: '' })).map((e) => e.name)
    expect(names).not.toContain('--color-shadow-neutral')
  })
})
