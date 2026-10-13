import {
  filterPublicEntrepreneurPosts,
  filterPublicProducts,
  type EntrepreneurPost,
  type ID,
  type Product,
} from "@calpulli/domain";

import {
  assertReference,
  assertUniqueEntityId,
  findEntityById,
  requireEntityById,
  type CreateEntityInput,
  type RepositoryContext,
  type UpdateEntityInput,
} from "../core";
import { RepositoryBase } from "./base";

export type CreateEntrepreneurPostInput = CreateEntityInput<EntrepreneurPost>;
export type UpdateEntrepreneurPostInput = UpdateEntityInput<EntrepreneurPost>;
export type CreateProductInput = CreateEntityInput<Product>;
export type UpdateProductInput = UpdateEntityInput<Product>;

function assertEntrepreneurExists(
  entrepreneurId: ID,
  entrepreneurs: readonly { id: ID }[],
): void {
  assertReference(
    entrepreneurs.some(({ id }) => id === entrepreneurId),
    "El contenido debe pertenecer a un emprendimiento existente.",
    { entrepreneurId },
  );
}

export class MarketplaceRepository extends RepositoryBase {
  constructor(context: RepositoryContext) {
    super(context);
  }

  async listPosts(entrepreneurId?: ID): Promise<EntrepreneurPost[]> {
    const posts = (await this.context.store.readState()).entrepreneurPosts;
    return entrepreneurId === undefined
      ? posts
      : posts.filter((post) => post.entrepreneurId === entrepreneurId);
  }

  async listPublicPosts(entrepreneurId?: ID): Promise<EntrepreneurPost[]> {
    const state = await this.context.store.readState();
    return filterPublicEntrepreneurPosts(
      state.entrepreneurPosts,
      state.entrepreneurs,
    )
      .filter(
        (post) =>
          entrepreneurId === undefined || post.entrepreneurId === entrepreneurId,
      )
      .sort((left, right) => {
        const dateDifference =
          new Date(right.publishedAt).getTime() -
          new Date(left.publishedAt).getTime();
        if (dateDifference !== 0) return dateDifference;
        return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
      });
  }

  async getPostById(id: ID): Promise<EntrepreneurPost | undefined> {
    return findEntityById(
      (await this.context.store.readState()).entrepreneurPosts,
      id,
    );
  }

  async createPost(
    input: CreateEntrepreneurPostInput,
  ): Promise<EntrepreneurPost> {
    const id = input.id ?? this.context.createId("entrepreneur-post");
    const timestamp = this.context.now();
    const post: EntrepreneurPost = {
      ...input,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const persisted = await this.context.store.mutateSharedState((draft) => {
      assertUniqueEntityId(draft.entrepreneurPosts, id, "la publicación");
      assertEntrepreneurExists(post.entrepreneurId, draft.entrepreneurs);
      draft.entrepreneurPosts.push(post);
    });

    return requireEntityById(
      persisted.entrepreneurPosts,
      id,
      "la publicación",
    );
  }

  async updatePost(
    id: ID,
    patch: UpdateEntrepreneurPostInput,
  ): Promise<EntrepreneurPost> {
    const timestamp = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const index = draft.entrepreneurPosts.findIndex((item) => item.id === id);
      const current = requireEntityById(
        draft.entrepreneurPosts,
        id,
        "la publicación",
      );
      const next = { ...current, ...patch, updatedAt: timestamp };
      assertEntrepreneurExists(next.entrepreneurId, draft.entrepreneurs);
      draft.entrepreneurPosts[index] = next;
    });

    return requireEntityById(
      persisted.entrepreneurPosts,
      id,
      "la publicación",
    );
  }

  async deletePost(id: ID): Promise<void> {
    await this.context.store.mutateSharedState((draft) => {
      requireEntityById(draft.entrepreneurPosts, id, "la publicación");
      draft.entrepreneurPosts = draft.entrepreneurPosts.filter(
        (item) => item.id !== id,
      );
    });
  }

  async listProducts(entrepreneurId?: ID): Promise<Product[]> {
    const products = (await this.context.store.readState()).products;
    return entrepreneurId === undefined
      ? products
      : products.filter((product) => product.entrepreneurId === entrepreneurId);
  }

  async listPublicProducts(entrepreneurId?: ID): Promise<Product[]> {
    const state = await this.context.store.readState();
    return filterPublicProducts(state.products, state.entrepreneurs).filter(
      (product) =>
        entrepreneurId === undefined || product.entrepreneurId === entrepreneurId,
    );
  }

  async getProductById(id: ID): Promise<Product | undefined> {
    return findEntityById((await this.context.store.readState()).products, id);
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    const id = input.id ?? this.context.createId("product");
    const timestamp = this.context.now();
    const product: Product = {
      ...input,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const persisted = await this.context.store.mutateSharedState((draft) => {
      assertUniqueEntityId(draft.products, id, "el producto");
      assertEntrepreneurExists(product.entrepreneurId, draft.entrepreneurs);
      draft.products.push(product);
    });

    return requireEntityById(persisted.products, id, "el producto");
  }

  async updateProduct(
    id: ID,
    patch: UpdateProductInput,
  ): Promise<Product> {
    const timestamp = this.context.now();
    const persisted = await this.context.store.mutateSharedState((draft) => {
      const index = draft.products.findIndex((item) => item.id === id);
      const current = requireEntityById(draft.products, id, "el producto");
      const next = { ...current, ...patch, updatedAt: timestamp };
      assertEntrepreneurExists(next.entrepreneurId, draft.entrepreneurs);
      draft.products[index] = next;
    });

    return requireEntityById(persisted.products, id, "el producto");
  }

  async deleteProduct(id: ID): Promise<void> {
    await this.context.store.mutateSharedState((draft) => {
      requireEntityById(draft.products, id, "el producto");
      draft.products = draft.products.filter((item) => item.id !== id);
    });
  }
}
