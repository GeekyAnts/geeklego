/**
 * Pure helper functions that return correct ARIA attribute objects.
 *
 * These are stateless — no hooks, no side effects. They compute the correct
 * ARIA props for common patterns so components don't hand-roll them.
 */

import React from 'react'
import type {
  AriaDisclosureTriggerProps,
  AriaDisclosurePanelProps,
  AriaNavigationItemProps,
  AriaLiveRegionProps,
  AriaLoadingProps,
  AriaDisabledProps,
  AriaErrorFieldProps,
  AriaIconProps,
} from './aria-types'

// ── React element detection ───────────────────────────────────────────────

/**
 * Returns true if `node` is — or structurally resembles — a React element.
 *
 * Extends `React.isValidElement` to cover RSC-serialized elements: when JSX
 * is created server-side and transported across the RSC wire boundary as a
 * non-`children` prop, the reconstructed object may lose its `$$typeof`
 * symbol, causing `React.isValidElement` to return `false` even though the
 * value is a structurally valid `{ type, props }` element object.
 *
 * Use this wherever a component accepts a trigger/children prop and branches
 * on `React.isValidElement` to inject props via `cloneElement`.
 */
export function isElementLike(node: React.ReactNode): node is React.ReactElement {
  if (React.isValidElement(node)) return true
  return (
    typeof node === 'object' &&
    node !== null &&
    !Array.isArray(node) &&
    'type' in node &&
    'props' in node
  )
}

// ── Disclosure pattern ────────────────────────────────────────────────────

/**
 * Returns ARIA props for a disclosure trigger + panel pair.
 *
 * @example
 * const [triggerProps, panelProps] = getDisclosureProps(isOpen, panelId)
 * <button {...triggerProps}>Toggle</button>
 * <div {...panelProps}>Content</div>
 */
export function getDisclosureProps(
  isExpanded: boolean,
  panelId: string,
): [AriaDisclosureTriggerProps, AriaDisclosurePanelProps] {
  return [
    { 'aria-expanded': isExpanded, 'aria-controls': panelId },
    { id: panelId, role: 'region' },
  ]
}

// ── Navigation ────────────────────────────────────────────────────────────

/**
 * Returns ARIA props for a navigation item.
 *
 * @example
 * <a {...getNavigationItemProps({ isActive: true })}>Dashboard</a>
 */
export function getNavigationItemProps(options: {
  isActive?: boolean
  disabled?: boolean
}): AriaNavigationItemProps {
  const props: AriaNavigationItemProps = {}
  if (options.isActive) props['aria-current'] = 'page'
  if (options.disabled) {
    props['aria-disabled'] = true
    props.tabIndex = -1
  }
  return props
}

// ── Live regions ──────────────────────────────────────────────────────────

/**
 * Returns ARIA props for a live region.
 *
 * @param type - 'polite' for non-urgent updates, 'assertive' for critical alerts, 'status' for status bars
 *
 * @example
 * <div {...getLiveRegionProps('polite')}>3 results found</div>
 */
export function getLiveRegionProps(
  type: 'polite' | 'assertive' | 'status',
): AriaLiveRegionProps {
  switch (type) {
    case 'assertive':
      return { 'aria-live': 'assertive', 'aria-atomic': true, role: 'alert' }
    case 'status':
      return { 'aria-live': 'polite', 'aria-atomic': true, role: 'status' }
    case 'polite':
    default:
      return { 'aria-live': 'polite', 'aria-atomic': true }
  }
}

// ── Interactive states ────────────────────────────────────────────────────

/**
 * Returns `{ 'aria-busy': true }` when loading, empty object when not.
 *
 * @example
 * <button {...getLoadingProps(isLoading)}>Save</button>
 */
export function getLoadingProps(
  isLoading: boolean,
): AriaLoadingProps | Record<string, never> {
  return isLoading ? { 'aria-busy': true } : {}
}

/**
 * Returns disabled + aria-disabled when disabled, empty object when not.
 *
 * @example
 * <button {...getDisabledProps(isDisabled)}>Submit</button>
 */
export function getDisabledProps(
  isDisabled: boolean,
): AriaDisabledProps | Record<string, never> {
  return isDisabled ? { 'aria-disabled': true, disabled: true } : {}
}

/**
 * Returns error field ARIA props when in error state.
 *
 * @param hasError - whether the field has a validation error
 * @param errorId - the id of the error message element
 *
 * @example
 * <input {...getErrorFieldProps(hasError, errorId)} />
 * <span id={errorId}>This field is required</span>
 */
export function getErrorFieldProps(
  hasError: boolean,
  errorId: string,
): AriaErrorFieldProps | Record<string, never> {
  return hasError
    ? { 'aria-invalid': 'true' as const, 'aria-describedby': errorId }
    : {}
}

// ── Icons ─────────────────────────────────────────────────────────────────

/**
 * Returns correct ARIA props for an icon wrapper.
 *
 * Decorative icons (alongside visible text) get `aria-hidden="true"`.
 * Meaningful icons (sole content of a control) get `role="img"` + `aria-label`.
 *
 * @example
 * // Decorative (next to text label)
 * <span {...getIconProps(true)}><SearchIcon /></span> Search
 *
 * // Meaningful (icon-only button — label goes on the button, not the icon)
 * <button aria-label="Search"><span {...getIconProps(true)}><SearchIcon /></span></button>
 */
export function getIconProps(isDecorative: true): { 'aria-hidden': true }
export function getIconProps(
  isDecorative: false,
  label: string,
): { role: 'img'; 'aria-label': string }
export function getIconProps(
  isDecorative: boolean,
  label?: string,
): AriaIconProps {
  if (isDecorative) {
    return { 'aria-hidden': true }
  }
  return { role: 'img', 'aria-label': label! }
}
