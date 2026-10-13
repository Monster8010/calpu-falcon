import {
  isActiveStandRequest,
  validateAssignedStand,
  type AppRole,
  type ID,
  type Stand,
} from "@calpulli/domain";

import {
  assertDomainValidation,
  assertNotInUse,
  assertReference,
  assertUniqueEntityId,
  findEntityById,
  requireEntityById,
  RepositoryError,
  type RepositoryContext,
} from "../core";
import { RepositoryBase } from "./base";

export type CreateStandInput = Omit<Stand, "id" | "updatedAt"> & {
  id?: ID;
};
export type UpdateStandInput = Partial<Omit<Stand, "id" | "updatedAt">>;

function coordinateKey(stand: Stand): string {
  return `${stand.coordinate.row}:${stand.coordinate.column}`;
}

function assertStandReferences(
  stand: Stand,
  state: {
    fairs: readonly { id: ID }[];
    entrepreneurs: readonly { id: ID }[];
    standRequests: readonly { id: ID; standId: ID }[];
  },
): void {
  assertReference(
    state.fairs.some(({ id }) => id === stand.fairId),
    "El stand debe pertenecer a una feria existente.",
    { fairId: stand.fairId },
  );
  assertDomainValidation(
    validateAssignedStand(stand),
    "La asignación del stand no es coherente.",
  );

  if (stand.status !== "assigned" && stand.assignedEntrepreneurId !== undefined) {
    throw new RepositoryError(
      "DOMAIN_VALIDATION_FAILED",
      "Solo un stand asignado puede conservar assignedEntrepreneurId.",
    );
  }

  if (stand.assignedEntrepreneurId !== undefined) {
    assertReference(
      state.entrepreneurs.some(({ id }) => id === stand.assignedEntrepreneurId),
      "El stand está vinculado a un emprendimiento inexistente.",
      { entrepreneurId: stand.assignedEntrepreneurId },
    );
  }

  if (stand.activeRequestId !== undefined) {
    assertReference(
      state.standRequests.some(
        ({ id, standId }) => id === stand.activeRequestId && standId === stand.id,
      ),
      "activeRequestId no corresponde a una solicitud del stand.",
      { activeRequestId: stand.activeRequestId },
    );
  }
}

function assertStandUnique(
  stand: Stand,
  stands: readonly Stand[],
  excludingId?: ID,
): void {
  const siblings = stands.filter(
    (candidate) =>
      candidate.id !== excludingId && candidate.fairId === stand.fairId,
  );

  if (siblings.some(({ number }) => number === stand.number)) {
    throw new RepositoryError(
      "DUPLICATE_ID",
      "La feria ya contiene un stand con ese número.",
      { details: { fairId: stand.fairId, number: stand.number } },
    );
  }

  if (siblings.some((candidate) => coordinateKey(candidate) === coordinateKey(stand))) {
    throw new RepositoryError(
      "DUPLICATE_ID",
      "La feria ya contiene un stand en esa coordenada.",
      { details: { fairId: stand.fairId, coordinate: coordinateKey(stand) } },
    );
  }
}

export class StandsRepository extends RepositoryBase {
  constructor(context: RepositoryContext) {
    super(context);
  }

  async list(fairId?: ID): Promise<Stand[]> {
    const stands = (await this.context.store.readState()).stands;
    return fairId === undefined
      ? stands
      : stands.filter((stand) => stand.fairId === fairId);
  }

  async getById(id: ID): Promise<Stand | undefined> {
    return findEntityById((await this.context.store.readState()).stands, id);
  }

  async create(input: CreateStandInput): Promise<Stand> {
    const id = input.id ?? this.context.createId("stand");
    const stand: Stand = { ...input, id, updatedAt: this.context.now() };
    const persisted = await this.context.store.mutateSharedState((draft) => {
      assertUniqueEntityId(draft.stands, id, "el stand");
      assertStandUnique(stand, draft.stands);
      assertStandReferences(stand, draft);
      draft.stands.push(stand);
    });

    return requireEntityById(persisted.stands, id, "el stand");
  }

  async update(id: ID, patch: UpdateStandInput): Promise<Stand> {
    const timestamp = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const index = draft.stands.findIndex((item) => item.id === id);
      const current = requireEntityById(draft.stands, id, "el stand");
      const next = { ...current, ...patch, updatedAt: timestamp };
      assertStandUnique(next, draft.stands, id);
      assertStandReferences(next, draft);
      draft.stands[index] = next;
    });

    return requireEntityById(persisted.stands, id, "el stand");
  }

  async release(
    id: ID,
    reviewedByDemoRole: AppRole = "fair-admin",
  ): Promise<Stand> {
    const timestamp = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const standIndex = draft.stands.findIndex((item) => item.id === id);
      const stand = requireEntityById(draft.stands, id, "el stand");

      draft.standRequests = draft.standRequests.map((request) =>
        request.standId === id && isActiveStandRequest(request)
          ? {
              ...request,
              status: "cancelled",
              reviewedAt: timestamp,
              reviewedByDemoRole,
            }
          : request,
      );
      draft.stands[standIndex] = {
        ...stand,
        status: "available",
        assignedEntrepreneurId: undefined,
        activeRequestId: undefined,
        updatedAt: timestamp,
      };
    });

    return requireEntityById(persisted.stands, id, "el stand");
  }

  async delete(id: ID): Promise<void> {
    await this.context.store.mutateSharedState((draft) => {
      requireEntityById(draft.stands, id, "el stand");
      assertNotInUse(
        draft.standRequests.some(({ standId }) => standId === id),
        "No se puede eliminar un stand con solicitudes relacionadas.",
        { id },
      );
      draft.stands = draft.stands.filter((item) => item.id !== id);
    });
  }
}
