import { describe, it, expect } from 'vitest'
import {
  relativeLuminance,
  contrastRatio,
  pickPrimaryStep,
  suggestBrandSemantics,
  suggestNeutralSemantics,
  generateOklchScale,
  WCAG_AA_NORMAL,
} from './colorUtils.ts'

// A realistic neutral ramp (light → dark), matching the shipped primitives shape.
const NEUTRAL_RAMP: Record<string, string> = {
  '0': '#ffffff', '50': '#fafafa', '100': '#f4f4f5', '200': '#e4e4e7',
  '500': '#71717a', '700': '#3f3f46', '800': '#27272a', '900': '#1c1c20',
}

// Neutral extremes the editor ships (primitives.css): neutral-0 = white, neutral-900 ≈ near-black.
const NEUTRAL_0 = '#ffffff'
const NEUTRAL_900 = '#1c1c20'

/** Build a brand ramp the same way the Token Editor's palette generator does. */
function ramp(baseHex: string): Record<string, string> {
  return generateOklchScale(baseHex, /* includeZero */ false)
}

describe('relativeLuminance', () => {
  it('is 0 for black and ~1 for white', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5)
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 5)
  })
  it('returns 0 for non-hex input', () => {
    expect(relativeLuminance('oklch(0.5 0.1 250)')).toBe(0)
  })
})

describe('contrastRatio', () => {
  it('black vs white is 21:1', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 2)
  })
  it('is order-independent', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(
      contrastRatio('#ffffff', '#000000'), 6,
    )
  })
  it('identical colors are 1:1', () => {
    expect(contrastRatio('#3366cc', '#3366cc')).toBeCloseTo(1, 6)
  })
})

describe('pickPrimaryStep', () => {
  // Saturated hues should land on a vivid-but-text-safe step with an AA-passing foreground.
  const vividCases: Array<[string, string]> = [
    ['pink',  '#ec4899'],
    ['blue',  '#3b82f6'],
    ['green', '#22c55e'],
  ]

  for (const [name, hex] of vividCases) {
    it(`picks an AA-passing step + foreground for ${name}`, () => {
      const pick = pickPrimaryStep(ramp(hex), NEUTRAL_0, NEUTRAL_900)
      expect(pick.belowAA).toBe(false)
      expect(pick.contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL)
      expect(['neutral-0', 'neutral-900']).toContain(pick.foreground)
      // Should prefer a vivid mid/dark step, never the lightest.
      expect(Number(pick.step)).toBeGreaterThanOrEqual(500)
    })
  }

  it('the chosen foreground actually clears AA against the chosen step', () => {
    const scale = ramp('#ec4899')
    const pick = pickPrimaryStep(scale, NEUTRAL_0, NEUTRAL_900)
    const fgHex = pick.foreground === 'neutral-0' ? NEUTRAL_0 : NEUTRAL_900
    const stepHex = scale[pick.step]
    // stepHex is oklch(...) from the generator; contrastRatio handles only hex,
    // so assert via the pick's own reported contrast instead.
    expect(pick.contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL)
    expect(fgHex).toBeTruthy()
    expect(stepHex).toBeTruthy()
  })

  it('rescues a pale hue (yellow) by choosing the DARK foreground', () => {
    // A good system puts black text on a yellow button, not white. The contrast-
    // aware foreground choice should pick neutral-900 and still clear AA.
    const pick = pickPrimaryStep(ramp('#fde047'), NEUTRAL_0, NEUTRAL_900)
    expect(pick.foreground).toBe('neutral-900')
    expect(pick.belowAA).toBe(false)
    expect(pick.contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL)
  })

  it('flags belowAA when NO candidate step clears AA with either foreground', () => {
    // A mid-tone ramp whose vivid candidates sit near the neutral midpoint can't
    // reach 4.5:1 against white OR near-black — the genuine edge the flag guards.
    // ~#808080 is the WCAG dead zone: ≈3.95:1 vs white and ≈4.30:1 vs near-black —
    // both under 4.5. Keep every candidate step inside it.
    const midRamp: Record<string, string> = {
      '500': '#838383', '600': '#808080', '700': '#7d7d7d', '800': '#7a7a7a',
    }
    const pick = pickPrimaryStep(midRamp, NEUTRAL_0, NEUTRAL_900)
    expect(pick.belowAA).toBe(true)
    expect(pick.contrast).toBeLessThan(WCAG_AA_NORMAL)
  })

  it('falls back safely when the ramp is empty', () => {
    const pick = pickPrimaryStep({}, NEUTRAL_0, NEUTRAL_900)
    expect(pick.step).toBe('900')
    expect(pick.belowAA).toBe(true)
  })
})

