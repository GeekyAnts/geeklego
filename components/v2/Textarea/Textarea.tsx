"use client";
import { forwardRef } from "react";
import { cn } from "../lib/cn";
import { textareaVariants } from "./textarea-variants";
import type { TextareaProps } from "./Textarea.types";

/**
 * Textarea — ShadCN/Radix pattern on geeklego's 2-tier token system.
 *
 * A styled native <textarea> (the multi-line sibling of Input). There is no
 * Radix textarea primitive and a text field has no a11y/keyboard/portal surface
 * to delegate, so this is a leaf component. Styled entirely with standard
 * semantic utilities (border-input, bg-background, ring-ring …); the `error`
 * variant reuses --destructive, so it themes for free.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, textareaSize, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        aria-invalid={variant === "error" ? true : props["aria-invalid"]}
        className={cn(textareaVariants({ variant, textareaSize }), className)}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { textareaVariants };
