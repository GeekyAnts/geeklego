import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { defineConfig, type Options } from "tsup";

/**
 * Library build for `@geeklego/ui` (run by `pnpm run build`, and by the Token
 * Editor's Export to CSS via /api/sync-build).
 *
 * dist/ layout
 *   index.js / index.d.ts       ESM entry (the "import" condition)
 *   index.cjs / index.d.cts     CJS entry, one file (the "require" condition)
 *   components/<Name>.js        one ESM entry per module the barrel re-exports —
 *   utils/<name>.js             split points only, not public subpaths
 *   chunks/*.js                 shared code; index.js re-exports from these
 *   styles.d.ts                 types for the CSS-only `./styles` / `./styles-source` exports
 *
 * Tree-shaking: the ESM build is split per component, and package.json declares
 * `"sideEffects": ["**\/*.css"]`, so a bundler drops every component module (and
 * its Radix / recharts / cmdk imports) that the app doesn't use.
 *
 * "use client": esbuild strips module-level directives when bundling. After the
 * build we put `"use client";` back at the top of every output file built from a
 * source file that declared it, so Next.js App Router can import components
 * straight into a Server Component. Outputs made only of server-safe code (cn,
 * sanitizeHref, ARIA helpers, …) stay directive-free and callable on the server.
 */

const OUT_DIR = "dist";

const BARREL = "components/index.ts";

// One split-point entry per module the barrel re-exports (every v2 component and
// shared util): `export … from "./v2/Button/Button"` → dist/components/Button.js,
// `"./utils/security/sanitize"` → dist/utils/sanitize.js. Type-only re-exports are
// skipped. This also keeps dist/index.js a pure re-export file with no
// "use client" of its own.
const splitEntries = Object.fromEntries(
  [...readFileSync(BARREL, "utf8").matchAll(/^export (?!type\b)[^;]*?from ["']\.\/((v2|utils)\/[^"']+)["']/gm)].map(
    ([, path, group]) => {
      const file = [`components/${path}.ts`, `components/${path}.tsx`].find(existsSync);
      if (!file) throw new Error(`tsup.config: cannot resolve ${path} from ${BARREL}`);
      return [`${group === "v2" ? "components" : "utils"}/${basename(path)}`, file];
    },
  ),
);

const USE_CLIENT = /^(?:\s|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*["']use client["']/;

const isClientSource = (path: string) =>
  /\.[cm]?[jt]sx?$/.test(path) && !path.includes("node_modules") && USE_CLIENT.test(readFileSync(path, "utf8"));

interface Metafile {
  outputs: Record<string, { inputs: Record<string, unknown> }>;
}

// Re-add "use client" to each output that bundles at least one client source,
// then delete the metafile so it never ships.
function restoreUseClient(format: "esm" | "cjs") {
  const metafilePath = join(OUT_DIR, `metafile-${format}.json`);
  const { outputs } = JSON.parse(readFileSync(metafilePath, "utf8")) as Metafile;
  for (const [outPath, { inputs }] of Object.entries(outputs)) {
    if (outPath.endsWith(".map") || !Object.keys(inputs).some(isClientSource)) continue;
    const code = readFileSync(outPath, "utf8");
    if (!USE_CLIENT.test(code)) writeFileSync(outPath, `"use client";\n${code}`);
  }
  rmSync(metafilePath);
}

// `./styles` and `./styles-source` are CSS-only; this lets `import "@geeklego/ui/styles"` type-check
// under `noUncheckedSideEffectImports`.
function writeStylesTypes() {
  writeFileSync(join(OUT_DIR, "styles.d.ts"), "export {};\n");
}

const shared: Options = {
  outDir: OUT_DIR,
  target: "es2022",
  metafile: true,
};

export default defineConfig(() => {
  // tsup's own `clean` wipes the whole outDir, which would also delete the
  // token IR / Figma manifests in dist/ir and dist/figma. Clear only JS output.
  for (const path of ["index.js", "index.cjs", "index.d.ts", "index.d.cts", "styles.d.ts", "components", "utils", "chunks"]) {
    rmSync(join(OUT_DIR, path), { recursive: true, force: true });
  }

  return [
    {
      ...shared,
      entry: { index: BARREL, ...splitEntries },
      format: "esm",
      splitting: true,
      dts: { entry: { index: BARREL } },
      esbuildOptions(options) {
        options.chunkNames = "chunks/[name]-[hash]";
      },
      async onSuccess() {
        restoreUseClient("esm");
        writeStylesTypes();
      },
    },
    {
      ...shared,
      entry: { index: BARREL },
      format: "cjs",
      dts: { entry: { index: BARREL } },
      async onSuccess() {
        restoreUseClient("cjs");
      },
    },
  ];
});
