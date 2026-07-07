"use client";
import { forwardRef } from "react";
import * as RadixSlider from "@radix-ui/react-slider";
import { cn } from "../lib/cn";
import type { SliderProps } from "./Slider.types";

/**
 * Slider — ShadCN/Radix pattern on geeklego's 2-tier token system.
 *
 * Radix owns the behavior — role="slider", pointer + keyboard control, min/max/
 * step math, RTL, orientation, and multi-thumb range selection. We supply only
 * the look via standard semantic utilities: the track is `secondary`, the filled
 * range is `primary`, and each thumb is a `background` circle ringed by `primary`.
 *
 * A `value`/`defaultValue` array with N entries renders N thumbs, so single and
 * range sliders share one component with no variant axis.
 */
export const Slider = forwardRef<
  React.ElementRef<typeof RadixSlider.Root>,
  SliderProps
>(({ className, value, defaultValue, ...props }, ref) => {
  // One thumb per value; fall back to a single thumb when uncontrolled with no
  // defaultValue (Radix's own default is a single-thumb [min] slider).
  const thumbCount =
    (Array.isArray(value) ? value.length : undefined) ??
    (Array.isArray(defaultValue) ? defaultValue.length : undefined) ??
    1;

  return (
    <RadixSlider.Root
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <RadixSlider.Track className="relative grow overflow-hidden rounded-full bg-secondary data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5">
        <RadixSlider.Range className="absolute rounded-full bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
      </RadixSlider.Track>
      {Array.from({ length: thumbCount }, (_, i) => (
        <RadixSlider.Thumb
          key={i}
          className={cn(
            "block size-4 shrink-0 rounded-full border border-primary bg-background shadow-sm",
            "transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        />
      ))}
    </RadixSlider.Root>
  );
});
Slider.displayName = "Slider";
