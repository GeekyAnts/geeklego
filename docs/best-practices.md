# Token System Best Practices

This guide covers the essential best practices for working with Geeklego's semantic token system. Following these practices will ensure consistency, maintainability, and performance across your design system.

## Core Principles

### 1. Always Follow the Token Hierarchy
Never skip tiers in the token chain:

```css
/* WRONG - Skipping semantics */
--button-primary-bg: #7c2d12;

/* CORRECT - Full chain */
:root {
  /* Tier 1 - Primitive */
  --color-brand-950: #09090b;
  
  /* Tier 2 - Semantic */
  --color-action-primary: var(--color-brand-950);
  --color-text-on-primary: var(--color-neutral-0);
}

/* Tier 3 - Component */
--button-primary-bg: var(--color-action-primary);
--button-primary-text: var(--color-text-on-primary);
```

### 2. Use Intent-Based Naming
Describe what the token does, not where it's used:

```css
/* Less descriptive */
--button-bg: var(--color-brand-500);  /* Component name in the name */

/* More descriptive */
--color-action-primary: var(--color-brand-950);  /* Intent-based */
--button-primary-bg: var(--color-action-primary);  /* Component usage */
```

### 3. Maintain Consistent Naming Patterns
Use standardized naming conventions throughout:

```css
/* Action tokens */
--color-action-primary
--color-action-primary-hover
--color-action-primary-active
--color-action-secondary
--color-action-accent
--color-action-destructive

/* State tokens */
--color-state-hover
--color-state-pressed
--color-state-selected
--color-state-loading
--color-state-disabled

/* Status tokens */
--color-status-success
--color-status-warning
--color-status-error
--color-status-info
```

## Component Token Guidelines

### Button Best Practices

#### Size Tokens
```css
/* Use semantic sizes, not arbitrary values */
--button-height-xs: var(--size-button-xs);  /* 24px */
--button-height-sm: var(--size-button-sm);  /* 28px */
--button-height-md: var(--size-button-md);  /* 36px */

/* Use semantic spacing */
--button-px-sm: var(--spacing-3);           /* 12px */
--button-px-md: var(--spacing-4);           /* 16px */
```

#### Variant Tokens
```css
/* Primary variant */
--button-primary-bg:      var(--color-action-primary);
--button-primary-bg-hover: var(--color-action-primary-hover);
--button-primary-bg-active: var(--color-action-primary-active);
--button-primary-text:    var(--color-text-on-primary);
--button-primary-border:  transparent;
--button-primary-shadow:  none;

/* Outline variant */
--button-outline-bg:              transparent;
--button-outline-bg-hover:      var(--color-state-highlight);
--button-outline-text:           var(--color-text-primary);
--button-outline-border:         var(--color-border-default);
--button-outline-border-hover:   var(--color-brand-500);  /* Accent action */
```

#### State Management
```css
/* Hover states should be semantic */
--button-hover-transform: translateY(-1px);
--button-hover-shadow-offset: 0 4px 6px -1px;

/* Active states */
--button-active-transform: translateY(0);
--button-active-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Focus states */
--button-focus-ring: var(--border-focus-ring);
```

### Input Best Practices

#### Accessibility
```css
/* Minimum touch target */
--input-height-lg: var(--spacing-12);           /* 48px */
--input-padding-lg: var(--spacing-4);           /* 16px */

/* Focus indicators */
--input-focus-ring: var(--border-focus-ring);
--input-focus-offset: 2px;

/* Validation states */
--input-error-border: var(--color-border-error);
--input-error-placeholder: var(--color-text-error);
--input-success-icon: var(--color-status-success);
```

#### Layout Patterns
```css
/* Consistent spacing */
--input-group-gap: var(--spacing-2);      /* Between input and icon */
--input-label-gap: var(--spacing-1);       /* Above input */

/* Responsive padding */
--input-px-sm: var(--spacing-3);           /* Horizontal padding */
--input-py-sm: var(--spacing-2);           /* Vertical padding */

/* Icon positioning */
--input-icon-left: var(--spacing-3);      /* Left icon spacing */
--input-icon-right: var(--spacing-3);     /* Right icon spacing */
```

### Card Best Practices

