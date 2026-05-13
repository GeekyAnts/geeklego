# Component Token Patterns

This guide documents the standard patterns for creating component tokens in Geeklego. Following these patterns ensures consistency across all components and makes the design system predictable and maintainable.

## Core Principles

### 1. Semantic First
Component tokens should always reference semantic tokens, never primitives directly:

```css
/* WRONG */
--button-bg: var(--color-brand-500);  /* Direct primitive reference */

/* CORRECT */
--button-primary-bg: var(--color-action-primary);  /* References semantic */
```

### 2. Variant-Based Structure
All components follow a standardized variant naming pattern:

```
[component]-[variant]-[property]
```

Examples:
- `button-primary-bg`
- `button-secondary-border`
- `input-error-placeholder`
- `card-header-title`

### 3. State Management
Interactive states follow this pattern:
```
[component]-[variant]-[property]-[state]
```

States: `default`, `hover`, `active`, `focus`, `disabled`

Examples:
- `button-primary-bg-hover`
- `button-primary-bg-active`
- `button-primary-bg-disabled`

## Button Component Patterns

### Sizing Tokens

```css
/* Fixed height tokens */
--button-height-xs: 24px;    /* Icon size + minimal padding */
--button-height-sm: 28px;
--button-height-md: 36px;    /* Touch target baseline */
--button-height-lg: 40px;
--button-height-xl: 56px;

/* Horizontal padding */
--button-px-xs: var(--spacing-2);
--button-px-sm: var(--spacing-3);
--button-px-md: var(--spacing-4);
--button-px-lg: var(--spacing-5);
--button-px-xl: var(--spacing-6);
```

### Verbose Variant Approach

```css
/* Primary Button */
--button-primary-bg:              var(--color-action-primary);
--button-primary-bg-hover:        var(--color-action-primary-hover);
--button-primary-bg-active:       var(--color-action-primary-active);
--button-primary-text:            var(--color-text-on-primary);
--button-primary-border:          transparent;
--button-primary-disabled:        var(--color-action-disabled);

/* Secondary Button */
--button-secondary-bg:            var(--color-action-secondary);
--button-secondary-bg-hover:      var(--color-action-secondary-hover);
--button-secondary-bg-active:     var(--color-action-secondary-active);
--button-secondary-text:          var(--color-text-primary);
--button-secondary-border:        transparent;
--button-secondary-border-hover:  var(--color-border-default);
--button-secondary-disabled:      var(--color-action-disabled);

/* Outline Button */
--button-outline-bg:              transparent;
--button-outline-bg-hover:        var(--color-state-hover);
--button-outline-bg-active:       var(--color-state-pressed);
--button-outline-text:            var(--color-text-primary);
--button-outline-border:          var(--color-border-default);
--button-outline-text-hover:      var(--color-text-accent);
--button-outline-border-hover:    var(--color-accent-500);
```

### Specialized Variants

```css
/* Ghost Button */
--button-ghost-bg:                transparent;
--button-ghost-bg-hover:          var(--color-state-highlight);
--button-ghost-text:              inherit; /* Inherits parent color */
--button-ghost-text-hover:        var(--color-text-accent);
--button-ghost-disabled-opacity:  0.5;

/* Link Button */
--button-link-text-decoration:    underline;
--button-link-text-offset:        4px;
--button-link-underline:          2px;
--button-link-text:              var(--color-text-accent);
--button-link-text-hover:         var(--color-text-primary);
```

### Destructive Pattern

```css
/* Destructive Action Pattern */
--button-destructive-bg:              var(--color-action-destructive);
--button-destructive-bg-hover:        var(--color-action-destructive-hover);
--button-destructive-bg-active:       var(--color-action-destructive-active);
--button-destructive-text:            var(--color-text-on-primary);
--button-destructive-ghost-bg-hover:  var(--color-error-100);
--button-destructive-ghost-text-hover:var(--color-error-600);
```

## Input Component Patterns

### Base Input Tokens

```css
/* Size Tokens */
--input-height-xs:     28px;
--input-height-sm:     32px;    /* Match text body/sm */
--input-height-md:     36px;    /* Touch target baseline */
--input-height-lg:     40px;
--input-height-xl:     44px;

/* Padding */
--input-px-xs:         var(--spacing-2);
--input-px-sm:         var(--spacing-3);
--input-px-md:         var(--spacing-3);
--input-px-lg:         var(--spacing-4);
--input-px-xl:         var(--spacing-4);

/* Icon spacing */
--input-icon-left:     var(--spacing-3);      /* Left icon inset */
--input-icon-right:    var(--spacing-3);     /* Right icon inset */
```

