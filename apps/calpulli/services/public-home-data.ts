import {
  isDepartmentPublic,
  type Department,
  type InstitutionalPost,
  type ISODateTime,
  type Story,
} from "@calpulli/domain";
import { createPublicRepositories } from "./public-repositories";

export interface PublicHomeData {
  departments: Department[];
  posts: InstitutionalPost[];
  stories: Story[];
}

export async function loadPublicHomeData(
  referenceTime: ISODateTime,
): Promise<PublicHomeData> {
  const repositories = await createPublicRepositories();
  const [allDepartments, posts, stories] = await Promise.all([
    repositories.departments.list(),
    repositories.institutionalPosts.listPublic(),
    repositories.stories.listVisible(referenceTime),
  ]);
  const departments = allDepartments.filter(isDepartmentPublic);
  const publicDepartmentIds = new Set(departments.map(({ id }) => id));

  return {
    departments,
    posts: posts.filter(({ departmentId }) =>
      publicDepartmentIds.has(departmentId),
    ),
    stories: stories.filter(({ departmentId }) =>
      publicDepartmentIds.has(departmentId),
    ),
  };
}
