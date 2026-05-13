# Component Sync — Detailed Reference

This file contains the complete workflow for creating a Figma component from a React component in the codebase. Read this when the user says "sync component [Name]".

---

## Table of Contents

1. [Parse the Component](#1-parse-the-component)
2. [Ensure Token Foundation](#2-ensure-token-foundation)
3. [Ensure Dependencies](#3-ensure-dependencies)
4. [Build the Figma Component](#4-build-the-figma-component)
5. [Auto-Layout Mapping](#5-auto-layout-mapping)
6. [Variable Binding](#6-variable-binding)
7. [Variant Generation](#7-variant-generation)
8. [Component Properties](#8-component-properties)
9. [Special Element Handling](#9-special-element-handling)
10. [Verification](#10-verification)

---

## 1. Parse the Component

Read the component's 5 files:

```
components/{tier}/{ComponentName}/
├── {ComponentName}.tsx          ← structure, variants, dependencies
├── {ComponentName}.types.ts     ← props interface (variants, sizes, states)
├── {ComponentName}.stories.tsx  ← variant examples
├── README.md                    ← documentation
└── mock-data.json              ← sample data
```

Extract:

### From `.types.ts`:
- **Variant prop values** — e.g., `variant?: 'primary' | 'secondary' | 'ghost'`
- **Size prop values** — e.g., `size?: 'sm' | 'md' | 'lg'`
- **Boolean feature flags** — e.g., `showIcon?: boolean`, `stacked?: boolean`
- **Content props** — `title`, `description`, `label` (become TEXT component properties)

### From `.tsx`:
- **Import statements** — which atoms/molecules are used
- **Variant class maps** — `Record<Variant, string>` objects mapping variants to Tailwind classes
- **JSX structure** — the component hierarchy (what wraps what)
- **Token references** — all `var(--component-token)` patterns
- **Static layout** — flex direction, gap, padding, alignment from Tailwind classes

### From `geeklego.css`:
- **Component token block** — all `--{component}-*` tokens and their semantic aliases
- **Theme overrides** — dark mode differences (e.g., shadow changes)

### Tier Classification

| Tier | Rule | Example |
|---|---|---|
| L1 Atom | No component imports | Button, Input, Avatar, Divider |
| L2 Molecule | Imports L1 only | Breadcrumb (imports BreadcrumbItem) |
| L3 Organism | Imports L2 + L1 | AreaChart (imports Button, Select, Divider) |

---

## 2. Ensure Token Foundation

Before building the component, verify its tokens exist in Figma.

> **Component Token Isolation:** During this step, inject ONLY the tokens needed for the component being synced. Never create tokens for other components as a side effect. If primitives or semantics are missing, create those — they are shared infrastructure — but `03 · Component` receives new entries only for the requested component. For example, syncing Button must not cause sidebar or modal tokens to be created.

### Check component tokens

```js
const allVars = await figma.variables.getLocalVariablesAsync();
const componentPrefix = 'areachart/'; // or 'button/', 'sidebar/', etc.
const existing = allVars.filter(v => v.name.startsWith(componentPrefix));
return existing.map(v => v.name);
```

If missing, inject them:
1. Parse the component token block from `geeklego.css`
2. Look up the semantic variables they alias
3. Create each variable in the `03 · Component` collection with proper scoping and descriptions

### Check semantic dependencies

Also verify the semantic tokens that the component tokens alias exist in `02 · Semantic`. If not, create those too (with proper primitive aliases).

---

## 3. Ensure Dependencies

For L2+ components, check if dependent Figma components exist. **Always search all pages** — atoms live on the `Atoms` page, not `figma.currentPage`:

```js
await figma.loadAllPagesAsync();
const allComponents = [];
for (const p of figma.root.children) {
  const found = p.findAll(n => n.type === 'COMPONENT' || n.type === 'COMPONENT_SET');
  found.forEach(c => allComponents.push({ name: c.name, id: c.id, type: c.type, page: p.name }));
}
return allComponents;
```

### Dependency map (from existing components)

| Component | Tier | Dependencies |
|---|---|---|
| Button | L1 | none |
| Avatar | L1 | none |
| Divider | L1 | none |
| NavItem | L1 | none |
| Select | L1 | none |
| Item | L1 | none |
| Input | L1 | none |
| Label | L1 | none |
| BreadcrumbItem | L1 | none |
| Breadcrumb | L2 | BreadcrumbItem |
| TreeView | L2 | TreeItem |
| Sidebar | L3 | Button, NavItem, Divider |
| AreaChart | L3 | Button, Select, Divider |
| BarChart | L3 | Button, Select, Divider |

If dependencies are missing, present the build order to the user:

```
To sync AreaChart, I need to create these Figma components first:
1. Button (L1 atom)
2. Select (L1 atom)
3. Divider (L1 atom)
4. AreaChart (L3 organism)

Should I proceed with all 4?
```

Build bottom-up — atoms first, then molecules, then the target organism.

---

## 4. Build the Figma Component

Use `figma_execute` with 30000ms timeout. The general pattern:

```js
// Load fonts
await Promise.all([
  figma.loadFontAsync({family:'Inter', style:'Regular'}),
  figma.loadFontAsync({family:'Inter', style:'Medium'}),
  figma.loadFontAsync({family:'Inter', style:'Semi Bold'}),
  figma.loadFontAsync({family:'Inter', style:'Bold'}),
]);

// Look up variables for binding
const allVars = await figma.variables.getLocalVariablesAsync();
const vMap = {};
allVars.forEach(v => { vMap[v.name] = v; });

// Helper to bind a variable to a node property
const bind = (node, prop, varName) => {
  const v = vMap[varName];
  if (v) try { node.setBoundVariable(prop, v); } catch(e) {}
};

// Helper to set fill from variable
const fillVar = (node, varName) => {
  const v = vMap[varName];
  if (v) {
    node.fills = [figma.variables.setBoundVariableForPaint(
      { type: 'SOLID', color: {r:0,g:0,b:0} }, 'color', v
    )];
  }
};

// Create the component
const comp = figma.createComponent();
comp.name = 'ComponentName';
// ... build structure
```

### Instantiating Atom Dependencies (L2+ only)

For any atom this component imports, **find the existing Figma component and create an instance** — never rebuild the atom from scratch:

```js
// Helper: find a component by name across all pages
async function findComponent(name) {
  await figma.loadAllPagesAsync();
  for (const p of figma.root.children) {
    const found = p.findOne(n =>
      (n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') && n.name === name
    );
    if (found) return found;
  }
  return null;
}

// Example: AreaChart uses Select
const selectComp = await findComponent('Select');
if (selectComp) {
  const base = selectComp.type === 'COMPONENT_SET' ? selectComp.defaultVariant : selectComp;
  const selectInst = base.createInstance();
  selectInst.name = 'Time Range Selector';
  // Optionally set a variant property: selectInst.setProperties({ Size: 'md', State: 'Closed' });
  headerFrame.appendChild(selectInst);
}
```

If the atom component is not found, stop and present the dependency build order to the user before continuing.

### Component vs Frame

- **Figma Component** (`figma.createComponent()`) — for the top-level element that designers will instance
- **Frame** (`figma.createFrame()`) — for internal layout containers (rows, columns, sections)
- **Rectangle** (`figma.createRectangle()`) — for decorative fills, color swatches
- **Text** (`figma.createText()`) — for text content

---

## 5. Auto-Layout Mapping

Map React/Tailwind layout patterns to Figma auto-layout:

| Tailwind Class | Figma Auto-Layout Property |
|---|---|
| `flex flex-col` | `layoutMode = 'VERTICAL'` |
| `flex flex-row` / `flex` | `layoutMode = 'HORIZONTAL'` |
| `items-center` | `counterAxisAlignItems = 'CENTER'` |
| `items-start` | `counterAxisAlignItems = 'MIN'` |
| `items-end` | `counterAxisAlignItems = 'MAX'` |
| `items-baseline` | `counterAxisAlignItems = 'BASELINE'` |
| `justify-center` | `primaryAxisAlignItems = 'CENTER'` |
| `justify-between` | `primaryAxisAlignItems = 'SPACE_BETWEEN'` |
| `justify-start` | `primaryAxisAlignItems = 'MIN'` |
| `gap-[var(--token)]` | `itemSpacing = value` + bind variable |
| `p-[var(--token)]` | `paddingLeft/Right/Top/Bottom = value` + bind |
| `px-[var(--token)]` | `paddingLeft = paddingRight = value` + bind |
| `py-[var(--token)]` | `paddingTop = paddingBottom = value` + bind |
| `flex-wrap` | `layoutWrap = 'WRAP'` |
| `w-full` | `layoutSizingHorizontal = 'FILL'` |
| `flex-1` / `flex-grow` | `layoutGrow = 1` |
| `flex-shrink-0` | `layoutGrow = 0` (fixed size) |

### Child sizing

```js
// Fill container (like w-full or flex-1)
child.layoutSizingHorizontal = 'FILL';

// Hug contents (auto-size)
child.layoutSizingHorizontal = 'HUG';

// Fixed size
child.resize(width, height);
child.layoutSizingHorizontal = 'FIXED';
```

### Example: Card shell pattern

```js
const card = figma.createComponent();
card.name = 'AreaChart';
card.layoutMode = 'VERTICAL';
card.primaryAxisSizingMode = 'AUTO';
card.counterAxisSizingMode = 'FIXED';
card.resize(600, 10); // width fixed, height auto
card.layoutSizingVertical = 'HUG';

// Bind padding to token
bind(card, 'paddingLeft', 'areachart/padding');
bind(card, 'paddingRight', 'areachart/padding');
bind(card, 'paddingTop', 'areachart/padding');
bind(card, 'paddingBottom', 'areachart/padding');

// Bind gap
bind(card, 'itemSpacing', 'areachart/section-gap');

// Bind corner radius
bind(card, 'topLeftRadius', 'areachart/radius');
bind(card, 'topRightRadius', 'areachart/radius');
bind(card, 'bottomLeftRadius', 'areachart/radius');
bind(card, 'bottomRightRadius', 'areachart/radius');

// Bind border
card.strokes = [{ type: 'SOLID', color: {r:0,g:0,b:0} }];
card.strokeWeight = 1;
// Bind stroke color to token
const borderVar = vMap['areachart/border'];
if (borderVar) {
  card.strokes = [figma.variables.setBoundVariableForPaint(
    card.strokes[0], 'color', borderVar
  )];
}

// Bind fill
fillVar(card, 'areachart/bg');
```

---

## 6. Variable Binding

### Fill colors

```js
// Method: setBoundVariableForPaint
const v = vMap['areachart/bg'];
if (v) {
  const paint = figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: {r:1,g:1,b:1} }, 'color', v
  );
  node.fills = [paint];
}
```

### Stroke colors

```js
const v = vMap['areachart/border'];
if (v) {
  node.strokes = [figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: {r:0,g:0,b:0} }, 'color', v
  )];
}
```

### Numeric properties (spacing, radius, size)

```js
// Direct binding via setBoundVariable
node.setBoundVariable('paddingLeft', vMap['areachart/padding']);
node.setBoundVariable('itemSpacing', vMap['areachart/section-gap']);
node.setBoundVariable('topLeftRadius', vMap['areachart/radius']);
```

### Text fill

```js
const v = vMap['areachart/title-color'];
if (v) {
  textNode.fills = [figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: {r:0,g:0,b:0} }, 'color', v
  )];
}
```

---

## 7. Variant Generation

### Determine variant axes

Parse the component's types to identify variant dimensions:

```typescript
// Example from Button.types.ts
variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
```

This creates a variant matrix: 6 variants × 5 sizes = 30 variant components.

For complex organisms, limit to the most meaningful combinations to avoid an explosion.

### Create variant components

```js
const variants = [];

for (const variant of ['primary', 'secondary', 'ghost']) {
  for (const size of ['sm', 'md', 'lg']) {
    const comp = figma.createComponent();
    comp.name = `Variant=${variant}, Size=${size}`;
    // ... build structure with variant-specific styling
    variants.push(comp);
  }
}

// Combine into component set
const componentSet = figma.combineAsVariants(variants, figma.currentPage);
componentSet.name = 'Button';
```

### Apply variant-specific tokens

Different variants reference different tokens:

```js
// Primary variant
fillVar(bgNode, 'button/primary/bg');
fillVar(textNode, 'button/primary/text');

// Secondary variant
fillVar(bgNode, 'button/secondary/bg');
fillVar(textNode, 'button/secondary/text');
```

### Arrange the component set

After creating, call `figma_arrange_component_set` to organize the variant grid with proper labels.

---

## 8. Component Properties

Add Figma component properties so designers can customize instances:

```js
// Text content (editable by designer)
comp.addComponentProperty('Label', 'TEXT', 'Button');

// Boolean toggles
comp.addComponentProperty('Show Icon', 'BOOLEAN', true);

// Instance swap (for icon slot)
comp.addComponentProperty('Icon', 'INSTANCE_SWAP', iconComponentKey);
```

### Mapping React props to Figma properties

| React Prop Type | Figma Property Type | Notes |
|---|---|---|
| `children: string` | TEXT | Direct text override |
| `title: string` | TEXT | Editable label |
| `showIcon?: boolean` | BOOLEAN | Toggle visibility of icon |
| `icon?: ReactNode` | INSTANCE_SWAP | Swap icon component |
| `variant: 'a' \| 'b'` | VARIANT | Built into variant set, not a property |
| `size: 'sm' \| 'md'` | VARIANT | Built into variant set |
| `disabled?: boolean` | VARIANT or style | Can be a variant or BOOLEAN |
| `onClick` | (skip) | Interaction, not visual |
| `className` | (skip) | Styling override, not relevant |

---

## 9. Special Element Handling

### SVG Chart Areas (AreaChart, BarChart)

Charts contain SVG with dynamically generated paths. In Figma, represent this as:

1. **Chart frame** — Fixed aspect ratio frame (e.g., 600×280) with a placeholder grid
2. **Grid lines** — Horizontal lines using strokes bound to `--areachart-grid-color`
3. **Area fills** — Rectangle shapes with gradient fills bound to `--areachart-series-*` colors
4. **Axis labels** — Text nodes showing sample labels

The SVG is not directly representable in Figma's component model. Create a visual approximation that shows the correct colors, spacing, and typography while conveying the chart's intent.

### Compound Organisms with Slots

Components like Sidebar have slot sub-components (Sidebar.Header, Sidebar.Body, Sidebar.Footer). In Figma:

1. Create the parent component with auto-layout
2. Create slot frames inside with descriptive names
3. Mark slots with `layoutSizingVertical = 'FILL'` where appropriate
4. Add placeholder content that shows the slot's purpose

### Select Component — Open State with Option Groups

The Select component **must** include an explicit "Open State" variant showing the dropdown panel. This is the most common rendering gap — always include it.

**Required variants:**
- `State=Closed, Size=sm/md/lg` — trigger button, arrow pointing down
- `State=Open, Size=md` (representative open state) — trigger + dropdown panel
- `State=Disabled, Size=md` — trigger in disabled visual state

**Open state frame structure:**
```
[Select — State=Open frame]
  ├── TriggerFrame (auto-layout horizontal, arrow icon rotated 180°)
  │     ├── LabelText ("Select an option")
  │     └── ChevronIcon (rotated to point up)
  └── DropdownPanel (auto-layout vertical, positioned below trigger)
        ├── GroupHeaderText ("Category A")  ← text node, muted color, smaller size
        ├── Item instance (option 1, selected state)
        ├── Item instance (option 2)
        ├── Item instance (option 3)
        ├── Divider instance
        ├── GroupHeaderText ("Category B")
        ├── Item instance (option 4)
        └── Item instance (option 5)
```

**Implementation pattern:**
```js
// Open state: trigger + dropdown as a vertical stack
const openFrame = figma.createComponent();
openFrame.name = 'State=Open, Size=md';
openFrame.layoutMode = 'VERTICAL';
openFrame.itemSpacing = 4;

// Trigger
const trigger = figma.createFrame();
trigger.name = 'Trigger';
trigger.layoutMode = 'HORIZONTAL';
trigger.primaryAxisAlignItems = 'SPACE_BETWEEN';
trigger.counterAxisAlignItems = 'CENTER';
// bind trigger bg, border, radius, padding from select tokens
openFrame.appendChild(trigger);

// Dropdown panel
const dropdown = figma.createFrame();
dropdown.name = 'DropdownPanel';
dropdown.layoutMode = 'VERTICAL';
dropdown.itemSpacing = 2;
// bind dropdown bg, border, shadow, radius from select tokens

// Group header labels (text nodes)
const groupLabel = figma.createText();
groupLabel.characters = 'Category A';
// apply muted text color via fillVar
dropdown.appendChild(groupLabel);

// Item instances (search for Item component across all pages)
const itemComp = await findComponent('Item');
if (itemComp) {
  const base = itemComp.type === 'COMPONENT_SET' ? itemComp.defaultVariant : itemComp;
  for (let i = 1; i <= 3; i++) {
    const inst = base.createInstance();
    dropdown.appendChild(inst);
  }
}

openFrame.appendChild(dropdown);
```

### Tooltip / Overlay Elements

Tooltips and dropdowns are positioned absolutely in React but need special handling in Figma:

1. Create as a **separate component** (not nested inside the parent)
2. Place it near the parent component for visual reference
3. Bind its tokens (bg, border, shadow, text color)
4. Include it in the component set as a "State=Tooltip Visible" variant, or leave separate

### Empty States

Components with empty states (no data) should have a variant showing the empty message:

```js
const emptyVariant = figma.createComponent();
emptyVariant.name = 'State=Empty';
// ... add empty state text: "No data available"
```

---

## 10. Screenshot Verification Loop (Mandatory)

After creating the component and its Section, run this loop before reporting completion:

### Step 1 — Take a screenshot of the Section

```js
// Get the section node ID from the section you created
// Pass it to figma_take_screenshot
```

Call `figma_take_screenshot` with the section's node ID.

### Step 2 — Analyze the screenshot

Check for all of these issues:
- **Overlapping frames** — any component sitting on top of another
- **Missing variant labels** — text labels above each variant frame
- **Blank/empty frames** — frames with no content (usually a failed atom instance)
- **Misaligned auto-layout** — content not filling correctly, uneven padding
- **Missing states** — e.g., Select with no Open state, Button with no Disabled state
- **Raw frames where atom instances should be** — if an atom was rebuilt instead of instanced

### Step 3 — Fix and re-screenshot (max 3 iterations)

If issues are found:
1. Fix via another `figma_execute` call targeting the specific problematic nodes
2. Re-take screenshot with `figma_take_screenshot`
3. Check again
4. Repeat up to 3 times total

### Step 4 — Report

```
## Component Sync Complete: AreaChart

### Canvas location
- Page: Charts
- Section: AreaChart

### Created
- AreaChart component set with 4 variants (arranged left-to-right with labels):
  - Default
  - Stacked
  - Linear curve
  - Empty state

### Dependencies instanced
- Button (instance from Atoms/Button)
- Select (instance from Atoms/Select — State=Closed, Size=md)
- Divider (instance from Atoms/Divider)

### Tokens bound
- 32 component variables from 03 · Component
- 14 semantic variables referenced

### Screenshot verification
- ✓ Pass (no overlaps, all variants labeled, atom instances confirmed)

### Manual follow-up needed
- Chart SVG area is a placeholder — add actual chart illustration manually
- Tooltip component created separately — position as needed
```

---

## Error Recovery

If `figma_execute` times out mid-creation:
1. Check what was created — look for partial components on the page
2. Delete any incomplete nodes
3. Retry with a simpler structure or split into multiple calls
4. If persistent, reduce variant count and build incrementally
