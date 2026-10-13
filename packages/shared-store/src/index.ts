import { DOMAIN_PACKAGE_ID } from "@calpulli/domain";

export const SHARED_STORE_PACKAGE_ID = "@calpulli/shared-store" as const;
export const SHARED_STORE_WORKSPACE_LINK = DOMAIN_PACKAGE_ID;

export * from "./constants";
export * from "./errors";
export * from "./file-system";
export * from "./saf-directory";
export * from "./shared-store";
export * from "./shared-media";
export * from "./state-reader";
export * from "./validation";
export type { InitializeSharedStateOptions } from "./state-writer";
