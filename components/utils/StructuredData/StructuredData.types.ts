export interface StructuredDataProps {
  /** JSON-LD structured data object. Must include @context and @type. */
  data: Record<string, unknown>;
}
