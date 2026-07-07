/**
 * Scrape harness entry — renders ONE component variant combination in
 * isolation, driven by URL query params, so Playwright can read its exact
 * computed geometry. The real v2 stylesheet is imported so the full Tailwind
 * pipeline resolves (primitive → semantic → utility), giving true pixels.
 *
 *   ?component=Button&Variant=default&Size=md&Disabled=false
 *
 * Registry is explicit (not dynamic import) so Vite bundles only what we scrape
 * and the mapping from Figma-property → React-prop is unambiguous.
 */
import { createRoot } from "react-dom/client";
import "./harness.css";
import { Button } from "../../../components/v2/Button/Button";
import buttonDescriptor from "../../../components/v2/Button/Button.figma";
import type { ComponentDescriptor } from "../contracts";

interface Registered {
  descriptor: ComponentDescriptor;
  // Build the React element for a given {FigmaProp: value} combination.
  render: (combo: Record<string, string>) => React.ReactElement;
}

/** Map a Figma-axis value string back to the cva prop value. */
const REGISTRY: Record<string, Registered> = {
  Button: {
    descriptor: buttonDescriptor,
    render: (combo) => (
      <Button
        variant={combo.Variant as never}
        size={combo.Size as never}
        disabled={combo.Disabled === "true"}
      >
        {combo.Size === "icon" ? "▶" : buttonDescriptor.text?.sample ?? "Button"}
      </Button>
    ),
  },
};

function main() {
  const params = new URLSearchParams(location.search);
  const componentName = params.get("component");
  if (!componentName || !REGISTRY[componentName]) {
    document.title = "scrape-error";
    return;
  }
  const combo: Record<string, string> = {};
  params.forEach((v, k) => {
    if (k !== "component") combo[k] = v;
  });

  const root = document.getElementById("scrape-root")!;
  createRoot(root).render(REGISTRY[componentName].render(combo));

  // Signal readiness for Playwright: set a data attr once painted.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => root.setAttribute("data-scrape-ready", "true")),
  );
}

main();
