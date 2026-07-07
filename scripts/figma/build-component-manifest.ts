/**
 * build-component-manifest — Phase 2 generator.
 *
 * For each registered component descriptor:
 *   1. expand the pruned cartesian product of cva/declared axes × boolean props
 *   2. render each combination in isolation via the scrape harness (Vite +
 *      the real v2 CSS) and read exact computed geometry with Playwright
 *   3. resolve the scraped class list → token paths (resolve-token.ts)
 *   4. emit component-manifest.json (schema in contracts.ts)
 *
 * The manifest is the plugin's input for Phase 3 (build Figma component sets
 * with auto-layout + variant properties + bound variables).
 *
 * Run:  npx tsx scripts/figma/build-component-manifest.ts [Name ...]
 *   (defaults to all registered; pass "Button" to scope.)
 */
import { spawn, type ChildProcess } from "node:child_process";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, type Browser, type Page } from "playwright";
import buttonDescriptor from "../../components/v2/Button/Button.figma";
import { resolveTokens } from "./resolve-token";
import { parseColor } from "../../figma-plugin/src/token-sync/color";
import type {
  ComponentDescriptor,
  ComponentManifest,
  ComponentManifestEntry,
  Rgba,
  ScrapedGeometry,
  VariantCombination,
} from "./contracts";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "../..");
const HARNESS_URL = "http://localhost:5199";
const OUTPUT = resolve(REPO, "dist/figma/component-manifest.json");

const DESCRIPTORS: ComponentDescriptor[] = [buttonDescriptor];

// ── combo expansion ──────────────────────────────────────────────────────────

interface Axis {
  name: string;
  values: string[];
  defaultValue: string;
}

/** All axes (cva + declared + booleans-as-two-value-axes) for the matrix. */
function axesOf(d: ComponentDescriptor): Axis[] {
  const cva = d.cvaAxes.map((a) => ({
    name: a.name,
    values: a.values,
    defaultValue: a.defaultValue,
  }));
  const declared = d.declaredAxes.map((a) => ({
    name: a.name,
    values: a.values.map((v) => v.value),
    defaultValue: a.defaultValue,
  }));
  const bools = d.booleanProps.map((b) => ({
    name: b.name,
    values: ["false", "true"],
    defaultValue: String(b.defaultValue),
  }));
  return [...cva, ...declared, ...bools];
}

function cartesian(axes: Axis[]): Array<Record<string, string>> {
  return axes.reduce<Array<Record<string, string>>>(
    (acc, axis) =>
      acc.flatMap((combo) =>
        axis.values.map((v) => ({ ...combo, [axis.name]: v })),
      ),
    [{}],
  );
}

function isPruned(
  combo: Record<string, string>,
  prune: Array<Record<string, string>>,
): boolean {
  return prune.some((rule) =>
    Object.entries(rule).every(([k, v]) => combo[k] === v),
  );
}

// ── scrape ─────────────────────────────────────────────────────────────────

/**
 * Runs in the browser: read the box model + RAW color strings + class list.
 * Colors are returned as authored (Chromium preserves oklch()/color() in
 * getComputedStyle), then parsed in Node with the shared parseColor — the same
 * oklch→sRGB path the token sync uses, so scrape and sync agree byte-for-byte.
 */
const SCRAPE_FN = `(() => {
  const root = document.getElementById("scrape-root");
  const el = root && root.firstElementChild;
  if (!el) return null;
  const cs = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const px = (v) => parseFloat(v) || 0;
  const borderW = px(cs.borderTopWidth);
  const transparent = (v) => v === "rgba(0, 0, 0, 0)" || v === "transparent";
  return {
    widthPx: rect.width,
    heightPx: rect.height,
    paddingTop: px(cs.paddingTop),
    paddingRight: px(cs.paddingRight),
    paddingBottom: px(cs.paddingBottom),
    paddingLeft: px(cs.paddingLeft),
    gapPx: px(cs.columnGap || cs.gap),
    cornerRadiusPx: px(cs.borderTopLeftRadius),
    fillCss: transparent(cs.backgroundColor) ? null : cs.backgroundColor,
    borderCss: borderW > 0 && !transparent(cs.borderTopColor) ? cs.borderTopColor : null,
    borderWidthPx: borderW,
    opacity: px(cs.opacity),
    classList: Array.from(el.classList),
    colorCss: cs.color,
    fontFamily: cs.fontFamily,
    fontSizePx: px(cs.fontSize),
    fontWeight: px(cs.fontWeight),
    lineHeightPx: px(cs.lineHeight),
    letterSpacingPx: cs.letterSpacing === "normal" ? 0 : px(cs.letterSpacing),
  };
})()`;

interface RawScrape {
  widthPx: number;
  heightPx: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  gapPx: number;
  cornerRadiusPx: number;
  fillCss: string | null;
  borderCss: string | null;
  borderWidthPx: number;
  opacity: number;
  classList: string[];
  colorCss: string;
  fontFamily: string;
  fontSizePx: number;
  fontWeight: number;
  lineHeightPx: number;
  letterSpacingPx: number;
}

