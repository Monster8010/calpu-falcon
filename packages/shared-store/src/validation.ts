import {
  isValidISODateTime,
  type SharedCalpulliState,
  type SharedMeta,
} from "@calpulli/domain";

import { SHARED_STATE_SCHEMA_VERSION } from "./constants";
import { SharedStoreError, isSharedStoreError } from "./errors";

const STATE_COLLECTION_KEYS = [
  "departments",
  "institutionalPosts",
  "stories",
  "fairs",
  "stands",
  "standRequests",
  "entrepreneurs",
  "entrepreneurPosts",
  "products",
  "tutors",
  "tutoringOffers",
] as const satisfies ReadonlyArray<keyof SharedCalpulliState>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isInteger(value) && typeof value === "number" && value >= 0;
}

function assertSchemaVersion(
  schemaVersion: unknown,
  expectedSchemaVersion: number,
): asserts schemaVersion is number {
  if (schemaVersion !== expectedSchemaVersion) {
    throw new SharedStoreError(
      "SCHEMA_VERSION_MISMATCH",
      `El estado usa schemaVersion ${String(schemaVersion)} y esta versión admite ${expectedSchemaVersion}.`,
      { details: { actual: schemaVersion, expected: expectedSchemaVersion } },
    );
  }
}

export function assertSharedMeta(
  value: unknown,
  expectedSchemaVersion = SHARED_STATE_SCHEMA_VERSION,
): asserts value is SharedMeta {
  if (!isRecord(value)) {
    throw new SharedStoreError(
      "INVALID_STATE",
      "El estado no contiene metadatos válidos.",
    );
  }

  assertSchemaVersion(value.schemaVersion, expectedSchemaVersion);

  if (
    !isNonNegativeInteger(value.revision) ||
    typeof value.createdAt !== "string" ||
    !isValidISODateTime(value.createdAt) ||
    typeof value.updatedAt !== "string" ||
    !isValidISODateTime(value.updatedAt) ||
    (value.lastWriter !== "calpulli" &&
      value.lastWriter !== "gestion-calpulli")
  ) {
    throw new SharedStoreError(
      "INVALID_STATE",
      "Los metadatos del estado compartido son inválidos.",
    );
  }
}

export function assertSharedCalpulliState(
  value: unknown,
  expectedSchemaVersion = SHARED_STATE_SCHEMA_VERSION,
): asserts value is SharedCalpulliState {
  if (!isRecord(value)) {
    throw new SharedStoreError(
      "INVALID_STATE",
      "El JSON compartido no contiene un objeto de estado.",
    );
  }

  assertSharedMeta(value.meta, expectedSchemaVersion);

  for (const key of STATE_COLLECTION_KEYS) {
    if (!Array.isArray(value[key])) {
      throw new SharedStoreError(
        "INVALID_STATE",
        `La colección ${key} no es válida.`,
        { details: { key } },
      );
    }
  }

  const configuration = value.configuration;

  if (!isRecord(configuration)) {
    throw new SharedStoreError(
      "INVALID_STATE",
      "La configuración compartida no es válida.",
    );
  }

  assertSchemaVersion(configuration.schemaVersion, expectedSchemaVersion);

  if (
    typeof configuration.demoMode !== "boolean" ||
    typeof configuration.institutionName !== "string" ||
    typeof configuration.publicAppName !== "string" ||
    typeof configuration.managementAppName !== "string" ||
    (configuration.defaultTheme !== "system" &&
      configuration.defaultTheme !== "light" &&
      configuration.defaultTheme !== "dark")
  ) {
    throw new SharedStoreError(
      "INVALID_STATE",
      "Los campos de configuración compartida son inválidos.",
    );
  }
}

function parseJson(contents: string): unknown {
  try {
    const normalizedContents = contents.replace(/^\uFEFF/, "").trim();

    if (normalizedContents.length === 0) {
      throw new SyntaxError("El archivo está vacío.");
    }

    return JSON.parse(normalizedContents) as unknown;
  } catch (error) {
    if (isSharedStoreError(error)) {
      throw error;
    }

    throw new SharedStoreError(
      "INVALID_JSON",
      "El archivo compartido no contiene JSON válido.",
      { cause: error },
    );
  }
}

export function parseSharedCalpulliState(
  contents: string,
  expectedSchemaVersion = SHARED_STATE_SCHEMA_VERSION,
): SharedCalpulliState {
  const parsed = parseJson(contents);
  assertSharedCalpulliState(parsed, expectedSchemaVersion);
  return parsed;
}

export function parseSharedMeta(
  contents: string,
  expectedSchemaVersion = SHARED_STATE_SCHEMA_VERSION,
): SharedMeta {
  const parsed = parseJson(contents);
  assertSharedMeta(parsed, expectedSchemaVersion);
  return parsed;
}

export function serializeSharedJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function sharedJsonEquals(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}
