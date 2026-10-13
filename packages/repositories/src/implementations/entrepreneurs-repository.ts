import {
  filterActiveEntrepreneurs,
  type Entrepreneur,
  type ID,
} from "@calpulli/domain";

import {
  assertNotInUse,
  assertUniqueEntityId,
  findEntityById,
  requireEntityById,
  type CreateEntityInput,
  type RepositoryContext,
  type UpdateEntityInput,
} from "../core";
import { RepositoryBase } from "./base";

export type CreateEntrepreneurInput = CreateEntityInput<Entrepreneur>;
export type UpdateEntrepreneurInput = UpdateEntityInput<Entrepreneur>;

export class EntrepreneursRepository extends RepositoryBase {
  constructor(context: RepositoryContext) {
    super(context);
  }

  async list(): Promise<Entrepreneur[]> {
    return (await this.context.store.readState()).entrepreneurs;
  }

  async listPublic(): Promise<Entrepreneur[]> {
    return filterActiveEntrepreneurs(
      (await this.context.store.readState()).entrepreneurs,
    );
  }

  async getById(id: ID): Promise<Entrepreneur | undefined> {
    return findEntityById(
      (await this.context.store.readState()).entrepreneurs,
      id,
    );
  }

  async create(input: CreateEntrepreneurInput): Promise<Entrepreneur> {
    const id = input.id ?? this.context.createId("entrepreneur");
    const timestamp = this.context.now();
    const entrepreneur: Entrepreneur = {
      ...input,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const persisted = await this.context.store.mutateSharedState((draft) => {
      assertUniqueEntityId(draft.entrepreneurs, id, "el emprendimiento");
      draft.entrepreneurs.push(entrepreneur);
    });

    return requireEntityById(
      persisted.entrepreneurs,
      id,
      "el emprendimiento",
    );
  }

  async update(
    id: ID,
    patch: UpdateEntrepreneurInput,
  ): Promise<Entrepreneur> {
    const timestamp = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const index = draft.entrepreneurs.findIndex((item) => item.id === id);
      const current = requireEntityById(
        draft.entrepreneurs,
        id,
        "el emprendimiento",
      );
      draft.entrepreneurs[index] = {
        ...current,
        ...patch,
        updatedAt: timestamp,
      };
    });

    return requireEntityById(
      persisted.entrepreneurs,
      id,
      "el emprendimiento",
    );
  }

  async delete(id: ID): Promise<void> {
    await this.context.store.mutateSharedState((draft) => {
      requireEntityById(draft.entrepreneurs, id, "el emprendimiento");
      assertNotInUse(
        draft.entrepreneurPosts.some(({ entrepreneurId }) => entrepreneurId === id) ||
          draft.products.some(({ entrepreneurId }) => entrepreneurId === id) ||
          draft.standRequests.some(({ entrepreneurId }) => entrepreneurId === id) ||
          draft.stands.some(
            ({ assignedEntrepreneurId }) => assignedEntrepreneurId === id,
          ),
        "No se puede eliminar un emprendimiento con contenido o feria relacionados.",
        { id },
      );
      draft.entrepreneurs = draft.entrepreneurs.filter((item) => item.id !== id);
    });
  }
}
