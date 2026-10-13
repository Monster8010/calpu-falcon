import type { AppConfiguration } from "@calpulli/domain";

import {
  RepositoryError,
  type RepositoryContext,
} from "../core";
import { RepositoryBase } from "./base";

export type UpdateConfigurationInput = Partial<
  Omit<AppConfiguration, "schemaVersion">
>;

export class ConfigurationRepository extends RepositoryBase {
  constructor(context: RepositoryContext) {
    super(context);
  }

  async get(): Promise<AppConfiguration> {
    return (await this.context.store.readState()).configuration;
  }

  async update(
    patch: UpdateConfigurationInput,
  ): Promise<AppConfiguration> {
    const persisted = await this.context.store.mutateSharedState((draft) => {
      if (draft.configuration.schemaVersion !== draft.meta.schemaVersion) {
        throw new RepositoryError(
          "DOMAIN_VALIDATION_FAILED",
          "Las versiones de meta y configuración no coinciden.",
          {
            details: {
              metaSchemaVersion: draft.meta.schemaVersion,
              configurationSchemaVersion: draft.configuration.schemaVersion,
            },
          },
        );
      }

      draft.configuration = { ...draft.configuration, ...patch };
    });

    return persisted.configuration;
  }
}