#### Responsive Protection
```css
/* Use card-shell for responsiveness */
--card-padding-y: var(--spacing-default);   /* Fixed internal spacing */
--card-padding-x: var(--spacing-lg);        /* Fixed internal spacing */
--card-gap: var(--spacing-md);              /* Component gaps */

/* Header layout */
--card-header-gap: var(--spacing-sm);       /* Internal header spacing */
--card-title-action-gap: var(--spacing-md);  /* Title to action spacing */
```

#### Variant Patterns
```css
/* Default card */
--card-bg:              var(--color-surface-default);
--card-border:          var(--color-border-default);
--card-shadow:          var(--shadow-sm);

/* Elevated card */
--card-elevated-bg:     var(--color-surface-raised);
--card-elevated-shadow: var(--shadow-md);
--card-hover-shadow:    var(--shadow-lg);
```

## Performance Guidelines

### 1. Minimize Redundant Tokens
Avoid creating tokens that serve the same purpose:

```css
/* REDUNDANT */
--button-primary-bg: var(--color-action-primary);
--primary-button-bg: var(--button-primary-bg);  // Redundant alias

/* CONSOLIDATED */
--button-primary-bg: var(--color-action-primary);
```

### 2. Use Efficient Selectors
Keep selectors simple and avoid unnecessary nesting:

```css
/* GOOD */
.button {
  background: var(--button-primary-bg);
  color: var(--button-primary-text);
}

/* NEEDLESSLY COMPLEX */
.components > .button-group > .button.primary {
  /* This will match the same styles but is harder to maintain */
}
```

### 3. Avoid DOM Bloat
Use utility classes instead of inline styles:

```tsx
/* GOOD */
<button className="bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]">
  Click me
</button>

/* BAD */
<button style={{
  backgroundColor: 'var(--button-primary-bg)',
  color: 'var(--button-primary-text)'
}}>
  Click me
</button>
```

### 4. Optimize Performance with Variables
Use CSS variables for dynamic values:

```css
/* GOOD */
--[transition-duration]: 150ms;
--[transition-timing]: ease-in-out;

.element {
  transition: all var(--transition-duration) var(--transition-timing);
}

/* BAD */
.element {
  transition: all 150ms ease-in-out;  /* Hardcoded value */
}
```

## Accessibility Guidelines

### 1. Color Contrast
Always check contrast ratios against WCAG guidelines:

```css
/* Ensure sufficient contrast */
:root {
  --text-on-primary: var(--color-neutral-0);  /* White on dark */
  
  /* Minimum 4.5:1 contrast for normal text */
  --text-tertiary: var(--color-neutral-500); /* 4.5:1 on bg-primary */
  --text-secondary: var(--color-neutral-600); /* 4.5:1 on bg-primary */
}
```

### 2. Interactive Elements
Ensure all interactive elements are keyboard accessible:

```css
/* Focus indicators */
.button:focus-visible {
  outline: var(--button-focus-ring);
}

/* High contrast */
@media (forced-colors: active) {
  .button {
    --button-focus-ring: 2px solid ButtonText;
  }
}
```

### 3. Responsive Accessibility
Make sure responsive changes don't break accessibility:

```css
/* Touch targets */
@media (hover: none) and (pointer: coarse) {
  .button {
    min-height: var(--size-touch-min);  /* 44px minimum */
  }
}
```

## Theme Management Best Practices

### 1. Semantic Theme Overrides
Override semantic layer, not component tokens:

```css
/* GOOD */
[data-theme="dark"] {
  --color-action-primary: var(--color-brand-50);
  --color-text-on-primary: var(--color-brand-900);
}

/* BAD - Hardcoding in components */
[data-theme="dark"] .button-primary {
  background: #fafafa;
  color: #18181b;
}
```

### 2. Consistent Theme Levels
Use the same theme levels throughout:

```css
/* Light theme */
[data-theme="light"] {
  --color-bg-primary: var(--color-neutral-0);
  --color-text-primary: var(--color-neutral-900);
}

/* Dark theme */
[data-theme="dark"] {
  --color-bg-primary: var(--color-neutral-950);
  --color-text-primary: var(--color-neutral-50);
}

/* Brand theme */
[data-theme="brand"] {
  --color-bg-primary: var(--color-brand-950);
  --color-text-primary: var(--color-neutral-0);
}
```

