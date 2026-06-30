import { describe, it, expect, beforeEach } from 'vitest'
import { computeAvailableSuggestions } from './suggestions.ts'
import { discardAll } from './staging.ts'
import { unlockSemantic, getAllLocked } from './semanticLocks.ts'
import type { GeeklegoTokensV2 } from '../types.ts'

// A neutral ramp + brand ramp wide enough for the engines to pick from.
const NEUTRAL = {
  '0': '#ffffff', '50': '#fafafa', '100': '#f4f4f5', '400': '#a1a1aa',
  '500': '#71717a', '800': '#27272a', '900': '#1c1c20',
}
const BRAND = {
  '50': '#eef2ff', '500': '#6366f1', '600': '#4f46e5', '700': '#4338ca', '900': '#312e81',
}

/** Minimal model: only the fields computeAvailableSuggestions reads. */
function makeTokens(overrides?: {
  light?: Record<string, string>
  dark?: Record<string, string>
}): GeeklegoTokensV2 {
  const light: Record<string, string> = {
    primary: 'var(--color-brand-600)',
    'primary-foreground': 'var(--color-neutral-0)',
    ring: 'var(--color-brand-600)',
    accent: 'var(--color-neutral-100)',
    'accent-foreground': 'var(--color-neutral-900)',
    secondary: 'var(--color-neutral-100)',
    'secondary-foreground': 'var(--color-neutral-900)',
    muted: 'var(--color-neutral-100)',
    'muted-foreground': 'var(--color-neutral-900)',
    ...overrides?.light,
  }
  const dark: Record<string, string> = {
    primary: 'var(--color-brand-600)',
    'primary-foreground': 'var(--color-neutral-0)',
    ring: 'var(--color-brand-600)',
    accent: 'var(--color-neutral-800)',
    'accent-foreground': 'var(--color-neutral-0)',
    secondary: 'var(--color-neutral-800)',
    'secondary-foreground': 'var(--color-neutral-0)',
    muted: 'var(--color-neutral-800)',
    'muted-foreground': 'var(--color-neutral-0)',
    ...overrides?.dark,
  }
  return {
    primitives: { colors: { neutral: NEUTRAL, brand: BRAND } },
    semantics: { light, dark },
    ext: {} as GeeklegoTokensV2['ext'],
    fontLoaders: [],
  } as unknown as GeeklegoTokensV2
}

describe('computeAvailableSuggestions', () => {
  beforeEach(() => {
    discardAll()
    for (const k of getAllLocked()) unlockSemantic(k)
  })

  it('returns no suggestions when every semantic already matches its auto-pick', () => {
    const s = computeAvailableSuggestions(makeTokens())
    expect(s).toEqual([])
  })

  it('surfaces a primary suggestion in both themes when --primary is off the pick', () => {
    const tokens = makeTokens({
      light: { primary: 'var(--color-brand-500)' },
      dark: { primary: 'var(--color-brand-50)' },
    })
    const s = computeAvailableSuggestions(tokens)
    const primaries = s.filter(x => x.key === 'primary')
    expect(primaries).toHaveLength(2)
    expect(primaries.every(p => p.to === 'var(--color-brand-600)')).toBe(true)
    expect(primaries.map(p => p.theme).sort()).toEqual(['dark', 'light'])
  })

  it('does NOT nag about an already-legible foreground (deliberate quiet choice)', () => {
    // dark muted-foreground = neutral-400 reads fine on neutral-800 → no suggestion.
    const tokens = makeTokens({ dark: { 'muted-foreground': 'var(--color-neutral-400)' } })
    const s = computeAvailableSuggestions(tokens)
    expect(s.some(x => x.key === 'muted-foreground' && x.theme === 'dark')).toBe(false)
  })

  it('suggests a surface fix when a neutral surface is off-ramp', () => {
    const tokens = makeTokens({ light: { muted: 'var(--color-neutral-500)' } })
    const s = computeAvailableSuggestions(tokens)
    const m = s.find(x => x.key === 'muted' && x.theme === 'light')
    expect(m).toBeDefined()
    expect(m!.to).toBe('var(--color-neutral-100)')
    expect(m!.from).toBe('var(--color-neutral-500)')
    expect(m!.stagingKey).toBe('--muted')
  })

  it('returns [] for a null model', () => {
    expect(computeAvailableSuggestions(null)).toEqual([])
  })
})
