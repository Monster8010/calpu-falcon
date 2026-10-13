import type {
  AppConfiguration,
  Department,
} from "@calpulli/domain";
import { createDemoSeed } from "@calpulli/mock-data";
import {
  createRepositories,
  type CreateDepartmentInput,
  type UpdateConfigurationInput,
  type UpdateDepartmentInput,
} from "@calpulli/repositories";
import { createExpoSafSharedStore } from "@calpulli/shared-store";

import {
  createSuperadminWorkspace,
  type SuperadminWorkspace,
} from "../features/superadmin/superadmin-models";
import { loadDirectoryUri } from "./directory-uri-storage";
import { ManagementStorageNotConnectedError } from "./management-repositories";

async function createSuperadminContext() {
  const directoryUri = await loadDirectoryUri();
  if (directoryUri === null) throw new ManagementStorageNotConnectedError();
  const store = createExpoSafSharedStore(directoryUri, "gestion-calpulli");
  return { repositories: createRepositories(store), store };
}

export async function loadSuperadminWorkspace(): Promise<SuperadminWorkspace> {
  const { store } = await createSuperadminContext();
  const snapshot = await store.readStateSnapshot();
  return createSuperadminWorkspace(snapshot.state, snapshot.source);
}

export async function updateSuperadminConfiguration(
  patch: UpdateConfigurationInput,
): Promise<AppConfiguration> {
  const { repositories } = await createSuperadminContext();
  return repositories.configuration.update(patch);
}

export async function saveSuperadminDepartment(options: {
  current?: Department;
  createInput?: CreateDepartmentInput;
  updateInput?: UpdateDepartmentInput;
}): Promise<Department> {
  const { repositories } = await createSuperadminContext();
  if (options.current === undefined) {
    if (options.createInput === undefined) {
      throw new Error("Faltan los datos del nuevo departamento.");
    }
    return repositories.departments.create(options.createInput);
  }
  if (options.updateInput === undefined) {
    throw new Error("Faltan los cambios del departamento.");
  }
  return repositories.departments.update(options.current.id, options.updateInput);
}

export async function restoreSuperadminDemoData(
  referenceTime = new Date().toISOString(),
): Promise<SuperadminWorkspace> {
  const { repositories, store } = await createSuperadminContext();
  await repositories.demoData.restore(createDemoSeed(referenceTime));
  const snapshot = await store.readStateSnapshot();
  return createSuperadminWorkspace(snapshot.state, snapshot.source);
}

export async function revalidateSuperadminStorage(): Promise<SuperadminWorkspace> {
  const { store } = await createSuperadminContext();
  await store.validateDirectory();
  const snapshot = await store.readStateSnapshot();
  return createSuperadminWorkspace(snapshot.state, snapshot.source);
}
