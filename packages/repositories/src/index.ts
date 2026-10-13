export const REPOSITORIES_PACKAGE_ID = "@calpulli/repositories" as const;
export const REPOSITORIES_WORKSPACE_LINKS = [
  "@calpulli/domain",
  "@calpulli/shared-store",
] as const;

export * from "./core";
export * from "./implementations";
export * from "./selectors";
