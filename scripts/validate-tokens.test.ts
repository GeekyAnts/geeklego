import { describe, it, expect } from 'vitest'
import { validateCssTokens, validateComponentTokenRefs, validateTokenNamingConvention } from './validate-tokens'

describe('validateCssTokens (existing)', () => {
  it('returns 0 broken refs for a self-consistent CSS file', () => {
    const css = `:root { --my-token: red; } .foo { color: var(--my-token); }`
    const { broken } = validateCssTokens(css)
    expect(broken).toHaveLength(0)
  })

  it('catches a var() reference to an undefined token', () => {
    const css = `.foo { color: var(--undefined-token); }`
    const { broken } = validateCssTokens(css)
    expect(broken[0].name).toBe('undefined-token')
  })
})

describe('validateComponentTokenRefs (new)', () => {
  it('detects a var() reference in a .tsx file that is missing from CSS', () => {
    const css = `:root { --avatar-size-md: 2rem; }`
    const componentCode = `const cls = 'w-[var(--size-avatar-md)]'` // wrong prefix order
    const { broken } = validateComponentTokenRefs(css, [
      { filePath: 'Avatar.tsx', content: componentCode }
    ])
    expect(broken).toHaveLength(1)
    expect(broken[0].name).toBe('size-avatar-md')
    expect(broken[0].file).toBe('Avatar.tsx')
  })

  it('passes when all component var() references exist in CSS', () => {
    const css = `:root { --avatar-size-md: 2rem; }`
    const componentCode = `const cls = 'w-[var(--avatar-size-md)]'`
    const { broken } = validateComponentTokenRefs(css, [
      { filePath: 'Avatar.tsx', content: componentCode }
    ])
    expect(broken).toHaveLength(0)
  })

  it('ignores Tailwind built-in variables (not --gl- or design system tokens)', () => {
    const css = `:root { --avatar-size-md: 2rem; }`
    // tw-* and spacing-* builtins from Tailwind internals should not be flagged
    const componentCode = `const cls = 'w-[var(--tw-ring-offset-shadow)] w-[var(--avatar-size-md)]'`
    const { broken } = validateComponentTokenRefs(css, [
      { filePath: 'Foo.tsx', content: componentCode }
    ])
    expect(broken).toHaveLength(0)
  })
})

describe('validateTokenNamingConvention', () => {
  it('flags tokens where a known property prefix precedes the component name', () => {
    const css = `
/* ─── GENERATED COMPONENT TOKENS ─── */

/* Avatar — generated 2026-03-16 */
:root,
[data-theme="dark"] {
  --size-avatar-md: 2rem;
  --avatar-size-md: 2rem;
}
`
    const warnings = validateTokenNamingConvention(css)
    expect(warnings.some(w => w.includes('--size-avatar-md'))).toBe(true)
    expect(warnings.some(w => w.includes('--avatar-size-md'))).toBe(false)
  })

  it('does not flag semantic tokens that are valid (non-component tokens)', () => {
    const css = `
      :root {
        --color-action-primary: #6366f1;
        --color-text-secondary: #666;
      }
    `
    const warnings = validateTokenNamingConvention(css)
    expect(warnings.filter(w => w.includes('--color-action-primary'))).toHaveLength(0)
    expect(warnings.filter(w => w.includes('--color-text-secondary'))).toHaveLength(0)
    // Note: tokens like --spacing-component-md may be flagged as warnings since they end with a scale
    // The validator is intentionally conservative to catch potential naming violations
  })

  it('does not flag tokens without size-scale suffixes', () => {
    const css = `
      :root {
        --bg-primary: #fff;
        --border-color-hover: #ccc;
      }
    `
    const warnings = validateTokenNamingConvention(css)
    expect(warnings).toHaveLength(0)
  })

  it('does not flag semantic tokens outside component blocks, even if they look like property-first naming', () => {
    // This test documents the false-positive bug: --size-control-indicator-sm is a
    // legitimate semantic token (not a component token), so should NOT be flagged
    // as a naming violation just because it starts with a property prefix and ends with a size scale.
    const css = `
      :root {
        --size-control-indicator-sm: 0.75rem;
        --size-icon-sm: 1rem;
        --color-text-secondary: #666;
      }
    `
    const warnings = validateTokenNamingConvention(css)
    expect(warnings.filter(w => w.includes('--size-control-indicator-sm'))).toHaveLength(0)
    expect(warnings.filter(w => w.includes('--size-icon-sm'))).toHaveLength(0)
    expect(warnings.filter(w => w.includes('--color-text-secondary'))).toHaveLength(0)
  })

  it('flags misplaced property prefix tokens ONLY inside component blocks', () => {
    // This tests that the validator correctly identifies violations only
    // within component blocks (marked with /* ComponentName — generated YYYY-MM-DD */),
    // not in generic :root semantic token sections.
    const css = `
      /* TreeItem — generated 2026-03-16 */
      :root,
      [data-theme="dark"] {
        --tree-item-icon-color: var(--color-text-secondary);
        --size-icon-sm: 1rem;
      }
    `
    const warnings = validateTokenNamingConvention(css)
    // --tree-item-icon-color is inside component block with correct naming: component-first
    expect(warnings.filter(w => w.includes('--tree-item-icon-color'))).toHaveLength(0)
    // --size-icon-sm is inside a component block but has legitimate semantic-like naming
    // It should still be flagged if it matches the heuristic (property-first + size scale)
    expect(warnings.some(w => w.includes('--size-icon-sm'))).toBe(true)
  })
})

describe('TreeItem token reference (test for issue)', () => {
  it('passes when all TreeItem token references exist in CSS', () => {
    // This tests that TreeItem.tsx:187 uses --tree-item-icon-color-disabled
    const css = `
      :root {
        --tree-item-icon-color: var(--color-text-secondary);
        --tree-item-icon-color-selected: var(--color-action-primary);
        --tree-item-icon-color-disabled: var(--color-text-disabled);
      }
    `
    const componentCode = `
      isSelected
        ? 'text-[var(--tree-item-icon-color-selected)]'
        : isDisabled
        ? 'text-[var(--tree-item-icon-color-disabled)]'
        : 'text-[var(--tree-item-icon-color)]'
    `
    const { broken } = validateComponentTokenRefs(css, [
      { filePath: 'TreeItem.tsx', content: componentCode }
    ])
    expect(broken).toHaveLength(0)
  })

  it('catches when TreeItem references missing --tree-item-icon-color-disabled', () => {
    // This tests that we catch the bug when TreeItem uses wrong token
    const css = `
      :root {
        --tree-item-icon-color: var(--color-text-secondary);
        --tree-item-icon-color-selected: var(--color-action-primary);
        /* --tree-item-icon-color-disabled is missing */
      }
    `
    const componentCode = `
      isSelected
        ? 'text-[var(--tree-item-icon-color-selected)]'
        : isDisabled
        ? 'text-[var(--tree-item-icon-color-disabled)]'
        : 'text-[var(--tree-item-icon-color)]'
    `
    const { broken } = validateComponentTokenRefs(css, [
      { filePath: 'TreeItem.tsx', content: componentCode }
    ])
    expect(broken).toHaveLength(1)
    expect(broken[0].name).toBe('tree-item-icon-color-disabled')
  })
})
