import type { ComponentPropsWithoutRef } from "react";
import type * as RadixRadioGroup from "@radix-ui/react-radio-group";

/**
 * RadioGroup props — extend the Radix RadioGroup parts, so every native + Radix
 * prop (value, defaultValue, onValueChange, name, disabled, required, orientation)
 * flows through unchanged. No variant axis — layout via consumer className.
 */
export type RadioGroupProps = ComponentPropsWithoutRef<
  typeof RadixRadioGroup.Root
>;

export type RadioGroupItemProps = ComponentPropsWithoutRef<
  typeof RadixRadioGroup.Item
>;
