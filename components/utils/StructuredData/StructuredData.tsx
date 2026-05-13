"use client"
import { useEffect, useRef } from 'react';
import type { StructuredDataProps } from './StructuredData.types';

/**
 * Injects a JSON-LD `<script type="application/ld+json">` into `document.head`.
 * Removes the script on unmount. Renders nothing visible (returns `null`).
 *
 * Use at the template/page level for Schema.org types that don't map to a
 * single component's DOM (e.g., WebPage, WebApplication, FAQPage).
 *
 * @example
 * <StructuredData data={{
 *   '@context': 'https://schema.org',
 *   '@type': 'WebPage',
 *   name: 'Dashboard',
 *   description: 'Application dashboard',
 * }} />
 */
export function StructuredData({ data }: StructuredDataProps) {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, [data]);

  return null;
}
