import type {
  Entrepreneur,
  EntrepreneurPost,
  ExternalContact,
  ExternalContactType,
  MediaReference,
  Product,
} from "@calpulli/domain";
import type {
  CreateEntrepreneurPostInput,
  CreateProductInput,
  UpdateEntrepreneurInput,
  UpdateEntrepreneurPostInput,
  UpdateProductInput,
} from "@calpulli/repositories";

export const DEMO_AVATARS: readonly { key: string; label: string }[] = [
  { key: "entrepreneurs/avatar-ajolote", label: "Ajolote" },
  { key: "entrepreneurs/avatar-colibri", label: "Colibrí" },
  { key: "entrepreneurs/avatar-maiz", label: "Maíz" },
  { key: "entrepreneurs/avatar-nopal", label: "Nopal" },
];

export const DEMO_GALLERY_MEDIA: readonly { key: string; label: string }[] = [
  { key: "entrepreneurs/gallery-taller", label: "Taller" },
  { key: "entrepreneurs/gallery-productos", label: "Productos" },
  { key: "entrepreneurs/gallery-equipo", label: "Equipo" },
  { key: "entrepreneurs/gallery-feria", label: "Feria" },
];

export const DEMO_POST_MEDIA: readonly { key: string; label: string }[] = [
  { key: "marketplace/post-novedad", label: "Novedad" },
  { key: "marketplace/post-proceso", label: "Proceso" },
  { key: "marketplace/post-comunidad", label: "Comunidad" },
];

export const DEMO_PRODUCT_MEDIA: readonly { key: string; label: string }[] = [
  { key: "marketplace/producto-jade", label: "Jade" },
  { key: "marketplace/producto-cempasuchil", label: "Cempasúchil" },
  { key: "marketplace/producto-turquesa", label: "Turquesa" },
];

export const CONTACT_TYPE_OPTIONS: readonly {
  label: string;
  value: ExternalContactType;
}[] = [
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Telegram", value: "telegram" },
  { label: "Correo", value: "email" },
  { label: "Instagram", value: "instagram" },
  { label: "Teléfono", value: "phone" },
  { label: "Otro", value: "other" },
];

export const SHARED_AVATAR_KEY = "__shared-avatar__";

export interface EntrepreneurContactDraft {
  id: string;
  label: string;
  type: ExternalContactType;
  value: string;
}

export interface EntrepreneurProfileDraft {
  avatarKey: string;
  category: string;
  contacts: EntrepreneurContactDraft[];
  description: string;
  displayName: string;
  galleryKeys: string[];
  preservedAvatar?: MediaReference;
  preservedGallery: MediaReference[];
}

export interface EntrepreneurPostDraft {
  body: string;
  mediaKeys: string[];
  preservedMedia: MediaReference[];
  title: string;
}

export interface ProductDraft {
  category: string;
  description: string;
  isActive: boolean;
  mediaKeys: string[];
  name: string;
  preservedMedia: MediaReference[];
  priceLabel: string;
}

export class EntrepreneurFormError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EntrepreneurFormError";
  }
}

function required(value: string, label: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new EntrepreneurFormError(`${label} es obligatorio.`);
  }
  return normalized;
}