### State-Based Tokens

```css
/* Validation States */
--input-border-default:         var(--color-border-default);
--input-border-focus:           var(--color-border-focus);
--input-border-success:         var(--color-border-success);
--input-border-warning:         var(--color-border-warning);
--input-border-error:           var(--color-border-error);

--input-bg-default:             var(--color-bg-primary);
--input-bg-disabled:            var(--color-bg-tertiary);

/* Placeholder Colors */
--input-placeholder:            var(--color-text-tertiary);
--input-placeholder-success:    var(--color-text-success);
--input-placeholder-warning:    var(--color-text-warning);
--input-placeholder-error:      var(--color-text-error);
```

### Input Variants

```css
/* Basic Input */
--input-text-padding:          var(--input-px-sm) var(--input-icon-left);

/* Select Input */
--input-select-padding:        var(--input-px-sm) var(--spacing-2);
--input-select-icon-gap:       var(--spacing-3);

/* Textarea */
--textarea-line-gap:           var(--spacing-1);
--textarea-max-height:         200px;
```

## Card Component Patterns

### Container Tokens

```css
/* Card Shell (responsive container protection) */
--card-padding-y:              var(--spacing-default);
--card-padding-x:              var(--spacing-lg);
--card-gap:                    var(--spacing-md);

/* Card Header Layout */
--card-header-row-gap:         var(--spacing-sm);
--card-header-title-gap:       var(--spacing-sm);
--card-header-action-gap:      var(--spacing-md);

/* Card Body */
--card-body-gap:               var(--spacing-md);

/* Card Footer */
--card-footer-gap:             var(--spacing-sm);
```

### Card Variants

```css
/* Default Card */
--card-bg:                     var(--color-surface-default);
--card-border:                 var(--color-border-default);
--card-shadow:                 none;
--card-hover-shadow:           var(--shadow-sm);

/* Elevated Card */
--card-elevated-bg:            var(--color-raised);
--card-elevated-border:        transparent;
--card-elevated-shadow:        var(--shadow-md);
--card-elevated-hover-shadow:  var(--shadow-lg);
```

## Icon Component Patterns

### Semantic Icon Sizes

```css
/* Icon Sizing - Responsive Scaling */
--icon-semantic-xs:            var(--spacing-3);      /* 12px → 0.75rem */
--icon-semantic-sm:            var(--spacing-4);      /* 16px → 1rem */
--icon-semantic-md:            var(--spacing-5);      /* 20px → 1.25rem */
--icon-semantic-lg:            var(--spacing-7);      /* 24px → 1.5rem */
--icon-semantic-xl:            var(--spacing-9);      /* 32px → 2rem */
--icon-semantic-2xl:           var(--spacing-12);     /* 48px → 3rem */
```

### Icon Uses Case

```css
/* Interactive Icons */
--icon-button-bg:              transparent;
--icon-button-bg-hover:        var(--color-state-hover);
--icon-button-bg-active:       var(--color-state-pressed);

/* Status Icons */
--icon-success:                var(--color-status-success);
--icon-warning:                var(--color-status-warning);
--icon-error:                  var(--color-status-error);
--icon-info:                   var(--color-status-info);

/* Decorative Icons */
--icon-opacity-muted:          0.6;
--icon-opacity-disabled:       0.3;
```

## Common Component Patterns

### Loading States

```css
/* Loading Overlay */
--loading-overlay-bg:          rgba(255, 255, 255, 0.8);
--loading-overlay-bg-dark:     rgba(0, 0, 0, 0.8);

/* Loading Spinner */
--spinner-size-sm:             var(--icon-semantic-sm);
--spinner-size-md:             var(--icon-semantic-md);
--spinner-size-lg:             var(--icon-semantic-lg);
--spinner-border-width:        2px;
```

### Disabled States

```css
/* Opacity-based Disabled */
--disabled-opacity:            0.5;
--disabled-cursor:             not-allowed;

/* Content Dimming */
--disabled-bg:                 var(--color-bg-tertiary);
--disabled-border:             var(--color-border-subtle);
```

### Focus States

```css
/* Focus Ring */
--focus-ring-width:           4px;
--focus-ring-offset:           2px;
--focus-ring-color:           var(--color-ring);

/* Focus Visible */
--focus-visible:               focus-visible;
```

## Responsive Component Patterns

### Media State Tokens

