# Token Editor API Documentation

The Geeklego Token Editor provides a comprehensive API for programmatically accessing, modifying, and managing the entire token hierarchy. This document covers all available APIs, configuration options, and integration patterns.

## Overview

The token editor exposes several interfaces for different use cases:

1. **React Component API** - For embedding the full editor in your application
2. **Vite Plugin API** - For build-time token compilation
3. **REST API** - For backend integrations
4. **TypeScript Types** - For type-safe JavaScript usage

## Installation & Setup

```bash
# Install the token editor package
npm install geeklego-token-editor
```

```typescript
// Import the main editor component
import { TokenEditor } from 'geeklego-token-editor';

// Import types
import type {
  TokenData, 
  TokenConfig, 
  ValidationResult,
  MigrationReport
} from 'geeklego-token-editor';
```

## React Component API

### Basic Usage

```tsx
import { useState } from 'react';
import { TokenEditor } from 'geeklego-token-editor';

function DesignSystemManager() {
  const [tokens, setTokens] = useState<TokenData>(defaultTokens);
  const [theme, setTheme] = useState<'light' | 'dark' | 'brand'>('light');

  return (
    <div className={theme}>
      <TokenEditor
        value={tokens}
        onChange={setTokens}
        theme={theme}
        onSave={handleSave}
      />
    </div>
  );
}
```

### Component Props

```typescript
interface TokenEditorProps {
  // Core Props
  value: TokenData;                           // Complete token hierarchy
  onChange: (tokens: TokenData) => void;      // Called on changes
  onSave?: (tokens: TokenData) => Promise<void>; // Optional save handler
  
  // Display Props
  theme?: 'light' | 'dark' | 'brand';         // Editor theme
  compact?: boolean;                          // Compact mode
  variant?: 'full' | 'minimal';               // UI variant
  
  // Behavior Props
  autoSave?: boolean;                         // Auto-save on change
  validateOnSave?: boolean;                   // Validate before save
  history?: boolean;                          // Enable undo/redo
  
  // Content Props
  showPrimitives?: boolean;                   // Show Tier 1 tokens
  showSemantics?: boolean;                    // Always visible
  showComponents?: boolean;                   // Show Tier 3 tokens
  showTypography?: boolean;                    // Typography section
  showExport?: boolean;                       // Export controls
  
  // Features
  enableMigration?: boolean;                  // Migration tools
  enableThemeSwitcher?: boolean;             // Theme switcher
  enableBulkEdit?: boolean;                   // Bulk editing
  
  // Callbacks
  onValidate?: (result: ValidationResult) => void;
  onMigrate?: (report: MigrationReport) => void;
  onError?: (error: EditorError) => void;
  
  // Customization
  className?: string;
  style?: React.CSSProperties;
}
```

### Token Data Structure

```typescript
interface TokenData {
  version: string;                 // "1.0.0"
  
  // Tier 1 - Primitives
  primitives: {
    colors: ColorPalettes;
    spacing: SpacingScale;
    sizing: SizeScale;
    radius: BorderRadius;
    typography: TypographyPrimitives;
    motion: MotionTokens;
    shadows: ShadowTokens;
  };
  
  // Tier 2 - Semantics
  semantics: {
    colors: ColorSemantics;
    borders: BorderTokens;
    spacing: SemanticSpacing;
    actions: ActionTokens;
    states: StateTokens;
    status: StatusTokens;
  };
  
  // Tier 3 - Components
  components: {
    button: ButtonTokens;
    input: InputTokens;
    card: CardTokens;
    // ... other component tokens
  };
  
  // Typography Systems
  typography: TypographySystems;
  
  // Theme Overrides
  themes: ThemeOverrides;
}
```

### Working with Tokens

#### Reading Tokens

```tsx
// Get specific token value
const buttonPrimaryBg = tokens.components.button.primary.bg;

// Get all tokens from semantic tier
const allSemantics = tokens.semantics.colors;
```

#### Modifying Tokens

```tsx
// Update a specific token
const handleTokenChange = (path: string[], value: any) => {
  const newTokens = { ...tokens };
  
  // Navigate nested object
  let current: any = newTokens;
  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]];
  }
  current[path[path.length - 1]] = value;
  
  setTokens(newTokens);
};

// Example usage
handleTokenChange(['components', 'button', 'primary', 'bg'], '#7c2d12');
```

#### Auto-saving

```tsx
<TokenEditor
  value={tokens}
  onChange={setTokens}
  onSave={async (tokens) => {
    await saveToDatabase(tokens);
    showNotification('Tokens saved');
  }}
  autoSave={true}
  autoSaveDebounce={1000} // 1 second debounce
/>
```

## Vite Plugin API

### Configuration

```typescript
// vite.config.ts
import { geeklegoPlugin } from 'geeklego-token-editor/vite';

export default defineConfig({
  plugins: [
    geeklegoPlugin({
      // Input token file
      input: 'design-system/geeklego.css',
      
      // Output path
      output: 'design-system/geeklego.optimized.css',
      
      // Build-time options
      minify: true,
      purgeUnused: false,
      generateTypes: true,
      
      // Custom presets
      presets: ['minimal', 'compact', 'full'],
      
      // Watch for changes
      watch: {
        include: ['design-system/**/*.css'],
        exclude: ['**/node_modules/**']
      }
    })
  ]
});
```

