import type { Department, ID } from "@calpulli/domain";

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

export type CreateDepartmentInput = CreateEntityInput<Department>;
export type UpdateDepartmentInput = UpdateEntityInput<Department>;

export class DepartmentsRepository extends RepositoryBase {
  constructor(context: RepositoryContext) {
    super(context);
  }

  async list(): Promise<Department[]> {
    return (await this.context.store.readState()).departments;
  }

  async getById(id: ID): Promise<Department | undefined> {
    return findEntityById((await this.context.store.readState()).departments, id);
  }

  async create(input: CreateDepartmentInput): Promise<Department> {
    const id = input.id ?? this.context.createId("department");
    const timestamp = this.context.now();
    const department: Department = {
      ...input,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const persisted = await this.context.store.mutateSharedState((draft) => {
      assertUniqueEntityId(draft.departments, id, "el departamento");
      draft.departments.push(department);
    });

    return requireEntityById(persisted.departments, id, "el departamento");
  }

  async update(
    id: ID,
    patch: UpdateDepartmentInput,
  ): Promise<Department> {
    const timestamp = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const index = draft.departments.findIndex((item) => item.id === id);
      const current = requireEntityById(
        draft.departments,
        id,
        "el departamento",
      );
      draft.departments[index] = { ...current, ...patch, updatedAt: timestamp };
    });

    return requireEntityById(persisted.departments, id, "el departamento");
  }

  async delete(id: ID): Promise<void> {
    await this.context.store.mutateSharedState((draft) => {
      requireEntityById(draft.departments, id, "el departamento");
      assertNotInUse(
        draft.institutionalPosts.some(({ departmentId }) => departmentId === id) ||
          draft.stories.some(({ departmentId }) => departmentId === id),
        "No se puede eliminar un departamento con contenido relacionado.",
        { id },
      );
      draft.departments = draft.departments.filter((item) => item.id !== id);
    });
  }
}
