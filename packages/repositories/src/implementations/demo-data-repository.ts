import type { SharedCalpulliState } from "@calpulli/domain";

import {
  RepositoryError,
  type RepositoryContext,
} from "../core";
import { RepositoryBase } from "./base";

export class DemoDataRepository extends RepositoryBase {
  constructor(context: RepositoryContext) {
    super(context);
  }

  async restore(seed: SharedCalpulliState): Promise<SharedCalpulliState> {
    return this.context.store.mutateSharedState((current) => {
      if (
        seed.meta.schemaVersion !== current.meta.schemaVersion ||
        seed.configuration.schemaVersion !== current.meta.schemaVersion
      ) {
        throw new RepositoryError(
          "DOMAIN_VALIDATION_FAILED",
          "El seed no es compatible con la versión del estado compartido.",
          {
            details: {
              currentSchemaVersion: current.meta.schemaVersion,
              seedConfigurationSchemaVersion: seed.configuration.schemaVersion,
              seedSchemaVersion: seed.meta.schemaVersion,
            },
          },
        );
      }

      return seed;
    });
  }
}
