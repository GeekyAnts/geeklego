# Documentation

Welcome to the Geeklego documentation hub. Here you'll find comprehensive guides and resources for working with our semantic token system and component library.

## 📚 Documentation Overview

### Core System Documentation

- **[Semantic Token System Guide](./semantic-token-system.md)** - Complete guide to the 3-tier token architecture
- **[Component Token Patterns](./component-token-patterns.md)** - Standard patterns for creating component tokens
- **[Best Practices](./best-practices.md)** - Essential practices for maintaining a healthy token system

### Developer Documentation

- **[Token Editor API](./token-editor-api.md)** - Complete API reference for the token editor
- **[Migration Guides](./migration-guides.md)** - Step-by-step migration from legacy systems
- **[Component Documentation](../components/README.md)** - Individual component documentation

## 🚀 Getting Started

### For New Developers

1. Start with the [Semantic Token System Guide](./semantic-token-system.md) to understand the architecture
2. Review [Best Practices](./best-practices.md) for usage patterns
3. Explore [Component Token Patterns](./component-token-patterns.md) for implementation examples

### For Upgrading to v3

1. Read the [Migration Guides](./migration-guides.md) for detailed upgrade paths
2. Use the [Token Editor API](./token-editor-api.md) for programmatic access
3. Follow the migration checklist for smooth transition

## 📖 Quick Start

### Basic Token Usage

```tsx
import { Button } from '@geeklego/ui';

// Component uses semantic tokens automatically
<Button variant="primary">Click me</Button>

// Tokens are automatically applied
// background: var(--button-primary-bg)
// color: var(--button-primary-text)
```

### Working with the Token Editor

```bash
# Start the token editor
npm run dev

# The editor opens at http://localhost:5173
```

### Validation

```bash
# Validate token references
npm run validate-tokens

# Should output: ✓ 0 broken references found
```

## 📁 Documentation Structure

```
docs/
├── README.md                          # This file - documentation index
├── semantic-token-system.md          # Core 3-tier token system
├── component-token-patterns.md        # Component token patterns
├── token-editor-api.md               # Token editor API reference
├── migration-guides.md                # Migration from v2 to v3
└── best-practices.md                 # Best practices guide

components/ (package root)
├── README.md                         # Component library overview
└── [component]/
    ├── README.md                     # Individual component docs
    ├── [component].tsx              # Component implementation
    ├── [component].types.ts         # TypeScript types
    └── [component].stories.tsx       # Storybook documentation
```

## 🔧 Tools & Utilities

### CLI Commands

```bash
# Token validation
npm run validate-tokens

# Build design system
npm run build

# Start Storybook
npm run storybook

# Start token editor
npm run dev
```

### Available Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start token editor |
| `npm run build` | Build design system |
| `npm run storybook` | Start component documentation |
| `npm run validate-tokens` | Validate CSS token references |
| `npx vitest` | Run component tests |
| `npx tsc --noEmit` | Type-check app code |

## 🎯 Common Tasks

### Creating New Components

1. Follow the [Component Token Patterns](./component-token-patterns.md)
2. Use the [component-builder](../../.claude/skills/component-builder/) skill
3. Implement all 5 required files
4. Update documentation in the component README

### Updating Tokens

1. Use the token editor UI for visual updates
2. Or update `design-system/geeklego.css` directly
3. Run `validate-tokens` after changes
4. Update theme overrides if needed

### Theme Customization

1. Override semantic tokens in theme blocks
2. Test all components in the new theme
3. Verify color contrast ratios
4. Update theme documentation

## 🚨 Important Guidelines

### Token Hierarchy Rules

1. **Tier 1 → Tier 2 → Tier 3**: Never skip levels
2. **Semantic First**: Use intent-based naming
3. **Component Last**: Component tokens only reference semantics

### Component Rules

1. **5 Files Per Component**: `.tsx`, `.types.ts`, `.stories.tsx`, `README.md`, `mock-data.json`
2. **Memo Wrapping**: Use `memo(forwardRef(...))` for L1/L2 components
3. **TypeScript**: All components must have proper types
4. **Accessibility**: Include A11y stories and keyboard navigation

### Performance Considerations

1. **Avoid Redundant Tokens**: Check for duplicates
2. **Tree Shaking**: Remove unused tokens
3. **Bundle Size**: Monitor with `npm run build`
4. **CSS Optimization**: Use minified outputs

## 📚 Additional Resources

### External References

- [Official Geeklego Documentation](https://geeklego.dev)
- [Component Examples](https://storybook.geeklego.dev)
- [Design System Figma](https://figma.com/geeklego)

### Community Resources

- [GitHub Discussions](https://github.com/GeekyAnts/geeklego/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/geeklego)
- [Discord](https://discord.gg/geeklego)

## 🔄 Version Information

| Version | Release Date | Key Features |
|---------|--------------|--------------|
| v3.0.0 | April 2026 | Semantic token system, improved performance |
| v2.0.0 | February 2026 | Full component library, token editor |
| v1.0.0 | October 2025 | Initial release |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](../../CONTRIBUTING.md) for:
- How to submit pull requests
- Coding standards
- Documentation guidelines
- Testing requirements

## 📞 Support

- **Support**: [GitHub Issues](https://github.com/GeekyAnts/geeklego/issues)
- **Discussions**: [GitHub Discussions](https://github.com/GeekyAnts/geeklego/discussions)
- **Email**: support@geeklego.dev

---

*Last updated: April 2026*  
*Version: v3.0.0*