import {
  isActiveStandRequest,
  type Fair,
  type ID,
  type SharedCalpulliState,
  type StandRequestStatus,
} from "@calpulli/domain";

export function selectActiveFair(
  state: SharedCalpulliState,
): Fair | undefined {
  return state.fairs.find(({ status }) => status === "active");
}

export function selectUpcomingFair(
  state: SharedCalpulliState,
): Fair | undefined {
  return [...state.fairs]
    .filter(({ status }) => status === "upcoming")
    .sort((left, right) => {
      const dateDifference =
        new Date(left.nextDate).getTime() - new Date(right.nextDate).getTime();
      if (dateDifference !== 0) return dateDifference;
      return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
    })[0];
}

export function selectStandsForFair(
  state: SharedCalpulliState,
  fairId: ID,
) {
  return state.stands
    .filter((stand) => stand.fairId === fairId)
    .sort((left, right) => left.number - right.number);
}

export interface StandRequestSelectorFilter {
  fairId?: ID;
  entrepreneurId?: ID;
  status?: StandRequestStatus;
  activeOnly?: boolean;
}

export function selectStandRequests(
  state: SharedCalpulliState,
  filter: StandRequestSelectorFilter = {},
) {
  return state.standRequests.filter(
    (request) =>
      (filter.fairId === undefined || request.fairId === filter.fairId) &&
      (filter.entrepreneurId === undefined ||
        request.entrepreneurId === filter.entrepreneurId) &&
      (filter.status === undefined || request.status === filter.status) &&
      (!filter.activeOnly || isActiveStandRequest(request)),
  );
}