### Plugin Options

```typescript
interface PluginOptions {
  // Path configuration
  input: string | string[];
  output?: string;
  
  // Processing options
  minify?: boolean;
  sourceMap?: boolean;
  purgeUnused?: boolean;
  
  // Code generation
  generateTypes?: boolean;
  generateTokens?: boolean;
  generateThemes?: boolean;
  
  // Performance
  parallel?: boolean;
  cacheDir?: string;
  
  // Customization
  presets?: (string | Preset)[];
  transforms?: ((tokens: TokenData) => TokenData)[];
  
  // Validation
  validate?: boolean;
  strictMode?: boolean;
}
```

### Using Generated Tokens

```typescript
// Generated as module exports
import { tokens } from 'design-system/tokens';
import type { TokenData } from 'design-system/tokens/types';

// Compose class names
const className = `bg-[var(--${tokens.button.primary.bg})] text-${tokens.typography.button.size}`;

// Access at build time
if (isProduction) {
  console.debug('Production token:', tokens.components.button.primary.bg);
}
```

## REST API

### Endpoints

```typescript
// Load tokens
GET /api/tokens
- Response: TokenData

// Save tokens
POST /api/tokens
- Body: TokenData

- Response: { success: boolean }

// Get validation
GET /api/tokens/validate
- Response: ValidationResult

// Migrate tokens
POST /api/tokens/migrate
- Body: MigrationOptions
- Response: MigrationReport

- Export options
GET /api/tokens/export/:format
- Formats: css, json, scss, less
- Query: minify=true, purge=true

// Component tokens
GET /api/tokens/components/:component
- Response: ComponentTokens

// Theme previews
GET /api/tokens/preview/:theme
- Query: viewport=desktop
- Response: { css: string, previewUrl: string }
```

### API Usage Examples

#### Fetch Tokens

```typescript
async function loadTokens() {
  const response = await fetch('/api/tokens');
  if (!response.ok) throw new Error('Failed to load tokens');
  return response.json();
}
```

#### Save Tokens

```typescript
async function saveTokens(tokens: TokenData) {
  const response = await fetch('/api/tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tokens)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
}
```

#### Batch Validation

```typescript
async function batchValidate(paths: string[]) {
  const response = await fetch('/api/tokens/validate', {
    method: 'POST',
    body: JSON.stringify({ tokens, paths })
  });
  return response.json();
}
```

## TypeScript Types

### Core Type Definitions

```typescript
// Basic types
interface ColorValue {
  value: string;
  type: 'hex' | 'rgb' | 'hsl' | 'keyword';
  channels: number[];
}

interface SpacingValue {
  value: string;
  type: 'px' | 'rem' | 'em';
  numeric: number;
}

interface TokenMeta {
  category: 'color' | 'spacing' | 'typography' | 'component';
  deprecated?: boolean;
  alternatives?: string[];
  documentation?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning';
  code: string;
}
```

### Component Types

```typescript
interface ButtonTokens {
  sizing: {
    heights: Record<string, SpacingValue>;
    paddings: Record<string, SpacingValue>;
  };
  
  variants: {
    primary: ButtonVariant;
    secondary: ButtonVariant;
    outline: ButtonVariant;
    ghost: ButtonVariant;
    destructive: ButtonVariant;
    link: ButtonVariant;
  };
  
  states: {
    hover: ButtonState;
    active: ButtonState;
    disabled: ButtonState;
    focus: ButtonState;
  };
}

interface ButtonVariant {
  bg: ColorValue | string;
  bgHover?: ColorValue | string;
  bgActive?: ColorValue | string;
  text: ColorValue | string;
  textHover?: ColorValue | string;
  border?: ColorValue | string;
  shadow?: string;
  disabled?: string;
}
```

## Migration API

### Migration Options

```typescript
interface MigrationOptions {
  sourceVersion: string;
  targetVersion: string;
  createBackup: boolean;
  validate: boolean;
  dryRun: boolean;
  mappings?: Record<string, string>; // Custom mappings
}

interface MigrationResult {
  success: boolean;
  changes: MigrationChange[];
  errors: string[];
  backupPath?: string;
  reportPath?: string;
}
```

### Migration Usage

```typescript
// Dry run migration
const dryRun = await migrateTokens({
  sourceVersion: '2.0.0',
  targetVersion: '3.0.0',
  dryRun: true,
  createBackup: true
});

if (dryRun.success) {
  console.log('Would make', dryRun.changes.length, 'changes');
}

// Actual migration
const result = await migrateTokens({
  sourceVersion: '2.0.0',
  targetVersion: '3.0.0',
  createBackup: true,
  validate: true
});
```

## Configuration API

### Global Configuration

