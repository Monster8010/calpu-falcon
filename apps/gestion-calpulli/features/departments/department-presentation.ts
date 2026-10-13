import type { Department, PostPriority } from "@calpulli/domain";
import { culturalColors, type BadgeTone } from "@calpulli/ui";

const ACCENTS = [
  "jade",
  "turquoise",
  "mayaBlue",
  "mexicanPink",
  "cempasuchil",
  "cochineal",
] as const;

type AccentName = (typeof ACCENTS)[number];

export function getDepartmentAccent(department: Department): string {
  const token = department.accentToken;
  return token !== undefined && (ACCENTS as readonly string[]).includes(token)
    ? culturalColors[token as AccentName]
    : culturalColors.jade;
}

export function getDepartmentMonogram(department: Department): string {
  return (department.shortName ?? department.name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toLocaleUpperCase("es-MX") ?? "")
    .join("");
}

export function getPriorityLabel(priority: PostPriority): string {
  return priority === "featured"
    ? "Destacada"
    : priority === "important"
      ? "Importante"
      : priority === "urgent"
        ? "Urgente"
        : "Normal";
}

export function getPriorityTone(priority: PostPriority): BadgeTone {
  return priority === "urgent"
    ? "danger"
    : priority === "important"
      ? "warning"
      : priority === "featured"
        ? "accent"
        : "neutral";
}

export function formatManagementDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
