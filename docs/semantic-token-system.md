# Semantic Token System Guide

Geeklego's design system uses a strict 3-tier hierarchy that ensures consistency, scalability, and maintainability across all components. This guide explains how to work with the semantic token system effectively.

## Overview

The token system flows from raw values to semantic intent to specific component implementation:

```
TIER 1: Primitives
├── Raw CSS custom properties (colors, spacing, typography)
├── Direct value assignments (--color-neutral-500, --spacing-4)
└── Used exclusively by Tier 2 tokens

TIER 2: Semantics  
├── Intent-driven aliases (--color-bg-primary, --color-action-primary)
├── Context-based naming (--text-body-md, --radius-component-md)
└── Base for all token hierarchy

TIER 3: Components
├── Component tokens (--button-primary-bg, --input-error-border)
├── Component-specific patterns (--card-header-title)
└── Directly referenced in React components
```

## Tier 1: Primitives

Primitives define the raw scales and values. They're simple, clean, and never contain semantic intent.

### Color Primitives

Color primitives follow a 7-palette system with 10 shades each:

```css
/* Neutral Palette (cool gray with slight blue undertone) */
--color-neutral-0:   #ffffff;
--color-neutral-50:  #f5f6f8;
--color-neutral-100: #ebebef;
/* ... through 900 */

/* Brand Scale (Zinc for black primary) */
--color-brand-50:   #fafafa;
--color-brand-100:  #f4f4f5;
/* ... through 950 */

/* Semantic Palettes */
--color-accent-*:  Orange scale for highlights
--color-success-*: Green for success states
--color-warning-*: Yellow for warnings
--color-error-*:   Red for errors  
--color-info-*:    Blue for info
```

### Spacing Primitives

```css
/* Gap-based spacing (component internal) */
--spacing-0: 0rem;
--spacing-1: 0.25rem;
--spacing-2: 0.5rem;
/* ... through spacing-12 (3rem) */

/* Layout spacing (component gaps - responsive) */
--spacing-layout-1:  0.25rem;   /* Always 0.25rem */
--spacing-layout-2:  0.5rem;    /* Always 0.5rem */
/* ... through spacing-layout-12 (3rem) */
```

**Key Rule**: Component spacing never changes with viewport. Layout spacing can be responsive.

### Typography Primitives

```css
/* Sizes */
--font-size-10: 0.625rem;  /* 10px */
--font-size-11: 0.6875rem; /* 11px */
/* ... through font-size-96 (6rem) */

/* Weights */
--font-weight-thin:    100;
--font-weight-light:   300;
/* ... through font-weight-extrabold: 800 */

/* Line Heights (rem values) */
--line-height-none:    1rem;
--line-height-tight:   1.25rem;
/* ... through line-height-5xl: 4.5rem */
```

### Size Primitives

```css
/* Component Heights */
--size-button-xs: 24px;
--size-button-sm: 28px;
/* ... through size-button-xl: 56px */

/* Icon Sizes */
--size-icon-xs: 12px;
--size-icon-sm: 16px;
/* ... through size-icon-2xl: 48px */

/* Avatar Sizes */
--size-avatar-xs: 20px;
/* ... through size-avatar-2xl: 80px */
```

### Radius & Motion Primitives

```css
/* Radius */
--radius-none:   0px;
--radius-sm:     4px;
--radius-md:     6px;
--radius-lg:     8px;
--radius-xl:     12px;
--radius-2xl:    16px;
--radius-full:   9999px;

/* Motion - Keyframe names only */
--ease-default:         cubic-bezier(0.4, 0, 0.2, 1);
--ease-emphasis:        cubic-bezier(0.05, 0.7, 0.1, 1);
--ease-spring:          cubic-bezier(0.175, 0.885, 0.32, 1.275);

/* Motion - Durations (ms) */
--duration-interaction: 150ms;
--duration-fast:        100ms;
--duration-normal:      200ms;
--duration-slow:        400ms;
```

## Tier 2: Semantics

Semantics put intent behind the raw values. They're purposeful and describe what the value does, not where it's used.

### Color Semantics

