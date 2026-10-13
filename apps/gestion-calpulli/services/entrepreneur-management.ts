import type {
  Entrepreneur,
  EntrepreneurPost,
  Fair,
  Product,
  Stand,
  StandRequest,
} from "@calpulli/domain";
import type {
  UpdateEntrepreneurInput,
  UpdateEntrepreneurPostInput,
  UpdateProductInput,
} from "@calpulli/repositories";

import {
  selectFairForEntrepreneur,
  sortEntrepreneurRequests,
} from "../features/entrepreneurs/entrepreneur-models";
import {
  toCreateEntrepreneurPostInput,
  toCreateProductInput,
  type EntrepreneurPostDraft,
  type ProductDraft,
} from "../features/entrepreneurs/entrepreneur-form-models";
import { createManagementRepositories } from "./management-repositories";

export interface EntrepreneurWorkspace {
  entrepreneur: Entrepreneur;
  fair?: Fair;
  posts: EntrepreneurPost[];
  products: Product[];
  requests: StandRequest[];
  stands: Stand[];
}

function newestFirst(
  left: { id: string; updatedAt: string },
  right: { id: string; updatedAt: string },
): number {
  const difference = Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
  if (difference !== 0) return difference;
  return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
}

export async function listDemoEntrepreneurs(): Promise<Entrepreneur[]> {
  const { entrepreneurs } = await createManagementRepositories();
  return (await entrepreneurs.list())
    .filter(({ isActive }) => isActive)
    .sort((left, right) => left.displayName.localeCompare(right.displayName, "es-MX"));
}

export async function loadEntrepreneurWorkspace(
  entrepreneurId: string,
): Promise<EntrepreneurWorkspace> {
  const repositories = await createManagementRepositories();
  const [entrepreneur, posts, products, fairs] = await Promise.all([
    repositories.entrepreneurs.getById(entrepreneurId),
    repositories.marketplace.listPosts(entrepreneurId),
    repositories.marketplace.listProducts(entrepreneurId),
    repositories.fairs.list(),
  ]);

  if (entrepreneur === undefined) {
    throw new Error("El emprendimiento seleccionado ya no existe.");
  }

  const fair = selectFairForEntrepreneur(fairs);
  const [stands, requests] = fair === undefined
    ? [[], []] as [Stand[], StandRequest[]]
    : await Promise.all([
        repositories.stands.list(fair.id),
        repositories.standRequests.list({
          fairId: fair.id,
          entrepreneurId,
        }),
      ]);

  return {
    entrepreneur,
    fair,
    posts: [...posts].sort(newestFirst),
    products: [...products].sort(newestFirst),
    stands: [...stands].sort((left, right) => left.number - right.number),
    requests: sortEntrepreneurRequests(requests),
  };
}

export async function updateEntrepreneurProfile(
  entrepreneurId: string,
  patch: UpdateEntrepreneurInput,
): Promise<Entrepreneur> {
  const { entrepreneurs } = await createManagementRepositories();
  return entrepreneurs.update(entrepreneurId, patch);
}

export async function saveEntrepreneurPost(options: {
  current?: EntrepreneurPost;
  draft: EntrepreneurPostDraft;
  entrepreneurId: string;
  isPublished: boolean;
  now: string;
  updatePatch?: UpdateEntrepreneurPostInput;
}): Promise<EntrepreneurPost> {
  const { marketplace } = await createManagementRepositories();
  if (options.current !== undefined) {
    if (options.updatePatch === undefined) {
      throw new Error("Faltan los cambios de la publicación.");
    }
    return marketplace.updatePost(options.current.id, options.updatePatch);
  }
  return marketplace.createPost(
    toCreateEntrepreneurPostInput(
      options.draft,
      options.entrepreneurId,
      options.isPublished,
      options.now,
    ),
  );
}

export async function deleteEntrepreneurPost(postId: string): Promise<void> {
  const { marketplace } = await createManagementRepositories();
  await marketplace.deletePost(postId);
}

export async function saveEntrepreneurProduct(options: {
  current?: Product;
  draft: ProductDraft;
  entrepreneurId: string;
  updatePatch?: UpdateProductInput;
}): Promise<Product> {
  const { marketplace } = await createManagementRepositories();
  if (options.current !== undefined) {
    if (options.updatePatch === undefined) {
      throw new Error("Faltan los cambios del producto.");
    }
    return marketplace.updateProduct(options.current.id, options.updatePatch);
  }
  return marketplace.createProduct(
    toCreateProductInput(options.draft, options.entrepreneurId),
  );
}

export async function deleteEntrepreneurProduct(productId: string): Promise<void> {
  const { marketplace } = await createManagementRepositories();
  await marketplace.deleteProduct(productId);
}

export async function requestEntrepreneurStand(options: {
  entrepreneurId: string;
  fairId: string;
  standId: string;
}): Promise<StandRequest> {
  const { standRequests } = await createManagementRepositories();
  return standRequests.create(options);
}
