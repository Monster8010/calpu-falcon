import {
  isActiveStandRequest,
  validateCanCreateStandRequest,
  validateStandRequestApproval,
  validateStandRequestTransition,
  type AppRole,
  type ID,
  type SharedCalpulliState,
  type Stand,
  type StandRequest,
  type StandRequestStatus,
} from "@calpulli/domain";

import {
  assertDomainValidation,
  assertReference,
  assertUniqueEntityId,
  findEntityById,
  requireEntityById,
  RepositoryError,
  type RepositoryContext,
} from "../core";
import { RepositoryBase } from "./base";

export interface CreateStandRequestInput {
  id?: ID;
  fairId: ID;
  standId: ID;
  entrepreneurId: ID;
  note?: string;
}

export interface StandRequestFilter {
  fairId?: ID;
  standId?: ID;
  entrepreneurId?: ID;
  status?: StandRequestStatus;
}

function assertEntrepreneurCanRequest(
  entrepreneurId: ID,
  state: SharedCalpulliState,
): void {
  const entrepreneur = state.entrepreneurs.find(({ id }) => id === entrepreneurId);

  assertReference(
    entrepreneur !== undefined,
    "La solicitud debe pertenecer a un emprendimiento existente.",
    { entrepreneurId },
  );

  if (entrepreneur !== undefined && !entrepreneur.isActive) {
    throw new RepositoryError(
      "DOMAIN_VALIDATION_FAILED",
      "Un emprendimiento inactivo no puede solicitar un stand.",
      { details: { entrepreneurId } },
    );
  }
}

function comparePendingRequests(left: StandRequest, right: StandRequest): number {
  const timeDifference =
    new Date(left.requestedAt).getTime() - new Date(right.requestedAt).getTime();

  if (timeDifference !== 0) {
    return timeDifference;
  }

  return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
}

function nextPendingRequestForStand(
  requests: readonly StandRequest[],
  standId: ID,
  excludingRequestId: ID,
): StandRequest | undefined {
  return requests
    .filter(
      (request) =>
        request.id !== excludingRequestId &&
        request.standId === standId &&
        request.status === "pending",
    )
    .sort(comparePendingRequests)[0];
}

function standAfterRequestRemoval(
  stand: Stand,
  requests: readonly StandRequest[],
  removedRequestId: ID,
  updatedAt: string,
): Stand {
  const nextRequest = nextPendingRequestForStand(
    requests,
    stand.id,
    removedRequestId,
  );

  if (nextRequest === undefined) {
    return {
      ...stand,
      status: "available",
      assignedEntrepreneurId: undefined,
      activeRequestId: undefined,
      updatedAt,
    };
  }

  return {
    ...stand,
    status: "requested",
    assignedEntrepreneurId: undefined,
    activeRequestId: nextRequest.id,
    updatedAt,
  };
}

export class StandRequestsRepository extends RepositoryBase {
  constructor(context: RepositoryContext) {
    super(context);
  }

  async list(filter: StandRequestFilter = {}): Promise<StandRequest[]> {
    return (await this.context.store.readState()).standRequests.filter(
      (request) =>
        (filter.fairId === undefined || request.fairId === filter.fairId) &&
        (filter.standId === undefined || request.standId === filter.standId) &&
        (filter.entrepreneurId === undefined ||
          request.entrepreneurId === filter.entrepreneurId) &&
        (filter.status === undefined || request.status === filter.status),
    );
  }

  async getById(id: ID): Promise<StandRequest | undefined> {
    return findEntityById(
      (await this.context.store.readState()).standRequests,
      id,
    );
  }

