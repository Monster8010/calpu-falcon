import type {
  Entrepreneur,
  EntrepreneurPost,
  ExternalContact,
  Product,
  Tutor,
  TutoringOffer,
} from "@calpulli/domain";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getExternalContactUrl } from "../features/contact/external-contact";
import {
  createMarketplaceEntries,
  filterMarketplaceEntries,
  getMarketplaceCategories,
} from "../features/marketplace/marketplace-selection";
import {
  createPublicTutorProfiles,
  filterPublicTutorProfiles,
} from "../features/tutoring/tutoring-selection";

const TIMESTAMP = "2026-08-10T12:00:00.000Z";
const MEDIA = { type: "bundled" as const, key: "demo/media" };

describe("descubrimiento de Marketplace", () => {
  it("combina productos y publicaciones con su emprendimiento y orden reciente", () => {
    const entrepreneur = createEntrepreneur();
    const entries = createMarketplaceEntries(
      [entrepreneur],
      [createProduct()],
      [createPost()],
    );

    assert.deepEqual(entries.map(({ kind }) => kind), ["post", "product"]);
    assert.ok(entries.every((entry) => entry.entrepreneur === entrepreneur));
    assert.deepEqual(getMarketplaceCategories(entries), ["Alimentos", "Bebidas"]);
  });

  it("busca sin distinguir acentos y filtra categoría exacta", () => {
    const entries = createMarketplaceEntries(
      [createEntrepreneur()],
      [createProduct()],
      [createPost()],
    );

    assert.deepEqual(
      filterMarketplaceEntries(entries, "cafe", "all").map(({ id }) => id),
      ["post-1", "product-1"],
    );
    assert.deepEqual(
      filterMarketplaceEntries(entries, "", "Bebidas").map(({ id }) => id),
      ["product-1"],
    );
  });

  it("no construye cards para contenido sin propietario público", () => {
    assert.deepEqual(
      createMarketplaceEntries([], [createProduct()], [createPost()]),
      [],
    );
  });
});

describe("descubrimiento de Tutorías", () => {
  it("agrupa materias y modalidades para búsqueda y filtros locales", () => {
    const profiles = createPublicTutorProfiles(
      [createTutor()],
      [createOffer()],
    );

    assert.deepEqual(profiles[0]?.subjects, ["Cálculo Diferencial"]);
    assert.deepEqual(profiles[0]?.modes, ["online", "in-person"]);
    assert.equal(filterPublicTutorProfiles(profiles, "calculo", "all").length, 1);
    assert.equal(filterPublicTutorProfiles(profiles, "", "in-person").length, 1);
    assert.equal(filterPublicTutorProfiles(profiles, "", "hybrid").length, 0);
  });
});

describe("contacto externo", () => {
  it("traduce cada contacto soportado a una URL externa segura", () => {
    assert.equal(contactUrl("telegram", "@tutora_demo"), "https://t.me/tutora_demo");
    assert.equal(contactUrl("instagram", "@calpulli"), "https://www.instagram.com/calpulli");
    assert.equal(contactUrl("whatsapp", "+52 55 1234 5678"), "https://wa.me/525512345678");
    assert.equal(contactUrl("email", "demo@example.test"), "mailto:demo@example.test");
    assert.equal(contactUrl("phone", "+52 (55) 1234"), "tel:+52551234");
    assert.equal(contactUrl("other", "javascript:alert(1)"), null);
  });
});

function createEntrepreneur(): Entrepreneur {
  return {
    id: "entrepreneur-1",
    displayName: "Café Calpulli",
    category: "Alimentos",
    description: "Café universitario de demostración.",
    avatar: MEDIA,
    gallery: [MEDIA],
    externalContacts: [],
    isActive: true,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  };
}

function createProduct(): Product {
  return {
    id: "product-1",
    entrepreneurId: "entrepreneur-1",
    name: "Mezcla de café",
    description: "Notas de cacao.",
    priceLabel: "$85 MXN",
    category: "Bebidas",
    media: [MEDIA],
    isActive: true,
    createdAt: TIMESTAMP,
    updatedAt: "2026-08-10T13:00:00.000Z",
  };
}

function createPost(): EntrepreneurPost {
  return {
    id: "post-1",
    entrepreneurId: "entrepreneur-1",
    title: "Nueva preparación de café",
    body: "Una receta para la feria.",
    media: [MEDIA],
    publishedAt: "2026-08-10T14:00:00.000Z",
    isPublished: true,
    isHiddenByModerator: false,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  };
}

function createTutor(): Tutor {
  return {
    id: "tutor-1",
    displayName: "Ana Torres",
    description: "Acompañamiento con ejercicios.",
    avatar: MEDIA,
    modes: ["online"],
    externalContacts: [],
    isActive: true,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  };
}

function createOffer(): TutoringOffer {
  return {
    id: "offer-1",
    tutorId: "tutor-1",
    subject: "Cálculo Diferencial",
    modes: ["in-person"],
    availabilityLabel: "Dos tardes",
    isActive: true,
    createdAt: TIMESTAMP,
    updatedAt: TIMESTAMP,
  };
}

function contactUrl(
  type: ExternalContact["type"],
  value: string,
): string | null {
  return getExternalContactUrl({ id: `contact-${type}`, type, label: type, value });
}
