import { createRepositories, type CalpulliRepositories } from "@calpulli/repositories";
import { createExpoSafSharedStore } from "@calpulli/shared-store";

import { loadDirectoryUri } from "./directory-uri-storage";

export class PublicStorageNotConnectedError extends Error {
  constructor() {
    super("Conecta el almacenamiento Calpulli para consultar la información.");
    this.name = "PublicStorageNotConnectedError";
  }
}

export async function createPublicRepositories(): Promise<CalpulliRepositories> {
  const directoryUri = await loadDirectoryUri();

  if (directoryUri === null) {
    throw new PublicStorageNotConnectedError();
  }

  return createRepositories(
    createExpoSafSharedStore(directoryUri, "calpulli"),
  );
}
