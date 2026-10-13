import {
  selectPublicInstitutionalFeed,
  type ID,
  type InstitutionalPost,
} from "@calpulli/domain";

import {
  assertReference,
  assertUniqueEntityId,
  findEntityById,
  requireEntityById,
  type CreateEntityInput,
  type RepositoryContext,
  type UpdateEntityInput,
} from "../core";
import { RepositoryBase } from "./base";

export type CreateInstitutionalPostInput =
  CreateEntityInput<InstitutionalPost>;
export type UpdateInstitutionalPostInput =
  UpdateEntityInput<InstitutionalPost>;

function assertDepartmentExists(
  departmentId: ID,
  departments: readonly { id: ID }[],
): void {
  assertReference(
    departments.some(({ id }) => id === departmentId),
    "La publicación debe pertenecer a un departamento existente.",
    { departmentId },
  );
}

export class InstitutionalPostsRepository extends RepositoryBase {
  constructor(context: RepositoryContext) {
    super(context);
  }

  async list(): Promise<InstitutionalPost[]> {
    return (await this.context.store.readState()).institutionalPosts;
  }

  async listPublic(departmentId?: ID): Promise<InstitutionalPost[]> {
    const state = await this.context.store.readState();
    return selectPublicInstitutionalFeed(
      state.institutionalPosts,
      departmentId,
    );
  }

  async getById(id: ID): Promise<InstitutionalPost | undefined> {
    return findEntityById(
      (await this.context.store.readState()).institutionalPosts,
      id,
    );
  }

  async create(
    input: CreateInstitutionalPostInput,
  ): Promise<InstitutionalPost> {
    const id = input.id ?? this.context.createId("institutional-post");
    const timestamp = this.context.now();
    const post: InstitutionalPost = {
      ...input,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const persisted = await this.context.store.mutateSharedState((draft) => {
      assertUniqueEntityId(draft.institutionalPosts, id, "la publicación");
      assertDepartmentExists(post.departmentId, draft.departments);
      draft.institutionalPosts.push(post);
    });

    return requireEntityById(
      persisted.institutionalPosts,
      id,
      "la publicación",
    );
  }

  async update(
    id: ID,
    patch: UpdateInstitutionalPostInput,
  ): Promise<InstitutionalPost> {
    const timestamp = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const index = draft.institutionalPosts.findIndex((item) => item.id === id);
      const current = requireEntityById(
        draft.institutionalPosts,
        id,
        "la publicación",
      );
      const next = { ...current, ...patch, updatedAt: timestamp };
      assertDepartmentExists(next.departmentId, draft.departments);
      draft.institutionalPosts[index] = next;
    });

    return requireEntityById(
      persisted.institutionalPosts,
      id,
      "la publicación",
    );
  }

  async delete(id: ID): Promise<void> {
    await this.context.store.mutateSharedState((draft) => {
      requireEntityById(draft.institutionalPosts, id, "la publicación");
      draft.institutionalPosts = draft.institutionalPosts.filter(
        (item) => item.id !== id,
      );
    });
  }
}
