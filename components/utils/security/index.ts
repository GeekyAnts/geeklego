/**
 * Public API for Geeklego security utilities.
 *
 * Components import helpers via direct relative path (not this barrel)
 * to avoid potential circular dependency risks:
 *   import { sanitizeHref } from '../../utils/security/sanitize';
 *
 * This barrel exists for external consumers who want to use these
 * utilities in their own application code.
 */

export { sanitizeHref, getSafeExternalLinkProps } from './sanitize';
export type { SafeExternalLinkProps, UnsafeProtocol } from './sanitize.types';
