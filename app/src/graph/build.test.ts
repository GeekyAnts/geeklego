import { describe, it, expect } from 'vitest'
import { buildTokenGraph } from './build'
import type { GeeklegoTokensV2 } from '../types'

function model(shadow = '#141619'): GeeklegoTokensV2 {
  return {
    primitives: {
      colors: { neutral: { '500': '#808080' } },
      colorShadowNeutral: shadow,
    } as unknown as GeeklegoTokensV2['primitives'],
    // a semantic that chains to the scalar primitive, to exercise edge wiring
    semantics: { light: { ring: 'var(--color-shadow-neutral)' }, dark: {} },
    ext: { rawBlock: '' },
  } as unknown as GeeklegoTokensV2
}

describe('buildTokenGraph — scalar primitive colorShadowNeutral (L1)', () => {
  it('registers a --color-shadow-neutral node', () => {
    const graph = buildTokenGraph(model())
    expect(graph.nodes.has('--color-shadow-neutral')).toBe(true)
  })

  it('wires a semantic that references the scalar (dependsOn / dependents)', () => {
    const graph = buildTokenGraph(model())
    expect(graph.nodes.get('--ring')?.dependsOn).toContain('--color-shadow-neutral')
    expect(graph.nodes.get('--color-shadow-neutral')?.dependents).toContain('--ring')
  })

  it('does not register the node when the scalar is empty', () => {
    const graph = buildTokenGraph(model(''))
    expect(graph.nodes.has('--color-shadow-neutral')).toBe(false)
  })
})
