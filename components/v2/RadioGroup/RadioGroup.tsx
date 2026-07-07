"use client";
import { forwardRef } from "react";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "../lib/cn";
import type { RadioGroupProps, RadioGroupItemProps } from "./RadioGroup.types";

/**
 * RadioGroup — ShadCN/Radix pattern on geeklego's 2-tier token system.
 *
 * Radix owns the behavior — role="radiogroup", roving tabindex / arrow-key
 * navigation, single-selection state, aria-checked, and form integration. We
 * supply only the look via standard semantic utilities: the item ring is
 * `border-primary`, and the selected dot fills with `primary`.
 *
 * Compound: <RadioGroup> + <RadioGroupItem>. No variant axis — layout is set by
 * the consumer via className (default vertical stack).
 */
export const RadioGroup = forwardRef<
  React.ElementRef<typeof RadixRadioGroup.Root>,
  RadioGroupProps
>(({ className, ...props }, ref) => (
  <RadixRadioGroup.Root
    ref={ref}
    className={cn("grid gap-2", className)}
    {...props}
  />
));
RadioGroup.displayName = "RadioGroup";

export const RadioGroupItem = forwardRef<
  React.ElementRef<typeof RadixRadioGroup.Item>,
  RadioGroupItemProps
>(({ className, ...props }, ref) => (
  <RadixRadioGroup.Item
    ref={ref}
    className={cn(
      "aspect-square size-4 shrink-0 rounded-full border border-primary text-primary shadow-xs",
      "transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <RadixRadioGroup.Indicator className="flex items-center justify-center">
      <Circle className="size-2.5 fill-primary text-primary" />
    </RadixRadioGroup.Indicator>
  </RadixRadioGroup.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";
