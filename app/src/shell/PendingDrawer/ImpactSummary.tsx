import { useMemo } from 'react'
import type { TokenGraph } from '../../graph/build'
import type { GeeklegoTokensV2 } from '../../types'
import { EdChip } from '../../editor-ds/primitives'

interface ImpactSummaryProps {
  tokenName: string
  currentValue: string
  graph: TokenGraph | null
  tokens: GeeklegoTokensV2
  stagedValues: Map<string, string>
}

function countAffectedTokens(
  tokenName: string,
  graph: TokenGraph,
  _tokens: GeeklegoTokensV2,
  _currentStaged: Map<string, string>
): { semantic: number; component: number; instances: number } {
  const node = graph.nodes.get(tokenName)
  if (!node || node.dependents.length === 0) {
    return { semantic: 0, component: 0, instances: 0 }
  }

  let semanticCount = 0
  let componentCount = 0
  let instanceCount = 0

  const visited = new Set<string>()
  const queue = [...node.dependents]

  while (queue.length > 0) {
    const dep = queue.shift()
    if (!dep || visited.has(dep)) continue
    visited.add(dep)

    if (dep.startsWith('--color-') || dep.startsWith('--spacing-') || dep.startsWith('--radius-') ||
      dep.startsWith('--font-') || dep.startsWith('--border-') || dep.startsWith('--layer-') ||
      dep.startsWith('--typography-')) {
      semanticCount++
      instanceCount++

      const depNode = graph.nodes.get(dep)
      if (depNode) {
        queue.push(...depNode.dependents.filter((d: string) => !visited.has(d)))
      }
    } else if (dep.startsWith('--')) {
      componentCount++
      instanceCount++
    }
  }

  return {
    semantic: semanticCount,
    component: componentCount,
    instances: instanceCount,
  }
}

export function ImpactSummary({
  tokenName,
  currentValue: _currentValue,
  graph,
  tokens,
  stagedValues,
}: ImpactSummaryProps) {
  const impactInfo = useMemo(() => {
    if (!graph) return null
    return countAffectedTokens(tokenName, graph, tokens, stagedValues)
  }, [tokenName, graph, tokens, stagedValues])

  if (!impactInfo) {
    return null
  }

  const parts: string[] = []

  if (impactInfo.semantic > 0) {
    parts.push(`affects ${impactInfo.semantic} semantic ${impactInfo.semantic === 1 ? 'token' : 'tokens'}`)
  }

  if (impactInfo.component > 0) {
    parts.push(`${impactInfo.component} component ${impactInfo.component === 1 ? 'token' : 'tokens'}`)
  }

  if (impactInfo.instances > 0) {
    parts.push(`~${impactInfo.instances} instance${impactInfo.instances === 1 ? '' : 's'}`)
  }

  const message = parts.length > 0 ? parts.join(', ') : 'No other tokens affected'

  return (
    <div className="ed-impact-summary">
      <div className="ed-impact-summary__header">
        <h3 className="ed-impact-summary__title">Impact of Change</h3>
        <p className="ed-impact-summary__token">Token: <strong>{tokenName}</strong></p>
      </div>
      <div className="ed-impact-summary__body">
        <p className="ed-impact-summary__message">{message}</p>
        <div className="ed-impact-summary__stats">
          {impactInfo.semantic > 0 && (
            <EdChip variant="default">
              {impactInfo.semantic} semantic
            </EdChip>
          )}
          {impactInfo.component > 0 && (
            <EdChip variant="accent">
              {impactInfo.component} component
            </EdChip>
          )}
        </div>
      </div>
    </div>
  )
}
