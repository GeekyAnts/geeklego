import type { ComponentPropsWithoutRef } from "react";
import type * as RadixSlider from "@radix-ui/react-slider";

/**
 * Slider props — extend the Radix Slider.Root part, so every native + Radix prop
 * (value, defaultValue, onValueChange, min, max, step, orientation, disabled,
 * name) flows through unchanged. No variant axis — a `value`/`defaultValue`
 * array with N entries renders N thumbs (single or range) automatically.
 */
export type SliderProps = ComponentPropsWithoutRef<typeof RadixSlider.Root>;
