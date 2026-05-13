/**
 * Geeklego security utilities.
 *
 * Pure functions — no DOM dependency, no side effects.
 * Safe to use in SSR environments (no window/document access).
 *
 * Component import pattern (use relative path, not the barrel):
 *   import { sanitizeHref, getSafeExternalLinkProps } from '../../utils/security/sanitize';
 */

import type { SafeExternalLinkProps } from './sanitize.types';

/**
 * Protocols disallowed in href attributes.
 * Lowercased — the href is normalised before comparison.
 */
const UNSAFE_PROTOCOLS: readonly string[] = [
  'javascript:',
  'vbscript:',
  'data:text/html',
];

/**
 * Strips unsafe URI protocols from an href value.
 *
 * Returns '#' when:
 * - The trimmed href starts with a blocked protocol (case-insensitive, whitespace-tolerant)
 * - The value is undefined or empty
 *
 * Returns the original value unchanged when:
 * - It is a fragment:      '#section-id'
 * - It is a relative path: '/page', './page', '../page'
 * - It is an HTTP(S) URL:  'https://example.com'
 * - It is a mailto/tel:    'mailto:hi@ex.com', 'tel:+1234'
 *
 * @example
 * sanitizeHref('javascript:alert(1)')  // → '#'
 * sanitizeHref('JavaScript:alert(1)') // → '#'   (case-insensitive)
 * sanitizeHref(' javascript:alert(1)')// → '#'   (leading whitespace)
 * sanitizeHref('https://example.com') // → 'https://example.com'
 * sanitizeHref('#section')            // → '#section'
 * sanitizeHref(undefined)             // → '#'
 *
 * @pure — no DOM, no side effects, runs in SSR
 */
export function sanitizeHref(href: string | undefined): string {
  if (!href || href.trim() === '') return '#';

  // Normalise: strip all whitespace and lowercase for protocol comparison.
  // This catches attacks like "  JavaScript:" or "j a v a s c r i p t:".
  const normalized = href.trim().toLowerCase().replace(/\s/g, '');

  for (const protocol of UNSAFE_PROTOCOLS) {
    if (normalized.startsWith(protocol)) return '#';
  }

  return href;
}

/**
 * Returns safe anchor props, automatically adding rel="noopener noreferrer"
 * when target="_blank". Always sanitizes href via sanitizeHref.
 *
 * Consumer-supplied rel values are preserved and de-duplicated against
 * the mandatory safety directives.
 *
 * @example
 * getSafeExternalLinkProps('https://example.com', '_blank')
 * // → { href: 'https://example.com', target: '_blank', rel: 'noopener noreferrer' }
 *
 * getSafeExternalLinkProps('/about')
 * // → { href: '/about' }
 *
 * getSafeExternalLinkProps('https://example.com', '_blank', 'sponsored')
 * // → { href: 'https://example.com', target: '_blank', rel: 'noopener noreferrer sponsored' }
 *
 * @pure — no DOM, no side effects, runs in SSR
 */
export function getSafeExternalLinkProps(
  href: string | undefined,
  target?: string,
  rel?: string,
): SafeExternalLinkProps {
  const safeHref = sanitizeHref(href);

  if (target === '_blank') {
    // Merge consumer rel parts, removing any pre-existing noopener/noreferrer
    // so we don't emit duplicates like "noopener noreferrer noopener".
    const consumerParts = rel
      ? rel
          .split(/\s+/)
          .filter((part) => part !== 'noopener' && part !== 'noreferrer')
      : [];

    return {
      href: safeHref,
      target: '_blank',
      rel: ['noopener', 'noreferrer', ...consumerParts].join(' '),
    };
  }

  const result: SafeExternalLinkProps = { href: safeHref };
  if (target !== undefined) result.target = target;
  if (rel !== undefined) result.rel = rel;
  return result;
}