```css
/* Web (desktop) */
@media (min-width: 1280px) {
  --component-variant-desktop:  --desktop-specific-value;
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1279px) {
  --component-variant-tablet:   --tablet-specific-value;
}

/* Mobile */
@media (max-width: 767px) {
  --component-variant-mobile:    --mobile-specific-value;
}

/* Hover:Keyboard (Progressive Enhancement) */
@media not (hover: hover) and (pointer: coarse) {
  --component-touch-hover:        --touch-specific-value;
}
```

### Container Query Support

```css
/* Container Queries (Visual only) */
@container (min-width: 320px) {
  --compact-padding-y:            var(--spacing-sm);
}

@container (min-width: 600px) {
  --compact-padding-y:            var(--spacing-md);
}

@container (min-width: 960px) {
  --compact-padding-y:            var(--spacing-lg);
}
```

## Component Token Generation Template

### New Component Checklist

When creating a new component token block:

1. **Define base sizing tokens**
2. **Choose semantic variants (usually 3-6)**
3. **Define interactive states for each variant**
4. **Add validation states if applicable**
5. **Include responsive variants when needed**
6. **Add disabled/readonly styles**

### Template Structure

```css
/* =============================================================================
   [COMPONENT] COMPONENT TOKENS
   Generated by component-builder skill
   ============================================================================= */

/* Sizing */
--[component]-height-[size]:      [value];
--[component]-width-[size]:       [value];
--[component]-px-[size]:          [value];
--[component]-py-[size]:          [value];

/* Base */
--[component]-radius:            var(--radius-component-md);
--[component]-gap:               var(--spacing-component-sm);

/* Variant: [primary|secondary|outline|ghost] */
--[component]-[variant]-bg:              var(--color-semantic-primary);
--[component]-[variant]-bg-hover:        var(--color-semantic-primary-hover);
--[component]-[variant]-bg-active:       var(--color-semantic-primary-active);
--[component]-[variant]-text:            var(--color-text-on-primary);
--[component]-[variant]-border:          transparent;

/* Validation States */
--[component]-success-border:    var(--color-border-success);
--[component]-warning-border:    var(--color-border-warning);
--[component]-error-border:      var(--color-border-error);

/* Disabled */
--[component]-disabled-opacity:  var(--disabled-opacity);
--[component]-disabled-bg:       var(--color-bg-tertiary);
```

## Performance Optimizations

### Token Compression

```css
/* Minimize unique token names */
--btn-bg-primary: var(--color-action-primary);  /* Shorter but clear */
--btn-bg-prim-ht: var(--color-action-primary-hover);  /* Avoid - too cryptic */

/* Use consistent nesting patterns */
--button-variant-primary-color:   var(--action-primary);   /* Prefer inheritance */
--button-variant-primary-bg:      var(--action-primary-bg); /* Avoid if redundant */
```

### CSS Custom Properties Benefits

1. **Cascading**: Values update dynamically
2. **Inheritance**: Tokens flow naturally
3. **Override**: Easy theming and customization
4. **Tree Shaking**: Unused tokens can be eliminated
5. **Debugging**: Clear, readable property names

## Common Anti-Patterns

### 1. Skipping Semantic Layer

```css
/* WRONG */
--button-primary-bg: #7c2d12;

/* RIGHT */
:root {
  --action-primary: var(--brand-primary);
}
--button-primary-bg: var(--action-primary);
```

### 2. Hardcoded Values

```css
/* WRONG */
--button-width: 200px;

/* RIGHT */
--button-width-full: 100%;
--button-width-fit: fit-content;
```

### 3. Inconsistent Naming

```css
/* WRONG */
--btn-bg-primary     /* abbreviation */
--button-BG-HOVER     /* caps */
--buttonbackground     /* camelCase */

/* RIGHT */
--button-primary-bg
--button-primary-bg-hover
--button-background (if wanted, but not recommended)
```

### 4. Overly Generic Tokens

```css
/* WRONG - too specific to a single use */
--modal-close-btn-icon-color: var(--red-500);

/* RIGHT - proper semantic layer */
--icon-destructive: var(--color-status-error);
```

## Component Token Validation

When creating or modifying component tokens:

1. **Cross-reference** that all `var(--)` references exist
2. **Check for duplicates** that might cause overrides
3. **Validate color contrast** ratios in light/dark themes
4. **Test responsive behavior** with different viewport sizes
5. **Review accessibility** implications for interactive states

This ensures your component tokens work seamlessly within the broader design system.