import type {
  Tutor,
  TutoringMode,
  TutoringOffer,
} from "@calpulli/domain";

import { matchesLocalSearch } from "../shell/local-search";

export interface PublicTutorProfile {
  modes: TutoringMode[];
  offers: TutoringOffer[];
  subjects: string[];
  tutor: Tutor;
}

export type TutoringModeFilter = "all" | TutoringMode;

export function createPublicTutorProfiles(
  tutors: readonly Tutor[],
  offers: readonly TutoringOffer[],
): PublicTutorProfile[] {
  const offersByTutor = new Map<string, TutoringOffer[]>();

  for (const offer of offers) {
    const current = offersByTutor.get(offer.tutorId) ?? [];
    current.push(offer);
    offersByTutor.set(offer.tutorId, current);
  }

  return tutors
    .map((tutor) => {
      const tutorOffers = [...(offersByTutor.get(tutor.id) ?? [])].sort(
        (left, right) =>
          left.subject.localeCompare(right.subject, "es-MX") ||
          (left.id < right.id ? -1 : left.id > right.id ? 1 : 0),
      );

      return {
        tutor,
        offers: tutorOffers,
        subjects: [...new Set(tutorOffers.map(({ subject }) => subject))],
        modes: [...new Set([
          ...tutor.modes,
          ...tutorOffers.flatMap(({ modes }) => modes),
        ])],
      };
    })
    .sort(
      (left, right) =>
        left.tutor.displayName.localeCompare(right.tutor.displayName, "es-MX") ||
        (left.tutor.id < right.tutor.id ? -1 : left.tutor.id > right.tutor.id ? 1 : 0),
    );
}

export function filterPublicTutorProfiles(
  profiles: readonly PublicTutorProfile[],
  query: string,
  mode: TutoringModeFilter,
): PublicTutorProfile[] {
  return profiles.filter(
    (profile) =>
      (mode === "all" || profile.modes.includes(mode)) &&
      matchesLocalSearch(query, [
        profile.tutor.displayName,
        profile.tutor.description,
        ...profile.subjects,
      ]),
  );
}

export const TUTORING_MODE_LABELS: Readonly<Record<TutoringMode, string>> = {
  "in-person": "Presencial",
  online: "En línea",
  hybrid: "Híbrida",
};
