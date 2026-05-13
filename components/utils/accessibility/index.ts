/**
 * Accessibility utilities for Geeklego components.
 *
 * Provides shared ARIA types and pure helper functions for common
 * accessibility patterns: disclosure, navigation, live regions,
 * loading/disabled states, error fields, and icon roles.
 *
 * @example
 * import { getDisclosureProps, getLoadingProps } from '../../utils/accessibility'
 */

// Types
export type {
  AriaDisclosureTriggerProps,
  AriaDisclosurePanelProps,
  AriaNavigationItemProps,
  AriaLiveRegionProps,
  AriaLoadingProps,
  AriaDisabledProps,
  AriaErrorFieldProps,
  AriaDecorativeIconProps,
  AriaMeaningfulIconProps,
  AriaIconProps,
} from './aria-types'

// Helpers
export {
  getDisclosureProps,
  getNavigationItemProps,
  getLiveRegionProps,
  getLoadingProps,
  getDisabledProps,
  getErrorFieldProps,
  getIconProps,
} from './aria-helpers'
