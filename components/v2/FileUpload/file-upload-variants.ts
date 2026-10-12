import { cva, type VariantProps } from "class-variance-authority";

/**
 * FileUpload variants — ShadCN pattern on geeklego's 2-tier semantics.
 *
 * The dropzone is styled entirely with standard ShadCN/Tailwind semantic
 * utilities (border-input, bg-background, text-muted-foreground, ring-ring …) —
 * zero custom vocabulary. The `error` variant reuses the standard --destructive
 * semantics rather than inventing brand tokens, so it themes for free.
 *
 * Drag-over emphasis is driven by a `data-dragging` attribute (set from local
 * state on the component), keeping the "look" here and the behavior in the TSX.
 */
export const dropzoneVariants = cva(
  // base — shared by every variant
  [
    "relative flex w-full flex-col items-center justify-center gap-3 text-center",
    "rounded-lg border border-dashed bg-background",
    "transition-colors duration-200 ease-out",
    "cursor-pointer select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-input text-muted-foreground",
          "hover:border-border-strong hover:bg-muted/50",
          "focus-visible:ring-ring",
          "data-[dragging=true]:border-ring data-[dragging=true]:bg-accent data-[dragging=true]:text-accent-foreground",
        ].join(" "),
        error: [
          "border-destructive text-destructive",
          "hover:bg-destructive/10",
          "focus-visible:ring-destructive",
          "data-[dragging=true]:border-destructive data-[dragging=true]:bg-destructive/10",
        ].join(" "),
      },
      size: {
        sm: "min-h-28 p-4 text-xs",
        md: "min-h-40 p-6 text-sm",
        lg: "min-h-52 p-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export type DropzoneVariantProps = VariantProps<typeof dropzoneVariants>;
