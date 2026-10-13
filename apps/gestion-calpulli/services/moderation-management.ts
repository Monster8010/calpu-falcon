import type { ID } from "@calpulli/domain";

import {
  composeModerationItems,
  getModerationMetrics,
  type ModerationContentKind,
  type ModerationListItem,
  type ModerationMetrics,
} from "../features/moderation/moderation-models";
import { createManagementRepositories } from "./management-repositories";

export interface ModerationWorkspace {
  items: ModerationListItem[];
  metrics: ModerationMetrics;
}

export async function loadModerationWorkspace(): Promise<ModerationWorkspace> {
  const repositories = await createManagementRepositories();
  const [departments, entrepreneurs, entrepreneurPosts, institutionalPosts] =
    await Promise.all([
      repositories.departments.list(),
      repositories.entrepreneurs.list(),
      repositories.marketplace.listPosts(),
      repositories.institutionalPosts.list(),
    ]);
  const items = composeModerationItems({
    departments,
    entrepreneurs,
    entrepreneurPosts,
    institutionalPosts,
  });

  return { items, metrics: getModerationMetrics(items) };
}

export async function setContentHiddenByModerator(options: {
  hidden: boolean;
  id: ID;
  kind: ModerationContentKind;
}): Promise<void> {
  const { moderation } = await createManagementRepositories();

  if (options.kind === "institutional-post") {
    if (options.hidden) {
      await moderation.hideInstitutionalPost(options.id);
    } else {
      await moderation.restoreInstitutionalPost(options.id);
    }
    return;
  }

  if (options.hidden) {
    await moderation.hideEntrepreneurPost(options.id);
  } else {
    await moderation.restoreEntrepreneurPost(options.id);
  }
}