  async create(input: CreateStandRequestInput): Promise<StandRequest> {
    const id = input.id ?? this.context.createId("stand-request");
    const requestedAt = this.context.now();
    const request: StandRequest = {
      id,
      fairId: input.fairId,
      standId: input.standId,
      entrepreneurId: input.entrepreneurId,
      status: "pending",
      requestedAt,
      note: input.note,
    };
    const persisted = await this.context.store.mutateSharedState((draft) => {
      assertUniqueEntityId(draft.standRequests, id, "la solicitud");
      assertReference(
        draft.fairs.some(({ id: fairId }) => fairId === input.fairId),
        "La solicitud debe pertenecer a una feria existente.",
        { fairId: input.fairId },
      );
      assertEntrepreneurCanRequest(input.entrepreneurId, draft);
      const standIndex = draft.stands.findIndex(
        ({ id: standId }) => standId === input.standId,
      );
      const stand = requireEntityById(
        draft.stands,
        input.standId,
        "el stand",
      );
      assertDomainValidation(
        validateCanCreateStandRequest({
          stand,
          entrepreneurId: input.entrepreneurId,
          fairId: input.fairId,
          existingRequests: draft.standRequests,
        }),
        "No se puede crear la solicitud de stand.",
      );

      draft.standRequests.push(request);
      draft.stands[standIndex] = {
        ...stand,
        status: "requested",
        activeRequestId: id,
        updatedAt: requestedAt,
      };
    });

    return requireEntityById(persisted.standRequests, id, "la solicitud");
  }

