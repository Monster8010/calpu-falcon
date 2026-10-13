import type { SharedCalpulliState } from "@calpulli/domain";

export interface ManagementSummary {
  activeDepartments: number;
  publishedInstitutionalPosts: number;
  activeStories: number;
  availableStands: number;
  pendingStandRequests: number;
  activeEntrepreneurs: number;
  activeTutors: number;
  hiddenPosts: number;
}

export function selectManagementSummary(
  state: SharedCalpulliState,
): ManagementSummary {
  return {
    activeDepartments: state.departments.filter(({ isActive }) => isActive)
      .length,
    publishedInstitutionalPosts: state.institutionalPosts.filter(
      ({ isPublished }) => isPublished,
    ).length,
    activeStories: state.stories.filter(({ isActive }) => isActive).length,
    availableStands: state.stands.filter(
      ({ status }) => status === "available",
    ).length,
    pendingStandRequests: state.standRequests.filter(
      ({ status }) => status === "pending",
    ).length,
    activeEntrepreneurs: state.entrepreneurs.filter(({ isActive }) => isActive)
      .length,
    activeTutors: state.tutors.filter(({ isActive }) => isActive).length,
    hiddenPosts:
      state.institutionalPosts.filter(
        ({ isHiddenByModerator }) => isHiddenByModerator,
      ).length +
      state.entrepreneurPosts.filter(
        ({ isHiddenByModerator }) => isHiddenByModerator,
      ).length,
  };
}