### 3. Inheritable Themes
Design themes to cascade naturally:

```css
/* Component colors inherit from theme */
:root {
  --color-action-primary: var(--color-brand-950);
}

/* Apply theme at application level */
[data-theme="dark"] {
  --color-action-primary: var(--color-brand-100);
}
```

## Maintenance Best Practices

### 1. Document Tokens
Keep documentation up to date with changes:

```md
# Token Changes Log
2024-04-23: Updated button hover states to use semantic action tokens
2024-04-15: Added new status colors for warning states
2024-04-01: Fixed color contrast for text-secondary on dark mode
```

### 2. Use Version Control
Commit token changes with clear messages:

```bash
git add design-system/geeklego.css
git commit -m "feat(tokens): Add semantic button hover states"
```

### 3. Validate Before Deployment
Always validate tokens before deploying:

```bash
npm run validate-tokens
# Passes if no broken var() references
```

### 4. Test Performance
Monitor bundle size impact:

```bash
npm run build
# Check bundle size in dist/
```

## Troubleshooting Patterns

### 1. Broken Token References
```bash
# Find broken var() references
grep -r "var(--" src/ | grep -v "color-mix"

# Validate with tool
npx geeklego-token-editor validate
```

### 2. Unexpected Styles
```css
/* Check inheritance chain */
/* Component should use: */
--button-primary-bg: var(--color-action-primary);  /* Points to semantic */

/* Semantic should point to: */
--color-action-primary: var(--color-brand-950);    /* Points to primitive */

/* Primitive is the actual value */
--color-brand-950: #09090b;
```

### 3. Theme Switching Issues
```css
/* Verify theme selectors exist */
[data-theme="dark"] :root {
  /* All overrides */
}

/* Check for specificity issues */
html[data-theme="dark"] .button {
  /* Should work fine */
}
```

## Anti-Patterns to Avoid

### 1. Hardcoding Values
```css
/* BAD */
--button-width: 200px;

/* GOOD */
--button-width-full: 100%;
--button-width-fit: fit-content;
```

### 2. Mixing Tiers
```css
/* BAD - Component token references primitive */
--button-bg: var(--color-brand-950);

/* GOOD - Full chain */
--button-bg: var(--color-action-primary);
--color-action-primary: var(--color-brand-950);
```

### 3. Over-Specific Selectors
```css
/* BAD */
.btn-primary.active.focus {
  background: var(--button-primary-active);
}

/* GOOD */
.button {
  background: var(--button-primary-bg);
}

.button:active {
  background: var(--button-primary-bg-active);
}
```

### 4. Neglecting Accessibility
```css
/* BAD - Text without sufficient contrast */
.text-secondary {
  color: var(--color-neutral-400); /* Low contrast on bg-primary */
}

/* GOOD - Better contrast */
.text-secondary {
  color: var(--color-neutral-600); /* 4.5:1 ratio */
}
```

## Team Collaboration Guidelines

### 1. Establish Clear Conventions
Create a team style guide that documents:
- Naming conventions
- Token hierarchy rules
- Component structure
- Workflow patterns

### 2. Use Code Reviews
Review token changes to ensure:
- Follows established patterns
- Maintains consistency
- Includes proper documentation
- Passes accessibility checks

### 3. Document Changes
Keep a changelog of significant token updates:
- What was changed
- Why the change was made
- Potential impact on components
- Migration steps if needed

### 4. Training Resources
Provide documentation for team members:
- Token editor basics
- Best practices guide
- Troubleshooting guide
- Migration documentation

## Continuous Improvement

### 1. Monitor Usage
Track token usage to identify:
- Frequently used tokens
- Redundant or unused tokens
- Performance bottlenecks

### 2. Regular Audits
Periodically audit the token system:
- Check for inconsistencies
- Review naming conventions
- Validate accessibility
- Optimize performance

### 3. Community Feedback
Gather feedback from:
- Developer experience
- Designer workflow
- Performance metrics
- Accessibility testing

Following these best practices will create a robust, maintainable, and performant token system that scales with your organization's needs.