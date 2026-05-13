"use client"
import {
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react';
import { Check, Copy } from 'lucide-react';
import { ColorSwatch } from '../../atoms/ColorSwatch/ColorSwatch';
import { useComponentI18n } from '../../utils/i18n/useGeeklegoI18n';
import type {
  ColorPickerProps,
  ColorPickerVariant,
  ColorPickerSize,
  ColorFormat,
  ColorValue,
} from './ColorPicker.types';

// ─────────────────────────────────────────────────────────────────────────────
// Color utility functions (module-scope, never recreated)
// ─────────────────────────────────────────────────────────────────────────────

/** Clamp a number to [min, max]. */
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/** Convert HSV (h: 0–360, s: 0–100, v: 0–100) → RGB (0–255 each). */
function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const sv = s / 100;
  const vv = v / 100;
  const c = vv * sv;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vv - c;
  let r = 0, g = 0, b = 0;
  if      (h < 60)  { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/** Convert RGB (0–255) → HSV (h: 0–360, s: 0–100, v: 0–100). */
function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === rr)      h = 60 * (((gg - bb) / delta) % 6);
    else if (max === gg) h = 60 * ((bb - rr) / delta + 2);
    else                 h = 60 * ((rr - gg) / delta + 4);
    if (h < 0) h += 360;
  }
  return {
    h: Math.round(h),
    s: max === 0 ? 0 : Math.round((delta / max) * 100),
    v: Math.round(max * 100),
  };
}

/** Convert HSV → HSL. Returns { h: 0–360, s: 0–100, l: 0–100 }. */
function hsvToHsl(h: number, s: number, v: number): { h: number; s: number; l: number } {
  const sv = s / 100, vv = v / 100;
  const l = vv * (1 - sv / 2);
  const sl = l === 0 || l === 1 ? 0 : (vv - l) / Math.min(l, 1 - l);
  return { h, s: Math.round(sl * 100), l: Math.round(l * 100) };
}

/** Convert RGB (0–255) + alpha (0–1) → "#rrggbb" and "#rrggbbaa". */
function rgbToHex(r: number, g: number, b: number, a = 1): { hex: string; hexa: string } {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  const hex  = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  const hexa = `${hex}${toHex(Math.round(a * 255))}`;
  return { hex, hexa };
}

/** Parse a hex string (#rgb, #rrggbb, #rrggbbaa) → RGBA. Returns null if invalid. */
function parseHex(hex: string): { r: number; g: number; b: number; a: number } | null {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const [r, g, b] = clean.split('').map((c) => parseInt(c + c, 16));
    return { r, g, b, a: 1 };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
      a: 1,
    };
  }
  if (clean.length === 8) {
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
      a: parseInt(clean.slice(6, 8), 16) / 255,
    };
  }
  return null;
}

/** Internal color state: HSV + alpha. */
interface InternalColor { h: number; s: number; v: number; a: number }

/** Parse any color string to InternalColor. Falls back to black on failure. */
function parseColor(colorStr: string): InternalColor {
  const rgb = parseHex(colorStr);
  if (!rgb) return { h: 0, s: 0, v: 100, a: 1 };
  const { h, s, v } = rgbToHsv(rgb.r, rgb.g, rgb.b);
  return { h, s, v, a: rgb.a };
}

/** Build a full ColorValue from InternalColor. */
function buildColorValue(c: InternalColor): ColorValue {
  const rgb = hsvToRgb(c.h, c.s, c.v);
  const { hex, hexa } = rgbToHex(rgb.r, rgb.g, rgb.b, c.a);
  const hsl = hsvToHsl(c.h, c.s, c.v);
  return { hex, hexa, ...rgb, a: c.a, h: c.h, sv: c.s, v: c.v, ...{ s: hsl.s, l: hsl.l } };
}

// ─────────────────────────────────────────────────────────────────────────────
// Static class maps (module-scope, never recreated)
// ─────────────────────────────────────────────────────────────────────────────

const widthClasses: Record<ColorPickerSize, string> = {
  sm: 'w-[var(--color-picker-width-sm)]',
  md: 'w-[var(--color-picker-width-md)]',
  lg: 'w-[var(--color-picker-width-lg)]',
};

