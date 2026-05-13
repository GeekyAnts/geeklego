export type ColorPickerVariant = 'default' | 'compact' | 'minimal';
export type ColorPickerSize = 'sm' | 'md' | 'lg';
export type ColorFormat = 'hex' | 'rgb' | 'hsl';

/** Complete color value returned by onChange. */
export interface ColorValue {
  /** Hex string without alpha (#rrggbb). */
  hex: string;
  /** Hex string with alpha (#rrggbbaa). */
  hexa: string;
  /** Red channel 0–255. */
  r: number;
  /** Green channel 0–255. */
  g: number;
  /** Blue channel 0–255. */
  b: number;
  /** Alpha channel 0–1. */
  a: number;
  /** Hue 0–360 (shared by HSL and HSV). */
  h: number;
  /** Saturation 0–100 (HSL). */
  s: number;
  /** Lightness 0–100 (HSL). */
  l: number;
  /** Saturation 0–100 (HSV). */
  sv: number;
  /** Brightness/Value 0–100 (HSV). */
  v: number;
}

/** A preset color entry for the swatches section. */
export interface ColorPickerPreset {
  /** CSS color value for the swatch. */
  color: string;
  /** Accessible label for the swatch (e.g. "Coral — #ff7043"). */
  label: string;
}

/** i18n strings for ColorPicker. All keys are optional — English defaults are used when absent. */
export interface ColorPickerI18nStrings {
  /** aria-label for the root group element. Default: "Color" */
  colorLabel?: string;
  /** aria-label for the 2D spectrum control. Default: "Color spectrum. Use arrow keys to adjust saturation and brightness." */
  spectrumLabel?: string;
  /** aria-label for the hue slider. Default: "Hue" */
  hueLabel?: string;
  /** aria-label for the opacity slider. Default: "Opacity" */
  opacityLabel?: string;
  /** Label shown above the hex input. Default: "Hex" */
  hexLabel?: string;
  /** Label shown above the red channel input. Default: "R" */
  redLabel?: string;
  /** Label shown above the green channel input. Default: "G" */
  greenLabel?: string;
  /** Label shown above the blue channel input. Default: "B" */
  blueLabel?: string;
  /** Label shown above the hue channel input in HSL mode. Default: "H" */
  hueChannelLabel?: string;
  /** Label shown above the saturation channel input. Default: "S" */
  saturationLabel?: string;
  /** Label shown above the lightness channel input. Default: "L" */
  lightnessLabel?: string;
  /** aria-label for the preset colors group. Default: "Preset colors" */
  presetsLabel?: string;
  /** aria-label for the copy hex button. Default: "Copy hex" */
  copyLabel?: string;
  /** Text shown on the copy button after copying. Default: "Copied!" */
  copiedLabel?: string;
}

export interface ColorPickerProps {
  /** Controlled hex color value (e.g. "#ff0000" or "#ff0000ff"). */
  value?: string;
  /** Uncontrolled default hex color value. */
  defaultValue?: string;
  /** Called whenever the color changes. Receives a ColorValue object. */
  onChange?: (color: ColorValue) => void;
  /** Visual layout variant. Defaults to 'default'. */
  variant?: ColorPickerVariant;
  /** Size scale affecting spectrum height and input size. Defaults to 'md'. */
  size?: ColorPickerSize;
  /** Preset color swatches shown at the bottom. */
  presets?: ColorPickerPreset[];
  /** Show the opacity/alpha slider. Defaults to false. */
  showAlpha?: boolean;
  /** Disable the entire picker. */
  disabled?: boolean;
  /** Show loading skeleton state. */
  loading?: boolean;
  /** Internationalization strings. */
  i18nStrings?: ColorPickerI18nStrings;
  /** Additional class names for the root element. */
  className?: string;
}
