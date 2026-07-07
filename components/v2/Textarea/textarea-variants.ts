import { cva, type VariantProps } from "class-variance-authority";

/**
 * Textarea variants — ShadCN pattern on geeklego's 2-tier semantics.
 *
 * Mirrors the Input variants (this is the multi-line sibling), styled entirely
 * with standard ShadCN/Tailwind semantic utilities (border-input, bg-background,
 * ring-ring, text-foreground …) — zero custom vocabulary. The `error` variant
 * reuses the standard --destructive semantics, so it themes for free.
 */
export const textareaVariants = cva(
  // base — shared by every variant
  [
    "flex w-full min-w-0 rounded-md border bg-background text-foreground",
    "field-sizing-content shadow-xs transition-colors duration-150 ease-out",
    "placeholder:text-muted-foreground",
    "selection:bg-primary selection:text-primary-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "border-input focus-visible:ring-ring",
        error:
          "border-destructive focus-visible:ring-destructive text-foreground",
      },
      textareaSize: {
        sm: "min-h-16 px-2.5 py-1.5 text-xs",
        md: "min-h-20 px-3 py-2 text-sm",
        lg: "min-h-24 px-4 py-2.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      textareaSize: "md",
    },
  },
);

export type TextareaVariantProps = VariantProps<typeof textareaVariants>;
