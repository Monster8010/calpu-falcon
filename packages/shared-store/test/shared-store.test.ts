import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  SHARED_META_FILE_NAME,
  SHARED_STATE_BACKUP_FILE_NAME,
  SHARED_STATE_FILE_NAME,
} from "../src/constants";
import { SharedStoreError } from "../src/errors";
import { SharedStore } from "../src/shared-store";
import {
  parseSharedCalpulliState,
  parseSharedMeta,
  serializeSharedJson,
} from "../src/validation";
import { createSharedState } from "./fixtures";
import { MemoryFileSystem } from "./memory-file-system";

function createStore(
  fileSystem: MemoryFileSystem,
  now = "2026-08-10T13:00:00.000Z",
): SharedStore {
  return new SharedStore({
    directoryUri: fileSystem.directoryUri,
    fileSystem,
    writer: "gestion-calpulli",
    now: () => now,
  });
}

async function assertRejectsWithCode(
  operation: Promise<unknown>,
  code: SharedStoreError["code"],
): Promise<void> {
  await assert.rejects(operation, (error: unknown) => {
    assert.equal(error instanceof SharedStoreError, true);
    assert.equal((error as SharedStoreError).code, code);
    return true;
  });
}

describe("directorio compartido", () => {
  it("valida lectura/escritura y elimina el archivo de prueba", async () => {
    const fileSystem = new MemoryFileSystem();
    const store = createStore(fileSystem);

    await store.validateDirectory({ probeId: "unit" });

    assert.deepEqual(fileSystem.listFileNames(), []);
  });

  it("rechaza una URI que no es SAF", async () => {
    const fileSystem = new MemoryFileSystem();
    const store = new SharedStore({
      directoryUri: "file:///privado",
      fileSystem,
      writer: "calpulli",
    });

    await assertRejectsWithCode(
      store.validateDirectory({ writeProbe: false }),
      "INVALID_DIRECTORY_URI",
    );
  });
});

describe("archivos y recuperación", () => {
  it("inicializa y verifica los tres JSON con nombres exactos", async () => {
    const fileSystem = new MemoryFileSystem();
    const store = createStore(fileSystem);
    const initialState = createSharedState(4);

    await store.initializeState(initialState);

    assert.deepEqual(fileSystem.listFileNames().sort(), [
      SHARED_STATE_BACKUP_FILE_NAME,
      SHARED_STATE_FILE_NAME,
      SHARED_META_FILE_NAME,
    ].sort());
    assert.deepEqual(await store.readState(), initialState);
    assert.deepEqual(await store.readMeta(), initialState.meta);
    await assertRejectsWithCode(
      store.initializeState(initialState),
      "STATE_ALREADY_EXISTS",
    );
  });

  it("permite que ambas experiencias lean la misma revisión", async () => {
    const fileSystem = new MemoryFileSystem();
    const managementStore = createStore(fileSystem);
    const publicStore = new SharedStore({
      directoryUri: fileSystem.directoryUri,
      fileSystem,
      writer: "calpulli",
    });

    await managementStore.initializeState(createSharedState(12));

    assert.equal((await managementStore.readState()).meta.revision, 12);
    assert.equal((await publicStore.readState()).meta.revision, 12);
  });

  it("lee el backup si el JSON principal está dañado", async () => {
    const fileSystem = new MemoryFileSystem();
    const store = createStore(fileSystem);
    const initialState = createSharedState(2);

    await store.initializeState(initialState);
    fileSystem.setFile(SHARED_STATE_FILE_NAME, "{json roto");

    const snapshot = await store.readStateSnapshot();

    assert.equal(snapshot.source, "backup");
    assert.deepEqual(snapshot.state, initialState);
  });

  it("no oculta un schemaVersion incompatible usando el backup", async () => {
    const fileSystem = new MemoryFileSystem();
    const store = createStore(fileSystem);

    await store.initializeState(createSharedState());

    const incompatibleStore = new SharedStore({
      directoryUri: fileSystem.directoryUri,
      fileSystem,
      writer: "calpulli",
      schemaVersion: 2,
    });

    await assertRejectsWithCode(
      incompatibleStore.readState(),
      "SCHEMA_VERSION_MISMATCH",
    );
  });
});

describe("mutaciones centralizadas", () => {
  it("incrementa revisión, actualiza meta y conserva el estado anterior", async () => {
    const fileSystem = new MemoryFileSystem();
    const store = createStore(fileSystem);
    const initialState = createSharedState(7, "calpulli");

    await store.initializeState(initialState);
    const result = await store.mutateSharedState((draft) => {
      draft.configuration.institutionName = "UPIICSA actualizada";
    });

    assert.equal(result.meta.revision, 8);
    assert.equal(result.meta.lastWriter, "gestion-calpulli");
    assert.equal(result.meta.updatedAt, "2026-08-10T13:00:00.000Z");
    assert.equal(
      result.configuration.institutionName,
      "UPIICSA actualizada",
    );

    const backup = parseSharedCalpulliState(
      fileSystem.readRaw(SHARED_STATE_BACKUP_FILE_NAME),
    );
    const meta = parseSharedMeta(fileSystem.readRaw(SHARED_META_FILE_NAME));

    assert.equal(backup.meta.revision, 7);
    assert.equal(meta.revision, 8);
    assert.deepEqual(await store.readState(), result);
  });

  it("relee y reaplica la operación cuando cambia la revisión", async () => {
    const fileSystem = new MemoryFileSystem();
    const store = createStore(fileSystem);
    const initialState = createSharedState();
    const externalState = createSharedState(1, "calpulli");
    externalState.configuration.institutionName = "Cambio externo";
    let operationCalls = 0;
    let conflictInjected = false;

    await store.initializeState(initialState);
    const stateUri = fileSystem.fileUri(SHARED_STATE_FILE_NAME);
    fileSystem.onBeforeRead = (fileUri, readCount, memory) => {
      if (fileUri === stateUri && readCount === 3 && !conflictInjected) {
        conflictInjected = true;
        memory.setFile(
          SHARED_STATE_FILE_NAME,
          serializeSharedJson(externalState),
        );
      }
    };

    const result = await store.mutateSharedState((draft) => {
      operationCalls += 1;
      draft.configuration.publicAppName += "!";
    });

    assert.equal(operationCalls, 2);
    assert.equal(result.meta.revision, 2);
    assert.equal(result.configuration.institutionName, "Cambio externo");
    assert.equal(result.configuration.publicAppName, "UPIICSA Calpulli!");
  });

  it("reporta una verificación fallida y mantiene un backup válido", async () => {
    const fileSystem = new MemoryFileSystem();
    const store = createStore(fileSystem);
    const initialState = createSharedState(3);

    await store.initializeState(initialState);
    fileSystem.corruptNextWriteToFileName = SHARED_STATE_FILE_NAME;

    await assertRejectsWithCode(
      store.mutateSharedState((draft) => {
        draft.configuration.demoMode = false;
      }),
      "WRITE_VERIFICATION_FAILED",
    );

    const backup = parseSharedCalpulliState(
      fileSystem.readRaw(SHARED_STATE_BACKUP_FILE_NAME),
    );
    assert.equal(backup.meta.revision, 3);
  });
});
