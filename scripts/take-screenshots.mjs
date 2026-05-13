// Screenshot script for token editor docs
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../../../apps/geeklego-site/public/assets/screenshots/token-editor');

const BASE = 'http://localhost:5173';
const VIEWPORT = { width: 1440, height: 900 };

/** Scroll sidebar to bottom and click Export nav button */
async function clickExport(page) {
  await page.evaluate(() => {
    const sidebar = Array.from(document.querySelectorAll('div[class]')).find(el => {
      const style = window.getComputedStyle(el);
      return (style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > 2000;
    });
    if (sidebar) sidebar.scrollTop = sidebar.scrollHeight;
  });
  await page.waitForTimeout(200);
  const exportBtn = page.locator('button').filter({ hasText: /^Export$/ });
  await exportBtn.click({ force: true });
  await page.waitForTimeout(1000);
}

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize(VIEWPORT);

  // ── 1. Overview ──────────────────────────────────────────────────────────────
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT_DIR}/overview.png` });
  console.log('✓ overview.png');

  // ── 3. Tab bar — full screenshot showing sidebar navigation ─────────────────
  await page.screenshot({ path: `${OUT_DIR}/tab-bar.png` });
  console.log('✓ tab-bar.png');

  // ── 4. OKLCH color picker ─────────────────────────────────────────────────────
  await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div[style]'));
    const swatch = divs.find(d => d.style.cursor === 'pointer' && d.style.width === '22px');
    if (swatch) swatch.click();
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT_DIR}/oklch-picker.png` });
  console.log('✓ oklch-picker.png');

  // ── 5. Export tab ─────────────────────────────────────────────────────────────
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await clickExport(page);
  await page.screenshot({ path: `${OUT_DIR}/export-tab.png` });
  console.log('✓ export-tab.png');

  // ── 7. Validation panel ───────────────────────────────────────────────────────
  // The app fetches tokens from /api/load-tokens on mount and overwrites localStorage.
  // Intercept that request and return corrupted tokens to trigger validation warnings.
  await page.route('**/api/load-tokens', async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    // Corrupt leaf values in semantics.light groups → hardcoded hex → validator warnings
    if (json.tokens?.semantics?.light) {
      let count = 0;
      for (const group of Object.values(json.tokens.semantics.light)) {
        if (count >= 6) break;
        if (group && typeof group === 'object') {
          for (const key of Object.keys(group)) {
            if (count >= 6) break;
            group[key] = '#ff0000';
            count++;
          }
        }
      }
    }
    await route.fulfill({ json });
  });

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500); // wait for validation debounce (300ms) + render

  await clickExport(page);

  // Click validation toggle button (shows "N warnings" or "N errors")
  const validToggle = page.locator('button').filter({ hasText: /error|warning|blocker/i }).first();
  if (await validToggle.count() > 0) {
    await validToggle.click({ force: true });
    await page.waitForTimeout(500);
    console.log('Validation panel expanded');
  } else {
    console.log('No validation toggle found — capturing export tab as fallback');
  }

  await page.screenshot({ path: `${OUT_DIR}/validation-panel.png` });
  console.log('✓ validation-panel.png');

  // Unroute so restored browser has clean state
  await page.unroute('**/api/load-tokens');

  await browser.close();
  console.log('\nAll screenshots saved to:', OUT_DIR);
}

run().catch(err => { console.error(err); process.exit(1); });
