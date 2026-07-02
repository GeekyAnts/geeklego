/**
 * Build config for the plugin SANDBOX bundle only (src/code.ts → dist/code.js,
 * single IIFE — Figma's main thread has no module loader). The UI needs no
 * build: manifest.json points straight at src/ui.html (inline vanilla JS).
 *
 * The current IR is injected at build time via `define`, so the plugin ships
 * version-locked tokens and "Sync Tokens" needs zero input. Run through
 * `pnpm run figma-plugin:build`, which regenerates the IR first.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const irPath = fileURLToPath(new URL("../dist/ir/tokens.json", import.meta.url));
const irJson = readFileSync(irPath, "utf8");

// Component manifest is optional at build time — an empty {components:[]} keeps
// the plugin buildable before the first scrape run.
const manifestPath = fileURLToPath(
  new URL("../dist/figma/component-manifest.json", import.meta.url),
);
let componentJson = '{"$schema":"geeklego-figma-component-manifest","version":1,"irSource":"none","components":[]}';
try {
  componentJson = readFileSync(manifestPath, "utf8");
} catch {
  /* not generated yet — ship the empty manifest */
}

export default defineConfig({
  define: {
    // Double-stringify: the sandbox declares `const __BAKED_*_JSON__: string`
    // and JSON.parses it at runtime.
    __BAKED_IR_JSON__: JSON.stringify(irJson),
    __BAKED_COMPONENT_MANIFEST_JSON__: JSON.stringify(componentJson),
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/code.ts", import.meta.url)),
      formats: ["iife"],
      name: "GeekLegoSyncPlugin",
      fileName: () => "code.js",
    },
    outDir: fileURLToPath(new URL("./dist", import.meta.url)),
    emptyOutDir: true,
    target: "es2017",
    minify: false,
  },
});
