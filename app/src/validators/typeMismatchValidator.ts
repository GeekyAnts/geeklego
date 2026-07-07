import type { TokenGraph } from '../graph/build'
import type { ValidatorResult } from './types'

const COLOR_PATTERN = /^#[0-9A-Fa-f]{3,8}$/
const HEXA_PATTERN = /^#[0-9A-Fa-f]{4,8}$/
const RGB_PATTERN = /^rgb\(/
const RGBA_PATTERN = /^rgba\(/
const HSL_PATTERN = /^hsl\(/
const HSLA_PATTERN = /^hsla\(/

function _isColorValue(value: string): boolean {
  if (!value) return false
  const trimmed = value.trim()
  return (
    COLOR_PATTERN.test(trimmed) ||
    HEXA_PATTERN.test(trimmed) ||
    RGB_PATTERN.test(trimmed) ||
    RGBA_PATTERN.test(trimmed) ||
    HSL_PATTERN.test(trimmed) ||
    HSLA_PATTERN.test(trimmed)
  )
}

function isSpacingValue(value: string): boolean {
  if (!value) return false
  return /^\d+(\.\d+)?px$/.test(value.trim()) ||
    /^\d+(\.\d+)?rem$/.test(value.trim()) ||
    /^\d+(\.\d+)?em$/.test(value.trim())
}

function _isRadiusValue(value: string): boolean {
  if (!value) return false
  return isSpacingValue(value) ||
    /^(\d+%|auto)$/.test(value.trim())
}

function getTokenType(tokenName: string): 'color' | 'spacing' | 'radius' | 'unknown' | null {
  if (tokenName.startsWith('--color-')) {
    return 'color'
  }
  if (tokenName.startsWith('--spacing-')) {
    return 'spacing'
  }
  if (tokenName.startsWith('--radius-') ||
    tokenName.startsWith('--size-component-')) {
    return 'radius'
  }
  if (tokenName.startsWith('--border-') ||
    tokenName.startsWith('--radius-component-') ||
    tokenName.startsWith('--border-width-')) {
    return 'radius'
  }
  return null
}

export function checkTypeMismatches(
  tokenName: string,
  value: string,
  graph: TokenGraph
): ValidatorResult[] {
  const results: ValidatorResult[] = []

  const selfType = getTokenType(tokenName)
  if (!selfType) {
    return results
  }

  if (!value.includes('var(')) {
    return results
  }

  const node = graph.nodes.get(tokenName)
  if (!node || node.dependsOn.length === 0) {
    return results
  }

  const targetName = node.dependsOn[0]
  const targetType = getTokenType(targetName)

  if (targetType && selfType !== targetType && targetType !== 'unknown') {
    results.push({
      tokenName,
      severity: 'warn',
      category: 'type-mismatch',
      message: `Type mismatch: ${tokenName} aliasing ${targetName}`,
      details: `${selfType} token cannot alias ${targetType} token`,
    })
  }

  return results
}
