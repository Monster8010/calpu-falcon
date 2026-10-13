import {
  filterActiveTutors,
  filterPublicTutoringOffers,
  type ID,
  type Tutor,
  type TutoringOffer,
} from "@calpulli/domain";

import {
  assertNotInUse,
  assertReference,
  assertUniqueEntityId,
  findEntityById,
  requireEntityById,
  type CreateEntityInput,
  type RepositoryContext,
  type UpdateEntityInput,
} from "../core";
import { RepositoryBase } from "./base";

export type CreateTutorInput = CreateEntityInput<Tutor>;
export type UpdateTutorInput = UpdateEntityInput<Tutor>;
export type CreateTutoringOfferInput = CreateEntityInput<TutoringOffer>;
export type UpdateTutoringOfferInput = UpdateEntityInput<TutoringOffer>;

function assertTutorExists(tutorId: ID, tutors: readonly { id: ID }[]): void {
  assertReference(
    tutors.some(({ id }) => id === tutorId),
    "La oferta debe pertenecer a un tutor existente.",
    { tutorId },
  );
}

export class TutorsRepository extends RepositoryBase {
  constructor(context: RepositoryContext) {
    super(context);
  }

  async list(): Promise<Tutor[]> {
    return (await this.context.store.readState()).tutors;
  }

  async listPublic(): Promise<Tutor[]> {
    return filterActiveTutors((await this.context.store.readState()).tutors);
  }

  async getById(id: ID): Promise<Tutor | undefined> {
    return findEntityById((await this.context.store.readState()).tutors, id);
  }

  async create(input: CreateTutorInput): Promise<Tutor> {
    const id = input.id ?? this.context.createId("tutor");
    const timestamp = this.context.now();
    const tutor: Tutor = {
      ...input,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const persisted = await this.context.store.mutateSharedState((draft) => {
      assertUniqueEntityId(draft.tutors, id, "el tutor");
      draft.tutors.push(tutor);
    });

    return requireEntityById(persisted.tutors, id, "el tutor");
  }

  async update(id: ID, patch: UpdateTutorInput): Promise<Tutor> {
    const timestamp = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const index = draft.tutors.findIndex((item) => item.id === id);
      const current = requireEntityById(draft.tutors, id, "el tutor");
      draft.tutors[index] = { ...current, ...patch, updatedAt: timestamp };
    });

    return requireEntityById(persisted.tutors, id, "el tutor");
  }

  async delete(id: ID): Promise<void> {
    await this.context.store.mutateSharedState((draft) => {
      requireEntityById(draft.tutors, id, "el tutor");
      assertNotInUse(
        draft.tutoringOffers.some(({ tutorId }) => tutorId === id),
        "No se puede eliminar un tutor con ofertas relacionadas.",
        { id },
      );
      draft.tutors = draft.tutors.filter((item) => item.id !== id);
    });
  }

  async listOffers(tutorId?: ID): Promise<TutoringOffer[]> {
    const offers = (await this.context.store.readState()).tutoringOffers;
    return tutorId === undefined
      ? offers
      : offers.filter((offer) => offer.tutorId === tutorId);
  }

  async listPublicOffers(tutorId?: ID): Promise<TutoringOffer[]> {
    const state = await this.context.store.readState();
    return filterPublicTutoringOffers(state.tutoringOffers, state.tutors).filter(
      (offer) => tutorId === undefined || offer.tutorId === tutorId,
    );
  }

  async getOfferById(id: ID): Promise<TutoringOffer | undefined> {
    return findEntityById(
      (await this.context.store.readState()).tutoringOffers,
      id,
    );
  }

  async createOffer(input: CreateTutoringOfferInput): Promise<TutoringOffer> {
    const id = input.id ?? this.context.createId("tutoring-offer");
    const timestamp = this.context.now();
    const offer: TutoringOffer = {
      ...input,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const persisted = await this.context.store.mutateSharedState((draft) => {
      assertUniqueEntityId(draft.tutoringOffers, id, "la oferta");
      assertTutorExists(offer.tutorId, draft.tutors);
      draft.tutoringOffers.push(offer);
    });

    return requireEntityById(persisted.tutoringOffers, id, "la oferta");
  }

  async updateOffer(
    id: ID,
    patch: UpdateTutoringOfferInput,
  ): Promise<TutoringOffer> {
    const timestamp = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const index = draft.tutoringOffers.findIndex((item) => item.id === id);
      const current = requireEntityById(
        draft.tutoringOffers,
        id,
        "la oferta",
      );
      const next = { ...current, ...patch, updatedAt: timestamp };
      assertTutorExists(next.tutorId, draft.tutors);
      draft.tutoringOffers[index] = next;
    });

    return requireEntityById(persisted.tutoringOffers, id, "la oferta");
  }

  async deleteOffer(id: ID): Promise<void> {
    await this.context.store.mutateSharedState((draft) => {
      requireEntityById(draft.tutoringOffers, id, "la oferta");
      draft.tutoringOffers = draft.tutoringOffers.filter(
        (item) => item.id !== id,
      );
    });
  }
}
