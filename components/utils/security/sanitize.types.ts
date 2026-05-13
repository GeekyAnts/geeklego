/**
 * Types for Geeklego security utilities.
 *
 * All helpers are pure functions — no DOM dependency, runs in SSR.
 */

/**
 * Protocols considered unsafe for use in href attributes.
 * These are stripped and replaced with '#' by sanitizeHref.
 */
export type UnsafeProtocol = 'javascript:' | 'data:text/html' | 'vbscript:';

/**
 * Props returned by getSafeExternalLinkProps.
 * Always safe to spread onto an <a> element.
 */
export interface SafeExternalLinkProps {
  href: string;
  target?: string;
  rel?: string;
}
