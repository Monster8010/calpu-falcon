import type {
  Entrepreneur,
  EntrepreneurPost,
  ID,
  Product,
} from "@calpulli/domain";

import type { MarketplaceEntry } from "../features/marketplace/marketplace-selection";
import { createMarketplaceEntries } from "../features/marketplace/marketplace-selection";
import { createPublicRepositories } from "./public-repositories";

export interface PublicMarketplaceData {
  entrepreneurs: Entrepreneur[];
  posts: EntrepreneurPost[];
  products: Product[];
}

export class PublicMarketplaceItemNotFoundError extends Error {
  constructor(kind: string, id: ID) {
    super(`No encontramos el contenido público ${kind}:${id}.`);
    this.name = "PublicMarketplaceItemNotFoundError";
  }
}

export async function loadPublicMarketplaceData(): Promise<PublicMarketplaceData> {
  const repositories = await createPublicRepositories();
  const [entrepreneurs, posts, products] = await Promise.all([
    repositories.entrepreneurs.listPublic(),
    repositories.marketplace.listPublicPosts(),
    repositories.marketplace.listPublicProducts(),
  ]);

  return { entrepreneurs, posts, products };
}

export async function loadPublicMarketplaceEntry(
  kind: "post" | "product",
  id: ID,
): Promise<MarketplaceEntry> {
  const data = await loadPublicMarketplaceData();
  const entry = createMarketplaceEntries(
    data.entrepreneurs,
    data.products,
    data.posts,
  ).find((item) => item.kind === kind && item.id === id);

  if (entry === undefined) {
    throw new PublicMarketplaceItemNotFoundError(kind, id);
  }

  return entry;
}
