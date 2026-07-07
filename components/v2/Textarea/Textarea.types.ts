import type { TextareaHTMLAttributes } from "react";
import type { TextareaVariantProps } from "./textarea-variants";

/**
 * Textarea props — native <textarea> attributes plus the cva variant axes.
 *
 * The size axis is exposed as `textareaSize` (not `size`) to avoid shadowing a
 * future native attribute and to stay parallel with Input's `inputSize`.
 */
export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    TextareaVariantProps {}