/** Browser may report rgb()/rgba() too; parseColor only knows oklch/hex. */
function anyColor(css: string | null): Rgba | null {
  if (!css) return null;
  const direct = parseColor(css);
  if (direct) return direct;
  const m = /rgba?\(([^)]+)\)/.exec(css);
  if (!m) return null;
  const p = m[1].split(/[,/]/).map((s) => parseFloat(s));
  return { r: p[0] / 255, g: p[1] / 255, b: p[2] / 255, a: p[3] ?? 1 };
}

async function scrapeCombo(
  page: Page,
  component: string,
  combo: Record<string, string>,
): Promise<ScrapedGeometry> {
  const qs = new URLSearchParams({ component, ...combo }).toString();
  await page.goto(`${HARNESS_URL}/?${qs}`, { waitUntil: "networkidle" });
  await page.waitForSelector('#scrape-root[data-scrape-ready="true"]', {
    timeout: 5000,
  });
  const raw = (await page.evaluate(SCRAPE_FN)) as RawScrape | null;
  if (!raw) throw new Error(`scrape returned null for ${component} ${qs}`);

  const tokens = resolveTokens(raw.classList);
  const bind = <T,>(value: T, token: string | null) => ({ value, token });

  const fill = anyColor(raw.fillCss);
  const border = anyColor(raw.borderCss);
  const textColor = anyColor(raw.colorCss);

  return {
    widthPx: raw.widthPx,
    heightPx: raw.heightPx,
    paddingPx: {
      top: bind(raw.paddingTop, null),
      right: bind(raw.paddingRight, null),
      bottom: bind(raw.paddingBottom, null),
      left: bind(raw.paddingLeft, null),
    },
    gapPx: bind(raw.gapPx, null),
    cornerRadiusPx: bind(raw.cornerRadiusPx, tokens.radius),
    fill: fill ? bind(fill, tokens.fill) : null,
    stroke:
      border && raw.borderWidthPx > 0
        ? { color: bind(border, tokens.border), weightPx: raw.borderWidthPx }
        : null,
    opacity: raw.opacity,
    classList: raw.classList,
    typography: textColor
      ? {
          fontFamily: bind(raw.fontFamily.split(",")[0].replace(/["']/g, "").trim(), null),
          fontSizePx: bind(raw.fontSizePx, null),
          fontWeight: bind(raw.fontWeight, null),
          lineHeightPx: bind(raw.lineHeightPx, null),
          letterSpacingPx: bind(raw.letterSpacingPx, null),
          textColor: bind(textColor, tokens.text),
        }
      : null,
  };
}

// ── orchestration ────────────────────────────────────────────────────────────

async function waitForServer(url: string, timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`harness did not start at ${url}`);
}

async function buildEntry(
  page: Page,
  d: ComponentDescriptor,
): Promise<ComponentManifestEntry> {
  const axes = axesOf(d);
  const combos = cartesian(axes).filter((c) => !isPruned(c, d.prune));
  console.log(`  ${d.name}: ${combos.length} combinations (after pruning)`);

  const combinations: VariantCombination[] = [];
  for (const combo of combos) {
    const geometry = await scrapeCombo(page, d.name, combo);
    combinations.push({ properties: combo, geometry });
  }

  return {
    name: d.name,
    axes: axes.map((a) => ({
      name: a.name,
      values: a.values,
      defaultValue: a.defaultValue,
    })),
    booleanProps: d.booleanProps.map((b) => ({
      name: b.name,
      defaultValue: b.defaultValue,
    })),
    text: d.text ? { name: d.text.name, sample: d.text.sample } : null,
    combinations,
  };
}

async function main() {
  const only = process.argv.slice(2);
  const descriptors = only.length
    ? DESCRIPTORS.filter((d) => only.includes(d.name))
    : DESCRIPTORS;
  if (!descriptors.length) throw new Error(`no descriptors match ${only.join(", ")}`);

  // IR source stamp — warn later if the scrape drifts from the synced tokens.
  const ir = JSON.parse(readFileSync(resolve(REPO, "dist/ir/tokens.json"), "utf8"));
  const irMeta = ir.$extensions?.["com.geeklego.ir"];
  const irSource = irMeta ? `${irMeta.source}@${irMeta.version}` : "unknown";

  console.log("Starting scrape harness…");
  const server: ChildProcess = spawn(
    "npx",
    ["vite", "--config", "scripts/figma/scrape-harness/vite.config.mts"],
    { cwd: REPO, stdio: "ignore" },
  );

  let browser: Browser | undefined;
  try {
    await waitForServer(HARNESS_URL);
    browser = await chromium.launch();
    const page = await browser.newPage({ deviceScaleFactor: 1 });

    const components: ComponentManifestEntry[] = [];
    for (const d of descriptors) {
      console.log(`Scraping ${d.name}…`);
      components.push(await buildEntry(page, d));
    }

    const manifest: ComponentManifest = {
      $schema: "geeklego-figma-component-manifest",
      version: 1,
      irSource,
      components,
    };
    mkdirSync(dirname(OUTPUT), { recursive: true });
    writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2));
    console.log(`✓ wrote ${OUTPUT} (${components.length} components)`);
  } finally {
    await browser?.close();
    server.kill();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
