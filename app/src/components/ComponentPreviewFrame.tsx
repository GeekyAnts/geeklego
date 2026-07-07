import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { componentToStoryId, getStoryUrl, getAvailableStories, STORYBOOK_ORIGIN } from '../utils/storybook'

interface ComponentPreviewFrameProps {
  componentName: string
  level: string
  storyName: string
  theme: 'light' | 'dark'
  density: 'compact' | 'comfortable' | 'spacious'
  direction: 'ltr' | 'rtl'
  stagedTokens: Map<string, string>
  /** Defer mounting the iframe until the card scrolls near view (gallery use). */
  lazy?: boolean
}

// Build the override CSS for the active theme. `tokens` is the staged-edits Map,
// whose keys may be either `--foo` (light/base) or `dark:--foo` (dark override).
// We resolve to the theme being previewed and emit a single rule that mirrors the
// theme selectors so it wins over themes/dark.css (same specificity, later in
// <head>). Emitting only the active theme avoids forcing a light value onto dark.
function buildTokenOverrideCss(tokens: Map<string, string>, theme: 'light' | 'dark'): string {
  if (tokens.size === 0) return ''
  const resolved = new Map<string, string>()
  for (const [key, value] of tokens) {
    const isDark = key.startsWith('dark:')
    const bare = isDark ? key.slice('dark:'.length) : key
    if (!bare.startsWith('--')) continue // skip non-CSS staging keys (e.g. font loaders)
    // For the active theme, prefer the theme-specific edit over the base edit.
    if (theme === 'dark' ? isDark : !isDark) resolved.set(bare, value)
    else if (!resolved.has(bare)) resolved.set(bare, value)
  }
  if (resolved.size === 0) return ''
  const decls = [...resolved].map(([k, v]) => `  ${k}: ${v};`).join('\n')
  const selector = theme === 'dark' ? ':root,\n[data-theme="dark"],\n.dark' : ':root'
  return `${selector} {\n${decls}\n}`
}

function ComponentPreviewFrame({
  componentName,
  level,
  storyName,
  theme,
  density,
  direction,
  stagedTokens,
  lazy = false,
}: ComponentPreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  // When lazy, the iframe isn't mounted until the card scrolls near the viewport
  // — critical for the gallery, which renders ~50 frames at once. Once visible we
  // keep it mounted (don't unmount on scroll-away) to avoid reload churn.
  const [isVisible, setIsVisible] = useState(!lazy)

  const availableStories = useMemo(() => getAvailableStories(componentName), [componentName])
  const hasPreview = availableStories.length > 0

  const storyUrl = useMemo(() => {
    if (!hasPreview) return null
    return getStoryUrl(componentToStoryId(componentName, level, storyName))
  }, [componentName, level, storyName, hasPreview])

  // Lazy-mount: observe the container and flip `isVisible` once it nears view.
  // A generous rootMargin pre-loads just-off-screen cards so horizontal scroll
  // feels seamless. Disconnect after first reveal — mount is one-way.
  useEffect(() => {
    if (!lazy || isVisible) return
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { root: null, rootMargin: '300px', threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [lazy, isVisible])

  // Probe Storybook on mount and component changes.
  // An iframe pointed at a refused port fires onLoad (not onError) with the
  // browser's own error page, so we can't rely on iframe events alone.
  // fetch() to a refused port throws a TypeError ("Failed to fetch") regardless
  // of CORS mode, so we use that to detect offline state up-front.
  useEffect(() => {
    if (!hasPreview || !isVisible) return
    const controller = new AbortController()
    setIsLoaded(false)
    setIsError(false)
    fetch(`${STORYBOOK_ORIGIN}/`, { method: 'HEAD', mode: 'no-cors', signal: controller.signal })
      .then(() => { /* server is up — let the iframe load normally */ })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name !== 'AbortError') {
          setIsError(true)
        }
      })
    return () => controller.abort()
    // Re-probe when the component changes so switching away and back re-checks.
  }, [componentName, hasPreview, isVisible])

  // Reset load state when the story URL changes (story tab switch)
  useEffect(() => {
    setIsLoaded(false)
  }, [storyUrl])

  const handleLoad = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe?.contentWindow) return
    setIsLoaded(true)
    iframe.contentWindow.postMessage(
      { type: 'GEEKLEGO_ATTRIBUTES', theme, density, direction },
      STORYBOOK_ORIGIN
    )
    const css = buildTokenOverrideCss(stagedTokens, theme)
    if (css) {
      iframe.contentWindow.postMessage(
        { type: 'GEEKLEGO_TOKEN_OVERRIDES', css },
        STORYBOOK_ORIGIN
      )
    }
  }, [theme, density, direction, stagedTokens])

  // Re-send attributes when theme/density/direction change after load
  useEffect(() => {
    if (!isLoaded || !iframeRef.current?.contentWindow) return
    iframeRef.current.contentWindow.postMessage(
      { type: 'GEEKLEGO_ATTRIBUTES', theme, density, direction },
      STORYBOOK_ORIGIN
    )
  }, [theme, density, direction, isLoaded])

  // Re-inject staged token overrides whenever they (or the theme) change
  useEffect(() => {
    if (!isLoaded || !iframeRef.current?.contentWindow) return
    iframeRef.current.contentWindow.postMessage(
      { type: 'GEEKLEGO_TOKEN_OVERRIDES', css: buildTokenOverrideCss(stagedTokens, theme) },
      STORYBOOK_ORIGIN
    )
  }, [stagedTokens, isLoaded, theme])

  if (!hasPreview) {
    return (
      <div className="ed-component-preview-no-story">
        <p>No Storybook preview available for <strong>{componentName}</strong>.</p>
      </div>
    )
  }

  return (
    <div className="ed-component-preview-frame" ref={containerRef}>
      {!isVisible && (
        <div className="ed-component-preview-frame-loading" aria-hidden="true">
          {componentName}
        </div>
      )}
      {isVisible && isError && (
        <div className="ed-component-preview-offline">
          <p><strong>Component preview unavailable</strong></p>
          <p>Start Storybook to see live previews:</p>
          <code>npm run storybook</code>
          <a
            href={STORYBOOK_ORIGIN}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Storybook ↗
          </a>
        </div>
      )}
      {isVisible && !isLoaded && !isError && (
        <div className="ed-component-preview-frame-loading" aria-live="polite" aria-busy="true">
          Loading preview…
        </div>
      )}
      {isVisible && !isError && (
        <iframe
          ref={iframeRef}
          key={storyUrl}
          src={storyUrl ?? undefined}
          title={`${componentName} – ${storyName} story`}
          role="region"
          aria-label={`${componentName} component preview`}
          sandbox="allow-same-origin allow-scripts"
          onLoad={handleLoad}
          onError={() => setIsError(true)}
          style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.15s ease' }}
        />
      )}
    </div>
  )
}

export { ComponentPreviewFrame }
