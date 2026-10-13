import {
  createRepositories,
  type CalpulliRepositories,
} from "@calpulli/repositories";
import { createExpoSafSharedStore } from "@calpulli/shared-store";

import { loadDirectoryUri } from "./directory-uri-storage";

export class ManagementStorageNotConnectedError extends Error {
  constructor() {
    super("Conecta el almacenamiento Calpulli antes de administrar contenido.");
    this.name = "ManagementStorageNotConnectedError";
  }
}

export async function createManagementRepositories(): Promise<CalpulliRepositories> {
  const directoryUri = await loadDirectoryUri();

  if (directoryUri === null) {
    throw new ManagementStorageNotConnectedError();
  }

  return createRepositories(
    createExpoSafSharedStore(directoryUri, "gestion-calpulli"),
  );
}
