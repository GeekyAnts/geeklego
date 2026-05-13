import { describe, it, expect } from 'vitest'
import { parseComponentTokens } from './componentTokenParser'

describe('parseComponentTokens', () => {
  it('deduplicates components that appear twice, keeping the later date', () => {
    const css = `
/* ─── GENERATED COMPONENT TOKENS ─── */

/* Checkbox — generated 2026-03-23 */
:root, [data-theme="dark"] {
  --checkbox-size-sm: var(--size-control-indicator-sm);
  --checkbox-size-md: var(--size-control-indicator-md);
}

/* Checkbox — generated 2026-04-24 */
:root, [data-theme="dark"] {
  --checkbox-size-sm: var(--size-component-xs);
  --checkbox-size-md: var(--size-component-sm);
}
`
    const groups = parseComponentTokens(css)
    const checkboxGroups = groups.filter(g => g.componentName === 'Checkbox')
    expect(checkboxGroups).toHaveLength(1)
    expect(checkboxGroups[0].generatedDate).toBe('2026-04-24')
    expect(checkboxGroups[0].sections[0].tokens[0].value).toBe('var(--size-component-xs)')
  })

  it('keeps single-occurrence components unchanged', () => {
    const css = `
/* ─── GENERATED COMPONENT TOKENS ─── */

/* Badge — generated 2026-03-23 */
:root, [data-theme="dark"] {
  --badge-bg: var(--color-action-primary);
}
`
    const groups = parseComponentTokens(css)
    expect(groups).toHaveLength(1)
    expect(groups[0].componentName).toBe('Badge')
  })

  it('keeps the first-seen entry when two entries share the same date', () => {
    const css = `
/* ─── GENERATED COMPONENT TOKENS ─── */

/* Badge — generated 2026-04-24 */
:root, [data-theme="dark"] {
  --badge-bg: var(--color-action-primary);
}

/* Badge — generated 2026-04-24 */
:root, [data-theme="dark"] {
  --badge-bg: var(--color-action-secondary);
}
`
    const groups = parseComponentTokens(css)
    const badgeGroups = groups.filter(g => g.componentName === 'Badge')
    expect(badgeGroups).toHaveLength(1)
    // First-seen wins on tie (source-order deterministic)
    expect(badgeGroups[0].sections[0].tokens[0].value).toBe('var(--color-action-primary)')
  })

  it('returns multiple components sorted alphabetically regardless of source order', () => {
    const css = `
/* ─── GENERATED COMPONENT TOKENS ─── */

/* Toggle — generated 2026-03-23 */
:root, [data-theme="dark"] {
  --toggle-bg: var(--color-action-primary);
}

/* Avatar — generated 2026-03-23 */
:root, [data-theme="dark"] {
  --avatar-size-md: var(--size-component-md);
}

/* Badge — generated 2026-03-23 */
:root, [data-theme="dark"] {
  --badge-bg: var(--color-action-primary);
}
`
    const groups = parseComponentTokens(css)
    expect(groups).toHaveLength(3)
    expect(groups[0].componentName).toBe('Avatar')
    expect(groups[1].componentName).toBe('Badge')
    expect(groups[2].componentName).toBe('Toggle')
  })

  it('returns an empty array for CSS with no component token blocks', () => {
    const css = `:root { --color-primary: red; }`
    const groups = parseComponentTokens(css)
    expect(groups).toHaveLength(0)
  })
})
