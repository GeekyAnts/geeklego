/// <reference types="@figma/plugin-typings" />
/**
 * GeekLego Sync — plugin sandbox (main thread).
 *
 * Executes a SyncPlan (built by the pure mapper) against figma.variables:
 *   pass 1 — ensure collections, modes, variables (Primitives first)
 *   pass 2 — set values, so every alias target already exists
 * Typography ships as a variable collection too (the Plugin API can't bind
 * Text Style props to variables), so there's no separate style pass.
 *
 * The current IR is BAKED IN at build time (`pnpm run figma-plugin:build`
 * runs export-ir, then Vite injects dist/ir/tokens.json via `define`), so
 * "Sync Tokens" needs zero input. The UI can also paste an ad-hoc IR.
 */
import {
  buildSyncPlan,
  type PlannedValue,
  type SyncPlan,
} from "./token-sync/build-sync-plan";
import type { IrDocument } from "./token-sync/ir-types";
import { buildComponent } from "./component-sync/build-component";
import type { ComponentManifest } from "./component-sync/manifest-types";

// Injected by Vite `define` as JSON string literals (see vite.config.mts).
declare const __BAKED_IR_JSON__: string;
declare const __BAKED_COMPONENT_MANIFEST_JSON__: string;

const componentManifest: ComponentManifest = JSON.parse(
  __BAKED_COMPONENT_MANIFEST_JSON__,
);

interface SyncReport {
  irSource: string;
  createdCollections: number;
  createdVariables: number;
  valuesSet: number;
  warnings: string[];
  skipped: Array<{ path: string; reason: string }>;
}

figma.showUI(__html__, { width: 460, height: 600, themeColors: true });

// Tell the UI which components are available to import.
figma.ui.postMessage({
  type: "component-list",
  components: componentManifest.components.map((c) => ({
    name: c.name,
    variantCount: c.combinations.length,
  })),
});

interface PluginMessage {
  type: string;
  irJson?: string;
  component?: string;
}

figma.ui.onmessage = async (msg: PluginMessage) => {
  try {
    if (msg.type === "sync-tokens") {
      const ir: IrDocument = msg.irJson
        ? (JSON.parse(msg.irJson) as IrDocument)
        : (JSON.parse(__BAKED_IR_JSON__) as IrDocument);
      const report = await applySyncPlan(buildSyncPlan(ir));
      figma.ui.postMessage({ type: "sync-done", report });
      figma.notify(
        `GeekLego tokens synced — ${report.createdVariables} new variables, ${report.valuesSet} values set`,
      );
      return;
    }

    if (msg.type === "import-component") {
      const entry = componentManifest.components.find(
        (c) => c.name === msg.component,
      );
      if (!entry) {
        figma.ui.postMessage({
          type: "import-error",
          message: `Component "${msg.component}" not in the baked manifest.`,
        });
        return;
      }
      const report = await buildComponent(entry);
      figma.ui.postMessage({ type: "import-done", report });
      figma.notify(
        `${report.name} imported — ${report.componentsCreated} variants, ${report.bindingsApplied} bindings`,
      );
      return;
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    figma.ui.postMessage({
      type: msg.type === "import-component" ? "import-error" : "sync-error",
      message,
    });
  }
};

async function applySyncPlan(plan: SyncPlan): Promise<SyncReport> {
  const report: SyncReport = {
    irSource: plan.irSource,
    createdCollections: 0,
    createdVariables: 0,
    valuesSet: 0,
    warnings: [],
    skipped: plan.skipped,
  };

  const localCollections =
    await figma.variables.getLocalVariableCollectionsAsync();
  const localVariables = await figma.variables.getLocalVariablesAsync();

  const colByName = new Map(localCollections.map((c) => [c.name, c]));
  /** variableCollectionId + ":" + variable name → Variable */
  const varByKey = new Map(
    localVariables.map((v) => [`${v.variableCollectionId}:${v.name}`, v]),
  );
  /** plan-level index: `${collectionName}:${variableName}` → Variable */
  const planned = new Map<string, Variable>();
  /** collectionName → modeName → modeId */
  const modeIds = new Map<string, Record<string, string>>();

  // ── pass 1: collections, modes, variables ─────────────────────────────────
  for (const pc of plan.collections) {
    let col = colByName.get(pc.name);
    if (!col) {
      col = figma.variables.createVariableCollection(pc.name);
      colByName.set(pc.name, col);
      report.createdCollections++;
    }

    const modes: Record<string, string> = {};
    for (let i = 0; i < pc.modes.length; i++) {
      const modeName = pc.modes[i];
      let mode = col.modes.find((m) => m.name === modeName);
      if (!mode) {
        // A fresh collection has one unnamed default mode — claim it first.
        if (i === 0 && col.modes.length === 1 && col.modes[0].name === "Mode 1") {
          col.renameMode(col.modes[0].modeId, modeName);
          mode = col.modes.find((m) => m.name === modeName);
        } else {
          try {
            const id = col.addMode(modeName);
            mode = { modeId: id, name: modeName };
          } catch (e) {
            report.warnings.push(
              `Cannot add mode "${modeName}" to "${pc.name}" (plan tier limit?): ${
                e instanceof Error ? e.message : String(e)
              }`,
            );
          }
        }
      }
      if (mode) modes[modeName] = mode.modeId;
    }
    modeIds.set(pc.name, modes);

    for (const pv of pc.variables) {
      const key = `${col.id}:${pv.name}`;
      let variable = varByKey.get(key);
      if (!variable) {
        variable = figma.variables.createVariable(pv.name, col, pv.resolvedType);
        varByKey.set(key, variable);
        report.createdVariables++;
      } else if (variable.resolvedType !== pv.resolvedType) {
        report.warnings.push(
          `Type mismatch for "${pc.name}/${pv.name}" (have ${variable.resolvedType}, want ${pv.resolvedType}) — skipped`,
        );
        continue;
      }
      planned.set(`${pc.name}:${pv.name}`, variable);
    }
  }

  // ── pass 2: values (alias targets all exist now) ──────────────────────────
  for (const pc of plan.collections) {
    const modes = modeIds.get(pc.name) ?? {};
    for (const pv of pc.variables) {
      const variable = planned.get(`${pc.name}:${pv.name}`);
      if (!variable) continue;
      for (const [modeName, value] of Object.entries(pv.valuesByMode)) {
        const modeId = modes[modeName];
        if (!modeId) continue; // mode couldn't be created — already warned
        const figmaValue = toFigmaValue(value, planned, report);
        if (figmaValue === null) continue;
        variable.setValueForMode(modeId, figmaValue);
        report.valuesSet++;
      }
    }
  }

  return report;
}

function toFigmaValue(
  value: PlannedValue,
  planned: Map<string, Variable>,
  report: SyncReport,
): VariableValue | null {
  switch (value.kind) {
    case "alias": {
      const target = planned.get(`${value.collection}:${value.variable}`);
      if (!target) {
        report.warnings.push(
          `Alias target missing: ${value.collection}/${value.variable}`,
        );
        return null;
      }
      return figma.variables.createVariableAlias(target);
    }
    case "color":
      return value.value; // {r,g,b,a} — RGBA
    case "float":
      return value.value;
    case "string":
      return value.value;
  }
}
