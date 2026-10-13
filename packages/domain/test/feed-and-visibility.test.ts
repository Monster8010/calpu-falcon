import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  filterActiveEntrepreneurs,
  filterActiveTutors,
  filterPublicEntrepreneurPosts,
  filterPublicProducts,
  filterPublicTutoringOffers,
  isEntrepreneurPostPublic,
  isProductPublic,
  isTutoringOfferPublic,
  selectPublicInstitutionalFeed,
  sortInstitutionalFeed,
  type Entrepreneur,
  type EntrepreneurPost,
  type Product,
  type Tutor,
  type TutoringOffer,
} from "../src/index";
import {
  createEntrepreneur,
  createInstitutionalPost,
} from "./fixtures";

describe("feed institucional", () => {
  it("ordena por prioridad, fecha e id sin mutar la entrada", () => {
    const posts = [
      createInstitutionalPost({
        id: "normal-new",
        priority: "normal",
        publishedAt: "2026-08-10T11:00:00.000Z",
      }),
      createInstitutionalPost({
        id: "urgent-old",
        priority: "urgent",
        publishedAt: "2026-08-09T11:00:00.000Z",
      }),
      createInstitutionalPost({
        id: "important-b",
        priority: "important",
        publishedAt: "2026-08-10T09:00:00.000Z",
      }),
      createInstitutionalPost({
        id: "important-a",
        priority: "important",
        publishedAt: "2026-08-10T09:00:00.000Z",
      }),
    ];
    const originalIds = posts.map((post) => post.id);

    const sorted = sortInstitutionalFeed(posts);

    assert.deepEqual(
      sorted.map((post) => post.id),
      ["urgent-old", "important-a", "important-b", "normal-new"],
    );
    assert.deepEqual(
      posts.map((post) => post.id),
      originalIds,
    );
  });

  it("excluye borradores/moderados y filtra por departamento", () => {
    const posts = [
      createInstitutionalPost({ id: "visible", departmentId: "culture" }),
      createInstitutionalPost({
        id: "draft",
        departmentId: "culture",
        isPublished: false,
      }),
      createInstitutionalPost({
        id: "moderated",
        departmentId: "culture",
        isHiddenByModerator: true,
        priority: "urgent",
      }),
      createInstitutionalPost({ id: "other", departmentId: "library" }),
    ];

    assert.deepEqual(
      selectPublicInstitutionalFeed(posts, "culture").map((post) => post.id),
      ["visible"],
    );
    assert.deepEqual(
      selectPublicInstitutionalFeed(posts).map((post) => post.id),
      ["other", "visible"],
    );
  });
});

describe("visibilidad de entidades públicas", () => {
  it("oculta publicaciones de emprendimiento no publicadas o moderadas", () => {
    const base: EntrepreneurPost = {
      id: "entrepreneur-post-1",
      entrepreneurId: "entrepreneur-1",
      title: "Publicación",
      body: "Contenido",
      media: [],
      publishedAt: "2026-08-10T12:00:00.000Z",
      isPublished: true,
      isHiddenByModerator: false,
      createdAt: "2026-08-10T12:00:00.000Z",
      updatedAt: "2026-08-10T12:00:00.000Z",
    };

    const activeEntrepreneur = createEntrepreneur();

    assert.equal(isEntrepreneurPostPublic(base, activeEntrepreneur), true);
    assert.equal(
      isEntrepreneurPostPublic({ ...base, isPublished: false }, activeEntrepreneur),
      false,
    );
    assert.equal(
      isEntrepreneurPostPublic(
        { ...base, isHiddenByModerator: true },
        activeEntrepreneur,
      ),
      false,
    );
    assert.equal(
      isEntrepreneurPostPublic(
        base,
        createEntrepreneur({ isActive: false }),
      ),
      false,
    );
    assert.deepEqual(
      filterPublicEntrepreneurPosts(
        [base],
        [createEntrepreneur({ isActive: false })],
      ),
      [],
    );
  });

  it("filtra emprendedores y tutores inactivos", () => {
    const entrepreneurs: Entrepreneur[] = [
      createEntrepreneur({ id: "active" }),
      createEntrepreneur({ id: "inactive", isActive: false }),
    ];
    const tutorBase: Tutor = {
      id: "tutor-1",
      displayName: "Tutor",
      description: "Descripción",
      avatar: { type: "bundled", key: "tutor-placeholder" },
      modes: ["hybrid"],
      externalContacts: [],
      isActive: true,
      createdAt: "2026-08-10T12:00:00.000Z",
      updatedAt: "2026-08-10T12:00:00.000Z",
    };
    const tutors = [tutorBase, { ...tutorBase, id: "tutor-2", isActive: false }];

    assert.deepEqual(
      filterActiveEntrepreneurs(entrepreneurs).map((item) => item.id),
      ["active"],
    );
    assert.deepEqual(
      filterActiveTutors(tutors).map((item) => item.id),
      ["tutor-1"],
    );
  });

  it("respeta el estado activo de productos y ofertas", () => {
    const activeEntrepreneur = createEntrepreneur();
    const inactiveEntrepreneur = createEntrepreneur({ isActive: false });
    const product = {
      entrepreneurId: activeEntrepreneur.id,
      isActive: true,
    } as Product;
    const tutor = {
      id: "tutor-1",
      isActive: true,
    } as Tutor;
    const inactiveTutor = { ...tutor, isActive: false };
    const offer = { tutorId: tutor.id, isActive: true } as TutoringOffer;

    assert.equal(isProductPublic(product, activeEntrepreneur), true);
    assert.equal(
      isProductPublic({ ...product, isActive: false }, activeEntrepreneur),
      false,
    );
    assert.equal(isProductPublic(product, inactiveEntrepreneur), false);
    assert.deepEqual(
      filterPublicProducts([product], [inactiveEntrepreneur]),
      [],
    );
    assert.equal(isTutoringOfferPublic(offer, tutor), true);
    assert.equal(
      isTutoringOfferPublic({ ...offer, isActive: false }, tutor),
      false,
    );
    assert.equal(isTutoringOfferPublic(offer, inactiveTutor), false);
    assert.deepEqual(filterPublicTutoringOffers([offer], [inactiveTutor]), []);
  });
});
