import {
  compareISODateTimesDescending,
  type Department,
  type Entrepreneur,
  type EntrepreneurPost,
  type InstitutionalPost,
  type ISODateTime,
} from "@calpulli/domain";

export type ModerationContentKind =
  | "institutional-post"
  | "entrepreneur-post";

export type ModerationStatus =
  | "public"
  | "hidden"
  | "unpublished"
  | "owner-inactive";

export type ModerationFilter = "all" | ModerationStatus;

export interface ModerationListItem {
  body: string;
  id: string;
  isHiddenByModerator: boolean;
  isPublished: boolean;
  kind: ModerationContentKind;
  mediaCount: number;
  ownerId: string;
  ownerIsActive: boolean;
  ownerLabel: string;
  publishedAt: ISODateTime;
  status: ModerationStatus;
  title: string;
  updatedAt: ISODateTime;
}

export interface ModerationMetrics {
  entrepreneurPosts: number;
  hidden: number;
  institutionalPosts: number;
  ownerInactive: number;
  public: number;
  total: number;
  unpublished: number;
}

export const MODERATION_FILTER_OPTIONS: readonly {
  label: string;
  value: ModerationFilter;
}[] = [
  { label: "Todo", value: "all" },
  { label: "Públicas", value: "public" },
  { label: "Ocultas", value: "hidden" },
  { label: "No publicadas", value: "unpublished" },
  { label: "Propietario inactivo", value: "owner-inactive" },
];

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function getModerationStatus(options: {
  isHiddenByModerator: boolean;
  isPublished: boolean;
  ownerIsActive: boolean;
}): ModerationStatus {
  if (options.isHiddenByModerator) return "hidden";
  if (!options.isPublished) return "unpublished";
  if (!options.ownerIsActive) return "owner-inactive";
  return "public";
}

export function getModerationStatusLabel(status: ModerationStatus): string {
  if (status === "hidden") return "Oculta por moderación";
  if (status === "unpublished") return "No publicada";
  if (status === "owner-inactive") return "Propietario inactivo";
  return "Pública";
}

export function getModerationKindLabel(kind: ModerationContentKind): string {
  return kind === "institutional-post"
    ? "Publicación institucional"
    : "Publicación de emprendimiento";
}

export function sortModerationItems(
  items: readonly ModerationListItem[],
): ModerationListItem[] {
  return [...items].sort((left, right) =>
    compareISODateTimesDescending(left.updatedAt, right.updatedAt) ||
    compareIds(left.id, right.id),
  );
}

export function composeModerationItems(options: {
  departments: readonly Department[];
  entrepreneurs: readonly Entrepreneur[];
  entrepreneurPosts: readonly EntrepreneurPost[];
  institutionalPosts: readonly InstitutionalPost[];
}): ModerationListItem[] {
  const departments = new Map(
    options.departments.map((department) => [department.id, department]),
  );
  const entrepreneurs = new Map(
    options.entrepreneurs.map((entrepreneur) => [entrepreneur.id, entrepreneur]),
  );

  const institutionalItems = options.institutionalPosts.map((post) => {
    const department = departments.get(post.departmentId);
    const ownerIsActive = department?.isActive === true;
    return {
      body: post.body,
      id: post.id,
      isHiddenByModerator: post.isHiddenByModerator,
      isPublished: post.isPublished,
      kind: "institutional-post" as const,
      mediaCount: post.media.length + (post.document ? 1 : 0),
      ownerId: post.departmentId,
      ownerIsActive,
      ownerLabel: department?.name ?? "Departamento no disponible",
      publishedAt: post.publishedAt,
      status: getModerationStatus({
        isHiddenByModerator: post.isHiddenByModerator,
        isPublished: post.isPublished,
        ownerIsActive,
      }),
      title: post.title,
      updatedAt: post.updatedAt,
    } satisfies ModerationListItem;
  });

  const entrepreneurItems = options.entrepreneurPosts.map((post) => {
    const entrepreneur = entrepreneurs.get(post.entrepreneurId);
    const ownerIsActive = entrepreneur?.isActive === true;
    return {
      body: post.body,
      id: post.id,
      isHiddenByModerator: post.isHiddenByModerator,
      isPublished: post.isPublished,
      kind: "entrepreneur-post" as const,
      mediaCount: post.media.length,
      ownerId: post.entrepreneurId,
      ownerIsActive,
      ownerLabel: entrepreneur?.displayName ?? "Emprendimiento no disponible",
      publishedAt: post.publishedAt,
      status: getModerationStatus({
        isHiddenByModerator: post.isHiddenByModerator,
        isPublished: post.isPublished,
        ownerIsActive,
      }),
      title: post.title,
      updatedAt: post.updatedAt,
    } satisfies ModerationListItem;
  });

  return sortModerationItems([...institutionalItems, ...entrepreneurItems]);
}

export function filterModerationItems(
  items: readonly ModerationListItem[],
  filter: ModerationFilter,
): ModerationListItem[] {
  return filter === "all"
    ? [...items]
    : items.filter(({ status }) => status === filter);
}

export function getModerationMetrics(
  items: readonly ModerationListItem[],
): ModerationMetrics {
  return {
    entrepreneurPosts: items.filter(
      ({ kind }) => kind === "entrepreneur-post",
    ).length,
    hidden: items.filter(({ status }) => status === "hidden").length,
    institutionalPosts: items.filter(
      ({ kind }) => kind === "institutional-post",
    ).length,
    ownerInactive: items.filter(
      ({ status }) => status === "owner-inactive",
    ).length,
    public: items.filter(({ status }) => status === "public").length,
    total: items.length,
    unpublished: items.filter(
      ({ status }) => status === "unpublished",
    ).length,
  };
}
