"use client";
import type { CSSProperties } from "react";
import { Toaster as SonnerToaster, toast } from "sonner";
import type { ToasterProps } from "./Sonner.types";

/**
 * Sonner's injected stylesheet is unlayered, so it beats every Tailwind utility
 * (which live in @layer utilities). Its toast surface reads --normal-bg /
 * --normal-text / --normal-border, set per `data-sonner-theme` on the toaster
 * (default "light" → #fff). Re-pointing those vars at our semantics via inline
 * custom properties (inline beats any stylesheet rule) makes the surface follow
 * the host's `.dark` / data-theme live, with no `theme` prop needed.
 */
const semanticSurface = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
} as CSSProperties;

/**
 * Sonner (Toaster) — ShadCN pattern on geeklego's 2-tier tokens, built on the
 * `sonner` library (category B). Sonner owns ALL behaviour — the toast queue,
 * stacking, swipe-to-dismiss, timers, promise toasts, and the ARIA live-region
 * announcements. We only restyle its parts via toastOptions.classNames using
 * standard semantic utilities (bg-popover, text-popover-foreground, border-border
 * …) so toasts match the rest of the system in both light and dark.
 *
 * Render <Toaster /> once near the app root, then fire toasts imperatively with
 * the re-exported `toast()` (toast.success / .error / .promise / …). Theming
 * follows the host's `.dark` / data-theme through the semantic surface vars
 * above; `theme` and `style` stay overridable through props.
 */
export const Toaster = ({ style, ...props }: ToasterProps) => (
  <SonnerToaster
    className="toaster group"
    style={{ ...semanticSurface, ...style }}
    toastOptions={{
      classNames: {
        toast:
          "group toast group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:rounded-lg group-[.toaster]:shadow-lg",
        // `!` — sonner hardcodes the description colour (#3f3f3f) unlayered.
        description: "group-[.toast]:text-muted-foreground!",
        actionButton:
          "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-md",
        cancelButton:
          "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-md",
        closeButton:
          "group-[.toast]:bg-popover group-[.toast]:text-foreground group-[.toast]:border-border",
        error:
          "group-[.toaster]:border-destructive group-[.toaster]:text-destructive",
        success: "group-[.toaster]:text-foreground",
      },
    }}
    {...props}
  />
);
Toaster.displayName = "Toaster";

// Re-export sonner's imperative API so consumers import everything from one place.
export { toast };
