import type { ValidatorResult } from './types'
import type { GeeklegoTokensV2 } from '../types'

interface DefaultTokenSnapshot {
  tokens: Map<string, string>
  loadedAt: number
}

const STORAGE_KEY = 'geeklego.editor.default.snapshot.v1'

// Typography keys follow Tailwind namespaces, not a plain camelCase→kebab conversion.
const PREFIX_OVERRIDES: Record<string, string> = {
  fontSize: 'text', lineHeight: 'leading', letterSpacing: 'tracking', fontFamily: 'font',
}
function cssPrefixForKey(key: string): string {
  return PREFIX_OVERRIDES[key] ?? key.replace(/([A-Z])/g, '-$1').toLowerCase()
}

function loadDefaultSnapshot(): DefaultTokenSnapshot | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      const tokens = new Map<string, string>()
      for (const [k, v] of Object.entries(parsed.tokens || {})) {
        if (typeof k === 'string' && typeof v === 'string') {
          tokens.set(k, v)
        }
      }
      return { tokens, loadedAt: parsed.loadedAt || Date.now() }
    }
  } catch {
    // Ignore errors
  }
  return null
}

export function saveDefaultSnapshot(tokens: GeeklegoTokensV2): void {
  const tokenMap = new Map<string, string>()

  for (const [family, shades] of Object.entries(tokens.primitives.colors)) {
    if (typeof shades === 'object' && shades !== null && !Array.isArray(shades)) {
      for (const [shade, shadeValue] of Object.entries(shades)) {
        tokenMap.set(`--color-${family}-${shade}`, shadeValue)
      }
    }
  }

  const primitiveKeys = [
    'fontSize', 'fontFamily', 'lineHeight', 'letterSpacing', 'fontWeight',
    'spacing', 'radius', 'borderWidth', 'duration',
    'easing', 'lineClamp', 'colorShadowNeutral',
    'breakpoints'
  ] as const

  for (const key of primitiveKeys) {
    const data = tokens.primitives[key]
    if (data && typeof data === 'object') {
      for (const k of Object.keys(data)) {
        const value = (data as Record<string, string>)[k]
        if (value) {
          tokenMap.set(`--${cssPrefixForKey(key)}-${k}`, value)
        }
      }
    }
  }

  // v2 flat semantics: each key maps to the CSS variable `--<key>`.
  for (const [k, v] of Object.entries(tokens.semantics.light)) {
    tokenMap.set(`--${k}`, v)
  }

  try {
    const toStore = {
      tokens: Object.fromEntries(tokenMap),
      loadedAt: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
  } catch {
    // Ignore storage errors
  }
}

export function checkDrift(
  tokens: GeeklegoTokensV2,
  currentStaged: Map<string, string>
): ValidatorResult[] {
  const results: ValidatorResult[] = []

  const snapshot = loadDefaultSnapshot()
  if (!snapshot || snapshot.tokens.size === 0) {
    return results
  }

  let driftedCount = 0

  snapshot.tokens.forEach((originalValue, tokenName) => {
    const currentValue = currentStaged.get(tokenName)

    if (originalValue && currentValue && originalValue !== currentValue) {
      driftedCount++
    }
  })

  if (driftedCount > 0) {
    results.push({
      tokenName: '(global)',
      severity: 'notice',
      category: 'drift',
      message: `Drifted from default by ${driftedCount} token${driftedCount > 1 ? 's' : ''}`,
      details: `${driftedCount} tokens have staged changes from default snapshot`,
    })
  }

  return results
}

