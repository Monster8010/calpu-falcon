import type { Tutor, TutoringOffer } from "@calpulli/domain";
import type {
  UpdateTutorInput,
  UpdateTutoringOfferInput,
} from "@calpulli/repositories";

import {
  toCreateTutoringOfferInput,
  type TutoringOfferDraft,
} from "../features/tutors/tutor-form-models";
import { sortTutoringOffers } from "../features/tutors/tutor-models";
import { createManagementRepositories } from "./management-repositories";

export interface TutorWorkspace {
  offers: TutoringOffer[];
  tutor: Tutor;
}

export async function listDemoTutors(): Promise<Tutor[]> {
  const { tutors } = await createManagementRepositories();
  return (await tutors.list())
    .filter(({ isActive }) => isActive)
    .sort((left, right) => left.displayName.localeCompare(right.displayName, "es-MX"));
}

export async function loadTutorWorkspace(tutorId: string): Promise<TutorWorkspace> {
  const { tutors } = await createManagementRepositories();
  const [tutor, offers] = await Promise.all([
    tutors.getById(tutorId),
    tutors.listOffers(tutorId),
  ]);

  if (tutor === undefined) {
    throw new Error("El tutor seleccionado ya no existe.");
  }

  return { tutor, offers: sortTutoringOffers(offers) };
}

export async function updateTutorProfile(
  tutorId: string,
  patch: UpdateTutorInput,
): Promise<Tutor> {
  const { tutors } = await createManagementRepositories();
  return tutors.update(tutorId, patch);
}

export async function saveTutoringOffer(options: {
  current?: TutoringOffer;
  draft: TutoringOfferDraft;
  tutorId: string;
  updatePatch?: UpdateTutoringOfferInput;
}): Promise<TutoringOffer> {
  const { tutors } = await createManagementRepositories();
  if (options.current !== undefined) {
    if (options.updatePatch === undefined) {
      throw new Error("Faltan los cambios de la materia.");
    }
    return tutors.updateOffer(options.current.id, options.updatePatch);
  }
  return tutors.createOffer(
    toCreateTutoringOfferInput(options.draft, options.tutorId),
  );
}

export async function deleteTutoringOffer(offerId: string): Promise<void> {
  const { tutors } = await createManagementRepositories();
  await tutors.deleteOffer(offerId);
}
