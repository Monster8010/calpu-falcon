import {
  filterPublicEntrepreneurPosts,
  filterPublicProducts,
  filterPublicTutoringOffers,
  filterVisibleStories,
  isDepartmentPublic,
  selectPublicInstitutionalFeed,
  type ID,
  type ISODateTime,
  type SharedCalpulliState,
} from "@calpulli/domain";

export function selectPublicDepartmentIds(
  state: SharedCalpulliState,
): ReadonlySet<ID> {
  return new Set(
    state.departments
      .filter(isDepartmentPublic)
      .map(({ id }) => id),
  );
}

export function selectInstitutionalFeed(
  state: SharedCalpulliState,
  departmentId?: ID,
) {
  const publicDepartmentIds = selectPublicDepartmentIds(state);
  return selectPublicInstitutionalFeed(
    state.institutionalPosts.filter(({ departmentId: ownerId }) =>
      publicDepartmentIds.has(ownerId),
    ),
    departmentId,
  );
}

export function selectVisibleStories(
  state: SharedCalpulliState,
  referenceTime: ISODateTime,
  departmentId?: ID,
) {
  const publicDepartmentIds = selectPublicDepartmentIds(state);
  return filterVisibleStories(state.stories, referenceTime).filter(
    (story) =>
      publicDepartmentIds.has(story.departmentId) &&
      (departmentId === undefined || story.departmentId === departmentId),
  );
}

export function selectPublicMarketplace(
  state: SharedCalpulliState,
  entrepreneurId?: ID,
) {
  return {
    posts: filterPublicEntrepreneurPosts(
      state.entrepreneurPosts,
      state.entrepreneurs,
    ).filter(
      (post) =>
        entrepreneurId === undefined || post.entrepreneurId === entrepreneurId,
    ),
    products: filterPublicProducts(state.products, state.entrepreneurs).filter(
      (product) =>
        entrepreneurId === undefined ||
        product.entrepreneurId === entrepreneurId,
    ),
  };
}

export function selectPublicTutoring(
  state: SharedCalpulliState,
  tutorId?: ID,
) {
  return {
    tutors: state.tutors.filter(
      (tutor) => tutor.isActive && (tutorId === undefined || tutor.id === tutorId),
    ),
    offers: filterPublicTutoringOffers(
      state.tutoringOffers,
      state.tutors,
    ).filter((offer) => tutorId === undefined || offer.tutorId === tutorId),
  };
}
