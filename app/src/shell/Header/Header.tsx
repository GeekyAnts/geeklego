import { EdButton } from '../../editor-ds/primitives'
import './Header.css'

interface HeaderProps {
  pendingCount: number
  suggestionCount: number
  onOpenCommandPalette: () => void
  onOpenExport: () => void
  onOpenPending: () => void
  onOpenSuggestions: () => void
}

export function Header({
  pendingCount,
  suggestionCount,
  onOpenCommandPalette,
  onOpenExport,
  onOpenPending,
  onOpenSuggestions,
}: HeaderProps) {
  return (
    <header className="ed-header" role="banner">
      <div className="ed-header__logo">
        <img
          src="/geeklego-logo.svg"
          alt="Geeklego"
          className="ed-header__logo-icon"
        />
        <span className="ed-header__logo-text">Geeklego</span>
      </div>

      <button
        type="button"
        className="ed-header__search-trigger"
        onClick={onOpenCommandPalette}
        aria-label="Search tokens"
      >
        <span>Search tokens...</span>
        <kbd>⌘K</kbd>
      </button>

      <div className="ed-header__spacer" />

      <div className="ed-header__actions">
        {suggestionCount > 0 && (
          <button
            type="button"
            className="ed-header__suggest-badge"
            aria-label={`${suggestionCount} available suggestions — click to review`}
            onClick={onOpenSuggestions}
            title="Review available auto-pick suggestions"
          >
            <span className="ed-header__pending-label">Suggestions</span>
            <span className="ed-header__pending-count">{suggestionCount}</span>
          </button>
        )}

        {pendingCount > 0 && (
          <button
            type="button"
            className="ed-header__pending-badge"
            aria-label={`${pendingCount} pending changes — click to review`}
            onClick={onOpenPending}
            title="Review pending changes"
          >
            <span className="ed-header__pending-label">Changes</span>
            <span className="ed-header__pending-count">{pendingCount}</span>
          </button>
        )}


        <EdButton
          variant="primary"
          size="md"
          onClick={onOpenExport}
        >
          Export...
        </EdButton>
      </div>
    </header>
  )
}
