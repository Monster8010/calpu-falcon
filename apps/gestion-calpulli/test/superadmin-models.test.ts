import assert from "node:assert/strict";
import test from "node:test";

import { createDemoSeed } from "@calpulli/mock-data";

import {
  SuperadminFormError,
  createConfigurationDraft,
  createSuperadminDepartmentDraft,
  createSuperadminWorkspace,
  toConfigurationPatch,
  toCreateDepartmentInput,
  toUpdateDepartmentInput,
} from "../features/superadmin/superadmin-models";

const NOW = "2026-08-10T18:00:00.000Z";

test("resume el estado completo y selecciona la feria relevante", () => {
  const state = createDemoSeed(NOW);
  state.stands[0]!.status = "assigned";
  state.stands[0]!.assignedEntrepreneurId = state.entrepreneurs[0]!.id;
  state.standRequests.push({
    entrepreneurId: state.entrepreneurs[0]!.id,
    fairId: state.fairs[0]!.id,
    id: "request-superadmin",
    requestedAt: NOW,
    standId: state.stands[1]!.id,
    status: "pending",
  });
  state.departments[0]!.isActive = false;
  const workspace = createSuperadminWorkspace(state, "primary");

  assert.equal(workspace.meta.revision, state.meta.revision);
  assert.equal(workspace.source, "primary");
  assert.equal(workspace.fair?.id, state.fairs[0]!.id);
  assert.deepEqual(workspace.metrics, {
    activeDepartments: state.departments.length - 1,
    activeEntrepreneurs: state.entrepreneurs.length,
    activeTutors: state.tutors.length,
    assignedStands: 1,
    departments: state.departments.length,
    pendingRequests: 1,
    publishedPosts: state.institutionalPosts.filter(({ isPublished }) => isPublished).length,
  });
});

test("normaliza la configuración y mantiene schema fuera del formulario", () => {
  const configuration = createDemoSeed(NOW).configuration;
  const draft = createConfigurationDraft(configuration);
  draft.institutionName = "  Instituto Politécnico Nacional ";
  draft.publicAppName = "  Calpulli Comunidad ";
  draft.managementAppName = " Gestión Calpulli ";
  draft.defaultTheme = "dark";
  const patch = toConfigurationPatch(draft);

  assert.deepEqual(patch, {
    defaultTheme: "dark",
    demoMode: true,
    institutionName: "Instituto Politécnico Nacional",
    managementAppName: "Gestión Calpulli",
    publicAppName: "Calpulli Comunidad",
  });
  assert.equal("schemaVersion" in patch, false);
});

test("la configuración exige los tres nombres", () => {
  const draft = createConfigurationDraft(createDemoSeed(NOW).configuration);
  draft.publicAppName = "   ";
  assert.throws(
    () => toConfigurationPatch(draft),
    (error: unknown) => error instanceof SuperadminFormError,
  );
});

test("crea y edita departamentos sin reemplazar identidad existente", () => {
  const fresh = createSuperadminDepartmentDraft();
  fresh.name = "  Laboratorio Abierto ";
  fresh.shortName = " Lab ";
  fresh.description = "  Experimentación comunitaria. ";
  const createInput = toCreateDepartmentInput(fresh);
  assert.equal(createInput.name, "Laboratorio Abierto");
  assert.equal(createInput.logoKey, "departments/demo-area");
  assert.equal(createInput.accentToken, "jade");

  const existing = createDemoSeed(NOW).departments[0]!;
  const edit = createSuperadminDepartmentDraft(existing);
  edit.isActive = false;
  edit.name = "Dirección General";
  const updateInput = toUpdateDepartmentInput(edit);
  assert.equal(updateInput.name, "Dirección General");
  assert.equal(updateInput.isActive, false);
  assert.equal("logoKey" in updateInput, false);
  assert.equal("contact" in updateInput, false);
});
