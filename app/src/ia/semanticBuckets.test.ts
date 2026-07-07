import { describe, it, expect } from 'vitest'
import { semanticBucketOf, semanticBucketOfVar, isStatusSemantic } from './semanticBuckets.ts'
import { classifyTokens } from './classify.ts'

describe('semanticBuckets — status membership', () => {
  it('routes the standard ShadCN destructive pair to status', () => {
    expect(semanticBucketOf('destructive')).toBe('status')
    expect(semanticBucketOf('destructive-foreground')).toBe('status')
    expect(isStatusSemantic('destructive')).toBe(true)
  })

  it('routes geeklego --chart-* data-series semantics to status (discovered-semantic catch-all)', () => {
    for (const n of ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5']) {
      expect(semanticBucketOf(n)).toBe('status')
    }
  })

  it('keeps a future discovered semantic (e.g. --success) in status', () => {
    expect(semanticBucketOf('success')).toBe('status')
    expect(semanticBucketOf('info')).toBe('status')
    expect(semanticBucketOf('warning')).toBe('status')
  })

  it('does NOT leak typography primitives into status (the original bug)', () => {
    for (const n of [
      'text-2xs', 'text-base', 'text-9xl',
      'leading-tight', 'leading-loose',
      'tracking-wide', 'tracking-tightest',
    ]) {
      expect(isStatusSemantic(n), `${n} must not be status`).toBe(false)
      expect(semanticBucketOf(n), `${n} is a primitive, not a semantic`).toBeNull()
    }
  })

  it('does NOT leak font family / weight primitives into status', () => {
    for (const n of ['font-sans', 'font-mono', 'font-display', 'font-weight-bold', 'font-weight-regular']) {
      expect(isStatusSemantic(n)).toBe(false)
      expect(semanticBucketOf(n)).toBeNull()
    }
  })

  it('does NOT leak other foundation primitives into status', () => {
    for (const n of ['color-brand-900', 'spacing-4', 'radius-lg', 'shadow-md', 'duration-200', 'opacity-50', 'breakpoint-md']) {
      expect(semanticBucketOf(n)).toBeNull()
    }
  })
})

describe('semanticBuckets — non-status buckets', () => {
  it('routes surface semantics', () => {
    for (const n of ['background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground']) {
      expect(semanticBucketOf(n)).toBe('surface')
    }
  })

  it('routes interactive semantics', () => {
    for (const n of ['primary', 'primary-foreground', 'secondary', 'accent', 'muted', 'muted-foreground', 'ring']) {
      expect(semanticBucketOf(n)).toBe('interactive')
    }
  })

  it('routes layout semantics', () => {
    for (const n of ['border', 'input', 'radius']) {
      expect(semanticBucketOf(n)).toBe('layout')
    }
  })

  it('routes the sidebar navigation-chrome group to layout, NOT status (M1)', () => {
    for (const n of [
      'sidebar-bg', 'sidebar-foreground', 'sidebar-border',
      'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-ring',
    ]) {
      expect(semanticBucketOf(n), `${n} must be layout`).toBe('layout')
      expect(isStatusSemantic(n), `${n} must not be status`).toBe(false)
    }
  })

  it('none of the non-status buckets are misclassified as status', () => {
    for (const n of ['background', 'primary', 'border', 'card', 'ring', 'radius']) {
      expect(isStatusSemantic(n)).toBe(false)
    }
  })
})

describe('semanticBucketOfVar — handles the leading --', () => {
  it('strips -- and classifies', () => {
    expect(semanticBucketOfVar('--destructive')).toBe('status')
    expect(semanticBucketOfVar('--primary')).toBe('interactive')
    expect(semanticBucketOfVar('--background')).toBe('surface')
    expect(semanticBucketOfVar('--border')).toBe('layout')
    expect(semanticBucketOfVar('--text-base')).toBeNull()
  })
})

describe('classify.ts (NavRail) and semanticBuckets agree', () => {
  // Guards against the two systems re-diverging: the NavRail classifier must put
  // exactly the status-bucket tokens under semantic/status, and never a primitive.
  it('classifyTokens puts only true status semantics under semantic/status', () => {
    const names = [
      'destructive', 'destructive-foreground', 'chart-1', 'chart-5',
      'primary', 'background', 'border', 'radius', 'ring',
      'text-base', 'leading-tight', 'tracking-wide', 'font-sans',
      'color-brand-900', 'spacing-4',
    ]
    const result = classifyTokens(names)
    const statusCat = result.semantic.find((c) => c.subCategory === 'status')
    const statusTokens = (statusCat?.tokens ?? []).slice().sort()

    expect(statusTokens).toEqual(
      ['chart-1', 'chart-5', 'destructive', 'destructive-foreground'].sort(),
    )
    // typography primitives must NOT appear in status
    for (const leak of ['text-base', 'leading-tight', 'tracking-wide', 'font-sans']) {
      expect(statusTokens).not.toContain(leak)
    }
  })
})
