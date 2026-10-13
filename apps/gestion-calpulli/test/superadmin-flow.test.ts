import assert from "node:assert/strict";
import test from "node:test";

import type { SharedCalpulliState } from "@calpulli/domain";
import { createDemoSeed } from "@calpulli/mock-data";
import {
  createRepositories,
  type SharedStateStore,
} from "@calpulli/repositories";

import {
  createSuperadminWorkspace,
  toCreateDepartmentInput,
} from "../features/superadmin/superadmin-models";

const NOW = "2026-08-10T18:30:00.000Z";

function createMemoryStore(initial: SharedCalpulliState) {
  let state = structuredClone(initial);
  const store: SharedStateStore = {
    async readState() {
      return structuredClone(state);
    },
    async mutateSharedState(operation) {
      const draft = structuredClone(state);
      const next = operation(draft) ?? draft;
      state = {
        ...structuredClone(next),
        meta: {
          ...next.meta,
          lastWriter: "gestion-calpulli",
          revision: state.meta.revision + 1,
          updatedAt: NOW,
        },
      };
      return structuredClone(state);
    },
  };
  return store;
}

test("configuración y departamentos se guardan mediante repositories", async () => {
  let nextId = 0;
  const store = createMemoryStore(createDemoSeed(NOW));
  const repositories = createRepositories(store, {
    createId: (prefix) => `${prefix}-stage-16-${++nextId}`,
    now: () => NOW,
  });

  await repositories.configuration.update({
    defaultTheme: "dark",
    institutionName: "IPN · UPIICSA",
  });
  const department = await repositories.departments.create(toCreateDepartmentInput({
    description: "Área temporal para la demostración.",
    isActive: true,
    name: "Laboratorio Abierto",
    shortName: "Lab",
  }));
  await repositories.departments.update(department.id, { isActive: false });

  const state = await store.readState();
  const workspace = createSuperadminWorkspace(state, "primary");
  assert.equal(workspace.configuration.defaultTheme, "dark");
  assert.equal(workspace.configuration.institutionName, "IPN · UPIICSA");
  assert.equal(workspace.departments.find(({ id }) => id === department.id)?.isActive, false);
  assert.equal(workspace.metrics.departments, 11);
  assert.equal(workspace.metrics.activeDepartments, 10);
});

test("restaurar seed reemplaza cambios e incrementa la revisión vigente", async () => {
  const initial = createDemoSeed(NOW);
  const store = createMemoryStore(initial);
  const repositories = createRepositories(store, { now: () => NOW });
  await repositories.configuration.update({ publicAppName: "Nombre temporal" });
  await repositories.departments.update(initial.departments[0]!.id, { isActive: false });
  const revisionBeforeRestore = (await store.readState()).meta.revision;

  const restored = await repositories.demoData.restore(
    createDemoSeed("2026-09-01T12:00:00.000Z"),
  );

  assert.equal(restored.meta.revision, revisionBeforeRestore + 1);
  assert.equal(restored.configuration.publicAppName, "UPIICSA Calpulli");
  assert.equal(restored.departments.every(({ isActive }) => isActive), true);
  assert.equal(restored.departments.length, 10);
  assert.equal(restored.standRequests.length, 0);
});