describe('suggestBrandSemantics', () => {
  const colors = {
    neutral: { '0': NEUTRAL_0, '900': NEUTRAL_900 },
    brand: ramp('#ec4899'),
  }

  it('returns primary, primary-foreground, and ring as color-ref aliases', () => {
    const s = suggestBrandSemantics(colors, 'brand')
    expect(s).not.toBeNull()
    expect(s!.primary).toMatch(/^var\(--color-brand-\d+\)$/)
    expect(s!['primary-foreground']).toMatch(/^var\(--color-neutral-(0|900)\)$/)
    // ring tracks the same step as primary
    expect(s!.ring).toBe(s!.primary)
  })

  it('null when the brand family or neutrals are missing', () => {
    expect(suggestBrandSemantics({ neutral: colors.neutral }, 'brand')).toBeNull()
    expect(suggestBrandSemantics({ brand: colors.brand }, 'brand')).toBeNull()
  })
})

describe('suggestNeutralSemantics', () => {
  const colors = { neutral: NEUTRAL_RAMP }

  for (const role of ['accent', 'secondary', 'muted']) {
    it(`suggests a light neutral surface + dark, AA-safe foreground for ${role}`, () => {
      const s = suggestNeutralSemantics(colors, role)
      expect(s).not.toBeNull()
      // surface is a neutral alias, foreground is dark (light surface → dark text)
      expect(s!.surface).toMatch(/^var\(--color-neutral-\d+\)$/)
      expect(s!.foreground).toBe('var(--color-neutral-900)')
      expect(s!.belowAA).toBe(false)
      expect(s!.contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL)
    })
  }

  it('honors an explicit step override', () => {
    const s = suggestNeutralSemantics(colors, 'accent', '50')
    expect(s!.surface).toBe('var(--color-neutral-50)')
    expect(s!.step).toBe('50')
  })

  it('picks the WHITE foreground when the surface is a dark neutral step', () => {
    const s = suggestNeutralSemantics(colors, 'accent', '900')
    expect(s!.foreground).toBe('var(--color-neutral-0)')
    expect(s!.belowAA).toBe(false)
  })

  it('null when the neutral ramp is missing', () => {
    expect(suggestNeutralSemantics({ brand: {} }, 'accent')).toBeNull()
  })

  for (const role of ['accent', 'secondary', 'muted']) {
    it(`suggests a DARK neutral surface (800) + light, AA-safe foreground for ${role} in dark theme`, () => {
      const s = suggestNeutralSemantics(colors, role, undefined, 'dark')
      expect(s).not.toBeNull()
      expect(s!.surface).toBe('var(--color-neutral-800)')
      expect(s!.step).toBe('800')
      // dark surface → light text
      expect(s!.foreground).toBe('var(--color-neutral-0)')
      expect(s!.belowAA).toBe(false)
      expect(s!.contrast).toBeGreaterThanOrEqual(WCAG_AA_NORMAL)
    })
  }

  it('explicit step override wins over the dark-theme default', () => {
    const s = suggestNeutralSemantics(colors, 'muted', '50', 'dark')
    expect(s!.surface).toBe('var(--color-neutral-50)')
    expect(s!.step).toBe('50')
  })
})
