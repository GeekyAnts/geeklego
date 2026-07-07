import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

/**
 * GeekLego ESLint flat config.
 *
 * The base JS recommended config applies repo-wide. A dedicated TypeScript
 * block (parser + plugin) lints `.ts`/`.tsx` files — without it, nothing under
 * `components/v2/` was being checked.
 *
 * The v2 import-discipline block encodes PROTOTYPE-SHADCN-2TIER.md §6.5:
 * v2 code must not entangle with the frozen 3-tier system, and v2 files must
 * import from each other by relative path (never by package name).
 *
 * On the atomic leaf-vs-composite dependency graph: that is a *composition*
 * discipline (decompose → build leaves → compose), enforced at authoring time
 * by the component-builder-v2 skill, not a stable, file-level lint rule. A
 * per-file leaf/composite allowlist would be brittle and would fight ordinary
 * refactors. §6.5 scopes ESLint to "the dependency rule, not folder tiers", so
 * the enforceable contract here is the frozen-code ban + relative-import rule.
 */
export default tseslint.config(
  {
    // `.claude/` holds skill definitions and skill-eval scratch outputs (e.g.
    // component-builder-v2-workspace/**), not shipped source — never lint it.
    // `storybook-static` is the Storybook build artifact (gitignored, like dist) —
    // minified output, never lint it.
    ignores: [
      "dist",
      "**/dist/**",
      "storybook-static",
      "node_modules",
      ".next",
      ".claude/**",
    ],
  },

  // Base JS recommended (applies to .js/.mjs/.cjs). `no-undef` is disabled
  // repo-wide as before — Node/browser globals aren't worth enumerating here
  // and TypeScript already checks symbol resolution for the typed files.
  js.configs.recommended,
  {
    rules: {
      "no-undef": "off",
    },
  },

  // TypeScript: register the parser + plugin so .ts/.tsx are actually linted.
  // Also registers eslint-plugin-react-hooks so hook code is actually checked
  // and the `react-hooks/exhaustive-deps` disable-comments scattered through
  // app/ resolve to a real rule instead of erroring ("rule definition not found").
  {
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommended],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-undef": "off",
      // rules-of-hooks catches genuine bugs — hard error.
      "react-hooks/rules-of-hooks": "error",
      // exhaustive-deps is advisory here — surfaced as a warning, not gate-blocking.
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // Storybook story files legitimately call hooks (useState/useMemo) inside
  // `render` functions, which are components but don't match the rule's
  // name-based heuristic (they're arrow props named `render`, not Uppercase
  // components). Relax rules-of-hooks to a warning for stories only; exhaustive-deps
  // stays a warning everywhere already.
  {
    files: ["**/*.stories.{ts,tsx}"],
    rules: {
      "react-hooks/rules-of-hooks": "warn",
      // Ban render-time document-root mutation in stories. A decorator that does
      // `document.documentElement.setAttribute(...)` / `.classList.add(...)` in
      // its body (rather than a useEffect) re-runs the DOM write on every render;
      // under Strict Mode + Radix re-renders (popper reposition, cmdk per-keystroke
      // filtering) this forces a full-document style recalc per interaction and
      // FREEZES the Storybook renderer — plus it leaks the theme onto other stories.
      // Portalled dark-mode stories must use the withDarkPortalRoot decorator
      // (components/v2/lib/dark-portal-decorator.tsx), which toggles in a useEffect
      // with cleanup. This rule makes the freeze-causing pattern un-introducible.
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "MemberExpression[object.object.name='document'][object.property.name='documentElement']",
          message:
            "Don't mutate document.documentElement in a story/decorator render path — it re-runs every render and freezes the Storybook renderer. Use the withDarkPortalRoot decorator (components/v2/lib/dark-portal-decorator.tsx) for portalled dark-mode stories.",
        },
      ],
    },
  },

  // Repo-wide import guardrail: ban @storybook/react. This repo's Storybook
  // framework is @storybook/react-vite — @storybook/react is not installed, and
  // importing it breaks tsc (TS2307) and the build. This stops the mistake from
  // recurring. (Kept in its own block: it uses `paths`, while the v2 block below
  // uses `patterns` for a different, narrower scope — they don't conflict.)
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@storybook/react",
              message:
                "Use @storybook/react-vite — this repo's Storybook framework. @storybook/react is not installed.",
            },
          ],
        },
      ],
    },
  },

  // v2 import discipline (PROTOTYPE-SHADCN-2TIER.md §6.5).
  {
    files: ["components/v2/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          // `no-restricted-imports` does NOT merge across config blocks — the
          // last matching block wins outright. So the repo-wide @storybook/react
          // `paths` ban is re-declared here; otherwise v2 stories would silently
          // lose it and could reintroduce the bad import.
          paths: [
            {
              name: "@storybook/react",
              message:
                "Use @storybook/react-vite — this repo's Storybook framework. @storybook/react is not installed.",
            },
          ],
          patterns: [
            {
              // Frozen 3-tier component code — never import, extend, or re-export.
              group: [
                "**/components/atoms/**",
                "**/components/molecules/**",
                "**/components/organisms/**",
                "**/atoms/**",
                "**/molecules/**",
                "**/organisms/**",
              ],
              message:
                "v2 must not import from the frozen 3-tier components (atoms/molecules/organisms). Build under components/v2/ instead. See PROTOTYPE-SHADCN-2TIER.md §6.5.",
            },
            {
              // Frozen 3-tier stylesheet — v2 imports design-system/v2/index.css only.
              group: ["**/design-system/geeklego.css"],
              message:
                "v2 must not reference the frozen 3-tier design-system/geeklego.css. Import design-system/v2/index.css only. See CLAUDE.md.",
            },
            {
              // No package-path self-imports between v2 files — relative only.
              group: ["@geeklego/ui", "@geeklego/ui/**"],
              message:
                "Use relative imports between v2 files — never the package path. See CLAUDE.md hard rule #13.",
            },
          ],
        },
      ],
    },
  },
);