const spectrumHeightClasses: Record<ColorPickerSize, string> = {
  sm: 'h-[var(--color-picker-spectrum-height-sm)]',
  md: 'h-[var(--color-picker-spectrum-height-md)]',
  lg: 'h-[var(--color-picker-spectrum-height-lg)]',
};

// ─────────────────────────────────────────────────────────────────────────────
// Internal: ColorPickerSpectrum
// ─────────────────────────────────────────────────────────────────────────────

interface SpectrumProps {
  h: number; s: number; v: number;
  size: ColorPickerSize;
  disabled?: boolean;
  spectrumLabel: string;
  onSVChange: (s: number, v: number) => void;
}

const ColorPickerSpectrum = memo(({ h, s, v, size, disabled, spectrumLabel, onSVChange }: SpectrumProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const getSVFromPointer = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const newS = clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100);
    const newV = clamp(100 - ((e.clientY - rect.top) / rect.height) * 100, 0, 100);
    onSVChange(Math.round(newS), Math.round(newV));
  }, [onSVChange]);

  const handlePointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    isDragging.current = true;
    ref.current?.setPointerCapture(e.pointerId);
    getSVFromPointer(e);
  }, [disabled, getSVFromPointer]);

  const handlePointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    getSVFromPointer(e);
  }, [getSVFromPointer]);

  const handlePointerUp = useCallback((e: PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    ref.current?.releasePointerCapture(e.pointerId);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const step = e.shiftKey ? 10 : 1;
    switch (e.key) {
      case 'ArrowRight': onSVChange(clamp(s + step, 0, 100), v); e.preventDefault(); break;
      case 'ArrowLeft':  onSVChange(clamp(s - step, 0, 100), v); e.preventDefault(); break;
      case 'ArrowUp':    onSVChange(s, clamp(v + step, 0, 100)); e.preventDefault(); break;
      case 'ArrowDown':  onSVChange(s, clamp(v - step, 0, 100)); e.preventDefault(); break;
      case 'Home':       onSVChange(0, 100); e.preventDefault(); break;
      case 'End':        onSVChange(100, 0); e.preventDefault(); break;
    }
  }, [disabled, s, v, onSVChange]);

  // Thumb position: x = saturation%, y = (100 - brightness)%
  const thumbX = s;
  const thumbY = 100 - v;

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={spectrumLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={s}
      aria-disabled={disabled || undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={[
        'relative w-full rounded-[var(--color-picker-spectrum-radius)] cursor-crosshair overflow-hidden select-none',
        'focus-visible:outline-none focus-visible:focus-ring',
        spectrumHeightClasses[size],
        disabled ? 'opacity-[var(--color-swatch-opacity-disabled)] cursor-not-allowed' : '',
      ].filter(Boolean).join(' ')}
      // Spectrum background: hue gradient + white-to-transparent + black-to-transparent
      style={{
        '--spectrum-hue-color': `hsl(${h}, 100%, 50%)`,
        background: [
          'linear-gradient(to bottom, transparent, #000)',
          'linear-gradient(to right, #fff, var(--spectrum-hue-color))',
        ].join(', '),
      } as CSSProperties}
    >
      {/* Draggable thumb */}
      <div
        aria-hidden="true"
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-component-full)] pointer-events-none transition-[left,top] duration-[50ms]"
        style={{
          width:  'var(--color-picker-thumb-size)',
          height: 'var(--color-picker-thumb-size)',
          left:   `${thumbX}%`,
          top:    `${thumbY}%`,
          border: `var(--color-picker-thumb-border-width) solid var(--color-picker-thumb-border)`,
          boxShadow: `var(--color-picker-thumb-shadow)`,
        } as CSSProperties}
      />
    </div>
  );
});
ColorPickerSpectrum.displayName = 'ColorPickerSpectrum';

// ─────────────────────────────────────────────────────────────────────────────
// Internal: ColorPickerSlider (1D — hue or alpha)
// ─────────────────────────────────────────────────────────────────────────────

interface SliderProps {
  value: number; min: number; max: number;
  trackBackground: string;
  ariaLabel: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}

