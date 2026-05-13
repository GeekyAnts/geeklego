// ─── Content Flexibility ─────────────────────────────────────────────────────

export interface ContentFlexibilityPrimitives {
  lineClamp: Record<string, number>
  maxWidth: Record<string, string>
  minWidth: Record<string, string>
}

// ─── Primitives ──────────────────────────────────────────────────────────────

export interface ColorScale {
  [shade: string]: string
}

export interface PrimitiveColors {
  neutral: ColorScale
  accent: ColorScale
  success: ColorScale
  warning: ColorScale
  error: ColorScale
  [name: string]: ColorScale
}

export interface Primitives {
  colors: PrimitiveColors
  fontFamily: Record<string, string>
  fontSize: Record<string, string>
  fontWeight: Record<string, number>
  lineHeight: Record<string, string>
  letterSpacing: Record<string, string>
  spacing: Record<string, string>
  radius: Record<string, string>
  borderWidth: Record<string, string>
  opacity: Record<string, number>
  zIndex: Record<string, number>
  duration: Record<string, string>
  easing: Record<string, string>
  iconSize: Record<string, string>
  colorShadowNeutral: string
  breakpoints: Record<string, string>
  contentFlexibility: ContentFlexibilityPrimitives
}

// ─── Semantics ───────────────────────────────────────────────────────────────

export interface SemanticColorGroup {
  [tokenSuffix: string]: string
}

export interface SemanticBlock {
  bg: SemanticColorGroup
  surface: SemanticColorGroup
  text: SemanticColorGroup
  border: SemanticColorGroup
  action: SemanticColorGroup
  status: SemanticColorGroup
  state: SemanticColorGroup
  dataSeries: Record<string, string>
  shadows: Record<string, string>
  elevationOpacity: Record<string, number>
  spacingComponent: Record<string, string>
  spacingLayout: Record<string, string>
  sizeComponent: Record<string, string>
  radiusComponent: Record<string, string>
  motion: {
    duration: Record<string, string>
    easing: Record<string, string>
  }
  layer: Record<string, string>
  borders: Record<string, string>
  colorControlThumb?: string
  colorRing?: string
  colorOverlayBackdrop: string
  iconSemantic: Record<string, string>
  sizeFixed: Record<string, string>
  typographySemantics: Record<string, {
    size: string
    weight: string
    leading: string
    tracking: string
  }>
  contentFlexibility: Record<string, string>
}

// ─── Typography ───────────────────────────────────────────────────────────────

export interface TypographyClass {
  name: string
  fontFamily: string
  fontSize: string
  fontWeight: string
  lineHeight: string
  letterSpacing: string
  textTransform?: string
}

// ─── Responsive ──────────────────────────────────────────────────────────────

export interface ResponsiveOverride {
  maxWidth: string
  spacingLayout?: Record<string, string>
}

// ─── Root token model ─────────────────────────────────────────────────────────

export interface GeeklegoTokens {
  primitives: Primitives
  semantics: {
    light: SemanticBlock
    dark: Partial<SemanticBlock>
  }
  typographyClasses: TypographyClass[]
  responsiveOverrides: ResponsiveOverride[]
}

// ─── Component tokens ────────────────────────────────────────────────────────

export interface ComponentToken {
  name: string
  value: string
}

export interface ComponentTokenSection {
  label: string
  tokens: ComponentToken[]
}

export interface TypographyMapping {
  size: string       // 'sm' | 'md' | 'lg' | 'xs' | 'xl' | 'default' etc.
  className: string  // 'text-button-md' | 'text-body-sm' etc.
}

export interface ComponentTokenGroup {
  componentName: string
  level: 'atom' | 'molecule' | 'organism' | 'unknown'
  generatedDate: string
  sections: ComponentTokenSection[]
  typography?: TypographyMapping[]
}

// ─── UI state ─────────────────────────────────────────────────────────────────

export type TabId = 'primitives' | 'semantics' | 'components' | 'typography' | 'responsive' | 'export'
export type ThemeMode = 'light' | 'dark'
export type PrimitiveSection =
  | 'colors' | 'typography' | 'spacing' | 'sizing'
  | 'radius' | 'borders' | 'opacity' | 'zindex' | 'motion'

export interface ColorOption {
  label: string
  value: string
  hex: string
}

// ─── History checkpoints ─────────────────────────────────────────────────────

export interface HistoryEntry {
  tokens: GeeklegoTokens
  label?: string
  timestamp: number
}
