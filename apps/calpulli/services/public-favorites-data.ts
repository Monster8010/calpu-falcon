import {
  isDepartmentPublic,
  type Department,
  type InstitutionalPost,
} from "@calpulli/domain";

import { createPublicRepositories } from "./public-repositories";

export interface PublicFavoritesData {
  departments: Department[];
  posts: InstitutionalPost[];
}

export async function loadPublicFavoritesData(): Promise<PublicFavoritesData> {
  const repositories = await createPublicRepositories();
  const [allDepartments, posts] = await Promise.all([
    repositories.departments.list(),
    repositories.institutionalPosts.listPublic(),
  ]);
  const departments = allDepartments.filter(isDepartmentPublic);
  const departmentIds = new Set(departments.map(({ id }) => id));

  return {
    departments,
    posts: posts.filter(({ departmentId }) => departmentIds.has(departmentId)),
  };
}
