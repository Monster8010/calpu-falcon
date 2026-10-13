export const SHARED_STATE_SCHEMA_VERSION = 1;
export const MAX_MUTATION_ATTEMPTS = 3;

export const SHARED_STATE_FILE_NAME = "calpulli-state.json";
export const SHARED_STATE_BACKUP_FILE_NAME = "calpulli-state.backup.json";
export const SHARED_META_FILE_NAME = "shared-meta.json";
export const SHARED_JSON_MIME_TYPE = "application/json";

export const SHARED_STORE_FILE_NAMES = [
  SHARED_STATE_FILE_NAME,
  SHARED_STATE_BACKUP_FILE_NAME,
  SHARED_META_FILE_NAME,
] as const;

export type SharedStoreFileName = (typeof SHARED_STORE_FILE_NAMES)[number];