```css
:root {
  /* Background Colors */
  --color-bg-primary:      var(--color-neutral-0);
  --color-bg-secondary:    var(--color-neutral-50);
  --color-bg-tertiary:     var(--color-neutral-100);
  --color-bg-inverse:      var(--color-neutral-900);
  
  /* Surface Colors */
  --color-surface-default:  var(--color-neutral-0);
  --color-surface-raised:   var(--color-neutral-0);
  --color-surface-overlay:  var(--color-overlay-backdrop);
  
  /* Text Colors */
  --color-text-primary:    var(--color-neutral-900);
  --color-text-secondary:  var(--color-neutral-600);
  --color-text-tertiary:   var(--color-neutral-500);
  --color-text-disabled:   var(--color-neutral-400);
  --color-text-inverse:    var(--color-neutral-0);
  --color-text-accent:     var(--color-accent-600);
  
  /* Action Colors */
  --color-action-primary:      var(--color-brand-950);
  --color-action-secondary:    var(--color-neutral-100);
  --color-action-accent:       var(--color-accent-500);
  --color-action-destructive:  var(--color-error-500);
  --color-action-disabled:     var(--color-neutral-200);
  
  /* State Colors */
  --color-state-hover:    var(--color-brand-100);
  --color-state-pressed:  var(--color-brand-200);
  --color-state-selected: var(--color-brand-100);
  
  /* Status Colors */
  --color-status-success:   var(--color-success-500);
  --color-status-warning:   var(--color-warning-500);
  --color-status-error:     var(--color-error-500);
  --color-status-info:      var(--color-info-500);
}
```

### Border Semantic Tokens

```css
:root {
  /* Default borders */
  --color-border-default:      var(--color-neutral-200);
  --color-border-subtle:       var(--color-neutral-100);
  --color-border-strong:       var(--color-neutral-300);
  
  /* Focus states */
  --color-border-focus:         var(--color-brand-950);
  --color-border-focus-visible: var(--color-brand-950);
  
  /* Validation states */
  --color-border-success:       var(--color-success-500);
  --color-border-warning:       var(--color-warning-500);
  --color-border-error:         var(--color-error-500);
  
  /* Semantic border widths */
  --border-hairline: 1px;
  --border-thin:     1px;
  --border-sm:       1px;
  --border-md:       2px;
  --border-lg:       3px;
  
  /* Focus ring */
  --border-focus-ring: 2px solid var(--color-ring);
}
```

### Semantic Patterns

Notice how the naming always follows this pattern:
- `color-*` for colors
- `spacing-*` for spacing
- `text-*` for text properties
- `action-*` for interactive properties
- `state-*` for interactive states
- `status-*` for status indicators

## Tier 3: Components

Component tokens are built on the semantic layer and map directly to specific UI elements.

### Button Component Tokens

```css
/* Button sizing */
--button-height-xs:     var(--size-button-xs);
--button-height-sm:     var(--size-button-sm);
--button-height-md:     var(--size-button-md);
--button-height-lg:     var(--size-button-lg);
--button-height-xl:     var(--size-button-xl);

--button-px-xs:         var(--spacing-2);
--button-px-sm:         var(--spacing-3);
--button-px-md:         var(--spacing-4);
--button-px-lg:         var(--spacing-5);
--button-px-xl:         var(--spacing-6);
```

### Button Variant Tokens

```css
/* Primary variant */
--button-primary-bg:        var(--color-action-primary);
--button-primary-bg-hover:  var(--color-action-primary-hover);
--button-primary-bg-active: var(--color-action-primary-active);
--button-primary-text:      var(--color-text-on-primary);

/* Secondary variant */
--button-secondary-bg:        var(--color-action-secondary);
--button-secondary-bg-hover:  var(--color-action-secondary-hover);
--button-secondary-bg-active: var(--color-action-secondary-active);
--button-secondary-text:      var(--color-text-primary);
--button-secondary-border:    transparent;
--button-secondary-border-hover: var(--color-border-default);

/* Destructive variant */
--button-destructive-bg:        var(--color-action-destructive);
--button-destructive-bg-hover:  var(--color-action-destructive-hover);
--button-destructive-bg-active: var(--color-action-destructive-active);
--button-destructive-text:      var(--color-text-on-destructive);
```

## Theme System

The theme system uses CSS attribute selectors to override semantics:

```css
/* Dark mode overrides */
[data-theme="dark"] {
  --color-bg-primary:      var(--color-neutral-950);
  --color-text-primary:    var(--color-neutral-50);
  --color-action-primary:  var(--color-brand-50);
  
  /* Focus rings are less intense in dark mode */
  --color-ring:            var(--color-brand-300);
}

/* Brand theme overrides */
[data-theme="brand"] {
  --color-bg-primary:      var(--color-brand-950);
  --color-brand-primary-bg: var(--color-accent-500);
}
```

## Migration from Legacy Tokens

### Size Tokens

```css
/* Before (v2) */
--size-icon-xs: 0.75rem;
--size-icon-sm: 1rem;

/* After (v3) */
--icon-semantic-xs: var(--spacing-6);    /* 1.5rem→ but that was wrong */
--icon-semantic-sm: var(--spacing-8);    /* 2rem→ wrong again */

/* Correct approach */
:root {
  --size-icon-xs: var(--spacing-3);      /* 0.75rem */
  --size-icon-sm: var(--spacing-4);      /* 1rem */
}
```

### Important: Backward Compatibility

For smooth migration, the system includes backward compatibility:

```css
/* Legacy tokens still work but point to new structure */
:size-icon-xs: var(--icon-semantic-xs);
:size-icon-sm: var(--icon-semantic-sm);
:size-icon-md: var(--icon-semantic-md);
```

## Best Practices

### 1. Always Follow the Chain

```css
/* WRONG - skips tiers */
--button-primary-bg: var(--color-neutral-700);

/* CORRECT - follows proper tiering */
:root {
  --color-action-primary: var(--color-brand-950);
}

/* Then components reference semantic layer */
--button-primary-bg: var(--color-action-primary);
```

### 2. Use Intent-Based Naming

```css
/* Less descriptive */
--button-blue-bg: var(--color-brand-500);

/* More descriptive */
--color-action-primary: var(--color-brand-950);
--button-primary-bg: var(--color-action-primary);
```

### 3. Avoid Component Names in Semantics

```css
/* WRONG - component tokens should not be in :root */
:root {
  --button-primary-bg: var(--color-brand-500);
}

/* CORRECT - semantics are intent-only */
:root {
  --color-action-primary: var(--color-brand-500);
}
```

### 4. Prefer Overriding Semantics

```css
/* WRONG - hardcoding values in components */
--button-primary-bg: #7c2d12;

/* CORRECT - override the semantic layer */
[data-theme="brand"] {
  --color-action-primary: var(--color-accent-500);
}
```

## Working with Tokens in Components

### TypeScript Types

Create proper types for component variants:

```typescript
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
```

### Component Implementation

```tsx
// Button.tsx
const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]',
    'hover:bg-[var(--button-primary-bg-hover)]',
    'active:bg-[var(--button-primary-bg-active)]'
  ].join(' ')
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-[var(--button-height-sm)] px-[var(--button-px-sm)] text-button-sm'
};
```

## Token Editor Usage

The token editor provides a GUI for managing the entire token hierarchy:

1. **Primitives Tab** - Edit raw values (colors, spacing, sizing)
2. **Semantics Tab** - Edit intent-driven aliases
3. **Components Tab** - Edit component-specific tokens
4. **Typography Tab** - Edit typography systems
5. **Theme Tab** - Manage theme overrides
6. **Export Tab** - Generate optimized CSS

## Performance Considerations

1. **Token Validation** - The editor validates all token references
2. **Tree Shaking** - Unused tokens are pruned from exports
3. **CSS Optimization** - Generated CSS is minified and optimized
4. **Fallback Generation** - Browser-safe fallbacks for advanced features

## Troubleshooting

### Common Issues

1. **Broken References**: Use editor validation to find broken var() calls
2. **Performance**: Remove unused tokens to reduce CSS bundle size
3. **Theme Switching**: Ensure all semantic colors have theme overrides
4. **Missing Tokens**: Check if a semantic token exists before creating component tokens

### Debugging Tips

```bash
# Check for broken references
npm run validate-tokens

# Check token coverage in components
grep "var(--" components/**/*.tsx | head -20

# Review theme consistency
grep "data-theme=" components/**/*.tsx
```

## Additional Resources

- [Token Editor Guide](migration-guide.md)
- [Component Token Patterns](component-token-patterns.md)
- [Theme System Guide](theme-system.md)
- [Migration Scripts](migration-scripts.md)
- [Accessibility Guidelines](accessibility.md)