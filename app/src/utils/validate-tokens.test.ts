import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { validateCssTokens } from '../../../scripts/validate-tokens'

const __dirname = dirname(fileURLToPath(import.meta.url))
const cssPath = resolve(__dirname, '../../../design-system/geeklego.css')
const css = readFileSync(cssPath, 'utf-8')

describe('validateCssTokens — ProgressIndicator disabled-state tokens', () => {
  it('defines --progress-indicator-track-disabled', () => {
    expect(css).toMatch(/--progress-indicator-track-disabled\s*:/)
  })

  it('defines --progress-indicator-label-color-disabled', () => {
    expect(css).toMatch(/--progress-indicator-label-color-disabled\s*:/)
  })

  it('has no broken var() references in geeklego.css', () => {
    const { broken } = validateCssTokens(css)
    expect(broken).toHaveLength(0)
  })
})
