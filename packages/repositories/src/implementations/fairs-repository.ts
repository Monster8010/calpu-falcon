import {
  isActiveStandRequest,
  validateFairNextDate,
  type AppRole,
  type Fair,
  type ID,
  type ISODateTime,
} from "@calpulli/domain";

import {
  assertDomainValidation,
  assertNotInUse,
  assertUniqueEntityId,
  findEntityById,
  requireEntityById,
  RepositoryError,
  type CreateEntityInput,
  type RepositoryContext,
  type UpdateEntityInput,
} from "../core";
import { RepositoryBase } from "./base";

export type CreateFairInput = CreateEntityInput<Fair>;
export type UpdateFairInput = UpdateEntityInput<Fair>;

function assertValidFair(fair: Fair, referenceTime: ISODateTime): void {
  assertDomainValidation(
    validateFairNextDate(fair, referenceTime),
    "La configuración temporal de la feria no es válida.",
  );
}

export class FairsRepository extends RepositoryBase {
  constructor(context: RepositoryContext) {
    super(context);
  }

  async list(): Promise<Fair[]> {
    return (await this.context.store.readState()).fairs;
  }

  async getById(id: ID): Promise<Fair | undefined> {
    return findEntityById((await this.context.store.readState()).fairs, id);
  }

  async create(input: CreateFairInput): Promise<Fair> {
    const id = input.id ?? this.context.createId("fair");
    const timestamp = this.context.now();
    const fair: Fair = {
      ...input,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const persisted = await this.context.store.mutateSharedState((draft) => {
      assertUniqueEntityId(draft.fairs, id, "la feria");
      assertValidFair(fair, timestamp);
      draft.fairs.push(fair);
    });

    return requireEntityById(persisted.fairs, id, "la feria");
  }

  async update(id: ID, patch: UpdateFairInput): Promise<Fair> {
    const timestamp = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const index = draft.fairs.findIndex((item) => item.id === id);
      const current = requireEntityById(draft.fairs, id, "la feria");
      const next = { ...current, ...patch, updatedAt: timestamp };
      assertValidFair(next, timestamp);
      draft.fairs[index] = next;
    });

    return requireEntityById(persisted.fairs, id, "la feria");
  }

  async activate(id: ID): Promise<Fair> {
    const timestamp = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const index = draft.fairs.findIndex((item) => item.id === id);
      const current = requireEntityById(draft.fairs, id, "la feria");

      if (current.status !== "upcoming") {
        throw new RepositoryError(
          "INVALID_TRANSITION",
          "Solo una feria upcoming puede activarse.",
        );
      }

      if (draft.fairs.some((fair) => fair.id !== id && fair.status === "active")) {
        throw new RepositoryError(
          "INVALID_TRANSITION",
          "Ya existe otra feria activa.",
        );
      }

      const next: Fair = {
        ...current,
        status: "active",
        activatedAt: timestamp,
        updatedAt: timestamp,
      };
      assertValidFair(next, timestamp);
      draft.fairs[index] = next;
    });

    return requireEntityById(persisted.fairs, id, "la feria");
  }

  async finish(
    id: ID,
    nextDate: ISODateTime,
    reviewedByDemoRole: AppRole = "fair-admin",
  ): Promise<Fair> {
    const timestamp = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const index = draft.fairs.findIndex((item) => item.id === id);
      const current = requireEntityById(draft.fairs, id, "la feria");

      if (current.status !== "active") {
        throw new RepositoryError(
          "INVALID_TRANSITION",
          "Solo una feria activa puede finalizarse.",
        );
      }

      const next: Fair = {
        ...current,
        status: "upcoming",
        nextDate,
        endedAt: timestamp,
        updatedAt: timestamp,
      };
      assertValidFair(next, timestamp);
      draft.fairs[index] = next;

      draft.standRequests = draft.standRequests.map((request) =>
        request.fairId === id && isActiveStandRequest(request)
          ? {
              ...request,
              status: "cancelled",
              reviewedAt: timestamp,
              reviewedByDemoRole,
            }
          : request,
      );
      draft.stands = draft.stands.map((stand) =>
        stand.fairId === id
          ? {
              ...stand,
              status: "available",
              assignedEntrepreneurId: undefined,
              activeRequestId: undefined,
              updatedAt: timestamp,
            }
          : stand,
      );
    });

    return requireEntityById(persisted.fairs, id, "la feria");
  }

  async delete(id: ID): Promise<void> {
    await this.context.store.mutateSharedState((draft) => {
      requireEntityById(draft.fairs, id, "la feria");
      assertNotInUse(
        draft.stands.some(({ fairId }) => fairId === id) ||
          draft.standRequests.some(({ fairId }) => fairId === id),
        "No se puede eliminar una feria con stands o solicitudes.",
        { id },
      );
      draft.fairs = draft.fairs.filter((item) => item.id !== id);
    });
  }
}
