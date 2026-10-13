import type { ID, Tutor, TutoringOffer } from "@calpulli/domain";

import {
  createPublicTutorProfiles,
  type PublicTutorProfile,
} from "../features/tutoring/tutoring-selection";
import { createPublicRepositories } from "./public-repositories";

export interface PublicTutoringData {
  offers: TutoringOffer[];
  tutors: Tutor[];
}

export class PublicTutorNotFoundError extends Error {
  constructor(id: ID) {
    super(`No encontramos un perfil público de tutor con id ${id}.`);
    this.name = "PublicTutorNotFoundError";
  }
}

export async function loadPublicTutoringData(): Promise<PublicTutoringData> {
  const repositories = await createPublicRepositories();
  const [tutors, offers] = await Promise.all([
    repositories.tutors.listPublic(),
    repositories.tutors.listPublicOffers(),
  ]);

  return { tutors, offers };
}

export async function loadPublicTutorProfile(
  tutorId: ID,
): Promise<PublicTutorProfile> {
  const data = await loadPublicTutoringData();
  const profile = createPublicTutorProfiles(data.tutors, data.offers).find(
    ({ tutor }) => tutor.id === tutorId,
  );

  if (profile === undefined) {
    throw new PublicTutorNotFoundError(tutorId);
  }

  return profile;
}