  async approve(
    id: ID,
    reviewedByDemoRole: AppRole = "fair-admin",
  ): Promise<StandRequest> {
    const reviewedAt = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const requestIndex = draft.standRequests.findIndex((item) => item.id === id);
      const request = requireEntityById(
        draft.standRequests,
        id,
        "la solicitud",
      );
      const standIndex = draft.stands.findIndex(
        ({ id: standId }) => standId === request.standId,
      );
      const stand = requireEntityById(
        draft.stands,
        request.standId,
        "el stand",
      );
      const entrepreneur = draft.entrepreneurs.find(
        ({ id: entrepreneurId }) => entrepreneurId === request.entrepreneurId,
      );

      assertDomainValidation(
        validateStandRequestApproval({ request, stand, entrepreneur }),
        "No se puede aprobar la solicitud de stand.",
      );

      const incompatibleRequestIds = new Set(
        draft.standRequests
          .filter(
            (candidate) =>
              candidate.id !== id &&
              candidate.status === "pending" &&
              (candidate.standId === request.standId ||
                (candidate.fairId === request.fairId &&
                  candidate.entrepreneurId === request.entrepreneurId)),
          )
          .map(({ id: requestId }) => requestId),
      );

      draft.standRequests = draft.standRequests.map((candidate) => {
        if (candidate.id === id) {
          return {
            ...candidate,
            status: "approved",
            reviewedAt,
            reviewedByDemoRole,
          };
        }

        if (incompatibleRequestIds.has(candidate.id)) {
          return {
            ...candidate,
            status: "rejected",
            reviewedAt,
            reviewedByDemoRole,
          };
        }

        return candidate;
      });

      draft.stands = draft.stands.map((candidate) => {
        if (candidate.id === stand.id) {
          return {
            ...candidate,
            status: "assigned",
            assignedEntrepreneurId: request.entrepreneurId,
            activeRequestId: request.id,
            updatedAt: reviewedAt,
          };
        }

        if (
          candidate.activeRequestId !== undefined &&
          incompatibleRequestIds.has(candidate.activeRequestId)
        ) {
          return standAfterRequestRemoval(
            candidate,
            draft.standRequests,
            candidate.activeRequestId,
            reviewedAt,
          );
        }

        return candidate;
      });

      if (requestIndex < 0 || standIndex < 0) {
        throw new RepositoryError(
          "REFERENTIAL_INTEGRITY",
          "La solicitud perdió sus asociaciones durante la aprobación.",
        );
      }
    });

    return requireEntityById(persisted.standRequests, id, "la solicitud");
  }

  async reject(
    id: ID,
    reviewedByDemoRole: AppRole = "fair-admin",
    note?: string,
  ): Promise<StandRequest> {
    return this.finishPendingRequest(
      id,
      "rejected",
      reviewedByDemoRole,
      note,
    );
  }

  async cancel(
    id: ID,
    reviewedByDemoRole: AppRole = "entrepreneur",
    note?: string,
  ): Promise<StandRequest> {
    const reviewedAt = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const requestIndex = draft.standRequests.findIndex((item) => item.id === id);
      const request = requireEntityById(
        draft.standRequests,
        id,
        "la solicitud",
      );
      assertDomainValidation(
        validateStandRequestTransition(request.status, "cancelled"),
        "No se puede cancelar la solicitud desde su estado actual.",
      );

      draft.standRequests[requestIndex] = {
        ...request,
        status: "cancelled",
        reviewedAt,
        reviewedByDemoRole,
        note: note ?? request.note,
      };

      const standIndex = draft.stands.findIndex(
        ({ id: standId }) => standId === request.standId,
      );

      if (standIndex >= 0) {
        const stand = draft.stands[standIndex];

        if (stand !== undefined && stand.activeRequestId === request.id) {
          draft.stands[standIndex] = standAfterRequestRemoval(
            stand,
            draft.standRequests,
            request.id,
            reviewedAt,
          );
        }
      }
    });

    return requireEntityById(persisted.standRequests, id, "la solicitud");
  }

  async reopen(id: ID): Promise<StandRequest> {
    const requestedAt = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const requestIndex = draft.standRequests.findIndex((item) => item.id === id);
      const request = requireEntityById(
        draft.standRequests,
        id,
        "la solicitud",
      );
      assertDomainValidation(
        validateStandRequestTransition(request.status, "pending"),
        "No se puede reabrir la solicitud desde su estado actual.",
      );
      assertEntrepreneurCanRequest(request.entrepreneurId, draft);
      const standIndex = draft.stands.findIndex(
        ({ id: standId }) => standId === request.standId,
      );
      const stand = requireEntityById(
        draft.stands,
        request.standId,
        "el stand",
      );
      assertDomainValidation(
        validateCanCreateStandRequest({
          stand,
          entrepreneurId: request.entrepreneurId,
          fairId: request.fairId,
          existingRequests: draft.standRequests.filter(
            ({ id: requestId }) => requestId !== request.id,
          ),
        }),
        "No se puede reabrir la solicitud de stand.",
      );

      draft.standRequests[requestIndex] = {
        ...request,
        status: "pending",
        requestedAt,
        reviewedAt: undefined,
        reviewedByDemoRole: undefined,
      };
      draft.stands[standIndex] = {
        ...stand,
        status: "requested",
        assignedEntrepreneurId: undefined,
        activeRequestId: request.id,
        updatedAt: requestedAt,
      };
    });

    return requireEntityById(persisted.standRequests, id, "la solicitud");
  }

  async updateNote(id: ID, note?: string): Promise<StandRequest> {
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const index = draft.standRequests.findIndex((item) => item.id === id);
      const request = requireEntityById(
        draft.standRequests,
        id,
        "la solicitud",
      );
      draft.standRequests[index] = { ...request, note };
    });

    return requireEntityById(persisted.standRequests, id, "la solicitud");
  }

  async delete(id: ID): Promise<void> {
    await this.context.store.mutateSharedState((draft) => {
      const request = requireEntityById(
        draft.standRequests,
        id,
        "la solicitud",
      );

      if (isActiveStandRequest(request)) {
        throw new RepositoryError(
          "ENTITY_IN_USE",
          "Una solicitud activa debe cancelarse antes de eliminarse.",
          { details: { id } },
        );
      }

      draft.standRequests = draft.standRequests.filter(
        (item) => item.id !== id,
      );
    });
  }

  private async finishPendingRequest(
    id: ID,
    status: "rejected",
    reviewedByDemoRole: AppRole,
    note?: string,
  ): Promise<StandRequest> {
    const reviewedAt = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const requestIndex = draft.standRequests.findIndex((item) => item.id === id);
      const request = requireEntityById(
        draft.standRequests,
        id,
        "la solicitud",
      );
      assertDomainValidation(
        validateStandRequestTransition(request.status, status),
        "No se puede rechazar la solicitud desde su estado actual.",
      );
      draft.standRequests[requestIndex] = {
        ...request,
        status,
        reviewedAt,
        reviewedByDemoRole,
        note: note ?? request.note,
      };

      const standIndex = draft.stands.findIndex(
        ({ id: standId }) => standId === request.standId,
      );

      if (standIndex >= 0) {
        const stand = draft.stands[standIndex];

        if (stand !== undefined && stand.activeRequestId === request.id) {
          draft.stands[standIndex] = standAfterRequestRemoval(
            stand,
            draft.standRequests,
            request.id,
            reviewedAt,
          );
        }
      }
    });

    return requireEntityById(persisted.standRequests, id, "la solicitud");
  }
}