const ColorPickerSlider = memo(({ value, min, max, trackBackground, ariaLabel, disabled, onChange }: SliderProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const getValueFromPointer = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    onChange(Math.round(pct * (max - min) + min));
  }, [min, max, onChange]);

  const handlePointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    isDragging.current = true;
    ref.current?.setPointerCapture(e.pointerId);
    getValueFromPointer(e);
  }, [disabled, getValueFromPointer]);

  const handlePointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    getValueFromPointer(e);
  }, [getValueFromPointer]);

  const handlePointerUp = useCallback((e: PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    ref.current?.releasePointerCapture(e.pointerId);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const step = e.shiftKey ? 10 : 1;
    switch (e.key) {
      case 'ArrowRight': case 'ArrowUp':
        onChange(clamp(value + step, min, max)); e.preventDefault(); break;
      case 'ArrowLeft':  case 'ArrowDown':
        onChange(clamp(value - step, min, max)); e.preventDefault(); break;
      case 'Home': onChange(min); e.preventDefault(); break;
      case 'End':  onChange(max); e.preventDefault(); break;
    }
  }, [disabled, value, min, max, onChange]);

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-disabled={disabled || undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={[
        'relative w-full select-none cursor-pointer',
        'rounded-[var(--color-picker-track-radius)]',
        'h-[var(--color-picker-track-height)]',
        'focus-visible:outline-none focus-visible:focus-ring',
        disabled ? 'opacity-[var(--color-swatch-opacity-disabled)] cursor-not-allowed' : '',
      ].filter(Boolean).join(' ')}
      style={{ '--track-bg': trackBackground, background: 'var(--track-bg)' } as CSSProperties}
    >
      {/* Thumb */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-[var(--radius-component-full)] pointer-events-none transition-[left] duration-[50ms]"
        style={{
          left:      `${pct}%`,
          width:     'var(--color-picker-slider-thumb-size)',
          height:    'var(--color-picker-slider-thumb-size)',
          background:'var(--color-picker-slider-thumb-bg)',
          border:    `1px solid var(--color-picker-slider-thumb-border)`,
          boxShadow: 'var(--color-picker-slider-thumb-shadow)',
        } as CSSProperties}
      />
    </div>
  );
});
ColorPickerSlider.displayName = 'ColorPickerSlider';

// ─────────────────────────────────────────────────────────────────────────────
// Main ColorPicker component
// ─────────────────────────────────────────────────────────────────────────────

