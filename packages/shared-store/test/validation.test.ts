import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { SharedStoreError } from "../src/errors";
import {
  parseSharedCalpulliState,
  serializeSharedJson,
} from "../src/validation";
import { createSharedState } from "./fixtures";

describe("validación del estado compartido", () => {
  it("rechaza JSON vacío o dañado", () => {
    for (const contents of ["", "{no-json"]) {
      assert.throws(
        () => parseSharedCalpulliState(contents),
        (error: unknown) => {
          assert.equal(error instanceof SharedStoreError, true);
          assert.equal((error as SharedStoreError).code, "INVALID_JSON");
          return true;
        },
      );
    }
  });

  it("valida colecciones, metadatos y schemaVersion de configuración", () => {
    const state = createSharedState();
    const invalidCollections = { ...state, departments: null };
    const invalidConfiguration = {
      ...state,
      configuration: { ...state.configuration, schemaVersion: 2 },
    };

    assert.throws(
      () => parseSharedCalpulliState(serializeSharedJson(invalidCollections)),
      (error: unknown) =>
        error instanceof SharedStoreError && error.code === "INVALID_STATE",
    );
    assert.throws(
      () => parseSharedCalpulliState(serializeSharedJson(invalidConfiguration)),
      (error: unknown) =>
        error instanceof SharedStoreError &&
        error.code === "SCHEMA_VERSION_MISMATCH",
    );
  });
});
