import { describe, it, expect, beforeEach } from 'vitest'
import { computeAvailableSuggestions } from './suggestions.ts'
import { discardAll } from './staging.ts'
import { lockSemantic, unlockSemantic, getAllLocked } from './semanticLocks.ts'
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

  // A near-black brand ramp whose LIGHTER steps are still visible on a dark surface
  // (so the engine can offer an applicable re-point), plus dark bg = a dark neutral.
  const NEAR_BLACK_BRAND = {
    '50': '#f5f5f5', '100': '#ececec', '200': '#c5c5c5', '300': '#909090',
    '400': '#545454', '500': '#171717', '600': '#161616', '700': '#151515',
    '900': '#111111',
  }

  it('offers an APPLICABLE re-point when --primary is invisible but a lighter step exists', () => {
    const tokens = makeTokens({ dark: { background: 'var(--color-neutral-900)' } }) // #1c1c20
    ;(tokens.primitives.colors as Record<string, unknown>).brand = NEAR_BLACK_BRAND

    const s = computeAvailableSuggestions(tokens)
    const fix = s.find(x => x.key === 'primary' && x.theme === 'dark')
    expect(fix).toBeDefined()
    expect(fix!.kind).toBe('suggest')          // applicable, not warn-only
    expect(fix!.to).toBe('var(--color-brand-50)') // highest-contrast step on dark bg
    expect(fix!.stagingKey).toBe('dark:--primary')
    expect(fix!.message).toMatch(/invisible/i)
  })

  it('still surfaces the fix even when the token is locked (Apply is opt-in)', () => {
    const tokens = makeTokens({ dark: { background: 'var(--color-neutral-900)' } })
    ;(tokens.primitives.colors as Record<string, unknown>).brand = NEAR_BLACK_BRAND
    lockSemantic('dark:primary') // a lock must not silence a legibility problem
    try {
      const s = computeAvailableSuggestions(tokens)
      expect(s.some(x => x.key === 'primary' && x.theme === 'dark')).toBe(true)
    } finally {
      unlockSemantic('dark:primary')
    }
  })

  it('falls back to warn-only when the ramp is too flat to have a visible step', () => {
    // Every step near-black → nothing clears 3:1 on a near-black dark bg.
    const flatBlack = {
      '50': '#0d0d0d', '100': '#0d0d0d', '200': '#0c0c0c', '300': '#0c0c0c',
      '400': '#0b0b0b', '500': '#0b0b0b', '600': '#0a0a0a', '700': '#0a0a0a',
      '900': '#090909',
    }
    const tokens = makeTokens({ dark: { background: 'var(--color-neutral-900)' } })
    ;(tokens.primitives.colors as Record<string, unknown>).brand = flatBlack
    const s = computeAvailableSuggestions(tokens)
    const warn = s.find(x => x.key === 'primary' && x.theme === 'dark')
    expect(warn).toBeDefined()
    expect(warn!.kind).toBe('warn')
    expect(warn!.to).toBe('')
    expect(warn!.message).toMatch(/widen the ramp/i)
  })

  it('does not tug --primary back to a step invisible on the dark surface (no revert loop)', () => {
    // Simulate the post-apply state: --primary already re-pointed to the visible
    // light step (brand-50) on a dark bg. The brand loop's text-optimal pick is
    // brand-600 (invisible on this bg) — it must NOT be suggested as a revert.
    const tokens = makeTokens({
      dark: { primary: 'var(--color-brand-50)', background: 'var(--color-neutral-900)' },
    })
    ;(tokens.primitives.colors as Record<string, unknown>).brand = NEAR_BLACK_BRAND
    const s = computeAvailableSuggestions(tokens)
    const darkPrimary = s.filter(x => x.key === 'primary' && x.theme === 'dark')
    // brand-50 is visible on the dark bg → no surface fix, and no revert to brand-600.
    expect(darkPrimary.some(x => x.to === 'var(--color-brand-600)')).toBe(false)
  })

  it('does not flag --primary when it stands out on its surface', () => {
    // Default indigo brand-600 on white/dark neutrals — plenty of contrast.
    const s = computeAvailableSuggestions(makeTokens())
    expect(s.some(x => x.key === 'primary' && x.message)).toBe(false)
  })
})