export const ColorPicker = memo(({
  value: valueProp,
  defaultValue,
  onChange,
  variant = 'default',
  size = 'md',
  presets,
  showAlpha = false,
  disabled = false,
  loading = false,
  i18nStrings: i18nProp,
  className,
}: ColorPickerProps) => {
  const i18n = useComponentI18n('colorPicker', i18nProp);

  // ── Unique IDs ───────────────────────────────────────────────────────────────
  const baseId = useId();
  const headingId = `${baseId}-heading`;

  // ── Internal color state (HSV + alpha) ───────────────────────────────────────
  const [internalColor, setInternalColor] = useState<InternalColor>(() => {
    const defaultColorValue = valueProp ?? defaultValue;
    if (defaultColorValue) {
      return parseColor(defaultColorValue);
    }
    // Fallback to CSS variable if available, else use default hex
    const cssDefault = typeof window !== 'undefined'
      ? getComputedStyle(document.documentElement)
          .getPropertyValue('--color-picker-default-color')
          .trim()
      : '#6366f1';
    return parseColor(cssDefault || '#6366f1');
  });

  // Sync when controlled value changes externally
  useEffect(() => {
    if (valueProp !== undefined) {
      setInternalColor(parseColor(valueProp));
    }
  }, [valueProp]);

  // ── Format switcher state ────────────────────────────────────────────────────
  const [format, setFormat] = useState<ColorFormat>('hex');

  // ── Copy-to-clipboard state ──────────────────────────────────────────────────
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Hex input field state (tracks raw text while typing) ─────────────────────
  const colorValue = useMemo(() => buildColorValue(internalColor), [internalColor]);
  const [hexInput, setHexInput] = useState(colorValue.hex);

  // Keep hex input in sync when color changes externally (but not while typing)
  const hexInputFocused = useRef(false);
  useEffect(() => {
    if (!hexInputFocused.current) setHexInput(colorValue.hex);
  }, [colorValue.hex]);

  // ── Update handler ───────────────────────────────────────────────────────────
  const updateColor = useCallback((next: InternalColor) => {
    setInternalColor(next);
    onChange?.(buildColorValue(next));
  }, [onChange]);

  const handleSVChange = useCallback((s: number, v: number) => {
    updateColor({ ...internalColor, s, v });
  }, [internalColor, updateColor]);

  const handleHueChange = useCallback((h: number) => {
    updateColor({ ...internalColor, h });
  }, [internalColor, updateColor]);

  const handleAlphaChange = useCallback((a: number) => {
    updateColor({ ...internalColor, a: a / 100 });
  }, [internalColor, updateColor]);

  // ── Hex input handlers ───────────────────────────────────────────────────────
  const handleHexInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    const parsed = parseHex(raw.startsWith('#') ? raw : `#${raw}`);
    if (parsed) {
      const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b);
      updateColor({ ...hsv, a: parsed.a });
    }
  }, [updateColor]);

  // ── RGB channel handlers ─────────────────────────────────────────────────────
  const handleRgbChange = useCallback((channel: 'r' | 'g' | 'b', rawVal: string) => {
    const n = clamp(parseInt(rawVal, 10) || 0, 0, 255);
    const rgb = { r: colorValue.r, g: colorValue.g, b: colorValue.b, [channel]: n };
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    updateColor({ ...hsv, a: internalColor.a });
  }, [colorValue, internalColor.a, updateColor]);

  // ── HSL channel handlers ─────────────────────────────────────────────────────
  const handleHslChange = useCallback((channel: 'h' | 's' | 'l', rawVal: string) => {
    const max = channel === 'h' ? 360 : 100;
    const n = clamp(parseInt(rawVal, 10) || 0, 0, max);
    const hsl = { h: colorValue.h, s: colorValue.s, l: colorValue.l, [channel]: n };
    // Convert HSL → HSV via RGB
    const lf = hsl.l / 100, sf = hsl.s / 100;
    const vv = lf + sf * Math.min(lf, 1 - lf);
    const sv = vv === 0 ? 0 : 2 * (1 - lf / vv);
    updateColor({ h: hsl.h, s: Math.round(sv * 100), v: Math.round(vv * 100), a: internalColor.a });
  }, [colorValue, internalColor.a, updateColor]);

  // ── Copy handler ─────────────────────────────────────────────────────────────
  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(colorValue.hex).catch(() => {});
    setCopied(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }, [colorValue.hex]);

  useEffect(() => () => {
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
  }, []);

  // ── Track backgrounds (computed from current color) ──────────────────────────
  // Hue track uses CSS variable with semantic hue colors
  const hueTrackBg = `linear-gradient(to right,
    var(--color-hue-red),
    var(--color-hue-yellow),
    var(--color-hue-green),
    var(--color-hue-cyan),
    var(--color-hue-blue),
    var(--color-hue-magenta),
    var(--color-hue-red))`;

  const rgbNoAlpha = useMemo(() => {
    const { r, g, b } = colorValue;
    return `rgb(${r}, ${g}, ${b})`;
  }, [colorValue]);

  const alphaTrackBg = useMemo(() =>
    `linear-gradient(to right, transparent, ${rgbNoAlpha}),
     repeating-linear-gradient(45deg, var(--color-alpha-checker-light) 0px, var(--color-alpha-checker-light) 4px, var(--color-alpha-checker-dark) 4px, var(--color-alpha-checker-dark) 8px)`,
    [rgbNoAlpha]);

  // ── Hue CSS (used for spectrum gradient background) ──────────────────────────
  // (passed to ColorPickerSpectrum via h prop)

  // ─────────────────────────────────────────────────────────────────────────────
  // Render helpers
  // ─────────────────────────────────────────────────────────────────────────────

  const isMinimal = variant === 'minimal';
  const isCompact = variant === 'compact';
  const isDisabled = disabled || loading;

  // ── Small numeric input ──────────────────────────────────────────────────────
  const ChannelInput = useCallback(({
    value: val, label, onChange: onCh, max,
  }: { value: number | string; label: string; onChange: (v: string) => void; max: number }) => {
    const fieldId = `${baseId}-ch-${label}`;
    return (
      <div className="flex flex-col items-center gap-[var(--color-picker-label-mt)]">
        <input
          id={fieldId}
          type="text"
          inputMode="numeric"
          value={String(val)}
          onChange={(e) => onCh(e.target.value)}
          disabled={isDisabled}
          aria-label={label}
          className={[
            'w-full text-center rounded-[var(--radius-component-sm)]',
            'border border-[var(--color-picker-preview-border)]',
            'bg-[var(--color-picker-bg)]',
            'text-body-xs text-[var(--color-text-primary)]',
            'h-[var(--size-component-sm)]',
            'px-[var(--spacing-component-xs)]',
            'focus-visible:outline-none focus-visible:focus-ring-inset',
            'transition-default',
            isDisabled ? 'opacity-[var(--color-swatch-opacity-disabled)] cursor-not-allowed' : '',
          ].filter(Boolean).join(' ')}
        />
        <span
          aria-hidden="true"
          className="text-label-xs text-[var(--color-picker-label-color)] truncate-label"
        >
          {label}
        </span>
      </div>
    );
  }, [baseId, isDisabled]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Root container classes
  // ─────────────────────────────────────────────────────────────────────────────

  const containerClasses = useMemo(() => [
    'inline-flex flex-col',
    'rounded-[var(--color-picker-radius)]',
    'border border-[var(--color-picker-border)]',
    'bg-[var(--color-picker-bg)]',
    'shadow-[var(--color-picker-shadow)]',
    'p-[var(--color-picker-padding)]',
    'gap-[var(--color-picker-gap)]',
    'min-w-[var(--color-picker-min-width)]',
    widthClasses[size],
    'card-shell',
    className,
  ].filter(Boolean).join(' '), [size, className]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Loading skeleton
  // ─────────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div
        role="group"
        aria-label={i18n.colorLabel}
        aria-busy="true"
        className={containerClasses}
      >
        <div className={`skeleton rounded-[var(--color-picker-spectrum-radius)] ${spectrumHeightClasses[size]}`} />
        <div className="skeleton h-[var(--color-picker-track-height)] rounded-[var(--color-picker-track-radius)]" />
        <div className="skeleton h-[var(--size-component-sm)] rounded-[var(--radius-component-sm)] w-full" />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Minimal variant: just preview + hex input + copy
  // ─────────────────────────────────────────────────────────────────────────────

  if (isMinimal) {
    return (
      <div
        role="group"
        aria-labelledby={headingId}
        className={containerClasses}
      >
        <span id={headingId} className="sr-only">{i18n.colorLabel}</span>

        <div className="flex items-center gap-[var(--color-picker-input-gap)]">
          {/* Preview swatch */}
          <div
            aria-hidden="true"
            className="shrink-0 rounded-[var(--color-picker-preview-radius)] border border-[var(--color-picker-preview-border)]"
            style={{
              width: 'var(--color-picker-preview-size)',
              height: 'var(--color-picker-preview-size)',
              backgroundColor: colorValue.hex,
            } as CSSProperties}
          />

          {/* Hex input */}
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={hexInput}
              onChange={handleHexInputChange}
              onFocus={() => { hexInputFocused.current = true; }}
              onBlur={() => {
                hexInputFocused.current = false;
                setHexInput(colorValue.hex);
              }}
              disabled={isDisabled}
              aria-label={i18n.hexLabel}
              spellCheck={false}
              className={[
                'w-full rounded-[var(--radius-component-sm)]',
                'border border-[var(--color-picker-preview-border)]',
                'bg-transparent text-body-sm text-[var(--color-text-primary)]',
                'h-[var(--size-component-sm)] px-[var(--spacing-component-sm)]',
                'focus-visible:outline-none focus-visible:focus-ring-inset',
                'transition-default uppercase font-[var(--font-family-mono)]',
                isDisabled ? 'opacity-[var(--color-swatch-opacity-disabled)] cursor-not-allowed' : '',
              ].filter(Boolean).join(' ')}
            />
          </div>

          {/* Copy button */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={isDisabled}
            aria-label={copied ? i18n.copiedLabel : i18n.copyLabel}
            className={[
              'shrink-0 flex items-center justify-center transition-default',
              'text-[var(--color-picker-copy-color)] hover:text-[var(--color-picker-copy-color-hover)]',
              'focus-visible:outline-none focus-visible:focus-ring',
              'rounded-[var(--radius-component-sm)]',
              isDisabled ? 'opacity-[var(--color-swatch-opacity-disabled)] cursor-not-allowed pointer-events-none' : '',
            ].filter(Boolean).join(' ')}
          >
            {copied
              ? <Check size="var(--size-icon-sm)" aria-hidden="true" />
              : <Copy  size="var(--size-icon-sm)" aria-hidden="true" />
            }
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Default / compact variants
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div
      role="group"
      aria-labelledby={headingId}
      className={containerClasses}
    >
      <span id={headingId} className="sr-only">{i18n.colorLabel}</span>

      {/* ── Spectrum ── */}
      <ColorPickerSpectrum
        h={internalColor.h}
        s={internalColor.s}
        v={internalColor.v}
        size={size}
        disabled={isDisabled}
        spectrumLabel={i18n.spectrumLabel ?? ''}
        onSVChange={handleSVChange}
      />

      {/* ── Sliders row ── */}
      <div className="flex items-center gap-[var(--color-picker-input-gap)]">
        {/* Preview swatch (current color) */}
        <div
          aria-hidden="true"
          className="shrink-0 rounded-[var(--color-picker-preview-radius)] border border-[var(--color-picker-preview-border)]"
          style={{
            width: 'var(--color-picker-preview-size)',
            height: 'var(--color-picker-preview-size)',
            backgroundColor: colorValue.hex,
          } as CSSProperties}
        />

        {/* Hue + alpha stacked */}
        <div className="flex-1 min-w-0 flex flex-col gap-[var(--color-picker-input-gap)]">
          <ColorPickerSlider
            value={internalColor.h}
            min={0}
            max={360}
            trackBackground={hueTrackBg}
            ariaLabel={i18n.hueLabel ?? ''}
            disabled={isDisabled}
            onChange={handleHueChange}
          />
          {showAlpha && (
            <ColorPickerSlider
              value={Math.round(internalColor.a * 100)}
              min={0}
              max={100}
              trackBackground={alphaTrackBg}
              ariaLabel={i18n.opacityLabel ?? ''}
              disabled={isDisabled}
              onChange={handleAlphaChange}
            />
          )}
        </div>
      </div>

      {/* ── Inputs section ── */}
      <div className="flex items-start gap-[var(--color-picker-input-gap)]">
        {format === 'hex' && (
          <>
            {/* Hex field — takes most of the width */}
            <div className="flex-1 min-w-0 flex flex-col gap-[var(--color-picker-label-mt)]">
              <input
                type="text"
                value={hexInput}
                onChange={handleHexInputChange}
                onFocus={() => { hexInputFocused.current = true; }}
                onBlur={() => {
                  hexInputFocused.current = false;
                  setHexInput(colorValue.hex);
                }}
                disabled={isDisabled}
                aria-label={i18n.hexLabel}
                spellCheck={false}
                className={[
                  'w-full rounded-[var(--radius-component-sm)]',
                  'border border-[var(--color-picker-preview-border)]',
                  'bg-transparent text-body-xs text-[var(--color-text-primary)]',
                  'h-[var(--size-component-sm)] px-[var(--spacing-component-sm)]',
                  'focus-visible:outline-none focus-visible:focus-ring-inset',
                  'transition-default uppercase font-[var(--font-family-mono)]',
                  isDisabled ? 'opacity-[var(--color-swatch-opacity-disabled)] cursor-not-allowed' : '',
                ].filter(Boolean).join(' ')}
              />
              <span
                aria-hidden="true"
                className="text-label-xs text-[var(--color-picker-label-color)] truncate-label"
              >
                {i18n.hexLabel}
              </span>
            </div>

            {showAlpha && (
              <ChannelInput
                value={Math.round(internalColor.a * 100)}
                label="A"
                max={100}
                onChange={(v) => handleAlphaChange(parseInt(v, 10) || 0)}
              />
            )}
          </>
        )}

        {format === 'rgb' && (
          <>
            <ChannelInput value={colorValue.r} label={i18n.redLabel ?? ''}   max={255} onChange={(v) => handleRgbChange('r', v)} />
            <ChannelInput value={colorValue.g} label={i18n.greenLabel ?? ''} max={255} onChange={(v) => handleRgbChange('g', v)} />
            <ChannelInput value={colorValue.b} label={i18n.blueLabel ?? ''}  max={255} onChange={(v) => handleRgbChange('b', v)} />
            {showAlpha && (
              <ChannelInput
                value={Math.round(internalColor.a * 100)}
                label="A"
                max={100}
                onChange={(v) => handleAlphaChange(parseInt(v, 10) || 0)}
              />
            )}
          </>
        )}

        {format === 'hsl' && (
          <>
            <ChannelInput value={colorValue.h}  label={i18n.hueChannelLabel ?? ''}  max={360} onChange={(v) => handleHslChange('h', v)} />
            <ChannelInput value={colorValue.s}  label={i18n.saturationLabel ?? ''} max={100} onChange={(v) => handleHslChange('s', v)} />
            <ChannelInput value={colorValue.l}  label={i18n.lightnessLabel ?? ''}  max={100} onChange={(v) => handleHslChange('l', v)} />
            {showAlpha && (
              <ChannelInput
                value={Math.round(internalColor.a * 100)}
                label="A"
                max={100}
                onChange={(v) => handleAlphaChange(parseInt(v, 10) || 0)}
              />
            )}
          </>
        )}

        {/* Copy + format switcher (compact row, compact variant omits format switcher) */}
        <div className="flex flex-col items-center gap-[var(--color-picker-label-mt)] shrink-0">
          <div className="flex items-center gap-[var(--spacing-component-xs)]">
            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              disabled={isDisabled}
              aria-label={copied ? i18n.copiedLabel : i18n.copyLabel}
              className={[
                'flex items-center justify-center h-[var(--size-component-sm)] w-[var(--size-component-sm)]',
                'rounded-[var(--radius-component-sm)] transition-default',
                'text-[var(--color-picker-copy-color)] hover:text-[var(--color-picker-copy-color-hover)]',
                'hover:bg-[var(--color-action-secondary)]',
                'focus-visible:outline-none focus-visible:focus-ring',
                isDisabled ? 'opacity-[var(--color-swatch-opacity-disabled)] cursor-not-allowed pointer-events-none' : '',
              ].filter(Boolean).join(' ')}
            >
              {copied
                ? <Check size="var(--size-icon-sm)" aria-hidden="true" />
                : <Copy  size="var(--size-icon-sm)" aria-hidden="true" />
              }
            </button>
          </div>
          <span aria-hidden="true" className="text-label-xs text-[var(--color-picker-label-color)]">&nbsp;</span>
        </div>
      </div>

      {/* ── Format switcher (default variant only) ── */}
      {!isCompact && (
        <div
          role="group"
          aria-label="Color format"
          className="flex rounded-[var(--radius-component-sm)] overflow-hidden border border-[var(--color-picker-preview-border)]"
        >
          {(['hex', 'rgb', 'hsl'] as ColorFormat[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormat(f)}
              disabled={isDisabled}
              aria-pressed={format === f}
              className={[
                'flex-1 text-label-xs h-[var(--size-component-xs)] transition-default',
                'focus-visible:outline-none focus-visible:focus-ring',
                format === f
                  ? 'bg-[var(--color-action-secondary)] text-[var(--color-text-primary)] font-[var(--font-weight-medium)]'
                  : 'bg-transparent text-[var(--color-picker-label-color)] hover:bg-[var(--color-action-secondary)] hover:text-[var(--color-text-primary)]',
                isDisabled ? 'cursor-not-allowed pointer-events-none opacity-[var(--color-swatch-opacity-disabled)]' : '',
              ].filter(Boolean).join(' ')}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* ── Preset swatches (default variant only) ── */}
      {!isCompact && presets && presets.length > 0 && (
        <div
          role="group"
          aria-label={i18n.presetsLabel}
          className="flex flex-wrap gap-[var(--color-picker-presets-gap)] pt-[var(--color-picker-presets-pt)] border-t border-[var(--color-picker-presets-border)]"
        >
          {presets.map((p) => (
            <ColorSwatch
              key={p.color}
              color={p.color}
              aria-label={p.label}
              size="sm"
              shape="square"
              selected={colorValue.hex.toLowerCase() === p.color.toLowerCase()}
              disabled={isDisabled}
              onClick={() => {
                const parsed = parseHex(p.color);
                if (parsed) {
                  const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b);
                  updateColor({ ...hsv, a: parsed.a });
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});
ColorPicker.displayName = 'ColorPicker';
