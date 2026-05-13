const ruleName = 'geeklego/no-tier1-in-component-tokens';
const meta = { url: 'https://github.com/GeekyAnts/geeklego', fixable: false };

const TIER1_TIER2_PREFIXES = new Set([
  'color', 'spacing', 'font', 'line', 'letter', 'border', 'radius',
  'shadow', 'duration', 'ease', 'z', 'size', 'icon', 'content',
  'elevation', 'typography', 'ring', 'control', 'overlay', 'cursor', 'layer',
]);

function isComponentToken(prop) {
  if (!prop.startsWith('--')) return false;
  const firstSegment = prop.slice(2).split('-')[0];
  return !TIER1_TIER2_PREFIXES.has(firstSegment);
}

const TIER1_PATTERNS = [
  /var\(--color-neutral-\d/,
  /var\(--color-brand-\d/,
  /var\(--color-accent-\d/,
  /var\(--color-success-\d/,
  /var\(--color-warning-\d/,
  /var\(--color-error-\d/,
  /var\(--color-info-\d/,
  /var\(--color-shadow-/,
  /var\(--spacing-(?!component-|layout-|raw-)\d/,
  /var\(--font-size-\d/,
  /var\(--font-weight-/,
  /var\(--line-height-/,
  /var\(--letter-spacing-/,
  /var\(--radius-(?!component)/,
  /var\(--border-width-\d/,
  /var\(--duration-(?:instant|fast|normal|slow(?:er|est)?)\b/,
  /var\(--ease-(?:linear|in|out|in-out|spring)\b/,
  /var\(--z-/,
  /var\(--size-\d/,
  /var\(--icon-size-/,
];

function findTier1Reference(value) {
  for (const pattern of TIER1_PATTERNS) {
    const match = value.match(pattern);
    if (match) return match[0];
  }
  return null;
}

function rule(primaryOption) {
  return (root, result) => {
    if (!primaryOption) return;
    root.walkDecls((decl) => {
      const { prop, value } = decl;
      if (!prop.startsWith('--')) return;
      if (!isComponentToken(prop)) return;
      const offendingRef = findTier1Reference(value);
      if (!offendingRef) return;
      result.warn(
        `Component token "${prop}" references Tier 1 primitive directly. Use a Tier 2 semantic token instead.`,
        { node: decl, ruleName, severity: 'warning', word: offendingRef },
      );
    });
  };
}

rule.ruleName = ruleName;
rule.meta = meta;

export default { ruleName, rule, meta };
