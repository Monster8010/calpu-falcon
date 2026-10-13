import {
  filterVisibleStories,
  validateStorySchedule,
  type ID,
  type ISODateTime,
  type Story,
} from "@calpulli/domain";

import {
  assertDomainValidation,
  assertReference,
  assertUniqueEntityId,
  findEntityById,
  requireEntityById,
  type CreateEntityInput,
  type RepositoryContext,
  type UpdateEntityInput,
} from "../core";
import { RepositoryBase } from "./base";

export type CreateStoryInput = CreateEntityInput<Story>;
export type UpdateStoryInput = UpdateEntityInput<Story>;

function assertValidStory(
  story: Story,
  departmentIds: ReadonlySet<ID>,
): void {
  assertReference(
    departmentIds.has(story.departmentId),
    "La historia debe pertenecer a un departamento existente.",
    { departmentId: story.departmentId },
  );
  assertDomainValidation(
    validateStorySchedule(story),
    "El intervalo de la historia no es válido.",
  );
}

export class StoriesRepository extends RepositoryBase {
  constructor(context: RepositoryContext) {
    super(context);
  }

  async list(): Promise<Story[]> {
    return (await this.context.store.readState()).stories;
  }

  async listVisible(referenceTime: ISODateTime): Promise<Story[]> {
    return filterVisibleStories(
      (await this.context.store.readState()).stories,
      referenceTime,
    );
  }

  async getById(id: ID): Promise<Story | undefined> {
    return findEntityById((await this.context.store.readState()).stories, id);
  }

  async create(input: CreateStoryInput): Promise<Story> {
    const id = input.id ?? this.context.createId("story");
    const timestamp = this.context.now();
    const story: Story = {
      ...input,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const persisted = await this.context.store.mutateSharedState((draft) => {
      assertUniqueEntityId(draft.stories, id, "la historia");
      assertValidStory(
        story,
        new Set(draft.departments.map(({ id: departmentId }) => departmentId)),
      );
      draft.stories.push(story);
    });

    return requireEntityById(persisted.stories, id, "la historia");
  }

  async update(id: ID, patch: UpdateStoryInput): Promise<Story> {
    const timestamp = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const index = draft.stories.findIndex((item) => item.id === id);
      const current = requireEntityById(draft.stories, id, "la historia");
      const next = { ...current, ...patch, updatedAt: timestamp };
      assertValidStory(
        next,
        new Set(draft.departments.map(({ id: departmentId }) => departmentId)),
      );
      draft.stories[index] = next;
    });

    return requireEntityById(persisted.stories, id, "la historia");
  }

  async delete(id: ID): Promise<void> {
    await this.context.store.mutateSharedState((draft) => {
      requireEntityById(draft.stories, id, "la historia");
      draft.stories = draft.stories.filter((item) => item.id !== id);
    });
  }
}
