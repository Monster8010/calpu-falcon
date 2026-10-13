import {
  isStoryVisibleAt,
  type Department,
  type InstitutionalPost,
  type Story,
} from "@calpulli/domain";
import type {
  UpdateDepartmentInput,
  UpdateStoryInput,
} from "@calpulli/repositories";

import {
  attachSharedImageToPostDraft,
  toCreatePostInput,
  toCreateStoryInput,
  toUpdatePostPatch,
  type InstitutionalPostDraft,
  type StoryDraft,
} from "../features/departments/department-form-models";
import { createManagementRepositories } from "./management-repositories";
import { persistSelectedSharedImage } from "./shared-media-management";

export interface DepartmentWorkspace {
  department: Department;
  posts: InstitutionalPost[];
  stories: Story[];
}

export interface DepartmentMetrics {
  activeStories: number;
  posts: number;
  views: number;
}

function newestFirst(
  a: { id: string; updatedAt: string },
  b: { id: string; updatedAt: string },
): number {
  const dateDifference = Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  if (dateDifference !== 0) return dateDifference;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

export async function listDemoDepartments(): Promise<Department[]> {
  const { departments } = await createManagementRepositories();
  return (await departments.list())
    .filter(({ isActive }) => isActive)
    .sort((a, b) => a.name.localeCompare(b.name, "es-MX"));
}

export async function loadDepartmentWorkspace(
  departmentId: string,
): Promise<DepartmentWorkspace> {
  const repositories = await createManagementRepositories();
  const [department, posts, stories] = await Promise.all([
    repositories.departments.getById(departmentId),
    repositories.institutionalPosts.list(),
    repositories.stories.list(),
  ]);

  if (department === undefined) {
    throw new Error("El departamento seleccionado ya no existe.");
  }

  return {
    department,
    posts: posts.filter((post) => post.departmentId === departmentId).sort(newestFirst),
    stories: stories.filter((story) => story.departmentId === departmentId).sort(newestFirst),
  };
}

export function getDepartmentMetrics(
  workspace: DepartmentWorkspace,
  now: string,
): DepartmentMetrics {
  return {
    posts: workspace.posts.length,
    views: [...workspace.posts, ...workspace.stories].reduce(
      (total, item) => total + item.views,
      0,
    ),
    activeStories: workspace.stories.filter((story) => isStoryVisibleAt(story, now)).length,
  };
}

export async function updateDepartmentProfile(
  departmentId: string,
  patch: UpdateDepartmentInput,
): Promise<Department> {
  const { departments } = await createManagementRepositories();
  return departments.update(departmentId, patch);
}

export async function saveDepartmentPost(options: {
  current?: InstitutionalPost;
  departmentId: string;
  draft: InstitutionalPostDraft;
  isPublished: boolean;
  now: string;
}): Promise<InstitutionalPost> {
  let draft = options.draft;

  if (options.current !== undefined) {
    toUpdatePostPatch(
      draft,
      options.current,
      options.isPublished,
      options.now,
    );
  } else {
    toCreatePostInput(
      draft,
      options.departmentId,
      options.isPublished,
      options.now,
    );
  }

  if (draft.pendingSharedImage !== undefined) {
    draft = attachSharedImageToPostDraft(
      draft,
      await persistSelectedSharedImage(draft.pendingSharedImage),
    );
  }

  const { institutionalPosts } = await createManagementRepositories();

  if (options.current !== undefined) {
    return institutionalPosts.update(
      options.current.id,
      toUpdatePostPatch(
        draft,
        options.current,
        options.isPublished,
        options.now,
      ),
    );
  }

  return institutionalPosts.create(
    toCreatePostInput(
      draft,
      options.departmentId,
      options.isPublished,
      options.now,
    ),
  );
}

export async function deleteDepartmentPost(postId: string): Promise<void> {
  const { institutionalPosts } = await createManagementRepositories();
  await institutionalPosts.delete(postId);
}

export async function saveDepartmentStory(options: {
  current?: Story;
  departmentId: string;
  draft: StoryDraft;
  now: string;
  updatePatch?: UpdateStoryInput;
}): Promise<Story> {
  const { stories } = await createManagementRepositories();

  if (options.current !== undefined) {
    if (options.updatePatch === undefined) {
      throw new Error("Faltan los cambios de la historia.");
    }
    return stories.update(options.current.id, options.updatePatch);
  }

  return stories.create(
    toCreateStoryInput(options.draft, options.departmentId, options.now),
  );
}

export async function deleteDepartmentStory(storyId: string): Promise<void> {
  const { stories } = await createManagementRepositories();
  await stories.delete(storyId);
}
