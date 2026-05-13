/**
 * Shared ARIA pattern types for Geeklego components.
 *
 * These interfaces enforce correct ARIA attribute combinations at the
 * TypeScript level. Components import the relevant type and spread the
 * result of a helper function onto their elements.
 */

// ── Disclosure pattern (accordion, dropdown, expandable nav) ──────────────

/** Props for the trigger element of a disclosure (button that toggles a panel). */
export interface AriaDisclosureTriggerProps {
  'aria-expanded': boolean
  'aria-controls': string
}

/** Props for the panel element of a disclosure (the revealed content). */
export interface AriaDisclosurePanelProps {
  id: string
  role: 'region'
}

// ── Navigation ────────────────────────────────────────────────────────────

/** Props for a navigation item (link or button in a nav list). */
export interface AriaNavigationItemProps {
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true'
  'aria-disabled'?: true
  tabIndex?: 0 | -1
}

// ── Live regions ──────────────────────────────────────────────────────────

/** Props for a live region that announces dynamic content changes. */
export interface AriaLiveRegionProps {
  'aria-live': 'polite' | 'assertive' | 'off'
  'aria-atomic'?: boolean
  role?: 'status' | 'alert' | 'log'
}

// ── Interactive states ────────────────────────────────────────────────────

/** Props for a loading/busy element. */
export interface AriaLoadingProps {
  'aria-busy': true
}

/** Props for a disabled interactive element (both HTML + ARIA). */
export interface AriaDisabledProps {
  'aria-disabled': true
  disabled: true
}

/** Props for a form field in an error state. */
export interface AriaErrorFieldProps {
  'aria-invalid': 'true'
  'aria-describedby': string
}

// ── Icons ─────────────────────────────────────────────────────────────────

/** Props for a decorative icon (hidden from assistive tech). */
export interface AriaDecorativeIconProps {
  'aria-hidden': true
}

/** Props for a meaningful icon (provides its own label). */
export interface AriaMeaningfulIconProps {
  role: 'img'
  'aria-label': string
}

/** Union of decorative or meaningful icon props. */
export type AriaIconProps = AriaDecorativeIconProps | AriaMeaningfulIconProps
