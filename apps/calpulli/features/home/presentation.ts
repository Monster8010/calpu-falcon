import type {
  Department,
  ISODateTime,
  PostPriority,
} from "@calpulli/domain";
import { culturalColors, type BadgeTone } from "@calpulli/ui";

const CULTURAL_ACCENT_NAMES = [
  "jade",
  "turquoise",
  "mayaBlue",
  "mexicanPink",
  "cempasuchil",
  "cochineal",
] as const;

type CulturalAccentName = (typeof CULTURAL_ACCENT_NAMES)[number];

export interface PriorityPresentation {
  accent: string;
  badgeTone: BadgeTone;
  label?: string;
}

const PRIORITY_PRESENTATION: Readonly<
  Record<PostPriority, PriorityPresentation>
> = {
  normal: {
    accent: culturalColors.jade,
    badgeTone: "neutral",
  },
  featured: {
    accent: culturalColors.mexicanPink,
    badgeTone: "accent",
    label: "Destacada",
  },
  important: {
    accent: culturalColors.cempasuchil,
    badgeTone: "warning",
    label: "Importante",
  },
  urgent: {
    accent: culturalColors.cochineal,
    badgeTone: "danger",
    label: "Urgente",
  },
};

function isCulturalAccentName(value: string): value is CulturalAccentName {
  return (CULTURAL_ACCENT_NAMES as readonly string[]).includes(value);
}

export function getDepartmentAccent(department?: Department): string {
  const accentToken = department?.accentToken;

  return accentToken !== undefined && isCulturalAccentName(accentToken)
    ? culturalColors[accentToken]
    : culturalColors.jade;
}

export function getDepartmentMonogram(department?: Department): string {
  const source = department?.shortName ?? department?.name ?? "Calpulli";
  const words = source.trim().split(/\s+/).filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toLocaleUpperCase("es-MX") ?? "")
    .join("");
}

export function getPriorityPresentation(
  priority: PostPriority,
): PriorityPresentation {
  return PRIORITY_PRESENTATION[priority];
}

export function formatPublishedAt(value: ISODateTime): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