function optional(value: string): string | undefined {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function bundledMedia(key: string): MediaReference {
  return { type: "bundled", key };
}

function editableMedia(
  preserved: readonly MediaReference[],
  keys: readonly string[],
): MediaReference[] {
  return [
    ...preserved.filter(({ type }) => type === "shared"),
    ...keys.map(bundledMedia),
  ];
}

export function createEntrepreneurProfileDraft(
  entrepreneur: Entrepreneur,
): EntrepreneurProfileDraft {
  const bundledAvatar = entrepreneur.avatar.type === "bundled"
    ? entrepreneur.avatar.key
    : SHARED_AVATAR_KEY;

  return {
    displayName: entrepreneur.displayName,
    category: entrepreneur.category,
    description: entrepreneur.description,
    avatarKey: bundledAvatar,
    preservedAvatar: entrepreneur.avatar.type === "shared"
      ? entrepreneur.avatar
      : undefined,
    galleryKeys: entrepreneur.gallery
      .filter((media): media is Extract<MediaReference, { type: "bundled" }> => media.type === "bundled")
      .map(({ key }) => key),
    preservedGallery: entrepreneur.gallery.filter(({ type }) => type === "shared"),
    contacts: entrepreneur.externalContacts.map((contact) => ({ ...contact })),
  };
}

export function createEmptyContactDraft(id: string): EntrepreneurContactDraft {
  return { id, type: "whatsapp", label: "WhatsApp", value: "" };
}

export function toEntrepreneurProfilePatch(
  draft: EntrepreneurProfileDraft,
): UpdateEntrepreneurInput {
  const contacts: ExternalContact[] = draft.contacts.map((contact, index) => ({
    id: required(contact.id, `El identificador del contacto ${index + 1}`),
    type: contact.type,
    label: required(contact.label, `La etiqueta del contacto ${index + 1}`),
    value: required(contact.value, `El valor del contacto ${index + 1}`),
  }));
  const avatar = draft.avatarKey === SHARED_AVATAR_KEY
    ? draft.preservedAvatar
    : bundledMedia(required(draft.avatarKey, "El avatar"));

  if (avatar === undefined) {
    throw new EntrepreneurFormError("Selecciona un avatar o sticker.");
  }

  return {
    displayName: required(draft.displayName, "El nombre"),
    category: required(draft.category, "La categoría"),
    description: required(draft.description, "La descripción"),
    avatar,
    gallery: editableMedia(draft.preservedGallery, draft.galleryKeys),
    externalContacts: contacts,
  };
}

export function createEmptyEntrepreneurPostDraft(): EntrepreneurPostDraft {
  return { title: "", body: "", mediaKeys: [], preservedMedia: [] };
}

export function createEntrepreneurPostDraft(
  post: EntrepreneurPost,
): EntrepreneurPostDraft {
  return {
    title: post.title,
    body: post.body,
    mediaKeys: post.media
      .filter((media): media is Extract<MediaReference, { type: "bundled" }> => media.type === "bundled")
      .map(({ key }) => key),
    preservedMedia: post.media.filter(({ type }) => type === "shared"),
  };
}

function postEditableFields(
  draft: EntrepreneurPostDraft,
): Pick<EntrepreneurPost, "body" | "media" | "title"> {
  return {
    title: required(draft.title, "El título"),
    body: required(draft.body, "El contenido"),
    media: editableMedia(draft.preservedMedia, draft.mediaKeys),
  };
}

export function toCreateEntrepreneurPostInput(
  draft: EntrepreneurPostDraft,
  entrepreneurId: string,
  isPublished: boolean,
  now: string,
): CreateEntrepreneurPostInput {
  return {
    ...postEditableFields(draft),
    entrepreneurId,
    publishedAt: now,
    isPublished,
    isHiddenByModerator: false,
  };
}

export function toUpdateEntrepreneurPostPatch(
  draft: EntrepreneurPostDraft,
  current: EntrepreneurPost,
  isPublished: boolean,
  now: string,
): UpdateEntrepreneurPostInput {
  return {
    ...postEditableFields(draft),
    isPublished,
    publishedAt: isPublished && !current.isPublished ? now : current.publishedAt,
  };
}

export function createEmptyProductDraft(): ProductDraft {
  return {
    name: "",
    description: "",
    priceLabel: "",
    category: "",
    mediaKeys: [],
    preservedMedia: [],
    isActive: true,
  };
}

export function createProductDraft(product: Product): ProductDraft {
  return {
    name: product.name,
    description: product.description ?? "",
    priceLabel: product.priceLabel ?? "",
    category: product.category,
    mediaKeys: product.media
      .filter((media): media is Extract<MediaReference, { type: "bundled" }> => media.type === "bundled")
      .map(({ key }) => key),
    preservedMedia: product.media.filter(({ type }) => type === "shared"),
    isActive: product.isActive,
  };
}

function productEditableFields(
  draft: ProductDraft,
): Omit<Product, "createdAt" | "entrepreneurId" | "id" | "updatedAt"> {
  return {
    name: required(draft.name, "El nombre"),
    description: optional(draft.description),
    priceLabel: optional(draft.priceLabel),
    category: required(draft.category, "La categoría"),
    media: editableMedia(draft.preservedMedia, draft.mediaKeys),
    isActive: draft.isActive,
  };
}

export function toCreateProductInput(
  draft: ProductDraft,
  entrepreneurId: string,
): CreateProductInput {
  return { ...productEditableFields(draft), entrepreneurId };
}

export function toUpdateProductPatch(draft: ProductDraft): UpdateProductInput {
  return productEditableFields(draft);
}
