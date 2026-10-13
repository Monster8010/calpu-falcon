import type {
  Entrepreneur,
  EntrepreneurPost,
  MediaReference,
  Product,
} from "@calpulli/domain";

import { matchesLocalSearch } from "../shell/local-search";

interface MarketplaceEntryBase {
  category: string;
  description?: string;
  entrepreneur: Entrepreneur;
  id: string;
  media: MediaReference[];
  sortDate: string;
  title: string;
}

export interface MarketplaceProductEntry extends MarketplaceEntryBase {
  kind: "product";
  priceLabel?: string;
  source: Product;
}

export interface MarketplacePostEntry extends MarketplaceEntryBase {
  kind: "post";
  source: EntrepreneurPost;
}

export type MarketplaceEntry = MarketplaceProductEntry | MarketplacePostEntry;
export type MarketplaceCategory = "all" | string;

export function createMarketplaceEntries(
  entrepreneurs: readonly Entrepreneur[],
  products: readonly Product[],
  posts: readonly EntrepreneurPost[],
): MarketplaceEntry[] {
  const entrepreneursById = new Map(
    entrepreneurs.map((entrepreneur) => [entrepreneur.id, entrepreneur]),
  );
  const productEntries: MarketplaceEntry[] = products.flatMap((product) => {
    const entrepreneur = entrepreneursById.get(product.entrepreneurId);

    return entrepreneur
      ? [{
          kind: "product" as const,
          category: product.category,
          description: product.description,
          entrepreneur,
          id: product.id,
          media: product.media,
          priceLabel: product.priceLabel,
          sortDate: product.updatedAt,
          source: product,
          title: product.name,
        }]
      : [];
  });
  const postEntries: MarketplaceEntry[] = posts.flatMap((post) => {
    const entrepreneur = entrepreneursById.get(post.entrepreneurId);

    return entrepreneur
      ? [{
          kind: "post" as const,
          category: entrepreneur.category,
          description: post.body,
          entrepreneur,
          id: post.id,
          media: post.media,
          sortDate: post.publishedAt,
          source: post,
          title: post.title,
        }]
      : [];
  });

  return [...productEntries, ...postEntries].sort(compareMarketplaceEntries);
}

export function getMarketplaceCategories(
  entries: readonly MarketplaceEntry[],
): string[] {
  return [...new Set(entries.map(({ category }) => category))].sort((left, right) =>
    left.localeCompare(right, "es-MX"),
  );
}

export function filterMarketplaceEntries(
  entries: readonly MarketplaceEntry[],
  query: string,
  category: MarketplaceCategory,
): MarketplaceEntry[] {
  return entries.filter(
    (entry) =>
      (category === "all" || entry.category === category) &&
      matchesLocalSearch(query, [
        entry.title,
        entry.description,
        entry.category,
        entry.entrepreneur.displayName,
        entry.entrepreneur.category,
      ]),
  );
}

function compareMarketplaceEntries(
  left: MarketplaceEntry,
  right: MarketplaceEntry,
): number {
  const dateDifference =
    new Date(right.sortDate).getTime() - new Date(left.sortDate).getTime();

  if (dateDifference !== 0) return dateDifference;
  const leftKey = `${left.kind}:${left.id}`;
  const rightKey = `${right.kind}:${right.id}`;
  return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
}
