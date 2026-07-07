import { useMemo } from 'react'
import { useRouter } from '../../routing'
import { CategoryPage } from '../../views'
import { PreviewBand } from '../PreviewBand/PreviewBand'
import type { GeeklegoTokensV2 } from '../../types'
import type { RoutePath } from '../../routing'
import { flattenTokens } from '../../utils/flattenTokens'
import './ContextPane.css'

interface ContextPaneProps {
  tokens: GeeklegoTokensV2
  onSelectToken: (tokenName: string) => void
}


function HomePage({ onNavigate }: { onNavigate: (route: RoutePath) => void }) {
  return (
    <div className="ed-context-pane__home">
      <h1 className="ed-context-pane__home-title">Token Editor</h1>
      <p className="ed-context-pane__home-subtitle">
        Select a category to start editing design tokens
      </p>
      <div className="ed-context-pane__tiles">
        <button
          type="button"
          className="ed-context-pane__tile"
          onClick={() => onNavigate({ type: 'foundations', category: 'color' })}
        >
          <span className="ed-context-pane__tile-title">Foundations</span>
          <p className="ed-context-pane__tile-desc">Color, spacing, typography, shadows, motion</p>
        </button>
        <button
          type="button"
          className="ed-context-pane__tile"
          onClick={() => onNavigate({ type: 'semantic', category: 'surface' })}
        >
          <span className="ed-context-pane__tile-title">Semantic</span>
          <p className="ed-context-pane__tile-desc">Surface, content, interactive, status, layout</p>
        </button>
      </div>
    </div>
  )
}

function TokenFocusView({ tokenName }: { tokenName: string }) {
  return (
    <div className="ed-context-pane__token-focus">
      <h2>{tokenName}</h2>
      <p>Select this token in the navigation or editor to view and edit its value in the Inspector panel on the right.</p>
    </div>
  )
}

export function ContextPane({ tokens, onSelectToken }: ContextPaneProps) {
  const { route, navigate } = useRouter()

  const allTokenEntries = useMemo(() => flattenTokens(tokens), [tokens])

  const handleTokenClick = (token: { name: string; value: string }) => {
    onSelectToken(token.name)
  }

  // The active module rendered BELOW the persistent preview band.
  let body: React.ReactNode
  switch (route.type) {
    case 'foundations':
    case 'semantic':
      body = (
        <CategoryPage
          category={route.category}
          tokens={allTokenEntries}
          geeklegoTokens={tokens}
          onTokenClick={handleTokenClick}
        />
      )
      break
    case 'token':
      body = <TokenFocusView tokenName={route.tokenName} />
      break
    case 'home':
    default:
      body = <HomePage onNavigate={navigate} />
      break
  }

  // The preview band is docked at the top on every module; the module body
  // scrolls independently below it.
  return (
    <main className="ed-context-pane">
      <PreviewBand />
      <div className="ed-context-pane__body">{body}</div>
    </main>
  )
}