```typescript
// Set global defaults
import { configureEditor } from 'geeklego-token-editor';

configureEditor({
  defaultTheme: 'dark',
  autoSave: true,
  validation: {
    strict: true,
    showDeprecated: false
  },
  export: {
    defaultFormat: 'css',
    minify: true
  }
});
```

### Theme Configuration

```typescript
const customThemes = {
  'custom-blue': {
    colors: {
      primary: '#1e40af',
      secondary: '#7dd3fc',
      background: '#f0f9ff'
    }
  }
};

setCustomThemes(customThemes);
```

## Event System

### Custom Events

```typescript
// Listen for editor events
const editorElement = document.querySelector('token-editor');

editorElement.addEventListener('token-change', (event) => {
  console.log('Token changed:', event.detail.token);
});

editorElement.addEventListener('theme-change', (event) => {
  console.log('Theme changed:', event.detail.theme);
});

editorElement.addEventListener('validation-error', (event) => {
  console.error('Validation error:', event.detail.error);
});
```

### Emit Custom Events

```typescript
// Programmatically trigger events
const editor = document.querySelector('token-editor');
editor.emit('token-change', { token: newValue });
editor.emit('theme-change', { theme: 'brand' });
```

## Performance Optimization

### Debounced Updates

```tsx
import { useDebounce } from 'use-debounce';

const [tokens, setTokens] = useState(initialTokens);
const [debouncedTokens] = useDebounce(tokens, 500);

useEffect(() => {
  // Save debounced tokens
  if (debouncedTokens !== tokens) {
    saveTokens(debouncedTokens);
  }
}, [debouncedTokens]);
```

### Token Cache

```typescript
// Cache frequent token access
const tokenCache = new Map<string, any>();

function getCachedToken<T>(path: string[], defaultValue: T): T {
  const key = path.join('.');
  if (tokenCache.has(key)) {
    return tokenCache.get(key);
  }
  
  const value = getNestedValue(tokens, path) ?? defaultValue;
  tokenCache.set(key, value);
  return value;
}
```

## Integration Examples

### With CMS Integration

```typescript
// Connect to headless CMS
async function syncWithCMS() {
  const cmsColors = await fetchFromCMS('colors');
  const updatedTokens = {
    ...tokens,
    primitives: {
      ...tokens.primitives,
      colors: mapCmsColors(cmsColors)
    }
  };
  
  setTokens(updatedTokens);
}
```

### With Design Tools

```typescript
// Import from Figma
async function importFromFigma() {
  const figmaTokens = await fetchFromFigma('colors');
  const mappings = {
    'Primary/60': 'color-brand-600',
    'Neutral/Grey/900': 'color-neutral-900'
  };
  
  const converted = convertFigmaTokens(figmaTokens, mappings);
  updateTokens(converted);
}
```

### Version Control Integration

```typescript
// Git integration
function commitTokens(message: string) {
  const git = initGit();
  const css = generateCSS(tokens);
  
  git.add('design-system/tokens.css');
  git.commit(message, { author: 'bot' });
  
  return Promise.resolve();
}

// Compare versions
async function diffTokens(version1: string, version2: string) {
  const diff = await git.diff(
    version1,
    version2,
    '--',
    'design-system/tokens.css'
  );
  
  return parseTokenDiff(diff);
}
```

## Error Handling

### Custom Error Types

```typescript
class TokenEditorError extends Error {
  code: ErrorCode;
  details?: any;
  
  constructor(message: string, code: ErrorCode, details?: any) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

enum ErrorCode {
  InvalidToken = 'INVALID_TOKEN',
  SaveFailed = 'SAVE_FAILED',
  MigrationError = 'MIGRATION_ERROR',
  ValidationError = 'VALIDATION_ERROR'
}
```

### Error Recovery

```typescript
try {
  await saveTokens(tokens);
} catch (error) {
  if (error.code === ErrorCode.ValidationError) {
    // Show inline validation errors
    showValidationErrors(error.details);
  } else if (error.code === ErrorCode.SaveFailed) {
    // Retry with backup
    await restoreFromBackup();
  } else {
    // Generic error
    showGenericError(error.message);
  }
}
```

## Testing

### Unit Testing

```typescript
// Token utilities test
describe('tokenUtils', () => {
  test('should generate valid CSS', () => {
    const tokens = generateTestTokens();
    const css = generateCSS(tokens);
    
    expect(css).toContain('--color-brand-500');
    expect(css).toContain(':root {');
  });
  
  test('should validate token hierarchy', () => {
    const tokens = createInvalidTokens();
    const result = validateTokens(tokens);
    
    expect(result.isValid).toBe(false);
  });
});
```

### Integration Testing

```typescript
// Editor integration test
describe('EditorIntegration', () => {
  test('should update tokens properly', async () => {
    render(<TokenEditor value={initialTokens} />);
    
    await userEvent.click(screen.getByRole('button', { name: 'Edit Color' }));
    await userEvent.type(
      screen.getByRole('textbox'),
      '{selectall}{backspace}#7c2d12'
    );
    
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});
```

The Token Editor API provides comprehensive access to all features while maintaining type safety and performance. Use these interfaces to integrate tokens into your build process, applications, and backend systems.