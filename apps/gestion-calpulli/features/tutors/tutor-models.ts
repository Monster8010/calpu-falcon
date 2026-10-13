import type { Tutor, TutoringMode, TutoringOffer } from "@calpulli/domain";

export const TUTORING_MODE_LABELS: Readonly<Record<TutoringMode, string>> = {
  "in-person": "Presencial",
  online: "En línea",
  hybrid: "Híbrida",
};

export interface TutorMetrics {
  activeOffers: number;
  contacts: number;
  offers: number;
}

export function sortTutoringOffers(
  offers: readonly TutoringOffer[],
): TutoringOffer[] {
  return [...offers].sort((left, right) => {
    const activeDifference = Number(right.isActive) - Number(left.isActive);
    if (activeDifference !== 0) return activeDifference;
    const subjectDifference = left.subject.localeCompare(right.subject, "es-MX");
    if (subjectDifference !== 0) return subjectDifference;
    return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
  });
}

export function getTutorMetrics(
  tutor: Tutor,
  offers: readonly TutoringOffer[],
): TutorMetrics {
  return {
    offers: offers.length,
    activeOffers: offers.filter(({ isActive }) => isActive).length,
    contacts: tutor.externalContacts.length,
  };
}

export function getTutorMonogram(tutor: Pick<Tutor, "displayName">): string {
  return tutor.displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toLocaleUpperCase("es-MX") ?? "")
    .join("");
}
