import type {
  ExternalContact,
  ExternalContactType,
  MediaReference,
  Tutor,
  TutoringMode,
  TutoringOffer,
} from "@calpulli/domain";
import type {
  CreateTutoringOfferInput,
  UpdateTutorInput,
  UpdateTutoringOfferInput,
} from "@calpulli/repositories";

export const DEMO_TUTOR_AVATARS: readonly { key: string; label: string }[] = [
  { key: "tutors/avatar-codice", label: "Códice" },
  { key: "tutors/avatar-grafica", label: "Gráfica" },
  { key: "tutors/avatar-libro", label: "Libro" },
  { key: "tutors/avatar-luz", label: "Luz" },
];

export const TUTORING_MODE_OPTIONS: readonly {
  label: string;
  value: TutoringMode;
}[] = [
  { label: "Presencial", value: "in-person" },
  { label: "En línea", value: "online" },
  { label: "Híbrida", value: "hybrid" },
];

export const TUTOR_CONTACT_TYPE_OPTIONS: readonly {
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

export const SHARED_TUTOR_AVATAR_KEY = "__shared-tutor-avatar__";

export interface TutorContactDraft {
  id: string;
  label: string;
  type: ExternalContactType;
  value: string;
}

export interface TutorProfileDraft {
  avatarKey: string;
  contacts: TutorContactDraft[];
  description: string;
  displayName: string;
  modes: TutoringMode[];
  preservedAvatar?: MediaReference;
}

export interface TutoringOfferDraft {
  availabilityLabel: string;
  description: string;
  isActive: boolean;
  modes: TutoringMode[];
  subject: string;
}

export class TutorFormError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TutorFormError";
  }
}

function required(value: string, label: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new TutorFormError(`${label} es obligatorio.`);
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

function requiredModes(
  modes: readonly TutoringMode[],
  label: string,
): TutoringMode[] {
  const unique = [...new Set(modes)];
  if (unique.length === 0) {
    throw new TutorFormError(`Selecciona al menos una modalidad para ${label}.`);
  }
  return unique;
}

export function createTutorProfileDraft(tutor: Tutor): TutorProfileDraft {
  return {
    displayName: tutor.displayName,
    description: tutor.description,
    avatarKey: tutor.avatar.type === "bundled"
      ? tutor.avatar.key
      : SHARED_TUTOR_AVATAR_KEY,
    preservedAvatar: tutor.avatar.type === "shared" ? tutor.avatar : undefined,
    modes: [...tutor.modes],
    contacts: tutor.externalContacts.map((contact) => ({ ...contact })),
  };
}

export function createEmptyTutorContactDraft(id: string): TutorContactDraft {
  return { id, type: "telegram", label: "Telegram", value: "" };
}

export function toTutorProfilePatch(
  draft: TutorProfileDraft,
): UpdateTutorInput {
  const avatar = draft.avatarKey === SHARED_TUTOR_AVATAR_KEY
    ? draft.preservedAvatar
    : bundledMedia(required(draft.avatarKey, "El avatar"));

  if (avatar === undefined) {
    throw new TutorFormError("Selecciona un avatar.");
  }

  const contacts: ExternalContact[] = draft.contacts.map((contact, index) => ({
    id: required(contact.id, `El identificador del contacto ${index + 1}`),
    type: contact.type,
    label: required(contact.label, `La etiqueta del contacto ${index + 1}`),
    value: required(contact.value, `El valor del contacto ${index + 1}`),
  }));

  return {
    displayName: required(draft.displayName, "El nombre"),
    description: required(draft.description, "La descripción"),
    avatar,
    modes: requiredModes(draft.modes, "el perfil"),
    externalContacts: contacts,
  };
}

export function createEmptyTutoringOfferDraft(): TutoringOfferDraft {
  return {
    subject: "",
    description: "",
    modes: ["in-person"],
    availabilityLabel: "",
    isActive: true,
  };
}

export function createTutoringOfferDraft(
  offer: TutoringOffer,
): TutoringOfferDraft {
  return {
    subject: offer.subject,
    description: offer.description ?? "",
    modes: [...offer.modes],
    availabilityLabel: offer.availabilityLabel ?? "",
    isActive: offer.isActive,
  };
}

function offerEditableFields(
  draft: TutoringOfferDraft,
): Omit<TutoringOffer, "createdAt" | "id" | "tutorId" | "updatedAt"> {
  return {
    subject: required(draft.subject, "La materia"),
    description: optional(draft.description),
    modes: requiredModes(draft.modes, "la materia"),
    availabilityLabel: optional(draft.availabilityLabel),
    isActive: draft.isActive,
  };
}

export function toCreateTutoringOfferInput(
  draft: TutoringOfferDraft,
  tutorId: string,
): CreateTutoringOfferInput {
  return { ...offerEditableFields(draft), tutorId };
}

export function toUpdateTutoringOfferPatch(
  draft: TutoringOfferDraft,
): UpdateTutoringOfferInput {
  return offerEditableFields(draft);
}
