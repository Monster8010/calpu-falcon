import type {
  Entrepreneur,
  EntrepreneurPost,
  Fair,
  ID,
  Product,
  Stand,
} from "@calpulli/domain";

import { selectPublicFair } from "../features/fair/fair-selection";
import { createPublicRepositories } from "./public-repositories";

export interface PublicFairData {
  entrepreneurs: Entrepreneur[];
  fair?: Fair;
  stands: Stand[];
}

export interface PublicEntrepreneurProfileData {
  entrepreneur: Entrepreneur;
  posts: EntrepreneurPost[];
  products: Product[];
  stand?: Stand;
}

export class PublicEntrepreneurNotFoundError extends Error {
  constructor(id: ID) {
    super(`No encontramos un emprendimiento público con id ${id}.`);
    this.name = "PublicEntrepreneurNotFoundError";
  }
}

export async function loadPublicFairData(): Promise<PublicFairData> {
  const repositories = await createPublicRepositories();
  const fair = selectPublicFair(await repositories.fairs.list());

  if (fair === undefined) {
    return { entrepreneurs: [], stands: [] };
  }

  const [stands, entrepreneurs] = await Promise.all([
    repositories.stands.list(fair.id),
    repositories.entrepreneurs.listPublic(),
  ]);

  return { fair, stands, entrepreneurs };
}

export async function loadPublicEntrepreneurProfile(
  entrepreneurId: ID,
): Promise<PublicEntrepreneurProfileData> {
  const repositories = await createPublicRepositories();
  const [entrepreneurs, posts, products, fairs] = await Promise.all([
    repositories.entrepreneurs.listPublic(),
    repositories.marketplace.listPublicPosts(entrepreneurId),
    repositories.marketplace.listPublicProducts(entrepreneurId),
    repositories.fairs.list(),
  ]);
  const entrepreneur = entrepreneurs.find(({ id }) => id === entrepreneurId);

  if (entrepreneur === undefined) {
    throw new PublicEntrepreneurNotFoundError(entrepreneurId);
  }

  const fair = selectPublicFair(fairs);
  const stands = fair?.status === "active"
    ? await repositories.stands.list(fair.id)
    : [];
  const stand = stands.find(
    ({ assignedEntrepreneurId, status }) =>
      status === "assigned" && assignedEntrepreneurId === entrepreneurId,
  );

  return { entrepreneur, posts, products, stand };
}
