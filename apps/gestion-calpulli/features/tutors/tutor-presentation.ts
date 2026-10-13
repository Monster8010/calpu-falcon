import type { Tutor } from "@calpulli/domain";
import { culturalColors } from "@calpulli/ui";

const TUTOR_ACCENTS = [
  culturalColors.mayaBlue,
  culturalColors.turquoise,
  culturalColors.mexicanPink,
  culturalColors.cempasuchil,
] as const;

export function getManagementTutorAccent(
  tutor: Pick<Tutor, "id">,
): string {
  const hash = [...tutor.id].reduce(
    (total, character) => total + (character.codePointAt(0) ?? 0),
    0,
  );
  return TUTOR_ACCENTS[hash % TUTOR_ACCENTS.length] ?? culturalColors.mayaBlue;
}
