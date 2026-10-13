import type { EntrepreneurPost, ID, InstitutionalPost } from "@calpulli/domain";

import {
  requireEntityById,
  type RepositoryContext,
} from "../core";
import { RepositoryBase } from "./base";

export interface ModeratedContent {
  institutionalPosts: InstitutionalPost[];
  entrepreneurPosts: EntrepreneurPost[];
}

export class ModerationRepository extends RepositoryBase {
  constructor(context: RepositoryContext) {
    super(context);
  }

  async listHidden(): Promise<ModeratedContent> {
    const state = await this.context.store.readState();
    return {
      institutionalPosts: state.institutionalPosts.filter(
        ({ isHiddenByModerator }) => isHiddenByModerator,
      ),
      entrepreneurPosts: state.entrepreneurPosts.filter(
        ({ isHiddenByModerator }) => isHiddenByModerator,
      ),
    };
  }

  async hideInstitutionalPost(id: ID): Promise<InstitutionalPost> {
    return this.setInstitutionalPostHidden(id, true);
  }

  async restoreInstitutionalPost(id: ID): Promise<InstitutionalPost> {
    return this.setInstitutionalPostHidden(id, false);
  }

  async hideEntrepreneurPost(id: ID): Promise<EntrepreneurPost> {
    return this.setEntrepreneurPostHidden(id, true);
  }

  async restoreEntrepreneurPost(id: ID): Promise<EntrepreneurPost> {
    return this.setEntrepreneurPostHidden(id, false);
  }

  private async setInstitutionalPostHidden(
    id: ID,
    isHiddenByModerator: boolean,
  ): Promise<InstitutionalPost> {
    const timestamp = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const index = draft.institutionalPosts.findIndex((item) => item.id === id);
      const current = requireEntityById(
        draft.institutionalPosts,
        id,
        "la publicación institucional",
      );
      draft.institutionalPosts[index] = {
        ...current,
        isHiddenByModerator,
        updatedAt: timestamp,
      };
    });

    return requireEntityById(
      persisted.institutionalPosts,
      id,
      "la publicación institucional",
    );
  }

  private async setEntrepreneurPostHidden(
    id: ID,
    isHiddenByModerator: boolean,
  ): Promise<EntrepreneurPost> {
    const timestamp = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const index = draft.entrepreneurPosts.findIndex((item) => item.id === id);
      const current = requireEntityById(
        draft.entrepreneurPosts,
        id,
        "la publicación de emprendimiento",
      );
      draft.entrepreneurPosts[index] = {
        ...current,
        isHiddenByModerator,
        updatedAt: timestamp,
      };
    });

    return requireEntityById(
      persisted.entrepreneurPosts,
      id,
      "la publicación de emprendimiento",
    );
  }
}
