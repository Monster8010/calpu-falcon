import type {
  Entrepreneur,
  Fair,
  Stand,
  StandRequest,
} from "@calpulli/domain";

import {
  selectFairForAdministration,
  sortFairRequests,
} from "../features/fair-admin/fair-admin-models";
import { createManagementRepositories } from "./management-repositories";

export interface FairAdminWorkspace {
  entrepreneurs: Entrepreneur[];
  fair?: Fair;
  requests: StandRequest[];
  stands: Stand[];
}

export async function loadFairAdminWorkspace(): Promise<FairAdminWorkspace> {
  const repositories = await createManagementRepositories();
  const fair = selectFairForAdministration(await repositories.fairs.list());

  if (fair === undefined) {
    return { entrepreneurs: [], requests: [], stands: [] };
  }

  const [stands, requests, entrepreneurs] = await Promise.all([
    repositories.stands.list(fair.id),
    repositories.standRequests.list({ fairId: fair.id }),
    repositories.entrepreneurs.list(),
  ]);

  return {
    fair,
    stands: [...stands].sort((left, right) => left.number - right.number),
    requests: sortFairRequests(requests),
    entrepreneurs,
  };
}

export async function updateFairDate(
  fairId: string,
  nextDate: string,
): Promise<Fair> {
  const { fairs } = await createManagementRepositories();
  return fairs.update(fairId, { nextDate });
}

export async function activateFair(fairId: string): Promise<Fair> {
  const { fairs } = await createManagementRepositories();
  return fairs.activate(fairId);
}

export async function finishFair(
  fairId: string,
  nextDate: string,
): Promise<Fair> {
  const { fairs } = await createManagementRepositories();
  return fairs.finish(fairId, nextDate, "fair-admin");
}

export async function approveStandRequest(
  requestId: string,
): Promise<StandRequest> {
  const { standRequests } = await createManagementRepositories();
  return standRequests.approve(requestId, "fair-admin");
}

export async function rejectStandRequest(
  requestId: string,
): Promise<StandRequest> {
  const { standRequests } = await createManagementRepositories();
  return standRequests.reject(requestId, "fair-admin");
}

export async function releaseFairStand(standId: string): Promise<Stand> {
  const { stands } = await createManagementRepositories();
  return stands.release(standId, "fair-admin");
}
