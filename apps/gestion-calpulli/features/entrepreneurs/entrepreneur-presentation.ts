import type { Entrepreneur, StandRequestStatus } from "@calpulli/domain";
import { culturalColors, type BadgeTone } from "@calpulli/ui";

export const REQUEST_PRESENTATION: Readonly<
  Record<StandRequestStatus, { label: string; tone: BadgeTone }>
> = {
  pending: { label: "Pendiente de aprobación", tone: "warning" },
  approved: { label: "Aprobada", tone: "success" },
  rejected: { label: "Rechazada", tone: "danger" },
  cancelled: { label: "Cancelada", tone: "neutral" },
};

const ENTREPRENEUR_ACCENTS = [
  culturalColors.jade,
  culturalColors.turquoise,
  culturalColors.mayaBlue,
  culturalColors.mexicanPink,
  culturalColors.cempasuchil,
  culturalColors.cochineal,
] as const;

export function getEntrepreneurAccent(
  entrepreneur: Pick<Entrepreneur, "id">,
): string {
  const hash = [...entrepreneur.id].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
  return ENTREPRENEUR_ACCENTS[hash % ENTREPRENEUR_ACCENTS.length];
}
