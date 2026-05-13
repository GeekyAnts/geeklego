# Screenshot Workflow

## Foundation

This skill automates visual verification of Geeklego components by capturing screenshots from Storybook via Playwright, analyzing them for design issues, and iterating until the component looks production-grade.

**When to use this skill:** After creating or modifying any component, after changing design tokens, or whenever visual verification is needed. Use it as part of Phase 3 (Verification) of the component-builder skill, or standalone when debugging visual issues.

**Prerequisites:**
- Playwright is installed (`playwright` in devDependencies)
- Storybook is configured (`.storybook/`)
- Components have the standard 7-story structure

---

## Workflow — Capture, Analyze, Fix, Verify

```
Step 1 — Ensure Storybook is running
Step 2 — Discover story IDs for the target component
Step 3 — Capture screenshots of all stories
Step 4 — Analyze screenshots for design issues
Step 5 — Fix issues found
Step 6 — Recapture and verify (max 3 iterations)
```

---

## Step 1 — Ensure Storybook is Running

Check if Storybook is already serving. Try common ports in order:

```bash
curl -s http://localhost:6006 > /dev/null 2>&1 && echo "running:6006" || \
curl -s http://localhost:6007 > /dev/null 2>&1 && echo "running:6007" || \
curl -s http://localhost:6008 > /dev/null 2>&1 && echo "running:6008" || \
echo "not running"
```

If not running, start it in the background:

```bash
npm run storybook -- --port 6006 --no-open &
```

Wait for Storybook to be ready before proceeding (poll with `curl` every 3 seconds, max 60 seconds).

---

## Step 2 — Discover Story IDs

Query the Storybook index to find all stories for the target component:

```bash
curl -s http://localhost:<PORT>/index.json | python3 -c "
import sys, json
d = json.load(sys.stdin)
entries = d.get('entries', d.get('v', {}))
component = '<component-name-lowercase>'
stories = [k for k in entries.keys() if component in k.lower()]
for s in stories:
    print(s)
"
```

The standard 7 stories for each Geeklego component are:
- `<level>-<name>--default`
- `<level>-<name>--variants`
- `<level>-<name>--sizes`
- `<level>-<name>--states`
- `<level>-<name>--dark-mode`
- `<level>-<name>--playground`

Plus any additional custom stories (e.g., `--with-avatar`, `--with-icons`).

---

## Step 3 — Capture Screenshots

Use a single Playwright script to capture all stories. This avoids the overhead of launching a new browser for each story.

```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 900 } });
  const port = <PORT>;
  const stories = [<STORY_IDS>];  // array of story IDs
  const outDir = '/tmp/screenshots/<component>';

  for (const story of stories) {
    const url = `http://localhost:${port}/iframe.html?id=${story}&viewMode=story`;
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);  // allow animations to settle
    await page.screenshot({
      path: `${outDir}/${story}.png`,
      fullPage: true
    });
    console.log(`captured: ${story}`);
  }

  await browser.close();
})();
```

Run the script:
```bash
mkdir -p /tmp/screenshots/<component>
node -e "<script>"
```

The `waitForTimeout(2000)` is important — Storybook iframes need time to hydrate after `networkidle`. For the first screenshot in a session, use 3000ms since Storybook's initial load is slower.

---

## Step 4 — Analyze Screenshots

Read each screenshot using the Read tool and check for these issues:

### Design Quality Checklist

**Layout & Spacing**
- [ ] Content is properly aligned (not floating off-center)
- [ ] Internal spacing feels balanced (padding, gaps)
- [ ] Title and description have correct visual hierarchy
- [ ] Media/content/actions are properly distributed across the row
- [ ] No unexpected overflow or clipping

**Typography**
- [ ] Title text is visibly bolder/heavier than description
- [ ] Text sizes feel proportional to the component size
- [ ] Text is not truncated when it shouldn't be (or is truncated when it should be)

**Visual Variants**
- [ ] Each variant is visually distinct at a glance
  - Default: has visible background fill
  - Outlined: has visible border, different from default
  - Elevated: has visible shadow, lifts from surface
  - Ghost: appears transparent/minimal
- [ ] Variants use different visual strategies (not just color shifts)

**States**
- [ ] Disabled state is visibly muted (reduced opacity/contrast)
- [ ] Selected state is clearly highlighted
- [ ] Loading skeleton maintains component dimensions
- [ ] Skeleton animation placeholders are visible

**Theme Verification**
- [ ] Dark mode: text is readable against dark background
- [ ] Dark mode: borders are visible (not same shade as background)
- [ ] Dark mode: shadows are perceptible
- [ ] All themes produce visibly different results

**Component Integrity**
- [ ] All expected slots are rendering (media, title, description, actions)
- [ ] Icons are properly sized and colored
- [ ] Border radius is consistent across variants
- [ ] Component fills expected width

### Common Issues to Watch For

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Invisible text on dark bg | Token resolving to same shade | Check `--color-text-*` dark mode overrides |
| No visible border on outlined | Border color too subtle or transparent | Check `--item-outlined-border` token |
| Shadow invisible in dark | Shadow color too light for dark bg | May need split theme selector |
| Huge gap between title/desc | Content gap token too large | Reduce `--item-content-gap` |
| Component too narrow/short | Min-height or padding tokens | Check size tokens |
| Typography same weight | Using body instead of label class | Use `text-label-*` for titles |
| Variants look identical | Same visual strategy | Ensure different bg/border/shadow approaches |

---

## Step 5 — Fix Issues

When issues are found:

1. **Token issues** → Edit `design-system/geeklego.css`
2. **Class/layout issues** → Edit the component `.tsx` file
3. **Story issues** → Edit the `.stories.tsx` file

After fixing, proceed to Step 6.

---

## Step 6 — Recapture and Verify

After fixing issues, recapture the affected screenshots and re-analyze. Maximum 3 iterations before presenting to the user for feedback.

Each iteration:
1. Recapture only the stories affected by changes
2. Re-read the screenshots
3. Check if the specific issue is resolved
4. Check for regressions in other stories

When satisfied (or after 3 iterations), present a summary:

```
## Visual Verification Summary

**Component:** [name]
**Stories captured:** [count]
**Iterations:** [N]

### Issues found and fixed:
- [issue 1] → [fix applied]
- [issue 2] → [fix applied]

### Remaining concerns:
- [any unresolved items for user review]
```

---

## Viewport Sizes

Use these viewport sizes based on what you're capturing:

| Context | Width | Height | When to use |
|---------|-------|--------|-------------|
| Component stories | 800 | 900 | Default for all component screenshots |
| Wide components | 1200 | 900 | Tables, headers, full-width layouts |
| Mobile preview | 375 | 812 | Responsive testing |

---

## Integration with Component Builder

When used as part of the component-builder skill's Phase 3:

1. After writing all 5 component files, run this screenshot workflow
2. Capture all 7+ standard stories
3. Analyze against the design quality checklist
4. Fix any issues found before presenting the component as complete

This replaces the manual "eyeball check" in the verification checklist with automated visual capture and AI analysis.

---

## Quick Reference — Single Component Screenshot

For a fast single-story capture (e.g., during iterative debugging):

```bash
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 800, height: 900 } });
  await page.goto('http://localhost:<PORT>/iframe.html?id=<STORY_ID>&viewMode=story', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/<name>.png', fullPage: true });
  await browser.close();
})();
"
```

Then read the screenshot with the Read tool to analyze it visually.
